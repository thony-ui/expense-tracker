import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { TransactionService } from "./transaction.service";
import {
  validatePostTransaction,
  validateGetTransactions,
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
}
