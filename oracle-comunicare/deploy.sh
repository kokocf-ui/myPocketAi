#!/bin/sh
# Use on existing Oracle VM only: sh deploy.sh prepare; then sh deploy.sh activate
set -eu
cd "$(dirname "$0")"
MODE="\${1:-}"
DOMAIN=mypocketai.duckdns.org
if [ "$MODE" = prepare ]; then
  mkdir -p "$HOME/pocketai-comunicare/config"
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  cp compose.yaml "$HOME/pocketai-comunicare/config/compose-$stamp.yaml"
  sudo docker image tag pocketai-comunicare-gateway:local "pocketai-comunicare-gateway:backup-$stamp"
  umask 077
  if [ ! -f .env ]; then
    printf 'PGDATABASE=pocket_comm\nPGUSER=pocket_comm\nPGPASSWORD=%s\n' "$(openssl rand -hex 32)" >.env
    chmod 600 .env
  fi
  sudo docker compose config --quiet
  sudo docker compose up -d --build
  n=0
  while [ "$n" -lt 20 ]; do
    if curl -fsS --max-time 3 http://127.0.0.1:8765/readyz; then
      printf '\nORACLE_GATEWAY_READY\n'
      exit 0
    fi
    n=$((n+1));sleep 3
  done
  echo 'Gateway not ready. Caddy was not modified.' >&2
  sudo docker compose ps
  exit 1
elif [ "$MODE" = activate ]; then
  curl -fsS --max-time 5 http://127.0.0.1:8765/readyz >/dev/null
  tmp="$(mktemp)"
  trap 'rm -f "$tmp"' EXIT HUP INT TERM
  cat >"$tmp" <<'CADDY'
mypocketai.duckdns.org {
    handle /api/communication {
        reverse_proxy 127.0.0.1:8765
    }
    handle /i/* {
        reverse_proxy 127.0.0.1:8765
    }
    handle {
        respond "myPocket AI - HTTPS activ; comunicare privata" 200
    }
}
CADDY
  sudo caddy validate --config "$tmp" --adapter caddyfile
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  sudo cp /etc/caddy/Caddyfile "/etc/caddy/Caddyfile.before-communication-$stamp"
  sudo cp "$tmp" /etc/caddy/Caddyfile
  if ! sudo systemctl reload caddy; then
    sudo cp "/etc/caddy/Caddyfile.before-communication-$stamp" /etc/caddy/Caddyfile
    sudo systemctl reload caddy || true
    echo 'Caddy reload failed: previous config restored' >&2
    exit 1
  fi
  curl -fsS --max-time 15 "https://$DOMAIN/" >/dev/null
  echo CADDY_HTTPS_READY
else
  echo 'Use: sh deploy.sh prepare OR sh deploy.sh activate' >&2
  exit 2
fi
