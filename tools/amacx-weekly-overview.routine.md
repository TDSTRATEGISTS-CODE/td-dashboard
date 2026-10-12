# AMACX Weekly Overview Cards (Notion → dashboard) — runbook

**This file is the runbook the scheduled weekly routine executes.** It refreshes the two Notion-fed
Overview cards on the AMACX dashboard. When this runbook changes, edit this file (via git); the trigger
prompt just points here.

Applies only while `clients/amacx/config.js` has `overviewSource: 'notion'`. If it says `'sheet'`, stop
and report "AMACX overview is on the sheet; nothing to do".

**Context**
- **Cards:** `clients/amacx/data.js` → `sections.overview.healthMgmtSpec` (Account Health Management)
  and `sections.overview.adsStrategySpec` (Advertising & Marketing Strategy).
- **Stock Warnings (`stockWarn`) is NOT touched here.** It stays on the monthly rebake.
- **Connectors needed:** Notion (read only). No MerchantSpring, no Seller Central, no Sheet.
- **Runs:** Monday, after the weekly AMACX Account Health Review has been written.

---

## STEP 1 — Read Notion (latest sub-task in each section)

1. **Account Health:** open `AMACX Account Health`
   (https://app.notion.com/p/3e5d3da051228054b583d449b7c849a5), list its **Sub-tasks**, and open the
   most recent one (by the date in the title, e.g. "12 Oct 2026 - AMACX Account Health Review").
2. **Advertising:** open `AMACX Advertising`
   (https://app.notion.com/p/399d3da051228051a0a7cc400c7b774e), list its **Sub-tasks**, and open the
   most recent one. Also read the parent page's **Weekly log** entries from the last 14 days.
3. **What's next:** open `AMACX Monthly SOP`
   (https://app.notion.com/p/349d3da05122803eacc5ee7b997942c7) and read the week block for next week
   (Week 1 = 1st–5th, then Weeks 2–4).

**Preferred source:** if a page has a **"Dashboard (client-facing)"** section, use its lines as they
are written (only reshape them into the item format below). Use the rest of the page only to fill
gaps. Without that section, write the items yourself from the page, following the wording rules.

If the latest Account Health sub-task is more than 10 days old, don't bake anything. Report
"Account Health Review is stale ([date]); cards not updated".

## STEP 2 — Build the two specs

Item shape (same as Stock Warnings): `{level, title, sub}`.

| level | meaning | `sub` starts with |
|---|---|---|
| `red` | open issue: account at risk, money at risk, past due | `In progress · ` |
| `amber` | open issue: below target, being worked on | `In progress · ` |
| `green` | done in the last 30 days | `Done <d Mon> · ` |
| `muted` | next up (SOP week or a not-started task) | `Next up · ` |

- **Order within each card:** red → amber → green → muted. Max 8 items per card. Drop the oldest
  green items first.
- **`healthMgmtSpec`:** from the review's Verdict, "Still open", "Resolved" and Recommendations.
  `badge` = `'<n> open'` (red + amber count). `subLabel` = `'Weekly review · <review date>'`.
- **`adsStrategySpec`:** from the advertising sub-task status and the Weekly log "Done" lines, plus
  the next SOP advertising items. `badge` = a 2–3 word headline (e.g. `'Cherry Juice+ live'`).
  `subLabel` = `'Weekly review · <latest log date>'`.

**Wording rules (client-facing; this is shown to AMACX):**
- One market per item, in the title: `Italy — …`, `Spain — …`. Never combine markets in one item.
- Plain outcome language. Never include internal notes: no "UNACTIONED", "escalate", "HOLD",
  "needs Ryan", run numbers, tool or permission errors, Perpetua or MerchantSpring mechanics, staff
  names, or blame.
- Keep exact numbers from Notion, with the target where there is one (e.g. `81.82% (18 of 22) vs 90% target`).
- Never invent a number. If Notion doesn't state it, leave it out.
- Stock: say "stock-up", never "order" or "reorder".
- Escape single quotes for the JS string literal.

## STEP 3 — Write, check, commit

1. Replace only the `healthMgmtSpec: {…}` and `adsStrategySpec: {…}` blocks in
   `clients/amacx/data.js`. Update the source comment above them with the Notion page titles used.
2. Bump `APP_VER` in `index.html` to today's date (cache-buster; see CLAUDE.md).
3. Checks, which must all pass:
   - `node --check clients/amacx/data.js`
   - `grep -niE 'order this week|order soon|order now|reorder' clients/amacx/data.js` returns nothing new
   - No item mentions NLD or Netherlands as live
4. Commit on a new branch `amacx-overview-<YYYY-MM-DD>` and open a PR titled
   `AMACX overview cards — week of <date>`. In the PR body, list every item, grouped by card.
   **Do not merge.** Ryan or Solei approves the merge, and nothing reaches the client before that.
5. Report the PR link and a 3-line summary: open count, done count, and anything skipped (with why).
