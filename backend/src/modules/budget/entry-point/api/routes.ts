import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import { BudgetRepository } from "../../domain/budget.repository";
import { BudgetService } from "../../domain/budget.service";
import { BudgetController } from "../../domain/budget.controller";

export function defineBudgetRoutes(expressApp: Application) {
  const budgetRouter = Router();
  const budgetRepository = new BudgetRepository();
  const budgetService = new BudgetService(budgetRepository);
  const budgetController = new BudgetController(budgetService);

  budgetRouter.post("/", budgetController.createBudget);
  budgetRouter.get("/", budgetController.getBudgets);
  budgetRouter.get("/:budgetId", budgetController.getBudgetById);
  budgetRouter.put("/:budgetId", budgetController.updateBudget);
  budgetRouter.delete("/:budgetId", budgetController.deleteBudget);

  expressApp.use("/v1/budgets", authenticateUser, budgetRouter);
}
