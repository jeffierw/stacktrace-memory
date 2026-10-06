import "server-only";

import {
  MemWal,
  MemWalMock,
  type AnalyzedFact,
  type RememberBulkItemResult,
} from "@mysten-incubation/memwal";

import type { MemoryItem } from "@/lib/types";

type MemoryClient = MemWal | MemWalMock;

let memoryClient: MemoryClient | undefined;

export function getMemoryMode(): "mainnet" | "mock" | "unavailable" {
  if (process.env.MEMORY_MODE === "mock") {
    return "mock";
  }

  if (process.env.MEMWAL_PRIVATE_KEY && process.env.MEMWAL_ACCOUNT_ID) {
    return "mainnet";
  }

  return "unavailable";
}

function getMemoryClient() {
  if (memoryClient) {
    return memoryClient;
  }

  const mode = getMemoryMode();

  if (mode === "mock") {
    memoryClient = MemWalMock.create({
      namespace: "stacktrace-memory-local",
      owner: "stacktrace-local-tester",
    });
    return memoryClient;
  }

  if (mode === "mainnet") {
    memoryClient = MemWal.create({
      key: process.env.MEMWAL_PRIVATE_KEY!,
      accountId: process.env.MEMWAL_ACCOUNT_ID!,
      serverUrl:
        process.env.MEMWAL_SERVER_URL ??
        "https://relayer.memory.walrus.xyz",
      namespace: "stacktrace-memory",
      requestTimeoutMs: 30_000,
    });
    return memoryClient;
  }

  throw new Error("Walrus Memory is not configured.");
}

export async function recallMemories(namespace: string, query: string) {
  const mode = getMemoryMode();
  const result = await getMemoryClient().recall({
    query,
    namespace,
    topK: 5,
    // The offline mock uses token overlap rather than semantic embeddings, so
    // it needs a looser threshold for realistic cross-session UI tests.
    maxDistance: mode === "mock" ? 0.95 : 0.72,
    maxTokens: 700,
    truncationStrategy: "high-relevance-only",
  });

  return result.results.map(
    (memory): MemoryItem => ({
      text: memory.text,
      blobId: memory.blob_id,
      distance: memory.distance,
      createdAt: memory.created_at,
    }),
  );
}

function savedMemoryItems(
  facts: AnalyzedFact[],
  results: RememberBulkItemResult[],
) {
  return facts.map((fact, index): MemoryItem => {
    const stored = results[index];
    return {
      text: fact.text,
      blobId: fact.blob_id || stored?.blob_id,
    };
  });
}

export async function saveUserMemories(
  namespace: string,
  userMessage: string,
  occurredAt?: string,
) {
  const result = await getMemoryClient().analyzeAndWait(
    userMessage,
    {
      namespace,
      occurredAt: occurredAt ?? new Date().toISOString(),
    },
    {
      pollIntervalMs: 1_000,
      timeoutMs: 90_000,
    },
  );

  return savedMemoryItems(result.facts, result.results);
}
