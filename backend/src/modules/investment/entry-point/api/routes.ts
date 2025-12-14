import { Application, Router } from "express";
import { InvestmentRepository } from "../../domain/investment.repository";
import { InvestmentService } from "../../domain/investment.service";
import { InvestmentController } from "../../domain/investment.controller";
import { authenticateUser } from "../../../../middleware/authorization";

export function defineInvestmentRoutes(expressApp: Application) {
  const investmentRouter = Router();
  const investmentRepository = new InvestmentRepository();
  const investmentService = new InvestmentService(investmentRepository);
  const investmentController = new InvestmentController(investmentService);

  investmentRouter.post("/", investmentController.postInvestment);
  investmentRouter.get("/", investmentController.getInvestments);
  investmentRouter.get("/stats", investmentController.getInvestmentStats);
  investmentRouter.get(
    "/over-time",
    investmentController.getInvestmentsOverTime
  );
  investmentRouter.get(
    "/aggregated",
    investmentController.getAggregatedInvestments
  );
  investmentRouter.get("/stocks", investmentController.getUniqueStocks);
  investmentRouter.get(
    "/:investmentId",
    investmentController.getInvestmentById
  );
  investmentRouter.put("/:investmentId", investmentController.updateInvestment);
  investmentRouter.delete(
    "/:investmentId",
    investmentController.deleteInvestment
  );

  expressApp.use("/v1/investments", authenticateUser, investmentRouter);
}
