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
