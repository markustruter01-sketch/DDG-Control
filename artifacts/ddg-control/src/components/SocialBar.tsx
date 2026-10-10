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
import { formatAgo, formatFigure } from '@/lib/format';

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
  const summary = query.data;
  const name = (slug: string) => projects.find((project) => project.slug === slug)?.name ?? slug;

  return (
    <section className="finance-summary social-summary" aria-label="Social reach" data-testid="social-summary">
      <div className="social-summary-head">
        <p className="finance-kpi-label">Social reach · followers</p>
        {!adding && projects.length > 0 && (
          <button className="task-secondary-button" type="button" onClick={() => setAdding(true)} data-testid="button-add-social">Add numbers</button>
        )}
      </div>
      {adding && <AddSocialNumbers projects={projects} onDone={() => setAdding(false)} />}
      {summary && (
        <div className="finance-kpi-grid">
          <article className="finance-kpi-card" data-testid="social-kpi-total">
            <p className="finance-kpi-label">All ventures</p>
            <p className="finance-kpi-value">{formatFigure(summary.total_followers, 'count')}</p>
            <p className="finance-kpi-detail">Followers, all platforms</p>
          </article>
          {summary.ventures.map((venture) => (
            <article className="finance-kpi-card" key={venture.project_slug} data-testid={`social-kpi-${venture.project_slug}`}>
              <p className="finance-kpi-label">{name(venture.project_slug)}</p>
              <p className="finance-kpi-value">{venture.platforms.length ? formatFigure(venture.total_followers, 'count') : '–'}</p>
              <p className="finance-kpi-detail">
                {venture.platforms.length === 0
                  ? 'No numbers yet'
                  : `${change(venture.followers_change_30d)} · ${venture.platforms
                      .map((p) => `${SOCIAL_PLATFORM_LABELS[p.platform]} ${formatFigure(p.followers, 'count')}`)
                      .join(', ')}`}
              </p>
            </article>
          ))}
        </div>
      )}
      {summary && <p className="finance-partial-line">Entered by hand · Updated {formatAgo(query.dataUpdatedAt)}</p>}
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
