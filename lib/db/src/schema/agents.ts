import { AGENT_RUN_STATUSES, STATUS_LIGHTS } from "@workspace/project-constants";
import { sql } from "drizzle-orm";
import {
  check,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";
import { membersTable } from "./tasks";

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
    risks: jsonb("risks").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
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
  ],
);
