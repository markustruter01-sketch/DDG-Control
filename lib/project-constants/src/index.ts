export const PROJECT_STATUSES = ["unset", "active", "building", "paused"] as const;

export const TASK_STATUSES = [
  "planned",
  "in_progress",
  "needs_approval",
  "done",
  "blocked",
] as const;

export const GOAL_STATUSES = ["active", "achieved", "dropped"] as const;

export type GoalStatus = (typeof GOAL_STATUSES)[number];

export const GOAL_STATUS_LABELS: Record<GoalStatus, string> = {
  active: "Active",
  achieved: "Achieved",
  dropped: "Dropped",
};

export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  needs_approval: "Needs approval",
  done: "Done",
  blocked: "Blocked",
};

export const MEMBER_KINDS = ["human", "agent"] as const;

export const PROJECT_TABS = [
  "Overview & Goals",
  "To-do",
  "Customers",
  "Revenue & Subscriptions",
  "Marketing",
  "Agent Activity",
  "Next Best Action",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectTab = (typeof PROJECT_TABS)[number];
