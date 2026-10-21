import { lazy, Suspense, type ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/header';

const AgentsPage = lazy(() => import('@/pages/Agents').then((page) => ({ default: page.AgentsPage })));
const AIStackPage = lazy(() => import('@/pages/AIStack').then((page) => ({ default: page.AIStackPage })));
const DecisionsPage = lazy(() => import('@/pages/Decisions').then((page) => ({ default: page.DecisionsPage })));
const FinancePage = lazy(() => import('@/pages/Finance').then((page) => ({ default: page.FinancePage })));
const Home = lazy(() => import('@/pages/Home').then((page) => ({ default: page.Home })));
const OrganisationPage = lazy(() => import('@/pages/Organisation').then((page) => ({ default: page.OrganisationPage })));
const ProjectDetail = lazy(() => import('@/pages/ProjectDetail').then((page) => ({ default: page.ProjectDetail })));

export function Router() {
  return (
    <RoutedErrorBoundary>
      <Suspense fallback={<PageLoading />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/organisation" component={OrganisationPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/ai-stack" component={AIStackPage} />
        <Route path="/decisions" component={DecisionsPage} />
        <Route path="/finances" component={FinancePage} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route component={NotFoundPage} />
      </Switch>
      </Suspense>
    </RoutedErrorBoundary>
  );
}

function PageLoading() {
  return <div className="app-shell">
    <Header />
    <main className="page-wrap detail-main" aria-busy="true">
      <h1 className="state-title" role="status">Opening page…</h1>
      <p className="state-copy">Navigation remains available while this page loads.</p>
    </main>
  </div>;
}

function PageUnavailable() {
  return <div className="app-shell">
    <Header />
    <main className="page-wrap detail-main">
      <h1 className="state-title" role="alert">Page unavailable</h1>
      <p className="state-copy">Use navigation to open another page, or reload to fetch the current app files.</p>
      <p className="state-copy">Reloading can discard unsaved changes.</p>
      <button className="task-secondary-button" type="button" onClick={() => window.location.reload()}>Reload app</button>
    </main>
  </div>;
}

function NotFoundPage() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-wrap detail-main not-found">
        <p className="eyebrow">Unknown page</p>
        <h1 className="state-title">Page not found</h1>
        <p className="state-copy">Check the address or return to the company overview.</p>
        <Link className="back-link" href="/">← Home</Link>
      </main>
    </div>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location} FallbackComponent={PageUnavailable}>{children}</ErrorBoundary>;
}
