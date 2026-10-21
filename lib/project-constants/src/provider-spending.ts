/** Source-locked boundary: no approved third-party model budget.
 * UI settings, environment keys and project ON flags cannot authorize spending.
 * Enabling requires a separately reviewed policy change and explicit owner budget.
 */
export const LEGACY_REPORT_GENERATION_ENABLED: boolean = false;
export const LEGACY_REPORT_GENERATION_BLOCKER =
  'Built-in report generation is paused: third-party model calls have no approved budget. Saved reports remain available.';
