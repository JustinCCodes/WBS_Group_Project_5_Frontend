#!/usr/bin/env bash
set -e

# Script to wait for Next.js dev server and then start Tauri
# This ensures the frontend is ready before Tauri tries to load it

URL="http://localhost:3000"
TIMEOUT=60
START=$SECONDS

echo "⏳ Waiting for Next.js dev server at $URL..."

while true; do
  # Check if server is responding
  if curl -sSf "$URL" >/dev/null 2>&1; then
    echo "Next.js is ready!"
    echo "Starting Tauri desktop app..."
    npm run tauri dev
    exit 0
  fi

  # Check timeout
  if (( SECONDS - start > TIMEOUT )); then
    echo "Timeout: Next.js dev server did not start within ${TIMEOUT}s"
    exit 1
  fi

  # Wait a bit before trying again
  sleep 1
done
