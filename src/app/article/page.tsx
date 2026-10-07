import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I Built a Debugging Chatbot That Remembers What Already Failed",
  description:
    "How StackTrace Memory uses DeepSeek and Walrus Memory to recall debugging context across sessions.",
};

export default function ArticlePage() {
  return (
    <main className="min-h-screen bg-[#f7f3e9] px-6 py-16 text-[#17211c]">
      <article className="mx-auto max-w-3xl space-y-6 text-lg leading-8">
        <header className="space-y-4 border-b border-[#17211c]/20 pb-8">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-[#486653]">
            StackTrace Memory
          </p>
          <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
            I Built a Debugging Chatbot That Remembers What Already Failed
          </h1>
        </header>

        <p>
          Every developer has had the same frustrating conversation with an AI
          assistant: you explain the stack, paste the error, list the fixes you
          already tried, and finally reach a useful next step. A day later you
          open a new session and repeat the entire story.
        </p>
        <p>
          I built <strong>StackTrace Memory</strong> to remove that reset. It is
          a debugging chatbot powered by DeepSeek Flash and Walrus Memory. It
          remembers a developer&apos;s runtime, symptoms, failed fixes,
          outcomes, and unresolved next steps across sessions. The important
          part is not merely storing conversation history. It is recalling the
          right facts at the moment they can change the next answer.
        </p>

        <h2 className="pt-6 text-3xl font-semibold">Before memory</h2>
        <p>
          Without durable memory, a chatbot treats every session as a blank
          page. If a developer already increased an application body-size limit
          and it failed, a new chat may recommend the same change. The answer
          can be individually plausible while still wasting time.
        </p>

        <h2 className="pt-6 text-3xl font-semibold">The design</h2>
        <p>StackTrace Memory uses four server-side steps:</p>
        <ol className="list-decimal space-y-3 pl-7">
          <li>
            An invite code is validated and converted into an isolated
            namespace with HMAC-SHA256. The original code is never used as the
            namespace.
          </li>
          <li>
            Before generating an answer, the server asks Walrus Memory for
            facts semantically related to the latest debugging message.
          </li>
          <li>
            The recalled facts are inserted into the DeepSeek system context
            as untrusted user-authored data. They may inform the answer, but
            they may never act as instructions.
          </li>
          <li>
            After the answer, the app analyzes only the developer&apos;s
            statement and saves durable facts. The assistant&apos;s guesses are
            not written back as truth.
          </li>
        </ol>
        <p>
          Provider and delegate keys remain inside Next.js route handlers. A
          Memory Inspector shows recalled and saved facts, similarity scores,
          and Walrus blob IDs, making the memory behavior directly observable.
        </p>

        <h2 className="pt-6 text-3xl font-semibold">Why DeepSeek</h2>
        <p>
          I used DeepSeek Flash through the DeepSeek API and Vercel AI SDK. The
          model asks for one high-information diagnostic at a time and avoids
          recommending a failed fix unless a materially different variation is
          justified. This also makes the project eligible for the Beyond the
          Big Two category.
        </p>
        <p>
          The LLM integration was straightforward. The more interesting
          integration boundary was memory: a MemWal account is a shared Sui
          object, while the SDK uses a delegate Ed25519 key for authenticated
          requests. The account owner address, delegate signing address, and
          storage payment path are different concepts. In the managed relayer
          flow, both resolved addresses had zero SUI and zero WAL, yet the real
          Mainnet write completed successfully. Better visibility into that
          funding model would make first-time setup easier.
        </p>

        <h2 className="pt-6 text-3xl font-semibold">
          A real cross-session test
        </h2>
        <p>For the first session, I reported these facts:</p>
        <ul className="list-disc space-y-2 pl-7">
          <li>The project used Next.js 16, Node.js 20, and pnpm.</li>
          <li>A file-upload route returned HTTP 413 only on Vercel.</li>
          <li>Increasing the application body-size limit did not help.</li>
          <li>The next step was to inspect the platform proxy limit.</li>
          <li>A direct-to-storage upload was under consideration.</li>
        </ul>
        <p>
          Walrus Memory extracted and stored five facts, each with a Mainnet
          blob ID. I then started a fresh session and reported only the new
          evidence: the failure started at 4.5 MB and the route&apos;s logging
          never fired.
        </p>
        <p>
          The new response recalled all five relevant facts. It did not send me
          back to the already-failed application limit. Instead, it connected
          the new evidence to the platform boundary, confirmed the
          direct-to-storage direction, and focused on the next implementation
          risks: CORS, signed content types, upload-size enforcement, and a
          completion callback. The second message produced four more durable
          facts. Together with an isolated smoke test, the agent reached ten
          verified Mainnet blobs. A final test through the public deployment
          recalled five of those earlier facts and stored three resolution
          facts, bringing the verified total to thirteen.
        </p>
        <p>
          That is the difference memory should make: not a badge saying
          &ldquo;memory enabled,&rdquo; but a visibly better next answer.
        </p>

        <h2 className="pt-6 text-3xl font-semibold">
          What I would improve next
        </h2>
        <p>
          The private beta uses invite codes to demonstrate namespace
          isolation. A production version should use authenticated workspaces,
          deduplication, memory review and correction controls, and rate
          limiting.
        </p>
        <p>
          For Walrus Memory, I would like the dashboard to show the account
          owner, delegate address, network, sponsorship status, and current
          Mainnet blob count in one place. That would make setup and submission
          evidence much easier to verify.
        </p>
        <p>
          The design stays deliberately small: recall relevant facts, answer
          the current question, and save only what the developer actually
          reported. It feels less like restarting a chatbot and more like
          returning to a debugging partner who remembers where the
          investigation stopped.
        </p>

        <h2 className="pt-6 text-3xl font-semibold">Links</h2>
        <ul className="list-disc space-y-2 break-words pl-7">
          <li>
            Live demo:{" "}
            <a className="underline" href="https://stacktrace-memory.vercel.app">
              https://stacktrace-memory.vercel.app
            </a>
          </li>
          <li>
            Source code:{" "}
            <a
              className="underline"
              href="https://github.com/jeffierw/stacktrace-memory"
            >
              https://github.com/jeffierw/stacktrace-memory
            </a>
          </li>
          <li>
            Walrus Memory agent ID:{" "}
            <code className="font-mono text-sm">
              0xdfc4e57e4a0f9378d42267d68471419982b6e1e7d0c9619c6308091a3f69588a
            </code>
          </li>
        </ul>
      </article>
    </main>
  );
}
