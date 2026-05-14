#!/bin/zsh
set -e

cd "$(dirname "$0")"

existing="$(lsof -tiTCP:8011 -sTCP:LISTEN || true)"
if [[ -n "$existing" ]]; then
  kill $existing
fi

python3 -B preview_server.py
