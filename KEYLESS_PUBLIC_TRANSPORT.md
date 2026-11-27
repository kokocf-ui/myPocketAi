# Keyless public transport — implemented, not activated

User request: “Implementăm ce avem deocamdată”. Review date: 2026-11-26.

## What is implemented

- **Norway / Entur**: existing national multimodal adapter retained. Identification is now lowercase as required by Entur's documented client-header convention, and returned journeys include Entur/NLOD attribution. No secret API key is used by this adapter. It still requires explicit activation, terms review and a real `ET-Client-Name`; partner/ticketing APIs are not included.
- **Belgium / iRail**: new `irail_national_transit.mjs`, country registry/policy/actual Worker dispatch, bounded JSON, explicit application identity and mandatory shared rate admission. Only Belgian rail station-to-station service; no nationwide urban claim. Direct trains and sourced same-station transfers (at least two minutes) are normalized. Walking vias are refused rather than converted to fictitious navigation. Both passenger endpoints must be within 150 metres straight-line of returned stations. All returned intermediate stops/endpoints undergo the existing independent domestic-country verification. Delays/cancellations are validated; delay-adjusted timestamps do not become a blanket realtime guarantee. No fare, seats, geometry, walking access or protected transfer is invented.
- **Six static GTFS sources**: shared catalog, offline ZIP compiler, prepared-asset loader, direct scheduled-ride planner and Worker dispatch for Germany, France, Ireland, Luxembourg, Czechia/PID and Switzerland. These are real code paths tested with synthetic feeds, **not downloaded/validated current production feeds**.

The new static sources are intercity/public-transport candidates, not automatic urban, airport or cross-border providers. This conservative registry placement does not mean their underlying feeds never contain urban services. Existing RO/GB, HERE, Germany MOTIS and Digitransit adapters/activation are not replaced. Selection happens once: failure/quota never causes a paid or country-inappropriate fallback.

## Source-specific access and coverage

| ID | Source/documentation | Limits of this integration |
|---|---|---|
| `entur_national_transit` | https://developer.entur.no/docs/open-services/journey-planner | Open journey API, required client identity, NLOD/privacy obligations; not partner APIs |
| `irail_national_transit` | https://docs.irail.be/ | Community Belgian rail API, no secret key; recommended User-Agent, 3 req/s/source IP plus documented burst; commercial reuse/licence review remains required |
| `public_gtfs_de` | https://gtfs.de/en/feeds/ | Free 30-day GTFS products, CC BY 4.0; separate from DELFI registration and paid extended products |
| `public_gtfs_fr` | https://transport.data.gouv.fr/datasets/horaires-sncf | SNCF TGV/Intercités/TER static schedules, not all French city networks; regional feeds preferred where applicable; source-specific reuse review |
| `public_gtfs_ie` | https://data.gov.ie/dataset/nta-gtfs | Public static operator files, CC BY 4.0; NTA realtime requires a key |
| `public_gtfs_lu` | https://data.public.lu/en/datasets/horaires-et-arrets-des-transport-publics-gtfs/ | ATP static GTFS, CC BY 4.0; mobiliteit.lu API separately requires a key |
| `public_gtfs_cz` | https://pid.cz/o-systemu/opendata/ | Prague and PID region only, CC BY 4.0 preview; not national Czech coverage and not Golemio realtime access |
| `public_gtfs_ch` | https://data.opentransportdata.swiss/en/dataset/timetable-2026-gtfs2020 | Public static timetable download; platform/dataset attribution and redistribution review; not authenticated realtime APIs |

Only selected sources have been audited. This is not an assertion that these are the only keyless European datasets. A public download URL is not a commercial-use approval, realtime entitlement or proof of complete country coverage. Geocoding remains the existing independently configured service.

## Offline static import

`keyless_gtfs_sources.json` is shared between Python tooling and the JS runtime, avoiding independent source-ID/licence/scope lists. The compiler reads an already-downloaded ZIP; it makes **zero network requests**, does not extract archive paths and never runs during a passenger request.

Example after manually reviewing the PID source licence, attribution, update and redistribution requirements and downloading the actual ZIP from the published official URL:

```sh
npm run build:keyless-gtfs -- \
  --source public_gtfs_cz \
  --file .keyless-gtfs-downloads/PID_GTFS.zip \
  --download-url https://data.pid.cz/PID_GTFS.zip \
  --start 2026-12-03 --days 3 \
  --terms-reviewed
```

This command is a usage example, not a record of a completed download or terms approval. `.keyless-gtfs-downloads/` and `.keyless-gtfs-assets/` are ignored. Output is `.keyless-gtfs-assets/public_gtfs_cz.json`. Keep source ZIPs and generated snapshots out of Git.

For large feeds, use repeatable `--agency-id` / `--route-id` values taken from the actual source tables to select a smaller operator/route set. Entire trips and **all intermediate stops, including foreign stops**, are retained; no geographic clipping to evade domestic validation. Unknown selections fail. A national Swiss/German/SNCF feed can exceed the small runtime budgets: the compiler rejects it rather than silently claiming complete coverage.

Compiler behavior:

- 2–7 local service dates, calendars plus add/remove exceptions; short-window scheduled instances compiled to dated UTC services.
- Agency timezone is respected using GTFS **local noon minus twelve elapsed hours** semantics; DST transitions and times above 24:00 are tested. Unsupported mixed agency timezones fail closed.
- Unknown modes are not relabelled as bus/train. Incomplete, non-monotonic or malformed trips are rejected, not shortened around a bad call. Ordinary pickup/dropoff restrictions survive compilation. On-demand/continuous service and frequency tables are not fabricated as walk-up scheduled service.
- No interpolation, frequency expansion, fares, shapes, walking paths, transfer graph or realtime ingestion.
- Input: ZIP <=100MiB, total declared expanded archive <=512MiB, duplicate ZIP members rejected, existing per-table limits apply. Output: <=5MiB, <=10,000 stops/routes/trips, <=100,000 stop calls. Larger selections must be reduced explicitly.
- Download origin is recorded and restricted to the source's approved HTTPS host without embedded credentials/query keys. ZIP SHA-256 is recorded. This records provenance supplied by the operator of the importer; it is not cryptographic publisher authenticity verification.

## Inactive runtime configuration contract

No production configuration was added/changed in this step.

### Entur

Existing gates: literal `ENTUR_NATIONAL_ENABLED=true`, `ENTUR_TERMS_REVIEWED=true`, and real lowercase `ENTUR_CLIENT_NAME` identifying company/application. Do not treat a sample client name as provider registration or owner consent. Deployment/user-facing privacy notice still needs review.

### iRail

All are required:

- literal `IRAIL_NATIONAL_ENABLED=true` and `IRAIL_TERMS_REVIEWED=true`;
- `IRAIL_USER_AGENT`: real identifiable application/version/contact, no CR/LF;
- `IRAIL_RATE_LIMITER.limit({key:'irail-public-service'}) -> {success:boolean}`: deployment-wide conservative admission for every outbound iRail HTTP request, including station lookup. The binding must be provided and quota-reviewed before activation; **this step does not provision a limiter or new infrastructure**. Configure safely below the published service quota, taking account of shared egress/IP traffic. A module-local counter is not a substitute.

Requests use pinned `https://api.irail.be/v1/` paths, Belgian-local `ddmmyy`/`hhmm` derived from the requested absolute departure, identified User-Agent, no redirects/retries. Fetch cache hints: stations 24h, connections 30s; cache support depends on the runtime and does not replace rate admission. Missing limiter, limiter failure, 429, denied access, timeout, malformed and oversized responses return explicit failure with no fallback.

### Prepared static assets

All are required:

- literal `PUBLIC_GTFS_ENABLED=true`;
- `PUBLIC_GTFS_REVIEWED_SOURCES`: comma-separated **source IDs** explicitly reviewed for the intended product;
- callable `PUBLIC_GTFS_ASSETS.fetch`, serving `/<source-id>.json` from separately prepared assets.

The loader validates the source identity, expected licence/scope, original timezone, source hash, UTC schema, maximum size/row counts, generation freshness (<=7 days) and exact compiled coverage window. It caches only one small source per asset binding/isolate; concurrent loads for another source return busy rather than retaining six large national indexes. Failed loads can recover after 60 seconds. Registry/metadata reads do not load assets or call transport providers.

First runtime version: **direct rides only**, 24h search horizon wholly inside the compiled window, <=150m straight-line endpoint-to-stop proximity, <=100ms planner wall budget. This is not verified walking or door-to-door navigation. The static metadata remains `configured_pending_feed_validation` until a request actually validates a loaded feed. Every returned stop is reverse-country-checked with the existing shared limit (36 distinct checks); longer/unverified/foreign-stop journeys are rejected. Results expose scope, static/no-realtime, attribution, unknown fare/seats and missing geometry/access. No different date is silently substituted.

All resource limits above are guards, **not proof of Cloudflare free CPU/memory acceptance**. Actual-source resource profiling, operational refresh/distribution, licence review, relevant route and backend-matching checks are still release gates. No paid plan/server is authorized as a workaround.

## Verification performed

- `npm run test:keyless-transport`: 9 Python compiler/CLI tests; 6 iRail tests; 5 prepared-index tests; 3 actual Worker dispatch tests — **PASS**, synthetic/local provider responses only.
- `npm run test:national-transport`: **PASS**, including existing HERE/DE/Digitransit/Entur/RO/GB/country guards.
- `npm run test:mixed-orientation`: **PASS**, including unchanged Flix runtime default source/mode contract and mixed regressions.
- `npm run check`, frontend boot syntax, `git diff --check`: **PASS**.
- Wrangler backend `--dry-run --outdir .bundle-check/keyless-backend-dry`: **PASS**; existing config has none of the new keyless activation flags/assets/limiter. This was not a deployment.
- Full `npm test` was not rerun; the pre-existing unrelated hotel-radius assertion remains recorded in AGENTS.md. Targeted passing suites are not a claim that the whole repository suite is green.

No live transport probe, actual new GTFS download, end-to-end phone test, source activation, production deploy, APK, paid provider call, new infrastructure or main merge in this step. Existing accepted APK/backend remain unchanged.
