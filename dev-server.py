#!/usr/bin/env python3
"""Test server for the birthday site: same folder as `python -m http.server`,
but every response says no-store, so the browser can never hand back a stale
main.js/styles.css mid-development."""
import os
import http.server

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8902


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, max-age=0, must-revalidate")
        super().end_headers()

    def log_message(self, *args):
        pass


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler).serve_forever()
