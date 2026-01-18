import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../providers/query-client-provider";

const baseUrl = "/v1/savings-goals";

export interface ISavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  deadline: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export function useGetSavingsGoals() {
  return useQuery<ISavingsGoal[]>({
    queryKey: ["savings-goals"],
    queryFn: async () => {
      const response = await axiosInstance.get(baseUrl);
      return response.data;
    },
  });
}

export function useGetSavingsGoalById(goalId: string) {
  return useQuery<ISavingsGoal>({
    queryKey: ["savings-goals", goalId],
    queryFn: async () => {
      const response = await axiosInstance.get(`${baseUrl}/${goalId}`);
      return response.data;
    },
    enabled: !!goalId,
  });
}

export function invalidateSavingsGoals() {
  return queryClient.invalidateQueries({
    queryKey: ["savings-goals"],
  });
}
