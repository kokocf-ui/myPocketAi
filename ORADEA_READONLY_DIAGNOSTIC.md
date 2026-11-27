# Oradea — read-only source/service diagnostic

User approved continuing the Oradea diagnosis before changing production.
Review date: 2026-11-26. Hosted runner timestamps are preserved in the linked
runs; no inference about a new backend/APK release is made from these probes.

## Verified evidence

1. Initial run: https://github.com/kokocf-ui/myPocketAi/actions/runs/46000807025
   — source `381b442`, job/check `140511665049`, **diagnostic completed**.
2. Legacy dispatch control: https://github.com/kokocf-ui/myPocketAi/actions/runs/46001120517
   — source `df84bbd`, job/check `140512720538`, **diagnostic completed**.

In both runs the other `live-mixed` job was **SKIPPED**. The isolated diagnostic
job has read-only repository permissions, no secret bindings, no deployment,
no flight/web-search task, no private infrastructure operation or feed import.
Workflow success means the diagnostic completed, **not that transport works**.

### Public source

Single download inspected in memory (not saved/imported/distributed):
`https://external.gtfs.ro/oradea/ORADEA.zip`.

- HTTP **200**, Content-Type `application/zip`, **676,657 bytes**.
- Last-Modified: **Sun, 22 Nov 2026 06:17:52 GMT**.
- SHA-256: `57721d7640cbc0d60f0711d96e75bb68ee4c1d5aac94f6c660e9ae73f4cb2a68`.
- Agency timezone: **Europe/Bucharest**.
- **555 stops / 60 routes / 6,365 trips**.
- Three `calendar.txt` rows; zero `calendar_dates.txt` exceptions.
- Calendar minimum start **2026-11-25**, maximum end **2027-02-20**.
- One active calendar service ID on each requested local date (Dec 3 and Dec 5).
- `feed_info` version **3.47**, no feed_start_date/feed_end_date values.
- `attributions.txt` exists. Commercial reuse/attribution/refresh/distribution
  review remains **unresolved**. Diagnostic inspection is not reuse approval.

The public landing page at https://external.gtfs.ro/oradea/ displays a recent
build but an old-looking validator date range and warnings. The calendar facts
above come from the downloaded ZIP, not the landing-page validator. This step
did not validate every stop_time, line, physical transfer, exact endpoint pair
or schedule against the operator. Active service IDs do not prove an itinerary.

### Existing application's local responses

Public synthetic points only: `(47.043244,21.95854)` to
`(47.0612,21.9473)`. These are diagnostic endpoints, not the user's location.
Same explicit local request contract, `module=maps`, empty history,
`mixed_journey=false`, `mixed_composition=false`, `national_public_transport=false`.
No network-wide or flight search was requested. No standalone walking query.

| Case | Requested Bucharest-local departure | Reported region | Application HTTP | Reported reason / urban status | Scheduled journeys |
|---|---|---|---|---|---|
| Daytime, RO hints | 2026-12-03 10:00 +02:00 | `romania` | 200 | `ro_urban_feed_unavailable` / `feed_not_loaded` | 0 |
| Previous nighttime case, RO hints | 2026-12-05 02:05 +02:00 | `romania` | 200 | same | 0 |
| Daytime legacy control, no country hints | 2026-12-03 10:00 +02:00 | `oradea` | 200 | same | 0 |

All report provider **Romania GTFS static**, no route-only lines. The control
used exactly the same coordinates/date as daytime; only country hints were
removed. It made **one additional request**, without repeating the download or
the first two requests. Total: **one ZIP inspection, three local requests**.

## What this establishes — and what it does not

- The candidate public source is reachable and its calendar covers the dates.
  An absent public feed or a test solely at night is not a sufficient explanation.
- Failure is not isolated to automatic `romania` dispatch: the legacy `oradea`
  request also fails. This does not rule out a deeper private-service version issue.
- No itinerary reaches the caller. In the repository dispatcher, missing feeds
  are rejected before the timetable search, independent of the requested time.
- **The exact private cause is still not proven.** `ro_urban_client.mjs` currently
  maps **any HTTP 503** to `feed_not_loaded`, without examining the response body.
  Thus a tunnel/gateway/service outage can be mislabeled as a missing GTFS file.
  This was reproduced locally with two synthetic 503 responses: an explicit
  `{"status":"feed_not_loaded"}` JSON and a generic plain-text service outage
  both normalize to `feed_not_loaded`. No runtime code was changed to hide this.
- `/healthz` is liveness only and returns OK even with zero loaded feeds. A green
  container healthcheck does not establish GTFS readiness.
- The server loads recognized JSON snapshots **once at startup** from
  `RO_GTFS_DATA_DIR` (default `/data/feeds`). The compose contract mounts
  `/home/ubuntu/pocketai-romania/feeds:/data/feeds:ro`. It does not download or
  refresh the public ZIP automatically. There is no evidence here of the actual
  current files, file permissions, import result or private process version.

**Correct conclusion:** a public source exists, but the deployed local path is
not returning an available timetable. Do not yet call this a confirmed absent
`oradea.json`, broken routing algorithm, licence approval or nationwide failure.

## Next private check — not executed by this session

The public API exposes neither the mounted file inventory nor the raw private
503. Those require an already-authorized shell on the existing server; this
session has not accessed that volume. Do not request/send SSH passwords, tokens
or private environment files in chat. Do not rebuild, restart, copy a feed,
change permissions/mounts, publish a port or deploy merely to obtain diagnostics.

The following optional command is **read-only**, to be run on that server using
its existing access. It prints only file metadata, token-presence boolean and
whitelisted local-service statuses. The bearer token stays inside the container
process and is never printed. It is a proposed next check, not an executed log.

```sh
sudo docker exec -i pocketai-romania-urban node --input-type=module <<'JS'
import {statSync,accessSync,constants} from 'node:fs';
import {join} from 'node:path';
const dir=process.env.RO_GTFS_DATA_DIR||'/data/feeds';
for(const name of ['oradea.json','ro-bh.json','romania.json']){
  try{
    const path=join(dir,name),s=statSync(path);accessSync(path,constants.R_OK);
    console.log(JSON.stringify({file:name,readable:true,isFile:s.isFile(),bytes:s.size,uid:s.uid,gid:s.gid,mode:(s.mode&0o777).toString(8)}));
  }catch(e){console.log(JSON.stringify({file:name,errorCode:e.code||'unknown'}));}
}
const token=process.env.RO_GATEWAY_TOKEN||'';
console.log(JSON.stringify({gatewayTokenConfigured:token.length>=32}));
const base='http://127.0.0.1:3000';
for(const region of ['health','oradea','romania']){
  if(region!=='health'&&token.length<32)continue;
  try{
    const options={signal:AbortSignal.timeout(7000)};
    if(region!=='health')Object.assign(options,{method:'POST',
      headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
      body:JSON.stringify({region,from:{latitude:47.043244,longitude:21.95854},to:{latitude:47.0612,longitude:21.9473},date:'2026-12-03',afterHHMM:'10:00',maxResults:1})});
    const r=await fetch(base+(region==='health'?'/healthz':'/v1/plan'),options);
    let data={};try{data=await r.json();}catch{}
    console.log(JSON.stringify({region,http:r.status,contentType:r.headers.get('content-type'),
      status:['ok','success','feed_not_loaded','route_only','no_service_on_date','no_verified_itinerary','no_nearby_gtfs_stop'].includes(data.status)?data.status:null,
      error:['unauthorized','unsupported_region','invalid_request','invalid_coordinates','unsupported_media_type','request_too_large'].includes(data.error)?data.error:null,
      journeyCount:Array.isArray(data.journeys)?data.journeys.length:null}));
  }catch(e){console.log(JSON.stringify({region,errorType:e.name}));}
}
JS
```

Interpretation:

- Readable files + local successful route, public unavailable: investigate the
  private VPC/tunnel/upstream target before reimporting or replacing data.
- File absent/unreadable: inspect the existing mount/import/permissions. Any
  correction/reload is a separate operational change, not done automatically.
- File readable + local `feed_not_loaded`: inspect source schema/import validity,
  server version, load budget and startup logs (without exposing secrets). The
  loader skips missing/malformed/over-budget snapshots; a later file copy alone
  does not reload the already-running process.
- Local `no_service_on_date` / `no_verified_itinerary` differs from feed loading:
  then investigate actual calendar, stops, schedule and the chosen route/time.
- Local connection failure/generic 503: service availability, not proof of absent
  source data. Health OK by itself remains insufficient.

## Reproducibility / tests

- `python3 tests_oradea_readonly_diagnostic.py`: **7 offline safety tests PASS**.
- `node --test tests_ro_urban_client.mjs tests_ro_urban_server.mjs`: **11 existing client/server contract tests PASS**, synthetic data only.
- Proposed private audit JavaScript: `node --check` **PASS**, syntax only; not executed against any service.
- `git diff --check`: **PASS**.
- Default `python3 scripts/diagnose_oradea_readonly.py` makes zero network calls.
- Full initial probe: manual workflow input `probe_oradea_readonly=true`.
- One legacy control only: additionally `oradea_legacy_control_only=true`.
- Ignored local annotations: `.bundle-check/oradea-readonly-annotations.json`
  and `.bundle-check/oradea-legacy-control-annotations.json`; aggregate artifacts
  on Actions retained 7 days. No raw GTFS ZIP/tables committed or uploaded.

No production code/config/feed change, deploy, APK, paid transport/search call,
new infrastructure, private server restart or main merge in this stage.
