import { FLEET_MODES } from "@workspace/project-constants";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const fleetSnapshotsTable = pgTable(
  "fleet_snapshots",
  {
    id: serial("id").primaryKey(),
    generated_at: timestamp("generated_at", { withTimezone: true })
      .notNull()
      .unique(),
    mode: text("mode").notNull(),
    total_equity_cents: bigint("total_equity_cents", {
      mode: "number",
    }).notNull(),
    total_starting_cents: bigint("total_starting_cents", {
      mode: "number",
    }).notNull(),
    total_pnl_cents: bigint("total_pnl_cents", { mode: "number" }).notNull(),
    open_positions: integer("open_positions").notNull(),
    stale_bots: integer("stale_bots").notNull(),
    paused_bots: integer("paused_bots").notNull(),
    errors: jsonb("errors").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
    received_at: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "fleet_snapshots_mode_check",
      sql`${table.mode} IN (${sql.join(
        FLEET_MODES.map((mode) => sql.raw(`'${mode}'`)),
        sql`, `,
      )})`,
    ),
  ],
);

export const fleetBotSnapshotsTable = pgTable(
  "fleet_bot_snapshots",
  {
    id: serial("id").primaryKey(),
    snapshot_id: integer("snapshot_id")
      .notNull()
      .references(() => fleetSnapshotsTable.id),
    bot_id: text("bot_id").notNull(),
    equity_cents: bigint("equity_cents", { mode: "number" }).notNull(),
    starting_cents: bigint("starting_cents", { mode: "number" }).notNull(),
    cash_cents: bigint("cash_cents", { mode: "number" }),
    pnl_cents: bigint("pnl_cents", { mode: "number" }).notNull(),
    open_positions: integer("open_positions").notNull(),
    last_updated: timestamp("last_updated", { withTimezone: true }),
    stale: boolean("stale").notNull(),
    paused: boolean("paused").notNull(),
  },
  (table) => [
    check(
      "fleet_bot_snapshots_bot_id_length_check",
      sql`char_length(${table.bot_id}) BETWEEN 1 AND 64`,
    ),
    check(
      "fleet_bot_snapshots_open_positions_check",
      sql`${table.open_positions} >= 0`,
    ),
  ],
);

export const fleetSnapshotDetailsTable = pgTable("fleet_snapshot_details", {
  snapshot_id: integer("snapshot_id")
    .notNull()
    .unique()
    .references(() => fleetSnapshotsTable.id),
  detail: jsonb("detail").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export type FleetSnapshot = typeof fleetSnapshotsTable.$inferSelect;
export type FleetBotSnapshot = typeof fleetBotSnapshotsTable.$inferSelect;
