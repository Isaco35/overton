#!/usr/bin/env bash
# macOS / Linux equivalent of run_all.bat (that one is Windows-only: uses "py",
# "start", and cmd /k, none of which exist on Mac).
#
# Starts the local preview in the background, then optionally starts the public
# ngrok tunnel in the foreground. Ctrl+C stops the public tunnel; the local
# preview keeps running in the background until you kill it (this script
# prints its PID so you can).
cd "$(dirname "$0")"

python3 serve_preview.py --open &
PREVIEW_PID=$!
echo "Local preview running in background (PID $PREVIEW_PID). Kill it with: kill $PREVIEW_PID"

if [ -z "$NGROK_AUTHTOKEN" ]; then
  read -r -p "Enter ngrok auth token for public link (leave blank to skip): " NGROK_AUTHTOKEN
fi

if [ -n "$NGROK_AUTHTOKEN" ]; then
  python3 serve_public.py --open --authtoken "$NGROK_AUTHTOKEN"
else
  echo "No ngrok auth token provided. Public tunnel not started."
  echo "Local preview is still running in the background (PID $PREVIEW_PID)."
fi
