import * as z from "zod";
import logger from "../../../logger";

const postTransactionValidator = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  type: z.string().min(2).max(100),
  amount: z.number().min(0),
  name: z.string().min(2).max(100),
  description: z.string(),
  category: z.string().min(2).max(100),
  date: z.string(),
});

type TPostTransactionValidator = z.infer<typeof postTransactionValidator>;

export function validatePostTransaction(
  data: unknown
): TPostTransactionValidator {
  try {
    const parsed = postTransactionValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validatePostTransaction error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error; // rethrow unexpected errors
  }
}

const getTransactionsValidator = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  transactionType: z.string().optional(),
});
type TGetTransactionsValidator = z.infer<typeof getTransactionsValidator>;
export function validateGetTransactions(
  data: unknown
): TGetTransactionsValidator {
  try {
    const parsed = getTransactionsValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validateGetTransactions error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error; // rethrow unexpected errors
  }
}
