# Pocket AI — Telegram MTProto (personal, read-only connector)

This is separate from the **obsolete Telegram Bot API/hub**, which was removed. It uses the valid `TELEGRAM_API_ID` and `TELEGRAM_API_HASH` from my.telegram.org. **Never remove these two secrets.**

## Status and limits

Pocket AI already supports user-initiated Telegram **public web-index link discovery** through Exa. That path does not use Telegram authorization and remains unchanged.

The optional MTProto connector uses a **Telegram user account** for explicit, owner-authorized searches. An API ID and hash alone do not authorize a user. Telegram also requires a signed-in **session**; it is **not configured merely by deploying this code**.

For the international Pocket AI application, an owner's Telegram session **must never be shared** with anonymous users. The direct route is protected by an independent owner-only bearer token. Do **not** bundle that token into the Android APK or frontend.

The direct search uses `messages.searchGlobal` with `broadcastsOnly=true`, and returns only messages from channels with a public username. It is a **limited search**, not a complete search of all public channel posts. It never calls `channels.searchPosts` (which may charge Telegram Stars), sends messages, reads private chats, collects history, or forwards messages to an AI model. No automatic polling, cache, scheduled job or CI live test exists. Source claims are unverified; source text remains untranslated.

For legal reasons, do not use this client to aggregate Telegram content for LLM deployment. Telegram's content terms restrict AI-oriented harvesting, even from public channels:
https://telegram.org/tos/content-licensing
https://core.telegram.org/api/terms
https://core.telegram.org/api/search

## One-time authorization (only on a trusted device)

Required secrets in Cloudflare Workers > lifewise-ai-api > Settings > Variables and Secrets:

- `TELEGRAM_API_ID` — keep the existing value
- `TELEGRAM_API_HASH` — keep the existing value
- `TELEGRAM_SESSION` — **new** authorization session generated after Telegram code/2FA login
- `TELEGRAM_DIRECT_ACCESS_TOKEN` — **new**, unrelated random owner-only bearer token (32+ characters)

The old hub/bot secrets `TELEGRAM_BOT_TOKEN`, `TELEGRAM_APPROVED_CHANNELS`, and `TELEGRAM_PUBLISHER_CONSENT` are **not** needed.

Obtain the session on your **trusted device**, not via ChatGPT, GitHub Actions, a web form, or a shared log. With Node 20+ and `npm install` in the project, set `TELEGRAM_API_ID` and `TELEGRAM_API_HASH` as local environment variables (without posting them), then run:

```sh
node scripts/telegram-mtproto-login.mjs
```

Complete Telegram's normal login in the terminal. A `.telegram-mtproto-session` file is created locally with restricted permissions. It is **a full account-access credential**. Do not send or upload it. Paste its contents only into the Cloudflare `TELEGRAM_SESSION` secret, then securely delete the local file. If it is leaked, terminate that Telegram session from the official Telegram app.

Generate a separate token locally, for example with Node:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Store the result in Cloudflare as `TELEGRAM_DIRECT_ACCESS_TOKEN`. Do not store it in Pocket AI frontend code or APK.

**Production endpoint (owner only, not a UI feature for other users):**

- `GET /api/telegram-direct-status` returns readiness booleans without exposing values.
- `POST /api/telegram-direct-search` with JSON body `{"query":"Ucraina","limit":5}`, `Authorization: Bearer <your owner token>` returns a small attributed list of accessible public-channel posts. Do not log or publish that token.
- Unauthorized users receive HTTP 401. Missing session or credentials gives 409. No automatic fallbacks to a personal channel or bot.

Do not interpret `configured_pending_live_verification` as proof of successful sign-in. Live Telegram connection and compatibility with Cloudflare Workers must be tested only after the owner supplies their own session, explicitly and privately. The deployment must not consume Cloudflare Workers AI neurons just to test this connector.

This does **not** implement an international multi-user Telegram login. That requires a separate per-user, opt-in authorization flow with secure isolation, consent, revocation and account-session storage.
