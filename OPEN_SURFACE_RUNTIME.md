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
- `.github/workflows/mixed-live-diagnostic.yml (prove_surface_runtime=true)`: manual actual-source compile,
  runtime resource diagnostic, optional public TfL in branch Worker and one
  ordinary deployed Oradea egress query, plus at most one existing standalone
  pedestrian request if its timetable is missing. No Cloudflare secret reads/deploy,
  flight, HERE, Exa or Brave calls. Artifacts expire after seven days.

Actual-source runtime and local results are recorded below after the manual
workflow finishes. Model/browser tests are not live local coverage evidence.


## Actual-source runtime proof 45991226188 / check 140479263073

SUCCESS using branch 1a0aa68. Actual compiled index: 8,632,964 bytes; 2072 stops,
1224 routes, 2602 deduplicated calendars, 41327 valid trips (six malformed
source trips excluded). Source SHA256:
`63d76c6a7f919066088380dc5141d2fa00b36b11161720ce61f087289ff5f74e`.
Node read+validate+search 287 ms, search 103 ms, heap 72.1 MiB, process RSS
169.5 MiB. **These are Node diagnostics, NOT Worker CPU/memory acceptance.**
The free Worker budget has not been demonstrated: do not activate this full
index on production or upgrade a paid tier to hide a resource failure.

Public TfL via actual branch Worker: access Dec 3 06:22→07:46 UTC, before
Victoria boarding 08:30 UTC. Two ordinary access samples, six TfL HTTP requests.
Exactly one ordinary deployed Romanian request: HTTP200,
`ro_urban_feed_unavailable`, provider `Romania GTFS static`, region `oradea`,
`feed_not_loaded`. Thus egress is now KNOWN unavailable from that timetable,
not the earlier unknown/truncated annotation. No full journey was claimed.

### Subsequent walking/geometry correction under verification

For short gaps <=4 km geodesic only, the local dispatcher can explicitly opt
into existing standalone pedestrian routing when ordinary transit has no
usable schedule. That additional dispatch shares the same twelve-call cap;
geometry is reused between dated samples in the same request. No alternate
provider is tried after reported quota/access failure. The adapter requires
real provider coordinates, matching start/end within 75 m, positive provider
duration/distance and plausible speed. An unverified nearby approach, missing
geometry/time or wrong endpoint stays incomplete. Walking duration is marked
`timingEstimated`, not a scheduled vehicle departure.

TfL's path.lineString JSON [lat,lon] was previously passed through the encoded
polyline decoder, explaining the observed near-zero map coordinates. A shared
geometry adapter now parses JSON, reverses to map [lon,lat], supports genuine
encoded paths, and checks geometry against the leg's actual endpoint evidence.
No endpoint lines are fabricated. The full source-composed journey preserves
returned local geometry/steps and the estimate flag for pedestrian legs.
Actual-source+walking/geometry proof result is pending the next manual run.
