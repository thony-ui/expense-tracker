export interface IExpense {
  userId: string;
  type: string;
  amount: number;
  name: string;
  description: string;
  category: string;
  date: string;
}

export interface IGetExpenses {
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
  }: IExpense) => Promise<void>;

  getExpensesFromDatabase: (userId: string) => Promise<IGetExpenses[]>;
}
