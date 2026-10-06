import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

function configuredInviteCodes() {
  return (process.env.TESTER_INVITE_CODES ?? "")
    .split(",")
    .map((code) => code.trim().toUpperCase())
    .filter(Boolean);
}

function constantTimeEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const leftBuffer = encoder.encode(left);
  const rightBuffer = encoder.encode(right);

  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function normalizeInviteCode(value: string) {
  return value.trim().toUpperCase();
}

export function assertInviteCode(value: string) {
  const inviteCode = normalizeInviteCode(value);
  const codes = configuredInviteCodes();

  if (codes.length === 0) {
    throw new Error("Invite access is not configured.");
  }

  if (!codes.some((code) => constantTimeEqual(code, inviteCode))) {
    throw new Error("That invite code is not valid.");
  }

  return inviteCode;
}

export function namespaceForInvite(inviteCode: string) {
  const secret = process.env.APP_NAMESPACE_SECRET;

  if (!secret || secret.length < 16) {
    throw new Error("Namespace isolation is not configured.");
  }

  const digest = createHmac("sha256", secret)
    .update(`stacktrace-memory:v1:${inviteCode}`)
    .digest("hex");

  return `stacktrace-v1-${digest.slice(0, 24)}`;
}
