# NKV monthly re-bake — July 2026 — BLOCKED at self-check gate

Run: 2026-08-01 (scheduled Routine, `tools/nkv-monthly-rebake.prompt.md`). Target month: **July 2026**
(latest fully-closed calendar month). `data.js` / `config.js` / `index.html` were **not modified** —
publishing was withheld per the self-check gate in the runbook
(README → "Refreshing NKV" → "Monthly re-bake routine (agent runbook)", step 11).

## What failed

Step 1 of the runbook (`dateRanges` + `marketKpis`) needs the trailing **12-month** UK actuals
(Aug 2025 → Jul 2026). MerchantSpring's `getSalesByPeriod` cannot return a usable value for
**October 2025** on the UK channel (`71662311`):

- Requested as part of a 3-, 5-, or multi-month bucketed range → the Oct 2025 bucket is silently
  **omitted** (the response jumps Sep → Nov, or the whole request collapses to one merged bucket).
- Requested as a **standalone month** (2025-10-01 → 2025-10-31) → it comes back with
  **`sales: "0.00"`** while `adSpend: "2716.58"`, `adSales: "6140.49"`, `impressions: 771631`,
  `totalSessions: 7878` are all non-zero for the same window. Ad-attributed sales (£6,140) can't
  exceed total store sales (£0) — that's internally inconsistent, not a legitimately quiet month.

This is a genuine upstream data gap, not a query mistake — I re-tried it four ways (see below) and
every framing agrees Oct 2025 is broken for this channel. Per the runbook's self-check gate
("If missing, do not guess or fabricate numbers"), I stopped rather than estimate Oct 2025 or ship a
12-month total that's silently short one month's revenue.

I also hit (and worked around) a separate, reproducible bug: whenever a requested month lands as the
**first** bucket of a multi-month `interval:'M'` breakdown, its `adSpend`/`adSales`/`tacos`/`acos`
fields come back **exactly doubled** (confirmed on May 2026 and Sep 2025 — each matches its clean,
non-first-bucket value × 2 to the penny). `sales`/`unitsSold`/`lineItemCount` are unaffected. All
figures below are taken from a position where the month was *not* first-in-request, or cross-checked
against `getAdvertisingByChannels` (which is capped at 30-day windows so doesn't have this bug).

## What's validated and ready to bake (once Oct 2025 is fixed, or someone approves a documented gap)

**UK (channel `71662311`, merchant `A1SNRD9T28Z9ZM @ A1F83G8C2ARO7P`), all £ / GBP:**

| Month | Sales | Ad spend | Ad sales | Units | Orders |
|---|---|---|---|---|---|
| Aug 2025 | 11,814.78 | 2,438.77 | 5,729.71 | 510 | 485 |
| Sep 2025 | 12,934.03 | 2,018.06 | 6,257.65 | 463 | 433 |
| **Oct 2025** | **unavailable** | — | — | — | — |
| Nov 2025 | 15,090.64 | 3,356.29 | 8,714.23 | 576 | 544 |
| Dec 2025 | 14,719.01 | 2,068.72 | 6,578.83 | 560 | 515 |
| Jan 2026 | 15,797.55 | 3,241.42 | 9,756.69 | 648 | 610 |
| Feb 2026 | 14,104.01 | 2,960.41 | 8,646.17 | 551 | 524 |
| Mar 2026 | 17,457.85 | 3,249.78 | 9,813.24 | 616 | 577 |
| Apr 2026 | 12,838.69 | 2,393.99 | 6,993.82 | 459 | 425 |
| May 2026 | 15,290.10 | 3,241.15 | 7,717.79 | 584 | 551 |
| Jun 2026 | 14,078.97 | 2,932.37 | 6,044.38 | 554 | 508 |
| **Jul 2026** | **13,290.41** | **2,506.43** | **5,470.71** | **530** | **491** |

July 2026 headline (cross-checked against `getAdvertisingByChannels` store row "NKV Beauty", which
agrees closely: adSales £5,615.47, spend £2,569.27, TACOS 19.33%, ROAS 2.19×, ACOS 45.75%, 254 orders,
266 units, NTB sales £575.86/10.25% — small drift vs. the channel pull is normal attribution
finalization, same pattern as every prior month here vs. its own eventual "prior month" re-read).

- **3-month (May–Jul 2026)**: sales £42,659.48 · ad spend £8,679.95 · ad sales £19,232.88 ·
  TACOS 20.3% · ROAS 2.22× · units 1,668 · orders 1,550 — fully clean, no Oct dependency.
- **6-month (Feb–Jul 2026)**: sales £87,060.03 · ad spend £17,284.13 · ad sales £44,686.11 ·
  TACOS 19.9% · ROAS 2.59× · units 3,294 · orders 3,076 — fully clean, no Oct dependency.
- **12-month (Aug 2025–Jul 2026)**: **blocked** — 11 of 12 months sum to £147,921.04 / units 6,041 /
  orders 5,663, but that's short exactly one month (Oct 2025) and would understate revenue if baked
  as-is.

**IRL (channel `86715690`) and USA (channel `109142957`)** pulled cleanly for all of May–Jul 2026 (no
Oct dependency for the periods that need them) — not blocked, just not baked since the `may` slot
can't ship without a resolved 12m figure and I stopped at the gate rather than partially bake one
market. Quick reference for whoever picks this up: IRL Jul 2026 €416.24 (9 units, 9 orders, no ads);
USA Jul 2026 $915.37 (65 units, 30 orders, ad spend $189.40 / ad sales $139.90 — USA now has real ad
activity, unlike the zeros-placeholder assumption in the current baked `data.js`).

## Not attempted

Steps 2–9 of the runbook (Ad Metrics/campaigns, campaign-type pie, inventory, FBA stock warning,
product-by-brand groups, sheet-baked budgets/forecast/Shopify block) were **not started** — the
runbook treats a self-check failure as a hard stop, and burning more MerchantSpring/Sheet calls into a
run that's already blocked isn't useful.

## Suggested next step

Someone with MerchantSpring access should check why Oct 2025 is desynced for the NKV UK channel
(re-sync / re-pull that month from Amazon), then re-run this routine — the Aug 2025–Sep 2025 and
Nov 2025–Jul 2026 figures above can be reused as-is (all cross-checked, all from non-first-bucket
positions) to save a re-pull.
