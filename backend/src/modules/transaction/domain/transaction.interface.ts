export interface ITransaction {
  userId: string;
  type: string;
  amount: number;
  name: string;
  description: string;
  category: string;
  date: string;

  base_currency: string;
  converted_currency: string;
  base_amount: number;
  converted_amount: number;
  exchange_rate: number;
}

export interface IGetTransactions {
  type: string;
  amount: number;
  name: string;
  description: string;
  category: string;
  date: string;

  base_currency: string;
  converted_currency: string;
  base_amount: number;
  converted_amount: number;
  exchange_rate: number;
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

  getYearlyTransactionsFromDatabase: (
    userId: string,
    transactionType?: string
  ) => Promise<IGetTransactions[]>;
  getMonthlyTransactionsFromDatabase: (
    userId: string,
    transactionType?: string
  ) => Promise<IGetTransactions[]>;

  getWeeklyTransactionsFromDatabase: (
    userId: string,
    transactionType?: string
  ) => Promise<IGetTransactions[]>;
  getDailyTransactionsFromDatabase: (
    userId: string,
    transactionType?: string
  ) => Promise<IGetTransactions[]>;

  deleteTransactionFromDatabase: (
    transactionId: string,
    userId: string
  ) => Promise<void>;
  updateTransactionInDatabase: (
    transactionId: string,
    userId: string,
    updatedTransaction: ITransaction
  ) => Promise<void>;
  getTransactionByIdFromDatabase: (
    transactionId: string,
    userId: string
  ) => Promise<IGetTransactions>;
}
