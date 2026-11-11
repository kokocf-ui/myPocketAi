# myPocket AI — Oracle-only communications (private pilot)

All communication data lives on the Oracle instance. The existing Cloudflare
AI Worker is NOT a chat relay and has no access to contacts, messages or lists.

## Existing infrastructure
The user's Oracle `pocketai-core` VM and `pocketai-comunicare-gateway`
were configured separately. This repository does not have live SSH access or
the running gateway's source. **Do not claim these files have been deployed.**
The new Compose project does not automatically replace the existing gateway.

## On Oracle VM (Ubuntu ARM64)
Prerequisites: Docker + Compose, Git, a real DNS record resolving to Oracle
public IPv4, ingress TCP 80/443 in Oracle security list and Ubuntu firewall,
and a genuine SMTP account. Do not open PostgreSQL port 5432 publicly.

```bash
git clone https://github.com/kokocf-ui/myPocketAi.git ~/pocketai-project
cd ~/pocketai-project/oracle-communication
cp .env.example .env && chmod 600 .env
# Edit .env: COMM_DOMAIN, TLS_CONTACT_EMAIL, strong PG/OTP secrets and SMTP.
docker compose -f compose.yaml config --quiet
docker compose -f compose.yaml up -d --build
docker compose -f compose.yaml ps
curl -fsS https://YOUR_COMM_DOMAIN/healthz
```

For an existing checkout, use `git pull --ff-only`; never overwrite its
existing .env. Check first whether ports 80/443 already serve another site.
If so, integrate the API under the existing TLS reverse proxy rather than
starting a competing HTTPS service. Avoid unreviewed remote installation scripts.

## Security
- Verified email via time-limited six-digit OTP; each account gets an opaque
  random session token, stored only as a SHA-256 hash on the Oracle server.
- Mutually accepted, single-use, seven-day invite links; blocking removes contact
  links. Invite URLs must not be included in analytics or logs.
- Owner/editor/viewer list permissions checked server-side; every operation has
  an idempotency key and revision check to avoid duplicate additions.
- Browser CORS restricted to APP_ORIGIN; PostgreSQL and Node API only on
  internal Docker network; Caddy issues TLS certificates for COMM_DOMAIN.
- Experimental **encrypted text chat transport is implemented in source**, using
  device ECDH P-256 and AES-GCM, but is **not independently audited E2EE**.
  Device replacement and recovery, trustworthy key verification, attachments
  and Android background notifications are not ready for public release.
- OTP requires configured SMTP; do not disable verification for the pilot.

## Pilot acceptance checks
1. From two devices request codes for two distinct verified email accounts.
2. Create invitation on phone A, send over WhatsApp/SMS/email, accept on B.
3. Ensure the same invite cannot be reused, self-accepted or accepted if blocked.
4. Confirm contact A/B is reciprocal and neither user can list a stranger's data.
5. Create a list, share with B, add/check an item, refresh to verify revision.
6. Confirm older revisions return 409 and repeated idempotency keys do not
   duplicate items; revoke membership and verify 403.

Text chat and list updates currently refresh by foreground polling; reliable
background notifications, media upload, group chat, audited key verification,
key recovery, FCM and native Android secure token storage remain to implement.
No source change here proves an Oracle deployment has taken place.
