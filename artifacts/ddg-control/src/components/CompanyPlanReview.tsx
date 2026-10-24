import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { loadBoard, type Board } from './CompanyWorkBoard';

type Manifest = { version: 1; projects: string[]; outcomes: Array<{ id: number; version: number; project_key: string }>;
  tasks: Array<{ id: number; plan_version: number; project_key: string; outcome_id: number; outcome_version: number; gate_key: string }>;
  dependencies: Array<{ task_id: number; prerequisite_id: number }> };
type Evaluation = { digest: string; mode?: string; references_current: boolean; declared_scope_has_goals: boolean; tasks: Array<{ task_id: number; blocked_by: number[] }> };
type Proposal = { id: number; digest: string; manifest: Manifest; evaluation: Evaluation };
type Review = { enabled: boolean; head_id: number | null; proposal: Proposal | null; active: (Proposal & { acceptance_id: number }) | null };
type Command = { path: 'propose' | 'accept' | 'withdraw'; expectedDigest: string; body: Record<string, unknown> };
const keys = ['finance', 'hypest', 'cattle-dog-coffee', 'ddg-control-ai-stack'];
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const integer = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v > 0;
const digest = (v: unknown) => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
function validManifest(v: unknown): v is Manifest {
  return record(v) && v.version === 1 && Array.isArray(v.projects) && v.projects.length > 0 && v.projects.length <= 4 &&
    v.projects.every(p => typeof p === 'string' && keys.includes(p)) && Array.isArray(v.outcomes) && v.outcomes.length <= 100 &&
    v.outcomes.every(o => record(o) && integer(o.id) && integer(o.version) && typeof o.project_key === 'string' && keys.includes(o.project_key)) &&
    Array.isArray(v.tasks) && v.tasks.length <= 200 && v.tasks.every(t => record(t) && integer(t.id) && integer(t.plan_version) &&
      typeof t.project_key === 'string' && keys.includes(t.project_key) && integer(t.outcome_id) && integer(t.outcome_version) &&
      typeof t.gate_key === 'string' && t.gate_key.length > 0 && t.gate_key.length <= 120) &&
    Array.isArray(v.dependencies) && v.dependencies.length <= 400 && v.dependencies.every(e => record(e) && integer(e.task_id) && integer(e.prerequisite_id));
}
function validEvaluation(v: unknown): v is Evaluation {
  return record(v) && digest(v.digest) && v.accepted === false && v.execution_authorized === false && typeof v.references_current === 'boolean' &&
    typeof v.declared_scope_has_goals === 'boolean' && Array.isArray(v.tasks) && v.tasks.length <= 200 &&
    v.tasks.every(t => record(t) && integer(t.task_id) && Array.isArray(t.blocked_by) && t.blocked_by.length <= 200 && t.blocked_by.every(integer));
}
const validProposal = (v: unknown): v is Proposal => record(v) && integer(v.id) && digest(v.digest) && validManifest(v.manifest) &&
  validEvaluation(v.evaluation) && v.evaluation.digest === v.digest;
async function loadReview(): Promise<Review> {
  const response = await fetch('/api/company/plan/review', { cache: 'no-store' });
  if (!response.ok) throw new Error([401, 403].includes(response.status) ? 'Sign in as the owner to review plans.' : 'Saved plan review is unavailable.');
  const v: unknown = await response.json();
  if (!record(v) || v.version !== 1 || typeof v.enabled !== 'boolean' || v.execution_authorized !== false ||
      !(v.head_id === null || integer(v.head_id)) || !(v.proposal === null || validProposal(v.proposal)) ||
      !(v.active === null || (validProposal(v.active) && 'acceptance_id' in v.active && integer(v.active.acceptance_id))) ||
      (!v.enabled && (v.head_id !== null || v.proposal !== null || v.active !== null)) ||
      (v.enabled && v.snapshot_consistent !== true)) throw new Error('Plan review could not be read safely.');
  return v as Review;
}
function draftManifest(board: Board | undefined, selected: number[], edges: Manifest['dependencies']): Manifest | null {
  if (!board || board.truncated || selected.length === 0) return null;
  const tasks: Manifest['tasks'] = [], outcomes: Manifest['outcomes'] = [];
  for (const id of selected) {
    const project = board.projects.find(p => p.items.some(t => t.id === id));
    const task = project?.items.find(t => t.id === id), outcome = project?.outcomes.find(o => o.id === task?.outcome_id);
    if (!task || !outcome || !task.gate_key) return null;
    tasks.push({ id, plan_version: task.plan_version, project_key: project!.key,
      outcome_id: outcome.id, outcome_version: outcome.version, gate_key: task.gate_key });
    if (!outcomes.some(o => o.id === outcome.id)) outcomes.push({ id: outcome.id, version: outcome.version, project_key: project!.key });
  }
  return { version: 1, projects: keys.filter(k => tasks.some(t => t.project_key === k)), outcomes: outcomes.sort((a, b) => a.id - b.id),
    tasks: tasks.sort((a, b) => a.id - b.id), dependencies: edges };
}
function ManifestView({ manifest }: { manifest: Manifest }) {
  return <><p>Projects: {manifest.projects.join(', ')}</p><p>Outcomes included:</p><ul>{manifest.outcomes.map(o =>
    <li key={o.id}>{o.project_key}: outcome #{o.id} v{o.version}</li>)}</ul><p>Tasks included:</p><ul>{manifest.tasks.map(t => <li key={t.id}>
    <Link href={`/ai-stack#work-item-${t.id}`}>Task #{t.id}</Link> · {t.project_key} · plan v{t.plan_version} · outcome #{t.outcome_id} v{t.outcome_version} · gate {t.gate_key}
  </li>)}</ul><p>Dependencies (task waits for prerequisite):</p>{manifest.dependencies.length ? <ul>{manifest.dependencies.map(e =>
    <li key={`${e.task_id}:${e.prerequisite_id}`}>Task #{e.task_id} waits for task #{e.prerequisite_id}</li>)}</ul> : <p>No dependency is declared.</p>}</>;
}

export function CompanyPlanReview() {
  const [open, setOpen] = useState(false), [selected, setSelected] = useState<number[]>([]);
  const [edges, setEdges] = useState<Manifest['dependencies']>([]), [task, setTask] = useState(''), [prerequisite, setPrerequisite] = useState('');
  const [preview, setPreview] = useState<{ fingerprint: string; digest: string; evaluation: Evaluation } | null>(null);
  const [reviewed, setReviewed] = useState(''), [pending, setPending] = useState<Command | null>(null);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  const query = useQuery({ queryKey: ['company-plan-review'], queryFn: loadReview, enabled: open, retry: false, refetchOnWindowFocus: false, staleTime: 30_000 });
  const board = useQuery({ queryKey: ['company-work-board'], queryFn: loadBoard, enabled: open && query.data?.enabled === true,
    retry: false, refetchOnWindowFocus: false, staleTime: 30_000 });
  const manifest = draftManifest(board.data, selected, edges), fingerprint = manifest ? JSON.stringify(manifest) : '';
  const frozen = busy || pending !== null || query.isFetching || query.isError;
  const refresh = async () => { setReviewed(''); setPreview(null); await Promise.all([query.refetch(), ...(query.data?.enabled ? [board.refetch()] : [])]); };
  const send = async (command: Command) => {
    setPending(command); setBusy(true); setMessage('Saving this exact reviewed action…');
    try {
      const response = await fetch(`/api/company/plan/${command.path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(command.body) });
      if (!response.ok) {
        if (response.status >= 500) throw new Error('uncertain');
        setPending(null); setMessage(response.status === 409 ? 'The reviewed plan changed or conflicts. Refresh and review again.' : 'The action was refused. No approval is shown here.');
        setReviewed(''); await query.refetch(); return;
      }
      const v: unknown = await response.json();
      if (!record(v) || v.execution_authorized !== false || !record(v.revision) || !integer(v.revision.id) ||
          v.revision.request_id !== command.body.request_id || v.revision.digest !== command.expectedDigest ||
          v.revision.target_revision_id !== (command.path === 'propose' ? null : command.body.target_revision_id) ||
          v.revision.kind !== ({ propose: 'proposed', accept: 'accepted', withdraw: 'withdrawn' }[command.path])) throw new Error('uncertain');
      setPending(null); setMessage('Saved owner record. No worker started.'); await refresh();
    } catch { setMessage('Save result is uncertain. Retry the same action below; do not create a replacement request. After reloading, review saved records before acting again.'); }
    finally { setBusy(false); }
  };
  const action = (path: Command['path'], fields: Record<string, unknown>) => {
    if (frozen || !query.data?.enabled) return;
    if (!globalThis.crypto?.randomUUID) { setMessage('Secure request IDs are unavailable in this browser. Use the approved HTTPS or localhost dashboard.'); return; }
    const expectedDigest = path === 'propose' ? preview?.digest : fields.digest;
    if (typeof expectedDigest !== 'string' || !digest(expectedDigest)) return;
    void send({ path, expectedDigest, body: { request_id: crypto.randomUUID(), expected_head_id: query.data.head_id, ...fields } });
  };
  const inspect = async () => {
    if (!manifest || frozen) return;
    setBusy(true); setPreview(null);
    try {
      const response = await fetch('/api/company/plan/preview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: fingerprint });
      const v: unknown = response.ok ? await response.json() : null;
      if (!validEvaluation(v) || !record(v) || !digest(v.digest) || v.mode !== 'unaccepted_preview') throw new Error('invalid');
      setPreview({ fingerprint, digest: v.digest as string, evaluation: v }); setMessage('Checked saved references. This is an unsaved preview, not permission to work.');
    } catch { setMessage('Preview failed. Review the task references and dependency graph.'); }
    finally { setBusy(false); }
  };
  return <details className="cm-accessible-list" onToggle={event => setOpen(event.currentTarget.open)}><summary>Company plan · owner review</summary>
    {open && <div><p>Plan approval is separate from task approval, work ON and permission to run an agent. Viewing starts no work.</p>
      <button type="button" disabled={busy || pending !== null || query.isFetching} onClick={() => void refresh()}>Refresh review</button>
      {query.isLoading && <p role="status">Loading plan review…</p>}
      {query.isError ? <p role="alert">{query.error instanceof Error ? query.error.message : 'Plan review is unavailable.'}</p> : query.data &&
        (!query.data.enabled ? <p>Saved plan changes are disabled until database rollout and safety review are approved.</p> : <>
          <p>Reviewed history head: {query.data.head_id ?? 'none'}. Records can change; saving rechecks the exact versions.</p>
          {query.data.active ? <section><h3>Saved plan acceptance #{query.data.active.acceptance_id}</h3>
            <p>Proposal #{query.data.active.id} · digest {query.data.active.digest}</p><ManifestView manifest={query.data.active.manifest} />
            <p>{query.data.active.evaluation.references_current ? 'References match saved records. This is not execution readiness.' : 'References changed or are missing. This acceptance cannot authorise new work.'}</p>
            <label><input type="checkbox" disabled={frozen} checked={reviewed === `withdraw:${query.data.active.acceptance_id}:${query.data.head_id}`} onChange={e => setReviewed(e.target.checked ? `withdraw:${query.data!.active!.acceptance_id}:${query.data!.head_id}` : '')} /> I reviewed this exact plan for withdrawal. This does not cancel an existing provider run.</label>
            <button type="button" disabled={frozen || reviewed !== `withdraw:${query.data.active.acceptance_id}:${query.data.head_id}`} onClick={() => action('withdraw', { target_revision_id: query.data!.active!.acceptance_id, digest: query.data!.active!.digest })}>Withdraw this acceptance</button>
          </section> : <p>No currently accepted plan is recorded.</p>}
          {query.data.proposal && <section><h3>Latest saved proposal #{query.data.proposal.id}</h3>
            <p>Digest: {query.data.proposal.digest}</p><ManifestView manifest={query.data.proposal.manifest} />
            <p>{query.data.proposal.evaluation.references_current ? 'References match saved records.' : 'References changed or are missing.'} Unfinished prerequisites still block individual work.</p>
            <ul>{query.data.proposal.evaluation.tasks.filter(t => t.blocked_by.length > 0).map(t => <li key={t.task_id}>Task #{t.task_id} still waits for: {t.blocked_by.map(id => `#${id}`).join(', ')}</li>)}</ul>
            <label><input type="checkbox" disabled={frozen || query.data.active !== null} checked={reviewed === `accept:${query.data.proposal.id}:${query.data.head_id}`} onChange={e => setReviewed(e.target.checked ? `accept:${query.data!.proposal!.id}:${query.data!.head_id}` : '')} /> I reviewed these exact task versions, linked task details and dependencies.</label>
            <button type="button" disabled={frozen || query.data.active !== null || !query.data.proposal.evaluation.references_current || !query.data.proposal.evaluation.declared_scope_has_goals || reviewed !== `accept:${query.data.proposal.id}:${query.data.head_id}`} onClick={() => action('accept', { target_revision_id: query.data!.proposal!.id, digest: query.data!.proposal!.digest })}>Accept this plan only</button>
          </section>}
          <section><h3>Prepare a new proposal</h3><p>Select existing tasks, including their prerequisites. This copies references only.</p>
            {board.isError && <p role="alert">Saved task references are unavailable.</p>}{board.data?.truncated && <p>Task inventory is partial. A proposal cannot be prepared from this view.</p>}
            <fieldset disabled={frozen || board.isFetching || !board.data || board.data.truncated}><legend>Tasks to include</legend>
              {board.data?.projects.flatMap(p => p.items.map(t => <label key={t.id}><input type="checkbox" checked={selected.includes(t.id)} disabled={t.outcome_id === null || !t.gate_key} onChange={e => {
                setSelected(e.target.checked ? [...selected, t.id] : selected.filter(id => id !== t.id)); setEdges(edges.filter(edge => edge.task_id !== t.id && edge.prerequisite_id !== t.id)); setPreview(null);
              }} />{p.key}: {t.title} · plan v{t.plan_version}</label>))}
              <label>Task <select value={task} onChange={e => setTask(e.target.value)}><option value="">Choose</option>{selected.map(id => <option key={id} value={id}>Task #{id}</option>)}</select></label>
              <label>Waits for <select value={prerequisite} onChange={e => setPrerequisite(e.target.value)}><option value="">Choose prerequisite</option>{selected.map(id => <option key={id} value={id}>Task #{id}</option>)}</select></label>
              <button type="button" disabled={!task || !prerequisite || task === prerequisite || edges.length >= 400} onClick={() => { if (selected.includes(Number(task)) && selected.includes(Number(prerequisite)) && !edges.some(e => e.task_id === Number(task) && e.prerequisite_id === Number(prerequisite))) setEdges([...edges, { task_id: Number(task), prerequisite_id: Number(prerequisite) }]); setPreview(null); }}>Add dependency</button>
              {edges.map(edge => <p key={`${edge.task_id}:${edge.prerequisite_id}`}>#{edge.task_id} waits for #{edge.prerequisite_id} <button type="button" onClick={() => { setEdges(edges.filter(e => e !== edge)); setPreview(null); }}>Remove</button></p>)}
            </fieldset>
            {manifest && <ManifestView manifest={manifest} />}<button type="button" disabled={frozen || !manifest} onClick={() => void inspect()}>Check proposed references</button>
            <button type="button" disabled={frozen || !manifest || preview?.fingerprint !== fingerprint || !preview.evaluation.references_current || !preview.evaluation.declared_scope_has_goals} onClick={() => action('propose', { manifest })}>Save as unapproved proposal</button>
          </section>
        </>)}
      {message && <p role="status">{message}</p>}{pending && <button type="button" disabled={busy} onClick={() => void send(pending)}>Retry the same save request</button>}
    </div>}
  </details>;
}
