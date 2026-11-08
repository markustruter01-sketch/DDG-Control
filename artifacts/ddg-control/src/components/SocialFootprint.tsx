import { PlatformIcon } from '@/components/PlatformIcon';
import { count } from '@/lib/money';
import { SOCIALS } from '@/lib/public-info';
import './social-footprint.css';

/** One social footprint bar for DDG Control and the public website: followers,
 *  views and likes, all time, for every platform at once (Markus 31 Oct: all time).
 *  Until a platform's all-time number has been recorded, its latest 30-day number
 *  shows instead, marked "30 days" (Markus 9 Nov); a new all-time reading replaces it.
 *  Nothing recorded at all shows "—", never a guess. */
export type SocialNumbers = {
  followers?: number | null;
  views?: number | null;
  likes?: number | null;
  /** True when views or likes are the 30-day number, not all time. */
  recent?: boolean;
};
type Reading = { followers: number | null; views_all_time: number | null; likes_all_time: number | null;
  views_30d: number | null; likes_30d: number | null };
/** All-time numbers from an API social summary, falling back to the latest 30-day ones. */
export const allTime = (s: Reading): SocialNumbers => ({
  followers: s.followers,
  views: s.views_all_time ?? s.views_30d,
  likes: s.likes_all_time ?? s.likes_30d,
  recent: (s.views_all_time == null && s.views_30d != null) || (s.likes_all_time == null && s.likes_30d != null),
});

export function SocialFootprint({ totals, platforms, links = false }: {
  totals: SocialNumbers | null | undefined;
  platforms: ({ platform: string } & SocialNumbers)[] | null | undefined;
  /** Website: each platform links to the DDG account. */
  links?: boolean;
}) {
  const byPlatform = new Map((platforms ?? []).map((p) => [p.platform, p]));
  return (
    <div className="sf">
      <div className="sf-head">
        <h2>Social footprint</h2>
        <span className="sf-label">{totals?.recent ? 'All time · 30 days where all-time is not in yet' : 'All time'}</span>
      </div>
      <dl className="sf-totals">
        <div className="sf-main"><dt className="sf-label">Followers</dt><dd>{count(totals?.followers)}</dd></div>
        <div><dt className="sf-label">Views</dt><dd>{count(totals?.views)}</dd></div>
        <div><dt className="sf-label">Likes</dt><dd>{count(totals?.likes)}</dd></div>
      </dl>
      <ul className="sf-platforms">
        {SOCIALS.map((s) => {
          const p = byPlatform.get(s.platform);
          const noData = p?.followers == null && p?.views == null && p?.likes == null;
          const body = (
            <>
              <PlatformIcon platform={s.platform} size={18} />
              <span className="sf-nums">
                <b>{count(p?.followers)}</b>
                <small>{noData ? 'No data' : `${count(p?.views)} views · ${count(p?.likes)} likes${p?.recent ? ' · 30 days' : ''}`}</small>
              </span>
            </>
          );
          return (
            <li key={s.platform} title={s.name}>
              {links && s.href
                ? <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`DDG on ${s.name}`}>{body}</a>
                : <span className="sf-cell">{body}</span>}
            </li>
          );
        })}
      </ul>
      {/* Phones: the same numbers as one small table (shown by CSS under 640 px). */}
      <table className="sf-table">
        <thead><tr><th scope="col"><span className="sf-sr">Platform</span></th><th scope="col">Followers</th><th scope="col">Views</th><th scope="col">Likes</th></tr></thead>
        <tbody>
          <tr className="sf-total"><th scope="row">All</th><td>{count(totals?.followers)}</td><td>{count(totals?.views)}</td><td>{count(totals?.likes)}</td></tr>
          {SOCIALS.map((s) => {
            const p = byPlatform.get(s.platform);
            const icon = <PlatformIcon platform={s.platform} size={15} />;
            return (
              <tr key={s.platform}>
                <th scope="row">
                  {links && s.href
                    ? <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`DDG on ${s.name}`}>{icon}<span>{s.name}</span></a>
                    : <span className="sf-cell">{icon}<span>{s.name}</span></span>}
                </th>
                <td>{count(p?.followers)}</td><td>{count(p?.views)}</td><td>{count(p?.likes)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
