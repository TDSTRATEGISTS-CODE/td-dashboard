# AMACX Monthly Google Sheet Data Sync — runbook

**This file is the runbook the scheduled routine executes.** Follow every step below exactly,
end-to-end, without stopping to ask. Today's date determines the month to update. When this runbook
changes, edit this file (via git) — the trigger prompt just points here, so there is nothing else to update.

**Context**
- **Sheet ID:** `1yJvCPOnxhQO4oa1cUzrnyiORRO6kWKtf1Fw544C-K9Q`
- **Seller ID (ad spend):** `A1O4H4W8GP4BN2`
- **Write endpoint (doPost):** `https://script.google.com/macros/s/AKfycbzKVf_ujq00IHmfVbbqGKfE-Gl4niA6w7yG8QyGou6xkNAl2nSdKMDcxlJBAa_ZTYLeWQ/exec`
- **Connectors needed:** MerchantSpring (pull), Notion (log).

---

## STEP 1 — Identify the prior month

From today's date, determine the month that just ended. That is the month to update (the `month`
and `year` used in STEP 3).

## STEP 2 — Pull actuals from MerchantSpring MCP

Pull for the prior month in **Euros including tax**. Pull ONLY these input figures — the sheet derives
everything else itself:

- **Revenue and units** — `getSalesByPeriod` per channel:
  - Revenue by market: DE, FR, ES, IT, NLD
  - Units sold total
  - Number of orders total
- **Ad spend** — `getAdvertisingByChannels`, filter to `seller_id A1O4H4W8GP4BN2`, read the spend field per store:
  - Ad spend by market: DE, FR, ES, IT

Ad spend comes from `getAdvertisingByChannels` only; revenue from `getSalesByPeriod` only — **never read
either from the Sheet**.

## STEP 3 — Write to the Google Sheet

First print a short table of the values being written (units, orders, and the per-market revenue +
ad-spend breakdowns) for the record — do **not** wait for approval; proceed straight to the write.

POST a JSON body to the doPost endpoint (URL above). It finds the correct 2026 month column by matching
the header row and each row by its column-A label — no hardcoded cell references. Send exactly this shape
(`month` = prior month name, `year` = its calendar year):

```json
{
  "client": "amacx",
  "month": "June",
  "year": "2026",
  "actuals": {
    "units_total": 0,
    "orders_total": 0
  },
  "revenue_by_market":  { "DE": 0, "FR": 0, "ES": 0, "IT": 0, "NLD": 0 },
  "ad_spend_by_market": { "DE": 0, "FR": 0, "ES": 0, "IT": 0 }
}
```

**Do NOT send Revenue Actuals, Ad Spend Actuals, Actual TACOS, AOV, ASP, or any EU total** — those rows
are SUM/derived formulas in the sheet and must not be touched. The sheet recalculates them automatically
from the per-market revenue, per-market ad spend, and orders written above. (The endpoint also refuses to
overwrite any formula cell as a safety net, returning such rows under `skipped`.)

Send with Bash curl. Use `-L` (Apps Script 302-redirects to `script.googleusercontent.com`) and let `-d`
imply POST — **do NOT add `-X POST`**, as forcing POST on the redirect makes the follow fail with a 405:

```bash
curl -sS -L -H "Content-Type: application/json" -d '<json body>' \
  "https://script.google.com/macros/s/AKfycbzKVf_ujq00IHmfVbbqGKfE-Gl4niA6w7yG8QyGou6xkNAl2nSdKMDcxlJBAa_ZTYLeWQ/exec"
```

The endpoint returns `{"status":"ok","written":[...],"skipped":[...]}` or
`{"status":"error","message":"...","missing":[...]}`. Treat **only** a non-ok status, a non-empty
`missing` list, or a non-2xx HTTP response as a failure to surface in STEP 4. Formula rows appearing under
`skipped` are expected and correct — not a failure.

## STEP 4 — Report and log to Notion

Output a one-block summary: month updated, the endpoint's `written` list, and anything flagged (a
`missing` entry, MerchantSpring gaps, or a failed write).

Then, in the **Monthly Report Progress** database in Notion (page `c13f085b49bf41d6b9fd181ce85dc43f`),
create an entry:
- **Name:** `AMACX — [Month] [Year]` (e.g. `AMACX — June 2026`)
- **Status:** `In Progress` — but if the write failed or a `missing` entry was returned, set
  `Under Review` and note what failed.

If an entry for this month already exists, update it instead of creating a duplicate.

---

## Guardrails (must always hold)

- Ad spend from `getAdvertisingByChannels` (`seller_id A1O4H4W8GP4BN2`) only — never from the Sheet.
- Revenue from `getSalesByPeriod` only — never from the Sheet.
- Only ever update the **prior completed month** — never overwrite future columns.
- Match Sheet rows by label, never by hardcoded cell reference (the endpoint already does this).
- Write ONLY units, orders, and the per-market revenue/ad-spend rows — never the formula-derived rows
  (Revenue Actuals, Ad Spend Actuals, Actual TACOS, AOV, ASP, per-market Total EU).

## Maintenance notes (not run steps)

- **Redeploy after code changes:** if `amacx-data-proxy.gs` changes, redeploy the Apps Script as a
  **new version** (Deploy ▸ Manage deployments ▸ edit the Web app ▸ Version: New version ▸ Deploy). Google
  serves the last *deployed* version, not the latest GitHub code. The `/exec` URL stays the same.
- **Egress allowlist:** `script.google.com` and `script.googleusercontent.com` must be on the routine
  environment's allowed-domains list, or the POST is blocked with a 403.
- **Schedule:** the trigger runs on cron `0 9 5 * *` (09:00 UTC on the 5th; 10:00 UK during BST).
