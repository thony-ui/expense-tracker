import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { readChatStream } from "@/lib/read-chat-stream";

const baseUrl = "/v1/chat";

export function usePostMessage() {
  return useMutation({
    mutationFn: async ({
      prompt,
      onChunk,
      signal,
    }: {
      prompt: string;
      onChunk: (chunk: string) => void;
      signal?: AbortSignal;
    }) => {
      const response = await axiosInstance.post<ReadableStream<Uint8Array>>(
        baseUrl,
        { prompt },
        {
          responseType: "stream",
          adapter: "fetch",
          headers: { Accept: "text/event-stream" },
          signal,
          validateStatus: () => true,
        }
      );

      if (!response.data) {
        throw new Error("No response body");
      }

      if (response.status < 200 || response.status >= 300) {
        const error = await new Response(response.data).json().catch(() => null);
        throw new Error(error?.message || "The AI request failed. Please try again.");
      }
      await readChatStream(response.data, String(response.headers["content-type"] || ""), onChunk);
      return "Stream completed";
    },
  });
}
