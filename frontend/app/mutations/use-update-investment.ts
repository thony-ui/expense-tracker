import axiosInstance from "@/lib/axios";
import { IInvestment } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";
import { invalidateInvestments } from "../queries/use-get-investments";
import { invalidateAggregatedInvestments } from "../queries/use-get-aggregated-investments";
import { invalidateInvestmentStats } from "../queries/use-get-investment-stats";

const baseUrl = "/v1/investments";

export function useUpdateInvestment() {
  return useMutation({
    mutationKey: [baseUrl, "update"],
    mutationFn: async ({
      id,
      ...payload
    }: Partial<IInvestment> & { id: string }) => {
      const response = await axiosInstance.put(`${baseUrl}/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      invalidateInvestments();
      invalidateAggregatedInvestments();
      invalidateInvestmentStats();
    },
  });
}
