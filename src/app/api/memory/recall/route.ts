import { assertInviteCode, namespaceForInvite } from "@/lib/server/access";
import { recallMemories } from "@/lib/server/memory";
import { recallRequestSchema } from "@/lib/server/schemas";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = recallRequestSchema.parse(await request.json());
    const inviteCode = assertInviteCode(body.inviteCode);
    const namespace = namespaceForInvite(inviteCode);
    const memories = await recallMemories(namespace, body.query);

    return Response.json({ memories });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Memory recall failed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
