import * as z from "zod";
import logger from "../../../logger";

const OCRValidator = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  file: z.instanceof(Buffer<ArrayBufferLike>),
  mimetype: z.enum(["image/jpeg", "image/png", "image/jpg"]),
});

type TOCRValidator = z.infer<typeof OCRValidator>;
export function validateOCRRequest(data: unknown): TOCRValidator {
  try {
    return OCRValidator.parse(data);
  } catch (error) {
    logger.error(
      `Validation failed for postSavingsGoal: ${JSON.stringify(error)}`,
    );
    throw error;
  }
}
