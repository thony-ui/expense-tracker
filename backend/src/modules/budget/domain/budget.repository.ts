import supabaseClient from "../../../lib/supabase-client";
import logger from "../../../logger";
import {
  IBudgetRepository,
  ICreateBudget,
  IUpdateBudget,
  IBudgetWithSpent,
  IBudget,
} from "./budget.interface";

export class BudgetRepository implements IBudgetRepository {
  async createBudget(budget: ICreateBudget): Promise<void> {
    logger.info(
      `BudgetRepository: createBudget called with name: ${budget.name}, amount: ${budget.amount}, userId: ${budget.userId}`
    );

    const { error } = await supabaseClient.from("budgets").insert({
      user_id: budget.userId,
      name: budget.name,
      amount: budget.amount,
      period_type: budget.periodType,
      start_date: budget.startDate,
      end_date: budget.endDate,
    });

    if (error) {
      logger.error(`BudgetRepository: createBudget error: ${error.message}`);
      throw new Error(error.message);
    }

    logger.info("BudgetRepository: createBudget successful");
  }

  async getBudgets(userId: string): Promise<IBudgetWithSpent[]> {
    logger.info(`BudgetRepository: getBudgets called for userId: ${userId}`);

    const { data, error } = await supabaseClient
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error(`BudgetRepository: getBudgets error: ${error.message}`);
      throw new Error(error.message);
    }

    // Calculate spent amount for each budget
    const budgetsWithSpent = await Promise.all(
      (data || []).map(async (budget) => {
        const spent = await this.getBudgetSpent(
          budget.id,
          budget.start_date,
          budget.end_date
        );

        return this.mapBudgetWithSpent(budget, spent);
      })
    );

    logger.info(
      `BudgetRepository: getBudgets successful, found ${budgetsWithSpent.length} budgets`
    );
    return budgetsWithSpent;
  }

  async getBudgetById(
    budgetId: string,
    userId: string
  ): Promise<IBudgetWithSpent | null> {
    logger.info(
      `BudgetRepository: getBudgetById called for budgetId: ${budgetId}, userId: ${userId}`
    );

    const { data, error } = await supabaseClient
      .from("budgets")
      .select("*")
      .eq("id", budgetId)
      .eq("user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        logger.info("BudgetRepository: getBudgetById not found");
        return null;
      }
      logger.error(`BudgetRepository: getBudgetById error: ${error.message}`);
      throw new Error(error.message);
    }

    const spent = await this.getBudgetSpent(
      data.id,
      data.start_date,
      data.end_date
    );

    logger.info("BudgetRepository: getBudgetById successful");
    return this.mapBudgetWithSpent(data, spent);
  }

  async updateBudget(budget: IUpdateBudget): Promise<void> {
    logger.info(
      `BudgetRepository: updateBudget called for budgetId: ${budget.budgetId}`
    );

    const updateData: any = {};
    if (budget.name !== undefined) updateData.name = budget.name;
    if (budget.amount !== undefined) updateData.amount = budget.amount;
    if (budget.periodType !== undefined)
      updateData.period_type = budget.periodType;
    if (budget.startDate !== undefined)
      updateData.start_date = budget.startDate;
    if (budget.endDate !== undefined) updateData.end_date = budget.endDate;

    const { error } = await supabaseClient
      .from("budgets")
      .update(updateData)
      .eq("id", budget.budgetId)
      .eq("user_id", budget.userId);

    if (error) {
      logger.error(`BudgetRepository: updateBudget error: ${error.message}`);
      throw new Error(error.message);
    }

    logger.info("BudgetRepository: updateBudget successful");
  }

  async deleteBudget(budgetId: string, userId: string): Promise<void> {
    logger.info(
      `BudgetRepository: deleteBudget called for budgetId: ${budgetId}, userId: ${userId}`
    );

    const { error } = await supabaseClient
      .from("budgets")
      .delete()
      .eq("id", budgetId)
      .eq("user_id", userId);

    if (error) {
      logger.error(`BudgetRepository: deleteBudget error: ${error.message}`);
      throw new Error(error.message);
    }

    logger.info("BudgetRepository: deleteBudget successful");
  }

  async getBudgetSpent(
    budgetId: string,
    startDate: string,
    endDate: string
  ): Promise<number> {
    logger.info(
      `BudgetRepository: getBudgetSpent called for budgetId: ${budgetId}`
    );

    const { data, error } = await supabaseClient
      .from("transactions")
      .select("amount")
      .eq("budgetId", budgetId)
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      logger.error(`BudgetRepository: getBudgetSpent error: ${error.message}`);
      throw new Error(error.message);
    }

    const spent = (data || []).reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    logger.info(`BudgetRepository: getBudgetSpent successful, spent: ${spent}`);
    return spent;
  }

  private mapBudgetWithSpent(budget: any, spent: number): IBudgetWithSpent {
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    return {
      id: budget.id,
      userId: budget.user_id,
      name: budget.name,
      amount: budget.amount,
      periodType: budget.period_type,
      startDate: budget.start_date,
      endDate: budget.end_date,
      createdAt: budget.created_at,
      spent,
      remaining,
      percentage,
    };
  }
}
