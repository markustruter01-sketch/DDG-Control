import { MEMBER_KINDS, TASK_STATUSES } from "@workspace/project-constants";
import { check, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { projectsTable } from "./projects";

export const membersTable = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    kind: text("kind").notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check(
      "members_kind_check",
      sql`${table.kind} IN (${sql.join(
        MEMBER_KINDS.map((kind) => sql.raw(`'${kind}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export const tasksTable = pgTable(
  "tasks",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    title: text("title").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default(TASK_STATUSES[0]),
    owner_id: integer("owner_id")
      .notNull()
      .references(() => membersTable.id),
    due_date: date("due_date", { mode: "string" }),
    completed_at: timestamp("completed_at"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    check(
      "tasks_status_check",
      sql`${table.status} IN (${sql.join(
        TASK_STATUSES.map((status) => sql.raw(`'${status}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export type Member = typeof membersTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
