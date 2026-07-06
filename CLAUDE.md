# td-dashboard — agent notes

## AMACX (and any client) monthly data re-bake — do not skip these

`clients/<client>/data.js` is a baked snapshot; the browser never calls MerchantSpring or the
Google Sheet directly. Whenever a rebake changes `clients/<client>/data.js`, the same commit
**must also**:

1. **Bump `APP_VER` in `index.html`** (top of the inline `<script>` block, e.g.
   `var APP_VER = '2026-07-06';`). `config.js`/`data.js`/`app.js` are all loaded with `?v=APP_VER`
   as a cache-buster — GitHub Pages ignores repo cache headers and caps `index.html` at a ~10-min
   browser cache, so if `APP_VER` doesn't change, browsers keep serving the *old* `data.js` at the
   unchanged URL even though the file content on GitHub is new. Skipping this step means the
   rebake is invisible to users until their cache happens to expire on its own.
2. **Update `clients/<client>/config.js`'s `client.reportPeriodLabel`** to the new month/year
   (e.g. `'June 2026 · Monthly Report'`) if that client sets one — it's a hardcoded string shown
   directly in the dashboard header, not derived from `data.js`.

A task prompt for a scheduled rebake may say "do not modify index.html/config.js" meaning *don't
restructure them* — that instruction does **not** override the two mechanical bumps above, which
are a required, inseparable part of shipping a rebake. See `README.md` → "Re-baking AMACX" →
step 10 for the full agent runbook this codifies.

Without both of these, "commit the new data.js" is an incomplete, silently-broken rebake: the
data changes in the repo but nothing changes on screen for the client.
