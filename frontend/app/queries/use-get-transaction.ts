import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/transactions";

export function useGetTransaction(transactionId: string) {
  return useQuery({
    queryKey: ["transaction", transactionId],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction>(
        `${baseUrl}/${transactionId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch transaction");
      }
      return response.data;
    },
    enabled: !!transactionId,
  });
}

export function useGetTransactionsBySavingsGoalIds(savingsGoalIds: string[]) {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const params = new URLSearchParams();
      savingsGoalIds.forEach((id) => params.append("savingsGoalIds", id));
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/savings-goal?${params.toString()}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch transactions");
      }
      return response.data;
    },
    enabled: !!savingsGoalIds.length,
  });
}

export function invalidateGetTransaction(transactionId: string) {
  return queryClient.invalidateQueries({
    queryKey: ["transaction", transactionId],
  });
}

export function invalidateGetTransactionsBySavingsGoalId(
  savingsGoalId: string
) {
  return queryClient.invalidateQueries({
    queryKey: ["transactions", savingsGoalId],
  });
}
