import logger from "../../../logger";
import { ISavingsGoal, ISavingsGoalService } from "./savings-goal.interface";
import { SavingsGoalRepository } from "./savings-goal.repository";

export class SavingsGoalService implements ISavingsGoalService {
  constructor(private savingsGoalRepository: SavingsGoalRepository) {}

  addSavingsGoalToDatabase = async (savingsGoal: ISavingsGoal) => {
    logger.info(
      `SavingsGoalService: addSavingsGoalToDatabase called with title: ${savingsGoal.title}, targetAmount: ${savingsGoal.targetAmount}, userId: ${savingsGoal.userId}`
    );
    await this.savingsGoalRepository.addSavingsGoalToDatabase(savingsGoal);
  };

  getSavingsGoalsFromDatabase = async (userId: string) => {
    logger.info(
      `SavingsGoalService: getSavingsGoalsFromDatabase called for userId: ${userId}`
    );
    const goals = await this.savingsGoalRepository.getSavingsGoalsFromDatabase(
      userId
    );
    return goals;
  };

  getSavingsGoalByIdFromDatabase = async (goalId: string, userId: string) => {
    logger.info(
      `SavingsGoalService: getSavingsGoalByIdFromDatabase called for goalId: ${goalId}, userId: ${userId}`
    );
    const goal =
      await this.savingsGoalRepository.getSavingsGoalByIdFromDatabase(
        goalId,
        userId
      );
    return goal;
  };

  updateSavingsGoalInDatabase = async (
    goalId: string,
    userId: string,
    updatedGoal: Partial<ISavingsGoal>
  ) => {
    logger.info(
      `SavingsGoalService: updateSavingsGoalInDatabase called for goalId: ${goalId}, userId: ${userId}`
    );
    await this.savingsGoalRepository.updateSavingsGoalInDatabase(
      goalId,
      userId,
      updatedGoal
    );
  };

  deleteSavingsGoalFromDatabase = async (goalId: string, userId: string) => {
    logger.info(
      `SavingsGoalService: deleteSavingsGoalFromDatabase called for goalId: ${goalId}, userId: ${userId}`
    );
    await this.savingsGoalRepository.deleteSavingsGoalFromDatabase(
      goalId,
      userId
    );
  };
}
