-- Destructive rollback of Fleet Desk records. Export the tables before using.
DROP INDEX IF EXISTS managed_fleet_questions_scope_idx;
DROP INDEX IF EXISTS managed_fleet_messages_scope_idx;
DROP TABLE IF EXISTS managed_fleet_question_events;
DROP TABLE IF EXISTS managed_fleet_answers;
DROP TABLE IF EXISTS managed_fleet_questions;
DROP TABLE IF EXISTS managed_fleet_messages;
DROP TABLE IF EXISTS managed_fleet_conversations;
ALTER TABLE managed_work_items DROP COLUMN IF EXISTS plan_version;
