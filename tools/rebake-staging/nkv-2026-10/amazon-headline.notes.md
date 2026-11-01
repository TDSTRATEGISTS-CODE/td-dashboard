# NKV Amazon headline re-bake, October 2026 (notes for amazon-headline.js)

Pulled 2026-11-01. Nothing in the repo was edited; the snippets are paste-ready only.

## Sources
- Monthly actuals, all three markets: MerchantSpring `getSalesByPeriod`, `interval:'M'`, `timezone:'GMT'`, `includeTax:true`.
  - Window Sep 2025 to Oct 2026 (epochs 1756684800 to 1793491199), so Sep 2025 is the first bucket and is discarded.
  - Every month used is a non-first bucket, so the doubling bug does not apply.
  - Channels: UK 71662311, IE 86715690, US 109142957.
- Oct 2026 UK: sales £11,397.52, units 471, orders 441, ad spend £2,048.35, ad sales £4,288.70, sessions 5,282, session conversion 8.8%.
- Oct 2026 IE: €122.96, 3 orders. At 0.855 that is £105.13.
- Oct 2026 US: $126.93, 10 orders, ad spend $13.71, ad sales $0. At 0.78 that is £99.01 revenue and £10.69 spend.
- Sep 2026 (settled), used as the MoM basis:
  - UK: £12,315.29, 419 orders, spend £2,799.84, ad sales £4,823.80.
  - IE: €249.99.
  - US: $252.30, spend $246.02, ad sales $129.87.
  - Total: £12,725.83 revenue, £2,991.74 spend, £4,925.10 ad sales.
- Aug 2026 total of £18,552 reproduces the old "vs £18,552 Aug" figure, so the conversion method matches the existing file.
- Windows:
  - 3m = Aug to Oct 2026.
  - 6m = May to Oct 2026.
  - 12m = Nov 2025 to Oct 2026.
  - All are sums of the monthly buckets. IE and US are converted at 0.855 and 0.78 after summing.
- yoy: UK `getSalesByPeriod`, `interval:'w'`, 1 to 31 Oct 2025, five weekly buckets summed.
  - Base is £14,080.68 sales, £2,716.58 spend, £6,140.49 ad sales, and the weekly sum equals the monthly bucket to the penny.
  - Total base is UK plus IE €75.18 × 0.855 = £14,144.96. Spend and ad sales have no IE or US base.
  - Per-market yoy for UK only. IRL's base is €75.18, too thin. USA had zero sales in Oct 2025.

## Reconciliation
- UK Oct ad figures against a campaigns pull (`getAdvertisingCampaigns`, 1 to 31 Oct, 35 campaigns, returned in USD):
  - The campaign sum is $2,741.78 spend and $5,740.56 sales. At the implied 0.747 rate that is £2,048.11 and £4,288.20.
  - Monthly bucket is £2,048.35 and £4,288.70, so they match within 0.02%.
  - The campaign total was summed from the 33 rows shown in the response; the pagination count says 35 [TO CONFIRM that the two rows not seen are negligible]. The match leaves no room for a material gap.
- Gap to flag: `getAdvertisingByChannels` for NKV Beauty UK (GMT, Oct) returns spend £2,142.87 and ad sales £4,522.55.
  - That is +4.6% spend and +5.4% ad sales against the bucket and the campaigns pull.
  - Its Sep comparison (£2,792.72 / £4,753.88) is within 0.3% of the Sep bucket.
  - US via ByChannels agrees with the US bucket: £10.24 at the MS rate against $13.71.
  - I baked the bucket and campaigns figures because two sources agree. Reason for the ByChannels difference [TO CONFIRM]. It may be late-attributed days or a different cut-off.
  - On ByChannels numbers UK TACOS would be 18.8% and ROAS 2.11×, not 18.0% and 2.09×. It does not change the picture.
- 12m cross-check: the same buckets for Oct 2025 to Sep 2026 give UK £176,764 revenue, £34,332 spend and £87,768 ad sales.
  - The previous bake had £176,879, £34,299 and £87,786, within 0.1%. This supports the bucket method, including the earlier campaigns-report figures.
- US tiny base: Oct ad sales are £0, so ROAS shows '0.00×' and TACOS is 10.8% on £99 of sales. Tagged "small sample".

## Judgement calls and changes to be aware of
1. **Sep restated.** The file currently bakes Sep UK £12,430 and total £12,841. The settled Sep is £12,315 UK and £12,726 total, down 0.9%.
   - All MoM deltas and `revS`/`spendS` strings use the settled Sep.
   - `sections.charts` Sep is restated to rev 12315, spend 2800 and TACOS 22.7 (was 12430 / 2796 / 22.5). US Sep spend is 192 (was 193) and TACOS 97.5 (was 98.0).
   - Say so in the data.js header comment, as the Sep run did for Jul/Aug.
   - May to Aug chart values are carried as baked. Jul spend stays 2593 against a bucket of 2592.49.
2. **Colour codes.** I inferred the convention from the Sep entries: `du` = favourable and `df` = unfavourable or muted.
   - A fall in spend or TACOS is `du`. A fall in revenue, ad sales, ROAS or AOV is `df`.
   - Sep marked a spend rise `df`, but no Sep example shows a spend fall [TO CONFIRM the spend-down colour]. The 3m/6m/12m blocks keep the existing static `du`/`df` pattern.
3. **mktRows TACOS class.** `ba` for 20% or below, `br` above 20%, `bb` for "—". This is inferred from the previous bakes (14.9% to 18.8% are `ba`, 22.5% and above are `br`).
4. **USA mktRows note.** I wrote "Ads near-paused Oct" (spend $13.71) in place of "Ads resumed Sep". The wording is yours to choose.
5. **Ad metrics source.** 3m/6m/12m ad spend and ad sales are monthly-bucket sums, not the per-window campaigns reports used last time.
   - The 12m cross-check above is within 0.1%. If you want strict parity, re-pull campaigns per window and change only the spend and ad sales numbers.
   - **Not covered by these snippets:** `campaignMix`, `sec.advertising.metrics` and `campaigns` for each period. These need the campaigns-report workstream.
   - `sec.advertising.metrics` and `campaigns` carry their own ad numbers (for example Total Spend). They must agree with this file's UK spend and ad sales per window.
6. **`aovD`.** The total AOV uses revenue ÷ orders in £ across markets, as in Sep.
7. **Month label strings.** 3m 'Aug–Oct 2026', 6m 'May–Oct 2026 (6 months)' / 'May–Oct 2026', 12m shortLabel 'Nov 2025–Oct 2026'. The `12m` `label` stays 'Last 12 Months'.
8. The Sep `yoy` UK `spendS` etc. use the same format. The yoy `tacosD` uses 'vs Oct 2025', following the Sep pattern.

## Also needed elsewhere (not in these snippets)
- `data.js` header comment (pulled date, Oct, 3m/6m/12m ranges). The chart comment block should also be updated.
- Other `data.js` sections (products tiles/table/groups, inventory, P&L, Shopify). The `products.kpisByPeriod` `may`/`3m`/`6m`/`12m` UK rev/units/orders/AOV can be taken from the same pull: Oct UK 471 units, 441 orders, £11,397.52, ASP £24.20 (rev ÷ units). Session CVR (Oct 8.8%) is the market-level figure, not the per-product one.
- `config.js` `reportPeriodLabel` and the `index.html` `APP_VER` bump (not done, per the brief).
