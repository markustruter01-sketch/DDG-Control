import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  getListAgentRunsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  useListAgentRuns,
  useRunOllie,
} from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { serverErrorText } from '@/lib/errors';
import { formatBrisbaneDateTime } from '@/lib/format';

export function AgentsPage() {
  const client = useQueryClient();
  const runsQuery = useListAgentRuns({
    query: { queryKey: getListAgentRunsQueryKey() },
  });
  const [runNotice, setRunNotice] = useState<{ text: string; isError: boolean } | null>(null);
  const runMutation = useRunOllie({
    mutation: {
      onSuccess: async (run) => {
        setRunNotice({
          text: `Run status: ${run.status}${run.error ? ` — ${run.error}` : ''}`,
          isError: run.status === 'error' || run.status === 'invalid',
        });
        await Promise.all([
          client.invalidateQueries({ queryKey: getListAgentRunsQueryKey() }),
          client.invalidateQueries({ queryKey: getListLatestAgentUpdatesQueryKey() }),
        ]);
      },
      onError: (error) => {
        setRunNotice({
          text: serverErrorText(error, 'Unable to run Ollie.'),
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
            <h2 id="agents-run-title" className="todo-group-title">Ollie</h2>
            <button
              className="task-primary-button"
              type="button"
              disabled={runMutation.isPending}
              onClick={() => {
                setRunNotice(null);
                runMutation.mutate({ data: {} });
              }}
              data-testid="button-run-ollie"
            >
              {runMutation.isPending ? 'Running…' : 'Run Ollie now'}
            </button>
          </div>
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
                    <strong>{run.member_name}</strong>
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
