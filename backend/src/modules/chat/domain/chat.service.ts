import supabase from "../../../lib/supabase-client";
import logger from "../../../logger";
import { formatLLMContext } from "../../../utils/llm/format-llm-context";
import {
  getLLMPromptForExpenseReport,
  getLLMPromptForTransactions,
  getLLMPromptForTransactionParsing,
} from "../../../utils/llm/llm-prompt";
import { IChatService } from "./chat.interface";
import puppeteer from "puppeteer";
import { marked } from "marked";
import { LLM } from "../../../utils/llm/llm-utils";

require("dotenv").config();

export class ChatService implements IChatService {
  getResponseFromLLM = async (prompt: string, userId: string) => {
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
    const llm = new LLM();
    const formattedLLMContext = formatLLMContext(transactions);
    const llmPrompt = getLLMPromptForTransactions(formattedLLMContext);

    // Streaming response
    const responseStream = await llm.generateResponseStream(llmPrompt, prompt);

    logger.info(
      `ChatService: getResponseFromLLM called with prompt: ${prompt}`,
    );
    return responseStream;
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
    const llm = new LLM();
    const formattedLLMContext = formatLLMContext(transactions);
    const llmPrompt = getLLMPromptForExpenseReport(formattedLLMContext);
    const response = await llm.generateResponseReport(llmPrompt);
    logger.info(
      `ChatService: generateExpenseReport called for userId: ${userId}`,
    );
    if (!response) {
      logger.error(
        `ChatService: Error generating expense report for prompt: ${llmPrompt}`,
      );
      throw new Error(`Error generating report for prompt: ${llmPrompt}`);
    }
    // Convert markdown to HTML
    const html = await this.convertMarkdownToHTML(response, userId);

    return html;
  };

  // Convert markdown to HTML with styling
  private convertMarkdownToHTML = async (
    markdown: string,
    userId: string,
  ): Promise<string> => {
    try {
      // Import the marked library for markdown conversion

      // Create styled HTML document
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Expense Report - User ${userId}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 {
              color: #333;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
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
          ${marked.parse(markdown)}
        </body>
        </html>
      `;

      return html;
    } catch (error) {
      logger.error(`Error converting markdown to HTML: ${error}`);
      throw new Error(`Error converting markdown to HTML: ${error}`);
    }
  };

  // Generate PDF from HTML
  generatePDFReport = async (
    html: string,
    userId: string,
  ): Promise<Uint8Array<ArrayBufferLike>> => {
    try {
      // Launch puppeteer and create PDF
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      // Generate PDF as buffer instead of saving to file
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

      await browser.close();
      logger.info(`PDF generated successfully for user: ${userId}`);
      return pdfBuffer;
    } catch (error) {
      logger.error(`Error generating PDF: ${error}`);
      throw new Error(`Error generating PDF: ${error}`);
    }
  };

  // Parse natural language transaction input using LLM
}
