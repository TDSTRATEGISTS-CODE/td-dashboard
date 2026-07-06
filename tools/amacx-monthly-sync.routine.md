# AMACX Monthly Google Sheet Data Sync — routine

Versioned copy of the scheduled routine that writes each month's AMACX actuals into the
Project Tracker via the `amacx-data-proxy.gs` `doPost` endpoint. The **live** copy runs as a
Claude Code scheduled trigger; this file is the reviewable source of truth for its prompt.

- **Trigger name:** `AMACX Monthly Google sheet data sync`
- **Schedule:** cron `0 9 5 * *` — 09:00 **UTC** on the 5th (fires 10:00 UK during BST). Note the
  prompt text still says "the 4th"; the cron is what actually fires it.
- **Sheet ID:** `1yJvCPOnxhQO4oa1cUzrnyiORRO6kWKtf1Fw544C-K9Q`
- **Write endpoint (doPost):** the `/exec` URL of the deployed `amacx-data-proxy.gs` web app.
- **Connectors required:** MerchantSpring (pull), Notion (log). Google-Drive is also attached.

## Dependencies / gotchas

- **The endpoint must be redeployed** whenever `amacx-data-proxy.gs` changes. Google Apps Script
  serves the last *deployed version*, not the latest GitHub code — Deploy ▸ Manage deployments ▸
  edit the Web app ▸ **Version: New version** ▸ Deploy. The `/exec` URL stays the same.
- **`script.google.com` (and `script.googleusercontent.com`) must be on the environment's egress
  allowlist**, or the curl POST is blocked with a 403.
- **Formula/derived rows are never written.** The endpoint writes only true input cells — Unit Sold
  Actuals, Number of Orders Actuals, and the per-market Revenue / Ad Spend rows. Revenue Actuals,
  Ad Spend Actuals, Actual TACOS, AOV, ASP and the per-market "Total EU" rows are SUM/derived
  formulas in the sheet; `doPost` skips any cell that already holds a formula (returned under
  `skipped`). So the routine deliberately does **not** send those values.

## Routine prompt (paste into the trigger to update it)

```text
Monthly AMACX tracker update. Run on the 4th of each month. Run end-to-end without stopping to ask — pull, write, then report.
Sheet ID: 1yJvCPOnxhQO4oa1cUzrnyiORRO6kWKtf1Fw544C-K9Q

STEP 1 — Identify the prior month

Based on today's date, determine which month just ended. That is the month to update.

STEP 2 — Pull actuals from MerchantSpring MCP

Pull for the prior month in Euros including tax. Pull ONLY these input figures (the sheet derives
everything else itself — see STEP 3):
Revenue and units — use getSalesByPeriod per channel:
- Revenue by market: DE, FR, ES, IT, NLD
- Units sold total
- Number of orders total
Ad spend — use getAdvertisingByChannels, filter to seller_id A1O4H4W8GP4BN2, read spend field per store:
- Ad spend by market: DE, FR, ES, IT

Ad spend from getAdvertisingByChannels only; revenue from getSalesByPeriod only — never read either from the Sheet.

STEP 3 — Write to the Google Sheet

First print a short table of the values being written (units, orders, and the per-market revenue +
ad-spend breakdowns) for the record — do NOT wait for approval, proceed straight to the write.
POST a JSON body to the AMACX data-proxy web app (doPost). This is the write path:

https://script.google.com/macros/s/AKfycbzKVf_ujq00IHmfVbbqGKfE-Gl4niA6w7yG8QyGou6xkNAl2nSdKMDcxlJBAa_ZTYLeWQ/exec

The endpoint finds the correct 2026 month column by matching the header row and each row by its
column-A label — no hardcoded cell references. Send exactly this shape (month = prior month name,
year = its calendar year):

{
  "client": "amacx",
  "month": "June",
  "year": "2026",
  "actuals": {
    "units_total": <total units sold>,
    "orders_total": <total orders>
  },
  "revenue_by_market":  { "DE": .., "FR": .., "ES": .., "IT": .., "NLD": .. },
  "ad_spend_by_market": { "DE": .., "FR": .., "ES": .., "IT": .. }
}

DO NOT send Revenue Actuals, Ad Spend Actuals, Actual TACOS, AOV, or any EU total — those rows are
SUM/derived formulas in the sheet and must not be touched. The sheet recalculates them automatically
from the per-market revenue, per-market ad spend, and orders you write above.

Send with Bash curl. Use -L (Apps Script 302-redirects to script.googleusercontent.com) and let -d
imply POST — do NOT add -X POST, as forcing POST on the redirect makes the follow fail with a 405:
curl -sS -L -H "Content-Type: application/json" -d '<json body>' "<url>"

The endpoint returns {"status":"ok","written":[...],"skipped":[...]} or {"status":"error","message":"...","missing":[...]}.
Treat ONLY a non-ok status, a non-empty "missing" list, or a non-2xx HTTP response as a failure to surface in Step 4.

STEP 4 — Report and log to Notion

Output a one-block summary: month updated, the endpoint's "written" list, and anything flagged
(a "missing" entry, MerchantSpring gaps, or a failed write).
Then, in the Monthly Report Progress database in Notion (page c13f085b49bf41d6b9fd181ce85dc43f), create an entry:
  Name: AMACX — [Month] [Year] (e.g. AMACX — June 2026)
  Status: In Progress  (if the write failed or a "missing" entry was returned, set Status: Under Review and note what failed)
If an entry for this month already exists, update it instead of creating a duplicate.

REMINDERS: seller_id A1O4H4W8GP4BN2 for ad spend; only ever update the prior completed month, never
future columns; write ONLY units, orders, and the per-market revenue/ad-spend rows — never the
formula-derived rows (Revenue Actuals, Ad Spend Actuals, Actual TACOS, AOV, ASP, per-market Total EU).
```
