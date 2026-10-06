import { assertInviteCode, namespaceForInvite } from "@/lib/server/access";
import { saveUserMemories } from "@/lib/server/memory";
import { saveRequestSchema } from "@/lib/server/schemas";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const body = saveRequestSchema.parse(await request.json());
    const inviteCode = assertInviteCode(body.inviteCode);
    const namespace = namespaceForInvite(inviteCode);
    const memories = await saveUserMemories(
      namespace,
      body.userMessage,
      body.occurredAt,
    );

    return Response.json({ memories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Memory write failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
