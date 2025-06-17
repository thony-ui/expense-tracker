import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { ChatService } from "../../domain/chat.service";
import { ChatController } from "../../domain/chat.controller";

export function defineChatRoutes(expressApp: Application) {
  const chatRouter = Router();
  const chatService = new ChatService();
  const chatController = new ChatController(chatService);
  chatRouter.post("/", chatController.getResponseFromLLM);
  chatRouter.post("/generate-report", chatController.generateExpenseReport);

  expressApp.use("/v1/chat", authenticateUser, chatRouter);
}
