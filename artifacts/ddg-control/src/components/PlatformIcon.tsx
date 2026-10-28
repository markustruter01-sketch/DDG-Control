import { siFacebook, siInstagram, siTiktok, siX, siYoutube } from 'simple-icons';
import type { Platform } from '@/lib/company';

const ICONS: Record<Platform, { path: string; title: string }> = {
  youtube: siYoutube, instagram: siInstagram, facebook: siFacebook, x: siX, tiktok: siTiktok,
};

/** Platform logo in white, per Night Glass (no brand colours on the panel). */
export function PlatformIcon({ platform, size = 16 }: { platform: Platform; size?: number }) {
  const icon = ICONS[platform];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" role="img" aria-label={icon.title}>
      <path d={icon.path} />
    </svg>
  );
}
