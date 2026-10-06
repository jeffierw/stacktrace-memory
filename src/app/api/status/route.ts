import { getAiMode, getModelName } from "@/lib/server/ai";
import { getMemoryMode } from "@/lib/server/memory";

export async function GET() {
  return Response.json({
    aiMode: getAiMode(),
    memoryMode: getMemoryMode(),
    model: getModelName(),
  });
}
