import logger from "../../../logger";
import { IExchangeRateService } from "./exchange-rate.interface";
import { ExchangeRateRepository } from "./exchange-rate.repository";

export class ExchangeRateService implements IExchangeRateService {
  constructor(private exchangeRateRepository: ExchangeRateRepository) {}

  getExchangeRateDataFromDatabase = async () => {
    try {
      const exchangeRateData =
        await this.exchangeRateRepository.getExchangeRateDataFromDatabase();
      logger.info(
        `ExchangeRateService: Fetched ${exchangeRateData.length} exchange rate records from the database`
      );
      return exchangeRateData;
    } catch (error) {
      throw new Error(`Error fetching exchange rate data`);
    }
  };
}
