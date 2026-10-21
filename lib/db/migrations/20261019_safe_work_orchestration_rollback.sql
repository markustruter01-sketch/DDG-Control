-- Destructive rollback for the additive orchestration metadata only.
-- Export these rows before rollback if they need to be retained.
DROP INDEX IF EXISTS managed_work_one_task_per_outcome_gate;
DROP INDEX IF EXISTS managed_work_one_active_per_repository;
ALTER TABLE managed_work_items
  DROP COLUMN IF EXISTS dispatch_block_reason,
  DROP COLUMN IF EXISTS dispatch_state,
  DROP COLUMN IF EXISTS target_branch,
  DROP COLUMN IF EXISTS repository,
  DROP COLUMN IF EXISTS gate_key,
  DROP COLUMN IF EXISTS outcome_id;
DROP TABLE IF EXISTS managed_work_outcome_events;
DROP TABLE IF EXISTS managed_work_outcomes;
