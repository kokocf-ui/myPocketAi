#!/usr/bin/env bash
# Safe, one-region-at-a-time BODS compaction / full-row / live-like HTTP parity.
# Snapshots remain audit-only; no live mount, API, key, or container changes.
set -Eeuo pipefail
umask 077
S="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
A=/home/ubuntu/pocketai-england-audit
P=/home/ubuntu/pocketai-england-compact-pilot
RESERVE_KB=16777216 # Keep 16 GiB for Romania, communications and future Europe.
if [[ $# -ne 2 || "$1" != "--region" ]]; then
 echo "Usage: bash run-england-compact-validate.sh --region en-ne" >&2
 exit 2
fi
REGION="$2"
case "$REGION" in
  en-ea|en-em|en-ne|en-nw|en-se|en-sw|en-wm|en-yorkshire|en-london) ;;
  *) echo "ERROR: only nine vetted English regions permitted" >&2; exit 2;;
esac
if [[ "$(id -un)" != ubuntu ]]; then
 echo "ERROR: use ubuntu account; never root" >&2
 exit 2
fi
if [[ ! -d "$A" || -L "$A" || ! -d "$P" || -L "$P" || ! -w "$P" ]]; then
 echo "ERROR: audit/compact pilot directories missing or unsafe" >&2
 exit 2
fi
SOURCE="$A/$REGION.sqlite3"
DEST="$P/$REGION.sqlite3"
INDEX="$P/$REGION.index.json"
for file in "$SOURCE" "$A/$REGION.index.json"; do
 if [[ ! -f "$file" || -L "$file" ]]; then
  echo "ERROR: required original snapshot/index absent or symlink: $file" >&2
  exit 2
 fi
done
if [[ -L "$DEST" || -L "$INDEX" ]]; then
 echo "ERROR: compact snapshot/index symlink refused" >&2
 exit 2
fi
exec 9>"$P/.compact-validation.lock"
if ! flock -n 9; then
 echo "ERROR: another compact validation is active" >&2
 exit 2
fi
echo "=== $REGION : AUDIT ONLY ==="
if [[ ! -e "$DEST" ]]; then
 free_kb="$(df -Pk "$P" | awk 'NR==2 {print $4}')"
 source_kb="$(du -k "$SOURCE" | awk '{print $1}')"
 if [[ ! "$free_kb" =~ ^[0-9]+$ || ! "$source_kb" =~ ^[0-9]+$ ]]; then
  echo "ERROR: failed to measure available disk" >&2
  exit 1
 fi
 # Reserve plus 2x source size for a safe copy + working space.
 if (( free_kb < RESERVE_KB + 2 * source_kb )); then
  echo "ERROR: stopping; not enough space to preserve >=16 GiB after pilot" >&2
  exit 1
 fi
 echo "=== BUILD COMPACT PILOT ==="
 nice -n 10 python3 "$S/oracle-transport-bridge/pilot-compact-east-anglia.py" --region "$REGION"
else
 if [[ ! -f "$DEST" ]]; then
  echo "ERROR: existing compact target is not regular file" >&2
  exit 1
 fi
 echo "=== REUSE EXISTING PILOT WITHOUT OVERWRITE ==="
fi

echo "=== COMPARE EVERY GTFS ROW ==="
nice -n 10 python3 "$S/oracle-transport-bridge/verify-east-anglia-compact.py" --region "$REGION"
echo "=== COMPARE REAL DATED NODE HTTP JOURNEYS ==="
bash "$S/oracle-transport-bridge/run-east-anglia-http-isolated.sh" --region "$REGION"
echo "=== AVAILABLE DISK ==="
df -h "$P"
echo "PASS: $REGION data and real HTTP journey sample agree; PILOT ONLY, NOT LIVE"
