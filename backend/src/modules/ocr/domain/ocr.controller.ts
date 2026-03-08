import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { validateOCRRequest } from "./ocr.validator";
import { OCRService } from "./ocr.service";
import { getLLMPromptForTransactionParsing } from "../../../utils/llm/llm-prompt";
import { LLM } from "../../../utils/llm/llm-utils";
import { TransactionRepository } from "../../transaction/domain/transaction.repository";
import { ITransaction } from "../../transaction/domain/transaction.interface";

export class OCRController {
  constructor(
    private ocrService: OCRService,
    private transactionRepository: TransactionRepository,
  ) {}

  postOCR = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user.id;
    try {
      if (!req.file) {
        res.status(400).send({ message: "No file uploaded" });
        return;
      }
      const { file, mimetype } = validateOCRRequest({
        userId,
        file: req.file.buffer,
        mimetype: req.file.mimetype,
      });

      logger.info(
        `OCRController: postOCR called with file of type ${mimetype} for userId: ${userId}`,
      );

      const llm = new LLM();
      const extractedData = await this.ocrService.processImage(file);
      const llmPrompt = getLLMPromptForTransactionParsing(extractedData.text);
      const llmResponse = await llm.autoAddExpenseOrIncome(llmPrompt);
      logger.info(`LLM Response: ${llmResponse}`);
      const parsed = JSON.parse(llmResponse);

      const transactionData: ITransaction = {
        userId,
        type: parsed.type ?? null,
        amount: parsed.amount ?? null,
        name: parsed.name ?? null, // or use another field if 'name' is different
        description: parsed.description ?? null,
        category: parsed.category ?? null,
        date: parsed.date ?? null,
        base_currency: "Singapore Dollar", // or null if not available
        converted_currency: "Singapore Dollar",
        base_amount: parsed.amount ?? null,
        converted_amount: parsed.amount ?? null,
        exchange_rate: 1, // or parsed.exchange_rate if available
        savingsGoalId: undefined, // or parsed.savingsGoalId if available
        budgetId: undefined, // or parsed.budgetId if available
      };

      await this.transactionRepository.addTransactionToDatabase(
        transactionData,
      );

      res.status(200).send(extractedData);
    } catch (error) {
      next(error);
    }
  };
}
