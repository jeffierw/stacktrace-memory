import { z } from "zod";

export const inviteSchema = z.object({
  inviteCode: z.string().trim().min(3).max(100),
});

export const chatMessageSchema = z.object({
  id: z.string().max(100),
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(8_000),
});

export const chatRequestSchema = inviteSchema.extend({
  messages: z.array(chatMessageSchema).min(1).max(30),
});

export const recallRequestSchema = inviteSchema.extend({
  query: z.string().trim().min(1).max(8_000),
});

export const saveRequestSchema = inviteSchema.extend({
  userMessage: z.string().trim().min(1).max(8_000),
  occurredAt: z.iso.datetime().optional(),
});
