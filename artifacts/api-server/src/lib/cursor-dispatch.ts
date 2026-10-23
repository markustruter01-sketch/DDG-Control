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
  // Bind any accepted response to the durable ID reserved before the request.
  // Reject malformed input before a provider call rather than create an agent
  // whose identity cannot be recovered from the local reservation.
  const expectedAgentId = payload.agentId;
  if (typeof expectedAgentId !== "string" || !/^bc-[A-Za-z0-9_-]{1,196}$/.test(expectedAgentId)) {
    throw new Error("Cursor dispatch requires a valid reserved agent ID");
  }
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
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    // JSON parser messages can contain provider response excerpts. Never copy
    // those into the task's persisted error summary or event ledger.
    throw new Error("Cursor response was not valid JSON; dispatch result is ambiguous");
  }
  if (result === null || typeof result !== "object" || Array.isArray(result)) throw new Error("Cursor response was unreadable");
  const responseObject = result as Record<string, unknown>;
  const agent = responseObject.agent as Record<string, unknown> | undefined;
  const run = responseObject.run as Record<string, unknown> | undefined;
  if (!agent || typeof agent !== "object" || Array.isArray(agent) ||
      !run || typeof run !== "object" || Array.isArray(run) ||
      agent.id !== expectedAgentId || run.agentId !== expectedAgentId ||
      typeof run.id !== "string" || !/^run-[A-Za-z0-9_-]{1,195}$/.test(run.id)) {
    // A mismatched/malformed success is ambiguous, not permission to retry or
    // attach a different agent/run to this task. Do not include response prose.
    throw new Error("Cursor response did not match the reserved agent and run binding");
  }
  return {
    agentId: agent.id,
    runId: run.id,
    runStatus: typeof run.status === "string" ? run.status : "Unknown",
  };
}
