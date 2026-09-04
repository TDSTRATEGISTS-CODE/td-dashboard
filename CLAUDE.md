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

## AMACX "Last Month" lookback toggle — the yoy{} block needs its own pull every rebake

`clients/amacx/data.js` → `dateRanges.may.yoy` bakes the Same-Period-Last-Year comparison shown by
the Prior Period / Same Period Last Year toggle (see README.md → "Re-baking AMACX" → step 1). It is
**not derived from `$M`** — it comes from a *separate* MerchantSpring pull (this month vs the same
calendar month last year) and does not advance on its own when `$M` is refreshed for the new month.

**Every AMACX rebake that updates `may` must also refresh `dateRanges.may.yoy`** (top-level EU +
`marketKpis.{de,fr,es,it}`), or the YoY comparison silently goes stale — showing last month's
YoY delta as if it were this month's, with no visual sign anything is wrong. Only bake fields that
reconcile against MerchantSpring's other reports (currently Revenue/Ad Spend/TACOS/ROAS); leave a
metric's `yoy` fields out entirely rather than baking an unreconciled number — `app.js`'s `lb()`
helper shows "YoY data pending" for anything missing, which is honest, whereas a wrong number isn't.

This is the same category of mistake as skipping the `APP_VER` bump above: the rebake looks
complete (data.js changed, commit pushed) but the client-visible feature is quietly wrong.

## AMACX Netherlands (NLD) is not live — do not pull it in the monthly rebake

NLD is **not a live market** for AMACX. Do not call MerchantSpring for the NLD channel
(`75880695` / `A1O4H4W8GP4BN2 @ A1805IZSGTT6HS`) as part of the routine monthly pull —
not sales, not ads, not inventory, not Buy Box. `README.md`'s channel table still lists it;
treat that row as informational only, not an instruction to include it every month.

As of the July 2026 rebake, MerchantSpring has **zero product rows** registered for this
channel for any month since February 2026 — this isn't "early-launch, zero sales," it's an
empty/stalled feed, so a monthly pull for it wastes a report cycle and returns nothing usable.
`data.js` already treats NLD as excluded from live actuals (`€0` row in `mktRows`, absent from
`marketKpis`, absent from `sections.inventory.kpisByMarket`) — keep it that way rather than
re-adding pulls for it out of habit because the channel table names it alongside DE/FR/ES/IT.

If NLD ever goes live again, that's a deliberate decision someone will need to make explicitly
(and update this note + the README table accordingly) — don't infer it from the data changing.

