import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/transactions";

export function usePostTransaction() {
  return useMutation({
    mutationKey: [baseUrl],
    mutationFn: async (payload: Omit<ITransaction, "id">) => {
      const response = await axiosInstance.post(baseUrl, payload);
      return response.data;
    },
  });
}
