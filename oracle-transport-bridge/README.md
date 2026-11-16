# Oracle → Cloudflare → Eva: secure transport bridge

**Status 2026-11-16:** Romania's private Oracle GTFS API has answered a real
Bucharest–Ilfov planning request in 1.01 s. England's local GTFS service is
healthy but has no imported indexed English feed. The Cloudflare tunnel is
NOT deployed. The GitHub scripts are staged only, do not contain any secrets
and will not run themselves. No APK is involved.

## Isolated upstream services

| Destination | Origin reachable from Oracle | Current state |
| --- | --- | --- |
| Romania | `http://127.0.0.1:8766` | Imported `ro-b` indexed feed only |
| England | `http://127.0.0.1:8768` | Empty catalog, health works |
| Device communications | `127.0.0.1:8765` and `127.0.0.1:8767` | **Do not touch** |

Never map a transport hostname directly to Oracle's public IP or open inbound
security-list ports 8766/8768. The tunnel connector only makes outbound
connections to Cloudflare.

## One-time Oracle package preparation (no token required)

From the existing Oracle checkout:

```bash
cd /home/ubuntu/pocketai-transport-src
git fetch origin feat/gtfs-sqlite-indexed-20261116
git switch --detach FETCH_HEAD
bash oracle-transport-bridge/preflight.sh
bash oracle-transport-bridge/install-cloudflared.sh
```

The scripts do not restart the API containers, create DNS records, activate
any tunnel, or interact with the communications gateway. The installer
follows Cloudflare's signed APT repository; review before execution.

## Cloudflare dashboard prerequisites

A Cloudflare-managed domain is required for stable production hostnames.

1. In Cloudflare > Networking > Tunnels, create **one remotely managed**
   tunnel named `pocketai-oracle-transit`.
2. In the tunnel's published applications, use distinct names under YOUR
   existing Cloudflare domain, for example:
   - `ro-transit.<your-domain>` → `http://localhost:8766`
   - `en-transit.<your-domain>` → `http://localhost:8768`
   Do not create a route for ports 8765/8767 or other application services.
3. In Zero Trust > Access controls > Applications, protect EACH hostname
   with a self-hosted Access application. Use a **Service Auth** policy
   authorizing ONLY a dedicated service-token identity issued for the Eva
   Worker. Do not set a Bypass/public Allow rule.
4. In Zero Trust > Access controls > Service credentials > Service Tokens,
   create a dedicated machine identity, retain its Client ID and Client
   Secret in a password manager. They belong exclusively in Worker secrets.
   Review expiration and rotation cadence.
5. Only after Access is enforced should the Oracle tunnel connector be
   activated. A hostname protected only with the Oracle API Bearer token
   provides less defense in depth.

## Activate connector without leaking tunnel token into shell history

After Cloudflare dashboard routes + Access policies are configured:

```bash
# Run from an INTERACTIVE terminal on Oracle, not through a piped here-doc:
bash oracle-transport-bridge/activate-private-tunnel.sh
```

The script prompts for the *tunnel connector token* without echoing it,
stores it under root-controlled `/etc/pocketai-transit-tunnel/token`,
and uses Cloudflare's `--token-file` flag in an isolated systemd unit
`pocketai-transit-tunnel.service`. It checks that both local origins
are up and does not modify `cloudflared.service` if another active
connector already exists.

On Oracle, the tunnel should connect. Confirm **Healthy** in Cloudflare.
Healthy means the connector is attached, **not** that both data services
have usable schedules.

## Worker secrets: HTTPS + Access identity + origin API bearer

Configure the **existing Eva Cloudflare Worker** using its normal secure
deployment workflow; never put secret values in Git or screenshots.

| Secret name | Use |
| --- | --- |
| `RO_URBAN_API_URL` | `https://ro-transit.<your-domain>/` |
| `RO_URBAN_API_TOKEN` | Private Oracle ROMANIA `RO_GATEWAY_TOKEN` |
| `RO_URBAN_ACCESS_CLIENT_ID` | Cloudflare Access service identity Client ID |
| `RO_URBAN_ACCESS_CLIENT_SECRET` | Cloudflare Access Client Secret |
| `EN_URBAN_API_URL` | `https://en-transit.<your-domain>/` |
| `EN_URBAN_API_TOKEN` | Private Oracle ENGLAND `RO_GATEWAY_TOKEN`, distinct from Romania |
| `EN_URBAN_ACCESS_CLIENT_ID` | Authorized Access machine identity Client ID |
| `EN_URBAN_ACCESS_CLIENT_SECRET` | Authorized Access Client Secret |

`ro_urban_client.mjs` and `en_urban_client.mjs` now send both Access
headers plus the existing Bearer token, but ONLY to validated HTTPS URLs.
Supplying one Access header without the other fails before any network call.
The Cloudflare Worker, not the Android APK, holds the secrets.

## Validation without leaking secrets

- From Oracle: `bash oracle-transport-bridge/preflight.sh` and
  `systemctl is-active pocketai-transit-tunnel.service`.
- From the Cloudflare dashboard: tunnel Healthy, two published services
  bound to loopback, two Access applications with Service Auth policies.
- From a client **without** Access credentials: both public hostnames
  must be denied by Access (not return the JSON health payload).
- Through the authenticated Worker: verify `/v1/plan` returns genuine
  Romanian journeys for a location covered by the imported `ro-b` feed.
- England: `/healthz` should work behind Access but **no timetables** should
  be advertised until a current, licensed English feed is imported/indexed.
- Communications 8765/8767 must remain healthy and unchanged.
- After verification, monitor CPU/RAM and Cloudflare rate limiting.
  Limit internal auth and geographic search volume before public rollout.

## Rollback

Stopping **only** the transport tunnel:

```bash
sudo systemctl stop pocketai-transit-tunnel.service
```

This does not stop transport's local containers or existing communications.
Remove public routes and Access service identity in Cloudflare if disabling
the connection permanently. Never share connector tokens or API credentials.

## References

- Cloudflare official Tunnel install:
  https://developers.cloudflare.com/tunnel/features/locally-managed-tunnels/create-local-tunnel/
- Cloudflare Tunnel routing:
  https://developers.cloudflare.com/tunnel/concepts/routing/
- Cloudflare Access service tokens:
  https://developers.cloudflare.com/cloudflare-one/access-controls/service-credentials/service-tokens/
- Cloudflare tunnel token-file:
  https://developers.cloudflare.com/tunnel/reference/run-parameters/
