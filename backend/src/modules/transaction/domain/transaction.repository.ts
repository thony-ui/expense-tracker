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
import {
  IGetTransactions,
  ITransaction,
  ITransactionService,
} from "./transaction.interface";

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
    budgetIds,
  }: ITransaction) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        userId,
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
        savingsGoalId: savingsGoalId || null, // Set to null if not provided
        budgetId: null, // Use the first budget ID if provided
      })
      .select("*, users(name)");
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
      budgetId: "",
    });
    for (const budgetId of budgetIds || []) {
      const { data: transactionBudgetData, error } = await supabase
        .from("transaction_budget")
        .insert({
          transaction_id: data?.[0]?.id,
          budget_id: budgetId,
        });
      if (error) {
        logger.error(
          `TransactionRepository: addTransactionToDatabase error: ${error}`,
        );
        throw new Error("Error adding expense to database");
      }
      logger.info(
        `TransactionRepository: addTransactionToDatabase success: ${data}`,
      );
    }
  };

  getTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string,
    limit?: number,
    offSet?: number,
    categoryType?: string,
    dateToFilter?: string,
  ) => {
    let query = supabase
      .from("transactions")
      .select(
        "type, amount, name, description, category, date, id, base_currency, converted_currency, base_amount, converted_amount, exchange_rate, savings_goals(id, title), savingsGoalId",
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
        dateToFilter,
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
    userId: string,
  ) => {
    const { error: budgetError } = await supabase
      .from("transaction_budget")
      .delete()
      .eq("transaction_id", transactionId);

    if (budgetError) throw budgetError;
    const { data, error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", transactionId)
      .eq("userId", userId);

    if (error) {
      logger.error(
        `TransactionRepository: deleteTransactionFromDatabase error: ${error}`,
      );
      throw new Error("Error deleting transaction from database");
    }
    await deleteRowFromGoogleSheet(transactionId);

    logger.info(
      `TransactionRepository: deleteTransactionFromDatabase success: ${data}`,
    );
  };
  updateTransactionInDatabase = async (
    transactionId: string,
    userId: string,
    updatedTransaction: Omit<ITransaction, "userId">,
  ) => {
    const { data: deletedRows, error: deleteError } = await supabase
      .from("transaction_budget")
      .delete()
      .eq("transaction_id", transactionId);
    const budgetIds = updatedTransaction.budgetIds || [];
    const transactionData = {
      type: updatedTransaction.type,
      amount: updatedTransaction.amount,
      name: updatedTransaction.name,
      description: updatedTransaction.description,
      category: updatedTransaction.category,
      date: updatedTransaction.date,
      base_currency: updatedTransaction.base_currency,
      converted_currency: updatedTransaction.converted_currency,
      base_amount: updatedTransaction.base_amount,
      converted_amount: updatedTransaction.converted_amount,
      exchange_rate: updatedTransaction.exchange_rate,
    };

    logger.info(`Incoming budgetId: ${JSON.stringify(budgetIds)}`);

    const { data, error } = await supabase
      .from("transactions")
      .update({
        ...transactionData,
        savingsGoalId: updatedTransaction.savingsGoalId || null,
        budgetId: null,
      })
      .eq("id", transactionId)
      .eq("userId", userId)
      .select("*, users(name)");

    if (error) {
      logger.error(
        `TransactionRepository: updateTransactionInDatabase error: ${JSON.stringify(error)}`,
      );
      throw new Error("Error updating transaction in database");
    }

    const updatedTransactionData = data?.[0];
    if (!updatedTransactionData) {
      logger.error(
        `TransactionRepository: updateTransactionInDatabase error: No transaction found after update for transactionId: ${transactionId} and userId: ${userId}`,
      );
      throw new Error("Transaction not found after update");
    }
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
    };

    await updateGoogleSheetRowByTransactionId(
      transactionId,
      updatedTransactionDataWithName,
    );

    logger.info(
      `Deleted old budget links: ${JSON.stringify(deletedRows)}, error: ${JSON.stringify(deleteError)}`,
    );

    if (deleteError) {
      logger.error(
        `TransactionRepository: updateTransactionInDatabase error deleting old budget links: ${JSON.stringify(deleteError)}`,
      );
      throw new Error("Error updating transaction budgets in database");
    }

    if (budgetIds.length > 0) {
      const rows = budgetIds.map((budgetId) => ({
        transaction_id: transactionId,
        budget_id: budgetId,
      }));

      const { error: insertError } = await supabase
        .from("transaction_budget")
        .insert(rows);

      if (insertError) {
        logger.error(
          `TransactionRepository: updateTransactionInDatabase error inserting new budget links: ${JSON.stringify(insertError)}`,
        );
        throw new Error("Error updating transaction budgets in database");
      }
    }
  };
  getTransactionByIdFromDatabase = async (
    transactionId: string,
    userId: string,
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
    *,
    transaction_budget (
      budget_id
    )
  `,
      )
      .eq("id", transactionId)
      .eq("userId", userId)
      .single();

    if (error) throw error;

    const budgetIds = data.transaction_budget.map(
      (item: { budget_id: string }) => item.budget_id,
    );

    const transaction = {
      ...data,
      budgetIds,
    };

    if (error) {
      logger.error(`TransactionRepository: getTransactionById error: ${error}`);
      throw new Error("Error fetching transaction by ID from database");
    }

    logger.info(`TransactionRepository: getTransactionById success: ${data}`);
    return transaction;
  };

  getTransactionsBySavingsGoalIdFromDatabase = async (
    savingsGoalIds: string[],
    userId: string,
  ) => {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        "type, amount, name, description, category, date, id, base_currency, converted_currency, base_amount, converted_amount, exchange_rate, savingsGoalId",
      )
      .in("savingsGoalId", savingsGoalIds)
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (error) {
      logger.error(
        `TransactionRepository: getTransactionsBySavingsGoalId error: ${error}`,
      );
      throw new Error(
        "Error fetching transactions by savings goal ID from database",
      );
    }

    logger.info(
      `TransactionRepository: getTransactionsBySavingsGoalId success: ${data}`,
    );
    return data;
  };
  updateMultipleTransactionsInDatabase: (
    transactionIds: number[],
    userId: string,
  ) => Promise<void> = async (transactionIds, userId) => {
    const { data, error } = await supabase
      .from("transactions")
      .update({ savingsGoalId: null })
      .in("id", transactionIds)
      .eq("userId", userId)
      .select("*, users(name)");

    if (error) {
      logger.error(
        `TransactionRepository: updateMultipleTransactionsInDatabase error: ${error}`,
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
          updatedTransactionDataWithName,
        );
      }
    }

    logger.info(
      `TransactionRepository: updateMultipleTransactionsInDatabase success: ${data}`,
    );
  };
  getTransactionsByBudgetIdFromDatabase = async (
    budgetId: string,
    userId: string,
  ) => {
    type TTransactionWithId = IGetTransactions & { id: string };

    const { data: directTransactions, error: directError } = await supabase
      .from("transactions")
      .select(
        "type, amount, name, description, category, date, id, base_currency, converted_currency, base_amount, converted_amount, exchange_rate, savingsGoalId",
      )
      .eq("budgetId", budgetId)
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (directError) {
      logger.error(
        `TransactionRepository: getTransactionsByBudgetId direct error: ${directError}`,
      );
      throw new Error("Error fetching transactions by budget ID from database");
    }

    const { data: joinedTransactions, error: joinedError } = await supabase
      .from("transaction_budget")
      .select(
        `
      transaction_id,
      transactions!inner (
        type,
        amount,
        name,
        description,
        category,
        date,
        id,
        base_currency,
        converted_currency,
        base_amount,
        converted_amount,
        exchange_rate,
        savingsGoalId
      )
    `,
      )
      .eq("budget_id", budgetId)
      .eq("transactions.userId", userId)
      .order("transaction_id", { ascending: false });

    if (joinedError) {
      logger.error(
        `TransactionRepository: getTransactionsByBudgetId joined error: ${joinedError}`,
      );
      throw new Error("Error fetching transactions by budget ID from database");
    }

    const transactionMap = new Map<string, TTransactionWithId>();

    directTransactions?.forEach((transaction: TTransactionWithId) => {
      transactionMap.set(transaction.id, transaction);
    });

    (joinedTransactions ?? []).forEach(
      (row: { transactions?: IGetTransactions | IGetTransactions[] }) => {
        const transactions = (Array.isArray(row.transactions)
          ? row.transactions
          : row.transactions
            ? [row.transactions]
            : []) as TTransactionWithId[];

        transactions.forEach((transaction) => {
          transactionMap.set(transaction.id, transaction);
        });
      },
    );

    logger.info(
      `TransactionRepository: getTransactionsByBudgetIdFromDatabase success: ${JSON.stringify(
        Array.from(transactionMap.values()),
      )}`,
    );
    return Array.from(transactionMap.values()).sort(
      (left, right) => new Date(right.date).getTime() - new Date(left.date).getTime(),
    );
  };
}
