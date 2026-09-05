import convert from "heic-convert";
import { z } from "zod";
import { AIError } from "../../../utils/llm/ai-error";

const receiptSchema = z.object({
  amount: z.coerce.number().finite().min(0.01),
  category: z.enum([
    "Food & Dining", "Transportation", "Shopping", "Entertainment",
    "Bills & Utilities", "Healthcare", "Education", "Travel", "Personal Care",
    "Other", "Salary", "Investment", "Gift", "Refund",
  ]),
  type: z.enum(["expense", "income"]),
  description: z.string().trim().min(1).max(1000),
  budgetId: z.string().nullish(),
});

export function parseReceiptTransaction(content: string, allowedBudgetIds: ReadonlySet<string>) {
  // Some compatible models wrap structured output in markdown or reasoning text.
  const text = content.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const parsed = receiptSchema.parse(JSON.parse(text.slice(start, end + 1)));
    return {
      ...parsed,
      amount: Math.round(parsed.amount * 100) / 100,
      date: new Date().toISOString().split("T")[0],
      name: parsed.type === "income" ? "Income" : "Expense",
      budgetId: parsed.budgetId && allowedBudgetIds.has(parsed.budgetId) ? parsed.budgetId : undefined,
    };
  } catch {
    throw new AIError(422, "The receipt could not be read reliably. Please try a clearer photo.");
  }
}

export async function prepareReceiptImage(data: Buffer, filename: string, declaredType: string) {
  if (data.length === 0 || data.length > 5 * 1024 * 1024) {
    throw new AIError(400, "Please upload a receipt image smaller than 5 MB.");
  }
  let buffer = data;
  if (/\.hei[cf]$/i.test(filename) || /^image\/hei[cf]$/i.test(declaredType)) {
    try {
      buffer = Buffer.from(await convert({
        buffer: data as unknown as ArrayBuffer,
        format: "JPEG",
        quality: 0.9,
      }));
    } catch {
      throw new AIError(422, "This HEIC image could not be read. Please try a JPEG or PNG copy.");
    }
  }
  if (buffer.length > 10 * 1024 * 1024) {
    throw new AIError(400, "The converted receipt is too large. Please upload a smaller image.");
  }
  let mimeType: string;
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) mimeType = "image/jpeg";
  else if (buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) mimeType = "image/png";
  else if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") mimeType = "image/webp";
  else throw new AIError(400, "Please upload a JPEG, PNG, WebP, or HEIC receipt image.");
  return { buffer, mimeType };
}
