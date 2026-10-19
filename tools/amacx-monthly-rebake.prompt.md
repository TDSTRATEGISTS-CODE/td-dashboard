# AMACX EU — monthly Amazon re-bake (Routine prompt)

You are running the **AMACX monthly Amazon re-bake** as an autonomous Claude Code routine. Work
end-to-end without asking for confirmation. This is an **auto-publish + notify** setup: when every
self-check passes, publish straight to `main` (it's live) and log the run; only fall back to a
human review gate if something fails.

AMACX is Amazon-only, four live EU marketplaces (DE/FR/ES/IT), EUR. NLD is listed on the seller
account but is **not live** — see the NLD note below, it is not optional context.

## What to do

Re-bake `clients/amacx/data.js` from MerchantSpring for the latest fully-closed month. The detailed
step-by-step pull sequence is documented in **`README.md` → "Re-baking AMACX" → "Monthly re-bake
routine (agent runbook)"** — read that and follow it in order. **`CLAUDE.md`'s four AMACX sections
are not background reading, they are hard requirements that override anything narrower a trigger or
prompt variant might say**: the mechanical `APP_VER`/`reportPeriodLabel` bumps, the `yoy` block pull,
the NLD exclusion, and — critical, this is *why this file exists* — the "AMACX rebake scope" section
listing every spot in `data.js` that must move together. This file is the trigger + guardrails +
known-issue list specific to the monthly refresh; README and CLAUDE.md are the authoritative
procedure and scope.

## Target month

The **latest fully-closed calendar month**. If today is 2026-10-05, the target month is
**September 2026**. Recompute the MerchantSpring period epochs each run with `calculateDateEpoch`
in timezone `Europe/Berlin`. The `data.js` object key **`may`** is the "Last Month" slot — keep the
key literally `may`; only update its `label`/`shortLabel`. Periods: `may` = last month · `3m` =
trailing 3 · `6m` = **Year to Date (Jan 1 → end of target month)** — the dropdown shows "YTD", NOT a rolling 6 months · `12m` = trailing 12 · `2025` = **frozen FY2025 history, never
touch**.

## Scope — `dateRanges` is not the whole rebake

It's easy to refresh `dateRanges` (headline KPIs, `mktRows`, Buy Box, the campaigns list), validate
that it parses, and ship it as "done." **That has actually happened** (the August 2026 rebake did
exactly this and left five other spots on the prior month for two weeks before anyone noticed).
Per CLAUDE.md → "AMACX rebake scope," these all key off the same month and must move in the same
commit:

1. `sections.products.kpisByPeriod` / `.tableByPeriod` — no new pull, propagate from
   `dateRanges[period].marketKpis` (ASP = revenue/units).
2. `sections.products.groupsByPeriod` — its own `salesByProduct` pull **per rolling window**
   (`fromDate`/`toDate` spanning the whole window, e.g. one pull covering the full 3 months for
   `3m`, not three stitched monthly pulls), joined to the Sheet's SKU→Group map. The group map is a
   static reference table — check for unmatched ASINs with nonzero `totalSales` each run and extend
   it; sanity-check sum-of-groups against the already-baked headline revenue for that window
   (within ~1–2%).
   - **Per-group `cvr`/`cvrCls` — refresh every rebake, don't carry it forward.** Backfilled for
     `3m`/`6m`/`12m` (every scope: `all`/`de`/`fr`/`es`/`it`) on 19 Oct 2026, having been missing
     since whenever the per-period Products rebuild first shipped (only `may` had it before). Same
     bug class as the Balance 8/Abimax/NKV fixes that week (`tools/{balance8,abimax}-monthly-rebake.
     prompt.md`, `tools/nkv-monthly-rebake.prompt.md`). Source: `generateReport(report_type:
     'trafficAndConversion', view:'skus')` per market channel (DE/FR/ES/IT) per window — one pull per
     market per window, 12 total for 3m/6m/12m — fetch the CSV from `downloadUrl` directly, not the
     AI summary. `cvr` = (Σ group `orderedUnits`) ÷ (Σ group `sessions`) from that pull; thresholds
     ≥10% `'bg'`, 4–9.99% `'ba'`, <4% `'br'`. For the `all` (blended EU) scope, sum sessions/units
     across all four markets first, then divide — don't average the four markets' percentages.
   - **The ASIN→Group map used for this is the "SKU List" tab of the AMACX Project Tracker Google
     Sheet** (Drive file ID `1yJvCPOnxhQO4oa1cUzrnyiORRO6kWKtf1Fw544C-K9Q`, column B = Group Name e.g.
     `PARENT-Energy Drink`, column E = child ASIN). Export the whole workbook as `.xlsx` via
     `download_file_content` (`exportMimeType: application/vnd.openxmlformats-officedocument.
     spreadsheetml.sheet`) and read it with a library (e.g. `openpyxl`) — a plain CSV/text export of
     a Google Sheet only returns the first tab, not "SKU List". The map only covers ~51 current
     ASINs; each rebake found a handful of legacy/superseded ASINs (old "Energy Drink Pulver"/"Turbo
     Drink Pulver" variants, a sugar-free Hydro Tabs SKU) still showing sessions in the trafficAndConversion
     pull that aren't in the Sheet — title-match them to the right existing group rather than dropping
     their sessions (see the 19 Oct 2026 session's `EXTRA_ASIN_GROUPS` workaround). One genuinely new
     SKU (`B0F331NKWY`, "Beet Shot") has no matching category at all — exclude it, don't invent one.
   - **Known small reconciliation gap, not a regression:** the DE/ES group-level `sales` sums already
     run ~0.4–1.5% under the baked `tableByPeriod` market revenue for `3m`/`6m`/`12m` (pre-existing,
     confirmed present before the 19 Oct 2026 CVR backfill — not introduced by it). Root cause is the
     same handful of legacy/unmapped SKUs above; worth folding their revenue into the right group next
     time groupsByPeriod sales/units are rebuilt from scratch, but out of scope for a CVR-only patch.
   - **Reconciliation vs `tableByPeriod` units (the sanity check to re-run each time):** pulling the
     same per-market total sessions/units from this report and comparing to the already-baked
     `tableByPeriod[period]` units — DE matched exactly on all three windows in the 19 Oct 2026 run;
     FR/ES/IT ran 96–99% of the baked figure on `6m`/`12m` (not `3m`, which matched exactly everywhere).
     This mirrors NKV's documented "product report undercounts on wider windows" pattern — treat a
     96%+ match as a pass, don't force exact reconciliation.
3. `sections.advertising.campaignMixByPeriod` — same per-window-pull shape as #2, from the
   `campaigns` report, aggregated by `ad_type`.
4. `sections.charts` (trailing 6-month trend) — drop the oldest month, append the new one:
   `months`, `revTarget` (Sheet), `rev`, `adSpend`, `adSales` (from the `campaigns` report),
   `adTacos` (recomputed, never carried forward stale).
5. The `'2025'` key in `dateRanges`, `groupsByPeriod`, and `campaignMixByPeriod` — frozen, never
   touch it, in any of the three.

**Finish-line check, every run, before calling it done:** grep the whole file for the *previous*
month's name (e.g. `grep -c 'Sep 2026' clients/amacx/data.js` on an October rebake, right after
writing it — you're checking the file does NOT still say September anywhere it shouldn't). Zero
hits — aside from genuine historical "OOS since" / "as of" dates — is the actual finish line, not
"`dateRanges` validates."

## Key facts (also in CLAUDE.md / README)

- **Files you hand-edit:** `clients/amacx/data.js` (the baked snapshot), `clients/amacx/config.js`
  (`reportPeriodLabel` → `'<Month> <YYYY> · Monthly Report'`), and `index.html` (bump `APP_VER` —
  today's actual date, not the date you started the pull; check `git log`/`git fetch origin main`
  first, since other clients' same-day rebakes also bump `APP_VER` and a merge conflict there is
  normal, not a sign of a problem — resolve by taking today's date and re-validating).
- **MerchantSpring channels** (seller `A1O4H4W8GP4BN2`) — DE `75877234` / FR `75877496` / ES
  `75880638` / IT `75880666`. **NLD (`75880695`) is not a live market — never call MerchantSpring
  for it, for any section.** Its feed has been empty/stalled since Feb 2026; `data.js` already
  carries it as an excluded `€0` row. Don't infer it's gone live again from the data changing —
  that's a deliberate call someone else makes explicitly.
- **⚠️ `getSalesByPeriod` returns `sales:"0.00"` on a single-month `interval:'M'` window for this
  account** — a live bug, re-verify it's still broken before trusting a fix. Workaround: pull
  `interval:'w'` for the month and sum the weekly buckets' `sales`/`unitsSold`/`lineItemCount` —
  this reconciles against the account's other reports. Re-verify this workaround is still needed
  each run rather than assuming.
- **⚠️ `getAdvertisingByChannels` currently errors on every call** (missing `troas`/`priorTroas` in
  its response schema). Until fixed, source ad spend from (1) the `adSpend` field embedded in the
  `getSalesByPeriod` weekly-bucket pull above (unaffected by the zeroing bug), cross-checked against
  (2) the `campaigns` report's summed `cost`. Never fall back to the Sheet for this.
- **⚠️ `inventoryHealth` is not a supported report for this channel** (Amazon-vendor-only; AMACX is
  seller — confirmed via a 400 on every market). Use `salesByProduct` (`quantity` field, 0 = OOS)
  for stock warnings instead.
- **`sections.overview.stockWarn.shipping` (Avg shipping per order, Overview › Logistics & Operations) is
  FROZEN at the Jul–Sep 2026 baseline until the 5 Jan 2027 rebake (Ryan, 12 Oct 2026).** Don't touch it
  on the Nov or Dec 2026 rebakes. From the 5 Jan 2027 rebake on (unless Ryan extends the freeze), refresh it
  every rebake using the method below: for each of DE/FR/ES/IT, generate `channelProfitAndLoss` (accrual,
  includeTax true, timezone Europe/Berlin) for each of the **last 3 complete months** (the report allows
  ≤31 days, so one per month). Per market: sum `otherIncome` (FBM shipping charged to customers) ÷ sum
  of the same months' orders from `getSalesByPeriod` (`lineItemCount`, interval M, GMT — the dashboard's
  own order count) → `€x.xx`. **Don't divide by the P&L report's `orders` field: it undercounts** (in Jul/Aug
  2026 it put DE above the flat €6.95 rate, which is impossible). Sanity check: no market can exceed €6.95
  while the rate is a flat €6.95 per order. Update the four `items` (`val` text and
  numeric `num`), the `note` (`'<Mon>–<Mon> YYYY · charged to customer'`) and the source comment with the
  sums. Keep `target` / `targetTxt` (€6.95 short-term goal) unless Ryan changes it. Touch nothing
  else in `stockWarn`.
- **`sections.overview.stockWarn` is owned by the WEEKLY overview routine** while
  `clients/amacx/config.js` has `overviewSource: 'notion'` (source: SKU List tab, pooled EU Stock —
  see `tools/weekly-overview.routine.md`). Don't overwrite it here; only `inventory.stock` /
  `inventory.restock` below.
- **Discontinued-SKU check, every run:** before writing `stockWarn` / `inventory.stock` /
  `inventory.restock`, check each currently-tracked SKU's status in the Google Sheet's SKU List tab
  (columns P–T, per-market Active/Inactive). A SKU Inactive across every market has been delisted,
  not just temporarily out of stock — drop it from all three lists and the KPI counts rather than
  continuing to recommend restocking it.
- **`yoy` pull is required every month**, not optional — `dateRanges.may.yoy` (this month vs the
  same calendar month last year, DE/FR/ES/IT + EU, Revenue/Ad Spend/TACOS/ROAS only — these are the
  only metrics that currently reconcile). Use two independent single-month pulls rather than the
  comparison-period parameter. Leave Ad Sales/Impressions/CTR/CPC out of `yoy` entirely if they
  don't reconcile — `app.js`'s `lb()` shows "YoY data pending" for anything missing, which is
  honest; a wrong number isn't.
- **P&L is closed for AMACX** — never attempt `channelProfitAndLoss`; leave `sections.pnl` exactly
  as-is.
- **Sheet rows matched by label text in column A, never hardcoded cell references.**
- **Validate before committing** (throws on any JS error):
  ```bash
  node -e "global.window={}; require('./clients/amacx/data.js'); require('./clients/amacx/config.js'); \
    const d=window.DASHBOARD_DATA.dateRanges, s=window.DASHBOARD_DATA.sections; \
    ['may','3m','6m','12m','2025'].forEach(p=>{if(!d[p]) throw new Error('missing period '+p)}); \
    ['may','3m','6m','12m'].forEach(p=>{if(!s.products.groupsByPeriod[p]) throw new Error('missing groupsByPeriod '+p); \
      if(!s.advertising.campaignMixByPeriod[p]) throw new Error('missing campaignMixByPeriod '+p); \
      if(!s.products.kpisByPeriod[p]) throw new Error('missing kpisByPeriod '+p); \
      if(!s.products.tableByPeriod[p]) throw new Error('missing tableByPeriod '+p); \
      ['all','de','fr','es','it'].forEach(function(mk){ var rows=s.products.groupsByPeriod[p][mk]; \
        if(!rows) throw new Error('missing groupsByPeriod '+p+'.'+mk); \
        var noCvr=rows.filter(function(r){return r.cvr==null}).length; \
        if(noCvr) console.log('⚠️ '+p+'.'+mk+': '+noCvr+'/'+rows.length+' groups missing cvr'); });}); \
    console.log('shape OK →', d.may.label, d.may.rev); \
    console.log('chart last month →', s.charts.months.slice(-1)[0]); \
    console.log('reportPeriodLabel →', window.DASHBOARD_CONFIG.client.reportPeriodLabel);"
  ```
  Sanity-check: TACOS never >100%, ROAS plausible (this account swings widely month to month on a
  small base — a >60% MoM swing is not automatically wrong here the way it would be for a bigger
  account, but check it has an obvious cause in the underlying pull before shipping it), no
  negative/blank revenue, every MoM delta present, and `sections.charts.months` / `reportPeriodLabel`
  both actually end on/name the target month (not just `dateRanges`).
- **If browser tooling (Playwright/Chromium) is available, use it** for a quick screenshot of
  Overview/Advertising/Products — the shape checks above are structural and won't catch a stale
  label or a chart that renders the right numbers under the wrong month.

## Self-check gate (decides publish vs review)

Before publishing, ALL of these must pass. Treat any failure as a hard stop:

1. **Connector present** — the MerchantSpring connector is attached and its tools return data. If
   missing, do not guess or fabricate numbers.
2. **Every expected pull returned data** — no market/period came back null or empty for
   DE/FR/ES/IT. NLD returning nothing is expected, not a failure — don't pull it at all.
3. **`node` shape/syntax check passes** (prints `shape OK`, the chart's last month, and the current
   `reportPeriodLabel`).
4. **Finish-line grep is clean** — zero hits for the previous month's name outside genuine
   historical dates.
5. **Sanity pass is clean** — TACOS never >100%, no negative/blank revenue, every MoM delta present,
   and any headline swing >60% MoM has a traceable cause in the pulled data (see note above — don't
   auto-fail this account on swing size alone, but don't ship one you can't explain either).
6. **Every known tool workaround above was re-checked, not assumed** — if `getSalesByPeriod` or
   `getAdvertisingByChannels` turn out to be fixed, say so in the run log instead of silently using
   the old workaround; if a new tool failure shows up, treat it the same way (documented fallback or
   flagged in review), not silently skipped.

## Deliverable

**On a clean pass — auto-publish (no human gate):**
- Commit `clients/amacx/data.js` + `clients/amacx/config.js` (`reportPeriodLabel`) + `index.html`
  (`APP_VER` bump) and **push directly to `main`**. This requires the routine to have "Allow
  unrestricted branch pushes" enabled; if the push to `main` is rejected, fall back to the failure
  path below (open a PR) rather than leaving the work unpublished.
- Commit message: `Auto-rebake AMACX — [Month] [Year]`.
- **Notify:** find or create the entry in the **Monthly Report Progress** Notion database (page
  `c13f085b49bf41d6b9fd181ce85dc43f`) named `AMACX — [Month] [Year]`. Set Status to **Done**. A
  sibling routine (`tools/amacx-monthly-sync.routine.md`) writes to the same database for the
  Google Sheet actuals sync — check the entry's existing content first and add a comment
  distinguishing your dashboard-rebake result from that routine's rather than overwriting it.
  Include the target month's **EU revenue / ad spend / TACOS / ROAS, each vs the prior month**, and
  the finish-line grep result.

**On any failure — do NOT touch `main`:**
- Do not push partial or suspect data. Commit what you have to a `claude/`-prefixed branch and open
  a **draft PR** titled `AMACX monthly re-bake — <Mon YYYY> (NEEDS REVIEW)` explaining exactly which
  self-check failed.
- Set the Notion entry's Status to **Under Review** with a comment listing what couldn't be
  confirmed and a link to the draft PR.

Never merge a PR yourself. The auto-publish path skips PRs entirely; the failure path always leaves
a human gate.
