import { SOCIAL_PLATFORMS } from "@workspace/project-constants";
import { sql } from "drizzle-orm";
import {
  check,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";

const platforms = SOCIAL_PLATFORMS.map((platform) => sql.raw(`'${platform}'`));

// One row per reading of one platform's numbers for one venture. Readings are
// only ever added, so growth over time can be shown.
export const socialSnapshotsTable = pgTable(
  "social_snapshots",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    platform: text("platform").notNull(),
    followers: integer("followers").notNull(),
    impressions_30d: integer("impressions_30d"),
    engagements_30d: integer("engagements_30d"),
    captured_on: date("captured_on", { mode: "string" }).notNull(),
    source: text("source").notNull().default("manual"),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "social_snapshots_platform_check",
      sql`${table.platform} IN (${sql.join(platforms, sql`, `)})`,
    ),
    check("social_snapshots_followers_check", sql`${table.followers} >= 0`),
    check(
      "social_snapshots_impressions_check",
      sql`${table.impressions_30d} IS NULL OR ${table.impressions_30d} >= 0`,
    ),
    check(
      "social_snapshots_engagements_check",
      sql`${table.engagements_30d} IS NULL OR ${table.engagements_30d} >= 0`,
    ),
    check(
      "social_snapshots_source_check",
      sql`${table.source} IN ('manual', 'youtube_api', 'bot')`,
    ),
  ],
);
