import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { InvestmentService } from "./investment.service";
import {
  validatePostInvestment,
  validateGetInvestments,
  validateGetInvestmentStats,
  validateGetInvestmentsOverTime,
  validateUpdateInvestment,
  validateDeleteInvestment,
  validateGetInvestmentById,
} from "./investment.validator";
import { IInvestment } from "./investment.interface";

export class InvestmentController {
  constructor(private investmentService: InvestmentService) {}

  postInvestment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userName, stock, amountInSGD, date } = validatePostInvestment(
        req.body
      );

      const userId = (req as any).user.id;

      logger.info(
        `InvestmentController: postInvestment called for userName: ${userName}, stock: ${stock}`
      );

      await this.investmentService.addInvestmentToDatabase(
        {
          userName,
          stock,
          amountInSGD,
          date,
        } as IInvestment,
        userId
      );

      res.status(201).json({ message: "Investment added successfully" });
    } catch (error) {
      next(error);
    }
  };

  getInvestments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { userName, limit, offSet, type, date } = req.query;

    try {
      const {
        userName: filterUserName,
        limit: maxLimit,
        offSet: maxOffSet,
        type: categoryType,
        date: dateToFilter,
      } = validateGetInvestments({
        userName,
        limit: limit ? Number(limit) : undefined,
        offSet: offSet ? Number(offSet) : undefined,
        type,
        date,
      });

      const userId = (req as any).user.id;

      logger.info(
        `InvestmentController: getInvestments called with userName: ${
          filterUserName || "all"
        }`
      );

      const investments =
        await this.investmentService.getInvestmentsFromDatabase(
          userId,
          filterUserName,
          maxLimit,
          maxOffSet,
          categoryType,
          dateToFilter
        );

      res.status(200).json(investments);
    } catch (error) {
      next(error);
    }
  };

  getInvestmentStats = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { userName, type, date } = req.query;

    try {
      const {
        userName: filterUserName,
        type: statsType,
        date: statsDate,
      } = validateGetInvestmentStats({
        userName,
        type,
        date,
      });

      const userId = (req as any).user.id;

      logger.info(
        `InvestmentController: getInvestmentStats called with userName: ${
          filterUserName || "all"
        }, type: ${statsType || "all"}, date: ${statsDate || "current"}`
      );

      const stats = await this.investmentService.getInvestmentStatsFromDatabase(
        userId,
        filterUserName,
        statsType,
        statsDate
      );

      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  getInvestmentsOverTime = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { type, date, userName } = req.query;

    try {
      const {
        type: timeType,
        date: filterDate,
        userName: filterUserName,
      } = validateGetInvestmentsOverTime({
        type,
        date,
        userName,
      });

      // Default to monthly and current date if not provided
      const finalType = timeType || "monthly";
      const finalDate = filterDate || new Date().toISOString().split("T")[0];

      logger.info(
        `InvestmentController: getInvestmentsOverTime called with type: ${finalType}, date: ${finalDate}, userName: ${
          filterUserName || "all"
        }`
      );

      const investmentsOverTime =
        await this.investmentService.getInvestmentsOverTimeFromDatabase(
          (req as any).user.id,
          finalType,
          finalDate,
          filterUserName
        );

      res.status(200).json(investmentsOverTime);
    } catch (error) {
      next(error);
    }
  };

  getAggregatedInvestments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      logger.info(`InvestmentController: getAggregatedInvestments called`);

      const aggregatedInvestments =
        await this.investmentService.getAggregatedInvestmentsFromDatabase(
          userId
        );

      res.status(200).json(aggregatedInvestments);
    } catch (error) {
      next(error);
    }
  };

  getUniqueStocks = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = (req as any).user.id;

      logger.info(`InvestmentController: getUniqueStocks called`);

      const stocks = await this.investmentService.getUniqueStocksFromDatabase(
        userId
      );

      res.status(200).json(stocks);
    } catch (error) {
      next(error);
    }
  };

  updateInvestment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { investmentId } = req.params;

    try {
      const validatedData = validateUpdateInvestment({
        investmentId,
        ...req.body,
      });

      const userId = (req as any).user.id;

      logger.info(
        `InvestmentController: updateInvestment called for investmentId: ${investmentId}`
      );

      const { investmentId: id, ...updateData } = validatedData;

      await this.investmentService.updateInvestmentInDatabase(
        userId,
        id,
        updateData
      );

      res.status(200).json({ message: "Investment updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  deleteInvestment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { investmentId } = req.params;

    try {
      const { investmentId: id } = validateDeleteInvestment({
        investmentId,
      });

      const userId = (req as any).user.id;

      logger.info(
        `InvestmentController: deleteInvestment called for investmentId: ${investmentId}`
      );

      await this.investmentService.deleteInvestmentFromDatabase(userId, id);

      res.status(200).json({ message: "Investment deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  getInvestmentById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const { investmentId } = req.params;

    try {
      const { investmentId: id } = validateGetInvestmentById({
        investmentId,
      });

      const userId = (req as any).user.id;

      logger.info(
        `InvestmentController: getInvestmentById called for investmentId: ${investmentId}`
      );

      const investment =
        await this.investmentService.getInvestmentByIdFromDatabase(userId, id);

      res.status(200).json(investment);
    } catch (error) {
      next(error);
    }
  };
}
