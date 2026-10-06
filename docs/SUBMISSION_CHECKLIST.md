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

## Requires account access or owner input

- [x] Re-authenticate GitHub CLI (`jeffierw`)
- [x] Create and push public GitHub repository:
  https://github.com/jeffierw/stacktrace-memory
- [ ] Capture a screenshot or short demo video from the public deployment
- [ ] Confirm primary contact details
- [ ] Confirm a dedicated, user-controlled Sui wallet address for Sessions
- [ ] Publish `ARTICLE_DRAFT.md` on Medium or Inkray
- [ ] Submit Walrus Memory feedback, including the friction point and idea
- [ ] Optionally open the drafted GitHub feature request during the event
- [ ] Join the Walrus Discord
- [ ] Share the article on X, tagging `@WalrusProtocol` with `#WalrusMemory`
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
