import { useQuery } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { setAuthenticationRequired } from '@/components/auth';

type Point = { label: string; value: number };
type Card = { key: string; title: string; unit: 'aud_cents' | 'count'; value: number | null; bars: Point[];
  note: string; state: 'partial' | 'missing' | 'unavailable'; as_of: string | null };
type Snapshot = { read_at: string; period: { from: string; to: string }; cards: Card[] };
const keys = ['profit', 'income', 'debt', 'customers', 'followers', 'reach', 'engagement', 'costs'];
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const integer = (v: unknown) => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0;
const text = (v: unknown): v is string => typeof v === 'string' && v.length <= 1000;
async function loadSnapshot(): Promise<Snapshot> {
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch('/api/monitor', { cache: 'no-store', signal: controller.signal });
    if (response.status === 401) { setAuthenticationRequired(true); throw new Error('Owner login required.'); }
    if (response.status === 403) throw new Error('Saved figures are not accessible in this session.');
    if (!response.ok) throw new Error('Saved company figures unavailable.');
    const v: unknown = await response.json();
    if (!record(v) || v.version !== 2 || v.evidence !== 'saved_records' || v.live_verified !== false || v.currency !== 'AUD' ||
        v.currency_basis !== 'existing_dashboard_convention' || !text(v.read_at) || !Number.isFinite(Date.parse(v.read_at)) ||
        !record(v.period) || !text(v.period.from) || !text(v.period.to) || !Array.isArray(v.cards) || v.cards.length !== 8 ||
        !v.cards.every((c, index) => record(c) && c.key === keys[index] && text(c.title) && ['aud_cents', 'count'].includes(String(c.unit)) &&
          (c.value === null || integer(c.value)) && text(c.note) && ['partial', 'missing', 'unavailable'].includes(String(c.state)) &&
          (c.as_of === null || text(c.as_of)) && Array.isArray(c.bars) && c.bars.length <= 6 &&
          c.bars.every(p => record(p) && text(p.label) && integer(p.value)) &&
          (c.state === 'partial' ? c.value !== null && c.bars.length > 0 : c.value === null && c.bars.length === 0))) throw new Error('Saved figures could not be read safely.');
    return v as Snapshot;
  } finally { clearTimeout(timer); }
}
const number = (value: number, unit: Card['unit'], compact = false) => new Intl.NumberFormat('en-AU', {
  ...(unit === 'aud_cents' ? { style: 'currency', currency: 'AUD', maximumFractionDigits: compact ? 1 : 0 } : { maximumFractionDigits: compact ? 1 : 0 }),
  notation: compact ? 'compact' : 'standard',
}).format(unit === 'aud_cents' ? value / 100 : value);
function BarGraph({ card }: { card: Card }) {
  const max = Math.max(...card.bars.map(b => b.value), 1);
  return <div className="kpi-bars" role="img" aria-label={`${card.title}, saved breakdown: ${card.bars.map(b => `${b.label} ${number(b.value, card.unit)}`).join('; ')}`}>
    {card.bars.map((bar, index) => <div className="kpi-bar-row" key={index}><span title={bar.label}>{bar.label}</span><div className="kpi-bar-track"><i style={{ width: `${100 * bar.value / max}%` }} /></div><b title={number(bar.value, card.unit)}>{number(bar.value, card.unit, true)}</b></div>)}
  </div>;
}
const emptyCards: Card[] = keys.map((key, i) => ({ key, title: ['Consolidated profit', 'Recorded income', 'Recorded debt', 'Online customers', 'Social footprint', 'Social reach', 'Social engagement', 'Monthly commitments'][i],
  unit: ['profit', 'income', 'debt', 'costs'].includes(key) ? 'aud_cents' : 'count', value: null, bars: [], note: 'No verified figure loaded', state: 'missing', as_of: null }));
export function Monitor() {
  const query = useQuery({ queryKey: ['company-kpi-snapshot'], queryFn: loadSnapshot, retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false, staleTime: Infinity });
  const cards = query.data?.cards ?? emptyCards;
  return <div className="kpi-shell"><Header /><main className="kpi-main" id="main-content">
    <section className="kpi-heading"><div><p className="eyebrow">DDG / COMPANY INTELLIGENCE</p><h1>Company at a glance<span className="kpi-heading-dot" aria-hidden="true">.</span></h1></div>
      <div className="kpi-toolbar"><span>{query.data ? `Income period: ${query.data.period.from} — ${query.data.period.to}` : 'Saved company records'}</span><button type="button" disabled={query.isFetching} onClick={() => void query.refetch()} aria-label="Refresh saved company figures">{query.isFetching ? 'Loading…' : 'Refresh ↗'}</button></div>
    </section>
    {query.isError && <p className="kpi-error" role="alert">{query.error instanceof Error ? query.error.message : 'Figures unavailable.'}{query.data && ' Previous readings shown.'}</p>}
    <section className="kpi-grid" aria-label="Company key figures" aria-busy={query.isFetching}>{cards.map((card, index) => <article className={`kpi-card kpi-${card.key}`} key={card.key}>
      <div className="kpi-card-top"><h2>{card.title}</h2><span className="kpi-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></div>
      <div className="kpi-value" title={card.value === null ? 'Unavailable' : number(card.value, card.unit)}>{card.value === null ? '—' : number(card.value, card.unit, true)}<span>{card.unit === 'aud_cents' ? 'AUD' : card.key === 'followers' ? 'followers' : card.key === 'reach' ? 'impressions' : card.key === 'engagement' ? 'interactions' : 'customers'}</span></div>
      {card.bars.length ? <BarGraph card={card} /> : <div className="kpi-empty-chart" role="img" aria-label="No verified chart data"><span>{query.isLoading ? 'AWAITING RECORDS' : card.state === 'unavailable' ? 'SOURCE UNAVAILABLE' : 'DATA NOT AVAILABLE'}</span><div aria-hidden="true" /></div>}
      <div className="kpi-card-bottom"><p>{card.note}</p>{card.as_of && <time>Recorded {card.as_of}</time>}<span className="kpi-source-state">{card.state === 'partial' ? 'PARTIAL COVERAGE' : 'NO VERIFIED TOTAL'}</span></div>
    </article>)}</section>
    <footer className="kpi-footer"><span><i aria-hidden="true" />Saved records · live connections unverified · AUD convention</span><span>{query.data ? `Read ${new Date(query.data.read_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'No figures loaded'} · Read only</span></footer>
  </main></div>;
}
