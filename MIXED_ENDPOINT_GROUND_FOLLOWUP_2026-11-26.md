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


## Actual open feed investigation and local-date repair (subsequent stage)

### Real source evidence, not fixtures

Official static dataset: https://gtfs.gis.flix.tech/gtfs_generic_eu.zip
Publisher page: https://transport.data.gouv.fr/datasets/flixbus-horaires-theoriques-du-reseau-europeen-1
Downloaded in Actions runs 45985222438, 45985522457 and 45985736746.
Actual counts: 2072 stops, 1224 routes, 41333 trips, 284106 stop_times;
feed validity 2026-11-23 through 2027-05-23. Agencies FlixBus-eu and FlixTrain-eu
specify UTC. ODbL plus PAN particular conditions must be respected before
redistributing an index/database (attribution and applicable share-alike).

The Python diagnostic planner uses service calendars/exceptions, service-day
GTFS times including >24h, stop order, pickup/dropoff restrictions where given,
agency timezone and minimum 45-minute same-source-stop transfers. It is NOT
integrated into application routing. Eleven Python tests pass; these supplement,
not replace, the actual downloaded-source observations.

Synthetic request 2026-12-03T06:00Z, 72-hour horizon, source-derived candidates
(all times UTC):

| Candidate | Leg | Departure | Arrival |
|---|---|---|---|
| 1 | 700 London Victoria → Paris Bercy | Dec 3 08:30 | Dec 3 16:50 |
| 1 | N1309 Paris Bercy → Prague Florenc | Dec 3 20:25 | Dec 4 09:35 |
| 1 | 1926 Prague Florenc → Oradea Intrans | Dec 4 12:05 | Dec 4 23:55 |
| 2 | N380 London Victoria → Hamburg ZOB | Dec 3 20:30 | Dec 4 14:35 |
| 2 | 1926 Hamburg ZOB → Oradea Intrans | Dec 5 04:00 | Dec 5 23:55 |

These are theoretical scheduled candidates, not seat/fare availability or
protected transfers. Oradea source stop is about 2187 m from the synthetic
final point. Neither that distance nor a plausible connection proves egress.

### Actual local probe exposed a date bug

Run 45985736746 made two ordinary domestic requests only, no flight/Exa/Brave/
HERE searches. Requested access date: Dec 3 06:00Z. Returned TfL journey:
Nov 27 11:01→12:19 Europe/London. This MUST NOT be joined to the coach.
The egress result is UNKNOWN because the old combined annotation was truncated
at 4096 characters by geometry. No repeat requests were made just for logging.
Future diagnostics now emit compact per-end results with requested timestamps
and retain the public synthetic report as a seven-day Actions artifact.

Source inspection establishes the date-loss path: ordinary London routing
bypassed initialization of departureAt/effectiveDepartureAt inside the
international/regional branch. The branch correction initializes and validates
these before branching, retaining the existing 60-day and quick-offset policy.
The regional path reuses those values rather than maintaining another copy.

Further interoperability fixes: shared TfL adapter converts offset-free London
wall times to canonical UTC instants. Ambiguous autumn or nonexistent spring
DST times remain null/unverified rather than guessing. The normalizer now
preserves arrivalPoint coordinates alongside legacy arrivalLatLon. Mixed
endpoint anchoring/compaction can also read legacy arrivalLatLon snapshots.

### Validation and explicit limits

PASS: npm run check; npm run test:mixed-orientation;
npm run test:transit-reported-failures (includes new endpoint-date test);
shared TfL reader, calendar, flight-ground connector; 11 Python tests.
New test exercises mixed-local → actual ordinary Worker → MOCKED TfL,
asserting selected future date/time, canonical instants/DST, both geographic
endpoints, and rejection when the provider supplies today's journey instead.
This is not a live verification of the corrected deployed backend.
A stale MOTIS source assertion was updated to include the already-existing
request cancellation signal; it does not authorize a new provider.

Full npm test is NOT green: after the mixed/provider tests it stops at the
unrelated accommodation assertion tests.mjs:27 (radius expected 5000, actual
2000). No hotel behavior changed in this stage.

No deploy, new APK, paid activation, HERE request, Oracle change or main merge.
Accepted APK501894 and live backend v187/f7ab634 remain unchanged.
Remaining work: production-suitable refreshed/indexed open-source timetable
integration with licence handling (not downloading/parsing the ZIP per mobile
request), confirm Oradea egress, verify both outer links against matching
backend source and exact scheduled joins, and investigate suspect TfL geometry
format separately. Do not present the current result as a complete journey.
