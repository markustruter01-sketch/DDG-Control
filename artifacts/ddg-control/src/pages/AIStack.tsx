import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Header } from "@/components/header";

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
  return r.json() as Promise<Array<{ id:number; project_key:string; task_id:number|null; work_item_id:number|null; status:string; completed_work:string; next_action:string; blockers:string; verification:string; recovery_note:string; branch:string|null; commit_ref:string|null; created_at:string }>>;
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
type WorkItem = { id:number; project_key:string; title:string; objective:string; outcome:string; checklist:string[]; acceptance_checks:string[]; acceptance_evidence:string; result:string; deadline:string; time_limit_minutes:number; max_attempts:number; attempts:number; spend_limit_cents:number; stop_condition:string; status:string; branch:string|null; commit_ref:string|null; review_link:string|null };
async function getWorkItems() {
  const r = await fetch("/api/work-items", { cache:"no-store" });
  if (!r.ok) throw new Error("Work queue unavailable");
  return r.json() as Promise<{items:WorkItem[];events:Array<{id:number;work_item_id:number;actor:string;event_type:string;created_at:string;details:Record<string,unknown>}>}>;
}
type SavedReport={project_slug:string;summary:string;next_action:string;priority:string|null;status_light:string};
async function getSavedReports(){
  const r=await fetch("/api/agent-updates/latest",{cache:"no-store"});
  if(!r.ok) throw new Error("Saved Heimdall reports unavailable");
  return r.json() as Promise<SavedReport[]>;
}
async function createWorkItem(data: Record<string, unknown>) {
  const r = await fetch("/api/work-items", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  if (!r.ok) throw new Error((await r.json().catch(()=>null))?.error ?? "Could not queue work");
  return r.json();
}
async function approveWorkItem(id:number) {
  const r=await fetch(`/api/work-items/${id}/approve`,{method:"POST"});
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
                    <p className="ai-stack-detail-result">
                      {agent.note ??
                        agent.result ??
                        "No final result yet. Cursor has not returned a final handover for this run."}
                    </p>
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

export function AIStackPage() {
  const queryClient = useQueryClient();
  const controlsQuery = useQuery({ queryKey: ["work-controls"], queryFn: getWorkControls, retry: false });
  const handoversQuery = useQuery({ queryKey: ["work-handovers"], queryFn: getHandovers, retry: false });
  const handoverEventsQuery = useQuery({ queryKey: ["work-handover-events"], queryFn: getHandoverEvents, retry: false });
  const workItemsQuery = useQuery({ queryKey: ["work-items"], queryFn: getWorkItems, retry: false });
  const savedReportsQuery = useQuery({ queryKey:["saved-heimdall-reports"],queryFn:getSavedReports,retry:false });
  const controlMutation = useMutation({
    mutationFn: saveWorkControl,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["work-controls"] }),
  });
  const completeMutation = useMutation({ mutationFn: completeProject, onSuccess:()=>queryClient.invalidateQueries({queryKey:["work-controls"]}) });
  const handoverMutation = useMutation({
    mutationFn: saveHandover,
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ["work-handovers"] }); void queryClient.invalidateQueries({ queryKey: ["work-handover-events"] }); },
  });
  const resumeMutation = useMutation({ mutationFn: resumeHandover, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["work-handover-events"] }) });
  const createWorkMutation = useMutation({ mutationFn: createWorkItem, onSuccess: () => queryClient.invalidateQueries({ queryKey:["work-items"] }) });
  const approveWorkMutation = useMutation({ mutationFn: approveWorkItem, onSuccess: () => queryClient.invalidateQueries({ queryKey:["work-items"] }) });
  const moveWorkMutation = useMutation({ mutationFn: moveWorkItem, onSuccess: () => queryClient.invalidateQueries({ queryKey:["work-items"] }) });
  const [handoverKey, setHandoverKey] = useState("finance");
  const [handoverFields, setHandoverFields] = useState({ status: "in progress", completed_work: "", next_action: "", blockers: "", verification: "", recovery_note: "", branch: "", commit_ref: "", task_id: "", work_item_id: "" });
  const [workFields, setWorkFields] = useState({ project_key:"finance", title:"", objective:"", outcome:"", checklist:"", acceptance_checks:"", deadline:"", time_limit_minutes:"30", max_attempts:"1", stop_condition:"Stop when any acceptance check fails or the limit is reached." });
  const agentsQuery = useQuery({
    queryKey: ["cursor-cloud-agents"],
    queryFn: loadCursorAgents,
    retry: false,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
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
  const [detailView, setDetailView] = useState<DetailView>(null);

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
        <div className="ai-stack-heading">
          <div>
            <p className="eyebrow">Separate control area</p>
            <h1 className="detail-title">AI Stack</h1>
            <p className="detail-description">
              A live view of dashboard-mediated work, token use, and safety.
            </p>
            <p className="ai-stack-release-warning" role="status">Development preview · NOT READY for release: signed-in route and UI verification is still outstanding.</p>
          </div>
          <div className="ai-stack-refresh" role="status">
            <span
              className={`ai-stack-live-dot ${agentsQuery.data?.status === "connected" ? "is-live" : ""}`}
            />
            {agentsQuery.isFetching
              ? "Checking…"
              : agentsQuery.data?.checkedAt
                ? `Updated ${new Date(agentsQuery.data.checkedAt).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}`
                : "Status not checked"}
          </div>
        </div>

        <section className="ai-stack-topline" aria-label="Agent overview">
          <div className="ai-stack-stat">
            <span>Agents shown</span>
            <strong>
              {agentsQuery.data?.status === "connected" ? agents.length : "—"}
            </strong>
          </div>
          <div className="ai-stack-stat">
            <span>Working now</span>
            <strong>
              {agentsQuery.data?.status === "connected" ? activeCount : "—"}
            </strong>
          </div>
          <div className="ai-stack-stat">
            <span>Needs review</span>
            <strong>
              {agentsQuery.data?.status === "connected" ? attentionCount : "—"}
            </strong>
          </div>
          <div className="ai-stack-no-spend">
            <span aria-hidden="true">✓</span> Read-only · no agent starts · no
            new spend
          </div>
        </section>

        <div className="ai-stack-dashboard-grid">
          <section
            className="ai-stack-panel ai-stack-work-panel"
            aria-labelledby="ai-stack-work-title"
            onClick={() => setDetailView("work")}
          >
            <div className="ai-stack-section-heading">
              <div>
                <h2 id="ai-stack-work-title">What Cursor is doing</h2>
                <p className="ai-stack-help">
                  Latest runs. This refreshes about once a minute.
                </p>
              </div>
              <div className="ai-stack-panel-actions">
                <span className="ai-stack-status">{agents.length} agents</span>
                <button
                  className="ai-stack-detail-button"
                  type="button"
                  onClick={() => setDetailView("work")}
                >
                  Details ↗
                </button>
              </div>
            </div>
            {agentsQuery.isLoading ? (
              <p className="ai-stack-empty">Checking Cursor…</p>
            ) : agentsQuery.isError ? (
              <p className="ai-stack-empty ai-stack-error">
                Could not read Cursor. Check the saved API key and app
                connection.
              </p>
            ) : agentsQuery.data?.status === "not_configured" ? (
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
                    {agent.note ? (
                      <p className="ai-stack-result">{agent.note}</p>
                    ) : agent.result ? (
                      <p className="ai-stack-result">{agent.result}</p>
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

          <div className="ai-stack-side-column">
            <section
              className="ai-stack-panel ai-stack-usage-panel"
              aria-labelledby="ai-stack-usage-title"
              onClick={() => setDetailView("usage")}
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

            <section
              className="ai-stack-panel ai-stack-safety-panel"
              aria-labelledby="ai-stack-safety-title"
              onClick={() => setDetailView("safety")}
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
          </div>
        </div>

        <section
          className="ai-stack-bottom-grid"
          aria-label="Model priority and projects"
        >
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
        <section className="ai-stack-panel ai-stack-controls-panel" aria-labelledby="work-controls-heading">
          <div className="ai-stack-section-heading">
            <div><h2 id="work-controls-heading">Project work controls</h2><p className="ai-stack-help">ON permits dashboard-mediated work; it never starts an agent.</p></div>
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
                  <button type="button" className={`work-toggle ${enabled ? "is-on" : ""}`} aria-pressed={enabled} disabled={controlMutation.isPending || !controlsQuery.data || control?.completed} onClick={() => {
                    const next = !enabled;
                    if (window.confirm(`Markus, confirm ${next ? "ON" : "OFF"} for ${area.label}?`)) controlMutation.mutate({ key: area.key, enabled: next });
                  }}>{enabled ? "Turn OFF" : "Turn ON"}</button>
                  {!control?.completed && <button type="button" className="work-toggle" disabled={completeMutation.isPending} onClick={()=>{if(window.confirm(`Mark ${area.label} complete? This stops new suggested work.`)) completeMutation.mutate(area.key);}}>Mark complete</button>}
                </div>;
              })}
              <div className="ai-stack-control-row is-undecided"><strong>DDG Music</strong><span>Undecided · unchanged</span></div>
            </div>
          )}
          {controlMutation.isError && <p className="ai-stack-error" role="alert">{controlMutation.error.message}</p>}
          {completeMutation.isError && <p className="ai-stack-error" role="alert">{completeMutation.error.message}</p>}
          <h3>Owner change history</h3>
          <ol className="work-audit-list">{(controlsQuery.data?.audit ?? []).slice(0,8).map((entry) => <li key={entry.id}>{managedAreas.find((x)=>x.key===entry.project_key)?.label ?? entry.project_key}: {entry.enabled ? "ON" : "OFF"} · {new Date(entry.created_at).toLocaleString()}</li>)}</ol>
        </section>
        <section className="ai-stack-panel ai-stack-checkpoint-panel" aria-labelledby="handover-heading">
          <div className="ai-stack-section-heading"><div><h2 id="handover-heading">Shared handover / checkpoint</h2><p className="ai-stack-help">Manual save · five-minute target reminder · no automatic checkpoint callback is connected.</p></div><span className="ai-stack-status">Manual</span></div>
          <form className="work-handover-form" onSubmit={(event) => { event.preventDefault(); const {task_id,work_item_id,...rest}=handoverFields; handoverMutation.mutate({ project_key: handoverKey, ...rest, ...(task_id?{task_id:Number(task_id)}:{}), ...(work_item_id?{work_item_id:Number(work_item_id)}:{}) }); }}>
            <label>Project<select value={handoverKey} onChange={(e)=>setHandoverKey(e.target.value)}>{managedAreas.map((a)=><option key={a.key} value={a.key}>{a.label}</option>)}</select></label>
            {(["status","completed_work","next_action","blockers","verification","recovery_note","branch","commit_ref","task_id","work_item_id"] as const).map((field)=><label key={field}>{field.replaceAll("_"," ")}<input type={field.endsWith("_id")?"number":"text"} min={field.endsWith("_id")?1:undefined} required={["status","completed_work","next_action","recovery_note"].includes(field)} value={handoverFields[field]} onChange={(e)=>setHandoverFields({...handoverFields,[field]:e.target.value})}/></label>)}
            <button type="submit" className="work-toggle" disabled={handoverMutation.isPending}>Save checkpoint</button>
          </form>
          {handoverMutation.isError && <p role="alert">{handoverMutation.error.message}</p>}
          <div className="work-handover-history">{(handoversQuery.data ?? []).slice(0,6).map((h)=><article key={h.id}><strong>{managedAreas.find((a)=>a.key===h.project_key)?.label ?? h.project_key} · {h.status}</strong><small>{new Date(h.created_at).toLocaleString()} · task {h.task_id ?? h.work_item_id ?? "Unknown"} · branch {h.branch || "Unknown"} · commit {h.commit_ref || "Unknown"}</small><p>Done: {h.completed_work}</p><p>Next: {h.next_action}</p><p>Blockers: {h.blockers || "None recorded"} · Verification: {h.verification || "Unknown"}</p><p>Recovery: {h.recovery_note}</p><button className="work-toggle" type="button" disabled={resumeMutation.isPending} onClick={()=>resumeMutation.mutate(h.id)}>Resume from checkpoint</button></article>)}</div>
          {resumeMutation.isError&&<p role="alert">{resumeMutation.error.message}</p>}
          <ol className="work-audit-list">{(handoverEventsQuery.data??[]).slice(0,12).map(e=><li key={e.id}>Checkpoint #{e.checkpoint_id} · {e.event_type} · {new Date(e.created_at).toLocaleString()}</li>)}</ol>
        </section>
        <section className="ai-stack-panel ai-stack-workqueue-panel" aria-labelledby="work-queue-heading">
          <div className="ai-stack-section-heading"><div><h2 id="work-queue-heading">Next work · owner approval</h2><p className="ai-stack-help">Saved Heimdall reports only · viewing this queue makes no model calls.</p></div><span className="ai-stack-status">No agent starts</span></div>
          <h3>Saved Heimdall suggestions</h3>
          {savedReportsQuery.isError&&<p role="alert">Saved reports unavailable; no new recommendation was generated.</p>}
          {(savedReportsQuery.data??[]).filter(r=>managedAreas.some(a=>a.key===r.project_slug)).map(report=><article className="managed-work-card" key={report.project_slug}>
            <strong>{managedAreas.find(a=>a.key===report.project_slug)?.label} · {report.priority??"Priority unknown"}</strong>
            <p>{report.summary}</p><p><b>Suggested next action:</b> {report.next_action}</p>
            <button type="button" className="work-toggle" onClick={()=>setWorkFields({...workFields,project_key:report.project_slug,title:report.next_action.slice(0,160),objective:report.next_action,outcome:report.summary})}>Use saved report in draft</button>
          </article>)}
          <form className="work-item-form" onSubmit={(event)=>{event.preventDefault();createWorkMutation.mutate({
            project_key:workFields.project_key,title:workFields.title,objective:workFields.objective,outcome:workFields.outcome,
            checklist:workFields.checklist.split("\n").map(x=>x.trim()).filter(Boolean),
            acceptance_checks:workFields.acceptance_checks.split("\n").map(x=>x.trim()).filter(Boolean),
            deadline:new Date(workFields.deadline).toISOString(),time_limit_minutes:Number(workFields.time_limit_minutes),
            max_attempts:Number(workFields.max_attempts),spend_limit_cents:0,
            stop_condition:workFields.stop_condition,
          });}}>
            <label>Project<select value={workFields.project_key} onChange={e=>setWorkFields({...workFields,project_key:e.target.value})}>{managedAreas.map(a=><option key={a.key} value={a.key}>{a.label}</option>)}</select></label>
            {(["title","objective","outcome","checklist","acceptance_checks","deadline","time_limit_minutes","max_attempts","stop_condition"] as const).map(field=><label key={field}>{field.replaceAll("_"," ")}{["checklist","acceptance_checks","objective","outcome","stop_condition"].includes(field)?<textarea required value={workFields[field]} onChange={e=>setWorkFields({...workFields,[field]:e.target.value})}/>:<input required type={field==="deadline"?"datetime-local":"text"} value={workFields[field]} onChange={e=>setWorkFields({...workFields,[field]:e.target.value})}/>}</label>)}
            <p className="ai-stack-chart-caption">Zero spend limit. Time is 5–1,440 minutes; attempts are 1–10. No provider or agent is started.</p>
            <button className="work-toggle" disabled={createWorkMutation.isPending}>Queue for Markus’ approval</button>
          </form>
          {createWorkMutation.isError && <p role="alert">{createWorkMutation.error.message}</p>}
          {workItemsQuery.isError ? <p role="alert">Could not load approval queue or task history.</p> : (workItemsQuery.data?.items ?? []).map(item=><article className="managed-work-card" key={item.id}>
            <div className="ai-stack-section-heading"><div><strong>{managedAreas.find(a=>a.key===item.project_key)?.label} · {item.title}</strong><p>{item.status.replaceAll("_"," ")} · attempt {item.attempts}/{item.max_attempts} · due {new Date(item.deadline).toLocaleString()}</p></div>
              {item.status==="pending_approval"&&<button className="work-toggle" disabled={approveWorkMutation.isPending} onClick={()=>approveWorkMutation.mutate(item.id)}>Approve</button>}
              {item.status==="approved"&&<button className="work-toggle" disabled={moveWorkMutation.isPending} onClick={()=>moveWorkMutation.mutate({id:item.id,status:"in_progress"})}>Start work item</button>}
              {item.status==="in_progress"&&<div className="work-actions"><button onClick={()=>moveWorkMutation.mutate({id:item.id,status:"needs_owner"})}>Needs owner</button><button onClick={()=>moveWorkMutation.mutate({id:item.id,status:"failed"})}>Mark failed</button><button onClick={()=>{const evidence=window.prompt("Enter acceptance evidence before completion:");if(evidence?.trim()) moveWorkMutation.mutate({id:item.id,status:"completed",acceptance_evidence:evidence});}}>Mark complete</button></div>}
            </div>
            <p>{item.objective}</p><p><b>Outcome:</b> {item.outcome}</p><p><b>Stop:</b> {item.stop_condition}</p>
            <div className="managed-work-lists"><span><b>Checklist</b>{item.checklist.map((c,i)=><small key={i}>□ {c}</small>)}</span><span><b>Acceptance checks</b>{item.acceptance_checks.map((c,i)=><small key={i}>{c}</small>)}</span></div>
            <p>Evidence/result: {item.acceptance_evidence || item.result || "Not recorded"} · branch: {item.branch || "Unknown"} · commit: {item.commit_ref || "Unknown"} · review: {item.review_link || "Unknown"}</p>
          </article>)}
          {[createWorkMutation,approveWorkMutation,moveWorkMutation].some(m=>m.isError)&&<p role="alert">Work action failed; current saved state is unchanged. Refresh before retrying.</p>}
          <h3>Append-only task history</h3><ol className="work-audit-list">{(workItemsQuery.data?.events??[]).slice(0,30).map(e=><li key={e.id}>#{e.work_item_id} · {e.event_type} · {e.actor} · {new Date(e.created_at).toLocaleString()}</li>)}</ol>
        </section>
        <p className="ai-stack-footnote">
          This page shows Cursor Cloud Agent activity only. It does not run a
          24/7 coding loop or switch providers automatically.
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
