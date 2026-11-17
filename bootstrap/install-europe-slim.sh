#!/usr/bin/env bash
set -euo pipefail
# myPocketAI Europe Slim; run as ubuntu on Oracle, not inside Termux Android.
if ! command -v node >/dev/null 2>&1 || (( $(node -p 'Number(process.versions.node.split(".")[0])') < 22 )); then
  echo 'STOP: Oracle needs Node.js 22+; no changes made.' >&2
  exit 1
fi
command -v curl >/dev/null || { echo 'STOP: curl is missing; no changes made.' >&2; exit 1; }
work=$(mktemp -d /tmp/pocketai-europe-slim.XXXXXXXX)
trap 'rm -rf "$work"' EXIT
url='https://raw.githubusercontent.com/kokocf-ui/myPocketAi/2b4c6e002813fc024c4be4104af445867c4cc0df/bootstrap/europe-slim-runtime.tar.gz.b64'
curl --fail --silent --show-error --location --retry 2 --max-time 30 "$url" -o "$work/package.b64"
base64 --decode "$work/package.b64" > "$work/package.tar.gz"
printf '%s  %s\n' '2f6f01b4ef3fde69c031837591aa78136ad93df808839ea7e9f963adc664694a' "$work/package.tar.gz" | sha256sum --check --status || { echo 'STOP: archive integrity check failed; no changes made.' >&2; exit 1; }
tar -xzf "$work/package.tar.gz" -C "$work"
node --check "$work/oracle-europe-slim/relay.mjs"
sudo bash "$work/oracle-europe-slim/install.sh"
