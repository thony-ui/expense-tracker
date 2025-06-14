import * as z from "zod";

const getPromptValidator = z.object({
  prompt: z
    .string()
    .min(1, "Prompt cannot be empty")
    .max(1000, "Prompt is too long"),
});

type TGetPromptValidator = z.infer<typeof getPromptValidator>;
export function validateGetPrompt(data: unknown): TGetPromptValidator {
  try {
    const parsed = getPromptValidator.parse(data);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `Validation error: ${error.errors.map((e) => e.message).join(", ")}`
      );
    }
    throw error; // rethrow unexpected errors
  }
}
