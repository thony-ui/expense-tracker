import { NextFunction, Request, Response } from "express";
import { ExpenseService } from "./expense.service";
import logger from "../../../logger";
import { validatePostExpense } from "./expense.validator";

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
}
