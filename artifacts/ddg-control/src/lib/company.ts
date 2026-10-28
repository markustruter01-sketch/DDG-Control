// The one place the home screen's fixed facts live. Change a link or a line here and every page follows.
// A link that is null is shown as "Link needed" rather than guessed.

export const LAUNCH_DATE = '2027-01-01';

export type Business = {
  slug: string;
  name: string;
  sub: string;
  accent: string;
  icon: 'finance' | 'coffee' | 'fitness' | 'creative';
  status: string;
  next: string;
  site: string | null;
  admin: string | null;
};

export const BUSINESSES: Business[] = [
  { slug: 'finance', name: 'DDG Finance', sub: 'Trading platform · paper accounts', accent: 'var(--ng-mint)', icon: 'finance',
    status: 'Paper trading', next: 'Reset all accounts to $100k and start the record on 1 Jan', site: null, admin: null },
  { slug: 'coffee', name: 'DDG Coffee', sub: 'Cattle Dog Coffee · live shop', accent: 'var(--ng-amber)', icon: 'coffee',
    status: 'Live', next: 'RSPCA page after RSPCA QLD approval', site: 'https://cattledogcoffee.com.au', admin: null },
  { slug: 'fitness', name: 'DDG Fitness', sub: 'Hypest · AI coaching app', accent: 'var(--ng-volt)', icon: 'fitness',
    status: 'Not launched', next: 'Home design B, exercise guides, then publish', site: null, admin: null },
  { slug: 'creative', name: 'DDG Creative', sub: 'Vlogs · clips · music · novel', accent: 'var(--ng-violet)', icon: 'creative',
    status: 'Shorts daily 9:30 pm', next: 'Projects page on the DDG website', site: 'https://www.youtube.com/@DigitalDynamicsGroup', admin: null },
];

export type Ask = { text: string; business: string | null; when: string };

// What needs Markus. Claude keeps this list current until the bots feed it.
export const ASKS: Ask[] = [
  { text: 'RSPCA QLD bag-logo approval', business: 'coffee', when: 'Waiting on RSPCA' },
  { text: 'Grok chat link for each bot', business: null, when: 'Next' },
  { text: 'Check Stripe webhook after first publish', business: 'fitness', when: 'At publish' },
  { text: 'G4 November rebalance check', business: 'finance', when: '4 Nov' },
  { text: 'Physiologist review of exercise steps', business: 'fitness', when: 'Before launch' },
];

export type Bot = { name: string; role: string; chat: string | null };

export const HEIMDALL: Bot = { name: 'Heimdall', role: 'GM / COO · runs the bots', chat: null };
export const BOTS: Bot[] = [
  { name: 'Tyr', role: 'Projects', chat: null },
  { name: 'Freya', role: 'Marketing', chat: null },
  { name: 'Hermes', role: 'Operations · IT', chat: null },
  { name: 'Harald', role: 'Legal · Chief of staff', chat: null },
  { name: 'Plutus', role: 'Finance · analytics', chat: null },
  { name: 'Mímir', role: 'Scientist · skeptic', chat: null },
  { name: 'Njord', role: 'Ventures · revenue', chat: null },
  { name: 'Daedalus', role: 'R&D lab', chat: null },
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

export type Platform = 'youtube' | 'instagram' | 'facebook' | 'x' | 'tiktok';
export const SOCIALS: { platform: Platform; name: string; href: string | null }[] = [
  { platform: 'youtube', name: 'YouTube', href: 'https://www.youtube.com/@DigitalDynamicsGroup' },
  { platform: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/digitaldynamicsgroup/' },
  { platform: 'facebook', name: 'Facebook', href: null },
  { platform: 'x', name: 'X', href: 'https://x.com/DDGCompany' },
  { platform: 'tiktok', name: 'TikTok', href: null },
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
