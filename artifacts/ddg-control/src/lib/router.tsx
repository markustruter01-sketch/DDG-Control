import { Link, Route, Switch } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Header } from '@/components/header';
import { Home } from '@/pages/Home';
import { Money } from '@/pages/Money';
import { Social } from '@/pages/Social';
import { Ops } from '@/pages/Ops';

function Problem({ title }: { title: string }) {
  return (
    <div className="ng-page dusk"><div className="ng-wrap"><Header />
      <h1 style={{ margin: 0, fontWeight: 400 }}>{title}</h1>
      <p><Link href="/" className="btn fill">Back to home</Link></p>
    </div></div>
  );
}

export function Router() {
  return (
    <ErrorBoundary FallbackComponent={() => <Problem title="Something broke on this page. Reload to try again." />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/money" component={Money} />
        <Route path="/social" component={Social} />
        <Route path="/ops" component={Ops} />
        <Route component={() => <Problem title="That page doesn't exist." />} />
      </Switch>
    </ErrorBoundary>
  );
}
