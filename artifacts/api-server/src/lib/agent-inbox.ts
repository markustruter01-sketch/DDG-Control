// Claude <-> Ollie message channel, held in one private GitHub repo that holds
// nothing else. Claude pushes claude-to-ollie.md; Ollie's run reads it and
// writes its reply to ollie-to-claude/<date>.md. The token (GITHUB_INBOX_TOKEN)
// is scoped to that one repo, contents only. Missing token = channel off.

const INBOX_REPO = "markustruter01-sketch/ddg-agent-inbox";
const CONTENTS_URL = `https://api.github.com/repos/${INBOX_REPO}/contents`;
const TIMEOUT_MS = 10_000;
export const CLAUDE_NOTES_MAX_CHARS = 20_000;

export type ClaudeNotes = {
  status: "ok" | "not_configured" | "unavailable";
  text: string | null;
};

function inboxToken(): string | null {
  return process.env.GITHUB_INBOX_TOKEN?.trim() || null;
}

function headers(token: string, accept: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "ddg-control-ollie",
  };
}

export async function fetchClaudeNotes(): Promise<ClaudeNotes> {
  const token = inboxToken();
  if (!token) return { status: "not_configured", text: null };
  try {
    const response = await fetch(`${CONTENTS_URL}/claude-to-ollie.md`, {
      headers: headers(token, "application/vnd.github.raw+json"),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return { status: "unavailable", text: null };
    const text = await response.text();
    return { status: "ok", text: text.slice(0, CLAUDE_NOTES_MAX_CHARS) };
  } catch {
    return { status: "unavailable", text: null };
  }
}

export async function writeOllieReply(
  date: string,
  markdown: string,
): Promise<"ok" | "not_configured" | "failed"> {
  const token = inboxToken();
  if (!token) return "not_configured";
  const url = `${CONTENTS_URL}/ollie-to-claude/${date}.md`;
  try {
    // A forced re-run on the same day replaces that day's file.
    const existing = await fetch(url, {
      headers: headers(token, "application/vnd.github+json"),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const sha =
      existing.ok
        ? ((await existing.json()) as { sha?: unknown }).sha
        : undefined;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        ...headers(token, "application/vnd.github+json"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Ollie report ${date}`,
        content: Buffer.from(markdown, "utf8").toString("base64"),
        ...(typeof sha === "string" ? { sha } : {}),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok ? "ok" : "failed";
  } catch {
    return "failed";
  }
}
