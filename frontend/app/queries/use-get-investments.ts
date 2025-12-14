import axiosInstance from "@/lib/axios";
import { IInvestment } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/investments";

interface TInvestmentOptions {
  userName?: string;
  limit?: number;
  offSet?: number;
  date?: string;
  type?: "yearly" | "monthly" | "weekly" | "daily";
}

export function useGetInvestments(options?: TInvestmentOptions) {
  return useQuery({
    queryKey: [
      baseUrl,
      options?.userName,
      options?.limit,
      options?.offSet,
      options?.type,
      options?.date,
    ],
    queryFn: async () => {
      const response = await axiosInstance.get<IInvestment[]>(baseUrl, {
        params: {
          userName: options?.userName ?? undefined,
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

export function invalidateInvestments() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
