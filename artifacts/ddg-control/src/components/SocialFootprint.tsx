import { PlatformIcon } from '@/components/PlatformIcon';
import { count } from '@/lib/money';
import { SOCIALS } from '@/lib/public-info';
import './social-footprint.css';

/** One social footprint bar for DDG Control and the public website: followers,
 *  views and likes, all time, for every platform at once (Markus 31 Oct: all time).
 *  A platform that does not show an all-time number shows "—", never a guess. */
export type SocialNumbers = {
  followers?: number | null;
  views?: number | null;
  likes?: number | null;
};
type AllTime = { followers: number | null; views_all_time: number | null; likes_all_time: number | null };
/** The all-time numbers from an API social summary. */
export const allTime = (s: AllTime): SocialNumbers => ({ followers: s.followers, views: s.views_all_time, likes: s.likes_all_time });

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
        <span className="sf-label">All time</span>
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
                <small>{noData ? 'No data' : `${count(p?.views)} views · ${count(p?.likes)} likes`}</small>
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
