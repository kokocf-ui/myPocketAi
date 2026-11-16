#!/usr/bin/env bash
# Run interactively ON THE ORACLE VM only after creating a Cloudflare Workers
# VPC Tunnel. This does not require a custom domain or public DNS routes.
# Never paste the token into GitHub, this chat, arguments, or the shell history.
set -euo pipefail
if [[ ! -t 0 ]]; then echo 'Interactive terminal required (ssh -tt).' >&2; exit 2; fi
if ! command -v cloudflared >/dev/null 2>&1; then
 echo 'Install cloudflared first (install-cloudflared.sh).' >&2;exit 1
fi
if sudo systemctl is-active --quiet cloudflared.service; then
 echo 'Existing cloudflared tunnel is active. Reuse its existing routes; do not install a second service.' >&2
 exit 1
fi
if sudo systemctl list-unit-files --no-legend pocketai-transit-tunnel.service 2>/dev/null |grep -q pocketai-transit-tunnel; then
 echo 'Transport tunnel service already exists. Refusing to overwrite.' >&2;exit 1
fi
for port in 8766 8768; do
 if ! curl -fsS --max-time 6 "http://127.0.0.1:$port/healthz" >/dev/null; then
  echo "Local transport service on $port is not healthy; aborting." >&2;exit 1
 fi
done
echo 'Only a private Workers VPC Tunnel is needed. No public hostname is required.'
echo 'After the connector is healthy, configure TWO scoped VPC Services:'
echo '  Romania -> 127.0.0.1, HTTP 8766'
echo '  England -> 127.0.0.1, HTTP 8768'
echo 'The origin Bearer API tokens must remain private in the Eva Worker.'
read -r -p 'Confirm the Workers VPC Tunnel is created (type YES): ' confirm
if [[ "$confirm" != YES ]]; then echo 'No changes'; exit 1; fi
echo 'Paste the tunnel connector token invisibly; it is NOT an Access Client Secret.'
IFS= read -r -s -p 'Tunnel connector token: ' TUNNEL_TOKEN
echo
if [[ ${#TUNNEL_TOKEN} -lt 50 ]]; then
 echo 'Token unexpectedly short; aborting.' >&2
 unset TUNNEL_TOKEN
 exit 1
fi
sudo groupadd --system cloudflared 2>/dev/null || :
if ! id -u cloudflared >/dev/null 2>&1; then
 sudo useradd --system --no-create-home --shell /usr/sbin/nologin --gid cloudflared cloudflared
fi
sudo install -d -o root -g cloudflared -m 0750 /etc/pocketai-transit-tunnel
printf '%s' "$TUNNEL_TOKEN" | sudo tee /etc/pocketai-transit-tunnel/token >/dev/null
unset TUNNEL_TOKEN
sudo chown root:cloudflared /etc/pocketai-transit-tunnel/token
sudo chmod 0640 /etc/pocketai-transit-tunnel/token
# Separate unit name avoids touching preexisting communications services.
sudo tee /etc/systemd/system/pocketai-transit-tunnel.service >/dev/null <<'UNIT'
[Unit]
Description=PocketAI transport Cloudflare Tunnel (Romania and England only)
Wants=network-online.target
After=network-online.target
[Service]
Type=simple
User=cloudflared
Group=cloudflared
ExecStart=/usr/bin/cloudflared tunnel run --token-file /etc/pocketai-transit-tunnel/token
Restart=on-failure
RestartSec=10
NoNewPrivileges=yes
PrivateTmp=yes
ProtectSystem=strict
ProtectHome=yes
CapabilityBoundingSet=
AmbientCapabilities=
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload
sudo systemctl enable --now pocketai-transit-tunnel.service
echo 'Tunnel service state (no token is displayed):'
sudo systemctl is-active pocketai-transit-tunnel.service
echo 'Check Workers VPC > Tunnels: HEALTHY, then create two private VPC Services.'
echo 'No public DNS records, custom domain, or Access applications are necessary.'
