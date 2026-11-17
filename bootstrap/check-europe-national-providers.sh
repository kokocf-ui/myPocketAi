#!/usr/bin/env bash
# Safe read-only UK + RO checks for Europa Slim. No secrets printed or containers changed.
set -Eeuo pipefail
[[ "$(id -u)" == 0 ]] || { echo 'Run with sudo on Oracle'; exit 1; }
command -v curl >/dev/null && command -v python3 >/dev/null || { echo 'curl or python3 missing'; exit 1; }
echo 'SERVICE_HEALTH'
for item in 'RO:8766' 'GB:8768' 'EU:8770'; do
  country=${item%%:*}; port=${item##*:}
  response=$(curl -sS --max-time 4 "http://127.0.0.1:${port}/healthz" 2>/dev/null || true)
  printf '%s ' "$country"
  printf '%s' "$response" | python3 -c 'import sys,json; data=sys.stdin.read(); print(json.loads(data).get("status","unknown") if data else "unreachable")' 2>/dev/null || echo 'invalid_health'
done
token=$(sed -n 's/^EU_RELAY_TOKEN=//p' /etc/pocketai-europe-slim.env | head -1)
[[ ${#token} -ge 24 ]] || { echo 'EU relay token not configured'; exit 1; }
echo 'NATIONAL_ROUTE_CHECKS'
for country in RO GB; do
  if [[ "$country" == RO ]]; then
    origin='47.0465,21.9189'; dest='47.0550,21.9350'; zone='Europe/Bucharest'
  else
    origin='51.4760,0.3220'; dest='51.4840,0.3210'; zone='Europe/London'
  fi
  departure=$(python3 - "$zone" <<'PY'
import sys
from datetime import datetime,timedelta
from zoneinfo import ZoneInfo
z=ZoneInfo(sys.argv[1])
d=datetime.now(z)+timedelta(days=1)
print(d.replace(hour=10,minute=0,second=0,microsecond=0).isoformat())
PY
)
  payload=$(python3 - "$country" "$origin" "$dest" "$departure" <<'PY'
import json,sys
code,o,d,t=sys.argv[1:]
p=lambda s:dict(zip(('latitude','longitude'),map(float,s.split(','))))
print(json.dumps({'country':code,'from':p(o),'to':p(d),'departureAt':t,'limit':3}))
PY
)
  response=$(curl -sS --max-time 12 -X POST http://127.0.0.1:8770/v1/national-plan \
    -H 'Content-Type: application/json' -H "Authorization: Bearer $token" \
    --data "$payload" 2>/dev/null || true)
  printf '%s ' "$country"
  printf '%s' "$response" | python3 -c '
import json,sys
try:
 d=json.load(sys.stdin)
 routes=d.get("providers",[]) or []
 count=sum(len(p.get("journeys",[]) or [])+len(p.get("itineraries",[]) or []) for p in routes)
 lines=sum(len(p.get("lines",[]) or []) for p in routes)
 print("status="+str(d.get("status",d.get("error","unknown")))+" verified_journeys="+str(count)+" route_only="+str(lines))
except Exception: print("response_unavailable")
'
done
echo 'Read-only check completed; no configuration changes.'
