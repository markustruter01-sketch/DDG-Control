import { useState, type FormEvent } from 'react';
import { formatBrisbaneDateTime } from '@/lib/format';

type Item = {
  id: number; project_key: string; status: string; plan_version?: number;
  title: string; objective: string; outcome: string; checklist: string[]; acceptance_checks: string[];
  deadline: string; time_limit_minutes: number; max_attempts: number; spend_limit_cents: number;
  stop_condition: string; attempts: number; started_at: string | null;
  branch: string | null; commit_ref: string | null; review_link: string | null; result: string; acceptance_evidence: string;
  outcome_id: number | null; gate_key: string | null; repository: string | null; target_branch: string | null;
};
type Outcome = { id: number; version: number; status: string; project_key: string; gates: { key: string }[] };
type Event = { id: number; event_type: string; created_at: string; details: Record<string, unknown> };
type Props = { item: Item; outcome?: Outcome; completed: boolean | null; devBypass: boolean; hasDispatch: boolean; events: Event[]; onSaved: () => Promise<unknown> };
type Draft = { context: string; planVersion: number; outcomeId: number; outcomeVersion: number; title: string; objective: string; outcome: string; checklist: string; acceptance: string; deadline: string; minutes: string; attempts: string; stop: string; reason: string; confirmed: boolean };

function localDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
}
function snapshot(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function text(value: unknown) { return typeof value === 'string' || typeof value === 'number' ? String(value) : 'Unknown'; }

/** A revised proposal never approves or starts work. The server rechecks all eligibility. */
export function RejectedPlanRevision({ item, outcome, completed, devBypass, hasDispatch, events, onSaved }: Props) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const history = events.filter((event) => event.event_type === 'rejected_plan_revised');
  const context = JSON.stringify([item, outcome?.id, outcome?.version, outcome?.status]);
  const blocker = devBypass ? 'A real owner sign-in is required. Preview cannot revise plans.'
    : item.project_key === 'finance' ? 'Finance remains held for review.'
    : completed !== false ? 'Project is complete or its control state is unavailable.'
    : item.status !== 'rejected' ? 'Only a rejected proposal can be revised here.'
    : hasDispatch || item.attempts !== 0 || item.started_at || item.branch || item.commit_ref || item.review_link || item.result.trim() || item.acceptance_evidence.trim()
      ? 'Execution or result evidence exists. This action cannot recover or restart that work.'
    : !outcome || outcome.project_key !== item.project_key || !['pending_approval', 'approved'].includes(outcome.status) || !outcome.gates.some((gate) => gate.key === item.gate_key) || !item.repository || !item.target_branch
      ? 'The current outcome, gate and repository binding must be available.'
    : '';
  const stale = draft !== null && draft.context !== context;
  function begin() {
    if (blocker || busy || !outcome) return;
    setFeedback('');
    setDraft({ context, planVersion: item.plan_version ?? 1, outcomeId: outcome.id, outcomeVersion: outcome.version,
      title: item.title, objective: item.objective, outcome: item.outcome, checklist: item.checklist.join('\n'),
      acceptance: item.acceptance_checks.join('\n'), deadline: localDate(item.deadline),
      minutes: String(item.time_limit_minutes), attempts: String(item.max_attempts), stop: item.stop_condition, reason: '', confirmed: false });
  }
  function change(key: keyof Draft, value: string) {
    setDraft((current) => current ? { ...current, [key]: value, confirmed: false } : current);
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!draft || blocker || stale || busy || !draft.confirmed) return;
    const deadline = new Date(draft.deadline);
    if (!Number.isFinite(deadline.getTime()) || deadline.getTime() <= Date.now()) { setFeedback('Choose a future deadline. Your draft is unchanged.'); return; }
    const lines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);
    setBusy(true); setFeedback('');
    let saved = false;
    try {
      const response = await fetch(`/api/work-items/${item.id}/revise-plan`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expected_plan_version: draft.planVersion, expected_outcome_id: draft.outcomeId,
          expected_outcome_version: draft.outcomeVersion, reason: draft.reason,
          plan: { title: draft.title, objective: draft.objective, outcome: draft.outcome,
            checklist: lines(draft.checklist), acceptance_checks: lines(draft.acceptance), deadline: deadline.toISOString(),
            time_limit_minutes: Number(draft.minutes), max_attempts: Number(draft.attempts), spend_limit_cents: 0, stop_condition: draft.stop } }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof body?.error === 'string' ? body.error : 'Save is unconfirmed. Keep this draft and refresh saved history before retrying.');
      if (body?.item?.id !== item.id || body?.item?.plan_version !== draft.planVersion + 1 || body?.item?.status !== 'pending_approval') {
        throw new Error('Save response is unconfirmed. Keep your draft and refresh saved history before retrying.');
      }
      saved = true; setDraft(null);
      setFeedback('Revised plan saved for fresh approval. No worker started.');
      await onSaved();
    } catch (cause) {
      setFeedback(saved ? 'Plan saved, but refreshed records are unavailable. Refresh before another action.'
        : cause instanceof Error ? cause.message : 'Save is unconfirmed. Keep your draft and refresh history before retrying.');
    } finally { setBusy(false); }
  }

  if (item.status !== 'rejected' && history.length === 0 && !draft) return null;
  return <details className="ai-stack-on-demand">
    <summary>Plan revision and loaded history · {history.length}</summary>
    <p className="ai-stack-help">Same task, gate and repository. Revision creates a pending plan version, keeps prior records and requires fresh approval. It never starts work or resets execution attempts. The server also checks unresolved blocking questions.</p>
    {blocker && <p className="ai-stack-help">{blocker}</p>}
    {!draft && item.status === 'rejected' && <button type="button" className="work-toggle" disabled={!!blocker || busy} onClick={begin}>Revise plan for review</button>}
    {draft && <form onSubmit={(event) => void submit(event)}>
      {(stale || blocker) && <p role="alert">The saved context is changed or unavailable. This draft will not be retargeted. Keep it for reference or explicitly discard it and load the current plan.</p>}
      <fieldset disabled={busy} style={{ border: 0, padding: 0, display: 'grid', gap: 8 }}>
        <legend>Proposed plan v{draft.planVersion + 1} · task #{item.id}</legend>
        <label className="task-field">Revision reason<textarea required maxLength={1000} value={draft.reason} onChange={(event) => change('reason', event.target.value)} /></label>
        <label className="task-field">Title<input required maxLength={160} value={draft.title} onChange={(event) => change('title', event.target.value)} /></label>
        <label className="task-field">Objective<textarea required maxLength={1000} value={draft.objective} onChange={(event) => change('objective', event.target.value)} /></label>
        <label className="task-field">Expected result<textarea required maxLength={1000} value={draft.outcome} onChange={(event) => change('outcome', event.target.value)} /></label>
        <label className="task-field">Checklist · one item per line<textarea required value={draft.checklist} onChange={(event) => change('checklist', event.target.value)} /></label>
        <label className="task-field">Acceptance checks · one per line<textarea required value={draft.acceptance} onChange={(event) => change('acceptance', event.target.value)} /></label>
        <label className="task-field">Deadline · your device time<input required type="datetime-local" value={draft.deadline} onChange={(event) => change('deadline', event.target.value)} /></label>
        <label className="task-field">Time limit · minutes<input required type="number" min={5} max={1440} step={1} value={draft.minutes} onChange={(event) => change('minutes', event.target.value)} /></label>
        <label className="task-field">Attempt limit<input required type="number" min={1} max={10} step={1} value={draft.attempts} onChange={(event) => change('attempts', event.target.value)} /></label>
        <label className="task-field">Stop condition<textarea required maxLength={1000} value={draft.stop} onChange={(event) => change('stop', event.target.value)} /></label>
        <p className="ai-stack-help">Spending limit: $0. Outcome #{draft.outcomeId} v{draft.outcomeVersion}; repository and gate stay bound to this task.</p>
        <label><input type="checkbox" checked={draft.confirmed} onChange={(event) => setDraft((current) => current ? { ...current, confirmed: event.target.checked } : current)} /> I reviewed these changes; save for fresh approval only.</label>
        <div className="work-actions">
          <button type="submit" className="work-toggle" disabled={!!blocker || stale || !draft.confirmed}>{busy ? 'Saving…' : 'Save revised proposal'}</button>
          <button type="button" className="work-toggle" onClick={() => { if (window.confirm('Discard this unsaved revision draft?')) { setDraft(null); setFeedback(''); } }}>Discard draft</button>
        </div>
      </fieldset>
    </form>}
    {feedback && <p role="status">{feedback}</p>}
    {history.length > 0 && <details><summary>Loaded revision records · not approvals</summary>
      {history.map((event) => {
        const previous = snapshot(event.details.previous_plan); const proposed = snapshot(event.details.proposed_plan);
        return <article key={event.id}>
          <h4>Plan v{text(previous.plan_version)} → v{text(proposed.plan_version)} · {formatBrisbaneDateTime(event.created_at)}</h4>
          <p>Reason: {text(event.details.reason)}</p>
          {[['Previous proposal', previous], ['Revised proposal', proposed]].map(([label, value]) => {
            const plan = snapshot(value);
            return <details key={String(label)}><summary>{String(label)} · {text(plan.title)}</summary>
              <p>Objective: {text(plan.objective)}</p><p>Expected result: {text(plan.outcome)}</p>
              <p>Deadline: {text(plan.deadline)} · minutes: {text(plan.time_limit_minutes)} · attempts: {text(plan.max_attempts)} · spend cents: {text(plan.spend_limit_cents)}</p>
              <p>Stop: {text(plan.stop_condition)}</p>
              <ul>{[...(Array.isArray(plan.checklist) ? plan.checklist : []), ...(Array.isArray(plan.acceptance_checks) ? plan.acceptance_checks : [])].map((entry, index) => <li key={index}>{text(entry)}</li>)}</ul>
            </details>;
          })}
          <p className="ai-stack-help">Saved revision history is not owner acceptance, independent verification or evidence that work ran.</p>
        </article>;
      })}
    </details>}
  </details>;
}
