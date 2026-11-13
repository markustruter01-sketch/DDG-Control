import { boolean, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

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

// A fixed-price quote sent to a client as a private link (ddg.limited/quote/<token>).
// The client accepts it there and pays the deposit through Stripe (when DDG's Stripe is set up).
export const quotesTable = pgTable(
  "quotes",
  {
    id: serial("id").primaryKey(),
    token: text("token").notNull().unique(), // random, unguessable; the only way to open the quote
    enquiry_id: integer("enquiry_id").references(() => enquiriesTable.id),
    client_name: text("client_name").notNull(),
    client_email: text("client_email").notNull(),
    title: text("title").notNull(),
    scope: jsonb("scope").$type<string[]>().notNull().default([]),
    total_cents: integer("total_cents").notNull(),
    deposit_cents: integer("deposit_cents").notNull(),
    valid_until: text("valid_until").notNull(), // YYYY-MM-DD, Brisbane
    status: text("status").notNull().default("sent"), // sent | accepted | paid | withdrawn
    accepted_name: text("accepted_name"),
    accepted_at: timestamp("accepted_at", { withTimezone: true }),
    stripe_session_id: text("stripe_session_id"),
    paid_at: timestamp("paid_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("quotes_enquiry_idx").on(table.enquiry_id)],
);
