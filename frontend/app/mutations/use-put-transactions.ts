import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/transactions";

export function useUpdateTransactions(transactionIds: string[]) {
  return useMutation({
    mutationKey: [baseUrl],
    mutationFn: async () => {
      const response = await axiosInstance.put<ITransaction>(`${baseUrl}`, {
        transactionIds: transactionIds,
      });
      return response.data;
    },
  });
}
