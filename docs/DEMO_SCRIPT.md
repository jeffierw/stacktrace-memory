# Demo Script

Target length: 45–60 seconds.

## Recording sequence

1. Open the public deployment at https://stacktrace-memory.vercel.app.
2. Enter the primary tester workspace and show the existing debugging thread.
3. Point to the Memory Inspector and show both `RECALLED` and `SAVED` cards,
   including match percentages and Walrus blob IDs.
4. Select **New session** to demonstrate that the chat transcript is cleared
   while long-term memory remains available.
5. Send a short follow-up that does not repeat the original history:

   > The signed upload works, but requests fail only when Content-Type differs
   > from the value used to create the signed URL. What should I check next?

6. Show that the answer uses the earlier direct-to-storage decision and failed
   application-limit fix, then show the newly saved memory cards.
7. End on the Memory Inspector with `Walrus Mainnet` and `deepseek-flash`
   visible.

## Suggested voice-over

StackTrace Memory is a DeepSeek debugging chatbot with durable Walrus Memory.
It recalls the developer's environment, attempted fixes, outcomes, and next
steps across sessions. Here the new session contains no copied transcript, but
the assistant retrieves the earlier upload diagnosis from Walrus Mainnet,
avoids repeating the failed application-level fix, and recommends the next
specific check. The Memory Inspector makes every recalled and saved fact
auditable through similarity scores and Walrus blob IDs.

## Recording constraints

- Record only the public production deployment.
- Do not show the invite code, API keys, delegate key, or environment files.
- Keep the browser address bar visible long enough to prove the deployment URL.
- Prefer 1080p landscape output.
