import { cursorWorkerInvocationsTable, managedWorkDispatchConfigTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { CURSOR_HOSTED_WORKER_VERIFIED, type WorkTransaction } from "./managed-work-controls";

export type CursorWorkerClaim = { invocationId: string; token: string };

export async function workerDatabaseTime(tx: WorkTransaction) {
  const [clock] = await tx.select({ milliseconds: sql<number>`extract(epoch from clock_timestamp()) * 1000`.mapWith(Number) })
    .from(managedWorkDispatchConfigTable).where(eq(managedWorkDispatchConfigTable.id, 1)).limit(1);
  if (!clock || !Number.isFinite(clock.milliseconds)) throw new Error("Worker clock unavailable");
  return clock.milliseconds;
}

/** Caller holds config lock; no process-local lease or browser assertion. */
export async function validCursorWorkerClaim(tx: WorkTransaction, claim: CursorWorkerClaim,
  taskId: number, planVersion: number, outcomeVersion: number, configVersion: Date) {
  if (!CURSOR_HOSTED_WORKER_VERIFIED) return false;
  const [row] = await tx.select().from(cursorWorkerInvocationsTable)
    .where(eq(cursorWorkerInvocationsTable.invocation_id, claim.invocationId)).limit(1);
  return Boolean(row && row.claim_token === claim.token && row.state === "claimed" && row.operation === "dispatch" && row.work_item_id === taskId &&
    row.plan_version === planVersion && row.outcome_version === outcomeVersion &&
    row.config_version.getTime() === configVersion.getTime() && row.expires_at.getTime() > await workerDatabaseTime(tx));
}

export async function validCursorRecoveryClaim(tx: WorkTransaction, claim: CursorWorkerClaim, dispatchId: number, taskId: number) {
  if (!CURSOR_HOSTED_WORKER_VERIFIED) return false;
  const [row] = await tx.select().from(cursorWorkerInvocationsTable)
    .where(eq(cursorWorkerInvocationsTable.invocation_id, claim.invocationId)).limit(1);
  return Boolean(row && row.claim_token === claim.token && row.state === "claimed" && row.operation === "recover" &&
    row.dispatch_id === dispatchId && row.work_item_id === taskId && row.expires_at.getTime() > await workerDatabaseTime(tx));
}
