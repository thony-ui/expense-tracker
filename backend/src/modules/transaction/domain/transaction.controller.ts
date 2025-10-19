import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { TransactionService } from "./transaction.service";
import {
  validatePostTransaction,
  validateGetTransactions,
  validateDeleteTransaction,
  validateUpdateTransaction,
  validateGetTransactionById,
  validateGetTransactionsBySavingsGoalId,
  validateUpdateMultipleTransactions,
} from "./transaction.validator";

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  postTransaction = async (
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
        base_currency,
        converted_currency,
        base_amount,
        converted_amount,
        exchange_rate,
        savingsGoalId,
        userId: id,
      } = validatePostTransaction({
        ...req.body,
        userId,
      });
      logger.info(
        `TransactionController: postTransaction called with type: ${type}, amount: ${amount}, name: ${name}, description: ${description}, category: ${category}, date: ${date}, userId: ${userId}`
      );
      await this.transactionService.addTransactionToDatabase({
        userId: id,
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
      res.status(201).send({ message: "Transaction added successfully" });
    } catch (error) {
      next(error);
    }
  };
  getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionType, limit, offSet } = req.query;
    try {
      const {
        userId: id,
        transactionType: type,
        limit: maxLimit,
        offSet: maxOffSet,
      } = validateGetTransactions({
        userId,
        transactionType,
        limit,
        offSet,
      });
      logger.info(
        `TransactionController: getTransactions called for userId: ${userId} and transactionType: ${type} and limit: ${maxLimit} and offSet: ${maxOffSet}`
      );
      const transactions =
        await this.transactionService.getTransactionsFromDatabase(
          id,
          type,
          maxLimit,
          maxOffSet
        );
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  };
  getYearlyTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionType, date } = req.query;
    try {
      const {
        userId: id,
        transactionType: type,
        date: txnDate,
      } = validateGetTransactions({
        userId,
        transactionType,
        date,
      });
      logger.info(
        `TransactionController: getYearlyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getYearlyTransactionsFromDatabase(
          id,
          type,
          txnDate
        );
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  };
  getMonthlyTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionType, date } = req.query;
    try {
      const {
        userId: id,
        transactionType: type,
        date: txnDate,
      } = validateGetTransactions({
        userId,
        transactionType,
        date,
      });
      logger.info(
        `TransactionController: getMonthlyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getMonthlyTransactionsFromDatabase(
          id,
          type,
          txnDate
        );
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  };
  getWeeklyTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionType, date } = req.query;
    try {
      const {
        userId: id,
        transactionType: type,
        date: txnDate,
      } = validateGetTransactions({
        userId,
        transactionType,
        date,
      });
      logger.info(
        `TransactionController: getWeeklyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getWeeklyTransactionsFromDatabase(
          id,
          type,
          txnDate
        );
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  };
  getDailyTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionType, date } = req.query;
    try {
      const {
        userId: id,
        transactionType: type,
        date: txnDate,
      } = validateGetTransactions({
        userId,
        transactionType,
        date,
      });
      logger.info(
        `TransactionController: getDailyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getDailyTransactionsFromDatabase(
          id,
          type,
          txnDate
        );
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  };
  deleteTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionId } = req.params;
    try {
      const { transactionId: id, userId: uid } = validateDeleteTransaction({
        transactionId,
        userId,
      });
      logger.info(
        `TransactionController: deleteTransaction called for transactionId: ${id} and userId: ${uid}`
      );
      await this.transactionService.deleteTransactionFromDatabase(id, uid);
      res.status(200).send({ message: "Transaction deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  updateTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionId } = req.params;
    const updatedTransaction = req.body;
    try {
      const {
        transactionId: id,
        userId: uid,
        updatedTransaction: updatedTransactionForDatabase,
      } = validateUpdateTransaction({
        transactionId,
        userId,
        ...updatedTransaction,
      });
      logger.info(
        `TransactionController: updateTransaction called for transactionId: ${id} and userId: ${uid}`
      );
      await this.transactionService.updateTransactionInDatabase(
        id,
        uid,
        updatedTransactionForDatabase
      );
      res.status(200).send({ message: "Transaction updated successfully" });
    } catch (error) {
      next(error);
    }
  };
  getTransactionById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionId } = req.params;
    try {
      const { transactionId: id, userId: uid } = validateGetTransactionById({
        userId,
        transactionId,
      });
      logger.info(
        `TransactionController: getTransactionById called for transactionId: ${id} and userId: ${uid}`
      );
      const transaction =
        await this.transactionService.getTransactionByIdFromDatabase(id, uid);
      res.status(200).send(transaction);
    } catch (error) {
      next(error);
    }
  };

  getTransactionBySavingsGoalId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    let { savingsGoalIds } = req.query;
    if (!Array.isArray(savingsGoalIds)) {
      savingsGoalIds = savingsGoalIds ? [savingsGoalIds] : [];
    }
    try {
      const { savingsGoalIds: ids, userId: uid } =
        validateGetTransactionsBySavingsGoalId({
          userId,
          savingsGoalIds,
        });
      logger.info(
        `TransactionController: getTransactionBySavingsGoalId called for savingsGoalId: ${ids} and userId: ${uid}`
      );
      const transactions =
        await this.transactionService.getTransactionsBySavingsGoalIdFromDatabase(
          ids,
          uid
        );
      res.status(200).send(transactions);
    } catch (error) {
      next(error);
    }
  };

  updateMultipleTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { transactionIds } = req.body;
    try {
      const { transactionIds: ids, userId: uid } =
        validateUpdateMultipleTransactions({
          userId,
          transactionIds,
        });
      logger.info(
        `TransactionController: updateMultipleTransactions called for transactionIds: ${transactionIds} and userId: ${userId}`
      );
      await this.transactionService.updateMultipleTransactionsInDatabase(
        ids,
        uid
      );
      res.status(200).send({ message: "Transactions updated successfully" });
    } catch (error) {
      next(error);
    }
  };
}
