# Phase 2 — Live Google Sheets data (Apps Script proxy)

The dashboard now fetches its numbers from the **AMACX Project Tracker** sheet through a
Google Apps Script Web App. The sheet stays **fully private** — only the small derived
JSON (the `dateRanges` object) is exposed. If the fetch fails, the dashboard silently
falls back to its built-in static values, so it can never show a blank page.

```
 Private Sheet ──read──▶ Apps Script (Code.gs) ──JSON──▶ Dashboard fetch() ──▶ switchDateRange()
   (never exposed)        (computes everything)           (with static fallback)
```

---

## Step 1 — Create the Web App

1. Open the **AMACX Project Tracker** sheet → **Extensions ▸ Apps Script**.
2. Delete the default `Code.gs` contents, paste in everything from
   [`amacx-data-proxy.gs`](amacx-data-proxy.gs), **Save**.
3. **Deploy ▸ New deployment ▸** select type **Web app**.
   - **Description:** `AMACX dashboard data`
   - **Execute as:** **Me** (so it can read your private sheet)
   - **Who has access:** **Anyone**  ← required for the browser fetch; this exposes
     only the derived JSON, never the sheet itself.
4. **Deploy**, authorise when prompted, and copy the **Web app URL** (ends in `/exec`).

## Step 2 — Verify the output

Open the `/exec` URL in a browser. You should see JSON like:

```json
{ "status": "ok", "generated": "2026-06-10T...", "dateRanges": { "may": { "rev": "€8,856", ... } } }
```

**Sanity-check against the current dashboard** (May 2026):
`rev €8,856 · spend €2,320 · tacos 26.2% · roas 3.82×`. These should match.

⚠️ **Expected change:** the per-market **budget** column will now read from the sheet's
*Advertising Budgets per Market* grid. May 2026 DE budget becomes **€1,200** (was a stale
€677 in the old static data), so the "under/over" variance changes accordingly. Confirm
this is the number you want shown.

If you see `"status": "error"`, the `error` field names the problem (usually a renamed
row label — fix the matching string in `CONFIG.ROWS` / `CONFIG.MARKET_GRIDS` at the top
of the script).

## Step 3 — Wire the dashboard ✅ DONE

The fetch block below is already added at the end of `amacx-dashboard.html`, pointing at
your `/exec` URL. It uses a **skip-empty overlay**: live values win, but any field the
proxy leaves blank keeps the dashboard's static text — so it never regresses.

> **Redeploy needed:** the script was enriched after first deploy (it now computes the
> TACOS/ROAS delta annotations and aggregate breakdowns instead of leaving them blank).
> Paste the latest [`amacx-data-proxy.gs`](amacx-data-proxy.gs) into the editor, then
> **Deploy ▸ Manage deployments ▸ (edit ✏️) ▸ Version: New version ▸ Deploy**. The
> `/exec` URL stays the same.

```js
// ---- Live data (Phase 2) ----
const DATA_URL = 'PASTE_YOUR_EXEC_URL_HERE';
(function loadLiveData() {
  fetch(DATA_URL)
    .then(r => r.json())
    .then(j => {
      if (j && j.status === 'ok' && j.dateRanges) {
        Object.assign(dateRanges, j.dateRanges);   // overlay live values
        switchDateRange(currentPeriod);            // repaint with current selection
      }
    })
    .catch(() => { /* keep built-in static values */ });
})();
```

Because it uses `Object.assign` + `switchDateRange`, the static values stay as the
fallback and the live fetch only overlays what it successfully computed.

---

## After a redeploy

If you change `Code.gs` later, use **Deploy ▸ Manage deployments ▸ (edit) ▸ New version**
so the **same `/exec` URL** keeps working — don't create a brand-new deployment (that
mints a new URL you'd have to paste in again).

## What's live vs still manual

| Live from sheet | Still editable copy (in `CONFIG.COPY`) |
|---|---|
| Revenue, Ad Spend, TACOS, ROAS, AOV — all periods | "Target: reduce to <20%" and similar targets |
| Per-market budget / spend / revenue / TACOS / variance | `adSales` (not in the sheet) |
| Current-month MoM deltas, "% utilised" | Aggregate-period descriptor text |

The monthly workflow becomes: **update the sheet → dashboard reflects it on next load.**
No more hand-editing the `dateRanges` object.
