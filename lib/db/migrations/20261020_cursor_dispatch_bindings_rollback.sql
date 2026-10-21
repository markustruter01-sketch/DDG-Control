ALTER TABLE managed_work_dispatches DROP COLUMN IF EXISTS provider_status;
ALTER TABLE managed_work_dispatch_config
  DROP COLUMN IF EXISTS approved_project_key,
  DROP COLUMN IF EXISTS approved_starting_branch,
  DROP COLUMN IF EXISTS approved_repository;
