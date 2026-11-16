# England: opt-in local GTFS planning on Oracle (not deployed)

This uses the same private Node.js GTFS planner as Romania, with UK/Europe-London
dates and an independent local container. It supplements existing TfL and
TransCAPI, does not replace their train/intercity services, and does not
claim live tracking. `en_urban_client.mjs` is called only when
`EN_URBAN_API_URL` (HTTPS) and `EN_URBAN_API_TOKEN` (long-lived secret
32+ chars) are configured in the Cloudflare Worker.

## Source and licensing
England's Department for Transport Bus Open Data Service (BODS) publishes
operator schedules and an aggregated national/regional GTFS dataset:
https://www.gov.uk/guidance/find-and-use-bus-open-data
https://data.bus-data.dft.gov.uk/

Government guidance permits commercial uses, subject to the actual
dataset's attribution and terms. Confirm the exact current licence, provider
attribution, update cadence and date range before importing.

**No feed is auto-downloaded in this repository.** The initial deployment
does not contain source data. The following slots are reserved for independent
operator-approved snapshots:
`en-ea`, `en-em`, `en-ne`, `en-nw`, `en-se`, `en-sw`, `en-wm`,
`en-yorkshire`, `en-london`, or a bounded `england.json`.
These slots DO NOT certify a timetable for a given region.

## Setup, on the existing Oracle VM
1. Check that `127.0.0.1:8767` is free and there is spare disk and RAM.
   Do not touch the existing communications services.
2. Prepare private feed storage:

   ```sh
   sudo install -d -o 10001 -g 10001 -m 0700 /home/ubuntu/pocketai-england/feeds
   ```

3. Obtain a licensed current regional GTFS ZIP, unzip privately and import
   the **per-region** file from your repository root, for example:

   ```sh
   cd /home/ubuntu/pocketai-oracle-src
   node ro_urban_gtfs_import.mjs /data/gtfs-unpacked /home/ubuntu/pocketai-england/feeds/en-wm.json
   node oracle-romania-transport/build-index.mjs GB en-wm /home/ubuntu/pocketai-england/feeds
   ```

   Imported files should be readable by UID 10001 (owned 10001:10001,
   mode 0400/0600). Set correct permissions without exposing them publicly.
   Importer refuses to overwrite snapshots. Replacing a feed requires
   explicit preparation followed by `build-index.mjs ... --replace`.

4. In `oracle-england-transport/.env` (mode 0600, NEVER GitHub), set a
   separately generated `RO_GATEWAY_TOKEN` with at least 32 random characters.
   This environment-variable name is reused by the shared gateway
   implementation but must be different from Romania's token.

5. From `oracle-england-transport/` verify `docker compose config --quiet`,
   then start `docker compose up -d --build`. Host port 8767 is bound to
   loopback only; never open it in Oracle network security rules.
6. Verify `curl -fsS http://127.0.0.1:8767/healthz`. This health check does
   not prove the existence of real, current scheduled services.
7. Only after a live, authenticated HTTPS reverse tunnel/proxy is configured,
   create separate Cloudflare secrets `EN_URBAN_API_URL` and
   `EN_URBAN_API_TOKEN`. Do not paste either token into GitHub, a browser
   console or a conversation.

## Scope and limitations
The planner currently supports individual GTFS feeds whose imported JSON
is smaller than 110 MB; larger national feeds require regional splitting
or a database-backed planner on a suitably sized server. For cross-region
or rail journeys, existing permitted providers must be consulted. Two feeds
cannot be automatically joined into one validated through-route yet.
Only GTFS departures actually present in an accepted, current snapshot are
returned; first/last mile walking is verified separately. Source rights,
security, quotas, performance, crossing-specific transfer feasibility and
real on-device tests remain prerequisites for a public release.
