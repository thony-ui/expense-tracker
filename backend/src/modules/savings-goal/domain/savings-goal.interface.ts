export interface ISavingsGoal {
  userId: string;
  title: string;
  targetAmount: number;
  deadline: string;
  category?: string;
}

export interface IGetSavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  deadline: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ISavingsGoalService {
  addSavingsGoalToDatabase: (savingsGoal: ISavingsGoal) => Promise<void>;

  getSavingsGoalsFromDatabase: (userId: string) => Promise<IGetSavingsGoal[]>;

  getSavingsGoalByIdFromDatabase: (
    goalId: string,
    userId: string
  ) => Promise<IGetSavingsGoal>;

  updateSavingsGoalInDatabase: (
    goalId: string,
    userId: string,
    updatedGoal: Partial<ISavingsGoal>
  ) => Promise<void>;

  deleteSavingsGoalFromDatabase: (
    goalId: string,
    userId: string
  ) => Promise<void>;
}
