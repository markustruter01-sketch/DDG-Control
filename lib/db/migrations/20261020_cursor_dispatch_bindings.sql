ALTER TABLE managed_work_dispatch_config
  ADD COLUMN IF NOT EXISTS approved_repository text,
  ADD COLUMN IF NOT EXISTS approved_starting_branch text,
  ADD COLUMN IF NOT EXISTS approved_project_key text;
ALTER TABLE managed_work_dispatches
  ADD COLUMN IF NOT EXISTS provider_status text;
