import { google } from "googleapis";
import { ITransaction } from "../modules/transaction/domain/transaction.interface";
import logger from "../logger";

require("dotenv").config();

async function GoogleSheetClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export async function addRowToGoogleSheet(
  values: ITransaction & { transactionId: string },
  range = "Transactions!A:B"
) {
  const sheets = await GoogleSheetClient();
  logger.info(
    `Appending row to Google Sheet with values: ${JSON.stringify(values)}`
  );
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [Object.values(values)],
    },
  });
  logger.info("Row appended successfully to Google Sheet");
}

export async function updateGoogleSheetRowByTransactionId(
  transactionId: string,
  updatedTransaction: ITransaction
) {
  const rowIndex = await findRowIndexByTransactionId(transactionId);

  if (rowIndex === null) {
    throw new Error(`Transaction ID ${transactionId} not found.`);
  }

  const sheets = await GoogleSheetClient();
  const updateRange = `Transactions!A${rowIndex}:H${rowIndex}`; // Full row

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: updateRange,
    valueInputOption: "RAW",
    requestBody: {
      values: [Object.values(updatedTransaction)],
    },
  });

  logger.info(`Updated row ${rowIndex} with new values.`);
}

export async function deleteRowFromGoogleSheet(transactionId: string) {
  const rowIndex = await findRowIndexByTransactionId(transactionId);

  if (rowIndex === null) {
    throw new Error(
      `Transaction ID ${transactionId} not found in Google Sheet`
    );
  }

  const sheets = await GoogleSheetClient();

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: 0,
              dimension: "ROWS",
              startIndex: rowIndex - 1, // 0-based
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });

  logger.info(`Deleted row ${rowIndex} from Google Sheet`);
}
async function findRowIndexByTransactionId(
  transactionId: string
): Promise<number | null> {
  const sheets = await GoogleSheetClient();
  const range = "Transactions!A2:A"; // Only the ID column

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range,
  });

  const rows = res.data.values || [];
  const rowIndex = rows.findIndex((row) => row[0] === transactionId);

  return rowIndex !== -1 ? rowIndex + 2 : null; // +2 because A2 = row 2
}
