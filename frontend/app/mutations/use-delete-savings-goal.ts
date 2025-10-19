import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { invalidateSavingsGoals } from "../queries/use-get-savings-goals";

const baseUrl = "/v1/savings-goals";

export function useDeleteSavingsGoal() {
  return useMutation({
    mutationFn: async (goalId: string) => {
      const response = await axiosInstance.delete(`${baseUrl}/${goalId}`);
      return response.data;
    },
    onSuccess: () => {
      invalidateSavingsGoals();
    },
  });
}
