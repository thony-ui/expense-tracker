import axiosInstance from "@/lib/axios";
import { IInvestmentOverTime } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

const baseUrl = "/v1/investments/over-time";

interface TInvestmentOverTimeOptions {
  userName?: string;
  date?: string;
  type?: "yearly" | "monthly" | "weekly" | "daily";
}

export function useGetInvestmentsOverTime(
  options?: TInvestmentOverTimeOptions
) {
  return useQuery({
    queryKey: [baseUrl, options?.userName, options?.type, options?.date],
    queryFn: async () => {
      const response = await axiosInstance.get<IInvestmentOverTime[]>(baseUrl, {
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
