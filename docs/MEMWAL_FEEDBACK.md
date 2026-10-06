# Walrus Memory Feedback Draft

## Environment

- macOS
- Next.js 16.3.8 route handlers
- Node.js 20.19.3
- pnpm 8.4.0
- `@mysten-incubation/memwal` 0.1.8
- DeepSeek Flash via DeepSeek API and Vercel AI SDK
- Walrus Memory Mainnet relayer

## What worked well

- `rememberAndWait` made save-then-recall verification deterministic.
- `analyzeAndWait` extracted concise facts from a natural debugging report.
- Namespace isolation was easy to layer behind a server-derived HMAC value.
- Recall returned blob IDs and distances, which made memory behavior visible in
  the product instead of requiring blind trust.
- A real Mainnet write and exact-match recall succeeded without the delegate
  key or account owner wallet holding SUI or WAL.

## Friction point

It is difficult for a first-time integrator to understand the relationship
between the MemWal account ID, the account owner address, the delegate signing
address, and the wallet that pays for Mainnet writes. The dashboard supplies the
credentials needed by the SDK, but it does not make it obvious whether the
delegate or owner must be funded when using the managed relayer. This creates a
real risk that users transfer SUI or WAL to the wrong address.

### Steps that exposed the confusion

1. Create a Mainnet MemWal account and delegate key from the dashboard.
2. Configure `MemWal.create` with the returned account ID and delegate key.
3. Resolve the delegate address and account owner address.
4. Observe that both addresses have zero SUI and zero WAL.
5. Call `health` and observe `writeReady: true`.
6. Call `rememberAndWait`; the Mainnet blob is successfully written and
   recalled despite both balances being zero.

### Expected documentation

The setup guide should explicitly say who pays SUI and WAL in the managed
relayer flow, when an application must fund its own wallet, and which address
should be used for each path.

## Improvement idea

Add an "Account diagnostics" card and SDK helper that returns:

- network;
- MemWal account ID;
- resolved owner address;
- delegate public address;
- relayer sponsorship/payment mode;
- whether a user-funded balance is required;
- indexed Mainnet blob count;
- a Sui explorer link.

This would reduce setup errors and provide ready-made proof for hackathon
submissions.

## Potential GitHub issue title

`Clarify relayer funding and expose owner/delegate diagnostics`
