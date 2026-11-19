# Eva ↔ Oracle Europa Slim: staged integration

Status: **code integration ready for tests; not deployed or enabled until Cloudflare connectivity is configured**.

## Current verified Oracle topology (17 Nov 2026)

- Romania 127.0.0.1:8766, local GTFS.
- Communication 127.0.0.1:8767; leave untouched.
- England 127.0.0.1:8768, local GTFS.
- Europa Slim 127.0.0.1:8770 (Node 22 Alpine, 192 MB cap).
- Europa Slim `/healthz` recently reported `configuredNationalProviders:2` and `configuredProviders:0`.
- National test found three sample journeys from England and three in Bucharest; no verified itinerary at a sample Oradea coordinate. This **does not** establish country-wide coverage.
- No additional GTFS database or country container is added by this Worker change.

## Required Cloudflare configuration

The backend code uses an **opt-in** authenticated network binding:

**Preferred:** Provision a **separate Cloudflare VPC Service** connected to the existing private Oracle tunnel, targeting loopback **8770**, then add a Wrangler binding named `EUROPE_SLIM_VPC` using its *real* service ID. Do not reuse the EN_URBAN_VPC service ID (it targets UK 8768). No service ID is guessed or committed.

**Alternative:** Expose a controlled HTTPS endpoint *through a secure Cloudflare Tunnel*, configured to forward to 127.0.0.1:8770, and set `EUROPE_SLIM_API_URL` to its HTTPS base URL with trailing slash. Do not open Oracle TCP 8770 to the internet. Authorization is always checked by the relay. Do not use Transitous's public service as a commercial upstream.

Set Cloudflare Worker **secret** `EUROPE_SLIM_API_TOKEN` to exactly the **`EU_RELAY_TOKEN`** stored privately in `/etc/pocketai-europe-slim.env` on Oracle. Never commit or paste this token into a chat, terminal screenshot, or issue.

When onboarding another country's real licensed national source, add its two-letter code to the optional `EUROPE_SLIM_NATIONAL_COUNTRIES` setting *only after the actual upstream is configured and tested*. Do not put all 49 registry codes here on day one.

Because the existing Cloudflare tunnel/VPC Service ID or external HTTPS hostname has not been supplied, **the connector cannot be activated remotely by this commit alone**. Do not claim an end-to-end live response from the Android APK yet.

## Code routing

- `national_public_transport`: verify GPS origin and destination countries first. If they differ, reject as international. For the same country, query `POST /v1/national-plan` on Europa Slim, with an offset-aware selected departure. Accept only dated, scheduled GTFS journeys; never invent boarding times or walking distances. When no verified result exists in RO/GB, keep the existing Bilo/GTFS/TfL/TransCAPI fallback. Other countries are opt-in only.
- `Deplasare spre… → Transport mixt`: if a licensed independent `MOTIS_API_BASE_URL` exists, preserve it. Otherwise, use the same Europa Slim binding for `GET /api/v6/plan`; the existing MOTIS itinerary parser, geographical checks, and selected departure remain in place. Since Oracle currently has zero MOTIS providers, no international itineraries will be produced until licensed sources are connected.
- `EUROPE_SLIM_VPC` takes precedence over the external HTTPS URL when connected. Failed authorization, missing provider, and unverified/partial responses return no invented itinerary.
- This change does **not** modify the Oracle containers, database volumes, phone APK, UI route rendering, user profile, or port allocations.

## Validation

Run on a Node.js 22 checkout:

```bash
node --check backend.js
node --check europe_slim_client.mjs
node --test tests_europe_slim_client.mjs
node tests_national_public_transport.mjs
node tests_motis_mixed_schedule.mjs
node tests_mixed_international_regression.mjs
```

After provisioning a private Cloudflare binding, repeat the two controlled national examples (England, Bucharest), verify the no-data result remains truthful for unsupported regions, then perform international mixed tests only after a licensed source is enabled. Never print the EU token in the health checks or logs.
