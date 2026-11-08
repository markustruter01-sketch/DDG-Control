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
  eyebrow: 'Build with DDG',
  title: 'Start your build',
  line: 'Websites, online stores, apps and dashboards, built the way we build our own.',
  cta: 'See how we build',
};

/** Our work, along the bottom of the first screen. Wide = a desktop dashboard, phone is tall. */
export type WorkItem = { key: string; name: string; line: string; img: string; alt: string; shape: 'wide' | 'phone' };
export const WORK: WorkItem[] = [
  { key: 'finance', name: 'DDG Finance', line: 'Trading dashboard', img: '/work/finance.webp', alt: 'DDG Finance trading dashboard', shape: 'wide' },
  { key: 'coffee', name: 'DDG Coffee', line: 'Cattle Dog Coffee admin', img: '/work/coffee.webp?v=2', alt: 'Cattle Dog Coffee admin dashboard', shape: 'wide' },
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
    line: 'Coffee beans delivered to your door. $1 from every bag goes to RSPCA Queensland.',
    built: ['Online shop with Stripe checkout', 'Orders and charity tracked live', 'Sales feed into our command centre'],
    link: { label: 'Shop coffee', href: site('coffee'), external: true } },
  { key: 'finance', name: 'DDG Finance', product: 'Trading platform', accent: BUSINESS_ACCENT.finance, status: 'From 1 Jan 2027',
    line: 'Our own algorithmic trading platform. Its public track record starts on 1 January 2027.',
    built: ['4 trading bots on 2 brokers, checked every hour', 'Protective stops and an hourly check against the broker', 'Pre-registered research tests and an AI council'],
    link: null, note: 'Paper trading. Not financial advice.' },
  { key: 'fitness', name: 'DDG Fitness', product: 'Hypest', accent: BUSINESS_ACCENT.fitness, status: 'In development',
    line: 'Fitness plans and coaching from specialist AI coaches, on your phone.',
    built: ['AI coaches for 6 training styles', 'Plans built from 86 exercises', 'Subscriptions and a health check'],
    link: null },
];

export const CHARITY = {
  title: 'Helping RSPCA Queensland',
  body: 'Every bag of Cattle Dog Coffee gives $1 to RSPCA Queensland. From 1 January 2027, 1% of everything else DDG earns, from Finance and Fitness, goes to them too. Want to help directly? Donate to RSPCA Queensland.',
  donate: { label: 'Donate to RSPCA Queensland', href: 'https://www.rspcaqld.org.au/get-involved/ways-you-can-donate/make-a-donation' },
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
