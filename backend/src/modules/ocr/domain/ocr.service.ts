import Tesseract from "tesseract.js";

export class OCRService {
  async processImage(
    fileBuffer: Buffer<ArrayBufferLike>,
  ): Promise<{ text: string }> {
    const {
      data: { text },
    } = await Tesseract.recognize(fileBuffer, "eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });
    return { text };
  }
}
