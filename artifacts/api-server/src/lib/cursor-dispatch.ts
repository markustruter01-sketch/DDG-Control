export type CursorDispatchTask = {
  id: number;
  title: string;
  objective: string;
  outcome: string;
  checklist: string[];
  acceptance_checks: string[];
  stop_condition: string;
  time_limit_minutes: number;
  max_attempts: number;
  repository: string;
  target_branch: string;
};

export function buildCursorAgentPayload(input: {
  task: CursorDispatchTask;
  modelId: string;
  agentId: string;
}): Record<string, unknown> {
  const { task } = input;
  return {
    agentId: input.agentId,
    name: task.title.slice(0, 100),
    prompt: {
      text: [
        `Work item #${task.id}: ${task.title}`,
        `Objective: ${task.objective}`,
        `Outcome: ${task.outcome}`,
        `Checklist:\n${task.checklist.map((item) => `- ${item}`).join("\n")}`,
        `Acceptance checks:\n${task.acceptance_checks.map((item) => `- ${item}`).join("\n")}`,
        `Requested bounds: ${task.time_limit_minutes} minutes and at most ${task.max_attempts} attempt(s). These are not provider-enforced by this adapter; do not continue if an enforceable stop is unavailable.`,
        `Stop condition: ${task.stop_condition}`,
        "Do not merge, publish, deploy, alter production data, or modify trading logic. Return branch, commit, review link, verification, blockers, and recovery notes.",
      ].join("\n\n"),
    },
    model: { id: input.modelId },
    repos: [{ url: task.repository, startingRef: task.target_branch }],
    autoCreatePR: false,
  };
}

export async function createCursorAgent(
  apiKey: string,
  payload: Record<string, unknown>,
  fetchImpl: typeof fetch = fetch,
): Promise<{ agentId: string; runId: string; runStatus: string }> {
  const response = await fetchImpl("https://api.cursor.com/v1/agents", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) {
    throw new Error(`Cursor dispatch returned HTTP ${response.status}`);
  }
  const result: unknown = await response.json();
  if (result === null || typeof result !== "object") throw new Error("Cursor response was unreadable");
  const responseObject = result as Record<string, unknown>;
  const agent = responseObject.agent as Record<string, unknown> | undefined;
  const run = responseObject.run as Record<string, unknown> | undefined;
  if (typeof agent?.id !== "string" || typeof run?.id !== "string") {
    throw new Error("Cursor response did not include durable agent and run IDs");
  }
  return {
    agentId: agent.id,
    runId: run.id,
    runStatus: typeof run.status === "string" ? run.status : "Unknown",
  };
}
