#!/usr/bin/env python3
import argparse
import os
import socket
import sys
import webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


def main():
    parser = argparse.ArgumentParser(description="Serve the Harrow preview locally for sharing.")
    parser.add_argument("--port", type=int, default=8000, help="Port to serve on (default: 8000)")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to (default: 0.0.0.0 for LAN access)")
    parser.add_argument("--open", action="store_true", help="Open the preview page in the default browser")
    args = parser.parse_args()

    # Migrated 2026-07-01: the live build lives in Overton/, not the repo root.
    # This now serves from Harrow/Overton/ so it actually finds the current jsx.
    root = Path(__file__).resolve().parent / "Overton"
    if not (root / "overton_preview.html").exists():
        print(f"Error: overton_preview.html not found in {root}.")
        sys.exit(1)

    handler_class = SimpleHTTPRequestHandler
    server_address = (args.host, args.port)
    os.chdir(root)
    httpd = ThreadingHTTPServer(server_address, handler_class)

    local_url = f"http://127.0.0.1:{args.port}/overton_preview.html"
    network_ip = get_local_ip()
    network_url = f"http://{network_ip}:{args.port}/overton_preview.html"

    print("Serving Harrow preview from:")
    print(f"  Root: {root}")
    print(f"  Local: {local_url}")
    if args.host == "0.0.0.0":
        print(f"  LAN:   {network_url}")
    print("\nPress Ctrl+C to stop the server.")

    if args.open:
        opened = webbrowser.open(local_url, new=2, autoraise=True)
        if not opened and sys.platform.startswith("win"):
            try:
                os.startfile(local_url)
            except OSError:
                pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        httpd.server_close()


if __name__ == "__main__":
    main()
