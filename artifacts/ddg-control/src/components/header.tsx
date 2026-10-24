import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLogout } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { setAuthenticationRequired } from './auth';

export const DevAuthBypassContext = createContext(false);
const ColorModeContext = createContext<{ mode: 'dark' | 'day'; toggleMode: () => void } | null>(null);
export function useColorMode() {
  const value = useContext(ColorModeContext);
  if (!value) throw new Error('Color mode context is missing');
  return value;
}
export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'dark' | 'day'>(() => {
    try { return localStorage.getItem('ddg-control-color-mode') === 'day' ? 'day' : 'dark'; } catch { return 'dark'; }
  });
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    try { localStorage.setItem('ddg-control-color-mode', mode); } catch { /* Session preference remains usable. */ }
  }, [mode]);
  return <ColorModeContext.Provider value={{ mode, toggleMode: () => setMode(m => m === 'day' ? 'dark' : 'day') }}>{children}</ColorModeContext.Provider>;
}
export function Header({ showLogout = true }: { showLogout?: boolean }) {
  const { mode, toggleMode } = useColorMode();
  const client = useQueryClient(), logout = useLogout(), bypass = useContext(DevAuthBypassContext);
  return <header className="monitor-header">
    <Link href="/" className="monitor-brand"><img src={`${import.meta.env.BASE_URL}ddg-creative-glitch-original.png`} alt="" /><span>DDG Control<small>Company monitor</small></span></Link>
    <div className="monitor-header-actions"><span className="monitor-readonly">Read only</span>
      <button type="button" onClick={toggleMode} aria-label={`Switch to ${mode === 'day' ? 'night' : 'day'} mode`}>{mode === 'day' ? 'Night' : 'Day'}</button>
      {showLogout && !bypass && <button type="button" disabled={logout.isPending} onClick={() => logout.mutate(undefined, { onSuccess: () => { client.clear(); setAuthenticationRequired(true); } })}>{logout.isPending ? 'Leaving…' : 'Log out'}</button>}
      {logout.isError && <span role="alert">Logout failed. Try again.</span>}
    </div>
  </header>;
}
