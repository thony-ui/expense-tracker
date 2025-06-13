import logger from "../../../logger";
import { IExpense, IExpenseService } from "./expense.interface";
import { ExpenseRepository } from "./expense.repository";

export class ExpenseService implements IExpenseService {
  constructor(private expenseRepository: ExpenseRepository) {}
  addExpenseToDatabase = async ({
    userId,
    type,
    amount,
    name,
    description,
    category,
    date,
  }: IExpense) => {
    logger.info(
      `ExpenseService: addExpenseToDatabase called with type: ${type}, amount: ${amount}, name: ${name}, description: ${description}, category: ${category}, date: ${date}, userId: ${userId}`
    );
    await this.expenseRepository.addExpenseToDatabase({
      userId,
      type,
      amount,
      name,
      description,
      category,
      date,
    });
  };
}
