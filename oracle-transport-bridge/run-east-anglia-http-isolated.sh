#!/usr/bin/env bash
# Isolated HTTP/Node/Python parity test. NEVER rebuild or enter the running
# pocketai-england-local container. No deployment or production feed changes.
set -Eeuo pipefail
S="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
A=/home/ubuntu/pocketai-england-audit
P=/home/ubuntu/pocketai-england-compact-pilot
IMAGE=pocketai-england-parity:test

if [[ "$(id -un)" != ubuntu ]]; then
  echo "ERROR: this test runner must be called as ubuntu" >&2
  exit 2
fi
for file in "$S/oracle-england-transport/Dockerfile" "$S/oracle-transport-bridge/probe-east-anglia-http.mjs" "$S/gtfs_sqlite_store.py" "$A/en-ea.sqlite3" "$P/en-ea.sqlite3"; do
  if [[ ! -f "$file" || -L "$file" ]]; then
    echo "ERROR: required file absent or symlink: $file" >&2
    exit 2
  fi
done
if [[ ! -d "$A" || ! -d "$P" || -L "$A" || -L "$P" ]]; then
  echo 'ERROR: unsafe audit or compact-pilot directory' >&2
  exit 2
fi
echo '=== PREPARE COMPACT PILOT INDEX ==='
if [[ -L "$P/en-ea.index.json" ]]; then
  echo 'ERROR: compact index is a symlink' >&2
  exit 2
fi
if [[ ! -f "$P/en-ea.index.json" ]]; then
  python3 "$S/gtfs_sqlite_store.py" index "$P/en-ea.sqlite3" en-ea GB
fi
echo '=== BUILD SEPARATE TEST IMAGE: NODE 22 + PYTHON 3 ==='
# Dockerfile explicitly RUNs "apk add --no-cache python3". Do not retag
# pocketai-england-local:local or rebuild a production image.
sudo docker build -f "$S/oracle-england-transport/Dockerfile" -t "$IMAGE" "$S"
echo '=== VERIFY TEST IMAGE EXECUTABLES ==='
sudo docker run --rm --network none --entrypoint sh "$IMAGE" -ec \
  'node --version; python3 --version; command -v python3'
echo '=== RUN LOOPBACK-ONLY READ-ONLY PARITY TEST ==='
sudo docker run --rm --network none --read-only \
  --tmpfs /tmp:rw,nosuid,nodev,size=128m \
  --cap-drop ALL --security-opt no-new-privileges \
  --pids-limit 64 --memory 1g --cpus 1 \
  --user "$(id -u):$(id -g)" \
  --mount "type=bind,src=$S,dst=$S,readonly" \
  --mount "type=bind,src=$A,dst=$A,readonly" \
  --mount "type=bind,src=$P,dst=$P,readonly" \
  "$IMAGE" node "$S/oracle-transport-bridge/probe-east-anglia-http.mjs"
