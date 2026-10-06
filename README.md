# StackTrace Memory

StackTrace Memory is a debugging partner that remembers a developer's stack,
errors, attempted fixes, outcomes, and unresolved next steps across chat
sessions. It uses DeepSeek for responses and Walrus Memory for encrypted,
portable long-term memory.

## Why memory matters

Generic support bots repeatedly ask for the same environment details and often
recommend fixes that already failed. StackTrace Memory recalls only relevant
context before responding, then extracts durable facts from each new user
message after the response.

Each tester receives an invite code. The server maps that code to a stable,
non-reversible namespace using HMAC-SHA256, so memories from different testers
do not mix.

## Architecture

```text
Browser
  ├─ /api/access        → validates an invite code and derives an isolated namespace
  ├─ /api/chat          → recalls relevant memory → DeepSeek → streamed response
  ├─ /api/memory/save   → analyzes the user's statement → Walrus Memory Mainnet
  └─ /api/memory/recall → returns evidence for the Memory Inspector
```

Invite codes never become namespaces directly. The server derives a stable,
non-reversible namespace with HMAC-SHA256 and a server-only secret.

## Local development

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev
```

Create `.env.local` from `.env.example`. For UI-only development, set
`AI_MODE=mock`, `MEMORY_MODE=mock`, and use three development codes such as:

```text
DEMO-ALPHA
DEMO-BRAVO
DEMO-CHARLIE
```

Mock mode never contacts DeepSeek, Sui, Seal, or Walrus. It exists for UI and
integration testing only and is not eligible evidence for the hackathon. Do not
commit `.env.local`.

## Mainnet configuration

Copy `.env.example` to `.env.local` and configure:

```bash
AI_MODE=deepseek
DEEPSEEK_API_KEY=...
DEEPSEEK_MODEL=deepseek-flash

MEMORY_MODE=mainnet
MEMWAL_PRIVATE_KEY=...
MEMWAL_ACCOUNT_ID=0x...
MEMWAL_SERVER_URL=https://relayer.memory.walrus.xyz

APP_NAMESPACE_SECRET=use-a-long-random-value
TESTER_INVITE_CODES=TESTER-ONE,TESTER-TWO,TESTER-THREE
```

Never expose `DEEPSEEK_API_KEY` or `MEMWAL_PRIVATE_KEY` through a
`NEXT_PUBLIC_` variable. Both integrations run only in server route handlers.

## Memory lifecycle

1. The browser sends the latest issue to `/api/memory/recall` for inspector
   evidence.
2. `/api/chat` independently recalls the same namespace and injects only
   relevant results as untrusted context for DeepSeek.
3. The response streams to the browser.
4. `/api/memory/save` runs `analyzeAndWait` on the user's own statement.
5. Extracted facts and Mainnet blob IDs appear in the Memory Inspector.

Assistant suggestions are not saved as facts. A proposed fix becomes durable
memory only after the user reports that they tried it or describes its result.

## Verification

```bash
pnpm typecheck
pnpm build
```

The verified Mainnet agent is:

```text
MemWal account ID: 0xdfc4e57e4a0f9378d42267d68471419982b6e1e7d0c9619c6308091a3f69588a
Primary LLM: DeepSeek Flash via the DeepSeek API
Verified Mainnet memories on 2026-10-06: 13
Live app: https://stacktrace-memory.vercel.app
```

The verification used a fresh session to recall five facts written in an
earlier session, then stored four new facts with returned Walrus blob IDs. A
second test through the public production URL recalled five relevant facts and
stored three resolution facts. The isolated smoke-test namespace contains one
additional blob.

For the judged demo, use multiple real testers with separate invite codes.
Record screenshots or video showing the previous-session facts being recalled
and influencing the next response.

## Deployment

Deploy the Next.js app to a provider that supports streaming route handlers and
set every variable from `.env.example` in the production environment. Keep
`DEEPSEEK_API_KEY`, `MEMWAL_PRIVATE_KEY`, and `APP_NAMESPACE_SECRET` encrypted
and server-only. After deployment, verify `/api/status`, then complete a real
write and cross-session recall through the public URL.

Submission drafts and the remaining launch checklist are in [`docs/`](./docs/).
