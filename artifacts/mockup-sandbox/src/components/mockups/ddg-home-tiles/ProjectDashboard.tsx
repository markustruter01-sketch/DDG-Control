import type { CSSProperties } from 'react';

const projects = [
  { slug: 'hypest', name: 'DDG - Hypest', status: 'unset' },
  { slug: 'finance', name: 'DDG - Finance', status: 'unset' },
  { slug: 'cattle-dog-coffee', name: 'Cattle Dog Coffee', status: 'unset' },
  { slug: 'gods-eye-view', name: 'Gods Eye View', status: 'unset' },
];

const backgroundStyle = {
  '--home-background': 'url("/__mockup/images/dashboard-background.jpg")',
} as CSSProperties;

export function ProjectDashboard({ glass = false }: { glass?: boolean }) {
  return (
    <div className="app-shell home-shell" style={backgroundStyle}>
      <header className="topbar">
        <a href="#" className="brand" aria-label="DDG Control home">
          <span className="brand-mark" aria-hidden="true">dd</span>
          <span>DDG Control</span>
        </a>
      </header>
      <main className="page-wrap home-main">
        <p className="eyebrow">Control panel</p>
        <h1 className="home-title">Projects</h1>
        <div className="section-rule"><span>Projects</span></div>
        <div className="project-grid">
          {projects.map((project) => (
            <a
              key={project.slug}
              href={`#${project.slug}`}
              className={`project-tile${glass ? ' project-tile--glass' : ''}`}
            >
              <div className="tile-top">
                <h2 className="tile-name">{project.name}</h2>
                <span className="status-badge">
                  <span className="status-dot" aria-hidden="true" />
                  {project.status}
                </span>
              </div>
              <div className="tile-facts">
                <p className="tile-fact"><strong>Headline:</strong> No data yet</p>
                <p className="tile-fact"><strong>Next action:</strong> No data yet</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
