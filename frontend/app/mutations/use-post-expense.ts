import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/expenses";

export function usePostExpense() {
  return useMutation({
    mutationKey: [baseUrl],
    mutationFn: async (payload: ITransaction) => {
      const response = await axiosInstance.post<ITransaction>(baseUrl, payload);
      return response.data;
    },
  });
}
