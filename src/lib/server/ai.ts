import "server-only";

import { createDeepSeek } from "@ai-sdk/deepseek";

export function getAiMode(): "deepseek" | "mock" | "unavailable" {
  if (process.env.AI_MODE === "mock") {
    return "mock";
  }

  if (process.env.DEEPSEEK_API_KEY) {
    return "deepseek";
  }

  return "unavailable";
}

export function getModelName() {
  return process.env.DEEPSEEK_MODEL ?? "deepseek-flash";
}

export function getDeepSeekModel() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error("DeepSeek is not configured.");
  }

  const deepSeek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY,
    ...(process.env.DEEPSEEK_BASE_URL
      ? { baseURL: process.env.DEEPSEEK_BASE_URL }
      : {}),
  });

  return deepSeek(getModelName());
}
