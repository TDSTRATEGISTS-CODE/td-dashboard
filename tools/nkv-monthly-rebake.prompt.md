# NKV Beauty — monthly data re-bake (Routine prompt)

You are running the **NKV Beauty monthly data re-bake** as an autonomous Claude Code routine. Work end-to-end
without asking for confirmation. This is an **auto-publish + notify** setup: when every self-check passes, publish
straight to `main` (it's live) and log the run; only fall back to a human review gate if something fails.

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

## Self-check gate (decides publish vs review)

Before publishing, ALL of these must pass. Treat any failure as a hard stop:

1. **Connector present** — the MerchantSpring connector is attached and its tools return data. If missing, do not
   guess or fabricate numbers.
2. **Every pull returned data** — no market/period came back null or empty for a market that should have data
   (UK always; IE/US may legitimately be near-zero).
3. **`node` shape/syntax check passes** (the command in the runbook prints `shape OK`).
4. **Sanity pass is clean** — TACOS never >100%, ROAS ~2–3×, no negative/blank revenue, every MoM delta present,
   and no single headline metric swings >60% month-over-month without an obvious cause (a big swing is exactly the
   "plausible but wrong" case a human should see — treat it as a failure and route to review).

## Deliverable

**On a clean pass — auto-publish (no human gate):**
- Commit `clients/nkv/data.js` + `index.html` (`APP_VER` bump) + `clients/nkv/config.js` and **push directly to
  `main`**. This requires the routine to have "Allow unrestricted branch pushes" enabled; if the push to `main` is
  rejected, fall back to the failure path below (open a PR) rather than leaving the work unpublished.
- **Notify:** add a comment to the GitHub issue **`tdstrategists-code/td-dashboard` #4 "NKV monthly re-bake — run
  log"** with the target month's **revenue / ad spend / TACOS / ROAS, each vs the prior month**, and a
  `✅ validations passed — published to main` line. Keep it to a few lines.

**On any failure — do NOT touch `main`:**
- Do not push partial or suspect data. Commit what you have to a `claude/`-prefixed branch and open a **draft PR**
  titled `NKV monthly re-bake — <Mon YYYY> (NEEDS REVIEW)` explaining exactly which self-check failed.
- Also comment on issue **#4** with a one-line `⚠️ needs review` summary + the draft PR link, so it surfaces in the
  same notify channel.

Never merge a PR yourself. The auto-publish path skips PRs entirely; the failure path always leaves a human gate.
