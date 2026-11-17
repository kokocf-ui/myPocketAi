#!/usr/bin/env bash
# Read-only diagnostic of the England adapter against a disposable Europe Slim container.
# Production container 8770, UK 8768, and Romania 8766 are never modified.
set -Eeuo pipefail
[[ "$(id -u)" == 0 ]] || { echo "Run with sudo bash"; exit 1; }
for cmd in docker python3 curl ss; do command -v "$cmd" >/dev/null || { echo "Missing $cmd"; exit 1; }; done
EU=pocketai-europe-slim
TEST=pocketai-europe-slim-probe
CODE=/opt/pocketai-europe-slim/relay.mjs
CFG=/etc/pocketai-europe-slim.providers.json
ENV=/etc/pocketai-europe-slim.env
[[ -f "$CODE" && -f "$CFG" && -f "$ENV" ]] || { echo "Europe Slim files absent"; exit 1; }
docker inspect "$EU" -f '{{.State.Running}}' 2>/dev/null | grep -qx true || { echo "Production Europe Slim not running; abort"; exit 1; }
docker inspect pocketai-england-local -f '{{.State.Running}}' 2>/dev/null | grep -qx true || { echo "England not running; abort"; exit 1; }
if docker inspect "$TEST" >/dev/null 2>&1; then echo "Probe container name already in use; abort"; exit 1; fi
if ss -H -ltn | awk '{print $4}' | grep -Eq '[:.]8771$'; then echo "Probe port 8771 in use; abort"; exit 1; fi
WORK=$(mktemp -d /tmp/pocketai-europe-probe.XXXXXXXX)
chmod 700 "$WORK"
cleanup(){ docker rm -f "$TEST" >/dev/null 2>&1 || true; rm -rf "$WORK"; }
trap cleanup EXIT
cp "$ENV" "$WORK/env"
chmod 600 "$WORK/env"
KEY=$(docker inspect pocketai-england-local --format '{{range .Config.Env}}{{println .}}{{end}}' |
  sed -n 's/^RO_GATEWAY_TOKEN=//p' | head -1)
[[ "$(printf %s "$KEY" | wc -c)" -ge 32 ]] || { echo "England gateway key absent or too short; no changes made"; exit 1; }
if ! grep -q '^EU_UPSTREAM_GB_TOKEN=' "$WORK/env"; then
 printf 'EU_UPSTREAM_GB_TOKEN=%s\n' "$KEY" >> "$WORK/env"
fi
unset KEY
python3 - "$CFG" "$WORK/providers.json" <<'PY'
import json,sys
with open(sys.argv[1],encoding="utf-8") as f: rows=json.load(f)
if not isinstance(rows,list): raise SystemExit("Invalid existing provider file")
rows=[r for r in rows if r.get("id")!="gb-oracle-urban"]
rows.append({"id":"gb-oracle-urban","kind":"local_gtfs","baseUrl":"http://127.0.0.1:8768",
             "country":"GB","bbox":[-6.5,49.9,2.1,55.9],"enabled":True,
             "licenseApproved":True,"tokenEnv":"EU_UPSTREAM_GB_TOKEN"})
with open(sys.argv[2],"w",encoding="utf-8") as f:json.dump(rows,f)
PY
chmod 644 "$WORK/providers.json"
echo "Starting isolated England adapter test on 8771; production 8770 unchanged..."
docker run -d --name "$TEST" --network host --read-only --user 10001:10001 \
 --cap-drop ALL --security-opt no-new-privileges --memory 192m --cpus 0.5 \
 --env-file "$WORK/env" -e EU_RELAY_PORT=8771 -e EU_RELAY_PROVIDERS_FILE=/app/providers.json \
 -e NODE_OPTIONS=--max-old-space-size=80 \
 -v "$CODE:/app/relay.mjs:ro" -v "$WORK/providers.json:/app/providers.json:ro" \
 node:22-alpine node /app/relay.mjs >/dev/null
ok=0
for i in 1 2 3 4 5 6; do
  if curl -fsS --max-time 2 http://127.0.0.1:8771/healthz; then ok=1; echo; break; fi
  sleep 1
done
if [[ "$ok" == 1 ]]; then
  echo "PROBE_READY - only test configuration; England is NOT yet deployed to production."
else
  echo "PROBE_FAILED - diagnostic logs (credentials redacted):"
  docker logs --tail 35 "$TEST" > "$WORK/probe.log" 2>&1 || true
  python3 - "$WORK/probe.log" "$WORK/env" <<'PY'
import sys
s=open(sys.argv[1],errors="replace").read()
for line in open(sys.argv[2],errors="replace"):
 if "=" in line:
  k,v=line.rstrip("\n").split("=",1)
  if v and ("TOKEN" in k or "SECRET" in k):s=s.replace(v,"[REDACTED]")
print(s[-4000:] or "No startup log available")
PY
fi
echo "PRODUCTION_HEALTH:"
curl -fsS --max-time 3 http://127.0.0.1:8770/healthz || true
echo
echo "The disposable probe is being removed; all production containers remain unchanged."
