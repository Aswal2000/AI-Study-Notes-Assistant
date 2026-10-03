import { Request, Response } from "express";
import { generateText } from "../services/llm.service";
import { buildSummaryPrompt, SummaryType } from "../prompts/summary.prompt";
import { buildQuizPrompt } from "../prompts/quiz.prompt";
import { parseQuizResponse } from "../validators/quiz.validator";

const VALID_SUMMARY_TYPES: SummaryType[] = [
  "SHORT",
  "DETAILED",
  "KEY_POINTS",
  "BEGINNER_FRIENDLY",
];

export async function summarize(req: Request, res: Response) {
  const { content, type } = req.body as { content?: string; type?: string };

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "content is required" });
  }

  const summaryType = VALID_SUMMARY_TYPES.includes(type as SummaryType)
    ? (type as SummaryType)
    : "KEY_POINTS";

  try {
    const { system, user } = buildSummaryPrompt(content, summaryType);
    const summary = await generateText(system, user);
    res.json({ summary, type: summaryType });
  } catch (error) {
    console.error("Summarize failed", error);
    res.status(502).json({ error: "Failed to generate summary" });
  }
}

export async function generateQuiz(req: Request, res: Response) {
  const { content, numberOfQuestions, difficulty } = req.body as {
    content?: string;
    numberOfQuestions?: number;
    difficulty?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  };

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ error: "content is required" });
  }

  const count =
    numberOfQuestions && numberOfQuestions > 0
      ? Math.min(numberOfQuestions, 10)
      : 5;
  //   const questionCount = numberOfQuestions && numberOfQuestions > 0 ? Math.min(numberOfQuestions, 10) : 5;
  //   const quizDifficulty = difficulty ?? "INTERMEDIATE";

  try {
    const { system, user } = buildQuizPrompt({
      content,
      numberOfQuestions: count,
      difficulty: difficulty ?? "INTERMEDIATE",
    });

    const raw = await generateText(system, user, {
      json: true,
    });
    console.log("Raw quiz response:", raw);
    const quiz = parseQuizResponse(raw);
    res.json(quiz);
  } catch (error) {
    console.error("Quiz generation failed", error);
    res
      .status(502)
      .json({ error: "Failed to generate a valid quiz. Please try again." });
  }
}
