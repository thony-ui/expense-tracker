import * as z from "zod";
import logger from "../../../logger";

const postExpenseValidator = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  type: z.string().min(2).max(100),
  amount: z.number().min(0),
  name: z.string().min(2).max(100),
  description: z.string(),
  category: z.string().min(2).max(100),
  date: z.string(),
});

type TPostExpenseValidator = z.infer<typeof postExpenseValidator>;

export function validatePostExpense(data: unknown): TPostExpenseValidator {
  try {
    const parsed = postExpenseValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error(
        `ExpenseValidator: validatePostExpense error: ${error.errors
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
