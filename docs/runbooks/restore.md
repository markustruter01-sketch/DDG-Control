# DDG Control: bringing the database back from a backup

Work order B1.11. Marks: VERIFIED = checked in the code, 18 Nov 2026. UNKNOWN = Markus to confirm.

- The app uses one PostgreSQL database, given to it as the Replit secret `DATABASE_URL` (VERIFIED: `lib/db/src/index.ts`).
- UNKNOWN: whether daily backups are switched on for this database in Replit. The company audit asks Markus to switch them on (action 8). Until they are, there may be nothing to restore from.

## Restore, step by step
1. **Stop writes first.** Unpublish or pause the app so nothing writes while you restore.
2. **Find the backup.** Replit app → Database → Backups (or restore points). Pick the newest one from before the problem.
3. **Restore to a copy, not over the live database,** if Replit offers it. Check the copy: the tables are there and the newest rows have the time you expect.
4. **Point the app at it** (or restore over the live database once the copy looks right).
5. **Check:** `https://ddg.limited/api/healthz` answers, the Control room logs in, and the money and to-do numbers look right.
6. **Republish** and write a dated note in `docs/handover/README.md`: what broke, which backup was used, what was lost between the backup and the failure.

## Test it once a month
Restore the newest backup to a copy and check step 5 on the copy. A backup that has never been restored is not yet known to work.
