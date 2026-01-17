import axiosInstance from "@/lib/axios";
import { IBudget } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/budgets";

export function useGetBudgets() {
  return useQuery({
    queryKey: [baseUrl],
    queryFn: async () => {
      const response = await axiosInstance.get<IBudget[]>(baseUrl);
      return response.data;
    },
  });
}

export function invalidateBudgets() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
