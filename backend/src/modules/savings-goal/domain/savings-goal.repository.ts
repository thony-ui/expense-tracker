import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import {
  ISavingsGoal,
  ISavingsGoalService,
  IGetSavingsGoal,
} from "./savings-goal.interface";

export class SavingsGoalRepository implements ISavingsGoalService {
  addSavingsGoalToDatabase = async ({
    userId,
    title,
    targetAmount,
    deadline,
    category,
  }: ISavingsGoal) => {
    const { data, error } = await supabase
      .from("savings_goals")
      .insert([
        {
          userId,
          title,
          targetAmount,
          deadline,
          category,
        },
      ])
      .select();

    if (error) {
      logger.error(
        `SavingsGoalRepository: addSavingsGoalToDatabase error: ${error.message}`
      );
      throw new Error("Error adding savings goal to database");
    }

    logger.info(
      `SavingsGoalRepository: addSavingsGoalToDatabase success: ${data}`
    );
  };

  getSavingsGoalsFromDatabase = async (
    userId: string
  ): Promise<IGetSavingsGoal[]> => {
    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("userId", userId)
      .order("createdAt", { ascending: false });

    if (error) {
      logger.error(
        `SavingsGoalRepository: getSavingsGoalsFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching savings goals from database");
    }

    logger.info(
      `SavingsGoalRepository: getSavingsGoalsFromDatabase success: ${data?.length} goals`
    );
    return data as IGetSavingsGoal[];
  };

  getSavingsGoalByIdFromDatabase = async (
    goalId: string,
    userId: string
  ): Promise<IGetSavingsGoal> => {
    const { data, error } = await supabase
      .from("savings_goals")
      .select("*")
      .eq("id", goalId)
      .eq("userId", userId)
      .single();

    if (error) {
      logger.error(
        `SavingsGoalRepository: getSavingsGoalByIdFromDatabase error: ${error.message}`
      );
      throw new Error("Error fetching savings goal by ID from database");
    }

    logger.info(
      `SavingsGoalRepository: getSavingsGoalByIdFromDatabase success: ${data}`
    );
    return data as IGetSavingsGoal;
  };

  updateSavingsGoalInDatabase = async (
    goalId: string,
    userId: string,
    updatedGoal: Partial<ISavingsGoal>
  ) => {
    const { data, error } = await supabase
      .from("savings_goals")
      .update(updatedGoal)
      .eq("id", goalId)
      .eq("userId", userId)
      .select();

    if (error) {
      logger.error(
        `SavingsGoalRepository: updateSavingsGoalInDatabase error: ${error.message}`
      );
      throw new Error("Error updating savings goal in database");
    }

    logger.info(
      `SavingsGoalRepository: updateSavingsGoalInDatabase success: ${data}`
    );
  };

  deleteSavingsGoalFromDatabase = async (goalId: string, userId: string) => {
    const { data, error } = await supabase
      .from("savings_goals")
      .delete()
      .eq("id", goalId)
      .eq("userId", userId);

    if (error) {
      logger.error(
        `SavingsGoalRepository: deleteSavingsGoalFromDatabase error: ${error.message}`
      );
      throw new Error("Error deleting savings goal from database");
    }

    logger.info(
      `SavingsGoalRepository: deleteSavingsGoalFromDatabase success: ${data}`
    );
  };
}
