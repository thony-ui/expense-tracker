export type PeriodType = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface IBudget {
  id?: string;
  userId: string;
  name: string;
  amount: number;
  periodType: PeriodType;
  startDate: string;
  endDate: string;
  createdAt?: string;
}

export interface IBudgetWithSpent extends IBudget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface ICreateBudget {
  userId: string;
  name: string;
  amount: number;
  periodType: PeriodType;
  startDate: string;
  endDate: string;
}

export interface IUpdateBudget {
  budgetId: string;
  userId: string;
  name?: string;
  amount?: number;
  periodType?: PeriodType;
  startDate?: string;
  endDate?: string;
}

export interface IBudgetRepository {
  createBudget(budget: ICreateBudget): Promise<void>;
  getBudgets(userId: string): Promise<IBudgetWithSpent[]>;
  getBudgetById(
    budgetId: string,
    userId: string
  ): Promise<IBudgetWithSpent | null>;
  updateBudget(budget: IUpdateBudget): Promise<void>;
  deleteBudget(budgetId: string, userId: string): Promise<void>;
  getBudgetSpent(
    budgetId: string,
    startDate: string,
    endDate: string
  ): Promise<number>;
}

export interface IBudgetService {
  createBudget(budget: ICreateBudget): Promise<void>;
  getBudgets(userId: string): Promise<IBudgetWithSpent[]>;
  getBudgetById(
    budgetId: string,
    userId: string
  ): Promise<IBudgetWithSpent | null>;
  updateBudget(budget: IUpdateBudget): Promise<void>;
  deleteBudget(budgetId: string, userId: string): Promise<void>;
}
