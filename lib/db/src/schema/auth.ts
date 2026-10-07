import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const failedLoginsTable = pgTable(
  "failed_logins",
  {
    id: serial("id").primaryKey(),
    address: text("address").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("failed_logins_created_at_idx").on(table.created_at)],
);
