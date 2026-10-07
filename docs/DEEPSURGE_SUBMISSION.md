# DeepSurge Submission Draft

## Project name

StackTrace Memory

## One-line description

A debugging partner that remembers your stack, failed fixes, and next steps
across sessions with verifiable Walrus Mainnet memory.

## Full description

I kept running into the same problem with coding assistants: every new chat
started from zero. I had to repeat the environment, paste the same logs, and
explain which fixes had already failed. StackTrace Memory is the debugging
partner I wanted—one that can leave a conversation and still pick up the actual
investigation later.

Before DeepSeek answers, the app semantically recalls only the relevant Walrus
Memory entries. Afterward, it extracts durable facts from the developer's own
message and stores them on Mainnet. The Memory Inspector shows recalled facts,
match scores, newly saved facts, and blob IDs, so a reviewer can see exactly
when memory changes an answer.

The demo uses two genuinely separate sessions. Session 1 saves the environment,
a failed timeout change, the observed failure boundary, and the next test. I
then clear the transcript and give Session 2 only one new symptom. It recalls
five earlier facts and continues with the saved next step instead of restarting
the diagnosis.

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
- Verified blob count as of 2026-10-07: **at least 14**
- Cross-session test: 5 earlier facts recalled in a fresh session, followed by
  4 new saved facts; an isolated smoke-test namespace contains 1 additional
  blob.
- Public production verification: 5 prior facts recalled and 3 new resolution
  facts stored through the deployed app.
- Latest production demo: 5 prior signed-upload facts recalled in a fresh
  session and 1 new fact saved to Mainnet.
- Example recalled blob:
  `i2pckLAmL3Q_tEgMLkfR2XB9iCzwA6uN3pneF_BVkLw`
- Example Mainnet smoke-test blob:
  `GlkiWfBuyaoGBq6enNoxXQ_tRuKi2MgyOR6TwUggHxc`
- Latest production demo blob:
  `Fs9ZUdYFV6th1HYuRypec5lM8LLi77-XA0fhEybvRBk`

## Required links and identity

- Live app: https://stacktrace-memory.vercel.app
- Public GitHub repository: https://github.com/jeffierw/stacktrace-memory
- Medium article:
  https://medium.com/@jeffier2015/i-built-a-debugging-chatbot-that-remembers-what-already-failed-dea1dc2bc269
- X post tagging `@WalrusProtocol` and `#WalrusMemory`:
  https://x.com/HiYepWan/status/2107694205976134068
- Demo video: https://youtu.be/eFr1amaHU9w
- Third-party community promotion link: **TODO**
- Primary contact: **TODO — owner must provide**
- GitHub account: `jeffierw`
- Dedicated Sessions wallet: **TODO — confirm a user-controlled Sui address**

## Judge quick test

1. Open https://stacktrace-memory.vercel.app.
2. Enter the dedicated judge invite code included in the DeepSurge submission.
3. In Session 1, describe an environment, an attempted fix, the outcome, and a
   next step. Wait for the saved facts and blob IDs.
4. Click **New session** and provide only a new observation.
5. Check the Memory Inspector for recalled facts and match scores, then confirm
   that the answer uses the saved context.

## Suggested demo script

1. Enter with tester code A and report a concrete bug, environment, failed fix,
   and next step.
2. Show the saved facts and Mainnet blob IDs in Memory Inspector.
3. Start a new session and provide only the new observation.
4. Point out the recalled facts and how DeepSeek avoids repeating the failed
   fix.
5. Enter with tester code B and show that tester A's facts are not recalled.
