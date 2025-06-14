import { NextFunction, Request, Response } from "express";
import { ExpenseService } from "./expense.service";
import logger from "../../../logger";
import { validateGetExpenses, validatePostExpense } from "./expense.validator";

export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  postExpense = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      const {
        type,
        amount,
        name,
        description,
        category,
        date,
        userId: id,
      } = validatePostExpense({
        ...req.body,
        userId,
      });
      logger.info(
        `ExpenseController: postExpense called with type: ${type}, amount: ${amount}, name: ${name}, description: ${description}, category: ${category}, date: ${date}, userId: ${userId}`
      );
      await this.expenseService.addExpenseToDatabase({
        userId: id,
        type,
        amount,
        name,
        description,
        category,
        date,
      });
      res.status(201).send({ message: "Expense added successfully" });
    } catch (error) {
      next(error);
    }
  };
  getExpenses = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionType } = req.query;
    try {
      const { userId: id, transactionType: type } = validateGetExpenses({
        userId,
        transactionType,
      });
      logger.info(
        `ExpenseController: getExpenses called for userId: ${userId} and transactionType: ${type}`
      );
      const expenses = await this.expenseService.getExpensesFromDatabase(
        id,
        type
      );
      res.status(200).send(expenses);
    } catch (error) {
      next(error);
    }
  };
}
