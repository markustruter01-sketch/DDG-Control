import { check, integer, jsonb, pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Source contract only; no migration/push occurs by importing this file.
// Immutable reference/approval receipts, never a second copy of task bodies.
export const companyPlanRevisionsTable = pgTable('company_plan_revisions', {
  id: serial('id').primaryKey(),
  request_id: text('request_id').notNull(),
  kind: text('kind').notNull(),
  target_revision_id: integer('target_revision_id'),
  manifest: jsonb('manifest').$type<Record<string, unknown> | null>(),
  digest: text('digest').notNull(),
  actor: text('actor').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, table => [
  uniqueIndex('company_plan_request_unique').on(table.request_id),
  check('company_plan_kind_check', sql`${table.kind} IN ('proposed', 'accepted', 'withdrawn')`),
  check('company_plan_reference_check', sql`(${table.kind} = 'proposed' AND ${table.target_revision_id} IS NULL AND ${table.manifest} IS NOT NULL) OR (${table.kind} IN ('accepted', 'withdrawn') AND ${table.target_revision_id} IS NOT NULL AND ${table.manifest} IS NULL)`),
]);
