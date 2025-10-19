import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

const baseUrl = "/v1/exchange-rate";

export interface IExchangeRateData {
  baseCurrency: string;
  targetCurrency: string;
  exchangeRate: number;
}
export function useGetExchangeRateData() {
  return useQuery({
    queryKey: [baseUrl],
    queryFn: async () => {
      const response = await axiosInstance.get<IExchangeRateData[]>(baseUrl);
      return response.data;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
