# I Built a Debugging Chatbot That Remembers What Already Failed

Every developer has had the same frustrating conversation with an AI assistant:
you explain the stack, paste the error, list the fixes you already tried, and
finally reach a useful next step. A day later you open a new session and repeat
the entire story.

I built **StackTrace Memory** to remove that reset. It is a debugging chatbot
powered by DeepSeek Flash and Walrus Memory. It remembers a developer's runtime,
symptoms, failed fixes, outcomes, and unresolved next steps across sessions. The
important part is not merely storing conversation history. It is recalling the
right facts at the moment they can change the next answer.

## Before memory

Without durable memory, a chatbot treats every session as a blank page. If a
developer already increased an application body-size limit and it failed, a new
chat may recommend the same change. The answer can be individually plausible
while still wasting time.

## The design

StackTrace Memory uses four server-side steps:

1. An invite code is validated and converted into an isolated namespace with
   HMAC-SHA256. The original code is never used as the namespace.
2. Before generating an answer, the server asks Walrus Memory for facts
   semantically related to the latest debugging message.
3. The recalled facts are inserted into the DeepSeek system context as
   untrusted user-authored data. They may inform the answer, but they may never
   act as instructions.
4. After the answer, the app analyzes only the developer's statement and saves
   durable facts. The assistant's guesses are not written back as truth.

Provider and delegate keys remain inside Next.js route handlers. A Memory
Inspector shows recalled and saved facts, similarity scores, and Walrus blob
IDs, making the memory behavior directly observable.

## Why DeepSeek

I used DeepSeek Flash through the DeepSeek API and Vercel AI SDK. The model asks
for one high-information diagnostic at a time and avoids recommending a failed
fix unless a materially different variation is justified. This also makes the
project eligible for the Beyond the Big Two category.

The LLM integration was straightforward. The more interesting integration
boundary was memory: a MemWal account is a shared Sui object, while the SDK uses
a delegate Ed25519 key for authenticated requests. The account owner address,
delegate signing address, and storage payment path are different concepts. In
the managed relayer flow, both resolved addresses had zero SUI and zero WAL, yet
the real Mainnet write completed successfully. Better visibility into that
funding model would make first-time setup easier.

## A real cross-session test

For the first session, I reported these facts:

- The project used Next.js 16, Node.js 20, and pnpm.
- A file-upload route returned HTTP 413 only on Vercel.
- Increasing the application body-size limit did not help.
- The next step was to inspect the platform proxy limit.
- A direct-to-storage upload was under consideration.

Walrus Memory extracted and stored five facts, each with a Mainnet blob ID. I
then started a fresh session and reported only the new evidence: the failure
started at 4.5 MB and the route's logging never fired.

The new response recalled all five relevant facts. It did not send me back to
the already-failed application limit. Instead, it connected the new evidence to
the platform boundary, confirmed the direct-to-storage direction, and focused
on the next implementation risks: CORS, signed content types, upload-size
enforcement, and a completion callback. The second message produced four more
durable facts. Together with an isolated smoke test, the agent reached ten
verified Mainnet blobs. A final test through the public deployment recalled five
of those earlier facts and stored three resolution facts, bringing the verified
total to thirteen.

That is the difference memory should make: not a badge saying "memory enabled,"
but a visibly better next answer.

## What I would improve next

The private beta uses invite codes to demonstrate namespace isolation. A
production version should use authenticated workspaces, deduplication, memory
review and correction controls, and rate limiting.

For Walrus Memory, I would like the dashboard to show the account owner,
delegate address, network, sponsorship status, and current Mainnet blob count in
one place. That would make setup and submission evidence much easier to verify.

The design stays deliberately small: recall relevant facts, answer the current
question, and save only what the developer actually reported. It feels less
like restarting a chatbot and more like returning to a debugging partner who
remembers where the investigation stopped.

## Links

- Live demo: https://stacktrace-memory.vercel.app
- Source code: https://github.com/jeffierw/stacktrace-memory
- Walrus Memory agent ID:
  `0xdfc4e57e4a0f9378d42267d68471419982b6e1e7d0c9619c6308091a3f69588a`
