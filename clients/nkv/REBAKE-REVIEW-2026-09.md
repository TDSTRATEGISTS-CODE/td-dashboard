# NKV re-bake — September 2026 — NEEDS REVIEW (data.js NOT modified)

Run: 2026-10-01 (scheduled routine). Target month: **September 2026**. No change was made to
`clients/nkv/data.js`, `config.js` or `index.html`; `main` was not touched. Two self-check gates failed,
so the validated pulls below are parked here for a human decision.

## Gates that failed
1. **Shopify (Contours Rx) net sales −67.5% MoM** — £3,919 (Aug) → **£1,273.01** (Sep, 30 daily buckets,
   `includeTax:false`). Over the 60% limit. Context: Aug was itself an anomalous promo spike (see data.js
   header); vs Jul (£2,387) Sep is −46.7%. Likely a normalisation, but it needs a human to confirm.
2. **Amazon ROAS outside the ~2–3× sanity band** — total adSales÷adSpend = **1.64×** (UK 1.71×) vs 2.48× in
   Aug. TACOS 23.2% (UK 22.4%) vs 14.9% — above the <20% target. Spend is flat (+7%) while ad sales fell
   31%; the UK campaigns report shows SP ACOS ≈ 59.8%. Real performance drop or tracking issue — unclear.

## Validated Amazon figures (all UK numbers reconcile to the penny: daily-sum sales API vs campaigns report)
| | Sep 2026 | Aug 2026 | Δ |
|---|---|---|---|
| UK revenue | £12,464.14 | £17,964 | −30.6% |
| IE revenue (€249.99 @0.855) | £213.74 | £233 | −8% |
| USA revenue ($252.30 @0.78) | £196.79 | £451 | −56% |
| **Total revenue** | **£12,875** | £18,647 | **−31.0%** |
| UK ad spend / ad sales | £2,794.00 / £4,778.09 | £2,778 / £6,905 | +0.6% / −30.8% |
| USA ad spend / ad sales | $248.67 / $169.83 (£193.96 / £132.47) | £3 / £0 | ads resumed |
| **Total ad spend** | **£2,988** | £2,781 | +7.4% |
| **TACOS / ROAS** | **23.2% / 1.64×** | 14.9% / 2.48× | |
| UK campaign mix (by ad sales) | SP 89.4% (ACOS 59.8%), SB 10.1% (26.7%), SD 0.5% (458.9%) | | |

Notes: `getSalesByPeriod` interval `M` rejects Europe/London; used `d`/`w`. IE ships 5 orders (6 units);
USA 14 order-days with sales. Weekly bucket 27/09–03/10 only had data to 30 Sep (run date 1 Oct).

## Shopify (Contours Rx `33616599`) Sep daily net sales
Sum £1,273.01 over 30 days (orders ≈ 56 line items). GA4 (Reporting Ninja) was **not** pulled — the run was
stopped at the gate before the session-side pull.

## Not done (stopped at gate)
Inventory, stockWarn, groupsByPeriod, `dateRanges.may.yoy`, GA4/Shopify products, 3m/6m rollups.
Campaign reports for 3m (Jul–Sep) and 6m (Apr–Sep) were generated (UK f7bb0910…, 0dd95bad…; US dcf7dc7b…)
but not applied.
