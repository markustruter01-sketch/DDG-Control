# Owner-approved main integration —21October2026

Owner explicitly requested all current Codex DDG Control work merged into main, with Codex primary coder and no wait for Claude. Finance remains separately held; publishing and database changes are not included.

The development chain descends from main df71a2d072e96be826d0db528b3d0840d64cc816 without divergence. Consolidated PR6 includes the cockpit, owner visual assets, work controls/context, source notifications, identity/coverage fixes, scoped question transactions and version-bound approvals, plus the source-only rejected-plan revision.

Prior PR4/PR5 type/build evidence is recorded in their docs and PRs. Rejected-plan source93413 has not compiled in Replit because it was not downloaded there; main integration is not proof of runtime or owner acceptance. No tests performed.

Pre-merge source audit found scripts/post-merge.sh automatically ran a broad database schema push. Removed that automatic step; dependency installation remains. Database migrations are a separate reviewed operation. Notification table remains unapplied: approval is isolated development only and actual target separation/no-cost backup remain unproven.

The existing daily workflow is scheduled/manual, not triggered by push. It was not run, modified or enabled here. Source report-writer guard refuses before provider calls when any managed work area is OFF, including held Finance. Worker hard-false guards remain unchanged.

Use main for future Replit updates after one switch/setup, avoiding repeated feature-branch changes. Do not push the old local branch over main, reset owner edits or force history. No production publication, data writes, provider calls or new charges authorized by this integration.
