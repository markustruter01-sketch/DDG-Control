import { randomUUID } from "node:crypto";
import { db, managedWorkDispatchConfigTable, managedWorkDispatchesTable, managedWorkEventsTable, managedWorkItemsTable, projectWorkControlsTable } from "@workspace/db";
import { and, desc, eq, inArray } from "drizzle-orm";
import { cancelCursorRun, observeCursorRun } from "./cursor-run-control";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Dispatch = typeof managedWorkDispatchesTable.$inferSelect;
const actor = "system:cursor-run-control-v1";
const eventTypes = ["cursor_cancel_required", "cursor_cancel_claimed", "cursor_cancel_observed", "cursor_cancel_unresolved"];
const maxAttempts = 3;
const claimMilliseconds = 90_000;
const retryMilliseconds = 60_000;

export async function cursorCancellationRequirement(tx: Transaction, dispatch: Dispatch) {
  const [existing] = await tx.select({ id: managedWorkEventsTable.id }).from(managedWorkEventsTable)
    .where(and(eq(managedWorkEventsTable.work_item_id, dispatch.work_item_id),
      eq(managedWorkEventsTable.actor, actor), eq(managedWorkEventsTable.event_type, "cursor_cancel_required"))).limit(1);
  return existing?.id;
}

/** Caller holds config before project locks. Ledger is durable, not a timer. */
export async function requireCursorCancellation(tx: Transaction, dispatch: Dispatch, reason: string) {
  const existing = await cursorCancellationRequirement(tx, dispatch);
  // Current schema has one immutable dispatch per task. Do not silently reuse
  // this assumption if multi-attempt dispatch rows are introduced later.
  if (existing) return existing;
  const [intent] = await tx.insert(managedWorkEventsTable).values({
    work_item_id: dispatch.work_item_id, project_key: dispatch.project_key, actor,
    event_type: "cursor_cancel_required",
    details: { version: 1, dispatch_id: dispatch.id, reason, external_request_sent: false },
  }).returning({ id: managedWorkEventsTable.id });
  return intent.id;
}

/** No process-local leases: concurrent servers serialize on the config row. */
async function lockDispatch(tx: Transaction, id: number) {
  const [config] = await tx.select().from(managedWorkDispatchConfigTable)
    .where(eq(managedWorkDispatchConfigTable.id, 1)).for("update").limit(1);
  if (!config) return null;
  const [hint] = await tx.select().from(managedWorkDispatchesTable).where(eq(managedWorkDispatchesTable.id, id)).limit(1);
  if (!hint) return null;
  const [control] = await tx.select().from(projectWorkControlsTable)
    .where(eq(projectWorkControlsTable.project_key, hint.project_key)).for("update").limit(1);
  const [task] = await tx.select().from(managedWorkItemsTable)
    .where(eq(managedWorkItemsTable.id, hint.work_item_id)).for("update").limit(1);
  const [dispatch] = await tx.select().from(managedWorkDispatchesTable)
    .where(eq(managedWorkDispatchesTable.id, id)).for("update").limit(1);
  if (!control || !task || !dispatch || task.project_key !== dispatch.project_key || dispatch.provider !== "cursor") return null;
  return { dispatch, task };
}

async function history(tx: Pick<Transaction, "select">, dispatch: Dispatch) {
  return (await tx.select().from(managedWorkEventsTable).where(and(
    eq(managedWorkEventsTable.work_item_id, dispatch.work_item_id), eq(managedWorkEventsTable.actor, actor),
    inArray(managedWorkEventsTable.event_type, eventTypes),
  )).orderBy(desc(managedWorkEventsTable.id))).filter(event => event.details.version === 1 &&
    event.project_key === dispatch.project_key && event.details.dispatch_id === dispatch.id);
}

/** Saved evidence only: no provider polling, claims, inserts or status edits. */
export async function readCursorCancellationRecovery(id: number) {
  const [dispatch] = await db.select().from(managedWorkDispatchesTable).where(eq(managedWorkDispatchesTable.id, id)).limit(1);
  if (!dispatch || dispatch.provider !== "cursor") return null;
  const events = await history(db, dispatch);
  const claims = events.filter(event => event.event_type === "cursor_cancel_claimed");
  const observation = events.find(event => event.event_type === "cursor_cancel_observed" &&
    event.details.agent_id === dispatch.agent_id && event.details.run_id === dispatch.run_id);
  return { dispatch_id: id, work_item_id: dispatch.work_item_id,
    reserved_agent_id: dispatch.agent_id ?? `bc-${dispatch.idempotency_key}`, run_id: dispatch.run_id,
    cancellation_required: events.some(event => event.event_type === "cursor_cancel_required"),
    attempts_recorded: claims.length, max_attempts: maxAttempts,
    latest_claim_expires_at: claims[0]?.details.expires_at ?? null,
    terminal_observation_recorded: observation?.details.terminal === true,
    provider_status: observation?.details.provider_status ?? "unknown",
    observed_at: observation?.details.observed_at ?? null,
    evidence_source: "saved_ledger_only", live_status_verified_now: false,
    automatic_retry: false, reservation_released: false, task_accepted: false, code_checkpoint_verified: false };
}

/** One explicitly requested bounded attempt. Never starts/resumes coding work.
 * Invoked only behind the real-owner route and its source-locked live gate.
 * No background pickup or migration is installed by importing this module.
 */
export async function processCursorCancellation(id: number, apiKey: string) {
  const claim = await db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { dispatch } = locked;
    const intentId = await requireCursorCancellation(tx, dispatch, "explicit_owner_request");
    if (!dispatch.agent_id || !dispatch.run_id) return { kind: "unbound" as const };
    const events = await history(tx, dispatch);
    const sameBinding = (event: typeof events[number]) => event.details.agent_id === dispatch.agent_id && event.details.run_id === dispatch.run_id;
    if (events.some(event => event.event_type === "cursor_cancel_observed" && sameBinding(event) && event.details.terminal === true)) {
      return { kind: "terminal_recorded" as const };
    }
    const claims = events.filter(event => event.event_type === "cursor_cancel_claimed");
    const latest = claims[0];
    const now = Date.now();
    if (latest && (typeof latest.details.expires_at !== "string" ||
        !Number.isFinite(Date.parse(latest.details.expires_at)) || Date.parse(latest.details.expires_at) > now)) return { kind: "busy" as const };
    if (claims.length >= maxAttempts) return { kind: "exhausted" as const };
    if (latest && now - latest.created_at.getTime() < claimMilliseconds + retryMilliseconds) return { kind: "backoff" as const };
    const token = randomUUID();
    const [saved] = await tx.insert(managedWorkEventsTable).values({
      work_item_id: dispatch.work_item_id, project_key: dispatch.project_key, actor, event_type: "cursor_cancel_claimed",
      details: { version: 1, dispatch_id: id, intent_id: intentId, token, attempt: claims.length + 1,
        agent_id: dispatch.agent_id, run_id: dispatch.run_id, expires_at: new Date(now + claimMilliseconds).toISOString() },
    }).returning({ id: managedWorkEventsTable.id });
    return { kind: "claimed" as const, dispatch, token, claimId: saved.id,
      binding: { agentId: dispatch.agent_id, runId: dispatch.run_id } };
  });
  if (claim.kind !== "claimed") return claim;

  // HTTP is outside all row locks, so dashboard blocking can always commit.
  // On a crash/timeout, the durable claim stays unresolved and consumes an
  // attempt. No create call or automatic cancellation retry occurs here.
  let acknowledgement = "unknown";
  try { acknowledgement = await cancelCursorRun(apiKey, claim.binding); } catch { /* Observe even after an ambiguous cancellation. */ }
  let observation: Awaited<ReturnType<typeof observeCursorRun>> | undefined;
  try { observation = await observeCursorRun(apiKey, claim.binding); } catch { /* No fabricated terminal evidence. */ }

  return db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked || locked.dispatch.agent_id !== claim.binding.agentId || locked.dispatch.run_id !== claim.binding.runId) return { kind: "stale" as const };
    const events = await history(tx, locked.dispatch);
    const latest = events.find(event => event.event_type === "cursor_cancel_claimed");
    if (latest?.id !== claim.claimId || latest.details.token !== claim.token ||
        typeof latest.details.expires_at !== "string" || Date.parse(latest.details.expires_at) <= Date.now() ||
        events.some(event => event.details.claim_id === claim.claimId && event.event_type !== "cursor_cancel_claimed")) return { kind: "stale" as const };
    await tx.insert(managedWorkEventsTable).values({
      work_item_id: locked.task.id, project_key: locked.dispatch.project_key, actor,
      event_type: observation ? "cursor_cancel_observed" : "cursor_cancel_unresolved",
      details: { version: 1, dispatch_id: id, claim_id: claim.claimId,
        agent_id: claim.binding.agentId, run_id: claim.binding.runId, acknowledgement,
        observation_source: observation ? "authenticated_exact_run_get" : "unavailable",
        observed_at: new Date().toISOString(), provider_updated_at: observation?.providerUpdatedAt ?? null,
        provider_status: observation?.status ?? "unknown", terminal: observation?.terminal ?? false,
        task_accepted: false, reservation_released: false, code_checkpoint_verified: false },
    });
    // Observation is evidence, not owner acceptance or permission to release
    // the global dispatch barrier. Existing conservative release rules remain.
    return { kind: observation?.terminal ? "terminal_observed" as const : "unresolved" as const,
      provider_status: observation?.status ?? "unknown", acknowledgement, reservation_released: false };
  });
}
