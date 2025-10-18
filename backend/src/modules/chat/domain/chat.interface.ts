export interface IChatService {
  getResponseFromLLM: (
    prompt: string,
    userId: string,
    startDate: string,
    endDate: string
  ) => Promise<ReadableStream<Uint8Array<ArrayBufferLike>>>;

  generateExpenseReport: (
    userId: string,
    startDate: string,
    endDate: string
  ) => Promise<string>;
}
