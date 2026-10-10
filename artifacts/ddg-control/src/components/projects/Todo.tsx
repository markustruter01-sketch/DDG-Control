import { useState, type FormEvent } from 'react';
import { queryClient } from '@/lib/query-client';
import {
  getListMembersQueryKey,
  getListProjectTasksQueryKey,
  useCreateProjectTask,
  useListMembers,
  useListProjectTasks,
  useUpdateTask,
  type Member,
  type Task,
  type TaskInput,
  type TaskUpdate,
} from '@workspace/api-client-react';
import { TASK_STATUSES, TASK_STATUS_LABELS, type TaskStatus } from '@workspace/project-constants';
import { serverErrorText } from '@/lib/errors';
import { formatCompletedDate, formatDueDate } from '@/lib/format';

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

export function ProjectTodo({ slug }: { slug: string }) {
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
