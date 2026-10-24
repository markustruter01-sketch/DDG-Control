# DDG Control: monitoring only

Owner decision, 24 October 2026: drastically reduce the interface and retain
clean, minimal infrastructure. This replaces the automated-control delivery scope.

## Active application

LATEST OWNER CLARIFICATION: no avatars or village. The active interface is now
one viewport of high-level company key figures, prioritising bars over text:
consolidated profit, recorded income/debt, online customers, social footprint,
reach, engagement and monthly commitments. The owner chose existing saved records
with explicit gaps. The project/task overview described below is superseded.

The KPI endpoint uses only existing saved finance, metric and social tables with
bounded queries. Income covers 30 Brisbane calendar dates; debt is saved balances;
costs are recorded active recurring commitments, not actual total expenses.
Online customer readings are not deduplicated across businesses. Account follower
totals are not unique people. Snapshot dates are shown where recorded; metrics
from different dates do not become a verified current company total. All available
cards remain partial coverage; no rows means unknown, not a fabricated zero.
Consolidated profit remains unavailable because the saved sources do not establish
complete net profit/cost coverage. No external store/account API is called.
AUD follows the existing dashboard convention, not a new currency verification.
The graph data contains no sample values, synthetic trends or inferred targets.
The fixed-height responsive grid is designed for a single screen; actual viewport,
zoom, visual and owner acceptance checks have not been run.

One overview shows saved project status, bounded work counts, attention items,
recent recorded activity, project details and safe HTTPS links to source tools.
It retains the exact creative logo and glacier/navy identity with day/night mode,
responsive layout, keyboard focus and reduced-motion rules. No generated assets.

Mounted frontend: existing login, shared minimal header and Monitor page. Former
URLs show a link to the overview rather than loading control screens. Previous
work remains recoverable in Git; old draft PR30 is preserved, not merged.

Mounted server: existing health/authentication and owner-only GET /api/monitor.
Login/logout and existing authentication abuse bookkeeping remain. After auth,
all other mutation methods are refused; former control routes and machine-worker
entry points are not mounted. Startup no longer seeds projects. The monitoring
endpoint only selects capped metadata from existing projects, tasks and work
events. It does not call providers, start workers or infer approval from records.

No new schema, database, provider, model, scheduler, service or dependency. The
unmerged plan/hosted-worker schema and control additions from PR30 are excluded
from this release tree. Existing persisted schema/data are retained unchanged.

## Evidence and limits

This first monitoring view reads saved database records, not a newly verified
live-agent feed. The time displayed is when the dashboard read them. Partial or
unavailable sources stay visible; limited counts are lower bounds, not totals.
Historical actor/status values remain attributed to saved records. No raw event
details, prompts, credentials, private thinking or provider responses are returned.
External links must be HTTPS and cannot include URL usernames/passwords.

The client has a 20-second read timeout and explicit refresh; no background polling
or model work. One source may fail without inventing successful data for it.
Live source freshness, actual owner/device journey and deployed identity remain
unverified. No database/provider operation, migration, test, merge or deployment
was performed during implementation. Compilation/build are source checks only.

Scope excludes approval/dispatch, work toggles, model switching, cancellation,
checkpoint recovery, trading changes and production operations. Finance hold and
Music remain unchanged. Existing source integrations are not newly connected by
this redesign. Genuine telemetry ingestion can be separately scoped when its
source and permissions are known; no fake live state is substituted meanwhile.

## Owner-approved development access — 25 October 2026

Owner explicitly requires login off until development is finished, including saved KPI reads. GET/HEAD /api/monitor alone may use the existing DDG_DEV_AUTH_BYPASS=true flag when NODE_ENV is exactly development. Production, unset and other environment modes retain real owner authentication. Legacy control/provider routes remain unmounted; mutation methods remain refused. No new data source or fabricated figures. Access is temporary development access, not verified owner login or production acceptance.
