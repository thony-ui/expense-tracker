import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { SavingsGoalRepository } from "../../domain/savings-goal.repository";
import { SavingsGoalController } from "../../domain/savings-goal.controller";
import { SavingsGoalService } from "../../domain/savings-goal.service";

export function defineSavingsGoalRoutes(expressApp: Application) {
  const savingsGoalRouter = Router();
  const savingsGoalRepository = new SavingsGoalRepository();
  const savingsGoalService = new SavingsGoalService(savingsGoalRepository);
  const savingsGoalController = new SavingsGoalController(savingsGoalService);

  savingsGoalRouter.post("/", savingsGoalController.postSavingsGoal);
  savingsGoalRouter.get("/", savingsGoalController.getSavingsGoals);
  savingsGoalRouter.get("/:goalId", savingsGoalController.getSavingsGoalById);
  savingsGoalRouter.put("/:goalId", savingsGoalController.updateSavingsGoal);
  savingsGoalRouter.delete("/:goalId", savingsGoalController.deleteSavingsGoal);

  expressApp.use("/v1/savings-goals", authenticateUser, savingsGoalRouter);
}
