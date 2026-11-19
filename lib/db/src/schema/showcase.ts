import { integer, jsonb, pgTable, timestamp } from "drizzle-orm/pg-core";

// The DDG Finance showcase (ddg.limited/live/finance): the latest snapshot of the Finance dashboard's
// own API answers, pushed by Finance while the US market is closed. One row (id 1), replaced each push.
export const financeShowcaseTable = pgTable("finance_showcase", {
  id: integer("id").primaryKey(),
  taken_at: timestamp("taken_at", { withTimezone: true }).notNull(),
  body: jsonb("body").notNull(),
  received_at: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
});
