export interface IInvestment {
  id?: string;
  userId: string;
  userName: string;
  stock: string;
  amountInSGD: number;
  date: string;
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

export interface IInvestmentService {
  addInvestmentToDatabase: (
    investment: IInvestment,
    userId: string
  ) => Promise<void>;

  getInvestmentsFromDatabase: (
    userId: string,
    userName?: string,
    limit?: number,
    offSet?: number,
    categoryType?: string,
    dateToFilter?: string
  ) => Promise<IInvestment[]>;

  getInvestmentStatsFromDatabase: (
    userId: string,
    userName?: string,
    categoryType?: string,
    dateToFilter?: string
  ) => Promise<IInvestmentStats>;

  getInvestmentsOverTimeFromDatabase: (
    userId: string,
    type: "yearly" | "monthly" | "weekly" | "daily",
    date: string,
    userName?: string
  ) => Promise<IInvestmentOverTime[]>;

  getAggregatedInvestmentsFromDatabase: (
    userId: string
  ) => Promise<IInvestmentAggregated[]>;

  getUniqueStocksFromDatabase: (userId: string) => Promise<string[]>;

  updateInvestmentInDatabase: (
    userId: string,
    investmentId: string,
    updatedInvestment: Partial<IInvestment>
  ) => Promise<void>;

  deleteInvestmentFromDatabase: (
    userId: string,
    investmentId: string
  ) => Promise<void>;

  getInvestmentByIdFromDatabase: (
    userId: string,
    investmentId: string
  ) => Promise<IInvestment>;
}
