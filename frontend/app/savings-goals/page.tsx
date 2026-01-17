"use client";

import { DashBoardAndTransactionLayout } from "../_components/layout/dashboard-and-transaction-layout";
import { SavingsGoalCard } from "../_components/goals/savings-goal-card";
import { useGetSavingsGoals } from "../queries/use-get-savings-goals";
import { usePostSavingsGoal } from "../mutations/use-post-savings-goal";
import { useUpdateSavingsGoal } from "../mutations/use-update-savings-goal";
import { toast } from "react-toastify";

export default function SavingsGoalsPage() {
  const { data: savingsGoals = [] } = useGetSavingsGoals();
  const { mutateAsync: postSavingsGoal } = usePostSavingsGoal();
  const { mutateAsync: updateSavingsGoal } = useUpdateSavingsGoal();

  const handleAddGoal = async (goal: {
    title: string;
    targetAmount: number;
    deadline: string;
    category?: string;
  }) => {
    try {
      await postSavingsGoal({
        ...goal,
      });
      toast.success("Savings goal created!");
    } catch (error) {
      toast.error("Failed to create savings goal");
    }
  };

  const handleEditGoal = async (
    id: string,
    goal: {
      title?: string;
      targetAmount?: number;
      deadline?: string;
      category?: string;
    }
  ) => {
    try {
      await updateSavingsGoal({
        goalId: id,
        updatedGoal: goal,
      });
      toast.success("Goal updated!");
    } catch (error) {
      toast.error("Failed to update goal");
    }
  };

  return (
    <DashBoardAndTransactionLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Savings Goals
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your financial goals
          </p>
        </div>

        <SavingsGoalCard
          goals={savingsGoals}
          onAddGoal={handleAddGoal}
          onEditGoal={handleEditGoal}
        />
      </div>
    </DashBoardAndTransactionLayout>
  );
}
