#!/usr/bin/env bash
set -euo pipefail
# Use existing node:22-alpine; no image download and no European timetable data.
NAME=pocketai-europe-slim
SOURCE='https://raw.githubusercontent.com/kokocf-ui/myPocketAi/2928592500323dc10698fa88d7db2edd66fb82ed/bootstrap/europe-relay.mjs.gz'
CHECKSUM='07ea0d5989d1decd91d48e4913c22bdf3dd4eda8044a523a033885b1eb2bdeea'
command -v curl >/dev/null && command -v gzip >/dev/null && command -v sha256sum >/dev/null || { echo 'Missing standard utility; nothing changed'; exit 1; }
if ! sudo docker image inspect node:22-alpine >/dev/null 2>&1; then
  echo 'Existing node:22-alpine Docker image not found; nothing changed'; exit 1
fi
if sudo docker container inspect "$NAME" >/dev/null 2>&1; then
  echo 'Europe Slim container already exists: no replacement attempted'
  sudo docker ps -a --filter "name=^/${NAME}$" --format '{{.Names}} {{.Status}}'
  exit 0
fi
# 8766 and 8767 belong to existing national services. Never touch them.
# A listening TCP socket is authoritative even when /healthz is absent.
if ! command -v ss >/dev/null 2>&1; then
  echo 'ss utility is missing; refusing to guess which port is free'; exit 1
fi
PORT=''
for candidate in 8770 8771 8772 8773 8774 8775; do
  if ! sudo ss -H -ltn | awk '{print $4}' | grep -Eq "[:.]\${candidate}\$"; then
    PORT="$candidate"
    break
  fi
done
if [ -z "$PORT" ]; then
  echo 'No free Europe Slim port in range 8770-8775; no changes made'; exit 1
fi
echo "Europe Slim selected free port $PORT (UK/RO untouched)"
work=$(mktemp -d /tmp/eu-slim.XXXXXXXX)
trap 'rm -rf "$work"' EXIT
curl --fail --silent --show-error --location --max-time 30 "$SOURCE" -o "$work/relay.mjs.gz"
printf '%s  %s\n' "$CHECKSUM" "$work/relay.mjs.gz" | sha256sum --check --status || { echo 'Checksum mismatch; nothing changed'; exit 1; }
gzip -dc "$work/relay.mjs.gz" > "$work/relay.mjs"
chmod 644 "$work/relay.mjs"
sudo docker run --rm --network none --read-only --user 10001:10001 --cap-drop ALL --security-opt no-new-privileges \
  -v "$work/relay.mjs:/app/relay.mjs:ro" node:22-alpine node --check /app/relay.mjs
sudo install -d -m 0755 /opt/pocketai-europe-slim
sudo install -m 0644 "$work/relay.mjs" /opt/pocketai-europe-slim/relay.mjs
if ! sudo test -e /etc/pocketai-europe-slim.providers.json; then
  printf '[]\n' | sudo tee /etc/pocketai-europe-slim.providers.json >/dev/null
  sudo chmod 0644 /etc/pocketai-europe-slim.providers.json
fi
if ! sudo test -s /etc/pocketai-europe-slim.env; then
  TOKEN=$(od -An -N32 -tx1 /dev/urandom | tr -d ' \n')
  printf 'EU_RELAY_TOKEN=%s\n' "$TOKEN" | sudo tee /etc/pocketai-europe-slim.env >/dev/null
  sudo chmod 0600 /etc/pocketai-europe-slim.env
fi
sudo docker run -d --name "$NAME" --restart unless-stopped --network host \
  --user 10001:10001 --read-only --cap-drop ALL --security-opt no-new-privileges \
  --memory 192m --pids-limit 32 --cpus 0.5 --log-driver local --log-opt max-size=1m --log-opt max-file=2 \
  --env-file /etc/pocketai-europe-slim.env -e EU_RELAY_PORT="$PORT" \
  -e EU_RELAY_PROVIDERS_FILE=/etc/pocketai-europe-slim.providers.json \
  -e NODE_OPTIONS=--max-old-space-size=80 \
  -v /opt/pocketai-europe-slim/relay.mjs:/app/relay.mjs:ro \
  -v /etc/pocketai-europe-slim.providers.json:/etc/pocketai-europe-slim.providers.json:ro \
  node:22-alpine node /app/relay.mjs >/dev/null
sleep 2
curl --fail --silent --show-error --max-time 4 http://127.0.0.1:$PORT/healthz
printf '%s\\n' "$PORT" | sudo tee /opt/pocketai-europe-slim/port >/dev/null
printf '\\nEurope Slim launched on local port %s using existing Docker image; no GTFS downloaded.\\n' "$PORT"
df -h /
