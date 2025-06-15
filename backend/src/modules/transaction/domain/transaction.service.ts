import logger from "../../../logger";
import { ITransaction, ITransactionService } from "./transaction.interface";
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
    });
  };

  getTransactionsFromDatabase = async (
    userId: string,
    transactionType?: string
  ) => {
    logger.info(
      `TransactionService: getTransactionsFromDatabase called for userId: ${userId}, transactionType: ${transactionType}`
    );
    const transactions =
      await this.transactionRepository.getTransactionsFromDatabase(
        userId,
        transactionType
      );
    return transactions;
  };
}
