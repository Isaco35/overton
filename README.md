# Harrow Preview Hosting

A simple local static server for sharing the Harrow preview with others on the same machine or LAN.

**Status: proof of concept, work in progress.** The Overton window model this serves is not a finished analytical product — see `Overton/overton_070.jsx`'s in-app banner and its Methodology → Bias Audit tab before sharing the public link with anyone.

**2026-07-01 migration note:** the live build moved to `Overton/` (was scattered between the repo root and a nonexistent `Proper/` folder — that reference was dead and never resolved to a real path). `serve_preview.py` and `serve_public.py` now serve from `Overton/` directly. If you're running an older checkout, pull the folder again before using `run_all.bat`.

## Run the preview server

**This project is used on both Windows and macOS.** The `.py` scripts themselves are
plain Python and work on either — only the one-click wrapper scripts differ, because
`.bat`/`.ps1` don't run on macOS and macOS doesn't have the `py` launcher.

### Option 1: Use the Python server directly

macOS / Linux:
```bash
python3 serve_preview.py
```

Windows:
```powershell
py serve_preview.py
```

Then open:

- `http://127.0.0.1:8000/overton_preview.html`

### Option 2: One-click script

macOS / Linux:
```bash
./run_preview.sh
```

Windows — double-click `run_preview.bat`, or in PowerShell:
```powershell
.\run_preview.ps1
```

This starts the server and opens the preview automatically.

If the server is bound to `0.0.0.0`, others on your LAN can open:

- `http://<your-local-ip>:8000/overton_preview.html`

## Options

Same flags on both platforms (swap `python3` for `py` on Windows):

- `python3 serve_preview.py --open` opens the preview in your browser automatically.
- `python3 serve_preview.py --port 8080` uses a different port.
- `python3 serve_preview.py --host 0.0.0.0` makes it available to other devices on your network.

## Public sharing with ngrok

To expose the preview publicly, install `pyngrok`:

macOS / Linux:
```bash
python3 -m pip install pyngrok
```

Windows:
```powershell
py -m pip install pyngrok
```

Then run (macOS/Linux: `python3`, Windows: `py`):

```bash
python3 serve_public.py --open
```

Or use the one-click script — `./run_all.sh` on macOS/Linux, `run_all.bat` on Windows —
which starts the local preview in the background and prompts for an ngrok token.

The script will print a `Public:` URL you can share with anyone on the internet.

If you have an ngrok auth token, use it for a stable tunnel:

```bash
python3 serve_public.py --open --authtoken <YOUR_NGROK_TOKEN>
```

## Notes

- This does not upload the preview to the internet; it only shares it locally (unless you run `serve_public.py` with ngrok, which does expose it).
- The preview depends on `Overton/overton_070.jsx` being present — that's the current build. `Overton/overton_dev.jsx` is a legacy, unmaintained in-app dev tab and is not served by anything here.
- The dev log for this project is `Overton/harrow_dev_alpha070_final.md` (continues `harrow_dev_alpha050_final.md`, kept here at the repo root as historical record). The briefing/state file is `Overton/harrow-briefing-alpha062-final.md`. These two are deliberately separate documents — don't merge them.
