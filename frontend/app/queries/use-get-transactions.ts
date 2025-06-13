import axiosInstance from "@/lib/axios";
import { ITransaction } from "@/lib/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/expenses";

export function useGetTransactions() {
  return useQuery({
    queryKey: [baseUrl],
    queryFn: async () => {
      const response = await axiosInstance.get<ITransaction[]>(baseUrl);
      return response.data;
    },
  });
}

export function invalidateTransactions() {
  return queryClient.invalidateQueries({ queryKey: [baseUrl] });
}
