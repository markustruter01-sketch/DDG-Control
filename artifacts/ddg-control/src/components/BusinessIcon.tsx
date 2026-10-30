import type { ReactNode } from 'react';

export type BusinessIconName = 'finance' | 'coffee' | 'fitness' | 'creative';

/** The white line icons for the four businesses (same drawings as each site's tab icon).
 *  One set for Control and the public website. pathLength=1 lets CSS draw them on. */
const PATHS: Record<BusinessIconName, ReactNode> = {
  finance: <path pathLength={1} d="M5 20v-6M10 20V9M15 20v-9M20 20V4" />,
  coffee: <><path pathLength={1} d="M4 9h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z" /><path pathLength={1} d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17" /><path pathLength={1} d="M8 3v2M12 3v2" /></>,
  fitness: <path pathLength={1} d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12" />,
  creative: <><rect pathLength={1} x="3" y="5" width="18" height="14" rx="3" /><path pathLength={1} d="M10 9.5v5l4.5-2.5z" /></>,
};

export function BusinessIcon({ icon, size = 18, strokeWidth = 1.7, className }: {
  icon: BusinessIconName; size?: number; strokeWidth?: number; className?: string;
}) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{PATHS[icon]}</svg>
  );
}
