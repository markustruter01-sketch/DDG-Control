import { useEffect, useMemo, useState, type FormEvent } from "react";

type FleetProject = { key: string; label: string; enabled: boolean; financeHeld: boolean };
type FleetTask = {
  id: number;
  project_key: string;
  title: string;
  status: string;
  plan_version: number;
  outcome_id: number | null;
  outcome_version: number | null;
};
type SavedReport = { project_slug: string; summary: string; next_action: string; priority: string | null };
type ThreadMessage = {
  id: number;
  body: string;
  kind: string;
  delivery_state: string;
  task_id: number | null;
  plan_version: number | null;
  outcome_version: number | null;
  created_at: string;
};
type ThreadQuestion = {
  id: number;
  question_key: string;
  question_version: number;
  question: string;
  options: string[];
  recommendation: string;
  blocks_work: boolean;
  status: string;
  task_id: number | null;
  plan_version: number | null;
  outcome_version: number | null;
  answers: { selected_option: string; comment: string; created_at: string }[];
};
type FleetThread = {
  messages: ThreadMessage[];
  questions: ThreadQuestion[];
  worker_label: string;
  model_label: string;
  delivery_blocker: string;
};

export type FleetDeskProps = {
  projects: FleetProject[];
  tasks: FleetTask[];
  savedReports: SavedReport[];
  thread: FleetThread;
  selectedProjectKey: string;
  selectedTaskId: number | null;
  onSelectProject: (key: string) => void;
  onSelectTask: (id: number | null) => void;
  onSaveMessage: (input: {
    project_key: string;
    work_item_id: number | null;
    plan_version: number | null;
    outcome_version: number | null;
    body: string;
    kind: "draft" | "note";
    client_request_id: string;
  }) => Promise<void>;
  onCreateQuestion: (input: {
    project_key: string;
    work_item_id: number | null;
    plan_version: number | null;
    outcome_version: number | null;
    question: string;
    options: string[];
    recommendation: string;
    blocks_work: boolean;
    request_id: string;
  }) => Promise<void>;
  onAnswerQuestion: (input: {
    question_id: number;
    question_version: number;
    task_plan_version: number | null;
    outcome_version: number | null;
    selected_option: string;
    comment: string;
  }) => Promise<void>;
  onProposeNextWork: (report: SavedReport) => void;
  loading: boolean;
  error: string | null;
  canAnswer: boolean;
};

function requestId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `fleet-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function displayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value || "Date unavailable"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function version(value: number | null | undefined) {
  return value == null ? "Not set" : `v${value}`;
}

function deliveryLabel(state: string) {
  const labels: Record<string, string> = {
    draft: "Stored draft · not sent",
    dashboard_only: "Dashboard-only · not sent",
    queued: "Queued for owner follow-up · not sent",
    sent: "Sent to provider",
    acknowledged: "Provider acknowledged",
    blocked: "Blocked · not sent",
    failed: "Delivery failed",
  };
  return labels[state] ?? "Delivery state unknown";
}

export default function FleetDesk({
  projects,
  tasks,
  savedReports,
  thread,
  selectedProjectKey,
  selectedTaskId,
  onSelectProject,
  onSelectTask,
  onSaveMessage,
  onCreateQuestion,
  onAnswerQuestion,
  onProposeNextWork,
  loading,
  error,
  canAnswer,
}: FleetDeskProps) {
  const [message, setMessage] = useState("");
  const [messageContext, setMessageContext] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionContext, setQuestionContext] = useState("");
  const [questionOptions, setQuestionOptions] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const [blocksWork, setBlocksWork] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { selected: string; comment: string }>>({});
  const [busy, setBusy] = useState("");
  const [feedback, setFeedback] = useState("");
  const [proposalProject, setProposalProject] = useState("");
  const [proposalReportIndex, setProposalReportIndex] = useState("");

  const selectedProject = projects.find((project) => project.key === selectedProjectKey);
  const availableTasks = useMemo(
    () => tasks.filter((task) => task.project_key === selectedProjectKey),
    [tasks, selectedProjectKey],
  );
  const selectedTask = availableTasks.find((task) => task.id === selectedTaskId);
  const currentContext = `${selectedProjectKey}|${selectedTask?.id ?? "none"}|${selectedTask?.plan_version ?? "none"}|${selectedTask?.outcome_version ?? "none"}`;
  const messageRetargeted = !!message.trim() && !!messageContext && messageContext !== currentContext;
  const questionRetargeted = !!(questionText.trim() || questionOptions.trim() || recommendation.trim()) && !!questionContext && questionContext !== currentContext;
  useEffect(() => {
    if (!questionText.trim() && !questionOptions.trim() && !recommendation.trim()) setQuestionContext("");
  }, [questionText, questionOptions, recommendation]);
  const pendingQuestions = thread.questions.filter((question) =>
    ["open", "pending", "awaiting_owner", "needs_decision"].includes(question.status.toLowerCase()),
  );
  const orderedMessages = [...thread.messages].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id,
  );
  const currentProposalReports = savedReports.filter((report) => {
    const project = projects.find((item) => item.key === report.project_slug);
    const label = `${report.project_slug} ${project?.label ?? ""}`.toLowerCase();
    return report.project_slug === proposalProject && !/finance|ddg[\s_-]*music/.test(label);
  });
  const proposalReport = proposalReportIndex === "" ? undefined : currentProposalReports[Number(proposalReportIndex)];

  async function saveMessage(kind: "draft" | "note") {
    const body = message.trim();
    if (!body || !selectedProjectKey) return;
    setBusy("message");
    setFeedback("");
    try {
      await onSaveMessage({
        project_key: selectedProjectKey,
        work_item_id: selectedTask?.id ?? null,
        plan_version: selectedTask?.plan_version ?? null,
        outcome_version: selectedTask?.outcome_version ?? null,
        body,
        kind,
        client_request_id: requestId(),
      });
      setMessage("");
      setMessageContext("");
      setFeedback(kind === "draft" ? "Draft saved." : "Dashboard note saved.");
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : "Could not save this item.");
    } finally {
      setBusy("");
    }
  }

  async function createQuestion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const options = questionOptions.split("\n").map((option) => option.trim()).filter(Boolean);
    if (!questionText.trim() || options.length < 2 || !selectedProjectKey) return;
    setBusy("question");
    setFeedback("");
    try {
      await onCreateQuestion({
        project_key: selectedProjectKey,
        work_item_id: selectedTask?.id ?? null,
        plan_version: selectedTask?.plan_version ?? null,
        outcome_version: selectedTask?.outcome_version ?? null,
        question: questionText.trim(),
        options,
        recommendation: recommendation.trim(),
        blocks_work: blocksWork,
        request_id: requestId(),
      });
      setQuestionText("");
      setQuestionOptions("");
      setRecommendation("");
      setQuestionContext("");
      setBlocksWork(false);
      setFeedback("Question saved for owner review.");
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : "Could not save this question.");
    } finally {
      setBusy("");
    }
  }

  async function answerQuestion(question: ThreadQuestion) {
    const answer = answers[question.id];
    if (!answer?.selected) return;
    setBusy(`answer-${question.id}`);
    setFeedback("");
    try {
      await onAnswerQuestion({
        question_id: question.id,
        question_version: question.question_version,
        task_plan_version: question.plan_version,
        outcome_version: question.outcome_version,
        selected_option: answer.selected,
        comment: answer.comment.trim(),
      });
      setAnswers((current) => ({ ...current, [question.id]: { selected: "", comment: "" } }));
      setFeedback(`Answer recorded for question ${question.id}.`);
    } catch (cause) {
      setFeedback(cause instanceof Error ? cause.message : "Could not record this answer.");
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="fleet-desk" aria-labelledby="fleet-desk-title">
      <style>{`
        .fleet-desk{--fd-ink:#25352f;--fd-muted:#64736a;--fd-paper:#f2f0e8;--fd-glass:rgba(249,248,241,.82);--fd-line:rgba(45,65,54,.16);--fd-green:#496b57;--fd-amber:#9b6737;color:var(--fd-ink);font-family:inherit}
        .fleet-desk *{box-sizing:border-box}
        .fleet-desk button,.fleet-desk input,.fleet-desk select,.fleet-desk textarea{font:inherit}
        .fleet-shell{border:1px solid var(--fd-line);border-radius:20px;padding:clamp(14px,2vw,22px);background:linear-gradient(145deg,rgba(251,250,245,.92),rgba(235,237,226,.82));box-shadow:0 14px 36px rgba(35,48,39,.09);backdrop-filter:blur(14px)}
        .fleet-head{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:15px}
        .fleet-eyebrow{font-size:.7rem;letter-spacing:.13em;text-transform:uppercase;color:var(--fd-muted);font-weight:750}
        .fleet-head h2{font-size:1.25rem;margin:3px 0 0;letter-spacing:-.035em}
        .fleet-presence{display:flex;gap:7px;align-items:center;color:var(--fd-muted);font-size:.78rem;white-space:nowrap}
        .fleet-presence:before{content:"";width:8px;height:8px;border-radius:50%;background:#89968a;box-shadow:0 0 0 3px rgba(137,150,138,.14)}
        .fleet-context{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:13px}
        .fleet-context-card,.fleet-panel{border:1px solid var(--fd-line);border-radius:15px;background:var(--fd-glass)}
        .fleet-context-card{padding:12px 14px;min-width:0}
        .fleet-context-card label,.fleet-label{display:block;font-size:.72rem;font-weight:750;color:var(--fd-muted);letter-spacing:.045em;margin-bottom:6px}
        .fleet-context-card select{width:100%;border:0;background:transparent;color:var(--fd-ink);font-size:.95rem;font-weight:700;padding:2px 26px 2px 0}
        .fleet-context-card select:focus-visible,.fleet-desk :is(button,input,select,textarea,summary):focus-visible{outline:3px solid #b57c43;outline-offset:3px}
        .fleet-taskline{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:.9rem;font-weight:700}
        .fleet-taskline span:first-child{overflow:hidden;text-overflow:ellipsis}
        .fleet-versions{font-size:.71rem;color:var(--fd-muted);font-weight:550;white-space:nowrap}
        .fleet-pills{display:flex;flex-wrap:wrap;gap:6px;margin-top:7px}
        .fleet-pill{border-radius:999px;background:#e7eadf;padding:4px 8px;font-size:.68rem;color:#526257;font-weight:700}
        .fleet-pill.hold{background:#f2e6d6;color:#805628}
        .fleet-grid{display:grid;grid-template-columns:minmax(0,1.08fr) minmax(280px,.92fr);gap:12px;align-items:start}
        .fleet-column{display:grid;gap:12px;min-width:0}
        .fleet-panel{padding:15px}
        .fleet-panel-heading{display:flex;justify-content:space-between;align-items:baseline;gap:10px;margin-bottom:10px}
        .fleet-panel h3{font-size:.96rem;letter-spacing:-.02em;margin:0}
        .fleet-count{color:var(--fd-muted);font-size:.72rem}
        .fleet-copy{font-size:.78rem;line-height:1.5;color:var(--fd-muted);margin:6px 0 12px}
        .fleet-note{font-size:.74rem;line-height:1.5;border-left:2px solid #b68b5b;padding:5px 9px;margin:10px 0;color:#69563f;background:rgba(230,218,195,.28)}
        .fleet-form{display:grid;gap:9px}
        .fleet-form label{display:grid;gap:5px;font-size:.74rem;font-weight:700;color:#53635a}
        .fleet-form :is(input,select,textarea){width:100%;border:1px solid var(--fd-line);border-radius:9px;padding:9px 10px;color:var(--fd-ink);background:rgba(255,255,252,.75);font-size:.83rem}
        .fleet-form textarea{min-height:76px;resize:vertical}
        .fleet-form textarea.short{min-height:58px}
        .fleet-actions{display:flex;flex-wrap:wrap;gap:7px}
        .fleet-button{border:1px solid #56715d;border-radius:9px;background:#496b57;color:#fff;padding:8px 12px;font-size:.77rem;font-weight:750;cursor:pointer}
        .fleet-button.secondary{background:#f7f5ed;color:#3c5545;border-color:var(--fd-line)}
        .fleet-button:disabled{opacity:.55;cursor:not-allowed}
        .fleet-question{border-top:1px solid var(--fd-line);padding:12px 0 2px}
        .fleet-question:first-of-type{border-top:0;padding-top:2px}
        .fleet-question h4{font-size:.84rem;line-height:1.4;margin:4px 0 7px}
        .fleet-question-meta{display:flex;flex-wrap:wrap;gap:5px}
        .fleet-question-meta span{font-size:.66rem;color:#526257;background:#e9ebe2;padding:4px 7px;border-radius:99px}
        .fleet-question-meta .blocking{background:#f2e6d6;color:#805628}
        .fleet-options{display:grid;gap:4px;margin:8px 0;color:#57665d;font-size:.75rem}
        .fleet-options li::marker{color:#82917f}
        .fleet-answer{display:grid;gap:7px;margin-top:9px}
        .fleet-answer select,.fleet-answer input{min-width:0;width:100%;border:1px solid var(--fd-line);border-radius:8px;padding:8px;background:#fffefa;color:var(--fd-ink);font-size:.76rem}
        .fleet-answer-row{display:grid;grid-template-columns:1fr auto;gap:7px}
        .fleet-answer-history{border-left:2px solid #d9ddcf;margin:8px 0 0 3px;padding-left:10px;font-size:.73rem;color:var(--fd-muted)}
        .fleet-answer-history p{margin:5px 0}
        .fleet-message{padding:9px 0;border-top:1px solid var(--fd-line)}
        .fleet-message:first-child{border-top:0}
        .fleet-message p{margin:4px 0;font-size:.78rem;line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}
        .fleet-message small{font-size:.68rem;color:var(--fd-muted)}
        .fleet-disclosure{border-top:1px solid var(--fd-line);margin-top:11px;padding-top:9px}
        .fleet-disclosure summary{cursor:pointer;font-size:.75rem;color:#526257;font-weight:750}
        .fleet-status{font-size:.74rem;min-height:1em;color:#496b57;margin:0}
        .fleet-status.error{color:#8a4d37}
        .fleet-report-preview{padding:10px;border-radius:10px;background:#edf0e7;border:1px solid var(--fd-line);font-size:.78rem;line-height:1.45}
        .fleet-report-preview p{margin:5px 0}
        @media(max-width:720px){.fleet-grid{grid-template-columns:1fr}.fleet-context{grid-template-columns:1fr}.fleet-head{align-items:center}.fleet-head h2{font-size:1.1rem}.fleet-presence{font-size:.7rem}}
      `}</style>
      <div className="fleet-shell">
        <header className="fleet-head">
          <div>
            <div className="fleet-eyebrow">DDG Control · shared operations notebook</div>
            <h2 id="fleet-desk-title">Fleet Desk</h2>
          </div>
          <div className="fleet-presence" aria-label={`Worker status: ${thread.worker_label.trim() || "No active worker"}`}>
            {thread.worker_label.trim() || "No active worker"}
          </div>
        </header>

        {error && <p className="fleet-status error" role="alert">{error}</p>}
        {loading && <p className="fleet-copy" role="status">Refreshing the desk…</p>}

        <div className="fleet-context">
          <div className="fleet-context-card">
            <label htmlFor="fleet-project">Current project</label>
            <select id="fleet-project" value={selectedProjectKey} onChange={(event) => onSelectProject(event.target.value)}>
              {projects.length === 0 && <option value="">No projects available</option>}
              {projects.map((project) => <option key={project.key} value={project.key}>{project.label}</option>)}
            </select>
            <div className="fleet-pills">
              <span className="fleet-pill">{selectedProject?.enabled ? "Enabled" : "Not enabled"}</span>
              {selectedProject?.financeHeld && <span className="fleet-pill hold">Finance hold</span>}
            </div>
          </div>
          <div className="fleet-context-card">
            <label htmlFor="fleet-task">Current task</label>
            <select id="fleet-task" value={selectedTask?.id ?? ""} onChange={(event) => onSelectTask(event.target.value ? Number(event.target.value) : null)}>
              <option value="">No task selected</option>
              {availableTasks.map((task) => <option key={task.id} value={task.id}>#{task.id} · {task.title}</option>)}
            </select>
            <div className="fleet-taskline">
              <span>{selectedTask ? `${selectedTask.status} · #${selectedTask.id}` : "No task selected"}</span>
              <span className="fleet-versions">Plan {version(selectedTask?.plan_version)} · Outcome {version(selectedTask?.outcome_version)}</span>
            </div>
          </div>
        </div>

        <div className="fleet-grid">
          <div className="fleet-column">
            <section className="fleet-panel" aria-labelledby="fleet-conversation-title">
              <div className="fleet-panel-heading">
                <h3 id="fleet-conversation-title">Operations conversation</h3>
                <span className="fleet-count">Owner-side notes</span>
              </div>
              <div className="fleet-pills">
                <span className="fleet-pill">Model: {thread.model_label.trim() || "Model unknown"}</span>
                {selectedTask && <span className="fleet-pill">Plan {version(selectedTask.plan_version)} · Outcome {version(selectedTask.outcome_version)}</span>}
              </div>
              <p className="fleet-note">
                Saving here does not deliver to a provider. {thread.delivery_blocker.trim() || "Provider delivery is unavailable."}
                {" "}Any active-provider-run text is queued only for possible owner follow-up; it does not cancel or alter an active run.
              </p>
              <p className="fleet-copy">Voice: planned, not active. No ChatGPT quota signal or automatic provider switch is connected.</p>
              <form className="fleet-form" onSubmit={(event) => { event.preventDefault(); void saveMessage("draft"); }}>
                <label htmlFor="fleet-message">Add to this project’s notebook</label>
                <textarea id="fleet-message" value={message} onChange={(event) => { if(!message.trim() && event.target.value.trim()) setMessageContext(currentContext); if(!event.target.value.trim()) setMessageContext(""); setMessage(event.target.value); }} placeholder="Write a short draft or dashboard note…" />
                {messageRetargeted && <p className="fleet-status error" role="alert">This draft belongs to an earlier project/task version. It will not be retargeted. Clear it or return to its original context.</p>}
                {messageRetargeted && <button type="button" className="fleet-button secondary" onClick={() => {setMessage("");setMessageContext("");}}>Clear draft</button>}
                <div className="fleet-actions">
                  <button className="fleet-button" type="submit" disabled={busy === "message" || !message.trim() || !selectedProjectKey || messageRetargeted}>
                    {busy === "message" ? "Saving…" : "Save draft"}
                  </button>
                  <button className="fleet-button secondary" type="button" disabled={busy === "message" || !message.trim() || !selectedProjectKey || messageRetargeted} onClick={() => void saveMessage("note")}>
                    Save dashboard note
                  </button>
                </div>
              </form>
              {feedback && <p className={`fleet-status${error ? " error" : ""}`} role="status">{feedback}</p>}
              {orderedMessages.length > 0 ? (
                <>
                  <div className="fleet-disclosure">
                    <strong className="fleet-label">Recent notes</strong>
                    {orderedMessages.slice(0, 2).map((item) => (
                      <article className="fleet-message" key={item.id}>
                        <small>{item.kind} · {displayDate(item.created_at)} · {deliveryLabel(item.delivery_state)}</small>
                        <p>{item.body}</p>
                      </article>
                    ))}
                  </div>
                  {orderedMessages.length > 2 && <details className="fleet-disclosure">
                    <summary>Older conversation · {orderedMessages.length - 2} more</summary>
                    {orderedMessages.slice(2).map((item) => <article className="fleet-message" key={item.id}>
                      <small>{item.kind} · {displayDate(item.created_at)} · {deliveryLabel(item.delivery_state)} · Task {item.task_id ?? "none"} · Plan {version(item.plan_version)} · Outcome {version(item.outcome_version)}</small>
                      <p>{item.body}</p>
                    </article>)}
                  </details>}
                </>
              ) : <p className="fleet-copy">No saved conversation yet. Notes stay in this dashboard until an owner decides what to do with them.</p>}
            </section>

            <section className="fleet-panel" aria-labelledby="fleet-question-create-title">
              <div className="fleet-panel-heading"><h3 id="fleet-question-create-title">Ask the owner</h3></div>
              <p className="fleet-copy">Record a decision request against the current project and task context.</p>
              <form className="fleet-form" onSubmit={(event) => void createQuestion(event)}>
                <label htmlFor="fleet-question">Question</label>
                <textarea className="short" id="fleet-question" value={questionText} onChange={(event) => {if(!questionContext && event.target.value.trim())setQuestionContext(currentContext);setQuestionText(event.target.value);}} required placeholder="What needs an owner decision?" />
                <label htmlFor="fleet-options">Options · one per line, at least two</label>
                <textarea className="short" id="fleet-options" value={questionOptions} onChange={(event) => {if(!questionContext && event.target.value.trim())setQuestionContext(currentContext);setQuestionOptions(event.target.value);}} required placeholder={"Option one\nOption two"} />
                <label htmlFor="fleet-recommendation">Recommendation</label>
                <input id="fleet-recommendation" value={recommendation} onChange={(event) => {if(!questionContext && event.target.value.trim())setQuestionContext(currentContext);setRecommendation(event.target.value);}} required placeholder="Recommended option and reason" />
                <label><span><input type="checkbox" checked={blocksWork} onChange={(event) => setBlocksWork(event.target.checked)} /> This blocks work</span></label>
                {questionRetargeted && <p className="fleet-status error" role="alert">This question belongs to an earlier project/task version. Clear it or return to the original context.</p>}
                {questionRetargeted && <button type="button" className="fleet-button secondary" onClick={() => {setQuestionText("");setQuestionOptions("");setRecommendation("");setQuestionContext("");}}>Clear question</button>}
                <button className="fleet-button" disabled={busy === "question" || !selectedProjectKey || questionRetargeted || questionOptions.split("\n").filter((item) => item.trim()).length < 2}>
                  {busy === "question" ? "Saving…" : "Save owner question"}
                </button>
              </form>
            </section>
          </div>

          <div className="fleet-column">
            <section className="fleet-panel" aria-labelledby="fleet-decisions-title">
              <div className="fleet-panel-heading">
                <h3 id="fleet-decisions-title">Needs your decision</h3>
                <span className="fleet-count">{pendingQuestions.length} open</span>
              </div>
              {pendingQuestions.length ? pendingQuestions.map((question) => {
                const latestAnswer = question.answers[question.answers.length - 1];
                const answer = answers[question.id] ?? { selected: "", comment: "" };
                return <article className="fleet-question" key={question.id}>
                  <div className="fleet-question-meta">
                    <span>Question #{question.id}</span><span>{question.question_key} · v{question.question_version}</span>
                    <span className={question.blocks_work ? "blocking" : ""}>{question.blocks_work ? "Blocks work" : "Does not block work"}</span>
                  </div>
                  <h4>{question.question}</h4>
                  <div className="fleet-question-meta"><span>Task {question.task_id ?? "none"}</span><span>Plan {version(question.plan_version)}</span><span>Outcome {version(question.outcome_version)}</span></div>
                  <ul className="fleet-options">{question.options.map((option, index) => <li key={`${option}-${index}`}>{option}</li>)}</ul>
                  {question.recommendation && <p className="fleet-copy"><strong>Recommendation:</strong> {question.recommendation}</p>}
                  {latestAnswer && <p className="fleet-note"><strong>Current answer:</strong> {latestAnswer.selected_option}{latestAnswer.comment ? ` — ${latestAnswer.comment}` : ""} · {displayDate(latestAnswer.created_at)}</p>}
                  {question.answers.length > 1 && <details className="fleet-disclosure">
                    <summary>Answer history · {question.answers.length} entries</summary>
                    <div className="fleet-answer-history">{question.answers.map((item, index) => <p key={`${item.created_at}-${index}`}>{displayDate(item.created_at)} · {item.selected_option}{item.comment ? ` — ${item.comment}` : ""}</p>)}</div>
                  </details>}
                  <div className="fleet-answer">
                    <label className="fleet-label" htmlFor={`fleet-answer-${question.id}`}>Record an owner answer</label>
                    {!canAnswer && <p className="fleet-note">A verified owner session is required to record an answer; development bypass does not count.</p>}
                    <div className="fleet-answer-row">
                      <select id={`fleet-answer-${question.id}`} value={answer.selected} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: { ...answer, selected: event.target.value } }))}>
                        <option value="">Choose an option</option>
                        {question.options.map((option, index) => <option key={`${option}-${index}`} value={option}>{option}</option>)}
                      </select>
                      <button type="button" className="fleet-button" disabled={!canAnswer || !answer.selected || busy === `answer-${question.id}`} onClick={() => void answerQuestion(question)}>
                        {busy === `answer-${question.id}` ? "Saving…" : "Record answer"}
                      </button>
                    </div>
                    <input aria-label={`Comment for question ${question.id}`} value={answer.comment} onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: { ...answer, comment: event.target.value } }))} placeholder="Optional note" />
                    <p className="fleet-note">An answer records the owner’s choice only. It does not resume, approve, merge, deploy, or spend.</p>
                  </div>
                </article>;
              }) : <p className="fleet-copy">Nothing is waiting on an owner decision.</p>}
              {thread.questions.length > pendingQuestions.length && <details className="fleet-disclosure">
                <summary>Closed decision history · {thread.questions.length - pendingQuestions.length}</summary>
                {thread.questions.filter((question) => !pendingQuestions.includes(question)).map((question) => <article className="fleet-question" key={question.id}>
                  <div className="fleet-question-meta"><span>Question #{question.id} · {question.question_key} · v{question.question_version}</span><span>{question.status}</span></div>
                  <h4>{question.question}</h4>
                  {question.answers.map((item, index) => <p className="fleet-copy" key={`${item.created_at}-${index}`}>{displayDate(item.created_at)} · {item.selected_option}{item.comment ? ` — ${item.comment}` : ""}</p>)}
                </article>)}
              </details>}
            </section>

            <section className="fleet-panel" aria-labelledby="fleet-proposal-title">
              <div className="fleet-panel-heading"><h3 id="fleet-proposal-title">Propose next work</h3></div>
              <p className="fleet-copy">Preview one saved report for one project, then pass that report to the owner callback. Finance and DDG Music are excluded.</p>
              <div className="fleet-form">
                <label htmlFor="fleet-proposal-project">Project</label>
                <select id="fleet-proposal-project" value={proposalProject} onChange={(event) => { setProposalProject(event.target.value); setProposalReportIndex(""); }}>
                  <option value="">Choose a project</option>
                  {projects.filter((project) => !/finance|ddg[\s_-]*music/.test(`${project.key} ${project.label}`.toLowerCase())).map((project) => <option key={project.key} value={project.key}>{project.label}</option>)}
                </select>
                <label htmlFor="fleet-proposal-report">Saved report</label>
                <select id="fleet-proposal-report" value={proposalReportIndex} onChange={(event) => setProposalReportIndex(event.target.value)} disabled={!proposalProject || currentProposalReports.length === 0}>
                  <option value="">Choose a report</option>
                  {currentProposalReports.map((report, index) => <option key={`${report.project_slug}-${index}`} value={index}>{report.priority ? `${report.priority} · ` : ""}{report.summary.slice(0, 90)}</option>)}
                </select>
              </div>
              {proposalReport ? <div className="fleet-report-preview" aria-live="polite">
                <strong>Preview · {proposalReport.project_slug}</strong>
                <p>{proposalReport.summary}</p>
                <p><strong>Next action:</strong> {proposalReport.next_action}</p>
                {proposalReport.priority && <small>Priority: {proposalReport.priority}</small>}
                <div className="fleet-actions" style={{ marginTop: 9 }}>
                  <button className="fleet-button" type="button" onClick={() => onProposeNextWork(proposalReport)}>Propose this next work</button>
                </div>
              </div> : <p className="fleet-copy">{proposalProject ? "No saved reports are available for this project." : "Choose a project to see its saved reports."}</p>}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
