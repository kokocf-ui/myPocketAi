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

## Live VPC probe — blocked by Cloudflare account authorization

On 2026-11-16, a **temporary local-only Wrangler VPC probe** ran in GitHub
Actions (run 43855363528) using the existing masked GitHub
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. It did not deploy
anything to production, did not read transport secrets, and did not send
a route/coordinate request.

- Pure local tests: **3 pass / 0 fail**.
- The Cloudflare remote-binding setup returned **10196**, stating the
  credentials were not authorized to bind the specified VPC Services.
- Thus **no live VPC health or Bearer rejection was tested from Worker**.
- Existing Oracle Tunnel and VPC Services need NOT be recreated.
- Existing `RO_URBAN_API_TOKEN` and `EN_URBAN_API_TOKEN` secrets
  need NOT be changed for this error.

Required least-privilege fix: The member/token used for GitHub Wrangler must
be able to **bind VPC Services** (`Connectivity Directory Bind`, or Admin).
Cloudflare docs: <https://developers.cloudflare.com/workers-vpc/reference/troubleshooting/>.
Also retain whatever Workers deploy permissions the existing CI pipeline needs.
Do not replace the GitHub credential with a narrower token without verifying
the existing frontend/backend production deployment permissions, and never
paste any API credential into chat or source control.

After updating account/automation permissions, re-run the **failed** isolated
workflow (no production deployment). A successful probe will establish only:
both VPC connections reach the matching Oracle APIs, and each API returns 401
for a deliberately invalid Bearer token. It will **not** verify the encrypted
production Worker secret values or real journey results.

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
