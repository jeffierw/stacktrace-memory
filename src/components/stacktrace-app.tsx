"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import type {
  AppStatus,
  ChatMessage,
  MemoryActivity,
  MemoryItem,
} from "@/lib/types";

const starters = [
  "My Next.js upload route returns 413 on Vercel.",
  "Docker builds locally but fails in CI.",
  "My Python dependency works outside the virtualenv only.",
];

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readError(response: Response) {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "The request failed.";
  } catch {
    return "The request failed.";
  }
}

function memoryActivities(
  items: MemoryItem[],
  type: "recalled" | "saved",
): MemoryActivity[] {
  const recordedAt = new Date().toISOString();
  return items.map((item) => ({
    ...item,
    id: makeId(type),
    type,
    recordedAt,
  }));
}

export function StackTraceApp() {
  const [status, setStatus] = useState<AppStatus>({
    aiMode: "unavailable",
    memoryMode: "unavailable",
    model: "deepseek-flash",
  });
  const [inviteInput, setInviteInput] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [testerId, setTesterId] = useState("");
  const [accessError, setAccessError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activities, setActivities] = useState<MemoryActivity[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((response) => response.json())
      .then((data: AppStatus) => setStatus(data))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function connect(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAccessError("");

    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: inviteInput }),
    });

    if (!response.ok) {
      setAccessError(await readError(response));
      return;
    }

    const data = (await response.json()) as { namespace: string };
    setInviteCode(inviteInput.trim().toUpperCase());
    setTesterId(data.namespace);
  }

  function addErrorActivity(text: string) {
    setActivities((current) => [
      {
        id: makeId("error"),
        type: "error",
        text,
        recordedAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }

  async function recall(query: string) {
    const response = await fetch("/api/memory/recall", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode, query }),
    });

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const data = (await response.json()) as { memories: MemoryItem[] };
    const recalled = memoryActivities(data.memories, "recalled");
    setActivities((current) => [...recalled, ...current]);
  }

  async function saveMemory(userMessage: string) {
    const response = await fetch("/api/memory/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inviteCode,
        userMessage,
        occurredAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(await readError(response));
    }

    const data = (await response.json()) as { memories: MemoryItem[] };
    const saved = memoryActivities(data.memories, "saved");
    setActivities((current) => [...saved, ...current]);
  }

  async function sendMessage(prefilled?: string) {
    const text = (prefilled ?? input).trim();
    if (!text || busy) return;

    const userMessage: ChatMessage = {
      id: makeId("user"),
      role: "user",
      content: text,
    };
    const assistantMessage: ChatMessage = {
      id: makeId("assistant"),
      role: "assistant",
      content: "",
    };
    const nextMessages = [...messages, userMessage];

    setInput("");
    setBusy(true);
    setMessages([...nextMessages, assistantMessage]);

    try {
      await recall(text);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode, messages: nextMessages }),
      });

      if (!response.ok || !response.body) {
        throw new Error(await readError(response));
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessage.id
              ? { ...message, content: answer }
              : message,
          ),
        );
      }

      await saveMemory(text);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      addErrorActivity(message);
      setMessages((current) =>
        current.map((item) =>
          item.id === assistantMessage.id && !item.content
            ? {
                ...item,
                content: `I could not complete that request: ${message}`,
              }
            : item,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function newSession() {
    setMessages([]);
    setInput("");
    setActivities((current) =>
      current.filter((activity) => activity.type === "saved"),
    );
  }

  if (!inviteCode) {
    return (
      <main className="access-screen">
        <section className="access-card">
          <div className="brand-mark">S/</div>
          <p className="eyebrow">Private beta · Walrus Memory</p>
          <h1>Debugging that remembers.</h1>
          <p>
            Continue where you left off. StackTrace Memory recalls your stack,
            failed fixes, and unresolved next steps across sessions.
          </p>
          <form className="access-form" onSubmit={connect}>
            <input
              aria-label="Tester invite code"
              autoComplete="off"
              maxLength={100}
              onChange={(event) => setInviteInput(event.target.value)}
              placeholder="TESTER INVITE CODE"
              spellCheck={false}
              value={inviteInput}
            />
            <button className="primary-button" type="submit">
              Enter workspace
            </button>
          </form>
          {accessError ? <p className="form-error">{accessError}</p> : null}
          <div className="privacy-note">
            Invite codes map to isolated memory spaces. Long-term memories are
            encrypted through Walrus Memory; never paste passwords, private
            keys, or production secrets into a debugging conversation.
          </div>
        </section>
      </main>
    );
  }

  const networkLabel =
    status.memoryMode === "mainnet"
      ? "Walrus Mainnet"
      : status.memoryMode === "mock"
        ? "Local memory demo"
        : "Memory unavailable";

  return (
    <main className="app-shell">
      <aside className="rail">
        <div className="brand-mark">S/</div>
        <p className="eyebrow">StackTrace Memory</p>
        <h1>Your debugging context, carried forward.</h1>
        <p className="rail-copy">
          A focused partner that remembers your environment, attempted fixes,
          outcomes, and next steps.
        </p>
        <ol className="rail-steps">
          <li><span>1</span>Describe the issue and exact environment.</li>
          <li><span>2</span>Try one controlled diagnostic at a time.</li>
          <li><span>3</span>Return later without repeating your history.</li>
        </ol>
        <div className="rail-footer">
          <div className="status-line">
            <span
              className={`status-dot ${status.memoryMode === "mainnet" ? "live" : status.memoryMode === "mock" ? "mock" : ""}`}
            />
            {networkLabel}
          </div>
          <p className="rail-copy">Tester space · {testerId}</p>
          <p className="rail-copy">Model · {status.model}</p>
        </div>
      </aside>

      <section className="chat-column">
        <header className="chat-header">
          <div>
            <h2>Debug workspace</h2>
            <p>New session, same long-term memory.</p>
          </div>
          <button className="ghost-button" onClick={newSession} type="button">
            + New session
          </button>
        </header>

        <div className="messages" aria-live="polite">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p className="prompt">
                Where did the bug <em>leave off?</em>
              </p>
              <p>
                Share the smallest reproducible symptom. Relevant context from
                earlier sessions will be recalled before the model answers.
              </p>
              <div className="starter-grid">
                {starters.map((starter) => (
                  <button
                    className="starter"
                    key={starter}
                    onClick={() => void sendMessage(starter)}
                    type="button"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="message-list">
              {messages.map((message) => (
                <article className={`message ${message.role}`} key={message.id}>
                  <div className="avatar">
                    {message.role === "user" ? "YOU" : "S/"}
                  </div>
                  <div>
                    <p className="message-role">
                      {message.role === "user" ? "Developer" : "StackTrace"}
                    </p>
                    <p
                      className={`message-text ${busy && message.role === "assistant" && !message.content ? "typing-cursor" : ""}`}
                    >
                      {message.content}
                    </p>
                  </div>
                </article>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="composer-wrap">
          <form
            className="composer"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            <textarea
              aria-label="Describe your debugging issue"
              disabled={busy}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Paste the exact error, command, and what you already tried…"
              rows={1}
              value={input}
            />
            <button
              aria-label="Send message"
              className="send-button"
              disabled={busy || !input.trim()}
              type="submit"
            >
              ↗
            </button>
          </form>
          <p className="composer-hint">
            Enter to send · Shift + Enter for a new line · Do not share secrets
          </p>
        </div>
      </section>

      <aside className="inspector">
        <div className="inspector-title">
          <div>
            <h2>Memory inspector</h2>
            <p>Evidence of what was recalled and written.</p>
          </div>
          <span className="memory-count">
            {activities.filter((activity) => activity.type === "saved").length}
          </span>
        </div>
        <hr className="inspector-rule" />
        {activities.length === 0 ? (
          <p className="inspector-empty">
            Memory activity will appear here after your first message. Start a
            new session later to show that context survives the reset.
          </p>
        ) : (
          <div className="memory-feed">
            {activities.map((activity) => (
              <article
                className={`memory-card ${activity.type}`}
                key={activity.id}
              >
                <div className="memory-meta">
                  <span>{activity.type}</span>
                  <span>
                    {activity.distance === undefined
                      ? ""
                      : `${Math.round((1 - activity.distance) * 100)}% match`}
                  </span>
                </div>
                <p>{activity.text}</p>
                {activity.blobId ? (
                  <div className="blob-id">blob · {activity.blobId}</div>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </aside>
    </main>
  );
}
