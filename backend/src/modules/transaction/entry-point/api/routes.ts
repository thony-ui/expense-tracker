import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { TransactionRepository } from "../../domain/transaction.repository";
import { TransactionController } from "../../domain/transaction.controller";
import { TransactionService } from "../../domain/transaction.service";

export function defineTransactionRoutes(expressApp: Application) {
  const transactionRouter = Router();
  const transactionRepository = new TransactionRepository();
  const transactionService = new TransactionService(transactionRepository);
  const transactionController = new TransactionController(transactionService);

  transactionRouter.post("/", transactionController.postTransaction);
  transactionRouter.get("/", transactionController.getTransactions);
  transactionRouter.get("/yearly", transactionController.getYearlyTransactions);
  transactionRouter.get(
    "/monthly",
    transactionController.getMonthlyTransactions
  );
  transactionRouter.get("/weekly", transactionController.getWeeklyTransactions);
  transactionRouter.get("/daily", transactionController.getDailyTransactions);

  transactionRouter.delete(
    "/:transactionId",
    transactionController.deleteTransaction
  );
  transactionRouter.put(
    "/:transactionId",
    transactionController.updateTransaction
  );
  transactionRouter.get(
    "/:transactionId",
    transactionController.getTransactionById
  );

  expressApp.use("/v1/transactions", authenticateUser, transactionRouter);
}
