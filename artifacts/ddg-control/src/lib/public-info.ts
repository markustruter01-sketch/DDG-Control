// Facts that are public: shown on the DDG website and reused by DDG Control.
// Keep anything internal (bots, tools, admin links) out of this file — the website bundles it.

export const PUBLIC_SITES = {
  coffee: 'https://cattledogcoffee.com.au',
  creative: 'https://www.youtube.com/@DigitalDynamicsGroup',
} as const;

export type Platform = 'youtube' | 'instagram' | 'facebook' | 'x' | 'tiktok';
export const SOCIALS: { platform: Platform; name: string; href: string | null }[] = [
  { platform: 'youtube', name: 'YouTube', href: 'https://www.youtube.com/@DigitalDynamicsGroup' },
  { platform: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/digitaldynamicsgroup/' },
  { platform: 'facebook', name: 'Facebook', href: null },
  { platform: 'x', name: 'X', href: 'https://x.com/DDGCompany' },
  { platform: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@ddg.company' },
];
