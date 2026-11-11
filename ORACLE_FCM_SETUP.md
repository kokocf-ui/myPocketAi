# Oracle → Firebase Cloud Messaging → Android

## Status and scope
This is the **optional** background notification transport for myPocketAI Comunicare.
The existing Oracle chat, Postgres database, Caddy, DuckDNS and agenda reminders
continue working when Firebase isn't configured. The APK **does not** receive real
background pushes until the Firebase project, GitHub variables, service account,
Oracle migration and two-device acceptance test are completed.

The message body, shopping products, contacts and encryption keys remain on Oracle /
on the devices. FCM receives only `kind` (message / list / invite), `target` (UUID),
and the constant `source=mypocketai_oracle`. The device fetches actual data from
Oracle with the existing signed API after the user opens the notification. This is
not a claim of independently audited E2EE, and delivery is best effort (Android
permissions, Google Play services, battery policies and Internet may affect timing).

## 1. Firebase console (owner action)
1. Open https://console.firebase.google.com/ and create a Firebase project named
   `myPocketAI` (or use an existing project under your own account).
2. In **Project settings → General → Your apps → Add app → Android**, use the exact
   Android package name **`ai.mypocket.mobile`**. Do not change it: the existing
   release signing/update identity must be preserved.
3. Find the values in the Android project's `google-services.json`:
   `project_info.project_id`, `project_info.project_number`,
   `client[0].client_info.mobilesdk_app_id`,
   `client[0].api_key[0].current_key`. Verify client package name matches.
   These are Firebase *client configuration*, not a server private key.
4. In GitHub repository Settings → Secrets and variables → Actions → **Variables**,
   add: `POCKET_FIREBASE_PROJECT_ID`, `POCKET_FIREBASE_SENDER_ID`
   (project_number), `POCKET_FIREBASE_APP_ID` (mobilesdk_app_id),
   `POCKET_FIREBASE_API_KEY` (current_key).
   The signed build reads these variables via Gradle. A build with absent values
   still compiles, but deliberately has push disabled.
5. In Firebase settings → **Service accounts** generate a new private key JSON
   for the service account used to send FCM HTTP v1. Keep this JSON PRIVATE.
   **Never send it in a chat screenshot, commit it to GitHub, put it inside the
   APK, paste it in the Caddyfile or post it to Cloudflare.**
   Confirm Firebase Cloud Messaging API (HTTP v1) is enabled.

## 2. Prepare Oracle without changing Caddy (owner shell action)
The current Oracle server is `ubuntu@92.5.91.159`, accessed using the
existing Termux SSH private key. The deployed worktree is not automatically
updated when GitHub merges.

Review the current directories and perform an additive migration after a DB
backup. Use the existing working Oracle checkout and Docker Compose project;
do not `docker compose down -v`, delete volumes, reset encryption identities,
replace Caddy, or create another public PostgreSQL port.

Copy the **service account JSON** securely from your device to the Oracle home
(e.g. `/home/ubuntu/.config/pocketai/fcm-service-account.json`) and set mode 600.
Use the existing private SSH transfer mechanism; do not type the JSON into
Termux commands where it may end up in history or screenshots.

For a checked-out copy of this source use:
```bash
# On Oracle, after saving a database backup and checking your existing checkout:
cd /home/ubuntu/pocketai-oracle-src/oracle-communication
# Stop here if your active Compose project isn't this checkout.
# Apply once to existing PostgreSQL (does not alter pre-existing tables).
sudo docker exec -i pocketai-device-comms-postgres-1 \
  psql -v ON_ERROR_STOP=1 -U pocket_comm -d pocket_communication \
  < device-push.sql

# Add only these 2 env values to the protected existing .env:
# FCM_PROJECT_ID=<your-firebase-project-id>
# FCM_CREDENTIALS_HOST_PATH=/home/ubuntu/.config/pocketai/fcm-service-account.json
# Launch using BOTH compose files; overlay adds a read-only secret mount
# and doesn't modify Caddy or existing published ports.
sudo docker compose -f compose-existing-caddy.yaml -f compose-fcm.override.yaml config --quiet
sudo docker compose -f compose-existing-caddy.yaml -f compose-fcm.override.yaml up -d --build api
sudo docker compose -f compose-existing-caddy.yaml -f compose-fcm.override.yaml ps
```
The actual active source directory, project and PostgreSQL container must be
confirmed first; the example above is NOT authorization to overwrite the server.
The current deployed gateway may be built from a detached worktree. In that case
copy the audited new source into the deployment worktree (after backup) before
rebuilding its API. Preserve the same Docker project name, database volume,
loopback port 8767 and HTTPS reverse proxy.

## 3. Test with two signed-release Android installations
1. Rebuild the release APK AFTER all 4 GitHub variables are set. Check that it
   is signed by the existing release keystore and upgrades the installed app.
2. In Android settings give myPocketAI permission to show notifications.
   The Agenda permission popup is not changed; no mandatory push permission
   is forced for users who declined it.
3. Open Comunicare with the device online so the authenticated client can
   register its Firebase token on Oracle. Repeat on your friend's phone.
4. Accept a friend invitation and send one message while the other app is in
   the background. Verify the notification appears without message plaintext,
   that tapping it opens the correct chat, and no unrelated contact is visible.
5. Share a shopping list. Verify the notification opens the shared list, and
   checking an item syncs. Repeat with both apps closed and when reopened.
6. Revoke a contact and verify server access is denied. No notification should
   imply that a blocked user can still fetch messages or lists.
7. Verify ordinary Agenda notifications and existing Oracle HTTPS healthz still
   work. Record delayed/undelivered pushes honestly; delivery is not guaranteed.

## Security notes
- Push sends occur **only after** a signed device action is authenticated and
  Oracle commits the actual message/list update. Duplicate message/list operations
  don't create another event, and missing Firebase cannot interrupt chat.
- FCM registration tokens are stored in `device_push_tokens` in private Oracle
  PostgreSQL and limited to a few devices per identity. Stale tokens are removed.
- `GOOGLE_APPLICATION_CREDENTIALS` points at a read-only Docker secret mount.
  Use the FCM HTTP v1 OAuth2 mechanism, not obsolete legacy server keys.
- No automated persistent background polling job is introduced in the APK.
- Firebase Project / service account provisioning is an explicit owner action,
  not something an unauthenticated GitHub build can create.
