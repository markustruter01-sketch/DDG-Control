-- Additive DDG Control work-management schema. Safe to apply repeatedly.
CREATE TABLE IF NOT EXISTS project_work_controls (
  project_key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  updated_by text NOT NULL DEFAULT 'Markus',
  updated_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS project_work_audit (
  id serial PRIMARY KEY,
  project_key text NOT NULL,
  enabled boolean NOT NULL,
  owner_confirmed boolean NOT NULL,
  event_type text NOT NULL DEFAULT 'work_toggle',
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS project_handovers (
  id serial PRIMARY KEY,
  project_key text NOT NULL,
  project_id integer REFERENCES projects(id),
  task_id integer,
  work_item_id integer,
  branch text,
  commit_ref text,
  status text NOT NULL,
  completed_work text NOT NULL,
  next_action text NOT NULL,
  blockers text NOT NULL DEFAULT '',
  verification text NOT NULL DEFAULT '',
  recovery_note text NOT NULL,
  created_at timestamp NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS project_handover_events (
  id serial PRIMARY KEY,
  checkpoint_id integer NOT NULL REFERENCES project_handovers(id),
  project_key text NOT NULL,
  task_id integer,
  actor text NOT NULL,
  event_type text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS managed_work_items (
  id serial PRIMARY KEY,
  project_key text NOT NULL,
  project_id integer REFERENCES projects(id),
  goal_id integer REFERENCES goals(id),
  title text NOT NULL,
  objective text NOT NULL,
  outcome text NOT NULL,
  checklist jsonb NOT NULL,
  acceptance_checks jsonb NOT NULL,
  acceptance_evidence text NOT NULL DEFAULT '',
  result text NOT NULL DEFAULT '',
  branch text,
  commit_ref text,
  review_link text,
  deadline timestamptz NOT NULL,
  time_limit_minutes integer NOT NULL CHECK (time_limit_minutes BETWEEN 5 AND 1440),
  max_attempts integer NOT NULL CHECK (max_attempts BETWEEN 1 AND 10),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  started_at timestamptz,
  spend_limit_cents integer NOT NULL DEFAULT 0 CHECK (spend_limit_cents = 0),
  stop_condition text NOT NULL,
  status text NOT NULL DEFAULT 'pending_approval',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS managed_work_one_active_per_project
  ON managed_work_items(project_key) WHERE status IN ('approved', 'in_progress');
CREATE TABLE IF NOT EXISTS managed_work_events (
  id serial PRIMARY KEY,
  work_item_id integer NOT NULL REFERENCES managed_work_items(id),
  project_key text NOT NULL,
  actor text NOT NULL,
  event_type text NOT NULL,
  from_status text,
  to_status text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- Idempotent additive upgrades when earlier dev preview iterations applied
-- the base tables before completion/resume fields were added.
ALTER TABLE project_work_controls ADD COLUMN IF NOT EXISTS completed boolean NOT NULL DEFAULT false;
ALTER TABLE project_work_audit ADD COLUMN IF NOT EXISTS event_type text NOT NULL DEFAULT 'work_toggle';
ALTER TABLE managed_work_items ADD COLUMN IF NOT EXISTS started_at timestamptz;
