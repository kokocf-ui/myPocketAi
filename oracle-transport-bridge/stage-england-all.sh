#!/usr/bin/env bash
# Stage and verify England BODS GTFS snapshots ONLY in the private audit folder.
# No runtime mounts, container restarts, production API changes or new tokens.
set -Eeuo pipefail
umask 077

ROOT="$(cd "$(dirname "$0")/.." && pwd -P)"
AUDIT=/home/ubuntu/pocketai-england-audit
STAGER="$ROOT/oracle-transport-bridge/stage-england-bods.py"
IMPORTER="$ROOT/gtfs_sqlite_store.py"
MIN_FREE_KB=8388608  # 8 GiB reserve prior to every import

if [[ $# -ne 0 || "$(id -un)" != ubuntu ]]; then
  echo 'ERROR: invoke without arguments as ubuntu' >&2
  exit 2
fi
if [[ ! -f "$STAGER" || ! -f "$IMPORTER" || ! -d "$AUDIT" || -L "$AUDIT" || ! -w "$AUDIT" ]]; then
  echo 'ERROR: missing or unsafe isolated staging paths' >&2
  exit 2
fi
if [[ "$(readlink -f "$AUDIT")" != "$AUDIT" ]]; then
  echo 'ERROR: audit path was redirected' >&2
  exit 2
fi

# Non-blocking process-wide file lock. Another audit cannot run concurrently.
exec 9>"$AUDIT/.stage-all.lock"
if ! flock -n 9; then
  echo 'ERROR: an England staging run is already active' >&2
  exit 2
fi

echo "England GTFS audit-only staging, source: $(git -C "$ROOT" rev-parse --short HEAD)"
for region in en-ea en-em en-ne en-nw en-se en-sw en-wm en-yorkshire en-london; do
  echo "=== $region ==="
  db="$AUDIT/$region.sqlite3"
  index="$AUDIT/$region.index.json"
  provenance="$AUDIT/$region.provenance.json"
  if [[ -L "$db" || -L "$index" || -L "$provenance" ]]; then
    echo "ERROR: symlink snapshot refused for $region" >&2
    exit 1
  fi
  if [[ -e "$db" || -e "$index" || -e "$provenance" ]]; then
    if [[ ! -f "$db" || ! -f "$index" || ! -f "$provenance" ]]; then
      echo "ERROR: incomplete existing $region snapshot; no overwrite attempted" >&2
      exit 1
    fi
    echo 'Existing snapshot: verifying; no overwrite.'
  else
    free_kb="$(df -Pk "$AUDIT" | awk 'NR==2 {print $4}')"
    if [[ ! "$free_kb" =~ ^[0-9]+$ ]] || (( free_kb < MIN_FREE_KB )); then
      echo "ERROR: insufficient free disk for new $region import; stopping safely" >&2
      exit 1
    fi
    echo "Importing $region (staging only, one region at a time)."
    nice -n 10 python3 -u "$STAGER" --stage --regions "$region"
  fi

  python3 - "$AUDIT" "$region" <<'PY'
import json, sqlite3, sys
from pathlib import Path
root=Path(sys.argv[1])
region=sys.argv[2]
db_path=root/(region+'.sqlite3')
idx_path=root/(region+'.index.json')
prov_path=root/(region+'.provenance.json')
assert all(p.is_file() and not p.is_symlink() for p in (db_path,idx_path,prov_path))
idx=json.loads(idx_path.read_text())
prov=json.loads(prov_path.read_text())
stat=db_path.stat()
assert idx.get('backend')=='sqlite' and idx.get('country')=='GB' and idx.get('region')==region
assert idx.get('snapshotBytes')==stat.st_size
assert idx.get('snapshotMtimeMs')==stat.st_mtime_ns//1000000
assert prov.get('region')==region and prov.get('status')=='staged_not_activated'
assert prov.get('rights_status')=='OGL_UK_attribution_required'
with sqlite3.connect('file:'+str(db_path)+'?mode=ro',uri=True) as db:
    check=db.execute('PRAGMA quick_check').fetchone()
    assert check and check[0]=='ok', ('invalid_db',region)
    tables={name:db.execute('SELECT COUNT(*) FROM '+name).fetchone()[0]
            for name in ('stops','routes','trips','stop_times','calendar','calendar_dates')}
    assert all(tables[name]>0 for name in ('stops','routes','trips','stop_times'))
    assert tables['calendar']>0 or tables['calendar_dates']>0
assert len(idx.get('positions',[]))==tables['stops']
print(json.dumps({'region':region,'result':'STAGED_VERIFIED_ONLY','tables':tables,'db_bytes':stat.st_size},separators=(',',':')),flush=True)
PY
done
echo 'PASS: all nine BODS regions staged and verified; NOT LIVE'
du -sh "$AUDIT"
df -h "$AUDIT"
