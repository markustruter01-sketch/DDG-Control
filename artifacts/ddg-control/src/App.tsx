import { useState, type FormEvent, type ReactNode } from 'react';
import {
  QueryClientProvider,
} from '@tanstack/react-query';
import { AuthGate } from '@/components/auth';
import { ColorModeProvider, Header } from '@/components/header';
import { queryClient } from '@/lib/query-client';
import { ProjectDetailContext } from '@/lib/router';
import {
  getGetCattleDogCoffeeProfitQueryKey,
  getGetProjectFinanceFleetHistoryQueryKey,
  getGetProjectFinanceFleetLatestQueryKey,
  getGetProjectQueryKey,
  getListDecisionsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  getListProjectGoalsQueryKey,
  getListProjectMetricsQueryKey,
  getListProjectDailySalesQueryKey,
  getListProjectMetricHistoryQueryKey,
  getListProjectOllieHistoryQueryKey,
  getListProjectNotesQueryKey,
  getListMembersQueryKey,
  getListProjectTasksQueryKey,
  getListProjectsQueryKey,
  useCreateProjectGoal,
  useCreateProjectTask,
  useGetCattleDogCoffeeProfit,
  useGetProjectFinanceFleetHistory,
  useGetProjectFinanceFleetLatest,
  useGetProject,
  useListDecisions,
  useListProjectGoals,
  useListMembers,
  useListLatestAgentUpdates,
  useListProjectTasks,
  useListProjectMetrics,
  useListProjectDailySales,
  useListProjectMetricHistory,
  useListProjectOllieHistory,
  useListProjectNotes,
  useRefreshProjectMetrics,
  useUpdateGoal,
  useUpdateTask,
  useUpdateProject,
  type FleetHistoryResponse,
  type FleetLatestSnapshotResponse,
  type Goal,
  type GoalInput,
  type GoalUpdate,
  type Member,
  type Project,
  type Task,
  type TaskInput,
  type TaskUpdate,
  type ProjectMetric,
  type MetricHistoryRow,
  type OllieHistoryRow,
  type ProjectNote,
} from '@workspace/api-client-react';
import {
  GOAL_STATUSES,
  GOAL_STATUS_LABELS,
  PROJECT_STATUSES,
  PROJECT_TABS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  METRIC_DEFINITIONS,
  BUSINESS_BRIEFS,
  type GoalStatus,
  type ProjectStatus,
  type TaskStatus,
} from '@workspace/project-constants';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Link,
  useParams,
  Router as WouterRouter,
} from 'wouter';
import {
  isNotFound,
  serverErrorText,
} from '@/lib/errors';
import {
  formatBrisbaneDateTime,
  formatCompletedDate,
  formatCurrencyCents,
  formatDueDate,
  formatFigure,
} from '@/lib/format';
import { sourceLabelForDecision } from '@/pages/Decisions';
import './ddg.css';

type TaskDraft = {
  title: string;
  ownerId: string;
  dueDate: string;
  notes: string;
  status: TaskStatus;
};

function emptyTaskDraft(): TaskDraft {
  return {
    title: '',
    ownerId: '',
    dueDate: '',
    notes: '',
    status: TASK_STATUSES[0],
  };
}

function taskDraftFromTask(task: Task): TaskDraft {
  return {
    title: task.title,
    ownerId: String(task.owner_id),
    dueDate: task.due_date ?? '',
    notes: task.notes ?? '',
    status: task.status as TaskStatus,
  };
}

function TaskEditorForm({
  mode,
  draft,
  members,
  isPending,
  error,
  onChange,
  onSubmit,
  onCancel,
}: {
  mode: 'create' | 'edit';
  draft: TaskDraft;
  members: Member[];
  isPending: boolean;
  error: unknown;
  onChange: (field: keyof TaskDraft, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  const isCreate = mode === 'create';

  return (
    <form
      className="task-editor-form"
      onSubmit={onSubmit}
      data-testid={isCreate ? 'form-create-task' : 'form-edit-task'}
    >
      <label className="task-field">
        <span>Title</span>
        <input
          type="text"
          required
          maxLength={200}
          value={draft.title}
          onChange={(event) => onChange('title', event.target.value)}
          data-testid="input-task-title"
        />
      </label>
      <label className="task-field">
        <span>Owner</span>
        <select
          required
          value={draft.ownerId}
          onChange={(event) => onChange('ownerId', event.target.value)}
          data-testid="select-task-owner"
        >
          <option value="">Select a member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>{member.name}</option>
          ))}
        </select>
      </label>
      <label className="task-field">
        <span>Due date <span className="task-field-optional">(optional)</span></span>
        <input
          type="date"
          value={draft.dueDate}
          onChange={(event) => onChange('dueDate', event.target.value)}
          data-testid="input-task-due-date"
        />
      </label>
      {mode === 'edit' && (
        <label className="task-field">
          <span>Status</span>
          <select
            value={draft.status}
            onChange={(event) => onChange('status', event.target.value)}
            data-testid="select-task-status"
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>{TASK_STATUS_LABELS[status]}</option>
            ))}
          </select>
        </label>
      )}
      <label className="task-field task-field-wide">
        <span>Notes <span className="task-field-optional">(optional)</span></span>
        <textarea
          rows={3}
          maxLength={2000}
          value={draft.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          data-testid="input-task-notes"
        />
      </label>
      {error != null && (
        <p className="task-form-error" role="alert" data-testid="error-save-task">
          {serverErrorText(error, isCreate ? 'Unable to create task.' : 'Unable to update task.')}
        </p>
      )}
      <div className="task-form-actions">
        <button
          className="task-primary-button"
          type="submit"
          disabled={isPending || members.length === 0}
          data-testid={isCreate ? 'button-submit-create-task' : 'button-submit-edit-task'}
        >
          {isPending ? 'Saving…' : isCreate ? 'Add task' : 'Save changes'}
        </button>
        <button
          className="task-secondary-button"
          type="button"
          disabled={isPending}
          onClick={onCancel}
          data-testid="button-cancel-task"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProjectTodo({ slug }: { slug: string }) {
  const tasksQuery = useListProjectTasks(slug, {
    query: { queryKey: getListProjectTasksQueryKey(slug) },
  });
  const membersQuery = useListMembers({
    query: { queryKey: getListMembersQueryKey() },
  });
  const createTaskMutation = useCreateProjectTask({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectTasksQueryKey(slug),
        });
      },
    },
  });
  const updateTaskMutation = useUpdateTask({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getListProjectTasksQueryKey(slug),
        });
      },
    },
  });
  const [isAdding, setIsAdding] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draft, setDraft] = useState<TaskDraft>(emptyTaskDraft);
  const tasks = tasksQuery.data ?? [];
  const members = membersQuery.data ?? [];
  const memberNames = new Map(members.map((member) => [member.id, member.name] as const));
  const groupedTasks = TASK_STATUSES
    .map((status) => ({
      status,
      tasks: tasks.filter((task) => task.status === status),
    }))
    .filter((group) => group.tasks.length > 0);
  const canShowTaskList = !tasksQuery.isLoading
    && !membersQuery.isLoading
    && !tasksQuery.isError
    && !membersQuery.isError;

  const updateDraft = (field: keyof TaskDraft, value: string) => {
    setDraft((current) => ({ ...current, [field]: value } as TaskDraft));
  };

  const openCreateForm = () => {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    setEditingTask(null);
    setDraft(emptyTaskDraft());
    setIsAdding(true);
  };

  const openEditForm = (task: Task) => {
    createTaskMutation.reset();
    updateTaskMutation.reset();
    setIsAdding(false);
    setEditingTask(task);
    setDraft(taskDraftFromTask(task));
  };

  const cancelCreate = () => {
    createTaskMutation.reset();
    setIsAdding(false);
    setDraft(emptyTaskDraft());
  };

  const cancelEdit = () => {
    updateTaskMutation.reset();
    setEditingTask(null);
    setDraft(emptyTaskDraft());
  };

  const saveNewTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createTaskMutation.reset();
    const ownerId = Number(draft.ownerId);
    if (!Number.isSafeInteger(ownerId) || ownerId < 1) return;

    const data: TaskInput = {
      title: draft.title.trim(),
      owner_id: ownerId,
      notes: draft.notes.trim() || null,
      due_date: draft.dueDate || null,
    };

    try {
      await createTaskMutation.mutateAsync({ slug, data });
      setIsAdding(false);
      setDraft(emptyTaskDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  const saveTaskChanges = async (task: Task, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateTaskMutation.reset();

    const changes: TaskUpdate = {};
    const title = draft.title.trim();
    const notes = draft.notes.trim() || null;
    const ownerId = Number(draft.ownerId);
    const dueDate = draft.dueDate || null;
    if (title !== task.title) changes.title = title;
    if (notes !== (task.notes ?? null)) changes.notes = notes;
    if (draft.status !== task.status) changes.status = draft.status;
    if (ownerId !== task.owner_id) changes.owner_id = ownerId;
    if (dueDate !== (task.due_date ?? null)) changes.due_date = dueDate;

    if (Object.keys(changes).length === 0) {
      setEditingTask(null);
      setDraft(emptyTaskDraft());
      return;
    }

    try {
      await updateTaskMutation.mutateAsync({ id: task.id, data: changes });
      setEditingTask(null);
      setDraft(emptyTaskDraft());
    } catch {
      // Keep the form open and show the server error.
    }
  };

  return (
    <section className="todo-workspace" data-testid="section-project-tasks">
      <div className="todo-toolbar">
        <button
          className="task-primary-button"
          type="button"
          onClick={openCreateForm}
          disabled={membersQuery.isLoading || membersQuery.isError || members.length === 0}
          data-testid="button-add-task"
        >
          Add task
        </button>
      </div>

      {isAdding && (
        <TaskEditorForm
          mode="create"
          draft={draft}
          members={members}
          isPending={createTaskMutation.isPending}
          error={createTaskMutation.error}
          onChange={updateDraft}
          onSubmit={saveNewTask}
          onCancel={cancelCreate}
        />
      )}

      {tasksQuery.isLoading || membersQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading tasks…</p>
      ) : null}
      {tasksQuery.isError && (
        <div className="task-query-error" role="alert">
          <p>{serverErrorText(tasksQuery.error, 'Unable to load tasks.')}</p>
          <button className="task-secondary-button" type="button" onClick={() => void tasksQuery.refetch()}>
            Retry
          </button>
        </div>
      )}
      {membersQuery.isError && (
        <div className="task-query-error" role="alert">
          <p>{serverErrorText(membersQuery.error, 'Unable to load members.')}</p>
          <button className="task-secondary-button" type="button" onClick={() => void membersQuery.refetch()}>
            Retry
          </button>
        </div>
      )}

      {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length === 0 && (
        <p className="task-state-message" data-testid="status-no-tasks">No tasks yet</p>
      )}
      {canShowTaskList && groupedTasks.map((group) => (
        <section className="todo-group" key={group.status} data-testid={`group-tasks-${group.status}`}>
          <h2 className="todo-group-title">{TASK_STATUS_LABELS[group.status]}</h2>
          <div className="todo-task-list">
            {group.tasks.map((task) => {
              const completedDate = task.status === 'done'
                ? formatCompletedDate(task.completed_at)
                : null;

              return (
                <article className="todo-task-card" key={task.id} data-testid={`task-${task.id}`}>
                  {editingTask?.id === task.id ? (
                    <TaskEditorForm
                      mode="edit"
                      draft={draft}
                      members={members}
                      isPending={updateTaskMutation.isPending}
                      error={updateTaskMutation.error}
                      onChange={updateDraft}
                      onSubmit={(event) => void saveTaskChanges(task, event)}
                      onCancel={cancelEdit}
                    />
                  ) : (
                    <button
                      className="todo-task-trigger"
                      type="button"
                      onClick={() => openEditForm(task)}
                      data-testid={`button-edit-task-${task.id}`}
                    >
                      <span className="todo-task-title">{task.title}</span>
                      <span className="todo-task-meta">
                        <span>{memberNames.get(task.owner_id) ?? 'Unknown owner'}</span>
                        {task.due_date && (
                          <span>Due {formatDueDate(task.due_date)}</span>
                        )}
                      </span>
                      {task.status === 'done' && (
                        <span className="todo-task-completed">
                          Completed{completedDate ? ` · ${completedDate}` : ''}
                        </span>
                      )}
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

function ProjectGoals({ slug }: { slug: string }) {
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
        <h2 className="todo-group-title">Ollie's latest</h2>
        {agentUpdatesQuery.isLoading ? (
          <p className="task-state-message" role="status">Loading Ollie's latest…</p>
        ) : agentUpdatesQuery.isError ? (
          <p className="task-form-error" role="alert">
            {serverErrorText(agentUpdatesQuery.error, "Unable to load Ollie's latest report.")}
          </p>
        ) : !latestUpdate ? (
          <p className="task-state-message" data-testid="status-no-ollie-report">
            No report from Ollie yet
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
              {latestUpdate.summary}
            </p>
            <div className="agent-update-risks">
              <strong>Risks</strong>
              {latestUpdate.risks.length > 0 ? (
                <ul>
                  {latestUpdate.risks.map((risk, index) => (
                    <li key={`${risk.text}-${index}`}>
                      {risk.text}
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
          <p>{businessBrief.text}</p>
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

function MetricValue({ metric }: { metric?: ProjectMetric }) {
  return <>{metric ? formatFigure(metric.value, metric.unit) : 'No data yet'}</>;
}

function ChartFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="data-chart-panel">
      <h3 className="todo-group-title">{title}</h3>
      {children}
    </section>
  );
}

function RevenueWorkspace({ slug }: { slug: string }) {
  const isCoffee = slug === 'cattle-dog-coffee';
  const profitQuery = useGetCattleDogCoffeeProfit({
    query: {
      queryKey: getGetCattleDogCoffeeProfitQueryKey(),
      enabled: isCoffee,
    },
  });
  const metricsQuery = useListProjectMetrics(slug, {
    query: { queryKey: getListProjectMetricsQueryKey(slug), enabled: isCoffee },
  });
  const dailySalesQuery = useListProjectDailySales(slug, {
    query: { queryKey: getListProjectDailySalesQueryKey(slug), enabled: isCoffee },
  });
  const historyParams = { key: 'sales_30d' };
  const historyQuery = useListProjectMetricHistory(slug, historyParams, {
    query: { queryKey: getListProjectMetricHistoryQueryKey(slug, historyParams), enabled: isCoffee },
  });
  const refreshMutation = useRefreshProjectMetrics();
  const refresh = async () => {
    try {
      await refreshMutation.mutateAsync({ slug });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getListProjectMetricsQueryKey(slug) }),
        queryClient.invalidateQueries({ queryKey: getListProjectDailySalesQueryKey(slug) }),
        queryClient.invalidateQueries({ queryKey: getListProjectMetricHistoryQueryKey(slug, historyParams) }),
        queryClient.invalidateQueries({ queryKey: getGetCattleDogCoffeeProfitQueryKey() }),
      ]);
    } catch {
      // Server response is rendered below.
    }
  };
  const metrics = metricsQuery.data ?? [];
  const historyRows: MetricHistoryRow[] = [...(historyQuery.data ?? [])]
    .sort((a, b) => a.captured_at.localeCompare(b.captured_at));
  const salesHistoryDomain: [number, number] | undefined = historyRows.length > 0
    ? [
      Math.min(...historyRows.map((row) => row.value)) * 0.99,
      Math.max(...historyRows.map((row) => row.value)) * 1.01,
    ]
    : undefined;
  const latestMetric = metrics.reduce<ProjectMetric | undefined>((latest, metric) => (
    !latest || new Date(metric.captured_at).getTime() > new Date(latest.captured_at).getTime()
      ? metric
      : latest
  ), undefined);
  if (!isCoffee) return <p className="data-empty">No data source yet</p>;

  return (
    <div className="data-workspace">
      <div className="data-toolbar">
        {latestMetric && <p className="data-updated">Updated {formatBrisbaneDateTime(latestMetric.captured_at)}</p>}
        <button className="task-secondary-button" type="button" disabled={refreshMutation.isPending} onClick={() => void refresh()} data-testid="button-refresh-project-metrics">
          {refreshMutation.isPending ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {refreshMutation.isError && <p className="data-error" role="alert">{serverErrorText(refreshMutation.error, 'Unable to refresh metrics.')}</p>}
      {metricsQuery.isLoading ? <p className="task-state-message" role="status">Loading metrics…</p> : metricsQuery.isError ? (
        <div className="task-query-error" role="alert"><p>{serverErrorText(metricsQuery.error, 'Unable to load metrics.')}</p><button className="task-secondary-button" type="button" onClick={() => void metricsQuery.refetch()}>Retry</button></div>
      ) : (
        <div className="metric-grid">
          {Object.entries(METRIC_DEFINITIONS).map(([key, definition]) => {
            const metric = metrics.find((entry) => entry.key === key);
            return <article className="metric-card" key={key}><span>{definition.label}</span><strong><MetricValue metric={metric} /></strong></article>;
          })}
        </div>
      )}
      <div className="chart-grid">
        <ChartFrame title="Daily sales · last 30 days">
          {dailySalesQuery.isLoading ? <p className="task-state-message">Loading daily sales…</p> : dailySalesQuery.isError ? (
            <p className="data-error" role="alert">{serverErrorText(dailySalesQuery.error, 'Unable to load daily sales.')}</p>
          ) : (dailySalesQuery.data?.length ?? 0) === 0 ? <p className="data-empty">No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailySalesQuery.data} margin={{ top: 10, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
                <XAxis dataKey="day" tickFormatter={(day: string) => formatDueDate(day)} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" minTickGap={25} />
                <YAxis tickFormatter={(value: number) => formatFigure(value, 'aud_cents')} width={60} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
                <Tooltip formatter={(value: number) => formatFigure(value, 'aud_cents')} labelFormatter={(day: string) => formatDueDate(day)} contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Bar dataKey="sales_cents" name="Sales" fill="hsl(var(--chart-1))" fillOpacity={0.88} radius={[2, 2, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartFrame>
        <ChartFrame title="Sales, last 30 days · history">
          {historyQuery.isLoading ? <p className="task-state-message">Loading sales history…</p> : historyQuery.isError ? (
            <p className="data-error" role="alert">{serverErrorText(historyQuery.error, 'Unable to load sales history.')}</p>
          ) : historyRows.length === 0 ? <p className="data-empty">No data yet</p> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={historyRows} margin={{ top: 10, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
                <XAxis dataKey="captured_at" tickFormatter={(value: string) => formatDueDate(value.slice(0, 10))} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" minTickGap={24} />
                <YAxis domain={salesHistoryDomain} tickFormatter={(value: number) => formatFigure(value, 'aud_cents')} width={60} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
                <Tooltip formatter={(value: number) => formatFigure(value, 'aud_cents')} labelFormatter={(value: string) => formatBrisbaneDateTime(value)} contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                <Line dataKey="value" name="Sales" type="monotone" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartFrame>
      </div>
      <section className="profit-loss-card data-chart-panel" aria-labelledby="profit-loss-title" data-testid="card-profit-loss">
        <h3 className="todo-group-title" id="profit-loss-title">Profit &amp; loss</h3>
        {profitQuery.isLoading ? (
          <p className="task-state-message" role="status" data-testid="status-profit-loss-loading">Loading…</p>
        ) : profitQuery.isError ? (
          <p className="data-error" role="alert" data-testid="error-profit-loss">
            {serverErrorText(profitQuery.error, 'Unable to load profit summary.')}
          </p>
        ) : profitQuery.data ? (
          <>
            <div className="profit-loss-table-wrap">
              <table className="profit-loss-table">
                <thead>
                  <tr>
                    <th scope="col" aria-label="Metric"></th>
                    <th scope="col">Last 30 days</th>
                    <th scope="col">All time</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Orders</th>
                    <td>{new Intl.NumberFormat('en-AU').format(profitQuery.data.last30d.orderCount)}</td>
                    <td>{new Intl.NumberFormat('en-AU').format(profitQuery.data.allTime.orderCount)}</td>
                  </tr>
                  <tr>
                    <th scope="row">Sales incl. shipping</th>
                    <td>{formatCurrencyCents(profitQuery.data.last30d.grossRevenueCents, 'AUD')}</td>
                    <td>{formatCurrencyCents(profitQuery.data.allTime.grossRevenueCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Coffee</th>
                    <td>{profitQuery.data.last30d.estimatedCoffeeCostCents === null ? '—' : <><span aria-hidden="true">{profitQuery.data.last30d.estimatedCoffeeCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedCoffeeCostCents, 'AUD')}</>}</td>
                    <td>{profitQuery.data.allTime.estimatedCoffeeCostCents === null ? '—' : <><span aria-hidden="true">{profitQuery.data.allTime.estimatedCoffeeCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedCoffeeCostCents, 'AUD')}</>}</td>
                  </tr>
                  <tr>
                    <th scope="row">Bags &amp; labels</th>
                    <td><span aria-hidden="true">{profitQuery.data.last30d.estimatedBagCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedBagCostCents, 'AUD')}</td>
                    <td><span aria-hidden="true">{profitQuery.data.allTime.estimatedBagCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedBagCostCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Satchels</th>
                    <td><span aria-hidden="true">{profitQuery.data.last30d.estimatedSatchelCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedSatchelCostCents, 'AUD')}</td>
                    <td><span aria-hidden="true">{profitQuery.data.allTime.estimatedSatchelCostCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedSatchelCostCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">Stripe fees, estimated</th>
                    <td><span aria-hidden="true">{profitQuery.data.last30d.estimatedStripeFeeCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.last30d.estimatedStripeFeeCents, 'AUD')}</td>
                    <td><span aria-hidden="true">{profitQuery.data.allTime.estimatedStripeFeeCents > 0 ? '−' : ''}</span>{formatCurrencyCents(profitQuery.data.allTime.estimatedStripeFeeCents, 'AUD')}</td>
                  </tr>
                  <tr>
                    <th scope="row">RSPCA, $1 per bag</th>
                    {[profitQuery.data.last30d, profitQuery.data.allTime].map((period, index) => (
                      <td key={index}>
                        <span aria-hidden="true">{period.charityCents > 0 ? '−' : ''}</span>
                        {formatCurrencyCents(period.charityCents, 'AUD')}
                        <small className="profit-loss-bag-count">{new Intl.NumberFormat('en-AU').format(period.bagCount)} bags</small>
                      </td>
                    ))}
                  </tr>
                  <tr className="profit-loss-net-row">
                    <th scope="row">Net profit</th>
                    {[profitQuery.data.last30d, profitQuery.data.allTime].map((period, index) => (
                      <td key={index}>
                        <strong className={period.netProfitCents !== null && period.netProfitCents < 0 ? 'profit-loss-net-negative' : undefined}>
                          {period.netProfitCents === null ? '—' : formatCurrencyCents(period.netProfitCents, 'AUD')}
                        </strong>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            {profitQuery.data.last30d.netProfitCents === null && (
              <p className="profit-loss-warning" role="status" data-testid="warning-profit-loss-missing-cost">
                Missing coffee cost for: {profitQuery.data.last30d.missingUnitCostProducts.join(', ')}
              </p>
            )}
            {profitQuery.data.allTime.netProfitCents === null && (
              <p className="profit-loss-warning" role="status" data-testid="warning-profit-loss-missing-cost-all-time">
                Missing coffee cost for: {profitQuery.data.allTime.missingUnitCostProducts.join(', ')}
              </p>
            )}
            <p className="profit-loss-footnote" data-testid="text-profit-loss-source">
              Includes in-person sales. Stripe fees are estimated. Source: Cattle Dog Coffee store, updated {formatBrisbaneDateTime(profitQuery.data.generatedAt)}.
            </p>
          </>
        ) : null}
      </section>
    </div>
  );
}

function FinanceFleetWorkspace() {
  const latestQuery = useGetProjectFinanceFleetLatest({
    query: {
      queryKey: getGetProjectFinanceFleetLatestQueryKey(),
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  });
  const historyQuery = useGetProjectFinanceFleetHistory({
    query: {
      queryKey: getGetProjectFinanceFleetHistoryQueryKey(),
      staleTime: 60_000,
      refetchOnWindowFocus: true,
    },
  });
  const latest: FleetLatestSnapshotResponse | undefined = latestQuery.data && !('empty' in latestQuery.data)
    ? latestQuery.data
    : undefined;
  const history: FleetHistoryResponse = historyQuery.data ?? [];
  const oldestHistoryDay = history.reduce<string | undefined>((oldest, row) => (
    !oldest || row.day < oldest ? row.day : oldest
  ), undefined);
  const fleetEquityDomain: [number, number] | undefined = history.length > 0
    ? [
      Math.min(...history.map((row) => row.total_equity_cents)) * 0.99,
      Math.max(...history.map((row) => row.total_equity_cents)) * 1.01,
    ]
    : undefined;

  if (latestQuery.isLoading) {
    return (
      <div className="fleet-state" role="status" aria-label="Loading trading fleet">
        <span className="skeleton loading-line" />
        <span className="skeleton fleet-loading-block" />
        <p>Loading trading fleet…</p>
      </div>
    );
  }
  if (latestQuery.isError) {
    return (
      <div className="fleet-state fleet-error" role="alert">
        <h3>Unable to load the trading fleet.</h3>
        <p>{serverErrorText(latestQuery.error, 'The latest snapshot could not be retrieved.')}</p>
        <button className="task-secondary-button" type="button" onClick={() => void latestQuery.refetch()} data-testid="button-retry-fleet">
          Retry
        </button>
      </div>
    );
  }
  if (!latest) {
    return (
      <div className="fleet-workspace">
        <div className="fleet-state fleet-empty" data-testid="status-fleet-empty">
          <span className="fleet-empty-mark" aria-hidden="true">—</span>
          <div><h3>No fleet snapshot yet</h3><p>Trading fleet data will appear here after the first snapshot is received.</p></div>
        </div>
        <FleetDetailPanels detail={null} />
      </div>
    );
  }

  const pnlPositive = latest.total_pnl_cents >= 0;
  return (
    <div className="fleet-workspace" data-testid="workspace-finance-fleet">
      <header className="fleet-toolbar">
        <div className="fleet-mode-line">
          <span className={`fleet-mode fleet-mode-${latest.mode}`}>
            {latest.mode === 'paper' ? 'PAPER — practice money' : latest.mode.toUpperCase()}
          </span>
          <span className="fleet-updated">
            Updated {formatBrisbaneDateTime(latest.generated_at)} ({latest.age_minutes} min ago)
          </span>
        </div>
        {latest.stale && <p className="fleet-stale-warning" role="status">Stale — no update for {latest.age_minutes} min</p>}
      </header>

      <section className="fleet-overview" aria-label="Fleet summary">
        <article className="fleet-equity-card">
          <span className="fleet-metric-label">Total equity</span>
          <strong>{formatFigure(latest.total_equity_cents, 'usd_cents')}</strong>
          <span className="fleet-equity-note">Paper portfolio value</span>
        </article>
        <div className="fleet-metric-grid">
          <article className="fleet-metric-card">
            <span className="fleet-metric-label">Total P&amp;L</span>
            <strong className={pnlPositive ? 'fleet-positive' : 'fleet-negative'}>{formatFigure(latest.total_pnl_cents, 'usd_cents')}</strong>
          </article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">{oldestHistoryDay ? `Drawdown · since ${formatDueDate(oldestHistoryDay)}` : 'Drawdown'}</span><strong>{latest.drawdown_pct.toFixed(2)}%</strong></article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">Peak equity</span><strong>{formatFigure(latest.peak_equity_cents, 'usd_cents')}</strong></article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">Open positions</span><strong>{formatFigure(latest.open_positions, 'count')}</strong></article>
          <article className="fleet-metric-card"><span className="fleet-metric-label">Paused bots</span><strong>{formatFigure(latest.paused_bots, 'count')}</strong></article>
        </div>
      </section>

      <div className="fleet-dashboard-grid">
        <ChartFrame title="Equity · last 30 days">
          {historyQuery.isLoading ? (
            <div className="fleet-chart-skeleton" role="status"><span className="skeleton loading-line" /><span className="skeleton fleet-chart-placeholder" /></div>
          ) : historyQuery.isError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(historyQuery.error, 'Unable to load fleet history.')}</p>
              <button className="task-secondary-button" type="button" onClick={() => void historyQuery.refetch()}>Retry history</button>
            </div>
          ) : history.length === 0 ? (
            <p className="data-empty">No equity history yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={history} margin={{ top: 12, right: 12, bottom: 0, left: 3 }}>
                <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
                <XAxis dataKey="day" tickFormatter={(day: string) => formatDueDate(day)} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" minTickGap={26} />
                <YAxis domain={fleetEquityDomain} tickFormatter={(value: number) => formatFigure(value, 'usd_cents')} width={82} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
                <Tooltip
                  formatter={(value: number) => formatFigure(value, 'usd_cents')}
                  labelFormatter={(day: string) => formatDueDate(day)}
                  contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                />
                <Line dataKey="total_equity_cents" name="Equity" type="monotone" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartFrame>

        <section className="fleet-errors-panel" aria-labelledby="fleet-errors-title">
          <div className="fleet-panel-heading">
            <h3 id="fleet-errors-title">Snapshot errors</h3>
            <span>{latest.errors.length}</span>
          </div>
          {latest.errors.length ? (
            <ul className="fleet-error-list">{latest.errors.map((message, index) => <li key={`${message}-${index}`}>{message}</li>)}</ul>
          ) : (
            <p className="fleet-no-errors">No reported errors</p>
          )}
        </section>
      </div>

      <section className="fleet-bots-panel" aria-labelledby="fleet-bots-title">
        <div className="fleet-panel-heading">
          <div><p className="eyebrow">Portfolio detail</p><h3 id="fleet-bots-title">Bots</h3></div>
          <span>{latest.bots.length} tracked</span>
        </div>
        {latest.bots.length === 0 ? (
          <p className="data-empty">No bots in this snapshot</p>
        ) : (
          <div className="fleet-table-scroll">
            <table className="fleet-table">
              <thead><tr><th scope="col">Bot</th><th scope="col">Equity</th><th scope="col">P&amp;L</th><th scope="col">P&amp;L %</th><th scope="col">Positions</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {latest.bots.map((bot) => {
                  const pnlPercent = bot.starting_cents > 0 ? (bot.pnl_cents / bot.starting_cents) * 100 : null;
                  const status = bot.paused ? 'Paused' : bot.stale ? 'Stale' : 'Running';
                  return (
                    <tr key={bot.id} data-testid={`row-fleet-bot-${bot.bot_id}`}>
                      <th scope="row" className="fleet-bot-id">{bot.bot_id}</th>
                      <td>{formatFigure(bot.equity_cents, 'usd_cents')}</td>
                      <td className={bot.pnl_cents >= 0 ? 'fleet-positive' : 'fleet-negative'}>{formatFigure(bot.pnl_cents, 'usd_cents')}</td>
                      <td className={pnlPercent === null ? '' : pnlPercent >= 0 ? 'fleet-positive' : 'fleet-negative'}>{pnlPercent === null ? '—' : `${pnlPercent.toFixed(2)}%`}</td>
                      <td>{formatFigure(bot.open_positions, 'count')}</td>
                      <td><span className={`fleet-bot-status fleet-bot-${status.toLowerCase()}`}>{status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <FleetDetailPanels detail={latest.detail} />
    </div>
  );
}

function FleetDetailPanels({ detail }: { detail: FleetLatestSnapshotResponse['detail'] }) {
  const nearZeroPositionCount = detail?.positions.filter((position) => Math.abs(position.qty) < 0.000001).length ?? 0;
  const visiblePositions = detail?.positions.filter((position) => Math.abs(position.qty) >= 0.000001) ?? [];

  return (
    <div className="fleet-detail-panels">
      <section className="fleet-detail-panel" aria-labelledby="fleet-positions-title" data-testid="fleet-positions">
        <div className="fleet-panel-heading">
          <h3 id="fleet-positions-title">Positions</h3>
          {detail && <span>{detail.positions.length} reported</span>}
        </div>
        {!detail ? (
          <p className="data-empty">No detail yet</p>
        ) : (
          <>
          {nearZeroPositionCount > 0 && (
            <p className="fleet-near-zero-note">{nearZeroPositionCount} near-zero position(s) hidden</p>
          )}
          {visiblePositions.length === 0 ? nearZeroPositionCount === 0 && (
            <p className="data-empty">No positions reported</p>
          ) : (
          <div className="fleet-table-scroll">
            <table className="fleet-table fleet-detail-table">
              <thead>
                <tr><th scope="col">Bot</th><th scope="col">Symbol</th><th scope="col">Qty</th><th scope="col">Entry</th><th scope="col">Stop</th><th scope="col">Protected</th></tr>
              </thead>
              <tbody>
                {visiblePositions.map((position, index) => (
                  <tr
                    key={`${position.bot_id}-${position.symbol}-${index}`}
                    className={position.has_broker_stop === false ? 'fleet-position-no-stop' : undefined}
                  >
                    <th scope="row" className="fleet-bot-id">{position.bot_id}</th>
                    <td>{position.symbol}</td>
                    <td>{new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(position.qty)}</td>
                    <td>{position.entry_price === null ? '—' : formatFigure(position.entry_price * 100, 'usd_cents')}</td>
                    <td>{position.stop_price === null ? '—' : formatFigure(position.stop_price * 100, 'usd_cents')}</td>
                    <td>{position.has_broker_stop === true ? '✅' : position.has_broker_stop === false ? '❌ No stop' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
          </>
        )}
      </section>

      <section className="fleet-detail-panel" aria-labelledby="fleet-bot-registry-title" data-testid="fleet-bot-registry">
        <div className="fleet-panel-heading">
          <h3 id="fleet-bot-registry-title">Bots</h3>
          {detail && <span>{detail.bots_meta.length} configured</span>}
        </div>
        {!detail ? (
          <p className="data-empty">No detail yet</p>
        ) : detail.bots_meta.length === 0 ? (
          <p className="data-empty">No bot metadata reported</p>
        ) : (
          <div className="fleet-table-scroll">
            <table className="fleet-table fleet-detail-table fleet-bots-meta-table">
              <thead>
                <tr><th scope="col">Bot</th><th scope="col">Strategy</th><th scope="col">Broker</th><th scope="col">Mode</th><th scope="col">Status</th><th scope="col">Instruments</th></tr>
              </thead>
              <tbody>
                {detail.bots_meta.map((bot, index) => (
                  <tr key={`${bot.bot_id}-${index}`}>
                    <th scope="row" className="fleet-bot-id">{bot.bot_id}</th>
                    <td>{bot.strategy || '—'}</td>
                    <td>{bot.broker || '—'}</td>
                    <td>{bot.account_mode}</td>
                    <td>{bot.registry_status || '—'}</td>
                    <td>{bot.instruments.length > 0 ? bot.instruments.join(', ') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function FinanceTradingHealth() {
  const latestQuery = useGetProjectFinanceFleetLatest({
    query: {
      queryKey: getGetProjectFinanceFleetLatestQueryKey(),
      staleTime: 30_000,
      refetchOnWindowFocus: true,
    },
  });
  const latest: FleetLatestSnapshotResponse | undefined = latestQuery.data && !('empty' in latestQuery.data)
    ? latestQuery.data
    : undefined;
  const detail = latest?.detail;

  let healthContent: ReactNode;
  if (latestQuery.isLoading) {
    healthContent = <p className="task-state-message" role="status">Loading trading health…</p>;
  } else if (latestQuery.isError) {
    healthContent = <p className="data-error" role="alert">{serverErrorText(latestQuery.error, 'Unable to load trading health.')}</p>;
  } else if (!latest || !detail) {
    healthContent = <p className="data-empty">No detail yet</p>;
  } else {
    const runnerMinutesAgo = detail.runner?.last_heartbeat
      ? Math.max(0, Math.floor((Date.now() - Date.parse(detail.runner.last_heartbeat)) / 60_000))
      : null;
    const incidents = [...detail.incidents].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    const unresolvedRecentIncidents = incidents.filter((incident) => (
      !incident.resolved &&
      Date.parse(incident.ts) >= Date.now() - 48 * 60 * 60 * 1000 &&
      Date.parse(incident.ts) <= Date.now()
    ));

    healthContent = (
      <div className="fleet-health-grid">
        <article className="fleet-health-item">
          <h4>Runner</h4>
          {detail.runner ? (
            <>
              <p>{detail.runner.status}</p>
              <p>{runnerMinutesAgo === null ? 'Last heartbeat not reported' : `Last heartbeat ${runnerMinutesAgo} min ago`}</p>
            </>
          ) : <p>Not reported yet</p>}
        </article>
        <article className="fleet-health-item">
          <h4>Kill switch</h4>
          {detail.kill_switch ? (
            <>
              <p>Mode: {detail.kill_switch.mode}</p>
              <p>Would trip: {detail.kill_switch.would_trip ? 'yes' : 'no'}</p>
              {detail.kill_switch.triggers.length > 0 ? (
                <ul>
                  {detail.kill_switch.triggers.map((trigger, index) => (
                    <li key={`${trigger.kind}-${trigger.bot_id ?? ''}-${index}`}>
                      {trigger.kind}: {trigger.detail}
                      {(trigger.bot_id || trigger.symbol) && <span> ({[trigger.bot_id, trigger.symbol].filter(Boolean).join(' · ')})</span>}
                    </li>
                  ))}
                </ul>
              ) : <p>No triggers reported</p>}
            </>
          ) : <p>Not reported yet</p>}
        </article>
        <article className="fleet-health-item">
          <h4>Reconciliation</h4>
          {detail.reconciliation ? (
            <>
              <p>{detail.reconciliation.clean === null ? 'Not reported yet' : detail.reconciliation.clean ? 'Clean' : 'Not clean'}</p>
              <p>Last run: {detail.reconciliation.last_run ? formatBrisbaneDateTime(detail.reconciliation.last_run) : 'Not reported yet'}</p>
              {detail.reconciliation.flags.length > 0 ? (
                <ul>{detail.reconciliation.flags.map((flag, index) => <li key={`${flag}-${index}`}>{flag}</li>)}</ul>
              ) : <p>No flags reported</p>}
            </>
          ) : <p>Not reported yet</p>}
        </article>
        <article className="fleet-health-item fleet-incidents-item">
          <h4>Incidents</h4>
          <p>{unresolvedRecentIncidents.length} unresolved in last 48h</p>
          {incidents.length > 0 ? (
            <ul className="fleet-incident-list">
              {incidents.slice(0, 10).map((incident, index) => (
                <li key={`${incident.ts}-${incident.component}-${index}`}>
                  <div className="fleet-incident-meta"><strong>{incident.severity}</strong><span>{incident.component}</span></div>
                  <p>{incident.message}</p>
                  <div className="fleet-incident-meta"><time>{formatBrisbaneDateTime(incident.ts)}</time><span>Resolved: {incident.resolved ? 'yes' : 'no'}</span></div>
                </li>
              ))}
            </ul>
          ) : <p>No incidents reported</p>}
        </article>
      </div>
    );
  }

  return (
    <section className="fleet-detail-panel fleet-health-panel" aria-labelledby="fleet-health-title" data-testid="finance-trading-health">
      <div className="fleet-panel-heading">
        <h3 id="fleet-health-title">Trading health</h3>
        {latest && <span>Updated {formatBrisbaneDateTime(latest.generated_at)}</span>}
      </div>
      {healthContent}
    </section>
  );
}

function CustomerWorkspace({ slug }: { slug: string }) {
  const isCoffee = slug === 'cattle-dog-coffee';
  const query = useListProjectMetrics(slug, {
    query: { queryKey: getListProjectMetricsQueryKey(slug), enabled: isCoffee },
  });
  if (!isCoffee) return <p className="data-empty">No customer data source yet</p>;
  if (query.isLoading) return <p className="task-state-message" role="status">Loading customer metrics…</p>;
  if (query.isError) return <div className="task-query-error" role="alert"><p>{serverErrorText(query.error, 'Unable to load customer metrics.')}</p><button className="task-secondary-button" type="button" onClick={() => void query.refetch()}>Retry</button></div>;
  const metrics = query.data ?? [];
  const customers = metrics.find((metric) => metric.key === 'customers_30d');
  const repeat = metrics.find((metric) => metric.key === 'repeat_customers_30d');
  const repeatRate = customers && repeat && customers.value > 0
    ? `${Math.round((repeat.value / customers.value) * 100)}%`
    : customers?.value === 0 ? '–' : 'No data yet';
  return (
    <div className="metric-grid customer-metrics">
      <article className="metric-card"><span>Customers, last 30 days</span><strong><MetricValue metric={customers} /></strong></article>
      <article className="metric-card"><span>Repeat customers, last 30 days</span><strong><MetricValue metric={repeat} /></strong></article>
      <article className="metric-card"><span>Repeat rate</span><strong>{repeatRate}</strong></article>
    </div>
  );
}

function OllieTimeline({ rows, loading, error }: { rows: OllieHistoryRow[]; loading: boolean; error: unknown }) {
  if (loading) return <p className="task-state-message" role="status">Loading Ollie status history…</p>;
  if (error) return <p className="data-error" role="alert">{serverErrorText(error, 'Unable to load Ollie status history.')}</p>;
  if (!rows.length) return <p className="data-empty">No status history yet</p>;
  return (
    <ol className="status-timeline">
      {rows.map((row, index) => (
        <li key={`${row.created_at}-${index}`}>
          <span className={`agent-light-dot agent-light-${row.status_light}`} aria-label={`${row.status_light} status`} />
          <span className="timeline-status">{row.status_light}</span>
          {row.priority && <span className={`priority-chip priority-${row.priority}`}>{row.priority}</span>}
          <time>{formatBrisbaneDateTime(row.created_at)}</time>
        </li>
      ))}
    </ol>
  );
}

function TaskStatusChart({ tasks, loading, error }: { tasks: Task[]; loading: boolean; error: unknown }) {
  if (loading) return <p className="task-state-message" role="status">Loading task status…</p>;
  if (error) return <p className="data-error" role="alert">{serverErrorText(error, 'Unable to load project tasks.')}</p>;
  const counts = tasks.reduce<Record<string, number>>((result, task) => {
    result[task.status] = (result[task.status] ?? 0) + 1;
    return result;
  }, {});
  const data = Object.entries(counts).map(([status, count]) => ({ status: TASK_STATUS_LABELS[status as TaskStatus] ?? status, count }));
  if (!data.length) return <p className="data-empty">No tasks yet</p>;
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 8, right: 6, bottom: 0, left: 0 }}>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 4" />
        <XAxis dataKey="status" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
        <YAxis allowDecimals={false} width={28} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} stroke="hsl(var(--border))" />
        <Tooltip contentStyle={{ background: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
        <Bar dataKey="count" name="Tasks" fill="hsl(var(--chart-3))" fillOpacity={0.88} radius={[2, 2, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OverviewWorkspace({ slug }: { slug: string }) {
  const history = useListProjectOllieHistory(slug, { query: { queryKey: getListProjectOllieHistoryQueryKey(slug) } });
  const tasks = useListProjectTasks(slug, { query: { queryKey: getListProjectTasksQueryKey(slug) } });
  return (
    <div className="overview-data">
      {slug === 'finance' && <FinanceTradingHealth />}
      <section className="agent-latest-box">
        <h2 className="todo-group-title">Ollie status history</h2>
        <OllieTimeline rows={history.data ?? []} loading={history.isLoading} error={history.error} />
      </section>
      <ChartFrame title="Project tasks by status">
        <TaskStatusChart tasks={tasks.data ?? []} loading={tasks.isLoading} error={tasks.error} />
      </ChartFrame>
    </div>
  );
}

function AgentActivityWorkspace({ slug }: { slug: string }) {
  const history = useListProjectOllieHistory(slug, { query: { queryKey: getListProjectOllieHistoryQueryKey(slug) } });
  const notes = useListProjectNotes(slug, { query: { queryKey: getListProjectNotesQueryKey(slug) } });
  const pending = useListDecisions({ status: 'pending' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } });
  const approved = useListDecisions({ status: 'approved' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'approved' }) } });
  const declined = useListDecisions({ status: 'declined' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'declined' }) } });
  const decisions = [...(pending.data ?? []), ...(approved.data ?? []), ...(declined.data ?? [])]
    .filter((decision) => decision.project_slug === slug)
    .sort((a, b) => (b.decided_at ?? b.created_at ?? '').localeCompare(a.decided_at ?? a.created_at ?? ''));
  const decisionsError = pending.error ?? approved.error ?? declined.error;
  const decisionsLoading = pending.isLoading || approved.isLoading || declined.isLoading;
  const sourceLabel = (source: string) => source === 'ollie_daily' ? 'Ollie daily' : source === 'cursor' ? 'Cursor' : source;
  return (
    <div className="activity-columns">
      <section className="agent-latest-box"><h2 className="todo-group-title">Ollie history</h2><OllieTimeline rows={history.data ?? []} loading={history.isLoading} error={history.error} /></section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Project decisions</h2>
        {decisionsLoading ? <p className="task-state-message">Loading decisions…</p> : decisionsError ? <p className="data-error" role="alert">{serverErrorText(decisionsError, 'Unable to load decisions.')}</p> : decisions.length === 0 ? <p className="data-empty">No decisions yet</p> : (
          <div className="activity-list">{decisions.map((decision) => <article className="activity-entry" key={decision.id}>
            <div className="activity-entry-head"><strong>{decision.title}</strong><span className={`history-status history-status-${decision.status}`}>{decision.status}</span></div>
            <p>{decision.recommendation}</p><div className="activity-meta"><span>Source: {sourceLabel(decision.source)}</span><span>Decided via: {decision.decided_via ?? 'Not recorded'}</span><time>{formatBrisbaneDateTime(decision.decided_at ?? decision.created_at)}</time></div>
          </article>)}</div>
        )}
      </section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Project notes</h2>
        {notes.isLoading ? <p className="task-state-message">Loading project notes…</p> : notes.isError ? <p className="data-error" role="alert">{serverErrorText(notes.error, 'Unable to load project notes.')}</p> : (notes.data?.length ?? 0) === 0 ? <p className="data-empty">No notes yet</p> : (
          <div className="activity-list">{(notes.data ?? []).map((note: ProjectNote) => <article className="activity-entry" key={note.id}>
            <div className="activity-entry-head"><span>{note.kind}</span><span className={`risk-severity severity-${note.severity}`}>{note.severity}</span></div>
            <p>{note.text}</p><time>{formatBrisbaneDateTime(note.created_at)}</time>
          </article>)}</div>
        )}
      </section>
    </div>
  );
}

function NextActionWorkspace({ slug }: { slug: string }) {
  const updates = useListLatestAgentUpdates({ query: { queryKey: getListLatestAgentUpdatesQueryKey(), staleTime: 60_000 } });
  const tasksQuery = useListProjectTasks(slug, { query: { queryKey: getListProjectTasksQueryKey(slug) } });
  const pendingQuery = useListDecisions({ status: 'pending' }, { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } });
  const update = updates.data?.find((entry) => entry.project_slug === slug);
  const tasks = (tasksQuery.data ?? []).filter((task) => task.status !== 'done').sort((a, b) => {
    if (!a.due_date && !b.due_date) return 0;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return a.due_date.localeCompare(b.due_date);
  }).slice(0, 3);
  const decisions = (pendingQuery.data ?? []).filter((decision) => decision.project_slug === slug);
  return (
    <div className="next-action-workspace">
      <section className="next-action-feature">
        <p className="eyebrow">Ollie’s latest recommendation</p>
        {updates.isLoading ? <p className="task-state-message">Loading next action…</p> : updates.isError ? <p className="data-error" role="alert">{serverErrorText(updates.error, 'Unable to load Ollie’s recommendation.')}</p> : <h2>{update?.next_action ?? 'No next action yet'}</h2>}
        {update?.created_at && <time>{formatBrisbaneDateTime(update.created_at)}</time>}
      </section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Pending decisions</h2>
        {pendingQuery.isLoading ? <p className="task-state-message">Loading decisions…</p> : pendingQuery.isError ? <p className="data-error" role="alert">{serverErrorText(pendingQuery.error, 'Unable to load decisions.')}</p> : decisions.length ? <div className="activity-list">{decisions.map((decision) => <article className="activity-entry" key={decision.id}><strong>{decision.title}</strong><p>{decision.recommendation}</p><span className="decision-count">{sourceLabelForDecision(decision.source)}</span></article>)}</div> : <p className="data-empty">No pending decisions</p>}
      </section>
      <section className="activity-panel">
        <h2 className="todo-group-title">Upcoming tasks</h2>
        {tasksQuery.isLoading ? <p className="task-state-message">Loading tasks…</p> : tasksQuery.isError ? <p className="data-error" role="alert">{serverErrorText(tasksQuery.error, 'Unable to load project tasks.')}</p> : tasks.length ? <div className="activity-list">{tasks.map((task) => <article className="activity-entry" key={task.id}><strong>{task.title}</strong><div className="activity-meta"><span>{TASK_STATUS_LABELS[task.status as TaskStatus] ?? task.status}</span><span>{task.due_date ? `Due ${formatDueDate(task.due_date)}` : 'Undated'}</span></div></article>)}</div> : <p className="data-empty">No open tasks</p>}
      </section>
    </div>
  );
}

function ProjectDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const projectQuery = useGetProject(slug, {
    query: { queryKey: getGetProjectQueryKey(slug), retry: false },
  });
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[number]>(() => (
    new URLSearchParams(window.location.search).get('tab') === 'To-do'
      ? 'To-do'
      : PROJECT_TABS[0]
  ));
  const [isEditing, setIsEditing] = useState(false);
  const [draftStatus, setDraftStatus] = useState<ProjectStatus>(PROJECT_STATUSES[0]);
  const [draftDescription, setDraftDescription] = useState('');
  const [draftDriveUrl, setDraftDriveUrl] = useState('');
  const updateProjectMutation = useUpdateProject({
    mutation: {
      onSuccess: async (updated) => {
        queryClient.setQueryData(getGetProjectQueryKey(updated.slug), updated);
        queryClient.setQueryData<Project[]>(getListProjectsQueryKey(), (projects) =>
          projects?.map((item) => item.slug === updated.slug ? updated : item),
        );
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: getGetProjectQueryKey(updated.slug),
          }),
          queryClient.invalidateQueries({
            queryKey: getListProjectsQueryKey(),
          }),
        ]);
      },
    },
  });

  if (projectQuery.isLoading) {
    return (
      <div className="app-shell">
        <Header />
        <main className="page-wrap detail-main">
          <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
          <div className="detail-heading" aria-label="Loading project" data-testid="status-project-loading">
            <div className="skeleton" />
          </div>
        </main>
      </div>
    );
  }

  if (projectQuery.isError) {
    if (isNotFound(projectQuery.error)) {
      return (
        <div className="app-shell">
          <Header />
          <main className="page-wrap not-found">
            <h1 className="home-title" data-testid="status-project-not-found">Project not found</h1>
            <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
          </main>
        </div>
      );
    }
    return (
      <div className="app-shell">
        <Header />
        <main className="page-wrap detail-main">
          <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
          <section className="state-panel" role="alert" data-testid="status-project-error">
            <h1 className="state-title">Unable to load project.</h1>
            <p className="state-copy">Please try again.</p>
            <button className="retry-button" type="button" onClick={() => void projectQuery.refetch()} data-testid="button-retry-project">
              Retry
            </button>
          </section>
        </main>
      </div>
    );
  }

  const project = projectQuery.data;
  if (!project) return null;

  const openEditor = () => {
    updateProjectMutation.reset();
    setDraftStatus(project.status as ProjectStatus);
    setDraftDescription(project.description ?? '');
    setDraftDriveUrl(project.drive_url ?? '');
    setIsEditing(true);
  };

  const closeEditor = () => {
    updateProjectMutation.reset();
    setIsEditing(false);
  };

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProjectMutation.reset();

    const changes: { status?: string; description?: string | null; drive_url?: string | null } = {};
    if (draftStatus !== project.status) changes.status = draftStatus;
    if (draftDescription !== (project.description ?? '')) {
      changes.description = draftDescription;
    }
    const driveUrl = draftDriveUrl.trim() || null;
    if (driveUrl !== project.drive_url) changes.drive_url = driveUrl;

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      await updateProjectMutation.mutateAsync({ slug: project.slug, data: changes });
      setIsEditing(false);
    } catch {
      // Keep the editor open; the mutation error is shown inside the form.
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main" data-project-slug={project.slug}>
        <Link className="back-link" href="/" data-testid="link-home">← Home</Link>
        <section className="detail-heading">
          <div className="detail-title-row">
            <h1 className="detail-title" data-testid="text-project-name">{project.name}</h1>
            <span className="status-badge" data-testid="status-project">
              <span className="status-dot" aria-hidden="true" />
              {project.status}
            </span>
          </div>
          <p className="detail-description" data-testid="text-project-description">
            {project.description ?? 'No description yet'}
          </p>
          <div className="project-heading-actions">
            {project.drive_url && (
              <a
                className="project-files-link"
                href={project.drive_url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="link-project-files"
              >
                Files <span aria-hidden="true">↗</span>
              </a>
            )}
            {!isEditing ? (
              <button className="retry-button" type="button" onClick={openEditor} data-testid="button-edit-project">
                Edit
              </button>
            ) : (
              <form
                className="state-panel"
                onSubmit={saveProject}
                style={{ display: 'grid', gap: 14, maxWidth: 560, marginTop: 8 }}
                data-testid="form-edit-project"
              >
                <label htmlFor="project-edit-status" style={{ display: 'grid', gap: 7 }}>
                  Status
                  <select
                    id="project-edit-status"
                    value={draftStatus}
                    onChange={(event) => setDraftStatus(event.target.value as ProjectStatus)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 7,
                      color: 'hsl(var(--foreground))',
                      background: 'hsl(var(--background))',
                      font: 'inherit',
                    }}
                    data-testid="select-project-status"
                  >
                    {PROJECT_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
                <label htmlFor="project-edit-description" style={{ display: 'grid', gap: 7 }}>
                  Description
                  <textarea
                    id="project-edit-description"
                    rows={4}
                    maxLength={2000}
                    value={draftDescription}
                    onChange={(event) => setDraftDescription(event.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: 7,
                      color: 'hsl(var(--foreground))',
                      background: 'hsl(var(--background))',
                      font: 'inherit',
                      resize: 'vertical',
                    }}
                    data-testid="input-project-description"
                  />
                </label>
                <label htmlFor="project-edit-drive-url" className="project-edit-field">
                  Drive folder link
                  <input
                    id="project-edit-drive-url"
                    type="url"
                    inputMode="url"
                    value={draftDriveUrl}
                    onChange={(event) => setDraftDriveUrl(event.target.value)}
                    placeholder="https://drive.google.com/…"
                    data-testid="input-project-drive-url"
                  />
                </label>
                {updateProjectMutation.isError && (
                  <p role="alert" className="state-copy" data-testid="error-save-project">
                    {serverErrorText(updateProjectMutation.error)}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    className="retry-button"
                    type="submit"
                    disabled={updateProjectMutation.isPending}
                    data-testid="button-save-project"
                  >
                    {updateProjectMutation.isPending ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    className="retry-button"
                    type="button"
                    disabled={updateProjectMutation.isPending}
                    onClick={closeEditor}
                    data-testid="button-cancel-edit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
        <div className="tab-list" role="tablist" aria-label="Project sections" data-testid="tab-list-project">
          {PROJECT_TABS.map((tab) => (
            <button
              key={tab}
              className="tab-button"
              type="button"
              role="tab"
              id={`tab-${tab}`}
              aria-selected={activeTab === tab}
              aria-controls="project-tab-panel"
              onClick={() => setActiveTab(tab)}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section
          className={`tab-panel${activeTab === 'To-do' ? ' todo-tab-panel' : activeTab === 'Overview & Goals' ? ' goal-tab-panel' : ' data-tab-panel'}`}
          role="tabpanel"
          id="project-tab-panel"
          aria-labelledby={`tab-${activeTab}`}
          data-testid="panel-project-tab"
        >
          {activeTab === 'To-do'
            ? <ProjectTodo slug={project.slug} />
            : activeTab === 'Overview & Goals'
              ? <><ProjectGoals slug={project.slug} /><OverviewWorkspace slug={project.slug} /></>
              : activeTab === 'Customers'
                ? project.slug === 'finance'
                  ? <p className="data-empty">Not applicable — trading fleet</p>
                  : <CustomerWorkspace slug={project.slug} />
                : activeTab === 'Revenue & Subscriptions'
                  ? project.slug === 'finance'
                    ? <FinanceFleetWorkspace />
                    : <RevenueWorkspace slug={project.slug} />
                  : activeTab === 'Marketing'
                    ? <p className="data-empty">No marketing data source connected yet. Connect a source (for example site analytics or an ad account) to fill this tab.</p>
                    : activeTab === 'Agent Activity'
                      ? <AgentActivityWorkspace slug={project.slug} />
                      : <NextActionWorkspace slug={project.slug} />}
        </section>
      </main>
    </div>
  );
}

function App() {
  return (
    <ColorModeProvider>
      <QueryClientProvider client={queryClient}>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ProjectDetailContext.Provider value={ProjectDetail}>
            <AuthGate />
          </ProjectDetailContext.Provider>
        </WouterRouter>
      </QueryClientProvider>
    </ColorModeProvider>
  );
}

export default App;
