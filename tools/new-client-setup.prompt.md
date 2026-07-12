# Add a new client — end-to-end setup (agent runbook)

You are setting up a **brand-new client dashboard**. Work end-to-end. This file is the ordered
procedure for the *full* flow (identity + tier decision → bake real data → wire files → live-overlay
proxy → verify); the **`README.md` → "Add a new client"** section is the quick reference, and the
deeper mechanics (per-client layout, market filter, currency) live in their own README sections
linked below. `clients/abimax/` is the reference implementation this runbook was written from
(Amazon-only, USA, single-market, Digital Dash tier).

**Every client has a project tracker** — a Google Sheet scope board (In Progress / Upcoming /
Completed) that drives the live Overview. So this flow always produces TWO things: the baked client
files (`clients/<slug>/*`) **and** a versioned Apps Script proxy (`tools/<slug>-sheet-proxy.gs`) for
that tracker. You always write and commit the `.gs`; the human deploys it and hands you the `/exec`
URL (see step 5) — that half can't be done from the repo.

## 0. Collect the brief (ask if not given)

- **Name + slug** — slug is lowercase `[a-z0-9_-]`; becomes `clients/<slug>/` and `?client=<slug>`.
- **Template** — `amazon` (seller analytics) or `founder` (acquired-brand forecast).
- **Markets / marketplaces** — one or many (e.g. Amazon US only; or UK + IE + US).
- **Subscription tier** — **Digital Dash** (base) or **Executive**. Digital Dash gates the P&L pages
  behind the locked "Executive Subscription" paywall (see step 3). This is a real setup decision.
- **Data source** — MerchantSpring store (get the channel + seller/merchant IDs, or the store name to
  resolve), plus which **month** to bake as "Last Month".
- **Project tracker (ALWAYS ask)** — the client's Google Sheet scope-board link/ID. You need it to
  write the Apps Script proxy in step 5. If the user hasn't given it, **prompt for it explicitly**
  ("share the Abimax project-tracker Google Sheet"). Read it with the Google Drive MCP
  (`read_file_content`) to confirm the board's tab + column headers before writing the proxy.

## 1. Scaffold from a COMPLETE client

Copy a fully-built client — **not `demo/`** (it's a simplified static reference). Amazon → `nkv/` or
`amacx/`; founder → `harvaza/`.

```bash
cp -r clients/nkv clients/<slug>
rm -f clients/<slug>/logo.jpg          # drop the source client's logo; use shared td-logo.png unless given one
```

You will overwrite `config.js` and `data.js` wholesale — the copy just guarantees a valid skeleton.

## 2. Pull the real actuals (MerchantSpring MCP)

Never hand-invent numbers. The pull sequence (all `[IMMEDIATE]` tools — no polling):

1. **`getChannels`** → find the store; record its `channelId` + `merchantId` (`"SELLER @ MARKETPLACE"`).
2. **`calculateDateEpoch`** (`operation:"comparisonRange"`, `timezone` = the market's, e.g.
   `America/Los_Angeles` for US / `Europe/London` for UK) → epochs for each window: Last Month, Last 3
   Months, and YTD/Since-Launch. Recompute every bake — do not reuse stale epochs.
3. **`getSalesByPeriod`** (`interval:"M"`, full trailing window) → the monthly backbone: revenue,
   orders, units, sessions, BuyBox, ad spend/sales, ACOS, TACOS per month. This drives the headline
   KPIs, the trend charts, and every window aggregate (sum the months yourself).
4. **`getSalesByProduct`** (`includeNoInventory:true`) for the bake month → top products, per-SKU ad
   spend/CPC, **and** FBA stock (qty + `daysCover`) for the Inventory page.
5. **`getStoreProfitAndLoss`** for the bake month → the P&L statement (sales, refunds, selling/shipping
   fees, COGS, ad spend — settlement basis).

Headline `adSales`/`ACOS`/`ROAS`/`TACOS` come from `getSalesByPeriod` (channel-attributed, internally
consistent: `ROAS = adSales/spend`, `TACOS = spend/revenue`). Per-campaign ad-sales aren't exposed
without the async campaigns report — allocate the channel total across SKUs by real spend share and
say so in a comment (see `clients/abimax/data.js` → `sections.advertising.campaigns`).

## 3. Write `config.js`

Edit identity (`client.name`, `title`, `reportPeriodLabel`, `scopeLabel`, footer), `template`,
`brand` (keep the shared deep-green/gold house palette), `markets`, and `dataSource`. Leave
`dataSource:{type:'static'}` with a clear "LIVE OVERLAY — PENDING DEPLOY" comment naming the tracker
sheet ID and `tools/<slug>-sheet-proxy.gs`; you flip it to `appsScript` in step 5 once the `/exec`
URL exists (see `clients/abimax/config.js` for the exact comment + block to swap).

- **Currency:** set `client.currencyIcon` for non-€ clients (`'&#36;'` $, `'&#163;'` £). Known
  template limit: the trend-chart axis (`moneyK`) hardcodes `€` — note it in `data.js`.
- **Tier gating (Digital Dash):** `hiddenPages:['keywords','pnl']`. This hides the real P&L renderer and
  the (MCP-less) Keywords page, leaving `amazonpnl` — the 🔒 locked Executive gate — as the only P&L
  surface. Bake the real P&L into `sections.pnl` anyway so it's one config edit away when they upgrade.
  The default `amazon` template already includes `amazonpnl`, so **no custom `pages` array is needed**.
- **Single market:** one `markets` entry (`key:'all'`). `marketKpis` / `marketMaintenance` /
  `config.layout` are then unnecessary. See README → "Per-client layout & market gating" for multi-market.

## 4. Write `data.js`

`dateRanges` (one object per `dateRangeOptions.value`) + `sections`. Match a reference client's field
names exactly (the renderers are field-name-driven). For a **single-market static** client, follow the
`demo`/`abimax` shape: put each period's two trend charts in `revChart`/`adChart` + the stacked
`revBreakChart`; `marketKpis` / `sec` / `campaignMix` / `sections.charts` are all optional (guarded
fallbacks in `app.js`). Sections to fill: `overview` (tasks/flags/completed/cvr/stockWarn/buyBox),
`pnl` (baked even when gated), `advertising`, `inventory`, `products`.

Keep the `may` object key literally `may` — it is the "Last Month" slot regardless of the actual month
(only its `label`/`shortLabel` change).

## 5. Live-overlay proxy (`tools/<slug>-sheet-proxy.gs`) — the project tracker

Write a versioned Apps Script proxy for the client's tracker and commit it to the repo **for the human
to deploy**. Model it on the closest existing one:

- **`tools/abimax-sheet-proxy.gs`** — the lean template: scope board only (Overview
  tasks/flags/completed), for an Amazon-only client with no D2C.
- **`tools/nkv-sheet-proxy.gs`** — the fuller one: scope board **+** live Shopify P&L **+** supplier
  POs. Copy only the blocks the client actually has.

Rules:

- The proxy returns ONLY the `sections.*` keys the sheet controls (client is `overlay:'sections'`, so
  `app.js` merges just those and leaves the baked `dateRanges`/other sections untouched).
- Locate the board by **marker text** and its columns by **header text** (`In Progress` / `Upcoming` /
  `Completed`, + optional `Flags & Warnings`) — never fixed coordinates. Set `CONFIG.SPREADSHEET_ID`
  to the tracker's ID. On any error return `{}` sections so the baked `data.js` stays the fallback.
- Confirm the real header/marker strings against what `read_file_content` returned in step 0 (e.g.
  Abimax's board top-left marker is `Project Focus`, and it has **no** Flags column).

**Then hand off — you cannot deploy it.** Tell the user to: open the tracker ▸ Extensions ▸ Apps
Script ▸ paste `tools/<slug>-sheet-proxy.gs` ▸ Deploy ▸ Web app (**Execute as: Me · Who has access:
Anyone**) ▸ send you the `/exec` URL. When they do, flip `clients/<slug>/config.js` `dataSource` to
`{ type:'appsScript', overlay:'sections', url:'<exec>' }` and re-bump `APP_VER`. Until then the client
ships static with the baked overview as the fallback — which is a complete, shippable state.

## 6. Bump `APP_VER`

In `index.html`, set `APP_VER` to today (`YYYY-MM-DD`). Adding a client ships new `?v=`-loaded files;
without the bump, browsers and the Wix embed can serve a stale miss. (See `CLAUDE.md`.)

## 7. Validate + verify

Shape check (throws on any JS error — adjust the period list to the client's `dateRangeOptions`):

```bash
node -e "global.window={}; require('./clients/<slug>/config.js'); require('./clients/<slug>/data.js'); \
  const d=window.DASHBOARD_DATA, c=window.DASHBOARD_CONFIG; \
  (c.dateRangeOptions||[]).forEach(o=>{if(!d.dateRanges[o.value]) throw new Error('missing period '+o.value)}); \
  console.log('shape OK →', c.client.name, d.dateRanges[c.defaultPeriod].rev)"
```

Then a headless render (Chromium is pre-installed; global playwright at
`/opt/node22/lib/node_modules/playwright`). Load `file://…/index.html?client=<slug>`, and confirm:
the nav matches the tier (Digital Dash → P&L shows as 🔒), the client name/period/market chip render,
each page's `#page-<key>` is visible, and there are **no JS `pageerror`s** (ignore
`ERR_TUNNEL_CONNECTION_FAILED`/CORS — those are flagcdn images + the live update-check `fetch`, which
only fail under `file://` and work on GitHub Pages). Sanity-check the numbers: TACOS never >100%,
ROAS plausible, no blank/negative revenue, MoM deltas present.

## 8. Commit + push

One commit with `clients/<slug>/`, **`tools/<slug>-sheet-proxy.gs`**, **and** the `index.html`
`APP_VER` bump together (the client files + version bump are inseparable — see `CLAUDE.md`). Do not
open a PR unless asked.
