# Harvaza — monthly Amazon bake prompt

> **How to use:** feed this whole file to a Claude session (e.g. a scheduled monthly task) that has the
> **MerchantSpring MCP** and this repo available. It re-pulls the live Amazon actuals, hand-edits
> `clients/harvaza/data.js`, bumps the cache-buster, and pushes. Modelled on the NKV bake (hand-baked from
> MerchantSpring, no PowerShell generator). Runs unattended — follow every step and the validation gate.

---

## 0. What this bake owns (and must NOT touch)

Harvaza is the **founder-template hybrid**: an acquisition *forecast* (P&L Detail page) paired with *live
Amazon actuals*. Only the **Amazon actuals** are baked here.

**BAKE (this prompt):** the Amazon blocks in `clients/harvaza/data.js` —
`dateRanges` (`may` / `3m` / `6m`) + `sections.{overviewActuals, products, inventory, pnl, advertising}` and
their per-period `dateRanges[p].sec.*` overrides.

**DO NOT TOUCH:**
- `sections.founder` (Overview project cards, **P&L Detail**, Stock & COGS, Director's Loan) — served **live**
  by `harvaza-sheet-proxy.gs` (Google Sheet forecast + Notion cards, `overlay:'founder'`). Never bake it.
- `clients/harvaza/config.js` — identity, markets, palette. Not a data refresh.
- `index.html` **except** the one-line `APP_VER` bump (step 8).

**Actuals-only policy:** the dashboard shows actuals everywhere; the forecast lives only on P&L Detail. There
is **no "Forecast" date option** — the selector is `may` / `3m` / `6m` only.

---

## 1. Channels & identity

| Market | `channelId` | `merchantId` | Currency | Ads |
|---|---|---|---|---|
| Harvaza Distribution **UK** | `106474509` | `APPQBM8SKYNLC @ A1F83G8C2ARO7P` | **GBP £** | connected |
| Harvaza Distribution **US** | `106482207` | `A3LN9JCI8BPO2W @ ATVPDKIKX0DER` | **USD $** | not connected (ad figures = £0/$0) |

- `getSalesByChannels` / `getAdvertisingByChannels` take `searchText: "Harvaza"` and return **both** stores in
  one call. `getStoreProfitAndLoss` / `getProductProfitAndLoss` / `getSalesByProduct` take `channelId` +
  `merchantId` (one call per market).
- **Currency rule:** UK = £, US = $, shown per-market, **never summed across currencies**. The `'all'` chip and
  `dateRanges[p].rev` use the **UK £** total only.
- **Timezone:** `Europe/London` on every call.
- If `getChannels` returns different IDs than the table above (re-mapped account), use the live IDs and note it
  in the hand-off.

---

## 2. Date windows (compute first, relative to run date)

The three slot **keys never change** (`may` / `3m` / `6m`) — only their `label` / `shortLabel` and the data
roll each month. `may` is the **last complete calendar month**, not literally May.

Use `calculateDateEpoch` (timezone `Europe/London`) to get epoch-second ranges:

| Slot | Window | How to compute |
|---|---|---|
| `may` | Last complete month | `predefinedPeriod: "lastMonth"` (also gives the prior month for MoM deltas) |
| `3m`  | Trailing 3 complete months | `dateRange` from 1st of (lastMonth − 2) → last day of lastMonth |
| `6m`  | **Year to Date** (Jan 1 → end of last complete month) | `dateRange` from Jan 1 of the current year → last day of lastMonth |

Also compute each **individual calendar month** in the 3m and 6m windows — the P&L and advertising endpoints
are **30-day-capped**, so multi-month figures are **summed from per-month pulls** (step 4B/4D).

Set every `label` / `shortLabel` to the real months, e.g. `may → "Last Month · <Mon YYYY>"` / `"<Mon YYYY>"`,
`3m → "Last 3 Months · <Mon>–<Mon> YYYY"`, `6m → "Year to Date · Jan–<Mon> YYYY"`.

---

## 3. Block → source map

| `data.js` block | MerchantSpring call | Notes |
|---|---|---|
| `dateRanges[p]` KPIs (`rev`, `aov`, deltas) + `mktRows` (UK £ + US $ sales) | `getSalesByChannels` (searchText `Harvaza`, `includeTax:true`, `orderedRevenue`) per window | UK+US in one call. `rev` = UK £. MoM deltas from the prior-period comparison. |
| `sec.overviewActuals` (`kpis` UK/US sales·orders·units, `cvr`) | `getSalesByChannels` per window | `cvr` = conversions (units ÷ page-views) per channel. `buyBox` + `revTrend` are top-level (below). |
| `sections.overviewActuals.revTrend` (monthly UK trend) | `getSalesByChannels` per month (UK ordered) | Rolling last ~6 months; used by Founder Overview. |
| `sec.products` (`kpis`, `table` — UK £ / US $) | `getSalesByChannels` per window | `cvrCls`: ≥8 `bg`, ≥4 `ba`, else `br`. |
| `sections.pnl.margin` + `statement` + `mkt` | `getStoreProfitAndLoss` per channel, **per month, summed** | UK drives margin/statement; `mkt` = UK + US. Net (settlement) revenue — **not** the ordered `getSalesByChannels` figure. |
| `sections.pnl.portfolio` (most/least profitable, counts) | `getProductProfitAndLoss` per channel (last month), all SKUs | Rank by **margin %** (currency-neutral); `profit` in native currency. `marginCls`: ≥25 `bg`, ≥15 `ba`, else `br`/red. |
| `dateRanges[p]` ad KPIs (`spend`, `tacosAd`, `roasAd`) + `adChart` + `sections.advertising.metrics` | `getAdvertisingByChannels` (searchText `Harvaza`, UK) per window | US ads not connected → US spend `$0`. If UK ads paused in the window, spend `£0` and note it. No CPC/campaign data → `Avg. CPC: '—'`. |
| `dateRanges[p].revBreakChart` (Organic vs Ad-attributed, stacked monthly bars) | **derived** (see step 4F) | Per month: Ad-attributed = ad **sales**; Organic = gross revenue − ad sales. |
| `sections.inventory` (`kpis`, `stock`, `restock`) | `getSalesByProduct` (`includeNoInventory:true`) per channel — current snapshot | Period-independent (current stock). `quantity==0` ⇒ OOS. |

---

## 4. Pull & transform (per block)

**4A. Sales actuals — `getSalesByChannels`** (`searchText:"Harvaza"`, `includeTax:true`,
`vendorRevenueType:"orderedRevenue"`, `timezone:"Europe/London"`) once per window, passing the prior period
(`priorFromDate`/`priorToDate`) for the `may` MoM deltas. From each response take, per channel: `sales`,
`orders`, `units`, `avOrderValue` (→ `aov`), and `conversions`/`pageViews` (→ `cvr` = units ÷ page-views, 1 dp).
Write:
- `dateRanges[p].rev` = UK £ sales; `revD`/`revC` = MoM delta (▲/▼, `du`/`df`); `mktRows` UK £ + US $ sales (col 6).
- `sec.overviewActuals.kpis` (UK/US sales, orders, units) + `cvr`; `sec.products.kpis` + `table`.
- `sections.overviewActuals.revTrend.series[0].values` = last ~6 months of UK ordered sales (one `getSalesByChannels`
  per month, UK).

**4B. Amazon P&L — `getStoreProfitAndLoss`** per channel, **one call per calendar month** in the window, then
**sum the months** (the endpoint is 30-day capped). Fields: gross/shipped sales, promotions, other income, net
revenue, advertising, selling fees, fulfilment/shipping, cost of goods, total expenses, profit, units, orders.
- `sections.pnl.margin` (UK, last month): `Gross Revenue` = net revenue; then `−Selling Fees`, `−Fulfilment`,
  `−Ad Spend`, `−COGS`, `Net Profit`; `pct` = margin %, `pctColor` green if ≥15 else amber.
- `sections.pnl.statement` (UK): Income / Expenses / Profit / Metrics groups with `amount` / `pct` (of net
  revenue) / `unit` (÷ units). `fixedLabel` = `"Amazon UK · <window label>"`.
- `sections.pnl.mkt` = UK + US rows (revenue, adspend, net, margin %).
- **Per-period:** write `dateRanges['3m'].sec.pnl.{margin,statement,mkt}` and `['6m']...` = the summed 3-/6-month
  figures; the top-level `sections.pnl.*` is the `may` default.

**4C. Product portfolio — `getProductProfitAndLoss`** per channel (last month), all active SKUs (`pageSize` big
enough to cover every SKU). Combine UK + US, rank by **margin %**. Write `sections.pnl.portfolio`:
`total` = active SKU count; `profitable`/`breakeven`/`unprofitable` = counts by net profit; `most` = top 3 by
margin, `least` = bottom 2 (amber styling). `profit` in native currency (£ UK, $ US), `margin` as `NN%`.

**4D. Advertising — `getAdvertisingByChannels`** (`searchText:"Harvaza"`, UK) per window (30-day capped → sum
months for 3m/6m). Fields: spend, sales, ACOS, ROAS, TACOS (spend ÷ total sales), impressions/clicks if present.
- `dateRanges[p]`: `spend`, `tacosAd`, `roasAd` (+ subs). `adChart` = monthly UK ad **spend** trend
  (`xLabels` last ~6 months; single dark `#2C3420` area series).
- `sections.advertising.metrics`: Total Spend, Ad Sales, ACOS (amber if >25%), TACOS, ROAS, `Avg. CPC: '—'`.
- US: no ad account → US spend `$0` in `mktRows` / `mkt`. If UK ads are paused in a window, set spend `£0`,
  keep the last-active figures in `metrics`, and note the paused state in a comment (as the current file does).

**4E. Inventory — `getSalesByProduct`** (`includeNoInventory:true`) per channel, current snapshot. Per SKU take
`quantity` and `daysCover`. Write `sections.inventory`:
- `kpis`: In-Stock / Low-Stock / OOS counts + OOS %.
- `stock`: one row per SKU — `dot` (`dg` healthy / `da` low / `dr` critical), name, `note` (`<ASIN> · FBA · <status>`),
  `units`, `days` (`~N days`), colour low/critical.
- `restock`: SKUs under ~7 days cover, ordered most-urgent first (`red` then `amber`).

**4F. Revenue Breakdown — `revBreakChart`** (derived; stacked monthly bars, Ad sales vs Organic). For each month
in the window: **Ad-attributed** = UK ad **sales** that month (from 4D); **Organic** = UK gross revenue that
month (from 4B) − Ad-attributed. Then per slot:
- `may` → 1 bar `['<Mon>']`; `3m` → 3 bars; `6m` → `['Jan'…'<Mon>']`.
- `series[0]` = Ad sales `#2C3420` (bottom), `series[1]` = Organic `#a7ab90` (top).
- `legend: [{name:'Ad sales',color:'#2C3420'},{name:'Organic',color:'#a7ab90'}]`.
- `max` = round the tallest monthly total up to a clean number; `yTicks` = 5 labels `['£<max>'…'£0']` (`£Nk` if ≥1000).
- **Reconciliation:** per slot, `Σ ad + Σ organic` must equal that period's **gross revenue** from the margin/statement
  card, and `Σ ad` must equal the period ad **sales**.

**Formatting:** `£`/`$` prefix, thousands separators (`£1,895`), AOV 2 dp (`£36.49`), deltas `▲`/`▼`. Keep the
existing key order and comments; only the numbers, labels, and array lengths change.

---

## 5. Validate (gate — do not push if any check fails)

```bash
# 1) It loads and the slots are intact
node -e "global.window={};require('./clients/harvaza/data.js');var d=window.DASHBOARD_DATA.dateRanges;console.log('slots',Object.keys(d));['may','3m','6m'].forEach(k=>{var c=d[k].revBreakChart,a=c.series[0].values.reduce((x,y)=>x+y,0),o=c.series[1].values.reduce((x,y)=>x+y,0);console.log(k,'ad',a,'organic',o,'gross',a+o);});"
# 2) Braces/brackets balanced
node -e "var t=require('fs').readFileSync('clients/harvaza/data.js','utf8');var m=s=>(t.match(new RegExp('\\\\'+s,'g'))||[]).length;console.log('braces',m('{'),m('}'),'brackets',m('['),m(']'));"
```

✅ Confirm: file loads; `slots` = `['may','3m','6m']`; each slot's `ad+organic` **equals** that period's gross
revenue in `sections.pnl` / `sec.pnl.margin`; braces balanced; brackets balanced.

Spot-check consistency: `mktRows` UK sales == `dateRanges[p].rev`; `sec.pnl.mkt` UK revenue == `margin` gross
revenue; `revBreakChart` month count == `xLabels` length; no US ad spend anywhere except `$0`.

---

## 6. Bump the cache-buster

`data.js` changed, so bump **`APP_VER`** at the top of `index.html` to the bake date (e.g. `2026-07-01h` →
`2026-08-01a`) so browsers fetch the fresh `data.js` instead of a cached copy. Nothing else in `index.html`.

---

## 7. Commit, push, hand off

- Files changed: **`clients/harvaza/data.js`** + **`index.html`** (the `APP_VER` bump) only. A pure data refresh
  needs **no proxy redeploy** (the founder sections stay live via `harvaza-sheet-proxy.gs`).
- Commit with a clear message (e.g. `Harvaza: bake <Mon YYYY> Amazon actuals`) and **push to `main`** (the
  deployed branch — GitHub Pages serves `main`; the change goes live in ~1–2 min).
- Report the headline `may` figures back: UK £ sales, US $ sales, UK net profit + margin %, ad spend/state, and
  the OOS SKU count — plus any anomaly (channel re-map, ads (un)paused, a SKU turning unprofitable).

---

## What does NOT need re-pulling monthly

- `sections.founder` (forecast + Notion cards) — **live** via the proxy.
- `config.js` (identity/markets/palette) and `app.js` (only when behaviour changes).
- FY-frozen history, if any is added later.
