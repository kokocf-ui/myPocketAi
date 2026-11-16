#!/usr/bin/env bash
# Installs cloudflared from Cloudflare's signed Ubuntu/Debian package repository.
# Does NOT install/start a tunnel service or expose any port.
set -euo pipefail
if command -v cloudflared >/dev/null 2>&1; then
 echo 'cloudflared already installed:'; cloudflared --version; exit 0
fi
if ! command -v apt-get >/dev/null 2>&1; then
 echo 'This script supports Ubuntu/Debian only.' >&2; exit 1
fi
if ! command -v curl >/dev/null 2>&1; then
 echo 'curl is required.' >&2; exit 1
fi
sudo install -d -m 0755 /usr/share/keyrings
curl --fail --silent --show-error --location https://pkg.cloudflare.com/cloudflare-main.gpg |
  sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
sudo chmod 0644 /usr/share/keyrings/cloudflare-main.gpg
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' |
  sudo tee /etc/apt/sources.list.d/cloudflared.list >/dev/null
sudo apt-get update -q
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y cloudflared
cloudflared --version
echo 'Installed, not activated. No tunnel token was requested.'
