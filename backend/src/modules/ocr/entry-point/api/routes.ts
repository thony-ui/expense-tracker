import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { OCRController } from "../../domain/ocr.controller";
import { OCRService } from "../../domain/ocr.service";
import { TransactionService } from "../../../transaction/domain/transaction.service";
import { TransactionRepository } from "../../../transaction/domain/transaction.repository";
import { BudgetRepository } from "../../../budget/domain/budget.repository";

export function defineOCRRoutes(expressApp: Application) {
  const ocrRouter = Router();

  const ocrService = new OCRService();
  const transactionRepository = new TransactionRepository();
  const budgetRepository = new BudgetRepository();
  const ocrController = new OCRController(
    ocrService,
    transactionRepository,
    budgetRepository,
  );

  ocrRouter.post("/", ocrController.postOCR);

  expressApp.use("/v1/ocr", authenticateUser, ocrRouter);
}
