import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import { formatLLMContext } from "../../../utils/format-llm-context";
import { getLLMPrompt } from "../../../utils/llm-prompt";

require("dotenv").config();

export class ChatService {
  getResponseFromLLM = async (prompt: string, userId: string) => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("userId", userId);
    if (error) {
      logger.error(
        `ChatService: Error fetching transactions: ${error.message}`
      );
      throw new Error(`Error fetching transactions: ${error.message}`);
    }
    const formattedLLMContext = formatLLMContext(transactions);
    const llmPrompt = getLLMPrompt(formattedLLMContext);
    const response = await fetch(process.env.OPENROUTER_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct:free",
        messages: [
          { role: "system", content: llmPrompt },
          { role: "user", content: prompt },
        ],
        stream: true,
      }),
    });
    logger.info(
      `ChatService: getResponseFromLLM called with prompt: ${prompt}`
    );
    if (!response.ok) {
      logger.error(
        `ChatService: Error fetching response from LLM: ${response.statusText}`
      );
      throw new Error(`Error fetching response: ${response.statusText}`);
    }
    return response.body;
  };
}
