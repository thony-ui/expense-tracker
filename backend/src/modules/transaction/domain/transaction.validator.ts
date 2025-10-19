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
  base_currency: z.string(),
  converted_currency: z.string(),
  base_amount: z.number().min(0),
  converted_amount: z.number().min(0),
  exchange_rate: z.number(),
  savingsGoalId: z.string().uuid("Invalid savings goal ID format").optional(),
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
  limit: z.preprocess((arg) => {
    if (typeof arg === "string") return parseInt(arg, 10);
    return arg;
  }, z.number().min(1).optional()),
  offSet: z.preprocess((arg) => {
    if (typeof arg === "string") return parseInt(arg, 10);
    return arg;
  }, z.number().min(0).optional()),
  date: z.string().optional(),
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

const deleteTransactionValidator = z.object({
  transactionId: z.string(),
  userId: z.string().uuid("Invalid user ID format"),
});
type TDeleteTransactionValidator = z.infer<typeof deleteTransactionValidator>;
export function validateDeleteTransaction(
  data: unknown
): TDeleteTransactionValidator {
  try {
    const parsed = deleteTransactionValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validateDeleteTransaction error: ${error.errors
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
const updateTransactionValidator = z.object({
  transactionId: z.string(),
  userId: z.string().uuid("Invalid user ID format"),
  updatedTransaction: z.object({
    type: z.string().min(2).max(100),
    amount: z.number().min(0),
    name: z.string().min(2).max(100),
    description: z.string(),
    category: z.string().min(2).max(100),
    date: z.string(),
    base_currency: z.string(),
    converted_currency: z.string(),
    base_amount: z.number().min(0),
    converted_amount: z.number().min(0),
    exchange_rate: z.number(),
    savingsGoalId: z.string().uuid("Invalid savings goal ID format").optional(),
  }),
});
type TUpdateTransactionValidator = z.infer<typeof updateTransactionValidator>;
export function validateUpdateTransaction(
  data: unknown
): TUpdateTransactionValidator {
  try {
    const parsed = updateTransactionValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validateUpdateTransaction error: ${error.errors
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

const getTransactionByIdValidator = z.object({
  transactionId: z.string(),
  userId: z.string().uuid("Invalid user ID format"),
});
type TGetTransactionByIdValidator = z.infer<typeof getTransactionByIdValidator>;
export function validateGetTransactionById(
  data: unknown
): TGetTransactionByIdValidator {
  try {
    const parsed = getTransactionByIdValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validateGetTransactionById error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
}

const getTransactionsBySavingsGoalIdValidator = z.object({
  savingsGoalIds: z.array(z.string().uuid("Invalid savings goal ID format")),
  userId: z.string().uuid("Invalid user ID format"),
});
type TGetTransactionsBySavingsGoalIdValidator = z.infer<
  typeof getTransactionsBySavingsGoalIdValidator
>;
export function validateGetTransactionsBySavingsGoalId(
  data: unknown
): TGetTransactionsBySavingsGoalIdValidator {
  try {
    const parsed = getTransactionsBySavingsGoalIdValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validateGetTransactionsBySavingsGoalId error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
}

const updateMultipleTransactionsValidator = z.object({
  transactionIds: z.array(z.number()),
  userId: z.string().uuid("Invalid user ID format"),
});
type TUpdateMultipleTransactionsValidator = z.infer<
  typeof updateMultipleTransactionsValidator
>;
export function validateUpdateMultipleTransactions(
  data: unknown
): TUpdateMultipleTransactionsValidator {
  try {
    const parsed = updateMultipleTransactionsValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `TransactionValidator: validateUpdateMultipleTransactions error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`
      );
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error;
  }
}
