import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";

import { formatLLMContext } from "../../../utils/llm/format-llm-context";

import {
  getLLMPromptForExpenseReport,
  getLLMPromptForTransactions,
} from "../../../utils/llm/llm-prompt";

import { IChatService } from "./chat.interface";

import puppeteer from "puppeteer";
import { marked } from "marked";

import { LLM } from "../../../utils/llm/llm-utils";

export class ChatService implements IChatService {
  private readonly llm: LLM;

  constructor() {
    this.llm = new LLM();
  }

  getResponseFromLLM = async (
    prompt: string,
    userId: string,
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("userId", userId)
      .eq("type", "expense");

    if (error) {
      logger.error(
        `ChatService: Error fetching transactions: ${error.message}`,
      );

      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    const formattedLLMContext = formatLLMContext(transactions ?? []);

    const llmPrompt = getLLMPromptForTransactions(formattedLLMContext);

    logger.info(`ChatService: Starting chat stream for userId: ${userId}`);

    try {
      return await this.llm.generateResponseStream(llmPrompt, prompt, signal);
    } catch (error) {
      logger.error(
        `ChatService: LLM streaming request failed for userId ${userId}`,
        error,
      );

      throw error;
    }
  };

  generateExpenseReport = async (
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<string> => {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("userId", userId)
      .eq("type", "expense")
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) {
      logger.error(
        `ChatService: Error fetching transactions for report: ${error.message}`,
      );

      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    const formattedLLMContext = formatLLMContext(transactions ?? []);

    const llmPrompt = getLLMPromptForExpenseReport(formattedLLMContext);

    try {
      const response = await this.llm.generateResponseReport(llmPrompt);

      logger.info(
        `ChatService: Expense report generated for userId: ${userId}`,
      );

      return this.convertMarkdownToHTML(response, userId);
    } catch (error) {
      logger.error(
        `ChatService: Error generating expense report for userId ${userId}`,
        error,
      );

      throw error;
    }
  };

  private convertMarkdownToHTML = (
    markdown: string,
    userId: string,
  ): string => {
    const renderedMarkdown = marked.parse(markdown);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">

          <title>
            Expense Report - User ${userId}
          </title>

          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }

            h1,
            h2,
            h3 {
              color: #333;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }

            th,
            td {
              padding: 12px;
              border: 1px solid #ddd;
              text-align: left;
            }

            th {
              background-color: #f2f2f2;
            }

            .summary {
              margin-top: 30px;
              font-weight: bold;
            }
          </style>
        </head>

        <body>
          ${renderedMarkdown}
        </body>
      </html>
    `;
  };

  generatePDFReport = async (
    html: string,
    userId: string,
  ): Promise<Uint8Array<ArrayBufferLike>> => {
    const browser = await puppeteer.launch({
      headless: true,
    });

    try {
      const page = await browser.newPage();

      await page.setContent(html, {
        waitUntil: "networkidle0",
      });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,

        margin: {
          top: "20mm",
          right: "20mm",
          bottom: "20mm",
          left: "20mm",
        },
      });

      logger.info(
        `ChatService: PDF generated successfully for userId: ${userId}`,
      );

      return pdfBuffer;
    } catch (error) {
      logger.error(
        `ChatService: Error generating PDF for userId ${userId}`,
        error,
      );

      throw error;
    } finally {
      await browser.close();
    }
  };
}
