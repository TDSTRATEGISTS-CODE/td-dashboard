# Weekly Dashboard Overview Cards (Notion + SKU sync → client dashboards) — runbook

**This file is the runbook the scheduled routine `Weekly · ALL · Dashboard Overview` executes.** It
refreshes the three Overview cards on every client dashboard switched on in **section 5 (client config)**.
When this runbook changes, edit this file (via git); the trigger prompt just points here.

**The three cards** (in `clients/<folder>/data.js` → `sections.overview`):
- `healthMgmtSpec`: Account Health Management
- `adsStrategySpec`: Advertising & Marketing Strategy
- `stockWarn`: Logistics & Operations (card title set by `stockWarn.title`)

**Runs:** Thursday 08:56 UK (`CRON_TZ=Europe/London 56 8 * * 4`), after Coogan has reviewed each Monday
Account Health Review and marked it **Done**. Done = that client's "Notes for client" are approved to
publish. **Publishes straight to `main` — no PR** (the approval is the Done status in Notion).

**Connectors needed:** Notion (read only) and Google Drive (read only, for the SKU sync files).

---

## 1. For each client with `Overview: On` in section 5

Work through the clients one at a time. A problem with one client never blocks the others: skip it,
note why in the run report, and carry on.

### 1a. Read the sources
1. **Account Health:** open the client's **Account Health parent task**, list its **Sub-tasks**, open the
   most recent one (by the date in its title, e.g. "12 Oct 2026 - AMACX Account Health Review").
   - **Check its Status.** Only a review with Status **Done** is approved for the client.
   - Read its **"Notes for client"** section and "Changes vs last week" → **Resolved**.
2. **Advertising:** open the client's **Advertising task** (a sub-task of 🪄 Amazon Advertising,
   https://app.notion.com/p/399d3da05122803ea766e2232a94aa79). Read its **"Notes for client"** section
   if it has one. Also read its most recent sub-task and its **Weekly log** entries from the last 14 days,
   and the client's section of the **Ads Action Plan** on 🪄 Amazon Advertising (ticked = done).
3. **What's next:** open the client's **Monthly SOP** and read the week block for next week
   (Week 1 = 1st–5th, then Weeks 2–4).
4. **Stock:** in Google Drive, find the newest SKU sync file for each of the client's **SKU sync files**
   (search `title contains '<prefix>_sku-sync_'`, not the `_receipt` file; newest date in the name) and
   read it (`read_file_content`). Each row has `sku`, `asin`, `product`, `stock`, `units30`, `lastSold`
   and `noStockSince`.
   - Where the client config lists a **SKU List** source, read it too (statuses + mismatches).

### 1b. Gates
- **Latest review not Done, or more than 10 days old:** don't touch `healthMgmtSpec` or
  `adsStrategySpec` (they keep last week's approved content). Still refresh `stockWarn` (factual stock
  data, no approval needed). Report "<Client>: review <date> not Done / stale; health and ads not updated".
- **SKU sync file missing or more than 8 days old:** leave `stockWarn` as it is and say so.
- **First run for a client** (its `config.js` doesn't yet have `overviewSource: 'notion'`): only go
  ahead if the review is Done. Then bake all three cards and set `overviewSource: 'notion'` in
  `clients/<folder>/config.js` in the same commit. If not Done, skip the client entirely this week.
- If nothing changed for a client, leave its files alone.

## 2. Build the three specs

Item shape: `{level, title, sub}`.

| level | meaning |
|---|---|
| `red` | 🔴 in Notes for client, or: account at risk, money at risk, past due (`sub` starts `In progress · `) |
| `amber` | ⚠️ in Notes for client, or: below target, being worked on (`sub` starts `In progress · `) |
| `muted` | next up (`sub` starts `Next up · `) |
| `green` | done (`sub` starts `Done <d Mon> · `) — **exactly the 2 most recent per card** (fewer only if fewer exist in the last 30 days) |

**`healthMgmtSpec`**
- Use the "Notes for client" lines, as written — **filter out inventory / stock topics** (Area
  `Inventory`, or anything about OOS, stock-up dates or stock levels): those go to `stockWarn` instead.
  Compliance notes (including blocked listings) stay here. Leave out ✅ notes (healthy, nothing to act on)
  unless the card would otherwise be empty.
- The note `🔴 **IT** · Account Health · <text>` becomes title `Italy — Account Health` and sub
  `In progress · <text>` (first letter lower-cased). `ACCT` becomes `All markets`.
- **Max 5 open items:** every 🔴 first, then ⚠️ in the order written. List dropped notes in the report.
- Then the 2 most recent **Resolved** items as green `Done <d Mon> · …` lines.
- `badge` = `'<n> open'` (red + amber count), or `'All healthy'` when none. `subLabel` = `'Weekly review · <review date>'`.

**`adsStrategySpec`**
- If the Advertising task has **"Notes for client"**, use them as written (same format and conversion
  as above).
- Otherwise build open / next-up items yourself from the task's status, the unticked approved lines in
  the Ads Action Plan and the next SOP advertising items (`muted`).
- Then the 2 most recent done actions (ticked Ads Action Plan lines or Weekly log "Done") as green
  `Done <d Mon> · …` lines. Group per-market actions of the same change into one line (e.g.
  `Cherry Juice+ campaigns launched` · `Done 7 Oct · France, Spain & Italy`).
- `badge` = a 2–3 word headline. `subLabel` = `'Weekly review · <latest log date>'`.

**`stockWarn` — Logistics & Operations**
- `title: '&#128230; Logistics &amp; Operations'`.
- One `red` item per out-of-stock SKU: `stock` is 0 and `noStockSince` is set.
  - **Pooled stock** (client config says so): title `<Product> — OOS all markets`.
    **Per-market stock:** title `<Product> — OOS <market>`; one item per market file.
  - `sub: '<ASIN> · since <d Mon of noStockSince>'`. Add `· stock-up now` when it went OOS in the last 14 days.
  - Short product names (e.g. "Turbo Chew Lemon", "Energy Drink Powder 320g Lemon"), not Amazon titles.
- **Leave out discontinued / superseded SKUs:** `PARENT-*` rows; SKUs the client config lists as
  superseded; where a SKU List is available, rows whose live-market statuses are all `De-Listed` /
  `Don't List` / `Inactive`; otherwise SKUs with no sale in the last 120 days (`lastSold` empty or older).
  List what you left out in the report.
- **Inventory notes from the health review** (moved out of `healthMgmtSpec`): if the note is about an
  OOS SKU already listed, fold its ask into that item's `sub` (e.g. `· please confirm a stock-up date`);
  otherwise add it as its own item, keeping its 🔴/⚠️ level.
- **SKU List mismatches** (where a SKU List source exists): list every `mismatch: true` row in the report
  under "SKU List fixes for Coogan", with what each column says. Never show a mismatch as OOS unless the
  stock figure itself is 0.
- **Max 7 items:** most recent OOS first; drop the longest-OOS SKUs beyond 7 and list them in the report.
- `badge` = `'<n> OOS SKUs'` (or `'All in stock'`). `subLabel` = `'SKU sync · <stock basis> · <sync date>'`.

**Order and size (all cards):** red → amber → muted → green (the 2 Done lines always at the bottom).
**Max 7 items per card.** Trim muted before open; never drop below 2 Done lines.

**Wording rules (client-facing):**
- "Notes for client" lines are already client-approved: keep their wording, numbers and risk level.
- Anything you write yourself:
  - One market per item unless it genuinely applies to every market (`All markets — …`).
  - No internal notes: no "UNACTIONED", "escalate", "HOLD", "WATCH", "needs Ryan", run numbers, ACoS /
    TACoS / margins, tool or permission errors, Perpetua or MerchantSpring mechanics, staff names, blame.
  - Exact numbers only, with the target where there is one. Never invent a number.
- Stock: always "stock-up", never "order", "restock" or "reorder" ("restock date" → "stock-up date").
- Escape single quotes for the JS string literal (`\'`).

## 3. Write, check, publish to main (once, for all clients)

1. Work on `main` (pull first). For each client, replace only the blocks it's allowed to update this run
   in `clients/<folder>/data.js`, and update the source comment above them (page titles, sync dates).
2. If anything changed for any client: bump `APP_VER` in `index.html` to today's date (cache-buster; see
   CLAUDE.md). Without it clients keep seeing last week's cards.
3. Checks, which must all pass — **if one fails for a client, revert that client's files and report it**:
   - `node --check clients/<folder>/data.js` (and `config.js` if changed)
   - `grep -niE 'order this week|order soon|order now|reorder|restock' clients/<folder>/data.js`: no new
     hits in the three blocks
   - No item presents a market the client config marks as not live
   - Every Account Health item traces to a "Notes for client" or "Resolved" line on a **Done** review
4. One commit to `main`, message `Overview cards — <d Mon YYYY> (<clients updated>)`, and push
   (`git push origin main`). This is the authorised publish step. Touch nothing outside
   `clients/*/data.js`, `clients/*/config.js` (first-run switch only) and `index.html`.
5. Run report (the session's final message, sent as a push notification), per client in 3–4 short lines:
   what was published (or why not), open health items and OOS SKUs, SKU List fixes for Coogan, any notes
   dropped by the 7-item limit.

## 4. Switching a client on or off

- **On:** set `Overview: On` in its block below. The next Thursday run bakes its cards (only if its review
  is Done) and flips its `config.js` to `overviewSource: 'notion'`. Check any layout note in the block first.
- **Off / revert:** set `overviewSource: 'sheet'` in `clients/<folder>/config.js`, bump `APP_VER`, and set
  `Overview: Off` here. The sheet's Project Scope cards come back.

## 5. Client config

### AMACX
| Field | Value |
|---|---|
| Overview | **On** (live since 12 Oct 2026) |
| Dashboard folder | `clients/amacx` |
| Markets | DE, FR, ES, IT · **NLD is not live** — never show it |
| Account Health parent task | https://app.notion.com/p/3e5d3da051228054b583d449b7c849a5 |
| Advertising task | https://app.notion.com/p/399d3da051228051a0a7cc400c7b774e (AMACX Advertising) |
| Monthly SOP | https://app.notion.com/p/349d3da05122803eacc5ee7b997942c7 |
| SKU sync files | `AMACX_EU` |
| Stock basis | **Pooled** EU FBM stock → every OOS SKU is "OOS all markets" |
| SKU List | `https://script.google.com/macros/s/AKfycbzKVf_ujq00IHmfVbbqGKfE-Gl4niA6w7yG8QyGou6xkNAl2nSdKMDcxlJBAa_ZTYLeWQ/exec?rebake=1` → `skuList[]` (`de/fr/es/it` status, `euStock`, `oos`, `mismatch`) |
| Superseded | Hydro Tabs 3-pack (B0CCJWBX6W, B0CCJWLKTM, B0CCJW62HZ — replaced by the 6-pack) |
| Layout note | — |

### Abimax
| Field | Value |
|---|---|
| Overview | Off (ready — switch on when Ryan says) |
| Dashboard folder | `clients/abimax` |
| Markets | US |
| Account Health parent task | https://app.notion.com/p/3e5d3da051228184ba65f127069cd0a5 |
| Advertising task | https://app.notion.com/p/399d3da0512280b197adc4418abc5e9f |
| Monthly SOP | https://app.notion.com/p/2b7d3da0512280a5b53af9f0788d0e81 |
| SKU sync files | `Abimax_US` |
| Stock basis | Per market (US only) |
| SKU List | — (use the 120-day rule for discontinued SKUs) |
| Superseded | — |
| Layout note | — |

### Balance 8
| Field | Value |
|---|---|
| Overview | Off (ready — switch on when Ryan says) |
| Dashboard folder | `clients/balance8` |
| Markets | UK |
| Account Health parent task | https://app.notion.com/p/3e5d3da0512281fda711ec3cc1000d46 |
| Advertising task | https://app.notion.com/p/3c0d3da0512280968ed2fb99af06d7f2 |
| Monthly SOP | https://app.notion.com/p/3a3d3da051228085a495eafafcdd6e7a |
| SKU sync files | `Balance8_UK` |
| Stock basis | Per market (UK only) |
| SKU List | — (use the 120-day rule) |
| Superseded | — |
| Layout note | Client notes say stock is inbound after the Oct 2026 re-engagement; OOS items are expected until it lands |

### NKV (Naikav Global)
| Field | Value |
|---|---|
| Overview | Off (needs the layout fix below first) |
| Dashboard folder | `clients/nkv` |
| Markets | UK, US (IRL early-stage) |
| Account Health parent task | https://app.notion.com/p/3e5d3da05122819ca0e6c0d790f4a9d9 |
| Advertising task | https://app.notion.com/p/399d3da0512280aea9e5d96fdbf82901 (NKV UK; US has no ads task yet) |
| Monthly SOP | https://app.notion.com/p/341d3da0512281098d22d1d6a3657cd3 |
| SKU sync files | `NKV_UK`, `NKV_US` |
| Stock basis | **Per market** (FBA) → "OOS UK" / "OOS US" |
| SKU List | — (use the 120-day rule) |
| Superseded | — |
| Layout note | NKV moves Stock Warnings into the Buy Box slot (`layout.stockToBuyBoxSlot`), leaving 2 cards in the top grid. A 2-column grid rule is needed in `app.js`/`index.html` before switching on (one-off code change, not this routine). |

### Not covered
- **Harvaza:** founder dashboard layout; tasks and milestones already come from Notion via its proxy.
- **HSB, VH Life:** no client dashboard.
