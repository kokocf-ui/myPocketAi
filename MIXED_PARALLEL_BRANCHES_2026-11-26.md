# Mixed transport: independent search branches — 2026-11-26

## User requirement

The user already applied for Omio affiliation and reports being asked for a larger subscriber base. The requested work is our own parallel multimodal exploration and harmonization, not another affiliation explanation. Their FlixBus example is an operator city-pair journey that may include changes in Europe, not necessarily a direct coach service. This is user-provided context, not a live service verification.

## Implemented in this branch

- `mixed_ground_operator_discovery.mjs`: replace two mixed/generic end-to-end searches with explicit coach and rail searches, launched concurrently. The existing Brave fallback also searches these two mode branches concurrently when applicable.
- Start the existing corridor/segment search alongside end-to-end searches. Previously it was started after them, and an early return on unsuccessful end-to-end lookups suppressed it completely.
- Accept and internally publish each mode's eligible, geography-checked results when that response arrives; do not wait for the other mode before preserving progress. Keep corridor progress independently.
- Retain successful corridor evidence even if both city-pair searches fail. A connection-only result now has an options-present status, with source errors retained.
- Keep six displayed operator options, interleaving coach and rail to prevent the faster/more prolific branch from hiding the other. This is diversity selection, NOT cheapest/fastest ordering without comparable totals.
- Operator city-pair evidence explicitly carries `route_scope: operator_city_pair`, `direct_service_verified: false`, `changes_status: unknown`, `through_ticket_verified: false`. A route-page title/excerpt cannot establish a direct vehicle, named interchange, through ticket or guaranteed transfer. No invented transfer points.
- `index.js`: both the card and detail view disclose that an operator route may include changes. Operator-owned city-pair URLs are preserved; no mandatory split via geography-derived intermediate cities.
- `mixed_indicative_search.mjs`: air candidate enrichment/access-egress preparation begins as soon as air discovery returns, concurrently with ground discovery, rather than waiting behind it. This removes an unnecessary serial dependency; it does not promise a particular physical end-to-end latency.

## Budgets and unchanged constraints

No new provider or subscription, no live requests to transport/geography/search providers, no integration of booking inventory or scraping, no deployment or new APK. HERE remains OFF, 0 of the maximum 2 attempts used.

Existing ceilings remain two initial Exa queries, up to two existing Brave fallback queries if applicable, and six corridor queries over at most two geography-derived intermediate cities. Thus Exa-only/Brave-only initial+segment search is at most eight queries; when both search providers are configured and fallback is used, the existing overall worst case can reach ten. Corridor concurrency remains four workers; the two city-pair workers can overlap with those (up to six search requests in flight across these branches). Existing corridor quota/access stop and outer cancellation/deadline remain in place. These ceilings do NOT themselves prove a provider account has free quota or enforce an account-wide spend cap. No provider settings or paid fallback were enabled here.

## Validation (offline/mocked only)

- New `tests_mixed_parallel_branches.mjs`, added to `npm run test:mixed-orientation`: deterministic deferred barriers prove both mode queries are pending while a train+coach corridor finishes; failed city-pair searches do not discard it; fast coach evidence is internally published before slow rail finishes; Brave-only mode diversity respects the six-option cap; candidate enrichment does not wait behind ground; city-pair evidence does not imply direct service or a through ticket.
- Full `test:mixed-orientation`, `test:transit-audit`, `test:national-transport`, `check`, frontend generated boot syntax and `git diff --check`: PASS.
- Browser `test:mixed-orientation:browser`: PASS at 360/393/430, including the changes/direct-service disclosure, retained alternatives and Back. Fixture network only, not physical APK validation.
- Frontend/backend Wrangler `deploy --dry-run`: PASS. Not deployments.
- Logs: `.bundle-check/parallel-*` (local validation artifacts, not committed).

## Still not implemented/verified

This is a concrete first orchestration increment, NOT completion of Rome2Rio-style door-to-door planning. The phone still receives a single aggregated response; internal progress callbacks are not streamed to the UI. No live UK–Oradea FlixBus itinerary, dates, changes, boarding stops, total duration or through-ticket coverage were checked. Existing city-pair route-page evidence does not provide station coordinates for exact local access/egress. Scheduled provider graph/local reuse remains as documented in `MIXED_SHARED_LOCAL_SURFACE_LINKS_2026-11-26.md`; arbitrary city-pair page results are not promoted into verified station-level journeys. Scheduled multi-operator harmonization needs actual stop/date evidence. No claim of complete Grays-address → Oradea-address travel readiness.

Released backend v186 / APK501886 are unchanged. PR558 remains draft; no main merge or Oracle changes.
