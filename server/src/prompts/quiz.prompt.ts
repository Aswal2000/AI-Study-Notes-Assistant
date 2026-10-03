export interface QuizPromptInput {
  content: string;
  numberOfQuestions: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

const SYSTEM_PROMPT = `You are an educational quiz generator.
You must only ask questions that can be answered using the supplied content.
Do not invent facts that are not present in the content.
You must return valid JSON only, matching exactly this shape:

{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string (must exactly match one of the options)",
      "explanation": "string"
    }
  ]
}

Return nothing except this JSON object.`;

export function buildQuizPrompt(input: QuizPromptInput): {
  system: string;
  user: string;
} {
  const user = `Generate exactly ${input.numberOfQuestions} multiple-choice questions
at ${input.difficulty} difficulty, using only the content below.
Each question must have exactly 4 options and exactly one correct answer.

Content:
"""
${input.content}
"""`;

  return { system: SYSTEM_PROMPT, user };
}
