import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import { DevAuthBypassContext, Header } from "@/components/header";
import FleetDesk from "@/components/FleetDesk";
import { DeliveryPlan } from "@/components/DeliveryPlan";
import { WorkLedger } from "@/components/WorkLedger";
import { RejectedPlanRevision } from "@/components/RejectedPlanRevision";
import { writeHandoverPacket, type HandoverPacketRecord } from "@/lib/handover-packet";
import { Link } from "wouter";

type CursorAgent = {
  id: string;
  name: string;
  agentStatus: string;
  runStatus: string | null;
  updatedAt: string | null;
  repositories: string[];
  result: string | null;
  branches: Array<{
    repository: string;
    branch: string | null;
    pullRequest: string | null;
  }>;
  totalTokens: number | null;
  tokenUsage: {
    inputTokens: number;
    outputTokens: number;
    cacheReadTokens: number;
    cacheWriteTokens: number;
    totalTokens: number;
  } | null;
  agentUrl: string | null;
  note: string | null;
};

type CursorAgentsResponse = {
  status: "connected" | "not_configured";
  checkedAt: string | null;
  agents: CursorAgent[];
};

async function loadCursorAgents(): Promise<CursorAgentsResponse> {
  const response = await fetch("/api/cursor/cloud-agents", {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Cursor agent status is unavailable.");
  return response.json() as Promise<CursorAgentsResponse>;
}

const projectNames = [
  "DDG Finance", "DDG - Fitness / Hypest", "DDG Coffee / Cattle Dog Coffee",
  "DDG Control AI Stack", "DDG Music · undecided",
];
const managedAreas = [
  { key: "finance", label: "DDG Finance" },
  { key: "hypest", label: "DDG - Fitness / Hypest" },
  { key: "cattle-dog-coffee", label: "DDG Coffee / Cattle Dog Coffee" },
  { key: "ddg-control-ai-stack", label: "DDG Control AI Stack" },
];
type Control = { project_key: string; enabled: boolean; completed: boolean; updated_at: string };
async function getWorkControls() {
  const r = await fetch("/api/work-controls", { cache: "no-store" });
  if (!r.ok) throw new Error("Work controls unavailable");
  return r.json() as Promise<{ controls: Control[]; audit: Array<{ id: number; project_key: string; enabled: boolean; created_at: string }> }>;
}

type WorkBlockResult = {
  dashboard_work_blocked: boolean;
  affected_task_records: number;
  unresolved_dispatches: Array<{ id: number; work_item_id: number; project_key: string; agent_id: string | null; run_id: string | null; status: string }>;
  message: string;
};
async function blockAllDashboardWork(): Promise<WorkBlockResult> {
  const response = await fetch("/api/work-stop", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "block_all_managed_work" }),
  });
  if (!response.ok) throw new Error("Could not confirm blocking dashboard work. Refresh the saved controls before retrying.");
  return response.json() as Promise<WorkBlockResult>;
}
async function saveWorkControl(input: { key: string; enabled: boolean }) {
  const r = await fetch(`/api/work-controls/${encodeURIComponent(input.key)}`, {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled: input.enabled }),
  });
  if (!r.ok) throw new Error((await r.json().catch(() => null))?.error ?? "Could not save work control");
  return r.json();
}
async function completeProject(key:string) {
  const r=await fetch(`/api/work-controls/${encodeURIComponent(key)}/complete`,{method:"POST"});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Could not complete project");
  return r.json();
}
async function getHandovers() {
  const r = await fetch("/api/work-handovers", { cache: "no-store" });
  if (!r.ok) throw new Error("Handovers unavailable");
  return r.json() as Promise<HandoverPacketRecord[]>;
}
async function getHandoverEvents() {
  const r=await fetch("/api/work-handover-events",{cache:"no-store"});
  if(!r.ok) throw new Error("Checkpoint history unavailable");
  return r.json() as Promise<Array<{id:number;checkpoint_id:number;event_type:string;created_at:string}>>;
}
async function saveHandover(data: Record<string, unknown>) {
  const r = await fetch("/api/work-handovers", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(data) });
  if (!r.ok) throw new Error((await r.json().catch(()=>null))?.error ?? "Could not save checkpoint");
  return r.json();
}
async function resumeHandover(id:number) {
  const r=await fetch(`/api/work-handovers/${id}/resume`,{method:"POST"});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Checkpoint cannot be resumed");
  return r.json();
}
type WorkItem = { id:number; project_key:string; title:string; objective:string; outcome:string; checklist:string[]; acceptance_checks:string[]; acceptance_evidence:string; result:string; deadline:string; time_limit_minutes:number; max_attempts:number; attempts:number; started_at:string|null; spend_limit_cents:number; stop_condition:string; status:string; plan_version?:number; branch:string|null; commit_ref:string|null; review_link:string|null; outcome_id:number|null; gate_key:string|null; repository:string|null; target_branch:string|null; dispatch_state:string; dispatch_block_reason:string };
async function getWorkItems() {
  const r = await fetch("/api/work-items", { cache:"no-store" });
  if (!r.ok) throw new Error("Work queue unavailable");
  return r.json() as Promise<{items:WorkItem[];dispatches:Array<{id:number;work_item_id:number;provider:string;model_id:string|null;agent_id:string|null;run_id:string|null;provider_status:string|null;status:string;branch:string|null;error_summary:string;started_at:string}>;events:Array<{id:number;work_item_id:number;actor:string;event_type:string;created_at:string;details:Record<string,unknown>}>}>;
}
type WorkOutcome = { id:number; project_key:string; title:string; description:string; status:string; version:number; gates:Array<{key:string;title:string;acceptance:string[]}> };
function emptyWorkDraft(project_key = "hypest") {
  return { project_key, title:"", objective:"", outcome:"", checklist:"", acceptance_checks:"", deadline:"", time_limit_minutes:"30", max_attempts:"1", stop_condition:"Stop when any acceptance check fails or the limit is reached.", outcome_id:"", gate_key:"", repository:"", target_branch:"" };
}
async function getWorkOutcomes() {
  const r=await fetch("/api/work-outcomes",{cache:"no-store"});
  if(!r.ok) throw new Error("Outcome record unavailable");
  return r.json() as Promise<{outcomes:WorkOutcome[];events:Array<{id:number;outcome_id:number;event_type:string;created_at:string}>}>;
}
async function getWorkReadiness() {
  const r=await fetch("/api/work-readiness",{cache:"no-store"});
  if(!r.ok) throw new Error("Worker readiness unavailable");
  return r.json() as Promise<{dispatch_enabled:boolean;manual_dispatch_ready:boolean;automatic_pickup:boolean;status:string;blockers:string[];background_worker_blocker:string;finance_hold:string;local_limits:string;secret_present:boolean;config:{enabled:boolean;plan_model_confirmed:boolean;included_allowance_confirmed:boolean;no_overage_confirmed:boolean;github_access_confirmed:boolean;secret_owner_verified:boolean;selected_model_id:string|null;approved_repository:string|null;approved_starting_branch:string|null;approved_project_key:string|null;updated_at:string|null}}>;
}
async function saveDispatchConfig(data:Record<string,unknown>) {
  const r=await fetch("/api/work-dispatch-config",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Could not save dispatch readiness");
  return r.json();
}
async function approveOutcome(input:{id:number;expected_version:number}) {
  const r=await fetch(`/api/work-outcomes/${input.id}/approve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({expected_version:input.expected_version})});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Outcome approval failed");
  return r.json();
}
async function dispatchWorkItem(id:number) {
  const r=await fetch(`/api/work-items/${id}/dispatch`,{method:"POST"});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Dispatch is blocked");
  return r.json();
}
type SavedReport={project_slug:string;summary:string;next_action:string;priority:string|null;status_light:string};
async function getSavedReports(){
  const r=await fetch("/api/agent-updates/latest",{cache:"no-store"});
  if(!r.ok) throw new Error("Saved Heimdall reports unavailable");
  return r.json() as Promise<SavedReport[]>;
}
type FleetMessageInput = { project_key:string; work_item_id:number|null; plan_version:number|null; outcome_version:number|null; body:string; kind:"draft"|"note"; client_request_id:string };
async function getFleetThread(projectKey:string, taskId:number|null) {
  const params=new URLSearchParams({project_key:projectKey});
  if(taskId!==null) params.set("work_item_id",String(taskId));
  const r=await fetch(`/api/fleet/thread?${params}`,{cache:"no-store"});
  if(!r.ok) throw new Error("Fleet Desk history unavailable");
  return r.json();
}
async function saveFleetMessage(input:FleetMessageInput) {
  const r=await fetch("/api/fleet/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Could not save dashboard item");
  return r.json();
}
async function createFleetQuestion(input:Record<string,unknown>) {
  const r=await fetch("/api/fleet/questions",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Could not save owner question");
  return r.json();
}
async function answerFleetQuestion(input:{question_id:number;question_version:number;task_plan_version:number|null;outcome_version:number|null;selected_option:string;comment:string}) {
  const {question_id,...body}=input;
  const r=await fetch(`/api/fleet/questions/${question_id}/answers`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error??"Could not record owner answer");
  return r.json();
}
async function createWorkItem(data: Record<string, unknown>) {
  const r = await fetch("/api/work-items", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  if (!r.ok) throw new Error((await r.json().catch(()=>null))?.error ?? "Could not queue work");
  return r.json();
}
async function approveWorkItem(input:{id:number;expected_plan_version:number;expected_outcome_version:number}) {
  const { id, ...versions } = input;
  const r=await fetch(`/api/work-items/${id}/approve`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(versions)});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error ?? "Approval failed");
  return r.json();
}
async function moveWorkItem(input:{id:number;status:string;acceptance_evidence?:string}) {
  const r=await fetch(`/api/work-items/${input.id}/status`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});
  if(!r.ok) throw new Error((await r.json().catch(()=>null))?.error ?? "Status change failed");
  return r.json();
}

type DetailView = "work" | "usage" | "safety" | null;

function runLabel(agent: CursorAgent): string {
  const status = agent.runStatus?.toUpperCase();
  if (status === "RUNNING" || status === "CREATING") return "Working now";
  if (status === "FINISHED") return "Finished · review result";
  if (status === "ERROR") return "Error · review needed";
  if (status === "CANCELLED") return "Stopped · cancelled";
  if (status === "EXPIRED") return "Stopped · expired";
  return agent.agentStatus.toUpperCase() === "ARCHIVED"
    ? "Archived"
    : "Idle · no active run";
}

function shortRepository(url: string): string {
  return url.replace(/^https:\/\//, "").replace(/\.git$/, "");
}

function tokenLabel(value: number | null): string {
  if (value === null) return "Not available";
  return new Intl.NumberFormat("en-AU", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function DetailDialog({
  view,
  agents,
  checkedAt,
  onClose,
}: {
  view: DetailView;
  agents: CursorAgent[];
  checkedAt: string | null;
  onClose: () => void;
}) {
  if (!view) return null;

  const tokenTotals = agents.reduce(
    (totals, agent) => {
      const usage = agent.tokenUsage;
      if (!usage) return totals;
      totals.inputTokens += usage.inputTokens;
      totals.outputTokens += usage.outputTokens;
      totals.cacheReadTokens += usage.cacheReadTokens;
      totals.cacheWriteTokens += usage.cacheWriteTokens;
      totals.totalTokens += usage.totalTokens;
      return totals;
    },
    {
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      totalTokens: 0,
    },
  );

  const headings = {
    work: [
      "Work details",
      "Cursor Cloud Agent runs and the information Cursor returns.",
    ],
    usage: ["Usage details", "Latest run token counts returned by Cursor."],
    safety: [
      "Safety details",
      "What this page can do, what it can see, and what it cannot confirm.",
    ],
  } as const;

  return (
    <div
      className="ai-stack-dialog-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="ai-stack-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-stack-dialog-title"
      >
        <header className="ai-stack-dialog-heading">
          <div>
            <p className="eyebrow">AI Stack details</p>
            <h2 id="ai-stack-dialog-title">{headings[view][0]}</h2>
            <p>{headings[view][1]}</p>
          </div>
          <button
            className="ai-stack-dialog-close"
            type="button"
            onClick={onClose}
            aria-label="Close details"
          >
            ×
          </button>
        </header>

        {view === "work" && (
          <div className="ai-stack-dialog-content">
            <div className="ai-stack-detail-callout">
              Cursor returns the agent name, run state, repository, final
              result, and any pushed branch or pull request. It does not tell
              this page which model was used or whether an active run is waiting
              for you.
            </div>
            {agents.length ? (
              <div className="ai-stack-detail-agent-list">
                {agents.map((agent) => (
                  <article className="ai-stack-detail-agent" key={agent.id}>
                    <div className="ai-stack-agent-top">
                      <strong>{agent.name}</strong>
                      <span
                        className={`ai-stack-run-pill ${agent.runStatus?.toLowerCase() ?? "idle"}`}
                      >
                        {runLabel(agent)}
                      </span>
                    </div>
                    <p className="ai-stack-repo">
                      {agent.repositories.length
                        ? agent.repositories.map(shortRepository).join(" · ")
                        : "Repository not reported"}
                    </p>
                    <details className="ai-stack-result-disclosure">
                      <summary>Open full Cursor result</summary>
                      <div className="ai-stack-detail-result">
                        {agent.note ?? agent.result ?? "No final result yet. Cursor has not returned a final handover for this run."}
                      </div>
                    </details>
                    <div className="ai-stack-detail-links">
                      {agent.branches.map((branch) => (
                        <span
                          key={`${branch.repository}-${branch.branch ?? "branch"}`}
                        >
                          {branch.branch
                            ? `Branch: ${branch.branch}`
                            : branch.repository}
                          {branch.pullRequest && (
                            <a
                              href={branch.pullRequest}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open pull request ↗
                            </a>
                          )}
                        </span>
                      ))}
                      {agent.agentUrl && (
                        <a
                          href={agent.agentUrl}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open agent in Cursor ↗
                        </a>
                      )}
                      <small>
                        {agent.updatedAt
                          ? `Updated ${new Date(agent.updatedAt).toLocaleString("en-AU", { dateStyle: "medium", timeStyle: "short" })}`
                          : "Update time not returned"}
                      </small>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="ai-stack-empty">
                No Cursor Cloud Agent records are available.
              </p>
            )}
          </div>
        )}

        {view === "usage" && (
          <div className="ai-stack-dialog-content">
            <div className="ai-stack-detail-callout">
              These figures cover only the latest Cursor runs shown below. They
              are token counts, not dollars, plan limits, or remaining
              allowance. Other AI providers are not connected to this usage
              view.
            </div>
            <div className="ai-stack-usage-totals">
              {(
                [
                  ["Input", tokenTotals.inputTokens],
                  ["Output", tokenTotals.outputTokens],
                  ["Cache read", tokenTotals.cacheReadTokens],
                  ["Cache written", tokenTotals.cacheWriteTokens],
                  ["Total", tokenTotals.totalTokens],
                ] as const
              ).map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{tokenLabel(value)}</strong>
                </div>
              ))}
            </div>
            <div className="ai-stack-table-wrap">
              <table className="ai-stack-usage-table">
                <thead>
                  <tr>
                    <th>Agent</th>
                    <th>Input</th>
                    <th>Output</th>
                    <th>Cache read</th>
                    <th>Cache written</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent.id}>
                      <th scope="row">{agent.name}</th>
                      <td>
                        {tokenLabel(agent.tokenUsage?.inputTokens ?? null)}
                      </td>
                      <td>
                        {tokenLabel(agent.tokenUsage?.outputTokens ?? null)}
                      </td>
                      <td>
                        {tokenLabel(agent.tokenUsage?.cacheReadTokens ?? null)}
                      </td>
                      <td>
                        {tokenLabel(agent.tokenUsage?.cacheWriteTokens ?? null)}
                      </td>
                      <td>
                        {tokenLabel(agent.tokenUsage?.totalTokens ?? null)}
                      </td>
                    </tr>
                  ))}
                  {!agents.length && (
                    <tr>
                      <td colSpan={6}>No run usage returned yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="ai-stack-chart-caption">
              Cursor’s per-run usage can include related task agents and side
              chats. Snapshot checked{" "}
              {checkedAt
                ? new Date(checkedAt).toLocaleString("en-AU", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "time not available"}
              .
            </p>
          </div>
        )}

        {view === "safety" && (
          <div className="ai-stack-dialog-content">
            <div className="ai-stack-safety-detail-grid">
              <article>
                <span className="ai-stack-check">✓</span>
                <div>
                  <h3>No agent controls</h3>
                  <p>
                    This dashboard only makes Cursor read requests. It cannot
                    start, stop, edit, or cancel a run.
                  </p>
                </div>
              </article>
              <article>
                <span className="ai-stack-check">✓</span>
                <div>
                  <h3>Key stays server-side</h3>
                  <p>
                    The Cursor key is read by the protected API route. It is not
                    sent to the browser or shown on the page.
                  </p>
                </div>
              </article>
              <article>
                <span className="ai-stack-check">✓</span>
                <div>
                  <h3>Human review stays required</h3>
                  <p>
                    Check completed code and any branch or pull request before
                    merging. This page never merges or deploys project code.
                  </p>
                </div>
              </article>
              <article>
                <span className="ai-stack-check ai-stack-check-info">i</span>
                <div>
                  <h3>Wait state is unknown</h3>
                  <p>
                    Cursor’s status data does not give us a clear “waiting for
                    Markus” signal. An error or finished run is shown for
                    review, not treated as proof that you were asked a question.
                  </p>
                </div>
              </article>
              <article>
                <span className="ai-stack-check ai-stack-check-info">i</span>
                <div>
                  <h3>Usage limits are unknown</h3>
                  <p>
                    Token totals do not reveal included plan usage, remaining
                    quota, or cost. Do not use them to switch models or claim
                    that a run is free.
                  </p>
                </div>
              </article>
              <article>
                <span className="ai-stack-check ai-stack-check-info">i</span>
                <div>
                  <h3>No automatic rotation</h3>
                  <p>
                    The provider order is a plan only. This page does not run a
                    24/7 loop or move work between providers.
                  </p>
                </div>
              </article>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}



function savedWorkFragment(): string | null {
  const fragment = window.location.hash.slice(1);
  if (fragment === "work-queue-heading" || fragment === "work-item-creator") return fragment;
  const match = /^work-item-([1-9]\d*)$/.exec(fragment);
  return match && Number.isSafeInteger(Number(match[1])) && Number(match[1]) <= 2147483647 ? fragment : null;
}

function revealSavedWork(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  let ancestor = target.parentElement;
  while (ancestor) {
    if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
    ancestor = ancestor.parentElement;
  }
  target.tabIndex = -1;
  target.scrollIntoView({ behavior: "auto", block: "center" });
  target.focus({ preventScroll: true });
}

function CompanyWorkOverview({ items, controls, loading, failed, onRetry }: {
  items: WorkItem[];
  controls: Control[];
  loading: boolean;
  failed: boolean;
  onRetry: () => void;
}) {
  const completed = items.filter((item) => item.status === "completed").length;
  const awaiting = items.filter((item) => item.status === "pending_approval" || item.status === "needs_owner").length;
  return (
    <details className="ai-stack-cockpit-category company-work-overview">
      <summary><strong>Company work board</strong><small>{loading ? "Loading saved work…" : failed ? "Unavailable" : `${items.length} task records · ${awaiting} need review`}</small></summary>
      <p className="ai-stack-help">One view of the existing saved tasks. Task counts are not project completion, approval, or proof an agent is running.</p>
      {loading ? <p role="status">Loading work records…</p> : failed ? <div role="alert"><p>Work records unavailable. No empty or complete state is assumed.</p><button type="button" className="work-toggle" onClick={onRetry}>Retry</button></div> : (
        <>
          <div className="company-work-totals"><span><strong>{items.length}</strong> saved tasks</span><span><strong>{completed}</strong> recorded complete</span><span><strong>{awaiting}</strong> owner review</span></div>
          <div className="company-work-grid">{managedAreas.map((area) => {
            const savedControl = controls.find((control) => control.project_key === area.key);
            const tasks = items.filter((item) => item.project_key === area.key);
            return <section className="company-work-project" key={area.key}>
              <header><h3>{area.label}</h3><span>{area.key === "finance" ? "HELD · Claude review" : !savedControl ? "Control unknown" : savedControl.completed ? "Recorded complete" : savedControl.enabled ? "Work ON" : "Work OFF"}</span></header>
              {tasks.length === 0 ? <p>No saved tasks. This does not mean the project is finished.</p> : <ul>{tasks.map((task) => (
                <li key={task.id}><a href={`#work-item-${task.id}`} onClick={() => revealSavedWork(`work-item-${task.id}`)}><strong>{task.title}</strong><span>{task.status.replaceAll("_", " ")}</span></a>
                  {task.dispatch_block_reason && <small>{task.dispatch_block_reason}</small>}
                </li>
              ))}</ul>}
              <a href="#work-controls-heading" onClick={() => revealSavedWork("work-controls-heading")}>View project controls →</a>
            </section>;
          })}</div>
        </>
      )}
      <p className="ai-stack-help">Company-wide planning documents and external chat updates are not automatically imported. Agent-scoped access and durable shared context remain pending.</p>
    </details>
  );
}

export function AIStackPage() {
  const devBypass = useContext(DevAuthBypassContext);
  const queryClient = useQueryClient();
  const controlsQuery = useQuery({ queryKey: ["work-controls"], queryFn: getWorkControls, retry: false });
  const handoversQuery = useQuery({ queryKey: ["work-handovers"], queryFn: getHandovers, retry: false });
  const handoverEventsQuery = useQuery({ queryKey: ["work-handover-events"], queryFn: getHandoverEvents, retry: false });
  const workItemsQuery = useQuery({ queryKey: ["work-items"], queryFn: getWorkItems, retry: false });
  const [workLinkRequest, setWorkLinkRequest] = useState(() => ({ fragment: savedWorkFragment(), version: 0 }));
  const [workLinkNotice, setWorkLinkNotice] = useState<string | null>(null);
  const handledWorkLink = useRef<number | null>(null);
  useEffect(() => {
    function requestWorkLink() {
      setWorkLinkNotice(null);
      setWorkLinkRequest((previous) => ({ fragment: savedWorkFragment(), version: previous.version + 1 }));
    }
    window.addEventListener("hashchange", requestWorkLink);
    window.addEventListener("popstate", requestWorkLink);
    return () => {
      window.removeEventListener("hashchange", requestWorkLink);
      window.removeEventListener("popstate", requestWorkLink);
    };
  }, []);
  useEffect(() => {
    if (!workLinkRequest.fragment || handledWorkLink.current === workLinkRequest.version || workItemsQuery.isLoading) return;
    if (workItemsQuery.isError || !workItemsQuery.data) {
      setWorkLinkNotice("The linked work record cannot be opened while saved tasks are unavailable. Retry the saved records; nothing has been approved or started.");
      return;
    }
    const target = document.getElementById(workLinkRequest.fragment);
    if (target) {
      revealSavedWork(workLinkRequest.fragment);
      setWorkLinkNotice(null);
    } else {
      setWorkLinkNotice("The linked task is not in the loaded records. No replacement task was created and no work was approved or started.");
    }
    // Background query refreshes must not steal focus after navigation finishes.
    handledWorkLink.current = workLinkRequest.version;
  }, [workLinkRequest, workItemsQuery.isLoading, workItemsQuery.isError, workItemsQuery.data]);
  const outcomesQuery = useQuery({ queryKey: ["work-outcomes"], queryFn: getWorkOutcomes, retry: false });
  const readinessQuery = useQuery({ queryKey: ["work-readiness"], queryFn: getWorkReadiness, retry: false });
  const dispatchConfigMutation=useMutation({mutationFn:saveDispatchConfig,onSuccess:()=>queryClient.invalidateQueries({queryKey:["work-readiness"]})});
  const outcomeApproveMutation=useMutation({mutationFn:approveOutcome,onSuccess:()=>{void queryClient.invalidateQueries({queryKey:["work-outcomes"]});void queryClient.invalidateQueries({queryKey:["work-items"]});}});
  const dispatchMutation=useMutation({mutationFn:dispatchWorkItem,onSuccess:()=>{void queryClient.invalidateQueries({queryKey:["work-items"]});void queryClient.invalidateQueries({queryKey:["work-readiness"]});}});
  const savedReportsQuery = useQuery({ queryKey:["saved-heimdall-reports"],queryFn:getSavedReports,retry:false });
  const [fleetProjectKey,setFleetProjectKey]=useState("ddg-control-ai-stack");
  const [fleetTaskId,setFleetTaskId]=useState<number|null>(null);
  const fleetThreadQuery=useQuery({queryKey:["fleet-thread",fleetProjectKey,fleetTaskId],queryFn:()=>getFleetThread(fleetProjectKey,fleetTaskId),enabled:!!fleetProjectKey,retry:false});
  const fleetThreadRaw=fleetThreadQuery.data as any;
  const fleetThread={
    messages:(fleetThreadRaw?.messages??[]).map((message:any)=>({...message,task_id:message.work_item_id})),
    questions:(fleetThreadRaw?.questions??[]).map((question:any)=>({...question,task_id:question.work_item_id,answers:question.answers??[]})),
    worker_label:fleetThreadRaw?.worker_label??"No active worker",
    model_label:fleetThreadRaw?.model_label??"Unknown",
    delivery_blocker:fleetThreadRaw?.delivery_blocker??"Provider messaging unavailable; content remains dashboard-only.",
  };
  const blockAllMutation = useMutation({
    mutationFn: blockAllDashboardWork,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["work-controls"] });
      void queryClient.invalidateQueries({ queryKey: ["work-readiness"] });
      void queryClient.invalidateQueries({ queryKey: ["work-items"] });
    },
  });
  const controlMutation = useMutation({
    mutationFn: saveWorkControl,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["work-controls"] }),
  });
  const completeMutation = useMutation({ mutationFn: completeProject, onSuccess:()=>{void queryClient.invalidateQueries({queryKey:["work-controls"]});void queryClient.invalidateQueries({queryKey:["work-outcomes"]});} });
  const handoverMutation = useMutation({
    mutationFn: saveHandover,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["work-handovers"] }); void queryClient.invalidateQueries({ queryKey: ["work-handover-events"] }); },
  });
  const resumeMutation = useMutation({ mutationFn: resumeHandover, onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["work-handover-events"] }); void queryClient.invalidateQueries({ queryKey: ["work-items"] }); } });
  const createWorkMutation = useMutation({ mutationFn: createWorkItem, onSuccess: () => queryClient.invalidateQueries({ queryKey:["work-items"] }) });
  const approveWorkMutation = useMutation({ mutationFn: approveWorkItem, onSuccess: () => queryClient.invalidateQueries({ queryKey:["work-items"] }) });
  const moveWorkMutation = useMutation({ mutationFn: moveWorkItem, onSuccess: () => queryClient.invalidateQueries({ queryKey:["work-items"] }) });
  const [handoverKey, setHandoverKey] = useState("hypest");
  const [handoverFields, setHandoverFields] = useState({ status: "in progress", completed_work: "", next_action: "", blockers: "", verification: "", recovery_note: "", branch: "", commit_ref: "", task_id: "", work_item_id: "" });
  const [handoverCopyStatus, setHandoverCopyStatus] = useState("");
  const [workFields, setWorkFields] = useState(() => emptyWorkDraft());
  const draftOutcome = outcomesQuery.data?.outcomes.find(o => String(o.id) === workFields.outcome_id && o.project_key === workFields.project_key && ["pending_approval", "approved"].includes(o.status));
  const draftScopeValid = !outcomesQuery.isError && !outcomesQuery.isFetching && !!draftOutcome?.gates.some(g => g.key === workFields.gate_key);
  function replaceWorkDraft(projectKey: string, report?: { summary: string; next_action: string }) {
    if (createWorkMutation.isPending) return;
    const blank = emptyWorkDraft(workFields.project_key);
    const changed = (Object.keys(blank) as Array<keyof typeof blank>).some(key => workFields[key] !== blank[key]);
    if (changed && !window.confirm("Replace the current unsaved task draft? Its text and project settings will be cleared. Cancel to keep it.")) return;
    createWorkMutation.reset();
    setWorkFields({ ...emptyWorkDraft(projectKey), ...(report ? { title:(report.next_action || report.summary).slice(0,160), objective:report.summary, outcome:report.next_action } : {}) });
    return true;
  }
  const [dispatchConfig,setDispatchConfig]=useState({enabled:false,plan_model_confirmed:false,included_allowance_confirmed:false,no_overage_confirmed:false,github_access_confirmed:false,secret_owner_verified:false,selected_model_id:"",approved_repository:"",approved_starting_branch:"",approved_project_key:""});
  useEffect(()=>{const c=readinessQuery.data?.config;if(c)setDispatchConfig({...c,selected_model_id:c.selected_model_id??"",approved_repository:c.approved_repository??"",approved_starting_branch:c.approved_starting_branch??"",approved_project_key:c.approved_project_key??""});},[readinessQuery.data]);
  const agentsQuery = useQuery({
    queryKey: ["cursor-cloud-agents"],
    queryFn: loadCursorAgents,
    enabled: false,
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const agents = agentsQuery.data?.agents ?? [];
  const tokenValues = agents.map((agent) => agent.totalTokens ?? 0);
  const maxTokens = Math.max(1, ...tokenValues);
  const activeCount = agents.filter((agent) =>
    ["RUNNING", "CREATING"].includes(agent.runStatus?.toUpperCase() ?? ""),
  ).length;
  const attentionCount = agents.filter((agent) =>
    ["ERROR", "EXPIRED"].includes(agent.runStatus?.toUpperCase() ?? ""),
  ).length;
  const cursorConnected = !devBypass && !agentsQuery.isError && agentsQuery.data?.status === "connected";
  const controlCount = controlsQuery.data?.controls.filter((control) => control.enabled).length;
  const latestTokenTotal = agents.reduce((total, agent) => total + (agent.totalTokens ?? 0), 0);
  const hasTokenTotals = cursorConnected && agents.some((agent) => agent.totalTokens !== null);
  const checkedAtMs = agentsQuery.data?.checkedAt ? Date.parse(agentsQuery.data.checkedAt) : NaN;
  const cursorFreshness = devBypass
    ? "Unknown · development bypass"
    : agentsQuery.isError
      ? "Unavailable"
      : !Number.isFinite(checkedAtMs)
        ? "Unknown · no check timestamp"
        : `Last checked ${new Date(checkedAtMs).toLocaleString("en-AU")}`;
  const [detailView, setDetailView] = useState<DetailView>(null);
  const latestHandover = [...(handoversQuery.data ?? [])].sort((a, b) =>
    Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id,
  )[0];

  const copyLatestHandover = async () => {
    if (!latestHandover) {
      setHandoverCopyStatus("Save a checkpoint first; there is no handover to copy.");
      return;
    }
    if (!navigator.clipboard?.writeText) {
      setHandoverCopyStatus("Clipboard access is unavailable in this browser. No handover was copied.");
      return;
    }
    try {
      const projectLabel =
        managedAreas.find((area) => area.key === latestHandover.project_key)?.label ??
        latestHandover.project_key;
      await writeHandoverPacket(
        latestHandover,
        projectLabel,
        (packet) => navigator.clipboard.writeText(packet),
      );
      setHandoverCopyStatus("Latest saved checkpoint copied for the next agent.");
    } catch {
      setHandoverCopyStatus("Could not copy the handover. Check browser clipboard permission and try again.");
    }
  };

  useEffect(() => {
    if (!detailView) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDetailView(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [detailView]);

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main ai-stack-main">
        {workLinkNotice && <div className="ai-stack-help" role="status"><p>{workLinkNotice}</p>{workItemsQuery.isError && <button type="button" className="work-toggle" disabled={workItemsQuery.isFetching} onClick={() => void workItemsQuery.refetch()}>Retry saved tasks</button>}</div>}
        <div className="ai-stack-heading">
          <div>
            <p className="eyebrow">Control room · dashboard-mediated work</p>
            <h1 className="detail-title">AI Stack</h1>
            <p className="detail-description">
              Current operating signals and owner controls. Unknown stays unknown.
            </p>
            {devBypass && (
              <p className="ai-stack-release-warning" role="status">
                Development preview · NOT READY for release: signed-in route and UI verification is still outstanding.
              </p>
            )}
          </div>
          <div className="ai-stack-refresh" role="status">
            <span
              className="ai-stack-live-dot"
            />
            <span className="ai-stack-refresh-label">{devBypass
              ? "Cursor polling disabled in development bypass"
              : agentsQuery.isFetching
              ? "Checking…"
              : agentsQuery.data?.checkedAt
                ? `Updated ${new Date(agentsQuery.data.checkedAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}`
                : "Status not checked"}</span>
            <nav className="ai-stack-context-links" aria-label="Related pages">
              <Link href="/agents">Agent records</Link><Link href="/organisation">Company Map</Link>
            </nav>
          </div>
        </div>

        <section className="ai-stack-summary" aria-label="Current operating summary">
          <article className="ai-stack-summary-card">
            <span className="ai-stack-summary-label">Work controls</span>
            <strong>{controlsQuery.data ? `${controlCount ?? 0} / ${managedAreas.length}` : "Unknown"}</strong>
            <p>{controlsQuery.isError ? "Saved control states unavailable" : "Project areas currently ON"}</p>
            <div className="ai-stack-summary-track" role="img" aria-label={controlsQuery.data ? `${controlCount ?? 0} of ${managedAreas.length} work areas are on` : "Work control state unknown"}>
              <i style={{ width: controlsQuery.data ? `${((controlCount ?? 0) / managedAreas.length) * 100}%` : "0%" }} />
            </div>
          </article>
          <article className="ai-stack-summary-card">
            <span className="ai-stack-summary-label">Latest Cursor activity</span>
            <strong>{cursorConnected ? `${activeCount} active` : "Unknown"}</strong>
            <p>{cursorConnected ? `${attentionCount} need review · ${agents.length} returned` : cursorFreshness}</p>
          </article>
          <article className="ai-stack-summary-card">
            <span className="ai-stack-summary-label">Latest run tokens</span>
            <strong>{hasTokenTotals ? tokenLabel(latestTokenTotal) : "Unknown"}</strong>
            <p>{hasTokenTotals ? "Returned token counts · not cost or quota" : "No verified token total available"}</p>
            <div className="ai-stack-summary-track" role="img" aria-label={hasTokenTotals ? "Token counts are available; they do not represent cost or quota" : "Token counts unknown"}>
              <i style={{ width: hasTokenTotals ? "100%" : "0%" }} />
            </div>
          </article>
        </section>

        <WorkLedger data={workItemsQuery.data} loading={workItemsQuery.isLoading} failed={workItemsQuery.isError} onRetry={() => { void workItemsQuery.refetch(); }} />
        <DeliveryPlan />
        <CompanyWorkOverview
          items={workItemsQuery.data?.items ?? []}
          controls={controlsQuery.data?.controls ?? []}
          loading={workItemsQuery.isLoading || controlsQuery.isLoading}
          failed={workItemsQuery.isError || controlsQuery.isError}
          onRetry={() => { void Promise.all([workItemsQuery.refetch(), controlsQuery.refetch()]); }}
        />
        <FleetDesk
          projects={managedAreas.map((area)=>({key:area.key,label:area.label,enabled:controlsQuery.data?.controls.find((control)=>control.project_key===area.key)?.enabled??false,financeHeld:area.key==="finance",completed:controlsQuery.isError?null:controlsQuery.data?.controls.find((control)=>control.project_key===area.key)?.completed??null}))}
          tasks={(workItemsQuery.data?.items??[]).filter((item)=>item.project_key===fleetProjectKey).map((item)=>({id:item.id,project_key:item.project_key,title:item.title,status:item.status,plan_version:item.plan_version??1,outcome_id:item.outcome_id,outcome_version:outcomesQuery.data?.outcomes.find((outcome)=>outcome.id===item.outcome_id)?.version??null}))}
          savedReports={savedReportsQuery.data??[]}
          thread={fleetThread}
          selectedProjectKey={fleetProjectKey}
          selectedTaskId={fleetTaskId}
          onSelectProject={(key)=>{setFleetProjectKey(key);setFleetTaskId(null);}}
          onSelectTask={setFleetTaskId}
          onSaveMessage={async(input)=>{await saveFleetMessage(input);await queryClient.invalidateQueries({queryKey:["fleet-thread",fleetProjectKey,fleetTaskId]});}}
          onCreateQuestion={async(input)=>{await createFleetQuestion(input as unknown as Record<string,unknown>);await queryClient.invalidateQueries({queryKey:["fleet-thread",fleetProjectKey,fleetTaskId]});}}
          onRefresh={async()=>{const result=await fleetThreadQuery.refetch();if(result.isError)throw new Error("Conversation could not be refreshed. Unsaved text has been kept.");}}
          onAnswerQuestion={async(input)=>{await answerFleetQuestion(input);await queryClient.invalidateQueries({queryKey:["fleet-thread",fleetProjectKey,fleetTaskId]});}}
          onProposeNextWork={(report)=>{const project=managedAreas.find((area)=>area.key===report.project_slug);if(!project || !replaceWorkDraft(project.key, report))return;window.setTimeout(()=>document.getElementById("work-item-creator")?.scrollIntoView({behavior:"smooth",block:"center"}),0);}}
          loading={fleetThreadQuery.isLoading}
          error={fleetThreadQuery.isError?"Conversation unavailable. Refresh and explicitly reselect the project/task.":null}
          canAnswer={!devBypass}
        />

        <div className="ai-stack-dashboard-grid">
          <details className="ai-stack-cockpit-category">
            <summary><span>Agent activity</span><small>{cursorConnected ? `${activeCount} active · ${attentionCount} need review` : cursorFreshness}</small></summary>
          <section
            className="ai-stack-panel ai-stack-work-panel"
            aria-labelledby="ai-stack-work-title"
          >
            <div className="ai-stack-section-heading">
              <div>
                <h2 id="ai-stack-work-title">What Cursor is doing</h2>
                <p className="ai-stack-help">
                  Latest runs. This refreshes about once a minute.
                </p>
              </div>
              <div className="ai-stack-panel-actions">
                <span className="ai-stack-status">{!devBypass && !agentsQuery.isError && agentsQuery.data?.status === "connected" ? `${agents.length} agents in last check` : "Agents unknown"}</span>
                <button className="ai-stack-detail-button" type="button" disabled={devBypass || agentsQuery.isFetching}
                  onClick={() => { if (!devBypass) void agentsQuery.refetch(); }}>Check provider status</button>
                <button
                  className="ai-stack-detail-button"
                  type="button"
                  onClick={() => setDetailView("work")}
                >
                  Details ↗
                </button>
              </div>
            </div>
            {devBypass ? <p className="ai-stack-empty">Provider checks require a real owner sign-in. Preview mode does not contact Cursor.</p>
            : agentsQuery.isFetching ? (
              <p className="ai-stack-empty">Checking Cursor…</p>
            ) : agentsQuery.isError ? (
              <p className="ai-stack-empty ai-stack-error">
                Could not read Cursor. Check the saved API key and app
                connection.
              </p>
            ) : !agentsQuery.data ? <p className="ai-stack-empty">Provider status not checked. Use Check provider status for one read-only observation; no automatic polling.</p>
            : agentsQuery.data.status === "not_configured" ? (
              <p className="ai-stack-empty">
                Cursor API key is not set on the server.
              </p>
            ) : agents.length === 0 ? (
              <p className="ai-stack-empty">
                No Cursor Cloud Agents found yet. This view does not start one.
              </p>
            ) : (
              <ul className="ai-stack-agent-list">
                {agents.slice(0, 5).map((agent) => (
                  <li className="ai-stack-agent" key={agent.id}>
                    <div className="ai-stack-agent-top">
                      <strong>{agent.name}</strong>
                      <span
                        className={`ai-stack-run-pill ${agent.runStatus?.toLowerCase() ?? "idle"}`}
                      >
                        {runLabel(agent)}
                      </span>
                    </div>
                    <p className="ai-stack-repo">
                      {agent.repositories.length
                        ? agent.repositories.map(shortRepository).join(" · ")
                        : "Project name not supplied by Cursor"}
                    </p>
                    {agent.note || agent.result ? (
                      <details className="ai-stack-result-disclosure">
                        <summary>{(agent.note ?? agent.result ?? "").slice(0, 120)}{(agent.note ?? agent.result ?? "").length > 120 ? "…" : ""} · Full run result</summary>
                        <div className="ai-stack-result-full">{agent.note ?? agent.result}</div>
                      </details>
                    ) : (
                      <p className="ai-stack-result ai-stack-muted">
                        No final handover yet. Cursor does not report a separate
                        owner-wait flag here.
                      </p>
                    )}
                    <div className="ai-stack-agent-foot">
                      <span>
                        {agent.updatedAt
                          ? new Date(agent.updatedAt).toLocaleString("en-AU", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "Time not available"}
                      </span>
                      {agent.branches[0]?.branch && (
                        <span>Branch: {agent.branches[0].branch}</span>
                      )}
                      {agent.agentUrl && (
                        <a
                          href={agent.agentUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(event) => event.stopPropagation()}
                        >
                          Open in Cursor ↗
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
          </details>

          <div className="ai-stack-side-column">
            <details className="ai-stack-cockpit-category">
              <summary><span>Usage</span><small>Latest run token counts only · quota and cost unknown</small></summary>
            <section
              className="ai-stack-panel ai-stack-usage-panel"
              aria-labelledby="ai-stack-usage-title"
            >
              <div className="ai-stack-section-heading">
                <div>
                  <h2 id="ai-stack-usage-title">Usage</h2>
                  <p className="ai-stack-help">
                    Latest run tokens. These are not a plan limit or a cost
                    estimate.
                  </p>
                </div>
                <button
                  className="ai-stack-detail-button"
                  type="button"
                  onClick={() => setDetailView("usage")}
                >
                  Details ↗
                </button>
              </div>
              {agents.length ? (
                <div
                  className="ai-stack-token-chart"
                  role="img"
                  aria-label="Latest run token use by Cursor agent"
                >
                  {agents.slice(0, 4).map((agent, index) => (
                    <div className="ai-stack-token-row" key={agent.id}>
                      <span>{agent.name}</span>
                      <div className="ai-stack-token-track">
                        <i
                          style={{
                            width: `${agent.totalTokens === null ? 0 : Math.max(3, (agent.totalTokens / maxTokens) * 100)}%`,
                            background: `var(--ai-stack-chart-${index + 1})`,
                          }}
                        />
                      </div>
                      <strong>{tokenLabel(agent.totalTokens)}</strong>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="ai-stack-empty">
                  Token data will appear when Cursor has run data.
                </p>
              )}
              <p className="ai-stack-chart-caption">
                Cursor provides token counts, not your included quota or
                remaining plan allowance.
              </p>
            </section>
            </details>

            <details className="ai-stack-cockpit-category">
              <summary><span>Safety</span><small>Limits, holds and unknowns</small></summary>
            <section
              className="ai-stack-panel ai-stack-safety-panel"
              aria-labelledby="ai-stack-safety-title"
            >
              <div className="ai-stack-section-heading">
                <div>
                  <h2 id="ai-stack-safety-title">Safety checks</h2>
                  <p className="ai-stack-help">
                    What this dashboard allows today.
                  </p>
                </div>
                <button
                  className="ai-stack-detail-button"
                  type="button"
                  onClick={() => setDetailView("safety")}
                >
                  Details ↗
                </button>
              </div>
              <div className="ai-stack-safety-grid">
                <div>
                  <span className="ai-stack-check">✓</span>
                  <span>
                    <strong>Switch-gated work</strong>
                    <small>ON permits dashboard work; it never starts agents</small>
                  </span>
                </div>
                <div>
                  <span className="ai-stack-check">✓</span>
                  <span>
                    <strong>No extra spend</strong>
                    <small>No paid model calls from this page</small>
                  </span>
                </div>
                <div>
                  <span className="ai-stack-check">✓</span>
                  <span>
                    <strong>Owner review</strong>
                    <small>Review finished work before merging</small>
                  </span>
                </div>
                <div>
                  <span className="ai-stack-check ai-stack-check-info">i</span>
                  <span>
                    <strong>Unknown data</strong>
                    <small>Model identity, quota, cost, and owner-wait are unknown</small>
                  </span>
                </div>
              </div>
            </section>
            </details>
          </div>
        </div>

        <details className="ai-stack-cockpit-category">
          <summary><span>Projects / provider plan</span><small>Project mapping and planned provider order</small></summary>
          <section className="ai-stack-bottom-grid" aria-label="Model priority and projects">
          <div className="ai-stack-panel ai-stack-order-panel">
            <div className="ai-stack-section-heading">
              <div>
                <h2>Model priority</h2>
                <p className="ai-stack-help">
                  Shown as a plan only; automatic switching is not connected.
                </p>
              </div>
              <span className="ai-stack-status">Not active</span>
            </div>
            <div className="ai-stack-order-list">
              <span>
                <b>1</b> Cursor
              </span>
              <span>
                <b>2</b> Claude
              </span>
              <span>
                <b>3</b> Gemini
              </span>
              <span>
                <b>4</b> ChatGPT
              </span>
            </div>
          </div>
          <div className="ai-stack-panel ai-stack-project-panel">
            <div className="ai-stack-section-heading">
              <div>
                <h2>Projects</h2>
                <p className="ai-stack-help">
                  Only Cursor-reported repositories can be matched.
                </p>
              </div>
            </div>
            <div className="ai-stack-project-list">
              {projectNames.map((name) => (
                <span key={name}>
                  {name}
                  <small>Not linked here yet</small>
                </span>
              ))}
            </div>
          </div>
          </section>
        </details>
        <details className="ai-stack-cockpit-category" open>
          <summary><span>Projects / work switches</span><small>Four clear controls · Finance remains held</small></summary>
        <section className="ai-stack-panel ai-stack-controls-panel" aria-labelledby="work-controls-heading">
          <div className="ai-stack-section-heading">
            <div><h2 id="work-controls-heading">Project work controls</h2><p className="ai-stack-help">ON permits dashboard-mediated work; it never starts an agent. Finance stays OFF until Claude review.</p></div>
            <span className="ai-stack-status">OFF by default</span>
          </div>
          <p className="ai-stack-chart-caption">OFF blocks new dashboard work. It cannot stop agents started outside this dashboard or revoke their permissions. Existing tasks and history remain visible.</p>
          {controlsQuery.isError ? <p role="alert">Could not load saved controls. Retry the page before changing work state.</p> : (
            <div className="ai-stack-control-list">
              {managedAreas.map((area) => {
                const control = controlsQuery.data?.controls.find((item) => item.project_key === area.key);
                const enabled = control?.enabled === true;
                return <div className="ai-stack-control-row" key={area.key}>
                  <strong>{area.label}</strong><span className={enabled ? "work-state is-on" : "work-state"}>{control?.completed ? "COMPLETED" : enabled ? "ON" : "OFF"}</span>
                  <button type="button" className={`work-toggle ${enabled ? "is-on" : ""}`} aria-pressed={enabled} disabled={devBypass || blockAllMutation.isPending || controlMutation.isPending || !controlsQuery.data || control?.completed || (area.key === "finance" && !enabled)} title={area.key === "finance" && !enabled ? "Finance remains OFF until Claude review" : undefined} onClick={() => {
                    const next = !enabled;
                    if (window.confirm(`Markus, confirm ${next ? "ON" : "OFF"} for ${area.label}?`)) controlMutation.mutate({ key: area.key, enabled: next });
                  }}>{enabled ? "Turn OFF" : area.key === "finance" ? "Claude review required" : "Turn ON"}</button>
                  {!control?.completed && area.key !== "finance" && <button type="button" className="work-toggle" disabled={devBypass || blockAllMutation.isPending || completeMutation.isPending} onClick={()=>{if(window.confirm(`Confirm ${area.label} complete using its approved outcome and saved evidence for every gate? External run verification must also be resolved. This turns new work OFF.`)) completeMutation.mutate(area.key);}}>Mark complete</button>}
                </div>;
              })}
              <div className="ai-stack-control-row is-undecided"><strong>DDG Music</strong><span>Undecided · unchanged</span></div>
            </div>
          )}
          <div className="work-block-all">
            <button type="button" className="work-toggle" disabled={devBypass || blockAllMutation.isPending || controlMutation.isPending || completeMutation.isPending}
              onClick={() => { if (window.confirm("Block all dashboard work? This turns project controls and dispatch OFF. It does not cancel external or already-submitting agents. Review those separately.")) blockAllMutation.mutate(); }}>
              {blockAllMutation.isPending ? "Blocking dashboard work…" : "Block all dashboard work"}
            </button>
            <p className="ai-stack-help">Requires a real owner login. External runs are not cancelled by this control. Full stop-and-acknowledgement automation remains pending.</p>
            {devBypass && <p className="ai-stack-help">Development preview cannot change project controls or mark projects complete.</p>}
            {blockAllMutation.isError && <p role="alert">Block not confirmed. Read the saved project and provider states before retrying.</p>}
            {blockAllMutation.isSuccess && <div role="status"><p>{blockAllMutation.data.message}</p>
              {blockAllMutation.data.unresolved_dispatches.map((run) => <p key={run.id}>Unconfirmed external state: dispatch #{run.id} · task #{run.work_item_id} · {run.project_key} · {run.status} · agent {run.agent_id || "Unknown"} · run {run.run_id || "Unknown"}</p>)}
            </div>}
          </div>
          {controlMutation.isError && <p className="ai-stack-error" role="alert">{controlMutation.error.message}</p>}
          {completeMutation.isError && <p className="ai-stack-error" role="alert">{completeMutation.error.message}</p>}
          <h3>Owner change history</h3>
          <ol className="work-audit-list">{(controlsQuery.data?.audit ?? []).slice(0,8).map((entry) => <li key={entry.id}>{managedAreas.find((x)=>x.key===entry.project_key)?.label ?? entry.project_key}: {entry.enabled ? "ON" : "OFF"} · {new Date(entry.created_at).toLocaleString()}</li>)}</ol>
        </section>
        </details>
        <details className="ai-stack-cockpit-category">
          <summary><span>Handovers</span><small>Manual checkpoint history · no timed capture callback</small></summary>
        <section className="ai-stack-panel ai-stack-checkpoint-panel" aria-labelledby="handover-heading">
          <div className="ai-stack-section-heading"><div><h2 id="handover-heading">Shared handover / checkpoint</h2><p className="ai-stack-help">Manual save only · recovery notes can be saved while work is OFF. Resume requires project ON and fresh approval; it never starts an agent. The five-minute target is a reminder, not automatic capture.</p></div><span className="ai-stack-status">Manual</span></div>
          <div className="handover-copy-action">
            <button type="button" className="work-toggle" onClick={() => void copyLatestHandover()} disabled={handoversQuery.isLoading || handoversQuery.isError || !latestHandover}>
              Copy handover for next agent
            </button>
            {handoversQuery.isLoading && <p className="ai-stack-help">Loading saved checkpoints…</p>}
            {handoversQuery.isError && <p className="ai-stack-error" role="alert">Saved checkpoints are unavailable. Retry before copying.</p>}
            {!handoversQuery.isLoading && !handoversQuery.isError && !latestHandover && <p className="ai-stack-help">No saved checkpoint yet. Save one first; no handover packet will be fabricated.</p>}
            <p className="ai-stack-help" role="status" aria-live="polite">{handoverCopyStatus}</p>
          </div>
          <details className="ai-stack-on-demand">
            <summary>Save a checkpoint</summary>
          <form className="work-handover-form" onSubmit={(event) => { event.preventDefault(); const {task_id,work_item_id,...rest}=handoverFields; handoverMutation.mutate({ project_key: handoverKey, ...rest, ...(task_id?{task_id:Number(task_id)}:{}), ...(work_item_id?{work_item_id:Number(work_item_id)}:{}) }); }}>
            <label>Project<select value={handoverKey} onChange={(e)=>setHandoverKey(e.target.value)}>{managedAreas.filter((a)=>a.key!=="finance").map((a)=><option key={a.key} value={a.key}>{a.label}</option>)}</select></label>
            {(["status","completed_work","next_action","blockers","verification","recovery_note","branch","commit_ref","task_id","work_item_id"] as const).map((field)=><label key={field}>{field.replaceAll("_"," ")}<input type={field.endsWith("_id")?"number":"text"} min={field.endsWith("_id")?1:undefined} required={["status","completed_work","next_action","recovery_note"].includes(field)} value={handoverFields[field]} onChange={(e)=>setHandoverFields({...handoverFields,[field]:e.target.value})}/></label>)}
            <button type="submit" className="work-toggle" disabled={devBypass || handoverMutation.isPending}>Save checkpoint</button>
          </form>
          </details>
          {devBypass && <p className="ai-stack-help">Sign in as owner to save or return a checkpoint. Preview mode is read-only for these actions.</p>}
          {handoverMutation.isError && <p role="alert">{handoverMutation.error.message}</p>}
          <div className="work-handover-history">{(handoversQuery.data ?? []).slice(0,6).map((h)=><article key={h.id}><strong>{managedAreas.find((a)=>a.key===h.project_key)?.label ?? h.project_key} · {h.status}</strong><small>{new Date(h.created_at).toLocaleString()} · task {h.task_id ?? h.work_item_id ?? "Unknown"} · branch {h.branch || "Unknown"} · commit {h.commit_ref || "Unknown"}</small><p>Done: {h.completed_work}</p><p>Next: {h.next_action}</p><p>Blockers: {h.blockers || "None recorded"} · Verification: {h.verification || "Unknown"}</p><p>Recovery: {h.recovery_note}</p><button className="work-toggle" type="button" disabled={devBypass || resumeMutation.isPending || h.project_key === "finance" || controlsQuery.data?.controls.find(c=>c.project_key===h.project_key)?.enabled !== true || controlsQuery.data?.controls.find(c=>c.project_key===h.project_key)?.completed === true} title="Requires a real owner session and project ON. Returns eligible work for fresh approval; never starts an agent." onClick={()=>resumeMutation.mutate(h.id)}>Return for owner review</button></article>)}</div>
          {resumeMutation.isError&&<p role="alert">{resumeMutation.error.message}</p>}
          {resumeMutation.isSuccess&&<p role="status">Checkpoint returned for owner review. No agent started.</p>}
          <ol className="work-audit-list">{(handoverEventsQuery.data??[]).slice(0,12).map(e=><li key={e.id}>Checkpoint #{e.checkpoint_id} · {e.event_type} · {new Date(e.created_at).toLocaleString()}</li>)}</ol>
        </section>
        </details>
        <details className="ai-stack-cockpit-category">
          <summary><span>Decisions / history</span><small>Saved suggestions, approval queue and append-only history</small></summary>
        <section className="ai-stack-panel ai-stack-workqueue-panel" aria-labelledby="work-queue-heading">
          <div className="ai-stack-section-heading"><div><h2 id="work-queue-heading">Next work · owner approval</h2><p className="ai-stack-help">Saved Heimdall reports only · viewing this queue makes no model calls.</p></div><span className="ai-stack-status">No agent starts</span></div>
          <section className="managed-work-card" aria-labelledby="activation-heading">
            <h3 id="activation-heading">Activation checklist · dispatch blocked</h3>
            <p>Manual checkpoints only. No ChatGPT quota detection, automatic provider/model switching, or worker start is connected.</p>
            {readinessQuery.isError ? <p role="alert">Readiness status unavailable; dispatch remains disabled.</p> : <>
              <ul>{(readinessQuery.data?.blockers ?? ["Checking activation requirements…"]).map((blocker,index)=><li key={index}>{blocker}</li>)}</ul>
              <p><b>Automatic pickup:</b> OFF. {readinessQuery.data?.background_worker_blocker}</p>
              <p>Cursor API secret: {readinessQuery.data?.secret_present ? "Present (value hidden)" : "Missing"}. This does not verify that the key is valid.</p>
              <details className="ai-stack-on-demand">
                <summary>Owner setup and dispatch configuration</summary>
              <form className="work-item-form" onSubmit={e=>{e.preventDefault();dispatchConfigMutation.mutate({...dispatchConfig,enabled:false,selected_model_id:dispatchConfig.selected_model_id||null});}}>
                <h4>Owner setup checks</h4>
                {([
                  ["plan_model_confirmed","Eligible plan and exact model verified"],
                  ["included_allowance_confirmed","Included model allowance verified"],
                  ["no_overage_confirmed","No-overage or hard spend protection verified"],
                  ["github_access_confirmed","GitHub repository and branch access verified"],
                  ["secret_owner_verified","Server secret added and owner-verified (never paste it here)"],
                ] as const).map(([key,label])=><label className="dispatch-owner-check" key={key}><input type="checkbox" checked={dispatchConfig[key]} disabled={devBypass} onChange={e=>setDispatchConfig({...dispatchConfig,[key]:e.target.checked,enabled:false})}/>{label}</label>)}
                <label>Explicit Cursor model ID<input value={dispatchConfig.selected_model_id} disabled={devBypass} onChange={e=>setDispatchConfig({...dispatchConfig,selected_model_id:e.target.value,enabled:false})}/></label>
                <label>Owner-approved GitHub repository<input placeholder="github.com/owner/repository" value={dispatchConfig.approved_repository} disabled={devBypass} onChange={e=>setDispatchConfig({...dispatchConfig,approved_repository:e.target.value,enabled:false})}/></label>
                <label>Owner-approved starting branch<input value={dispatchConfig.approved_starting_branch} disabled={devBypass} onChange={e=>setDispatchConfig({...dispatchConfig,approved_starting_branch:e.target.value,enabled:false})}/></label>
                <label>Owner-approved project<select value={dispatchConfig.approved_project_key} disabled={devBypass} onChange={e=>setDispatchConfig({...dispatchConfig,approved_project_key:e.target.value,enabled:false})}><option value="">Choose project</option>{managedAreas.filter(a=>a.key!=="finance"&&a.key!=="ddg-music").map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</select></label>
                <button className="work-toggle" type="submit" disabled={devBypass||dispatchConfigMutation.isPending}>Save owner readiness checks</button>
                <button className={`work-toggle ${dispatchConfig.enabled?"is-on":""}`} type="button" aria-pressed={readinessQuery.data?.dispatch_enabled===true} disabled={devBypass||dispatchConfigMutation.isPending||(!dispatchConfig.enabled&&!readinessQuery.data?.manual_dispatch_ready)} onClick={()=>dispatchConfigMutation.mutate({...dispatchConfig,enabled:!dispatchConfig.enabled,selected_model_id:dispatchConfig.selected_model_id||null})}>Dispatch toggle · {readinessQuery.data?.dispatch_enabled?"ON":"OFF"}</button>
                {devBypass&&<p role="note">Configuration changes require a real authenticated owner session; development auth bypass is not accepted.</p>}
                {dispatchConfigMutation.isError&&<p role="alert">{dispatchConfigMutation.error.message}</p>}
              </form>
              </details>
              <p>{readinessQuery.data?.finance_hold}</p><p>{readinessQuery.data?.local_limits}</p>
            </>}
            <h3>DDG Control outcome · review and approval</h3>
            <button className="work-toggle" type="button" disabled={outcomesQuery.isFetching || outcomeApproveMutation.isPending} onClick={async()=>{const result=await outcomesQuery.refetch();if(!result.isError)outcomeApproveMutation.reset();}}>Refresh outcomes for review</button>
            {outcomeApproveMutation.isError && <p role="alert">{outcomeApproveMutation.error.message} Refresh outcomes, then review the current version before trying again.</p>}
            {outcomesQuery.isError ? <p role="alert">Could not load the saved outcome or its audit history.</p> : (outcomesQuery.data?.outcomes ?? []).filter(o=>o.project_key==="ddg-control-ai-stack").map(outcome=><div key={outcome.id}>
              <strong>{outcome.title} · v{outcome.version} · {outcome.status.replaceAll("_"," ")}</strong><p>{outcome.description}</p>
              {outcome.status==="pending_approval"&&<button className="work-toggle" type="button" disabled={devBypass||outcomesQuery.isFetching||outcomeApproveMutation.isError||controlsQuery.data?.controls.find(c=>c.project_key===outcome.project_key)?.enabled!==true||outcomeApproveMutation.isPending} onClick={()=>outcomeApproveMutation.mutate({id:outcome.id,expected_version:outcome.version})}>Approve outcome v{outcome.version}</button>}
              <ol>{outcome.gates.map(gate=><li key={gate.key}><b>{gate.title}</b> · {gate.key}<ul>{gate.acceptance.map((check,i)=><li key={i}>{check}</li>)}</ul></li>)}</ol>
            </div>)}
          </section>
          <h3>Saved Heimdall suggestions</h3>
          {savedReportsQuery.isError&&<p role="alert">Saved reports unavailable; no new recommendation was generated.</p>}
          {(savedReportsQuery.data??[]).filter(r=>managedAreas.some(a=>a.key===r.project_slug)).map(report=><article className="managed-work-card" key={report.project_slug}>
            <strong>{managedAreas.find(a=>a.key===report.project_slug)?.label} · {report.priority??"Priority unknown"}</strong>
            <p>{report.summary}</p><p><b>Suggested next action:</b> {report.next_action}</p>
            {report.project_slug==="finance" ? <span className="ai-stack-help">Held until Claude review · no Finance work starts here.</span> : <button type="button" className="work-toggle" disabled={createWorkMutation.isPending} onClick={()=>replaceWorkDraft(report.project_slug, report)}>Use saved report in draft</button>}
          </article>)}
          <details className="ai-stack-on-demand">
            <summary>Create a bounded task draft</summary>
          <form id="work-item-creator" className="work-item-form" onSubmit={(event)=>{event.preventDefault();if(!draftScopeValid || createWorkMutation.isPending || devBypass)return;createWorkMutation.mutate({
            project_key:workFields.project_key,title:workFields.title,objective:workFields.objective,outcome:workFields.outcome,
            checklist:workFields.checklist.split("\n").map(x=>x.trim()).filter(Boolean),
            acceptance_checks:workFields.acceptance_checks.split("\n").map(x=>x.trim()).filter(Boolean),
            deadline:new Date(workFields.deadline).toISOString(),time_limit_minutes:Number(workFields.time_limit_minutes),
            max_attempts:Number(workFields.max_attempts),spend_limit_cents:0,
            stop_condition:workFields.stop_condition,outcome_id:Number(workFields.outcome_id),gate_key:workFields.gate_key,
            repository:workFields.repository,target_branch:workFields.target_branch,
          });}}>
            <fieldset disabled={createWorkMutation.isPending} style={{border:0,padding:0,margin:0,display:"contents"}}>
            <label>Project<select value={workFields.project_key} onChange={e=>replaceWorkDraft(e.target.value)}>{managedAreas.filter((a)=>a.key!=="finance").map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</select></label>
            <label>Linked outcome<select required value={workFields.outcome_id} onChange={e=>setWorkFields({...workFields,outcome_id:e.target.value,gate_key:""})}><option value="">Select pending or approved outcome</option>{(outcomesQuery.data?.outcomes??[]).filter(o=>o.project_key===workFields.project_key&&["pending_approval","approved"].includes(o.status)).map(o=><option key={o.id} value={o.id}>{o.title}</option>)}</select></label>
            <label>Outcome gate<select required value={workFields.gate_key} onChange={e=>setWorkFields({...workFields,gate_key:e.target.value})}><option value="">Select gate</option>{draftOutcome?.gates.map(g=><option key={g.key} value={g.key}>{g.title}</option>)}</select></label>
            <label>Repository<input required value={workFields.repository} onChange={e=>setWorkFields({...workFields,repository:e.target.value})}/></label>
            <label>Target branch<input required value={workFields.target_branch} onChange={e=>setWorkFields({...workFields,target_branch:e.target.value})}/></label>
            {(["title","objective","outcome","checklist","acceptance_checks","deadline","time_limit_minutes","max_attempts","stop_condition"] as const).map(field=><label key={field}>{field.replaceAll("_"," ")}{["checklist","acceptance_checks","objective","outcome","stop_condition"].includes(field)?<textarea required value={workFields[field]} onChange={e=>setWorkFields({...workFields,[field]:e.target.value})}/>:<input required type={field==="deadline"?"datetime-local":"text"} value={workFields[field]} onChange={e=>setWorkFields({...workFields,[field]:e.target.value})}/>}</label>)}
            <p className="ai-stack-chart-caption">Zero spend limit. Time is 5–1,440 minutes; attempts are 1–10. No provider or agent is started.</p>
            <p className="ai-stack-help">Planning records stay visible while OFF; new work can only be queued for an ON, incomplete project.</p>
            <p className="ai-stack-help">Changing project or using a report replaces this unsaved draft after confirmation. Select that project's outcome and gate again. Keep this page open until the save is confirmed.</p>
            {!draftScopeValid && <p className="ai-stack-help">Choose a current outcome and gate for this project before queuing. If saved outcomes are unavailable, refresh them first.</p>}
            <button className="work-toggle" disabled={!draftScopeValid || devBypass || createWorkMutation.isPending || controlsQuery.data?.controls.find(c=>c.project_key===workFields.project_key)?.enabled !== true || controlsQuery.data?.controls.find(c=>c.project_key===workFields.project_key)?.completed === true}>Queue for Markus’ approval</button>
            </fieldset>
          </form>
          </details>
          {createWorkMutation.isError && <p role="alert">{createWorkMutation.error.message}</p>}
          {workItemsQuery.isError ? <p role="alert">Could not load approval queue or task history.</p> : (workItemsQuery.data?.items ?? []).map(item=><article className="managed-work-card" id={`work-item-${item.id}`} key={item.id}>
            <div className="ai-stack-section-heading"><div><strong>{managedAreas.find(a=>a.key===item.project_key)?.label} · {item.title}</strong><p>{item.status.replaceAll("_"," ")} · Plan v{item.plan_version??1} · attempt {item.attempts}/{item.max_attempts} · due {new Date(item.deadline).toLocaleString()}</p></div>
              {item.status==="pending_approval"&&<button className="work-toggle" disabled={devBypass||!readinessQuery.data?.dispatch_enabled||outcomesQuery.data?.outcomes.find(o=>o.id===item.outcome_id)?.status!=="approved"||approveWorkMutation.isPending} title="Requires real owner approval, approved outcome, project ON, and verified dispatch readiness." onClick={()=>{const outcome=outcomesQuery.data?.outcomes.find(o=>o.id===item.outcome_id);if(outcome)approveWorkMutation.mutate({id:item.id,expected_plan_version:item.plan_version??1,expected_outcome_version:outcome.version});}}>Approve</button>}
              {item.status==="approved"&&<button className="work-toggle" disabled={devBypass||!readinessQuery.data?.dispatch_enabled||dispatchMutation.isPending} onClick={()=>dispatchMutation.mutate(item.id)}>Start Cursor Cloud Agent</button>}
              {item.status==="in_progress"&&<div className="work-actions"><button disabled={devBypass || moveWorkMutation.isPending} onClick={()=>moveWorkMutation.mutate({id:item.id,status:"needs_owner"})}>Needs owner</button><button disabled={devBypass || moveWorkMutation.isPending} onClick={()=>moveWorkMutation.mutate({id:item.id,status:"failed"})}>Mark failed</button><button disabled={devBypass || moveWorkMutation.isPending} onClick={()=>{const evidence=window.prompt("Enter acceptance evidence before completion:");if(evidence?.trim()) moveWorkMutation.mutate({id:item.id,status:"completed",acceptance_evidence:evidence});}}>Mark complete</button></div>}
              {["pending_approval","approved","needs_owner","failed"].includes(item.status)&&<button type="button" className="work-toggle" disabled={devBypass || moveWorkMutation.isPending || item.project_key==="finance"} onClick={()=>{if(window.confirm("Close this task record as rejected? This does not stop any external agent.")) moveWorkMutation.mutate({id:item.id,status:"rejected"});}}>Reject task record</button>}
            </div>
            <p>{item.objective}</p><p><b>Outcome:</b> {item.outcome} · gate: {item.gate_key || "Unknown"}</p><p><b>Stop:</b> {item.stop_condition}</p>
            <div className="managed-work-lists"><span><b>Checklist</b>{item.checklist.map((c,i)=><small key={i}>□ {c}</small>)}</span><span><b>Acceptance checks</b>{item.acceptance_checks.map((c,i)=><small key={i}>{c}</small>)}</span></div>
            <p>Evidence/result: {item.acceptance_evidence || item.result || "Not recorded"} · repository: {item.repository || "Unknown"} · target branch: {item.target_branch || "Unknown"} · branch: {item.branch || "Unknown"} · commit: {item.commit_ref || "Unknown"} · review: {item.review_link || "Unknown"}</p>
            {(workItemsQuery.data?.dispatches??[]).filter(d=>d.work_item_id===item.id).map(d=><p key={d.id}>Dispatch #{d.id} · {d.provider}/{d.model_id||"model unknown"} · {d.status} ({d.provider_status||"provider status unknown"}) · agent {d.agent_id||"Unknown"} · run {d.run_id||"Unknown"} · {d.started_at}{d.error_summary?` · ${d.error_summary}`:""}</p>)}
            <p className="ai-stack-help">Task status is an owner record. Closing it does not confirm an external run has stopped.</p>
            <p><b>Dispatch:</b> {(workItemsQuery.data?.dispatches??[]).some(d=>d.work_item_id===item.id) ? item.dispatch_state : "Not dispatched · see activation blockers above."}</p>
            <RejectedPlanRevision
              item={item}
              outcome={outcomesQuery.isError ? undefined : outcomesQuery.data?.outcomes.find((outcome) => outcome.id === item.outcome_id)}
              completed={controlsQuery.isError ? null : controlsQuery.data?.controls.find((control) => control.project_key === item.project_key)?.completed ?? null}
              devBypass={devBypass}
              hasDispatch={(workItemsQuery.data?.dispatches ?? []).some((run) => run.work_item_id === item.id)}
              events={(workItemsQuery.data?.events ?? []).filter((event) => event.work_item_id === item.id)}
              onSaved={() => Promise.all([
                queryClient.invalidateQueries({ queryKey: ["work-items"] }),
                queryClient.invalidateQueries({ queryKey: ["fleet-thread"] }),
              ])}
            />
          </article>)}
          {[createWorkMutation,approveWorkMutation,moveWorkMutation].some(m=>m.isError)&&<p role="alert">Work action failed or its response is unconfirmed. Reload saved records before retrying.</p>}
          <h3>Append-only task history</h3><ol className="work-audit-list">{(workItemsQuery.data?.events??[]).slice(0,30).map(e=><li key={e.id}>#{e.work_item_id} · {e.event_type} · {e.actor} · {new Date(e.created_at).toLocaleString()}</li>)}</ol>
        </section>
        </details>
        <p className="ai-stack-footnote">
          Cursor status is read-only. Managed work is dashboard-mediated, waits for owner approval, and does not start agents or switch providers automatically.
        </p>
      </main>
      <DetailDialog
        view={detailView}
        agents={agents}
        checkedAt={agentsQuery.data?.checkedAt ?? null}
        onClose={() => setDetailView(null)}
      />
    </div>
  );
}
