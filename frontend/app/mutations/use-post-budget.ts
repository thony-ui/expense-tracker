import axiosInstance from "@/lib/axios";
import { ICreateBudget } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/budgets";

export function usePostBudget() {
  return useMutation({
    mutationKey: [baseUrl],
    mutationFn: async (payload: ICreateBudget) => {
      const response = await axiosInstance.post(baseUrl, payload);
      return response.data;
    },
  });
}
