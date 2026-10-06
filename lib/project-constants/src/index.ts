export const PROJECT_STATUSES = ["unset", "active", "building", "paused"] as const;

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
