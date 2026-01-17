import { z } from "zod";
import { PeriodType } from "./budget.interface";

const periodTypes: [PeriodType, ...PeriodType[]] = [
  "daily",
  "weekly",
  "monthly",
  "yearly",
  "custom",
];

const createBudgetSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1, "Budget name is required").max(255),
  amount: z.number().positive("Amount must be positive"),
  periodType: z.enum(periodTypes),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date format",
  }),
  endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }),
});

const updateBudgetSchema = z.object({
  budgetId: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  amount: z.number().positive().optional(),
  periodType: z.enum(periodTypes).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

const getBudgetByIdSchema = z.object({
  budgetId: z.string().uuid(),
  userId: z.string().uuid(),
});

const deleteBudgetSchema = z.object({
  budgetId: z.string().uuid(),
  userId: z.string().uuid(),
});

const getBudgetsSchema = z.object({
  userId: z.string().uuid(),
});

export function validateCreateBudget(data: unknown) {
  return createBudgetSchema.parse(data);
}

export function validateUpdateBudget(data: unknown) {
  return updateBudgetSchema.parse(data);
}

export function validateGetBudgetById(data: unknown) {
  return getBudgetByIdSchema.parse(data);
}

export function validateDeleteBudget(data: unknown) {
  return deleteBudgetSchema.parse(data);
}

export function validateGetBudgets(data: unknown) {
  return getBudgetsSchema.parse(data);
}
