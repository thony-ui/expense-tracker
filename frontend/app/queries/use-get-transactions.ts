import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/transactions";

interface TTransactionOptions {
  transactionType?: string;
  limit?: number;

  offSet?: number;

  date?: string;

  type?: "yearly" | "monthly" | "weekly" | "daily" | "all";
}

export function useGetTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [
      baseUrl,
      options?.transactionType,
      options?.limit,
      options?.offSet,
      options?.type,
      options?.date,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(baseUrl, {
        params: {
          transactionType: options?.transactionType ?? undefined,
          limit: options?.limit ?? undefined,
          offSet: options?.offSet ?? undefined,
          type: options?.type ?? undefined,
          date: options?.date ?? undefined,
        },
      });
      return response.data;
    },
  });
}

export function useGetTransactionsByBudgetId(budgetId: string) {
  return useQuery({
    queryKey: [baseUrl, "budget", budgetId],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/budgets/${budgetId}`,
      );
      return response.data;
    },
    enabled: !!budgetId,
  });
}

export function useGetTransactionsBySavingsGoalId(goalId: string) {
  return useQuery({
    queryKey: [baseUrl, "savings-goal", goalId],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("savingsGoalIds", goalId);

      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/savings-goal?${params.toString()}`,
      );
      return response.data;
    },
    enabled: !!goalId,
  });
}

export function invalidateTransactions() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
