import {
  AGENT_RUN_STATUSES,
  DECISION_SOURCES,
  DECISION_STATUSES,
  LEVELS,
  NOTE_KINDS,
  PRIORITY_CALLS,
  STATUS_LIGHTS,
} from "@workspace/project-constants";
import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";
import { membersTable, tasksTable } from "./tasks";

type RiskLevel = (typeof LEVELS)[number];

export type AgentRisk = {
  text: string;
  severity: RiskLevel;
};

export const agentRunsTable = pgTable(
  "agent_runs",
  {
    id: serial("id").primaryKey(),
    member_id: integer("member_id")
      .notNull()
      .references(() => membersTable.id),
    status: text("status").notNull(),
    model: text("model"),
    input_tokens: integer("input_tokens"),
    output_tokens: integer("output_tokens"),
    raw_output: text("raw_output"),
    error: text("error"),
    started_at: timestamp("started_at").notNull().defaultNow(),
    finished_at: timestamp("finished_at"),
  },
  (table) => [
    check(
      "agent_runs_status_check",
      sql`${table.status} IN (${sql.join(
        AGENT_RUN_STATUSES.map((status) => sql.raw(`'${status}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export const agentProjectUpdatesTable = pgTable(
  "agent_project_updates",
  {
    id: serial("id").primaryKey(),
    run_id: integer("run_id")
      .notNull()
      .references(() => agentRunsTable.id),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    status_light: text("status_light").notNull(),
    summary: text("summary").notNull(),
    next_action: text("next_action").notNull(),
    risks: jsonb("risks").$type<AgentRisk[]>().notNull().default(sql`'[]'::jsonb`),
    priority: text("priority"),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check(
      "agent_project_updates_status_light_check",
      sql`${table.status_light} IN (${sql.join(
        STATUS_LIGHTS.map((statusLight) => sql.raw(`'${statusLight}'`)),
        sql`, `,
      )})`,
    ),
    check(
      "agent_project_updates_priority_check",
      sql`${table.priority} IS NULL OR ${table.priority} IN (${sql.join(
        PRIORITY_CALLS.map((priority) => sql.raw(`'${priority}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export const decisionsTable = pgTable(
  "decisions",
  {
    id: serial("id").primaryKey(),
    run_id: integer("run_id").references(() => agentRunsTable.id),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    source: text("source").notNull().default(DECISION_SOURCES[0]),
    decided_via: text("decided_via"),
    title: text("title").notNull(),
    recommendation: text("recommendation").notNull(),
    cost_estimate_aud: integer("cost_estimate_aud"),
    risk: text("risk").notNull(),
    urgency: text("urgency").notNull(),
    confidence: text("confidence").notNull(),
    owner_id: integer("owner_id")
      .notNull()
      .references(() => membersTable.id),
    due_date: date("due_date", { mode: "string" }),
    status: text("status").notNull().default(DECISION_STATUSES[0]),
    note: text("note"),
    decided_at: timestamp("decided_at"),
    task_id: integer("task_id").references(() => tasksTable.id),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check(
      "decisions_urgency_check",
      sql`${table.urgency} IN (${sql.join(
        LEVELS.map((level) => sql.raw(`'${level}'`)),
        sql`, `,
      )})`,
    ),
    check(
      "decisions_confidence_check",
      sql`${table.confidence} IN (${sql.join(
        LEVELS.map((level) => sql.raw(`'${level}'`)),
        sql`, `,
      )})`,
    ),
    check(
      "decisions_status_check",
      sql`${table.status} IN (${sql.join(
        DECISION_STATUSES.map((status) => sql.raw(`'${status}'`)),
        sql`, `,
      )})`,
    ),
    check(
      "decisions_source_check",
      sql`${table.source} IN (${sql.join(
        DECISION_SOURCES.map((source) => sql.raw(`'${source}'`)),
        sql`, `,
      )})`,
    ),
    check(
      "decisions_decided_via_check",
      sql`${table.decided_via} IS NULL OR ${table.decided_via} IN ('dashboard', 'cursor')`,
    ),
  ],
);

export const inboundNotesTable = pgTable(
  "inbound_notes",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    kind: text("kind").notNull(),
    severity: text("severity").notNull(),
    text: text("text").notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check(
      "inbound_notes_kind_check",
      sql`${table.kind} IN (${sql.join(
        NOTE_KINDS.map((kind) => sql.raw(`'${kind}'`)),
        sql`, `,
      )})`,
    ),
    check(
      "inbound_notes_severity_check",
      sql`${table.severity} IN (${sql.join(
        LEVELS.map((level) => sql.raw(`'${level}'`)),
        sql`, `,
      )})`,
    ),
  ],
);
