#!/usr/bin/env bash
# Read-only Romanian feed inventory and direct regional timetable checks.
set -Eeuo pipefail
for x in docker curl python3; do command -v "$x" >/dev/null || { echo "missing:$x"; exit 1; }; done
echo ROMANIA_FEED_METADATA
if [ -d /home/ubuntu/pocketai-romania/feeds ]; then
  find /home/ubuntu/pocketai-romania/feeds -maxdepth 1 -type f -name '*.json' -printf '%f %k_KiB\n' | sort
else
  echo feed_directory_missing
fi
echo ROMANIA_STARTUP
docker logs --tail 6 pocketai-romania-urban 2>&1 | grep -E 'loaded feed count|error|Error' || true
token=$(docker inspect pocketai-romania-urban --format '{{range .Config.Env}}{{println .}}{{end}}' | sed -n 's/^RO_GATEWAY_TOKEN=//p' | head -1)
if [ "${#token}" -lt 32 ]; then echo gateway_token_missing_or_invalid; exit 0; fi
echo ROMANIA_DIRECT_ROUTE_CHECKS
when=$(python3 - <<'PY'
from datetime import datetime,timedelta
from zoneinfo import ZoneInfo
print((datetime.now(ZoneInfo('Europe/Bucharest'))+timedelta(days=1)).strftime('%Y-%m-%d'))
PY
)
for city in oradea bucharest; do
  case "$city" in
  oradea) origin='{"latitude":47.0465,"longitude":21.9189}'; dest='{"latitude":47.0550,"longitude":21.9350}' ;;
  bucharest) origin='{"latitude":44.4268,"longitude":26.1025}'; dest='{"latitude":44.4320,"longitude":26.1100}' ;;
  esac
  response=$(curl -sS --max-time 10 -X POST http://127.0.0.1:8766/v1/plan \
    -H "Authorization: Bearer $token" -H 'Content-Type: application/json' \
    --data "{\"region\":\"$city\",\"from\":$origin,\"to\":$dest,\"date\":\"$when\",\"afterHHMM\":\"10:00\",\"maxResults\":3}" || true)
  printf '%s ' "$city"
  printf '%s' "$response" | python3 -c '
import json,sys
try:
 p=json.load(sys.stdin)
 print("status="+str(p.get("status",p.get("error","unknown")))+" journeys="+str(len(p.get("journeys",[]) or [])))
except Exception: print("response_unavailable")
'
done
echo READ_ONLY_COMPLETE
