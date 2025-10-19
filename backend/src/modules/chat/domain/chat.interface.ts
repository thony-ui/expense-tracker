export interface IChatService {
  getResponseFromLLM: (
    prompt: string,
    userId: string
  ) => Promise<ReadableStream<Uint8Array<ArrayBufferLike>>>;

  generateExpenseReport: (
    userId: string,
    startDate: string,
    endDate: string
  ) => Promise<string>;

  parseTransactionFromNaturalLanguage: (text: string) => Promise<{
    amount: number;
    date: string;
    category: string;
    type: "income" | "expense";
    description: string;
  }>;
}
