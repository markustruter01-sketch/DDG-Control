-- Additive change. Apply only to an explicitly approved database target.
-- Does not update Decisions, approvals, tasks, controls or provider records.
BEGIN;
CREATE TABLE IF NOT EXISTS notification_read_receipts (
  decision_id integer PRIMARY KEY REFERENCES decisions(id) ON DELETE CASCADE,
  source_version text NOT NULL CONSTRAINT notification_receipt_version_check CHECK (source_version ~ '^[a-f0-9]{64}$'),
  read_at timestamptz NOT NULL DEFAULT now()
);
COMMIT;
