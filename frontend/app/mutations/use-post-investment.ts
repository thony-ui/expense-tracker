import axiosInstance from "@/lib/axios";
import { IInvestment } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { invalidateInvestments } from "../queries/use-get-investments";
import { invalidateAggregatedInvestments } from "../queries/use-get-aggregated-investments";
import { invalidateInvestmentStats } from "../queries/use-get-investment-stats";

const baseUrl = "/v1/investments";

export function usePostInvestment() {
  return useMutation({
    mutationKey: [baseUrl],
    mutationFn: async (
      payload: Omit<IInvestment, "id" | "created_at" | "updated_at">
    ) => {
      const response = await axiosInstance.post(baseUrl, payload);
      return response.data;
    },
    onSuccess: () => {
      invalidateInvestments();
      invalidateAggregatedInvestments();
      invalidateInvestmentStats();
    },
  });
}
