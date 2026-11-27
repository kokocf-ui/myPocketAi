# Official open surface timetable — branch integration

## Scope and activation boundary

`open_surface_timetable.mjs` searches a precompiled, public FlixBus/FlixTrain
European GTFS index. `mixed_open_surface.mjs` independently requests ordinary
local transport at both exact source stops, using `createMixedLocalPlanner` via
the existing mixed pipeline. No airport or flight result is a prerequisite.
Unverified first/last mile does **not** suppress the actual dated source legs.
The unified results screen shows theoretical schedules, source stops and
explicit missing connections. A complete option enters the existing transport
details/map selector only after both dated, coordinate-anchored local links and
the normal verified-mixed chronology/geography checks pass.

This code is wired into `searchMixedIndicativeOptions` but defaults OFF. It is
not an announcement of live application coverage or a new deployment. No new
server, Oracle storage, paid API, ticket availability or protected connection
is implied. Accepted APK501894/live backend are unchanged.

## Offline preparation, no ZIP download during routing

1. Download the official source outside Git using the existing bounded
   `scripts/inspect_open_surface_gtfs.py:download` helper.
2. Compile with:

   ```sh
   python3 scripts/build_open_surface_index.py --file /path/to/official.zip --output .open-surface-assets/index.json
   ```

3. The compiler excludes shapes, deduplicates identical service calendars,
   preserves source trip/route/stop IDs, pickup/dropoff, exceptions and GTFS
   >24h times, and rejects malformed trips as a whole. It currently supports
   **only agency timezone UTC**, as declared by this official feed; it rejects
   other feed timezones rather than importing Romanian or phone-local rules.
4. Index is capped at 20 MiB. Runtime validates schema, coordinates, references,
   calls and ordering once per asset binding/isolate. Stale (>7-day-old) builds,
   queries outside feed validity or beyond the current 60-day policy are refused.
   A warm isolate rechecks freshness. No user route/GPS is cached in this index.
5. Bounded search: nearest six source stops within 80 km of origin / 40 km of
   destination, three rides / 72 hours, 45-minute exact-source-ID transfers,
   at most two candidate enrichments, two access samples + one egress query each,
   within the shared twelve-local-query budget and cancellable eighteen seconds.
   Results are not exhaustive. Empty results never prove that no service exists.

## Configuration after explicit deployment/licence readiness

No runtime binding or feature flag has been activated by this change. When
release is separately approved and actual Worker resource tests pass, the same
backend Worker can use free static assets, **not a new paid routing service**:

```toml
# Add to the existing backend config only at the approved activation stage:
[assets]
directory = "./.open-surface-assets"
binding = "OPEN_SURFACE_ASSETS"
run_worker_first = true
html_handling = "none"
# OPEN_SURFACE_ENABLED = "true" belongs under [vars], not [assets].
```

The flag alone never downloads a missing index. An absent binding/index remains
`index_not_configured`/`index_unavailable`, with no external search fallback.
`GET /api/open-surface/index.json` exposes the same public derivative index when
explicitly enabled; no private payload or authentication is copied into it.
A refreshed asset requires an approved asset deployment, not a silent scheduled
production job. Expiry fails closed if no refresh happens.

## Licence / redistribution before activation

Source archive: https://gtfs.gis.flix.tech/gtfs_generic_eu.zip
Publisher: https://transport.data.gouv.fr/datasets/flixbus-horaires-theoriques-du-reseau-europeen-1
Licence conditions: https://doc.transport.data.gouv.fr/le-point-d-acces-national/cadre-juridique/conditions-dutilisation-des-donnees/licence-odbl

Source metadata and visible attribution are retained. ODbL 1.0 and the PAN
particular conditions apply, including applicable derivative-database access,
attribution/share-alike and PAN/original-format republication requirements.
The JSON access endpoint alone is **not** a declaration that every PAN
redistribution condition has been fulfilled. Before public activation, settle
publication of the qualifying derivative in the required original format and
PAN registration. Neither raw nor compiled source data is committed to Git.

## Verification

- `node tests_open_surface_runtime.mjs`: real Python compiler → JS runtime,
  mocked providers; validates calendars, exceptions, >24h, source ID joins,
  bounded/fresh asset loading, wrong-date refusal and local-link composition.
- `tests_mixed_unified_results.mjs`: source timetable details and explicit gaps.
- `tests_mixed_indicative_browser.mjs`: real compiled frontend on 360/393/430 px,
  partial source details/stops, Back, complete source option to existing details,
  with no extra network lookup on selection.
- `.github/workflows/open-surface-runtime.yml`: manual actual-source compile,
  runtime resource diagnostic, optional public TfL in branch Worker and one
  ordinary deployed Oradea egress query. No Cloudflare secret reads/deploy,
  flight, HERE, Exa or Brave calls. Artifacts expire after seven days.

Actual-source runtime and local results are recorded below after the manual
workflow finishes. Model/browser tests are not live local coverage evidence.
