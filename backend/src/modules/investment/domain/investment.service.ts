import logger from "../../../logger";
import {
  IInvestment,
  IInvestmentAggregated,
  IInvestmentOverTime,
  IInvestmentService,
  IInvestmentStats,
} from "./investment.interface";
import { InvestmentRepository } from "./investment.repository";

export class InvestmentService implements IInvestmentService {
  constructor(private investmentRepository: InvestmentRepository) {}

  addInvestmentToDatabase = async (
    investment: IInvestment,
    userId: string
  ): Promise<void> => {
    logger.info(
      `InvestmentService: addInvestmentToDatabase called for userName: ${investment.userName}, stock: ${investment.stock}`
    );
    await this.investmentRepository.addInvestmentToDatabase(investment, userId);
  };

  getInvestmentsFromDatabase = async (
    userId: string,
    userName?: string,
    limit?: number,
    offSet?: number,
    categoryType?: string,
    dateToFilter?: string
  ): Promise<IInvestment[]> => {
    logger.info(
      `InvestmentService: getInvestmentsFromDatabase called with userName: ${
        userName || "all"
      }`
    );
    const investments =
      await this.investmentRepository.getInvestmentsFromDatabase(
        userId,
        userName,
        limit,
        offSet,
        categoryType,
        dateToFilter
      );
    return investments;
  };

  getInvestmentStatsFromDatabase = async (
    userId: string,
    userName?: string,
    categoryType?: string,
    dateToFilter?: string
  ): Promise<IInvestmentStats> => {
    logger.info(
      `InvestmentService: getInvestmentStatsFromDatabase called with userName: ${
        userName || "all"
      }, type: ${categoryType || "all"}, date: ${dateToFilter || "current"}`
    );
    const stats =
      await this.investmentRepository.getInvestmentStatsFromDatabase(
        userId,
        userName,
        categoryType,
        dateToFilter
      );
    return stats;
  };

  getInvestmentsOverTimeFromDatabase = async (
    userId: string,
    type: "yearly" | "monthly" | "weekly" | "daily",
    date: string,
    userName?: string
  ): Promise<IInvestmentOverTime[]> => {
    logger.info(
      `InvestmentService: getInvestmentsOverTimeFromDatabase called with type: ${type}, date: ${date}, userName: ${
        userName || "all"
      }`
    );
    const investmentsOverTime =
      await this.investmentRepository.getInvestmentsOverTimeFromDatabase(
        userId,
        type,
        date,
        userName
      );
    return investmentsOverTime;
  };

  getAggregatedInvestmentsFromDatabase = async (
    userId: string
  ): Promise<IInvestmentAggregated[]> => {
    logger.info(
      `InvestmentService: getAggregatedInvestmentsFromDatabase called`
    );
    const aggregatedInvestments =
      await this.investmentRepository.getAggregatedInvestmentsFromDatabase(
        userId
      );
    return aggregatedInvestments;
  };

  getUniqueStocksFromDatabase = async (userId: string): Promise<string[]> => {
    logger.info(`InvestmentService: getUniqueStocksFromDatabase called`);
    const stocks = await this.investmentRepository.getUniqueStocksFromDatabase(
      userId
    );
    return stocks;
  };

  updateInvestmentInDatabase = async (
    userId: string,
    investmentId: string,
    updatedInvestment: Partial<IInvestment>
  ): Promise<void> => {
    logger.info(
      `InvestmentService: updateInvestmentInDatabase called for investmentId: ${investmentId}`
    );
    await this.investmentRepository.updateInvestmentInDatabase(
      userId,
      investmentId,
      updatedInvestment
    );
  };

  deleteInvestmentFromDatabase = async (
    userId: string,
    investmentId: string
  ): Promise<void> => {
    logger.info(
      `InvestmentService: deleteInvestmentFromDatabase called for investmentId: ${investmentId}`
    );
    await this.investmentRepository.deleteInvestmentFromDatabase(
      userId,
      investmentId
    );
  };

  getInvestmentByIdFromDatabase = async (
    userId: string,
    investmentId: string
  ): Promise<IInvestment> => {
    logger.info(
      `InvestmentService: getInvestmentByIdFromDatabase called for investmentId: ${investmentId}`
    );
    const investment =
      await this.investmentRepository.getInvestmentByIdFromDatabase(
        userId,
        investmentId
      );
    return investment;
  };
}
