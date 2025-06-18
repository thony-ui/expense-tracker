import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import { formatDate, getCurrentWeekStart } from "../../../utils/formate-date";
import { ITransaction, ITransactionService } from "./transaction.interface";

export class TransactionRepository implements ITransactionService {
  addTransactionToDatabase = async ({
    userId,
    type,
    amount,
    name,
    description,
    category,
    date,
  }: ITransaction) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ type, amount, name, description, category, date, userId }]);
    if (error) {
      logger.error(
        `TransactionRepository: addTransactionToDatabase error: ${error}`
      );
      throw new Error("Error adding expense to database");
    }
    logger.info(
      `TransactionRepository: addTransactionToDatabase success: ${data}`
    );
  };

  getTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string
  ) => {
    let query = supabase
      .from("transactions")
      .select("type, amount, name, description, category, date, id")
      .eq("userId", userId);

    // Add conditional filter for transactionType
    if (transactionType) {
      query = query.eq("type", transactionType);
    }

    const { data, error } = await query.order("date", { ascending: false });

    if (error) {
      logger.error(`TransactionRepository: getTransactions error: ${error}`);
      throw new Error("Error fetching Transactions from database");
    }

    logger.info(`TransactionRepository: getTransactions success: ${data}`);
    return data;
  };

  getYearlyTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string
  ) => {
    const year = new Date().getFullYear();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    let query = supabase
      .from("transactions")
      .select("type, amount, name, description, category, date, id")
      .eq("userId", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (transactionType) {
      query = query.eq("type", transactionType);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (error) {
      logger.error(
        `TransactionRepository: getYearlyTransactions error: ${error}`
      );
      throw new Error("Error fetching yearly transactions from database");
    }

    logger.info(
      `TransactionRepository: getYearlyTransactions success for year ${year}: ${data?.length} transactions`
    );
    return data;
  };

  getMonthlyTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string
  ) => {
    const currentDate = new Date();
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    let query = supabase
      .from("transactions")
      .select("type, amount, name, description, category, date, id")
      .eq("userId", userId)
      .gte("date", startDateStr)
      .lte("date", endDateStr);

    if (transactionType) {
      query = query.eq("type", transactionType);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (error) {
      logger.error(
        `TransactionRepository: getMonthlyTransactions error: ${error}`
      );
      throw new Error("Error fetching monthly transactions from database");
    }

    logger.info(
      `TransactionRepository: getMonthlyTransactions success for month ${startDateStr} to ${endDateStr}: ${data?.length} transactions`
    );
    return data;
  };

  getWeeklyTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string
  ) => {
    const startDate = new Date(getCurrentWeekStart());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    let query = supabase
      .from("transactions")
      .select("type, amount, name, description, category, date, id")
      .eq("userId", userId)
      .gte("date", startDateStr)
      .lte("date", endDateStr);

    if (transactionType) {
      query = query.eq("type", transactionType);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (error) {
      logger.error(
        `TransactionRepository: getWeeklyTransactions error: ${error}`
      );
      throw new Error("Error fetching weekly transactions from database");
    }

    logger.info(
      `TransactionRepository: getWeeklyTransactions success for week ${startDateStr} to ${endDateStr}: ${data?.length} transactions`
    );
    return data;
  };

  getDailyTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string
  ) => {
    const currentDate = new Date().toISOString().split("T")[0];
    let query = supabase
      .from("transactions")
      .select("type, amount, name, description, category, date, id")
      .eq("userId", userId)
      .eq("date", currentDate);

    if (transactionType) {
      query = query.eq("type", transactionType);
    }

    const { data, error } = await query.order("date", { ascending: true });

    if (error) {
      logger.error(
        `TransactionRepository: getDailyTransactions error: ${error}`
      );
      throw new Error("Error fetching daily transactions from database");
    }

    logger.info(
      `TransactionRepository: getDailyTransactions success for date ${currentDate}: ${data?.length} transactions`
    );
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
      .update(updatedTransaction)
      .eq("id", transactionId)
      .eq("userId", userId);

    if (error) {
      logger.error(
        `TransactionRepository: updateTransactionInDatabase error: ${error}`
      );
      throw new Error("Error updating transaction in database");
    }

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
      .select("type, amount, name, description, category, date, id")
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
}
