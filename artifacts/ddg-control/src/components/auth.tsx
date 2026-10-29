import { useState, useSyncExternalStore, type FormEvent } from 'react';
import {
  getGetSessionQueryKey,
  useGetSession,
  useLogin,
} from '@workspace/api-client-react';
import { queryClient } from '../lib/query-client';
import { Router } from '../lib/router';
import { isUnauthorizedError, serverErrorText } from '../lib/errors';
import { DevAuthBypassContext } from './header';

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
  const [email, setEmail] = useState(() => { try { return localStorage.getItem('ddg-login-email') ?? ''; } catch { return ''; } });
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(initialError ?? '');
  const loginMutation = useLogin();

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const sent = { email: email.trim(), password, code: code.replace(/\s/g, '') };
    setPassword('');
    setCode('');
    setError('');
    try {
      await loginMutation.mutateAsync({ data: sent });
      try { localStorage.setItem('ddg-login-email', sent.email); } catch { /* only a convenience */ }
      setAuthenticationRequired(false);
      await queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey(), exact: true });
    } catch (loginError) {
      setError(serverErrorText(loginError, 'Unable to log in.') === 'invalid credentials'
        ? 'Email, password or code is wrong. Codes change every 30 seconds.'
        : serverErrorText(loginError, 'Unable to log in.'));
    }
  };

  return (
    <div className="ng-page photo login">
      <form className="glass panel" onSubmit={submitLogin} data-testid="login-form">
        <img src={`${import.meta.env.BASE_URL}ddg-professional-white-transparent.png`} alt="DDG" style={{ width: 44, height: 44 }} />
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>DDG Control</h1>
        <label className="field" htmlFor="login-email">
          Email
          <input id="login-email" name="email" type="email" autoComplete="username" value={email}
            onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="field" htmlFor="login-password">
          Password
          <input id="login-password" name="password" type="password" autoComplete="current-password" value={password}
            onChange={(event) => setPassword(event.target.value)} required data-testid="input-login-password" />
        </label>
        <label className="field" htmlFor="login-code">
          Authenticator code
          <input id="login-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7}
            placeholder="6 digits from Google Authenticator" value={code} onChange={(event) => setCode(event.target.value)} required />
        </label>
        {error && <p className="alert" role="alert" style={{ margin: 0 }} data-testid="error-login">{error}</p>}
        <button className="btn fill" type="submit" disabled={loginMutation.isPending} data-testid="button-login">
          {loginMutation.isPending ? 'Checking…' : 'Log in'}
        </button>
      </form>
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
        <Router />
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

  return <main className="ng-page login" aria-live="polite">Loading…</main>;
}
