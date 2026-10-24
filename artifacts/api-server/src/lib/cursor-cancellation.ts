import { randomUUID } from "node:crypto";
import { db, managedWorkDispatchConfigTable, managedWorkDispatchesTable, managedWorkEventsTable, managedWorkItemsTable, projectWorkControlsTable } from "@workspace/db";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { cancelCursorRun, observeCursorAgentQuiescence, observeCursorRun, resolveCursorRun } from "./cursor-run-control";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
type Dispatch = typeof managedWorkDispatchesTable.$inferSelect;
type RecoveryAuthority = (tx: Transaction, dispatch: Dispatch) => Promise<boolean>;
const actor = "system:cursor-run-control-v1";
const eventTypes = ["cursor_cancel_required", "cursor_cancel_claimed", "cursor_cancel_observed", "cursor_cancel_unresolved", "cursor_run_binding_recovered", "cursor_release_claimed", "cursor_release_unresolved", "cursor_run_released", "cursor_deadline_recorded"];
// A provider snapshot cannot prevent someone submitting a later external run.
// Keep release disabled until exclusive submission authority is verified.
export const CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED = false;
export const CURSOR_RELEASE_OPERATIONS_VERIFIED = false;
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

async function settledSubmission(tx: Pick<Transaction, "select">, dispatch: Dispatch) {
  const events = await tx.select().from(managedWorkEventsTable).where(and(
    eq(managedWorkEventsTable.work_item_id, dispatch.work_item_id), eq(managedWorkEventsTable.actor, "system"),
    inArray(managedWorkEventsTable.event_type, ["cursor_dispatch_started", "cursor_dispatch_needs_owner"])))
    .orderBy(desc(managedWorkEventsTable.id));
  const event = events.find(event => event.project_key === dispatch.project_key && event.details.dispatch_id === dispatch.id);
  return event && event.details.accepted_run_binding_conflict !== true ? event : undefined;
}

async function validRelease(tx: Pick<Transaction, "select">, dispatch: Dispatch, events: Awaited<ReturnType<typeof history>>) {
  if (dispatch.provider !== "cursor" || !dispatch.agent_id || !dispatch.run_id) return false;
  const release = events[0];
  if (!release || release.event_type !== "cursor_run_released" || release.details.agent_id !== dispatch.agent_id ||
      release.details.run_id !== dispatch.run_id || release.details.terminal !== true || release.details.agent_quiescent !== true ||
      release.details.exclusive_control_verified !== true || release.details.observation_source !== "authenticated_exact_run_history_and_agent") return false;
  const claim = events.find(event => event.id === release.details.claim_id && event.event_type === "cursor_release_claimed");
  if (!claim || claim.id >= release.id || claim.details.agent_id !== dispatch.agent_id || claim.details.run_id !== dispatch.run_id ||
      typeof claim.details.expires_at !== "string" || !Number.isFinite(Date.parse(claim.details.expires_at)) ||
      release.created_at.getTime() > Date.parse(claim.details.expires_at)) return false;
  const settled = await settledSubmission(tx, dispatch);
  return Boolean(settled && settled.id < claim.id);
}

/** Saved evidence only: no provider polling, claims, inserts or status edits. */
export async function readCursorCancellationRecovery(id: number) {
  const [dispatch] = await db.select().from(managedWorkDispatchesTable).where(eq(managedWorkDispatchesTable.id, id)).limit(1);
  if (!dispatch || dispatch.provider !== "cursor") return null;
  const events = await history(db, dispatch);
  const claims = events.filter(event => event.event_type === "cursor_cancel_claimed");
  const observation = events.find(event => event.event_type === "cursor_cancel_observed" &&
    event.details.agent_id === dispatch.agent_id && event.details.run_id === dispatch.run_id);
  const release = await validRelease(db, dispatch, events);
  return { dispatch_id: id, work_item_id: dispatch.work_item_id,
    reserved_agent_id: dispatch.agent_id ?? `bc-${dispatch.idempotency_key}`, run_id: dispatch.run_id,
    cancellation_required: events.some(event => event.event_type === "cursor_cancel_required"),
    attempts_recorded: claims.length, max_attempts: maxAttempts,
    latest_claim_expires_at: events.find(event => event.event_type === "cursor_cancel_claimed" || event.event_type === "cursor_release_claimed")?.details.expires_at ?? null,
    terminal_observation_recorded: observation?.details.terminal === true,
    provider_status: observation?.details.provider_status ?? "unknown",
    observed_at: observation?.details.observed_at ?? null,
    release_observation_recorded: release, release_attempts_recorded: events.filter(event => event.event_type === "cursor_release_claimed").length,
    deadline_recorded: events.some(event => event.event_type === "cursor_deadline_recorded"),
    deadline_evidence: events.find(event => event.event_type === "cursor_deadline_recorded")?.details.reason ?? null,
    evidence_source: "saved_ledger_only", live_status_verified_now: false,
    automatic_retry: false, reservation_released: Boolean(release && CURSOR_RELEASE_OPERATIONS_VERIFIED && CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED), task_accepted: false, code_checkpoint_verified: false };
}

/** One bounded authorised attempt. Never starts/resumes coding work.
 * Owner calls require the real-owner route and its source-locked live gate.
 * Hosted recovery additionally supplies an under-lock authority check and may
 * consume only existing saved stop/deadline requirements. No migration or
 * background loop is installed by importing this module.
 */
export async function processCursorCancellation(id: number, apiKey: string, authoriseRecovery?: RecoveryAuthority) {
  const claim = await db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { dispatch } = locked;
    if (authoriseRecovery && !await authoriseRecovery(tx, dispatch)) return { kind: "stale" as const };
    const intentId = await requireCursorCancellation(tx, dispatch, authoriseRecovery ? "approved_worker_recovery" : "explicit_owner_request");
    // Legacy rows without the reserved ID or durable pre-submit evidence need
    // manual reconciliation. Never infer that an absent run means no worker.
    if (!dispatch.agent_id) return { kind: "unbound" as const };
    let submissionStartedAt: Date | undefined;
    if (!dispatch.run_id) {
      if (dispatch.agent_id !== `bc-${dispatch.idempotency_key}`) return { kind: "unbound" as const };
      const submissions = await tx.select().from(managedWorkEventsTable).where(and(
        eq(managedWorkEventsTable.work_item_id, dispatch.work_item_id), eq(managedWorkEventsTable.actor, "system"),
        eq(managedWorkEventsTable.event_type, "cursor_submission_started")));
      const matching = submissions.filter(event => event.project_key === dispatch.project_key &&
        event.details.dispatch_id === id && event.details.reserved_agent_id === dispatch.agent_id);
      if (matching.length !== 1) return { kind: "unbound" as const };
      submissionStartedAt = matching[0].created_at;
    }
    const events = await history(tx, dispatch);
    const sameBinding = (event: typeof events[number]) => event.details.agent_id === dispatch.agent_id && event.details.run_id === dispatch.run_id;
    if (events.some(event => event.event_type === "cursor_cancel_observed" && sameBinding(event) && event.details.terminal === true)) {
      return { kind: "terminal_recorded" as const };
    }
    const claims = events.filter(event => event.event_type === "cursor_cancel_claimed");
    const latest = events.find(event => event.event_type === "cursor_cancel_claimed" || event.event_type === "cursor_release_claimed");
    const now = Date.now();
    if (latest && (typeof latest.details.expires_at !== "string" ||
        !Number.isFinite(Date.parse(latest.details.expires_at)) || Date.parse(latest.details.expires_at) > now)) return { kind: "busy" as const };
    if (claims.length >= maxAttempts) return { kind: "exhausted" as const };
    if (latest && now - latest.created_at.getTime() < claimMilliseconds + retryMilliseconds) return { kind: "backoff" as const };
    const token = randomUUID();
    const [saved] = await tx.insert(managedWorkEventsTable).values({
      work_item_id: dispatch.work_item_id, project_key: dispatch.project_key, actor, event_type: "cursor_cancel_claimed",
      details: { version: 1, dispatch_id: id, intent_id: intentId, token, attempt: claims.length + 1,
        agent_id: dispatch.agent_id, run_id: dispatch.run_id, operation: submissionStartedAt ? "resolve_run" : "cancel_run",
        expires_at: new Date(now + claimMilliseconds).toISOString() },
    }).returning({ id: managedWorkEventsTable.id });
    return { kind: "claimed" as const, dispatch, token, claimId: saved.id, submissionStartedAt,
      binding: { agentId: dispatch.agent_id, runId: dispatch.run_id } };
  });
  if (claim.kind !== "claimed") return claim;

  // HTTP is outside all row locks, so dashboard blocking can always commit.
  // On a crash/timeout, the durable claim stays unresolved and consumes an
  // attempt. No create call or automatic cancellation retry occurs here.
  let acknowledgement = "unknown";
  let observation: Awaited<ReturnType<typeof observeCursorRun>> | undefined;
  if (claim.submissionStartedAt) {
    try { observation = await resolveCursorRun(apiKey, claim.binding.agentId, claim.submissionStartedAt); }
    catch { /* An empty/ambiguous/unavailable lookup leaves the reservation intact. */ }
  } else if (claim.binding.runId) {
    const binding = { agentId: claim.binding.agentId, runId: claim.binding.runId };
    try { acknowledgement = await cancelCursorRun(apiKey, binding); } catch { /* Observe after ambiguous cancellation. */ }
    try { observation = await observeCursorRun(apiKey, binding); } catch { /* No fabricated terminal evidence. */ }
  }

  return db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked || locked.dispatch.agent_id !== claim.binding.agentId || locked.dispatch.run_id !== claim.binding.runId) return { kind: "stale" as const };
    const events = await history(tx, locked.dispatch);
    const latest = events.find(event => event.event_type === "cursor_cancel_claimed" || event.event_type === "cursor_release_claimed");
    if (latest?.id !== claim.claimId || latest.details.token !== claim.token ||
        typeof latest.details.expires_at !== "string" || Date.parse(latest.details.expires_at) <= Date.now() ||
        events.some(event => event.details.claim_id === claim.claimId && event.event_type !== "cursor_cancel_claimed")) return { kind: "stale" as const };
    if (claim.submissionStartedAt && observation) {
      await tx.update(managedWorkDispatchesTable).set({ run_id: observation.runId })
        .where(eq(managedWorkDispatchesTable.id, id));
      await tx.insert(managedWorkEventsTable).values({ work_item_id: locked.task.id,
        project_key: locked.dispatch.project_key, actor, event_type: "cursor_run_binding_recovered",
        details: { version: 1, dispatch_id: id, claim_id: claim.claimId, agent_id: observation.agentId,
          run_id: observation.runId, source: "authenticated_single_run_and_exact_get",
          cancellation_sent: false, task_accepted: false, reservation_released: false } });
    }
    await tx.insert(managedWorkEventsTable).values({
      work_item_id: locked.task.id, project_key: locked.dispatch.project_key, actor,
      event_type: observation ? "cursor_cancel_observed" : "cursor_cancel_unresolved",
      details: { version: 1, dispatch_id: id, claim_id: claim.claimId,
        agent_id: claim.binding.agentId, run_id: observation?.runId ?? claim.binding.runId, acknowledgement,
        operation: claim.submissionStartedAt ? "resolve_run" : "cancel_run",
        observation_source: observation ? "authenticated_exact_run_get" : "unavailable",
        observed_at: new Date().toISOString(), provider_updated_at: observation?.providerUpdatedAt ?? null,
        provider_status: observation?.status ?? "unknown", terminal: observation?.terminal ?? false,
        task_accepted: false, reservation_released: false, code_checkpoint_verified: false },
    });
    // Observation is evidence, not owner acceptance or permission to release
    // the global dispatch barrier. Existing conservative release rules remain.
    return { kind: observation?.terminal ? "terminal_observed" as const : claim.submissionStartedAt && observation ? "binding_recovered" as const : "unresolved" as const,
      provider_status: observation?.status ?? "unknown", acknowledgement, reservation_released: false };
  });
}

/** Caller holds singleton config lock. Inspect every dispatch, with no local
 * status filter: failed/completed rows can still hide an external worker. */
export async function hasUnreleasedCursorDispatch(tx: Transaction) {
  const dispatches = await tx.select().from(managedWorkDispatchesTable);
  if (!CURSOR_RELEASE_OPERATIONS_VERIFIED || !CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED) return dispatches.length > 0;
  for (const dispatch of dispatches) {
    const events = await history(tx, dispatch);
    if (!await validRelease(tx, dispatch, events)) return true;
  }
  return false;
}

/** Explicit owner release, never task completion or permission to resume a run.
 * Both gates are checked here as well as at the route before any DB/HTTP. */
export async function processCursorRelease(id: number, apiKey: string) {
  if (!CURSOR_RELEASE_OPERATIONS_VERIFIED || !CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED) return { kind: "disabled" as const };
  const claim = await db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { dispatch } = locked;
    if (!dispatch.agent_id || !dispatch.run_id) return { kind: "unbound" as const };
    // Do not race a submission whose HTTP response/persistence is still open.
    const settled = await settledSubmission(tx, dispatch);
    if (!settled) return { kind: "submission_unsettled" as const };
    const events = await history(tx, dispatch);
    if (await validRelease(tx, dispatch, events)) return { kind: "already_released" as const };
    const latest = events.find(event => event.event_type === "cursor_cancel_claimed" || event.event_type === "cursor_release_claimed");
    const now = Date.now();
    if (latest && (typeof latest.details.expires_at !== "string" || !Number.isFinite(Date.parse(latest.details.expires_at)) ||
        Date.parse(latest.details.expires_at) > now)) return { kind: "busy" as const };
    const claims = events.filter(event => event.event_type === "cursor_release_claimed");
    if (claims.length >= maxAttempts) return { kind: "exhausted" as const };
    if (latest && now - latest.created_at.getTime() < claimMilliseconds + retryMilliseconds) return { kind: "backoff" as const };
    const token = randomUUID();
    const binding = { agentId: dispatch.agent_id, runId: dispatch.run_id };
    const [saved] = await tx.insert(managedWorkEventsTable).values({ work_item_id: dispatch.work_item_id,
      project_key: dispatch.project_key, actor, event_type: "cursor_release_claimed",
      details: { version: 1, dispatch_id: id, token, attempt: claims.length + 1,
        agent_id: binding.agentId, run_id: binding.runId, expires_at: new Date(now + claimMilliseconds).toISOString() },
    }).returning({ id: managedWorkEventsTable.id });
    return { kind: "claimed" as const, claimId: saved.id, token, binding };
  });
  if (claim.kind !== "claimed") return claim;
  let observation: Awaited<ReturnType<typeof observeCursorAgentQuiescence>> | undefined;
  try { observation = await observeCursorAgentQuiescence(apiKey, claim.binding); } catch { /* Unknown stays reserved. */ }
  return db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked || locked.dispatch.agent_id !== claim.binding.agentId || locked.dispatch.run_id !== claim.binding.runId) return { kind: "stale" as const };
    const events = await history(tx, locked.dispatch);
    const latest = events.find(event => event.event_type === "cursor_cancel_claimed" || event.event_type === "cursor_release_claimed");
    if (latest?.id !== claim.claimId || latest.details.token !== claim.token || typeof latest.details.expires_at !== "string" ||
        Date.parse(latest.details.expires_at) <= Date.now() || events.some(event => event.details.claim_id === claim.claimId)) return { kind: "stale" as const };
    const settled = await settledSubmission(tx, locked.dispatch);
    if (!settled || settled.id >= claim.claimId) return { kind: "stale" as const };
    await tx.insert(managedWorkEventsTable).values({ work_item_id: locked.task.id, project_key: locked.dispatch.project_key, actor,
      event_type: observation ? "cursor_run_released" : "cursor_release_unresolved",
      details: { version: 1, dispatch_id: id, claim_id: claim.claimId, agent_id: claim.binding.agentId, run_id: claim.binding.runId,
        observation_source: observation ? "authenticated_exact_run_history_and_agent" : "unavailable",
        observed_at: new Date().toISOString(), provider_status: observation?.status ?? "unknown",
        provider_updated_at: observation?.providerUpdatedAt ?? null, terminal: observation?.terminal ?? false,
        agent_quiescent: Boolean(observation), exclusive_control_verified: CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED,
        task_accepted: false, code_checkpoint_verified: false, automatic_resume: false },
    });
    return { kind: observation ? "released" as const : "unresolved" as const, reservation_released: Boolean(observation),
      task_accepted: false, automatic_resume: false };
  });
}

/** Durable local deadline action. No clock/timestamp is accepted from the
 * browser; DB time is read under the same lock as submission/stop/recovery.
 * This records a cancellation requirement, not provider-side enforcement. */
export async function recordCursorDeadline(id: number, authoriseRecovery?: RecoveryAuthority) {
  return db.transaction(async tx => {
    const locked = await lockDispatch(tx, id);
    if (!locked) return { kind: "missing" as const };
    const { dispatch, task } = locked;
    if (authoriseRecovery && !await authoriseRecovery(tx, dispatch)) return { kind: "stale" as const };
    const events = await history(tx, dispatch);
    if (await validRelease(tx, dispatch, events)) return { kind: "released" as const, provider_stopped_now: false };
    const recorded = events.find(event => event.event_type === "cursor_deadline_recorded");
    if (recorded) return { kind: "already_recorded" as const, cancellation_required: true, provider_stopped_now: false };
    const bounds = await tx.select().from(managedWorkEventsTable).where(and(
      eq(managedWorkEventsTable.work_item_id, task.id), eq(managedWorkEventsTable.actor, "system"),
      eq(managedWorkEventsTable.event_type, "cursor_execution_bound")));
    const matching = bounds.filter(event => event.project_key === dispatch.project_key && event.details.version === 1 &&
      event.details.dispatch_id === id && event.details.agent_id === dispatch.agent_id);
    const bound = matching.length === 1 ? matching[0].details : undefined;
    const minutes = bound?.time_limit_minutes;
    const ownerDeadline = typeof bound?.owner_deadline === "string" ? Date.parse(bound.owner_deadline) : NaN;
    const effective = typeof bound?.effective_deadline === "string" ? Date.parse(bound.effective_deadline) : NaN;
    const valid = typeof minutes === "number" && Number.isSafeInteger(minutes) && minutes >= 5 && minutes <= 1440 &&
      Number.isFinite(ownerDeadline) && Number.isFinite(effective) &&
      effective === Math.min(ownerDeadline, dispatch.started_at.getTime() + minutes * 60_000);
    const [clock] = await tx.select({ milliseconds: sql<number>`extract(epoch from clock_timestamp()) * 1000`.mapWith(Number) })
      .from(managedWorkDispatchConfigTable).where(eq(managedWorkDispatchConfigTable.id, 1)).limit(1);
    if (!clock || !Number.isFinite(clock.milliseconds)) throw new Error("Deadline clock unavailable");
    if (valid && clock.milliseconds < effective) return { kind: "not_due" as const, effective_deadline: new Date(effective).toISOString(), provider_stopped_now: false };
    const reason = valid ? "saved_execution_deadline_elapsed" : "saved_execution_bound_missing_or_invalid";
    const intentId = await requireCursorCancellation(tx, dispatch, reason);
    // Never rewrite accepted/completed task records as if local timeout were a
    // provider result. Active tasks become needs_owner; the reservation stays.
    const next = ["approved", "in_progress"].includes(task.status) ? "needs_owner" : task.status;
    if (next !== task.status) await tx.update(managedWorkItemsTable).set({ status: next, updated_at: new Date(clock.milliseconds) })
      .where(eq(managedWorkItemsTable.id, task.id));
    await tx.update(managedWorkDispatchesTable).set({ status: "needs_owner",
      error_summary: "Execution bound elapsed or is unverified. Provider cancellation/recovery remains required." })
      .where(eq(managedWorkDispatchesTable.id, id));
    await tx.insert(managedWorkEventsTable).values({ work_item_id: task.id, project_key: dispatch.project_key, actor,
      event_type: "cursor_deadline_recorded", from_status: task.status, to_status: next,
      details: { version: 1, dispatch_id: id, agent_id: dispatch.agent_id, run_id: dispatch.run_id, intent_id: intentId,
        reason, effective_deadline: valid ? new Date(effective).toISOString() : null,
        checked_at: new Date(clock.milliseconds).toISOString(), provider_request_sent: false, provider_stopped: false,
        reservation_released: false, automatic_retry: false, task_accepted: false },
    });
    return { kind: valid ? "deadline_recorded" as const : "bound_unverified" as const,
      cancellation_required: true, provider_stopped_now: false, reservation_released: false };
  });
}
