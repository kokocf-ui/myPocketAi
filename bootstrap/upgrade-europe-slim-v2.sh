#!/usr/bin/env bash
# myPocketAI Europe Slim v2: no feeds, no new Docker images, only EU relay container changed.
set -Eeuo pipefail
if [[ $(id -u) != 0 ]]; then echo 'Use sudo bash for Oracle.' >&2; exit 1; fi
NAME=pocketai-europe-slim
FILE=/opt/pocketai-europe-slim/relay.mjs
CONFIG=/etc/pocketai-europe-slim.providers.json
ENVFILE=/etc/pocketai-europe-slim.env
PORTFILE=/opt/pocketai-europe-slim/port
SOURCE='https://raw.githubusercontent.com/kokocf-ui/myPocketAi/7c699b4658f6c4f82eca2272eca2320805cfc800/bootstrap/europe-relay-v2.mjs.gz'
EXPECTED='74fc6785873b8bed6203ba88067b504517a46d5466532023b5c26434d82117e7'
for binary in curl python3 gzip docker sha256sum awk; do command -v "$binary" >/dev/null || { echo "Missing $binary; unchanged"; exit 1; }; done
[[ -f "$FILE" && -f "$CONFIG" && -f "$ENVFILE" && -f "$PORTFILE" ]] || { echo 'EU v1 installation not found; unchanged'; exit 1; }
PORT=$(cat "$PORTFILE")
[[ "$PORT" =~ ^877[0-5]$ ]] || { echo 'Unexpected Europe port; unchanged'; exit 1; }
docker inspect "$NAME" --format '{{.State.Running}}' 2>/dev/null | grep -qx true || { echo 'Europe container not running; unchanged'; exit 1; }
docker image inspect node:22-alpine >/dev/null || { echo 'Existing node:22-alpine missing; unchanged'; exit 1; }
work=$(mktemp -d /tmp/europe-slim-upgrade.XXXXXXXX)
chmod 0700 "$work"
changed=0
restore(){
  trap - ERR
  if [[ "$changed" == 1 ]]; then
    echo 'Europe Slim upgrade failed; restoring original relay and config' >&2
    cat "$work/relay.old" > "$FILE"
    cat "$work/providers.old" > "$CONFIG"
    cat "$work/env.old" > "$ENVFILE"
    chmod 0600 "$ENVFILE"
    docker rm -f "$NAME" >/dev/null 2>&1 || true
    launch || true
  fi
}
cleanup(){ rm -rf "$work"; }
trap restore ERR
trap cleanup EXIT
curl -fsSL --retry 2 --max-time 35 "$SOURCE" -o "$work/relay.gz"
printf '%s  %s\n' "$EXPECTED" "$work/relay.gz" | sha256sum -c --status || { echo 'Checksum mismatch; unchanged'; exit 1; }
gzip -dc "$work/relay.gz" > "$work/relay.new"
docker run --rm --network none --read-only --user 10001:10001 --cap-drop ALL --security-opt no-new-privileges \
  -v "$work/relay.new:/app/relay.mjs:ro" node:22-alpine node --check /app/relay.mjs
# Save only local relay configuration; do not modify UK/RO containers, feeds or their secrets.
cp "$FILE" "$work/relay.old"
cp "$CONFIG" "$work/providers.old"
cp "$ENVFILE" "$work/env.old"
chmod 0600 "$work/env.old"
changed=1
port_of(){
  local c=$1
  docker port "$c" 3000/tcp 2>/dev/null | awk -F: '$1=="127.0.0.1"{print $2;exit}'
}
secret_of(){
  local c=$1; shift
  docker inspect "$c" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null |
    awk -v list=" $* " 'index(list," " substr($0,1,index($0,"=")-1) " ")>0 {v=substr($0,index($0,"=")+1);if(length(v)>=32){print v;exit}}'
}
roport=$(port_of pocketai-romania-urban || true)
gbport=$(port_of pocketai-england-local || true)
rotoken=$(secret_of pocketai-romania-urban RO_GATEWAY_TOKEN || true)
gbtoken=$(secret_of pocketai-england-local EN_GATEWAY_TOKEN EN_URBAN_API_TOKEN GATEWAY_TOKEN || true)
for country in RO GB; do
  if [[ $country == RO ]]; then p=$roport; t=$rotoken; else p=$gbport; t=$gbtoken; fi
  if [[ "$p" != 8764 && "$p" != 8765 && "$p" != 8766 ]]; then continue; fi
  if [[ ${#t} -lt 32 ]]; then continue; fi
  if ! curl -fsS --max-time 3 "http://127.0.0.1:$p/healthz" >/dev/null; then continue; fi
  if ! grep -q "^EU_UPSTREAM_${country}_TOKEN=" "$ENVFILE"; then
    printf 'EU_UPSTREAM_%s_TOKEN=%s\n' "$country" "$t" >> "$ENVFILE"
  fi
  export "EU_V2_${country}_PORT=$p"
done
chmod 0600 "$ENVFILE"
python3 - "$CONFIG" <<'PY'
import json,os,sys
p=sys.argv[1]
with open(p,encoding='utf-8') as f: providers=json.load(f)
if not isinstance(providers,list): raise ValueError('invalid current provider config')
for code,ident,bbox in [('RO','ro-oracle-urban',[19.5,43.5,30.0,48.5]),('GB','gb-oracle-urban',[-6.5,49.9,2.1,55.9])]:
 port=os.getenv(f'EU_V2_{code}_PORT')
 if not port: continue
 new={'id':ident,'kind':'local_gtfs','baseUrl':f'http://127.0.0.1:{port}',
      'country':code,'bbox':bbox,'enabled':True,'licenseApproved':True,
      'tokenEnv':f'EU_UPSTREAM_{code}_TOKEN'}
 providers=[x for x in providers if x.get('id')!=ident]
 providers.append(new)
with open(p,'w',encoding='utf-8') as f: json.dump(providers,f,ensure_ascii=False,indent=2)
PY
chmod 0644 "$CONFIG"
# Copy in-place so the previously mounted file inode remains valid until restart.
cat "$work/relay.new" > "$FILE"
chmod 0644 "$FILE"
launch(){
 docker run -d --name "$NAME" --restart unless-stopped --network host \
  --user 10001:10001 --read-only --cap-drop ALL --security-opt no-new-privileges \
  --memory 192m --pids-limit 32 --cpus 0.5 --log-driver local --log-opt max-size=1m --log-opt max-file=2 \
  --env-file "$ENVFILE" -e EU_RELAY_PORT="$PORT" -e EU_RELAY_PROVIDERS_FILE="$CONFIG" \
  -e NODE_OPTIONS=--max-old-space-size=80 \
  -v "$FILE:/app/relay.mjs:ro" -v "$CONFIG:$CONFIG:ro" \
  node:22-alpine node /app/relay.mjs >/dev/null
}
docker rm -f "$NAME" >/dev/null
launch
sleep 2
curl -fsS --max-time 4 "http://127.0.0.1:$PORT/healthz"
changed=0
trap - ERR
printf '\nEurope Slim v2 running on localhost:%s. Other containers unchanged.\n' "$PORT"
df -h /
