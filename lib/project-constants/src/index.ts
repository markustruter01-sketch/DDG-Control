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

export const STATUS_LIGHTS = ["green", "amber", "red"] as const;

export const AGENT_RUN_STATUSES = ["running", "ok", "invalid", "error"] as const;

export const PRIORITY_CALLS = [
  "accelerate",
  "maintain",
  "investigate",
  "delay",
  "kill",
] as const;

export const LEVELS = ["low", "medium", "high"] as const;

export const DECISION_STATUSES = ["pending", "approved", "declined"] as const;

export const PROJECT_TABS = [
  "Overview & Goals",
  "To-do",
  "Customers",
  "Revenue & Subscriptions",
  "Marketing",
  "Agent Activity",
  "Next Best Action",
] as const;

export const METRIC_DEFINITIONS = {
  sales_7d: { unit: "aud_cents", label: "Sales, last 7 days" },
  sales_30d: { unit: "aud_cents", label: "Sales, last 30 days" },
  orders_7d: { unit: "count", label: "Orders, last 7 days" },
  orders_30d: { unit: "count", label: "Orders, last 30 days" },
} as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectTab = (typeof PROJECT_TABS)[number];
export type MetricKey = keyof typeof METRIC_DEFINITIONS;
export type MetricUnit = (typeof METRIC_DEFINITIONS)[MetricKey]["unit"];
