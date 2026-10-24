/** Exact-run transport. Call only after a durable, authorised claim is saved. */
export type CursorRunBinding = { agentId: string; runId: string };
export type CursorRunObservation = CursorRunBinding & {
  status: string;
  terminal: boolean;
  providerUpdatedAt: string;
  providerCreatedAt: string;
};

const terminalStatuses = new Set(["FINISHED", "ERROR", "CANCELLED", "EXPIRED"]);
const supportedStatuses = new Set(["CREATING", "RUNNING", ...terminalStatuses]);

function runUrl(binding: CursorRunBinding) {
  if (!/^bc-[A-Za-z0-9_-]{1,196}$/.test(binding.agentId) ||
      !/^run-[A-Za-z0-9_-]{1,195}$/.test(binding.runId)) {
    throw new Error("Invalid saved Cursor run binding");
  }
  return `https://api.cursor.com/v1/agents/${binding.agentId}/runs/${binding.runId}`;
}

function headers(apiKey: string) {
  if (!apiKey.trim()) throw new Error("Cursor server credential unavailable");
  return { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`, Accept: "application/json" };
}

async function readObject(response: Response): Promise<Record<string, unknown>> {
  let body: unknown;
  try { body = await response.json(); } catch { throw new Error("Unreadable Cursor response"); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("Invalid Cursor response");
  return body as Record<string, unknown>;
}

export async function cancelCursorRun(apiKey: string, binding: CursorRunBinding, fetchImpl: typeof fetch = fetch) {
  const response = await fetchImpl(`${runUrl(binding)}/cancel`, {
    method: "POST", headers: headers(apiKey), redirect: "error", signal: AbortSignal.timeout(25_000),
  });
  // Neither acknowledgement nor conflict proves termination. Always observe.
  if (response.status === 409) return "not_cancellable" as const;
  if (!response.ok) throw new Error("Cursor cancellation request failed");
  const body = await readObject(response);
  if (body.id !== binding.runId) throw new Error("Cursor cancellation identity mismatch");
  return "acknowledged" as const;
}

export async function observeCursorRun(apiKey: string, binding: CursorRunBinding, fetchImpl: typeof fetch = fetch): Promise<CursorRunObservation> {
  const response = await fetchImpl(runUrl(binding), {
    method: "GET", headers: headers(apiKey), redirect: "error", signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error("Cursor run observation failed");
  const body = await readObject(response);
  if (body.id !== binding.runId || body.agentId !== binding.agentId ||
      typeof body.status !== "string" || !supportedStatuses.has(body.status) ||
      typeof body.createdAt !== "string" || !Number.isFinite(Date.parse(body.createdAt)) ||
      typeof body.updatedAt !== "string" || !Number.isFinite(Date.parse(body.updatedAt)) ||
      Date.parse(body.createdAt) > Date.parse(body.updatedAt) ||
      Date.parse(body.updatedAt) > Date.now() + 60_000) {
    throw new Error("Cursor observation did not match saved run identity or supported state");
  }
  // Deliberately exclude result text, git snapshots and provider prose: they
  // neither establish task acceptance nor prove a recoverable code checkpoint.
  return { ...binding, status: body.status, terminal: terminalStatuses.has(body.status),
    providerUpdatedAt: body.updatedAt, providerCreatedAt: body.createdAt };
}

/** Recover only a single run on the exact server-reserved agent. Three GETs
 * maximum; never create, steer, resume or cancel while resolving identity. */
export async function resolveCursorRun(apiKey: string, agentId: string, submissionStartedAt: Date,
  fetchImpl: typeof fetch = fetch): Promise<CursorRunObservation> {
  // Reuse the fixed-origin identity validator before constructing either URL.
  const base = runUrl({ agentId, runId: "run-validation" }).replace("/runs/run-validation", "");
  const get = async (url: string) => {
    const response = await fetchImpl(url, { method: "GET", headers: headers(apiKey), redirect: "error",
      signal: AbortSignal.timeout(25_000) });
    if (!response.ok) throw new Error("Cursor recovery lookup unavailable");
    return readObject(response);
  };
  const start = submissionStartedAt.getTime();
  const validTime = (value: unknown) => typeof value === "string" && Number.isFinite(Date.parse(value)) &&
    Date.parse(value) >= start - 60_000 && Date.parse(value) <= Date.now() + 60_000;
  if (!Number.isFinite(start) || start > Date.now() + 60_000) throw new Error("Invalid saved submission time");
  const agent = await get(base);
  if (agent.id !== agentId || !validTime(agent.createdAt)) throw new Error("Cursor reserved agent mismatch");
  const page = await get(`${base}/runs?limit=2`);
  // Any pagination or second run is ambiguous. Never guess using newest run,
  // agent lifecycle status, provider prose or a browser-supplied run ID.
  if ((page.nextCursor !== undefined && page.nextCursor !== null) || !Array.isArray(page.items) || page.items.length !== 1) {
    throw new Error("Cursor run recovery is ambiguous");
  }
  const run: unknown = page.items[0];
  if (!run || typeof run !== "object" || Array.isArray(run)) throw new Error("Invalid recovery run");
  const candidate = run as Record<string, unknown>;
  if (candidate.agentId !== agentId || typeof candidate.id !== "string" || agent.latestRunId !== candidate.id ||
      !validTime(candidate.createdAt) || Date.parse(candidate.createdAt as string) < Date.parse(agent.createdAt as string)) {
    throw new Error("Cursor recovery run does not match reserved agent");
  }
  // Listing is identity evidence only. State is read from the exact run.
  const observed = await observeCursorRun(apiKey, { agentId, runId: candidate.id }, fetchImpl);
  if (observed.providerCreatedAt !== candidate.createdAt) throw new Error("Cursor recovery creation time mismatch");
  return observed;
}
