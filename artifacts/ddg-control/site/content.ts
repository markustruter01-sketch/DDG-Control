// Every word on the public website lives here. Links come from src/lib/public-info.ts (one source).
import { BUSINESS_ACCENT, PUBLIC_SITES } from '@/lib/public-info';

const site = (key: keyof typeof PUBLIC_SITES) => PUBLIC_SITES[key];

export const COMPANY = {
  legalName: 'Digital Dynamics Group Pty Ltd',
  abn: '66 687 743 193',
  place: 'Brisbane, Queensland',
  email: 'info@digitaldynamics-group.com',
  post: 'PO Box 2070, Brighton Eventide QLD 4017',
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
  { key: 'finance', name: 'DDG Finance', kind: 'Trading platform', href: '/finance', external: false, imgs: [
    { src: '/work/finance-1.webp', cap: 'The control room: every account, its return against the S&P 500, and what each bot holds, on one screen.', alt: 'DDG Finance home: fleet value, return by account and the four bots' },
    { src: '/work/finance-2.webp', cap: 'Under the hood: daily returns, each strategy\u2019s live signals, and the limits that cut its size when it falls.', alt: 'DDG Finance detail view with daily returns and strategy panels' },
    { src: '/work/finance-3.webp', cap: 'The AI council: three AI models read the news, vote on every currency trade, and are scored on every call.', alt: 'The Forex AI council scorecard' },
    { src: '/work/finance-4.webp', cap: 'The research bench: every strategy idea we tested is recorded, pass or fail, so nothing is cherry-picked.', alt: 'Research bench: tested strategies plotted by return and risk' },
    { src: '/work/finance-5.webp', cap: 'Controls: pause any bot in one click, and see every broker, AI and news connection checked live.', alt: 'DDG Finance controls: bots and connections' },
  ] },
  { key: 'coffee', name: 'Cattle Dog Coffee', kind: 'Online store', href: PUBLIC_SITES.coffee, external: true, imgs: [
    { src: '/work/coffee-1.webp', cap: 'The store your customers see: pick a blend and size, pay by card or subscribe, with the charity total counted live.', alt: 'The Cattle Dog Coffee store on a phone: home page and a product page' },
    { src: '/work/coffee-2.webp', cap: 'The back office we built behind it: sales, margin, stock and every order\u2019s status, updated as orders come in.', alt: 'The Cattle Dog Coffee admin dashboard with sales charts' },
    { src: '/work/coffee-3.webp', cap: 'Orders and dispatch: every order from paid to delivered, with one-click customer emails. Customer details are blurred here.', alt: 'The Cattle Dog Coffee orders and dispatch screen, customer details blurred' },
  ] },
  { key: 'greenlight', name: 'DDG Greenlight', kind: 'Compliance engine', href: 'https://ddg-greenlight.replit.app/', external: true, imgs: [{ src: '/work/greenlight.webp', cap: 'Seven steps from your code to proof: check it, see what is wrong, fix it, then check it again.', alt: 'DDG Greenlight: check my code' }] },
];
export const CONTACT = { eyebrow: 'Contact', title: 'Talk to us in writing.', line: 'Email us, or send the short form above for a fixed quote. We work in writing, so there is no call to book.', emailLabel: 'Email', postLabel: 'Post' };

export const BUILT = {
  eyebrow: 'Projects we have built',
  left: 'Complex platforms.',
  right: 'Built in-house.',
  line: 'Every system in our portfolio was designed, built and is run by us.',
};

export const RUN = {
  eyebrow: 'How we run it',
  title: 'Every business, run from one screen.',
  line: CONTROL_CASE.line,
  built: CONTROL_CASE.built,
};

// ── /privacy: a plain summary of what the website collects. Written 17 Nov 2026; to be checked by DDG's lawyer.
export const PRIVACY = {
  title: 'Privacy',
  updated: 'Updated 18 November 2026',
  sections: [
    { h: 'Who we are', p: ['Digital Dynamics Group Pty Ltd (ABN 66 687 743 193), Brisbane, Queensland. This page covers ddg.limited. Cattle Dog Coffee has its own privacy page on its own site. Contact: info@digitaldynamics-group.com, or PO Box 2070, Brighton Eventide QLD 4017.'] },
    { h: 'What we collect', p: [
      'When you send the enquiry form: your name, your email address and your answers (what you want built, what you have now, timing and budget).',
      'We do not use advertising trackers or cookies on this website. Our web host keeps standard technical logs (such as IP address and browser type) to run and protect the site. The page\u2019s fonts load from Google Fonts, so Google receives your IP address and browser type when the page opens.',
    ] },
    { h: 'Why we collect it', p: ['To read your enquiry, reply to you by email, and if you go ahead, quote and do the work. We do not sell your details and we do not add you to a mailing list.'] },
    { h: 'Who else sees it', p: ['Only the services we need to run the site and reply to you, such as our hosting and email providers. Some of these may store data outside Australia.'] },
    { h: 'Seeing, fixing or deleting your details', p: ['Reply to any email we have sent you, or send a new enquiry through the form, and ask. We will answer within 30 days. If you are not happy with our answer, you can contact the Office of the Australian Information Commissioner (oaic.gov.au).'] },
  ],
};
