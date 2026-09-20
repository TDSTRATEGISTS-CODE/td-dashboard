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

## AMACX rebake scope — `dateRanges` is NOT the whole file; five more spots key off the same month

The August 2026 rebake updated `dateRanges` (headline KPIs, mktRows, Buy Box, the campaigns list)
and shipped as if that were a complete rebake. It wasn't: the Products page, the campaign-type pie,
and the trend chart all still showed July for two weeks before anyone noticed. **A scheduled rebake
task prompt that only mentions "core actuals" or "headline KPIs" does not narrow this scope** — the
prompt describes what to *pull*, not which baked sections are allowed to go stale. Every one of the
spots below reads its own period key (`may`/`3m`/`6m`/`12m`) off the same underlying MerchantSpring
actuals and **must be advanced in the same commit** as `dateRanges`, or the dashboard is internally
inconsistent (headline card says August, everything below it still says July):

1. **`sections.products.kpisByPeriod`** and **`.tableByPeriod`** — Orders/AOV/ASP and the per-market
   revenue table, for `may`/`3m`/`6m`/`12m`. No new pull needed: every number here is already sitting
   in `dateRanges[period].marketKpis` once that's rebaked (rev/units/orders/aov) — ASP is just
   `revenue/units`. Propagate, don't skip because "it's the same data" — it lives in a separate
   object and does not update itself.
2. **`sections.products.groupsByPeriod`** (Sales-by-Product-Group, 15 groups × 5 scopes) — needs its
   own `salesByProduct` pull **per rolling window** (not per month): request the report with
   `fromDate`/`toDate` spanning the whole window directly (e.g. `2026-06-01`–`2026-08-31` for `3m`)
   rather than trying to stitch monthly pulls together — one report per market per window (4×4=16
   total across `may`/`3m`/`6m`/`12m`), joined to the sheet's SKU→Group map (product master table,
   column B `PARENT-*` labels matched by ASIN). The group map is a static reference table and will
   not have every ASIN (new launches, superseded variants) — check for unmatched rows with nonzero
   `totalSales` each time and extend the map rather than silently dropping their revenue; a match
   rate of "sum of groups ≈ the already-baked headline revenue for that window" is the sanity check.
3. **`sections.advertising.campaignMixByPeriod`** (SP/SB/SD pie) — same shape as #2 but from the
   `campaigns` report: one pull per market per rolling window (`fromDate`/`toDate` = the window),
   aggregate `cost`/`attributed_sales` by `ad_type`.
4. **`sections.charts`** (trailing-6-month trend) — drop the oldest month, append the new one, for
   `months`, `revTarget` (sheet's Revenue Target row), `rev`, `adSpend` (all precise from the same
   `$M`-equivalent monthly actuals used for `dateRanges`), and `adTacos` (recompute as
   `adSpend/rev`, don't carry forward a stale value). `adSales` for the new month should come from
   the same `campaigns` report totals already pulled for the headline card; the older 5 months can
   stay as previously baked.
5. The **`'2025'` key** in both `groupsByPeriod` and `campaignMixByPeriod` is frozen (matches
   `dateRanges['2025']`) — never touch it on a monthly rebake, same rule as the FY2025 dateRanges block.

✅ Before calling a rebake done, grep the whole `clients/<client>/data.js` for the *previous* month's
name (e.g. `grep -c 'Jul 2026'` after an August rebake) — zero hits (aside from genuine historical
"OOS since" / "as of" dates) is the actual finish line, not "dateRanges validates."

