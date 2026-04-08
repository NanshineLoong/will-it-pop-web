#!/usr/bin/env bash
set -euo pipefail

ARTIFACT_PATH="${1:?usage: deploy-web.sh <artifact.tar.gz> <release-id>}"
RELEASE_ID="${2:?usage: deploy-web.sh <artifact.tar.gz> <release-id>}"

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

APP_DIR="/srv/will-it-pop/web"
RELEASE_DIR="${APP_DIR}/releases/${RELEASE_ID}"

if [[ -d "${RELEASE_DIR}" ]]; then
  ${SUDO} rm -rf "${RELEASE_DIR}"
fi

${SUDO} install -d -m 755 "${APP_DIR}/releases" "${RELEASE_DIR}"
${SUDO} tar -xzf "${ARTIFACT_PATH}" -C "${RELEASE_DIR}"
${SUDO} ln -sfn "${RELEASE_DIR}" "${APP_DIR}/current"

${SUDO} nginx -t
${SUDO} systemctl reload nginx
${SUDO} rm -f "${ARTIFACT_PATH}"

echo "Frontend release ${RELEASE_ID} is live at ${APP_DIR}/current"
