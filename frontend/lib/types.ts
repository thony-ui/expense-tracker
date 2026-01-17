export interface ITransaction {
  id: string;
  name: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";

  base_currency: string;
  converted_currency: string;
  base_amount: number;
  converted_amount: number;
  exchange_rate: number;

  savingsGoalId?: string;
  budgetId?: string;

  savings_goals?: {
    id: string;
    title: string;
  };

  budgets?: {
    id: string;
    name: string;
  };
}

export interface ICategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface IDashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
}

export interface IChartData {
  name: string;
  value: number;
  color?: string;
}

export interface IInvestment {
  id: string;
  userName: string;
  stock: string;
  amountInSGD: number;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface IInvestmentStats {
  totalInvestmentsSGD: number;
  totalStocks: number;
  averageInvestmentSGD: number;
}

export interface IInvestmentOverTime {
  period: string;
  totalSGD: number;
}

export interface IInvestmentAggregated {
  stock: string;
  Anthony: number;
  Albert: number;
  Juliana: number;
}

export type PeriodType = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export interface IBudget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  periodType: PeriodType;
  startDate: string;
  endDate: string;
  createdAt: string;
  spent: number;
  remaining: number;
  percentage: number;
}

export interface ICreateBudget {
  name: string;
  amount: number;
  periodType: PeriodType;
  startDate: string;
  endDate: string;
}

export interface IUpdateBudget {
  name?: string;
  amount?: number;
  periodType?: PeriodType;
  startDate?: string;
  endDate?: string;
}
