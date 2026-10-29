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
    error: text("error"),
    received_at: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    undone_at: timestamp("undone_at", { withTimezone: true }),
  },
  (table) => [
    check("bot_pushes_kind_check", sql`${table.kind} IN ('social', 'expense', 'revenue', 'ask')`),
    index("bot_pushes_received_idx").on(table.received_at),
  ],
);

// Messages between Markus, Claude and the Grok bots. Bots read theirs from /bots/inbox
// and reply with /bots/message. "all" goes to every bot. read_at = when the recipient fetched it.
export const botMessagesTable = pgTable(
  "bot_messages",
  {
    id: serial("id").primaryKey(),
    sender: text("sender").notNull(),
    recipient: text("recipient").notNull(),
    text: text("text").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    read_at: timestamp("read_at", { withTimezone: true }),
  },
  (table) => [
    check("bot_messages_text_length_check", sql`char_length(${table.text}) BETWEEN 1 AND 4000`),
    index("bot_messages_recipient_idx").on(table.recipient, table.id),
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
