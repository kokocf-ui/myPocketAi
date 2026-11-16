#!/usr/bin/env bash
# Run ONE bounded eight-region BODS SHA comparison independent of SSH lifetime.
# Only log and state files are written inside the private audit folder.
# Timetable ZIPs are streamed into hashes; databases and services unchanged.
set -Eeuo pipefail
umask 077
S="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
A=/home/ubuntu/pocketai-england-audit
SCRIPT="$S/oracle-transport-bridge/verify-bods-regional-sha.py"
SELF="$S/oracle-transport-bridge/run-bods-eight-sha-detached.sh"
LOG="$A/.bods-eight-sha-once.log"
PIDFILE="$A/.bods-eight-sha-once.pid"
STATE="$A/.bods-eight-sha-once.status"
LOCK="$A/.bods-eight-sha-once.lock"
REGIONS=en-em,en-ne,en-nw,en-se,en-sw,en-wm,en-yorkshire,en-london

if [[ "$(id -un)" != ubuntu || ! -d "$A" || -L "$A" ||
      ! -w "$A" || ! -f "$SCRIPT" ]]; then
 echo 'STOP: unsafe account, source or audit directory' >&2
 exit 2
fi

if [[ "${1:-}" == "--worker" ]]; then
 [[ $# -eq 1 ]] || exit 2
 exec 9>"$LOCK"
 if ! flock -n 9; then
  echo "STOP: another BODS eight-region audit is running"
  exit 3
 fi
 echo "START: checking eight BODS ZIP SHA digests (stream only, max 2GB)"
 echo "All downloaded bytes discarded; production and SQLite untouched."
 if python3 -u "$SCRIPT" --regions "$REGIONS" --progress; then
  printf 'COMPLETE_SUCCESS\n' > "$STATE.tmp"
  mv "$STATE.tmp" "$STATE"
  echo "COMPLETE_SUCCESS: inspect EXACT_ARCHIVE_SHA_MATCH versus CHANGED in log"
 else
  code=$?
  printf 'COMPLETE_WITH_ERROR exit=%s\n' "$code" > "$STATE.tmp"
  mv "$STATE.tmp" "$STATE"
  echo "COMPLETE_WITH_ERROR: inspect error; do not blindly rerun"
  exit "$code"
 fi
 exit 0
fi

[[ $# -eq 0 ]] || { echo 'Usage: run-bods-eight-sha-detached.sh' >&2; exit 2; }
# The interrupted foreground SSH session may have left a Python job running.
# Do not start another download while it is active.
if ps -C python3 -o args= 2>/dev/null | grep -Fq '/verify-bods-regional-sha.py'; then
 echo "ALREADY_RUNNING: existing BODS regional SHA Python process detected."
 echo "No second download started."
 exit 0
fi
if [[ -e "$LOG" || -L "$LOG" || -e "$STATE" || -e "$PIDFILE" ]]; then
 echo "EXISTING_RUN_RECORD: not overwriting or redownloading."
 [[ ! -f "$STATE" ]] || cat "$STATE"
 [[ ! -f "$LOG" ]] || tail -n 12 "$LOG"
 exit 0
fi
# Atomic exclusive log creation guards duplicate starts over separate SSH calls.
if ! (set -C; : > "$LOG") 2>/dev/null; then
 echo 'ALREADY_STARTED: log exists, refusing duplicate launch'
 exit 0
fi
nohup bash "$SELF" --worker >> "$LOG" 2>&1 < /dev/null &
worker_pid=$!
printf '%s\n' "$worker_pid" > "$PIDFILE"
echo "LAUNCHED_DETACHED: PID $worker_pid"
echo "LOG: $LOG"
echo "STATE: $STATE"
echo "Disconnecting Termux no longer cancels the SHA check."
