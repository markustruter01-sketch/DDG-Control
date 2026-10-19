import { boolean, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { projectsTable } from "./projects";

export const projectWorkControlsTable = pgTable("project_work_controls", {
  project_key: text("project_key").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  updated_by: text("updated_by").notNull().default("Markus"),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const projectWorkAuditTable = pgTable("project_work_audit", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  enabled: boolean("enabled").notNull(),
  owner_confirmed: boolean("owner_confirmed").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
});

export const projectHandoverTable = pgTable("project_handovers", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  project_id: integer("project_id").references(() => projectsTable.id),
  task_id: integer("task_id"),
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

export const managedWorkItemsTable = pgTable("managed_work_items", {
  id: serial("id").primaryKey(),
  project_key: text("project_key").notNull(),
  project_id: integer("project_id").references(() => projectsTable.id),
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
  spend_limit_cents: integer("spend_limit_cents").notNull().default(0),
  stop_condition: text("stop_condition").notNull(),
  status: text("status").notNull().default("pending_approval"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
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
