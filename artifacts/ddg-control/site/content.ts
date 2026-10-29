// Every word on the public website lives here. Links come from src/lib/public-info.ts (one source).
import { PUBLIC_SITES } from '@/lib/public-info';

const site = (key: keyof typeof PUBLIC_SITES) => PUBLIC_SITES[key];

export const COMPANY = {
  legalName: 'Digital Dynamics Group Pty Ltd',
  abn: '66 687 743 193',
  place: 'Brisbane, Queensland',
};

export const HERO = {
  eyebrow: 'Digital Dynamics Group · Brisbane',
  title: 'Four businesses. One founder. A team of AI employees.',
  body: 'DDG runs a coffee brand, a trading platform, an AI fitness coach and a creative studio. Claude writes the code, nine Grok bots run the day-to-day, and we share how it all gets built.',
};

export type SiteBusiness = {
  key: 'coffee' | 'finance' | 'fitness' | 'creative';
  name: string;
  product: string;
  line: string;
  status: string;
  accent: string;
  link: { label: string; href: string; external: boolean } | null;
  note?: string;
};

export const SITE_BUSINESSES: SiteBusiness[] = [
  { key: 'coffee', name: 'DDG Coffee', product: 'Cattle Dog Coffee', accent: 'var(--ng-amber)', status: 'Open now',
    line: 'Coffee beans delivered to your door. $1 from every bag goes to animal welfare.',
    link: { label: 'Shop coffee', href: site('coffee'), external: true } },
  { key: 'finance', name: 'DDG Finance', product: 'Trading platform', accent: 'var(--ng-mint)', status: 'From 1 Jan 2027',
    line: 'Our own algorithmic trading platform. Its public track record starts on 1 January 2027.',
    link: null, note: 'Paper trading. Not financial advice.' },
  { key: 'fitness', name: 'DDG Fitness', product: 'Hypest', accent: 'var(--ng-volt)', status: 'In development',
    line: 'Fitness plans and coaching from specialist AI coaches, on your phone.',
    link: null },
  { key: 'creative', name: 'DDG Creative', product: 'Studio', accent: 'var(--ng-violet)', status: 'Posting now',
    line: 'Vlogs, gaming clips, music and a novel.',
    link: { label: 'See projects', href: '/creative', external: false } },
];

export const CHARITY = {
  title: 'Every bag helps animals',
  body: 'Cattle Dog Coffee gives $1 from every bag sold to animal welfare. Want to help directly? Donate to charities like the RSPCA.',
  donate: { label: 'Donate to RSPCA Queensland', href: 'https://www.rspcaqld.org.au/get-involved/ways-you-can-donate/make-a-donation' },
};

export type CreativeProject = { name: string; line: string; status: string; href: string | null };
export const CREATIVE: CreativeProject[] = [
  { name: 'Vlogs', line: 'Behind the scenes of building DDG and its four businesses with nine AI employees.', status: 'New episodes',
    href: site('creative') },
  { name: 'Shorts', line: 'A new short every day at 9:30 pm Brisbane time.', status: 'Daily', href: site('creative') },
  { name: 'Gaming clips', line: 'Clips from our gaming sessions.', status: 'Coming soon', href: null },
  { name: 'DDG Music', line: 'An AI music channel.', status: 'Coming soon', href: null },
  { name: 'Threads of Empire', line: 'Our first novel. Releasing late January 2027 on every major free platform, including Audible.', status: 'Late Jan 2027', href: null },
];
