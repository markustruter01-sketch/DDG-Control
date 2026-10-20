/** A content fingerprint is not an approval, event sequence or provider identity. */
export type DecisionNotificationSource = {
  id: number; project_id: number; status: string;
  run_id?: number | null; source?: string | null; title?: string | null; recommendation?: string | null;
  cost_estimate_aud?: number | null; risk?: string | null; urgency?: string | null; confidence?: string | null;
  owner_id?: number | null; due_date?: string | null; note?: string | null;
  decided_via?: string | null; task_id?: number | null;
  created_at?: Date | string | null; decided_at?: Date | string | null;
};

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

/** Shared fixed field order keeps browser/server SHA-256 input identical. */
export function decisionNotificationPayload(d: DecisionNotificationSource): string {
  return JSON.stringify([
    "ddg-decision-content-v1", d.id, d.project_id, d.run_id ?? null, d.source ?? null,
    d.title ?? null, d.recommendation ?? null, d.cost_estimate_aud ?? null,
    d.risk ?? null, d.urgency ?? null, d.confidence ?? null, d.owner_id ?? null,
    d.due_date ?? null, d.status, d.note ?? null, d.decided_via ?? null,
    d.task_id ?? null, iso(d.created_at), iso(d.decided_at),
  ]);
}
