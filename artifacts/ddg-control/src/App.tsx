import { createContext, useContext, useState, useSyncExternalStore, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  getGetProjectQueryKey,
  getGetSessionQueryKey,
  getListAgentRunsQueryKey,
  getListDecisionsQueryKey,
  getListLatestAgentUpdatesQueryKey,
  getListProjectGoalsQueryKey,
  getListMembersQueryKey,
  getListProjectTasksQueryKey,
  getListProjectsQueryKey,
  useCreateProjectGoal,
  useCreateProjectTask,
  useGetProject,
  useGetSession,
  useLogin,
  useLogout,
  useApproveDecision,
  useDeclineDecision,
  useListDecisions,
  useListProjectGoals,
  useListMembers,
  useListAgentRuns,
  useListLatestAgentUpdates,
  useListProjectTasks,
  useListProjects,
  useRunOllie,
  useUpdateGoal,
  useUpdateTask,
  useUpdateProject,
  type Goal,
  type GoalInput,
  type GoalUpdate,
  type DecisionWithNames,
  type Member,
  type Project,
  type Task,
  type TaskInput,
  type TaskUpdate,
} from '@workspace/api-client-react';
import {
  GOAL_STATUSES,
  GOAL_STATUS_LABELS,
  PROJECT_STATUSES,
  PROJECT_TABS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  type GoalStatus,
  type ProjectStatus,
  type TaskStatus,
} from '@workspace/project-constants';
import {
  Link,
  Route,
  Switch,
  useParams,
  useLocation,
  Router as WouterRouter,
} from 'wouter';
import './ddg.css';

let authenticationRequired = false;
const authenticationListeners = new Set<() => void>();

function setAuthenticationRequired(required: boolean): void {
  if (authenticationRequired === required) return;
  authenticationRequired = required;
  authenticationListeners.forEach((listener) => listener());
}

function useAuthenticationRequired(): boolean {
  return useSyncExternalStore(
    (listener) => {
      authenticationListeners.add(listener);
      return () => {
        authenticationListeners.delete(listener);
      };
    },
    () => authenticationRequired,
    () => authenticationRequired,
  );
}

function isUnauthorizedError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
  };
  return candidate.status === 401
    || candidate.statusCode === 401
    || candidate.response?.status === 401;
}

function handleUnauthorizedError(error: unknown): void {
  if (!isUnauthorizedError(error)) return;
  queryClient.clear();
  setAuthenticationRequired(true);
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: handleUnauthorizedError }),
  mutationCache: new MutationCache({ onError: handleUnauthorizedError }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error) =>
        isUnauthorizedError(error) ? false : failureCount < 3,
    },
  },
});

const DevAuthBypassContext = createContext(false);

function Header({ showLogout = true }: { showLogout?: boolean }) {
  const client = useQueryClient();
  const logoutMutation = useLogout();
  const devBypass = useContext(DevAuthBypassContext);
  const pendingDecisionsQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const pendingCount = pendingDecisionsQuery.data?.length ?? 0;

  return (
    <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home-brand">
        <span className="brand-mark" aria-hidden="true">dd</span>
        <span>DDG Control</span>
      </Link>
      <nav className="topbar-actions" aria-label="Main navigation">
        <Link href="/agents" className="header-link" data-testid="link-agents">
          Agents
        </Link>
        <Link href="/decisions" className="header-link" data-testid="link-decisions">
          Decisions{pendingCount > 0 && <span className="header-count">[{pendingCount}]</span>}
        </Link>
        {showLogout && !devBypass && (
          <button
            className="logout-button"
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate(undefined, {
              onSuccess: () => {
                client.clear();
                setAuthenticationRequired(true);
              },
            })}
            data-testid="button-logout"
          >
            {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
          </button>
        )}
      </nav>
    </header>
  );
}

function Home() {
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const agentUpdatesQuery = useListLatestAgentUpdates({
    query: {
      queryKey: getListLatestAgentUpdatesQueryKey(),
      staleTime: 60_000,
    },
  });
  const pendingDecisionsQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const backgroundStyle = {
    '--home-background': `url("${import.meta.env.BASE_URL}dashboard-background.jpg")`,
  } as CSSProperties;

  return (
    <div className="app-shell home-shell" style={backgroundStyle}>
      <Header />
      <main className="page-wrap home-main">
        <p className="eyebrow">Control panel</p>
        <h1 className="home-title">Projects</h1>
        {(pendingDecisionsQuery.data?.length ?? 0) > 0 && (
          <Link className="decisions-waiting" href="/decisions" data-testid="link-decisions-waiting">
            Decisions waiting: {pendingDecisionsQuery.data?.length}
            <span aria-hidden="true">→</span>
          </Link>
        )}
        <div className="section-rule"><span>Projects</span></div>

        {projectsQuery.isLoading ? (
          <section className="state-panel" aria-live="polite" data-testid="status-projects-loading">
            <div className="skeleton loading-line" aria-hidden="true" />
            <p className="state-copy loading-label">Loading projects…</p>
          </section>
        ) : projectsQuery.isError ? (
          <section className="state-panel" role="alert" data-testid="status-projects-error">
            <h2 className="state-title">Unable to load projects.</h2>
            <p className="state-copy">Please try again.</p>
            <button className="retry-button" type="button" onClick={() => void projectsQuery.refetch()} data-testid="button-retry-projects">
              Retry
            </button>
          </section>
        ) : projectsQuery.data?.length ? (
          <div className="project-grid" data-testid="list-projects">
            {projectsQuery.data.map((project) => {
              const latestUpdate = agentUpdatesQuery.data?.find(
                (update) => update.project_slug === project.slug,
              );
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="project-tile"
                  data-testid={`link-project-${project.slug}`}
                >
                  <div className="tile-top">
                    <h2 className="tile-name" data-testid={`text-project-name-${project.slug}`}>{project.name}</h2>
                    <div className="tile-status-group">
                      <span className="status-badge" data-testid={`status-project-${project.slug}`}>
                        <span className="status-dot" aria-hidden="true" />
                        {project.status}
                      </span>
                      {latestUpdate && (
                        <span
                          className={`agent-light-dot agent-light-${latestUpdate.status_light}`}
                          title={`Ollie: ${latestUpdate.status_light}`}
                          aria-label={`Ollie's status light: ${latestUpdate.status_light}`}
                          data-testid={`agent-light-${project.slug}`}
                        />
                      )}
                      {latestUpdate?.priority && (
                        <span className={`priority-chip priority-${latestUpdate.priority}`} data-testid={`priority-project-${project.slug}`}>
                          {latestUpdate.priority}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="tile-facts">
                    <p className="tile-fact"><strong>Headline:</strong> No data yet</p>
                    <p className="tile-fact">
                      <strong>Next action:</strong> {latestUpdate?.next_action ?? 'No data yet'}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <section className="state-panel" data-testid="status-projects-empty">
            <h2 className="state-title">No projects found.</h2>
          </section>
        )}
      </main>
    </div>
  );
}

function isNotFound(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const candidate = error as {
    status?: number;
    statusCode?: number;
    response?: { status?: number };
    data?: { error?: string };
    error?: string;
  };
  return candidate.status === 404
    || candidate.statusCode === 404
    || candidate.response?.status === 404
    || candidate.data?.error === 'not found'
    || candidate.error === 'not found';
}

function serverErrorText(error: unknown, fallback = 'Unable to save project.'): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (
      data &&
      typeof data === 'object' &&
      'error' in data &&
      typeof data.error === 'string'
    ) {
      return data.error;
    }
  }
  return error instanceof Error ? error.message : fallback;
}

function LoginScreen({ initialError }: { initialError?: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError ?? '');
  const loginMutation = useLogin();

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submittedPassword = password;
    setPassword('');
    setError('');

    try {
      await loginMutation.mutateAsync({ data: { password: submittedPassword } });
      setAuthenticationRequired(false);
      await queryClient.invalidateQueries({
        queryKey: getGetSessionQueryKey(),
        exact: true,
      });
    } catch (loginError) {
      setError(serverErrorText(loginError, 'Unable to log in.'));
    }
  };

  return (
    <div className="app-shell auth-shell">
      <Header showLogout={false} />
      <main className="auth-main">
        <section className="auth-card">
          <p className="eyebrow">Control panel</p>
          <h1 className="auth-title">Log in</h1>
          <form className="auth-form" onSubmit={submitLogin} data-testid="login-form">
            <label className="auth-field" htmlFor="login-password">
              Password
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                data-testid="input-login-password"
              />
            </label>
            {error && <p className="auth-error" role="alert" data-testid="error-login">{error}</p>}
            <button
              className="task-primary-button auth-submit"
              type="submit"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

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

function formatDueDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = Number(match[2]);
  if (month < 1 || month > 12) return value;
  return `${Number(match[3])} ${months[month - 1]} ${match[1]}`;
}

const completedDateFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const brisbaneDateTimeFormatter = new Intl.DateTimeFormat('en-AU', {
  timeZone: 'Australia/Brisbane',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

function formatCompletedDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : completedDateFormatter.format(date);
}

function formatBrisbaneDateTime(value: string | null): string {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date unavailable'
    : brisbaneDateTimeFormatter.format(date);
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

function DecisionsPage() {
  const pendingQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const approvedQuery = useListDecisions(
    { status: 'approved' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'approved' }) } },
  );
  const declinedQuery = useListDecisions(
    { status: 'declined' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'declined' }) } },
  );
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const client = useQueryClient();
  const [notes, setNotes] = useState<Record<number, string>>({});
  const pending = pendingQuery.data ?? [];
  const projectNames = new Map((projectsQuery.data ?? []).map((project) => [project.slug, project.name]));
  const refreshDecisionData = async (decisionId: number) => {
    const affected = pending.find((decision) => decision.id === decisionId);
    const refreshes = [
      client.invalidateQueries({ queryKey: getListDecisionsQueryKey({ status: 'pending' }) }),
      client.invalidateQueries({ queryKey: getListDecisionsQueryKey({ status: 'approved' }) }),
      client.invalidateQueries({ queryKey: getListDecisionsQueryKey({ status: 'declined' }) }),
    ];
    if (affected) {
      refreshes.push(client.invalidateQueries({
        queryKey: getListProjectTasksQueryKey(affected.project_slug),
      }));
    }
    await Promise.all(refreshes);
  };
  const approveMutation = useApproveDecision({
    mutation: {
      onSuccess: async (_decision, variables) => refreshDecisionData(variables.id),
    },
  });
  const declineMutation = useDeclineDecision({
    mutation: {
      onSuccess: async (_decision, variables) => refreshDecisionData(variables.id),
    },
  });
  const sortedHistory: DecisionWithNames[] = [
    ...(approvedQuery.data ?? []),
    ...(declinedQuery.data ?? []),
  ].sort((a, b) => {
    const aTime = a.decided_at ? new Date(a.decided_at).getTime() : 0;
    const bTime = b.decided_at ? new Date(b.decided_at).getTime() : 0;
    return bTime - aTime;
  });
  const decide = async (decision: DecisionWithNames, action: 'approve' | 'decline') => {
    const body = { note: (notes[decision.id] ?? '').trim() || undefined };
    try {
      if (action === 'approve') {
        await approveMutation.mutateAsync({ id: decision.id, data: body });
      } else {
        await declineMutation.mutateAsync({ id: decision.id, data: body });
      }
      setNotes((current) => {
        const next = { ...current };
        delete next[decision.id];
        return next;
      });
    } catch {
      // The server error is shown on the corresponding pending recommendation.
    }
  };
  const isLoading = pendingQuery.isLoading || approvedQuery.isLoading || declinedQuery.isLoading;
  const queryError = pendingQuery.error ?? approvedQuery.error ?? declinedQuery.error;

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main decisions-main">
        <Link className="back-link" href="/" data-testid="link-decisions-home">← Home</Link>
        <div className="detail-heading decisions-heading">
          <p className="eyebrow">Review queue</p>
          <h1 className="detail-title">Decisions</h1>
          <p className="detail-description">Ollie’s recommendations, ready for your call.</p>
        </div>

        <section className="decision-section" aria-labelledby="pending-decisions-title">
          <div className="decision-section-heading">
            <h2 id="pending-decisions-title">Waiting for review</h2>
            {!pendingQuery.isLoading && <span className="decision-count">{pending.length} pending</span>}
          </div>
          {isLoading ? (
            <div className="decision-skeleton" role="status" aria-label="Loading decisions"><span /><span /></div>
          ) : queryError ? (
            <div className="task-query-error" role="alert">
              <p>{serverErrorText(queryError, 'Unable to load decisions.')}</p>
              <button className="task-secondary-button" type="button" onClick={() => {
                void Promise.all([pendingQuery.refetch(), approvedQuery.refetch(), declinedQuery.refetch()]);
              }}>Retry</button>
            </div>
          ) : pending.length === 0 ? (
            <p className="decision-empty" data-testid="status-no-decisions">No decisions waiting</p>
          ) : (
            <div className="decision-list" data-testid="list-pending-decisions">
              {pending.map((decision) => {
                const isApproving = approveMutation.isPending && approveMutation.variables?.id === decision.id;
                const isDeclining = declineMutation.isPending && declineMutation.variables?.id === decision.id;
                const actionError = approveMutation.variables?.id === decision.id && approveMutation.isError
                  ? approveMutation.error
                  : declineMutation.variables?.id === decision.id && declineMutation.isError
                    ? declineMutation.error
                    : null;
                return (
                  <article className="decision-card" key={decision.id} data-testid={`card-decision-${decision.id}`}>
                    <div className="decision-card-top">
                      <div>
                        <p className="decision-project">{projectNames.get(decision.project_slug) ?? decision.project_slug}</p>
                        <h3 className="decision-title">{decision.title}</h3>
                      </div>
                      <span className={`decision-urgency urgency-${decision.urgency}`}>{decision.urgency} urgency</span>
                    </div>
                    <p className="decision-recommendation">{decision.recommendation}</p>
                    <dl className="decision-facts">
                      <div><dt>Cost</dt><dd>{decision.cost_estimate_aud == null ? 'Cost unknown' : `$${decision.cost_estimate_aud} est.`}</dd></div>
                      <div><dt>Risk</dt><dd>{decision.risk}</dd></div>
                      <div><dt>Confidence</dt><dd>{decision.confidence}</dd></div>
                      <div><dt>Owner</dt><dd>{decision.owner_name}</dd></div>
                      <div><dt>Due</dt><dd>{decision.due_date ? formatDueDate(decision.due_date) : 'Date unavailable'}</dd></div>
                    </dl>
                    <label className="decision-note">
                      <span>Review note <span className="task-field-optional">(optional)</span></span>
                      <input
                        type="text"
                        maxLength={500}
                        value={notes[decision.id] ?? ''}
                        onChange={(event) => setNotes((current) => ({ ...current, [decision.id]: event.target.value }))}
                        placeholder="Add context for this call"
                        data-testid={`input-decision-note-${decision.id}`}
                      />
                    </label>
                    {actionError && (
                      <p className="decision-error" role="alert" data-testid={`error-decision-${decision.id}`}>
                        {serverErrorText(actionError, 'Unable to update this decision.')}
                      </p>
                    )}
                    <div className="decision-actions">
                      <button
                        className="decision-approve"
                        type="button"
                        disabled={approveMutation.isPending || declineMutation.isPending}
                        onClick={() => void decide(decision, 'approve')}
                        data-testid={`button-approve-decision-${decision.id}`}
                      >
                        {isApproving ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        className="decision-decline"
                        type="button"
                        disabled={approveMutation.isPending || declineMutation.isPending}
                        onClick={() => void decide(decision, 'decline')}
                        data-testid={`button-decline-decision-${decision.id}`}
                      >
                        {isDeclining ? 'Declining…' : 'Decline'}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="decision-history" aria-labelledby="decision-history-title">
          <div className="decision-section-heading">
            <h2 id="decision-history-title">Decision history</h2>
            <span className="decision-count">{sortedHistory.length} resolved</span>
          </div>
          {isLoading ? (
            <div className="decision-history-skeleton" role="status" aria-label="Loading decision history" />
          ) : sortedHistory.length === 0 ? (
            <p className="decision-empty">No decisions recorded yet</p>
          ) : (
            <div className="decision-history-list" data-testid="list-decision-history">
              {sortedHistory.map((decision) => (
                <article className="decision-history-row" key={decision.id} data-testid={`history-decision-${decision.id}`}>
                  <div className="history-decision-copy">
                    <p className="decision-project">{projectNames.get(decision.project_slug) ?? decision.project_slug}</p>
                    <h3>{decision.title}</h3>
                    {decision.note && <p className="history-note">{decision.note}</p>}
                  </div>
                  <div className="history-decision-meta">
                    <span className={`history-status history-status-${decision.status}`}>{decision.status}</span>
                    <time>{formatBrisbaneDateTime(decision.decided_at)}</time>
                    {decision.status === 'approved' && (
                      <Link className="history-task-link" href={`/projects/${decision.project_slug}?tab=To-do`}>
                        View task
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function AgentsPage() {
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
    setIsEditing(true);
  };

  const closeEditor = () => {
    updateProjectMutation.reset();
    setIsEditing(false);
  };

  const saveProject = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProjectMutation.reset();

    const changes: { status?: string; description?: string | null } = {};
    if (draftStatus !== project.status) changes.status = draftStatus;
    if (draftDescription !== (project.description ?? '')) {
      changes.description = draftDescription;
    }

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
      <main className="page-wrap detail-main">
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
          <div style={{ marginTop: 20 }}>
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
          className={`tab-panel${activeTab === 'To-do' ? ' todo-tab-panel' : activeTab === 'Overview & Goals' ? ' goal-tab-panel' : ''}`}
          role="tabpanel"
          id="project-tab-panel"
          aria-labelledby={`tab-${activeTab}`}
          data-testid="panel-project-tab"
        >
          {activeTab === 'To-do'
            ? <ProjectTodo slug={project.slug} />
            : activeTab === 'Overview & Goals'
              ? <ProjectGoals slug={project.slug} />
              : 'Not built yet'}
        </section>
      </main>
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/decisions" component={DecisionsPage} />
        <Route path="/projects/:slug" component={ProjectDetail} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function AuthGate() {
  const authRequired = useAuthenticationRequired();
  const sessionQuery = useGetSession({
    query: {
      queryKey: getGetSessionQueryKey(),
      enabled: !authRequired,
      retry: false,
    },
  });

  if (authRequired) {
    return <LoginScreen />;
  }
  if (sessionQuery.isSuccess) {
    const devBypass = sessionQuery.data.dev_bypass;
    return (
      <DevAuthBypassContext.Provider value={devBypass}>
        {devBypass && (
          <div className="dev-auth-banner" role="status">
            DEV: login off
          </div>
        )}
        <Router />
      </DevAuthBypassContext.Provider>
    );
  }
  if (sessionQuery.isError) {
    return (
      <LoginScreen
        initialError={
          isUnauthorizedError(sessionQuery.error)
            ? undefined
            : serverErrorText(sessionQuery.error, 'Unable to check session.')
        }
      />
    );
  }

  return <main className="auth-loading" aria-live="polite">Loading…</main>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <AuthGate />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
