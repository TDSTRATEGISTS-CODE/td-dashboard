# Client Reporting Dashboard — split architecture

A single shared template that renders any client's dashboard, selected by a URL parameter.

```
dashboard/
  index.html        ← shared TEMPLATE (markup + CSS + loader). Identical for every client — no client values here.
  app.js            ← shared LOGIC. Reads config + data, paints the UI, overlays live data. No client values.
  td-logo.png       ← shared TD Strategists logo (used by every client for now).
  clients/
    amacx/
      config.js     ← window.DASHBOARD_CONFIG — identity, brand colours, markets, hiddenPages, footer, data source
      data.js       ← window.DASHBOARD_DATA  — dateRanges (KPIs + market table) + a FULL `sections` object
                       (GENERATED — do not hand-edit; see "Re-baking AMACX" below)
    demo/
      config.js     ← UK-only demo client (GBP, channels Amazon/eBay/D2C, static data)
      data.js       ← dateRanges + a full `sections` object that data-drives every deep page
  tools/
    build-amacx-data.ps1  ← generator that writes clients/amacx/data.js from a baked MerchantSpring + sheet snapshot
```

The page reads `?client=<name>` and loads `clients/<name>/config.js` + `data.js` before `app.js` boots.

- **AMACX:** `https://<your-host>/dashboard/index.html?client=amacx`
- **UK demo:** `https://<your-host>/dashboard/index.html?client=demo`
- Default client (no param) is `amacx`.

> **Deploy note:** this folder is not a git repo — changed files are uploaded to GitHub manually. After any edit, push the files you touched (commonly `app.js`, `index.html`, `clients/amacx/data.js`, `tools/build-amacx-data.ps1`).

### Deep pages: the `sections` object

`index.html` ships a set of **default markup** for the deeper pages (P&L, Inventory, Products, Keywords,
lower Overview, campaign/forecast tables, the two SVG charts). A client overrides any of it by providing a
`sections` object in its `data.js`:

- **Has `sections`** → `app.js` rebuilds those pages from the data at boot (and per date-range), including
  auto-scaled SVG charts, so the client is fully self-consistent.
- **No `sections`** → the static markup in `index.html` renders unchanged.

**Both AMACX and the demo now ship a full `sections` object.** AMACX's is generated from real MerchantSpring
data (see below); the demo's is hand-authored UK/GBP. Renderers guard every field, so a partial `sections`
is safe — anything a client omits falls back to the template markup.

Per-period overrides: `dateRanges[period].sec` can override any `sections` block for that date range;
`app.js` uses `pick(periodOverride, topLevelDefault)` so a period only overrides what it specifies.

---

## Re-baking AMACX (`tools/build-amacx-data.ps1`)

AMACX's `data.js` is a **baked static snapshot**, not a live feed. The browser can't call the MerchantSpring
MCP, so the data is pulled in a Claude session, hardcoded into the generator, and written out:

```
clean MerchantSpring MCP actuals  ─┐
Google Sheet budgets / flags      ─┤→  build-amacx-data.ps1  →  clients/amacx/data.js
```

**IMPORTANT — every bake refreshes the inputs first.** The generator bakes a *static* snapshot of its
hardcoded arrays, so re-running it alone never picks up new numbers. Before each bake, re-pull the
MerchantSpring actuals (via the MCP, in-session) into the `$M` arrays, and re-sync the Google Sheet
budgets into `$BUD`. Then run:

```powershell
& "dashboard/tools/build-amacx-data.ps1"
```

Notes:
- **Tax basis = GROSS / inc-VAT** — sales are pulled with `includeTax:true`.
- The script prints a per-period summary (Rev / Spend / TACOS / ROAS / Units / Orders) on each run.
- Non-ASCII must be `[char]` codes (PowerShell 5.1 reads the script as ANSI).
- The sheet **budgets** are a hardcoded snapshot in `$BUD` — they do not auto-pull, so sync them each bake.

---

## Per-client config highlights (`config.js`)

| Field | What it does |
|---|---|
| `logoSrc` / `logoWidth` | Logo image + size (both clients use `td-logo.png`, `110px`). |
| `hiddenPages` | Array of page keys to hide entirely (nav item + tab + page). AMACX: `['keywords','pnl']`. Demo: `['amazonpnl']`. |
| `footer.autoNext` | Footer shows "Updated Monthly / Next: 5 <month>" — always the 5th of next month, rolling. |
| `dataSource` | `static` (use only `data.js`) or an Apps Script proxy `overlay` (live values overlaid onto `data.js`). |
| `markets` | Sidebar chips + the per-market row filter (see below). |

**Amazon P&L gate:** the real P&L page is hidden for AMACX (`hiddenPages: ['pnl']`). A shared upsell page
`amazonpnl` (nav `🔒 Amazon P&L`) shows an "Available with Advanced Subscription" banner instead. The demo
hides `amazonpnl` and shows its own real P&L. All the AMACX P&L data still lives in `data.js`, behind the gate.

---

## Add a new client (≈5 minutes)

1. **Copy** `clients/amacx/` → `clients/<newclient>/` (or start from `demo/` for a hand-authored client).
2. **`config.js`** — edit identity (`client.name`, `title`, footer), `brand` colours, `markets`, `hiddenPages`,
   and `dataSource` (`type:'static'` to use only `data.js`, or an Apps Script `/exec` URL to overlay live values).
3. **`data.js`** — supply `dateRanges` (and a `sections` object if you want to data-drive the deep pages).
4. **Logo** — set `config.logoSrc` (drop `td-logo.png` in, or a client logo; if it's a transparent PNG leave
   `logoBlend:''`).
5. Open `index.html?client=<newclient>` and check.

**Nothing in `index.html` or `app.js` should ever change per client.** If you're tempted to, that value belongs
in `config.js`/`data.js` instead.

---

## What's config/data-driven

| Always driven by config/data | Driven when `data.js` has a `sections` object |
|---|---|
| Title, logo, client name, portal label, footer | P&L, Inventory, Products (incl. Sales by Group), Keywords |
| Brand colours (`:root` CSS variables) | Campaign / budget / forecast tables |
| Sidebar market chips + topbar labels | The two SVG trend charts (auto-scaled) |
| Date-range dropdown | Overview tasks/flags, Buy Box, CVR, lower bars |
| Overview + Advertising KPIs, market-spend table | Scope labels ("All EU"→"All UK") + P&L nav icon |
| `hiddenPages`, live overlay from the Apps Script proxy | Sales-by-group card (hidden if no `products.groups`) |

### Sidebar market filter (`app.js`)

Picking a market chip in the sidebar re-scopes the whole dashboard to that market. Three things react,
all from `switchMarket` → `switchDateRange`:

1. **Rows** (`applyMarketFilter`) — every per-market table/list across all tabs filters to that market
   (Buy Box, market-spend, P&L-by-market, campaigns, stock/restock, products-by-market). A card with no
   rows shows a "No data for … in this view" placeholder.
2. **Headline KPIs** (`applyMarketKpis`) — the Overview + Advertising KPI cards overlay that market's
   numbers from `dateRanges[period].marketKpis`.
3. **Trend charts** (`renderMarketCharts`) — Revenue Trend + Spend vs TACOS repaint from `sections.charts`
   (trailing-6-month series, EU + per market).

Row matching is **derived from `CONFIG.markets`** (each market's `flag` / `code` / `chip`), so it stays
client-agnostic — the UK demo gets per-**channel** row filtering (Amazon/eBay/D2C) for free. `marketKpis`
+ `sections.charts` are AMACX-only (the generator emits them); clients without them keep EU KPIs/charts.
No per-client code lives in `app.js`.

> The old per-card market-filter `<select>` dropdowns were removed — the sidebar chips do the scoping, so
> the dropdowns were redundant.

---

## Test locally (before pushing to GitHub)

From inside the `dashboard/` folder, start any static file server, then open the URL.

```bash
cd dashboard && python -m http.server 8080
```

Then open: **http://localhost:8080/index.html?client=amacx**

> Node user instead? `cd dashboard && npx serve -l 8080`.
> You must use a server, not double-click the file — `file://` blocks the `?client=` script loading and the
> live-data overlay fetch.

---

## Data flow

```
config.js + data.js  ──►  app.js boot:
   applyConfig()  → identity, brand, chips, dropdown, hiddenPages, footer
   switchDateRange(defaultPeriod) → KPIs, market table, chip revenue, sections render (from data.js)
   loadLiveData() → if dataSource is a proxy, fetch it, overlay live values, repaint
                    (skip-empty overlay: live wins; blank live fields keep data.js values; any error keeps data.js)
```
