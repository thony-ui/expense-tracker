import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/transactions";

export function useUpdateTransaction() {
  return useMutation({
    mutationFn: async ({
      transactionId,
      transaction,
    }: {
      transactionId: string;
      transaction: Omit<ITransaction, "id">;
    }) => {
      const response = await axiosInstance.put(`${baseUrl}/${transactionId}`, {
        updatedTransaction: transaction,
      });
      if (response.status !== 200) {
        throw new Error("Failed to update transaction");
      }
      return response.data;
    },
  });
}
