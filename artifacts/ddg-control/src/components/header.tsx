import { createContext, useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLogout } from '@workspace/api-client-react';
import { Link, useLocation } from 'wouter';
import { setAuthenticationRequired } from './auth';

export const DevAuthBypassContext = createContext(false);

const PAGES = [
  { href: '/', label: 'Home' },
  { href: '/money', label: 'Money' },
  { href: '/social', label: 'Social' },
  { href: '/ops', label: 'Ops' },
  { href: '/clients', label: 'Clients' },
];

function useBrisbaneClock(): string {
  const format = () => new Intl.DateTimeFormat('en-AU', {
    timeZone: 'Australia/Brisbane', weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit',
  }).format(new Date());
  const [now, setNow] = useState(format);
  useEffect(() => {
    const timer = setInterval(() => setNow(format()), 30_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}

export function Header({ showNav = true }: { showNav?: boolean }) {
  const [location] = useLocation();
  const client = useQueryClient();
  const logout = useLogout();
  const bypass = useContext(DevAuthBypassContext);
  const now = useBrisbaneClock();
  return (
    <header className="topbar">
      <Link href="/" className="brand" aria-label="DDG Control home">
        <img src={`${import.meta.env.BASE_URL}ddg-professional-white-transparent.png`} alt="" />
        <b>DDG</b><i aria-hidden="true" /><span>Control</span>
      </Link>
      {showNav && (
        <nav className="nav glass" aria-label="Pages">
          {PAGES.map((page) => (
            <Link key={page.href} href={page.href} aria-current={location === page.href ? 'page' : undefined}>{page.label}</Link>
          ))}
        </nav>
      )}
      <span className="pill glass">{now} · Brisbane</span>
      {bypass && <span className="pill glass" role="status">DEV: login off</span>}
      {showNav && !bypass && (
        <button type="button" className="btn glass" disabled={logout.isPending}
          onClick={() => logout.mutate(undefined, { onSuccess: () => { client.clear(); setAuthenticationRequired(true); } })}>
          {logout.isPending ? 'Leaving…' : 'Log out'}
        </button>
      )}
      {logout.isError && <span className="alert" role="alert">Logout failed. Try again.</span>}
    </header>
  );
}
