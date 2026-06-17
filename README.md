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
    harvaza/        ← FOUNDER-template client (brand "Bervera" · GBP · static Year-1 forecast)
      config.js     ← template:'founder', olive/gold brand, markets = Harvaza UK + Harvaza US ('Soon')
      data.js       ← minimal dateRanges + a `sections.founder` object (overview / pnl / stock / loan)
    nkv/            ← AMAZON-template client (UK · GBP · MerchantSpring · live Apps Script overlay)
      config.js     ← markets = UK + Ireland + USA('Soon'), scopeLabel 'UK', maintenancePages:['amazonpnl']
      data.js       ← dateRanges + sections, hand-baked from MerchantSpring (UK actuals); the sheet
                       overlay supplies live overview tasks/flags + advertising budget
  tools/
    build-amacx-data.ps1  ← generator that writes clients/amacx/data.js from a baked MerchantSpring + sheet snapshot
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
