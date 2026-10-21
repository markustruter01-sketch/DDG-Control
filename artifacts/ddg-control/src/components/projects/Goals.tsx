import { useState, type FormEvent } from 'react';
import { queryClient } from '@/lib/query-client';
import {
  getListLatestAgentUpdatesQueryKey,
  getListProjectGoalsQueryKey,
  useCreateProjectGoal,
  useListProjectGoals,
  useListLatestAgentUpdates,
  useUpdateGoal,
  type Goal,
  type GoalInput,
  type GoalUpdate,
} from '@workspace/api-client-react';
import { GOAL_STATUSES, GOAL_STATUS_LABELS, BUSINESS_BRIEFS, type GoalStatus } from '@workspace/project-constants';
import { serverErrorText } from '@/lib/errors';
import { formatCurrentDisplayName } from '@/lib/format';
import { formatBrisbaneDateTime, formatCompletedDate, formatDueDate } from '@/lib/format';

type GoalDraft = {
  title: string;
  targetDate: string;
  notes: string;
  status: GoalStatus;
};

function emptyGoalDraft(): GoalDraft {
  return {
    title: '',
    targetDate: '',
    notes: '',
    status: GOAL_STATUSES[0],
  };
}

function goalDraftFromGoal(goal: Goal): GoalDraft {
  return {
    title: goal.title,
    targetDate: goal.target_date ?? '',
    notes: goal.notes ?? '',
    status: goal.status as GoalStatus,
  };
}

function GoalEditorForm({
  mode,
  draft,
  isPending,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit';
  draft: GoalDraft;
  isPending: boolean;
  error: unknown;
  onChange: (field: keyof GoalDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <form className="task-editor-form goal-editor-form" onSubmit={onSubmit}>
      <label className="task-field task-field-wide">
        Title
        <input
          required
          maxLength={200}
          value={draft.title}
          onChange={(event) => onChange('title', event.target.value)}
          data-testid="input-goal-title"
        />
      </label>
      {mode === 'edit' && (
        <label className="task-field">
          Status
          <select
            value={draft.status}
            onChange={(event) => onChange('status', event.target.value)}
            data-testid="select-goal-status"
          >
            {GOAL_STATUSES.map((status) => (
              <option key={status} value={status}>{GOAL_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </label>
      )}
      <label className="task-field">
        Target date <span className="task-field-optional">(optional)</span>
        <input
          type="date"
          value={draft.targetDate}
          onChange={(event) => onChange('targetDate', event.target.value)}
          data-testid="input-goal-target-date"
        />
      </label>
      <label className="task-field task-field-wide">
        Notes <span className="task-field-optional">(optional)</span>
        <textarea
          maxLength={2000}
          value={draft.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          data-testid="input-goal-notes"
        />
      </label>
      {error != null && (
        <p className="task-form-error" role="alert" data-testid="error-save-goal">
          {serverErrorText(error, 'Unable to save goal.')}
        </p>
      )}
      <div className="task-form-actions">
        <button className="task-primary-button" type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Add goal' : 'Save'}
        </button>
        <button
          className="task-secondary-button"
          type="button"
          disabled={isPending}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function ProjectGoals({ slug }: { slug: string }) {
  const goalsQuery = useListProjectGoals(slug, {
    query: { queryKey: getListProjectGoalsQueryKey(slug) },
  });
  const agentUpdatesQuery = useListLatestAgentUpdates({
    query: {
      queryKey: getListLatestAgentUpdatesQueryKey(),
      staleTime: 60_000,
    },
  });
  const createGoalMutation = useCreateProjectGoal({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectGoalsQueryKey(slug),
        });
      },
    },
  });
  const updateGoalMutation = useUpdateGoal({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectGoalsQueryKey(slug),
        });
      },
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [draft, setDraft] = useState<GoalDraft>(emptyGoalDraft);
  const goals = goalsQuery.data ?? [];
  const latestUpdate = agentUpdatesQuery.data?.find(
    (update) => update.project_slug === slug,
  );
  const businessBrief = BUSINESS_BRIEFS[slug];
  const groupedGoals = GOAL_STATUSES
    .map((status) => ({
      status,
      goals: goals.filter((goal) => goal.status === status),
    }))
    .filter((group) => group.goals.length > 0);

  const updateDraft = (field: keyof GoalDraft, value: string) => {
    setDraft((current) => {
      if (field === 'status') return { ...current, status: value as GoalStatus };
      if (field === 'title') return { ...current, title: value };
      if (field === 'targetDate') return { ...current, targetDate: value };
      return { ...current, notes: value };
    });
  };

  const openCreateForm = () => {
    createGoalMutation.reset();
    updateGoalMutation.reset();
    setEditingGoal(null);
    setDraft(emptyGoalDraft());
    setIsAdding(true);
  };

  const openEditForm = (goal: Goal) => {
    createGoalMutation.reset();
    updateGoalMutation.reset();
    setIsAdding(false);
    setEditingGoal(goal);
    setDraft(goalDraftFromGoal(goal));
  };

  const cancelCreate = () => {
    createGoalMutation.reset();
    setIsAdding(false);
    setDraft(emptyGoalDraft());
  };

  const cancelEdit = () => {
    updateGoalMutation.reset();
    setEditingGoal(null);
    setDraft(emptyGoalDraft());
  };

  const saveNewGoal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createGoalMutation.reset();
    const data: GoalInput = {
      title: draft.title.trim(),
      target_date: draft.targetDate || null,
      notes: draft.notes.trim() || null,
    };

    try {
      await createGoalMutation.mutateAsync({ slug, data });
      setIsAdding(false);
      setDraft(emptyGoalDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  const saveGoalChanges = async (
    goal: Goal,
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    updateGoalMutation.reset();

    const changes: GoalUpdate = {};
    const title = draft.title.trim();
    const notes = draft.notes.trim() || null;
    const targetDate = draft.targetDate || null;
    const originalTargetDate = goal.target_date ?? null;
    if (title !== goal.title) changes.title = title;
    if (notes !== (goal.notes ?? null)) changes.notes = notes;
    if (draft.status !== goal.status) changes.status = draft.status;
    if (targetDate !== originalTargetDate) {
      changes.target_date = targetDate;
    }

    if (Object.keys(changes).length === 0) {
      setEditingGoal(null);
      setDraft(emptyGoalDraft());
      return;
    }

    try {
      await updateGoalMutation.mutateAsync({ id: goal.id, data: changes });
      setEditingGoal(null);
      setDraft(emptyGoalDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  const canShowGoalList = !goalsQuery.isLoading && !goalsQuery.isError;

  return (
    <section className="goal-workspace" data-testid="section-project-goals">
      <aside className="agent-latest-box" data-testid="box-ollie-latest">
        <h2 className="todo-group-title">Heimdall's latest</h2>
        {agentUpdatesQuery.isLoading ? (
          <p className="task-state-message" role="status">Loading Heimdall's latest…</p>
        ) : agentUpdatesQuery.isError ? (
          <p className="task-form-error" role="alert">
            {serverErrorText(agentUpdatesQuery.error, "Unable to load Heimdall's latest report.")}
          </p>
        ) : !latestUpdate ? (
          <p className="task-state-message" data-testid="status-no-ollie-report">
            No report from Heimdall yet
          </p>
        ) : (
          <>
            <div className="agent-update-light">
              <span
                className={`agent-light-dot agent-light-${latestUpdate.status_light}`}
                aria-hidden="true"
                data-testid={`agent-overview-light-${slug}`}
              />
              <span>{latestUpdate.status_light}</span>
              {latestUpdate.priority && (
                <span className={`priority-chip priority-${latestUpdate.priority}`} data-testid={`priority-overview-${slug}`}>
                  {latestUpdate.priority}
                </span>
              )}
            </div>
            <p className="agent-update-summary" data-testid={`agent-overview-summary-${slug}`}>
              {formatCurrentDisplayName(latestUpdate.summary)}
            </p>
            <div className="agent-update-risks">
              <strong>Risks</strong>
              {latestUpdate.risks.length > 0 ? (
                <ul>
                  {latestUpdate.risks.map((risk, index) => (
                    <li key={`${risk.text}-${index}`}>
                      {formatCurrentDisplayName(risk.text)}
                      {risk.severity && <span className={`risk-severity severity-${risk.severity}`}>{risk.severity}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="task-state-message">No risks listed</p>
              )}
            </div>
            <p className="agent-update-date" data-testid={`agent-overview-updated-${slug}`}>
              Updated {formatBrisbaneDateTime(latestUpdate.created_at)}
            </p>
          </>
        )}
      </aside>

      {businessBrief && (
        <aside className="business-brief-card" data-testid={`business-brief-${slug}`}>
          <h2>Business brief · updated {businessBrief.updated}</h2>
          <p>{formatCurrentDisplayName(businessBrief.text)}</p>
        </aside>
      )}

      <div className="todo-toolbar">
        <button
          className="task-primary-button"
          type="button"
          onClick={openCreateForm}
          data-testid="button-add-goal"
        >
          Add goal
        </button>
      </div>

      {isAdding && (
        <GoalEditorForm
          mode="create"
          draft={draft}
          isPending={createGoalMutation.isPending}
          error={createGoalMutation.error}
          onChange={updateDraft}
          onSubmit={saveNewGoal}
          onCancel={cancelCreate}
        />
      )}

      {goalsQuery.isLoading && (
        <p className="task-state-message" role="status">Loading goals…</p>
      )}
      {goalsQuery.isError && (
        <div className="task-query-error" role="alert">
          <p>{serverErrorText(goalsQuery.error, 'Unable to load goals.')}</p>
          <button
            className="task-secondary-button"
            type="button"
            onClick={() => void goalsQuery.refetch()}
          >
            Retry
          </button>
        </div>
      )}

      {canShowGoalList && goals.length === 0 && (
        <p className="task-state-message" data-testid="status-no-goals">No goals yet</p>
      )}
      {canShowGoalList && groupedGoals.map((group) => (
        <section
          className="todo-group"
          key={group.status}
          data-testid={`group-goals-${group.status}`}
        >
          <h2 className="todo-group-title">{GOAL_STATUS_LABELS[group.status]}</h2>
          <div className="todo-task-list">
            {group.goals.map((goal) => {
              const achievedDate = goal.status === 'achieved'
                ? formatCompletedDate(goal.achieved_at)
                : null;

              return (
                <article className="todo-task-card" key={goal.id} data-testid={`goal-${goal.id}`}>
                  {editingGoal?.id === goal.id ? (
                    <GoalEditorForm
                      mode="edit"
                      draft={draft}
                      isPending={updateGoalMutation.isPending}
                      error={updateGoalMutation.error}
                      onChange={updateDraft}
                      onSubmit={(event) => void saveGoalChanges(goal, event)}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <button
                      className="todo-task-trigger"
                      type="button"
                      onClick={() => openEditForm(goal)}
                      data-testid={`button-edit-goal-${goal.id}`}
                    >
                      <span className="todo-task-title">{goal.title}</span>
                      {(goal.target_date || achievedDate) && (
                        <span className="todo-task-meta">
                          {goal.target_date && (
                            <span>Target {formatDueDate(goal.target_date)}</span>
                          )}
                          {achievedDate && (
                            <span className="todo-task-completed">
                              Achieved · {achievedDate}
                            </span>
                          )}
                        </span>
                      )}
                      {goal.notes && <span className="goal-notes">{goal.notes}</span>}
                    </button>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </section>
  );
}
