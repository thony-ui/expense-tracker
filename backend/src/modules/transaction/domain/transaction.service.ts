import logger from "../../../logger";
import {
  IGetTransactions,
  ITransaction,
  ITransactionService,
} from "./transaction.interface";
import { TransactionRepository } from "./transaction.repository";

export class TransactionService implements ITransactionService {
  constructor(private transactionRepository: TransactionRepository) {}
  addTransactionToDatabase = async ({
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
    savingsGoalId,
  }: ITransaction) => {
    logger.info(
      `TransactionService: addTransactionToDatabase called with type: ${type}, amount: ${amount}, name: ${name}, description: ${description}, category: ${category}, date: ${date}, userId: ${userId}`
    );
    await this.transactionRepository.addTransactionToDatabase({
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
      savingsGoalId,
    });
  };

  getTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string,
    limit?: number,
    offSet?: number,
    categoryType?: string,
    dateToFilter?: string
  ) => {
    logger.info(
      `TransactionService: getTransactionsFromDatabase called for userId: ${userId}, transactionType: ${transactionType}`
    );
    const transactions =
      await this.transactionRepository.getTransactionsFromDatabase(
        userId,
        transactionType,
        limit,
        offSet,
        categoryType,
        dateToFilter
      );
    return transactions;
  };

  deleteTransactionFromDatabase = async (
    transactionId: string,
    userId: string
  ) => {
    logger.info(
      `TransactionService: deleteTransactionFromDatabase called for transactionId: ${transactionId}, userId: ${userId}`
    );
    await this.transactionRepository.deleteTransactionFromDatabase(
      transactionId,
      userId
    );
  };
  updateTransactionInDatabase = async (
    transactionId: string,
    userId: string,
    updatedTransaction: Omit<ITransaction, "userId">
  ) => {
    logger.info(
      `TransactionService: updateTransactionInDatabase called for transactionId: ${transactionId}, userId: ${userId}, updatedTransaction: ${JSON.stringify(
        updatedTransaction
      )}`
    );
    await this.transactionRepository.updateTransactionInDatabase(
      transactionId,
      userId,
      updatedTransaction
    );
  };
  getTransactionByIdFromDatabase = async (
    transactionId: string,
    userId: string
  ): Promise<IGetTransactions> => {
    logger.info(
      `TransactionService: getTransactionById called for transactionId: ${transactionId}, userId: ${userId}`
    );
    const transaction =
      await this.transactionRepository.getTransactionByIdFromDatabase(
        transactionId,
        userId
      );
    return transaction;
  };

  getTransactionsBySavingsGoalIdFromDatabase = async (
    savingsGoalIds: string[],
    userId: string
  ): Promise<IGetTransactions[]> => {
    logger.info(
      `TransactionService: getTransactionsBySavingsGoalId called for savingsGoalIds: ${savingsGoalIds.join(
        ", "
      )}, userId: ${userId}`
    );
    const transactions =
      await this.transactionRepository.getTransactionsBySavingsGoalIdFromDatabase(
        savingsGoalIds,
        userId
      );
    return transactions;
  };
  updateMultipleTransactionsInDatabase = async (
    transactionIds: number[],
    userId: string
  ): Promise<void> => {
    logger.info(
      `TransactionService: updateMultipleTransactionsInDatabase called for transactionIds: ${transactionIds.join(
        ", "
      )}, userId: ${userId}`
    );
    await this.transactionRepository.updateMultipleTransactionsInDatabase(
      transactionIds,
      userId
    );
  };
}
