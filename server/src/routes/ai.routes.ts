import { Router } from "express";
import { summarize, generateQuiz } from "../controllers/ai.controller";

export const aiRouter = Router();

aiRouter.post("/summarize", summarize);
aiRouter.post("/generate-quiz", generateQuiz);
