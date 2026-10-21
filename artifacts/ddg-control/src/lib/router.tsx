import type { ReactNode } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
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
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
