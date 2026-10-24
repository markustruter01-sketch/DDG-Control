# DDG Control: monitoring only

Owner decision, 24 October 2026: drastically reduce the interface and retain
clean, minimal infrastructure. This replaces the automated-control delivery scope.

## Active application

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
