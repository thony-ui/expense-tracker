import type { ITransaction, IDashboardStats } from "./types";

export const mockTransactions: ITransaction[] = [
  {
    id: "1",
    amount: 3500,
    description: "Monthly Salary",
    category: "Salary",
    date: "2024-01-01",
    type: "income",
  },
  {
    id: "2",
    amount: 85.5,
    description: "Grocery Shopping",
    category: "Food & Dining",
    date: "2024-01-02",
    type: "expense",
  },
  {
    id: "3",
    amount: 45.0,
    description: "Gas Station",
    category: "Transportation",
    date: "2024-01-03",
    type: "expense",
  },
  {
    id: "4",
    amount: 120.0,
    description: "Electric Bill",
    category: "Bills & Utilities",
    date: "2024-01-04",
    type: "expense",
  },
  {
    id: "5",
    amount: 25.99,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: "2024-01-05",
    type: "expense",
  },
  {
    id: "6",
    amount: 200.0,
    description: "Freelance Project",
    category: "Freelance",
    date: "2024-01-06",
    type: "income",
  },
];

export const mockStats: IDashboardStats = {
  totalIncome: 3700,
  totalExpenses: 276.49,
  balance: 3423.51,
  transactionCount: 6,
};
