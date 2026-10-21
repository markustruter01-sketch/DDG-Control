-- Destructive rollback for the additive work-management feature only.
-- Export/retain rows in these six feature tables before using this file.
-- It never drops or changes pre-existing projects, goals, tasks, decisions, or notes.
DROP TABLE IF EXISTS managed_work_events;
DROP TABLE IF EXISTS managed_work_items;
DROP TABLE IF EXISTS project_handover_events;
DROP TABLE IF EXISTS project_handovers;
DROP TABLE IF EXISTS project_work_audit;
DROP TABLE IF EXISTS project_work_controls;
