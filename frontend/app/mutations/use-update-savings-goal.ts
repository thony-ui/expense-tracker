import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { invalidateSavingsGoals } from "../queries/use-get-savings-goals";

const baseUrl = "/v1/savings-goals";

interface IUpdateSavingsGoal {
  goalId: string;
  updatedGoal: {
    title?: string;
    targetAmount?: number;
    currentAmount?: number;
    deadline?: string;
    category?: string;
  };
}

export function useUpdateSavingsGoal() {
  return useMutation({
    mutationFn: async ({ goalId, updatedGoal }: IUpdateSavingsGoal) => {
      const response = await axiosInstance.put(
        `${baseUrl}/${goalId}`,
        updatedGoal
      );
      return response.data;
    },
    onSuccess: () => {
      invalidateSavingsGoals();
    },
  });
}
