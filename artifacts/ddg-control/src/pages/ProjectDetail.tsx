import { useId, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Header } from '@/components/header';
import { queryClient } from '@/lib/query-client';
import {
  getGetProjectQueryKey,
  getListProjectsQueryKey,
  useGetProject,
  useUpdateProject,
  type Project,
} from '@workspace/api-client-react';
import { PROJECT_STATUSES, PROJECT_TABS, projectTabsFor, type ProjectStatus, type ProjectTab } from '@workspace/project-constants';
import { Link, useParams } from 'wouter';
import { isNotFound, serverErrorText } from '@/lib/errors';
import { ProjectTodo } from '@/components/projects/Todo';
import { ProjectGoals } from '@/components/projects/Goals';
import { RevenueWorkspace, FinanceFleetWorkspace, CustomerWorkspace } from '@/components/projects/Data';
import { OverviewWorkspace, AgentActivityWorkspace, NextActionWorkspace } from '@/components/projects/Activity';

export function ProjectDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const projectQuery = useGetProject(slug, {
    query: { queryKey: getGetProjectQueryKey(slug), retry: false },
  });
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[number]>(() => (
    new URLSearchParams(window.location.search).get('tab') === 'To-do'
      ? 'To-do'
      : PROJECT_TABS[0]
  ));
  const tabsId = useId();
  const [focusedTab, setFocusedTab] = useState<ProjectTab | null>(null);
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
  const availableTabs = projectTabsFor(project.slug);
  const selectedTab = availableTabs.includes(activeTab) ? activeTab : availableTabs[0] ?? PROJECT_TABS[0];
  const focusableTab = focusedTab && availableTabs.includes(focusedTab) ? focusedTab : selectedTab;
  const tabId = (tab: ProjectTab) => `${tabsId}-${PROJECT_TABS.indexOf(tab)}`;
  function moveTabFocus(event: KeyboardEvent<HTMLButtonElement>, tab: ProjectTab) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const index = availableTabs.indexOf(tab);
    const nextIndex = event.key === 'ArrowRight' ? (index + 1) % availableTabs.length
      : event.key === 'ArrowLeft' ? (index + availableTabs.length - 1) % availableTabs.length
        : event.key === 'Home' ? 0 : event.key === 'End' ? availableTabs.length - 1 : null;
    if (nextIndex === null) return;
    event.preventDefault();
    const next = availableTabs[nextIndex];
    if (next) document.getElementById(tabId(next))?.focus();
    // Arrow keys move focus only. Enter/Space or click explicitly changes panel.
  }

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
          {availableTabs.map((tab) => (
            <button
              key={tab}
              className="tab-button"
              type="button"
              role="tab"
              id={tabId(tab)}
              aria-selected={selectedTab === tab}
              aria-controls={`${tabsId}-panel`}
              tabIndex={focusableTab === tab ? 0 : -1}
              onFocus={() => setFocusedTab(tab)}
              onKeyDown={(event) => moveTabFocus(event, tab)}
              onClick={() => { setActiveTab(tab); setFocusedTab(tab); }}
              data-testid={`tab-${tab}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <section
          className={`tab-panel${selectedTab === 'To-do' ? ' todo-tab-panel' : selectedTab === 'Overview & Goals' ? ' goal-tab-panel' : ' data-tab-panel'}`}
          role="tabpanel"
          id={`${tabsId}-panel`}
          aria-labelledby={tabId(selectedTab)}
          tabIndex={0}
          data-testid="panel-project-tab"
        >
          {selectedTab === 'To-do'
            ? <ProjectTodo slug={project.slug} />
            : selectedTab === 'Overview & Goals'
              ? <><ProjectGoals slug={project.slug} /><OverviewWorkspace slug={project.slug} /></>
              : selectedTab === 'Customers'
                ? <CustomerWorkspace slug={project.slug} />
                : selectedTab === 'Revenue & Subscriptions'
                  ? project.slug === 'finance'
                    ? <FinanceFleetWorkspace />
                    : <RevenueWorkspace slug={project.slug} />
                  : selectedTab === 'Agent Activity'
                    ? <AgentActivityWorkspace slug={project.slug} />
                    : <NextActionWorkspace slug={project.slug} />}
        </section>
      </main>
    </div>
  );
}
