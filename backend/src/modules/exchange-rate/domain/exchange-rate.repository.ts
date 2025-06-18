import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import {
  IExchangeRateData,
  IExchangeRateService,
} from "./exchange-rate.interface";

export class ExchangeRateRepository implements IExchangeRateService {
  getExchangeRateDataFromDatabase = async () => {
    const { data, error } = await supabase
      .from("exchange_rates")
      .select("base, currency, rate");
    if (error) {
      throw new Error(`Error fetching exchange rate data: ${error.message}`);
    }
    const formattedData = data.map((item) => {
      return {
        baseCurrency: item.base,
        targetCurrency: item.currency,
        exchangeRate: item.rate,
      };
    });
    logger.info(
      `ExchangeRateRepository: Fetched ${formattedData.length} exchange rate records from the database`
    );
    return formattedData as IExchangeRateData[];
  };
}
