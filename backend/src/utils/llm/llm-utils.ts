import { AIError } from "./ai-error";

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
}

export class LLM {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly chatModel: string;
  private readonly visionModel: string;

  constructor() {
    const apiKey = process.env.SOCLAAS_API_KEY?.trim();

    if (!apiKey) {
      throw new AIError(503, "The AI service is not configured.");
    }

    this.apiKey = apiKey;

    this.baseUrl = (
      process.env.SOCLAAS_BASE_URL?.trim() ||
      "https://soclaas-api.comp.nus.edu.sg/v1"
    ).replace(/\/$/, "");

    this.chatModel = process.env.SOCLAAS_CHAT_MODEL?.trim() || "default";

    this.visionModel =
      process.env.SOCLAAS_VISION_MODEL?.trim() || "advanced-vision";
  }

  /**
   * Streaming chat request.
   *
   * Equivalent to:
   *
   * WebClient.post()
   *   .uri(baseUrl + "/chat/completions")
   *   .header("Authorization", "Bearer " + apiKey)
   *   .bodyValue(...)
   */
  async generateResponseStream(
    llmPrompt: string,
    prompt: string,
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },

      body: JSON.stringify({
        model: this.chatModel,
        messages: [
          {
            role: "system",
            content: llmPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        stream: true,
        max_tokens: 2048,
      }),

      signal,
    });

    if (!response.ok) {
      const body = await response.text();

      throw new AIError(response.status, `SoCLaaS request failed: ${body}`);
    }

    if (!response.body) {
      throw new AIError(502, "SoCLaaS returned an empty response stream.");
    }

    return response.body;
  }

  /**
   * Non-streaming chat completion.
   */
  async generateResponseReport(prompt: string): Promise<string> {
    return this.generateCompletion([
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);
  }

  /**
   * Clean up text obtained through OCR.
   */
  async enhanceOCRExtractedText(prompt: string): Promise<string> {
    return this.generateCompletion([
      {
        role: "system",
        content:
          "You are a helpful assistant that enhances OCR extracted text for better transaction parsing.",
      },
      {
        role: "user",
        content: prompt,
      },
    ]);
  }

  /**
   * Vision request for receipt / transaction extraction.
   */
  async autoAddExpenseOrIncome(
    prompt: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<string> {
    const base64 = fileBuffer.toString("base64");

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: this.visionModel,
        temperature: 0,
        max_tokens: 2048,

        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that extracts transaction details from user input.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt,
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64}`,
                },
              },
            ],
          },
        ],
      }),
    });

    return this.readCompletionResponse(response);
  }

  /**
   * Shared helper for ordinary non-streaming completions.
   */
  private async generateCompletion(
    messages: Array<Record<string, unknown>>,
  ): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: this.chatModel,
        messages,
        stream: false,
        max_tokens: 2048,
      }),
    });

    return this.readCompletionResponse(response);
  }

  /**
   * Parse a normal SoCLaaS chat-completion response.
   */
  private async readCompletionResponse(response: Response): Promise<string> {
    if (!response.ok) {
      const body = await response.text();

      throw new AIError(response.status, `SoCLaaS request failed: ${body}`);
    }

    const data = (await response.json()) as ChatCompletionResponse;

    const content = data.choices?.[0]?.message?.content;

    if (!content?.trim()) {
      throw new AIError(502, "The AI service returned an empty response.");
    }

    return content;
  }
}
