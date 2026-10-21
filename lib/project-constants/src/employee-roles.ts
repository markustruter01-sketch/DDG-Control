/**
 * Owner-confirmed company roles,20October2026.
 * Presentation only: these IDs are existing Company Map identities,
 * not database member IDs, accounts, credentials or worker permissions.
 */
export const DDG_EMPLOYEE_ROLES = [
  {"id":"person-heimdall-gm","name":"Heimdall","role":"GM / COO"},
  {"id":"person-freya","name":"Freya","role":"Marketing"},
  {"id":"person-tyr","name":"Tyr","role":"Project Manager"},
  {"id":"person-plutus","name":"Plutus","role":"Finance / Analytics"},
  {"id":"person-hermes","name":"Hermes","role":"Operations"},
  {"id":"person-mimir","name":"Mimir","role":"Chief Scientist / Skeptic"},
  {"id":"person-daedalus","name":"Daedalus","role":"R&D / Invention"},
  {"id":"person-harald","name":"Harald","role":"Chief of Staff"},
  {"id":"person-njord","name":"Njord","role":"Ventures"},
] as const;

export type DdgEmployeeRole = (typeof DDG_EMPLOYEE_ROLES)[number];
export type DdgEmployeeRoleId = DdgEmployeeRole["id"];
