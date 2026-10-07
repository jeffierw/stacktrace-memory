# DeepSurge Project Fields

## Basic information

- Project logo: `docs/media/stacktrace-memory-logo.png`
- Project name: `StackTrace Memory`
- Track: `Special Prizes`
- Deployment network: `Sui Mainnet`
- Package ID: leave empty; the app integrates Walrus Memory through the managed
  Mainnet relayer and does not publish its own Move package.

## Description

StackTrace Memory is a DeepSeek-powered debugging chatbot that remembers a
developer's stack, failed fixes, outcomes, and unresolved next steps across
sessions. Before every answer it recalls relevant facts from Walrus Memory on
Mainnet and injects only the useful context. After the response it extracts and
stores durable facts reported by the developer.

The Memory Inspector exposes recalled facts, match scores, saved facts, and
Walrus blob IDs, making memory behavior visible and verifiable. Tester invite
codes are converted into stable HMAC-derived namespaces so separate users
cannot recall one another's data. Provider and delegate keys remain in
server-only Next.js route handlers.

The production test demonstrated cross-session recall: a fresh session
remembered an earlier Next.js/Vercel upload diagnosis, avoided repeating a
failed application-limit change, and continued with the unresolved platform
boundary investigation.

Built with Next.js 16, DeepSeek Flash, Vercel AI SDK, and
`@mysten-incubation/memwal` on Walrus Mainnet.

## Links

- Repository: https://github.com/jeffierw/stacktrace-memory
- Website: https://stacktrace-memory.vercel.app
- Article:
  https://medium.com/@jeffier2015/i-built-a-debugging-chatbot-that-remembers-what-already-failed-dea1dc2bc269
- X announcement reply: https://x.com/HiYepWan/status/2107694205976134068
- Demo video file: `docs/media/stacktrace-memory-demo.mp4`
- Public demo URL: https://youtu.be/oeTDY7iFiG8

## Media

- Project logo: `docs/media/stacktrace-memory-logo.png`
- Product screenshot: `docs/media/production-recall-proof-clean.png`
