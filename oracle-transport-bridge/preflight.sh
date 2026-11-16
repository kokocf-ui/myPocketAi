#!/usr/bin/env bash
# Read-only Oracle diagnostic: does not restart containers or print secrets.
set -euo pipefail
echo '=== POCKET AI: TRANSPORT ORACLE ==='
echo 'UTC:'; date -u '+%Y-%m-%d %H:%M:%S'
echo '=== DISK / RAM ==='; df -h /; free -h
echo '=== CONTAINERE ==='
sudo docker ps --filter name=pocketai-romania-urban --filter name=pocketai-england-local --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
echo '=== LOOPBACK ==='
for region in RO GB; do
  if [[ "$region" == RO ]]; then port=8766; else port=8768; fi
  printf '%s port %s: ' "$region" "$port"
  if curl --silent --show-error --fail --max-time 6 "http://127.0.0.1:$port/healthz"; then echo; else echo 'UNAVAILABLE'; fi
done
echo '=== LISTEN SOCKETS ==='
sudo ss -ltn | awk 'NR==1 || $4 ~ /:(8766|8768)$/'
echo '=== CLOUDFLARED ==='
if command -v cloudflared >/dev/null 2>&1; then cloudflared --version
else echo 'Not installed'; fi
if systemctl list-unit-files --no-legend cloudflared.service 2>/dev/null | grep -q cloudflared; then
 echo 'Existing cloudflared.service:'; systemctl is-active cloudflared || :
fi
if systemctl list-unit-files --no-legend pocketai-transit-tunnel.service 2>/dev/null | grep -q pocketai-transit-tunnel; then
 echo 'Pocket AI transport tunnel:'; systemctl is-active pocketai-transit-tunnel || :
fi
echo '=== CONFIG FILES (existence only, no secrets) ==='
for name in /home/ubuntu/pocketai-transport-src/oracle-romania-transport/.env /home/ubuntu/pocketai-transport-src/oracle-england-transport/.env; do
 if [[ -f "$name" ]]; then echo "PRESENT: $name"; else echo "MISSING: $name"; fi
done
echo '=== NO MUTATIONS PERFORMED ==='
