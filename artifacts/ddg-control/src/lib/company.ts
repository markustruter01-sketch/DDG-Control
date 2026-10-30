// The one place the home screen's fixed facts live. Change a link or a line here and every page follows.
// A link that is null is shown as "Link needed" rather than guessed.

export const LAUNCH_DATE = '2027-01-01';

// Public facts (also used by the public website) live in public-info.ts.
import { BUSINESS_ACCENT, PUBLIC_SITES, SOCIALS, type Platform } from './public-info';
export { SOCIALS, type Platform };

export type Business = {
  slug: string;
  name: string;
  sub: string;
  accent: string;
  icon: 'finance' | 'coffee' | 'fitness' | 'creative';
  next: string;
  site: string | null;
  admin: string | null;
};

export const BUSINESSES: Business[] = [
  { slug: 'finance', name: 'DDG Finance', sub: 'Trading platform · paper accounts', accent: BUSINESS_ACCENT.finance, icon: 'finance',
    next: 'Reset all accounts to $100k and start the record on 1 Jan', site: null, admin: null },
  { slug: 'coffee', name: 'DDG Coffee', sub: 'Cattle Dog Coffee · live shop', accent: BUSINESS_ACCENT.coffee, icon: 'coffee',
    next: 'RSPCA page after RSPCA QLD approval', site: PUBLIC_SITES.coffee, admin: null },
  { slug: 'fitness', name: 'DDG Fitness', sub: 'Hypest · AI coaching app', accent: BUSINESS_ACCENT.fitness, icon: 'fitness',
    next: 'Home design B, exercise guides, then publish', site: null, admin: null },
  { slug: 'creative', name: 'DDG Creative', sub: 'Vlogs · clips · music · novel', accent: BUSINESS_ACCENT.creative, icon: 'creative',
    next: 'Threads of Empire release, late Jan 2027', site: PUBLIC_SITES.creative, admin: null },
];

// avatar = the bot's own Grok Bot app picture, saved in public/avatars/.
// active = has routines in marketing mode (Nov 2026 – Mar 2027); paused bots keep memory and act only when messaged.
export type Bot = { name: string; role: string; chat: string | null; avatar: string; active: boolean };

export const HEIMDALL: Bot = { name: 'Heimdall', role: 'GM / COO · 7am list to Markus', chat: null, avatar: 'heimdall.png', active: true };
export const BOTS: Bot[] = [
  { name: 'Tyr', role: 'Coffee marketing · sales', chat: null, avatar: 'tyr.png', active: true },
  { name: 'Freya', role: 'Marketing · socials', chat: null, avatar: 'freya.png', active: true },
  { name: 'Hermes', role: 'Operations · IT', chat: null, avatar: 'hermes.png', active: false },
  { name: 'Harald', role: 'Legal · Chief of staff', chat: null, avatar: 'harald.png', active: false },
  { name: 'Plutus', role: 'Finance · analytics', chat: null, avatar: 'plutus.png', active: true },
  { name: 'Mímir', role: 'Scientist · skeptic', chat: null, avatar: 'mimir.png', active: false },
  { name: 'Njord', role: 'Ventures · revenue', chat: null, avatar: 'njord.png', active: false },
  { name: 'Daedalus', role: 'R&D lab', chat: null, avatar: 'daedalus.png', active: false },
];
export const GROK_HOME = 'https://grok.com';
export const CLAUDE_HOME = 'https://claude.ai';

export const TOOLS = [
  { name: 'Replit', href: 'https://replit.com' },
  { name: 'GitHub', href: 'https://github.com/markustruter01-sketch' },
  { name: 'Stripe', href: 'https://dashboard.stripe.com' },
  { name: 'Drive', href: 'https://drive.google.com' },
  { name: 'Gmail', href: 'https://mail.google.com' },
  { name: 'Grok', href: GROK_HOME },
];

// Control's database names for each business (used by Money and Social). '' = the company itself.
export const LEDGER_BUSINESSES = [
  { slug: '', label: 'DDG (company)' },
  { slug: 'finance', label: 'DDG Finance' },
  { slug: 'cattle-dog-coffee', label: 'DDG Coffee' },
  { slug: 'hypest', label: 'DDG Fitness' },
  { slug: 'ddg-music', label: 'DDG Creative' },
] as const;
export const ledgerLabel = (slug: string | null) => LEDGER_BUSINESSES.find((b) => b.slug === (slug ?? ''))?.label ?? slug ?? 'DDG (company)';

// DDG Finance bot names (from the platform's bot registry). Unknown ids show as sent.
export const FINANCE_BOT_NAMES: Record<string, string> = {
  oracle: 'Atlas', spy_qqq_trend: 'Momentum', jerome_macro: 'Bullion', forex_ai: 'Forex', forex_gump: 'Forex Gump',
};

// DDG Creative projects shown on its card and (later) the website's Creative page.
export const CREATIVE_PROJECTS = ['Vlogs', 'Gaming clips', 'Music', 'Novel'];
