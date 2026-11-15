#!/usr/bin/env bash
# Explicit, minimal Oracle activation for message delivery/read receipts.
# Preserves the original device, FCM and Caddy changes; never runs git pull/reset.
set -euo pipefail
ROOT=/home/ubuntu/pocketai-chat-test
API=pocketai-device-comms-api-1
PG=pocketai-device-comms-postgres-1
cd "$ROOT"
test -d .git || { echo "STOP: Oracle checkout missing"; exit 1; }
test -f oracle-communication/compose-existing-caddy.yaml || { echo "STOP: compose missing"; exit 1; }
test -f oracle-communication/compose-fcm.override.yaml || { echo "STOP: FCM overlay missing"; exit 1; }
umask 077
mkdir -p "$HOME/pocketai-backups"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
git show origin/main:oracle-communication/device-message-receipts.sql > "$work/receipts.sql"
git show origin/main:oracle-communication/scripts/apply-message-receipts.py > "$work/patch.py"
test -s "$work/receipts.sql" && test -s "$work/patch.py" || { echo "STOP: migration files empty"; exit 1; }

echo "STAGE=BACKUP"
backup="$HOME/pocketai-backups/comunicare-before-receipts-$(date -u +%Y%m%d-%H%M%S).dump"
sudo docker exec "$PG" sh -c 'exec pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$backup"
test -s "$backup"
sudo docker exec -i "$PG" pg_restore -l < "$backup" > /dev/null
ls -lh "$backup"

echo "STAGE=SCHEMA"
sudo docker exec -i "$PG" sh -c 'exec psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < "$work/receipts.sql"
echo "RECEIPT_SCHEMA=OK"

echo "STAGE=API_SOURCE"
python3 "$work/patch.py" "$ROOT/oracle-communication/device-api.mjs" "$HOME/pocketai-backups"

echo "STAGE=BUILD_API_ONLY"
cd "$ROOT/oracle-communication"
sudo docker compose -f compose-existing-caddy.yaml -f compose-fcm.override.yaml config --quiet
sudo docker compose -f compose-existing-caddy.yaml -f compose-fcm.override.yaml up -d --no-deps --build api
sudo docker exec "$API" grep -q "if(action==='receipt')" /srv/communication/device-api.mjs
echo "RECEIPTS_API=INSTALLED"

for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl --silent --show-error --fail --max-time 3 http://127.0.0.1:8767/healthz; then
    echo
    echo "RECEIPTS_API=HEALTHY"
    if sudo docker exec "$API" sh -c 'test -n "$FCM_PROJECT_ID" && test -r "$GOOGLE_APPLICATION_CREDENTIALS"'; then
      echo "FCM_CREDENTIALS=READABLE"
    else
      echo "FCM_CREDENTIALS=CHECK_REQUIRED"
    fi
    exit 0
  fi
  sleep 2
done
echo "ERROR: API did not become healthy; inspect container logs. DB backup retained."
sudo docker ps -a --filter "name=$API" --format 'table {{.Names}}\t{{.Status}}'
sudo docker logs --tail 15 "$API"
exit 1
