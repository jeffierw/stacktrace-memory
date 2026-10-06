export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type MemoryItem = {
  text: string;
  blobId?: string;
  distance?: number;
  createdAt?: string;
};

export type MemoryActivity = MemoryItem & {
  id: string;
  type: "recalled" | "saved" | "error";
  recordedAt: string;
};

export type AppStatus = {
  aiMode: "deepseek" | "mock" | "unavailable";
  memoryMode: "mainnet" | "mock" | "unavailable";
  model: string;
};
