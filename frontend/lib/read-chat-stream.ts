/** Decode partial UTF-8 characters and event frames across arbitrary network chunks. */
export async function readChatStream(
  stream: ReadableStream<Uint8Array>,
  contentType: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const eventStream = contentType.includes("text/event-stream");
  let buffer = "";
  let hasText = false;
  const emit = (text: string) => { if (text) { hasText = true; onChunk(text); } };
  try {
    while (true) {
      const { done, value } = await reader.read();
      const text = done ? decoder.decode() : decoder.decode(value, { stream: true });
      if (!eventStream) {
        emit(text);
      } else {
        buffer += text;
        let separator: RegExpExecArray | null;
        while ((separator = /\r?\n\r?\n/.exec(buffer))) {
          const frame = buffer.slice(0, separator.index);
          buffer = buffer.slice(separator.index + separator[0].length);
          const data = frame.split(/\r?\n/).filter(line => line.startsWith("data:"))
            .map(line => line.slice(5).trimStart()).join("\n");
          if (!data) continue; // Keepalive comments have no data.
          const event = JSON.parse(data);
          if (event.type === "error") throw new Error(event.message || "The AI response was interrupted.");
          if (event.type === "done") {
            if (!hasText) throw new Error("The AI service returned an empty response.");
            return;
          }
          if (event.type === "delta" && typeof event.text === "string") emit(event.text);
        }
      }
      if (done) break;
    }
    if (eventStream) throw new Error("The AI response was interrupted. Please try again.");
    if (!hasText) throw new Error("The AI service returned an empty response.");
  } finally {
    await reader.cancel().catch(() => undefined);
    reader.releaseLock();
  }
}
