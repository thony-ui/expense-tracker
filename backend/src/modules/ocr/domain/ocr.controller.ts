import { NextFunction, Request, Response } from "express";
import logger from "../../../logger";
import { validateOCRRequest } from "./ocr.validator";
import { OCRService } from "./ocr.service";
import { getLLMPromptForTransactionParsing } from "../../../utils/llm/llm-prompt";
import { LLM } from "../../../utils/llm/llm-utils";
import { TransactionRepository } from "../../transaction/domain/transaction.repository";
import { ITransaction } from "../../transaction/domain/transaction.interface";
import convert from "heic-convert";
import supabase from "../../../lib/supabase-client";

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
      const { imagePath } = req.body;

      if (!imagePath) {
        res.status(400).send({ message: "No image path provided" });
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

      if (imagePath.endsWith(".heic") || imagePath.endsWith(".heif")) {
        const bufferData =
          imageBuffer.buffer instanceof ArrayBuffer
            ? Buffer.from(imageBuffer.buffer)
            : imageBuffer.buffer;
        logger.info(
          `Converting HEIC/HEIF file for OCR processing for userId: ${userId}`,
        );
        const converted = await convert({
          buffer: bufferData as ArrayBufferLike,
          format: "JPEG",
        });
        imageBuffer = Buffer.from(converted);
      }

      logger.info(`Image downloaded successfully, processing OCR...`);

      // Process OCR
      const llm = new LLM();
      const extractedData = await this.ocrService.processImage(imageBuffer);
      const llmPrompt = getLLMPromptForTransactionParsing(extractedData.text);
      const llmResponse = await llm.autoAddExpenseOrIncome(llmPrompt);
      logger.info(`LLM Response: ${llmResponse}`);
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
        budgetId: undefined,
      };

      await this.transactionRepository.addTransactionToDatabase(
        transactionData,
      );

      res.status(200).send({
        ...extractedData,
        imageUrl: imagePath,
      });
    } catch (error) {
      next(error);
    }
  };
}
