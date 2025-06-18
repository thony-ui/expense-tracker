import { NextFunction, Request, Response } from "express";
import { ExchangeRateService } from "./exchange-rate.service";
import logger from "../../../logger";

export class ExchangeRateController {
  constructor(private exchangeRateService: ExchangeRateService) {}
  getExchangeRateData = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      logger.info("ExchangeRateController: getExchangeRateData called");
      const exchangeRateData =
        await this.exchangeRateService.getExchangeRateDataFromDatabase();
      res.status(200).json(exchangeRateData);
    } catch (error) {
      logger.error(
        "ExchangeRateController: Error fetching exchange rate data",
        error
      );
      next(error);
    }
  };
}
