# Client Reporting Dashboard — split architecture

A single shared template that renders any client's dashboard, selected by a URL parameter. Each client
picks a **template** (a page set): `amazon` (seller analytics) or `founder` (acquired-brand forecast).

```
dashboard/
  index.html        ← shared TEMPLATE: markup + CSS + client loader. Holds EVERY page block for both
                       templates — Amazon pages, the founder-* pages, and the shared maintenance stub.
                       No client values live here.
  app.js            ← shared LOGIC: page registry + templates, generated nav/tabs, all renderers, the
                       live-data overlay. Reads config + data and paints the UI. No client values.
  td-logo.png       ← shared TD Strategists logo (used by every client for now).
  wix-embed.js      ← Wix Custom Element `<td-dashboard>` — iframes the dashboard and auto-resizes to the
                       height the page reports on every view. Hosted next to index.html; self-locating.
                       See "Embedding in Wix" below.
  clients/
    amacx/          ← AMAZON-template client (EU · MerchantSpring · live Apps Script overlay)
      config.js     ← window.DASHBOARD_CONFIG — identity, brand, markets, template, hiddenPages, dataSource
      data.js       ← window.DASHBOARD_DATA  — dateRanges (KPIs + market table) + a FULL `sections` object
                       (GENERATED — do not hand-edit; see "Re-baking AMACX" below)
    demo/           ← AMAZON-template demo (UK · GBP · channels Amazon/eBay/D2C · static)
      config.js
      data.js       ← dateRanges + a full `sections` object that data-drives every deep page
    harvaza/        ← FOUNDER client (brand "Bervera") — HYBRID: founder forecast (Google Sheet + Notion)
      config.js        + live Amazon ACTUALS (MerchantSpring UK £ + US $). template:'founder', olive/gold,
      data.js          markets Harvaza UK(£)+US($), hiddenPages:['keywords'], pageLabels:{pnl:'Amazon P&L'},
                       dataSource appsScript/overlay:'founder'. data.js = dateRanges may/3m/6m (period-aware
                       Amazon actuals) + sections.founder (forecast/Notion) + Amazon sections
                       (products/inventory/pnl/advertising/overviewActuals). See "Harvaza" below.
    nkv/            ← AMAZON-template client (UK-led · GBP · MerchantSpring · live Apps Script overlay)
      config.js     ← markets = UK + Ireland('New') + USA('New', recently launched), scopeLabel 'UK',
                       maintenancePages:['amazonpnl'], plus `marketMaintenance` (gates IE/US Advertising)
                       and `layout` (per-client card hide/relabel/move — see "Per-client layout" below)
      data.js       ← dateRanges + sections, hand-baked from MerchantSpring (UK actuals + real IE/US FBA
                       stock and IE brand mix); the sheet overlay supplies live overview tasks/flags,
                       advertising budget + forecast, Shopify P&L, and supplier POs
  tools/
    build-amacx-data.ps1     ← generator that writes clients/amacx/data.js from a baked MerchantSpring + sheet snapshot
    build-harvaza-data.ps1   ← regenerates Harvaza's Amazon products blocks → tools/harvaza-amazon-baked.js (splice helper)
    amacx-data-proxy.gs      ← Apps Script source for AMACX (sheet → dateRanges + sections); deploy in Apps Script
    nkv-sheet-proxy.gs       ← Apps Script source for NKV (scope board + Shopify P&L + supplier POs); deploy in Apps Script
    abimax-sheet-proxy.gs    ← Apps Script source for Abimax (scope board only — Amazon-only client); deploy in Apps Script
    harvaza-sheet-proxy.gs   ← Apps Script source for Harvaza (Founder-Dashboard Sheet + Notion Deal Hub; see "Harvaza")
    harvaza-amazon-baked.js  ← GENERATED splice snippet (not loaded by the app; safe to ignore/regenerate)
    new-client-setup.prompt.md    ← agent runbook: end-to-end new-client setup (data bake + proxy + verify)
    nkv-monthly-rebake.prompt.md  ← Routine trigger: monthly NKV Amazon re-bake (auto-publish + notify, issue #4)
    harvaza-monthly-rebake.prompt.md ← Routine trigger: monthly Harvaza Amazon re-bake (auto-publish + notify, issue #19)
    amacx-monthly-sync.routine.md ← Routine trigger: monthly AMACX sheet/data sync
```

> **Apps Script proxies** (`amacx-data-proxy.gs`, `harvaza-sheet-proxy.gs`, `nkv-sheet-proxy.gs`) are now
> **versioned in `tools/`** (so they can be read/edited from a cloud session), but they actually **run in
> Google Apps Script** and are **not** served from GitHub. Editing the `.gs` in this repo does **nothing**
> on its own — you must paste it into the bound Apps Script project and **redeploy a new version** (Deploy ▸
> Manage deployments ▸ edit ▸ New version) to keep the same `/exec` URL (or update `config.dataSource.url`).
> The AMACX proxy reads the Project-Scope board by **fixed column** — `E` = In Progress, `F` = Upcoming,
> `G` = Completed, `I` = Flags & Warnings — and supplies the live per-market ad budgets + forecast.
> The **NKV proxy** (`nkv-sheet-proxy.gs`) instead locates the board columns by **header text**
> (`In Progress` / `Upcoming` / `Completed` / `Flags & Warnings` — case-sensitive for the first two) and
> returns `sections.overview` (the project board) **plus** live `sections.shopifypnl` and
> `sections.inventory.supplierPOs`. The board on the sheet MUST carry those exact header cells, or the
> proxy returns no overview and the Overview cards show the **"Currently updating"** fallback.
> The **Abimax proxy** (`abimax-sheet-proxy.gs`) is the same header-text approach trimmed to
> **scope board only** (no Shopify P&L / supplier POs — Abimax is Amazon-only); it's the lean template
> to copy for a new single-brand Amazon client. **Every client gets one** — the setup runbook
> (`tools/new-client-setup.prompt.md`) always writes a `tools/<slug>-sheet-proxy.gs` for the client's
> project tracker. After
> editing any `.gs`, **redeploy a new version** (Deploy ▸ Manage deployments ▸ edit ▸ New version) to keep
> the same `/exec` URL, and ensure access is **Execute as: Me · Anyone**.

The page reads `?client=<name>` and loads `clients/<name>/config.js` + `data.js` before `app.js` boots.

- **AMACX:** `https://<your-host>/dashboard/index.html?client=amacx`
- **UK demo:** `https://<your-host>/dashboard/index.html?client=demo`
- **Harvaza:** `https://<your-host>/dashboard/index.html?client=harvaza`
- **NKV Beauty:** `https://<your-host>/dashboard/index.html?client=nkv`
- Default client (no param) is `amacx`.

> **Deploy note:** this folder is not a git repo — changed files are uploaded to GitHub manually. After any edit, push the files you touched (commonly `app.js`, `index.html`, the edited `clients/<name>/` files, `tools/build-amacx-data.ps1`).

### Client templates: which pages exist

A client's `config.template` decides *which pages exist and in what order*. Two layers in `app.js` drive it:

- **`PAGE_REGISTRY`** — every navigable page key → `{ label, icon }`. A matching `page-<key>` block must
  exist in `index.html`. `currency:true` swaps the icon for the client's `currencyIcon` (€ / £ / $).
- **`TEMPLATES`** — named, ordered page sets:

  | Template | Pages | Used by |
  |---|---|---|
  | `amazon` *(default when unset)* | Overview · P&L & Expenses · Advertising · Inventory · Products · Keywords · Amazon P&L | `amacx`, `demo`, `nkv` |
  | `founder` | Overview · P&L Detail · Stock & COGS · Director's Loan · *then every Amazon page as a maintenance stub* | `harvaza` |

At boot, `resolvePages()` builds the list: **template → optional `config.pages` override → minus
`config.hiddenPages`**. `buildNav()` then **generates** the sidebar nav (`#sb-nav`) and the tab bar
(`#page-tabs`) from that list — neither is hardcoded in `index.html` any more. So the template fully
determines a client's navigation, and `switchPage` activates the first page.

**Maintenance stubs.** A template's `maintenance` list (or `config.maintenancePages`) marks pages that
aren't built yet. Those keys route to one shared `#page-maintenance` block ("This page is undergoing
maintenance"), titled with the page name. Founder clients use this to **expose every Amazon page before a
founder version exists** — to make one go live, drop its key from `TEMPLATES.founder.maintenance`.

**Founder pages live in the shared shell.** The `founder-overview / founder-pnl / founder-stock /
founder-loan` blocks sit in `index.html` and are filled by `renderFounderSections()` from
`DATA.sections.founder` — **opt-in**, a no-op for Amazon clients (zero regression). That's deliberate: the
founder pages are reusable by any future founder client. Founder charts reuse the shell's SVG `renderChart`
(no Chart.js). Adding a brand-new page = register it in `PAGE_REGISTRY`, add it to a template's `pages`, and
add a `page-<key>` block to `index.html`.

### Deep pages: the `sections` object

`index.html` ships a set of **default markup** for the deeper pages (P&L, Inventory, Products, Keywords,
lower Overview, campaign/forecast tables, the two SVG charts). A client overrides any of it by providing a
`sections` object in its `data.js`:

- **Has `sections`** → `app.js` rebuilds those pages from the data at boot (and per date-range), including
  auto-scaled SVG charts, so the client is fully self-consistent.
- **No `sections`** → the static markup in `index.html` renders unchanged.

**All three clients ship a `sections` object.** AMACX's is generated from real MerchantSpring data (see
below); the demo's is hand-authored UK/GBP for the Amazon pages. Harvaza's is a `sections.founder` object
(`overview` / `pnl` / `stock` / `loan`) that drives the four founder pages. Renderers guard every field, so a
partial `sections` is safe — anything an Amazon client omits falls back to the template markup, and a missing
`sections.founder` simply leaves the founder pages unrendered.

Per-period overrides: `dateRanges[period].sec` can override any `sections` block for that date range;
`app.js` uses `pick(periodOverride, topLevelDefault)` so a period only overrides what it specifies.

AMACX's **Products page is fully period- + market-aware** via period-keyed maps in `sections.products`:
`kpisByPeriod`, `tableByPeriod`, and `groupsByPeriod` (each `period → market → rows`). So the KPI cards,
the Performance-by-Market table (incl. CVR), and the Sales-by-Group card (with Ad Spend + TACOS) all follow
**both** the date-range selector and the sidebar market chip. `app.js` reads `…[currentPeriod][market]`,
falling back to the static `kpis`/`table` only for the non-selectable `2025` period.

### Founder `sections.founder` shape

Founder clients (`template:'founder'`) drive their four pages from `data.js` → `sections.founder`. Each
key maps to one page; every field is optional (omit it and that part stays empty). The renderers live in
`app.js` (`renderFounderOverview / renderFounderPnl / renderFounderStock / renderFounderLoan`).

```js
sections.founder = {
  overview: {
    alert:      "string",                         // amber banner; omit to hide
    tasks:      { badge, items:[ DOT ] },          // Upcoming Tasks card
    stockWarn:  { badge, items:[ DOT ] },          // Stock Warnings card (use tint:true for the filled rows)
    milestones: { badge, items:[ DOT ] },          // Key Milestones card
    kpis:       [ KPI, KPI, KPI, KPI ],            // 4 KPI cards
    revChart:   CHART,                             // revenue (area+line) + profit-before-debt (dashed)
    loanCard:   { sub, big, bigSub, fillPct, meta:[a,b,c] },   // Director's-Loan side card
    waterfall:  [ BAR, ... ]                       // P&L Waterfall bars
  },
  pnl: {
    kpis:  [ KPI x4 ],
    chart: CHART,                                  // revenue / gross / net lines
    table: { cols:[ "Line item", ...months, "Total" ],
             rows:[ { section:"Header" } | { cells:[ ...cellHTML ], total?:bool } ] }
  },
  stock: {
    info:   "string",                              // blue info bar; omit to hide
    kpis:   [ KPI x3 ],
    phases: [ { title, tag:{ text, cls:"bg|ba|bb|br" }, cols:[...], rows:[ { cells, total? } ] }, ... ]
  },
  loan: {
    stats:    [ { lbl, val }, ... ],               // top stat grid (6)
    progress: { note, fillPct, meta:[a,b,c] },     // repayment progress bar
    kpis:     [ KPI x4 ],
    chart:    CHART,                               // declining balance (area+line)
    info:     "string"                             // blue info bar; omit to hide
  }
}
```

Shared building blocks (same helpers the Amazon pages use):

- **KPI** = `{ bar, lbl, val, dCls, d, dColor?, s? }` — `bar` is a hex/`var(--…)` for the coloured top
  stripe; `dCls` is `'du'` (green) / `'dd'` (red) / `'df'` (muted) for the delta line.
- **DOT** = `{ dot:'amber'|'red'|'green'|'muted', title, sub, tint?:bool, titleColor? }` — `tint:true`
  adds the soft row background (and a pulsing dot for `red`).
- **BAR** = `{ lbl, pct, val, color }` — `color` is a palette name (`green`/`muted`/…) or raw hex.
- **CHART** = the shell's `renderChart` spec: `{ max, yTicks:[top→bottom], xLabels, xHighlight?,
  series:[ { values, color, area?, main?, dash? } ], legend:[ { name, color } ] }`. Founder pages reuse
  this SVG renderer — no Chart.js. Table/phase `cells` are pre-formatted strings and may contain inline
  HTML (e.g. `'<span style="color:var(--red)">OOS</span>'`).

`clients/harvaza/data.js` is the worked reference for every one of these.

### Shopify (D2C) page — `sections.shopify` (NKV-only for now)

NKV gets an extra **Shopify** page (D2C performance) that the other Amazon clients don't. It's wired
**NKV-only** by declaring `config.pages` (the `amazon` template order + `'shopify'` inserted before
`amazonpnl`) rather than adding `shopify` to the shared template — so it stays hidden for every other
client until they opt in the same way. The `page-shopify` block + renderers live in the shared shell
(`index.html` / `app.js`), so they're a **no-op** for any client without `sections.shopify`.

The page has a **brand filter** at the top — `All · Newnique · Contours Rx` — that are **two separate
Shopify stores** (`ALL` = the sum). The chips are DATA-driven from `sections.shopify.brands` (never
hardcoded in `index.html`), and the filter re-scopes only this page via `currentBrand` →
`switchBrand()` → `renderShopify()`. It's independent of the sidebar market chips (those are the Amazon
marketplaces) but **does** follow the shared date-range selector.

```js
sections.shopify = {
  brands: [ { key:'all',label:'All' }, { key:'newnique',label:'Newnique' }, { key:'contoursrx',label:'Contours Rx' } ],
  data: {
    contoursrx: {
      label, store,                                  // header sub-label
      chart:  CHART,                                 // 6-mo net-sales trend (or null → cleared)
      stock:  [ { name, note, level:'g|a|r', units, cover } ],   // Stock Health list
      traffic:[ BAR ],                               // Traffic Sources (referrer)
      byPeriod: { may|3m|6m|12m: {
        kpis1:[ KPI x4 ], kpis2:[ KPI x4 ],          // Net Sales/Orders/AOV/ASP · CVR/Sessions/Units/Returning
        funnel:[ { lbl, val, pct, w, sub } ],        // Sessions→Cart→Checkout→Purchased
        products:[ { name, net, units, asp, orders, share, shareCls } ]
      } }
    },
    newnique: { …order-side pending Executive integration; GA4 session-side LIVE (sessions/funnel/traffic)… },
    all:      { …currently = Contours Rx (Newnique orders pending)… }
  }
}
```

**Data source.** This is the **post-Porter** bake (30 Jun 2026). The Shopify-via-Porter feed is gone;
the page now pairs two sources, mirroring the Amazon side:
- **Order-side** (net sales, orders, AOV, units, product mix, stock-on-hand) → **MerchantSpring's
  Shopify channels** — Contours Rx `33616599`, Newnique `110450469` (the same connector that already
  serves NKV's Amazon actuals).
- **Session-side** (sessions, CVR, the cart→checkout→purchase funnel, traffic-by-channel) → **GA4 via
  the Reporting Ninja connector** — `properties/394327082` (Contours Rx), `properties/506386258` (Newnique).

For **Contours Rx** both sides are exact actuals for every period (May / 3-mo / YTD / 12-mo). Note GA4
purchases (46 May) run below the Orders KPI (90) — orders include repeat/manual/no-session orders, so
the funnel + CVR are session-based while Orders is order-based (both valid, kept separate).
**Newnique:** MerchantSpring is connected but **not yet ingesting its orders**, so its order-side reads
**"pending Executive integration"** while its **GA4 session-side is live** (450 sessions May). `all`
equals **Contours Rx** until Newnique's orders backfill (then restore the CRX + Newnique sum). A live
proxy can overlay `sections.shopify` later, exactly like AMACX's sheet overlay.

**Shopify P&L page (`shopifypnl` · `sections.shopifypnl`).** A second NKV-only page, sharing the same
brand filter + date range (`switchBrand` repaints both; chips render into `#shop-brands` **and**
`#shop-brands-pnl`). It's a **brand → period → { kpis, info, rows }** model built by a small per-period
builder in `data.js`: every line — **Net Revenue, COGS, Google/social ad spend, Beckdale fulfilment,
Shopify + transaction fees, subscription, brand manager, the 5.5% TD fee, and Net Profit** — is sourced
from the **NKV Beauty Account Tracker** ("Shopify" block, monthly). Contours Rx carries the shared opex
(it’s ~99% of D2C); **Newnique is tracked _light_** (own revenue / COGS / Google Ads only); **`All` =
Contours Rx + Newnique**, and Net Profit ties to the sheet’s "Profit after COGS". An `other` residual
foots each month to the sheet’s "Shopify Expenses" total. The right card (`brand.statusList`) shows each
line's status. `renderShopifyPnl()` is a no-op for any client without `sections.shopifypnl`.

**Live updates.** `data.js` holds the baked snapshot (offline fallback); **`nkv-sheet-proxy.gs`
(`scanShopifyPnl_`) serves `sections.shopifypnl` live** from the Tracker, merged via `overlay:'sections'`
— so editing the sheet updates the P&L. The block is found by the `Total Shopify Revenue` anchor; CRX
sales are read below it (skipping the annual-total decoy) and `All` is summed from CRX + Newnique.

**TODO (next):** add earlier-month expenses to the Tracker so the 12-mo view is a true trailing year
(it’s YTD for now); confirm Newnique's store domain (placeholder `D2C · Shopify`); optionally split
the shared opex across brands once the Tracker itemises it per store.

---

## Harvaza — founder forecast + live Amazon actuals

Harvaza (brand **Bervera**, a recently-acquired coconut-water business) is the founder-template client, but
it's a **hybrid**: it pairs the acquisition *forecast* with *live Amazon actuals*. Three data sources:

| Source | Feeds | How |
|---|---|---|
| **Google Sheet** ("Founder Dashboard") | The Year-1 **forecast** — Overview→**P&L Detail** KPIs, monthly P&L chart + 12-month table | Apps Script proxy → `overlay:'founder'` (deep-merge onto `sections.founder`) |
| **Notion** ("🥥 Bervera Acquisition — Deal Hub") | Overview **project cards** — Upcoming Tasks (open handover to-dos) + Key Milestones (Timeline) | Same proxy (`harvaza-sheet-proxy.gs`) calls the Notion API; token in the script's **Script Properties** |
| **MerchantSpring** (Harvaza Distribution **UK** + **US**) | The **Amazon actuals** — Overview KPIs/trend/buy-box/CVR, Products, Inventory, **Amazon P&L**, Advertising | Baked snapshot in `data.js` (per-month pulls), refreshed in-session (see baker below) |

**Actuals-only policy (the key design rule):** the dashboard shows **actuals everywhere**; the **forecast
lives ONLY on the P&L Detail page**. So:
- **Date selector** = `may` (Last Month, default) / `3m` (Last 3 Months) / `6m` (Year to Date). No
  "Forecast" option. (Data starts at the acquisition, so YTD ≈ "all time".)
- **Sidebar chips** = per-period actual sales (UK £, US $; `'all'` = UK £ — currencies are never summed).
- **Overview** = project cards (Notion) on top, then Amazon-actuals widgets (KPI row + Revenue Trend +
  Buy Box + CVR), all period-aware.
- **P&L Detail** = the forecast home (KPIs + Revenue Trend + Director's Loan + P&L Waterfall + monthly
  breakdown + 12-month table) — period-independent (it's an annual forecast).
- **Stock & COGS** and **Director's Loan** are forecast/structure (left period-independent). **Inventory**
  is *current* stock (period-independent by design). **Keywords** is hidden (MerchantSpring has no keyword data).

**Period-awareness** of the Amazon pages is driven by `dateRanges[p].sec.{products,pnl,advertising,overviewActuals}`
(3m/6m overrides; the top-level `sections.*` is the May default). P&L and Advertising are 30-day-capped in
MerchantSpring, so the period figures are **summed from per-month pulls**. Note: *ordered* revenue
(getSalesByChannels — used for chips/products/Overview KPIs) ≠ *net* P&L revenue (getStoreProfitAndLoss) —
both are valid Amazon lenses, kept separate (same as AMACX).

**Currency:** UK = **£**, US = **$**, shown per-market, never summed across currencies.

### Deploying the Harvaza proxy (`tools/harvaza-sheet-proxy.gs`)

1. Apps Script (standalone or bound) → paste the `.gs`. It opens the Sheet **by ID** (works standalone) and
   reads the **Forecast** tab by content (a "Revenue Estimate" row — robust to the SKU-master tab).
2. For Notion: create an **internal integration** (Access token), add it as a **Script Property** named
   `NOTION_TOKEN`, and **share the Deal Hub page** with that integration. (Leave the property unset to skip Notion.)
3. The script needs the **`script.external_request`** OAuth scope (to call Notion) — declare it in
   `appsscript.json` `oauthScopes`, run once to consent, then **redeploy a new version**.
4. Deploy as a **Web app** (Execute as: Me · Access: **Anyone**) and paste the `/exec` URL into
   `config.dataSource.url`. Verify with `…/exec?debug=1`.
   *(PS gotcha for the bakers: never name a function `GBP` — it's a built-in alias for `Get-PSBreakpoint`.)*

### Re-baking Harvaza's Amazon data (`tools/build-harvaza-data.ps1`)

Same strategy as AMACX, but it only owns the **Amazon block** (the founder forecast is owned by the Sheet/Notion
proxy, so the baker must NOT clobber it). It regenerates the Products sections from in-session MerchantSpring
pulls and writes **`tools/harvaza-amazon-baked.js`** — a splice snippet you paste into `clients/harvaza/data.js`
(it does **not** overwrite `data.js`). To refresh the period-aware P&L/Advertising/Overview actuals, re-pull the
per-month figures (`getStoreProfitAndLoss` per month, `getSalesByChannels` per period) and update the literals.

The `.ps1` is an optional splice helper; the authoritative monthly process is the hand-baked runbook below
(same shape as NKV — no generator required).

### Monthly re-bake routine (agent runbook)

A monthly Harvaza refresh is a **Claude-session task** (the browser can't reach the MerchantSpring MCP). It runs
unattended as a **Routine** (see "Automating it" below) or by hand any time. Follow these steps **in order**;
each ends with a ✅ confirmation. **"Last month" = the latest fully-closed calendar month** (run in early Aug →
target July). Everything is repo-relative (repo root *is* the dashboard folder).

**This bake owns the Amazon actuals ONLY.** Never touch `sections.founder` (Overview project cards, **P&L Detail**,
Stock & COGS, Director's Loan) — served **live** by `harvaza-sheet-proxy.gs` (Google Sheet forecast + Notion,
`overlay:'founder'`). There is **no "Forecast" date option**: the selector is `may` / `3m` / `6m` only.

**Channels** (pass `channelId` + `merchantId`; `getSalesByChannels`/`getAdvertisingByChannels` take
`searchText:"Harvaza"` and return **both** in one call):

| Market | channelId | merchantId | Notes |
|---|---|---|---|
| UK | `106474509` | `APPQBM8SKYNLC @ A1F83G8C2ARO7P` | live market, **GBP £**, ad-managed |
| US | `106482207` | `A3LN9JCI8BPO2W @ ATVPDKIKX0DER` | **USD $**, **no ad account** (ad figures `$0`) |

**Currency:** UK = £, US = $, per-market, **never summed**. `'all'` chip + `dateRanges[p].rev` use **UK £** only.
**Periods** (recompute epochs each run with `calculateDateEpoch`, tz **`Europe/London`**): the object key **`may`
is the "Last Month" slot — keep the key literally `may`; only update its `label`/`shortLabel`**. `3m` = trailing 3
complete months; `6m` = **Year to Date** (Jan 1 → end of last complete month). P&L + advertising are **30-day-capped**
in MerchantSpring, so 3m/6m figures are **summed from per-month pulls**.

**Steps:**
1. **Headline actuals → `dateRanges` + `mktRows` + Overview/Products.** Per period pull `getSalesByChannels`
   (`searchText:"Harvaza"`, `includeTax:true`, `orderedRevenue`, pass the prior period for `may` MoM deltas).
   Update `rev` (UK £) + delta/colour, `aov`, `mktRows` (UK £ + US $ sales), `sec.overviewActuals.{kpis,cvr}`,
   `sec.products.{kpis,table}` (`cvr` = units ÷ page-views; `cvrCls` ≥8 `bg`/≥4 `ba`/else `br`), and
   `sections.overviewActuals.revTrend` (last ~6 months UK ordered). ✅ Confirm the `may` UK £ + US $ sales match
   Seller Central.
2. **Amazon P&L → `sections.pnl.{margin,statement,mkt}` (+ per-period `sec.pnl`).** `getStoreProfitAndLoss` per
   channel, **one call per calendar month, summed**. `margin`/`statement` = UK (net/settlement revenue — *not* the
   ordered figure from step 1); `mkt` = UK + US. Top-level `sections.pnl` = the `may` default; `3m`/`6m` overrides
   live in `dateRanges[p].sec.pnl`. ✅ Confirm UK net profit + margin % reconcile across margin/statement/mkt.
3. **Product portfolio → `sections.pnl.portfolio`.** `getProductProfitAndLoss` per channel (last month, all SKUs).
   Combine UK + US, rank by **margin %**; `total`/profitable/breakeven/unprofitable counts; `most` = top 3, `least`
   = bottom 2 (amber). `profit` in native currency. ✅ Confirm counts sum to `total`.
4. **Advertising → `dateRanges[p]` ad KPIs + `adChart` + `sections.advertising.metrics`.**
   `getAdvertisingByChannels` (`searchText:"Harvaza"`, UK) per period (sum months for 3m/6m). `spend`, `tacosAd`,
   `roasAd`; `adChart` = last ~6 months UK spend trend; `metrics` = Total Spend / Ad Sales / ACOS (amber >25%) /
   TACOS / ROAS / `Avg. CPC '—'`. US spend `$0`. If UK ads are paused in a window, spend `£0` and note it in the
   comment. ✅ Confirm `metrics` reconcile with the ad KPIs.
5. **Revenue Breakdown → `dateRanges[p].revBreakChart`** (stacked monthly bars, Ad sales vs Organic). Per month:
   Ad-attributed = UK ad **sales** (step 4); Organic = UK gross revenue (step 2) − Ad-attributed. `may` = 1 bar;
   `3m` = 3 bars; `6m` = `['Jan'…'<Mon>']`. `series[0]` Ad `#2C3420` (bottom), `series[1]` Organic `#a7ab90` (top);
   `legend` `Ad sales`/`Organic`; `max` = tallest month rounded up, 5 `yTicks`. ✅ **Reconcile:** per slot
   `Σad + Σorganic` == that period's gross revenue, and `Σad` == the period ad sales.
6. **Inventory → `sections.inventory.{kpis,stock,restock}`.** `getSalesByProduct` `includeNoInventory:true` per
   channel (current snapshot — period-independent). `quantity==0` ⇒ OOS; `dot` `dg`/`da`/`dr` by cover; `restock`
   = SKUs under ~7 days, most-urgent first. ✅ Confirm the OOS/low counts and per-SKU days-cover are sane.
7. **Labels & metadata.** Update the `data.js` header comment (`pulled <date>`), each period's `label`/`shortLabel`
   to the real months, and `config.js` `reportPeriodLabel` → `'<Mon YYYY> · Year 1 Forecast'`. Keys stay `may`/`3m`/`6m`.
8. **Validate.** Run the shape/reconciliation check (throws on any JS error):
   ```bash
   node -e "global.window={}; require('./clients/harvaza/data.js'); const d=window.DASHBOARD_DATA.dateRanges; \
     ['may','3m','6m'].forEach(p=>{if(!d[p]) throw new Error('missing period '+p); \
       const c=d[p].revBreakChart, a=c.series[0].values.reduce((x,y)=>x+y,0), o=c.series[1].values.reduce((x,y)=>x+y,0); \
       console.log(p,'ad',a,'organic',o,'gross',a+o);}); console.log('shape OK →', d.may.label, d.may.rev)"
   ```
   Then eyeball: TACOS never >100%, ROAS plausible (~2–3×), no negative/blank revenue, every MoM delta present, US
   ad spend `$0` everywhere. ✅ Confirm `shape OK`, each slot's `ad+organic` == its P&L gross revenue, sanity clean.
9. **Bump the cache-buster.** Increment **`APP_VER`** in `index.html` (e.g. `2026-07-01h` → the new bake date+letter)
   so browsers fetch the fresh `data.js`. A pure data refresh needs **no proxy redeploy** (founder sections stay live).
10. **Publish + notify.** If **every** self-check passes (gate below), commit `clients/harvaza/data.js` + `index.html`
    + `clients/harvaza/config.js` and **push straight to `main`** (live). Then log the run in GitHub issue
    [**#19 "Harvaza monthly re-bake — run log"**](../../issues/19) with the headline figures (UK £ sales / US $ sales /
    UK net profit + margin / ad spend + state / OOS SKUs **vs prior month**) + `✅ validations passed`. **On any
    failure, do NOT touch `main`** — open a **draft PR** (`… (NEEDS REVIEW)`) explaining what failed and drop a `⚠️`
    note on issue #19.

    **Self-check gate (auto-publish only when all pass):** MerchantSpring connector present · every expected UK pull
    returned data (US may legitimately be near-zero) · `node` check prints `shape OK` · each slot's revBreak
    reconciles to its P&L gross revenue · sanity clean (TACOS ≤100%, ROAS ~2–3×, no negative/blank rev, all MoM
    deltas present, **no headline metric swinging >60% MoM** without cause — route that to human review).

**Automating it (monthly Routine).** This runbook runs unattended as a Claude Code **Routine** whose prompt lives
at [`tools/harvaza-monthly-rebake.prompt.md`](tools/harvaza-monthly-rebake.prompt.md). Wire it with a **schedule
trigger on the 5th of each month** (cron `40 9 5 * *` — 09:40, staggered after AMACX 09:00 + NKV 09:20 so the three
bakes don't hit MerchantSpring or push to `main` at once; times are UTC, so +1h UK during BST), the
**MerchantSpring connector** attached, and **"Allow unrestricted branch pushes" enabled** so it can publish to
`main`. It's **auto-publish + notify**: green runs go
live and log to issue #19; only a failed self-check falls back to a draft PR + review.

---

## Re-baking AMACX (`tools/build-amacx-data.ps1`)

AMACX's `data.js` is a **baked snapshot** of MerchantSpring data (the browser can't call the MerchantSpring
MCP, so it's pulled in a Claude session, hardcoded into the generator, and written out). The **sheet-controlled
parts overlay live** on top via the Apps Script proxy (`config.dataSource` is `appsScript` + `overlay:'sections'`)
— per-market ad **budgets**, the advertising **forecast**, and the Overview Project-Scope cards (**In Progress /
Completed / Upcoming**) — so those update on reload **without** a re-bake. The baked MerchantSpring sections are
authoritative and are never overlaid.

```
clean MerchantSpring MCP actuals  ─┐
Google Sheet budgets / flags      ─┤→  build-amacx-data.ps1  →  clients/amacx/data.js  ──(+live sheet overlay)──►  dashboard
```

**IMPORTANT — every bake refreshes the inputs first.** The generator bakes a *static* snapshot of its
hardcoded arrays, so re-running it alone never picks up new numbers. Before each bake, re-pull the
MerchantSpring actuals (via the MCP, in-session) into the `$M` arrays, and re-sync the Google Sheet
budgets into `$BUD`. Then run:

```powershell
& "dashboard/tools/build-amacx-data.ps1"
```

Notes:
- **Sales/units/orders** (`$M`) = MerchantSpring **single-month** `getSalesByPeriod` with `includeTax:true`
  (gross / inc-VAT, matches Seller Central). The multi-month `interval=M` series has unreliable bucket labels —
  don't use it. `adSpend`/`adSales` = `getAdvertisingByChannels`.
- The script prints a per-period summary (Rev / Spend / TACOS / ROAS / Units / Orders) on each run.
- Non-ASCII must be `[char]` codes (PowerShell 5.1 reads the script as ANSI). Watch for case-insensitive
  variable collisions (e.g. `$eU` vs the `$EU` chart hashtable) — they silently corrupt output.
- The sheet **budgets** are a hardcoded snapshot in `$BUD` — they do not auto-pull, so sync them each bake.
- **Products page (period-aware):** `kpisByPeriod` + `tableByPeriod` are **computed** in the generator from
  `$M`; table **CVR** is per-period MerchantSpring `conversions` (units/page-views, from `getSalesByChannels`,
  baked in `$CVRP`). **`groupsByPeriod`** (Sales-by-Group → the 15 MerchantSpring Groups, with Ad Spend + TACOS)
  is a **baked literal injected by a SEPARATE PowerShell pass** from per-period `getSalesByProduct` pulls joined
  to the sheet's SKU→Group map (column B). Re-running this script preserves it; to **refresh the group numbers**
  you must re-run that injection pass — editing `$M` alone won't update `groupsByPeriod`.
- **Advertising / Overview charts:** the two trend cards read `sections.charts`. The 6-month window
  (`months` + `rev`/`adSpend`/`adSales`/`adTacos`, EU + per market) is **computed from `$M` over a trailing-6
  window that DERIVES from the newest populated month (`$lastIdx`/`$cidx`) — so it auto-advances every bake;
  never hand-pin it.** `sections.charts.revTarget` (dotted EU goal line, All-EU only) is synced from **Performance
  Tracker row 8 "Revenue Target (past vs future)"** into `$REVTGT` (append the new month each bake). That baked
  target is only the **offline fallback** — the live Apps Script proxy overlays `sections.charts.revTarget` from
  the same sheet row on every load (`buildSections`), so the dotted line is always the true sheet value when the
  proxy is reachable. **`sections.advertising.campaignMixByPeriod`**
  (the Performance-by-Campaign-Type pie, `period → market`) is a **baked literal** aggregated from
  `generateCampaignsReport` per period × channel (SP/SB/SD by `ad_type`) — like `groupsByPeriod`, editing `$M` won't
  refresh it; you must re-run the campaign pulls.
- **Buy Box (Overview):** `sections.overview.buyBoxByPeriod` (official featured-offer %, `period → market`, with MoM delta)
  is a baked literal from `generateTrafficAndConversionReport` per period × channel (page-view-weighted `buyboxWinPercentage`);
  `sections.overview.buyBoxLosses` (loss list) is from `generateBuyBoxReport` `filter:'losing'` per channel (current snapshot).
  Both live in `$ovJs` and need their own pulls — `$M` won't refresh them. The static `buyBox` bars remain only as the
  non-AMACX fallback.

### Monthly re-bake routine (agent runbook)

A monthly AMACX refresh is a **Claude-session task** (the browser can't reach the MerchantSpring MCP). Follow these
steps in order; each ends with a confirmation. "This month" = the latest closed month.

**Channels** (AMACX seller `A1O4H4W8GP4BN2`; pass `channelId` + `merchantId`):

| Market | channelId | merchantId | Ads |
|---|---|---|---|
| DE | `75877234` | `A1O4H4W8GP4BN2 @ A1PA6795UKMFR9` | yes |
| FR | `75877496` | `A1O4H4W8GP4BN2 @ A13V1IB3VIYZZH` | yes |
| ES | `75880638` | `A1O4H4W8GP4BN2 @ A1RKKUPIHCS9HS` | yes |
| IT | `75880666` | `A1O4H4W8GP4BN2 @ APJ6JRA9NG5V4` | yes |
| NLD | `75880695` | `A1O4H4W8GP4BN2 @ A1805IZSGTT6HS` | **no — skip ads** (pre-launch) |

**Periods** (recompute epochs each month with `calculateDateEpoch`, `dateRange`, tz `Europe/Berlin`):
`may` = this month · `3m` = trailing 3 · `6m` = trailing 6 · `12m` = trailing 12 · `2025` = FY2025 **(FROZEN — pull once ever; SKIP on monthly refreshes)**. So recurring monthly = **4 windows × 4 ad channels** per per-period feature, not 5×4.

> **Per-period features that each need their own 4×4 = 16 windowed pulls:** product groups (`getSalesByProduct`),
> campaign-type pie (`generateCampaignsReport`), and Buy Box % (`generateTrafficAndConversionReport`). Plus per-channel
> snapshots (no windows): inventory + Buy Box losses (`getSalesByProduct` / `generateBuyBoxReport`, 4 each). Budgets and
> the revenue target come from the sheet. It's a lot of pulls — fire each report type in batches, then aggregate.

**Steps:**
1. **Headline actuals → `$M`.** Per market, pull `getSalesByPeriod` (**single-month**, `includeTax:true`) for each new
   month and `getAdvertisingByChannels` for spend/sales; update the monthly arrays in `build-amacx-data.ps1` (idx 0=Jan2025…,
   append the new month). The SAME `getAdvertisingByChannels` call also returns **impressions + clicks** — bake those into
   `$M[mkt].impr` + `$M[mkt].clicks` (monthly; the ad report caps windows at **30 days**, so pull **month-by-month** with
   `searchText:'AMACX'` to filter to seller `A1O4H4W8GP4BN2`). These feed the Ad Metrics card's Impressions / CTR / Avg-CPC
   and the Overview Conversion-Rate KPI. ✅ Confirm: the script's printed per-period summary matches Seller Central for `may`.
2. **Budgets → `$BUD`** and **revenue target → `$REVTGT`.** Re-read the Google Sheet (`read_file_content`): per-market ad
   budgets and **row 8 "Revenue Target (past vs future)"**. **APPEND** this month's target to `$REVTGT` (don't replace the
   history — the chart window `$cidx` slices it, and the generator throws if `$REVTGT` is shorter than `$M`). The trailing-6
   chart window itself auto-advances from `$M` — no manual month-index edit needed. ✅ Confirm: `$REVTGT` last value = the
   sheet's current-month target, and `$REVTGT.Count == $M.DE.sales.Count`.
3. **CVR → `$CVRP`.** Pull `getSalesByChannels` `conversions` (units/page-views) per market per rolling window. ✅ Confirm: 4 markets × 4 windows present.
4. **Product groups → `groupsByPeriod`.** Re-run the groups injection pass: `getSalesByProduct` per rolling window × channel,
   join to the sheet SKU→Group map (col B), 15 groups with sales/units/pct/adSpend/TACOS/OOS. ✅ Confirm: 4 periods × {all,de,fr,es,it} × 15 groups.
5. **Campaign-type pie → `campaignMixByPeriod`.** For each rolling window × ad channel (16 reports) run
   `generateCampaignsReport` → `getReportStatus` → download CSV → aggregate `cost`/`attributed_sales` by `ad_type`
   (SP/SB/SD); EU `all` = sum of the 4 markets; ACOS = cost÷sales (`n/a` if sales < €100). Re-bake the literal in `$advJs`
   (write `€` as `${EUR}`). ✅ Confirm: pie pcts per market sum to ~100%, no 1000%+ ACOS.
6. **Buy Box → `buyBoxByPeriod` + `buyBoxLosses`** (Overview Buy Box card + loss list). Two sources:
   - **% tracker (official featured-offer %):** `generateTrafficAndConversionReport` (view `parents`) per rolling window ×
     channel (16 reports) → `getReportStatus` → download CSV → market % = Σ(`buyboxWinPercentage`×`pageViews`)/Σ`pageViews`,
     MoM delta from `priorBuyboxWinPercentage`; **EU `all` = page-view-weighted across the 4 channels** →
     `sections.overview.buyBoxByPeriod[period][all/de/fr/es/it]` = `{pct,pctTxt,delta,deltaCls}`.
   - **Loss list:** `generateBuyBoxReport` `filter:'losing'` per channel (4 reports — **current snapshot, NOT per-period**) →
     one row per losing ASIN: short name + ASIN/EAN, **market flag** (so `applyMarketFilter` scopes it), reason (`yourStatus`:
     Losing to Others/Amazon/Self/No Winner), your `yourPriceAmount` vs the `offerIsBuyBoxWinner=1` offer's listing+shipping,
     and the gap; sort by gap. Re-bake both literals into `$ovJs` (write `€` as `${EUR}`).
     ✅ Confirm: EU % plausible (~80s; DE the drag), every loss row carries a market flag.
7. **Inventory.** Refresh `$invJs` from `getSalesByProduct` (stock/days-cover/OOS) — in-stock / OOS / SKUs-to-restock,
   plus `kpisByMarket` (per-market unique-SKU counts; OOS counts UNIQUE SKUs, not listings).
   **Exclude `$DISCONTINUED` ASINs** (the sheet SKU list's "Discontinued" status) from BOTH the lists and the KPI counts —
   never surface a discontinued SKU in any stock section or recommend restocking it. ✅ Confirm: no `$DISCONTINUED` ASIN in `$invJs`.
8. **Generate + validate.** Run `& "dashboard/tools/build-amacx-data.ps1"`, then check the output:
   ```powershell
   $t=[IO.File]::ReadAllText("dashboard/clients/amacx/data.js")
   "{0}/{1} braces  {2}/{3} brackets" -f ([regex]::Matches($t,'{')).Count,([regex]::Matches($t,'}')).Count,([regex]::Matches($t,'\[')).Count,([regex]::Matches($t,'\]')).Count
   'revTarget','adSales:','groupsByPeriod','campaignMixByPeriod','buyBoxByPeriod','buyBoxLosses','kpisByMarket','impr:','ctr:','adBudget:','cvr:' | %{ "$_  -> $($t.Contains($_))" }
   ```
   ✅ Confirm: braces balanced, brackets balanced, all keys present.
9. **Verify in preview** (`tools/static-server.ps1` + Preview MCP, `?client=amacx`): switch a couple of date ranges ×
   markets and confirm the Revenue Trend (**last x-axis month = this month**, not a month behind; target line on All-EU), Ad Spend/Sales/TACOS chart, Products KPIs/table/groups,
   the Campaign-Type pie, the **Buy Box % + per-market bars + loss list**, the Inventory KPIs (per-market), the Overview
   5-card **Conversion-Rate** KPI, and the **Ad Metrics** card (Impressions / CTR / Avg-CPC / Ad Budget / Utilisation —
   budget & util come LIVE from the sheet via `overlayBudgets`) all move with date+market.
   (Screenshots time out — use `preview_eval` DOM checks. The browser caches `app.js`/`index.html` — force-load a fresh
   `app.js?bust=…` in preview, and hard-refresh in a real browser.)
10. **Bump the cache-buster.** Because `data.js` changed, increment **`APP_VER`** at the top of `index.html`
   (e.g. `2026-06-18a` → the new bake date) so browsers fetch the fresh `data.js` instead of a cached copy.
11. **Confirm + hand off.** Report the headline `may` figures back, then list the changed files to upload to GitHub:
   **`clients/amacx/data.js`** + **`index.html`** (the `APP_VER` bump) — and `tools/build-amacx-data.ps1` if the generator
   itself changed. A pure data refresh needs **no proxy redeploy** (the proxy only serves sheet sections, which stay live).
   **Exception:** if `tools/amacx-data-proxy.gs` itself changed (e.g. the one-time addition of the live
   `sections.charts.revTarget` overlay), copy it into the Apps Script editor and **Deploy ▸ Manage deployments ▸ Edit ▸
   New version** once — otherwise the live dotted target line won't update. This is a one-off per proxy change, not monthly.

> **What does NOT need re-pulling monthly:** FY 2025 columns (frozen history), the live sheet sections (budgets/forecast/
> Project-Scope — served by the proxy), and `index.html`/`app.js` (only when behaviour changes).

---

## Refreshing NKV (hand-baked — no generator)

NKV's `data.js` has **no `.ps1`** — it's hand-baked from MerchantSpring in a Claude session, with the
sheet-driven parts overlaid **live** by `nkv-sheet-proxy.gs`. To refresh: re-pull the blocks below via the
MCP, hand-edit `clients/nkv/data.js`, bump **`APP_VER`**, and upload `data.js` + `index.html` (no proxy
redeploy for a data-only refresh). Channels — **UK `71662311`** (`A1SNRD9T28Z9ZM @ A1F83G8C2ARO7P`),
**IE `86715690`** (`… @ A28R8C7NBKEWEA`), **US `109142957`** (`A18Z9VPWTLGIMA @ ATVPDKIKX0DER`, a separate
Newnique-only seller).

**Live via the proxy (never re-baked):** Overview project board (In Progress / Upcoming / Completed),
`sections.shopifypnl`, `sections.inventory.supplierPOs`.

**Baked from MerchantSpring (refresh in-session):**

| Block | Source | Notes |
|---|---|---|
| `dateRanges` KPIs + `marketKpis` (uk/irl/usa) | `getSalesByPeriod` (single-month, `includeTax:true`) + `getAdvertisingByChannels` | period-aware; `all` = UK top-level, per-market overlays |
| `sections.advertising.metrics` (+ per-period `sec`) & `campaigns` | `getAdvertisingByChannels` / `getSalesByProduct` (UK) | Ad Metrics card (TACOS/ROAS intentionally dropped from the list) + Active Campaigns |
| `campaignMix` (per period) | campaign sales-share by `ad_type` (UK) | pie — colours **#404935 / #9caf78 / #e8a87c** (SP / SB / SD) |
| `sections.inventory.{kpisByMarket,stockByMarket,restockByMarket}` (irl/usa) | `getSalesByProduct` `includeNoInventory:true` per channel (current snapshot) | IE ships FBA from UK; US Supplier-PO card hidden via `supplierPOsByMarket:{usa:[]}` |
| `stockWarn` (Overview FBA card) | `getSalesByProduct` `includeNoInventory:true` (UK) | `quantity==0` ⇒ out of stock / suppressed (currently 26 of 77 UK listings) |
| `sections.products.groupsByPeriod` (Ad Spend + TACOS, per market) | `getSalesByProduct` per window × brand | UK real (TACOS = ad spend ÷ brand sales); **IE allocated from its real 12-mo brand mix** (no ads → TACOS n/a); **US £0** (recently launched) |

**Sheet-baked (re-read the NKV Beauty Account Tracker, not MS):** `sections.advertising.budgets` + `forecast`
(Marketing Metrics row — currently a flat forward budget), and the `sections.shopify` blocks. Per-client
structure (Buy Box/Account-Health removed, pie moved, Ad-Budgets section hidden, IE/US Advertising gated)
lives in `config.layout` / `config.marketMaintenance` — see "Per-client layout & market gating".

### Monthly re-bake routine (agent runbook)

A monthly NKV refresh is a **Claude-session task** (the browser can't reach the MerchantSpring MCP). It runs
unattended as a **Routine** (see "Automating it" below) or by hand any time. Follow these steps **in order**;
each ends with a ✅ confirmation. **"This month" = the latest fully-closed calendar month** (e.g. run in early
Aug → target July). Everything is repo-relative (repo root *is* the dashboard folder).

**Channels** (pass `channelId` + `merchantId`):

| Market | channelId | merchantId | Notes |
|---|---|---|---|
| UK  | `71662311`  | `A1SNRD9T28Z9ZM @ A1F83G8C2ARO7P` | the live market — real data, ad-managed |
| IE  | `86715690`  | `… @ A28R8C7NBKEWEA`              | early-stage, EUR-native, **no ads**; ships FBA from UK |
| US  | `109142957` | `A18Z9VPWTLGIMA @ ATVPDKIKX0DER`  | separate Newnique-only seller; **placeholder (zeros)** until it trades |

**Periods** (recompute epochs each run with `calculateDateEpoch`, tz **`Europe/London`**): the object key **`may`
is the "Last Month" slot — keep the key literally `may`; only update its `label`/`shortLabel`** to the new month.
`3m`/`6m`/`12m` = trailing 3 / 6 / 12. UK is the only fully-live market; IE is early-stage; US stays zeros.

**Steps:**
1. **Headline actuals → `dateRanges` + `marketKpis`.** Per market per period, pull `getSalesByPeriod`
   (**single-month**, `includeTax:true`) + `getAdvertisingByChannels`. Update the KPI strings (rev/adSales/tacos/
   roas/spend/aov), their **MoM deltas** (`revD`, `spendD`, …) and colour codes (`revC` `du`/`df`), and the
   `mktRows` table. Top-level `all` = **UK** figures; `marketKpis.{uk,irl,usa}` are the per-market overlays.
   ✅ Confirm the `may` headline (rev / spend / TACOS / ROAS) matches Seller Central for the target month.
2. **Ad Metrics + campaigns → `sections.advertising.metrics` (+ per-period `sec`) & `campaigns`.** UK
   `getAdvertisingByChannels` / `getSalesByProduct`. (TACOS/ROAS are intentionally **omitted** from the metrics list.)
   ✅ Confirm `metrics` totals reconcile with step 1's UK spend/ad-sales.
3. **Campaign-type pie → `campaignMix` (per period).** UK campaign sales-share by `ad_type` — colours
   **SP `#404935` / SB `#9caf78` / SD `#e8a87c`**. ✅ Confirm each period's pcts sum to ~100%.
4. **Inventory → `sections.inventory.{kpisByMarket,stockByMarket,restockByMarket}` (irl/usa).**
   `getSalesByProduct` `includeNoInventory:true` per channel (current snapshot). IE ships FBA from UK; the US
   Supplier-PO card stays hidden via `supplierPOsByMarket:{usa:[]}`. ✅ Confirm per-market SKU counts are sane.
5. **Overview FBA stock warning → `stockWarn`.** UK `getSalesByProduct` `includeNoInventory:true`; `quantity==0`
   ⇒ out-of-stock/suppressed. ✅ Confirm the "N of M UK listings" count.
6. **Product groups → `sections.products.groupsByPeriod` (per market).** `getSalesByProduct` per window × brand.
   **UK real** (TACOS = ad spend ÷ brand sales); **IE allocated from its real 12-mo brand mix** (no ads → TACOS
   `n/a`); **US £0**. ✅ Confirm 4 periods present per live market.
7. **Sheet-baked → `sections.advertising.{budgets,forecast}` + `sections.shopify`.** Re-read the **NKV Beauty
   Account Tracker** (Marketing Metrics row + Shopify block) — *not* MerchantSpring. **Do NOT touch the live-proxy
   blocks** (Overview project board, `sections.shopifypnl`, `sections.inventory.supplierPOs` — served live by
   `nkv-sheet-proxy.gs`). ✅ Confirm budgets/forecast reflect the current sheet.
8. **Labels & metadata.** Update the `data.js` header comment (`pulled <date>`), each period's `label`/`shortLabel`,
   and `config.js` `reportPeriodLabel` → `'<Mon YYYY> · Monthly Report'`. `defaultPeriod` stays `may`.
9. **Validate.** Run the shape/syntax check (throws on any JS error, prints the keys):
   ```bash
   node -e "global.window={}; require('./clients/nkv/data.js'); const d=window.DASHBOARD_DATA; \
     ['may','3m','6m','12m'].forEach(p=>{if(!d.dateRanges[p]) throw new Error('missing period '+p)}); \
     console.log('shape OK →', d.dateRanges.may.label, d.dateRanges.may.rev)"
   ```
   Then eyeball sanity: TACOS never >100%, ROAS plausible (~2–3×), no negative/blank rev, every MoM delta present.
   ✅ Confirm the check prints `shape OK` and the sanity pass is clean.
10. **Bump the cache-buster.** Increment **`APP_VER`** in `index.html` (e.g. `2026-07-01e` → the new bake date+letter)
    so browsers fetch the fresh `data.js`. A pure data refresh needs **no proxy redeploy**.
11. **Publish + notify.** If **every** self-check passes (see the gate below), commit `clients/nkv/data.js` +
    `index.html` + `clients/nkv/config.js` and **push straight to `main`** — that host mirrors the repo, so it's
    live (no proxy redeploy for a data-only refresh). Then log the run in GitHub issue
    [**#4 "NKV monthly re-bake — run log"**](../../issues/4) with the headline figures (rev / ad spend / TACOS /
    ROAS **vs prior month**) + `✅ validations passed`. **On any failure, do NOT touch `main`** — open a **draft PR**
    (`… (NEEDS REVIEW)`) explaining what failed and drop a `⚠️` note on issue #4.

    **Self-check gate (auto-publish only when all pass):** MerchantSpring connector present · every expected pull
    returned data · `node` shape/syntax check prints `shape OK` · sanity clean (TACOS ≤100%, ROAS ~2–3×, no
    negative/blank rev, all MoM deltas present, **no headline metric swinging >60% MoM** without cause — that's the
    "plausible-but-wrong" case, so it routes to human review instead of publishing).

**Automating it (monthly Routine).** This runbook runs unattended as a Claude Code **Routine**
(`claude.ai/code/routines`) whose prompt lives at [`tools/nkv-monthly-rebake.prompt.md`](tools/nkv-monthly-rebake.prompt.md).
Wire it with a **schedule trigger on the 5th of each month** (cron `20 9 5 * *` via `/schedule update` — 09:20,
staggered between AMACX 09:00 and Harvaza 09:40 so the bakes don't collide; times are UTC, +1h UK during BST; min
interval is 1h), the **MerchantSpring connector** attached, and **"Allow unrestricted branch pushes" enabled** so it
can publish to `main`. It's **auto-publish + notify**: green runs go live and log to issue #4 (watch it for the email);
only a failed self-check falls back to a draft PR + review. Flip it back to a pure review gate by turning off
unrestricted pushes — then every run just opens a PR.

---

## Per-client config highlights (`config.js`)

| Field | What it does |
|---|---|
| `template` | Page set: `'amazon'` (default if unset) or `'founder'`. Decides the nav + which `page-<key>` blocks show. |
| `pages` | *(optional)* explicit page-key list, overriding the template's order. Rarely needed. |
| `maintenancePages` | *(optional)* page keys forced to the shared maintenance stub. Founder stubs all Amazon pages by default. |
| `marketMaintenance` | *(optional)* `{ market: [pageKeys] }` — selecting that market shows a maintenance banner on those pages (NKV: IE/US Advertising). |
| `layout` | *(optional)* per-client card `hide` / `relabel` / move (`stockToBuyBoxSlot`, `actualsUnderChart`, `pieIntoAdGrid`) on the shared markup. See "Per-client layout". |
| `logoSrc` / `logoWidth` | Logo image + size (all clients use `td-logo.png`, `110px`). |
| `hiddenPages` | Array of page keys to hide entirely (nav item + tab + page). AMACX: `['keywords','pnl']`. Demo: `['amazonpnl']`. |
| `currencyIcon` | P&L nav icon + scope currency (`€` / `£` / `$`). Demo + Harvaza use `£`. |
| `footer.autoNext` | Footer shows "Updated Monthly / Next: 5 <month>" — always the 5th of next month, rolling. |
| `dataSource` | `static` (use only `data.js`) or an Apps Script proxy `overlay` (live values overlaid onto `data.js`). |
| `markets` | Sidebar chips + the per-market row filter (see below). |

**Amazon P&L gate:** the real P&L page is hidden for AMACX (`hiddenPages: ['pnl']`). A shared upsell page
`amazonpnl` (nav `🔒 Amazon P&L`) shows an "Available with Advanced Subscription" banner instead. The demo
hides `amazonpnl` and shows its own real P&L. All the AMACX P&L data still lives in `data.js`, behind the gate.

---

## Add a new client (≈5 minutes)

1. **Copy** a **complete** like-for-like client → `clients/<newclient>/`: `nkv/` for an Amazon client
   (or `amacx/`), `harvaza/` for a founder client. (`demo/` is a deliberately simplified *static*
   reference — fine to read for the minimal `sections` shape, but copy a full client to start.)
2. **`config.js`** — edit identity (`client.name`, `title`, footer), set `template` (`'amazon'` or
   `'founder'`), `brand` colours, `markets`, `hiddenPages`, and `dataSource` (`type:'static'`, or an Apps
   Script `/exec` URL to overlay live values). Set `client.currencyIcon` for non-€ clients (`'&#36;'` $,
   `'&#163;'` £). Decide the **subscription tier**: on Digital Dash, gate the P&L behind the Executive
   paywall by hiding the real page and leaving the locked gate — `hiddenPages:['keywords','pnl']` keeps
   `amazonpnl` (the 🔒 gate) as the only P&L surface (see NKV / `clients/abimax/`).
3. **`data.js`** — supply `dateRanges`, plus the matching `sections` (Amazon pages) or `sections.founder`
   (founder pages) to data-drive the deep pages. `marketKpis` / `sec` / `campaignMix` / `sections.charts`
   are all **optional** (guarded fallbacks) — a single-market static client can omit them and put its
   trend charts in each period's `revChart`/`adChart`/`revBreakChart` (the demo pattern).
4. **Logo** — set `config.logoSrc` (drop `td-logo.png` in, or a client logo; if it's a transparent PNG leave
   `logoBlend:''`).
5. **Bump `APP_VER`** in `index.html` — adding a client ships new `clients/<newclient>/*.js`, and the
   `?v=APP_VER` cache-buster must change or browsers (and the Wix embed) may serve a stale miss. Same
   mechanical bump the re-bake runbook requires; see `CLAUDE.md`.
6. Open `index.html?client=<newclient>` and check (ideally headless — see the runbook below).

**Nothing in `index.html` or `app.js` should ever change per client** (the `APP_VER` bump is a repo-wide
cache-buster, not a per-client value). If you're tempted to add a client value there, it belongs in
`config.js`/`data.js` instead.

> **Baking real data & the full end-to-end flow** (MerchantSpring MCP pull sequence → files → verify) is
> written up as an agent runbook in **`tools/new-client-setup.prompt.md`**. `clients/abimax/` is a worked
> example: Amazon-only, USA, single-market, Digital Dash tier.

---

## What's config/data-driven

| Always driven by config/data | Driven when `data.js` has a `sections` object |
|---|---|
| Title, logo, client name, portal label, footer | P&L, Inventory, Products — KPIs · market table · Sales-by-Group (Ad Spend + TACOS), all period+market aware, Keywords |
| Brand colours (`:root` CSS variables) | Campaign / budget / forecast tables |
| Sidebar market chips + topbar labels | The two SVG trend charts (auto-scaled) |
| Date-range dropdown | Overview In Progress / Completed / Upcoming + Stock Warnings, Buy Box, CVR, lower bars |
| Overview + Advertising KPIs, market-spend table | Scope labels ("All EU"→"All UK") + P&L nav icon |
| `hiddenPages`, live overlay from the Apps Script proxy | Sales-by-group card (hidden if no `products.groups`) |

### Sidebar market filter (`app.js`)

Picking a market chip in the sidebar re-scopes the whole dashboard to that market. Four things react,
all from `switchMarket` → `switchDateRange`:

1. **Rows** (`applyMarketFilter`) — every per-market table/list across all tabs filters to that market
   (Buy Box, market-spend, P&L-by-market, campaigns, stock/restock). A card with no rows shows a
   "No data for … in this view" placeholder.
2. **Headline KPIs** (`applyMarketKpis`) — the Overview + Advertising KPI cards overlay that market's
   numbers from `dateRanges[period].marketKpis`.
3. **Trend charts** (`renderMarketCharts`) — Revenue Trend + Spend vs TACOS repaint from `sections.charts`
   (trailing-6-month series, EU + per market).
4. **Products page** — the KPI cards, Performance-by-Market table, and Sales-by-Group card pick
   `sections.products.{kpisByPeriod,tableByPeriod,groupsByPeriod}[currentPeriod][market]`, so they follow
   **both** the market chip and the date-range selector. Selecting **Netherlands** shows a
   "Pending Koongo Integration with Shopify" placeholder (no MerchantSpring data yet).

Row matching is **derived from `CONFIG.markets`** (each market's `flag` / `code` / `chip`), so it stays
client-agnostic — the UK demo gets per-**channel** row filtering (Amazon/eBay/D2C) for free. `marketKpis`
+ `sections.charts` are AMACX-only (the generator emits them); clients without them keep EU KPIs/charts.
No per-client code lives in `app.js`.

> The old per-card market-filter `<select>` dropdowns were removed — the sidebar chips do the scoping, so
> the dropdowns were redundant.

### Per-client layout & market gating (`CONFIG.layout` / `CONFIG.marketMaintenance`)

Two config-driven mechanisms let a client reshape the **shared** markup without forking `index.html` — both
no-ops when the client doesn't opt in (so AMACX/demo are untouched):

- **`config.layout`** (`applyClientLayout()` in `app.js`, run once at boot) hides / relabels / relocates
  cards by id:
  - `hide: ['id', …]` — `display:none` on those elements (reversible; data untouched).
  - `relabel: [{ id, title, sub }]` — rewrite a card's `.card-ttl` / `.card-sub`.
  - `stockToBuyBoxSlot: true` — move the Overview Stock-Warnings card out of the top flags grid into the
    Buy-Box slot (grid reflows 4→3 via `syncFlagsGridCols`, which counts *visible* cards).
  - `actualsUnderChart: true` — stack Advertising's *Ad Spend Actuals* under the trend chart.
  - `pieIntoAdGrid: true` — move the campaign-type pie into the Advertising chart row's right column
    (under Ad Metrics) and compact it so the two columns line up.

  NKV uses all of these: Buy Box + Account Health removed, Stock Warnings → **FBA Stock Warnings** in the
  Buy-Box slot, and the Advertising row rebalanced (actuals under the chart, pie beside Ad Metrics).

- **`config.marketMaintenance`** (`applyMarketMaintenance()`) maps a **market → page keys** to gate. When
  that market is selected the listed pages show a maintenance banner (`.maint-ph`) instead of their content
  (mirrors the AMACX NLD pre-launch pattern, but per-market). NKV: `{ irl:['advertising'], usa:['advertising'] }`
  — Ireland (early-stage) and USA (recently launched) have no live ad account yet.

**Market-aware Inventory & Sales-by-Brand (NKV).** Inventory follows the market chip via per-market
overrides in `sections.inventory`: `kpisByMarket` / `stockByMarket` / `restockByMarket` /
`supplierPOsByMarket` (`[]` hides the Supplier-PO card for a market the UK forecast doesn't cover, e.g. US).
Ireland & USA are **real FBA snapshots** (MerchantSpring). Similarly `sections.products.groupsByPeriod`
now carries per-market Sales-by-Brand: UK real per-brand Ad Spend + TACOS, Ireland allocated from its real
12-mo brand mix (no ads → TACOS n/a), USA recently-launched (£0). *(Per-market list rows must not name a
**different** market's code — `applyMarketFilter` scans row text and would hide a row tagged with another
market.)*

---

## Embedding in Wix

The dashboard is hosted on **GitHub Pages** and embedded on the client's **Wix** site.

**Current setup — Wix built-in *Embed HTML*** (an iframe pointing at the Pages URL, e.g.
`…/index.html?client=nkv`). The element is a **fixed height**, so a tall page (Advertising) scrolls
*inside* the iframe — a "double scroll" — while shorter pages fit. That reads neatly on both desktop and
mobile once the frame is opaque. To keep it tidy the dashboard, when embedded:
- paints an **opaque beige background** (`--bg`) on the page so no host colour shows through a gap (fixed
  the mobile dark/"green" edge bar);
- **centres the loading screen in a fixed top band** (not the viewport centre, which lands far down a tall
  iframe); and
- **truncates the mobile topbar title** so the date selector never crops.

**Optional upgrade — true per-page auto-height (`wix-embed.js`, kept in the repo, not currently wired).**
For a frame that grows/shrinks to each view (no inner scroll), the repo ships a Wix **Custom Element**
`<td-dashboard>` (needs Dev Mode). It wraps the iframe and resizes itself to the height the dashboard
already reports: when embedded, `app.js` (`reportEmbedHeight` / `initEmbedHeight`) posts its **active page's**
content height on every change via `postMessage({ type:'td-embed-height', height })` — measured from the
active `.page-content` bottom (not `body.scrollHeight`, pinned to `min-height:100vh`) and floored to the
sidebar height so a short page never clips the menu. Add as **Embed Code → Custom Element**: tag
`td-dashboard`, Server URL `…/wix-embed.js`, attribute `data-client=<nkv|amacx|…>` (self-locating — no
dashboard URL to hardcode). Both the height posting and `wix-embed.js` are **inert when unused**, so they
sit in the repo as a drop-in swap if the double-scroll ever needs to go.

---

## Test locally (before pushing to GitHub)

Start any static file server with `dashboard/` as the root, then open the URL.

**Bundled (Windows, no deps)** — serves `dashboard/` on port 8137:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/static-server.ps1 -Port 8137
```

Then open: **http://localhost:8137/index.html?client=harvaza**

> Python instead? `cd dashboard && python -m http.server 8080`. Node? `cd dashboard && npx serve -l 8080`.
> You must use a server, not double-click the file — `file://` blocks the `?client=` script loading and the
> live-data overlay fetch.

---

## Data flow

```
config.js + data.js  ──►  app.js boot:
   applyConfig()  → identity, brand, chips, dropdown, hiddenPages, footer, buildNav (nav + tabs from template)
   showLoadingOverlay() → (appsScript clients) animated loader covers the static fallback until live paints
   renderSections() → static deep-page content, incl. renderFounderSections() for founder clients
   switchDateRange(defaultPeriod) → KPIs, market table, chip revenue, per-period sections
   switchPage(firstPage) → activate the first page in the resolved page list
   loadLiveData() → if dataSource is a proxy, fetch it, overlay live values, repaint
                    (skip-empty overlay: live wins; blank live fields keep data.js values; any error keeps data.js)
   watchForUpdates() → self-heal a stale cached page on load + "update in progress" overlay on a mid-session deploy
```

---

## Caching, deploy & front-end resilience

The static files are served from **GitHub Pages** (`https://tdstrategists-code.github.io/td-dashboard/…`)
and embedded into the client site via a **Wix *Embed HTML* iframe** (fixed height, inner scroll — see
"Embedding in Wix" above; a `wix-embed.js` custom element for auto-height is available but not wired).
GitHub Pages sends its own
`Cache-Control: max-age=600` on `index.html` and ignores repo-level cache headers, so the entry HTML can
be briefly (≤10 min) stale on a fresh load. Three mechanisms keep clients on the current build:

### `APP_VER` cache-buster (`index.html`)
One constant, bumped on **every** upload (bake date + letter, e.g. `2026-06-30t`). It is appended as `?v=`
to all three script loads (`config.js`, `data.js`, `app.js`), so a bump force-fetches fresh code/data while
those files still cache between deploys. `index.html` itself can't be versioned (it's the entry URL), so it
also carries `no-cache, no-store` meta tags. **Always bump `APP_VER` when you change any of the four files.**

### Loading screen (`showLoadingOverlay`)
appsScript clients raise an animated loader the moment boot starts — a 6-digit OTP-style code that
re-scrambles matrix-style (1–2 digits per tick) above a cycling status line — so the static fallback never
flashes before live data paints. `loadLiveData()` hides it on success, error, or a 15s safety timeout.
Respects `prefers-reduced-motion` (digits still change; only the slide-in is suppressed).

### Update overlay + self-heal (`watchForUpdates`)
On boot, app.js fetches the deployed `index.html` (cache-bypassing) and reads its `APP_VER`:
- **Stale load** (booted version ≠ server version) → reloads **once** with a `?_cb=<ver>` cache-bust param
  (the `client=` param is preserved), guarded by `sessionStorage` so it can't loop. The 10-min stale window
  self-corrects before the user notices.
- **Mid-session deploy** (version changes while the tab is open) → a full-screen *"You caught us during an
  update — please refresh"* overlay, polled every 90s + on tab refocus.

> **Device-stuck cache:** if one device still shows old after a deploy but **incognito / another device is
> fine**, it's a local **service-worker / site-data** cache (Wix registers a service worker). "Clear cached
> images" won't fix it — clear **Cookies and site data**, or Chrome ▸ Site settings ▸ the site ▸ **Clear &
> reset**. It also self-corrects on its own within ~24h as the worker re-checks.

### "Currently updating" fallback (overview project board)
For appsScript / `overlay:'sections'` clients, the Overview's Upcoming / In Progress / Completed cards are
fed live from the sheet. Any card the live payload doesn't supply (proxy down, or board not yet read) shows
a muted **"Currently updating"** placeholder instead of a stale baked snapshot. Static clients are
unaffected — their baked content *is* the real content. (`liveCardPending` / `renderUpdatingCard` in app.js.)
