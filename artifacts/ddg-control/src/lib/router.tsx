import { Route, Switch, Link } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/header';
import { Monitor } from '@/pages/Monitor';
function Unavailable() {
  return <><Header /><main className="monitor-main"><h1>Overview unavailable</h1><p>Reload the dashboard to try again.</p><button type="button" onClick={() => window.location.reload()}>Reload</button></main></>;
}
function RetiredPage() {
  return <><Header /><main className="monitor-main"><h1>One place to monitor DDG</h1><p>The dashboard has been simplified. Work and approvals happen in their original tools.</p><Link href="/">Open monitoring overview →</Link></main></>;
}
export function Router() {
  return <ErrorBoundary FallbackComponent={Unavailable}><Switch><Route path="/" component={Monitor} /><Route component={RetiredPage} /></Switch></ErrorBoundary>;
}
