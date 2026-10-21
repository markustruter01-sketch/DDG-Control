import { sql } from "drizzle-orm";
import { check, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { decisionsTable } from "./agents";

/** This application has one authenticated owner. No client-supplied actor. */
export const notificationReadReceiptsTable = pgTable("notification_read_receipts", {
  decision_id: integer("decision_id").primaryKey().references(() => decisionsTable.id, { onDelete: "cascade" }),
  source_version: text("source_version").notNull(),
  read_at: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  check("notification_receipt_version_check", sql`${table.source_version} ~ '^[a-f0-9]{64}$'`),
]);
