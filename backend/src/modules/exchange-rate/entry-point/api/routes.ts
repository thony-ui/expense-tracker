import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { ExchangeRateRepository } from "../../domain/exchange-rate.repository";
import { ExchangeRateService } from "../../domain/exchange-rate.service";
import { ExchangeRateController } from "../../domain/exchange-rate.controller";

export function defineExchangeRateRouter(expressApp: Application) {
  const exchangeRateRouter = Router();
  const exchangeRateRepository = new ExchangeRateRepository();
  const exchangeRateService = new ExchangeRateService(exchangeRateRepository);
  const exchangeRateController = new ExchangeRateController(
    exchangeRateService
  );
  exchangeRateRouter.get("/", exchangeRateController.getExchangeRateData);

  expressApp.use("/v1/exchange-rate", authenticateUser, exchangeRateRouter);
}
