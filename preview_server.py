from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class NoCacheHandler(SimpleHTTPRequestHandler):
    def drop_conditional_cache_headers(self):
        for header in ("If-Modified-Since", "If-None-Match"):
            if header in self.headers:
                del self.headers[header]

    def do_GET(self):
        self.drop_conditional_cache_headers()
        super().do_GET()

    def do_HEAD(self):
        self.drop_conditional_cache_headers()
        super().do_HEAD()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        self.send_header("X-Preview-Root", str(Path.cwd()))
        super().end_headers()


if __name__ == "__main__":
    port = 8011
    root = Path.cwd()
    server = ThreadingHTTPServer(("", port), NoCacheHandler)
    server.daemon_threads = True
    print(f"Serving {root} at http://localhost:{port}/ with no-cache headers")
    server.serve_forever()
