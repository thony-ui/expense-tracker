import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/chat";

export function usePostMessage() {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const response = await axiosInstance.post(baseUrl, {
        prompt,
      });
      return response.data;
    },
  });
}
