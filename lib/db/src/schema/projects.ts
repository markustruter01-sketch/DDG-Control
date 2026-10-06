import { PROJECT_STATUSES } from "@workspace/project-constants";
import { check, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const projectsTable = pgTable(
  "projects",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    status: text("status").notNull().default(PROJECT_STATUSES[0]),
    sort_order: integer("sort_order").notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => [
    check(
      "projects_status_check",
      sql`${table.status} IN (${sql.join(
        PROJECT_STATUSES.map((status) => sql.raw(`'${status}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export type Project = typeof projectsTable.$inferSelect;
