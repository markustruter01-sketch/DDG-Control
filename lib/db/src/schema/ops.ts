import { sql } from "drizzle-orm";
import { check, index, integer, jsonb, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Every number a Grok bot pushes into Control is logged here: which bot, what it sent,
// which row it created. Markus can review the log and undo a wrong push.
export const botPushesTable = pgTable(
  "bot_pushes",
  {
    id: serial("id").primaryKey(),
    bot: text("bot").notNull(),
    kind: text("kind").notNull(),
    record_id: integer("record_id"),
    payload: jsonb("payload").notNull(),
    status: integer("status").notNull(),
    received_at: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    undone_at: timestamp("undone_at", { withTimezone: true }),
  },
  (table) => [
    check("bot_pushes_kind_check", sql`${table.kind} IN ('social', 'expense', 'revenue', 'ask')`),
    index("bot_pushes_received_idx").on(table.received_at),
  ],
);

// The home screen's "Needs you" list. Added by Markus, Claude or a bot (Heimdall's asks).
export const asksTable = pgTable(
  "asks",
  {
    id: serial("id").primaryKey(),
    text: text("text").notNull(),
    business: text("business"),
    due: text("due"),
    source: text("source").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    done_at: timestamp("done_at", { withTimezone: true }),
  },
  (table) => [
    check("asks_text_length_check", sql`char_length(${table.text}) BETWEEN 1 AND 200`),
    check("asks_business_check", sql`${table.business} IS NULL OR ${table.business} IN ('finance', 'coffee', 'fitness', 'creative')`),
  ],
);
