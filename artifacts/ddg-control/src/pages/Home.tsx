import { useState } from 'react';
import { Link } from 'wouter';
import {
  getListAsksQueryKey, useCompleteAsk, useGetOverview, useListAsks, type OverviewResponse,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/header';
import { BotAvatar } from '@/components/BotAvatar';
import { BusinessIcon } from '@/components/BusinessIcon';
import { PlatformIcon } from '@/components/PlatformIcon';
import { SocialFootprint } from '@/components/SocialFootprint';
import {
  BOTS, BUSINESSES, CLAUDE_HOME, CREATIVE_PROJECTS, FINANCE_BOT_NAMES, GROK_HOME, HEIMDALL, LAUNCH_DATE, SOCIALS, TOOLS, type Business,
} from '@/lib/company';
import { aud, count, daysUntil } from '@/lib/money';

function Term({ label, value, sign }: { label: string; value: string; sign?: string }) {
  return (
    <span className="net" style={{ marginLeft: 0 }}>
      {sign && <span className="op" aria-hidden="true">{sign}</span>}
      <span className="term"><span className="label">{label}</span><span className="num">{value}</span></span>
    </span>
  );
}

function SocialPanel({ social }: { social: OverviewResponse['social'] | undefined }) {
  return (
    <section className="glass panel" aria-label="Social footprint, all platforms">
      <SocialFootprint totals={social} platforms={social?.platforms} />
    </section>
  );
}

function MoneyPanel({ money }: { money: OverviewResponse['money'] | undefined }) {
  const net = money?.net_cents ?? null;
  return (
    <section className="glass panel" aria-label="Company money, all businesses, all time">
      <div className="equation">
        <span className="term" style={{ minWidth: 150 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Company · all time</h2>
          <Link href="/money" className="label">Money ›</Link>
        </span>
        <Term label="Expenses" value={aud(money?.expenses_cents)} />
        <Term sign="−" label="Gross revenue" value={aud(money?.gross_revenue_cents)} />
        <Term sign="=" label="Debt" value={aud(money?.debt_cents)} />
        <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--ng-edge)' }} aria-hidden="true" />
        <Term label="Charity deducted" value={money?.charity_cents == null ? '—' : `−${aud(money.charity_cents)}`} />
        <span className="net" style={{ marginLeft: 0 }}>
          <span className="op" aria-hidden="true">→</span>
          <span className="term">
            <span className="label">Net profit</span>
            <span className="num" style={{ fontSize: 38, fontWeight: 400 }}>{aud(net)}</span>
            <span className="net-line" aria-hidden="true"
              style={{ background: net === null ? 'var(--ng-edge)' : net < 0 ? 'var(--ng-problem)' : 'var(--ng-mint)' }} />
          </span>
        </span>
        <span style={{ width: 1, alignSelf: 'stretch', background: 'var(--ng-edge)' }} aria-hidden="true" />
        <Term label="Donated via our link" value={aud(money?.donated_via_link_cents)} />
      </div>
      {money?.notes.map((n) => <p key={n} className="note" style={{ margin: 0 }}>{n}</p>)}
    </section>
  );
}

type Businesses = OverviewResponse['businesses'] | undefined;
type Stat = { label: string; value: string; strong?: boolean };

const usd = (cents: number | null | undefined) =>
  cents == null ? '—' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(cents / 100);
const pct = (now: number, start: number) => {
  if (!start) return '—';
  const p = ((now - start) / start) * 100;
  return `${p >= 0 ? '+' : ''}${p.toFixed(2)}%`;
};

/** The key numbers for each business card. A missing source shows "—", never a guess. */
function statsFor(slug: string, data: Businesses): Stat[] {
  switch (slug) {
    case 'finance': {
      const f = data?.finance;
      if (!f) return [{ label: 'Bots', value: '—' }, { label: 'Portfolio', value: '—', strong: true }];
      return [
        ...f.bots.map((b) => ({ label: `${FINANCE_BOT_NAMES[b.bot_id] ?? b.bot_id}${b.paused ? ' · paused' : ''}`, value: usd(b.equity_cents) })),
        { label: `Portfolio · ${pct(f.total_equity_cents, f.total_starting_cents)}`, value: usd(f.total_equity_cents), strong: true },
      ];
    }
    case 'coffee': {
      const c = data?.coffee;
      return [
        { label: 'Bags sold', value: count(c?.bags_sold) },
        { label: 'Charity', value: aud(c?.charity_cents) },
        { label: 'Revenue', value: aud(c?.revenue_cents) },
        { label: 'Subscribers', value: count(c?.subscribers) },
      ];
    }
    case 'fitness': {
      const h = data?.fitness;
      return [
        { label: 'In-app purchases', value: count(h?.plan_purchases) },
        { label: 'Subscribers', value: count(h?.subscribers) },
        { label: 'Monthly recurring', value: usd(h?.monthly_recurring_cents) },
      ];
    }
    default: {
      const c = data?.creative;
      return [
        { label: 'Projects', value: String(CREATIVE_PROJECTS.length) },
        { label: 'Followers', value: count(c?.followers) },
        { label: 'Revenue', value: aud(c?.revenue_cents) },
      ];
    }
  }
}

function BusinessCard({ b, data }: { b: Business; data: Businesses }) {
  const stats = statsFor(b.slug, data);
  return (
    <article className="glass biz">
      <div className="biz-top">
        <span className="biz-icon">
          <BusinessIcon icon={b.icon} />
        </span>
        <span className="biz-name"><b>{b.name}</b><span>{b.sub}</span></span>
        <span className="dot" style={{ background: b.accent }} aria-hidden="true" />
      </div>
      <dl className="stats">
        {stats.map((st) => (
          <div key={st.label} className={st.strong ? 'strong' : undefined}><dt>{st.label}</dt><dd>{st.value}</dd></div>
        ))}
      </dl>
      <span className="accent-line" style={{ background: `linear-gradient(90deg, ${b.accent} 0 32px, var(--ng-edge) 32px)` }} aria-hidden="true" />
      <div className="biz-actions">
        <ExternalButton href={b.site} label="Open site" />
        <ExternalButton href={b.admin} label="Admin" fill />
      </div>
    </article>
  );
}

function ExternalButton({ href, label, fill = false }: { href: string | null; label: string; fill?: boolean }) {
  if (!href) return <span className={`btn${fill ? ' fill' : ''}`} aria-disabled="true" title="Link needed">{label}</span>;
  return <a className={`btn${fill ? ' fill' : ''}`} href={href} target="_blank" rel="noreferrer">{label} ↗</a>;
}

function NeedsYou({ accentOf }: { accentOf: (slug: string | null) => string }) {
  const client = useQueryClient();
  const asks = useListAsks();
  const done = useCompleteAsk({ mutation: { onSuccess: () => client.invalidateQueries({ queryKey: getListAsksQueryKey() }) } });
  const items = asks.data ?? [];
  return (
    <section className="glass panel grow-1" aria-label="Needs you">
      <div className="panel-head"><h2>Needs you</h2><Link href="/ops" className="label">{items.length} open · Add ›</Link></div>
      <ul className="list">
        {items.map((a) => (
          <li key={a.id}>
            <span className="dot" style={{ width: 6, height: 6, background: accentOf(a.business) }} aria-hidden="true" />
            <span className="grow">
              <span>{a.text}</span>
              <span className="label" style={{ letterSpacing: 0.4 }}>{[a.due, a.source.startsWith('bot:') ? `from ${a.source.slice(4)}` : null].filter(Boolean).join(' · ') || ' '}</span>
            </span>
            <button type="button" className="btn icon-btn" aria-label={`Done: ${a.text}`} disabled={done.isPending}
              onClick={() => done.mutate({ id: a.id })} style={{ minHeight: 36, width: 36, border: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10" /></svg>
            </button>
          </li>
        ))}
        {!items.length && <li className="note">{asks.isLoading ? 'Loading…' : asks.isError ? 'Couldn\'t load the list.' : 'Nothing needs you right now.'}</li>}
      </ul>
    </section>
  );
}

export function Home() {
  const overview = useGetOverview();
  const days = daysUntil(LAUNCH_DATE);
  const activeBots = [HEIMDALL, ...BOTS].filter((b) => b.active).length;
  const accentOf = (slug: string | null) => BUSINESSES.find((b) => b.slug === slug)?.accent ?? 'var(--ng-text-3)';
  return (
    <div className="ng-page photo">
      <div className="ng-wrap">
        <Header />
        {overview.isError && <p className="toast glass" role="alert">Company figures didn't load. Refresh to try again.</p>}

        <SocialPanel social={overview.data?.social} />
        <MoneyPanel money={overview.data?.money} />

        <section className="row" aria-label="Businesses">
          {BUSINESSES.map((b) => <BusinessCard key={b.slug} b={b} data={overview.data?.businesses} />)}
        </section>

        <div className="row">
          <NeedsYou accentOf={accentOf} />

          <section className="glass panel grow-15" aria-label="Team">
            <div className="panel-head"><h2>Team</h2><span className="label">{activeBots} bots active · {1 + BOTS.length - activeBots} paused · Claude</span></div>
            <div className="people">
              <a className="person" href={HEIMDALL.chat ?? GROK_HOME} target="_blank" rel="noreferrer">
                <BotAvatar file={HEIMDALL.avatar} size={40} />
                <span className="grow" style={{ flex: 1 }}><b>{HEIMDALL.name}</b><br /><span className="muted" style={{ fontSize: 12 }}>{HEIMDALL.role}</span></span>
                <span className="label">Chat ↗</span>
              </a>
              <a className="person" href={CLAUDE_HOME} target="_blank" rel="noreferrer">
                <span className="avatar">C</span>
                <span style={{ flex: 1 }}><b>Claude</b><br /><span className="muted" style={{ fontSize: 12 }}>Code · Finance strategy</span></span>
                <span className="label">Open ↗</span>
              </a>
            </div>
            <div className="bots">
              {BOTS.map((bot) => (
                <a key={bot.name} className={`bot${bot.active ? '' : ' paused'}`} href={bot.chat ?? GROK_HOME} target="_blank" rel="noreferrer"
                  aria-label={`${bot.name}, ${bot.role}${bot.active ? '' : ', paused'}. Open chat`}>
                  <BotAvatar file={bot.avatar} size={30} />
                  <span><b style={{ fontSize: 13.5 }}>{bot.name}</b><br /><small>{bot.active ? bot.role : 'Paused'}</small></span>
                </a>
              ))}
            </div>
          </section>

          <section className="glass panel grow-09" aria-label="Launch">
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Launch</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span className="big">{days}</span>
              <span className="term"><span>days to go</span><span className="label">Fri 1 Jan 2027</span></span>
            </div>
            {BUSINESSES.map((b) => (
              <div key={b.slug} className="milestone">
                <span className="clamp1" title={b.next}><span className="dot" style={{ background: b.accent }} aria-hidden="true" />{b.name.replace('DDG ', '')}<span className="muted" style={{ fontSize: 12.5 }}>· {b.next}</span></span>
              </div>
            ))}
          </section>
        </div>

        <nav className="glass links" aria-label="Quick links">
          {TOOLS.map((t) => <a key={t.name} href={t.href} target="_blank" rel="noreferrer">{t.name}</a>)}
          <span style={{ flex: 1 }} />
          {SOCIALS.map((s) => s.href
            ? <a key={s.platform} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}><PlatformIcon platform={s.platform} /></a>
            : <span key={s.platform} className="muted" title={`${s.name} link needed`} style={{ padding: '0 12px', opacity: 0.4, display: 'inline-flex' }}><PlatformIcon platform={s.platform} /></span>)}
        </nav>
      </div>
    </div>
  );
}
