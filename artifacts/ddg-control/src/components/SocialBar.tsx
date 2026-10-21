import { useState, type FormEvent } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetSocialSummaryQueryKey,
  useCreateSocialSnapshot,
  useGetSocialSummary,
  type Project,
  type SocialPlatform,
} from '@workspace/api-client-react';
import { SOCIAL_PLATFORMS, SOCIAL_PLATFORM_LABELS } from '@workspace/project-constants';
import { serverErrorText } from '@/lib/errors';
import { formatFigure } from '@/lib/format';

function change(value: number | null): string {
  if (value === null) return '30-day change: not enough history yet';
  return `${value >= 0 ? '+' : ''}${formatFigure(value, 'count')} in 30 days`;
}

function optionalCount(raw: string): number | undefined {
  return raw.trim() === '' ? undefined : Number(raw);
}

function AddSocialNumbers({ projects, onDone }: { projects: Project[]; onDone: () => void }) {
  const client = useQueryClient();
  const [slug, setSlug] = useState(projects[0]?.slug ?? '');
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [followers, setFollowers] = useState('');
  const [impressions, setImpressions] = useState('');
  const [engagements, setEngagements] = useState('');
  const mutation = useCreateSocialSnapshot({
    mutation: {
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: getGetSocialSummaryQueryKey() });
        onDone();
      },
    },
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    mutation.mutate({
      data: {
        project_slug: slug,
        platform,
        followers: Number(followers),
        impressions_30d: optionalCount(impressions),
        engagements_30d: optionalCount(engagements),
      },
    });
  }

  return (
    <form className="social-form" onSubmit={submit} data-testid="form-social-numbers">
      <label className="task-field">
        <span>Venture</span>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} data-testid="select-social-venture">
          {projects.map((project) => <option key={project.slug} value={project.slug}>{project.name}</option>)}
        </select>
      </label>
      <label className="task-field">
        <span>Platform</span>
        <select value={platform} onChange={(e) => setPlatform(e.target.value as SocialPlatform)} data-testid="select-social-platform">
          {SOCIAL_PLATFORMS.map((p) => <option key={p} value={p}>{SOCIAL_PLATFORM_LABELS[p]}</option>)}
        </select>
      </label>
      <label className="task-field">
        <span>Followers today</span>
        <input type="number" min={0} step={1} required value={followers} onChange={(e) => setFollowers(e.target.value)} data-testid="input-social-followers" />
      </label>
      <label className="task-field">
        <span>Impressions · last 30 days <span className="task-field-optional">(optional)</span></span>
        <input type="number" min={0} step={1} value={impressions} onChange={(e) => setImpressions(e.target.value)} data-testid="input-social-impressions" />
      </label>
      <label className="task-field">
        <span>Likes, comments, shares · last 30 days <span className="task-field-optional">(optional)</span></span>
        <input type="number" min={0} step={1} value={engagements} onChange={(e) => setEngagements(e.target.value)} data-testid="input-social-engagements" />
      </label>
      <div className="social-form-actions">
        <button className="task-primary-button" type="submit" disabled={mutation.isPending || !slug || followers === ''} data-testid="button-save-social">
          {mutation.isPending ? 'Saving…' : 'Save numbers'}
        </button>
        <button className="task-secondary-button" type="button" onClick={onDone}>Cancel</button>
      </div>
      {mutation.isError && <p className="finance-summary-state finance-summary-error" role="alert">{serverErrorText(mutation.error, 'Unable to save numbers.')}</p>}
    </form>
  );
}

export function SocialBar({ projects }: { projects: Project[] }) {
  const query = useGetSocialSummary();
  const [adding, setAdding] = useState(false);
  const summary = query.isError ? undefined : query.data;
  const name = (slug: string) => projects.find((project) => project.slug === slug)?.name ?? slug;
  const platformRows = summary?.ventures.flatMap((venture) => venture.platforms.map((platform) => ({
    ...platform,
    project_slug: venture.project_slug,
  }))) ?? [];
  const maxFollowers = Math.max(1, ...platformRows.map((platform) => platform.followers));
  const recordedVentures = summary?.ventures.filter((venture) => venture.platforms.length > 0) ?? [];
  const missingVentures = summary?.ventures.filter((venture) => venture.platforms.length === 0) ?? [];
  const captureDates = platformRows.map((platform) => platform.captured_on).filter(Boolean).sort();


  return (
    <section className="home-performance-panel home-social-panel social-summary" aria-labelledby="home-social-title" data-testid="social-summary">
      <div className="social-summary-head">
        <div>
          <p className="home-section-kicker">Business performance</p>
          <h2 id="home-social-title">Social reporting</h2>
        </div>
        {!adding && projects.length > 0 && (
          <button className="task-secondary-button" type="button" onClick={() => setAdding(true)} data-testid="button-add-social">Add numbers</button>
        )}
      </div>
      <p className="home-social-note">Saved platform snapshots; source and capture date appear below. Manual entries are labelled. Counts are summed, not deduplicated people; missing coverage is Unknown.</p>
      {summary && (
        <details className="home-source-details">
          <summary>Saved coverage · {recordedVentures.length} of {summary.ventures.length} registered ventures have readings</summary>
          <p>{platformRows.length} business/platform readings. Individual accounts and shared-account overlap are not identified; complete company coverage is Unknown.</p>
          <p>Oldest capture: {captureDates[0] || 'Unknown'}. Capture dates describe saved readings, not a live connection or a last sync.</p>
          {missingVentures.length > 0 && <p>No saved readings: {missingVentures.map((venture) => name(venture.project_slug)).join(', ')}. This does not establish whether those ventures have social accounts.</p>}
          <p>Totals can include overlapping audiences. Platform-specific measures and verified account connections remain to be configured.</p>
        </details>
      )}

      {adding && <AddSocialNumbers projects={projects} onDone={() => setAdding(false)} />}
      {summary && platformRows.length > 0 && (
        <>
          <div className="home-social-total">
            <span>Reported follower total · partial saved coverage</span>
            <strong>{formatFigure(summary.total_followers, 'count')}</strong>
          </div>
          <div className="home-social-list">
            {summary.ventures.map((venture) => (
              <article className="home-social-venture" key={venture.project_slug} data-testid={`social-kpi-${venture.project_slug}`}>
                <h3>{name(venture.project_slug)}</h3>
                {venture.platforms.length === 0 ? <p>Unknown · no saved readings</p> : venture.platforms.map((platform) => (
                  <div className="home-social-platform" key={platform.platform}>
                    <div className="home-social-platform-top">
                      <strong>{SOCIAL_PLATFORM_LABELS[platform.platform]}</strong>
                      <span>{formatFigure(platform.followers, 'count')} followers</span>
                    </div>
                    <div className="home-bar-track"><i className="home-bar-social" style={{ width: `${(platform.followers / maxFollowers) * 100}%` }} /></div>
                    <p>
                      {platform.source.toLowerCase().includes('manual') ? 'Manual' : platform.source || 'Unknown source'}
                      {' · captured '}
                      {platform.captured_on || 'date Unknown'}
                      {' · '}
                      {change(platform.followers_change_30d)}
                    </p>
                    <small>
                      Impressions (30d): {platform.impressions_30d == null ? 'Unknown' : formatFigure(platform.impressions_30d, 'count')}
                      {' · Engagements (30d): '}
                      {platform.engagements_30d == null ? 'Unknown' : formatFigure(platform.engagements_30d, 'count')}
                    </small>
                  </div>
                ))}
              </article>
            ))}
          </div>
        </>
      )}
      {summary && platformRows.length === 0 && <p className="home-unknown-state">Unknown · no social readings are saved.</p>}
      {query.isLoading && <p className="finance-summary-state" role="status">Loading social numbers…</p>}
      {query.isError && (
        <div className="finance-summary-state finance-summary-error" role="alert">
          <span>{serverErrorText(query.error, 'Unable to load social numbers.')}</span>
          <button className="retry-button" type="button" onClick={() => void query.refetch()}>Retry</button>
        </div>
      )}
    </section>
  );
}
