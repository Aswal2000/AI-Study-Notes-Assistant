export type SummaryType =
  | "SHORT"
  | "DETAILED"
  | "KEY_POINTS"
  | "BEGINNER_FRIENDLY";

const SYSTEM_PROMPT = `You are a study assistant that summarizes technical notes for learners.
Only use the content supplied by the user. Do not add information that is not present.
If the supplied content is empty or too short to summarize, say so explicitly.`;

export function buildSummaryPrompt(
  content: string,
  type: SummaryType,
): { system: string; user: string } {
  const instructionByType: Record<SummaryType, string> = {
    SHORT: "Summarize in 2-3 sentences maximum.",
    DETAILED:
      "Write a thorough summary covering every major concept, organized under short headings.",
    KEY_POINTS:
      "Return 5-8 concise bullet points capturing the key points only.",
    BEGINNER_FRIENDLY:
      "Explain the content as if teaching a complete beginner. Avoid jargon or define it inline.",
  };

  const user = `${instructionByType[type]}

Content to summarize:
"""
${content}
"""`;

  return { system: SYSTEM_PROMPT, user };
}
