# Romanian urban planner (Oracle — not yet deployed)

Internal-only REST service for licensed, imported GTFS snapshots:
- GET /healthz
- POST /v1/plan, Authorization: Bearer <private service token>
- Body: {"region":"oradea","from":{"latitude":47.05,"longitude":21.92},"to":{"latitude":47.055,"longitude":21.92},"date":"2026-11-12","afterHHMM":"10:00"}

Always return **only** provider-originated timetable legs and mark walking
to/from stations as unverified until the existing pedestrian router checks them.

## Prerequisites
- Review commercial data reuse/attribution and freshness for each official feed.
- Unzip an authorized feed into a **private directory**; never include in GitHub.
- Import with `node ro_urban_gtfs_import.mjs <extracted-dir> <output-dir>/<region>.json`.
- `sudo install -d -o 10001 -g 10001 -m 0700 /home/ubuntu/pocketai-romania/feeds`;
  copy the private snapshot there and set owner `10001:10001`, mode `0400`.
- Create local `oracle-romania-transport/.env` (mode 0600), with a randomly
  generated `RO_GATEWAY_TOKEN` of at least 32 characters. Never commit it.
- Start `sudo docker compose up -d --build` from this directory only
  after the prerequisites are met.
- The host port is **127.0.0.1:8766**; do not open it in Oracle network lists.
- Cloudflare access requires a properly authenticated outbound tunnel/proxy
  with TLS and a separate token. It is not set up in this PR.
- Snapshot updates require refreshing the private JSON and restarting container.
  Do not serve stale schedules beyond the feed's calendar date.
- No public service, prices, guaranteed walk/transfer distances, or live updates.

Before pilots, enforce request quotas, protect the private tunnel, scan dependency
versions, load-test busy GTFS hubs, review UK/EU GDPR and disable logs containing
precise user coordinates. Server currently writes no request-body logs.
