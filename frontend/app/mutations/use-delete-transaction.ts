import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/transactions";

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: async (transactionId: string) => {
      const response = await axiosInstance.delete(
        `${baseUrl}/${transactionId}`
      );
      if (response.status !== 200) {
        throw new Error("Failed to delete transaction");
      }
      return response.data;
    },
  });
}
