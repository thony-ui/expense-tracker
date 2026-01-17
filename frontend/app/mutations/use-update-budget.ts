import axiosInstance from "@/lib/axios";
import { IUpdateBudget } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/budgets";

export function useUpdateBudget(budgetId: string) {
  return useMutation({
    mutationKey: [baseUrl, budgetId],
    mutationFn: async (payload: IUpdateBudget) => {
      const response = await axiosInstance.put(
        `${baseUrl}/${budgetId}`,
        payload
      );
      return response.data;
    },
  });
}
