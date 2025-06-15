import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const baseUrl = "/v1/chat";

export function usePostMessage() {
  return useMutation({
    mutationFn: async ({
      prompt,
      onChunk,
    }: {
      prompt: string;
      onChunk: (chunk: string) => void;
    }) => {
      const response = await axiosInstance.post(
        baseUrl,
        { prompt },
        {
          responseType: "stream",
          adapter: "fetch",
        }
      );

      if (!response.data) {
        throw new Error("No response body");
      }

      const reader = response.data.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }

      return "Stream completed";
    },
  });
}
