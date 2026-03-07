import OpenAI from "openai";
import logger from "../../logger";

export class LLM {
  private openai: OpenAI | null = null;
  private enabled: boolean;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    this.enabled = !!apiKey;

    if (this.enabled) {
      this.openai = new OpenAI({ apiKey });
      logger.info("QueryExpansionService: Initialized with OpenAI");
    } else {
      logger.warn(
        "QueryExpansionService: OPENAI_API_KEY not set, query expansion disabled",
      );
    }
  }

  async generateResponseStream(llmprompt: string, prompt: string) {
    if (!this.enabled || !this.openai) {
      throw new Error("OpenAI API not enabled or initialized.");
    }

    const stream = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model you prefer
      messages: [
        { role: "system", content: llmprompt },
        { role: "user", content: prompt },
      ],
      stream: true,
    });
    return stream;
  }

  async generateResponseReport(prompt: string) {
    if (!this.enabled || !this.openai) {
      throw new Error("OpenAI API not enabled or initialized.");
    }

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model you prefer
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });
    return response.choices?.[0]?.message?.content || "";
  }

  async autoAddExpenseOrIncome(prompt: string) {
    if (!this.enabled || !this.openai) {
      throw new Error("OpenAI API not enabled or initialized.");
    }

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo", // or another model you prefer
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant that extracts transaction details from user input.",
        },
        { role: "user", content: prompt },
      ],
    });
    return response.choices?.[0]?.message?.content || "";
  }
}
