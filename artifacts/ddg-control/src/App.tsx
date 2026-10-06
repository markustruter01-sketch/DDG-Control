import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import {
  getGetProjectQueryKey,
  getListProjectsQueryKey,
  useGetProject,
  useListProjects,
} from '@workspace/api-client-react';
import { PROJECT_TABS } from '@workspace/project-constants';
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

  return (
    <div className="app-shell">
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

function ProjectDetail() {
  const { slug = '' } = useParams<{ slug: string }>();
  const projectQuery = useGetProject(slug, {
    query: { queryKey: getGetProjectQueryKey(slug), retry: false },
  });
  const [activeTab, setActiveTab] = useState<(typeof PROJECT_TABS)[number]>(PROJECT_TABS[0]);

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
          className="tab-panel"
          role="tabpanel"
          id="project-tab-panel"
          aria-labelledby={`tab-${activeTab}`}
          data-testid="panel-project-tab"
        >
          Not built yet
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
