import { useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  getGetProjectQueryKey,
  getListMembersQueryKey,
  getListProjectTasksQueryKey,
  getListProjectsQueryKey,
  useCreateProjectTask,
  useGetProject,
  useListMembers,
  useListProjectTasks,
  useListProjects,
  useUpdateTask,
  useUpdateProject,
  type Member,
  type Project,
  type Task,
  type TaskInput,
  type TaskUpdate,
} from '@workspace/api-client-react';
import {
  PROJECT_STATUSES,
  PROJECT_TABS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
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

const queryClient = new QueryClient();

function Header() {
  return (
    <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home-brand">
        <span className="brand-mark" aria-hidden="true">dd</span>
        <span>DDG Control</span>
      </Link>
    </header>
  );
}

function Home() {
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const backgroundStyle = {
    '--home-background': `url("${import.meta.env.BASE_URL}dashboard-background.jpg")`,
  } as CSSProperties;

  return (
    <div className="app-shell home-shell" style={backgroundStyle}>
      <Header />
      <main className="page-wrap home-main">
        <p className="eyebrow">Control panel</p>
        <h1 className="home-title">Projects</h1>
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
            {projectsQuery.data.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="project-tile"
                data-testid={`link-project-${project.slug}`}
              >
                <div className="tile-top">
                  <h2 className="tile-name" data-testid={`text-project-name-${project.slug}`}>{project.name}</h2>
                  <span className="status-badge" data-testid={`status-project-${project.slug}`}>
                    <span className="status-dot" aria-hidden="true" />
                    {project.status}
                  </span>
                </div>
                <div className="tile-facts">
                  <p className="tile-fact"><strong>Headline:</strong> No data yet</p>
                  <p className="tile-fact"><strong>Next action:</strong> No data yet</p>
                </div>
              </Link>
            ))}
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

function formatCompletedDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : completedDateFormatter.format(date);
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
      {error && (
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

      {canShowTaskList && tasks.length === 0 && (
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

function ProjectDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const projectQuery = useGetProject(slug, {
    query: { queryKey: getGetProjectQueryKey(slug), retry: false },
  });
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[number]>(PROJECT_TABS[0]);
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
          className={`tab-panel${activeTab === 'To-do' ? ' todo-tab-panel' : ''}`}
          role="tabpanel"
          id="project-tab-panel"
          aria-labelledby={`tab-${activeTab}`}
          data-testid="panel-project-tab"
        >
          {activeTab === 'To-do' ? <ProjectTodo slug={project.slug} /> : 'Not built yet'}
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
        <Route path="/projects/:slug" component={ProjectDetail} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
