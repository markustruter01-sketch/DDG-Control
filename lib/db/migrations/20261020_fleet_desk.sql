ALTER TABLE managed_work_items ADD COLUMN IF NOT EXISTS plan_version integer NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS managed_fleet_conversations (
  id serial PRIMARY KEY,
  project_key text NOT NULL,
  scope_key text NOT NULL UNIQUE,
  work_item_id integer REFERENCES managed_work_items(id),
  plan_version integer,
  outcome_id integer REFERENCES managed_work_outcomes(id),
  outcome_version integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS managed_fleet_messages (
  id serial PRIMARY KEY,
  conversation_id integer NOT NULL REFERENCES managed_fleet_conversations(id),
  client_request_id text NOT NULL UNIQUE,
  project_key text NOT NULL,
  work_item_id integer,
  plan_version integer,
  outcome_id integer,
  outcome_version integer,
  author text NOT NULL DEFAULT 'Markus',
  body text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('draft','note')),
  delivery_state text NOT NULL CHECK (delivery_state IN ('draft','dashboard_only','queued','sent','acknowledged','blocked','failed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS managed_fleet_questions (
  id serial PRIMARY KEY,
  question_key text NOT NULL UNIQUE,
  conversation_id integer NOT NULL REFERENCES managed_fleet_conversations(id),
  project_key text NOT NULL,
  work_item_id integer,
  plan_version integer,
  outcome_id integer,
  outcome_version integer,
  question_version integer NOT NULL DEFAULT 1,
  question text NOT NULL,
  options jsonb NOT NULL,
  recommendation text NOT NULL,
  blocks_work boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','answered','stale','superseded')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS managed_fleet_answers (
  id serial PRIMARY KEY,
  question_id integer NOT NULL REFERENCES managed_fleet_questions(id),
  question_version integer NOT NULL,
  selected_option text NOT NULL,
  comment text NOT NULL DEFAULT '',
  actor text NOT NULL DEFAULT 'Markus',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (question_id, question_version)
);
CREATE TABLE IF NOT EXISTS managed_fleet_question_events (
  id serial PRIMARY KEY,
  question_id integer NOT NULL REFERENCES managed_fleet_questions(id),
  project_key text NOT NULL,
  event_type text NOT NULL,
  actor text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS managed_fleet_messages_scope_idx ON managed_fleet_messages(project_key, work_item_id, created_at DESC);
CREATE INDEX IF NOT EXISTS managed_fleet_questions_scope_idx ON managed_fleet_questions(project_key, work_item_id, status, created_at DESC);
