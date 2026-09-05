import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { z } from "zod";
import { getLLMPromptForTransactionParsing } from "../../../utils/llm/llm-prompt";
import { LLM } from "../../../utils/llm/llm-utils";
import { TransactionRepository } from "../../transaction/domain/transaction.repository";
import { ITransaction } from "../../transaction/domain/transaction.interface";
import { parseReceiptTransaction, prepareReceiptImage } from "./receipt";
import { AIError } from "../../../utils/llm/ai-error";
import supabase from "../../../lib/supabase-client";
import { BudgetRepository } from "../../budget/domain/budget.repository";

export class OCRController {
  constructor(
    private transactionRepository: TransactionRepository,

    private budgetRepository: BudgetRepository,
  ) {}

  postOCR = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      const { imagePath } = z.object({ imagePath: z.string().min(1).max(500) }).parse(req.body);
      const ownedPath = imagePath.startsWith(`${userId}/`) ||
        ["jpg", "jpeg", "png", "heic", "heif", "webp"].some(ext => imagePath === `${userId}.${ext}`);
      if (!ownedPath || imagePath.includes("..") || imagePath.includes("\\")) {
        throw new AIError(403, "You can only scan your own uploaded receipts.");
      }

      const bucketName = "receipts";
      const { data: downloadData, error: downloadError } =
        await supabase.storage.from(bucketName).download(imagePath);

      if (downloadError) {
        throw new AIError(400, "The uploaded receipt could not be downloaded. Please upload it again.");
      }

      const arrayBuffer = await downloadData.arrayBuffer();
      const image = await prepareReceiptImage(Buffer.from(arrayBuffer), imagePath, downloadData.type);

      // Process OCR
      const llm = new LLM();
      const budgets = await this.budgetRepository.getBudgets(userId);
      const mappedBudgetsContext = JSON.stringify(
        Object.fromEntries(budgets.map((budget) => [budget.id, budget.name])),
      );
      const llmPrompt = getLLMPromptForTransactionParsing(mappedBudgetsContext);
      const llmResponse = await llm.autoAddExpenseOrIncome(
        llmPrompt,
        image.buffer,
        image.mimeType,
      );
      const allowedBudgetIds = new Set(budgets.map(budget => budget.id).filter((id): id is string => !!id));
      const parsed = parseReceiptTransaction(llmResponse, allowedBudgetIds);

      const transactionData: ITransaction = {
        userId,
        type: parsed.type,
        amount: parsed.amount,
        name: parsed.name,
        description: parsed.description,
        category: parsed.category,
        date: parsed.date,
        base_currency: "Singapore Dollar",
        converted_currency: "Singapore Dollar",
        base_amount: parsed.amount,
        converted_amount: parsed.amount,
        exchange_rate: 1,
        savingsGoalId: undefined,
        budgetIds: parsed.budgetId ? [parsed.budgetId] : [],
      };

      await this.transactionRepository.addTransactionToDatabase(
        transactionData,
      );

      res.status(201).send({
        message: "Transaction added successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
