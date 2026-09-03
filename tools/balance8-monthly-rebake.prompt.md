# Balance 8 — monthly Amazon re-bake (Routine prompt)

You are running the **Balance 8 monthly Amazon re-bake** as an autonomous Claude Code routine. Work
end-to-end without asking for confirmation. This is an **auto-publish + notify** setup: when every
self-check passes, publish straight to `main` (it's live) and log the run; only fall back to a human
review gate if something fails.

Balance 8 is Amazon-only, single UK marketplace, GBP. Two brands on one seller account: BrainMatter
(nootropics, live since Sep 2025) and WIRED (sports nutrition, first sale Aug 2026). Digital Dash
tier — the real P&L is baked but stays behind the paywall.

## What to do

Re-bake `clients/balance8/data.js` from MerchantSpring for the latest fully-closed month. The
detailed MerchantSpring pull sequence is documented in **`tools/new-client-setup.prompt.md` → "2.
Pull the real actuals"** — read that and follow the same tools/order (`getChannels` →
`calculateDateEpoch` → `getSalesByPeriod` → `getSalesByProduct` → `getStoreProfitAndLoss`). This file
is the trigger + guardrails specific to the monthly refresh.

## ⚠️ Known data-quality issue — READ BEFORE TRUSTING `getSalesByPeriod`

At the initial bake (Sep 2026), `getSalesByPeriod` (the channel-level monthly-backbone tool) returned
**incorrect ZERO revenue/units** for this specific channel for the then-current month (August) and
for the earliest ramp-up months (Sep–Oct 2025) — while its `adSpend`/`adSales`/`sessions`/
`impressions` fields for those SAME months were correct (cross-checked exactly against
`getAdvertisingByChannels`-equivalent per-SKU sums). Nov 2025–Feb 2026 (by then several months
settled) checked out consistent on both tools. The working theory: this tool's pre-aggregated revenue
figure lags for a channel's most recent 1–2 months and for its earliest history, while ad/session
metrics come from a different, fresher pipeline.

**Every rebake must therefore cross-check the target month's revenue/units**, not just trust
`getSalesByPeriod` blindly:
1. Pull the target month with `getSalesByPeriod` as normal.
2. ALSO pull the same exact date range with `getSalesByProduct` (`includeNoInventory:true,
   includeNoSales:true`, all pages) and sum `totalSales`/`unitsSold` across every row.
3. If the two disagree by more than a rounding difference, **trust `getSalesByProduct`'s sum** for
   revenue/units (it reconciles with product `lastSold` timestamps; `getSalesByPeriod` does not, when
   they diverge). Keep `adSpend`/`adSales`/`sessions`/`impressions`/`buyboxWinPercentage` from
   `getSalesByPeriod` regardless — those fields have checked out correct every time so far.
4. Note in the `data.js` top-of-file comment which source you used for revenue/units that month, same
   as the existing comment does.

If a future rebake finds `getSalesByPeriod` now agrees with `getSalesByProduct` on a fresh month, that's
good news (MerchantSpring may have fixed the lag) — say so in the run log, but keep doing the
cross-check for at least a couple more cycles before dropping it.

## Target month & rolling windows

The **latest fully-closed calendar month**. If today is 2026-10-05, the target month is
**September 2026**. Recompute the MerchantSpring period epochs each run with `calculateDateEpoch` in
timezone **`Europe/London`**. The `data.js` object key **`may`** is the "Last Month" slot — keep the
key literally `may`; only update its `label`/`shortLabel`.

Periods, all **rolling windows** (not "Since Launch" — Balance 8 has a real 5-month dead zone in its
history, so a fixed launch-to-date framing would misrepresent an inactive period as trading):
- `may` = last closed month
- `3m` = trailing 3 months ending on the last closed month
- `12m` = trailing 12 months ending on the last closed month — **shift the window forward by one
  month every rebake**: drop the oldest month, add the newest. E.g. this rebake's `12m` = Oct
  2025–Sep 2026 (drops Sep 2025, adds Sep 2026). Recompute every `dateRanges['12m']` field (revenue,
  ad spend, TACOS, ROAS, `revChart`/`adChart`/`revBreakChart` — all 12 x-axis labels shift by one —
  and `sections.products.{kpisByPeriod,tableByPeriod,groupsByPeriod}['12m']`) from the full new
  12-month sum; don't just patch in the new month's delta.

## Key facts

- **MerchantSpring:** channel **`95589144`**, merchant **`A3NEIOUENQO9V9 @ A1F83G8C2ARO7P`**, Amazon
  UK, native **GBP (£)**, timezone `Europe/London`.
- **Files you hand-edit:** `clients/balance8/data.js` (the baked snapshot), `clients/balance8/config.js`
  (`reportPeriodLabel` → `'<Mon YYYY> · Monthly Report'`), and `index.html` (bump `APP_VER` — new bake
  date + letter). Repo root *is* the dashboard folder. A data-only refresh needs **no proxy redeploy**.
- **DO NOT bake `sections.overview.tasksSpec` / `flagsSpec` / `completedSpec`** — those are served
  **live** by `balance8-sheet-proxy.gs` from the "Project Scope" tab of the project tracker
  (`overlay:'sections'`). Refresh only the MerchantSpring-derived overview cards: **`overview.cvr`,
  `overview.stockWarn`, `overview.buyBox`** (the baked tasks/flags/completed are just the offline
  fallback — leave them, unless they're now stale enough to actively mislead, e.g. still describing
  the Mar–Jul gap a year after it resolved — in that case update the fallback text too and say so in
  the run log).
- **Digital Dash tier — P&L stays gated.** `sections.pnl` is baked (from `getStoreProfitAndLoss`,
  **accrual basis** — chosen so it reconciles against the order-date sales figures used everywhere
  else on this dashboard, per the tool's own guidance) but hidden behind the Executive paywall.
  Refresh its numbers so it stays current, but **never remove `'pnl'` from `config.hiddenPages`** —
  Balance 8 is Digital Dash, so the Amazon P&L must remain the 🔒 locked gate.
- **Sections to refresh:** `dateRanges` (`may`/`3m`/`12m` — headline KPIs, `mktRows`, `revChart`/
  `adChart`/`revBreakChart`, `campaignMix`), and `sections.{advertising, inventory, products, pnl}` +
  the three MerchantSpring overview cards.
- **Period-aware sub-fields — do not skip these.** Balance 8 (unlike Abimax) has
  `sections.advertising.campaignsByPeriod` and `sections.products.{kpisByPeriod,tableByPeriod,
  groupsByPeriod}`, each keyed `may` / `3m` / `12m` (kpis/groups additionally keyed `.all` under each
  period — see existing data.js for the exact shape). These exist because the flat fallback fields
  (`campaigns`, `products.kpis/table/groups`) render identically under every date-range selection —
  a real bug found and fixed in Sep 2026 (a client screenshot showed "Last 12 Months" displaying a
  single month's revenue). **Every rebake must update all three periods of each ByPeriod field**, not
  just `may` — an unrefreshed `12m` silently reintroduces that exact bug next time someone picks it.
  - `may`/`3m` can use real per-SKU ad/product detail (MerchantSpring exposes genuine per-product
    ad-sales for the current pull, per Abimax's data.js comment on the channel-only-attribution
    limitation elsewhere — check whether that's still true this pull).
  - `12m` may need to roll up to **product-family level** (BrainMatter combined vs WIRED combined)
    rather than fabricate a per-SKU split for months where only channel-level ad/product data was
    pulled historically — same reasoning as the Sep 2026 bake. Reconcile: the `12m` product-group
    sum must equal the `12m` table revenue **exactly** (verify with the validation script below).
- **Advertising campaigns (`may`/`3m`):** spend/CPC/ad-sales real per-SKU where MerchantSpring exposes
  it for the current pull; if it ever reverts to channel-only attribution, allocate by spend share and
  say so (see Abimax's data.js for that pattern) rather than presenting an allocation as exact.
- **`revBreakChart`** (stacked monthly bars) is derived: per month Ad-attributed = ad sales, Organic =
  gross revenue − ad sales; series `#404935` (Ad) / `#a7ab90` (Organic).
- **No lookback-basis toggle (Prior Period / Same Period Last Year — see AMACX/NKV) for Balance 8
  yet.** A same-month-last-year comparison needs 13+ months of history; Balance 8 crosses that
  threshold once this rebake is refreshing **September 2026 → October 2026** (12 months after
  first sale). Even then, Mar–Jul 2025-equivalent... check carefully: the Mar–Jul 2026 dead zone means
  a YoY comparison against those exact months will compare real trading against £0 for a while — note
  that plainly in the card rather than let it read as a real decline. Don't add
  `config.lookbackOptions` / a `dateRanges.may.yoy` block without thinking through what it would
  actually show.
- **No budget/forecast sheet exists for Balance 8.** `mktRows` shows `'—'` / `'No budget set'` for the
  budget column (not a fabricated figure) and `sections.advertising.budgets`/`forecast` stay omitted
  — `config.layout.hide` keeps the (otherwise wrong-client-placeholder) Ad Budgets & Forecast card
  hidden. Leave this as-is unless the client's tracker gains a real budget — don't invent one.
- **Validate before committing** (throws on any JS error):
  ```bash
  node -e "global.window={}; require('./clients/balance8/config.js'); require('./clients/balance8/data.js'); \
    const d=window.DASHBOARD_DATA.dateRanges, c=window.DASHBOARD_CONFIG, s=window.DASHBOARD_DATA.sections; \
    (c.dateRangeOptions||[]).forEach(o=>{if(!d[o.value]) throw new Error('missing period '+o.value); \
      const b=d[o.value].revBreakChart; if(b){var a=b.series[0].values.reduce((x,y)=>x+y,0), \
      org=b.series[1].values.reduce((x,y)=>x+y,0); console.log(o.value,'ad',a,'organic',org,'gross',a+org);}}); \
    ['may','3m','12m'].forEach(function(p){ \
      var g=s.products.groupsByPeriod[p].all.reduce((x,r)=>x+parseFloat(String(r.sales).replace(/[£,]/g,''))||0,0); \
      var t=parseFloat(String(s.products.tableByPeriod[p][0].revenue).replace(/[£,]/g,'')); \
      console.log(p,'groups sum',g,'vs table revenue',t,g===t?'OK':'MISMATCH'); }); \
    console.log('shape OK →', d[c.defaultPeriod].label, d[c.defaultPeriod].rev)"
  ```
  The groups-vs-table reconciliation check is NOT optional — it's exactly the class of bug found in
  Sep 2026. A `MISMATCH` line is a hard stop.

## Self-check gate (decides publish vs review)

Before publishing, ALL of these must pass. Treat any failure as a hard stop:

1. **Connector present** — the MerchantSpring connector is attached and its tools return data. If
   missing, do not guess or fabricate numbers.
2. **Every expected pull returned data** — no period came back null/empty.
3. **Revenue/units cross-check done** (see the data-quality section above) for the target month AND
   for any `12m`-window month whose figure changed this bake.
4. **`node` shape/syntax + reconciliation check passes** (prints `shape OK` and no `MISMATCH` line).
5. **revBreak reconciles** — for `may`/`3m`/`12m`, `Σ ad + Σ organic` equals that period's gross
   revenue, and `Σ ad` equals the period ad sales.
6. **Sanity pass is clean** — TACOS never >100% (hard rule for every client). ROAS: Balance 8 has shown
   anywhere from 0.75× (Aug 2026 relaunch, genuinely loss-making on ad spend) to ~2× blended — there is
   **no tight plausible band** like Abimax's ~5–7×, so don't gate on a narrow ROAS range; instead flag
   a ROAS **below 0.3× or above 10×** as implausible (likely a unit/decimal error) and route to review.
   No negative/blank revenue. Every MoM delta present.
7. **Swing check — read this carefully before flagging.** A revenue swing of >60% MoM is normally a
   "plausible but wrong" red flag (per Abimax's gate) — but Balance 8 has a REAL, already-confirmed
   history of swinging between £0 and several thousand pounds in a single month (the Mar–Jul 2026 dead
   zone, the Aug 2026 relaunch). So:
   - A transition **to or from £0** (either direction) is **not automatically a failure** — it may be
     completely real for this account. Still cross-check it per the data-quality section above (a
     stale-cache zero and a genuine stockout/relaunch look identical without that check), but a
     confirmed real £0 doesn't block publishing.
   - A swing between two **nonzero** months of >60% with no obvious cause (no launch/pause event,
     no stockout, no ad-spend change of similar magnitude) IS still a hard stop → route to review,
     same as Abimax.

## Deliverable

**On a clean pass — auto-publish (no human gate):**
- Commit `clients/balance8/data.js` + `clients/balance8/config.js` (`reportPeriodLabel`) +
  `index.html` (`APP_VER` bump) and **push directly to `main`**. If the push to `main` is rejected,
  fall back to the failure path below (open a PR) rather than leaving the work unpublished.
- **Notify:** add a comment to GitHub issue **`tdstrategists-code/td-dashboard` #29
  "Balance 8 monthly re-bake — run log"** with the target month's **revenue / ad spend / TACOS / ROAS
  / units / reorder-watch SKU count, each vs the prior month**, which revenue/units source won the
  cross-check (`getSalesByPeriod` or `getSalesByProduct`) and why if they disagreed, and a
  `✅ validations passed — published to main` line. Keep it to a few lines.

**On any failure — do NOT touch `main`:**
- Do not push partial or suspect data. Commit what you have to a `claude/`-prefixed branch and open a
  **draft PR** titled `Balance 8 monthly re-bake — <Mon YYYY> (NEEDS REVIEW)` explaining exactly which
  self-check failed.
- Also comment on issue **#29** with a one-line `⚠️ needs review` summary + the draft PR
  link.

Never merge a PR yourself. The auto-publish path skips PRs entirely; the failure path always leaves a
human gate.
