import { db, managedWorkDispatchConfigTable, managedWorkItemsTable, projectWorkControlsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED, CURSOR_RELEASE_OPERATIONS_VERIFIED } from "./cursor-cancellation";

export const WORK_KEYS = ["finance", "hypest", "cattle-dog-coffee", "ddg-control-ai-stack"] as const;
export type WorkKey = (typeof WORK_KEYS)[number];
export const FINANCE_REVIEW_REQUIRED = true;
const CURSOR_AUTOMATIC_PICKUP = false;
// Separate acceptance of hosted scheduler, machine identity, recovery and
// included/no-cost delivery. Source code is not proof these are configured.
export const CURSOR_HOSTED_WORKER_VERIFIED = false;
export const CURSOR_HARD_WALL_CLOCK_STOP_VERIFIED = false;
// Also fail closed until external termination, global/repository reservations,
// stop barriers and blocking-question synchronization are verified together.
export const CURSOR_RUN_SAFETY_VERIFIED = false;
// Separate from permission to start work. Source integration exists, but live
// cancellation still requires isolated recovery and provider acceptance.
export const CURSOR_CANCEL_OPERATIONS_VERIFIED = false;
export const RUN_SAFETY_BLOCKER = "Dispatch stays blocked: provider termination, global/repository reservation, stop barriers and question synchronization are not verified.";
const BACKGROUND_WORKER_BLOCKER = "Automatic queue pickup is unavailable: Replit deployments can restart or move processes, and this app has no separately verified durable worker.";
export const TASK_LIMIT_BLOCKER = "Dispatch stays blocked: this adapter cannot enforce or verify a provider-side wall-clock stop for an active run.";

export async function readDispatchConfig() {
  await db.insert(managedWorkDispatchConfigTable).values({ id: 1 }).onConflictDoNothing();
  const [config] = await db.select().from(managedWorkDispatchConfigTable).where(eq(managedWorkDispatchConfigTable.id, 1)).limit(1);
  return config!;
}

export const normalizeWorkRepository = (value: string | null) => value?.trim().toLowerCase()
  .replace(/^https?:\/\//, "").replace(/\.git$/, "").replace(/\/$/, "") ?? "";

export function dispatchReadiness(config: Awaited<ReturnType<typeof readDispatchConfig>>) {
  const secretPresent = Boolean(process.env.CURSOR_API_KEY?.trim());
  const normalizeRepository = normalizeWorkRepository;
  const ownerBlockers = [
    ...(!CURSOR_HARD_WALL_CLOCK_STOP_VERIFIED ? [TASK_LIMIT_BLOCKER] : []),
    ...(!CURSOR_RUN_SAFETY_VERIFIED ? [RUN_SAFETY_BLOCKER] : []),
    ...(!CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED || !CURSOR_RELEASE_OPERATIONS_VERIFIED ? ["Dispatch stays blocked: exclusive agent submission authority and verified reservation release are not accepted."] : []),
    ...(!config.plan_model_confirmed ? ["Owner has not verified eligible plan and exact model."] : []),
    ...(!config.included_allowance_confirmed ? ["Owner has not verified included allowance for that model."] : []),
    ...(!config.no_overage_confirmed ? ["Owner has not verified no-overage or a hard spend cap."] : []),
    ...(!config.github_access_confirmed ? ["Owner has not verified GitHub repository access and starting branch."] : []),
    ...(!config.approved_project_key || !normalizeRepository(config.approved_repository) || !config.approved_starting_branch ? ["Owner-approved project, repository, and starting branch are not configured."] : []),
    ...(!config.secret_owner_verified || !secretPresent ? ["Cursor server secret must be present and owner-verified; secret values are never returned."] : []),
    ...(!config.selected_model_id ? ["An explicit owner-verified model ID is required; no fallback is configured."] : []),
  ];
  const blockers = [...ownerBlockers, ...(!config.enabled ? ["Dispatch toggle is OFF."] : [])];
  return {
    manual_dispatch_ready: ownerBlockers.length === 0,
    dispatch_enabled: config.enabled && ownerBlockers.length === 0,
    automatic_pickup: CURSOR_AUTOMATIC_PICKUP,
    hosted_worker_enabled: CURSOR_HOSTED_WORKER_VERIFIED,
    provider_cancellation_enabled: CURSOR_CANCEL_OPERATIONS_VERIFIED,
    reservation_release_enabled: CURSOR_RELEASE_OPERATIONS_VERIFIED && CURSOR_EXCLUSIVE_AGENT_CONTROL_VERIFIED,
    background_worker_blocker: BACKGROUND_WORKER_BLOCKER,
    secret_present: secretPresent,
    config: {
      enabled: config.enabled,
      plan_model_confirmed: config.plan_model_confirmed,
      included_allowance_confirmed: config.included_allowance_confirmed,
      no_overage_confirmed: config.no_overage_confirmed,
      github_access_confirmed: config.github_access_confirmed,
      secret_owner_verified: config.secret_owner_verified,
      selected_model_id: config.selected_model_id,
      approved_repository: config.approved_repository,
      approved_starting_branch: config.approved_starting_branch,
      approved_project_key: config.approved_project_key,
      updated_at: config.updated_at,
    },
    blockers,
  };
}

export function hasWorkControl(key: string): key is WorkKey {
  return WORK_KEYS.includes(key as WorkKey);
}

export function isProjectWorkHeld(key: string): boolean {
  return key === "finance" && FINANCE_REVIEW_REQUIRED;
}

export async function isProjectWorkEnabled(key: string): Promise<boolean> {
  if (!hasWorkControl(key)) return false;
  if (key === "finance" && FINANCE_REVIEW_REQUIRED) return false;
  const [row] = await db.select({ enabled: projectWorkControlsTable.enabled, completed: projectWorkControlsTable.completed })
    .from(projectWorkControlsTable).where(eq(projectWorkControlsTable.project_key, key)).limit(1);
  return row?.enabled === true && row.completed === false;
}

export type WorkTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** Serialize project record changes: control first, then outcome/task rows. */
export async function lockWorkControl(tx: WorkTransaction, key: string) {
  await tx.insert(projectWorkControlsTable).values({ project_key: key }).onConflictDoNothing();
  const [control] = await tx.select().from(projectWorkControlsTable)
    .where(eq(projectWorkControlsTable.project_key, key)).for("update").limit(1);
  return control!;
}

export async function lockWorkItem(tx: WorkTransaction, id: number) {
  const [hint] = await tx.select({ project_key: managedWorkItemsTable.project_key }).from(managedWorkItemsTable)
    .where(eq(managedWorkItemsTable.id, id)).limit(1);
  if (!hint || !hasWorkControl(hint.project_key)) return null;
  const control = await lockWorkControl(tx, hint.project_key);
  const [item] = await tx.select().from(managedWorkItemsTable)
    .where(eq(managedWorkItemsTable.id, id)).for("update").limit(1);
  return item ? { item, control } : null;
}

/** Recheck OFF/hold at the write boundary. The same project control lock is
 * held through the mutation, so a concurrent OFF/complete action serializes
 * with it. Never perform provider HTTP inside this transaction callback. */
export async function withProjectWorkWrite<T>(key: string, write: (tx: WorkTransaction) => Promise<T>) {
  return db.transaction(async tx => {
    if (hasWorkControl(key)) {
      const control = await lockWorkControl(tx, key);
      if (isProjectWorkHeld(key) || !control.enabled || control.completed) return { allowed: false as const };
    }
    return { allowed: true as const, value: await write(tx) };
  });
}

