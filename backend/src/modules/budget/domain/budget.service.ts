import logger from "../../../logger";
import {
  IBudgetService,
  ICreateBudget,
  IUpdateBudget,
  IBudgetWithSpent,
} from "./budget.interface";
import { BudgetRepository } from "./budget.repository";

export class BudgetService implements IBudgetService {
  constructor(private budgetRepository: BudgetRepository) {}

  async createBudget(budget: ICreateBudget): Promise<void> {
    logger.info(
      `BudgetService: createBudget called with name: ${budget.name}, amount: ${budget.amount}`
    );
    await this.budgetRepository.createBudget(budget);
  }

  async getBudgets(userId: string): Promise<IBudgetWithSpent[]> {
    logger.info(`BudgetService: getBudgets called for userId: ${userId}`);
    return await this.budgetRepository.getBudgets(userId);
  }

  async getBudgetById(
    budgetId: string,
    userId: string
  ): Promise<IBudgetWithSpent | null> {
    logger.info(
      `BudgetService: getBudgetById called for budgetId: ${budgetId}`
    );
    return await this.budgetRepository.getBudgetById(budgetId, userId);
  }

  async updateBudget(budget: IUpdateBudget): Promise<void> {
    logger.info(
      `BudgetService: updateBudget called for budgetId: ${budget.budgetId}`
    );
    await this.budgetRepository.updateBudget(budget);
  }

  async deleteBudget(budgetId: string, userId: string): Promise<void> {
    logger.info(`BudgetService: deleteBudget called for budgetId: ${budgetId}`);
    await this.budgetRepository.deleteBudget(budgetId, userId);
  }
}
