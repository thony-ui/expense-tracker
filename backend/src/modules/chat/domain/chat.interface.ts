import { ChatCompletionChunk } from "openai/resources";
import { Stream } from "openai/streaming";

export interface IChatService {
  getResponseFromLLM: (
    prompt: string,
    userId: string,
    signal?: AbortSignal,
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
}
