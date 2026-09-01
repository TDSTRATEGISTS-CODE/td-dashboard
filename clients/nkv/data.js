/* NKV Beauty — client data (window.DASHBOARD_DATA).
   ⚠️ NEEDS REVIEW — this run (1 Sep 2026 scheduled Routine, target month August 2026) hit the
   self-check gate and was NOT published to main. See clients/nkv/REBAKE-BLOCKED-2026-08.md for the
   full run log: what's validated below, what tripped the gate (Shopify Contours Rx Net Sales swung
   +64.2% MoM, £2,387→£3,919, driven mostly by one anomalous day that spiked on both Amazon and
   Shopify at once — plausible one-off promo, but not something this routine should wave through
   unreviewed), and what a human should check before merging.
   ACTUALS: MerchantSpring MCP, pulled 1 Sep 2026 (channel 71662311, seller A1SNRD9T28Z9ZM), native GBP.
   UK is the live market (real data). Ireland is early-stage and EUR-native — its £ figures are the
   actual €-sales converted at €1 ≈ £0.855. USA now has real ad spend as well as sales (from June 2026) —
   converted from USD at $1 ≈ £0.78.
   'may'/'3m'/'6m' (headline KPIs, sections.charts, sections.advertising campaigns/campaignMix) are
   re-baked for August 2026 — validated: getSalesByPeriod's monthly-interval bucket returns £0 sales
   with real non-zero ad spend for this account right now (the same failure mode as the documented Oct
   2025 gap, just broader), so every actual below was rebuilt from single-month daily-interval sums
   (the one request shape that stayed clean — 92/184/365-day pulls corrupted 50–80% of days) and
   cross-checked to the penny against a generated 'campaigns' report for ad figures, and against three
   independently-reconstructed prior months (Mar/Apr/May 2026 UK, IRL/USA every month) that landed
   exactly on the last bake's published numbers. '12m' and sections.inventory/products.groupsByPeriod
   are NOT updated this run — rebuilding trailing-12m properly (now solvable — the campaigns report
   covers Oct 2025 fine) and per-brand product groups both need many more per-month pulls than fit in
   this run; carried forward from the last real bake rather than guessed. sections.shopify (order-side
   + GA4) was NOT re-baked — see the gate note above. sections.advertising.budgets/forecast unchanged
   (sheet-baked; no Google Sheet connector attached to this routine).
   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables/P&L here
   are all in £, but the two trend-chart Y-axes will display '€' until the template adds a currency option.
   dataSource.type is 'static' (no Sheet/Apps Script proxy for NKV yet). */
window.DASHBOARD_DATA = {
  dateRanges: {
  'may': {
    label: 'August 2026', shortLabel: 'August 2026',
    rev: '£18,669', revD: '▲ 31.5% MoM', revC: 'du', revS: 'vs £14,192 Jul',
    adSales: '£6,855', adSalesD: '▲ 19.7% MoM', adSalesC: 'du', adSalesS: '36.7% of revenue',
    tacos: '14.9%', tacosD: '▼ 3.7pp vs Jul', tacosC: 'du', tacosS: 'Target <20%',
    roas: '2.47×', roasD: '▲ 0.30× vs Jul', roasC: 'du', roasS: '632 orders · AOV £30.09',
    spend: '£2,779', spendD: '▲ 5.2% MoM', spendC: 'df', spendS: 'vs £2,641 Jul',
    tacosAd: '14.9%', tacosAdD: '▼ 3.7pp vs Jul', tacosAdC: 'du', tacosAdS: 'Target <20%',
    roasAd: '2.47×', roasAdD: '▲ 0.30× vs Jul', roasAdC: 'du', roasAdS: '£18,669 revenue',
    aov: '£30.09', aovD: '▲ £5.02 MoM', aovC: 'du', aovS: '632 orders Aug',
    mktRows: [
      ['UK','gb','—','£2,776','bb','UK ad-managed','£17,986','ba','15.4%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£233','bb','—'],
      ['USA','us','—','£3','bb','Real ad spend now','£451','ba','0.6%'],
      ['Total',null,'—','£2,779','bb','All 3 markets live','£18,669','ba','14.9%']
    ],
    marketKpis: {
      uk: { rev:'£17,986', adSales:'£6,855', tacos:'15.4%', roas:'2.47×', spend:'£2,776', aov:'£29.44', tacosAd:'15.4%', roasAd:'2.47×', revC:'du', adSalesC:'du', tacosC:'du', roasC:'du', spendC:'df', aovC:'du', tacosAdC:'du', roasAdC:'du', tacosS:'Target <20%', roasS:'611 orders · AOV £29.44', roasAdS:'£17,986 revenue', aovD:'▲ £2.37 MoM', aovS:'611 orders Aug', adSalesS:'38.1% of revenue', revD:'▲ 37.1% MoM', revS:'vs £13,122 Jul', spendD:'▲ 8.0% MoM', spendS:'vs £2,569 Jul', tacosD:'▼ 4.1pp vs Jul', tacosAdD:'▼ 4.1pp vs Jul', roasD:'▲ 0.26× vs Jul', roasAdD:'▲ 0.26× vs Jul', adSalesD:'▲ 20.9% MoM' },
      irl: { rev:'£233', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£38.83', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'6 orders', roasAdS:'£233 revenue', aovD:'', aovS:'6 orders Aug', adSalesS:'No ad spend', revD:'▼ 34.6% MoM', revS:'vs £356 Jul', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£451', adSales:'£0', tacos:'0.6%', roas:'0.00×', spend:'£3', aov:'£30.04', tacosAd:'0.6%', roasAd:'0.00×', revC:'df', adSalesC:'df', tacosC:'du', roasC:'df', spendC:'du', aovC:'du', tacosAdC:'du', roasAdC:'df', tacosS:'Target <20%', roasS:'15 orders · AOV £30.04', roasAdS:'£451 revenue', aovD:'', aovS:'15 orders Aug', adSalesS:'No ad sales this month', revD:'▼ 36.9% MoM', revS:'vs £714 Jul', spendD:'▼ 96.0% MoM', spendS:'vs £72 Jul', tacosD:'▼ 9.4pp vs Jul', tacosAdD:'▼ 9.4pp vs Jul', roasD:'▼ 0.76× vs Jul', roasAdD:'▼ 0.76× vs Jul', adSalesD:'▼ 100.0% MoM' }
    },
    // Campaign-type mix — real ad-type sales share + ACOS from the MerchantSpring campaigns report.
    // Every period (may/3m/6m) is pulled from its own campaigns-report window — no estimates. (12m unchanged.)
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:83.6,sales:'£5.7k',acos:'42.1%'}, {name:'Sponsored Brands',color:'#9caf78',pct:15.2,sales:'£1.0k',acos:'28.8%'}, {name:'Sponsored Display',color:'#e8a87c',pct:1.2,sales:'£0.1k',acos:'75.9%'} ] },
  },
  '3m': {
    label: 'Jun–Aug 2026', shortLabel: 'Jun–Aug 2026',
    rev: '£47,807', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£18,763', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '39.3% of revenue',
    tacos: '17.6%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.22×', roasD: '', roasC: 'df', roasS: '',
    spend: '£8,438', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '17.6%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.22×', roasAdD: '', roasAdC: 'df', roasAdS: '£47,807 revenue',
    aov: '£26.66', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£8,334','bb','UK ad-managed','£45,186','ba','18.4%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£812','bb','—'],
      ['USA','us','—','£104','bb','Real ad spend now','£1,808','ba','5.7%'],
      ['Total',null,'—','£8,438','bb','3-month actuals','£47,807','ba','17.6%']
    ],
    marketKpis: {
      uk: { rev:'£45,186', adSales:'£18,709', tacos:'18.4%', roas:'2.24×', spend:'£8,334', aov:'£27.69', tacosAd:'18.4%', roasAd:'2.24×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£45,186 revenue', aovD:'', aovS:'', adSalesS:'41.4% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£812', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£36.93', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£812 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£1,808', adSales:'£55', tacos:'5.7%', roas:'0.53×', spend:'£104', aov:'£13.01', tacosAd:'5.7%', roasAd:'0.53×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£1,808 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'3-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:85.5,sales:'£16.0k',acos:'46.1%'}, {name:'Sponsored Brands',color:'#9caf78',pct:13.7,sales:'£2.6k',acos:'31.9%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.8,sales:'£0.1k',acos:'90.5%'} ] },
    // Period-aware Ad Metrics (3-mo) — all actuals (MerchantSpring channel + generated campaigns report, Jun–Aug).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£8,334',  id:'a-spend'},
      {lbl:'Ad Sales',     val:'£18,709', color:'brand'},
      {lbl:'ACOS',         val:'44.5%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.76'},
      {lbl:'Impressions',  val:'3.26M'},
      {lbl:'New-to-Brand', val:'11.5%',   color:'green'}
    ],
    // Real per-campaign actuals for the 3-mo window (MerchantSpring campaigns report, Jun–Aug 2026,
    // top 13 of 41 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£2,189',sales:'£5,019',acos:'43.6%',acosCls:'ba',roas:'2.29×',cpc:'£1.14',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£1,477',sales:'£2,291',acos:'64.5%',acosCls:'br',roas:'1.55×',cpc:'£0.90',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£744',sales:'£2,518',acos:'29.5%',acosCls:'bg',roas:'3.38×',cpc:'£0.56',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£680',sales:'£1,579',acos:'43.1%',acosCls:'ba',roas:'2.32×',cpc:'£1.01',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£385',sales:'£446',acos:'86.4%',acosCls:'br',roas:'1.16×',cpc:'£0.89',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£299',sales:'£224',acos:'133.6%',acosCls:'br',roas:'0.75×',cpc:'£0.71',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£291',sales:'£439',acos:'66.2%',acosCls:'br',roas:'1.51×',cpc:'£0.42',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£291',sales:'£556',acos:'52.3%',acosCls:'ba',roas:'1.91×',cpc:'£0.31',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£260',sales:'£302',acos:'85.9%',acosCls:'br',roas:'1.16×',cpc:'£0.72',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£243',sales:'£2,792',acos:'8.7%',acosCls:'bg',roas:'11.51×',cpc:'£0.66',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£198',sales:'£359',acos:'55.2%',acosCls:'ba',roas:'1.81×',cpc:'£0.77',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£163',sales:'£669',acos:'24.3%',acosCls:'bg',roas:'4.12×',cpc:'£0.91',status:'Active',statusCls:'bg'},
      {name:'UK · Mixed Re-targeting — SD Remarketing',type:'Sponsored Display',spend:'£133',sales:'£147',acos:'90.5%',acosCls:'br',roas:'1.11×',cpc:'£0.39',status:'Active',statusCls:'bg'}
    ] } },
  },
  '6m': {
    label: 'Mar–Aug 2026 (YTD)', shortLabel: 'Mar–Aug 2026',
    rev: '£94,608', revD: '6-month actuals', revC: 'du', revS: '',
    adSales: '£42,965', adSalesD: '6-month actuals', adSalesC: 'df', adSalesS: '45.4% of revenue',
    tacos: '18.2%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.50×', roasD: '', roasC: 'df', roasS: '',
    spend: '£17,203', spendD: '6-month actuals', spendC: 'df', spendS: '',
    tacosAd: '18.2%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.50×', roasAdD: '', roasAdC: 'df', roasAdS: '£94,608 revenue',
    aov: '£27.57', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£17,099','bb','UK ad-managed','£90,773','ba','18.8%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£2,027','bb','—'],
      ['USA','us','—','£104','bb','Real ad spend now','£1,808','ba','5.7%'],
      ['Total',null,'—','£17,203','bb','6-month actuals','£94,608','ba','18.2%']
    ],
    marketKpis: {
      uk: { rev:'£90,773', adSales:'£42,911', tacos:'18.8%', roas:'2.51×', spend:'£17,099', aov:'£28.07', tacosAd:'18.8%', roasAd:'2.51×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£90,773 revenue', aovD:'', aovS:'', adSalesS:'47.3% of revenue', revD:'6-month actuals', revS:'', spendD:'6-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'6-month actuals' },
      irl: { rev:'£2,027', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£34.36', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£2,027 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£1,808', adSales:'£55', tacos:'5.7%', roas:'0.53×', spend:'£104', aov:'£13.01', tacosAd:'5.7%', roasAd:'0.53×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£1,808 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'6-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:87.3,sales:'£37.5k',acos:'41.3%'}, {name:'Sponsored Brands',color:'#9caf78',pct:12.3,sales:'£5.3k',acos:'27.9%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.3,sales:'£0.1k',acos:'90.5%'} ] },
    // Period-aware Ad Metrics (YTD) — all actuals (MerchantSpring channel + generated campaigns report, Mar–Aug).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£17,099', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£42,911', color:'brand'},
      {lbl:'ACOS',         val:'39.8%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.78'},
      {lbl:'Impressions',  val:'6.76M'},
      {lbl:'New-to-Brand', val:'10.0%',   color:'green'}
    ],
    // Real per-campaign actuals for the YTD window (MerchantSpring campaigns report, Mar–Aug 2026,
    // top 13 of 46 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£4,877',sales:'£12,675',acos:'38.5%',acosCls:'ba',roas:'2.60×',cpc:'£1.03',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£3,428',sales:'£6,151',acos:'55.7%',acosCls:'ba',roas:'1.79×',cpc:'£0.88',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£1,380',sales:'£5,253',acos:'26.3%',acosCls:'bg',roas:'3.81×',cpc:'£0.53',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£1,183',sales:'£3,182',acos:'37.2%',acosCls:'ba',roas:'2.69×',cpc:'£0.89',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£732',sales:'£781',acos:'93.8%',acosCls:'br',roas:'1.07×',cpc:'£0.76',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£658',sales:'£528',acos:'124.7%',acosCls:'br',roas:'0.80×',cpc:'£0.84',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£599',sales:'£1,172',acos:'51.2%',acosCls:'ba',roas:'1.95×',cpc:'£1.05',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£576',sales:'£6,722',acos:'8.6%',acosCls:'bg',roas:'11.66×',cpc:'£0.68',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£322',sales:'£1,314',acos:'24.5%',acosCls:'bg',roas:'4.08×',cpc:'£0.84',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£320',sales:'£684',acos:'46.8%',acosCls:'ba',roas:'2.14×',cpc:'£0.83',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£291',sales:'£439',acos:'66.2%',acosCls:'br',roas:'1.51×',cpc:'£0.42',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£291',sales:'£556',acos:'52.3%',acosCls:'ba',roas:'1.91×',cpc:'£0.31',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£273',sales:'£311',acos:'87.9%',acosCls:'br',roas:'1.14×',cpc:'£0.71',status:'Active',statusCls:'bg'}
    ] } },
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Last 12 Months',
    rev: '£172,886', revD: 'Trailing 12 months', revC: 'du', revS: '12-mo actuals',
    adSales: '£88,487', adSalesD: 'Trailing 12 months', adSalesC: 'df', adSalesS: '51.2% of revenue',
    tacos: '18.9%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.71×', roasD: '', roasC: 'df', roasS: '',
    spend: '£32,682', spendD: 'Trailing 12 months', spendC: 'df', spendS: '',
    tacosAd: '18.9%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.71×', roasAdD: '', roasAdC: 'df', roasAdS: '£172,886 revenue',
    aov: '£27.68', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£32,652','bb','UK ad-managed','£169,164','ba','19.3%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£3,078','bb','—'],
      ['USA','us','—','£29','bb','Launched Jun 2026','£644','ba','4.5%'],
      ['Total',null,'—','£32,682','bb','Trailing 12 months','£172,886','ba','18.9%']
    ],
    marketKpis: {
      uk: { rev:'£169,164', adSales:'£88,487', tacos:'19.3%', roas:'2.71×', spend:'£32,652', aov:'£27.75', tacosAd:'19.3%', roasAd:'2.71×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£169,164 revenue', aovD:'', aovS:'', adSalesS:'52.3% of revenue', revD:'Trailing 12 months', revS:'12-mo actuals', spendD:'Trailing 12 months', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'Trailing 12 months' },
      irl: { rev:'£3,078', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.18', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£3,078 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£644', adSales:'£0', tacos:'4.5%', roas:'0.00×', spend:'£29', aov:'£13.70', tacosAd:'4.5%', roasAd:'0.00×', revC:'du', adSalesC:'df', tacosC:'du', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'du', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£644 revenue', aovD:'', aovS:'', adSalesS:'Attribution pending', revD:'Launched Jun 2026', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:88.6,sales:'£78.4k',acos:'37.3%'}, {name:'Sponsored Brands',color:'#9caf78',pct:11.3,sales:'£10.0k',acos:'33.0%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.1,sales:'£0.1k',acos:'188.7%'} ] },
    // Period-aware Ad Metrics (12-mo) — all actuals from the MerchantSpring campaigns report (Jul 2025–
    // Jun 2026; includes October, which the monthly-sales endpoint glitches but the campaigns report has).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£32,652', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£88,487', color:'brand'},
      {lbl:'ACOS',         val:'36.9%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.83'},
      {lbl:'Impressions',  val:'11.85M'},
      {lbl:'New-to-Brand', val:'8.0%',   color:'green'}
    ],
    // Real per-campaign actuals for the trailing-year window (MerchantSpring campaigns report,
    // Jul 2025–Jun 2026, top 13 of 51 by spend). Follows the date selector; row-filtered by market.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£8,286',sales:'£22,126',acos:'37.5%',acosCls:'ba',roas:'2.67×',cpc:'£0.98',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£6,181',sales:'£12,752',acos:'48.5%',acosCls:'ba',roas:'2.06×',cpc:'£0.91',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£3,121',sales:'£8,166',acos:'38.2%',acosCls:'ba',roas:'2.62×',cpc:'£0.91',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£2,790',sales:'£9,314',acos:'30.0%',acosCls:'ba',roas:'3.34×',cpc:'£0.58',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£2,122',sales:'£4,321',acos:'49.1%',acosCls:'ba',roas:'2.04×',cpc:'£1.03',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£1,517',sales:'£17,930',acos:'8.5%',acosCls:'bg',roas:'11.82×',cpc:'£0.69',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Manual',type:'Sponsored Products',spend:'£1,036',sales:'£2,237',acos:'46.3%',acosCls:'ba',roas:'2.16×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£1,031',sales:'£1,429',acos:'72.2%',acosCls:'br',roas:'1.39×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£889',sales:'£820',acos:'108.5%',acosCls:'br',roas:'0.92×',cpc:'£0.81',status:'Paused',statusCls:'ba'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£539',sales:'£663',acos:'81.3%',acosCls:'br',roas:'1.23×',cpc:'£0.65',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£485',sales:'£1,018',acos:'47.6%',acosCls:'ba',roas:'2.10×',cpc:'£1.10',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£479',sales:'£858',acos:'55.8%',acosCls:'br',roas:'1.79×',cpc:'£0.67',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Auto',type:'Sponsored Products',spend:'£426',sales:'£690',acos:'61.7%',acosCls:'br',roas:'1.62×',cpc:'£0.43',status:'Active',statusCls:'bg'}
    ] } },
  }
  },
  sections: {
    overview: {
      // Tasks + flags = STATIC SNAPSHOT of the NKV Project Scope board (NKV Beauty Account Tracker,
      // 14 Jun 2026). These become live once the nkv-sheet-proxy is deployed (see tools/nkv-sheet-proxy.gs)
      // and config.dataSource is switched to appsScript/overlay:'sections'.
      // 'Upcoming Tasks' card ← sheet "Upcoming" column.
      tasksSpec: { badge: 'Project scope', items: [
        {text:'Keyword update & optimise', sub:'Upcoming', active:false},
        {text:'Request listing images (Newnique)', sub:'Upcoming', active:false}
      ] },
      // 'In Progress' card ← sheet "In Progress" column.
      flagsSpec: { badge: '3 in progress', items: [
        {level:'amber', title:"Connecting Beckdale's WMS", sub:'Shipping · in progress'},
        {level:'amber', title:'Google Ads verification', sub:'Account queries · in progress'},
        {level:'amber', title:'Newnique listing optimisations', sub:'Graphics / A+ · in progress'}
      ] },
      // 'Completed' card ← sheet "Completed" column (Projects tab). Live via the proxy; this is the fallback.
      completedSpec: { badge: '4 completed', items: [
        {text:'All Brand Stores & A+ Content LIVE', sub:'Completed'},
        {text:'New prices implemented', sub:'Completed'},
        {text:'Tiered catalogue promo active', sub:'Completed'},
        {text:'Problem-solving code active', sub:'Completed'}
      ] },
      // Buy Box widget removed from the NKV Overview (config.layout.hide: sec-buybox-card); the Stock
      // Warnings card takes that slot. UK 99.3% / IE 99.8% featured-offer rate retained here for reference.
      cvr: { val:'9.8%', note:'June 2026 · 5,718 sessions', sub:'UK · session conversion' },
      // FBA Stock Warnings = Amazon FBA low-stock / availability only (real, MerchantSpring UK 6 Jul 2026).
      // 22 of the 73 UK listings are at 0 FBA stock (out of stock / suppressed) — mostly dormant Girlactik
      // lip/eyeshadow SKUs and a couple of Newnique FBM kits that don't sell; the 42 selling SKUs are
      // in stock bar the two flagged below.
      // (Account-health/strategy alerts moved to their own section — see ACCOUNT-HEALTH note below.)
      stockWarn: { badge:'2 stock-up · 22 OOS', items:[
        {level:'amber',title:'Contours Rx Lids Assortment 4–7mm — stock-up soon',sub:'B0FYR8DQ2G · ~16 days cover · 33 units · top seller (67/mo)'},
        {level:'amber',title:'Girlactik Gel Eyeliner — watch cover',sub:'B099KVFGZP · ~23 days cover · 24 units · 28/mo'},
        {level:'amber',title:'22 listings out of stock / suppressed',sub:'mostly dormant Girlactik & Lilibeth long-tail SKUs · all other selling SKUs in stock'}
      ] }
      // Account Health (strategy/performance alerts) card removed from the NKV Overview per client request.
    },
    pnl: {
      statement: {
        fixedLabel: 'May 2026 (1–31) · financial basis (MerchantSpring)',
        summary: [ {val:'£14,369',lbl:'Net Revenue',color:'brand'}, {val:'£10,126',lbl:'Total Costs',color:'red'}, {val:'£4,243',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'29.5%', pctColor:'green', note:'May 2026 (31-day) · financial basis (MerchantSpring) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£14,369'},
          {lbl:'Advertising', val:'-£3,255', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-£3,340', color:'red'},
          {lbl:'COGS', val:'-£3,633', color:'red'},
          {lbl:'Net Profit', val:'£4,243', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£14,369',adspend:'£3,255',net:'£4,243',netColor:'green',margin:'29.5%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'£14,985', pct:'104.3%', unit:'£25.66'},
            {lbl:'Refunds', amount:'-£500', pct:'-3.5%', unit:'-£0.86'},
            {lbl:'Reimbursements', amount:'£17', pct:'0.1%', unit:'£0.03'},
            {lbl:'Promotions', amount:'-£496', pct:'-3.5%', unit:'-£0.85'},
            {lbl:'Other income', amount:'£364', pct:'2.5%', unit:'£0.62'},
            {lbl:'Net revenue', amount:'£14,369', pct:'100.0%', unit:'£24.60', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£3,255', pct:'22.7%', unit:'£5.57'},
            {lbl:'Selling fees', amount:'£2,138', pct:'14.9%', unit:'£3.66'},
            {lbl:'Shipping & fulfilment fees', amount:'£1,202', pct:'8.4%', unit:'£2.06'},
            {lbl:'Cost of goods', amount:'£3,633', pct:'25.3%', unit:'£6.22'},
            {lbl:'Refunds & returns overheads', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Other', amount:'-£102', pct:'-0.7%', unit:'-£0.17'},
            {lbl:'Total expenses', amount:'£10,126', pct:'70.5%', unit:'£17.34', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£4,243', pct:'29.5%', unit:'£7.27', total:true, profit:true},
            {lbl:'Profit %', amount:'29.5%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'21.3%'},
            {lbl:'Ad spend', amount:'£3,255'}
          ] }
        ]
      }
    },
    advertising: {
      // Real August 2026 ad totals (MerchantSpring generated 'campaigns' report, UK channel, GBP).
      metrics: [
        {lbl:'Total Spend',  val:'£2,776', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£6,855', color:'brand'},
        {lbl:'ACOS',         val:'40.5%',  color:'amber'},
        {lbl:'Avg. CPC',     val:'£0.68'},
        {lbl:'Impressions',  val:'1.12M'},
        {lbl:'New-to-Brand', val:'12.3%',   color:'green'}
      ],
      // Ad budget = £3,000/mo (NKV tracker · Marketing Activity sheet) vs real actual spend. NOT
      // re-pulled this run (no Google Sheet connector attached to this routine) — subLabel/rows still
      // reflect the June close from the last sheet read; only the spend figure elsewhere in the
      // dashboard (KPI cards) is from the August MerchantSpring pull.
      budgets: {
        subLabel: 'June 2026 · budget vs actual',
        headers: ['Monthly Budget','June Actual','Variance','Utilisation'],
        rows: [
          {name:'United Kingdom', flag:'gb', cells:['£3,000','£2,933','▼ £67 under','98%']},
          {name:'Total', total:true,         cells:['£3,000','£2,933','▼ £67 under','98%']}
        ]
      },
      // Forward ad budget from the NKV Beauty Account Tracker (Amazon Marketing Metrics row) — NOT
      // re-pulled this run (no sheet connector attached); still the last-known flat £3,500/mo forecast.
      // TACOS shown as the account target (<20%); the sheet doesn't forecast ad sales/ROAS forward.
      forecast: [
        {month:'Jul', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Aug', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Real per-campaign actuals (MerchantSpring generated campaigns report, UK channel, August 2026 ·
      // 32 campaigns, top 13 by spend). This is the 'may' default; 3m/6m/12m each override it via their
      // own sec.advertising.campaigns, so Active Campaigns now follows the date selector (and market chip).
      campaigns: [
        {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£702',sales:'£1,578',acos:'44.5%',acosCls:'ba',roas:'2.25×',cpc:'£1.13',status:'Active',statusCls:'bg'},
        {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£373',sales:'£559',acos:'66.7%',acosCls:'br',roas:'1.50×',cpc:'£0.87',status:'Active',statusCls:'bg'},
        {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£300',sales:'£1,044',acos:'28.8%',acosCls:'bg',roas:'3.48×',cpc:'£0.68',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£251',sales:'£498',acos:'50.5%',acosCls:'ba',roas:'1.98×',cpc:'£0.93',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£203',sales:'£329',acos:'61.6%',acosCls:'br',roas:'1.62×',cpc:'£0.81',status:'Active',statusCls:'bg'},
        {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£176',sales:'£361',acos:'48.6%',acosCls:'ba',roas:'2.06×',cpc:'£0.29',status:'Active',statusCls:'bg'},
        {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£139',sales:'£187',acos:'74.5%',acosCls:'br',roas:'1.34×',cpc:'£0.39',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£106',sales:'£157',acos:'67.6%',acosCls:'br',roas:'1.48×',cpc:'£0.57',status:'Active',statusCls:'bg'},
        {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£96',sales:'£125',acos:'77.3%',acosCls:'br',roas:'1.29×',cpc:'£0.75',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£96',sales:'£1,327',acos:'7.3%',acosCls:'bg',roas:'13.79×',cpc:'£0.63',status:'Active',statusCls:'bg'},
        {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£73',sales:'£174',acos:'42.1%',acosCls:'ba',roas:'2.37×',cpc:'£0.66',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£69',sales:'£268',acos:'25.8%',acosCls:'bg',roas:'3.88×',cpc:'£1.06',status:'Active',statusCls:'bg'},
        {name:'UK · Mixed Re-targeting — SD Remarketing',type:'Sponsored Display',spend:'£62',sales:'£82',acos:'75.9%',acosCls:'br',roas:'1.32×',cpc:'£0.29',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from MerchantSpring product report (qty + days-cover per SKU, 6 Jul 2026).
      // All 42 selling SKUs are in stock. The fast-moving Assortment (B0FYR8DQ2G, 67 units/mo) tightened
      // to ~16 days cover; Girlactik Gel Eyeliner (~23 days) also joins the reorder watch this month.
      // No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'42',dCls:'du',d:'SKUs · 0 OOS now',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'1,283',dCls:'df',d:'FBA total',s:'across 42 SKUs'},
        {bar:'amber',lbl:'Stock-up Watch',val:'5',dCls:'df',dColor:'amber',d:'selling · <30d cover',s:'see priority list'},
        {bar:'green',lbl:'Buy Box (Jun)',val:'99.6%',dCls:'du',d:'featured-offer %',s:'vs 99.3% May'}
      ],
      stock: [
        {dot:'da',name:'Contours Rx Lids by Design — Assortment 4–7mm',note:'B0FYR8DQ2G · UK · top seller (67/mo)',units:'33 units',unitsColor:'amber',days:'~16 days',daysColor:'amber'},
        {dot:'dg',name:'White Luxe Teeth Whitening Kit',note:'B08SCS43Q1 · UK · White Luxe',units:'83 units',days:'~80 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 5mm',note:'B018EHTG5K · UK · Contours Rx',units:'68 units',days:'~50 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 6mm',note:'B018EHOJ2K · UK · Contours Rx',units:'78 units',days:'~67 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 4mm',note:'B08MJ1PSXN · UK · Contours Rx',units:'76 units',days:'~65 days'},
        {dot:'da',name:'Girlactik Long-Wear Gel Eyeliner',note:'B099KVFGZP · UK · low cover',units:'24 units',unitsColor:'amber',days:'~23 days',daysColor:'amber'},
        {dot:'dg',name:'Contours Rx Lids by Design — 7mm',note:'B018EDU1DA · UK · Contours Rx',units:'84 units',days:'~72 days'}
      ],
      restock: [
        {level:'amber',title:'Contours Rx Lids Assortment 4–7mm — UK',sub:'B0FYR8DQ2G · ~16 days cover · 33 units · top seller (67/mo) — stock-up this week'},
        {level:'amber',title:'Girlactik Long-Wear Gel Eyeliner — UK',sub:'B099KVFGZP · ~23 days cover · 24 units · selling 28/mo — stock-up soon'}
      ],
      // Supplier Purchase Orders (manufacturer reorder forecast). STATIC fallback transcribed from the
      // tracker; the nkv-sheet-proxy overlays this live once deployed. level = Order-By-Latest urgency.
      supplierPOs: [
        {product:'Contours Rx', lastsUntil:'June', checkAgain:'July', orderBy:'18th August', level:'amber', note:'Nailah is aware'},
        {product:'Newnique', lastsUntil:'March', checkAgain:'October', orderBy:'November', level:'green', note:'Check ZQ Portal'},
        {product:'White Luxe (Kits)', lastsUntil:'August', checkAgain:'July', orderBy:'August', level:'amber', note:'Make sure enough stock for Dec/Jan'},
        {product:'Girlactik', lastsUntil:'July', checkAgain:'May', orderBy:'June/July', level:'red', note:'?'},
        {product:'White Luxe (Strips)', lastsUntil:'Good for now', checkAgain:'January', orderBy:'—', level:'', note:''}
      ],
      // Per-market FBA stock (MerchantSpring product report, 6 Jul 2026). 'all'/'uk' use the default
      // kpis/stock/restock above. Ireland ships FBA from the UK pool (early stage, ample cover); USA
      // placed its first real orders in June 2026 (Newnique-only seller account, freshly launched) and
      // its previously out-of-stock GrowPod kit (B0FCFVGD6Y) has since been delisted from that catalogue.
      // Selected via the market chip (app.js).
      kpisByMarket: {
        irl: [
          {bar:'green',  lbl:'In Stock',      val:'23',  dCls:'du', d:'of 24 listings', s:'1 OOS · Girlactik Brown'},
          {bar:'#404935',lbl:'Units on Hand', val:'934', dCls:'df', d:'FBA total',       s:'ships from UK pool'},
          {bar:'green',  lbl:'Stock-up Watch', val:'0',   dCls:'du', d:'healthy cover',   s:'early stage · low velocity'},
          {bar:'amber',  lbl:'Out of Stock',  val:'1',   dCls:'df', dColor:'amber', d:'Girlactik Brown', s:'B09QRJ4Y44 · non-selling'}
        ],
        usa: [
          {bar:'green',  lbl:'In Stock',      val:'4',   dCls:'du', d:'of 4 ASINs',      s:'Newnique · 0 OOS'},
          {bar:'#404935',lbl:'Units on Hand', val:'145', dCls:'df', d:'FBA total',       s:'across 4 SKUs'},
          {bar:'amber',  lbl:'Stock-up Watch', val:'2',   dCls:'df', dColor:'amber', d:'~3 weeks cover', s:'2 active sellers'},
          {bar:'green',  lbl:'Out of Stock',  val:'0',   dCls:'du', d:'GrowPod kit delisted', s:'catalogue now 4 SKUs'}
        ]
      },
      stockByMarket: {
        irl: [
          {dot:'dg',name:'Contours Rx Lids by Design — 7mm',note:'B018EDU1DA · IE · Contours Rx',units:'84 units',days:'ample'},
          {dot:'dg',name:'White Luxe Teeth Whitening Kit',note:'B08SCS43Q1 · IE · White Luxe',units:'83 units',days:'ample'},
          {dot:'dg',name:'Contours Rx Lids by Design — 6mm',note:'B018EHOJ2K · IE · Contours Rx',units:'78 units',days:'ample'},
          {dot:'dg',name:'Contours Rx Lids by Design — 4mm',note:'B08MJ1PSXN · IE · Contours Rx',units:'76 units',days:'ample'},
          {dot:'dg',name:'Contours Rx Assortment 4–7mm',note:'B0FYR8DQ2G · IE · top seller · 2 listings',units:'106 units',days:'ample'},
          {dot:'dg',name:'Newnique Advanced Hair Growth Serum',note:'B0F8QMT775 · IE · Newnique',units:'29 units',days:'ample'},
          {dot:'dg',name:'Girlactik Gel Eyeliner — Pure Black',note:'B099KVFGZP · IE · Girlactik',units:'24 units',days:'ample'},
          {dot:'dr',name:'Girlactik Gel Eyeliner — Pure Brown',note:'B09QRJ4Y44 · IE · out of stock',units:'0 units',unitsColor:'red',days:'OOS',daysColor:'red'}
        ],
        usa: [
          {dot:'da',name:'Newnique Organic Hair Growth Oil',note:'B0F8QQ4M2G · US · top seller (~30/mo)',units:'22 units',unitsColor:'amber',days:'~22 days',daysColor:'amber'},
          {dot:'da',name:'Newnique Advanced Hair Growth Serum',note:'B0F8QMT775 · US · ~29/mo',units:'21 units',unitsColor:'amber',days:'~21 days',daysColor:'amber'},
          {dot:'dg',name:'Newnique Scalp Exfoliant',note:'B0F8QLYNMQ · US · seeding · no sales yet',units:'52 units',days:'ample'},
          {dot:'dg',name:'Newnique Hair Loss Serum',note:'B0F8QQGM8Y · US · seeding · no sales yet',units:'50 units',days:'ample'}
        ]
      },
      // NB: rows in these per-market lists must NOT mention a *different* market's code (UK/USA/DE…) —
      // applyMarketFilter scans row text and would hide a row tagged with a market other than the chip.
      restockByMarket: {
        irl: [
          {level:'amber',title:'Girlactik Gel Eyeliner — Pure Brown (IE)',sub:'B09QRJ4Y44 · out of stock · not currently selling · low priority · replenish on the next Contours Rx shipment'}
        ],
        usa: [
          {level:'amber',title:'Newnique Organic Hair Growth Oil — US',sub:'B0F8QQ4M2G · ~22 days cover · 22 units · selling ~30/mo · stock-up within 3 weeks'},
          {level:'amber',title:'Newnique Advanced Hair Growth Serum — US',sub:'B0F8QMT775 · ~21 days cover · 21 units · selling ~29/mo · stock-up within 3 weeks'}
        ]
      },
      // US is a separate Newnique-only seller account — the UK manufacturer PO forecast doesn't apply, so
      // hide the Supplier POs card there. Ireland ships from the UK pool, so it keeps the UK PO table.
      supplierPOsByMarket: { usa: [] }
    },
    products: {
      // KPIs + by-market table = June 2026 (page period). Groups card = trailing 12 months (its label).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'73',dCls:'df',d:'UK listings',s:'42 sold in Jun'},
        {bar:'var(--green)',lbl:'Top Brand Rev.',val:'£9,678',dCls:'du',d:'Contours Rx',s:'69% of Jun sales'},
        {bar:'var(--blue)',lbl:'Orders (Jun)',val:'510',dCls:'dd',d:'▼ 7.4% MoM',s:'551 orders May'},
        {bar:'var(--amber)',lbl:'ASP',val:'£25.44',dCls:'df',d:'Jun avg',s:'per unit'}
      ],
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£14,144',units:'556',orders:'510',cvr:'9.8%',cvrCls:'bg',aov:'£27.73'},
        {name:'Ireland',flag:'ie',revenue:'£224',units:'7',orders:'7',cvr:'5.0%',cvrCls:'ba',aov:'£32.00'},
        {name:'United States',flag:'us',revenue:'£644',units:'59',orders:'47',cvr:'—',cvrCls:'bb',aov:'£13.70'}
      ],
      // Trailing 12 months (Jul 2025–Jun 2026) by brand · UK · real MerchantSpring product report.
      // Brand split allocated from June's real per-brand sales mix (same methodology already used for
      // Ireland's brand split below) applied to the 12-mo UK total; ad spend/TACOS scaled the same way.
      // OOS Rate = share of the brand's SKUs currently out of stock (all 0% — catalogue fully in stock now;
      // contrast the period OOS-time metric on the Overview).
      groups: [
        {name:'Contours Rx — Eyelid Strips',sales:'£116,013',units:'4,465',pct:'69%',oosRate:'0%',oosCls:'bg'},
        {name:'White Luxe — Teeth Whitening',sales:'£22,293',units:'858',pct:'13%',oosRate:'0%',oosCls:'bg'},
        {name:'Newnique — Hair Growth',sales:'£13,971',units:'538',pct:'8%',oosRate:'0%',oosCls:'bg'},
        {name:'Lilibeth — Brow & Dermaplaning',sales:'£11,963',units:'460',pct:'7%',oosRate:'0%',oosCls:'bg'},
        {name:'Girlactik — Eyeliner',sales:'£4,925',units:'190',pct:'3%',oosRate:'0%',oosCls:'bg'}
      ]
    },
    charts: {
      // Rolling trailing-6-month window — shift forward one month + append the new month on every
      // re-bake (drop the oldest). Values are MerchantSpring actuals (uk == top-level 'all'; irl/usa
      // are the per-market overlays), same convention as dateRanges. Re-pulled via daily-bucket sums
      // (see clients/nkv note on getSalesByPeriod's monthly-interval bug) and cross-checked against the
      // generated campaigns report for ad spend — Jun/Jul irl+usa values match the prior bake exactly.
      months: ['Mar','Apr','May','Jun','Jul','Aug'],
      rev: { all:[17458,12839,15290,14079,13122,17986], uk:[17458,12839,15290,14079,13122,17986], irl:[385,349,481,224,356,233], usa:[0,0,0,644,714,451] },
      adSpend: { all:[3159,2405,3201,2988,2569,2776], uk:[3159,2405,3201,2988,2569,2776], irl:[0,0,0,0,0,0], usa:[0,0,0,29,72,3] },
      adTacos: { all:[18.1,18.7,20.9,21.2,19.6,15.4], uk:[18.1,18.7,20.9,21.2,19.6,15.4], irl:[0,0,0,0,0,0], usa:[0,0,0,4.5,10.1,0.7] }
    }
  }
};

/* Products page — period + MARKET aware (MerchantSpring, 6 Jul 2026). The KPI row, the
   Performance-by-Market table and the Sales-by-Brand groups all now follow the date selector (and the
   table + groups follow the market chip). UK = channel actuals; brand splits / Top Brand Rev from the
   product report; Ireland is early-stage €-converted; USA placed its first real orders in June 2026.
   'may' is exact per-brand product-level data; 3m/6m/12m brand splits are allocated from June's real
   per-brand mix applied to each window's real UK total (same methodology as Ireland's split below) —
   these per-period structures supersede the static products.kpis/table/groups above (kept as the
   June fallback). */
(function () {
  var P = window.DASHBOARD_DATA.sections.products;
  var LBL = { may: 'Jul', '3m': '3-mo', '6m': 'YTD', '12m': '12-mo' };
  var UK = {
    may:  { rev:'£13,290',  units:530,  orders:491,  aov:'£27.07', cvr:'9.4%', asp:'£25.08', topRev:'£9,000',   topPct:'68%', sold:39 },
    '3m': { rev:'£42,659',  units:1668, orders:1550, aov:'£27.52', cvr:'8.9%', asp:'£25.58', topRev:'£29,559',  topPct:'69%', sold:47 },
    '6m': { rev:'£87,060',  units:3294, orders:3076, aov:'£28.31', cvr:'8.0%', asp:'£26.43', topRev:'£62,155',  topPct:'71%', sold:47 },
    '12m':{ rev:'£169,164', units:6511, orders:6097, aov:'£27.75', cvr:'7.3%', asp:'£25.98', topRev:'£116,013', topPct:'69%', sold:46 }
  };
  var IRL = {
    may:  { rev:'£356',   units:9,   orders:9,   aov:'£39.54', cvr:'3.6%' },
    '3m': { rev:'£1,061', units:34,  orders:32,  aov:'£33.14', cvr:'4.0%' },
    '6m': { rev:'£2,035', units:63,  orders:59,  aov:'£34.50', cvr:'3.3%' },
    '12m':{ rev:'£3,078', units:109, orders:102, aov:'£30.18', cvr:'5.0%' }
  };
  var GROUPS = {
    // [name, sales, units, %share, adSpend, TACOS, tacosCls] — 'may'/3m/6m are exact (MerchantSpring
    // generated salesByProduct report, UK channel, grouped by brand, ad spend ÷ brand sales); 12m is
    // unchanged this run (still May's per-brand mix applied to the 12m real total — see header note).
    // A new brand line (HYDRTE — Travel Bottles) launched in July with real ad spend/sales.
    // bg <20% · ba 20–40% · br >40%.
    may:  [['Contours Rx — Eyelid Strips','£9,000',270,'70%','£990','11.0%','bg'],['White Luxe — Teeth Whitening','£1,324',42,'10%','£495','37.4%','ba'],['Newnique — Hair Growth','£828',70,'7%','£366','44.2%','br'],['Lilibeth — Brow & Dermaplaning','£939',97,'7%','£174','18.5%','bg'],['Girlactik — Eyeliner','£138',8,'1%','£0','0.0%','bg'],['HYDRTE — Travel Bottles','£603',28,'5%','£279','46.2%','br']],
    '3m': [['Contours Rx — Eyelid Strips','£29,559',880,'70%','£3,141','10.6%','bg'],['White Luxe — Teeth Whitening','£5,296',174,'12%','£2,217','41.9%','br'],['Newnique — Hair Growth','£3,087',187,'7%','£1,534','49.7%','br'],['Lilibeth — Brow & Dermaplaning','£2,949',323,'7%','£538','18.2%','bg'],['Girlactik — Eyeliner','£1,037',66,'2%','£239','23.0%','ba'],['HYDRTE — Travel Bottles','£603',28,'1%','£279','46.2%','br']],
    '6m': [['Contours Rx — Eyelid Strips','£62,155',1850,'73%','£7,163','11.5%','bg'],['White Luxe — Teeth Whitening','£9,962',313,'12%','£3,804','38.2%','ba'],['Newnique — Hair Growth','£4,756',243,'6%','£2,445','51.4%','br'],['Lilibeth — Brow & Dermaplaning','£5,328',575,'6%','£949','17.8%','bg'],['Girlactik — Eyeliner','£2,241',138,'3%','£769','34.3%','ba'],['HYDRTE — Travel Bottles','£603',28,'1%','£279','46.2%','br']],
    '12m':[['Contours Rx — Eyelid Strips','£116,013',3343,'69%','£12,094','10.4%','bg'],['White Luxe — Teeth Whitening','£22,293',704,'13%','£9,435','42.3%','br'],['Newnique — Hair Growth','£13,971',821,'8%','£6,799','48.7%','br'],['Lilibeth — Brow & Dermaplaning','£11,963',1314,'7%','£1,554','13.0%','bg'],['Girlactik — Eyeliner','£4,925',328,'3%','£1,312','26.6%','ba']]
  };
  function num(x) { return x.toLocaleString('en-GB'); }
  function gbp(s) { return Number(String(s).replace(/[^0-9.]/g, '')); }
  var USA = {
    may:  { rev:'£714',   units:65,  orders:30, aov:'£23.80' },
    '3m': { rev:'£1,358', units:124, orders:77, aov:'£17.63' },
    '6m': { rev:'£1,358', units:124, orders:77, aov:'£17.63' },
    '12m':{ rev:'£644', units:59, orders:47, aov:'£13.70' }
  };
  // 'All Markets' = UK + Ireland + USA combined (USA placed its first real orders in June 2026).
  // Ireland is ~100% Contours Rx, so it rolls into Top Brand; USA is 100% Newnique, so it doesn't.
  function allCards(u, r, a, lbl) {
    var rev = gbp(u.rev) + gbp(r.rev) + gbp(a.rev), units = u.units + r.units + a.units, orders = u.orders + r.orders + a.orders;
    var topRev = gbp(u.topRev) + gbp(r.rev);
    return [
      { bar:'#404935',      lbl:'Active SKUs',    val:'73',                                dCls:'df', d:'UK + IRL + USA',    s:u.sold + ' sold (' + lbl + ')' },
      { bar:'var(--green)', lbl:'Top Brand Rev.', val:'£' + num(Math.round(topRev)),       dCls:'du', d:'Contours Rx',       s:Math.round(topRev / rev * 100) + '% of ' + lbl + ' sales' },
      { bar:'var(--blue)',  lbl:'Orders',         val:num(orders),                         dCls:'df', d:lbl + ' · All Markets', s:'AOV £' + (rev / orders).toFixed(2) },
      { bar:'var(--amber)', lbl:'ASP',            val:'£' + (rev / units).toFixed(2),      dCls:'df', d:lbl + ' avg',        s:'per unit' }
    ];
  }
  function ukCards(u, lbl) { return [
    { bar:'#404935',      lbl:'Active SKUs',    val:'73',          dCls:'df', d:'UK listings',  s:u.sold + ' sold (' + lbl + ')' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:u.topRev,      dCls:'du', d:'Contours Rx',  s:u.topPct + ' of ' + lbl + ' sales' },
    { bar:'var(--blue)',  lbl:'Orders',         val:num(u.orders), dCls:'df', d:lbl + ' actuals', s:'AOV ' + u.aov },
    { bar:'var(--amber)', lbl:'ASP',            val:u.asp,         dCls:'df', d:lbl + ' avg',     s:'per unit' }
  ]; }
  function irlCards(r, lbl) { return [
    { bar:'#404935',      lbl:'Active SKUs',    val:'12',          dCls:'df', d:'IRL listings', s:'early stage' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:r.rev,         dCls:'du', d:'Contours Rx',  s:'~100% of IRL' },
    { bar:'var(--blue)',  lbl:'Orders',         val:num(r.orders), dCls:'df', d:lbl + ' actuals', s:'AOV ' + r.aov },
    { bar:'var(--amber)', lbl:'ASP',            val:r.aov,         dCls:'df', d:lbl + ' avg',     s:'per unit' }
  ]; }
  var usaCards = [
    { bar:'#404935',      lbl:'Active SKUs',    val:'4',     dCls:'df', d:'Newnique · live',   s:'trading since Jun 2026' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:'£714',  dCls:'du', d:'Newnique',          s:'Jul actuals' },
    { bar:'var(--blue)',  lbl:'Orders',         val:'30',    dCls:'du', d:'Newnique · live',   s:'AOV £23.80' },
    { bar:'var(--amber)', lbl:'ASP',            val:'£23.80',dCls:'df', d:'Jul avg',           s:'per unit' }
  ];
  function rows(u, r, a) { return [
    { name:'United Kingdom', flag:'gb', revenue:u.rev, units:num(u.units), orders:num(u.orders), cvr:u.cvr, cvrCls:'bg', aov:u.aov },
    { name:'Ireland',        flag:'ie', revenue:r.rev, units:num(r.units), orders:num(r.orders), cvr:r.cvr, cvrCls:'ba', aov:r.aov },
    { name:'United States',  flag:'us', revenue:a.rev, units:num(a.units), orders:num(a.orders), cvr:'—',   cvrCls:'bb', aov:a.aov }
  ]; }
  function grp(g) { return g.map(function (x) { return { name:x[0], sales:x[1], units:num(x[2]), pct:x[3], adSpend:x[4], tacos:x[5], tacosCls:x[6], oosRate:'0%', oosCls:'bg' }; }); }
  // Ireland — early-stage, NO ads (so Ad Spend £0 / TACOS n/a). Only three brands sell there; the split
  // is allocated from the real trailing-12mo IE brand mix (MerchantSpring product report: Contours Rx 82%
  // / White Luxe 10% / Newnique 8% by sales, 74/12/14 by units) applied to each period's IE actuals.
  function irlGroups(r) {
    var rev = gbp(r.rev), u = r.units;
    function row(name, sShare, uShare, pct) {
      return { name:name, sales:'£' + num(Math.round(rev * sShare)), adSpend:'£0', tacos:null,
               units:num(Math.round(u * uShare)), pct:pct, oosRate:'0%', oosCls:'bg' };
    }
    return [
      row('Contours Rx — Eyelid Strips', 0.82, 0.74, '82%'),
      row('White Luxe — Teeth Whitening', 0.10, 0.12, '10%'),
      row('Newnique — Hair Growth', 0.08, 0.14, '8%')
    ];
  }
  // USA — placed its first real orders in June 2026 (Newnique only); real ad spend/TACOS from the
  // MerchantSpring product report (still small-sample — a brand-new market).
  var usaGroups = [
    { name:'Newnique — Hair Growth', sales:'£714', adSpend:'£74', tacos:'10.3%', tacosCls:'ba', units:'65', pct:'100%', oosRate:'0%', oosCls:'bg' }
  ];
  P.kpisByPeriod = {}; P.tableByPeriod = {}; P.groupsByPeriod = {};
  ['may', '3m', '6m', '12m'].forEach(function (p) {
    var u = UK[p], r = IRL[p], a = USA[p], lbl = LBL[p], uc = ukCards(u, lbl), g = grp(GROUPS[p]);
    P.kpisByPeriod[p]   = { all:allCards(u, r, a, lbl), uk:uc, irl:irlCards(r, lbl), usa:usaCards };
    P.tableByPeriod[p]  = rows(u, r, a);
    P.groupsByPeriod[p] = { all:g, uk:g, irl:irlGroups(r), usa:usaGroups };
  });
})();

/* ============================================================================================
   SHOPIFY (D2C) — sections.shopify  ·  brand-filtered: All / Newnique / Contours Rx (2 stores)
   --------------------------------------------------------------------------------------------
   Re-baked for July 2026 (5 Aug 2026 pull), native GBP. Pairs two sources, mirroring the Amazon side:
   • ORDER-SIDE (net sales, orders, AOV, units, product mix, stock-on-hand) → MerchantSpring's
     Shopify channels — Contours Rx ch 33616599, Newnique ch 110450469 (the same connector that
     serves NKV's Amazon actuals).
   • SESSION-SIDE (sessions, CVR, the cart→checkout→purchase funnel, traffic-by-channel) → GA4 via
     the Reporting Ninja connector (properties/394327082 Contours Rx, properties/506386258 Newnique).
   Contours Rx UK (contours-rx.co.uk · 658f4a.myshopify.com): order-side + GA4 are both EXACT actuals
   for may/3m/6m (12m intentionally left at its prior bake — see the top-of-file header note on why
   trailing-12m wasn't touched this run). Every net-sales figure below is cross-checked to the penny
   between the period-total pull and the per-product breakdown pulled the same run. Note GA4 purchases
   (54 Jul) run below the Orders KPI (83) — orders include repeat/manual/no-session orders; the funnel
   + CVR are session-based, Orders is order-based — both valid, kept separate. "Returning Cust." is
   marked unavailable this run: GA4's totalPurchasers/firstTimePurchasers came back identical (100%
   "first-time"), which contradicts a store with real repeat orders and looks like a GA4 attribution
   gap rather than a fact — not something to bake as if it were real.
   Newnique: MerchantSpring isn't ingesting its orders yet, so its ORDER-SIDE reads "pending Executive
   integration"; its GA4 session-side IS live (277 sessions Jul). 'all' equals Contours Rx until
   Newnique's orders backfill (see the derivation at the bottom).
   Read by app.js → renderShopify() / renderShopBrands(); follows the shared date-range selector. */
window.DASHBOARD_DATA.sections.shopify = {
  brands: [
    { key: 'all',        label: 'All' },
    { key: 'newnique',   label: 'Newnique' },
    { key: 'contoursrx', label: 'Contours Rx' }
  ],
  data: {
    contoursrx: {
      label: 'Contours Rx UK', store: 'contours-rx.co.uk',
      // 6-month net-sales trend (Feb 2026 → Jul 2026), exact MerchantSpring actuals (Shopify channel
      // 33616599). Cross-checked: net sales sum to the exact penny against the per-product breakdown
      // pulled the same run.
      chart: {
        max: 4000, yTicks: ['£4k', '£3k', '£2k', '£1k', '£0'],
        xLabels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], xHighlight: '#404935',
        series: [ { values: [2907, 3243, 2621, 2416, 2783, 2387], color: '#404935', area: true, main: true } ],
        legend: [ { name: 'Net Sales', color: '#404935' } ]
      },
      // Current on-hand snapshot from MerchantSpring (Shopify channel, 5 Aug 2026). Cover = vs ~Jul run-rate.
      stock: [
        { name: 'Lids by Design Eyelid Lift Strips', note: '7 size variants · Healthy',        level: 'g', units: '1,417 units', cover: '~512 days' },
        { name: 'Exfoliating B5 Prep Pads 30pk',     note: 'SKU CR B5PREP · Healthy',          level: 'g', units: '47 units',    cover: 'ample cover' },
        { name: 'Botanical Lash & Brow Serum',       note: 'SKU CR BLBS · Healthy',            level: 'g', units: '82 units',    cover: 'ample cover' },
        { name: 'Dermal Blade (3 pack)',             note: 'SKU CR DERMA · Restock needed',    level: 'r', units: '0 units',     cover: 'OOS' }
      ],
      // Traffic by GA4 default channel group (July 2026) via Reporting Ninja. Cross-network = Google Ads
      // (Performance Max). Bar widths floored so near-zero channels stay visible. Sum shown = 2,352 of
      // 2,473 sessions (smaller channels omitted).
      traffic: [
        { lbl: 'Paid (Cross-network)', pct: 70, val: '1,723', color: 'brand' },
        { lbl: 'Organic Search',       pct: 14, val: '353',   color: 'blue' },
        { lbl: 'Direct',               pct: 9,  val: '234',   color: 'amber' },
        { lbl: 'Email',                pct: 2,  val: '42',    color: 'green' }
      ],
      byPeriod: {
        may: {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£2,387',  dCls: 'dd', d: '▼ 14.2% MoM',  s: 'vs £2,783 Jun' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '83',      dCls: 'dd', d: '▼ 13.5% MoM',  s: '96 orders Jun' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.76',  dCls: 'dd', d: '▼ £0.22 MoM',  s: '£28.98 Jun' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£27.75',  dCls: 'df', d: 'net ÷ units',  s: '86 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.18%',  dCls: 'df', d: 'GA4 · sessions', s: '54 of 2,473 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '2,473',  dCls: 'du', d: '▲ 10.8% MoM', s: 'GA4 · vs 2,232 Jun' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '86',     dCls: 'df', d: 'Lids 83 · Other 3', s: '3 active SKUs' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '2,473', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '90',    pct: '3.6%', w: 3.6, sub: 'GA4 · 3.6% of sessions' },
            { lbl: 'Reached Checkout', val: '54',    pct: '2.2%', w: 2.2, sub: '60% of carts retained' },
            { lbl: 'Purchased',        val: '54',    pct: '2.2%', w: 2.2, sub: '100% of checkouts · 2.18% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£2,316', units: '83', asp: '£27.91', orders: '83', share: '97.0%', shareCls: 'bg' },
            { name: 'Exfoliating B5 Prep Pads 30pk',     net: '£41',    units: '2',  asp: '£20.67', orders: '2',  share: '1.7%',  shareCls: 'bb' },
            { name: 'Botanical Lash & Brow Serum',       net: '£29',    units: '1',  asp: '£29.45', orders: '1',  share: '1.2%',  shareCls: 'bb' },
            { name: 'Dermal Blade (3 pack)',             net: '£0',     units: '0',  asp: '—',      orders: '0',  share: '—',     shareCls: 'br' }
          ]
        },
        '3m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£7,585', dCls: 'df', d: '3-mo actuals',  s: 'May–Jul 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '271',    dCls: 'df', d: '3-mo actuals',  s: 'AOV £27.99' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£27.99', dCls: 'df', d: '3-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.43', dCls: 'df', d: 'net ÷ units',  s: '287 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.08%', dCls: 'df', d: 'GA4 · 3-mo',   s: '154 of 7,394 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '7,394', dCls: 'df', d: 'GA4 · May–Jul', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '287',   dCls: 'df', d: 'Lids 279 · Other 8',  s: 'May–Jul' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',     dCls: 'df', d: 'Data unavailable',    s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '7,394', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '290',   pct: '3.9%', w: 3.9, sub: 'GA4 · 3.9% of sessions' },
            { lbl: 'Reached Checkout', val: '173',   pct: '2.3%', w: 2.3, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '154',   pct: '2.1%', w: 2.1, sub: '2.08% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£7,421', units: '279', asp: '£26.60', orders: '271', share: '97.8%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum)',           net: '£164',   units: '8',   asp: '—',      orders: '8',   share: '2.2%',  shareCls: 'bb' }
          ]
        },
        '6m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£16,357', dCls: 'df', d: 'YTD actuals',   s: 'Feb–Jul 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '578',     dCls: 'df', d: 'YTD actuals',   s: 'AOV £28.30' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.30',  dCls: 'df', d: 'YTD blended',   s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.38',  dCls: 'df', d: 'net ÷ units',  s: '620 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.48%',  dCls: 'df', d: 'GA4 · YTD',    s: '349 of 14,077 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '14,077', dCls: 'df', d: 'GA4 · Feb–Jul', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '620',   dCls: 'df', d: 'Lids 605 · Other 15', s: 'Feb–Jul' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',     dCls: 'df', d: 'Data unavailable',    s: 'not recomputed this run' }
          ],
          // NOTE: Purchased (349) fractionally exceeds Reached Checkout (332) here — a real GA4 quirk
          // (cross-session attribution: begin_checkout and purchase can land in different GA4 sessions
          // near the window boundary), not a data error. Confirmed via a bypass_cache re-query.
          funnel: [
            { lbl: 'Sessions',         val: '14,077', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '624',    pct: '4.4%', w: 4.4, sub: 'GA4 · 4.4% of sessions' },
            { lbl: 'Reached Checkout', val: '332',    pct: '2.4%', w: 2.4, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '349',    pct: '2.5%', w: 2.5, sub: '2.48% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£16,068', units: '605', asp: '£26.56', orders: '578', share: '98.2%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum)',           net: '£289',    units: '15',  asp: '—',      orders: '15',  share: '1.8%',  shareCls: 'bb' }
          ]
        },
        '12m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Net Sales', val: '£19,786', dCls: 'df', d: '12-mo actuals',  s: 'Jun 25–May 26' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '689',     dCls: 'df', d: '12-mo actuals',  s: 'AOV £28.88' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.88',  dCls: 'df', d: '12-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£25.76',  dCls: 'df', d: 'net ÷ units',  s: '768 units' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.00%',  dCls: 'df', d: 'GA4 · 12-mo',     s: '436 of 21,773 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '21,773', dCls: 'df', d: 'GA4 · trailing yr', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '768',   dCls: 'df', d: 'Lids 738 · others',   s: 'trailing year' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '5.8%',   dCls: 'df', d: '~40 of 689',          s: '12-mo window' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '21,773', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '853',    pct: '3.9%', w: 3.9, sub: 'GA4 · 3.9% of sessions' },
            { lbl: 'Reached Checkout', val: '514',    pct: '2.4%', w: 2.4, sub: 'GA4 begin_checkout' },
            { lbl: 'Purchased',        val: '436',    pct: '2.0%', w: 2.0, sub: '2.00% conversion' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£19,426', units: '738', asp: '£26.32', orders: '689', share: '98.2%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Dermal · Tweezers)', net: '£360',  units: '30',  asp: '—',      orders: '30',  share: '1.8%',  shareCls: 'bb' }
          ]
        }
      }
    },
    // Newnique — order-side is PENDING. MerchantSpring (Shopify ch 110450469) is connected but not yet
    // ingesting Newnique's orders, so Net Sales / Orders / AOV / ASP / Units / products / stock read
    // "pending Executive integration". Its SESSION-SIDE is LIVE from GA4 via Reporting Ninja
    // (properties/506386258) — real sessions / CVR / funnel / traffic. 'all' = Contours Rx until the
    // order feed backfills. Newnique's P&L is separate (LIGHT: revenue / COGS / Google Ads from the
    // Account Tracker via sections.shopifypnl) and unaffected.
    newnique: {
      label: 'Newnique', store: 'newniquecare.com',
      chart: null, stock: [],
      // Traffic by GA4 default channel group (July 2026) via Reporting Ninja. Sum = 258 of 277 sessions.
      traffic: [
        { lbl: 'Direct',         pct: 57, val: '158', color: 'brand' },
        { lbl: 'Organic Social', pct: 16, val: '44',  color: 'blue' },
        { lbl: 'Organic Search', pct: 16, val: '43',  color: 'amber' },
        { lbl: 'Referral',       pct: 5,  val: '13',  color: 'green' }
      ],
      placeholder: 'Pending Executive integration — order data (sales / products / stock) populates once Newnique is connected; GA4 traffic is already live.',
      byPeriod: (function () {
        // Order-side cards stay "pending" until the Executive/MerchantSpring order feed backfills;
        // session-side cards + funnel are live GA4 actuals per period.
        function pend(lbl, bar) { return { bar: bar, lbl: lbl, val: '—', dCls: 'df', d: 'Pending Executive', s: '' }; }
        function n(x) { return x.toLocaleString('en-GB'); }
        function rate(a, b) { return (a / b * 100).toFixed(1); }
        function period(sess, cart, chk, pur, cvr, win) {
          return {
            kpis1: [ pend('Net Sales', '#404935'), pend('Orders', 'var(--blue)'), pend('AOV', 'var(--green)'), pend('ASP', 'var(--amber)') ],
            kpis2: [
              { bar: '#404935',      lbl: 'Conversion Rate', val: cvr,    dCls: 'df', d: 'GA4 · ' + win, s: pur + ' of ' + n(sess) + ' sessions' },
              { bar: 'var(--blue)',  lbl: 'Sessions',        val: n(sess), dCls: 'df', d: 'GA4 · ' + win, s: 'GA4 actuals' },
              pend('Units Sold', 'var(--green)'),
              pend('Returning Cust.', 'var(--amber)')
            ],
            funnel: [
              { lbl: 'Sessions',         val: n(sess),    pct: '100%',            w: 100 },
              { lbl: 'Added to Cart',    val: String(cart), pct: rate(cart, sess) + '%', w: +rate(cart, sess), sub: 'GA4 · ' + rate(cart, sess) + '% of sessions' },
              { lbl: 'Reached Checkout', val: String(chk),  pct: rate(chk, sess) + '%',  w: +rate(chk, sess),  sub: 'GA4 begin_checkout' },
              { lbl: 'Purchased',        val: String(pur),  pct: rate(pur, sess) + '%',  w: +rate(pur, sess),  sub: cvr + ' conversion' }
            ],
            products: []
          };
        }
        return {
          may:  period(277,  30,  2,  1, '0.36%', 'Jul'),
          '3m': period(851,  141, 20, 5, '0.59%', 'May–Jul'),
          '6m': period(1165, 171, 28, 5, '0.43%', 'Feb–Jul'),
          '12m':period(1520, 186, 41, 4, '0.26%', 'trailing yr')
        };
      })()
    }
  }
};

/* 'All' currently EQUALS Contours Rx. Newnique's order-side is pending Executive integration (see its
   block above), so there's nothing to sum on the headline cards yet and 'all' just mirrors the Contours
   Rx statement. When Newnique's orders backfill, restore the CRX + Newnique sum here (headline Net
   Sales/Orders/AOV/ASP + Units sum both stores; Conversion/Sessions/funnel + stock/traffic/chart stay
   Contours Rx; products merge both ranges). */
window.DASHBOARD_DATA.sections.shopify.data.all = (function () {
  var crx = window.DASHBOARD_DATA.sections.shopify.data.contoursrx;
  var all = { label: 'All Brands', store: 'Contours Rx (Newnique orders pending)', chart: crx.chart, stock: crx.stock, traffic: crx.traffic, byPeriod: {} };
  Object.keys(crx.byPeriod).forEach(function (k) {
    var c = crx.byPeriod[k];
    all.byPeriod[k] = { kpis1: c.kpis1, kpis2: c.kpis2, funnel: c.funnel, products: c.products };
  });
  return all;
})();

/* ============================================================================================
   SHOPIFY P&L — sections.shopifypnl  ·  same brand filter (All / Newnique / Contours Rx) + periods
   --------------------------------------------------------------------------------------------
   Sourced from the NKV Beauty Account Tracker ("Shopify" block, Jan–May 2026) — the client's own
   P&L. Revenue + COGS are split by brand; the operating-expense lines (Google/social ad spend,
   Beckdale fulfilment, Shopify + transaction fees, subscription, brand manager, 5.5% TD fee) are
   tracked at Shopify-total level and sit on the Contours Rx statement (CRX ≈ 99% of D2C). 'other'
   is the tracker's residual (~£160/mo) that makes each month foot to its "Shopify Expenses" total,
   so Net Profit ties exactly to the sheet's "Profit after COGS". Newnique is tracked LIGHT (own
   revenue / COGS / Google Ads only); 'All' = Contours Rx + Newnique combined. These baked monthly
   inputs are the offline fallback — nkv-sheet-proxy serves sections.shopifypnl live on top. */
(function () {
  // Monthly inputs from the NKV Beauty Account Tracker ("Shopify" block, Jan–May 2026). Shared opex
  // lines are Shopify-total (attributed to Contours Rx); 'other' is the tracker residual that foots
  // each month to its "Shopify Expenses" total so Net Profit matches the sheet's "Profit after COGS".
  // totRev = the sheet's "Total Shopify Revenue" row (drives the All view). It equals crxRev + nkvRev
  // EXCEPT Feb, where an Amazon-FBM manual order keyed via Shopify (£84.95) is deliberately excluded
  // from the Shopify total — copied exactly so All ties to the sheet's "Profit after COGS" each month.
  var M = {
    jan: { crxRev:2127, nkvRev:0,      totRev:2127,    crxCogs:666,    nkvCogs:0,  gAdsCrx:695.97, gAdsNkv:0,      social:0,     ship:272.83, txn:61.68, app:18.06, sub:25, bm:200, td:116.99, other:160.00 },
    feb: { crxRev:2937, nkvRev:84.95,  totRev:2937,    crxCogs:931,    nkvCogs:20, gAdsCrx:571.33, gAdsNkv:0,      social:21.50, ship:686.40, txn:85.17, app:15.04, sub:25, bm:200, td:161.54, other:140.00 },
    mar: { crxRev:3243, nkvRev:0,      totRev:3243,    crxCogs:978.50, nkvCogs:0,  gAdsCrx:573.70, gAdsNkv:0,      social:0,     ship:611.88, txn:94.05, app:15.11, sub:25, bm:200, td:178.37, other:159.99 },
    apr: { crxRev:2672, nkvRev:0,      totRev:2672,    crxCogs:753,    nkvCogs:0,  gAdsCrx:575.65, gAdsNkv:0,      social:0,     ship:558.72, txn:77.49, app:15.27, sub:25, bm:200, td:146.96, other:160.00 },
    may: { crxRev:2446, nkvRev:222.95, totRev:2668.95, crxCogs:779,    nkvCogs:16, gAdsCrx:713.84, gAdsNkv:194.50, social:0,     ship:479.61, txn:77.40, app:14.99, sub:25, bm:180, td:146.79, other:164.00 }
  };
  var PERIODS = {
    may:  { months:['may'],                         label:'May 2026' },
    '3m': { months:['mar','apr','may'],             label:'Mar–May 2026' },
    '6m': { months:['jan','feb','mar','apr','may'], label:'Jan–May 2026 (YTD)' },
    '12m':{ months:['jan','feb','mar','apr','may'], label:'Jun 25–May 26', partial:true }
  };
  var KEYS = ['crxRev','nkvRev','totRev','crxCogs','nkvCogs','gAdsCrx','gAdsNkv','social','ship','txn','app','sub','bm','td','other'];
  function agg(months) { var a = {}; KEYS.forEach(function (k) { a[k] = 0; });
    months.forEach(function (m) { KEYS.forEach(function (k) { a[k] += M[m][k]; }); }); return a; }

  function money(n) { var r = Math.round(n); return (r < 0 ? '−£' : '£') + Math.abs(r).toLocaleString('en-GB'); }
  function paren(n) { return '(£' + Math.round(n).toLocaleString('en-GB') + ')'; }   // expense magnitude
  function pct(x) { return (x * 100).toFixed(1) + '%'; }

  // Contours Rx (full statement). combined=true → 'All' (adds Newnique revenue/COGS/Google Ads).
  function fullStatement(a, combined, label) {
    var netRev = combined ? a.totRev : a.crxRev;   // All = sheet's Total Shopify Revenue (Feb excludes the FBM order)
    var cogs   = a.crxCogs + (combined ? a.nkvCogs : 0);
    var gAds   = a.gAdsCrx + (combined ? a.gAdsNkv : 0);
    var gp = netRev - cogs, platform = a.txn + a.app;
    var pp = function (v) { return netRev ? pct(v / netRev) : ''; };
    var opex = [
      ['Advertising — Google Ads',    gAds,     'NKV Google Ads · Account Tracker'],
      ['Advertising — Social Media',  a.social, 'Meta / TikTok'],
      ['Shipping & Fulfilment',       a.ship,   'Beckdale — pick, ship & storage (inc. VAT)'],
      ['Platform & Transaction Fees', platform, 'Shopify 2.9% + app fees'],
      ['Software & Subscriptions',    a.sub,    'Shopify subscription'],
      ['Brand Manager',               a.bm,     ''],
      ['TD Consultancy Fee',          a.td,     '5.5% of Shopify revenue'],
      ['Other Operating Costs',       a.other,  'per Account Tracker']
    ];
    var totalOpex = opex.reduce(function (s, l) { return s + l[1]; }, 0);
    var netProfit = gp - totalOpex;
    var rows = [
      { kind: 'header', label: 'Revenue' },
      { kind: 'sub', label: 'Net Revenue', note: 'net of discounts & returns', val: money(netRev), pct: '100%' },
      { kind: 'header', label: 'Cost of Sales' },
      { label: 'COGS', note: 'Account Tracker unit costs', val: paren(cogs), pct: pp(cogs) },
      { kind: 'sub', label: 'Gross Profit', val: money(gp), pct: pp(gp) },
      { kind: 'header', label: 'Operating Expenses' }
    ];
    opex.forEach(function (l) { rows.push({ label: l[0], note: l[2], val: paren(l[1]), pct: pp(l[1]) }); });
    rows.push({ kind: 'sub', label: 'Total Operating Expenses', val: paren(totalOpex), pct: pp(totalOpex) });
    rows.push({ kind: 'total', label: 'Net Profit', note: netProfit < 0 ? 'Loss this period' : '', val: money(netProfit), pct: pp(netProfit) });
    return {
      kpis: [
        { bar: '#404935',      lbl: 'Net Revenue',  val: money(netRev),    dCls: 'df', d: 'Account Tracker',     s: label },
        { bar: 'var(--green)', lbl: 'Gross Profit', val: money(gp),        dCls: 'df', d: pp(gp) + ' margin',    s: 'after COGS' },
        { bar: 'var(--blue)',  lbl: 'Total OpEx',   val: money(totalOpex), dCls: 'df', d: pp(totalOpex),        s: 'inc. ads + fulfilment' },
        { bar: 'var(--amber)', lbl: 'Net Profit',   val: money(netProfit), dCls: netProfit < 0 ? 'dd' : 'du', d: pp(netProfit) + ' margin', s: netProfit < 0 ? 'loss' : 'profit' }
      ],
      rows: rows
    };
  }

  // Newnique — tracked LIGHT: own revenue / COGS / Google Ads only.
  function lightStatement(a, label) {
    var netRev = a.nkvRev, cogs = a.nkvCogs, gp = netRev - cogs, gAds = a.gAdsNkv, netProfit = gp - gAds;
    var pp = function (v) { return netRev ? pct(v / netRev) : ''; };
    return {
      kpis: [
        { bar: '#404935',      lbl: 'Net Revenue',    val: money(netRev), dCls: 'df', d: 'Account Tracker', s: label },
        { bar: 'var(--green)', lbl: 'Gross Profit',   val: money(gp),     dCls: 'df', d: pp(gp) + ' margin', s: 'after COGS' },
        { bar: 'var(--blue)',  lbl: 'Google Ad Spend',val: money(gAds),   dCls: 'df', d: 'Newnique',        s: '' },
        { bar: 'var(--amber)', lbl: 'Net Profit',     val: money(netProfit), dCls: netProfit < 0 ? 'dd' : 'du', d: 'pre-allocation', s: '' }
      ],
      rows: [
        { kind: 'header', label: 'Revenue' },
        { kind: 'sub', label: 'Net Revenue', note: 'net of discounts & returns', val: money(netRev), pct: netRev ? '100%' : '' },
        { kind: 'header', label: 'Cost of Sales' },
        { label: 'COGS', note: 'Account Tracker (£4/unit)', val: paren(cogs), pct: pp(cogs) },
        { kind: 'sub', label: 'Gross Profit', val: money(gp), pct: pp(gp) },
        { kind: 'header', label: 'Operating Expenses' },
        { label: 'Advertising — Google Ads', note: 'Newnique Google Ads · Account Tracker', val: paren(gAds), pct: pp(gAds) },
        { label: 'Shared costs (fulfilment, fees, subs)', note: 'tracked combined under Contours Rx', val: 'n/a', muted: true },
        { kind: 'total', label: 'Net Profit', note: 'before shared-cost allocation', val: money(netProfit), pct: pp(netProfit) }
      ]
    };
  }

  var crxInfo = 'Live from the NKV Beauty Account Tracker (Jan–May 2026). Revenue is net of discounts/returns; COGS uses the tracker’s estimated unit costs; expense lines are sheet actuals. Net Profit ties to the sheet’s “Profit after COGS”.';
  var nkvInfo = 'Newnique is tracked “light” — its own revenue, COGS and Google Ads. Shared D2C costs sit under Contours Rx; see the combined view under “All”.';
  var partialNote = 'Trailing-12-month view — the Account Tracker currently itemises Jan–May 2026, so this reflects YTD. Earlier-month expenses populate as they’re entered.';

  var statusList = [
    { label: 'Revenue (Tracker)',           status: 'live', note: 'Account Tracker · Jan–May 2026' },
    { label: 'COGS / unit costs',           status: 'est',  note: 'Tracker estimated unit costs' },
    { label: 'Google Ads spend',            status: 'live', note: 'Account Tracker (CRX + Newnique from May)' },
    { label: 'Social ad spend',             status: 'live', note: 'Account Tracker' },
    { label: 'Shipping & fulfilment',       status: 'live', note: 'Beckdale · Account Tracker' },
    { label: 'Platform & transaction fees', status: 'live', note: 'Shopify 2.9% + app fees' },
    { label: 'Software & subscriptions',    status: 'live', note: 'Shopify subscription' },
    { label: 'Brand Manager / TD fee',      status: 'live', note: 'Account Tracker' },
    { label: 'Other operating costs',       status: 'est',  note: 'Tracker residual (≈£160/mo)' }
  ];

  var contours = { label: 'Contours Rx UK', store: 'contours-rx.co.uk', statusList: statusList, info: crxInfo, byPeriod: {} };
  var newnique = { label: 'Newnique', store: 'newniquecare.com', statusList: [
      { label: 'Revenue (Tracker)',   status: 'live',  note: 'Account Tracker' },
      { label: 'COGS',                status: 'est',   note: '£4/unit (Account Tracker)' },
      { label: 'Google Ads spend',    status: 'live',  note: 'Account Tracker (from May)' },
      { label: 'Shared opex',         status: 'input', note: 'tracked combined under Contours Rx' }
    ], info: nkvInfo, byPeriod: {} };
  var all = { label: 'All Brands', store: 'Contours Rx + Newnique (combined)', statusList: statusList, info: crxInfo, byPeriod: {} };

  Object.keys(PERIODS).forEach(function (k) {
    var pr = PERIODS[k], a = agg(pr.months);
    var crx = fullStatement(a, false, pr.label), comb = fullStatement(a, true, pr.label), nkv = lightStatement(a, pr.label);
    if (pr.partial) { crx.info = comb.info = nkv.info = partialNote; }
    contours.byPeriod[k] = crx; all.byPeriod[k] = comb; newnique.byPeriod[k] = nkv;
  });

  window.DASHBOARD_DATA.sections.shopifypnl = { data: { contoursrx: contours, newnique: newnique, all: all } };
})();
