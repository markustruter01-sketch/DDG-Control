import { boolean, index, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// DDG Build: people who want DDG to build something for them (opens 1 Jan 2027).
// One row per website enquiry. Allowed values are checked by the API (OpenAPI enums),
// not by database constraints, so stages and options can change without a migration.
export const enquiriesTable = pgTable(
  "enquiries",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").notNull(),
    features: jsonb("features").$type<string[]>().notNull().default([]),
    has_now: text("has_now").notNull(),
    timing: text("timing").notNull(),
    budget: text("budget").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    about: text("about"),
    ballpark: text("ballpark"),
    stage: text("stage").notNull().default("new"),
    notes: text("notes"),
    test: boolean("test").notNull().default(false), // sent by Markus while logged in, before opening
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("enquiries_created_idx").on(table.created_at)],
);
