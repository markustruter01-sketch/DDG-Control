// The showcase's stand-in for the Finance dashboard's trading API client (Finance's
// hooks/use-trading-client.ts). Every GET is answered from one public snapshot of the
// dashboard's own API answers (/api/public/finance-showcase, pushed by DDG Finance while the
// US market is closed). Nothing can be sent: any POST is refused. No secret is in this page.
import { useDocumentVisibility } from './finance/hooks/use-visibility';

type Snapshot = { taken_at: string | null; data: Record<string, unknown> };
let current: Promise<Snapshot> | null = null, loadedAt = 0;
const FIVE_MINUTES = 5 * 60_000;

function load(): Promise<Snapshot> {
  if (!current || Date.now() - loadedAt > FIVE_MINUTES) {
    loadedAt = Date.now();
    current = fetch('/api/public/finance-showcase')
      .then((r) => (r.ok ? r.json() : { taken_at: null, data: {} }))
      .catch(() => ({ taken_at: null, data: {} }));
  }
  return current;
}

/** When the numbers were taken (ISO time), for the "as at" line. */
export const snapshotTime = () => load().then((s) => s.taken_at);

export const api = {
  async get(path: string) {
    const s = await load();
    if (!(path in s.data)) throw new Error(`Not in the showcase: ${path}`);
    return { data: s.data[path] as never };
  },
  async post(): Promise<never> { throw new Error('This is a display-only copy of the dashboard.'); },
};

export function useVisibleInterval(ms: number): number | false {
  const visible = useDocumentVisibility();
  return visible ? Math.max(ms, FIVE_MINUTES) : false;
}
