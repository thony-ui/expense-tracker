export interface ITransaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: "income" | "expense";
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
