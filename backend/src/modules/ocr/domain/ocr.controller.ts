import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { getLLMPromptForTransactionParsing } from "../../../utils/llm/llm-prompt";
import { LLM } from "../../../utils/llm/llm-utils";
import { TransactionRepository } from "../../transaction/domain/transaction.repository";
import { ITransaction } from "../../transaction/domain/transaction.interface";
import convert from "heic-convert";
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
      const { imagePath } = req.body;

      if (!imagePath) {
        res.status(400).send({
          message: "No image path provided",
        });
        return;
      }

      logger.info(
        `OCRController: postOCR called with imagePath: ${imagePath} for userId: ${userId}`,
      );

      const bucketName = "receipts";

      const { data: downloadData, error: downloadError } =
        await supabase.storage.from(bucketName).download(imagePath);

      if (downloadError) {
        logger.error(
          `Error downloading from Supabase: ${downloadError.message}`,
        );

        throw new Error(`Failed to download image: ${downloadError.message}`);
      }

      const arrayBuffer = await downloadData.arrayBuffer();

      let imageBuffer = Buffer.from(arrayBuffer);
      let mimeType = downloadData.type || "image/jpeg";

      const lowerPath = imagePath.toLowerCase();

      const isHeic =
        lowerPath.endsWith(".heic") ||
        lowerPath.endsWith(".heif") ||
        mimeType === "image/heic" ||
        mimeType === "image/heif";

      if (isHeic) {
        logger.info(`Converting HEIC/HEIF image to JPEG for userId: ${userId}`);

        const bufferData =
          imageBuffer.buffer instanceof ArrayBuffer
            ? Buffer.from(imageBuffer.buffer)
            : imageBuffer.buffer;

        const converted = await convert({
          buffer: bufferData as unknown as ArrayBufferLike,
          format: "JPEG",
        });

        imageBuffer = Buffer.from(converted);

        // IMPORTANT:
        // bytes are now JPEG, so MIME type must also become JPEG
        mimeType = "image/jpeg";

        logger.info(`HEIC/HEIF conversion completed for userId: ${userId}`);
      }

      logger.info(`Image ready for OCR. MIME type: ${mimeType}`);

      const llm = new LLM();

      const budgets = await this.budgetRepository.getBudgets(userId);

      const mappedBudgetsContext = JSON.stringify(
        Object.fromEntries(budgets.map((budget) => [budget.id, budget.name])),
      );

      const llmPrompt = getLLMPromptForTransactionParsing(mappedBudgetsContext);

      const llmResponse = await llm.autoAddExpenseOrIncome(
        llmPrompt,
        imageBuffer,
        mimeType,
      );

      logger.info(`OCRController: LLM response received for userId: ${userId}`);

      const parsed = JSON.parse(llmResponse);

      const transactionData: ITransaction = {
        userId,
        type: parsed.type ?? null,
        amount: parsed.amount ?? null,
        name: parsed.name ?? null,
        description: parsed.description ?? null,
        category: parsed.category ?? null,
        date: parsed.date ?? null,

        base_currency: "Singapore Dollar",
        converted_currency: "Singapore Dollar",

        base_amount: parsed.amount ?? null,
        converted_amount: parsed.amount ?? null,

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
      logger.error(`OCRController: OCR failed for userId ${userId}`, error);

      next(error);
    }
  };
}
