import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Link } from 'wouter';
import type { FinanceSummaryResponse, SocialSummaryResponse } from '@workspace/api-client-react';
import { formatFinanceCents, formatFigure } from '@/lib/format';
import './company-cockpit.css';

/** Illustrated routing only. No provider events or operational status are inferred. */
export function VillageMotion({ paused }: { paused: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const id = `village-${useId().replace(/:/g,'')}`;
  useEffect(() => { if (paused) svg.current?.pauseAnimations(); else svg.current?.unpauseAnimations(); }, [paused]);
  const art = `${import.meta.env.BASE_URL}atlas-viking-village-v2.webp`;
  return <svg ref={svg} className="village-motion" viewBox="0 0 1448 1086" preserveAspectRatio="none" aria-hidden="true" data-paused={paused}>
    <defs>
      <filter id={`${id}-water`} filterUnits="userSpaceOnUse" x="0" y="720" width="1448" height="366"><feTurbulence type="fractalNoise" baseFrequency=".012 .075" numOctaves="1" seed="9"><animate attributeName="baseFrequency" values=".012 .075;.016 .085;.012 .075" dur="30s" repeatCount="indefinite" /></feTurbulence><feDisplacementMap in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" /></filter>
      <clipPath id={`${id}-water-mask`}><path d="M0 805L90 805 150 870 340 975 520 1005 565 1086H0ZM1010 950L1140 820 1448 720V1086H930Z" /></clipPath>
      <filter id={`${id}-snake`} filterUnits="userSpaceOnUse" x="640" y="0" width="440" height="240"><feTurbulence type="fractalNoise" baseFrequency=".007" numOctaves="1" seed="5"/><feDisplacementMap in="SourceGraphic" scale="0"><animate attributeName="scale" values="0;4;0;2;0" dur="30s" repeatCount="indefinite" /></feDisplacementMap></filter>
      <clipPath id={`${id}-snake-mask`}><path d="M680 18Q865 -28 1030 77L1060 175 1010 214 936 167 826 148 748 207 687 169 657 105Z" /></clipPath>
    </defs>
    <image href={art} width="1448" height="1086" clipPath={`url(#${id}-water-mask)`} filter={`url(#${id}-water)`} />
    <image href={art} width="1448" height="1086" clipPath={`url(#${id}-snake-mask)`} filter={`url(#${id}-snake)`} />
    <g className="village-routes" fill="none" stroke="#9cecff" strokeWidth="2.5">
      {['M365 290Q490 380 730 530','M1100 345Q950 430 730 530','M255 650Q475 700 730 530','M1210 645Q1000 700 730 530','M720 865Q760 700 730 530'].map((d,i) => <path key={d} d={d} pathLength="100" style={{animationDelay:`${-i*6}s`}} />)}
    </g>
    <g className="village-window-glow" fill="#ffb43b">
      {[[360,285],[1110,337],[252,650],[1210,648],[717,840],[733,533]].map(([cx,cy],i)=><ellipse key={i} cx={cx} cy={cy} rx="9" ry="12" style={{animationDelay:`${-i*4}s`}} />)}
    </g>
  </svg>;
}

type Props = {
  finance?: FinanceSummaryResponse; financeLoading: boolean; financeError: boolean;
  social?: SocialSummaryResponse; socialLoading: boolean; socialError: boolean;
  projectCount: number | null; attentionCount: number | null; attention: {title:string;href:string}[];
  updates: {label:string;href:string;action:string;date:string}[]; updatesError: boolean; updatesLoading: boolean;
  onDetails: () => void; atlas: (paused:boolean) => ReactNode;
};

export function CompanyCockpit(p: Props) {
  const [motion,setMotion] = useState(true);
  const [active,setActive] = useState(() => document.visibilityState === 'visible');
  const [reduced,setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const reduce = () => setReduced(media.matches);
    const visible = () => setActive(document.visibilityState === 'visible');
    media.addEventListener('change',reduce); document.addEventListener('visibilitychange',visible);
    return () => {media.removeEventListener('change',reduce);document.removeEventListener('visibilitychange',visible);};
  },[]);
  const f = p.financeError ? undefined : p.finance;
  const social = p.socialError ? undefined : p.social;
  const rows = social?.ventures.flatMap(v=>v.platforms) ?? [];
  const number = (v:number|null|undefined) => v == null ? 'Unknown' : formatFigure(v,'count');
  const money = (v:number|undefined) => v == null ? (p.financeLoading ? '…' : 'Unknown') : formatFinanceCents(v);
  function partial(key:'impressions_30d'|'engagements_30d'|'followers_change_30d') {
    const known = rows.filter(r=>r[key] != null);
    return {value:known.length ? number(known.reduce((sum,r)=>sum+(r[key] ?? 0),0)) : 'Unknown', coverage:`${known.length}/${rows.length} saved platform readings`};
  }
  const impressions=partial('impressions_30d'), engagements=partial('engagements_30d'), growth=partial('followers_change_30d');
  const dates = rows.map(r=>r.captured_on).filter(Boolean).sort();
  const cell = (label:string,value:string,note?:string) => <div className="cockpit-stat" key={label}><dt>{label}</dt><dd title={note}>{value}</dd>{note && <small>{note}</small>}</div>;
  return <main className="company-cockpit" aria-label="Company overview">
    <div className="cockpit-toolbar"><h1>Company overview</h1><div><button type="button" onClick={()=>setMotion(v=>!v)} aria-pressed={motion} disabled={reduced}>{reduced ? 'Reduced motion' : motion ? 'Pause scene' : 'Play scene'}</button><button type="button" onClick={p.onDetails}>Records &amp; sources ↗</button></div></div>
    <div className="cockpit-grid">
      <div className="cockpit-rail cockpit-left">
        <section className="cockpit-card cockpit-finance" aria-labelledby="cockpit-finance"><header><h2 id="cockpit-finance">Company finance</h2><Link href="/finances">Open ↗</Link></header>
          <p className="cockpit-period">Reported · last 30 days · AUD</p>
          <p className="cockpit-profit"><small>Profit</small><strong>{money(f?.profit_30d_cents)}</strong></p>
          <dl className="cockpit-figures">{cell('Revenue',money(f?.revenue_30d_cents))}{cell('Expenses',money(f?.expenses_30d_cents))}{cell('Customers',number(f?.customers),'Coffee online · 30d')}{cell('Profit margin',f && f.revenue_30d_cents>0 ? `${(100*f.profit_30d_cents/f.revenue_30d_cents).toFixed(1)}%` : 'Unknown','Derived · same 30d')}{cell('Expected revenue',money(f?.expected_revenue_next_month_cents),'Next month · estimate')}{cell('Expected expenses',money(f?.expected_expenses_next_month_cents),'Next month · estimate')}{cell('Expected profit',money(f?.expected_profit_next_month_cents),'Next month · estimate')}{cell('Debt',money(f?.debt_cents),'Current · date unknown')}</dl>
          {p.financeError && <p role="alert">Figures unavailable. Open records to retry.</p>}
          <button className="cockpit-source" type="button" onClick={p.onDetails}>Source dates unknown · notes &amp; coverage ↗</button>
        </section>
        <section className="cockpit-card cockpit-social" aria-labelledby="cockpit-social"><header><h2 id="cockpit-social">Social imprint</h2><button type="button" onClick={p.onDetails}>Details ↗</button></header>
          <dl className="cockpit-figures">{cell('Followers',rows.length ? number(social?.total_followers) : 'Unknown','Summed · not unique people')}{cell('Impressions · 30d',impressions.value,impressions.coverage)}{cell('Engagements · 30d',engagements.value,engagements.coverage)}{cell('Follower change',growth.value,`${growth.coverage} · ≥30d baseline`)}{cell('Platforms recorded',social ? number(new Set(rows.map(r=>r.platform)).size) : 'Unknown')}{cell('Venture coverage',social ? `${social.ventures.filter(v=>v.platforms.length>0).length}/${social.ventures.length}` : 'Unknown')}</dl>
          <p className="cockpit-period">{p.socialLoading ? 'Loading saved readings…' : p.socialError ? 'Social readings unavailable' : `Partial snapshots · oldest ${dates[0] || 'Unknown'}`}</p><button className="cockpit-source" type="button" onClick={p.onDetails}>Sources, periods &amp; add numbers ↗</button>
        </section>
        <section className="cockpit-card cockpit-health"><header><h2>Company health</h2></header><dl>{cell('Service health','Unknown')}{cell('Project records',number(p.projectCount))}</dl></section>
      </div>
      <div className="cockpit-scene" data-paused={!motion || !active || reduced}>{p.atlas(!motion || !active || reduced)}</div>
      <div className="cockpit-rail cockpit-right">
        <section className="cockpit-card cockpit-attention"><header><h2>Needs attention</h2><span className="cockpit-badge">{number(p.attentionCount)}</span></header><p className="cockpit-period">Saved decisions &amp; report flags</p>{p.attentionCount===null ? <p role="status">Coverage incomplete · open records to retry.</p> : p.attention.length ? <ul>{p.attention.slice(0,3).map(a=><li key={a.href}><Link href={a.href}>{a.title}</Link></li>)}</ul> : <p>No pending items in available records.</p>}<Link href="/decisions">Open Decisions ↗</Link></section>
        <section className="cockpit-card cockpit-updates"><header><h2>Saved project updates</h2></header>{p.updatesLoading ? <p>Loading…</p> : p.updatesError ? <p role="alert">Updates unavailable. Open records to retry.</p> : p.updates.length===0 ? <p>No saved updates.</p> : <ul>{p.updates.slice(0,4).map(u=><li key={u.href}><Link href={u.href}><strong>{u.label}</strong><span>{u.action}</span><small>{u.date} · saved record</small></Link></li>)}</ul>}<Link href="/ai-stack">Open work board ↗</Link></section>
        <section className="cockpit-card cockpit-controls"><header><h2>Work controls</h2></header><dl>{cell('Finance','Held for review')}{cell('Music','Unchanged')}{cell('Provider dispatch','Blocked')}</dl><Link href="/ai-stack">Open AI Stack ↗</Link></section>
      </div>
    </div>
  </main>;
}
