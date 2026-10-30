import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getGetOverviewQueryKey, useCreateSocialSnapshot, useGetOverview } from '@workspace/api-client-react';
import { Header } from '@/components/header';
import { PlatformIcon } from '@/components/PlatformIcon';
import { SOCIALS, type Platform } from '@/lib/company';
import { serverErrorText } from '@/lib/errors';
import { count } from '@/lib/money';

// Whose account a reading belongs to. Company socials are saved under the Creative business in the database.
const ACCOUNTS = [
  { slug: 'ddg-music', label: 'DDG company accounts' },
  { slug: 'cattle-dog-coffee', label: 'Cattle Dog Coffee accounts' },
];

const whole = (v: string): number | null => {
  if (v.trim() === '') return null;
  if (!/^\d+$/.test(v.trim())) throw new Error('Whole numbers only, no commas.');
  return Number(v.trim());
};

export function Social() {
  const client = useQueryClient();
  const overview = useGetOverview();
  const save = useCreateSocialSnapshot();
  const [account, setAccount] = useState(ACCOUNTS[0]!.slug);
  const [platform, setPlatform] = useState<Platform>('youtube');
  const [followers, setFollowers] = useState('');
  const [views, setViews] = useState('');
  const [likes, setLikes] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      const f = whole(followers);
      if (f === null) throw new Error('Followers is needed.');
      await save.mutateAsync({ data: { project_slug: account, platform, followers: f, impressions_30d: whole(views), engagements_30d: whole(likes) } });
      await client.invalidateQueries({ queryKey: getGetOverviewQueryKey() });
      setFollowers(''); setViews(''); setLikes('');
      setMessage('Saved.');
    } catch (e) { setMessage(e instanceof Error && !('status' in e) ? e.message : serverErrorText(e, 'Could not save.')); }
  };

  const byPlatform = new Map(overview.data?.social.platforms.map((p) => [p.platform, p]));
  return (
    <div className="ng-page dusk">
      <div className="ng-wrap">
        <Header />
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 400 }}>Social</h1>
        <p className="muted" style={{ margin: 0, maxWidth: 720 }}>Latest numbers per platform, all accounts added together. Save a new reading whenever you check an account; the newest reading counts.</p>

        <section className="glass panel" aria-label="Current numbers">
          <div className="table-scroll">
            <table>
              <thead><tr><th>Platform</th><th style={{ textAlign: 'right' }}>Followers</th><th style={{ textAlign: 'right' }}>Views · 30 days</th><th style={{ textAlign: 'right' }}>Likes · 30 days</th><th>Last reading</th></tr></thead>
              <tbody>
                {SOCIALS.map((s) => {
                  const p = byPlatform.get(s.platform);
                  return (
                    <tr key={s.platform}>
                      <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}><PlatformIcon platform={s.platform} />{s.name}</span></td>
                      <td className="money">{count(p?.followers)}</td><td className="money">{count(p?.views_30d)}</td><td className="money">{count(p?.likes_30d)}</td>
                      <td className="note">{p?.captured_on ?? 'No reading yet'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="glass panel" aria-label="Save a reading">
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Save a reading</h2>
          <form className="form" onSubmit={submit}>
            <label className="field">Account
              <select value={account} onChange={(e) => setAccount(e.target.value)}>
                {ACCOUNTS.map((a) => <option key={a.slug} value={a.slug}>{a.label}</option>)}
              </select>
            </label>
            <label className="field">Platform
              <select value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                {SOCIALS.map((s) => <option key={s.platform} value={s.platform}>{s.name}</option>)}
              </select>
            </label>
            <label className="field">Followers / subscribers<input value={followers} onChange={(e) => setFollowers(e.target.value)} inputMode="numeric" required /></label>
            <label className="field">Views, last 30 days<input value={views} onChange={(e) => setViews(e.target.value)} inputMode="numeric" placeholder="optional" /></label>
            <label className="field">Likes, last 30 days<input value={likes} onChange={(e) => setLikes(e.target.value)} inputMode="numeric" placeholder="optional" /></label>
            <button type="submit" className="btn fill" disabled={save.isPending}>{save.isPending ? 'Saving…' : 'Save'}</button>
          </form>
          {message && <p role="status" className={message === 'Saved.' ? 'muted' : 'alert'} style={{ margin: 0 }}>{message}</p>}
        </section>
      </div>
    </div>
  );
}
