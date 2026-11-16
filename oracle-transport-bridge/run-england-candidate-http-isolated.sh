#!/usr/bin/env bash
# Candidate-only: run one ephemeral nine-region gateway, never production 8768.
set -Eeuo pipefail
S="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
C=/home/ubuntu/pocketai-england-candidate/feeds
IMAGE=pocketai-england-parity:test
if [[ $# -ne 0 || "$(id -un)" != ubuntu ]]; then
 echo 'ERROR: run without arguments as ubuntu' >&2; exit 2
fi
[[ -d "$C" && ! -L "$C" && -f "$S/oracle-transport-bridge/test-england-candidate-all-http.mjs" ]] || {
 echo 'ERROR: candidate not staged or test script missing' >&2; exit 2;
}
sudo docker image inspect "$IMAGE" >/dev/null
echo '=== ALL NINE COMPACT FEEDS IN ONE LOOPBACK-ONLY GATEWAY ==='
sudo docker run --rm --network none --read-only \
 --tmpfs /tmp:rw,nosuid,nodev,size=128m \
 --cap-drop ALL --security-opt no-new-privileges --pids-limit 64 \
 --memory 1g --cpus 1 --user 10001:10001 \
 --mount "type=bind,src=$S,dst=$S,readonly" \
 --mount "type=bind,src=$C,dst=/data/feeds,readonly" \
 "$IMAGE" node "$S/oracle-transport-bridge/test-england-candidate-all-http.mjs"
echo 'PASS: all nine compact England feeds planned journeys via one isolated server; NOT LIVE'
