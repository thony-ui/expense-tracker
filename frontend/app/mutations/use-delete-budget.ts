import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/budgets";

export function useDeleteBudget(budgetId: string) {
  return useMutation({
    mutationKey: [baseUrl, budgetId],
    mutationFn: async () => {
      const response = await axiosInstance.delete(`${baseUrl}/${budgetId}`);
      return response.data;
    },
  });
}
