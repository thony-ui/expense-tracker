import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { ExpenseRepository } from "../../domain/expense.repository";
import { ExpenseService } from "../../domain/expense.service";
import { ExpenseController } from "../../domain/expense.controller";

export function defineExpenseRoutes(expressApp: Application) {
  const expenseRouter = Router();
  const expenseRepository = new ExpenseRepository();
  const expenseService = new ExpenseService(expenseRepository);
  const expenseController = new ExpenseController(expenseService);

  expenseRouter.post("/", expenseController.postExpense);

  expressApp.use("/v1/expenses", authenticateUser, expenseRouter);
}
