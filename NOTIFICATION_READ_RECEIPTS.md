# Saved-decision read receipts

Source scope: one authenticated dashboard owner, existing pending Decisions only.
No employee/system ingress, new approvals, task/worker starts or provider calls.

## Storage and version binding

- Additive notification_read_receipts table: decision ID, SHA-256 content fingerprint, read time. No copied decision titles, recommendations, owner personal details or raw payloads.
- Single owner follows existing authentication. GET and POST reject DEV bypass and require the signed owner session. Client cannot select an actor.
- Browser and server use the same versioned field-order helper over actual Decisions fields; no invented updated_at. The server recomputes under decision row lock before saving.
- A content fingerprint is not a source event number, audit chain or proof that a human understood a record. An identical restored payload may match an earlier receipt. True chronological revisions remain separate work.
- Same-version repeated saves return the original receipt. Content changes become unread; resolved/missing/stale records cannot be marked read. Receipt save never updates Decisions or grants permission.
- Links only navigate; explicit Mark read saves the receipt. There is no background read-save on navigation whose failure could disappear when the Header unmounts.
- UI badge counts pending decisions, independently of read state. Inbox pages20 records; receipt reads accept up to50IDs. No polling. Fetch on inbox use/source revision change and explicit refresh.
- Read state is Unknown while unavailable/DEV/stale. Save failures do not claim durable success. Exact existing decision links remain available.

## Migration and release boundary

Prepared SQL: lib/db/migrations/20261020_notification_read_receipts.sql.
Not executed. Source review and compilation are not database deployment approval.
Before applying, identify the exact approved development target and whether its database is shared with production. Back up the existing database and follow the owner's change-control boundary. Do not run push-force or a broad schema push as a shortcut.
The migration only creates the receipt table and constraints; no existing decisions/tasks/controls are changed. No automatic startup migration or data seed is included.
If absent/unavailable, receipt API returns503 and the existing decision inbox remains usable with read status Unknown.

## Acceptance evidence still required

- Compile API/frontend and inspect desktop/mobile, day/night.
- On an approved isolated database: migrate, sign in as owner, mark a record read and reload/restart; it remains pending.
- Changed displayed content reopens unread state. Stale version409, missing404 and resolved409 do not save.
- Owner-only access, DEV/no-session/inbound-key rejection, duplicate save idempotence and missing-table behavior.
- Cross-device refetch, keyboard/link/page navigation and save-response-loss recovery.
No tests were added or run while preparing this source.

## Recovery

Roll the application back to the prior reviewed revision while retaining the additive receipt table and its metadata. Do not drop tables or delete owner records automatically. A later destructive rollback/retention change needs its own review and approval.
