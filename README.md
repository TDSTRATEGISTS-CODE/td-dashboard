# Client Reporting Dashboard — split architecture

A single shared template that renders any client's dashboard, selected by a URL parameter.

```
dashboard/
  index.html        ← shared TEMPLATE (markup + CSS + loader). Identical for every client — do not put client values here.
  app.js            ← shared LOGIC. Reads config + data, paints the UI, fetches live data. No client values.
  clients/
    amacx/
      config.js     ← window.DASHBOARD_CONFIG — identity, brand colours, markets, data source
      data.js       ← window.DASHBOARD_DATA  — the dateRanges object (KPIs + market table)
      logo.jpg      ← client logo
```

The page reads `?client=<name>` and loads `clients/<name>/config.js` + `data.js` before `app.js` boots.

- **Live URL:** `https://<your-host>/dashboard/index.html?client=amacx`
- Default client (no param) is `amacx`.

---

## Test locally (before pushing to GitHub)

From inside the `dashboard/` folder, start any static file server, then open the URL.

**One-liner (Python 3 — most machines have it):**

```bash
cd dashboard && python -m http.server 8080
```

Then open: **http://localhost:8080/index.html?client=amacx**

> Node user instead? `cd dashboard && npx serve -l 8080` (open the same URL).
> You must use a server, not double-click the file — `file://` blocks the `?client=` script loading and the live-data fetch.

---

## Add a new client (≈5 minutes)

1. **Copy** `clients/amacx/` → `clients/<newclient>/`.
2. **`config.js`** — edit identity (`client.name`, `title`, footer), `brand` colours, `markets`, and `dataSource.url` (the client's Apps Script `/exec`, or leave `type:'static'` to use only `data.js`).
3. **`data.js`** — replace the `dateRanges` values with the new client's numbers (or rely on the live `dataSource`).
4. **`logo.jpg`** — drop in the client's logo. If it's a transparent PNG, set `client.logoBlend: ''` in config (the `mix-blend-mode:screen` trick is only needed for the AMACX JPEG-on-dark workaround).
5. Open `index.html?client=<newclient>` and check.

**Nothing in `index.html` or `app.js` should ever change per client.** If you find yourself editing those for one client, that value belongs in `config.js` instead.

---

## What's live vs static (Phase 1)

| Driven by config/data now | Still static AMACX markup in `index.html` (Phase 2) |
|---|---|
| Title, logo, client name, portal label, footer | P&L, Inventory, Products, Keywords pages |
| Brand colours (`:root` CSS variables) | Campaign-performance table, charts, bar rows |
| Sidebar market chips + topbar labels | |
| Date-range dropdown | |
| Overview + Advertising KPIs, market-spend table | |
| Live overlay from the Apps Script proxy (`dataSource`) | |

**Phase 2** converts the remaining static pages into data-driven renders (reading extra keys from `data.js`),
which is also where the **MerchantSpring MCP** feed will plug in via `dataSource.type: 'merchantSpring'`.

## Data flow

```
config.js + data.js  ──►  app.js boot:
   applyConfig()  → identity, brand, chips, dropdown
   switchDateRange(defaultPeriod) → KPIs, market table, chip revenue (from data.js)
   loadLiveData() → fetch dataSource.url, overlay live values, repaint
                    (skip-empty overlay: live wins; blank live fields keep data.js values; any error keeps data.js)
```
