import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env";

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

export interface GenerateOptions {
  json?: boolean;
}

export async function generateText(
  systemPrompt: string,
  userPrompt: string,
  options: GenerateOptions = {},
): Promise<string> {
  const response = await ai.models.generateContent({
    model: env.chatModel,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      ...(options.json ? { responseMimeType: "application/json" } : {}),
    },
  });
  const text = response.text;
  if (!text) {
    throw new Error("LLM returned an empty response");
  }
  return text;
}
