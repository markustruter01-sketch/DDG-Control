import { createContext, useContext, type ComponentType, type ReactNode } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { AgentsPage } from '@/pages/Agents';
import { DecisionsPage } from '@/pages/Decisions';
import { FinancePage } from '@/pages/Finance';
import { Home } from '@/pages/Home';
import { OrganisationPage } from '@/pages/Organisation';

export const ProjectDetailContext = createContext<ComponentType | null>(null);

function ProjectDetailRoute() {
  const ProjectDetail = useContext(ProjectDetailContext);
  return ProjectDetail ? <ProjectDetail /> : null;
}

export function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/organisation" component={OrganisationPage} />
        <Route path="/agents" component={AgentsPage} />
        <Route path="/decisions" component={DecisionsPage} />
        <Route path="/finances" component={FinancePage} />
        <Route path="/projects/:slug" component={ProjectDetailRoute} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
