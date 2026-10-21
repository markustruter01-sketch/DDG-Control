import type { ReactNode } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/header';
import { AgentsPage } from '@/pages/Agents';
import { AIStackPage } from '@/pages/AIStack';
import { DecisionsPage } from '@/pages/Decisions';
import { FinancePage } from '@/pages/Finance';
import { Home } from '@/pages/Home';
import { OrganisationPage } from '@/pages/Organisation';
import { ProjectDetail } from '@/pages/ProjectDetail';

export function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
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
    </RoutedErrorBoundary>
  );
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
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
