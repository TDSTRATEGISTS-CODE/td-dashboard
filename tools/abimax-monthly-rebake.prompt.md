# Abimax — monthly Amazon re-bake (Routine prompt)

You are running the **Abimax monthly Amazon re-bake** as an autonomous Claude Code routine. Work end-to-end
without asking for confirmation. This is an **auto-publish + notify** setup: when every self-check passes, publish
straight to `main` (it's live) and log the run; only fall back to a human review gate if something fails.

Abimax is the simplest client: **Amazon-only, single US marketplace, USD**. There is no Shopify, no founder
forecast, and no multi-market currency handling — so this is a lean re-bake of one channel.

## What to do

Re-bake `clients/abimax/data.js` from MerchantSpring for the latest fully-closed month. The detailed MerchantSpring
pull sequence is documented in **`tools/new-client-setup.prompt.md` → "2. Pull the real actuals"** — read that and
follow the same tools/order (`getChannels` → `calculateDateEpoch` → `getSalesByPeriod` → `getSalesByProduct` →
`getStoreProfitAndLoss`). This file is the trigger + guardrails specific to the monthly refresh.

## Target month

The **latest fully-closed calendar month**. If today is 2026-09-05, the target month is **August 2026**. Recompute
the MerchantSpring period epochs each run with `calculateDateEpoch` in timezone **`America/Los_Angeles`**. The
`data.js` object key **`may`** is the "Last Month" slot — keep the key literally `may`; only update its
`label`/`shortLabel`. Periods: `may` = last month · `3m` = trailing 3 · `6m` = **Since Launch** (Mar 2026 → end of
last month; launch-to-date — keep the key `6m` and the "Since Launch" label). No `12m`.

## Key facts (also in the new-client runbook)

- **MerchantSpring:** channel **`106785689`**, merchant **`A267LLT9LT0HS9 @ ATVPDKIKX0DER`**, Amazon US, native
  **USD ($)**, timezone `America/Los_Angeles`.
- **Files you hand-edit:** `clients/abimax/data.js` (the baked snapshot), `clients/abimax/config.js`
  (`reportPeriodLabel` → `'<Mon YYYY> · Monthly Report'`), and `index.html` (bump `APP_VER` — new bake date +
  letter). Repo root *is* the dashboard folder. A data-only refresh needs **no proxy redeploy**.
- **DO NOT bake `sections.overview.tasksSpec` / `flagsSpec` / `completedSpec`** — those are served **live** by
  `abimax-sheet-proxy.gs` from the project tracker (`overlay:'sections'`). Refresh only the MerchantSpring-derived
  overview cards: **`overview.cvr`, `overview.stockWarn`, `overview.buyBox`** (the baked tasks/flags/completed are
  just the offline fallback — leave them).
- **Digital Dash tier — P&L stays gated.** `sections.pnl` is baked (from `getStoreProfitAndLoss`) but hidden behind
  the Executive paywall. Refresh its numbers so it stays current, but **never remove `'pnl'` from
  `config.hiddenPages`** — the client is Digital Dash, so the Amazon P&L must remain the 🔒 locked gate.
- **Sections to refresh:** `dateRanges` (may/3m/6m — headline KPIs, `mktRows`, `revChart`/`adChart`/`revBreakChart`,
  `campaignMix`), and `sections.{advertising, inventory, products, pnl}` + the three MerchantSpring overview cards.
- **Advertising campaigns** are per-ASIN Sponsored Products: **spend + CPC are real** per-SKU (product report);
  **ad-sales are allocated** from the channel-attributed total by spend share (keep the existing comment). Headline
  `adSales`/`ACOS`/`ROAS`/`TACOS` come from `getSalesByPeriod` (channel-attributed, self-consistent).
- **`revBreakChart`** (stacked monthly bars) is derived: per month Ad-attributed = ad sales, Organic = gross
  revenue − ad sales; series `#404935` (Ad) / `#a7ab90` (Organic).
- **Currency note:** all figures are `$`, but the shared trend-chart axis formatter (`moneyK`) hardcodes `€` — a
  known template limit; do not "fix" it in data.js.
- **Validate before committing** (throws on any JS error):
  ```bash
  node -e "global.window={}; require('./clients/abimax/config.js'); require('./clients/abimax/data.js'); \
    const d=window.DASHBOARD_DATA.dateRanges, c=window.DASHBOARD_CONFIG; \
    (c.dateRangeOptions||[]).forEach(o=>{if(!d[o.value]) throw new Error('missing period '+o.value); \
      const b=d[o.value].revBreakChart; if(b){var a=b.series[0].values.reduce((x,y)=>x+y,0), \
      org=b.series[1].values.reduce((x,y)=>x+y,0); console.log(o.value,'ad',a,'organic',org,'gross',a+org);}}); \
    console.log('shape OK →', d[c.defaultPeriod].label, d[c.defaultPeriod].rev)"
  ```
  Sanity-check: TACOS never >100%, ROAS plausible (Abimax runs efficient — ~5–7×), no negative/blank revenue,
  every MoM delta present.

## Self-check gate (decides publish vs review)

Before publishing, ALL of these must pass. Treat any failure as a hard stop:

1. **Connector present** — the MerchantSpring connector is attached and its tools return data. If missing, do not
   guess or fabricate numbers.
2. **Every expected pull returned data** — no period came back null/empty.
3. **`node` shape/syntax check passes** (prints `shape OK`).
4. **revBreak reconciles** — for `may`/`3m`/`6m`, `Σ ad + Σ organic` equals that period's gross revenue, and
   `Σ ad` equals the period ad sales.
5. **Sanity pass is clean** — TACOS never >100%, ROAS plausible, no negative/blank revenue, every MoM delta
   present, and no single headline metric swings >60% month-over-month without an obvious cause (a big swing is the
   "plausible but wrong" case a human should see — treat it as a failure and route to review).

## Deliverable

**On a clean pass — auto-publish (no human gate):**
- Commit `clients/abimax/data.js` + `clients/abimax/config.js` (`reportPeriodLabel`) + `index.html` (`APP_VER`
  bump) and **push directly to `main`**. If the push to `main` is rejected, fall back to the failure path below
  (open a PR) rather than leaving the work unpublished.
- **Notify:** add a comment to GitHub issue **`tdstrategists-code/td-dashboard` #21 "Abimax monthly re-bake — run
  log"** with the target month's **revenue / ad spend / TACOS / ROAS / orders / reorder-watch SKU count, each vs
  the prior month**, and a `✅ validations passed — published to main` line. Keep it to a few lines.

**On any failure — do NOT touch `main`:**
- Do not push partial or suspect data. Commit what you have to a `claude/`-prefixed branch and open a **draft PR**
  titled `Abimax monthly re-bake — <Mon YYYY> (NEEDS REVIEW)` explaining exactly which self-check failed.
- Also comment on issue **#21** with a one-line `⚠️ needs review` summary + the draft PR link.

Never merge a PR yourself. The auto-publish path skips PRs entirely; the failure path always leaves a human gate.
