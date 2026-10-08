import { EXPENSE_KINDS } from "@workspace/project-constants";
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { projectsTable } from "./projects";

const expenseKinds = EXPENSE_KINDS.map((kind) => sql.raw(`'${kind}'`));

export const debtsTable = pgTable(
  "debts",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id").references(() => projectsTable.id),
    name: text("name").notNull(),
    balance_cents: bigint("balance_cents", { mode: "bigint" }).notNull(),
    note: text("note"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "debts_name_length_check",
      sql`${table.name} = btrim(${table.name}) AND char_length(${table.name}) BETWEEN 1 AND 100`,
    ),
    check("debts_balance_cents_nonnegative_check", sql`${table.balance_cents} >= 0`),
    check(
      "debts_note_max_length_check",
      sql`${table.note} IS NULL OR char_length(${table.note}) <= 300`,
    ),
  ],
);

export const expensesTable = pgTable(
  "expenses",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id").references(() => projectsTable.id),
    name: text("name").notNull(),
    kind: text("kind").notNull(),
    amount_cents: bigint("amount_cents", { mode: "bigint" }).notNull(),
    spent_on: date("spent_on", { mode: "string" }),
    active: boolean("active").notNull().default(true),
    note: text("note"),
    idempotency_key: text("idempotency_key"),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "expenses_name_length_check",
      sql`${table.name} = btrim(${table.name}) AND char_length(${table.name}) BETWEEN 1 AND 100`,
    ),
    check(
      "expenses_kind_check",
      sql`${table.kind} IN (${sql.join(expenseKinds, sql`, `)})`,
    ),
    check("expenses_amount_cents_positive_check", sql`${table.amount_cents} > 0`),
    check(
      "expenses_spent_on_kind_check",
      sql`(${table.kind} = 'one_off' AND ${table.spent_on} IS NOT NULL) OR (${table.kind} = 'recurring_monthly' AND ${table.spent_on} IS NULL)`,
    ),
    check(
      "expenses_note_max_length_check",
      sql`${table.note} IS NULL OR char_length(${table.note}) <= 300`,
    ),
    check(
      "expenses_idempotency_key_length_check",
      sql`${table.idempotency_key} IS NULL OR char_length(${table.idempotency_key}) BETWEEN 1 AND 64`,
    ),
    unique("expenses_idempotency_key_unique").on(table.idempotency_key),
  ],
);

export const revenueEntriesTable = pgTable(
  "revenue_entries",
  {
    id: serial("id").primaryKey(),
    project_id: integer("project_id").references(() => projectsTable.id),
    name: text("name").notNull(),
    amount_cents: bigint("amount_cents", { mode: "bigint" }).notNull(),
    received_on: date("received_on", { mode: "string" }).notNull(),
    note: text("note"),
    idempotency_key: text("idempotency_key"),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    check(
      "revenue_entries_name_length_check",
      sql`${table.name} = btrim(${table.name}) AND char_length(${table.name}) BETWEEN 1 AND 100`,
    ),
    check(
      "revenue_entries_amount_cents_positive_check",
      sql`${table.amount_cents} > 0`,
    ),
    check(
      "revenue_entries_note_max_length_check",
      sql`${table.note} IS NULL OR char_length(${table.note}) <= 300`,
    ),
    check(
      "revenue_entries_idempotency_key_length_check",
      sql`${table.idempotency_key} IS NULL OR char_length(${table.idempotency_key}) BETWEEN 1 AND 64`,
    ),
    unique("revenue_entries_idempotency_key_unique").on(
      table.idempotency_key,
    ),
  ],
);

export type Debt = typeof debtsTable.$inferSelect;
export type Expense = typeof expensesTable.$inferSelect;
export type RevenueEntry = typeof revenueEntriesTable.$inferSelect;
