import { SOCIAL_V2_FIRST_ID, db, socialSnapshotsTable, socialSnapshotsV2Table } from '@workspace/db';
import { desc, lte, max } from 'drizzle-orm';

// Social readings live in two tables: social_snapshots (before 31 Oct 2026, read only) and
// social_snapshots_v2 (new readings: Spotify, all-time totals). Every reader goes through here.

export type SocialRow = typeof socialSnapshotsV2Table.$inferSelect;

/** Both tables as one list, newest first (by day, then id). `upTo` = last day to include. */
export async function socialRows(opts: { upTo?: string; limit?: number } = {}): Promise<SocialRow[]> {
  const limit = opts.limit ?? 1000;
  const [v1, v2] = await Promise.all([
    db.select().from(socialSnapshotsTable)
      .where(opts.upTo ? lte(socialSnapshotsTable.captured_on, opts.upTo) : undefined)
      .orderBy(desc(socialSnapshotsTable.captured_on), desc(socialSnapshotsTable.id)).limit(limit),
    db.select().from(socialSnapshotsV2Table)
      .where(opts.upTo ? lte(socialSnapshotsV2Table.captured_on, opts.upTo) : undefined)
      .orderBy(desc(socialSnapshotsV2Table.captured_on), desc(socialSnapshotsV2Table.id)).limit(limit),
  ]);
  return [...v2, ...v1.map((r) => ({ ...r, views_all_time: null, likes_all_time: null }))]
    .sort((a, b) => (a.captured_on === b.captured_on ? b.id - a.id : a.captured_on < b.captured_on ? 1 : -1))
    .slice(0, limit);
}

/** When the newest social reading was saved, in either table. */
export async function latestSocialAt(): Promise<Date | null> {
  const [[a], [b]] = await Promise.all([
    db.select({ at: max(socialSnapshotsTable.created_at) }).from(socialSnapshotsTable),
    db.select({ at: max(socialSnapshotsV2Table.created_at) }).from(socialSnapshotsV2Table),
  ]);
  const times = [a?.at, b?.at].filter((d): d is Date => d instanceof Date);
  return times.length ? new Date(Math.max(...times.map((d) => d.getTime()))) : null;
}

/** The table a social reading's id belongs to (new readings start at SOCIAL_V2_FIRST_ID). */
export const socialTableFor = (id: number) => (id >= SOCIAL_V2_FIRST_ID ? socialSnapshotsV2Table : socialSnapshotsTable);
