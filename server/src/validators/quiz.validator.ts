import { z } from "zod";

const quizQuestionSchema = z
  .object({
    question: z.string().min(1),
    options: z.array(z.string().min(1)).length(4),
    correctAnswer: z.string().min(1),
    explanation: z.string().min(1),
  })
  .refine((q) => q.options.includes(q.correctAnswer), {
    message: "correctAnswer must be exactly one of the questions",
  });

const quizResponseSchema = z.object({
  questions: z.array(quizQuestionSchema).min(1),
});

export type QuizResponse = z.infer<typeof quizResponseSchema>;

export function parseQuizResponse(raw: string): QuizResponse {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("LLM did not return valid JSON for the quiz");
  }

  const result = quizResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Quiz failed validation: ${JSON.stringify(result.error.issues)}`,
    );
  }
  return result.data;
}
