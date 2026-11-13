import { useEffect, useState } from 'react';
import type { PublicFinance, PublicSummary } from '@workspace/api-client-react';

// Live public numbers for the website. Each shows "—" until loaded, never a guess.

/** Social footprint, coffee bags and charity (/api/public/summary). */
export function usePublicSummary(): PublicSummary | null {
  const [data, setData] = useState<PublicSummary | null>(null);
  useEffect(() => {
    let live = true;
    fetch('/api/public/summary')
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => { if (live) setData(body); })
      .catch(() => {});
    return () => { live = false; };
  }, []);
  return data;
}

/** DDG Finance in public (/api/public/finance): the trading platform's hourly push. */
export function usePublicFinance(): { data: PublicFinance | null; failed: boolean } {
  const [state, setState] = useState<{ data: PublicFinance | null; failed: boolean }>({ data: null, failed: false });
  useEffect(() => {
    let live = true;
    fetch('/api/public/finance')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((body: PublicFinance) => { if (live) setState({ data: body, failed: false }); })
      .catch(() => { if (live) setState({ data: null, failed: true }); });
    return () => { live = false; };
  }, []);
  return state;
}
