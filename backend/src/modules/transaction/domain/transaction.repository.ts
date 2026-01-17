import {
  addRowToGoogleSheet,
  deleteRowFromGoogleSheet,
  updateGoogleSheetRowByTransactionId,
} from "../../../lib/google-sheets";
import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import {
  formatDate,
  getCurrentWeekStart,
  getDateBasedOnCategoryType,
} from "../../../utils/formate-date";
import { ITransaction, ITransactionService } from "./transaction.interface";

type TTransactionWithUser = ITransaction & {
  id: string;
  users?: {
    name: string;
  };
};

export class TransactionRepository implements ITransactionService {
  addTransactionToDatabase = async ({
    userId,
    type,
    amount,
    name,
    description,
    category,
    date,
    base_currency,
    converted_currency = "Singapore Dollar",
    base_amount,
    converted_amount,
    exchange_rate,
    savingsGoalId,
    budgetId,
  }: ITransaction) => {
    console.log(savingsGoalId);
    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          type,
          amount,
          name,
          description,
          category,
          date,
          userId,
          base_currency,
          converted_currency,
          base_amount,
          converted_amount,
          exchange_rate,
          savingsGoalId,
          budgetId,
        },
      ])
      .select("*, users(name)");
    if (error) {
      logger.error(
        `TransactionRepository: addTransactionToDatabase error: ${error}`
      );
      throw new Error("Error adding expense to database");
    }
    const insertedTransaction = data?.[0]; // Get the inserted row
    const transactionId = insertedTransaction?.id; // This is the UUID or auto-ID

    await addRowToGoogleSheet({
      transactionId,
      userId,
      username: insertedTransaction?.users?.name || "Unknown User",
      type,
      amount,
      name,
      description,
      category,
      date,
      base_currency,
      converted_currency,
      base_amount,
      converted_amount,
      exchange_rate,
      savingsGoalId,
      budgetId,
    });
    logger.info(
      `TransactionRepository: addTransactionToDatabase success: ${data}`
    );
  };

  getTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string,
    limit?: number,
    offSet?: number,
    categoryType?: string,
    dateToFilter?: string
  ) => {
    let query = supabase
      .from("transactions")
      .select(
        "type, amount, name, description, category, date, id, base_currency, converted_currency, base_amount, converted_amount, exchange_rate, savings_goals(id, title), savingsGoalId"
      )
      .eq("userId", userId);

    // Add conditional filter for transactionType
    if (transactionType) {
      query = query.eq("type", transactionType);
    }

    if (typeof limit === "number" && typeof offSet === "number") {
      query = query.range(offSet, offSet + limit - 1);
    } else if (typeof limit === "number") {
      query = query.limit(limit);
    }

    if (categoryType && dateToFilter) {
      const { startDate, endDate } = getDateBasedOnCategoryType(
        categoryType,
        dateToFilter
      );
      query = query.gte("date", startDate).lte("date", endDate);
    }

    const { data, error } = await query.order("date", { ascending: false });

    if (error) {
      logger.error(`TransactionRepository: getTransactions error: ${error}`);
      throw new Error("Error fetching Transactions from database");
    }

    logger.info(`TransactionRepository: getTransactions success: ${data}`);
    return data;
  };

  deleteTransactionFromDatabase = async (
    transactionId: string,
    userId: string
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("userId", userId);

    if (error) {
      logger.error(
        `TransactionRepository: deleteTransactionFromDatabase error: ${error}`
      );
      throw new Error("Error deleting transaction from database");
    }
    await deleteRowFromGoogleSheet(transactionId);

    logger.info(
      `TransactionRepository: deleteTransactionFromDatabase success: ${data}`
    );
  };
  updateTransactionInDatabase = async (
    transactionId: string,
    userId: string,
    updatedTransaction: Omit<ITransaction, "userId">
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .update({
        ...updatedTransaction,
        savingsGoalId: updatedTransaction.savingsGoalId || null, // Clear if not provided
        budgetId: updatedTransaction.budgetId || null,
      })
      .eq("id", transactionId)
      .eq("userId", userId)
      .select("*, users(name)");

    if (error) {
      logger.error(
        `TransactionRepository: updateTransactionInDatabase error: ${JSON.stringify(
          error
        )}`
      );
      throw new Error("Error updating transaction in database");
    }
    const updatedTransactionData = data?.[0];

    const updatedTransactionDataWithName = {
      id: updatedTransactionData.id,
      userId: updatedTransactionData.userId,
      username: updatedTransactionData.users?.name || "Unknown User",
      type: updatedTransactionData.type,
      amount: updatedTransactionData.amount,
      name: updatedTransactionData.name,
      description: updatedTransactionData.description,
      category: updatedTransactionData.category,
      date: updatedTransactionData.date,
      base_currency: updatedTransactionData.base_currency,
      converted_currency: updatedTransactionData.converted_currency,
      base_amount: updatedTransactionData.base_amount,
      converted_amount: updatedTransactionData.converted_amount,
      exchange_rate: updatedTransactionData.exchange_rate,
      savingsGoalId: updatedTransactionData.savingsGoalId,
      budgetId: updatedTransactionData.budgetId,
    };

    await updateGoogleSheetRowByTransactionId(
      transactionId,
      updatedTransactionDataWithName
    );

    logger.info(
      `TransactionRepository: updateTransactionInDatabase success: ${data}`
    );
  };
  getTransactionByIdFromDatabase = async (
    transactionId: string,
    userId: string
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "type, amount, name, description, category, date, id, base_currency, converted_currency, base_amount, converted_amount, exchange_rate, savings_goals(id, title)"
      )
      .eq("id", transactionId)
      .eq("userId", userId)
      .single();

    if (error) {
      logger.error(`TransactionRepository: getTransactionById error: ${error}`);
      throw new Error("Error fetching transaction by ID from database");
    }

    logger.info(`TransactionRepository: getTransactionById success: ${data}`);
    return data;
  };

  getTransactionsBySavingsGoalIdFromDatabase = async (
    savingsGoalIds: string[],
    userId: string
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "type, amount, name, description, category, date, id, base_currency, converted_currency, base_amount, converted_amount, exchange_rate, savingsGoalId"
      )
      .in("savingsGoalId", savingsGoalIds)
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (error) {
      logger.error(
        `TransactionRepository: getTransactionsBySavingsGoalId error: ${error}`
      );
      throw new Error(
        "Error fetching transactions by savings goal ID from database"
      );
    }

    logger.info(
      `TransactionRepository: getTransactionsBySavingsGoalId success: ${data}`
    );
    return data;
  };
  updateMultipleTransactionsInDatabase: (
    transactionIds: number[],
    userId: string
  ) => Promise<void> = async (transactionIds, userId) => {
    const { data, error } = await supabase
      .from("transactions")
      .update({ savingsGoalId: null })
      .in("id", transactionIds)
      .eq("userId", userId)
      .select("*, users(name)");

    if (error) {
      logger.error(
        `TransactionRepository: updateMultipleTransactionsInDatabase error: ${error}`
      );
      throw new Error("Error updating multiple transactions in database");
    }

    // Update Google Sheets for each updated transaction
    if (Array.isArray(data)) {
      for (const updatedTransactionData of data) {
        const updatedTransactionDataWithName = {
          id: updatedTransactionData.id,
          userId: updatedTransactionData.userId,
          username: updatedTransactionData.users?.name || "Unknown User",
          type: updatedTransactionData.type,
          amount: updatedTransactionData.amount,
          name: updatedTransactionData.name,
          description: updatedTransactionData.description,
          category: updatedTransactionData.category,
          date: updatedTransactionData.date,
          base_currency: updatedTransactionData.base_currency,
          converted_currency: updatedTransactionData.converted_currency,
          base_amount: updatedTransactionData.base_amount,
          converted_amount: updatedTransactionData.converted_amount,
          exchange_rate: updatedTransactionData.exchange_rate,
          savingsGoalId: updatedTransactionData.savingsGoalId ?? "None",
        };

        await updateGoogleSheetRowByTransactionId(
          updatedTransactionData.id,
          updatedTransactionDataWithName
        );
      }
    }

    logger.info(
      `TransactionRepository: updateMultipleTransactionsInDatabase success: ${data}`
    );
  };
}
