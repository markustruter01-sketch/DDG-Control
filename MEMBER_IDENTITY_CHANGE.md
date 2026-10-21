# Employee roles and database actors

Scope: source correction after the owner-approved identity audit. Not a member migration, account provisioning action or provider release.

## Changes

- Nine owner-confirmed role identities have one shared presentation registry. Existing Company Map IDs/names/display roles remain the same; businesses are not employee entries.
- The compatibility ORG_CHART export derives from that registry and is explicitly presentation-only.
- Startup no longer inserts agent accounts from the company roster. Fresh empty member tables receive only the confirmed founder, conflict safely. Existing member rows/IDs/task ownership/history remain intact.
- The built-in Heimdall report writer explicitly distinguishes itself from external Heimdall GM/COO and separates technical/historical task actors from the employee roster. Its legacy Ollie lookup/routes/enums remain compatible. Missing actor fails before provider access and asks for owner provisioning.
- Existing Finance hold, work controls, provider guard and Music project logic are retained.

## Evidence and release

Source inspection only so far. No tests added/run, compilation, provider call, member inventory, migration, merge/deployment or production write performed for this proposal. Existing recovery builds do not cover it.
Read-only inventory must establish actual member references before any cleanup proposal. Never infer external employee access from a display role. See FEATURE_SANITY_LOG.md for the necessity/approach check.

Task-owner selectors and saved assignments use a dedicated actor-name formatter: legacy Ollie is explicitly the Heimdall report writer, while other stored names stay unchanged. IDs and assignments are preserved. The generic historical-text formatter is unchanged.
