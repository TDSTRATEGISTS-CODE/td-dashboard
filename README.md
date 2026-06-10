# Client Reporting Dashboard — split architecture

A single shared template that renders any client's dashboard, selected by a URL parameter.

```
dashboard/
  index.html        ← shared TEMPLATE (markup + CSS + loader). Identical for every client — do not put client values here.
  app.js            ← shared LOGIC. Reads config + data, paints the UI, fetches live data. No client values.
  clients/
    amacx/
      config.js     ← window.DASHBOARD_CONFIG — identity, brand colours, markets, data source
      data.js       ← window.DASHBOARD_DATA  — dateRanges (KPIs + market table); AMACX has no `sections`
      logo.jpg      ← client logo
    demo/
      config.js     ← UK-only demo client (GBP, channels Amazon/eBay/D2C, static data)
      data.js       ← dateRanges + a full `sections` object that data-drives every deep page
      logo.svg      ← demo logo
```

The page reads `?client=<name>` and loads `clients/<name>/config.js` + `data.js` before `app.js` boots.

- **AMACX:** `https://<your-host>/dashboard/index.html?client=amacx`
- **UK demo:** `https://<your-host>/dashboard/index.html?client=demo`
- Default client (no param) is `amacx`.

### Deep pages: the `sections` object (opt-in)

`index.html` still ships AMACX's EU markup as the **default content** for the deeper pages
(P&L, Inventory, Products, Keywords, lower Overview, campaign/forecast tables, the two SVG
charts). A client only overrides them by providing a `sections` object in its `data.js`:

- **No `sections`** (AMACX) → the static markup in `index.html` renders unchanged. Zero regression.
- **Has `sections`** (demo) → `app.js` rebuilds every deep page from that data at boot, including
  auto-scaled SVG charts, so the client is fully self-consistent (the UK demo is 100% UK/GBP).

To make AMACX fully data-driven later, give its `data.js` a `sections` object too — no template edits.

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

## What's config/data-driven

| Always driven by config/data | Driven only when `data.js` has a `sections` object |
|---|---|
| Title, logo, client name, portal label, footer | P&L, Inventory, Products, Keywords pages |
| Brand colours (`:root` CSS variables) | Campaign / budget / forecast tables |
| Sidebar market chips + topbar labels | The two SVG trend charts (auto-scaled) |
| Date-range dropdown | Overview tasks/flags, Buy Box, CVR, lower bars |
| Overview + Advertising KPIs, market-spend table | Scope labels ("All EU"→"All UK") + P&L nav icon |
| Live overlay from the Apps Script proxy (`dataSource`) | Market filter `<select>` options |

The right column is the **`sections`** mechanism (see above). AMACX leaves it unset (keeps its static
EU markup); the UK demo supplies it in full. The **MerchantSpring MCP** feed will plug in via
`dataSource.type: 'merchantSpring'`, populating both `dateRanges` and `sections` live.

## Data flow

```
config.js + data.js  ──►  app.js boot:
   applyConfig()  → identity, brand, chips, dropdown
   switchDateRange(defaultPeriod) → KPIs, market table, chip revenue (from data.js)
   loadLiveData() → fetch dataSource.url, overlay live values, repaint
                    (skip-empty overlay: live wins; blank live fields keep data.js values; any error keeps data.js)
```
