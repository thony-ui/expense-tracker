import axiosInstance from "@/lib/axios";
import { IInvestmentAggregated } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/investments/aggregated";

export function useGetAggregatedInvestments() {
  return useQuery({
    queryKey: [baseUrl],
    queryFn: async () => {
      const response = await axiosInstance.get<IInvestmentAggregated[]>(
        baseUrl
      );
      return response.data;
    },
  });
}

export function invalidateAggregatedInvestments() {
  queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
