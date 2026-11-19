import { date, integer, pgTable, primaryKey, text } from "drizzle-orm/pg-core";

// Visitor counting for ddg.limited (Markus 19 Nov). One row per Brisbane day and event,
// e.g. "view", "reach:build", "form:sent". No cookies, no IP addresses, no personal data.
export const siteVisitsTable = pgTable(
  "site_visits",
  {
    day: date("day", { mode: "string" }).notNull(),
    event: text("event").notNull(),
    count: integer("count").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.event] })],
);
