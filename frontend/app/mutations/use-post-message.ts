import { useMutation } from "@tanstack/react-query";
import { readChatStream } from "@/lib/read-chat-stream";
import { createClient } from "@/lib/supabase/supabase-client";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = `${apiUrl}/v1/chat`;

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
      // Get Supabase access token
      const supabase = createClient();

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        throw new Error("Unable to retrieve your session.");
      }

      const accessToken = data.session?.access_token;

      if (!accessToken) {
        throw new Error("You are not authenticated.");
      }

      // Make streaming request directly with fetch
      const response = await fetch(baseUrl, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          prompt,
        }),

        signal,
      });

      // Handle HTTP errors
      if (!response.ok) {
        let message = "The AI request failed. Please try again.";

        try {
          const body = await response.json();

          if (body && typeof body.message === "string") {
            message = body.message;
          }
        } catch {
          // Response wasn't JSON.
        }

        throw new Error(message);
      }

      // Streaming requires a response body
      if (!response.body) {
        throw new Error("The AI service returned no response stream.");
      }

      const contentType = response.headers.get("content-type") ?? "";

      // Consume SSE stream
      await readChatStream(response.body, contentType, onChunk);

      return "Stream completed";
    },
  });
}
