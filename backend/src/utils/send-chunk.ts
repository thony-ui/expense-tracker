import { Response } from "express";
export async function sendChunkToClient(
  stream: ReadableStream<Uint8Array>,
  res: Response
) {
  const decoder = new TextDecoder();

  for await (const chunk of stream) {
    const decoded = decoder.decode(chunk, { stream: true });
    const lines = decoded.split("\n");

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;

      const data = line.slice(6);
      if (data === "[DONE]") {
        return;
      }

      try {
        const parsed = JSON.parse(data);
        const content = parsed.choices?.[0]?.delta?.content;
        if (content) res.write(content);
      } catch (e) {
        console.error("Failed to parse JSON stream chunk:", e);
      }
    }
  }
}
