# Harvaza (Bervera) — monthly Amazon re-bake (Routine prompt)

You are running the **Harvaza monthly Amazon re-bake** as an autonomous Claude Code routine. Work end-to-end
without asking for confirmation. This is an **auto-publish + notify** setup: when every self-check passes, publish
straight to `main` (it's live) and log the run; only fall back to a human review gate if something fails.

## What to do

Follow the ordered runbook in **`README.md` → "Re-baking Harvaza's Amazon data" → "Monthly re-bake routine (agent
runbook)"**. Read that section first and follow **every** step in order. This file is the trigger + guardrails; the
README is the authoritative procedure.

## Target month

The **latest fully-closed calendar month**. If today is 2026-08-03, the target month is **July 2026**. Recompute
the MerchantSpring period epochs each run with `calculateDateEpoch` in timezone `Europe/London`. The `data.js`
object key **`may`** is the "Last Month" slot — keep the key literally `may`; only update its `label`/`shortLabel`.
Periods: `may` = last month · `3m` = trailing 3 · `6m` = **Year to Date** (Jan 1 → end of last month). No `12m`,
no "Forecast" option.

## Key facts (also in the runbook)

- **This bake owns the Amazon actuals ONLY.** Never touch `sections.founder` (Overview project cards, **P&L
  Detail**, Stock & COGS, Director's Loan) — served **live** by `harvaza-sheet-proxy.gs` (Google Sheet forecast +
  Notion, `overlay:'founder'`). Baking it would clobber the founder forecast.
- **Files you hand-edit:** `clients/harvaza/data.js` (the baked Amazon snapshot), `clients/harvaza/config.js`
  (`reportPeriodLabel` → `'<Mon YYYY> · Year 1 Forecast'`), and `index.html` (bump `APP_VER`). Repo root *is* the
  dashboard folder.
- **MerchantSpring channels** (`searchText:"Harvaza"` returns both in one call for the by-channel reports):
  **UK `106474509`** (`APPQBM8SKYNLC @ A1F83G8C2ARO7P`, GBP £, ad-managed), **US `106482207`**
  (`A3LN9JCI8BPO2W @ ATVPDKIKX0DER`, USD $, **no ad account** — ad figures `$0`).
- **Currency:** UK = £, US = $, per-market, **never summed**. `'all'` chip + `dateRanges[p].rev` = UK £ only.
- **P&L + advertising are 30-day-capped** → sum per-month pulls for `3m`/`6m`. Ordered revenue
  (`getSalesByChannels`, drives chips/Overview/Products) ≠ net P&L revenue (`getStoreProfitAndLoss`) — keep separate.
- **`revBreakChart`** (Revenue Breakdown, stacked monthly bars) is derived: per month Ad-attributed = UK ad sales,
  Organic = UK gross revenue − ad sales; series `#2C3420` (Ad) / `#a7ab90` (Organic).
- **Validate before committing** (throws on any JS error):
  ```bash
  node -e "global.window={}; require('./clients/harvaza/data.js'); const d=window.DASHBOARD_DATA.dateRanges; \
    ['may','3m','6m'].forEach(p=>{if(!d[p]) throw new Error('missing period '+p); \
      const c=d[p].revBreakChart, a=c.series[0].values.reduce((x,y)=>x+y,0), o=c.series[1].values.reduce((x,y)=>x+y,0); \
      console.log(p,'ad',a,'organic',o,'gross',a+o);}); console.log('shape OK →', d.may.label, d.may.rev)"
  ```
  Sanity-check: TACOS never >100%, ROAS ~2–3×, no negative/blank revenue, every MoM delta present, US ad spend `$0`.
- **Bump `APP_VER`** in `index.html` (new bake date + letter). A data-only refresh needs no proxy redeploy.

## Self-check gate (decides publish vs review)

Before publishing, ALL of these must pass. Treat any failure as a hard stop:

1. **Connector present** — the MerchantSpring connector is attached and its tools return data. If missing, do not
   guess or fabricate numbers.
2. **Every expected pull returned data** — no UK market/period came back null or empty (US may legitimately be
   near-zero; US ads are always `$0`).
3. **`node` shape/syntax check passes** (prints `shape OK`).
4. **revBreak reconciles** — for `may`/`3m`/`6m`, `Σ ad + Σ organic` equals that period's P&L **gross revenue**,
   and `Σ ad` equals the period ad sales.
5. **Sanity pass is clean** — TACOS never >100%, ROAS ~2–3×, no negative/blank revenue, every MoM delta present,
   and no single headline metric swings >60% month-over-month without an obvious cause (a big swing is exactly the
   "plausible but wrong" case a human should see — treat it as a failure and route to review).

## Deliverable

**On a clean pass — auto-publish (no human gate):**
- Commit `clients/harvaza/data.js` + `index.html` (`APP_VER` bump) + `clients/harvaza/config.js` and **push
  directly to `main`**. This requires the routine to have "Allow unrestricted branch pushes" enabled; if the push
  to `main` is rejected, fall back to the failure path below (open a PR) rather than leaving the work unpublished.
- **Notify:** add a comment to the GitHub issue **`tdstrategists-code/td-dashboard` #19 "Harvaza monthly re-bake —
  run log"** with the target month's **UK £ sales / US $ sales / UK net profit + margin / ad spend + state / OOS
  SKU count, each vs the prior month**, and a `✅ validations passed — published to main` line. Keep it to a few lines.

**On any failure — do NOT touch `main`:**
- Do not push partial or suspect data. Commit what you have to a `claude/`-prefixed branch and open a **draft PR**
  titled `Harvaza monthly re-bake — <Mon YYYY> (NEEDS REVIEW)` explaining exactly which self-check failed.
- Also comment on issue **#19** with a one-line `⚠️ needs review` summary + the draft PR link, so it surfaces in the
  same notify channel.

Never merge a PR yourself. The auto-publish path skips PRs entirely; the failure path always leaves a human gate.
