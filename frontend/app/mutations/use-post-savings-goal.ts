import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { invalidateSavingsGoals } from "../queries/use-get-savings-goals";

const baseUrl = "/v1/savings-goals";

interface IPostSavingsGoal {
  title: string;
  targetAmount: number;
  deadline: string;
  category?: string;
}

export function usePostSavingsGoal() {
  return useMutation({
    mutationFn: async (savingsGoal: IPostSavingsGoal) => {
      const response = await axiosInstance.post(baseUrl, savingsGoal);
      return response.data;
    },
    onSuccess: () => {
      invalidateSavingsGoals();
    },
  });
}
