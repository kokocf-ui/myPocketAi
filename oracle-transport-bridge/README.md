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
- `cloudflared` 2026.11.0 installed on ARM64 Ubuntu, **not connected**.
- VPC tunnel / services / Worker bindings are not yet configured.
- No Android APK change or reinstall is required to configure this bridge.

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

No static service IDs should be committed before they are created. Keep the
existing `RO_URBAN_API_TOKEN` and `EN_URBAN_API_TOKEN` Worker secrets.
Do not set `RO_URBAN_API_URL` or `EN_URBAN_API_URL` for the VPC path.
The adapter detects `env.RO_URBAN_VPC.fetch` / `env.EN_URBAN_VPC.fetch`,
uses `http://localhost/v1/plan` through that **private binding**, and
continues authenticating to Oracle with the existing Bearer token.
In the VPC service, the preconfigured host and port override the URL target.

The `workers.dev` hostname stays the frontend/backend public entrypoint.
The Oracle GTFS services are NOT made public. Do not deploy the Worker before
testing its bindings safely and preserving the existing Durable Object
communication configuration/migrations.

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
