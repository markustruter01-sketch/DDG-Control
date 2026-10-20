import { Link } from 'wouter';
import { PRINCIPLES } from '@workspace/project-constants';
import { Header } from '@/components/header';
import { formatCurrentDisplayName } from '@/lib/format';
import { CompanyMap } from '@/components/CompanyMap';
import { companyMapNodes } from '@/lib/company-map-data';

export function OrganisationPage() {
  const founder = companyMapNodes.find((node) => node.id === 'person-markus');
  const employees = companyMapNodes.filter((node) => node.kind === 'person' && node.id !== 'person-markus');
  return (
    <div className="app-shell organisation-shell">
      <Header />
      <main className="page-wrap organisation-main">
        <Link className="back-link" href="/" data-testid="link-organisation-home">← Home</Link>
        <header className="organisation-heading">
          <p className="eyebrow">People and connections</p>
          <h1 className="home-title">Company Map</h1>
          <p className="organisation-intro">Nine employees, one founder. Roles do not imply live activity or access permissions.</p>
        </header>
        <CompanyMap />
        <section className="org-chart" aria-labelledby="org-chart-title">
          <div className="section-rule"><span id="org-chart-title">Confirmed company directory</span></div>
          {founder && <div className="org-tier org-tier-founder"><h2>Founder</h2><div className="org-people"><article className="org-person"><span className="org-person-name">{founder.label}</span><span className="org-person-role">{founder.ownerRole}</span></article></div></div>}
          <div className="org-tier"><h2>Employees · {employees.length}</h2><div className="org-people">{employees.map((person) => (
            <article className="org-person" key={person.id}><span className="org-person-name">{person.label}</span><span className="org-person-role">{person.ownerRole}</span></article>
          ))}</div></div>
          <p className="organisation-note">The external Heimdall GM is separate from the dashboard's report writer. Projects and businesses are not additional employees.</p>
        </section>
        <details className="principles-section">
          <summary className="section-rule"><span>Operating principles</span></summary>
          <ol className="principles-list">{PRINCIPLES.map((principle,index) => <li key={principle}><span className="principle-index">{String(index+1).padStart(2,'0')}</span><span>{formatCurrentDisplayName(principle)}</span></li>)}</ol>
          <p className="organisation-note">Agents recommend. Markus decides.</p>
        </details>
      </main>
    </div>
  );
}
