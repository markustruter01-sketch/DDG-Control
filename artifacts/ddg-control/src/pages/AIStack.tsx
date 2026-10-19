import { useQuery } from "@tanstack/react-query";
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
  "DDG Finance",
  "DDG Hypest",
  "Cattle Dog Coffee",
  "DDG Music",
];

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

export function AIStackPage() {
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

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main ai-stack-main">
        <div className="ai-stack-heading">
          <div>
            <p className="eyebrow">Separate control area</p>
            <h1 className="detail-title">AI Stack</h1>
            <p className="detail-description">
              A live view of Cursor work, token use, and safety.
            </p>
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
          >
            <div className="ai-stack-section-heading">
              <div>
                <h2 id="ai-stack-work-title">What Cursor is doing</h2>
                <p className="ai-stack-help">
                  Latest runs. This refreshes about once a minute.
                </p>
              </div>
              <span className="ai-stack-status">{agents.length} agents</span>
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
            >
              <div className="ai-stack-section-heading">
                <div>
                  <h2 id="ai-stack-usage-title">Usage</h2>
                  <p className="ai-stack-help">
                    Latest run tokens. These are not a plan limit or a cost
                    estimate.
                  </p>
                </div>
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
            >
              <div className="ai-stack-section-heading">
                <div>
                  <h2 id="ai-stack-safety-title">Safety checks</h2>
                  <p className="ai-stack-help">
                    What this dashboard allows today.
                  </p>
                </div>
              </div>
              <div className="ai-stack-safety-grid">
                <div>
                  <span className="ai-stack-check">✓</span>
                  <span>
                    <strong>Read-only</strong>
                    <small>No start, stop, or edit controls</small>
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
                    <strong>Wait status</strong>
                    <small>Cursor does not show a clear owner-wait flag</small>
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
        <p className="ai-stack-footnote">
          This page shows Cursor Cloud Agent activity only. It does not run a
          24/7 coding loop or switch providers automatically.
        </p>
      </main>
    </div>
  );
}
