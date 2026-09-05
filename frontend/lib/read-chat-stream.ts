/** Decode UTF-8 and SSE frames across arbitrary network chunks. */
export async function readChatStream(
  stream: ReadableStream<Uint8Array>,
  contentType: string,
  onChunk: (text: string) => void,
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");

  const isEventStream = contentType.toLowerCase().includes("text/event-stream");

  let buffer = "";
  let hasText = false;
  let completed = false;

  const emit = (text: string) => {
    if (!text) return;

    hasText = true;
    onChunk(text);
  };

  const processFrame = (frame: string) => {
    const data = frame
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trimStart())
      .join("\n")
      .trim();

    // SSE comments / keepalives.
    if (!data) return;

    // Allow standard SSE completion markers too.
    if (data === "[DONE]") {
      completed = true;
      return;
    }

    let event: unknown;

    try {
      event = JSON.parse(data);
    } catch {
      throw new Error("Received an invalid response from the AI service.");
    }

    if (typeof event !== "object" || event === null) {
      throw new Error("Received an invalid response from the AI service.");
    }

    const payload = event as {
      type?: string;
      text?: unknown;
      message?: unknown;
    };

    if (payload.type === "error") {
      throw new Error(
        typeof payload.message === "string"
          ? payload.message
          : "The AI response was interrupted.",
      );
    }

    if (payload.type === "done") {
      completed = true;
      return;
    }

    if (payload.type === "delta" && typeof payload.text === "string") {
      emit(payload.text);
    }
  };

  try {
    while (true) {
      const { done, value } = await reader.read();

      const text = done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });

      if (!isEventStream) {
        emit(text);

        if (done) break;

        continue;
      }

      buffer += text;

      while (true) {
        const separator = /\r?\n\r?\n/.exec(buffer);

        if (!separator) break;

        const frame = buffer.slice(0, separator.index);

        buffer = buffer.slice(separator.index + separator[0].length);

        processFrame(frame);

        if (completed) {
          if (!hasText) {
            throw new Error("The AI service returned an empty response.");
          }

          return;
        }
      }

      if (done) break;
    }

    /*
     * Handle a final SSE frame in case the server closes without
     * sending a trailing blank line.
     */
    if (isEventStream && buffer.trim()) {
      processFrame(buffer);
    }

    if (isEventStream && !completed) {
      throw new Error("The AI response was interrupted. Please try again.");
    }

    if (!hasText) {
      throw new Error("The AI service returned an empty response.");
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      // Stream may already be closed/cancelled.
    }

    reader.releaseLock();
  }
}
