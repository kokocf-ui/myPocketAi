#!/usr/bin/env bash
# Fix UK port allowlist in Europe Slim. Probe first; rollback if production fails.
set -Eeuo pipefail
[[ $(id -u) == 0 ]] || { echo 'Run with sudo on Oracle'; exit 1; }
for c in docker python3 curl ss; do command -v "$c" >/dev/null || { echo "Missing $c; unchanged"; exit 1; }; done
NAME=pocketai-europe-slim
TEST=pocketai-europe-slim-probe
SOURCE=/opt/pocketai-europe-slim/relay.mjs
CONF=/etc/pocketai-europe-slim.providers.json
ENVFILE=/etc/pocketai-europe-slim.env
PORTFILE=/opt/pocketai-europe-slim/port
[[ -f "$SOURCE" && -f "$CONF" && -f "$ENVFILE" && -f "$PORTFILE" ]] || { echo 'Existing relay files absent; unchanged'; exit 1; }
[[ "$(cat "$PORTFILE")" == 8770 ]] || { echo 'Unexpected Europe Slim port; unchanged'; exit 1; }
docker inspect "$NAME" -f '{{.State.Running}}' 2>/dev/null | grep -qx true || { echo 'Europe Slim not running; unchanged'; exit 1; }
docker inspect pocketai-england-local -f '{{.State.Running}}' 2>/dev/null | grep -qx true || { echo 'England service not running; unchanged'; exit 1; }
docker port pocketai-england-local 3000/tcp 2>/dev/null | grep -qx '127.0.0.1:8768' || { echo 'England not on localhost:8768; unchanged'; exit 1; }
curl -fsS --max-time 3 http://127.0.0.1:8768/healthz >/dev/null || { echo 'England unavailable; unchanged'; exit 1; }
if docker inspect "$TEST" >/dev/null 2>&1; then echo 'Probe already exists; unchanged'; exit 1; fi
if ss -H -ltn | awk '{print $4}' | grep -Eq '[:.]8771$'; then echo 'Probe port 8771 in use; unchanged'; exit 1; fi
UK_TOKEN=$(docker inspect pocketai-england-local --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^RO_GATEWAY_TOKEN=//p' | head -1)
[[ $(printf %s "$UK_TOKEN" | wc -c) -ge 32 ]] || { echo 'UK key missing; unchanged'; exit 1; }
TMP=$(mktemp -d /tmp/pocketai-europe-uk-fix.XXXXXXXX)
chmod 0700 "$TMP"
changed=0
launch_production(){
 docker run -d --name "$NAME" --restart unless-stopped --network host \
 --user 10001:10001 --read-only --cap-drop ALL --security-opt no-new-privileges \
 --memory 192m --pids-limit 32 --cpus 0.5 --log-driver local --log-opt max-size=1m --log-opt max-file=2 \
 --env-file "$ENVFILE" -e EU_RELAY_PORT=8770 -e EU_RELAY_PROVIDERS_FILE="$CONF" \
 -e NODE_OPTIONS=--max-old-space-size=80 \
 -v "$SOURCE:/app/relay.mjs:ro" -v "$CONF:$CONF:ro" \
 node:22-alpine node /app/relay.mjs >/dev/null
}
restore(){
 trap - ERR
 if [[ $changed == 1 ]]; then
  echo 'Production failed; restoring original Europa Slim' >&2
  cat "$TMP/original.mjs" > "$SOURCE"
  cat "$TMP/original.json" > "$CONF"
  cat "$TMP/original.env" > "$ENVFILE"
  chmod 0600 "$ENVFILE"
  docker rm -f "$NAME" >/dev/null 2>&1 || true
  launch_production || true
 fi
}
cleanup(){ docker rm -f "$TEST" >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap restore ERR
trap cleanup EXIT
cp "$SOURCE" "$TMP/original.mjs"
cp "$CONF" "$TMP/original.json"
cp "$ENVFILE" "$TMP/original.env"
chmod 0600 "$TMP/original.env"
printf '%s' "$UK_TOKEN" > "$TMP/uk.token"
chmod 0600 "$TMP/uk.token"
python3 - "$SOURCE" "$CONF" "$ENVFILE" "$TMP" <<'PY'
import json,sys,pathlib
source,config,envfile,tmp=sys.argv[1:]
token=(pathlib.Path(tmp)/'uk.token').read_text()
p=pathlib.Path(tmp)
s=pathlib.Path(source).read_text()
a='[8764,8765,8766].includes(Number(u.port))'
b='[8764,8765,8766,8768].includes(Number(u.port))'
if s.count(a)!=1: raise SystemExit('Expected port rule not found exactly once; unchanged')
(p/'relay.mjs').write_text(s.replace(a,b))
providers=json.loads(pathlib.Path(config).read_text())
if not isinstance(providers,list): raise SystemExit('Provider file invalid; unchanged')
providers=[v for v in providers if v.get('id')!='gb-oracle-urban']
providers.append({'id':'gb-oracle-urban','kind':'local_gtfs','baseUrl':'http://127.0.0.1:8768',
 'country':'GB','bbox':[-6.5,49.9,2.1,55.9],'enabled':True,'licenseApproved':True,
 'tokenEnv':'EU_UPSTREAM_GB_TOKEN'})
(p/'providers.json').write_text(json.dumps(providers,ensure_ascii=False,indent=2))
old=pathlib.Path(envfile).read_text().splitlines()
old=[line for line in old if not line.startswith('EU_UPSTREAM_GB_TOKEN=')]
old.append('EU_UPSTREAM_GB_TOKEN='+token)
(p/'env').write_text('\n'.join(old)+'\n')
PY
unset UK_TOKEN
chmod 0644 "$TMP/relay.mjs" "$TMP/providers.json"
chmod 0600 "$TMP/env"
docker run --rm --network none --read-only --user 10001:10001 --cap-drop ALL \
 -v "$TMP/relay.mjs:/app/relay.mjs:ro" node:22-alpine node --check /app/relay.mjs
docker run -d --name "$TEST" --network host --read-only --user 10001:10001 \
 --cap-drop ALL --security-opt no-new-privileges --memory 192m --pids-limit 32 \
 --env-file "$TMP/env" -e EU_RELAY_PORT=8771 -e EU_RELAY_PROVIDERS_FILE=/app/providers.json \
 -e NODE_OPTIONS=--max-old-space-size=80 \
 -v "$TMP/relay.mjs:/app/relay.mjs:ro" -v "$TMP/providers.json:/app/providers.json:ro" \
 node:22-alpine node /app/relay.mjs >/dev/null
probe=0
for i in 1 2 3 4 5 6 7 8; do
 if curl -fsS --silent --max-time 2 http://127.0.0.1:8771/healthz > "$TMP/probe.json"; then
  if python3 - "$TMP/probe.json" <<'PY'
import json,sys
p=json.load(open(sys.argv[1]))
assert p.get('status')=='ready' and p.get('configuredNationalProviders')==2
PY
  then probe=1; break; fi
 fi
 sleep 1
done
if [[ $probe != 1 ]]; then
 echo 'PROBE_FAILED; production unchanged. Startup error:'
 docker logs --tail 18 "$TEST" 2>&1 | grep -v 'TOKEN=' || true
 exit 1
fi
echo 'PROBE_READY: RO and GB accepted; updating Europa Slim only.'
docker rm -f "$TEST" >/dev/null
changed=1
cat "$TMP/relay.mjs" > "$SOURCE"
cat "$TMP/providers.json" > "$CONF"
cat "$TMP/env" > "$ENVFILE"
chmod 0600 "$ENVFILE"
docker rm -f "$NAME" >/dev/null
launch_production
ok=0
for i in 1 2 3 4 5 6 7 8; do
 if curl -fsS --silent --max-time 2 http://127.0.0.1:8770/healthz > "$TMP/live.json"; then
  if python3 - "$TMP/live.json" <<'PY'
import json,sys
p=json.load(open(sys.argv[1]))
assert p.get('status')=='ready' and p.get('configuredNationalProviders')==2
PY
  then ok=1; break; fi
 fi
 sleep 1
done
[[ $ok == 1 ]] || { echo 'Upgrade did not start; rolling back'; false; }
changed=0
trap - ERR
printf 'EUROPE_SLIM_READY: '
cat "$TMP/live.json"
printf '\nOnly Europa Slim restarted. UK/RO services unchanged.\n'
