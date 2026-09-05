import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { ChatService } from "../../domain/chat.service";
import { ChatController } from "../../domain/chat.controller";
import { handleAIError } from "../../../../utils/llm/ai-error";

export function defineChatRoutes(expressApp: Application) {
  const chatRouter = Router();
  const chatService = new ChatService();
  const chatController = new ChatController(chatService);

  chatRouter.post("/", chatController.getResponseFromLLM);
  chatRouter.use(handleAIError);
  // chatRouter.post("/generate-report", chatController.generateExpenseReport);
  // chatRouter.post("/parse-transaction", chatController.parseTransaction);

  expressApp.use("/v1/chat", authenticateUser, chatRouter);
}
