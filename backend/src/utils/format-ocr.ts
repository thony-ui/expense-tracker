export const preprocessOCRText = (rawText: string): string => {
  if (!rawText) return "";

  const cleanedLines = rawText
    .replace(/\r/g, "\n")
    .replace(/[^\S\n]+/g, " ") // collapse spaces but keep line breaks
    .replace(/\n{2,}/g, "\n") // collapse empty lines
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const importantKeywords =
    /total|grand total|net total|amount due|amount payable|payable|subtotal|gst|tax|service charge|discount|cash|visa|mastercard/i;

  const moneyPattern = /\$?\d+(?:\.\d{2})/;

  const candidateLines = cleanedLines.filter(
    (line) => importantKeywords.test(line) || moneyPattern.test(line),
  );

  const merchantHints = cleanedLines.slice(0, 5);

  const numberedLines = cleanedLines.map(
    (line, index) => `${index + 1}. ${line}`,
  );

  return `
The following text was extracted from a receipt using OCR.
OCR may contain spelling mistakes, broken formatting, and noisy symbols.

Please first mentally clean and reconstruct the receipt before extracting transaction details.

Top lines likely containing merchant information:
${merchantHints.join("\n") || "None"}

Important candidate monetary lines:
${candidateLines.join("\n") || "None"}

Full OCR text:
${numberedLines.join("\n")}
`.trim();
};
