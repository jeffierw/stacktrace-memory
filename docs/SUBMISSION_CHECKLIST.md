# Submission Checklist

Deadline: **2026-10-09 14:00 UTC**

## Completed

- [x] Working chatbot UI
- [x] DeepSeek Flash integration
- [x] Walrus Memory Mainnet integration
- [x] Server-only API and delegate keys
- [x] Stable per-tester namespace isolation
- [x] Cross-session recall demonstrated in the existing Chrome session
- [x] 13 Mainnet memories verified across local and public production flows
- [x] Mainnet agent/account ID recorded
- [x] Production build passes
- [x] TypeScript check passes
- [x] DeepSurge submission copy drafted
- [x] Medium/Inkray article drafted
- [x] Walrus Memory feedback drafted
- [x] Vercel production project linked and deployed
- [x] Production environment variables configured securely
- [x] Public URL cross-session write/recall test passed
- [x] DeepSurge builder registration completed for Special Prizes
- [x] Article revised to the requested 500–800 word range
- [x] X and third-party developer-community promotion copy drafted

## Requires account access or owner input

- [x] Re-authenticate GitHub CLI (`jeffierw`)
- [x] Create and push public GitHub repository:
  https://github.com/jeffierw/stacktrace-memory
- [ ] Complete two additional real-user tests with at least 10 saved memories
  per tester
- [ ] Capture a screenshot or short demo video from the public deployment
- [ ] Confirm primary contact details
- [ ] Confirm a dedicated, user-controlled Sui wallet address for Sessions
- [x] Publish `ARTICLE_DRAFT.md` on Medium:
  https://medium.com/@jeffier2015/i-built-a-debugging-chatbot-that-remembers-what-already-failed-dea1dc2bc269
- [ ] Submit Walrus Memory feedback, including the friction point and idea
- [ ] Optionally open the drafted GitHub feature request during the event
- [ ] Join the Walrus Discord
- [x] Share the article on X, tagging `@WalrusProtocol` with `#WalrusMemory`:
  https://x.com/HiYepWan/status/2107694205976134068
- [ ] Share the article in a qualifying third-party developer community
- [ ] Submit once on DeepSurge before the deadline

## Production smoke test

After deployment:

1. Open `/api/status` and confirm `deepseek`, `mainnet`, and
   `deepseek-flash`.
2. Enter with one tester code and send a report containing at least two facts.
3. Wait for blob IDs in Memory Inspector.
4. Start a new session and send only a related update.
5. Confirm earlier facts appear as recalled and affect the answer.
6. Repeat with a second tester code and confirm no first-tester memory appears.
