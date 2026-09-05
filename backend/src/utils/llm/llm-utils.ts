import OpenAI from "openai";
import { AIError } from "./ai-error";

export class LLM {
  private readonly openai: OpenAI;
  private readonly chatModel: string;
  private readonly visionModel: string;

  constructor() {
    const apiKey = process.env.SOCLAAS_API_KEY?.trim();
    if (!apiKey) throw new AIError(503, "The AI service is not configured.");
    this.chatModel = process.env.SOCLAAS_CHAT_MODEL?.trim() || "default";
    this.visionModel = process.env.SOCLAAS_VISION_MODEL?.trim() || "advanced-vision";
    this.openai = new OpenAI({
      apiKey,
      baseURL: process.env.SOCLAAS_BASE_URL?.trim() || "https://soclaas-api.comp.nus.edu.sg/v1",
      timeout: 180_000,
      maxRetries: 0,
    });
  }

  async generateResponseStream(llmprompt: string, prompt: string, signal?: AbortSignal) {
    const stream = await this.openai.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: "system", content: llmprompt },
        { role: "user", content: prompt },
      ],
      stream: true,
      max_tokens: 2048,
    }, { signal });
    return stream;
  }

  async generateResponseReport(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: this.chatModel,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });
    return this.requireContent(response.choices?.[0]?.message?.content);
  }

  async enhanceOCRExtractedText(prompt: string) {
    const response = await this.openai.chat.completions.create({
      model: this.chatModel,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that enhances OCR extracted text for better transaction parsing.",
        },
        { role: "user", content: prompt },
      ],
    });
    return this.requireContent(response.choices?.[0]?.message?.content);
  }

  async autoAddExpenseOrIncome(
    prompt: string,
    fileBuffer: Buffer,
    mimeType: string,
  ) {
    const base64 = fileBuffer.toString("base64");

    const response = await this.openai.chat.completions.create({
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
    });
    return this.requireContent(response.choices?.[0]?.message?.content);
  }

  private requireContent(content: string | null | undefined): string {
    if (!content?.trim()) throw new AIError(502, "The AI service returned an empty response. Please try again.");
    return content;
  }
}
