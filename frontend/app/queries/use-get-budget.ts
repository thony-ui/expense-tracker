import axiosInstance from "@/lib/axios";
import { IBudget } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const baseUrl = "/v1/budgets";

export function useGetBudget(budgetId?: string) {
  return useQuery({
    queryKey: [baseUrl, budgetId],
    queryFn: async () => {
      if (!budgetId) return null;
      const response = await axiosInstance.get<IBudget>(
        `${baseUrl}/${budgetId}`
      );
      return response.data;
    },
    enabled: !!budgetId,
  });
}
