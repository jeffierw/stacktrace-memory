# Promotion Drafts

Replace `<ARTICLE_URL>` after the article is published.

## X

I built StackTrace Memory, a debugging chatbot that remembers your stack,
failed fixes, outcomes, and next steps across sessions.

It uses DeepSeek Flash + Walrus Memory on Mainnet, with observable recalls and
blob IDs instead of a black-box “memory enabled” badge.

Live: https://stacktrace-memory.vercel.app
Article: <ARTICLE_URL>
Code: https://github.com/jeffierw/stacktrace-memory

@WalrusProtocol #WalrusMemory

## Developer community

### Title

StackTrace Memory: a debugging chatbot that remembers what already failed

### Body

I built a small debugging assistant to test whether durable agent memory can
materially improve a later answer, rather than simply preserve chat history.

StackTrace Memory recalls relevant facts from Walrus Memory before each answer
and saves only facts explicitly reported by the developer. In a fresh session,
it remembered that an application-level upload-limit change had already failed
and moved the investigation to the platform proxy boundary instead of repeating
the same advice.

The project uses DeepSeek Flash, Next.js, and Walrus Memory on Mainnet. Its
Memory Inspector exposes recalled facts, similarity scores, saved facts, and
Walrus blob IDs.

- Live demo: https://stacktrace-memory.vercel.app
- Article: <ARTICLE_URL>
- Source: https://github.com/jeffierw/stacktrace-memory

Feedback on the memory extraction and debugging flow is welcome.
