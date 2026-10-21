import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListDecisionsQueryKey,
  useListDecisions,
  useLogout,
} from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { setAuthenticationRequired } from './auth';
import { NotificationInbox } from './NotificationInbox';
import { EmployeeDock } from './EmployeeDock';

type ColorMode = 'dark' | 'day';

function revealProjects() {
  const target = document.getElementById('project-list');
  if (!target) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
}

export const DevAuthBypassContext = createContext(false);

const ColorModeContext = createContext<{
  mode: ColorMode;
  toggleMode: () => void;
} | null>(null);

export function useColorMode() {
  const colorMode = useContext(ColorModeContext);
  if (!colorMode) throw new Error('Color mode context is missing');
  return colorMode;
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ColorMode>(() => {
    try {
      return window.localStorage.getItem('ddg-control-color-mode') === 'day'
        ? 'day'
        : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    if (mode === 'day') {
      document.documentElement.dataset.theme = 'day';
    } else {
      delete document.documentElement.dataset.theme;
    }

    try {
      window.localStorage.setItem('ddg-control-color-mode', mode);
    } catch {
      // The selected mode still applies for this session if storage is unavailable.
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((currentMode) => currentMode === 'dark' ? 'day' : 'dark');
  };

  return (
    <ColorModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function Header({ showLogout = true }: { showLogout?: boolean }) {
  const client = useQueryClient();
  const logoutMutation = useLogout();
  const devBypass = useContext(DevAuthBypassContext);
  const { mode, toggleMode } = useColorMode();
  const [location] = useLocation();
  const pendingDecisionsQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const pendingCount = pendingDecisionsQuery.data?.length ?? 0;

  useEffect(() => {
    if (location !== '/' || window.location.hash !== '#project-list') return;
    window.requestAnimationFrame(() => {
      revealProjects();
    });
  }, [location]);

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand" data-testid="link-home-brand">
          <span>DDG Control</span>
        </Link>
        <div className="topbar-actions">
        <EmployeeDock />
        <NotificationInbox devBypass={devBypass} />
        <button
          className="theme-toggle"
          type="button"
          onClick={toggleMode}
          aria-label={`Switch to ${mode === 'dark' ? 'day' : 'night'} mode`}
          data-testid="button-theme-toggle"
        >
          {mode === 'dark' ? 'Day mode' : 'Night mode'}
        </button>
        {showLogout && !devBypass && (
          <button
            className="logout-button"
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate(undefined, {
              onSuccess: () => {
                client.clear();
                setAuthenticationRequired(true);
              },
            })}
            data-testid="button-logout"
          >
            {logoutMutation.isPending ? 'Logging out…' : 'Log out'}
          </button>
        )}
        </div>
      </header>
      <nav className="floating-navigation" aria-label="Primary navigation">
        <Link
          href="/#project-list"
          className={`floating-nav-control${location.startsWith('/projects/') ? ' is-current' : ''}`}
          aria-current={location.startsWith('/projects/') ? 'page' : undefined}
          onClick={() => {
            if (location === '/') {
              window.requestAnimationFrame(() => {
                revealProjects();
              });
            }
          }}
          data-testid="link-nav-projects"
        >
          <span className="floating-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 6.5h16M4 12h11M4 17.5h8" /></svg>
          </span>
          <span className="floating-nav-label">Projects</span>
        </Link>
        <Link
          href="/decisions"
          className={`floating-nav-control${location === '/decisions' ? ' is-current' : ''}`}
          aria-current={location === '/decisions' ? 'page' : undefined}
          data-testid="link-nav-decisions"
        >
          <span className="floating-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M5 5.5h14M5 12h14M5 18.5h9" /><path d="m16 17 2 2 3-4" /></svg>
          </span>
          <span className="floating-nav-label">Decisions</span>
          {pendingCount > 0 && <span className="floating-nav-count" aria-label={`${pendingCount} decisions pending`}>{pendingCount}</span>}
        </Link>
        <Link
          href="/"
          className="floating-nav-control floating-nav-home"
          aria-label="Home"
          aria-current={location === '/' ? 'page' : undefined}
          data-testid="link-nav-home"
        >
          <span className="floating-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="m4 10 8-6 8 6v9a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1z" /></svg>
          </span>
          <span className="floating-nav-label">Home</span>
        </Link>
        <Link
          href="/ai-stack"
          className={`floating-nav-control${location === '/ai-stack' ? ' is-current' : ''}`}
          aria-current={location === '/ai-stack' ? 'page' : undefined}
          data-testid="link-nav-ai-stack"
        >
          <span className="floating-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M12 3.5v3M12 17.5v3M3.5 12h3m11 0h3M6 6l2.1 2.1m7.8 7.8L18 18m0-12-2.1 2.1m-7.8 7.8L6 18" /><circle cx="12" cy="12" r="4.5" /></svg>
          </span>
          <span className="floating-nav-label">AI Stack</span>
        </Link>
        <Link
          href="/finances"
          className={`floating-nav-control${location === '/finances' ? ' is-current' : ''}`}
          aria-current={location === '/finances' ? 'page' : undefined}
          data-testid="link-nav-finance"
        >
          <span className="floating-nav-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M4 19.5h16M6.5 16V11m5.5 5V5m5.5 11V8" /></svg>
          </span>
          <span className="floating-nav-label">Finance</span>
        </Link>
      </nav>
    </>
  );
}
