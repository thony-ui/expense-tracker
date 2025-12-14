import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { invalidateInvestments } from "../queries/use-get-investments";
import { invalidateAggregatedInvestments } from "../queries/use-get-aggregated-investments";
import { invalidateInvestmentStats } from "../queries/use-get-investment-stats";

const baseUrl = "/v1/investments";

export function useDeleteInvestment() {
  return useMutation({
    mutationKey: [baseUrl, "delete"],
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`${baseUrl}/${id}`);
      return response.data;
    },
    onSuccess: () => {
      invalidateInvestments();
      invalidateAggregatedInvestments();
      invalidateInvestmentStats();
    },
  });
}
