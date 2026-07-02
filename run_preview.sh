#!/usr/bin/env bash
# macOS / Linux equivalent of run_preview.bat / run_preview.ps1 (those are Windows-only).
# Run from anywhere: ./run_preview.sh
cd "$(dirname "$0")"
python3 serve_preview.py --open
