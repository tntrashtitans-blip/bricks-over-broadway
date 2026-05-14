<claude-mem-context>
# Memory Context

# [New project 5] recent context, 2026-05-14 1:14pm CDT

No previous sessions found.
</claude-mem-context>

# Local preview

Use the project no-cache preview server, not `python3 -m http.server`, so Chrome and Safari do not hold stale HTML/CSS while editing:

```bash
cd "/Users/laramygregory/Documents/New project 5"
zsh start_preview.sh
```

Preview URL:
`http://localhost:8011/`

Preview/cache rule for this project:
- Do not use `python3 -m http.server`.
- Keep `zsh start_preview.sh` running; it kills stale `8011` servers before starting the project preview.
- The preview server sends no-cache headers, clears browser cache, and identifies the serving folder in `X-Preview-Root`.
- Each HTML page includes a localhost-only stylesheet cache buster that rewrites `styles.css` to `styles.css?v=<current timestamp>` on every preview page load.
- After any visual/CSS edit, verify the plain URL on `localhost:8011` and do not report done until the browser/server is serving the changed HTML/CSS.
