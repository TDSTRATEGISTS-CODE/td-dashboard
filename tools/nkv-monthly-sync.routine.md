# NKV Beauty — Monthly Google Sheet Data Sync — runbook

**This file is the runbook the scheduled routine executes.** Follow every step below exactly,
end-to-end, without stopping to ask. Today's date determines the month to update. When this runbook
changes, edit this file (via git) — the trigger prompt just points here, so there is nothing else to update.

> **Scope of this sync (read first).** This routine writes *last month's* actuals into two tabs of the
> tracker, in one POST:
> - **Amazon Account Tracker** — only **rows 2–10** and **rows 24–27**. Never the Stock section
>   (rows 15–21), the External Costs section (rows 29–37), or anything from row 38 onwards.
> - **Shopify Account Tracker** — only **rows 7, 8, 9, 17, 22, 23, 28, 35** (Contours Rx & Newnique
>   sales/units + Shopify Google/social ad spend). Nothing else.
>
> It never overwrites a formula cell. This is the write-side counterpart to `nkv-sheet-proxy.gs` (which
> only *reads* the sheet) and is separate from the `data.js` re-bake (`tools/nkv-monthly-rebake.prompt.md`).

**Context**
- **Sheet:** "NKV Beauty Account Tracker" (native Google Sheet) — ID `15h_Eo36PhnyX-a4cOlo6yvyhLwS2U9BDbz1fcnruwE4`
- **Tabs:** `Amazon Account Tracker` and `Shopify Account Tracker`
- **Currency:** GBP (£). Amazon revenue is **including VAT** (the row is literally "Amazon Revenue inc VAT");
  Shopify sales match the figures the tracker already records for each store.
- **MerchantSpring channels (Amazon):** UK `71662311` (live), IE `86715690` (early-stage),
  US `109142957` (placeholder). UK is the only fully-live Amazon market.
- **Reporting Ninja (Shopify):** source for the Shopify tab — the two D2C stores (Contours Rx
  `contours-rx.co.uk`, Newnique `newniquecare.com`) plus their Google Ads and social ad spend.
- **Write endpoint (doPost):** _«paste the NKV Apps Script `/exec` URL here after deploying — the `doPost`
  handler now lives in `nkv-sheet-proxy.gs`; it just needs a (re)deploy. See "Maintenance notes".»_
- **Connectors needed:** MerchantSpring (Amazon pull), Reporting Ninja (Shopify pull), Notion (log).

---

## STEP 1 — Identify the prior month

From today's date, determine the calendar month that just ended (timezone **Europe/London**). That is the
month to update — the `month`/`year` used in STEP 4, and the target column on **both** tabs. Recompute the
MerchantSpring period epochs each run with `calculateDateEpoch`.

The endpoint finds the column itself — **never hardcode a column letter** — but note the two tabs are laid
out differently:
- **Amazon** has a `2025` grid then a `2026` grid on row 1; the column is found from the **2026** block
  (January → R, … **June → W**, July → X).
- **Shopify** is a single month row (no year block); the column is found from the month header alone
  (January → B, … **June → G**, July → H).

## STEP 2 — Pull Amazon actuals from MerchantSpring MCP

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

## STEP 3 — Pull Shopify actuals from Reporting Ninja MCP

Pull for the same prior month in **GBP**, per store. Discover the connections/fields at run time
(`list_integrations` → `list_connections` → `list_fields` → `query_data`); do not hardcode field IDs.
Pull ONLY these figures:

- **Contours Rx store** (`contours-rx.co.uk`):
  - **Net sales** → "Contours Rx Shopify Sales".
  - **Units ordered — variations** (excluding assortment packs) → "Units ordered (variations not Ass Pack.)".
  - **Assortment packs bought on discount** → "Assortment Packs bought on discount".
  - **Google Ads spend** (Contours Rx) → "Contours Rx Google Ad Spend".
- **Newnique store** (`newniquecare.com`):
  - **Net sales** → "Newnique Shopify Sales".
  - **Units ordered** → "Units ordered" (the Newnique row).
  - **Google Ads spend** (Newnique) → "Newnique Google Ad Spend".
- **Social Media Ad Spend** (Meta / TikTok, combined) → "Social Media Ad Spend".

Everything derived from these (Total Shopify Revenue, COGS, subscription/transaction fees, profit rows) is
a formula in the sheet — **do not compute or write it**.

## STEP 4 — Write to the Google Sheet

First print a short table of every value being written (both tabs) for the record — do **not** wait for
approval; proceed straight to the write.

POST a JSON body to the doPost endpoint (URL in Context). It selects each tab, finds the prior-month column
(2026 block for Amazon, month header for Shopify) and each row by its **exact** column-A label — no
hardcoded cell references. Send exactly this shape (`month` = prior month name, `year` = its calendar year;
omit any figure you don't have and that cell is left untouched):

```json
{
  "client": "nkv",
  "month": "June",
  "year": "2026",
  "revenue_by_market": { "UK": 0, "EU": 0 },
  "units_total": 0,
  "advertising": { "ad_spend": 0, "ad_sales": 0, "acos": 0, "tacos": 0 },
  "shopify": {
    "crx_sales": 0,
    "crx_units_variations": 0,
    "crx_assortment_packs": 0,
    "crx_google_ad_spend": 0,
    "newnique_sales": 0,
    "newnique_units": 0,
    "newnique_google_ad_spend": 0,
    "social_media_ad_spend": 0
  }
}
```

**Which cells this fills — and ONLY these.**

**Amazon Account Tracker** (prior-month 2026 column):

| Row | Column-A label                | Source field                     |
| :-: | :---------------------------- | :------------------------------- |
|  5  | `NKV UK`                      | `revenue_by_market.UK`           |
|  6  | `NKV Europe`                  | `revenue_by_market.EU`           |
| 10  | `NKV Units Sold on Amazon`    | `units_total`                    |
| 24  | `Total Amazon Ad Spend`       | `advertising.ad_spend`           |
| 25  | `Total Ad Sales`              | `advertising.ad_sales`           |
| 26  | `ACOS`                        | `advertising.acos` (decimal)     |
| 27  | `TACOS`                       | `advertising.tacos` (decimal)    |

**Shopify Account Tracker** (prior-month column):

| Row | Column-A label                              | Source field                       |
| :-: | :------------------------------------------ | :--------------------------------- |
|  7  | `Contours Rx Shopify Sales`                 | `shopify.crx_sales`                |
|  8  | `Units ordered (variations not Ass Pack.)`  | `shopify.crx_units_variations`     |
|  9  | `Assortment Packs bought on discount`       | `shopify.crx_assortment_packs`     |
| 17  | `Contours Rx Google Ad Spend`               | `shopify.crx_google_ad_spend`      |
| 22  | `Newnique Shopify Sales`                    | `shopify.newnique_sales`           |
| 23  | `Units ordered`                             | `shopify.newnique_units`           |
| 28  | `Newnique Google Ad Spend`                  | `shopify.newnique_google_ad_spend` |
| 35  | `Social Media Ad Spend`                     | `shopify.social_media_ad_spend`    |

**Do NOT write anything else.** In particular:

- **Amazon Row 2 "Amazon Revenue inc VAT"** is a SUM/derived formula (recalculates from NKV UK + NKV Europe).
  Leave it and every Amazon formula cell (rows 11–13, 29, 36, 37, 39–41) intact.
- **Amazon rows 7 "Newnique Shopify Sales" and 8 "Contours Rx Shopify Sales"** on the *Amazon* tab are decoys —
  Shopify sales are written on the *Shopify* tab, never here.
- **Amazon rows 4 "AGG Amazon" and 9 "AGG Units Sold"** are the legacy aggregator business — do not touch.
- **Amazon Stock section (15–21)** and **External Costs (29–37)** and **rows 38+**: **excluded.**
- **Shopify Total Shopify Revenue, COGS, subscription/transaction fees, and every profit row** are formulas —
  **excluded.** The exact-label match distinguishes the Newnique "Units ordered" (row 23) from the Contours Rx
  "Units ordered (variations not Ass Pack.)" (row 8), so only the intended rows are touched.

**FORMULA-SAFE:** the endpoint refuses to overwrite any cell that already holds a formula and returns such
rows under `skipped` — that is expected and correct, not a failure.

Send with Bash curl. Use `-L` (Apps Script 302-redirects to `script.googleusercontent.com`) and let `-d`
imply POST — **do NOT add `-X POST`**, as forcing POST on the redirect makes the follow fail with a 405:

```bash
curl -sS -L -H "Content-Type: application/json" -d '<json body>' \
  "<NKV doPost /exec URL>"
```

The endpoint returns `{"status":"ok","written":[...],"skipped":[...]}` or
`{"status":"error","message":"...","missing":[...]}`. Each entry is prefixed with its tab name (e.g.
`Shopify Account Tracker » Newnique Shopify Sales`). Treat **only** a non-ok status, a non-empty `missing`
list, or a non-2xx HTTP response as a failure to surface in STEP 5. Formula rows appearing under `skipped`
are expected and correct — not a failure.

## STEP 5 — Report and log to Notion

Output a one-block summary: month updated, the endpoint's `written` list (both tabs), and anything flagged
(a `missing` entry, MerchantSpring/Reporting Ninja gaps, or a failed write).

Then, in the **Monthly Report Progress** database in Notion, create an entry:
- **Name:** `NKV Beauty — [Month] [Year]` (e.g. `NKV Beauty — June 2026`)
- **Status:** `In Progress` — but if the write failed or a `missing` entry was returned, set
  `Under Review` and note what failed.

If an entry for this month already exists, update it instead of creating a duplicate.

---

## Guardrails (must always hold)

- Amazon revenue inc VAT from the sales report; Amazon ad spend/sales from the advertising report; Shopify
  figures from Reporting Ninja — **never read any of them from the Sheet**.
- Write in **GBP** (Amazon revenue including VAT); write ACOS/TACOS as decimal fractions (`0.49`, not `49`).
- Only ever update the **prior completed month's** column on each tab — never overwrite future or 2025 columns.
- Match each column by its month header and each row by its **exact** column-A label, never by a hardcoded
  cell reference (the endpoint already does this).
- Write **ONLY** the rows in the two STEP 4 tables. **Never** touch the Amazon Stock section (15–21),
  Amazon External Costs (29–37), Amazon row 38+, the Shopify formula/total/profit rows, or any formula cell.

## Maintenance notes (not run steps)

- **Deploy the write endpoint (prerequisite for the first run).** The `doPost(e)` handler already lives in
  `nkv-sheet-proxy.gs`. It syncs both tabs in one POST: the **Amazon** tab (column from the requested year's
  header block) and the **Shopify** tab (column from the month header alone), mapping the JSON fields to the
  column-A labels in the STEP 4 tables, **formula-safe** via `writeCellIfPlain_`. `doPost` and `doGet` share
  one deployment, so you just (re)deploy the script as a **new version** and paste the resulting `/exec` URL
  into **Context** above and the `curl` in STEP 4. Deploy as a Web app (Execute as: Me · Who has access:
  Anyone). It is the SAME `/exec` URL the dashboard already reads from — a new version does not change it.
- **Redeploy after code changes:** if `nkv-sheet-proxy.gs` changes, redeploy as a **new version**
  (Deploy ▸ Manage deployments ▸ edit the Web app ▸ Version: New version ▸ Deploy). Google serves the last
  *deployed* version, not the latest GitHub code. The `/exec` URL stays the same.
- **Egress allowlist:** `script.google.com` and `script.googleusercontent.com` must be on the routine
  environment's allowed-domains list, or the POST is blocked with a 403.
- **Not a `data.js` re-bake.** This routine only updates the Google Sheet. The dashboard's baked numbers are
  refreshed separately by `tools/nkv-monthly-rebake.prompt.md`; no `APP_VER` bump is needed here.
