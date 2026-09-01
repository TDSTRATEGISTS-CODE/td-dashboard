# NKV monthly re-bake — August 2026 — NEEDS REVIEW at self-check gate

Run: 2026-09-01 (scheduled Routine, `tools/nkv-monthly-rebake.prompt.md`). Target month: **August 2026**
(latest fully-closed calendar month). `clients/nkv/data.js` / `index.html` / `clients/nkv/config.js`
**were modified and committed to this branch**, but per the runbook's self-check gate
(README → "Refreshing NKV" → "Monthly re-bake routine (agent runbook)", step 13's gate) the result was
**not pushed to `main`** — it needs a human look before it goes live.

## What tripped the gate

Self-check #4 ("no single headline metric swinging >60% MoM without an obvious cause"): pulling
**Contours Rx Shopify order-side** data for August (channel `33616599`) to re-bake `sections.shopify`
showed Net Sales jumping **£2,387 (Jul) → £3,919 (Aug), +64.2% MoM** — over the threshold.

Digging in: orders also jumped in the same proportion (84 → 139, +65.5%) and AOV held flat (£28.42 →
£28.20), so this isn't a single huge/duplicated order skewing the total — it's a real volume increase.
But **3 Aug 2026** alone was £610.40 (vs a typical day of £80–200 for this store), and the **same date**
shows an equally anomalous spike on the Amazon UK channel (£2,904.72 vs a typical day of £300–800,
86 line items vs 10–25 on other days) — both with matching elevated session counts, not just an
attribution quirk. Take that one day out and Shopify's MoM growth is a more ordinary +38.6%.

Two readings are both plausible from the data alone:
1. **A genuine one-off cross-channel event on 3 Aug** (a promo, a press/influencer mention, a coupon
   code) that lifted both storefronts the same day — real, just unusually concentrated.
2. **Something narrower to that one date** in how MerchantSpring attributed or bucketed orders across
   channels — nothing else in this run's validation caught a problem, but a single day driving most of
   a 64% swing is exactly the "plausible but wrong" shape the gate exists to catch.

I can't distinguish these from MerchantSpring data alone (no access to the Shopify/Seller Central admin
to check actual order timestamps or a marketing calendar for that date) — this needs a human who can
either confirm a promo ran on 3 Aug or spot-check that day's raw orders.

## What's validated and already committed on this branch

**Amazon UK/IRL/USA — `dateRanges.may/3m/6m`, `sections.charts`, `sections.advertising`
(metrics/campaignMix/campaigns for may/3m/6m)** — all real August 2026 actuals, cross-checked two ways:

- `getSalesByPeriod`'s **monthly**-interval bucket returned `sales: "0.00"` alongside real non-zero
  `adSpend`/`adSales`/`impressions` for **every month tried** (Jul and Aug alike) — the same failure
  pattern already documented for Oct 2025, just not confined to one month right now. **Daily**-interval
  single-month pulls (≤31 days) came back clean every time; multi-month daily pulls (92/184/365 days in
  one request) silently corrupted 50–80% of days back to the same £0-sales pattern. So every actual below
  is a sum of individual single-month daily-bucket pulls, not a single wide-range request.
- Every UK month reconstructed this way for the trailing 6 months lands on the **previously-published**
  figure to the penny or within ~1%: **May 2026 £15,290.10** (exact match), **Apr 2026 £12,838.69** (exact
  match), **Mar 2026 £17,457.85** (exact match), **Jun 2026 £14,078.97** (exact match to the "vs £14,079
  Jun" reference already baked in the July run). IRL/USA months matched the last bake exactly too (e.g.
  IRL Jul €416.24, USA Jul $915.37 — both exact).
- Ad figures (spend/ad sales, all periods) additionally cross-check to the penny against a generated
  `campaigns` report for the same window (a completely separate MerchantSpring code path).

| | Aug 2026 (`may`) | vs Jul 2026 | 3-mo (Jun–Aug) | 6-mo (Mar–Aug) |
|---|---|---|---|---|
| Revenue (all 3 markets) | £18,669 | ▲ 31.5% | £47,807 | £94,608 |
| Ad spend | £2,779 | ▲ 5.2% | £8,438 | £17,203 |
| Ad sales | £6,855 | ▲ 19.7% | £18,763 | £42,965 |
| TACOS | 14.9% | ▼ 3.7pp | 17.6% | 18.2% |
| ROAS | 2.47× | ▲ 0.30× | 2.22× | 2.50× |

UK Aug also has one anomalous day driving a chunk of its growth — **3 Aug 2026: £2,904.72** vs a typical
day of £300–800 (86 line items, 88 units) — the same date as the Shopify spike above. Total revenue
growth (+31.5% at the whole-company level, +37.1% UK-only) stayed under the 60% gate threshold even with
that day included, so it didn't block Amazon on its own — but it's the same underlying event, which is
part of why I'd rather a human confirm the cause once than have this routine guess.

## Not attempted this run

- **`12m`** — not updated (still the prior bake). This is now solvable in principle (the campaigns report
  covers Oct 2025 fine, unlike `getSalesByPeriod`), but reconstructing a full trailing 12 months via the
  validated single-month-at-a-time method above needs 10 more monthly pulls per market than fit in this
  run alongside everything else — left as a clearly-flagged carry-forward rather than guessed.
- **`sections.inventory` (IRL/USA current snapshot) and `sections.products.groupsByPeriod`** — not
  re-pulled; both need substantially more `getSalesByProduct` calls (per-market, per-window) than this
  run had budget for after the above. Carried forward from the last real bake.
- **`sections.shopify`** (order-side rest of the pipeline, GA4 session-side, funnel, product mix, chart)
  — not touched beyond the one order-side pull that surfaced the gate trip above, so the page still shows
  July's data. Newnique's Shopify order-side remains "pending Executive integration" as before.
- **`sections.advertising.budgets`/`forecast`** — sheet-baked; no Google Sheet connector was attached to
  this routine, so these are unchanged from the last sheet read (same treatment as prior runs).

## Suggested next step

A human: (1) check whether an NKV promo/press mention ran on 3 Aug 2026 across both Amazon UK and the
Contours Rx Shopify store, or spot-check that day's raw orders in Seller Central / Shopify admin for
anything that looks duplicated or misattributed; (2) if it's confirmed real, this is safe to merge as-is
and re-run (or hand-finish) `sections.shopify`, `12m`, inventory and product groups before the *next*
scheduled run rather than blocking this one further.
