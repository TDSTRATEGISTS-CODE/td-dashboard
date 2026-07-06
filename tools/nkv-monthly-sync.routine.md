# NKV Beauty — Monthly Google Sheet Data Sync — runbook

**This file is the runbook the scheduled routine executes.** Follow every step below exactly,
end-to-end, without stopping to ask. Today's date determines the month to update. When this runbook
changes, edit this file (via git) — the trigger prompt just points here, so there is nothing else to update.

> **Scope of this sync (read first).** This routine writes *last month's* Amazon actuals into ONE column
> of the **Amazon Account Tracker** tab, touching **only rows 2–10 and rows 24–27**. It **never** writes
> the **Stock** section (rows 15–21), the **External Costs** section (rows 29–37), or anything from row 38
> onwards. It also never overwrites a formula cell. This is the write-side counterpart to
> `nkv-sheet-proxy.gs` (which only *reads* the sheet) and is separate from the `data.js` re-bake
> (`tools/nkv-monthly-rebake.prompt.md`).

**Context**
- **Sheet:** "NKV Beauty Account Tracker" (native Google Sheet) — ID `15h_Eo36PhnyX-a4cOlo6yvyhLwS2U9BDbz1fcnruwE4`
- **Tab:** `Amazon Account Tracker`
- **Currency:** GBP (£), revenue **including VAT** (the row is literally "Amazon Revenue inc VAT").
- **MerchantSpring channels:** UK `71662311` (live), IE `86715690` (early-stage), US `109142957` (placeholder).
  UK is the only fully-live Amazon market.
- **Write endpoint (doPost):** _«NKV `doPost` /exec — NOT yet deployed; the NKV proxy is read-only today.
  See "Maintenance notes → Adding the write endpoint" before the first run.»_
- **Connectors needed:** MerchantSpring (pull), Notion (log).

---

## STEP 1 — Identify the prior month

From today's date, determine the calendar month that just ended (timezone **Europe/London**). That is the
month to update — the `month`/`year` used in STEP 3, and the target column in the tracker. Recompute
MerchantSpring period epochs each run with `calculateDateEpoch`.

The target column is the matching month in the sheet's **2026** block (the second header block on row 1,
which begins with a `2026` cell): January → column R, February → S, … **June → W**, July → X, and so on.
Locate it by matching the header row — **never hardcode a column letter**.

## STEP 2 — Pull actuals from MerchantSpring MCP

Pull for the prior month in **GBP including VAT**. Pull ONLY these input figures — the sheet derives
everything else (the inc-VAT total, ex-VAT, VAT held, disbursements, profit rows) itself:

- **Revenue inc VAT by market** — `getSalesByPeriod` / `getSalesByChannels`:
  - **UK** (channel `71662311`) → the "NKV UK" figure.
  - **EU marketplaces** (the European Amazon channel) → the "NKV Europe" figure.
- **Units sold** — total Amazon units across markets → "NKV Units Sold on Amazon".
- **Advertising** — `getAdvertisingByChannels`:
  - **Total ad spend** and **total ad sales**.
  - **ACOS** and **TACOS** — take them from the advertising report if it returns them; otherwise derive
    **ACOS = ad spend ÷ ad sales** and **TACOS = ad spend ÷ revenue inc VAT**. Write them as **decimal
    fractions** (e.g. `0.49` for 49%), matching the cell format in the sheet.

Revenue from the sales report only; ad spend/sales from the advertising report only — **never read
either from the Sheet**.

## STEP 3 — Write to the Google Sheet

First print a short table of the values being written (UK revenue, EU revenue, units, ad spend, ad sales,
ACOS, TACOS) for the record — do **not** wait for approval; proceed straight to the write.

POST a JSON body to the doPost endpoint (URL in Context). It finds the correct 2026 month column by matching
the header row and each row by its column-A label on the **Amazon Account Tracker** tab — no hardcoded cell
references. Send exactly this shape (`month` = prior month name, `year` = its calendar year):

```json
{
  "client": "nkv",
  "month": "June",
  "year": "2026",
  "revenue_by_market": { "UK": 0, "EU": 0 },
  "units_total": 0,
  "advertising": { "ad_spend": 0, "ad_sales": 0, "acos": 0, "tacos": 0 }
}
```

**Which cells this fills — and ONLY these:**

| Row | Column-A label                | Source field                     |
| :-: | :---------------------------- | :------------------------------- |
|  5  | `NKV UK`                      | `revenue_by_market.UK`           |
|  6  | `NKV Europe`                  | `revenue_by_market.EU`           |
| 10  | `NKV Units Sold on Amazon`    | `units_total`                    |
| 24  | `Total Amazon Ad Spend`       | `advertising.ad_spend`           |
| 25  | `Total Ad Sales`              | `advertising.ad_sales`           |
| 26  | `ACOS`                        | `advertising.acos` (decimal)     |
| 27  | `TACOS`                       | `advertising.tacos` (decimal)    |

**Do NOT write anything else.** In particular:

- **Row 2 "Amazon Revenue inc VAT"** is a SUM/derived formula — it recalculates from NKV UK + NKV Europe.
  Leave it (and every formula cell: rows 11–13, 29, 36, 37, 39–41) intact.
- **Rows 7 "Newnique Shopify Sales" and 8 "Contours Rx Shopify Sales"** are Shopify figures, not Amazon —
  synced via the Shopify block, never by this routine.
- **Rows 4 "AGG Amazon" and 9 "AGG Units Sold"** are the legacy aggregator business (all zero in 2026) —
  do not touch.
- **Stock section — rows 15–21** (Amazon/Beckdale stock qty, market value, CoGS value): **excluded.**
- **External Costs — rows 29–37** (Brand Manager, Beckdale, Social, Google, SEO, Influencer, TD service
  fees, consultancy %): **excluded** — these are entered from other sources, not Amazon actuals.
- **Rows 38 and onwards** (profit before/after costs and margin %): **excluded** — all formula-driven.

**FORMULA-SAFE:** the endpoint refuses to overwrite any cell that already holds a formula and returns such
rows under `skipped` — that is expected and correct, not a failure.

Send with Bash curl. Use `-L` (Apps Script 302-redirects to `script.googleusercontent.com`) and let `-d`
imply POST — **do NOT add `-X POST`**, as forcing POST on the redirect makes the follow fail with a 405:

```bash
curl -sS -L -H "Content-Type: application/json" -d '<json body>' \
  "<NKV doPost /exec URL>"
```

The endpoint returns `{"status":"ok","written":[...],"skipped":[...]}` or
`{"status":"error","message":"...","missing":[...]}`. Treat **only** a non-ok status, a non-empty
`missing` list, or a non-2xx HTTP response as a failure to surface in STEP 4. Formula rows appearing under
`skipped` are expected and correct — not a failure.

## STEP 4 — Report and log to Notion

Output a one-block summary: month updated, the endpoint's `written` list, and anything flagged (a
`missing` entry, MerchantSpring gaps, or a failed write).

Then, in the **Monthly Report Progress** database in Notion, create an entry:
- **Name:** `NKV Beauty — [Month] [Year]` (e.g. `NKV Beauty — June 2026`)
- **Status:** `In Progress` — but if the write failed or a `missing` entry was returned, set
  `Under Review` and note what failed.

If an entry for this month already exists, update it instead of creating a duplicate.

---

## Guardrails (must always hold)

- Revenue inc VAT from the sales report; ad spend/sales from the advertising report — **never from the Sheet**.
- Write in **GBP including VAT**; write ACOS/TACOS as decimal fractions (`0.49`, not `49`).
- Only ever update the **prior completed month's** 2026 column — never overwrite future or 2025 columns.
- Match the target column by the 2026 month header and each row by its column-A label, never by a hardcoded
  cell reference (the endpoint already does this).
- Write **ONLY** rows 5, 6, 10 (Revenue & Units inputs) and rows 24–27 (Marketing Metrics). **Never** touch
  the Stock section (15–21), External Costs (29–37), row 38+, or any formula cell (Row 2 total included).

## Maintenance notes (not run steps)

- **Adding the write endpoint (prerequisite for the first run).** `nkv-sheet-proxy.gs` currently exposes
  only `doGet` (read). Before this routine can run, add a `doPost(e)` handler to that script that:
  1. Opens the sheet and selects the **`Amazon Account Tracker`** tab.
  2. Finds the prior-month column by matching the **2026** header block (skip any "Totals" column).
  3. Maps the JSON fields to column-A labels exactly as in the STEP 3 table (`NKV UK`, `NKV Europe`,
     `NKV Units Sold on Amazon`, `Total Amazon Ad Spend`, `Total Ad Sales`, `ACOS`, `TACOS`).
  4. Is **formula-safe** — writes a cell only when it holds no formula, and reports the rest under `skipped`
     (see `amacx-data-proxy.gs` → `writeCellIfPlain_` / `findMonthCol_` / `matchRowIndex_` for the pattern).
  Deploy it as a Web app (Execute as: Me · Who has access: Anyone) and paste the `/exec` URL into **Context**
  above and into the `curl` in STEP 3.
- **Redeploy after code changes:** if `nkv-sheet-proxy.gs` changes, redeploy the Apps Script as a
  **new version** (Deploy ▸ Manage deployments ▸ edit the Web app ▸ Version: New version ▸ Deploy). Google
  serves the last *deployed* version, not the latest GitHub code. The `/exec` URL stays the same.
- **Egress allowlist:** `script.google.com` and `script.googleusercontent.com` must be on the routine
  environment's allowed-domains list, or the POST is blocked with a 403.
- **Not a `data.js` re-bake.** This routine only updates the Google Sheet. The dashboard's baked Amazon
  numbers are refreshed separately by `tools/nkv-monthly-rebake.prompt.md`; no `APP_VER` bump is needed here.
