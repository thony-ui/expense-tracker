import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/transactions";

interface TTransactionOptions {
  transactionType?: string;
}

export function useGetTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, options?.transactionType],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(baseUrl, {
        params: {
          transactionType: options?.transactionType ?? undefined,
        },
      });
      return response.data;
    },
  });
}

export function invalidateTransactions() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
