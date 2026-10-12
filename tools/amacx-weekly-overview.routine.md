# AMACX Weekly Overview Cards (Notion + SKU List → dashboard) — runbook

**This file is the runbook the scheduled weekly routine executes.** It refreshes the three Overview
cards on the AMACX dashboard. When this runbook changes, edit this file (via git); the trigger prompt
just points here.

Applies only while `clients/amacx/config.js` has `overviewSource: 'notion'`. If it says `'sheet'`, stop
and report "AMACX overview is on the sheet; nothing to do".

**Context**
- **Cards in `clients/amacx/data.js` → `sections.overview`:**
  - `healthMgmtSpec`: Account Health Management
  - `adsStrategySpec`: Advertising & Marketing Strategy
  - `stockWarn`: Logistics & Operations (card title set by `stockWarn.title`)
- **Connectors needed:** Notion (read only). The SKU List comes from the AMACX proxy (no connector).
- **Runs:** Thursday morning (`CRON_TZ=Europe/London 56 8 * * 4`), after Coogan has reviewed the
  Monday AMACX Account Health Review and marked it **Done**. Done = the "Notes for client" are approved
  to publish. **Publishes straight to `main` — no PR** (the approval is the Done status in Notion).

---

## STEP 1 — Read the sources

1. **Account Health:** open `AMACX Account Health`
   (https://app.notion.com/p/3e5d3da051228054b583d449b7c849a5), list its **Sub-tasks**, and open the
   most recent one (by the date in its title, e.g. "12 Oct 2026 - AMACX Account Health Review").
   - **Check its Status.** Only a review with Status **Done** is approved for the client.
   - Read its **"Notes for client"** section. Also read "Changes vs last week" → **Resolved**.
2. **Advertising:** open `AMACX Advertising`
   (https://app.notion.com/p/399d3da051228051a0a7cc400c7b774e), list its **Sub-tasks**, and open the
   most recent one. If it has a **"Notes for client"** section, use it. Also read the parent page's
   **Weekly log** entries from the last 14 days.
3. **What's next:** open `AMACX Monthly SOP`
   (https://app.notion.com/p/349d3da05122803eacc5ee7b997942c7) and read the week block for next week
   (Week 1 = 1st–5th, then Weeks 2–4).
4. **SKU List (stock):** fetch
   `https://script.google.com/macros/s/AKfycbzKVf_ujq00IHmfVbbqGKfE-Gl4niA6w7yG8QyGou6xkNAl2nSdKMDcxlJBAa_ZTYLeWQ/exec?rebake=1`
   and read `skuList[]`. This is the AMACX Project Tracker › SKU List tab. Each row has `asin`, `sku`,
   `title`, `de/fr/es/it` status, `euStock` (pooled EU FBM stock), `euLastSold`, `lastSynced`, `oos`
   and `mismatch`.
   - If `skuList` is empty, or `lastSynced` is more than 8 days old, leave `stockWarn` as it is and
     say so in the report.

**Stop conditions:**
- **Latest review not Done:** don't touch `healthMgmtSpec` or `adsStrategySpec` (they keep last week's
  approved content). Still refresh `stockWarn` from the SKU List (factual stock data, no approval
  needed). Report "Account Health Review <date> not marked Done; health and ads cards not updated".
- **Latest review more than 10 days old:** same as above — refresh `stockWarn` only, report
  "Account Health Review is stale ([date]); health and ads cards not updated".
- If nothing changed in any of the three blocks, don't commit; report "No changes this week".
- If a page has no "Notes for client" section, build its card from the rest of the page, following
  the wording rules. Note this in the run report.

## STEP 2 — Build the three specs

Item shape: `{level, title, sub}`.

| level | meaning |
|---|---|
| `red` | 🔴 in Notes for client, or: account at risk, money at risk, past due (`sub` starts `In progress · `) |
| `amber` | ⚠️ in Notes for client, or: below target, being worked on (`sub` starts `In progress · `) |
| `muted` | next up (`sub` starts `Next up · `) |
| `green` | done (`sub` starts `Done <d Mon> · `) — **exactly the 2 most recent per card** (fewer only if fewer exist in the last 30 days) |

**`healthMgmtSpec`**
- Use the "Notes for client" lines, as written — **filter out inventory / stock topics** (topic
  `Inventory`, or anything about OOS, stock-up dates or stock levels): those go to `stockWarn` instead.
  Compliance notes (including blocked listings, e.g. Hydro Tabs pending safety documents) stay here.
  The note `🔴 **IT** · Account Health · <text>` becomes title `Italy — Account Health` and sub
  `In progress · <text>` (first letter lower-cased). `ACCT` becomes `All markets`.
- **Max 5 open items** (so the card stays at 7 with the 2 Done lines): keep every 🔴 first, then ⚠️ in
  the order they're written. List any dropped notes in the run report.
- Then the 2 most recent **Resolved** items as green `Done <d Mon> · …` lines.
- `badge` = `'<n> open'` (red + amber count). `subLabel` = `'Weekly review · <review date>'`.

**`adsStrategySpec`**
- Use the advertising "Notes for client" if there are any. Otherwise build open / next-up items from
  the sub-task status and the next SOP advertising items (muted).
- Then the 2 most recent "Done" actions from the sub-task and Weekly log as green `Done <d Mon> · …` lines.
- `badge` = a 2–3 word headline. `subLabel` = `'Weekly review · <latest log date>'`.

**`stockWarn` — Logistics & Operations (SKU List + inventory notes)**
- `title: '&#128230; Logistics &amp; Operations'`.
- One item per row with `oos: true`. Stock is one pooled EU FBM stock, so every OOS item reads
  `<Product> — OOS all markets`. Never list a single market.
  - `level: 'red'`
  - `sub: '<ASIN> · since <d Mon>'`. Add `· stock-up now` when the item went OOS in the last 14 days.
  - Use the date the stock ran out (`noStockSince` from the latest `AMACX_EU_sku-sync_<date>.json` in
    Drive, if available). Otherwise use `euLastSold`.
- Pooled `euStock` is the truth: a SKU with `oos: true` is shown even if its status columns still say
  Active (that row is also a mismatch — see below).
- Leave out SKUs that are discontinued or superseded: `PARENT-*` rows; rows whose live-market statuses
  are all `De-Listed` / `Don't List` / `Inactive`; and the superseded **Hydro Tabs 3-pack** (B0CCJWBX6W,
  B0CCJWLKTM, B0CCJW62HZ — replaced by the 6-pack) until Ryan says otherwise.
- `euLastSold` comes back as a date string (e.g. `Tue Sep 29 2026 …`); format it as `d Mon`.
- **Mismatches:** list every `mismatch: true` row (status columns disagree with each other or with the
  pooled `euStock`) in the run report under "SKU List fixes for Coogan", with what each column says.
- **Inventory notes from the health review** ("Notes for client" lines moved out of `healthMgmtSpec`):
  if a note is about an OOS SKU already listed, fold its ask into that item's `sub` (e.g.
  `· please confirm a stock-up date`) instead of adding a second line; otherwise add it as its own item
  (keep its 🔴/⚠️ level).
- **Max 7 items:** most recent OOS first; if over 7, drop the longest-OOS SKUs and list them in the run report.
- `badge` = `'<n> OOS SKUs'` (or `'All in stock'` with an empty list).
  `subLabel` = `'SKU List · pooled EU stock · <sync date>'`.

**Order and size:** red → amber → muted → green (the 2 Done lines always sit at the bottom).
**Max 7 items per card.** For Account Health / Advertising that means up to 5 open or next-up items plus
the 2 Done lines; trim muted before open, and never drop below 2 Done lines.

**Wording rules (client-facing; this is shown to AMACX):**
- Lines from "Notes for client" are already client-approved: keep their wording, numbers and risk
  level.
- Anything you write yourself:
  - One market per item unless it really applies to every market (`All markets — …`).
  - No internal notes: no "UNACTIONED", "escalate", "HOLD", "needs Ryan", run numbers, tool or
    permission errors, Perpetua or MerchantSpring mechanics, staff names, or blame.
  - Exact numbers only, with the target where there is one. Never invent a number.
- Stock: always "stock-up", never "order", "restock" or "reorder" (change "restock date" to
  "stock-up date").
- Escape single quotes for the JS string literal (`\'`).

## STEP 3 — Write, check, publish to main

1. Work on `main` (pull the latest first). Replace only the blocks you're allowed to update this run
   (`healthMgmtSpec`, `adsStrategySpec`, `stockWarn`) in `clients/amacx/data.js`. Update the source
   comment above them: page titles and the SKU sync time.
2. Bump `APP_VER` in `index.html` to today's date (cache-buster; see CLAUDE.md). Without it the client
   keeps seeing last week's cards.
3. Checks, which must all pass — **if any fails, don't push**; report the failure instead:
   - `node --check clients/amacx/data.js`
   - `grep -niE 'order this week|order soon|order now|reorder|restock' clients/amacx/data.js`:
     no new hits in the three blocks
   - No item presents NLD or the Netherlands as live
   - Every Account Health item traces to a "Notes for client" or "Resolved" line on a **Done** review
4. Commit to `main` with the message `AMACX overview cards — <d Mon YYYY>` and push
   (`git push origin main`). This is the authorised publish step: the Done status in Notion is the
   approval, so no PR is needed. Touch nothing outside `clients/amacx/data.js` and `index.html`.
5. Run report (the session's final message, sent as a push notification), 4 short lines:
   - what was published (or "No changes this week" / the stop reason)
   - open health items and OOS SKUs
   - "SKU List fixes for Coogan" (mismatch rows, with what each column says)
   - any notes dropped by the 7-item limit
