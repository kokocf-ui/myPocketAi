# PocketAI Oracle Transport — Cloudflare Workers VPC (no custom domain)

## Why this architecture

Eva currently uses the Cloudflare Worker `lifewise-ai-api` and a
`workers.dev` frontend. **A purchased domain is not required** to connect
this Worker to the existing private Oracle services.

Cloudflare Workers VPC is in beta; during beta it is free for all Workers
plans (normal Worker request/compute charges still apply). We use one
Cloudflare Tunnel and **two tightly scoped VPC Services**, not public hostnames.

```text
Eva / lifewise-ai-api.kokocf.workers.dev
        |
        | VPC binding (private, no public DNS)
        |   RO_URBAN_VPC / EN_URBAN_VPC
        v
Cloudflare Workers VPC  ->  outbound Cloudflare Tunnel
                                   |
                     Oracle cloudflared connector
                        |                      |
          127.0.0.1:8766 (Romania)  127.0.0.1:8768 (England)
                         (Communicare 8765/8767 untouched)
```

The existing Oracle Bearer tokens remain mandatory in both clients as
application-level authentication. The Worker holds them as secrets; do NOT
publish token values in GitHub, screenshots, logs or messages.
The earlier public-hostname + Access approach is a supported fallback only
when a domain exists, but **is not required and is not our current plan**.

## Current state (2026-11-16)

- Oracle: `pocketai-romania-urban` healthy, private port 8766; verified
  București–Ilfov GTFS API: 4 itineraries, 1.01 seconds in the last live test.
- Oracle: `pocketai-england-local` healthy, port 8768; **no licensed English
  GTFS region imported yet**, so health is not evidence of route availability.
- Communication: containers use ports 8765/8767, untouched by this project.
- `cloudflared` 2026.11.0 installed on ARM64 Ubuntu.
- VPC Tunnel `pocketai-oracle-transit` reported **Healthy** in the user's Cloudflare dashboard.
- Both VPC Services are created in the dashboard; binding IDs are now staged in GitHub.
- **Not deployed to the production Eva Worker**; Oracle-to-Worker end-to-end calls remain unverified.
- No Android APK change or reinstall is required to configure this bridge.
There is no live end-to-end proof yet. England has no valid imported GTFS data.
The screenshot-based tunnel status does not by itself prove Worker authorization.

## Step 1 — Cloudflare dashboard: Workers VPC

1. Open <https://dash.cloudflare.com/> and choose the same account hosting
   `lifewise-ai-api`.
2. Go to **Workers VPC → Tunnels → Create**, and name the tunnel
   `pocketai-oracle-transit`.
3. Choose Linux ARM64 for the Oracle host. Copy the **connector token**
   privately. Do not paste the entire installation command into chats,
   GitHub, screenshots or scripts.
4. On Oracle, from the checked-out transport branch, run
   `bash oracle-transport-bridge/activate-private-tunnel.sh` **interactively**.
   The script requests the connector token without echoing it and saves
   it with restricted local filesystem permissions. It installs an isolated
   systemd unit called `pocketai-transit-tunnel.service`, leaving other
   services alone. Stop if an existing unrelated cloudflared unit is active.
5. Confirm the tunnel shows **Healthy** in Workers VPC.
   QUIC connectivity needs outbound UDP 7844; do **not** open incoming
   TCP 8766, 8768 or 7844.

## Step 2 — two VPC Services, no public hostnames

In **Workers VPC → VPC Services → Create**:

| Name | Tunnel | Type | Target host | HTTP port |
| ---- | ------ | ---- | ----------- | --------- |
| `pocketai-romania-private` | pocketai-oracle-transit | HTTP | `127.0.0.1` | `8766` |
| `pocketai-england-private` | pocketai-oracle-transit | HTTP | `127.0.0.1` | `8768` |

Do not enable other services or grant VPC-wide network access. VPC Services
are host/port scoped. Record only the generated service IDs, not any tokens.

## Step 3 — bind the TWO services to the EXISTING Worker

Extend `wrangler-backend.toml` (after filling in real Cloudflare service IDs):

```toml
[[vpc_services]]
binding = "RO_URBAN_VPC"
service_id = "<REAL_RO_SERVICE_ID>"
remote = true

[[vpc_services]]
binding = "EN_URBAN_VPC"
service_id = "<REAL_EN_SERVICE_ID>"
remote = true
```

The Service IDs below were supplied after their creation and are not secrets.
The two bindings are now staged **only on the feature branch**:

| Binding | VPC Service ID |
| --- | --- |
| `RO_URBAN_VPC` | `01a1e3e9-9c6b-7aa1-aefc-50a6824dbcd5` |
| `EN_URBAN_VPC` | `01a1e3ea-f6fa-7d11-8f85-21f267b1d833` |

Keep the `RO_URBAN_API_TOKEN` and `EN_URBAN_API_TOKEN`
Worker secrets. **Their existence and validity have not been verified**.
If they are missing, do not deploy until they are installed through secure
secret management; never paste their values into chat or GitHub.
To preserve Communication, do not discard the existing AI binding,
Durable Object binding or its SQLite migration.
Do not set `RO_URBAN_API_URL` or `EN_URBAN_API_URL` for the VPC path.
The adapter detects `env.RO_URBAN_VPC.fetch` / `env.EN_URBAN_VPC.fetch`,
uses `http://localhost/v1/plan` through that **private binding**, and
continues authenticating to Oracle with the existing Bearer token.
In the VPC service, the preconfigured host and port override the URL target.

The `workers.dev` hostname stays the frontend/backend public entrypoint.
The Oracle GTFS services are NOT made public. Do not deploy the Worker before
testing its bindings safely and preserving the existing Durable Object
communication configuration/migrations.

## Live VPC probe — successful (2026-11-16)

GitHub Actions run [43862259568](https://github.com/kokocf-ui/myPocketAi/actions/runs/43862259568)
ran a **local-only Wrangler preview with remote VPC bindings**. Results:

- Node tests **3 passed / 0 failed**.
- Romania `RO_URBAN_VPC` (service ID ending `bcd5`, port 8766):
  **HTTP 200**, matching `/healthz` country `RO`.
- England `EN_URBAN_VPC` (service ID ending `d833`, port 8768):
  **HTTP 200**, matching `/healthz` country `GB`.
- Both services rejected a deliberately invalid Bearer token with
  **HTTP 401**, so the authentication enforcement was verified.
- **No production deploy, no real journey planning, no Worker secret value
  verification and no APK change.**

Previous blockers and repairs: account automation token lacked
`Connectivity Directory Bind` (error 10196); service IDs were reversed in
GitHub; and the diagnostic code incorrectly used `redirect: "error"`,
which Workers VPC rejects with `TypeError`. Changing the isolated probe
to `redirect: "manual"` resolved the final runtime failure.

**Next before production:** validate actual production Worker secret matches
Oracle; ensure backend runtime uses the corrected VPC bindings; run a
real journey read-only probe; preserve communication Durable Object and
all existing frontend/backend routes. This success establishes reachability
and the failure-mode response only.

## Step 4 — validation / rollback

- Oracle `bash oracle-transport-bridge/preflight.sh`: both health endpoints
  must work locally without showing secrets.
- Cloudflare Workers VPC tunnel: Healthy.
- Worker → `RO_URBAN_VPC` authenticates internally and returns real
  scheduled routes (rather than inventing departure times).
- `EN_URBAN_VPC` can be bound but remains not ready for real timetables
  until a licensed English GTFS feed is imported and validated.
- Confirm Communicare's API, database and gateway are still healthy.
- To disable only this bridge:
  `sudo systemctl stop pocketai-transit-tunnel.service`.
  This does NOT stop the underlying Romanian/English API containers.

Workers VPC is beta and can change. Confirm the Workers VPC feature appears
in the account before proceeding.

## Official Cloudflare docs

- <https://developers.cloudflare.com/workers-vpc/get-started/>
- <https://developers.cloudflare.com/workers-vpc/configuration/vpc-services/>
- <https://developers.cloudflare.com/workers-vpc/api/>
- <https://developers.cloudflare.com/workers-vpc/platform/pricing/>
