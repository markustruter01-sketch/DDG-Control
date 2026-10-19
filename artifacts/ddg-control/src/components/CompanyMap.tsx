import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  COMPANY_MAP_AS_OF,
  COMPANY_MAP_VERSION,
  companyMapFindings,
  companyMapLinks,
  companyMapNodes,
  companyMilestones,
  type CompanyFinding,
  type EvidenceCategory,
  type MapNode,
} from "@/lib/company-map-data";
import "./company-map.css";

type ExistingWorkItem = { id: number; title: string; project_key: string; status: string };
type View = "Overview" | "People" | "Systems" | "Projects";

const evidenceClass: Record<EvidenceCategory, string> = {
  "Source implemented": "source",
  "Owner reported": "owner",
  "Live checked": "live",
  Manual: "manual",
  Planned: "planned",
  Blocked: "blocked",
  Unknown: "unknown",
};

async function loadExistingWork(): Promise<ExistingWorkItem[]> {
  const response = await fetch("/api/work-items", { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!response.ok) throw new Error("Existing task links are unavailable.");
  const data = await response.json() as { items?: ExistingWorkItem[] };
  return Array.isArray(data.items) ? data.items : [];
}

function EvidenceBadge({ category, date }: { category: EvidenceCategory; date: string }) {
  return <span className={`cm-evidence cm-evidence-${evidenceClass[category]}`}>{category}{category === "Live checked" ? ` · ${date}` : ""}</span>;
}

function NodeButton({ node, selected, onSelect }: { node: MapNode; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`cm-node${selected ? " is-selected" : ""}`} onClick={onSelect} aria-pressed={selected}>
      <span className="cm-node-kind">{node.kind}</span>
      <strong>{node.label}</strong>
      <span>{node.purpose}</span>
      <EvidenceBadge category={node.evidence} date={node.sourceDate} />
    </button>
  );
}

function TaskReferences({ titles, items }: { titles?: string[]; items: ExistingWorkItem[] }) {
  if (!titles?.length) return <p className="cm-no-task">No linked task is recorded for this finding.</p>;
  const linked = titles.flatMap((title) => items.filter((item) => item.project_key === "ddg-control-ai-stack" && item.title === title));
  if (!linked.length) return <p className="cm-no-task">No matching task record is present in this environment; this finding remains context, not a task.</p>;
  return <ul className="cm-task-links">{linked.map((task) => <li key={task.id}><Link href="/ai-stack#work-queue-heading">Existing task #{task.id}: {task.title} · {task.status.replaceAll("_", " ")}</Link></li>)}</ul>;
}

function FindingCard({ finding, items }: { finding: CompanyFinding; items: ExistingWorkItem[] }) {
  return (
    <article className="cm-finding">
      <div className="cm-finding-title"><span className={`cm-severity cm-severity-${finding.severity.toLowerCase()}`}>{finding.kind} · {finding.severity}</span><EvidenceBadge category={finding.evidence} date={finding.sourceDate} /></div>
      <h4>{finding.title}</h4>
      <p>{finding.whyItMatters}</p>
      <dl className="cm-finding-meta"><div><dt>Evidence / scope</dt><dd>{finding.source} · {finding.scope}</dd></div><div><dt>Next action</dt><dd>{finding.nextAction}</dd></div></dl>
      <TaskReferences titles={finding.relatedTaskTitles} items={items} />
    </article>
  );
}

export function CompanyMap() {
  const [view, setView] = useState<View>("Overview");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("sys-ddg-control");
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [gapsOpen, setGapsOpen] = useState(false);
  const itemsQuery = useQuery({ queryKey: ["company-map-existing-work"], queryFn: loadExistingWork, retry: false, staleTime: 60_000 });
  const normalizedSearch = search.trim().toLowerCase();
  const visibleNodes = useMemo(() => companyMapNodes.filter((node) => {
    const kindForView = view === "People" ? "person" : view === "Systems" ? "system" : view === "Projects" ? "project" : null;
    const matchesView = kindForView === null || node.kind === kindForView;
    const matchesSearch = !normalizedSearch || `${node.label} ${node.purpose} ${node.ownerRole} ${node.source} ${node.nextAction}`.toLowerCase().includes(normalizedSearch);
    return matchesView && matchesSearch;
  }), [view, normalizedSearch]);
  const selectedNode = visibleNodes.find((node) => node.id === selectedId) ?? visibleNodes[0] ?? null;
  const selectedLink = companyMapLinks.find((link) => link.id === selectedLinkId) ?? null;
  const connectedLinks = selectedNode ? companyMapLinks.filter((link) => link.from === selectedNode.id || link.to === selectedNode.id) : [];
  const overviewCounts = [
    { view: "People" as const, count: companyMapNodes.filter((node) => node.kind === "person").length, note: "9 named roles · possible tenth bot unresolved" },
    { view: "Systems" as const, count: companyMapNodes.filter((node) => node.kind === "system").length, note: "Connected, partial, planned and blocked paths separated" },
    { view: "Projects" as const, count: companyMapNodes.filter((node) => node.kind === "project").length, note: "Music preserved · creative operations unresolved" },
  ];

  return (
    <section className="company-map" aria-labelledby="company-map-title">
      <header className="cm-header">
        <div>
          <p className="cm-kicker">Company structure · evidence map v{COMPANY_MAP_VERSION}</p>
          <h2 id="company-map-title">Company Map</h2>
        <p className="cm-intro">Evidence-backed view of people, systems, projects and gaps—not a live health check.</p>
        </div>
        <div className="cm-header-meta"><span>As of {COMPANY_MAP_AS_OF}</span><span>Management view · no agent export</span></div>
      </header>

      <div className="cm-board-pending" role="status">
        <span className="cm-ledger-mark" aria-hidden="true">!</span>
        <div><strong>Company work board · pending</strong><p>Existing approval queue remains the task source. No second list or broad bot access.</p></div>
        <Link href="/ai-stack#work-queue-heading">Existing project work →</Link>
      </div>

      <div className="cm-toolbar">
        <div className="cm-tabs" role="tablist" aria-label="Company map views">
          {(["Overview", "People", "Systems", "Projects"] as const).map((tab) => <button key={tab} type="button" role="tab" aria-selected={view === tab} className={view === tab ? "is-active" : ""} onClick={() => { setView(tab); setSelectedLinkId(null); }}>{tab}</button>)}
        </div>
        <label className="cm-search">Search map<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, system, project or gap" /></label>
      </div>

      {view === "Overview" && !normalizedSearch ? (
        <div className="cm-overview">
          <div className="cm-lanes" aria-label="Company map categories">
            {overviewCounts.map((group) => <button className="cm-lane" type="button" key={group.view} onClick={() => setView(group.view)}>
              <span className="cm-lane-count">{group.count}</span><strong>{group.view}</strong><span>{group.note}</span><i>Explore {group.view.toLowerCase()} →</i>
            </button>)}
          </div>
          <button type="button" className="cm-mobile-paths" onClick={() => setView("Systems")}>Explore all {companyMapLinks.length} relationships in Systems →</button>
          <section className="cm-connections" aria-labelledby="cm-connections-title">
            <div className="cm-section-head"><div><p className="cm-kicker">Known paths · not live traffic</p><h3 id="cm-connections-title">How the company is connected</h3></div><span>{companyMapLinks.length} recorded relationships</span></div>
            <div className="cm-connection-list">{companyMapLinks.slice(0, 4).map((link) => <button type="button" className={`cm-connection${selectedLinkId === link.id ? " is-selected" : ""}`} key={link.id} onClick={() => { setSelectedLinkId(link.id); setSelectedId(link.from); }}>
              <span>{companyMapNodes.find((node) => node.id === link.from)?.label}</span><b aria-hidden="true">→</b><span>{companyMapNodes.find((node) => node.id === link.to)?.label}</span><small>{link.relationshipType}</small><EvidenceBadge category={link.evidence} date={link.sourceDate} />
            </button>)}</div>
          </section>
        </div>
      ) : (
        <div className="cm-explorer">
          <div className="cm-node-list" role="list" aria-label={`${view} map records`}>
            {visibleNodes.map((node) => <div role="listitem" key={node.id}><NodeButton node={node} selected={selectedNode?.id === node.id} onSelect={() => { setSelectedId(node.id); setSelectedLinkId(null); }} /></div>)}
            {!visibleNodes.length && <p className="cm-empty">No map records match this search.</p>}
          </div>
          {selectedNode && <aside className="cm-detail" aria-live="polite">
            <p className="cm-kicker">Selected {selectedNode.kind} · {selectedNode.id}</p><h3>{selectedNode.label}</h3><p>{selectedNode.purpose}</p>
            <EvidenceBadge category={selectedNode.evidence} date={selectedNode.sourceDate} />
            <dl className="cm-detail-list">
              <div><dt>Role / owner</dt><dd>{selectedNode.ownerRole}</dd></div>
              <div><dt>Relationship / direction</dt><dd>{selectedNode.relationshipType} · {selectedNode.relationshipDirection}</dd></div>
              <div><dt>Source / date</dt><dd>{selectedNode.source} · {selectedNode.sourceDate}</dd></div>
              <div><dt>Configuration</dt><dd>{selectedNode.configuration}</dd></div>
              <div><dt>Health</dt><dd>{selectedNode.health}</dd></div>
              <div><dt>Next action</dt><dd>{selectedNode.nextAction}</dd></div>
            </dl>
            <h4>Recorded relationships</h4>
            <div className="cm-related">{connectedLinks.map((link) => <button type="button" key={link.id} className="cm-related-link" onClick={() => setSelectedLinkId(link.id)}>
              <span>{link.direction}</span><strong>{link.relationshipType}</strong><EvidenceBadge category={link.evidence} date={link.sourceDate} />
            </button>)}
              {!connectedLinks.length && <p className="cm-empty">No relationship is recorded for this node.</p>}
            </div>
          </aside>}
        </div>
      )}

      {selectedLink && <section className="cm-link-detail" aria-live="polite"><div><p className="cm-kicker">Selected relationship · {selectedLink.id}</p><h3>{companyMapNodes.find((node) => node.id === selectedLink.from)?.label} → {companyMapNodes.find((node) => node.id === selectedLink.to)?.label}</h3><p>{selectedLink.purpose}</p></div><dl><div><dt>Type / direction</dt><dd>{selectedLink.relationshipType} · {selectedLink.direction}</dd></div><div><dt>Source / date / evidence</dt><dd>{selectedLink.source} · {selectedLink.sourceDate} · {selectedLink.evidence}</dd></div><div><dt>Configuration</dt><dd>{selectedLink.configuration}</dd></div><div><dt>Health</dt><dd>{selectedLink.health}</dd></div><div><dt>Next action</dt><dd>{selectedLink.nextAction}</dd></div></dl></section>}

      {view !== "Overview" && <details className="cm-accessible-list"><summary>Text list of all matching nodes and relationships</summary><ul>{visibleNodes.map((node) => <li key={node.id}><strong>{node.label}</strong> — {node.purpose} <EvidenceBadge category={node.evidence} date={node.sourceDate} /></li>)}</ul><ul>{companyMapLinks.filter((link) => !normalizedSearch || `${link.purpose} ${link.relationshipType} ${link.direction}`.toLowerCase().includes(normalizedSearch)).map((link) => <li key={link.id}>{link.direction} — {link.relationshipType} — {link.purpose} <EvidenceBadge category={link.evidence} date={link.sourceDate} /></li>)}</ul></details>}

      <section className="cm-milestones" aria-labelledby="cm-milestones-title"><div className="cm-section-head"><div><p className="cm-kicker">Finish line · plan exists, completion does not</p><h3 id="cm-milestones-title">Two-milestone completion strategy</h3></div><span>Neither milestone accepted</span></div><div className="cm-milestone-grid">{companyMilestones.map((milestone) => <article key={milestone.id} className="cm-milestone"><div><h4>{milestone.label}</h4><span className={milestone.id === "milestone-b" ? "cm-stage-blocked" : "cm-stage-progress"}>{milestone.state}</span></div><ul>{milestone.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div><p className="cm-footnote">Missing business-goal specifications should block task readiness, not hide the management map. No milestone is accepted because this plan exists.</p></section>

      <section className="cm-gaps" aria-labelledby="cm-gaps-title">
        <button type="button" className="cm-gaps-toggle" aria-expanded={gapsOpen} aria-controls="cm-gaps-panel" onClick={() => setGapsOpen((open) => !open)}>
          <span><span className="cm-kicker">Source findings · not incidents</span><strong id="cm-gaps-title">Actionable gaps and bottlenecks</strong><small>{companyMapFindings.length} findings · expand for evidence and next actions</small></span><b aria-hidden="true">{gapsOpen ? "−" : "+"}</b>
        </button>
        {gapsOpen && <div id="cm-gaps-panel" className="cm-gap-grid">
          {itemsQuery.isError && <p role="alert" className="cm-inline-error">{itemsQuery.error.message} Existing task links cannot be checked; no tasks have been invented.</p>}
          {itemsQuery.isLoading && <p role="status" className="cm-inline-loading">Checking existing dashboard task references…</p>}
          {companyMapFindings.map((finding) => <FindingCard key={finding.id} finding={finding} items={itemsQuery.data ?? []} />)}
        </div>}
      </section>

      <details className="cm-evidence-key"><summary>Evidence, account and source limits</summary>
        <p><b>Live checked timestamps are owner-supplied Codex metadata from 20 October 2026, not checks performed by this map.</b> Reported GitHub facts prove metadata access only—not Cursor permissions, billing, model inclusion, deployments or runtime health.</p>
        <p>Owner reports nine or ten Grokbots on Grokbot/Cursor. Nine employee roles are listed; a tenth identity and runtime/account relationships are unknown. Employee roles are not coding workers, providers or models.</p>
        <p>Cursor extra usage OFF is owner-confirmed in the task context. The reported downgrade to the lowest paid tier in about 22 days is not an account read; exact plan names, prices, date and Cloud Agent/model inclusion remain unverified. Do not clear readiness from this report.</p>
        <p>Finance remains held until actual Claude review and explicit Markus release. Thursday 22 October midday Brisbane is an owner-reported return, not an automatic release date. DDG Music remains unchanged.</p>
        <p>Viewing/searching this map makes no model or provider call. The only optional request is an authenticated read of existing DDG Control work items to show real task IDs. There is no scoped company-plan export for agents yet.</p>
      </details>
    </section>
  );
}
