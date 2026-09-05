import { ErrorRequestHandler } from "express";
import OpenAI from "openai";
import { ZodError } from "zod";
import logger from "../../logger";

export class AIError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

export const handleAIError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error);
  let status = 500;
  let message = "The request could not be completed. Please try again.";
  if (error instanceof AIError) {
    status = error.status;
    message = error.message;
  } else if (error instanceof ZodError) {
    status = 400;
    message = "Please check the request and try again.";
  } else if (error instanceof OpenAI.APIError) {
    status = error.status === 429 ? 503 : 502;
    message = error.status === 429
      ? "The AI service is busy. Please try again shortly."
      : "The AI service is unavailable. Please try again shortly.";
  }
  // Provider errors can contain request details. Do not log credentials or receipts.
  logger.warn(`AI request failed (${status}).`);
  res.status(status).json({ message });
};
