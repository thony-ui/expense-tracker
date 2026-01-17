import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { BudgetService } from "./budget.service";
import {
  validateCreateBudget,
  validateGetBudgets,
  validateGetBudgetById,
  validateUpdateBudget,
  validateDeleteBudget,
} from "./budget.validator";

export class BudgetController {
  constructor(private budgetService: BudgetService) {}

  createBudget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      const budgetData = validateCreateBudget({
        ...req.body,
        userId,
      });

      logger.info(
        `BudgetController: createBudget called with name: ${budgetData.name}, amount: ${budgetData.amount}`
      );

      await this.budgetService.createBudget(budgetData);
      res.status(201).send({ message: "Budget created successfully" });
    } catch (error) {
      next(error);
    }
  };

  getBudgets = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      const { userId: id } = validateGetBudgets({ userId });

      logger.info(`BudgetController: getBudgets called for userId: ${id}`);

      const budgets = await this.budgetService.getBudgets(id);
      res.status(200).send(budgets);
    } catch (error) {
      next(error);
    }
  };

  getBudgetById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { budgetId } = req.params;
    try {
      const { budgetId: id, userId: uid } = validateGetBudgetById({
        budgetId,
        userId,
      });

      logger.info(`BudgetController: getBudgetById called for budgetId: ${id}`);

      const budget = await this.budgetService.getBudgetById(id, uid);

      if (!budget) {
        res.status(404).send({ message: "Budget not found" });
        return;
      }

      res.status(200).send(budget);
    } catch (error) {
      next(error);
    }
  };

  updateBudget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { budgetId } = req.params;
    try {
      const budgetData = validateUpdateBudget({
        budgetId,
        userId,
        ...req.body,
      });

      logger.info(
        `BudgetController: updateBudget called for budgetId: ${budgetId}`
      );

      await this.budgetService.updateBudget(budgetData);
      res.status(200).send({ message: "Budget updated successfully" });
    } catch (error) {
      next(error);
    }
  };

  deleteBudget = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const userId = req.user.id;
    const { budgetId } = req.params;
    try {
      const { budgetId: id, userId: uid } = validateDeleteBudget({
        budgetId,
        userId,
      });

      logger.info(`BudgetController: deleteBudget called for budgetId: ${id}`);

      await this.budgetService.deleteBudget(id, uid);
      res.status(200).send({ message: "Budget deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}
