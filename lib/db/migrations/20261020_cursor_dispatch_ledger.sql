-- Additive only: owner readiness, idempotent Cursor dispatch ledger, and outcome version.
CREATE TABLE IF NOT EXISTS managed_work_dispatch_config (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  enabled boolean NOT NULL DEFAULT false,
  plan_model_confirmed boolean NOT NULL DEFAULT false,
  included_allowance_confirmed boolean NOT NULL DEFAULT false,
  no_overage_confirmed boolean NOT NULL DEFAULT false,
  github_access_confirmed boolean NOT NULL DEFAULT false,
  secret_owner_verified boolean NOT NULL DEFAULT false,
  selected_model_id text,
  updated_by text NOT NULL DEFAULT 'Markus',
  updated_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO managed_work_dispatch_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE managed_work_outcomes
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS managed_work_dispatches (
  id serial PRIMARY KEY,
  work_item_id integer NOT NULL UNIQUE REFERENCES managed_work_items(id),
  project_key text NOT NULL,
  outcome_id integer REFERENCES managed_work_outcomes(id),
  outcome_version integer NOT NULL,
  idempotency_key text NOT NULL UNIQUE,
  provider text NOT NULL DEFAULT 'cursor',
  model_id text,
  agent_id text,
  run_id text,
  branch text,
  status text NOT NULL DEFAULT 'submitting'
    CHECK (status IN ('submitting', 'running', 'needs_owner', 'failed', 'completed')),
  error_summary text NOT NULL DEFAULT '',
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz
);
CREATE INDEX IF NOT EXISTS managed_work_dispatch_project_status_idx
  ON managed_work_dispatches(project_key, status, started_at DESC);
