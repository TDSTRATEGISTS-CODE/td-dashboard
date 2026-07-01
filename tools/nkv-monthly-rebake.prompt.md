# NKV Beauty — monthly data re-bake (Routine prompt)

You are running the **NKV Beauty monthly data re-bake** as an autonomous Claude Code routine. Work end-to-end
without asking for confirmation, then open a pull request for a human to review. Do **not** merge it yourself.

## What to do

Follow the ordered runbook in **`README.md` → "Refreshing NKV" → "Monthly re-bake routine (agent runbook)"**.
Read that section first and follow **every** step in order. This file is the trigger + guardrails; the README is
the authoritative procedure.

## Target month

The **latest fully-closed calendar month**. If today is 2026-08-03, the target month is **July 2026**. Recompute
the MerchantSpring period epochs each run with `calculateDateEpoch` in timezone `Europe/London`. The `data.js`
object key **`may`** is the "Last Month" slot — keep the key literally `may`; only update its `label`/`shortLabel`.

## Key facts (also in the runbook)

- **Files you hand-edit:** `clients/nkv/data.js` (the baked snapshot), `clients/nkv/config.js`
  (`reportPeriodLabel`), and `index.html` (bump `APP_VER`). Repo root *is* the dashboard folder.
- **MerchantSpring channels:** UK `71662311`, IE `86715690`, US `109142957` (see the runbook table for merchant
  IDs). UK is the only fully-live market; IE is early-stage (no ads); US stays a zeros placeholder.
- **Never touch the live-proxy blocks:** Overview project board, `sections.shopifypnl`,
  `sections.inventory.supplierPOs` — those are served live by `nkv-sheet-proxy.gs`, not baked.
- **Validate before committing** (throws on any JS error):
  ```bash
  node -e "global.window={}; require('./clients/nkv/data.js'); const d=window.DASHBOARD_DATA; \
    ['may','3m','6m','12m'].forEach(p=>{if(!d.dateRanges[p]) throw new Error('missing period '+p)}); \
    console.log('shape OK →', d.dateRanges.may.label, d.dateRanges.may.rev)"
  ```
  Sanity-check: TACOS never >100%, ROAS ~2–3×, no negative/blank revenue, every MoM delta present.
- **Bump `APP_VER`** in `index.html` (new bake date + letter). A data-only refresh needs no proxy redeploy.

## Requirements & failure handling

- Requires the **MerchantSpring connector** to be attached to this routine. If its tools are unavailable, stop and
  open a **draft** PR saying the connector was missing — do not guess or fabricate numbers.
- If any pull returns null/empty, or the `node` validation or a sanity check fails, **STOP**: do not push partial
  data. Open a **draft** PR describing exactly what failed.

## Deliverable

Commit `clients/nkv/data.js` + `index.html` + `clients/nkv/config.js`, push to a `claude/`-prefixed branch, and
open a PR titled **`NKV monthly re-bake — <Mon YYYY>`**. The PR body must contain:

- Headline figures for the target month: **revenue / ad spend / TACOS / ROAS**, each **vs the prior month**.
- A **`✅ validations passed`** line (or the failure detail if a draft).

Keep it a review gate — the numbers are client-facing. Do not merge.
