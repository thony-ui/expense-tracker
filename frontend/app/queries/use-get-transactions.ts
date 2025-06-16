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

export function useGetYearlyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "yearly", options?.transactionType],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/yearly`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}
export function useGetMonthlyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "monthly", options?.transactionType],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/monthly`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}
export function useGetWeeklyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "weekly", options?.transactionType],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/weekly`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}
export function useGetDailyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "daily", options?.transactionType],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/daily`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}

export function invalidateTransactions() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
