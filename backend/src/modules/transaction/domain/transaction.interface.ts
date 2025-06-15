export interface ITransaction {
  userId: string;
  type: string;
  amount: number;
  name: string;
  description: string;
  category: string;
  date: string;
}

export interface IGetTransactions {
  type: string;
  amount: number;
  name: string;
  description: string;
  category: string;
  date: string;
}
export interface ITransactionService {
  addTransactionToDatabase: ({
    userId,
    type,
    amount,
    name,
    description,
    category,
    date,
  }: ITransaction) => Promise<void>;

  getTransactionsFromDatabase: (
    userId: string,
    transactionType?: string
  ) => Promise<IGetTransactions[]>;
}
