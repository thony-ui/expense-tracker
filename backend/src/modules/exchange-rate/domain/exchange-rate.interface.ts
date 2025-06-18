export interface IExchangeRateData {
  baseCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
}

export interface IExchangeRateService {
  getExchangeRateDataFromDatabase(): Promise<IExchangeRateData[]>;
}
