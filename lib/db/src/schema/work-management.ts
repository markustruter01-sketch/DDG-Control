import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
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

export type ProjectHandover = typeof projectHandoverTable.$inferSelect;
