import { Application, Router } from "express";
import { authenticateUser } from "../../../../middleware/authorization";
import multer from "multer";
import { OCRController } from "../../domain/ocr.controller";
import { OCRService } from "../../domain/ocr.service";
import { TransactionService } from "../../../transaction/domain/transaction.service";
import { TransactionRepository } from "../../../transaction/domain/transaction.repository";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/heic",
      "image/heif",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, JPEG, and PNG files are allowed"));
    }
  },
});
export function defineOCRRoutes(expressApp: Application) {
  const ocrRouter = Router();

  const ocrService = new OCRService();
  const transactionRepository = new TransactionRepository();
  const ocrController = new OCRController(ocrService, transactionRepository);

  ocrRouter.post("/", upload.single("file"), ocrController.postOCR);

  expressApp.use("/v1/ocr", authenticateUser, ocrRouter);
}
