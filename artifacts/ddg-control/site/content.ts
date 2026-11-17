// Every word on the public website lives here. Links come from src/lib/public-info.ts (one source).
import { BUSINESS_ACCENT, PUBLIC_SITES } from '@/lib/public-info';

const site = (key: keyof typeof PUBLIC_SITES) => PUBLIC_SITES[key];

export const COMPANY = {
  legalName: 'Digital Dynamics Group Pty Ltd',
  abn: '66 687 743 193',
  place: 'Brisbane, Queensland',
};

export const HERO = {
  eyebrow: 'Digital Dynamics Group · Brisbane',
  title: 'From online stores to trading platforms, we build it all.',
  body: 'Fitness apps, data systems, dashboards and more, built in-house and running live.',
  ask: 'Need yours built?', // shown as a bright link to /start
};

/** The one card beside the headline: hire us. Links to the Build section. */
export const HIRE = {
  status: 'Taking new builds',
  title: 'Got an idea? We\'ll build it.',
  priceFrom: 'Websites from',
  price: '$1,500', // = SERVICES website "from" price
  // Things we have built (live 3D tracking = Gods Eye View and SilentWing: live public data on a 3D map).
  done: ['Websites', 'Online stores', 'Apps + dashboards', 'Trading platforms', 'Live 3D tracking'],
  cta: 'Start your build',
};

/** Our work, along the bottom of the first screen. Wide = a desktop dashboard, phone is tall. */
export type WorkItem = { key: string; name: string; line: string; img: string; alt: string; shape: 'wide' | 'phone' };
export const WORK: WorkItem[] = [
  { key: 'finance', name: 'DDG Finance', line: 'Trading dashboard', img: '/work/finance.webp?v=3', alt: 'DDG Finance trading dashboard', shape: 'wide' },
  { key: 'coffee', name: 'DDG Coffee', line: 'Cattle Dog Coffee admin', img: '/work/coffee.webp?v=3', alt: 'Cattle Dog Coffee admin dashboard', shape: 'wide' },
  { key: 'fitness', name: 'DDG Fitness', line: 'Hypest', img: '/work/hypest.webp', alt: 'Hypest fitness app on a phone', shape: 'phone' },
];

export type SiteBusiness = {
  key: 'coffee' | 'finance' | 'fitness';
  name: string;
  product: string;
  line: string;
  status: string;
  accent: string;
  link: { label: string; href: string; external: boolean } | null;
  note?: string;
  built: string[]; // what we built: the portfolio facts
};

export const SITE_BUSINESSES: SiteBusiness[] = [
  { key: 'coffee', name: 'DDG Coffee', product: 'Cattle Dog Coffee', accent: BUSINESS_ACCENT.coffee, status: 'Open now',
    line: 'Coffee beans delivered to your door. $1 from every bag goes to animal charities.',
    built: ['Online shop with Stripe checkout', 'Orders and charity tracked live', 'Sales feed into our command centre'],
    link: { label: 'Shop coffee', href: site('coffee'), external: true } },
  { key: 'finance', name: 'DDG Finance', product: 'Trading platform', accent: BUSINESS_ACCENT.finance, status: 'From 1 Jan 2027',
    line: 'Our own algorithmic trading platform. Its public track record starts on 1 January 2027.',
    built: ['4 trading bots on 2 brokers, checked every hour', 'Protective stops and an hourly check against the broker', 'Pre-registered research tests and an AI council'],
    link: { label: 'See the platform', href: '/finance', external: false }, note: 'Paper trading. Not financial advice.' },
  { key: 'fitness', name: 'DDG Fitness', product: 'Hypest', accent: BUSINESS_ACCENT.fitness, status: 'In development',
    line: 'Fitness plans and coaching from specialist AI coaches, on your phone.',
    built: ['AI coaches for 6 training styles', 'Plans built from 86 exercises', 'Subscriptions and a health check'],
    link: null },
];

export const CHARITY = {
  title: 'Helping animal charities',
  body: 'Every bag of Cattle Dog Coffee raises $1 for animal charities. We pay it over in $100 lots. From 1 January 2027, 1% of DDG\'s other revenue, from Finance and Fitness, goes to them too.',
};


// ── DDG Build: we build platforms for other businesses (open from 8 Nov 2026) ─────────
// The opening date comes from the server (/api/public/summary), not from here.
// Prices: about 25% below 2026 Australian guide ranges (Markus 31 Oct). No GST: DDG is not GST-registered.

export const CONTROL_CASE = {
  title: 'Behind the scenes: DDG Control',
  line: 'Our private command centre. Every business, every number and every AI employee on one screen.',
  built: ['Two-step login, owner only', 'Nine AI employees report through a checked, undoable API', 'Live numbers from the shop, the trading platform and socials'],
};

export type ServiceKey = 'website' | 'store' | 'platform' | 'app' | 'ai';
export type Service = {
  key: ServiceKey; name: string; line: string; from: number; to: number; proof: string; features: string[];
};
export const SERVICES: Service[] = [
  { key: 'website', name: 'Business website', line: 'Fast, good-looking, on your own domain and easy to update.', from: 1500, to: 4500,
    proof: 'Like this website', features: ['Contact form', 'Bookings', 'Blog or news', 'Logo and brand help', 'Copywriting', 'Two languages'] },
  { key: 'store', name: 'Online store', line: 'Sell online with card payments, stock and shipping.', from: 7500, to: 22500,
    proof: 'Like Cattle Dog Coffee', features: ['Card payments (Stripe)', 'Subscriptions', 'Stock tracking', 'Shipping rates', 'Customer accounts', 'Discount codes', 'Admin dashboard'] },
  { key: 'platform', name: 'Web platform', line: 'Logins, payments, dashboards and tools your team or customers use every day.', from: 11250, to: 45000,
    proof: 'Like DDG Control and DDG Finance', features: ['User logins', 'Payments or subscriptions', 'Admin dashboard', 'Reports and charts', 'Connect to other apps', 'Roles and permissions', 'AI features'] },
  { key: 'app', name: 'Phone app', line: 'A first version of your app for iPhone and Android.', from: 11250, to: 30000,
    proof: 'Like Hypest (in development)', features: ['iPhone and Android', 'User logins', 'In-app payments', 'Reminders and notifications', 'AI features'] },
  { key: 'ai', name: 'AI assistant or automation', line: 'An AI that answers, books, reads documents or runs a task for you.', from: 3750, to: 26250,
    proof: 'Like our nine AI employees', features: ['Answers customers', 'Books appointments', 'Reads documents', 'Connects to your apps (Xero, CRM…)', 'Writes reports', 'Runs on a schedule'] },
];
export const CARE = 'Care plans from $40 a month for a website and $225 a month for an app. Extra work $110–$185 an hour.';

export const BUILD_STEPS = [
  { title: 'Tell us', line: 'Five quick questions on one page.' },
  { title: 'Free call', line: 'We talk it through and agree exactly what gets built.' },
  { title: 'Fixed quote', line: 'One price for the agreed work, paid in stages.' },
  { title: 'Build and launch', line: 'You see progress every week, then we launch and look after it.' },
];

/** The one-page enquiry form (/start, and the Build section). Five questions, nothing more. */
export const START = {
  eyebrow: 'DDG Build',
  title: 'Tell us what you want built.',
  line: 'Five quick questions. We read every one and email you to set up a free call.',
  aboutLabel: 'What should it do?',
  aboutHint: 'A sentence or two: who it is for and the main things it needs to do.',
  done: 'Thanks, we have it. We will email you to set up a free call.',
};

export const BUILD_FORM = {
  kinds: [...SERVICES.map((s) => ({ key: s.key as ServiceKey | 'unsure', label: s.name })), { key: 'unsure' as const, label: 'Not sure yet' }],
  hasNow: [{ key: 'nothing', label: 'Nothing yet' }, { key: 'brand', label: 'A brand or design' }, { key: 'existing', label: 'An old site or app to replace' }],
  timing: [{ key: 'asap', label: 'As soon as possible' }, { key: 'soon', label: 'In 1–3 months' }, { key: 'later', label: 'Later' }, { key: 'exploring', label: 'Just exploring' }],
  budget: [{ key: 'under-5k', label: 'Under $5k' }, { key: '5-15k', label: '$5k–$15k' }, { key: '15-40k', label: '$15k–$40k' }, { key: 'over-40k', label: 'Over $40k' }, { key: 'unsure', label: 'Not sure' }],
} as const;

// ── DDG Finance public page (/finance). Numbers come from /api/public/finance (the trading
// platform's hourly push); only the words live here. Strategies lock 21–22 Nov 2026: update
// FINANCE_BOTS then. Keys match the server's public keys (never internal account ids).
export const FINANCE_PAGE = {
  eyebrow: 'DDG Finance',
  title: 'Our trading platform, in the open.',
  lead: 'Four trading bots run our own strategies, checked every hour. From 1 January 2027 every result goes up here, good or bad, next to the S&P 500.',
  note: 'Paper trading on broker practice accounts. Not financial advice. We don’t take outside money.',
};

export type FinanceBotKey = 'atlas' | 'atlas-v2' | 'momentum' | 'forex';
export const FINANCE_BOTS: { key: FinanceBotKey; name: string; broker: string; line: string }[] = [
  { key: 'atlas', name: 'Atlas', broker: 'Alpaca · paper',
    line: 'Follows the trend of the S&P 500 and Nasdaq, up to 1.5x, with part of the account in bonds, gold, commodities and the US dollar when they trend.' },
  { key: 'atlas-v2', name: 'Atlas V2', broker: 'Alpaca · paper',
    line: 'The bolder Atlas: S&P 500 and Nasdaq trend only, up to 1.5x, plus a Bitcoin and Ethereum holding.' },
  { key: 'momentum', name: 'Momentum', broker: 'Alpaca · paper',
    line: 'Holds the 50 S&P 500 stocks with the strongest 12-month momentum, rebalanced monthly, and moves to cash when the market trend turns down.' },
  { key: 'forex', name: 'Forex', broker: 'OANDA · practice',
    line: 'Trades major currency pairs. Three AI models vote on each trade; fixed rules size it (0.5% risk a trade, at most 4 open) and set its stop.' },
];
export const FINANCE_LINEUP_NOTE = 'Strategies are final from 22 November 2026. This page is updated then.';
export const FINANCE_HOLDINGS_NOTE = 'Holdings are each bot’s share of its own account. Vault is profit set aside in short-term US Treasury bills. Forex positions are leveraged, so they can add up to more than 100%.';

export const FINANCE_HOW = [
  { title: 'Rules written down first', line: 'Each strategy is tested on past data and registered before it trades: its rules, the test period and the bar it had to clear.' },
  { title: 'Bots trade on their own', line: 'Every hour the platform runs each bot and places the orders its rules call for. Nobody picks trades by hand.' },
  { title: 'Checked against the broker', line: 'The platform’s records are checked against the broker. If something looks wrong, an automatic safety switch can halt trading until it is checked.' },
  { title: 'Compared with the research', line: 'Every day the live results are compared with what the research said should happen, and a health report goes out each morning.' },
  { title: 'Shown here, as it happens', line: 'This page reads the same numbers we see, pushed from the platform every hour.' },
];

export const FINANCE_PAPER = {
  title: 'The research paper',
  line: 'Which strategies we chose and why, how they were tested, and the tests that failed. Written by Claude, the AI that builds the platform.',
  status: 'Published after the strategies lock in late November 2026.',
};

export const FINANCE_FINE_PRINT = [
  'Paper money: the bots trade on broker practice accounts, not real money.',
  'Past results don’t predict future ones. Any of these strategies can lose money.',
  'Some bots borrow to hold up to 1.5x, which makes losses bigger as well as gains.',
  'The S&P 500 line is SPY with dividends included, over the same dates.',
  'Not financial advice. DDG does not manage money for anyone else.',
];
// ── DDG Build quote page (/quote/<token>): the words; the quote itself comes from the API.
// The terms are a plain summary until the lawyer-reviewed contract exists (ddg-build-plan.md).
export const QUOTE_PAGE = {
  eyebrow: 'DDG Build · Your quote',
  notFound: 'We couldn’t find this quote. Please check the link we sent you.',
  loadError: 'Something went wrong. Please try again, or reply to our email.',
  gst: 'Prices in Australian dollars. DDG is not registered for GST, so no GST is added.',
  termsTitle: 'How it works from here',
  terms: [
    'The price is fixed for everything listed above. Anything extra is quoted separately before we do it.',
    'Paying the deposit books your build and we start. The rest is paid in stages as each part is delivered.',
    'You see progress every week and can ask questions any time.',
    'We send the full written contract before work starts.',
  ],
  agree: 'I accept this quote and how it works from here.',
  accepted: (name: string) => `Accepted${name ? ` by ${name}` : ''}. Thank you!`,
  invoice: 'We’ll email you the deposit invoice shortly.',
  paid: 'Deposit received. Thank you! We’ll be in touch to start your build.',
  closed: (status: 'withdrawn' | 'expired') => `This quote is ${status}. Reply to our email and we’ll send you a new one.`,
};

// ── Home: the first screen (the Canyon stage, Markus 17 Nov 2026) ─────────────────────
// The orb on screen stands for the AI at the centre of DDG. The list names what it powers.
export const HOME = {
  eyebrow: 'Digital Dynamics Group',
  title: 'We build it all.',
  powers: [
    { n: '01', name: 'Coffee', line: 'Beans to your door' },
    { n: '02', name: 'Finance', line: 'Our own trading platform' },
    { n: '03', name: 'Fitness', line: 'A coach in your pocket' },
    { n: '04', name: 'Creative', line: 'Stories, music and a novel' },
  ],
  work: { eyebrow: 'Our work', title: 'Built in Brisbane. Running live.' },
  businesses: 'Our businesses',
};

/** One line under the orb in place of the list of businesses. Markus picks one in the tuner. */
export const QUOTES = [
  'We use AI to unlock the digital world. Then we build whatever we want in it.',
  'One founder. An AI workforce. No ceiling on what gets built.',
  'If it can live on a screen, we can build it.',
  'AI is the engine. Imagination is the only spec.',
  "We don't wait for the future. We ship it.",
  'Ideas in. Working platforms out.',
  'Powered by AI. Built by obsession.',
  'The digital frontier has no fences. We build past the edge.',
  "Give us a problem. We'll give it a platform.",
  'Small team. Unreasonable output.',
];
