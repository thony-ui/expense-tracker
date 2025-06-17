import { ChatService } from "./chat.service";

import { NextFunction, Request, Response } from "express";
import { validateGetPrompt } from "./chat.validator";
import { sendChunkToClient } from "../../../utils/send-chunk";
import logger from "../../../logger";

export class ChatController {
  constructor(private chatService: ChatService) {}

  getResponseFromLLM = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    try {
      const { prompt } = validateGetPrompt(req.body);
      logger.info(
        `ChatController: getResponseFromLLM called with prompt: ${prompt}`
      );
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });
      const $stream = await this.chatService.getResponseFromLLM(prompt, userId);
      if (!$stream) {
        throw new Error("No response stream from LLM");
      }
      logger.info(
        `ChatController: Successfully received response stream for prompt: ${prompt}`
      );
      await sendChunkToClient($stream, res);
      res.end();
    } catch (error) {
      next(error);
    }
  };
  generateExpenseReport = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userId = req.user.id;
    try {
      logger.info(
        `ChatController: generateExpenseReport called for userId: ${userId}`
      );
      const htmlReport = await this.chatService.generateExpenseReport(userId);
      const pdfBuffer = await this.chatService.generatePDFReport(
        htmlReport,
        userId
      );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="expense_report_${req.params.userId}.pdf"`
      );

      res.send(pdfBuffer);
    } catch (error) {
      logger.error(
        `ChatController: Error generating expense report for userId ${userId}`
      );
      next(error);
    }
  };
}
