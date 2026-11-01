# NKV Oct 2026 re-bake: inventory + products notes (pulled 2026-11-01)

Source: MerchantSpring MCP. Windows (Europe/London epochs; reports bucketed GMT): may = 1 Oct-31 Oct 2026, 3m = Aug-Oct, 6m = May-Oct, 12m = Nov 2025-Oct 2026. includeTax:true. Nothing applied to data.js.

## Inventory (current snapshot 2026-11-01, getSalesByProduct includeNoInventory:true)
- IE (86715690): 25 listings, 23 in stock, 2 OOS (B099KVFGZP since 28 Sep; B09QRJ4Y44 since 30 Apr). 1,088 units on hand. Only 3 SKUs sold in Oct (B07Y2P3THB 8mm, B08MJ1PSXN 4mm, B0FYR8DQ2G Assortment). MS daysCover for those >1,100.
- IE change vs Sep: Lids 2-Pack 6mm (B0C12KT8L6) now has 7 units (was OOS since 3 Oct) so is no longer OOS. Other 2-pack lines are low (7-21 units) but not selling; not flagged. [TO CONFIRM] whether a stock-up note for the 2-pack range is wanted.
- US (109142957): 4 ASINs, all in stock, 235 units. Oct sales 11 units (HLP 5, SRE 3, HGS 3, AHGS 0). MS daysCover 360-610 days. Oct velocity is thin, so cover days are flattering. Rows use "ample" rather than a day figure.
- Wording: "stock-up" only. supplierPOs and supplierPOsByMarket untouched. No stockWarn or Overview cards produced.

## Products tiles (UK/IRL/USA)
- UK = getSalesByPeriod interval M, timezone GMT: rev, orders = lineItemCount, units, AOV = rev/orders, ASP = rev/units, CVR = units/sessions summed over the window (reproduces the Sep 3m bake of 8.3%). topRev = Contours Rx product-report sales. sold = SKUs with sales > 0 in window.
- Oct UK £11,397.52 / 471 units / 441 orders matches the known figure exactly.
- IE is EUR native, converted at €1 = £0.855; USA is USD, converted at $1 = £0.78 (the rates stated in the data.js header). [TO CONFIRM] rates.
- Sep UK now reads £12,315 / 448 units / 419 orders in MS against the baked £12,430 / 451 / 421, so settled data has since moved. Not edited here; the Sep-based tiles are being replaced anyway.
- USA Oct: $126.93 -> £99, 11 units, 10 orders (lineItemCount).

## Brand groups (UK) - product report vs channel total
- Gaps: Oct 0.0%, 3m 0.0%, 6m 0.0%, 12m 0.0% (within £1). The GMT-bucketed reports reconcile fully, so the "undercount" caveat in the old comment is no longer true.
- Ad spend is product-level only: Oct £1,941.93 across brands vs channel £2,048.35 (about £106 unallocated or on no-sales rows), so TACOS is a floor.
- Brand mapping: "Newnique." (with the full stop) is the MS brand name. No brand lines missing from the existing six.
- New brand line: "While and Wonder" (Tummy Time Water Play Mat, B09YZTV15Z) appears in the 12m window only: £729.59, 41 units, last sold 24 Jan 2026, zero stock. Added as a 12m row (CVR 6.8%, TACOS 0.0%, share rounds to 0%). [TO CONFIRM] whether Ryan wants this unrelated line shown or folded out.
- Girlactik: no Oct sales (Pure Black OOS since 28 Sep), so the Oct row is £0 with '—' TACOS and CVR (class 'bb'). 3m CVR '—' (34 sessions, 44% is not credible). 6m 22.1% on 367 sessions kept, in line with the 16-22% seen before. 12m 10.2%.
- Girlactik 12m is now £6,981 against £4,060 in the Sep bake. The window moved (Nov 25 start) and the earlier bake had an undercount; the old reports were not GMT-bucketed. Worth a sanity look.
- Oct CVR by brand (ordered units / sessions): Contours Rx 11.2% (2,175 sessions), Newnique 7.1% (958), White Luxe 5.6% (675), Lilibeth 18.3% (507), Hydrte 2.4% (966). Total UK 8.8% in the product report.

## Per-window sessions / ordered units used for CVR (from trafficAndConversion skus CSV)
See the gen output: Oct total 5,281 sessions; 3m 18,991; 6m 36,504; 12m 79,357 (report totals vs channel sessions Oct 5,282).

## usaGroups()
The old function hardcodes Sep's £193 / 98.1% for 'may'. Replaced in the .js with Oct: ad spend $13.71 -> £11, TACOS 10.8% (13.71/126.93, class 'bg'). 3m/6m/12m stay '—' (no per-month US ad breakdown; also note the 12m USA tile equals 6m as the market started in June).

## Not done / caveats
- IE group split (irlGroups) is still the allocated 12-mo brand mix (82/10/8), unchanged in code. [TO CONFIRM] refresh of that mix from IE 12m product data.
- Active SKUs tile values (73 UK, 12 IRL, 4 USA) are hard-coded in the script and were not re-checked.
