import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  getListAgentRunsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  useListAgentRuns,
  useRunOllie,
} from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { serverErrorText } from '@/lib/errors';
import { formatBrisbaneDateTime, formatCurrentDisplayName } from '@/lib/format';
import { LEGACY_REPORT_GENERATION_ENABLED, LEGACY_REPORT_GENERATION_BLOCKER } from '@workspace/project-constants';

type CursorModelsResponse = {
  status: 'not_configured' | 'connected';
  models: Array<{ id: string; displayName: string; description?: string }>;
};

async function loadCursorModels(): Promise<CursorModelsResponse> {
  const response = await fetch('/api/cursor/models', {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Unable to read Cursor models. Check the API key and try again.');
  }
  return response.json() as Promise<CursorModelsResponse>;
}

export function AgentsPage() {
  const client = useQueryClient();
  const cursorModelsQuery = useQuery({
    queryKey: ['cursor-models'],
    queryFn: loadCursorModels,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const runsQuery = useListAgentRuns({
    query: { queryKey: getListAgentRunsQueryKey() },
  });
  const [runNotice, setRunNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const runMutation = useRunOllie({
    mutation: {
      onSuccess: async (run) => {
        setRunNotice({
          text: `Run status: ${run.status}${run.error ? ` — ${formatCurrentDisplayName(run.error)}` : ''}`,
          isError: run.status === 'error' || run.status === 'invalid',
        });
        await Promise.all([
          client.invalidateQueries({ queryKey: getListAgentRunsQueryKey() }),
          client.invalidateQueries({ queryKey: getListLatestAgentUpdatesQueryKey() }),
        ]);
      },
      onError: (error) => {
        setRunNotice({
          text: serverErrorText(error, 'Unable to run Heimdall.'),
          isError: true,
        });
      },
    },
  });
  const runs = runsQuery.data ?? [];

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main agents-main">
        <Link className="back-link" href="/" data-testid="link-agents-home">← Home</Link>
        <div className="detail-heading agents-heading">
          <p className="eyebrow">Team activity</p>
          <h1 className="detail-title">Agents</h1>
          <p className="detail-description">Daily report runs and their results.</p>
        </div>

        <section className="agents-run-panel" aria-labelledby="agents-run-title">
          <div className="agents-run-toolbar">
            <h2 id="agents-run-title" className="todo-group-title">Heimdall</h2>
            <button
              className="task-primary-button"
              type="button"
              disabled={!LEGACY_REPORT_GENERATION_ENABLED || runMutation.isPending}
              onClick={() => {
                if (!LEGACY_REPORT_GENERATION_ENABLED) return;
                setRunNotice(null);
                runMutation.mutate({ data: {} });
              }}
              data-testid="button-run-ollie"
            >
              {!LEGACY_REPORT_GENERATION_ENABLED ? 'Report generation paused' : runMutation.isPending ? 'Running…' : 'Run Heimdall now'}
            </button>
          </div>
          {!LEGACY_REPORT_GENERATION_ENABLED && <p className="agents-run-notice" role="note">{LEGACY_REPORT_GENERATION_BLOCKER}</p>}
          {runNotice && (
            <p
              className={runNotice.isError ? 'agents-run-notice agents-run-notice-error' : 'agents-run-notice'}
              role={runNotice.isError ? 'alert' : 'status'}
              data-testid="status-ollie-run"
            >
              {runNotice.text}
            </p>
          )}
        </section>

        <section className="agents-run-panel" aria-labelledby="cursor-models-title">
          <div className="agents-run-toolbar">
            <h2 id="cursor-models-title" className="todo-group-title">Cursor models</h2>
            <button
              className="task-secondary-button"
              type="button"
              disabled={cursorModelsQuery.isFetching}
              onClick={() => void cursorModelsQuery.refetch()}
              data-testid="button-refresh-cursor-models"
            >
              {cursorModelsQuery.isFetching ? 'Checking…' : 'Check models'}
            </button>
          </div>
          <p className="agents-run-notice">
            This is a read-only check. It does not start an agent. A model appearing here does not prove its use is included in your plan; check Cursor billing before starting any coding task.
          </p>
          {cursorModelsQuery.isLoading ? (
            <p className="task-state-message" role="status">Checking Cursor connection…</p>
          ) : cursorModelsQuery.isError ? (
            <p className="agents-run-notice agents-run-notice-error" role="alert">
              {serverErrorText(cursorModelsQuery.error, 'Unable to check Cursor models.')}
            </p>
          ) : cursorModelsQuery.data?.status === 'not_configured' ? (
            <p className="task-state-message" data-testid="status-cursor-not-configured">
              Cursor is not connected yet. Add CURSOR_API_KEY to Replit Secrets to check available models. Never put the key in this page or in GitHub.
            </p>
          ) : cursorModelsQuery.data?.models.length ? (
            <ul className="cursor-model-list" data-testid="list-cursor-models">
              {cursorModelsQuery.data.models.map((model) => (
                <li key={model.id}>
                  <strong>{model.displayName}</strong>
                  <code>{model.id}</code>
                  {model.description && <span>{model.description}</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="task-state-message" data-testid="status-no-cursor-models">
              Cursor is connected, but it returned no models.
            </p>
          )}
        </section>

        <section className="agents-history" aria-labelledby="agents-history-title">
          <h2 id="agents-history-title" className="section-rule">
            <span>Recent runs</span>
          </h2>
          {runsQuery.isLoading ? (
            <p className="task-state-message" role="status">Loading agent runs…</p>
          ) : runsQuery.isError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(runsQuery.error, 'Unable to load agent runs.')}</p>
              <button
                className="task-secondary-button"
                type="button"
                onClick={() => void runsQuery.refetch()}
              >
                Retry
              </button>
            </div>
          ) : runs.length === 0 ? (
            <p className="task-state-message" data-testid="status-no-agent-runs">No agent runs yet</p>
          ) : (
            <ol className="agents-run-list" data-testid="list-agent-runs">
              {runs.map((run) => (
                <li className="agents-run-card" key={run.id} data-testid={`card-agent-run-${run.id}`}>
                  <div className="agents-run-header">
                    <strong>{formatCurrentDisplayName(run.member_name)}</strong>
                    <span className={`agents-run-status agents-run-status-${run.status}`}>
                      {run.status}
                    </span>
                  </div>
                  <p className="agents-run-date">Started {formatBrisbaneDateTime(run.started_at)}</p>
                  <div className="agents-run-tokens">
                    <span>Input tokens: {run.input_tokens ?? 'No data yet'}</span>
                    <span>Output tokens: {run.output_tokens ?? 'No data yet'}</span>
                  </div>
                  {run.error && <p className="agents-run-error">{run.error}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </main>
    </div>
  );
}
