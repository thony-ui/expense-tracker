import { ChatService } from "./chat.service";

import { NextFunction, Request, Response } from "express";
import { validateGetPrompt } from "./chat.validator";
import { once } from "node:events";
import logger from "../../../logger";

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  getResponseFromLLM = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user.id;
    const abortController = new AbortController();

    const stop = () => {
      if (!res.writableEnded) {
        abortController.abort();
      }
    };

    // Detect the client disappearing.
    req.once("aborted", stop);
    res.once("close", stop);

    const eventStream =
      req.get("accept")?.includes("text/event-stream") === true;

    const write = async (value: string) => {
      if (abortController.signal.aborted || res.writableEnded) {
        return;
      }

      if (!res.write(value)) {
        await once(res, "drain", {
          signal: abortController.signal,
        });
      }
    };

    try {
      const { prompt } = validateGetPrompt(req.body);

      /*
       * Important:
       *
       * At this point the provider has already accepted the request.
       *
       * generateResponseStream() calls:
       *
       *   fetch(SOCLAAS /chat/completions)
       *
       * and throws if SoCLaaS returns a non-2xx status.
       */
      const responseStream = await this.chatService.getResponseFromLLM(
        prompt,
        userId,
        abortController.signal,
      );

      res.writeHead(200, {
        "Content-Type": eventStream
          ? "text/event-stream; charset=utf-8"
          : "text/plain; charset=utf-8",

        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      });

      res.flushHeaders();

      let hasContent = false;

      for await (const text of this.readProviderStream(responseStream)) {
        if (!text) continue;

        hasContent = true;

        if (eventStream) {
          await write(
            `data: ${JSON.stringify({
              type: "delta",
              text,
            })}\n\n`,
          );
        } else {
          await write(text);
        }
      }

      if (!hasContent) {
        throw new Error("The AI service returned no text.");
      }

      if (eventStream) {
        await write(
          `data: ${JSON.stringify({
            type: "done",
          })}\n\n`,
        );
      }

      res.end();
    } catch (error) {
      if (abortController.signal.aborted || req.destroyed || res.destroyed) {
        return;
      }

      logger.error(
        `ChatController: Chat request failed for userId ${userId}`,
        error,
      );

      /*
       * Headers have not been sent yet:
       * let the normal Express error middleware handle it.
       */
      if (!res.headersSent) {
        return next(error);
      }

      /*
       * Streaming already started, so HTTP status can no longer
       * be changed. Send an SSE error event instead.
       */
      if (eventStream) {
        res.end(
          `data: ${JSON.stringify({
            type: "error",
            message: "The AI response was interrupted. Please try again.",
          })}\n\n`,
        );

        return;
      }

      /*
       * Legacy plain-text client:
       * there is no framing protocol for communicating an error
       * after the stream has already started.
       */
      res.destroy();
    } finally {
      req.off("aborted", stop);
      res.off("close", stop);

      if (!abortController.signal.aborted) {
        abortController.abort();
      }
    }
  };

  /**
   * Converts the raw byte stream returned by SoCLaaS into text tokens.
   *
   * SoCLaaS sends streaming responses over SSE. Network chunks do NOT
   * necessarily correspond 1-to-1 with SSE events, so we maintain a
   * buffer and split on blank lines.
   *
   * Expected events are similar to:
   *
   * data: {"choices":[{"delta":{"content":"Hello"}}]}
   *
   * data: {"choices":[{"delta":{"content":" world"}}]}
   *
   * data: [DONE]
   */
  private async *readProviderStream(
    stream: ReadableStream<Uint8Array>,
  ): AsyncGenerator<string> {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          buffer += decoder.decode();
          break;
        }

        buffer += decoder.decode(value, {
          stream: true,
        });

        /*
         * SSE events are separated by a blank line.
         *
         * Handle both:
         *   \n\n
         * and
         *   \r\n\r\n
         */
        const events = buffer.split(/\r?\n\r?\n/);

        // Last entry may only be half an event.
        buffer = events.pop() ?? "";

        for (const event of events) {
          const text = this.parseProviderEvent(event);

          if (text !== null) {
            yield text;
          }
        }
      }

      /*
       * Process a final event if the provider closed the connection
       * without a trailing blank line.
       */
      if (buffer.trim()) {
        const text = this.parseProviderEvent(buffer);

        if (text !== null) {
          yield text;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Parse one SSE event from SoCLaaS.
   */
  private parseProviderEvent(event: string): string | null {
    const data = event
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    if (!data || data === "[DONE]") {
      return null;
    }

    try {
      const parsed = JSON.parse(data);

      /*
       * Expected streaming response:
       *
       * {
       *   choices: [
       *     {
       *       delta: {
       *         content: "hello"
       *       }
       *     }
       *   ]
       * }
       */
      const content = parsed?.choices?.[0]?.delta?.content;

      return typeof content === "string" ? content : null;
    } catch (error) {
      logger.warn(
        `ChatController: Unable to parse SoCLaaS stream event: ${data}`,
      );

      return null;
    }
  }

  generateExpenseReport = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    try {
      logger.info(
        `ChatController: generateExpenseReport called for userId: ${userId}`,
      );

      const htmlReport = await this.chatService.generateExpenseReport(
        userId,
        startDate,
        endDate,
      );

      const pdfBuffer = await this.chatService.generatePDFReport(
        htmlReport,
        userId,
      );

      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="expense_report_${userId}.pdf"`,
      );

      res.send(pdfBuffer);
    } catch (error) {
      logger.error(
        `ChatController: Error generating expense report for userId ${userId}`,
        error,
      );

      next(error);
    }
  };
}
