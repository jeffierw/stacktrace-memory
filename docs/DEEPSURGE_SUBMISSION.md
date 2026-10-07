# DeepSurge Submission Draft

## Project name

StackTrace Memory

## One-line description

A DeepSeek-powered debugging chatbot that remembers a developer's stack,
failed fixes, outcomes, and unresolved next steps across sessions using Walrus
Memory on Mainnet.

## Full description

Developers lose time when every debugging conversation starts from zero.
StackTrace Memory recalls only the context relevant to the current symptom,
warns when a proposed fix has already failed, and carries unresolved next steps
into a new session. It is designed for individual developers and small
engineering teams that need continuity without turning an entire chat history
into a prompt.

Each tester receives an invite code. The server converts it into a stable,
non-reversible namespace using HMAC-SHA256, preventing testers from reading one
another's memory. Before each DeepSeek response, the app semantically recalls
relevant Walrus Memory entries and injects them as untrusted context. After the
response, only the user's own statement is analyzed into durable facts and
stored on Walrus Mainnet. The Memory Inspector exposes recalled and saved facts,
similarity scores, and blob IDs so memory is visible rather than decorative.

## Model and runtime

- LLM: DeepSeek Flash
- Provider: DeepSeek API
- Runtime: Vercel AI SDK in Next.js 16 route handlers
- Memory: `@mysten-incubation/memwal` with the Mainnet relayer
- Package manager: pnpm

This qualifies for the **Beyond the Big Two** category. Integration friction:
the Walrus Memory account ID, account owner, delegate signing address, and
relayer funding model are distinct concepts. The dashboard and SDK successfully
hide most of that complexity, but it is not obvious which address—if any—needs
SUI and WAL for a relayer-backed write. Both resolved addresses had zero balance
while the managed Mainnet write still completed successfully.

## Mainnet proof

- MemWal agent/account ID:
  `0xdfc4e57e4a0f9378d42267d68471419982b6e1e7d0c9619c6308091a3f69588a`
- Verified blob count on 2026-10-06: **13**
- Cross-session test: 5 earlier facts recalled in a fresh session, followed by
  4 new saved facts; an isolated smoke-test namespace contains 1 additional
  blob.
- Public production verification: 5 prior facts recalled and 3 new resolution
  facts stored through the deployed app.
- Example recalled blob:
  `i2pckLAmL3Q_tEgMLkfR2XB9iCzwA6uN3pneF_BVkLw`
- Example Mainnet smoke-test blob:
  `GlkiWfBuyaoGBq6enNoxXQ_tRuKi2MgyOR6TwUggHxc`

## Required links and identity

- Live app: https://stacktrace-memory.vercel.app
- Public GitHub repository: https://github.com/jeffierw/stacktrace-memory
- Medium article:
  https://medium.com/@jeffier2015/i-built-a-debugging-chatbot-that-remembers-what-already-failed-dea1dc2bc269
- X post tagging `@WalrusProtocol` and `#WalrusMemory`:
  https://x.com/HiYepWan/status/2107694205976134068
- Third-party community promotion link: **TODO**
- Primary contact: **TODO — owner must provide**
- GitHub account: `jeffierw`
- Dedicated Sessions wallet: **TODO — confirm a user-controlled Sui address**

## Suggested demo script

1. Enter with tester code A and report a concrete bug, environment, failed fix,
   and next step.
2. Show the saved facts and Mainnet blob IDs in Memory Inspector.
3. Start a new session and provide only the new observation.
4. Point out the recalled facts and how DeepSeek avoids repeating the failed
   fix.
5. Enter with tester code B and show that tester A's facts are not recalled.
