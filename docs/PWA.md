# Pivot OS on your phone

Pivot OS uses the existing Next.js app as an installable PWA. The installed app opens `/today` in a standalone window; existing sign-in and workspace access checks still apply.

Open `/install` for phone instructions, or select **Install Pivot OS** in the workspace account menu. On iPhone/iPad use Safari → Share → Add to Home Screen. On Android use Chrome → menu → Install app / Add to Home screen. Installation requires HTTPS (localhost is allowed for development).

## Connection and updates

Live workspace operations require internet access. The service worker caches only the public `/offline.html` reconnect screen. It does not cache authenticated pages, API responses, work records, or pending writes. Offline capture, background sync, and push notifications are not included.

The worker registers in production, checks its source without using the HTTP cache, and activates updates without forcing a page reload. Normal online requests continue to use the server. The offline page's retry button reloads the original requested URL after reconnection.

## Verification

Run a production build in a separate output directory, start it locally, then run `tests/smoke/pwa.spec.ts` against that server with `SMOKE_BASE_URL`. The spec covers manifest/icon responses, worker headers, offline navigation, network-only API behavior, reconnect, and the offline cache contents on desktop and mobile Chromium.

Final device verification: open the HTTPS deployment in Safari on iPhone and Chrome on Android, install it, check its home-screen icon and standalone launch, sign in, then turn off connectivity and relaunch. Restore connectivity and tap **Try again**. Browser automation does not confirm native OS installation UI.
