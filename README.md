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
    nkv/            ← AMAZON-template client (UK · GBP · MerchantSpring · live Apps Script overlay)
      config.js     ← markets = UK + Ireland + USA('Soon'), scopeLabel 'UK', maintenancePages:['amazonpnl']
      data.js       ← dateRanges + sections, hand-baked from MerchantSpring (UK actuals); the sheet
                       overlay supplies live overview tasks/flags + advertising budget
  tools/
    build-amacx-data.ps1     ← generator that writes clients/amacx/data.js from a baked MerchantSpring + sheet snapshot
    build-harvaza-data.ps1   ← regenerates Harvaza's Amazon products blocks → tools/harvaza-amazon-baked.js (splice helper)
    harvaza-sheet-proxy.gs   ← Apps Script reference: reads the Founder-Dashboard Sheet + Notion Deal Hub (see "Harvaza")
    harvaza-amazon-baked.js  ← GENERATED splice snippet (not loaded by the app; safe to ignore/regenerate)
```

> **Apps Script proxies** (`amacx-data-proxy.gs`, `harvaza-sheet-proxy.gs`, `nkv-sheet-proxy.gs`) live at the
> repo **root, OUTSIDE this `dashboard/` folder** — they're deployed in Google Apps Script and are **not**
> served from GitHub, so they're kept out of the `dashboard/` upload. Editing a `.gs` only takes effect after you
> **redeploy** the Apps Script web app (keep the same `/exec` URL, or update `config.dataSource.url`).
> The AMACX proxy reads the Project-Scope board by **fixed column** — `E` = In Progress, `F` = Upcoming,
> `G` = Completed, `I` = Flags & Warnings — and supplies the live per-market ad budgets + forecast.

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

### Shopify (D2C) page â€” `sections.shopify` (NKV-only for now)

NKV gets an extra **Shopify** page (D2C performance) that the other Amazon clients don't. It's wired
**NKV-only** by declaring `config.pages` (the `amazon` template order + `'shopify'` inserted before
`amazonpnl`) rather than adding `shopify` to the shared template â€” so it stays hidden for every other
client until they opt in the same way. The `page-shopify` block + renderers live in the shared shell
(`index.html` / `app.js`), so they're a **no-op** for any client without `sections.shopify`.

The page has a **brand filter** at the top â€” `All Â· Newnique Â· Contours Rx` â€” that are **two separate
Shopify stores** (`ALL` = the sum). The chips are DATA-driven from `sections.shopify.brands` (never
hardcoded in `index.html`), and the filter re-scopes only this page via `currentBrand` â†’
`switchBrand()` â†’ `renderShopify()`. It's independent of the sidebar market chips (those are the Amazon
marketplaces) but **does** follow the shared date-range selector.

```js
sections.shopify = {
  brands: [ { key:'all',label:'All' }, { key:'newnique',label:'Newnique' }, { key:'contoursrx',label:'Contours Rx' } ],
  data: {
    contoursrx: {
      label, store,                                  // header sub-label
      chart:  CHART,                                 // 6-mo net-sales trend (or null â†’ cleared)
      stock:  [ { name, note, level:'g|a|r', units, cover } ],   // Stock Health list
      traffic:[ BAR ],                               // Traffic Sources (referrer)
      byPeriod: { may|3m|6m|12m: {
        kpis1:[ KPI x4 ], kpis2:[ KPI x4 ],          // Net Sales/Orders/AOV/ASP Â· CVR/Sessions/Units/Returning
        funnel:[ { lbl, val, pct, w, sub } ],        // Sessionsâ†’Cartâ†’Checkoutâ†’Purchased
        products:[ { name, net, units, asp, orders, share, shareCls } ]
      } }
    },
    newnique: { â€¦live (Porter/Shopify) â€” hair-care D2C; no GA4 so no sessions/funnelâ€¦ },
    all:      { â€¦true sum = Contours Rx + Newniqueâ€¦ }
  }
}
```

**Data source.** Pulled via **Porter** (17 Jun 2026): order-side (net sales, orders, AOV, units,
products) from the **Shopify** connector; session-side (sessions, CVR, funnel, traffic-by-channel)
from **GA4** â€” GA4 is connected for **Contours Rx only**, so Newnique shows no sessions/funnel. Porter's
Shopify window reaches ~Feb 2026, so Contours Rx **May + 3-mo** are exact Porter actuals while **6-mo /
12-mo** net/orders are kept from the earlier in-session Admin pull; Newnique's full history is sparse
and captured exactly. **Stock** was still ingesting at bake time (separate Porter data type). Note GA4
purchases (46 May) run below Shopify orders (90) â€” a normal GA4 tracking gap; the funnel uses GA4, the
Orders KPI uses Shopify. A live proxy can overlay `sections.shopify` later,
exactly like AMACX's sheet overlay.

**Shopify P&L page (`shopifypnl` Â· `sections.shopifypnl`).** A second NKV-only page, sharing the same
brand filter + date range (`switchBrand` repaints both; chips render into `#shop-brands` **and**
`#shop-brands-pnl`). It's a **brand â†’ period â†’ { kpis, info, rows }** model built by a small per-period
builder in `data.js`: every line â€” **Net Revenue, COGS, Google/social ad spend, Beckdale fulfilment,
Shopify + transaction fees, subscription, brand manager, the 5.5% TD fee, and Net Profit** â€” is sourced
from the **NKV Beauty Account Tracker** ("Shopify" block, monthly). Contours Rx carries the shared opex
(itâ€™s ~99% of D2C); **Newnique is tracked _light_** (own revenue / COGS / Google Ads only); **`All` =
Contours Rx + Newnique**, and Net Profit ties to the sheetâ€™s "Profit after COGS". An `other` residual
foots each month to the sheetâ€™s "Shopify Expenses" total. The right card (`brand.statusList`) shows each
line's status. `renderShopifyPnl()` is a no-op for any client without `sections.shopifypnl`.

**Live updates.** `data.js` holds the baked snapshot (offline fallback); **`nkv-sheet-proxy.gs`
(`scanShopifyPnl_`) serves `sections.shopifypnl` live** from the Tracker, merged via `overlay:'sections'`
â€” so editing the sheet updates the P&L. The block is found by the `Total Shopify Revenue` anchor; CRX
sales are read below it (skipping the annual-total decoy) and `All` is summed from CRX + Newnique.

**TODO (next):** add earlier-month expenses to the Tracker so the 12-mo view is a true trailing year
(itâ€™s YTD for now); confirm Newnique's store domain (placeholder `D2C Â· Shopify`); optionally split
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
- **Advertising / Overview charts:** `sections.charts.adSales` (Ad Spend vs Ad Sales vs TACOS trend) is computed
  from `$M`; `sections.charts.revTarget` (dotted EU goal line, All-EU only) is hardcoded from **Performance Tracker
  row 8 "Revenue Target (past vs future)"** in `$REVTGT` (re-sync each bake). **`sections.advertising.campaignMixByPeriod`**
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
   budgets and **row 8 "Revenue Target (past vs future)"**. ✅ Confirm: `$REVTGT` last value = the sheet's current month.
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
   markets and confirm the Revenue Trend (target line on All-EU), Ad Spend/Sales/TACOS chart, Products KPIs/table/groups,
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

> **What does NOT need re-pulling monthly:** FY 2025 columns (frozen history), the live sheet sections (budgets/forecast/
> Project-Scope — served by the proxy), and `index.html`/`app.js` (only when behaviour changes).

---

## Per-client config highlights (`config.js`)

| Field | What it does |
|---|---|
| `template` | Page set: `'amazon'` (default if unset) or `'founder'`. Decides the nav + which `page-<key>` blocks show. |
| `pages` | *(optional)* explicit page-key list, overriding the template's order. Rarely needed. |
| `maintenancePages` | *(optional)* page keys forced to the shared maintenance stub. Founder stubs all Amazon pages by default. |
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

1. **Copy** a like-for-like client: `demo/` for an Amazon client, `harvaza/` for a founder client →
   `clients/<newclient>/`.
2. **`config.js`** — edit identity (`client.name`, `title`, footer), set `template` (`'amazon'` or
   `'founder'`), `brand` colours, `markets`, `hiddenPages`, and `dataSource` (`type:'static'`, or an Apps
   Script `/exec` URL to overlay live values).
3. **`data.js`** — supply `dateRanges`, plus the matching `sections` (Amazon pages) or `sections.founder`
   (founder pages) to data-drive the deep pages.
4. **Logo** — set `config.logoSrc` (drop `td-logo.png` in, or a client logo; if it's a transparent PNG leave
   `logoBlend:''`).
5. Open `index.html?client=<newclient>` and check.

**Nothing in `index.html` or `app.js` should ever change per client.** If you're tempted to, that value belongs
in `config.js`/`data.js` instead.

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
   renderSections() → static deep-page content, incl. renderFounderSections() for founder clients
   switchDateRange(defaultPeriod) → KPIs, market table, chip revenue, per-period sections
   switchPage(firstPage) → activate the first page in the resolved page list
   loadLiveData() → if dataSource is a proxy, fetch it, overlay live values, repaint
                    (skip-empty overlay: live wins; blank live fields keep data.js values; any error keeps data.js)
```
