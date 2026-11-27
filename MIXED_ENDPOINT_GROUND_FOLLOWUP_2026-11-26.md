# Mixed transport follow-up after accepted APK501894 UI

## User feedback / scope

The user confirms APK501894 now looks/behaves correctly for the recent UI fixes,
then returns to unresolved mixed transport. An airport is an ordinary geographic
endpoint: route from the real departure to the departure airport and from the
arrival airport to the exact final destination. Independently search rail/coach
alternatives; airports must not be a prerequisite. This is NOT acceptance of
background GPS or of mixed transport coverage.

## Confirmed source defects and branch corrections

1. `prepareMixedFlightOptions` and `connectCandidateFlightToGround` rejected
   every connecting-flight candidate before even asking the local planners.
   Now options with up to six supplied flight legs route the OUTER ends:
   selected origin → FIRST departure airport; LAST arrival airport → selected
   destination. Airport coordinates/time zones are source-resolved as before.
   Intermediate flight/terminal transfers remain explicitly unverified; having
   two good outer ground links does not certify a complete multi-flight journey.
2. Airport/zone resolution AND ordinary local routing shared a 7.5s deadline.
   The parent discarded the whole set at 8.5s if not every candidate finished.
   Connector deadline is now at most 20s, with cancellable outer limit 21s,
   within the existing mixed request timeout (65s). Completed per-option details
   are streamed and retained if another option stalls. Late callbacks after
   cancellation cannot overwrite results. Existing source-count ceilings remain.
3. One-field mode selection discarded structured `city` fields. Surface search
   had to infer a city from an arbitrary POI/address label. Preserve origin and
   destination city through the real wizard/calendar handoff. Localized GPS labels
   containing GPS are reverse-resolved rather than treated as city names.
4. Propagate surface source error codes through progress/final fields. The UI
   explicitly explains quota/access failure rather than reporting missing trains.
   An HTTP402 also stops further corridor dispatch like 401/403/429. A source
   error marks the search incomplete. No new paid service or quota is enabled.
5. Include access attempted dates/provider statuses and egress provider status
   in flight details to distinguish not-searched, timeout and provider failures.

These are proven code defects, NOT proof they explain every physical result.
No fixed city, airport, station, line, time or fare was added to runtime routing.

## Safe live configuration diagnostic (no journey/search-credit probe)

Existing `mixed-live-diagnostic.yml`, `run_live=false`, current branch:
run45981812790/check140447330009 SUCCESS. Sanitized check annotations read via
GitHub API (log archive redirect inaccessible in this sandbox).

- GEOAPIFY, EXA, BRAVE, SERPAPI, TFL, TRANSCAPI, RO_URBAN token/VPC bindings present.
- `MOTIS_API_BASE_URL` absent. This prevents that adapter supplying international
  dated rail/coach journeys; it does NOT mean all surface discovery is disabled.
- HERE OFF; country registry ON. No configuration change.
- No-credit flight health: HTTP200, free_active/freePlan/hasQuota true,
  flightSearchActive false, consumesSearchCredits false. This does NOT establish
  Exa/Brave balances or successful local/intercity journey coverage.
- Last-hour aggregate:37success/162subrequests/0errors and
  13clientDisconnected/28subrequests/0errors. Not attributed to the user's trip.
- No live Exa/Brave, local transit, flight or HERE journey query was made here.

## Verification

- `tests_mixed_endpoint_enrichment.mjs`: actual prefetch/connector modules;
  a two-flight option routes both exact outer airports, a controlled local
  response at8.1s survives (beyond the former7.5s), completed details publish
  individually; parent deadline aborts work and preserves completed options;
  independent ground evidence/source errors retained. Offline fixtures only.
- Updated flight connector/prefetch/provider reliability/GPS-locality/error tests.
- `npm run test:mixed-orientation`, `npm run test:transit-audit`, `npm run check`,
  generated frontend boot and one-field request suite PASS.
- Compiled Chromium at360/393/430: real wizard mode/calendar handoff preserves
  structured cities; rail/coach and flights coexist, surface-only routes work
  without airports, quota disclosure, early details/Back/cancel, no request on tap.
- Compiled real Leaflet navigation suite PASS4viewports/rotation; compiled national
  Back regression PASS. Accepted layout/arrows/reset retained.
- Frontend and backend Wrangler dry runs PASS; browser-name guard PASS6,896,882chars.
  No Worker deployment.

## Not resolved / release boundary

No new APK or backend deployment in this stage. Latest phone APK remains501894;
backend remainsv187/f7ab634. These branch fixes require a matching backend release
before a phone APK can exercise them. Do NOT ship another APK and call the live
mixed problem resolved just because fixtures are green.

Actual source responses for the user's route/date must still establish why ground
results are missing. Binding presence is not usable balance or coverage. Operator
route pages remain useful unscheduled evidence, not dated/ticket-confirmed journeys.
No invented transfer fills missing international or domestic coverage. The shared
local planner retains its12-call request ceiling; later candidates may report that
budget exhausted. Missing time zones still prevent safe flight-time alignment.
No promise of arbitrary airport/terminal coverage is made.

HERE usage0/max2 unchanged and disabled, no Oracle/main merge/production frontend
deploy, no subscription, no new provider activation or paid fallback.
