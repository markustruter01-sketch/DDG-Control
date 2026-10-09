import { useState, type FormEvent } from 'react';
import { useQueryClient, type QueryClient, type QueryKey } from '@tanstack/react-query';
import { Link } from 'wouter';
import {
  getGetFinanceSummaryQueryKey,
  getListFinanceDebtsQueryKey,
  getListFinanceExpensesQueryKey,
  getListFinanceRevenueQueryKey,
  getListProjectsQueryKey,
  useCreateFinanceDebt,
  useCreateFinanceExpense,
  useCreateFinanceRevenue,
  useDeleteFinanceDebt,
  useDeleteFinanceExpense,
  useDeleteFinanceRevenue,
  useListFinanceDebts,
  useListFinanceExpenses,
  useListFinanceRevenue,
  useListProjects,
  useUpdateFinanceDebt,
  useUpdateFinanceExpense,
  useUpdateFinanceRevenue,
  type FinanceDebt,
  type FinanceExpense,
  type FinanceRevenue,
  type Project,
} from '@workspace/api-client-react';
import { EXPENSE_KINDS } from '@workspace/project-constants';
import { Header } from '@/components/header';
import { serverErrorText } from '@/lib/errors';
import {
  centsToDollarInput,
  currentBrisbaneDate,
  dollarsToCents,
  formatDueDate,
  formatFigure,
} from '@/lib/format';

type ExpenseKind = (typeof EXPENSE_KINDS)[number];

const expenseKindLabels: Record<ExpenseKind, string> = {
  recurring_monthly: 'Monthly recurring',
  one_off: 'One-off',
};

function financeVentureName(slug: string | null, projects: Project[]): string {
  if (!slug) return 'Company';
  return projects.find((project) => project.slug === slug)?.name ?? slug;
}

async function refreshFinanceData(client: QueryClient, listQueryKey: QueryKey): Promise<void> {
  await Promise.all([
    client.invalidateQueries({ queryKey: listQueryKey }),
    client.invalidateQueries({ queryKey: getGetFinanceSummaryQueryKey() }),
  ]);
}

function FinanceProjectSelect({
  projects,
  value,
  onChange,
}: {
  projects: Project[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="task-field">
      Venture
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="company">Company</option>
        {projects.map((project) => (
          <option key={project.id} value={project.slug}>{project.name}</option>
        ))}
      </select>
    </label>
  );
}

export function FinancePage() {
  const projectsQuery = useListProjects({
    query: { queryKey: getListProjectsQueryKey() },
  });
  const projects = projectsQuery.data ?? [];

  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap finances-main" data-testid="page-finances">
        <p className="eyebrow">Company-wide</p>
        <h1 className="home-title">Finances</h1>
        {projectsQuery.isLoading && (
          <p className="finance-page-state" role="status">Loading ventures…</p>
        )}
        {projectsQuery.isError && (
          <p className="finance-page-error" role="alert">
            {serverErrorText(projectsQuery.error, 'Unable to load ventures.')}
          </p>
        )}
        <div className="finance-sections">
          <FinanceDebtsSection projects={projects} />
          <FinanceExpensesSection projects={projects} />
          <FinanceRevenueSection projects={projects} />
        </div>
      </main>
    </div>
  );
}

function FinanceDebtsSection({ projects }: { projects: Project[] }) {
  const client = useQueryClient();
  const debtsQuery = useListFinanceDebts();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: '',
    balance: '',
    projectSlug: 'company',
    note: '',
  });
  const createMutation = useCreateFinanceDebt({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceDebtsQueryKey()),
    },
  });
  const updateMutation = useUpdateFinanceDebt({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceDebtsQueryKey()),
    },
  });
  const deleteMutation = useDeleteFinanceDebt({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceDebtsQueryKey()),
    },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openAdd = () => {
    setEditingId(null);
    setDraft({ name: '', balance: '', projectSlug: 'company', note: '' });
    setError('');
    setIsEditorOpen(true);
  };
  const openEdit = (entry: FinanceDebt) => {
    setEditingId(entry.id);
    setDraft({
      name: entry.name,
      balance: centsToDollarInput(entry.balance_cents),
      projectSlug: entry.project_slug ?? 'company',
      note: entry.note ?? '',
    });
    setError('');
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let balanceCents: number;
    try {
      balanceCents = dollarsToCents(draft.balance);
    } catch {
      setError('Enter an amount like 12.34');
      return;
    }
    const data = {
      name: draft.name.trim(),
      balance_cents: balanceCents,
      project_slug: draft.projectSlug === 'company' ? null : draft.projectSlug,
      note: draft.note.trim() || null,
    };
    try {
      if (editingId === null) {
        await createMutation.mutateAsync({ data });
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeEditor();
    } catch (saveError) {
      setError(serverErrorText(saveError, 'Unable to save debt.'));
    }
  };
  const remove = async (entry: FinanceDebt) => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
    } catch (deleteError) {
      setError(serverErrorText(deleteError, 'Unable to delete debt.'));
    }
  };

  return (
    <section className="finance-section" aria-labelledby="finance-debts-title" data-testid="section-finance-debts">
      <div className="finance-section-heading">
        <h2 id="finance-debts-title">Debts</h2>
        <button className="task-primary-button" type="button" onClick={openAdd} data-testid="button-add-debt">
          Add debt
        </button>
      </div>
      {error && !isEditorOpen && <p className="finance-form-error" role="alert">{error}</p>}
      {debtsQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading debts…</p>
      ) : debtsQuery.isError ? (
        <p className="finance-form-error" role="alert">{serverErrorText(debtsQuery.error, 'Unable to load debts.')}</p>
      ) : debtsQuery.data?.length ? (
        <div className="finance-entry-list">
          {debtsQuery.data.map((entry) => (
            <article className="finance-entry" key={entry.id} data-testid={`finance-debt-${entry.id}`}>
              <div className="finance-entry-content">
                <div>
                  <h3 className="finance-entry-name">{entry.name}</h3>
                  <p className="finance-entry-meta">{financeVentureName(entry.project_slug, projects)}</p>
                </div>
                <p className="finance-entry-amount">{formatFigure(entry.balance_cents, 'aud_cents')}</p>
              </div>
              <div className="finance-entry-actions">
                <button className="task-secondary-button" type="button" onClick={() => openEdit(entry)}>Edit</button>
                <button className="task-secondary-button finance-delete-button" type="button" onClick={() => void remove(entry)} disabled={deleteMutation.isPending}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="task-state-message">Nothing added yet</p>
      )}
      {isEditorOpen && (
        <form className="finance-entry-form task-editor-form" onSubmit={submit} data-testid="form-finance-debt">
          <label className="task-field">
            Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={100} />
          </label>
          <label className="task-field">
            Balance (dollars)
            <input type="text" inputMode="decimal" value={draft.balance} onChange={(event) => setDraft({ ...draft, balance: event.target.value })} required data-testid="input-finance-debt-balance" />
          </label>
          <FinanceProjectSelect projects={projects} value={draft.projectSlug} onChange={(projectSlug) => setDraft({ ...draft, projectSlug })} />
          <label className="task-field">
            Note <span className="task-field-optional">(optional)</span>
            <textarea rows={2} maxLength={300} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
          </label>
          {error && <p className="finance-form-error" role="alert">{error}</p>}
          <div className="task-form-actions">
            <button className="task-primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId === null ? 'Add debt' : 'Save changes'}
            </button>
            <button className="task-secondary-button" type="button" onClick={closeEditor} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}

function FinanceExpensesSection({ projects }: { projects: Project[] }) {
  const client = useQueryClient();
  const expensesQuery = useListFinanceExpenses();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: '',
    kind: 'one_off' as ExpenseKind,
    amount: '',
    projectSlug: 'company',
    spentOn: currentBrisbaneDate(),
    active: true,
    note: '',
  });
  const createMutation = useCreateFinanceExpense({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceExpensesQueryKey()),
    },
  });
  const updateMutation = useUpdateFinanceExpense({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceExpensesQueryKey()),
    },
  });
  const deleteMutation = useDeleteFinanceExpense({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceExpensesQueryKey()),
    },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const emptyDraft = () => ({
    name: '',
    kind: 'one_off' as ExpenseKind,
    amount: '',
    projectSlug: 'company',
    spentOn: currentBrisbaneDate(),
    active: true,
    note: '',
  });
  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setError('');
    setIsEditorOpen(true);
  };
  const openEdit = (entry: FinanceExpense) => {
    setEditingId(entry.id);
    setDraft({
      name: entry.name,
      kind: entry.kind as ExpenseKind,
      amount: centsToDollarInput(entry.amount_cents),
      projectSlug: entry.project_slug ?? 'company',
      spentOn: entry.spent_on ?? '',
      active: entry.active,
      note: entry.note ?? '',
    });
    setError('');
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let amountCents: number;
    try {
      amountCents = dollarsToCents(draft.amount);
    } catch {
      setError('Enter an amount like 12.34');
      return;
    }
    const data = {
      name: draft.name.trim(),
      kind: draft.kind,
      amount_cents: amountCents,
      project_slug: draft.projectSlug === 'company' ? null : draft.projectSlug,
      spent_on: draft.kind === 'one_off' ? draft.spentOn : null,
      active: draft.active,
      note: draft.note.trim() || null,
    };
    try {
      if (editingId === null) {
        await createMutation.mutateAsync({ data });
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeEditor();
    } catch (saveError) {
      setError(serverErrorText(saveError, 'Unable to save expense.'));
    }
  };
  const remove = async (entry: FinanceExpense) => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
    } catch (deleteError) {
      setError(serverErrorText(deleteError, 'Unable to delete expense.'));
    }
  };
  const setActive = async (entry: FinanceExpense, active: boolean) => {
    setError('');
    try {
      await updateMutation.mutateAsync({ id: entry.id, data: { active } });
    } catch (updateError) {
      setError(serverErrorText(updateError, 'Unable to update expense.'));
    }
  };

  return (
    <section className="finance-section" aria-labelledby="finance-expenses-title" data-testid="section-finance-expenses">
      <div className="finance-section-heading">
        <h2 id="finance-expenses-title">Expenses</h2>
        <button className="task-primary-button" type="button" onClick={openAdd} data-testid="button-add-expense">
          Add expense
        </button>
      </div>
      {error && !isEditorOpen && <p className="finance-form-error" role="alert">{error}</p>}
      {expensesQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading expenses…</p>
      ) : expensesQuery.isError ? (
        <p className="finance-form-error" role="alert">{serverErrorText(expensesQuery.error, 'Unable to load expenses.')}</p>
      ) : expensesQuery.data?.length ? (
        <div className="finance-entry-list">
          {expensesQuery.data.map((entry) => (
            <article className="finance-entry" key={entry.id} data-testid={`finance-expense-${entry.id}`}>
              <div className="finance-entry-content">
                <div>
                  <h3 className="finance-entry-name">{entry.name}</h3>
                  <p className="finance-entry-meta">
                    {financeVentureName(entry.project_slug, projects)} · {expenseKindLabels[entry.kind as ExpenseKind] ?? entry.kind}
                    {entry.kind === 'one_off' && entry.spent_on ? ` · ${formatDueDate(entry.spent_on)}` : ''}
                  </p>
                </div>
                <p className="finance-entry-amount">{formatFigure(entry.amount_cents, 'aud_cents')}</p>
              </div>
              <div className="finance-entry-actions">
                {entry.kind === 'recurring_monthly' && (
                  <label className="finance-active-toggle">
                    <input
                      type="checkbox"
                      checked={entry.active}
                      disabled={updateMutation.isPending || editingId === entry.id}
                      onChange={(event) => void setActive(entry, event.target.checked)}
                      aria-label={`${entry.active ? 'Deactivate' : 'Activate'} ${entry.name}`}
                    />
                    <span>Active</span>
                  </label>
                )}
                <button className="task-secondary-button" type="button" onClick={() => openEdit(entry)}>Edit</button>
                <button className="task-secondary-button finance-delete-button" type="button" onClick={() => void remove(entry)} disabled={deleteMutation.isPending}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="task-state-message">Nothing added yet</p>
      )}
      {isEditorOpen && (
        <form className="finance-entry-form task-editor-form" onSubmit={submit} data-testid="form-finance-expense">
          <label className="task-field">
            Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={100} data-testid="input-finance-expense-name" />
          </label>
          <label className="task-field">
            Kind
            <select value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value as ExpenseKind })} data-testid="select-finance-expense-kind">
              {EXPENSE_KINDS.map((kind) => <option key={kind} value={kind}>{expenseKindLabels[kind]}</option>)}
            </select>
          </label>
          <label className="task-field">
            Amount (dollars)
            <input type="text" inputMode="decimal" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} required data-testid="input-finance-expense-amount" />
          </label>
          <FinanceProjectSelect projects={projects} value={draft.projectSlug} onChange={(projectSlug) => setDraft({ ...draft, projectSlug })} />
          {draft.kind === 'one_off' && (
            <label className="task-field">
              Date spent
              <input type="date" value={draft.spentOn} onChange={(event) => setDraft({ ...draft, spentOn: event.target.value })} required data-testid="input-finance-expense-date" />
            </label>
          )}
          {draft.kind === 'recurring_monthly' && (
            <label className="finance-active-toggle finance-form-active">
              <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
              <span>Active</span>
            </label>
          )}
          <label className="task-field">
            Note <span className="task-field-optional">(optional)</span>
            <textarea rows={2} maxLength={300} value={draft.note} onChange={(event) => setDraft({ ...draft, note: event.target.value })} />
          </label>
          {error && <p className="finance-form-error" role="alert" data-testid="error-finance-expense">{error}</p>}
          <div className="task-form-actions">
            <button className="task-primary-button" type="submit" disabled={isSaving} data-testid="button-submit-finance-expense">
              {isSaving ? 'Saving…' : editingId === null ? 'Add expense' : 'Save changes'}
            </button>
            <button className="task-secondary-button" type="button" onClick={closeEditor} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}

function FinanceRevenueSection({ projects }: { projects: Project[] }) {
  const client = useQueryClient();
  const revenueQuery = useListFinanceRevenue();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState({
    name: '',
    amount: '',
    projectSlug: 'company',
    receivedOn: currentBrisbaneDate(),
  });
  const createMutation = useCreateFinanceRevenue({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceRevenueQueryKey()),
    },
  });
  const updateMutation = useUpdateFinanceRevenue({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceRevenueQueryKey()),
    },
  });
  const deleteMutation = useDeleteFinanceRevenue({
    mutation: {
      onSuccess: () => refreshFinanceData(client, getListFinanceRevenueQueryKey()),
    },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const emptyDraft = () => ({
    name: '',
    amount: '',
    projectSlug: 'company',
    receivedOn: currentBrisbaneDate(),
  });
  const openAdd = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setError('');
    setIsEditorOpen(true);
  };
  const openEdit = (entry: FinanceRevenue) => {
    setEditingId(entry.id);
    setDraft({
      name: entry.name,
      amount: centsToDollarInput(entry.amount_cents),
      projectSlug: entry.project_slug ?? 'company',
      receivedOn: entry.received_on,
    });
    setError('');
    setIsEditorOpen(true);
  };
  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingId(null);
    setError('');
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    let amountCents: number;
    try {
      amountCents = dollarsToCents(draft.amount);
    } catch {
      setError('Enter an amount like 12.34');
      return;
    }
    const data = {
      name: draft.name.trim(),
      amount_cents: amountCents,
      project_slug: draft.projectSlug === 'company' ? null : draft.projectSlug,
      received_on: draft.receivedOn,
    };
    try {
      if (editingId === null) {
        await createMutation.mutateAsync({ data });
      } else {
        await updateMutation.mutateAsync({ id: editingId, data });
      }
      closeEditor();
    } catch (saveError) {
      setError(serverErrorText(saveError, 'Unable to save revenue.'));
    }
  };
  const remove = async (entry: FinanceRevenue) => {
    if (!window.confirm(`Delete "${entry.name}"? This cannot be undone.`)) return;
    setError('');
    try {
      await deleteMutation.mutateAsync({ id: entry.id });
    } catch (deleteError) {
      setError(serverErrorText(deleteError, 'Unable to delete revenue.'));
    }
  };

  return (
    <section className="finance-section" aria-labelledby="finance-revenue-title" data-testid="section-finance-revenue">
      <div className="finance-section-heading">
        <h2 id="finance-revenue-title">Revenue</h2>
        <button className="task-primary-button" type="button" onClick={openAdd} data-testid="button-add-revenue">
          Add revenue
        </button>
      </div>
      {error && !isEditorOpen && <p className="finance-form-error" role="alert">{error}</p>}
      {revenueQuery.isLoading ? (
        <p className="task-state-message" role="status">Loading revenue…</p>
      ) : revenueQuery.isError ? (
        <p className="finance-form-error" role="alert">{serverErrorText(revenueQuery.error, 'Unable to load revenue.')}</p>
      ) : revenueQuery.data?.length ? (
        <div className="finance-entry-list">
          {revenueQuery.data.map((entry) => (
            <article className="finance-entry" key={entry.id} data-testid={`finance-revenue-${entry.id}`}>
              <div className="finance-entry-content">
                <div>
                  <h3 className="finance-entry-name">{entry.name}</h3>
                  <p className="finance-entry-meta">
                    {financeVentureName(entry.project_slug, projects)} · Received {formatDueDate(entry.received_on)}
                  </p>
                </div>
                <p className="finance-entry-amount">{formatFigure(entry.amount_cents, 'aud_cents')}</p>
              </div>
              <div className="finance-entry-actions">
                <button className="task-secondary-button" type="button" onClick={() => openEdit(entry)}>Edit</button>
                <button className="task-secondary-button finance-delete-button" type="button" onClick={() => void remove(entry)} disabled={deleteMutation.isPending}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="task-state-message">Nothing added yet</p>
      )}
      {isEditorOpen && (
        <form className="finance-entry-form task-editor-form" onSubmit={submit} data-testid="form-finance-revenue">
          <label className="task-field">
            Name
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required maxLength={100} />
          </label>
          <label className="task-field">
            Amount (dollars)
            <input type="text" inputMode="decimal" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} required />
          </label>
          <FinanceProjectSelect projects={projects} value={draft.projectSlug} onChange={(projectSlug) => setDraft({ ...draft, projectSlug })} />
          <label className="task-field">
            Date received
            <input type="date" value={draft.receivedOn} onChange={(event) => setDraft({ ...draft, receivedOn: event.target.value })} required />
          </label>
          {error && <p className="finance-form-error" role="alert">{error}</p>}
          <div className="task-form-actions">
            <button className="task-primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : editingId === null ? 'Add revenue' : 'Save changes'}
            </button>
            <button className="task-secondary-button" type="button" onClick={closeEditor} disabled={isSaving}>Cancel</button>
          </div>
        </form>
      )}
    </section>
  );
}
