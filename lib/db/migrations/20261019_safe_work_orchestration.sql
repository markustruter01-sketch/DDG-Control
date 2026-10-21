-- Additive, development-safe work outcome and dispatch-readiness metadata.
CREATE TABLE IF NOT EXISTS managed_work_outcomes (
  id serial PRIMARY KEY,
  project_key text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  gates jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending_approval'
    CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS managed_work_one_pending_outcome_per_project
  ON managed_work_outcomes(project_key)
  WHERE status IN ('draft', 'pending_approval', 'approved');

CREATE TABLE IF NOT EXISTS managed_work_outcome_events (
  id serial PRIMARY KEY,
  outcome_id integer NOT NULL REFERENCES managed_work_outcomes(id),
  project_key text NOT NULL,
  actor text NOT NULL,
  event_type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE managed_work_items
  ADD COLUMN IF NOT EXISTS outcome_id integer REFERENCES managed_work_outcomes(id),
  ADD COLUMN IF NOT EXISTS gate_key text,
  ADD COLUMN IF NOT EXISTS repository text,
  ADD COLUMN IF NOT EXISTS target_branch text,
  ADD COLUMN IF NOT EXISTS dispatch_state text NOT NULL DEFAULT 'disabled',
  ADD COLUMN IF NOT EXISTS dispatch_block_reason text NOT NULL DEFAULT 'Cursor entitlement and no-overage terms are unverified.';

CREATE UNIQUE INDEX IF NOT EXISTS managed_work_one_active_per_repository
  ON managed_work_items(repository)
  WHERE repository IS NOT NULL AND status IN ('approved', 'in_progress');
CREATE UNIQUE INDEX IF NOT EXISTS managed_work_one_task_per_outcome_gate
  ON managed_work_items(outcome_id, gate_key)
  WHERE outcome_id IS NOT NULL AND gate_key IS NOT NULL;
