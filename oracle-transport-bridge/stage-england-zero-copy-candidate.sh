#!/usr/bin/env bash
# Stage only: nine GTFS compact snapshots as zero-copy hardlinks.
# Active England feed directory, running containers and tokens are untouched.
set -Eeuo pipefail
umask 077
S="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
A=/home/ubuntu/pocketai-england-audit
P=/home/ubuntu/pocketai-england-compact-pilot
LIVE=/home/ubuntu/pocketai-england/feeds
ROOT=/home/ubuntu/pocketai-england-candidate
WORK="$ROOT/feeds.building"
READY="$ROOT/feeds"
IMAGE=pocketai-england-parity:test
REGIONS=(en-ea en-em en-ne en-nw en-se en-sw en-wm en-yorkshire en-london)
if [[ $# -ne 0 || "$(id -un)" != ubuntu ]]; then
 echo "ERROR: run with no arguments as ubuntu, not root" >&2; exit 2
fi
for d in "$A" "$P" "$LIVE"; do
 [[ -d "$d" && ! -L "$d" ]] || { echo "ERROR: missing/unsafe source directory" >&2; exit 2; }
done
[[ ! -e "$READY" && ! -L "$READY" && ! -e "$WORK" && ! -L "$WORK" ]] || {
 echo "STOP: candidate staging path already exists. Do not overwrite." >&2; exit 2;
}
echo '=== READ-ONLY PREFLIGHT ==='
python3 "$S/oracle-transport-bridge/preflight-england-compact-activation.py" |
 python3 -c 'import json,sys
d=json.load(sys.stdin)
if d.get("status")!="PREFLIGHT_ONLY_NO_DEPLOYMENT" or d.get("regions_with_original_and_compact_indexes")!=9:
  sys.exit("STOP: nine indexes not validated")
if d.get("same_device_hardlink_ready") is not True:
  sys.exit("STOP: snapshots are not on same filesystem")
if d.get("docker",{}).get("feed_mount_expected") is not True or d.get("docker",{}).get("running") is not True:
  sys.exit("STOP: active England container layout unexpected")
print("Verified compact GiB:",d["compact_total_gib"],"originals retained")'
sudo docker image inspect "$IMAGE" >/dev/null
echo '=== MAKE SEPARATE NONPRODUCTION CANDIDATE ==='
sudo install -d -o 10001 -g 10001 -m 0700 "$WORK"
for r in "${REGIONS[@]}"; do
 for ext in sqlite3 index.json; do
  p="$P/$r.$ext"
  q="$WORK/$r.$ext"
  [[ -f "$p" && ! -L "$p" && ! -e "$q" && ! -L "$q" ]] || {
   echo "STOP: invalid candidate snapshot/index" >&2; exit 2;
  }
  # Change compact pilot files ONLY: allow container group 10001 to read.
  # No public 0644 permissions. Original audit is unchanged.
  sudo chgrp 10001 "$p"
  sudo chmod 0640 "$p"
  sudo ln "$p" "$q"
  [[ "$(stat -c '%d:%i' "$p")" == "$(sudo stat -c '%d:%i' "$q")" ]] || {
   echo "STOP: hardlink identity mismatch" >&2; exit 2;
  }
 done
done
echo '=== CHECK NODE/PYTHON AS LIVE CONTAINER USER 10001 ==='
OPTS=(--rm --network none --read-only --tmpfs /tmp:rw,nosuid,nodev,size=64m
 --cap-drop ALL --security-opt no-new-privileges --pids-limit 64
 --memory 1g --cpus 1 --user 10001:10001
 --mount "type=bind,src=$WORK,dst=/data/feeds,readonly")
sudo docker run "${OPTS[@]}" --entrypoint node "$IMAGE" --input-type=module -e '
 import {openGtfsFeedCatalog} from "/app/regional_gtfs_catalog.mjs";
 const c=openGtfsFeedCatalog("/data/feeds",{country:"GB"});
 console.log("Readable regional GTFS feeds:",c.count);
 if(c.count!==9)process.exit(2);'
sudo docker run "${OPTS[@]}" --entrypoint python3 "$IMAGE" -c '
import pathlib,sqlite3
dbs=sorted(pathlib.Path("/data/feeds").glob("*.sqlite3"))
if len(dbs)!=9:raise SystemExit("Missing compact feeds")
for p in dbs:
 c=sqlite3.connect(p.as_uri()+"?mode=ro&immutable=1",uri=True)
 if c.execute("SELECT count(*) FROM stops").fetchone()[0]<1:
  raise SystemExit("Empty regional stops")
 c.close()
print("SQLite verified as UID 10001:",len(dbs))'
sudo mv "$WORK" "$READY"
echo '=== STAGED ONLY; ENGLAND LIVE AND OTHER SERVICES UNCHANGED ==='
df -h /
echo 'PASS: 9 compact England feeds prepared as zero-copy test candidate. NOT LIVE.'
