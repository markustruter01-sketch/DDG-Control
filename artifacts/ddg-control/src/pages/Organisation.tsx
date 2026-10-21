import { Link } from 'wouter';
import { ORG_CHART, PRINCIPLES } from '@workspace/project-constants';
import { Header } from '@/components/header';

export function OrganisationPage() {
  type OrgPerson = (typeof ORG_CHART)[number];
  type VenturePerson = Extract<OrgPerson, { group: 'venture' }>;
  const founder = ORG_CHART.filter((person) => person.group === 'founder');
  const generalManagers = ORG_CHART.filter((person) => person.group === 'gm');
  const corporateTeam = ORG_CHART.filter((person) => person.group === 'corporate');
  const ventureManagers = ORG_CHART.filter(
    (person): person is VenturePerson => person.group === 'venture',
  );

  const renderPeople = (people: OrgPerson[]) => people.map((person) => (
    <article className="org-person" key={`${person.group}-${person.name}`}>
      <span className="org-person-name">{person.name}</span>
      <span className="org-person-role">{person.role}</span>
    </article>
  ));

  return (
    <div className="app-shell organisation-shell">
      <Header />
      <main className="page-wrap organisation-main">
        <Link className="back-link" href="/" data-testid="link-organisation-home">← Projects</Link>
        <header className="organisation-heading">
          <p className="eyebrow">People & accountability</p>
          <h1 className="home-title">Organisation</h1>
          <p className="organisation-intro">The team recommending and delivering approved work across DDG.</p>
        </header>

        <section className="org-chart" aria-labelledby="org-chart-title">
          <div className="section-rule"><span id="org-chart-title">Operating structure</span></div>
          <div className="org-tier org-tier-founder">
            <h2>Founder</h2>
            <div className="org-people">{renderPeople(founder)}</div>
          </div>
          <div className="org-connector" aria-hidden="true" />
          <div className="org-tier org-tier-gm">
            <h2>GM</h2>
            <div className="org-people">{renderPeople(generalManagers)}</div>
          </div>
          <div className="org-connector" aria-hidden="true" />
          <div className="org-branches">
            <section className="org-branch" aria-labelledby="corporate-title">
              <div className="org-tier">
                <h2 id="corporate-title">Corporate team</h2>
                <div className="org-people">{renderPeople(corporateTeam)}</div>
              </div>
            </section>
            <section className="org-branch" aria-labelledby="ventures-title">
              <div className="org-tier">
                <h2 id="ventures-title">Venture managers</h2>
                <div className="org-people">
                  {ventureManagers.map((person) => (
                    <Link
                      href={`/projects/${person.project_slug}`}
                      className="org-person org-person-link"
                      key={`${person.group}-${person.name}`}
                      data-testid={`link-org-project-${person.project_slug}`}
                    >
                      <span className="org-person-name">{person.name}</span>
                      <span className="org-person-role">{person.role}</span>
                      <span className="org-project-arrow" aria-hidden="true">↗</span>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="principles-section" aria-labelledby="principles-title">
          <div className="section-rule"><span id="principles-title">Principles</span></div>
          <ol className="principles-list">
            {PRINCIPLES.map((principle, index) => (
              <li key={principle}>
                <span className="principle-index">{String(index + 1).padStart(2, '0')}</span>
                <span>{principle}</span>
              </li>
            ))}
          </ol>
          <p className="organisation-note">Agents recommend. Markus decides.</p>
        </section>
      </main>
    </div>
  );
}
