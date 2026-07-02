#!/usr/bin/env python3
import argparse
import json
import os
import socket
import sys
import urllib.error
import urllib.request
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class ClaudeProxyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=directory, **kwargs)

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        if self.path.startswith("/claude_proxy"):
            self.send_response(204)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
        else:
            self.send_error(404)

    def do_GET(self):
        if self.path.startswith("/claude_proxy"):
            self._send_json(200, {"status": "ok", "message": "Claude proxy is available."})
            return
        super().do_GET()

    def do_POST(self):
        if not self.path.startswith("/claude_proxy"):
            self.send_error(404)
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length) if content_length else b"{}"

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except Exception as exc:
            self._send_json(400, {"error": f"Invalid JSON: {exc}"})
            return

        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            self._send_json(503, {"error": "ANTHROPIC_API_KEY is not set on the server."})
            return

        request = urllib.request.Request(
            "https://api.anthropic.com/v1/messages",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Content-Type": "application/json",
                "x-api-key": api_key,
                "anthropic-version": "2023-06-01",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(request, timeout=60) as response:
                body = response.read().decode("utf-8")
                self.send_response(response.status)
                self.send_header("Content-Type", "application/json")
                self.send_header("Content-Length", str(len(body.encode("utf-8"))))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(body.encode("utf-8"))
        except urllib.error.HTTPError as exc:
            error_body = exc.read().decode("utf-8", errors="ignore")
            self._send_json(exc.code, {"error": "Anthropic request failed", "details": error_body})
        except Exception as exc:
            self._send_json(502, {"error": "Failed to reach Anthropic", "details": str(exc)})

    def log_message(self, format, *args):
        return


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
    parser = argparse.ArgumentParser(description="Serve the Harrow preview and a Claude proxy endpoint.")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--open", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent / "Overton"
    if not (root / "overton_preview.html").exists():
        print(f"Error: overton_preview.html not found in {root}.")
        sys.exit(1)

    server_address = (args.host, args.port)
    handler = partial(ClaudeProxyHandler, directory=str(root))
    httpd = ThreadingHTTPServer(server_address, handler)

    local_url = f"http://127.0.0.1:{args.port}/overton_preview.html"
    network_ip = get_local_ip()
    network_url = f"http://{network_ip}:{args.port}/overton_preview.html"
    print("Serving Harrow preview from:")
    print(f"  Root: {root}")
    print(f"  Local: {local_url}")
    print(f"  LAN:   {network_url}")
    print(f"  Claude proxy: http://127.0.0.1:{args.port}/claude_proxy")

    if args.open:
        webbrowser.open(local_url, new=2, autoraise=True)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()


if __name__ == "__main__":
    main()
