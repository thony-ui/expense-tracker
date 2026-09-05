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
      const response = await fetch(baseUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },

        body: JSON.stringify({
          prompt,
        }),

        signal,

        /*
         * Include this ONLY if your authentication relies
         * on cookies/session cookies.
         */
        credentials: "include",
      });

      if (!response.ok) {
        let message = "The AI request failed. Please try again.";

        try {
          const body = await response.json();

          if (body && typeof body.message === "string") {
            message = body.message;
          }
        } catch {
          // Ignore invalid/non-JSON error body.
        }

        throw new Error(message);
      }

      if (!response.body) {
        throw new Error("The AI service returned no response stream.");
      }

      const contentType = response.headers.get("content-type") ?? "";

      await readChatStream(response.body, contentType, onChunk);

      return "Stream completed";
    },
  });
}
