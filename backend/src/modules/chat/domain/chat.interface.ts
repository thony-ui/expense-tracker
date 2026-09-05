export interface IChatService {
  getResponseFromLLM: (
    prompt: string,
    userId: string,
    signal?: AbortSignal,
  ) => Promise<ReadableStream<Uint8Array>>;

  generateExpenseReport: (
    userId: string,
    startDate: string,
    endDate: string,
  ) => Promise<string>;
}
