import axiosInstance from "@/lib/axios";
import { IInvestmentStats } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/investments/stats";

interface TInvestmentStatsOptions {
  userName?: string;
  date?: string;
  type?: "yearly" | "monthly" | "weekly" | "daily";
}

export function useGetInvestmentStats(options?: TInvestmentStatsOptions) {
  return useQuery({
    queryKey: [baseUrl, options?.userName, options?.type, options?.date],
    queryFn: async () => {
      const response = await axiosInstance.get<IInvestmentStats>(baseUrl, {
        params: {
          userName: options?.userName ?? undefined,
          type: options?.type ?? undefined,
          date: options?.date ?? undefined,
        },
      });
      return response.data;
    },
  });
}

export function invalidateInvestmentStats() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
