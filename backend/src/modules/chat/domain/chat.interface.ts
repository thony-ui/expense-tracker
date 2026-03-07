import { ChatCompletionChunk } from "openai/resources";
import { Stream } from "openai/streaming";

export interface IChatService {
  getResponseFromLLM: (
    prompt: string,
    userId: string,
  ) => Promise<
    Stream<ChatCompletionChunk> & {
      _request_id?: string | null;
    }
  >;

  generateExpenseReport: (
    userId: string,
    startDate: string,
    endDate: string,
  ) => Promise<string>;

  parseTransactionFromNaturalLanguage: (text: string) => Promise<{
    amount: number;
    date: string;
    category: string;
    type: "income" | "expense";
    description: string;
  }>;
}
