# NKV Beauty — monthly data re-bake (Routine prompt)

You are running the **NKV Beauty monthly data re-bake** as an autonomous Claude Code routine. Work end-to-end
without asking for confirmation. This is an **auto-publish + notify** setup: when every self-check passes, publish
straight to `main` (it's live) and log the run; only fall back to a human review gate if something fails.

## What to do

Follow the ordered runbook in **`README.md` → "Refreshing NKV" → "Monthly re-bake routine (agent runbook)"**.
Read that section first and follow **every** step in order. This file is the trigger + guardrails; the README is
the authoritative procedure.

## Target month

The **latest fully-closed calendar month**. If today is 2026-08-03, the target month is **July 2026**. Recompute
the MerchantSpring period epochs each run with `calculateDateEpoch` in timezone `Europe/London`. The `data.js`
object key **`may`** is the "Last Month" slot — keep the key literally `may`; only update its `label`/`shortLabel`.

## Scope — this covers TWO separate pipelines, not just Amazon

The rebake has two independent data sources that must **both** be refreshed. It's easy to do only the first
one and ship a page that's half July, half stale — that has actually happened. Don't stop after Amazon.

1. **Amazon** (MerchantSpring): `dateRanges`, `marketKpis`, `sections.charts` (the trend charts —
   **separate from `dateRanges`, easy to forget**), `sections.advertising.{metrics,campaigns}`, `campaignMix`,
   `sections.inventory`, `stockWarn`, `sections.products.groupsByPeriod`.
2. **Shopify/D2C** (MerchantSpring Shopify channel + GA4 via Reporting Ninja): `sections.shopify` — its own
   channels (Contours Rx `33616599`), its own GA4 properties, its own trend chart. Completely separate pull,
   completely separate part of the file. See the runbook's "Shopify (D2C) → `sections.shopify`" step.

## Key facts (also in the runbook)

- **Files you hand-edit:** `clients/nkv/data.js` (the baked snapshot), `clients/nkv/config.js`
  (`reportPeriodLabel`; also confirm `client.currencyIcon` is `'£'` — if it's missing, the trend charts
  silently render in `€` even though every other figure on the page is correctly `£`), and `index.html`
  (bump `APP_VER`, using **today's actual date**, not the date you started the pull). Repo root *is* the
  dashboard folder.
- **MerchantSpring channels — Amazon:** UK `71662311`, IE `86715690`, US `109142957` (see the runbook table
  for merchant IDs). UK is the only fully-live market; IE is early-stage (no ads); US now has real (small) ad
  spend too, no longer a pure zeros placeholder.
- **MerchantSpring channels — Shopify:** Contours Rx `33616599` (`658f4a.myshopify.com`, order-side live),
  Newnique `110450469` (order-side not yet ingested — its cards stay "pending Executive integration").
- **GA4 (Reporting Ninja)** — Contours Rx `properties/394327082`, Newnique `properties/506386258`. Needs the
  **Reporting Ninja connector** attached to the routine, separately from MerchantSpring.
- **`getSalesByPeriod` doubling bug:** a month that lands as the *first* bucket of a multi-month pull gets its
  ad-spend/ad-sales/tacos/acos fields doubled (sales/units/orders are fine). Cross-check against a non-first
  position or `getAdvertisingByChannels` before trusting an ad figure.
- **Never touch the live-proxy blocks:** Overview project board, `sections.shopifypnl`,
  `sections.inventory.supplierPOs` — those are served live by `nkv-sheet-proxy.gs`, not baked.
- **Validate before committing** (throws on any JS error — checks both pipelines):
  ```bash
  node -e "global.window={}; require('./clients/nkv/data.js'); const d=window.DASHBOARD_DATA; \
    ['may','3m','6m','12m'].forEach(p=>{if(!d.dateRanges[p]) throw new Error('missing period '+p)}); \
    console.log('shape OK →', d.dateRanges.may.label, d.dateRanges.may.rev); \
    console.log('chart last month →', d.sections.charts.months.slice(-1)[0]); \
    console.log('shopify chart last month →', d.sections.shopify.data.contoursrx.chart.xLabels.slice(-1)[0]);"
  node -e "global.window={}; require('./clients/nkv/config.js'); \
    if (!window.DASHBOARD_CONFIG.client.currencyIcon) throw new Error('currencyIcon not set')"
  ```
  Sanity-check: TACOS never >100%, ROAS ~2–3×, no negative/blank revenue, every MoM delta present, and both
  chart `xLabels`/`months` arrays actually end on the target month (not just `dateRanges`).
- **If browser tooling (Playwright/Chromium) is available, use it.** The chart-not-updating bug and the
  €-instead-of-£ bug both passed every `node` shape check above — they only showed up on an actual render.
  A quick screenshot of Overview/Advertising/Shopify, or a DOM text-scan for stray `€`, catches what the
  shape checks structurally cannot.
- **Before pushing:** `git fetch origin main` and check for new commits — same-day rebakes for other clients
  (AMACX/Abimax/Harvaza) also bump `APP_VER` in `index.html`, so a merge conflict there is normal, not a sign
  of a problem. Resolve by taking today's date, re-run the validate step, then push.
- **Bump `APP_VER`** in `index.html` (new bake date + letter, today's real date). A data-only refresh needs no
  proxy redeploy.

## Self-check gate (decides publish vs review)

Before publishing, ALL of these must pass. Treat any failure as a hard stop:

1. **Connectors present** — **both** MerchantSpring and Reporting Ninja are attached and their tools return
   data. If either is missing, do not guess or fabricate numbers for the pipeline it serves — that includes
   not silently skipping Shopify and publishing Amazon-only.
2. **Every pull returned data** — no market/period came back null or empty for a market that should have data
   (UK always; IE/US may legitimately be near-zero; Shopify Contours Rx always; Newnique order-side is
   expected to be "pending", that's not a failure).
3. **`node` shape/syntax checks pass** (both commands in the runbook/key-facts above print their expected
   output — `dateRanges`, `sections.charts`, `sections.shopify`, and `config.js` `currencyIcon`).
4. **Sanity pass is clean** — TACOS never >100%, ROAS ~2–3×, no negative/blank revenue, every MoM delta present,
   both trend-chart month arrays end on the target month, and no single headline metric swings >60% month-over-
   month without an obvious cause (a big swing is exactly the "plausible but wrong" case a human should see —
   treat it as a failure and route to review).
5. **If a Shopify/GA4 field looks internally inconsistent** (e.g. a returning-customer rate that implies 100%
   first-time purchasers for a store with known repeat orders), don't bake a number you don't trust — mark
   that one field unavailable and say so in the run-log comment, rather than either fabricating it or failing
   the whole run over one soft field.

## Deliverable

**On a clean pass — auto-publish (no human gate):**
- Commit `clients/nkv/data.js` + `index.html` (`APP_VER` bump) + `clients/nkv/config.js` and **push directly to
  `main`**. This requires the routine to have "Allow unrestricted branch pushes" enabled; if the push to `main` is
  rejected, fall back to the failure path below (open a PR) rather than leaving the work unpublished.
- **Notify:** add a comment to the GitHub issue **`tdstrategists-code/td-dashboard` #4 "NKV monthly re-bake — run
  log"** with the target month's **Amazon revenue / ad spend / TACOS / ROAS, each vs the prior month**, plus a
  one-line Shopify net-sales figure (vs prior month), and a `✅ validations passed — published to main` line.
  Note any field you marked unavailable (see self-check #5) so it's visible without opening the diff. Keep it
  to a few lines.

**On any failure — do NOT touch `main`:**
- Do not push partial or suspect data. Commit what you have to a `claude/`-prefixed branch and open a **draft PR**
  titled `NKV monthly re-bake — <Mon YYYY> (NEEDS REVIEW)` explaining exactly which self-check failed.
- Also comment on issue **#4** with a one-line `⚠️ needs review` summary + the draft PR link, so it surfaces in the
  same notify channel.

Never merge a PR yourself. The auto-publish path skips PRs entirely; the failure path always leaves a human gate.

## Full-bake rule + data-basis lessons (added after the Sep 2026 run)

- **Every section must advance to the target month — no "carried forward" shortcuts.** That means `dateRanges`
  may/3m/6m/**12m** (+ `yoy`), `sections.charts`, advertising metrics/campaigns/`campaignMix`/budgets,
  `inventory` + `stockWarn` ("stock-up" wording), `products` (tiles, table, brand groups — `LBL.may` too),
  `pnl.statement`, Overview `cvr`, and the whole Shopify page incl. 12m and Newnique GA4. Fan the pulls out to
  parallel subagents (Shopify, Amazon channels + 12m campaigns, inventory, products/groups, P&L + sheet) so it
  fits in one run. Grep the finished `data.js` for the previous month's name before committing.
- **Shopify = TOTAL REVENUE INCLUDING VAT**: always pass `includeTax:true` (VAT only appears in the data from
  mid-2026; earlier months have none). Do not restate to ex-tax.
- `getSalesByPeriod` `interval:'M'` works with `timezone:'GMT'` (it rejects Europe/London) and currently
  returns correct settled monthly sales/orders for all three markets and Shopify; use it for revenue/orders.
  UK ad spend / ad sales still come from generated `campaigns` reports per window (12m reconciles within 0.2%).
- The Account Tracker Drive read returned no readable budget rows in Sep 2026 — advertising `budgets`/`forecast`
  were rolled from the documented £3,000 budget / £3,500 forecast; re-confirm from the sheet when possible.
