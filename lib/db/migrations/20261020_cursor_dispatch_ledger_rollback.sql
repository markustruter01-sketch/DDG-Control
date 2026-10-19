-- Destructive rollback of dispatch metadata only. Export the ledger first.
DROP INDEX IF EXISTS managed_work_dispatch_project_status_idx;
DROP TABLE IF EXISTS managed_work_dispatches;
ALTER TABLE managed_work_outcomes DROP COLUMN IF EXISTS version;
DROP TABLE IF EXISTS managed_work_dispatch_config;
