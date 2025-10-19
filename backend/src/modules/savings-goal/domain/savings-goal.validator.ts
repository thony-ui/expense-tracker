import * as z from "zod";
import logger from "../../../logger";

const postSavingsGoalValidator = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  title: z
    .string()
    .min(1)
    .max(100, "Title must be between 1 and 100 characters"),
  targetAmount: z.number().min(0, "Target amount must be positive"),
  deadline: z.string(),
  category: z.string().optional(),
});

type TPostSavingsGoalValidator = z.infer<typeof postSavingsGoalValidator>;

export function validatePostSavingsGoal(
  data: unknown
): TPostSavingsGoalValidator {
  try {
    return postSavingsGoalValidator.parse(data);
  } catch (error) {
    logger.error(
      `Validation failed for postSavingsGoal: ${JSON.stringify(error)}`
    );
    throw error;
  }
}

const getSavingsGoalsValidator = z.object({
  userId: z.string().uuid("Invalid user ID format"),
});

type TGetSavingsGoalsValidator = z.infer<typeof getSavingsGoalsValidator>;

export function validateGetSavingsGoals(
  data: unknown
): TGetSavingsGoalsValidator {
  try {
    return getSavingsGoalsValidator.parse(data);
  } catch (error) {
    logger.error(
      `Validation failed for getSavingsGoals: ${JSON.stringify(error)}`
    );
    throw error;
  }
}

const getSavingsGoalByIdValidator = z.object({
  goalId: z.string(),
  userId: z.string().uuid("Invalid user ID format"),
});

type TGetSavingsGoalByIdValidator = z.infer<typeof getSavingsGoalByIdValidator>;

export function validateGetSavingsGoalById(
  data: unknown
): TGetSavingsGoalByIdValidator {
  try {
    return getSavingsGoalByIdValidator.parse(data);
  } catch (error) {
    logger.error(
      `Validation failed for getSavingsGoalById: ${JSON.stringify(error)}`
    );
    throw error;
  }
}

const updateSavingsGoalValidator = z.object({
  goalId: z.string(),
  userId: z.string().uuid("Invalid user ID format"),
  updatedGoal: z.object({
    title: z.string().min(1).max(100).optional(),
    targetAmount: z.number().min(0).optional(),
    deadline: z.string().optional(),
    category: z.string().optional(),
  }),
});

type TUpdateSavingsGoalValidator = z.infer<typeof updateSavingsGoalValidator>;

export function validateUpdateSavingsGoal(
  data: unknown
): TUpdateSavingsGoalValidator {
  try {
    return updateSavingsGoalValidator.parse(data);
  } catch (error) {
    logger.error(
      `Validation failed for updateSavingsGoal: ${JSON.stringify(error)}`
    );
    throw error;
  }
}

const deleteSavingsGoalValidator = z.object({
  goalId: z.string(),
  userId: z.string().uuid("Invalid user ID format"),
});

type TDeleteSavingsGoalValidator = z.infer<typeof deleteSavingsGoalValidator>;

export function validateDeleteSavingsGoal(
  data: unknown
): TDeleteSavingsGoalValidator {
  try {
    return deleteSavingsGoalValidator.parse(data);
  } catch (error) {
    logger.error(
      `Validation failed for deleteSavingsGoal: ${JSON.stringify(error)}`
    );
    throw error;
  }
}
