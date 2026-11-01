# NKV October 2026 re-bake: Shopify + Amazon P&L notes (pulled 2026-11-01)

Output: scratchpad/out/shopify-pnl.js (paste-ready). data.js, config.js, index.html NOT edited; no commit.

## Headline: Shopify (Contours Rx, inc. VAT)
- Oct 2026 net sales £1,340.79 vs Sep £1,498.71 = -10.5% MoM (MerchantSpring getSalesByPeriod, ch 33616599, GMT, interval M, includeTax:true).
- Orders 44 vs 48 (-8.3%); units 47 vs 52; AOV £30.47 vs £31.22; ASP £28.53.
- 12m monthly sum £29,601.03 (Nov 25-Oct 26); 6m £14,343.94; 3m £6,758.75.
- Per-product sales sum exactly to period totals for may/3m/6m/12m (units too: 47/241/528/1,113).

## Sources / periods
- 'may' = Oct 2026; 3m = Aug-Oct; 6m = May-Oct; 12m = Nov 2025-Oct 2026. Epochs computed with `date -u` (GMT), not calculateDateEpoch.
- Orders = lineItemCount (matches how Sep 48 was baked). Per-product 'orders' remain '—'.
- GA4 (Reporting Ninja, custom date ranges): Contours Rx Oct sessions 1,251, carts 47, checkouts 39, purchases 31 (CVR 2.48%).
  Newnique Oct: 90 sessions, 11 carts, 3 checkouts, 1 purchase. Traffic top channels from sessionDefaultChannelGroup (Oct).
- Amazon P&L: getStoreProfitAndLoss, UK ch 71662311, 1-31 Oct, profitabilityView 'accrual' (same basis as Sep).

## Unavailable / judgement calls
- Returning Cust. = '—' for all four periods: GA4 totalPurchasers and firstTimePurchasers identical (30/30 Oct; 142/142, 296/296, 636/636 on wider windows) - internally inconsistent, not baked.
- Newnique order-side left 'pending Executive integration' (unchanged); chart null, stock [].
- Newnique traffic: I included 'Unassigned' (6) as 4th row because Sep's 4th/AI rows were only 1 session in Oct; swap if you prefer to omit.
- Shopify 'all' block is derived from contoursrx in data.js, no change needed.

## [TO CONFIRM]
1. Stock snapshot jump: Lids on-hand 2,809 units (7 variants, all in stock) vs 739 in the 4 Oct snapshot; serum 163 (was 82), B5 92 (was 46), Dermal 11 (was 0). Looks like restock or an inventory-sync change - verify in Shopify before client sees it. Cover for Lids (~1,793 days) = 2,809 / 47 Oct units x 30; effectively non-informative. Dermal Blade moved from red 'OOS' to green.
2. P&L: MerchantSpring returns no tax line, so 'Product sales' £9,445 is derived (net revenue less other income lines) like Sep. Rows foot to £9,127 vs £9,128 total (rounding).
3. P&L Reimbursements returned NEGATIVE (-£22.53); Sep was a positive £142. Baked as returned; check sign.
4. P&L ad spend £2,031.32 vs campaigns/getSalesByPeriod UK Oct ad spend £2,048.35 (difference £17.03). The Advertising section should use the campaigns report; this block uses the P&L figure.
5. P&L per-unit basis: used 471 UK units (getSalesByPeriod Oct). Sep's per-unit implied ~443 units vs 448 in the same feed today, so the original basis is unclear.
6. TACOS 18.1% = P&L ad spend / gross sales £11,246.58 (same method as Sep 23.3%). getSalesByPeriod shows 18.0%.
7. Profit colour 'amber' for 16.2% mirrors Sep (9.6% amber); no documented threshold.

## Amazon P&L Oct 2026 (UK, accrual) vs Sep
- Net revenue £9,128 (Sep £9,608, -5.0%); total costs £7,652; net profit £1,476 (16.2%) vs Sep £919 (9.6%).
- COGS £3,040; selling fees £1,599; shipping £975; ads £2,031 (Sep £2,796).

## Other
- Sep Shopify revenue baked as £1,499 and MoM deltas use the baked Sep figures (sessions 1,121). GA4 Aug+Sep re-pull differs by 2 sessions from earlier bake (immaterial).
- Update the sections.shopify header comment (Oct decline -10.5%, Google Ads status unknown [TO CONFIRM] - Cross-network sessions rose to 646 from 474, so the Sep 'paused' narrative no longer applies).
- shopifypnl untouched.
