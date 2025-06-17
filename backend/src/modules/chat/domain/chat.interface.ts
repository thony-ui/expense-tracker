export interface IChatService {
  getResponseFromLLM: (
    prompt: string,
    userId: string
  ) => Promise<ReadableStream<Uint8Array<ArrayBufferLike>>>;

  generateExpenseReport: (userId: string) => Promise<string>;
}
