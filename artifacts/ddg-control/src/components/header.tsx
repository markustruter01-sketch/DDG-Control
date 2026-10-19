import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getListDecisionsQueryKey,
  useListDecisions,
  useLogout,
} from '@workspace/api-client-react';
import { Link } from 'wouter';
import { setAuthenticationRequired } from './auth';

type ColorMode = 'dark' | 'day';

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
  const pendingDecisionsQuery = useListDecisions(
    { status: 'pending' },
    { query: { queryKey: getListDecisionsQueryKey({ status: 'pending' }) } },
  );
  const pendingCount = pendingDecisionsQuery.data?.length ?? 0;

  return (
    <header className="topbar">
      <Link href="/" className="brand" data-testid="link-home-brand">
        <span className="brand-mark" aria-hidden="true">dd</span>
        <span>DDG Control</span>
      </Link>
      <nav className="topbar-actions" aria-label="Main navigation">
        {showLogout && (
          <Link href="/organisation" className="header-link" data-testid="link-organisation">
            Organisation
          </Link>
        )}
        <Link href="/agents" className="header-link" data-testid="link-agents">
          Agents
        </Link>
        <Link href="/ai-stack" className="header-link" data-testid="link-ai-stack">
          AI Stack
        </Link>
        <Link href="/decisions" className="header-link" data-testid="link-decisions">
          Decisions{pendingCount > 0 && <span className="header-count">[{pendingCount}]</span>}
        </Link>
        <Link href="/finances" className="header-link" data-testid="link-finances">
          Finances
        </Link>
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
      </nav>
    </header>
  );
}
