import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { TransactionService } from "./transaction.service";
import {
  validatePostTransaction,
  validateGetTransactions,
  validateDeleteTransaction,
  validateUpdateTransaction,
  validateGetTransactionById,
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
    const { transactionType } = req.query;
    try {
      const { userId: id, transactionType: type } = validateGetTransactions({
        userId,
        transactionType,
      });
      logger.info(
        `TransactionController: getTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getTransactionsFromDatabase(id, type);
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
    const { transactionType } = req.query;
    try {
      const { userId: id, transactionType: type } = validateGetTransactions({
        userId,
        transactionType,
      });
      logger.info(
        `TransactionController: getYearlyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getYearlyTransactionsFromDatabase(
          id,
          type
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
    const { transactionType } = req.query;
    try {
      const { userId: id, transactionType: type } = validateGetTransactions({
        userId,
        transactionType,
      });
      logger.info(
        `TransactionController: getMonthlyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getMonthlyTransactionsFromDatabase(
          id,
          type
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
    const { transactionType } = req.query;
    try {
      const { userId: id, transactionType: type } = validateGetTransactions({
        userId,
        transactionType,
      });
      logger.info(
        `TransactionController: getWeeklyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getWeeklyTransactionsFromDatabase(
          id,
          type
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
    const { transactionType } = req.query;
    try {
      const { userId: id, transactionType: type } = validateGetTransactions({
        userId,
        transactionType,
      });
      logger.info(
        `TransactionController: getDailyTransactions called for userId: ${userId} and transactionType: ${type}`
      );
      const transactions =
        await this.transactionService.getDailyTransactionsFromDatabase(
          id,
          type
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
}
