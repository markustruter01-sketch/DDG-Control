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

// social_snapshots (v1) keeps its original platform list frozen: production CHECK constraints
// cannot be changed by a Replit publish. New readings go to social_snapshots_v2 (below).
const V1_PLATFORMS = ["instagram", "facebook", "tiktok", "youtube", "x", "linkedin"];
const platforms = V1_PLATFORMS.map((platform) => sql.raw(`'${platform}'`));

// One row per reading of one platform's numbers for one venture. Readings are
// only ever added, so growth over time can be shown. LEGACY: read only since 31 Oct 2026.
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
      sql`${table.source} IN ('manual', 'youtube_api')`,
    ),
  ],
);

/** Ids of new readings start here, so an id says which table a row is in (used by Undo). */
export const SOCIAL_V2_FIRST_ID = 1_000_000;

// Social readings from 31 Oct 2026 (Spotify added, Facebook dropped; all-time totals).
// The platform is checked by the API (OpenAPI enum), not by the database, so the list can
// change without a migration.
export const socialSnapshotsV2Table = pgTable(
  "social_snapshots_v2",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: SOCIAL_V2_FIRST_ID }),
    project_id: integer("project_id")
      .notNull()
      .references(() => projectsTable.id),
    platform: text("platform").notNull(),
    followers: integer("followers").notNull(),
    impressions_30d: integer("impressions_30d"),
    engagements_30d: integer("engagements_30d"),
    // All-time totals, only when the platform itself shows one (Markus 31 Oct: show all time).
    views_all_time: integer("views_all_time"),
    likes_all_time: integer("likes_all_time"),
    captured_on: date("captured_on", { mode: "string" }).notNull(),
    source: text("source").notNull().default("manual"),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    check("social_snapshots_v2_followers_check", sql`${table.followers} >= 0`),
    check("social_snapshots_v2_counts_check", sql`coalesce(${table.impressions_30d}, 0) >= 0 AND coalesce(${table.engagements_30d}, 0) >= 0 AND coalesce(${table.views_all_time}, 0) >= 0 AND coalesce(${table.likes_all_time}, 0) >= 0`),
  ],
);
