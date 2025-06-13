import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import { IExpense, IExpenseService } from "./expense.interface";

export class ExpenseRepository implements IExpenseService {
  addExpenseToDatabase = async ({
    userId,
    type,
    amount,
    name,
    description,
    category,
    date,
  }: IExpense) => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([{ type, amount, name, description, category, date, userId }]);
    if (error) {
      logger.error(`ExpenseRepository: addExpenseToDatabase error: ${error}`);
      throw new Error("Error adding expense to database");
    }
    logger.info(`ExpenseRepository: addExpenseToDatabase success: ${data}`);
  };
}
