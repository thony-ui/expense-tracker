import { z } from "zod";

const ALLOWED_USERNAMES = ["Anthony", "Albert", "Juliana"] as const;

const postInvestmentSchema = z.object({
  userName: z.enum(ALLOWED_USERNAMES, {
    errorMap: () => ({
      message: "Username must be Anthony, Albert, or Juliana",
    }),
  }),
  stock: z.string(),
  amountInSGD: z.number().positive(),
  date: z.string(),
});

const getInvestmentsSchema = z.object({
  userName: z.string().optional(),
  limit: z.number().optional(),
  offSet: z.number().optional(),
  type: z.string().optional(),
  date: z.string().optional(),
});

const getInvestmentStatsSchema = z.object({
  userName: z.string().optional(),
  type: z.enum(["yearly", "monthly", "weekly", "daily"]).optional(),
  date: z.string().optional(),
});

const getInvestmentsOverTimeSchema = z.object({
  type: z.enum(["yearly", "monthly", "weekly", "daily"]).optional(),
  date: z.string().optional(),
  userName: z.string().optional(),
});

const updateInvestmentSchema = z.object({
  investmentId: z.string(),
  userName: z.enum(ALLOWED_USERNAMES).optional(),
  stock: z.string().optional(),
  amountInSGD: z.number().positive().optional(),
  date: z.string().optional(),
});

const deleteInvestmentSchema = z.object({
  investmentId: z.string(),
});

const getInvestmentByIdSchema = z.object({
  investmentId: z.string(),
});

export const validatePostInvestment = (data: unknown) => {
  return postInvestmentSchema.parse(data);
};

export const validateGetInvestments = (data: unknown) => {
  return getInvestmentsSchema.parse(data);
};

export const validateGetInvestmentStats = (data: unknown) => {
  return getInvestmentStatsSchema.parse(data);
};

export const validateGetInvestmentsOverTime = (data: unknown) => {
  return getInvestmentsOverTimeSchema.parse(data);
};

export const validateUpdateInvestment = (data: unknown) => {
  return updateInvestmentSchema.parse(data);
};

export const validateDeleteInvestment = (data: unknown) => {
  return deleteInvestmentSchema.parse(data);
};

export const validateGetInvestmentById = (data: unknown) => {
  return getInvestmentByIdSchema.parse(data);
};
