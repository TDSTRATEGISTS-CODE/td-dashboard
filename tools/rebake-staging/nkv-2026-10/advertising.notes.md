# NKV advertising bake — October 2026 (notes)

Source: MerchantSpring `generateReport` type `campaigns`, tz Europe/London, one pull per window, CSVs in scratchpad/csv/ (uk_*.csv GBP, us_*.csv USD). One row per campaign (no daily rows). Pulled 2026-11-01.
Windows: may=1 Oct–31 Oct 2026; 3m=1 Aug–31 Oct; 6m=1 May–31 Oct; 12m=1 Nov 2025–31 Oct 2026.
Metrics: Spend/Sales = sum cost/attributed_sales; ACOS = spend/sales; CPC = cost/clicks; Impressions summed; NTB = sum attributed_orders_ntb / sum attributed_conversions.

| Window | Mkt | Ad spend | Ad sales | ACOS | CPC | Impressions | NTB | Campaigns | Mix sum |
|---|---|---|---|---|---|---|---|---|---|
| may | UK | 2142.87 | 4522.55 | 47.38% | 0.6533 | 730803 | NTB orders 7.27% / NTB sales 9.28% | 35 | mixsum 100.0 |
| may | US (USD) | 13.71 | 0.00 | | | | | 4 | |
| 3m | UK | 7713.99 | 16164.81 | 47.72% | 0.6789 | 3093975 | NTB orders 9.39% / NTB sales 10.56% | 41 | mixsum 100.0 |
| 3m | US (USD) | 263.39 | 129.87 | | | | | 5 | |
| 6m | UK | 16473.27 | 35655.17 | 46.20% | 0.7512 | 6810215 | NTB orders 9.22% / NTB sales 10.71% | 48 | mixsum 100.1 |
| 6m | US (USD) | 396.12 | 199.82 | | | | | 5 | |
| 12m | UK | 33664.01 | 85916.51 | 39.18% | 0.7704 | 12414822 | NTB orders 7.99% / NTB sales 9.23% | 55 | mixsum 100.0 |
| 12m | US (USD) | 396.12 | 199.82 | | | | | 5 | |

US figures are USD in the CSV. getAdvertisingByChannels (reports in GBP) for NKV USA Oct 2026: spend 10.24, ad sales 0.00 (= $13.71 / $0 at MS rate); Sep 2026: spend 183.76, ad sales 97.01 (matches baked £193/£101 only roughly: baked Sep US was £193 spend / £101 sales, so the API's GBP figures differ slightly - rate/revision). Use USD CSV totals x the file's static $->£ rate for headline, or the API GBP figures; [TO CONFIRM] which the headline agent uses. US 6m and 12m are identical ($396.12 / $199.82), i.e. US ads only began Aug 2026.

## Reconciliation
- UK Oct, campaigns report AND getAdvertisingByChannels agree exactly: spend £2,142.87, ad sales £4,522.55, ACOS 47.38%, 730,805 impressions (CSV 730,803), NTB orders 7.27% / NTB sales 9.28%.
- Known UK Oct monthly bucket (£2,048.35 / £4,288.70) is LOWER by £94.52 (4.6%) spend and £233.85 (5.5%) ad sales. Two independent MS sources agree with the report, so the bucket looks stale/partial (late attribution; the Sep prior-period also shifted by ~£4/£34 on re-pull). Recommend headline uses £2,142.87 / £4,522.55; flag to Ryan. Not a doubling-bug case (ratio is not 2x).
- MS getAdvertisingByChannels Oct TACOS 18.80% (MS own sales basis) - headline agent to compute from its revenue.

## Judgement calls to confirm
- NTB %: used order-based (orders_ntb/conversions) = 7.27% Oct. Sales-based is 9.28% Oct (3m 10.56, 6m 10.71, 12m 9.23). Prior bake's basis unknown (Sep baked 8.7%) - [TO CONFIRM]; swap if needed.
- acosCls bands inferred from existing file: bg <30, ba 30-~55, br >=~55 (existing max ba 52.4, min br 62.8). I used 60 as the ba/br cut; no campaign in the top 13 sits between 52 and 62 except check lines near the cut.
- ACOS tile colour kept 'amber', NTB 'green', as in existing blocks.
- Campaign names derived by stripping XCTD/TDS/id tokens ("Focus keywords — SP KB_0 Manual" is a new campaign; eyeball names). Status = campaign_status in report (enabled->Active, paused->Paused) = current state.
- Mix pct = share of ad sales by ad_type; may window SD ~0% (rounded). 6m pcts sum 100.1 (rounding).
- Budgets/forecast: Account Tracker (Drive id 15h_Eo36PhnyX-a4cOlo6yvyhLwS2U9BDbz1fcnruwE4) read returned only sample rows, no Marketing Metrics row - £3,000 budget / £3,500 forecast carried forward [TO CONFIRM]. Forecast months rolled to Nov/Dec.
- Nothing in the repo was edited.
