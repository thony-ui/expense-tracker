import { NextFunction, Request, Response } from "express";
import { ExchangeRateController } from "../domain/exchange-rate.controller";
import { ExchangeRateRepository } from "../domain/exchange-rate.repository";
import { ExchangeRateService } from "../domain/exchange-rate.service";

jest.mock("../../../logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("Exchange Rate Service", () => {
  let exchangeRateService: ExchangeRateService;
  let exchangeRateRepository: ExchangeRateRepository;
  beforeEach(() => {
    exchangeRateRepository = {
      getExchangeRateDataFromDatabase: jest.fn(),
    } as unknown as ExchangeRateRepository;
    exchangeRateService = new ExchangeRateService(exchangeRateRepository);
  });
  it("should return exchange rates", async () => {
    const mockExchangeRates = [
      { baseCurrency: "USD", targetCurrency: "EUR", exchangeRate: 0.85 },
      { baseCurrency: "USD", targetCurrency: "GBP", exchangeRate: 0.75 },
    ];
    (
      exchangeRateRepository.getExchangeRateDataFromDatabase as jest.Mock
    ).mockResolvedValue(mockExchangeRates);

    const exchangeRates =
      await exchangeRateService.getExchangeRateDataFromDatabase();

    expect(exchangeRates).toEqual(mockExchangeRates);
  });
  it("should throw an error if fetching exchange rates fails", async () => {
    const error = new Error("Database error");
    (
      exchangeRateRepository.getExchangeRateDataFromDatabase as jest.Mock
    ).mockRejectedValue(error);

    await expect(
      exchangeRateService.getExchangeRateDataFromDatabase()
    ).rejects.toThrow("Error fetching exchange rate data");
  });
});

describe("Exchange Rate Controller", () => {
  let exchangeRateController: ExchangeRateController;
  let exchangeRateService: ExchangeRateService;

  beforeEach(() => {
    exchangeRateService = {
      getExchangeRateDataFromDatabase: jest.fn(),
    } as unknown as ExchangeRateService;
    exchangeRateController = new ExchangeRateController(exchangeRateService);
  });

  it("should return exchange rate data", async () => {
    const mockExchangeRates = [
      { baseCurrency: "USD", targetCurrency: "EUR", exchangeRate: 0.85 },
      { baseCurrency: "USD", targetCurrency: "GBP", exchangeRate: 0.75 },
    ];
    (
      exchangeRateService.getExchangeRateDataFromDatabase as jest.Mock
    ).mockResolvedValue(mockExchangeRates);

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await exchangeRateController.getExchangeRateData(
      req as Request,
      res as Response,
      next as NextFunction
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockExchangeRates);
  });

  it("should handle errors when fetching exchange rate data", async () => {
    const error = new Error("Database error");
    (
      exchangeRateService.getExchangeRateDataFromDatabase as jest.Mock
    ).mockRejectedValue(error);

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    await exchangeRateController.getExchangeRateData(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
