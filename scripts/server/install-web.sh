#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
APP_DIR="/srv/will-it-pop/web"
BOOTSTRAP_DIR="${APP_DIR}/bootstrap"
SITE_CONF_SOURCE="${REPO_ROOT}/ops/nginx/will-it-pop.conf"
SITE_CONF_TARGET="/etc/nginx/sites-available/will-it-pop"
SITE_LINK="/etc/nginx/sites-enabled/will-it-pop"

${SUDO} apt-get update
${SUDO} apt-get install -y nginx certbot python3-certbot-nginx

${SUDO} install -d -m 755 "${APP_DIR}/releases"

if [[ ! -e "${APP_DIR}/current" ]]; then
  ${SUDO} install -d -m 755 "${BOOTSTRAP_DIR}"
  printf '%s\n' '<!doctype html><html><head><meta charset="utf-8"><title>will-it-pop.online</title></head><body><h1>will-it-pop.online</h1><p>Web service bootstrapped. Deploy the frontend workflow next.</p></body></html>' | ${SUDO} tee "${BOOTSTRAP_DIR}/index.html" >/dev/null
  ${SUDO} ln -sfn "${BOOTSTRAP_DIR}" "${APP_DIR}/current"
fi

${SUDO} install -m 644 "${SITE_CONF_SOURCE}" "${SITE_CONF_TARGET}"
${SUDO} ln -sfn "${SITE_CONF_TARGET}" "${SITE_LINK}"

${SUDO} nginx -t
${SUDO} systemctl enable nginx
if ${SUDO} systemctl is-active --quiet nginx; then
  ${SUDO} systemctl reload nginx
else
  ${SUDO} systemctl start nginx
fi

echo "Web bootstrap complete."
echo "If port 80 is already occupied, inspect it with: sudo ss -ltnp | grep -E ':(80|443|8080)\\b'"
echo "After the first frontend deploy succeeds, request HTTPS with:"
echo "  sudo certbot --nginx -d will-it-pop.online"
