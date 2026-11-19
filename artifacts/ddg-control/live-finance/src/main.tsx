// DDG Finance showcase (ddg.limited/live/finance): the real Finance main dashboard, display only.
// The dashboard's code is copied in by scripts/vendor-finance-showcase.py (src/finance).
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from 'wouter';
import HomePage from './finance/pages/HomePage';
import { VisibilityContext, useVisibilityProvider, installVisibilityListener } from './finance/hooks/use-visibility';
import { snapshotTime } from './snapshot';
import './finance/styles/night-glass.css';
import './showcase.css';

installVisibilityListener();
const client = new QueryClient({ defaultOptions: { queries: { retry: 0, staleTime: 5 * 60_000, refetchOnWindowFocus: false } } });

function App() {
  const visibility = useVisibilityProvider();
  return (
    <VisibilityContext.Provider value={visibility}>
      <QueryClientProvider client={client}>
        <Router base="/live-finance"><HomePage /></Router>
      </QueryClientProvider>
    </VisibilityContext.Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);

// "Paper money · numbers as at <time>" in the corner.
snapshotTime().then((t) => {
  const el = document.createElement('div');
  el.className = 'showcase-badge';
  el.textContent = t
    ? `Display copy · paper money · numbers as at ${new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }).format(new Date(t))} Brisbane`
    : 'Display copy · paper money · numbers loading';
  document.body.appendChild(el);
});
