# Romanian local transport planner (private Oracle service)

Internal-only REST service for licensed, imported GTFS snapshots. This document
is the repository contract, **not evidence of the currently deployed version or
of live feed coverage**. The 2026-11-26 national-dispatch change is not deployed.

- `GET /healthz`: liveness only, no feed inventory or coordinates.
- `POST /v1/plan`, `Authorization: Bearer <private service token>`.
- Automatic local planning body (coordinates only, no county selector):
  `{"region":"romania","from":{"latitude":45.75,"longitude":21.23},"to":{"latitude":45.78,"longitude":21.25},"date":"2026-11-27","afterHHMM":"10:00"}`.

## Feed slots and automatic dispatch

`regional_gtfs_registry.mjs` defines 42 county/Bucharest slots (`ro-ab.json`,
`ro-tm.json`, etc.), the four backward-compatible city filenames
(`oradea.json`, `bucharest.json`, `cluj.json`, `iasi.json`), and an optional
`romania.json` aggregate: 47 recognized filenames in total. They are deployment
slots, **not a claim that any feed has been obtained, imported or activated**.
Only these fixed filenames are read; the request never supplies a file path.

For `region: "romania"`, the server selects only imported feeds containing
actual stops near **both** endpoints (default 700 m straight-line proximity,
request bounded to 150–1200 m). It plans separately within each selected feed,
deduplicates and ranks results, and preserves a sourced bus-only alternative
when multiple results are requested. It never joins different feeds by stop
name, stop ID or county boundary. Licensed cross-feed connection data and a
separate verified transfer graph would be needed for that later feature.
Explicit legacy/county region requests remain accepted for compatibility.

The Worker verifies GPS and destination countries separately before national
planning. Country bounds are only a coarse dispatch guard, never evidence of
nationality, feed coverage or pedestrian access. New local areas outside the
legacy city radii are dispatched for journeys up to 18 km; longer domestic
journeys retain the separate Bilo intercity path. This does not yet solve all
rural/regional journeys or complete urban/intercity first/last-mile transfers.

Returns only sourced timetable legs. When only line topology is documented,
the result is explicitly `route_only`, without invented departures or confirmed
service today. Walking to/from stops remains unverified until the pedestrian
router checks it. Empty coverage never proves that transport does not exist.

## Prerequisites for a separately authorized rollout

- Review commercial data reuse, attribution, geographic/service coverage and
  freshness for **each** official feed. No new source rights are implied here.
- Unzip an authorized feed into a **private directory**; never include it in Git.
- Import with `node ro_urban_gtfs_import.mjs <extracted-dir> <output-dir>/<region>.json`.
- Total loaded JSON is capped at **150 MiB across all files**, not per region,
  to limit parsed-memory growth in the 1 GiB container. Actual peak memory and
  busy-hub response time still require testing against the intended feeds.
  Oversized, over-budget, missing and malformed files are skipped. Split or
  otherwise prepare authorized snapshots if needed; do not raise memory limits
  blindly. Loading order is the explicit registry order, then the aggregate.
- `sudo install -d -o 10001 -g 10001 -m 0700 /home/ubuntu/pocketai-romania/feeds`;
  copy private snapshots there with owner `10001:10001`, mode `0400`.
- Provision `oracle-romania-transport/.env` privately (mode 0600), with a random
  `RO_GATEWAY_TOKEN` of at least 32 characters. Never commit it.
- Rebuild/start the service only with explicit rollout authorization, using
  `sudo docker compose up -d --build` in this directory after prerequisites.
- Host port remains **127.0.0.1:8766**. Never expose it through Oracle ingress.
- Cloudflare access requires the authenticated private VPC/tunnel arrangement
  or a separately secured HTTPS proxy, plus the service bearer token. No remote
  configuration or credential was changed during this stage.
- Updates require refreshing private JSON and restarting the service. Verify
  source calendar validity; no live vehicle tracking or guaranteed prices.

The Dockerfile includes the complete local module dependency closure; tests
check it without building or operating a remote container. Before pilots:
request quotas, private tunnel checks, dependency scanning, real-feed load tests,
and GDPR review. The server writes no request-body logs.

## Local verification (synthetic data; no publication)

- `npm run test:national-transport`
- `npm run test:national-transport:browser` with a configured Chromium path.

These tests do not establish live transport availability in any locality.
