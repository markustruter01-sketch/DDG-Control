import { useState, useSyncExternalStore, type FormEvent } from 'react';
import {
  getGetSessionQueryKey,
  useGetSession,
  useLogin,
} from '@workspace/api-client-react';
import { queryClient } from '../lib/query-client';
import { Router } from '../lib/router';
import { isUnauthorizedError, serverErrorText } from '../lib/errors';
import { DevAuthBypassContext, Header } from './header';

let authenticationRequired = false;
const authenticationListeners = new Set<() => void>();

export function setAuthenticationRequired(required: boolean): void {
  if (authenticationRequired === required) return;
  authenticationRequired = required;
  authenticationListeners.forEach((listener) => listener());
}

function useAuthenticationRequired(): boolean {
  return useSyncExternalStore(
    (listener) => {
      authenticationListeners.add(listener);
      return () => {
        authenticationListeners.delete(listener);
      };
    },
    () => authenticationRequired,
    () => authenticationRequired,
  );
}

function LoginScreen({ initialError }: { initialError?: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError ?? '');
  const loginMutation = useLogin();

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const submittedPassword = password;
    setPassword('');
    setError('');

    try {
      await loginMutation.mutateAsync({ data: { password: submittedPassword } });
      setAuthenticationRequired(false);
      await queryClient.invalidateQueries({
        queryKey: getGetSessionQueryKey(),
        exact: true,
      });
    } catch (loginError) {
      setError(serverErrorText(loginError, 'Unable to log in.'));
    }
  };

  return (
    <div className="app-shell auth-shell">
      <Header showLogout={false} />
      <main className="auth-main">
        <section className="auth-card">
          <p className="eyebrow">Company monitor</p>
          <h1 className="auth-title">Log in</h1>
          <form className="auth-form" onSubmit={submitLogin} data-testid="login-form">
            <label className="auth-field" htmlFor="login-password">
              Password
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                data-testid="input-login-password"
              />
            </label>
            {error && <p className="auth-error" role="alert" data-testid="error-login">{error}</p>}
            <button
              className="task-primary-button auth-submit"
              type="submit"
              disabled={loginMutation.isPending}
              data-testid="button-login"
            >
              {loginMutation.isPending ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export function AuthGate() {
  const authRequired = useAuthenticationRequired();
  const sessionQuery = useGetSession({
    query: {
      queryKey: getGetSessionQueryKey(),
      enabled: !authRequired,
      retry: false,
    },
  });

  if (authRequired) {
    return <LoginScreen />;
  }
  if (sessionQuery.isSuccess) {
    const devBypass = sessionQuery.data.dev_bypass;
    return (
      <DevAuthBypassContext.Provider value={devBypass}>
        <div className="monitor-session-shell">
          {devBypass && (
            <div className="dev-auth-banner" role="status">
              DEV: login off
            </div>
          )}
          <Router />
        </div>
      </DevAuthBypassContext.Provider>
    );
  }
  if (sessionQuery.isError) {
    return (
      <LoginScreen
        initialError={
          isUnauthorizedError(sessionQuery.error)
            ? undefined
            : serverErrorText(sessionQuery.error, 'Unable to check session.')
        }
      />
    );
  }

  return <main className="auth-loading" aria-live="polite">Loading…</main>;
}
