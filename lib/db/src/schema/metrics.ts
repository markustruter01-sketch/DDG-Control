import { METRIC_DEFINITIONS } from "@workspace/project-constants";
import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  date,
  index,
  integer,
  primaryKey,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";

const metricKeys = Object.keys(METRIC_DEFINITIONS);

export const metricSnapshotsTable = pgTable(
  "metric_snapshots",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    key: text("key").notNull(),
    value: bigint("value", { mode: "number" }).notNull(),
    source: text("source").notNull(),
    captured_at: timestamp("captured_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "metric_snapshots_key_check",
      sql`${table.key} IN (${sql.join(
        metricKeys.map((key) => sql.raw(`'${key}'`)),
        sql`, `,
      )})`,
    ),
    index("metric_snapshots_project_key_captured_at_idx").on(
      table.project_id,
      table.key,
      table.captured_at,
    ),
  ],
);

export const dailySalesTable = pgTable(
  "daily_sales",
  {
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    day: date("day", { mode: "string" }).notNull(),
    sales_cents: bigint("sales_cents", { mode: "number" }).notNull(),
    orders: integer("orders").notNull(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.project_id, table.day] })],
);
