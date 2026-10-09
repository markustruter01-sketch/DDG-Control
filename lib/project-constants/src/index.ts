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

export const FLEET_MODES = ["paper", "live", "mixed"] as const;

export const PRIORITY_CALLS = [
  "accelerate",
  "maintain",
  "investigate",
  "delay",
  "kill",
] as const;

export const LEVELS = ["low", "medium", "high"] as const;

export const DECISION_STATUSES = ["pending", "approved", "declined"] as const;

export const DECISION_SOURCES = ["ollie_daily", "cursor"] as const;

export const NOTE_KINDS = ["risk", "incident", "update"] as const;

export const EXPENSE_KINDS = ["recurring_monthly", "one_off"] as const;

export const ORG_CHART = [
  { name: "Markus", role: "Founder", group: "founder" },
  { name: "Ollie", role: "General Manager & COO", group: "gm" },
  { name: "Harald", role: "Chief of Staff", group: "corporate" },
  { name: "Hermes", role: "Operations Manager", group: "corporate" },
  { name: "Plutus", role: "Finance & Analytics Manager", group: "corporate" },
  { name: "Freya", role: "Marketing Director", group: "corporate" },
  {
    name: "DDG Finance",
    role: "Venture Manager",
    group: "venture",
    project_slug: "finance",
  },
  {
    name: "DDG Hypest",
    role: "Venture Manager",
    group: "venture",
    project_slug: "hypest",
  },
  {
    name: "DDG Coffee",
    role: "Venture Manager",
    group: "venture",
    project_slug: "cattle-dog-coffee",
  },
  {
    name: "DDG Venture",
    role: "Venture Manager",
    group: "venture",
    project_slug: "gods-eye-view",
  },
] as const;

export const PRINCIPLES = [
  "THINK INDEPENDENTLY.",
  "CHALLENGE EVERYTHING.",
  "EXECUTE APPROVED DECISIONS EXCEPTIONALLY WELL.",
  "WE DO NOT PUNISH MISTAKES. WE PUNISH LYING AND COWARDICE.",
  "OVERALL COMPANY SUCCESS COMES FIRST.",
  "YOU ARE ALLOWED TO THINK BEFORE YOU ARE ALLOWED TO ACT.",
  "OLLIE MANAGES THE ORGANISATION. MARKUS MAKES THE CONSEQUENTIAL DECISIONS. EMPLOYEES EXECUTE APPROVED ACTIONS.",
  "REVENUE BEFORE EXPENDITURE. CREATIVITY BEFORE CAPITAL. FREE BEFORE PAID.",
] as const;

export const PROJECT_TABS = [
  "Overview & Goals",
  "To-do",
  "Customers",
  "Revenue & Subscriptions",
  "Marketing",
  "Agent Activity",
  "Next Best Action",
] as const;

export { BUSINESS_BRIEFS } from "./briefs";

export const METRIC_DEFINITIONS = {
  sales_7d: { unit: "aud_cents", label: "Online sales, last 7 days" },
  sales_30d: { unit: "aud_cents", label: "Online sales, last 30 days" },
  orders_7d: { unit: "count", label: "Online orders, last 7 days" },
  orders_30d: { unit: "count", label: "Online orders, last 30 days" },
  customers_30d: { unit: "count", label: "Online customers, last 30 days" },
  repeat_customers_30d: { unit: "count", label: "Online repeat customers, last 30 days" },
} as const;

export const PROJECT_HEADLINE_METRIC = {
  "cattle-dog-coffee": "sales_30d",
} as const satisfies Record<string, keyof typeof METRIC_DEFINITIONS>;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export type ProjectTab = (typeof PROJECT_TABS)[number];
export type MetricKey = keyof typeof METRIC_DEFINITIONS;
export type MetricUnit = (typeof METRIC_DEFINITIONS)[MetricKey]["unit"];
