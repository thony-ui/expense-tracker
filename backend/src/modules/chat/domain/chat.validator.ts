import * as z from "zod";

const getPromptValidator = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, "Prompt cannot be empty")
    .max(1000, "Prompt is too long"),
});

type TGetPromptValidator = z.infer<typeof getPromptValidator>;
export function validateGetPrompt(data: unknown): TGetPromptValidator {
  return getPromptValidator.parse(data);
}
