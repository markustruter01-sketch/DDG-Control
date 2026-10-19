import { boolean, check, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { projectsTable } from "./projects";
import { goalsTable } from "./goals";

export const projectWorkControlsTable = pgTable("project_work_controls", {
  project_key: text("project_key").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  completed: boolean("completed").notNull().default(false),
  updated_by: text("updated_by").notNull().default("Markus"),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const projectWorkAuditTable = pgTable("project_work_audit", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  enabled: boolean("enabled").notNull(),
  owner_confirmed: boolean("owner_confirmed").notNull(),
  event_type: text("event_type").notNull().default("work_toggle"),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const projectHandoverTable = pgTable("project_handovers", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  project_id: integer("project_id").references(() => projectsTable.id),
  task_id: integer("task_id"),
  work_item_id: integer("work_item_id"),
  branch: text("branch"),
  commit_ref: text("commit_ref"),
  status: text("status").notNull(),
  completed_work: text("completed_work").notNull(),
  next_action: text("next_action").notNull(),
  blockers: text("blockers").notNull().default(""),
  verification: text("verification").notNull().default(""),
  recovery_note: text("recovery_note").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const projectHandoverEventsTable = pgTable("project_handover_events", {
  id: serial("id").primaryKey(),
  checkpoint_id: integer("checkpoint_id").notNull().references(() => projectHandoverTable.id),
  project_key: text("project_key").notNull(),
  task_id: integer("task_id"),
  actor: text("actor").notNull(),
  event_type: text("event_type").notNull(),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const managedWorkOutcomesTable = pgTable("managed_work_outcomes", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  gates: jsonb("gates").$type<Array<{ key: string; title: string; acceptance: string[] }>>().notNull(),
  status: text("status").notNull().default("pending_approval"),
  version: integer("version").notNull().default(1),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("managed_work_outcome_status_check", sql`${table.status} IN ('draft', 'pending_approval', 'approved', 'rejected', 'completed')`),
  uniqueIndex("managed_work_one_pending_outcome_per_project")
    .on(table.project_key)
    .where(sql`${table.status} IN ('draft', 'pending_approval', 'approved')`),
]);

export const managedWorkOutcomeEventsTable = pgTable("managed_work_outcome_events", {
  id: serial("id").primaryKey(),
  outcome_id: integer("outcome_id").notNull().references(() => managedWorkOutcomesTable.id),
  project_key: text("project_key").notNull(),
  actor: text("actor").notNull(),
  event_type: text("event_type").notNull(),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const managedWorkDispatchConfigTable = pgTable("managed_work_dispatch_config", {
  id: integer("id").primaryKey().default(1),
  enabled: boolean("enabled").notNull().default(false),
  plan_model_confirmed: boolean("plan_model_confirmed").notNull().default(false),
  included_allowance_confirmed: boolean("included_allowance_confirmed").notNull().default(false),
  no_overage_confirmed: boolean("no_overage_confirmed").notNull().default(false),
  github_access_confirmed: boolean("github_access_confirmed").notNull().default(false),
  secret_owner_verified: boolean("secret_owner_verified").notNull().default(false),
  selected_model_id: text("selected_model_id"),
  approved_repository: text("approved_repository"),
  approved_starting_branch: text("approved_starting_branch"),
  approved_project_key: text("approved_project_key"),
  updated_by: text("updated_by").notNull().default("Markus"),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("managed_work_dispatch_config_singleton_check", sql`${table.id} = 1`),
]);

export const managedWorkItemsTable = pgTable("managed_work_items", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  project_id: integer("project_id").references(() => projectsTable.id),
  goal_id: integer("goal_id").references(() => goalsTable.id),
  outcome_id: integer("outcome_id").references(() => managedWorkOutcomesTable.id),
  gate_key: text("gate_key"),
  repository: text("repository"),
  target_branch: text("target_branch"),
  dispatch_state: text("dispatch_state").notNull().default("disabled"),
  dispatch_block_reason: text("dispatch_block_reason").notNull().default("Cursor entitlement and no-overage terms are unverified."),
  title: text("title").notNull(),
  objective: text("objective").notNull(),
  outcome: text("outcome").notNull(),
  checklist: jsonb("checklist").$type<string[]>().notNull(),
  acceptance_checks: jsonb("acceptance_checks").$type<string[]>().notNull(),
  acceptance_evidence: text("acceptance_evidence").notNull().default(""),
  result: text("result").notNull().default(""),
  branch: text("branch"),
  commit_ref: text("commit_ref"),
  review_link: text("review_link"),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
  time_limit_minutes: integer("time_limit_minutes").notNull(),
  max_attempts: integer("max_attempts").notNull(),
  attempts: integer("attempts").notNull().default(0),
  started_at: timestamp("started_at", { withTimezone: true }),
  spend_limit_cents: integer("spend_limit_cents").notNull().default(0),
  stop_condition: text("stop_condition").notNull(),
  status: text("status").notNull().default("pending_approval"),
  plan_version: integer("plan_version").notNull().default(1),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("managed_work_one_active_per_project")
    .on(table.project_key)
    .where(sql`${table.status} IN ('approved', 'in_progress')`),
  uniqueIndex("managed_work_one_active_per_repository")
    .on(table.repository)
    .where(sql`${table.repository} IS NOT NULL AND ${table.status} IN ('approved', 'in_progress')`),
  uniqueIndex("managed_work_one_task_per_outcome_gate")
    .on(table.outcome_id, table.gate_key)
    .where(sql`${table.outcome_id} IS NOT NULL AND ${table.gate_key} IS NOT NULL`),
  check("managed_work_time_limit_check", sql`${table.time_limit_minutes} BETWEEN 5 AND 1440`),
  check("managed_work_attempt_limit_check", sql`${table.max_attempts} BETWEEN 1 AND 10`),
  check("managed_work_attempts_check", sql`${table.attempts} >= 0`),
  check("managed_work_no_spend_check", sql`${table.spend_limit_cents} = 0`),
  check("managed_work_status_check", sql`${table.status} IN ('pending_approval', 'approved', 'in_progress', 'needs_owner', 'failed', 'completed', 'rejected')`),
]);

export const managedWorkDispatchesTable = pgTable("managed_work_dispatches", {
  id: serial("id").primaryKey(),
  work_item_id: integer("work_item_id").notNull().references(() => managedWorkItemsTable.id),
  project_key: text("project_key").notNull(),
  outcome_id: integer("outcome_id").references(() => managedWorkOutcomesTable.id),
  outcome_version: integer("outcome_version").notNull(),
  idempotency_key: text("idempotency_key").notNull().unique(),
  provider: text("provider").notNull().default("cursor"),
  model_id: text("model_id"),
  agent_id: text("agent_id"),
  run_id: text("run_id"),
  provider_status: text("provider_status"),
  branch: text("branch"),
  status: text("status").notNull().default("submitting"),
  error_summary: text("error_summary").notNull().default(""),
  started_at: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finished_at: timestamp("finished_at", { withTimezone: true }),
}, (table) => [
  uniqueIndex("managed_work_dispatch_one_per_task").on(table.work_item_id),
  check("managed_work_dispatch_status_check", sql`${table.status} IN ('submitting', 'running', 'needs_owner', 'failed', 'completed')`),
]);

export const managedFleetConversationsTable = pgTable("managed_fleet_conversations", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  scope_key: text("scope_key").notNull().unique(),
  work_item_id: integer("work_item_id").references(() => managedWorkItemsTable.id),
  plan_version: integer("plan_version"),
  outcome_id: integer("outcome_id").references(() => managedWorkOutcomesTable.id),
  outcome_version: integer("outcome_version"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const managedFleetMessagesTable = pgTable("managed_fleet_messages", {
  id: serial("id").primaryKey(),
  conversation_id: integer("conversation_id").notNull().references(() => managedFleetConversationsTable.id),
  client_request_id: text("client_request_id").notNull().unique(),
  project_key: text("project_key").notNull(),
  work_item_id: integer("work_item_id"),
  plan_version: integer("plan_version"),
  outcome_id: integer("outcome_id"),
  outcome_version: integer("outcome_version"),
  author: text("author").notNull().default("Markus"),
  body: text("body").notNull(),
  kind: text("kind").notNull(),
  delivery_state: text("delivery_state").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("managed_fleet_message_kind_check", sql`${table.kind} IN ('draft', 'note')`),
  check("managed_fleet_message_delivery_check", sql`${table.delivery_state} IN ('draft', 'dashboard_only', 'queued', 'sent', 'acknowledged', 'blocked', 'failed')`),
]);
export const managedFleetQuestionsTable = pgTable("managed_fleet_questions", {
  id: serial("id").primaryKey(),
  question_key: text("question_key").notNull().unique(),
  conversation_id: integer("conversation_id").notNull().references(() => managedFleetConversationsTable.id),
  project_key: text("project_key").notNull(),
  work_item_id: integer("work_item_id"),
  plan_version: integer("plan_version"),
  outcome_id: integer("outcome_id"),
  outcome_version: integer("outcome_version"),
  question_version: integer("question_version").notNull().default(1),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  recommendation: text("recommendation").notNull(),
  blocks_work: boolean("blocks_work").notNull().default(false),
  status: text("status").notNull().default("open"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [check("managed_fleet_question_status_check", sql`${table.status} IN ('open', 'answered', 'stale', 'superseded')`)]);
export const managedFleetAnswersTable = pgTable("managed_fleet_answers", {
  id: serial("id").primaryKey(),
  question_id: integer("question_id").notNull().references(() => managedFleetQuestionsTable.id),
  question_version: integer("question_version").notNull(),
  selected_option: text("selected_option").notNull(),
  comment: text("comment").notNull().default(""),
  actor: text("actor").notNull().default("Markus"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("managed_fleet_one_answer_per_question_version").on(table.question_id, table.question_version)]);
export const managedFleetQuestionEventsTable = pgTable("managed_fleet_question_events", {
  id: serial("id").primaryKey(),
  question_id: integer("question_id").notNull().references(() => managedFleetQuestionsTable.id),
  project_key: text("project_key").notNull(),
  event_type: text("event_type").notNull(),
  actor: text("actor").notNull(),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const managedWorkEventsTable = pgTable("managed_work_events", {
  id: serial("id").primaryKey(),
  work_item_id: integer("work_item_id").notNull().references(() => managedWorkItemsTable.id),
  project_key: text("project_key").notNull(),
  actor: text("actor").notNull(),
  event_type: text("event_type").notNull(),
  from_status: text("from_status"),
  to_status: text("to_status"),
  details: jsonb("details").$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProjectHandover = typeof projectHandoverTable.$inferSelect;
