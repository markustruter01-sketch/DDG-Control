import { DDG_EMPLOYEE_ROLES } from "./employee-roles";
export { LEGACY_REPORT_GENERATION_ENABLED, LEGACY_REPORT_GENERATION_BLOCKER } from "./provider-spending";
export { DDG_EMPLOYEE_ROLES, type DdgEmployeeRole, type DdgEmployeeRoleId } from "./employee-roles";

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

/** Compatibility presentation export. NEVER use a role roster to seed accounts. */
export const ORG_CHART = [
  { name: "Markus", role: "Founder", group: "founder" },
  ...DDG_EMPLOYEE_ROLES.map((person) => ({
    name: person.name, role: person.role,
    group: person.id === "person-heimdall-gm" ? "gm" : "corporate",
  })),
] as const;

export const PRINCIPLES = [
  "THINK INDEPENDENTLY.",
  "CHALLENGE EVERYTHING.",
  "EXECUTE APPROVED DECISIONS EXCEPTIONALLY WELL.",
  "WE DO NOT PUNISH MISTAKES. WE PUNISH LYING AND COWARDICE.",
  "OVERALL COMPANY SUCCESS COMES FIRST.",
  "YOU ARE ALLOWED TO THINK BEFORE YOU ARE ALLOWED TO ACT.",
  "HEIMDALL IS THE GM / COO. MARKUS MAKES THE CONSEQUENTIAL DECISIONS. EMPLOYEES EXECUTE APPROVED ACTIONS.",
  "REVENUE BEFORE EXPENDITURE. CREATIVITY BEFORE CAPITAL. FREE BEFORE PAID.",
] as const;

export const PROJECT_TABS = [
  "Overview & Goals",
  "To-do",
  "Customers",
  "Revenue & Subscriptions",
  "Agent Activity",
  "Next Best Action",
] as const;

// Tabs with no data source for a project are hidden rather than shown empty.
const HIDDEN_PROJECT_TABS: Record<string, readonly (typeof PROJECT_TABS)[number][]> = {
  finance: ["Customers"],
  hypest: ["Customers", "Revenue & Subscriptions"],
  "ddg-music": ["Customers", "Revenue & Subscriptions"],
};

export function projectTabsFor(slug: string): (typeof PROJECT_TABS)[number][] {
  const hidden = HIDDEN_PROJECT_TABS[slug] ?? [];
  return PROJECT_TABS.filter((tab) => !hidden.includes(tab));
}

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

// Social audience numbers shown on the Home "Social" row.
export const SOCIAL_PLATFORMS = [
  "instagram",
  "spotify",
  "tiktok",
  "youtube",
  "x",
  "linkedin",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];
export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  spotify: "Spotify",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
  linkedin: "LinkedIn",
};

export { decisionNotificationPayload, type DecisionNotificationSource } from "./decision-notifications";
