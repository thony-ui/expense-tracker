export interface IExpense {
  userId: string;
  type: string;
  amount: number;
  name: string;
  description: string;
  category: string;
  date: string;
}
export interface IExpenseService {
  addExpenseToDatabase: ({
    userId,
    type,
    amount,
    name,
    description,
    category,
    date,
  }: {
    userId: string;
    type: string;
    amount: number;
    name: string;
    description: string;
    category: string;
    date: string;
  }) => Promise<void>;
}
