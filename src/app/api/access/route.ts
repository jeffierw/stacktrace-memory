import { assertInviteCode, namespaceForInvite } from "@/lib/server/access";
import { inviteSchema } from "@/lib/server/schemas";

export async function POST(request: Request) {
  try {
    const body = inviteSchema.parse(await request.json());
    const inviteCode = assertInviteCode(body.inviteCode);
    const namespace = namespaceForInvite(inviteCode);

    return Response.json({ namespace: namespace.slice(-8) });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to verify invite code.";
    return Response.json({ error: message }, { status: 401 });
  }
}
