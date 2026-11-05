/* NKV Beauty — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 1–5 Nov 2026 (channel 71662311, seller A1SNRD9T28Z9ZM), native GBP.
   UK is the live market (real data). Ireland is early-stage and EUR-native — its £ figures are the
   actual €-sales converted at €1 ≈ £0.855. USA has small ad spend and sales — converted from
   USD at $1 ≈ £0.78; its Amazon campaigns were near-paused in October (spend $13.71, no ad-attributed sales).
   FULL re-bake for October 2026: dateRanges may/3m/6m/12m (3m = Aug–Oct, 6m = May–Oct, 12m = Nov 2025–
   Oct 2026) incl. YoY, sections.charts, advertising metrics/campaigns/mix/budgets, inventory (stockWarn is owned by the
   weekly Overview routine), products (tiles, table, brand groups), the Amazon P&L, Overview CVR and the whole Shopify page.
   Revenue/orders come from the settled getSalesByPeriod monthly buckets (GMT). September is RESTATED to the settled bucket
   (UK £12,430 → £12,315; total £12,841 → £12,726); all October MoM deltas use the settled September.
   UK ad spend / ad sales use the generated 'campaigns' reports per window (Oct £2,142.87 / £4,522.55 — identical to
   getAdvertisingByChannels). NOTE: the getSalesByPeriod monthly bucket shows £2,048.35 / £4,288.70 for October (~5% lower) —
   unexplained, flagged in the run log; the campaigns-report basis is used everywhere so the page is internally consistent.
   Still carried forward (flagged): advertising budget/forecast (Account Tracker gave no readable budget rows),
   supplier POs (live proxy), Shopify Returning-Customer rate (GA4 unreliable → '—').
   [TO CONFIRM] Contours Rx Shopify on-hand stock roughly quadrupled vs 4 Oct (Lids 739 → 2,809) — restock or sync change.
   Oct review notes: Amazon UK revenue ▼7.5% MoM (£12,315→£11,398) on lower sessions (5,282 vs 6,217); ad spend ▼ with
   TACOS down to 18.8% (Sep 22.7%). Shopify revenue ▼10.5% MoM (£1,499→£1,341).
   NOTE: the shared app.js trend-chart axis formatter honours client.currencyIcon ('£' set in config.js).
   dataSource.type is 'static' (no Sheet/Apps Script proxy for NKV yet). */
window.DASHBOARD_DATA = {
  dateRanges: {
  'may': {
    label: 'October 2026', shortLabel: 'October 2026',
    rev: '£11,602', revD: '▼ 8.8% MoM', revC: 'df', revS: 'vs £12,726 Sep',
    adSales: '£4,523', adSalesD: '▼ 6.9% MoM', adSalesC: 'df', adSalesS: '39.0% of revenue',
    tacos: '18.6%', tacosD: '▼ 4.9pp vs Sep', tacosC: 'du', tacosS: 'Target <20%',
    roas: '2.10×', roasD: '▲ 0.47× vs Sep', roasC: 'du', roasS: '454 orders · AOV £25.55',
    spend: '£2,154', spendD: '▼ 27.8% MoM', spendC: 'du', spendS: 'vs £2,985 Sep',
    tacosAd: '18.6%', tacosAdD: '▼ 4.9pp vs Sep', tacosAdC: 'du', tacosAdS: 'Target <20%',
    roasAd: '2.10×', roasAdD: '▲ 0.47× vs Sep', roasAdC: 'du', roasAdS: '£11,602 revenue',
    aov: '£25.55', aovD: '▼ £3.04 MoM', aovC: 'df', aovS: '454 orders Oct',
    mktRows: [
      ['UK','gb','—','£2,143','bb','UK ad-managed','£11,398','ba','18.8%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£105','bb','—'],
      ['USA','us','—','£11','bb','Ads near-paused Oct','£99','ba','10.8%'],
      ['Total',null,'—','£2,154','bb','All 3 markets live','£11,602','ba','18.6%']
    ],
    marketKpis: {
      uk: { rev:'£11,398', adSales:'£4,523', tacos:'18.8%', roas:'2.11×', spend:'£2,143', aov:'£25.84', tacosAd:'18.8%', roasAd:'2.11×', revC:'df', adSalesC:'df', tacosC:'du', roasC:'du', spendC:'du', aovC:'df', tacosAdC:'du', roasAdC:'du', tacosS:'Target <20%', roasS:'441 orders · AOV £25.84', roasAdS:'£11,398 revenue', aovD:'▼ £3.55 MoM', aovS:'441 orders Oct', adSalesS:'39.7% of revenue', revD:'▼ 7.5% MoM', revS:'vs £12,315 Sep', spendD:'▼ 23.3% MoM', spendS:'vs £2,793 Sep', tacosD:'▼ 3.9pp vs Sep', tacosAdD:'▼ 3.9pp vs Sep', roasD:'▲ 0.41× vs Sep', roasAdD:'▲ 0.41× vs Sep', adSalesD:'▼ 4.9% MoM' },
      irl: { rev:'£105', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£35.04', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'3 orders', roasAdS:'£105 revenue', aovD:'', aovS:'3 orders Oct', adSalesS:'No ad spend', revD:'▼ 50.8% MoM', revS:'vs £214 Sep', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£99', adSales:'£0', tacos:'10.8%', roas:'0.00×', spend:'£11', aov:'£9.90', tacosAd:'10.8%', roasAd:'0.00×', revC:'df', adSalesC:'df', tacosC:'du', roasC:'df', spendC:'du', aovC:'du', tacosAdC:'du', roasAdC:'df', tacosS:'Target <20%', roasS:'10 orders · AOV £9.90', roasAdS:'£99 revenue', aovD:'', aovS:'10 orders Oct', adSalesS:'No ad-attributed sales Oct', revD:'▼ 49.7% MoM', revS:'vs £197 Sep', spendD:'▼ 94.4% MoM', spendS:'vs £192 Sep', tacosD:'▼ 86.7pp vs Sep — small sample', tacosAdD:'▼ 86.7pp vs Sep — small sample', roasD:'▼ 0.53× vs Sep', roasAdD:'▼ 0.53× vs Sep', adSalesD:'▼ 100.0% MoM' }
    },
    // Campaign-type mix — real ad-type sales share + ACOS from the MerchantSpring campaigns report (UK, Oct 2026).
    // Every period (may/3m/6m/12m) is pulled from its own campaigns-report window — no estimates.
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.6,sales:'£3.9k',acos:'49.4%'}, {name:'Sponsored Brands',color:'#9caf78',pct:13.4,sales:'£0.6k',acos:'31.5%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.0,sales:'£0.0k',acos:'0.0%'} ] },
    // Same-Period-Last-Year comparison (Oct 2026 vs Oct 2025), MerchantSpring actuals (getSalesByPeriod,
    // interval:'w' summed — see the AMACX yoy{} note for why not interval:'M'). UK + Total (UK converted
    // £ + IRL €→£ + USA $→£ at the same static rates as the rest of this file) only: unlike AMACX, NKV's
    // ROAS is adSales÷adSpend (not revenue÷adSpend). Oct-2025 UK base £14080.68 sales / £2716.58 ad
    // spend / £6140.49 ad sales (weekly sum == monthly bucket to the penny). IRL's Oct-2025 base is negligible
    // (€75.18 total) and USA had zero Amazon sales a year prior — neither gets a per-market yoy entry; Total
    // folds their small prior-year contribution in.
    yoy: {
      revD:'▼ 18.0% YoY', revC:'df', revS:'vs £14,145 Oct 2025',
      spendD:'▼ 20.7% YoY', spendC:'du', spendS:'vs £2,717 Oct 2025',
      adSalesD:'▼ 26.3% YoY', adSalesC:'df', adSalesS:'vs £6,140 Oct 2025',
      tacosD:'▼ 0.6pp vs Oct 2025', tacosC:'du',
      tacosAdD:'▼ 0.6pp vs Oct 2025', tacosAdC:'du',
      roasD:'▼ 0.16× vs Oct 2025', roasC:'df',
      roasAdD:'▼ 0.16× vs Oct 2025', roasAdC:'df',
      marketKpis: {
        uk: { revD:'▼ 19.1% YoY', revC:'df', revS:'vs £14,081 Oct 2025', spendD:'▼ 21.1% YoY', spendC:'du', spendS:'vs £2,717 Oct 2025', adSalesD:'▼ 26.3% YoY', adSalesC:'df', adSalesS:'vs £6,140 Oct 2025', tacosD:'▼ 0.5pp vs Oct 2025', tacosC:'du', tacosAdD:'▼ 0.5pp vs Oct 2025', tacosAdC:'du', roasD:'▼ 0.15× vs Oct 2025', roasC:'df', roasAdD:'▼ 0.15× vs Oct 2025', roasAdC:'df' }
      }
    },
  },
  '3m': {
    label: 'Aug–Oct 2026', shortLabel: 'Aug–Oct 2026',
    rev: '£42,880', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£16,266', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '37.9% of revenue',
    tacos: '18.5%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.05×', roasD: '', roasC: 'df', roasS: '',
    spend: '£7,919', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '18.5%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.05×', roasAdD: '', roasAdC: 'df', roasAdS: '£42,880 revenue',
    aov: '£29.11', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£7,714','bb','UK ad-managed','£41,582','ba','18.6%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£551','bb','—'],
      ['USA','us','—','£205','bb','Real ad spend now','£746','br','27.5%'],
      ['Total',null,'—','£7,919','bb','3-month actuals','£42,880','ba','18.5%']
    ],
    marketKpis: {
      uk: { rev:'£41,582', adSales:'£16,165', tacos:'18.6%', roas:'2.10×', spend:'£7,714', aov:'£29.28', tacosAd:'18.6%', roasAd:'2.10×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£41,582 revenue', aovD:'', aovS:'', adSalesS:'38.9% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£551', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£39.39', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£551 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£746', adSales:'£101', tacos:'27.5%', roas:'0.49×', spend:'£205', aov:'£19.14', tacosAd:'27.5%', roasAd:'0.49×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£746 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'3-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.0,sales:'£13.9k',acos:'49.7%'}, {name:'Sponsored Brands',color:'#9caf78',pct:13.2,sales:'£2.1k',acos:'29.1%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.8,sales:'£0.1k',acos:'142.0%'} ] },
    // Period-aware Ad Metrics (Aug–Oct 2026) — all actuals (MerchantSpring generated campaigns reports, Aug–Oct 2026); top 13 campaigns by spend.
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£7,714', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£16,165', color:'brand'},
      {lbl:'ACOS',         val:'47.7%', color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.68'},
      {lbl:'Impressions',  val:'3.09M'},
      {lbl:'New-to-Brand', val:'9.4%', color:'green'}
    ],
campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£1,394',sales:'£2,940',acos:'47.4%',acosCls:'ba',roas:'2.11×',cpc:'£1.00',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£1,272',sales:'£1,374',acos:'92.6%',acosCls:'br',roas:'1.08×',cpc:'£0.98',status:'Paused',statusCls:'ba'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£621',sales:'£2,132',acos:'29.1%',acosCls:'bg',roas:'3.43×',cpc:'£0.60',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£619',sales:'£1,484',acos:'41.7%',acosCls:'ba',roas:'2.40×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£586',sales:'£693',acos:'84.6%',acosCls:'br',roas:'1.18×',cpc:'£0.33',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£470',sales:'£459',acos:'102.5%',acosCls:'br',roas:'0.98×',cpc:'£0.82',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£311',sales:'£3,506',acos:'8.9%',acosCls:'bg',roas:'11.28×',cpc:'£0.74',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£260',sales:'£398',acos:'65.4%',acosCls:'br',roas:'1.53×',cpc:'£0.36',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£253',sales:'£282',acos:'90.0%',acosCls:'br',roas:'1.11×',cpc:'£0.58',status:'Paused',statusCls:'ba'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£237',sales:'£601',acos:'39.4%',acosCls:'ba',roas:'2.54×',cpc:'£0.72',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£211',sales:'£211',acos:'100.0%',acosCls:'br',roas:'1.00×',cpc:'£0.72',status:'Active',statusCls:'bg'},
      {name:'UK · Mixed Re-targeting — SD Advertised Products Views Remarketing',type:'Sponsored Display',spend:'£192',sales:'£135',acos:'142.0%',acosCls:'br',roas:'0.70×',cpc:'£0.34',status:'Paused',statusCls:'ba'},
      {name:'UK · Newnique Serum Bundle OHAS — SP Auto',type:'Sponsored Products',spend:'£163',sales:'£143',acos:'113.7%',acosCls:'br',roas:'0.88×',cpc:'£1.00',status:'Active',statusCls:'bg'}
    ] } },
  },
  '6m': {
    label: 'May–Oct 2026 (6 months)', shortLabel: 'May–Oct 2026',
    rev: '£87,789', revD: '6-month actuals', revC: 'du', revS: '',
    adSales: '£35,811', adSalesD: '6-month actuals', adSalesC: 'df', adSalesS: '40.8% of revenue',
    tacos: '19.1%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.13×', roasD: '', roasC: 'df', roasS: '',
    spend: '£16,782', spendD: '6-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.1%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.13×', roasAdD: '', roasAdC: 'df', roasAdS: '£87,789 revenue',
    aov: '£28.07', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£16,473','bb','UK ad-managed','£84,073','ba','19.6%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£1,612','bb','—'],
      ['USA','us','—','£309','bb','Real ad spend now','£2,104','ba','14.7%'],
      ['Total',null,'—','£16,782','bb','6-month actuals','£87,789','ba','19.1%']
    ],
    marketKpis: {
      uk: { rev:'£84,073', adSales:'£35,655', tacos:'19.6%', roas:'2.16×', spend:'£16,473', aov:'£28.35', tacosAd:'19.6%', roasAd:'2.16×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£84,073 revenue', aovD:'', aovS:'', adSalesS:'42.4% of revenue', revD:'6-month actuals', revS:'', spendD:'6-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'6-month actuals' },
      irl: { rev:'£1,612', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£35.04', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£1,612 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£2,104', adSales:'£156', tacos:'14.7%', roas:'0.50×', spend:'£309', aov:'£18.14', tacosAd:'14.7%', roasAd:'0.50×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£2,104 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'6-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.5,sales:'£30.8k',acos:'48.0%'}, {name:'Sponsored Brands',color:'#9caf78',pct:13.0,sales:'£4.6k',acos:'30.7%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.6,sales:'£0.2k',acos:'131.1%'} ] },
    // Period-aware Ad Metrics (May–Oct 2026) — all actuals (MerchantSpring generated campaigns reports, May–Oct 2026); top 13 campaigns by spend.
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£16,473', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£35,655', color:'brand'},
      {lbl:'ACOS',         val:'46.2%', color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.75'},
      {lbl:'Impressions',  val:'6.81M'},
      {lbl:'New-to-Brand', val:'9.2%', color:'green'}
    ],
campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£3,542',sales:'£8,042',acos:'44.0%',acosCls:'ba',roas:'2.27×',cpc:'£1.07',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£3,231',sales:'£4,724',acos:'68.4%',acosCls:'br',roas:'1.46×',cpc:'£0.95',status:'Paused',statusCls:'ba'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£1,322',sales:'£4,578',acos:'28.9%',acosCls:'bg',roas:'3.46×',cpc:'£0.56',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£1,292',sales:'£3,281',acos:'39.4%',acosCls:'ba',roas:'2.54×',cpc:'£0.91',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£768',sales:'£658',acos:'116.9%',acosCls:'br',roas:'0.86×',cpc:'£0.88',status:'Paused',statusCls:'ba'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£701',sales:'£887',acos:'79.0%',acosCls:'br',roas:'1.27×',cpc:'£0.34',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£694',sales:'£672',acos:'103.4%',acosCls:'br',roas:'0.97×',cpc:'£0.72',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£556',sales:'£5,923',acos:'9.4%',acosCls:'bg',roas:'10.66×',cpc:'£0.73',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£433',sales:'£996',acos:'43.5%',acosCls:'ba',roas:'2.30×',cpc:'£0.78',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£412',sales:'£651',acos:'63.3%',acosCls:'br',roas:'1.58×',cpc:'£0.39',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£375',sales:'£389',acos:'96.4%',acosCls:'br',roas:'1.04×',cpc:'£0.71',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£296',sales:'£1,026',acos:'28.8%',acosCls:'bg',roas:'3.47×',cpc:'£0.86',status:'Active',statusCls:'bg'},
      {name:'UK · Mixed Re-targeting — SD Advertised Products Views Remarketing',type:'Sponsored Display',spend:'£263',sales:'£201',acos:'131.1%',acosCls:'br',roas:'0.76×',cpc:'£0.38',status:'Paused',statusCls:'ba'}
    ] } },
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Nov 2025–Oct 2026',
    rev: '£179,790', revD: 'Trailing 12 months', revC: 'du', revS: '',
    adSales: '£86,072', adSalesD: 'Trailing 12 months', adSalesC: 'df', adSalesS: '47.9% of revenue',
    tacos: '18.9%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.53×', roasD: '', roasC: 'df', roasS: '',
    spend: '£33,973', spendD: 'Trailing 12 months', spendC: 'df', spendS: '',
    tacosAd: '18.9%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.53×', roasAdD: '', roasAdC: 'df', roasAdS: '£179,790 revenue',
    aov: '£28.18', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£33,664','bb','UK ad-managed','£174,081','ba','19.3%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£3,606','bb','—'],
      ['USA','us','—','£309','bb','Real ad spend now','£2,104','ba','14.7%'],
      ['Total',null,'—','£33,973','bb','Trailing 12 months','£179,790','ba','18.9%']
    ],
    marketKpis: {
      uk: { rev:'£174,081', adSales:'£85,917', tacos:'19.3%', roas:'2.55×', spend:'£33,664', aov:'£28.26', tacosAd:'19.3%', roasAd:'2.55×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£174,081 revenue', aovD:'', aovS:'', adSalesS:'49.4% of revenue', revD:'Trailing 12 months', revS:'', spendD:'Trailing 12 months', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'Trailing 12 months' },
      irl: { rev:'£3,606', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£34.67', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£3,606 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£2,104', adSales:'£156', tacos:'14.7%', roas:'0.50×', spend:'£309', aov:'£18.14', tacosAd:'14.7%', roasAd:'0.50×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£2,104 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'Trailing 12 months', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:87.9,sales:'£75.5k',acos:'40.3%'}, {name:'Sponsored Brands',color:'#9caf78',pct:11.8,sales:'£10.2k',acos:'28.2%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.3,sales:'£0.2k',acos:'154.3%'} ] },
    // Period-aware Ad Metrics (Nov 2025–Oct 2026) — all actuals (MerchantSpring generated campaigns reports, Nov 2025–Oct 2026); top 13 campaigns by spend.
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£33,664', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£85,917', color:'brand'},
      {lbl:'ACOS',         val:'39.2%', color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.77'},
      {lbl:'Impressions',  val:'12.41M'},
      {lbl:'New-to-Brand', val:'8.0%', color:'green'}
    ],
campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£8,970',sales:'£23,538',acos:'38.1%',acosCls:'ba',roas:'2.62×',cpc:'£1.01',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£5,928',sales:'£11,212',acos:'52.9%',acosCls:'ba',roas:'1.89×',cpc:'£0.88',status:'Paused',statusCls:'ba'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£2,770',sales:'£10,116',acos:'27.4%',acosCls:'bg',roas:'3.65×',cpc:'£0.55',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£2,148',sales:'£5,683',acos:'37.8%',acosCls:'ba',roas:'2.65×',cpc:'£0.81',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£1,479',sales:'£3,145',acos:'47.0%',acosCls:'ba',roas:'2.13×',cpc:'£1.07',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£1,367',sales:'£15,630',acos:'8.7%',acosCls:'bg',roas:'11.43×',cpc:'£0.70',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£1,320',sales:'£1,224',acos:'107.8%',acosCls:'br',roas:'0.93×',cpc:'£0.80',status:'Paused',statusCls:'ba'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£1,254',sales:'£1,518',acos:'82.6%',acosCls:'br',roas:'1.21×',cpc:'£0.77',status:'Paused',statusCls:'ba'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£791',sales:'£1,727',acos:'45.8%',acosCls:'ba',roas:'2.18×',cpc:'£0.92',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£715',sales:'£850',acos:'84.1%',acosCls:'br',roas:'1.19×',cpc:'£0.68',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£701',sales:'£887',acos:'79.0%',acosCls:'br',roas:'1.27×',cpc:'£0.34',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Manual',type:'Sponsored Products',spend:'£626',sales:'£1,304',acos:'48.0%',acosCls:'ba',roas:'2.08×',cpc:'£0.69',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£500',sales:'£1,827',acos:'27.4%',acosCls:'bg',roas:'3.65×',cpc:'£0.84',status:'Active',statusCls:'bg'}
    ] } },
  },
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
      cvr: { val:'8.8%', note:'October 2026 · 5,282 sessions', sub:'UK · session conversion' },
      // FBA Stock Warnings = Amazon FBA low-stock / availability only (real, MerchantSpring UK 5 Nov 2026).
      // 21 of the 74 UK listings are at 0 stock (out of stock / suppressed) — 20 dormant Girlactik
      // long-tail SKUs plus Lilibeth Pink GB 2-Pack (OOS since 3 Oct); 42 listings sold in October.
      // (Account-health/strategy alerts moved to their own section — see ACCOUNT-HEALTH note below.)
      // ---- Overview cards — baked WEEKLY (config.overviewSource:'notion'; runbook tools/weekly-overview.routine.md) ----
      // First baked 12 Oct 2026 (review used as approved for this run by Ryan's instruction). The sheet-era
      // tasksSpec / flagsSpec / completedSpec above are ignored while overviewSource is 'notion'.
      // healthMgmtSpec ← "02 Nov 2026 - NKV Account Health Review" › Notes for client (🔴/⚠️ lines; ✅ lines left out;
      //                  the UK inventory note is folded into stockWarn). Done lines: US sales back in line (2 Nov review, Resolved)
      //                  and Seller Central access restored (26 Oct review).
      // adsStrategySpec ← "NKV — Amazon PPC Strategy" task › Notes for Client (updated 4 Nov 2026) + Weekly log (31 Oct and 22 Oct actions) for done items.
      //                  Note wording changed to the house term "stock-up".
      // stockWarn      ← NKV_UK + NKV_US_sku-sync_2026-11-02 (MerchantSpring, 3 Oct–1 Nov 2026, FBA). Thresholds ≤14d / soon ≤30d.
      //                  The dormant Girlactik long-tail (no sale in 120+ days) is left off. Card title/sub come from config.layout.relabel.
      healthMgmtSpec: { badge:'2 open', subLabel:'Weekly review · 2 Nov 2026', items:[
        {level:'red',title:'US — Compliance',sub:'In progress · GrowPod listing remains removed; Amazon\'s review is still in progress'},
        {level:'amber',title:'US — Account Health',sub:'In progress · please confirm the payment card in Seller Central has been updated'},
        {level:'green',title:'US — sales back in line',sub:'Done 2 Nov · $28 against a $28 four-week average'},
        {level:'green',title:'US — Seller Central access restored',sub:'Done 26 Oct · account is accessible again'}
      ] },
      adsStrategySpec: { badge:'Q4 push', subLabel:'Weekly review · 4 Nov 2026', items:[
        {level:'amber',title:'UK — White Luxe',sub:'In progress · the Whitening Strips ads stay efficient (37% ACoS, 4 weeks to 21 Oct). The Whitening Kit\'s ads still cost too much for each sale (95%). The Kit\'s new £42.95 price is being given two weeks of data before we change its ads (review 17 Nov). Kit ads showed far less in the last week of October; we recommend resetting their bids so the Kit stays visible into Black Friday'},
        {level:'amber',title:'UK — Newnique',sub:'In progress · the November–January growth plan is under way and is judged on total sales, not ad returns alone. The Organic serum\'s ads still cost more than the sales they drove in the 4 weeks to 21 Oct (145%), improving to 90% in 28 Oct–3 Nov (early figures). We recommend tighter efficiency targets on the serums for November. The GrowPod Device is down to its last unit and the Scalp Exfoliator to 16 units (4 Nov): we recommend a stock-up of both and holding their ads back until stock lands'},
        {level:'amber',title:'US',sub:'In progress · small, capped test campaigns restarted on the serums and the scalp exfoliant at the end of October. Spend is still small ($16 in 28 Oct–3 Nov) and the exfoliant ads have barely started showing, so we recommend raising their starting bids. First results are due mid-November'},
        {level:'muted',title:'UK — Overall',sub:'In the 4 weeks to 21 Oct, Sponsored Products ad spend was £1,843 against total UK sales of £10,801, so advertising cost 17% of total sales (TACoS; 21% in the 4 weeks before), inside the 20% target. Ad spend as a share of the sales the ads drove (ACoS) improved to 47% from 56%'},
        {level:'muted',title:'UK — Lids by Design',sub:'Still the main earner. Brand-name searches stay very efficient (ad spend 9% of the sales they drove) and non-brand ads ran at 45% against a 40% target (4 weeks to 21 Oct). Stock is healthy ahead of Black Friday (Assortment Pack 145 units, 4mm 94 units, 4 Nov)'},
        {level:'green',title:'US — test campaigns restarted',sub:'Done 31 Oct · serums and scalp exfoliant, small capped budget'},
        {level:'green',title:'UK — Whitening Kit ad budget reduced',sub:'Done 22 Oct · daily budget cut while the Kit\'s ads are under review'}
      ] },
      stockWarn: { badge:'2 stock-up · 2 OOS', subLabel:'SKU sync · per market (FBA) · 2 Nov 2026', items:[
        {level:'red',title:'Girlactik Gel Eyeliner Pure Black — OOS UK',sub:'B099KVFGZP · since 5 Oct'},
        {level:'red',title:'Lilibeth Brow Shaper Pink 2-Pack — OOS UK',sub:'B0FFDPBJP2 · since 3 Oct · please confirm a stock-up date'},
        {level:'red',title:'Lilibeth Brow Shaper Purple 2-Pack — stock-up now',sub:'B0FFDSR57K · UK · ~9 days cover · 2 units · please confirm a stock-up date'},
        {level:'amber',title:'Newnique GrowPod Device — stock-up soon',sub:'B0F8QKKZMQ · UK · ~30 days cover · 2 units'}
      ] }
      // Account Health (strategy/performance alerts) card removed from the NKV Overview per client request.
    },
    pnl: {
      // Oct 2026 UK channel P&L, accrual basis (MerchantSpring getStoreProfitAndLoss). Report lines: no tax line is
      // returned, so 'Product sales' is derived (net revenue minus the other income lines) so the rows foot — review.
      // Per-unit uses 471 UK units sold in Oct (getSalesByPeriod) [TO CONFIRM basis]. Reimbursements returned negative (-£22.53) — review.
      statement: {
        fixedLabel: 'October 2026 (1–31) · financial basis (MerchantSpring)',
        summary: [ {val:'£9,128',lbl:'Net Revenue',color:'brand'}, {val:'£7,652',lbl:'Total Costs',color:'red'}, {val:'£1,476',lbl:'Net Profit',color:'amber'} ],
        margin: { pct:'16.2%', pctColor:'amber', note:'October 2026 (31-day) · financial basis (MerchantSpring) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£9,128'},
          {lbl:'Advertising', val:'-£2,031', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-£2,573', color:'red'},
          {lbl:'COGS', val:'-£3,040', color:'red'},
          {lbl:'Net Profit', val:'£1,476', color:'amber', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£9,128',adspend:'£2,031',net:'£1,476',netColor:'amber',margin:'16.2%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'£9,445', pct:'103.5%', unit:'£20.05'},
            {lbl:'Refunds', amount:'-£217', pct:'-2.4%', unit:'-£0.46'},
            {lbl:'Reimbursements', amount:'-£23', pct:'-0.2%', unit:'-£0.05'},
            {lbl:'Promotions', amount:'-£265', pct:'-2.9%', unit:'-£0.56'},
            {lbl:'Other income', amount:'£187', pct:'2.0%', unit:'£0.40'},
            {lbl:'Net revenue', amount:'£9,128', pct:'100.0%', unit:'£19.38', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£2,031', pct:'22.3%', unit:'£4.31'},
            {lbl:'Selling fees', amount:'£1,599', pct:'17.5%', unit:'£3.39'},
            {lbl:'Shipping & fulfilment fees', amount:'£975', pct:'10.7%', unit:'£2.07'},
            {lbl:'Cost of goods', amount:'£3,040', pct:'33.3%', unit:'£6.45'},
            {lbl:'Refunds & returns overheads', amount:'£8', pct:'0.1%', unit:'£0.02'},
            {lbl:'Other', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£7,652', pct:'83.8%', unit:'£16.25', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£1,476', pct:'16.2%', unit:'£3.13', total:true, profit:true},
            {lbl:'Profit %', amount:'16.2%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'18.1%'},
            {lbl:'Ad spend', amount:'£2,031'}
          ] }
        ]
      }
    },
    advertising: {
      // Real October 2026 ad totals (MerchantSpring generated 'campaigns' report, UK channel, GBP) —
      // £2142.87 spend / £4522.55 ad sales. Matches getAdvertisingByChannels exactly. The getSalesByPeriod monthly bucket
      // (£2048.35 / £4288.70) runs ~5% lower for October only — see the run log; the report basis is used throughout.
      metrics: [
      {lbl:'Total Spend',  val:'£2,143', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£4,523', color:'brand'},
      {lbl:'ACOS',         val:'47.4%', color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.65'},
      {lbl:'Impressions',  val:'731K'},
      {lbl:'New-to-Brand', val:'7.3%', color:'green'}
    ],
      // Ad budget = £3,000/mo (NKV tracker · Marketing Activity sheet) vs real actual spend (MerchantSpring, UK Oct 2026 = £2142.87).
      // The tracker's budget rows could not be re-read this run (Drive read returned sample rows only) — the £3,000 budget and
      // flat £3,500/mo forward forecast are carried from earlier bakes; re-confirm against the sheet [TO CONFIRM].
      budgets: {
        subLabel: 'October 2026 · budget vs actual',
        headers: ['Monthly Budget','October Actual','Variance','Utilisation'],
        rows: [
          {name:'United Kingdom', flag:'gb', cells:['£3,000','£2,143','▼ £857 under','71%']},
          {name:'Total', total:true,         cells:['£3,000','£2,143','▼ £857 under','71%']}
        ]
      },
      forecast: [
        {month:'Nov', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Dec', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Real per-campaign actuals (MerchantSpring generated campaigns report, UK channel, October 2026, top 13 by spend).
      // This is the 'may' default; 3m/6m/12m each override it via their own sec.advertising.campaigns.
      campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£276',sales:'£447',acos:'61.7%',acosCls:'br',roas:'1.62×',cpc:'£0.79',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£256',sales:'£335',acos:'76.5%',acosCls:'br',roas:'1.31×',cpc:'£0.92',status:'Paused',statusCls:'ba'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£255',sales:'£222',acos:'114.9%',acosCls:'br',roas:'0.87×',cpc:'£0.39',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£247',sales:'£686',acos:'36.0%',acosCls:'ba',roas:'2.78×',cpc:'£0.85',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£191',sales:'£605',acos:'31.5%',acosCls:'ba',roas:'3.18×',cpc:'£0.57',status:'Active',statusCls:'bg'},
      {name:'UK · Focus keywords — SP KB_0 Manual',type:'Sponsored Products',spend:'£120',sales:'£173',acos:'69.2%',acosCls:'br',roas:'1.44×',cpc:'£1.25',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£110',sales:'£1,045',acos:'10.6%',acosCls:'bg',roas:'9.47×',cpc:'£0.84',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Serum Bundle OHAS — SP Auto',type:'Sponsored Products',spend:'£84',sales:'£28',acos:'295.1%',acosCls:'br',roas:'0.34×',cpc:'£1.01',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£78',sales:'£118',acos:'65.6%',acosCls:'br',roas:'1.53×',cpc:'£0.37',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Organic Hair Oil — SP Auto',type:'Sponsored Products',spend:'£73',sales:'£33',acos:'217.9%',acosCls:'br',roas:'0.46×',cpc:'£0.88',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£72',sales:'£177',acos:'40.5%',acosCls:'ba',roas:'2.47×',cpc:'£0.76',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Organic Hair Oil — SP Manual',type:'Sponsored Products',spend:'£48',sales:'£70',acos:'68.3%',acosCls:'br',roas:'1.46×',cpc:'£0.60',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£36',sales:'£75',acos:'47.5%',acosCls:'ba',roas:'2.10×',cpc:'£0.65',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from the MerchantSpring product report (qty + days-cover per listing, 5 Nov 2026; sales = October).
      // 42 UK listings sold in October; 41 of them are in stock (Lilibeth Pink 2-Pack OOS since 3 Oct). Stock-up watch = selling
      // listings under 30 days cover (or OOS). No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green', lbl:'In Stock', val:'41', dCls:'du', d:'SKUs · 1 OOS now', s:'of 42 sold listings'},
        {bar:'#404935', lbl:'Units on Hand', val:'1,384', dCls:'df', d:'FBA total', s:'across 42 selling SKUs'},
        {bar:'amber', lbl:'Stock-up Watch', val:'4', dCls:'df', dColor:'amber', d:'selling · <30d cover', s:'see priority list'},
        {bar:'green', lbl:'Buy Box (Oct)', val:'99.6%', dCls:'du', d:'featured-offer %', s:'vs 99.4% Sep'}
      ],
      stock: [
        {dot:'dg', name:'Contours Rx Lids by Design — Assortment 4–7mm', note:'B0FYR8DQ2G · UK · top seller (70/mo)', units:'145 units', days:'~70 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 4mm', note:'B08MJ1PSXN · UK · Contours Rx', units:'93 units', days:'~66 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 5mm', note:'B018EHTG5K · UK · Contours Rx', units:'67 units', days:'~96 days'},
        {dot:'dg', name:'White Luxe Teeth Whitening Kit', note:'B08SCS43Q1 · UK · White Luxe', units:'71 units', days:'~125 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 6mm', note:'B018EHOJ2K · UK · Contours Rx', units:'52 units', days:'~56 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 7mm', note:'B018EDU1DA · UK · Contours Rx', units:'59 units', days:'~48 days'},
        {dot:'da', name:'Newnique Scalp Renewal Exfoliant', note:'B0F8QLYNMQ · UK · low cover', units:'16 units', unitsColor:'amber', days:'~21 days', daysColor:'amber'},
        {dot:'da', name:'Lilibeth Brow Shaper Purple 2-Pack', note:'B0FFDSR57K · UK · low cover', units:'1 unit', unitsColor:'red', days:'~4 days', daysColor:'red'}
      ],
      restock: [
        {level:'red', title:'Lilibeth Brow Shaper Purple 2-Pack — UK', sub:'B0FFDSR57K · ~4 days cover · 1 unit · selling 7/mo — stock-up this week'},
        {level:'red', title:'Lilibeth Brow Shaper Pink 2-Pack — UK', sub:'B0FFDPBJP2 · out of stock since 3 Oct · sold 3 in Oct — stock-up this week'},
        {level:'amber', title:'Newnique Scalp Renewal Exfoliant — UK', sub:'B0F8QLYNMQ · ~21 days cover · 16 units · selling 13/mo — stock-up soon'},
        {level:'amber', title:'Newnique GrowPod Device — UK', sub:'B0F8QKKZMQ · ~30 days cover · 1 unit · selling 1/mo — stock-up soon'}
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
      // Per-market FBA stock (MerchantSpring product report, 5 Nov 2026). 'all'/'uk' use the default
      // kpis/stock/restock above. Ireland ships FBA from the UK pool (early stage); USA is the Newnique-only
      // seller account (4 live ASINs, all in stock). Selected via the market chip (app.js).
      kpisByMarket: {
        irl: [
          {bar:'green', lbl:'In Stock', val:'23', dCls:'du', d:'of 25 listings', s:'2 OOS · Girlactik Black & Brown'},
          {bar:'#404935', lbl:'Units on Hand', val:'1,088', dCls:'df', d:'FBA total', s:'ships from UK pool'},
          {bar:'green', lbl:'Stock-up Watch', val:'0', dCls:'du', d:'healthy cover', s:'early stage · low velocity'},
          {bar:'amber', lbl:'Out of Stock', val:'2', dCls:'df', dColor:'amber', d:'none selling in Oct', s:'B099KVFGZP · B09QRJ4Y44'}
        ],
        usa: [
          {bar:'green', lbl:'In Stock', val:'4', dCls:'du', d:'of 4 ASINs', s:'Newnique · 0 OOS'},
          {bar:'#404935', lbl:'Units on Hand', val:'235', dCls:'df', d:'FBA total', s:'across 4 SKUs'},
          {bar:'green', lbl:'Stock-up Watch', val:'0', dCls:'du', d:'healthy cover', s:'all 4 in stock · 100+ days'},
          {bar:'green', lbl:'Out of Stock', val:'0', dCls:'du', d:'catalogue 4 SKUs', s:'all in stock'}
        ]
      },
      stockByMarket: {
        irl: [
          {dot:'dg', name:'Contours Rx Assortment 4–7mm', note:'B0FYR8DQ2G · IE · Contours Rx', units:'150 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 4mm', note:'B08MJ1PSXN · IE · Contours Rx', units:'99 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 5mm', note:'B018EHTG5K · IE · Contours Rx', units:'72 units', days:'ample'},
          {dot:'dg', name:'White Luxe Teeth Whitening Kit', note:'B08SCS43Q1 · IE · White Luxe', units:'71 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 7mm', note:'B018EDU1DA · IE · Contours Rx', units:'68 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 6mm', note:'B018EHOJ2K · IE · Contours Rx', units:'54 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 8mm', note:'B07Y2P3THB · IE · Contours Rx · sold in Oct', units:'38 units', days:'ample'},
          {dot:'dr', name:'Girlactik Gel Eyeliner — Pure Black', note:'B099KVFGZP · IE · out of stock since 28 Sep', units:'0 units', unitsColor:'red', days:'OOS', daysColor:'red'}
        ],
        usa: [
          {dot:'dg', name:'Newnique Hair Loss Serum', note:'B0F8QQGM8Y · US · top seller in Oct (5 units)', units:'60 units', days:'ample'},
          {dot:'dg', name:'Newnique Scalp Exfoliant', note:'B0F8QLYNMQ · US · 3 units in Oct', units:'61 units', days:'ample'},
          {dot:'dg', name:'Newnique Organic Hair Growth Oil', note:'B0F8QQ4M2G · US · 3 units in Oct', units:'47 units', days:'ample'},
          {dot:'dg', name:'Newnique Advanced Hair Growth Serum', note:'B0F8QMT775 · US · no sales in Oct', units:'67 units', days:'ample'}
        ]
      },
      // NB: rows in these per-market lists must NOT mention a *different* market's code (UK/USA/DE…) —
      // applyMarketFilter scans row text and would hide a row tagged with a market other than the chip.
      restockByMarket: {
        irl: [
          {level:'amber', title:'Girlactik Gel Eyeliner — Pure Black (IE)', sub:'B099KVFGZP · out of stock since 28 Sep · not selling in Oct · low priority — stock-up with the next Girlactik shipment'}
        ],
        usa: [
          {level:'green', title:'No stock-up needed — all 4 Newnique SKUs have 100+ days cover', sub:'4 live ASINs · 235 units on hand · 11 units sold in Oct'}
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
      // are the per-market overlays), same convention as dateRanges. Revenue = current settled monthly
      // buckets (GMT) — Sep restated to the settled bucket (£12,315). Oct ad spend = campaigns report (£2,143, TACOS 18.8%);
      // May–Aug ad spend as previously reconciled; Sep UK spend £2,793 / TACOS 22.7% (getAdvertisingByChannels, settled).
      months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      rev: { all:[15290, 14079, 13122, 17869, 12315, 11398], uk:[15290, 14079, 13122, 17869, 12315, 11398], irl:[481, 224, 356, 233, 214, 105], usa:[0, 644, 714, 451, 197, 99] },
      adSpend: { all:[3241, 2932, 2593, 2779, 2793, 2143], uk:[3241, 2932, 2593, 2779, 2793, 2143], irl:[0,0,0,0,0,0], usa:[0, 29, 74, 3, 192, 11] },
      adTacos: { all:[21.2, 20.8, 19.8, 15.6, 22.7, 18.8], uk:[21.2, 20.8, 19.8, 15.6, 22.7, 18.8], irl:[0,0,0,0,0,0], usa:[0, 4.5, 10.4, 0.7, 97.5, 10.8] }
    }
  }
};

/* Products page — period + MARKET aware (MerchantSpring, 1 Nov 2026). The KPI row, the
   Performance-by-Market table and the Sales-by-Brand groups all now follow the date selector (and the
   table + groups follow the market chip). UK = channel actuals; brand splits / Top Brand Rev from the
   product report; Ireland is early-stage €-converted; USA placed its first real orders in June 2026.
   'may' is exact per-brand product-level data; 3m/6m/12m brand splits are allocated from June's real
   per-brand mix applied to each window's real UK total (same methodology as Ireland's split below) —
   these per-period structures supersede the static products.kpis/table/groups above (kept as the
   June fallback). */
(function () {
  var P = window.DASHBOARD_DATA.sections.products;
  var LBL = { may: 'Oct', '3m': '3-mo', '6m': '6-mo', '12m': '12-mo' };
  var UK = {
    may:  { rev:'£11,398', units:471, orders:441, aov:'£25.84', cvr:'8.8%', asp:'£24.20', topRev:'£8,132', topPct:'71%', sold:42 },
    '3m': { rev:'£41,582', units:1556, orders:1420, aov:'£29.28', cvr:'8.2%', asp:'£26.72', topRev:'£30,234', topPct:'73%', sold:51 },
    '6m': { rev:'£84,073', units:3216, orders:2966, aov:'£28.35', cvr:'8.8%', asp:'£26.14', topRev:'£59,701', topPct:'71%', sold:54 },
    '12m': { rev:'£174,081', units:6626, orders:6161, aov:'£28.26', cvr:'8.3%', asp:'£26.27', topRev:'£119,403', topPct:'69%', sold:78 }
  };
  var IRL = {
    may:  { rev:'£105', units:3, orders:3, aov:'£35.04', cvr:'2.1%' },
    '3m': { rev:'£551', units:15, orders:14, aov:'£39.39', cvr:'2.9%' },
    '6m': { rev:'£1,612', units:49, orders:46, aov:'£35.04', cvr:'3.7%' },
    '12m': { rev:'£3,606', units:111, orders:104, aov:'£34.67', cvr:'3.8%' }
  };
  var GROUPS = {
    // [name, sales, units, %share, adSpend, TACOS, tacosCls, CVR, cvrCls] — all four periods re-baked
    // 1 Nov 2026 from a fresh MerchantSpring pull (generated salesByProduct reports, GMT, includeTax:true, grouped by brand;
    // generated trafficAndConversion (view:'skus') reports summed by brand give sessions → CVR = ordered units ÷ sessions).
    // Product-report brand totals reconcile to the channel's settled monthly buckets within £1 in every window (Oct £11,397.52
    // exact). Product-level ad spend excludes unallocated campaign spend (Oct £1,942 vs channel £2,143), so TACOS is a floor.
    // Girlactik: no Oct sales (Pure Black OOS since 28 Sep) → row kept at £0 with '—'; 3m CVR '—' (34 sessions).
    // 12m adds a "While and Wonder" line (Tummy Time play mat, £730, last sold 24 Jan 2026).
    // bg <20% · ba 20–40% · br >40% (TACOS); CVR bg ≥8% · ba 3–8% · br <3%.
    may:  [['Contours Rx — Eyelid Strips','£8,132',245,'71%','£642','7.9%','bg','11.2%','bg'],['Newnique — Hair Growth','£954',70,'8%','£420','44.1%','br','7.1%','ba'],['White Luxe — Teeth Whitening','£917',38,'8%','£436','47.5%','br','5.6%','ba'],['Lilibeth — Brow & Dermaplaning','£881',95,'8%','£109','12.4%','bg','18.3%','bg'],['Hydrte — Travel Bottles','£513',23,'4%','£334','65.2%','br','2.4%','br'],['Girlactik — Eyeliner','£0',0,'0%','£0','—','bb','—','bb']],
    '3m': [['Contours Rx — Eyelid Strips','£30,234',888,'73%','£2,392','7.9%','bg','10.7%','bg'],['Newnique — Hair Growth','£3,598',184,'9%','£1,844','51.3%','br','4.7%','ba'],['White Luxe — Teeth Whitening','£3,140',112,'8%','£1,606','51.2%','br','5.2%','ba'],['Lilibeth — Brow & Dermaplaning','£2,532',275,'6%','£380','15.0%','bg','18.3%','bg'],['Hydrte — Travel Bottles','£1,820',82,'4%','£867','47.7%','br','2.6%','br'],['Girlactik — Eyeliner','£257',15,'1%','£2','0.7%','bg','—','bb']],
    '6m': [['Contours Rx — Eyelid Strips','£59,701',1765,'71%','£5,547','9.3%','bg','10.5%','bg'],['White Luxe — Teeth Whitening','£8,437',286,'10%','£3,814','45.2%','br','5.6%','ba'],['Newnique — Hair Growth','£6,642',367,'8%','£3,374','50.8%','br','5.3%','ba'],['Lilibeth — Brow & Dermaplaning','£5,578',607,'7%','£931','16.7%','bg','18.8%','bg'],['Hydrte — Travel Bottles','£2,422',110,'3%','£1,134','46.8%','br','2.7%','br'],['Girlactik — Eyeliner','£1,294',81,'2%','£252','19.5%','bg','22.1%','bg']],
    '12m': [['Contours Rx — Eyelid Strips','£119,403',3548,'69%','£12,774','10.7%','bg','9.1%','bg'],['White Luxe — Teeth Whitening','£20,447',622,'12%','£6,841','33.5%','ba','5.2%','ba'],['Newnique — Hair Growth','£12,141',568,'7%','£5,740','47.3%','br','4.8%','ba'],['Lilibeth — Brow & Dermaplaning','£11,957',1273,'7%','£2,276','19.0%','bg','17.0%','bg'],['Girlactik — Eyeliner','£6,981',464,'4%','£2,030','29.1%','ba','10.2%','bg'],['Hydrte — Travel Bottles','£2,422',110,'1%','£1,134','46.8%','br','2.7%','br'],['While and Wonder — Tummy Time Play Mat','£730',41,'0%','£0','0.0%','bg','6.8%','ba']]
  };
  function num(x) { return x.toLocaleString('en-GB'); }
  function gbp(s) { return Number(String(s).replace(/[^0-9.]/g, '')); }
  var USA = {
    may:  { rev:'£99', units:11, orders:10, aov:'£9.90' },
    '3m': { rev:'£746', units:48, orders:39, aov:'£19.14' },
    '6m': { rev:'£2,104', units:172, orders:116, aov:'£18.14' },
    '12m': { rev:'£2,104', units:172, orders:116, aov:'£18.14' }
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
  function usaCards(a, lbl) { return [
    { bar:'#404935',      lbl:'Active SKUs',    val:'4',           dCls:'df', d:'Newnique · live', s:'trading since Jun 2026' },
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:a.rev,         dCls:'df', d:'Newnique',         s:'~100% of USA' },
    { bar:'var(--blue)',  lbl:'Orders',         val:num(a.orders), dCls:'df', d:lbl + ' actuals',   s:'AOV ' + a.aov },
    { bar:'var(--amber)', lbl:'ASP',            val:a.aov,         dCls:'df', d:lbl + ' avg',       s:'per unit' }
  ]; }
  function rows(u, r, a) { return [
    { name:'United Kingdom', flag:'gb', revenue:u.rev, units:num(u.units), orders:num(u.orders), cvr:u.cvr, cvrCls:'bg', aov:u.aov },
    { name:'Ireland',        flag:'ie', revenue:r.rev, units:num(r.units), orders:num(r.orders), cvr:r.cvr, cvrCls:'ba', aov:r.aov },
    { name:'United States',  flag:'us', revenue:a.rev, units:num(a.units), orders:num(a.orders), cvr:'—',   cvrCls:'bb', aov:a.aov }
  ]; }
  function grp(g) { return g.map(function (x) { return { name:x[0], sales:x[1], units:num(x[2]), pct:x[3], adSpend:x[4], tacos:x[5], tacosCls:x[6], cvr:x[7], cvrCls:x[8], oosRate:'0%', oosCls:'bg' }; }); }
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
  // USA — Newnique only, 100% of USA. Real October ad spend/TACOS (£11 / 10.8%) are from the October MerchantSpring
  // monthly bucket (US$13.71 / US$126.93) only — no per-window USA product-level ad-spend pull, so 3m/6m/12m show '—'
  // rather than an unreconciled number.
  function usaGroups(a, p) {
    return [
      { name:'Newnique — Hair Growth', sales:a.rev, adSpend: p==='may' ? '£11' : '—', tacos: p==='may' ? '10.8%' : null,
        tacosCls: p==='may' ? 'bg' : 'br', units:num(a.units), pct:'100%', oosRate:'0%', oosCls:'bg' }
    ];
  }
  P.kpisByPeriod = {}; P.tableByPeriod = {}; P.groupsByPeriod = {};
  ['may', '3m', '6m', '12m'].forEach(function (p) {
    var u = UK[p], r = IRL[p], a = USA[p], lbl = LBL[p], uc = ukCards(u, lbl), g = grp(GROUPS[p]);
    P.kpisByPeriod[p]   = { all:allCards(u, r, a, lbl), uk:uc, irl:irlCards(r, lbl), usa:usaCards(a, lbl) };
    P.tableByPeriod[p]  = rows(u, r, a);
    P.groupsByPeriod[p] = { all:g, uk:g, irl:irlGroups(r), usa:usaGroups(a, p) };
  });
})();

/* ============================================================================================
   SHOPIFY (D2C) — sections.shopify  ·  brand-filtered: All / Newnique / Contours Rx (2 stores)
   --------------------------------------------------------------------------------------------
   'may' (October 2026), '3m' (Aug–Oct), '6m' (May–Oct) and '12m' (Nov 2025–Oct 2026) re-baked 1 Nov 2026, native
   GBP, Contours Rx order-side = TOTAL REVENUE INCLUDING VAT (includeTax:true; Oct £1,340.79 reconciles to the
   penny between the monthly bucket and the per-product pull, and all four windows' product sums equal the
   monthly-bucket sums). VAT only started appearing in the data mid-year; earlier months carry none.
   Pairs two sources, mirroring the Amazon side:
   • ORDER-SIDE (revenue, orders, AOV, units, product mix, stock-on-hand) → MerchantSpring's Shopify
     channels — Contours Rx ch 33616599, Newnique ch 110450469.
   • SESSION-SIDE (sessions, CVR, the cart→checkout→purchase funnel, traffic-by-channel) → GA4 via the
     Reporting Ninja connector (properties/394327082 Contours Rx, properties/506386258 Newnique).
   Revenue fell 10.5% MoM in October (£1,499→£1,341); GA4 sessions rose to 1,251 (1,121 Sep) but conversion was 2.48%.
   Per-product 'orders' show '—' (the product report has
   units, not orders). GA4 purchases (31 Oct) run below the Orders KPI (44) — orders include repeat/manual/
   no-session orders; the funnel + CVR are session-based, Orders is order-based — both valid, kept separate.
   "Returning Cust." stays unavailable (GA4's totalPurchasers/firstTimePurchasers come back identical).
   Newnique: MerchantSpring isn't ingesting its orders yet, so its ORDER-SIDE reads "pending Executive
   integration"; its GA4 session-side IS live (90 sessions Oct). 'all' equals Contours Rx until
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
      // 6-month revenue trend (May 2026 → Oct 2026), MerchantSpring Shopify channel 33616599, TOTAL REVENUE
      // INCLUDING VAT (includeTax:true). Monthly buckets (GMT); Oct £1,340.79 ties to the penny with the per-product breakdown.
      chart: {
        max: 4000, yTicks: ['£4k', '£3k', '£2k', '£1k', '£0'],
        xLabels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'], xHighlight: '#404935',
        series: [ { values: [2416,2783,2387,3919,1499,1341], color: '#404935', area: true, main: true } ],
        legend: [ { name: 'Revenue (inc. VAT)', color: '#404935' } ]
      },
      // Current on-hand snapshot from MerchantSpring (Shopify channel, 1 Nov 2026). Cover = vs Oct run-rate (47 Lids units).
      // [TO CONFIRM] quantities roughly doubled vs the 4 Oct snapshot (Lids 739→2,809) — restock or inventory-sync change?
      stock: [
        { name: 'Lids by Design Eyelid Lift Strips', note: '7 size variants · all in stock', level: 'g', units: '2,809 units', cover: 'ample cover' },
        { name: 'Botanical Lash & Brow Serum',       note: 'SKU CR BLBS · Healthy',            level: 'g', units: '163 units',   cover: 'ample cover' },
        { name: 'Exfoliating B5 Prep Pads 30pk',     note: 'SKU CR B5PREP · Healthy',          level: 'g', units: '92 units',    cover: 'ample cover' },
        { name: 'Dermal Blade (3 pack)',             note: 'SKU CR DERMA · Healthy (no Oct sales)', level: 'g', units: '11 units',  cover: 'ample cover' }
      ],
      // Traffic by GA4 default channel group (October 2026) via Reporting Ninja. Sum shown = 1,131 of 1,251 sessions
      // (smaller channels omitted).
      traffic: [
        { lbl: 'Paid (Cross-network)', pct: 52, val: '646', color: 'brand' },
        { lbl: 'Organic Search',       pct: 20, val: '251', color: 'blue' },
        { lbl: 'Direct',               pct: 19, val: '234', color: 'amber' }
      ],
      byPeriod: {
        may: {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£1,341',  dCls: 'dd', d: '▼ 10.5% MoM',  s: 'vs £1,499 Sep (inc. VAT)' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '44',     dCls: 'dd', d: '▼ 8.3% MoM',  s: '48 orders Sep' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£30.47',  dCls: 'dd', d: '▼ £0.75 MoM',  s: '£31.22 Sep' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£28.53',  dCls: 'df', d: 'revenue ÷ units',  s: '47 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.48%',  dCls: 'df', d: 'GA4 · sessions', s: '31 of 1,251 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '1,251',  dCls: 'du', d: '▲ 11.6% MoM', s: 'GA4 · vs 1,121 Sep' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '47',    dCls: 'df', d: 'Lids 47 · Other 0', s: '1 active SKU' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'GA4 purchasers = first-time purchasers' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '1,251', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '47',   pct: '3.8%', w: 3.8, sub: 'GA4 · 3.8% of sessions' },
            { lbl: 'Reached Checkout', val: '39',   pct: '3.1%', w: 3.1, sub: '83% of carts retained' },
            { lbl: 'Purchased',        val: '31',   pct: '2.5%', w: 2.5, sub: '79% of checkouts · 2.48% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£1,341', units: '47', asp: '£28.53', orders: '—', share: '100.0%', shareCls: 'bg' },
            { name: 'Botanical Lash & Brow Serum', net: '£0', units: '0', asp: '—', orders: '—', share: '—', shareCls: 'br' },
            { name: 'Exfoliating B5 Prep Pads 30pk', net: '£0', units: '0', asp: '—', orders: '—', share: '—', shareCls: 'br' },
            { name: 'Dermal Blade (3 pack)', net: '£0', units: '0', asp: '—', orders: '—', share: '—', shareCls: 'br' }
          ]
        },
        '3m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£6,759',  dCls: 'df', d: '3-mo actuals',  s: 'Aug–Oct 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '222',     dCls: 'df', d: '3-mo actuals',  s: 'AOV £30.44' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£30.44',  dCls: 'df', d: '3-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£28.04',  dCls: 'df', d: 'revenue ÷ units',  s: '241 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.96%',  dCls: 'df', d: 'GA4 · sessions', s: '143 of 4,836 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '4,836',  dCls: 'df', d: 'GA4 · Aug–Oct', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '241',    dCls: 'df', d: 'Lids 236 · Other 5', s: 'Aug–Oct' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'GA4 purchasers = first-time purchasers' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '4,836', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '226',   pct: '4.7%', w: 4.7, sub: 'GA4 · 4.7% of sessions' },
            { lbl: 'Reached Checkout', val: '173',   pct: '3.6%', w: 3.6, sub: '77% of carts retained' },
            { lbl: 'Purchased',        val: '143',   pct: '3.0%', w: 3.0, sub: '83% of checkouts · 2.96% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£6,630', units: '236', asp: '£28.09', orders: '—', share: '98.1%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal · Tweezers)', net: '£128', units: '5', asp: '£25.68', orders: '—', share: '1.9%', shareCls: 'bb' }
          ]
        },
        '6m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£14,344',  dCls: 'df', d: '6-mo actuals',  s: 'May–Oct 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '493',     dCls: 'df', d: '6-mo actuals',  s: 'AOV £29.10' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£29.10',  dCls: 'df', d: '6-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£27.17',  dCls: 'df', d: 'revenue ÷ units',  s: '528 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.39%',  dCls: 'df', d: 'GA4 · sessions', s: '297 of 12,411 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '12,411',  dCls: 'df', d: 'GA4 · May–Oct', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '528',    dCls: 'df', d: 'Lids 515 · Other 13', s: 'May–Oct' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'GA4 purchasers = first-time purchasers' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '12,411', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '516',   pct: '4.2%', w: 4.2, sub: 'GA4 · 4.2% of sessions' },
            { lbl: 'Reached Checkout', val: '346',   pct: '2.8%', w: 2.8, sub: '67% of carts retained' },
            { lbl: 'Purchased',        val: '297',   pct: '2.4%', w: 2.4, sub: '86% of checkouts · 2.39% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£14,052', units: '515', asp: '£27.29', orders: '—', share: '98.0%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal · Tweezers)', net: '£292', units: '13', asp: '£22.47', orders: '—', share: '2.0%', shareCls: 'bb' }
          ]
        },
        '12m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£29,601',  dCls: 'df', d: '12-mo actuals',  s: 'Nov 25–Oct 26' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '1037',     dCls: 'df', d: '12-mo actuals',  s: 'AOV £28.54' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.54',  dCls: 'df', d: '12-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.60',  dCls: 'df', d: 'revenue ÷ units',  s: '1113 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.36%',  dCls: 'df', d: 'GA4 · sessions', s: '642 of 27,219 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '27,219',  dCls: 'df', d: 'GA4 · Nov 25–Oct 26', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '1113',    dCls: 'df', d: 'Lids 1086 · Other 27', s: 'Nov 25–Oct 26' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'GA4 purchasers = first-time purchasers' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '27,219', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '1126',   pct: '4.1%', w: 4.1, sub: 'GA4 · 4.1% of sessions' },
            { lbl: 'Reached Checkout', val: '707',   pct: '2.6%', w: 2.6, sub: '63% of carts retained' },
            { lbl: 'Purchased',        val: '642',   pct: '2.4%', w: 2.4, sub: '91% of checkouts · 2.36% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£29,069', units: '1086', asp: '£26.77', orders: '—', share: '98.2%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal · Tweezers)', net: '£532', units: '27', asp: '£19.70', orders: '—', share: '1.8%', shareCls: 'bb' }
          ]
        }
      }
    },
    newnique: {
      label: 'Newnique', store: 'newniquecare.com',
      chart: null, stock: [],
      // Traffic by GA4 default channel group (October 2026) via Reporting Ninja. Sum = 86 of 90 sessions.
      traffic: [
        { lbl: 'Direct',         pct: 50, val: '45', color: 'brand' },
        { lbl: 'Organic Search', pct: 32, val: '29', color: 'blue' },
        { lbl: 'Referral',       pct: 7,  val: '6',  color: 'amber' },
        { lbl: 'Unassigned',     pct: 7,  val: '6',  color: 'green' }
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
          may:  period(90,   11,  3,  1, '1.11%', 'Oct'),
          '3m': period(450,  60,  14, 3, '0.67%', 'Aug–Oct'),
          '6m': period(1301, 201, 34, 8, '0.61%', 'May–Oct'),
          '12m':period(2084, 285, 59, 9, '0.43%', 'Nov 25–Oct 26')
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
