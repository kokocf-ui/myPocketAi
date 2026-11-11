# myPocketAI — Comunicare on Oracle (device-only pilot)

**Current status:** Source implementation only. Not deployed to the user's Oracle host and NOT verified on two phones.

## User flow (no email / no SMS verification / no phone number)

- Tap **Comunicare → Activează**, enter a display name. A new local ECDSA/ECDH device identity is generated and stored in Android WebView IndexedDB.
- Tap **Invitații → Creează** and share the one-use invitation link by WhatsApp or SMS. WhatsApp/SMS chooses recipients from the user's own apps; phone contacts are not uploaded to Oracle.
- Recipient opens the HTTPS invitation link, taps **Deschide în myPocketAI**, and accepts. The native Android URI scheme `mypocketai://invite/<token>` opens the relevant screen.
- Approved contacts can exchange encrypted text, media and share shopping lists; foreground polling fetches updates.
- Replacement phones obtain **new device identities** and require fresh invitations. Old messages are not recovered. Contacts should block the old identity to revoke access.

This is an **unaudited crypto pilot**, NOT audited Signal-style end-to-end encryption. In particular, device-key verification, key rotation/recovery, attachment metadata handling, backups, moderation, GDPR review and reliable Android background notifications are not finished. Do not advertise it as secure public messaging.

## Deployment on the EXISTING Oracle instance

The existing machine already has a host-level Caddy HTTPS reverse proxy. **Do not start `oracle-communication/compose.yaml` unmodified**, because its `https` service would compete for TCP 80/443 and risk interrupting the current site. Keep the current host Caddy and gateway intact.

1. Review the current Caddy routing and running Docker containers; preserve existing config, secrets and volumes.
2. Provision a private PostgreSQL database or reuse the dedicated communication database. Existing volumes do NOT automatically rerun `docker-entrypoint-initdb.d` files. Apply `device-schema.sql` to the correct private database with a PostgreSQL account with schema rights, after a backup.
3. Build the updated Node API using `Dockerfile` and run it on a **loopback-only** host endpoint or private Docker network, with `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD` and `APP_ORIGIN`. Do not expose Node or port 5432 to the internet.
4. Configure the **existing host Caddy** so `https://mypocketai.duckdns.org/api/communication` (POST and OPTIONS) and `/i/*` (GET) proxy to that service, keeping all pre-existing routes. Do not rely on the separate Compose Caddy template. Allow `X-Pocket-Id`, `X-Pocket-Timestamp`, `X-Pocket-Nonce`, `X-Pocket-Signature` and `Content-Type` CORS headers from the exact app origin.
5. Validate routing, TLS, 403 on unauthorized contacts, registration, single-use invites, replay prevention, encrypted media and revisions for shared lists **on two devices** before building a release APK.
6. For Android pilot notifications: this client supports foreground polling only. Background push notifications require a later native implementation and consent.

## API

The Android UI already sends signed action POST bodies to `/api/communication`. `device-api.mjs` implements `register`, `invite`, `accept`, `contacts`, `remove`, `messages`, `send`, `upload`, `attachment`, `list_create`, `lists`, `list`, `list_share`, `list_op`.

Payload authentication uses a non-exportable P-256 ECDSA signing key, timestamp and single-use nonce; received contacts must have reciprocal accepted invites. Encrypted data is transported using the app's existing experimental device-key ECDH + AES-GCM scheme. Server keeps ciphertext, routing metadata and encrypted blobs. **Encryption has not been independently reviewed**.

To run checks on a developer machine with Node 22 installed:

```bash
node --check oracle-communication/device-api.mjs
node --check oracle-communication/server.mjs
node --test oracle-communication/device-api.test.mjs oracle-communication/threads.test.mjs
```

The previous REST+email implementation remains available for compatibility only if separately configured with SMTP; it is not used by the device-only pilot.
