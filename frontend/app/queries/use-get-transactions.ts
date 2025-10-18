import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/transactions";

interface TTransactionOptions {
  transactionType?: string;
  limit?: number;

  offSet?: number;

  date?: string;
}

export function useGetTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [
      baseUrl,
      options?.transactionType,
      options?.limit,
      options?.offSet,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(baseUrl, {
        params: {
          transactionType: options?.transactionType ?? undefined,
          limit: options?.limit ?? undefined,
          offSet: options?.offSet ?? undefined,
        },
      });
      return response.data;
    },
  });
}

export function useGetYearlyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "yearly", options?.transactionType, options?.date],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/yearly`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
            date: options?.date ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}
export function useGetMonthlyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "monthly", options?.transactionType, options?.date],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/monthly`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
            date: options?.date ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}
export function useGetWeeklyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "weekly", options?.transactionType, options?.date],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/weekly`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
            date: options?.date ?? undefined,
          },
        }
      );
      return response.data;
    },
  });
}
export function useGetDailyTransactions(options?: TTransactionOptions) {
  return useQuery({
    queryKey: [baseUrl, "daily", options?.transactionType, options?.date],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(
        `${baseUrl}/daily`,
        {
          params: {
            transactionType: options?.transactionType ?? undefined,
            date: options?.date ?? undefined,
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
