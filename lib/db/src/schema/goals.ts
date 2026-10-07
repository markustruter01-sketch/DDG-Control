import { GOAL_STATUSES } from "@workspace/project-constants";
import { check, date, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { projectsTable } from "./projects";

export const goalsTable = pgTable(
  "goals",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    title: text("title").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default(GOAL_STATUSES[0]),
    target_date: date("target_date", { mode: "string" }),
    achieved_at: timestamp("achieved_at"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => [
    check(
      "goals_status_check",
      sql`${table.status} IN (${sql.join(
        GOAL_STATUSES.map((status) => sql.raw(`'${status}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export type Goal = typeof goalsTable.$inferSelect;
