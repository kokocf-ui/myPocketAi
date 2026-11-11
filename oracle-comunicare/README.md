# Pocket AI — Oracle Comunicare internal gateway

**Status:** safe deployment baseline; not yet a working messaging product.
The gateway exposes only GET `/healthz` and GET `/readyz`. No user accounts,
messages, uploads, tokens, or other personal data are handled.

## Architecture boundaries

- Existing Cloudflare Workers/D1/Durable Objects/R2 remain responsible for
  verified identities, access checks, shared shopping lists and private storage.
- This Oracle component may later run authenticated background jobs (e.g. media
  validation or transformations), once service-to-service authentication,
  replay prevention, rate limits, timeouts, and audit logs are implemented.
- Do **not** open port 8765 in Oracle's security lists. Docker binds it **only**
  to `127.0.0.1:8765` on the VM.
- No current Eva Android/API or Cloudflare configuration is changed.

## Test

```sh
node --test oracle-comunicare/server.test.mjs
```

## Deploy to Ubuntu 24.04 ARM64 on Oracle

Run on the server using an SSH session or from Termux with remote command.
The Git repository is public and does not require GitHub credentials to clone.

```sh
git clone --depth=1 --branch infra/oracle-comunicare-gateway \
  https://github.com/kokocf-ui/myPocketAi.git ~/pocketai-oracle-src
cd ~/pocketai-oracle-src/oracle-comunicare
sudo docker compose up -d --build
curl --fail --silent http://127.0.0.1:8765/healthz
sudo docker compose ps
```

When upgrading the same branch:

```sh
git -C ~/pocketai-oracle-src pull --ff-only
cd ~/pocketai-oracle-src/oracle-comunicare
sudo docker compose up -d --build
```

## Security limitations

This gateway has **no** authentication and is **not** ready for public exposure.
Do not bind it to 0.0.0.0 or reverse proxy/tunnel it externally.
All unknown or write requests return 404; it does not use or require
`~/pocketai-comunicare/{config,data,attachments}`.

Prior to any user-data feature, implement the controls in
`COMMUNICATION_SECURITY_DESIGN.md`: verified login, authorization on every
operation, invitation membership, media validation, retention, encryption
requirements, backups, abuse prevention, and privacy obligations.
