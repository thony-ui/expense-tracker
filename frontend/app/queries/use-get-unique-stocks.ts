import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const baseUrl = "/v1/investments/stocks";

export function useGetUniqueStocks() {
  return useQuery({
    queryKey: [baseUrl],
    queryFn: async () => {
      const response = await axiosInstance.get<string[]>(baseUrl);
      return response.data;
    },
  });
}
