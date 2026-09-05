import { ChatService } from "./chat.service";

import { NextFunction, Request, Response } from "express";
import { validateGetPrompt } from "./chat.validator";
import { once } from "node:events";
import logger from "../../../logger";

export class ChatController {
  constructor(private chatService: ChatService) {}

  getResponseFromLLM = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const userId = req.user.id;
    const abortController = new AbortController();
    const stop = () => { if (!res.writableEnded) abortController.abort(); };
    res.once("close", stop);
    // Old deployed clients still expect plain text. New clients explicitly opt in
    // to framed events so they can distinguish completion from an interrupted stream.
    const eventStream = req.get("accept")?.includes("text/event-stream") === true;
    const write = async (value: string) => {
      if (!res.write(value)) await once(res, "drain", { signal: abortController.signal });
    };
    try {
      const { prompt } = validateGetPrompt(req.body);
      const response = await this.chatService.getResponseFromLLM(
        prompt,
        userId,
        abortController.signal,
      );
      if (!response) {
        throw new Error("No response stream from LLM");
      }
      // Wait for the provider to accept the request before committing HTTP 200.
      res.writeHead(200, {
        "Content-Type": eventStream ? "text/event-stream; charset=utf-8" : "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      });
      res.flushHeaders();
      let hasContent = false;
      for await (const chunk of response) {
        const text = chunk.choices?.[0]?.delta?.content;
        if (!text) continue;
        hasContent = true;
        await write(eventStream ? `data: ${JSON.stringify({ type: "delta", text })}\n\n` : text);
      }
      if (!hasContent) throw new Error("The AI service returned no text.");
      if (eventStream) await write('data: {"type":"done"}\n\n');
      res.end();
    } catch (error) {
      if (abortController.signal.aborted || res.destroyed) return;
      if (!res.headersSent) {
        next(error);
      } else if (eventStream) {
        res.end(`data: ${JSON.stringify({ type: "error", message: "The AI response was interrupted. Please try again." })}\n\n`);
      } else {
        res.destroy();
      }
    } finally {
      res.off("close", stop);
      abortController.abort();
    }
  };
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
        `attachment; filename="expense_report_${req.params.userId}.pdf"`,
      );

      res.send(pdfBuffer);
    } catch (error) {
      logger.error(
        `ChatController: Error generating expense report for userId ${userId}`,
      );
      next(error);
    }
  };
}
