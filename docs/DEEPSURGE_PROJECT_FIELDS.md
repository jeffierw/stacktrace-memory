# DeepSurge Project Fields

## Basic information

- Project logo: `docs/media/stacktrace-memory-logo.png`
- Project name: `StackTrace Memory`
- Track: `Special Prizes`
- Deployment network: `Sui Mainnet`
- Package ID: leave empty; the app integrates Walrus Memory through the managed
  Mainnet relayer and does not publish its own Move package.

## Description

Most debugging chats become useless the moment you open a new session. I built
StackTrace Memory so I would not have to explain my stack, failed fixes, and
unfinished investigation every time I came back to a problem.

Before each answer, the app recalls only the relevant facts from Walrus Memory
on Mainnet. After the answer, it turns the developer's own observations into
durable facts. The Memory Inspector shows what was recalled, how closely it
matched, what was newly saved, and the corresponding Walrus blob IDs. That
makes the memory behavior inspectable instead of a hidden claim.

In the production demo, Session 1 records a real debugging trail: the
environment, a failed timeout change, an observed boundary, and the next test.
I then click New session, enter only one new symptom, and the assistant recalls
five earlier facts with match scores and blob IDs before continuing from the
saved next step.

Each invite code maps to an isolated HMAC-derived namespace, so reviewers can
try the live app without seeing another tester's memories. Provider and signing
keys stay in server-only Next.js routes.

Built with Next.js 16, DeepSeek Flash, Vercel AI SDK, and
`@mysten-incubation/memwal` on Walrus Mainnet.

## Links

- Repository: https://github.com/jeffierw/stacktrace-memory
- Website: https://stacktrace-memory.vercel.app
- Article:
  https://medium.com/@jeffier2015/i-built-a-debugging-chatbot-that-remembers-what-already-failed-dea1dc2bc269
- X announcement reply: https://x.com/HiYepWan/status/2107694205976134068
- Demo video file: `docs/media/stacktrace-memory-demo-v2.mp4`
- Public demo URL: https://youtu.be/eFr1amaHU9w

## Media

- Project logo: `docs/media/stacktrace-memory-logo.png`
- Product screenshot: `docs/media/production-recall-proof-clean.png`

## Judge experience

1. Open https://stacktrace-memory.vercel.app and enter the dedicated judge
   invite code supplied in the submission.
2. Describe a bug, environment, one attempted fix, its outcome, and a next step.
3. Wait for the Memory Inspector to show saved facts and Mainnet blob IDs.
4. Click **New session** and provide only a new symptom.
5. Verify that earlier facts return with match scores and influence the answer.
