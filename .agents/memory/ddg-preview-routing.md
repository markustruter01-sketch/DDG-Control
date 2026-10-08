---
name: DDG preview routing
description: Browser automation URL behavior for the DDG Control artifact preview.
---

Use the Replit preview proxy root (`http://localhost:80/`) when driving DDG Control in headless browser automation. Navigating directly to the artifact-prefixed development-domain URL can load the HTML while leaving the client router on the prefixed path, showing only the development auth banner.

**Why:** the preview proxy maps the artifact to `/`, while direct domain access preserves the artifact path and does not behave the same way for the client router.

**How to apply:** use the preview proxy root for browser interaction and screenshots; use the development-domain URL for `curl` API verification.
