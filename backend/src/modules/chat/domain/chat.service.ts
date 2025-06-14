import logger from "../../../logger";

require("dotenv").config();

export class ChatService {
  getResponseFromLLM = async (prompt: string) => {
    const response = await fetch(process.env.OPENROUTER_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        stream: true,
      }),
    });
    logger.info(
      `ChatService: getResponseFromLLM called with prompt: ${prompt}`
    );
    return response.body;
  };
}
