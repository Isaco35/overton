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
    parser = argparse.ArgumentParser(description="Serve the Harrow preview locally and create a public ngrok URL.")
    parser.add_argument("--port", type=int, default=8000, help="Port to serve on (default: 8000)")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to (default: 0.0.0.0)")
    parser.add_argument("--open", action="store_true", help="Open the preview page in the default browser")
    parser.add_argument("--authtoken", help="Optional ngrok auth token for a stable public tunnel")
    args = parser.parse_args()

    try:
        from pyngrok import ngrok, conf
    except ImportError:
        print("Error: pyngrok is not installed.")
        print("Install it with: py -m pip install pyngrok")
        sys.exit(1)

    # Migrated 2026-07-01: the live build lives in Overton/, not the repo root.
    # This now serves from Harrow/Overton/ so the public tunnel points at the
    # current, grounded build instead of whatever stale copy sat at root.
    root = Path(__file__).resolve().parent / "Overton"
    if not (root / "overton_preview.html").exists():
        print(f"Error: overton_preview.html not found in {root}.")
        sys.exit(1)

    token = args.authtoken or os.environ.get("NGROK_AUTHTOKEN")
    if not token:
        try:
            token = input("Enter your ngrok auth token (leave blank to cancel public tunnel): ").strip()
        except EOFError:
            token = None
    if not token:
        print("No ngrok auth token provided. Public tunnel will not start.")
        sys.exit(1)

    conf.get_default().auth_token = token

    handler_class = SimpleHTTPRequestHandler
    server_address = (args.host, args.port)
    os.chdir(root)
    httpd = ThreadingHTTPServer(server_address, handler_class)

    local_url = f"http://127.0.0.1:{args.port}/overton_preview.html"
    network_ip = get_local_ip()
    network_url = f"http://{network_ip}:{args.port}/overton_preview.html"

    tunnel = ngrok.connect(args.port, "http")
    public_url = tunnel.public_url
    public_app_url = f"{public_url}/overton_preview.html"

    print("Serving Harrow preview from:")
    print(f"  Root: {root}")
    print(f"  Local: {local_url}")
    print(f"  LAN:   {network_url}")
    print(f"  Public: {public_app_url}")
    print("\nPress Ctrl+C to stop the server and close the tunnel.")

    if args.open:
        _ = webbrowser.open(public_app_url, new=2, autoraise=True)
        if sys.platform.startswith("win"):
            try:
                os.startfile(public_app_url)
            except OSError:
                pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        ngrok.disconnect(public_url)
        ngrok.kill()
        httpd.server_close()


if __name__ == "__main__":
    main()
