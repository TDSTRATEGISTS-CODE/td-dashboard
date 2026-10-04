/* NKV Beauty — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 1–4 Oct 2026 (channel 71662311, seller A1SNRD9T28Z9ZM), native GBP.
   UK is the live market (real data). Ireland is early-stage and EUR-native — its £ figures are the
   actual €-sales converted at €1 ≈ £0.855. USA has real (small) ad spend and sales — converted from
   USD at $1 ≈ £0.78; its Amazon campaigns resumed in September (spend $247 vs $3.66 in August).
   FULL re-bake for September 2026: dateRanges may/3m/6m/12m (3m = Jul–Sep, 6m = Apr–Sep, 12m = Oct 2025–
   Sep 2026) incl. YoY, sections.charts, advertising metrics/campaigns/mix/budgets, inventory + stockWarn,
   products (tiles, table, brand groups), the Amazon P&L, Overview CVR and the whole Shopify page.
   Revenue/orders come from the settled getSalesByPeriod monthly buckets (GMT; Sep UK £12,430.09 matches the
   weekly-bucket sum to the penny) — earlier daily-sum bakes of Jul/Aug are restated by <1.5%. UK ad spend /
   ad sales come from generated 'campaigns' reports per window (12m reconciles to the monthly buckets within 0.2%).
   Still sourced from earlier bakes (flagged): advertising budget/forecast figures (the Account Tracker sheet
   gave no readable budget rows this run), supplier POs (live proxy), Returning-Customer rate (GA4 unreliable).
   Sept review notes (approved by the account owner): Shopify revenue fell 61.8% MoM (£3,919→£1,499) —
   Google Ads (Performance Max) was paused. Amazon UK ROAS fell to 1.71× (TACOS 22.5%) — driven by the
   Whitening Kits SP Manual campaign (now paused) spending £643 for £480 of sales and a ~31% fall in UK
   ad sales vs August.
   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables/P&L here
   are all in £, but the two trend-chart Y-axes will display '€' until the template adds a currency option.
   dataSource.type is 'static' (no Sheet/Apps Script proxy for NKV yet). */
window.DASHBOARD_DATA = {
  dateRanges: {
  'may': {
    label: 'September 2026', shortLabel: 'September 2026',
    rev: '£12,841', revD: '▼ 30.8% MoM', revC: 'df', revS: 'vs £18,552 Aug',
    adSales: '£4,889', adSalesD: '▼ 29.2% MoM', adSalesC: 'df', adSalesS: '38.1% of revenue',
    tacos: '23.3%', tacosD: '▲ 8.3pp vs Aug', tacosC: 'df', tacosS: 'Target <20%',
    roas: '1.64×', roasD: '▼ 0.85× vs Aug', roasC: 'df', roasS: '447 orders · AOV £28.73',
    spend: '£2,989', spendD: '▲ 7.5% MoM', spendC: 'df', spendS: 'vs £2,781 Aug',
    tacosAd: '23.3%', tacosAdD: '▲ 8.3pp vs Aug', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '1.64×', roasAdD: '▼ 0.85× vs Aug', roasAdC: 'df', roasAdS: '£12,841 revenue',
    aov: '£28.73', aovD: '▼ £3.59 MoM', aovC: 'df', aovS: '447 orders Sep',
    mktRows: [
      ['UK','gb','—','£2,796','bb','UK ad-managed','£12,430','br','22.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£214','bb','—'],
      ['USA','us','—','£193','bb','Ads resumed Sep','£197','br','98.1%'],
      ['Total',null,'—','£2,989','bb','All 3 markets live','£12,841','br','23.3%']
    ],
    marketKpis: {
      uk: { rev:'£12,430', adSales:'£4,788', tacos:'22.5%', roas:'1.71×', spend:'£2,796', aov:'£29.53', tacosAd:'22.5%', roasAd:'1.71×', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'421 orders · AOV £29.53', roasAdS:'£12,430 revenue', aovD:'▼ £2.38 MoM', aovS:'421 orders Sep', adSalesS:'38.5% of revenue', revD:'▼ 30.4% MoM', revS:'vs £17,869 Aug', spendD:'▲ 0.6% MoM', spendS:'vs £2,778 Aug', tacosD:'▲ 6.9pp vs Aug', tacosAdD:'▲ 6.9pp vs Aug', roasD:'▼ 0.77× vs Aug', roasAdD:'▼ 0.77× vs Aug', adSalesD:'▼ 30.7% MoM' },
      irl: { rev:'£214', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£42.75', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'5 orders', roasAdS:'£214 revenue', aovD:'', aovS:'5 orders Sep', adSalesS:'No ad spend', revD:'▼ 8.1% MoM', revS:'vs £233 Aug', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£197', adSales:'£101', tacos:'98.1%', roas:'0.52×', spend:'£193', aov:'£9.37', tacosAd:'98.1%', roasAd:'0.52×', revC:'df', adSalesC:'du', tacosC:'df', roasC:'du', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'du', tacosS:'Target <20%', roasS:'21 orders · AOV £9.37', roasAdS:'£197 revenue', aovD:'', aovS:'21 orders Sep', adSalesS:'Ads resumed Sep', revD:'▼ 56.3% MoM', revS:'vs £451 Aug', spendD:'▲ ads resumed', spendS:'vs £3 Aug (paused)', tacosD:'▲ high — small sample', tacosAdD:'▲ high — small sample', roasD:'▲ 0.52× vs Aug', roasAdD:'▲ 0.52× vs Aug', adSalesD:'▲ ads resumed' }
    },
    // Campaign-type mix — real ad-type sales share + ACOS from the MerchantSpring campaigns report (UK, Sep 2026).
    // Every period (may/3m/6m/12m) is pulled from its own campaigns-report window — no estimates.
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:89.2,sales:'£4.3k',acos:'59.8%'}, {name:'Sponsored Brands',color:'#9caf78',pct:10.1,sales:'£0.5k',acos:'26.9%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.7,sales:'£0.0k',acos:'326.5%'} ] },
    // Same-Period-Last-Year comparison (Sep 2026 vs Sep 2025), MerchantSpring actuals (getSalesByPeriod,
    // interval:'w' summed — see the AMACX yoy{} note for why not interval:'M'). UK + Total (UK converted
    // £ + IRL €→£ + USA $→£ at the same static rates as the rest of this file) only: unlike AMACX, NKV's
    // ROAS is adSales÷adSpend (not revenue÷adSpend). Sep-2025 UK base £12914.05 sales / £2038.43 ad
    // spend / £6304.89 ad sales. IRL's Sep-2025 base is negligible (€185.66 total) and USA had zero Amazon
    // sales a year prior — neither gets a per-market yoy entry; Total folds their small prior-year
    // contribution in.
    yoy: {
      revD:'▼ 1.8% YoY', revC:'df', revS:'vs £13,073 Sep 2025',
      spendD:'▲ 46.6% YoY', spendC:'df', spendS:'vs £2,038 Sep 2025',
      adSalesD:'▼ 22.5% YoY', adSalesC:'df', adSalesS:'vs £6,305 Sep 2025',
      tacosD:'▲ 7.7pp vs Sep 2025', tacosC:'df',
      tacosAdD:'▲ 7.7pp vs Sep 2025', tacosAdC:'df',
      roasD:'▼ 1.46× vs Sep 2025', roasC:'df',
      roasAdD:'▼ 1.46× vs Sep 2025', roasAdC:'df',
      marketKpis: {
        uk: { revD:'▼ 3.7% YoY', revC:'df', revS:'vs £12,914 Sep 2025', spendD:'▲ 37.2% YoY', spendC:'df', spendS:'vs £2,038 Sep 2025', adSalesD:'▼ 24.1% YoY', adSalesC:'df', adSalesS:'vs £6,305 Sep 2025', tacosD:'▲ 6.7pp vs Sep 2025', tacosC:'df', tacosAdD:'▲ 6.7pp vs Sep 2025', tacosAdC:'df', roasD:'▼ 1.38× vs Sep 2025', roasC:'df', roasAdD:'▼ 1.38× vs Sep 2025', roasAdC:'df' }
      }
    },
  },
  '3m': {
    label: 'Jul–Sep 2026', shortLabel: 'Jul–Sep 2026',
    rev: '£45,585', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£17,504', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '38.4% of revenue',
    tacos: '18.5%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.08×', roasD: '', roasC: 'df', roasS: '',
    spend: '£8,414', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '18.5%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.08×', roasAdD: '', roasAdC: 'df', roasAdS: '£45,585 revenue',
    aov: '£29.47', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£8,144','bb','UK ad-managed','£43,421','ba','18.8%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£802','bb','—'],
      ['USA','us','—','£270','bb','Real ad spend now','£1,361','ba','19.9%'],
      ['Total',null,'—','£8,414','bb','3-month actuals','£45,585','ba','18.5%']
    ],
    marketKpis: {
      uk: { rev:'£43,421', adSales:'£17,349', tacos:'18.8%', roas:'2.13×', spend:'£8,144', aov:'£29.58', tacosAd:'18.8%', roasAd:'2.13×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£43,421 revenue', aovD:'', aovS:'', adSalesS:'40.0% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£802', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£40.11', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£802 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£1,361', adSales:'£156', tacos:'19.9%', roas:'0.58×', spend:'£270', aov:'£23.07', tacosAd:'19.9%', roasAd:'0.58×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£1,361 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'3-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.1,sales:'£14.9k',acos:'49.1%'}, {name:'Sponsored Brands',color:'#9caf78',pct:12.7,sales:'£2.2k',acos:'27.5%'}, {name:'Sponsored Display',color:'#e8a87c',pct:1.2,sales:'£0.2k',acos:'104.1%'} ] },
    // Period-aware Ad Metrics (Jul–Sep 2026) — all actuals (MerchantSpring channel + generated campaigns report, Jul–Sep).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£8,144', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£17,349', color:'brand'},
      {lbl:'ACOS',         val:'46.9%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.71'},
      {lbl:'Impressions',  val:'3.37M'},
      {lbl:'New-to-Brand', val:'9.9%',   color:'green'}
    ],
    // Real per-campaign actuals for the Jul–Sep 2026 window (MerchantSpring campaigns report, Jul–Sep,
    // top 13 of 37 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£1,755',sales:'£4,077',acos:'43.0%',acosCls:'ba',roas:'2.32×',cpc:'£1.11',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£1,456',sales:'£1,688',acos:'86.3%',acosCls:'br',roas:'1.16×',cpc:'£0.94',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£749',sales:'£1,755',acos:'42.7%',acosCls:'ba',roas:'2.34×',cpc:'£0.96',status:'Active',statusCls:'bg'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£608',sales:'£2,211',acos:'27.5%',acosCls:'bg',roas:'3.64×',cpc:'£0.58',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£549',sales:'£532',acos:'103.2%',acosCls:'br',roas:'0.97×',cpc:'£0.86',status:'Paused',statusCls:'ba'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£446',sales:'£665',acos:'67.0%',acosCls:'br',roas:'1.49×',cpc:'£0.31',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£334',sales:'£532',acos:'62.8%',acosCls:'br',roas:'1.59×',cpc:'£0.39',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£273',sales:'£282',acos:'97.1%',acosCls:'br',roas:'1.03×',cpc:'£0.58',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£256',sales:'£2,905',acos:'8.8%',acosCls:'bg',roas:'11.36×',cpc:'£0.68',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£256',sales:'£261',acos:'98.1%',acosCls:'br',roas:'1.02×',cpc:'£0.71',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£236',sales:'£532',acos:'44.3%',acosCls:'ba',roas:'2.26×',cpc:'£0.72',status:'Active',statusCls:'bg'},
      {name:'UK · Mixed Re-targeting — SD Remarketing',type:'Sponsored Display',spend:'£209',sales:'£201',acos:'104.1%',acosCls:'br',roas:'0.96×',cpc:'£0.35',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£170',sales:'£558',acos:'30.5%',acosCls:'ba',roas:'3.28×',cpc:'£0.94',status:'Active',statusCls:'bg'}
    ] } },
  },
  '6m': {
    label: 'Apr–Sep 2026 (6 months)', shortLabel: 'Apr–Sep 2026',
    rev: '£89,490', revD: '6-month actuals', revC: 'du', revS: '',
    adSales: '£38,309', adSalesD: '6-month actuals', adSalesC: 'df', adSalesS: '42.8% of revenue',
    tacos: '19.0%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.25×', roasD: '', roasC: 'df', roasS: '',
    spend: '£17,038', spendD: '6-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.0%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.25×', roasAdD: '', roasAdC: 'df', roasAdS: '£89,490 revenue',
    aov: '£28.77', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£16,739','bb','UK ad-managed','£85,629','ba','19.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£1,856','bb','—'],
      ['USA','us','—','£299','bb','Real ad spend now','£2,005','ba','14.9%'],
      ['Total',null,'—','£17,038','bb','6-month actuals','£89,490','ba','19.0%']
    ],
    marketKpis: {
      uk: { rev:'£85,629', adSales:'£38,154', tacos:'19.5%', roas:'2.28×', spend:'£16,739', aov:'£29.01', tacosAd:'19.5%', roasAd:'2.28×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£85,629 revenue', aovD:'', aovS:'', adSalesS:'44.6% of revenue', revD:'6-month actuals', revS:'', spendD:'6-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'6-month actuals' },
      irl: { rev:'£1,856', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£35.69', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£1,856 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£2,005', adSales:'£156', tacos:'14.9%', roas:'0.52×', spend:'£299', aov:'£18.92', tacosAd:'14.9%', roasAd:'0.52×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£2,005 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'6-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.8,sales:'£33.1k',acos:'45.6%'}, {name:'Sponsored Brands',color:'#9caf78',pct:12.7,sales:'£4.9k',acos:'29.1%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.5,sales:'£0.2k',acos:'122.5%'} ] },
    // Period-aware Ad Metrics (Apr–Sep 2026) — all actuals (MerchantSpring channel + generated campaigns report, Apr–Sep).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£16,739', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£38,154', color:'brand'},
      {lbl:'ACOS',         val:'43.9%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.77'},
      {lbl:'Impressions',  val:'7.14M'},
      {lbl:'New-to-Brand', val:'9.6%',   color:'green'}
    ],
    // Real per-campaign actuals for the Apr–Sep 2026 window (MerchantSpring campaigns report, Apr–Sep,
    // top 13 of 45 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£4,127',sales:'£9,864',acos:'41.8%',acosCls:'ba',roas:'2.39×',cpc:'£1.08',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£3,400',sales:'£5,103',acos:'66.6%',acosCls:'br',roas:'1.50×',cpc:'£0.93',status:'Paused',statusCls:'ba'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£1,317',sales:'£4,811',acos:'27.4%',acosCls:'bg',roas:'3.65×',cpc:'£0.54',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£1,223',sales:'£3,183',acos:'38.4%',acosCls:'ba',roas:'2.60×',cpc:'£0.89',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£834',sales:'£658',acos:'126.9%',acosCls:'br',roas:'0.79×',cpc:'£0.87',status:'Paused',statusCls:'ba'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£818',sales:'£906',acos:'90.3%',acosCls:'br',roas:'1.11×',cpc:'£0.73',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£547',sales:'£6,308',acos:'8.7%',acosCls:'bg',roas:'11.53×',cpc:'£0.70',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£446',sales:'£665',acos:'67.0%',acosCls:'br',roas:'1.49×',cpc:'£0.31',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£383',sales:'£893',acos:'42.9%',acosCls:'ba',roas:'2.33×',cpc:'£0.80',status:'Active',statusCls:'bg'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£348',sales:'£360',acos:'96.5%',acosCls:'br',roas:'1.04×',cpc:'£0.73',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Manual',type:'Sponsored Products',spend:'£334',sales:'£532',acos:'62.8%',acosCls:'br',roas:'1.59×',cpc:'£0.39',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£332',sales:'£675',acos:'49.3%',acosCls:'ba',roas:'2.03×',cpc:'£1.02',status:'Paused',statusCls:'ba'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£301',sales:'£1,194',acos:'25.2%',acosCls:'bg',roas:'3.97×',cpc:'£0.84',status:'Active',statusCls:'bg'}
    ] } },
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Oct 2025–Sep 2026',
    rev: '£182,449', revD: 'Trailing 12 months', revC: 'du', revS: '',
    adSales: '£87,942', adSalesD: 'Trailing 12 months', adSalesC: 'df', adSalesS: '48.2% of revenue',
    tacos: '19.0%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.54×', roasD: '', roasC: 'df', roasS: '',
    spend: '£34,598', spendD: 'Trailing 12 months', spendC: 'df', spendS: '',
    tacosAd: '19.0%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.54×', roasAdD: '', roasAdC: 'df', roasAdS: '£182,449 revenue',
    aov: '£28.44', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£34,299','bb','UK ad-managed','£176,879','ba','19.4%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£3,565','bb','—'],
      ['USA','us','—','£299','bb','Real ad spend now','£2,005','ba','14.9%'],
      ['Total',null,'—','£34,598','bb','Trailing 12 months','£182,449','ba','19.0%']
    ],
    marketKpis: {
      uk: { rev:'£176,879', adSales:'£87,786', tacos:'19.4%', roas:'2.56×', spend:'£34,299', aov:'£28.50', tacosAd:'19.4%', roasAd:'2.56×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£176,879 revenue', aovD:'', aovS:'', adSalesS:'49.6% of revenue', revD:'Trailing 12 months', revS:'', spendD:'Trailing 12 months', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'Trailing 12 months' },
      irl: { rev:'£3,565', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£34.61', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£3,565 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£2,005', adSales:'£156', tacos:'14.9%', roas:'0.52×', spend:'£299', aov:'£18.92', tacosAd:'14.9%', roasAd:'0.52×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£2,005 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'Trailing 12 months', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:88.4,sales:'£77.6k',acos:'40.2%'}, {name:'Sponsored Brands',color:'#9caf78',pct:11.4,sales:'£10.0k',acos:'28.3%'}, {name:'Sponsored Display',color:'#e8a87c',pct:0.2,sales:'£0.2k',acos:'146.4%'} ] },
    // Period-aware Ad Metrics (Oct 2025–Sep 2026) — all actuals (MerchantSpring channel + generated campaigns report, Oct 2025–Sep 2026).
    sec: { advertising: { metrics: [
      {lbl:'Total Spend',  val:'£34,299', id:'a-spend'},
      {lbl:'Ad Sales',     val:'£87,786', color:'brand'},
      {lbl:'ACOS',         val:'39.1%',  color:'amber'},
      {lbl:'Avg. CPC',     val:'£0.79'},
      {lbl:'Impressions',  val:'12.53M'},
      {lbl:'New-to-Brand', val:'7.8%',   color:'green'}
    ],
    // Real per-campaign actuals for the Oct 2025–Sep 2026 window (MerchantSpring campaigns report, Oct 2025–Sep 2026,
    // top 13 of 54 by spend). Follows the date selector; row-filtered by the market chip.
    campaigns: [
      {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£9,058',sales:'£24,011',acos:'37.7%',acosCls:'ba',roas:'2.65×',cpc:'£1.01',status:'Active',statusCls:'bg'},
      {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£6,472',sales:'£12,345',acos:'52.4%',acosCls:'ba',roas:'1.91×',cpc:'£0.89',status:'Paused',statusCls:'ba'},
      {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£2,715',sales:'£9,916',acos:'27.4%',acosCls:'bg',roas:'3.65×',cpc:'£0.55',status:'Active',statusCls:'bg'},
      {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£2,362',sales:'£5,938',acos:'39.8%',acosCls:'ba',roas:'2.51×',cpc:'£0.86',status:'Active',statusCls:'bg'},
      {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£1,755',sales:'£3,577',acos:'49.1%',acosCls:'ba',roas:'2.04×',cpc:'£1.06',status:'Paused',statusCls:'ba'},
      {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£1,439',sales:'£1,352',acos:'106.4%',acosCls:'br',roas:'0.94×',cpc:'£0.83',status:'Paused',statusCls:'ba'},
      {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£1,373',sales:'£16,030',acos:'8.6%',acosCls:'bg',roas:'11.68×',cpc:'£0.68',status:'Active',statusCls:'bg'},
      {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£1,305',sales:'£1,710',acos:'76.3%',acosCls:'br',roas:'1.31×',cpc:'£0.78',status:'Paused',statusCls:'ba'},
      {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£791',sales:'£924',acos:'85.6%',acosCls:'br',roas:'1.17×',cpc:'£0.67',status:'Active',statusCls:'bg'},
      {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£720',sales:'£1,550',acos:'46.4%',acosCls:'ba',roas:'2.15×',cpc:'£0.94',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Manual',type:'Sponsored Products',spend:'£686',sales:'£1,414',acos:'48.5%',acosCls:'ba',roas:'2.06×',cpc:'£0.72',status:'Active',statusCls:'bg'},
      {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£464',sales:'£1,751',acos:'26.5%',acosCls:'bg',roas:'3.77×',cpc:'£0.86',status:'Active',statusCls:'bg'},
      {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£446',sales:'£665',acos:'67.0%',acosCls:'br',roas:'1.49×',cpc:'£0.31',status:'Active',statusCls:'bg'}
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
      cvr: { val:'7.3%', note:'September 2026 · 6,217 sessions', sub:'UK · session conversion' },
      // FBA Stock Warnings = Amazon FBA low-stock / availability only (real, MerchantSpring UK 4 Oct 2026).
      // 20 of the 74 UK listings are at 0 stock (out of stock / suppressed) — 19 dormant Girlactik
      // long-tail SKUs plus Lilibeth Pink GB 2-Pack (OOS since 3 Oct); 43 listings sold in September.
      // (Account-health/strategy alerts moved to their own section — see ACCOUNT-HEALTH note below.)
      stockWarn: { badge:'3 stock-up · 20 OOS', items:[
        {level:'amber', title:'Contours Rx Lids Assortment 4–7mm — stock-up soon', sub:'B0FYR8DQ2G · ~27 days cover · 70 units · top seller (73/mo)'},
        {level:'amber', title:'Girlactik Gel Eyeliner Pure Black — stock-up this week', sub:'B099KVFGZP · ~5 days cover · 1 unit · 7/mo'},
        {level:'amber', title:'Contours Rx Lids 2-Pack 6mm — stock-up this week', sub:'B0C12KT8L6 · ~6 days cover · 1 unit · 4/mo'},
        {level:'amber', title:'20 listings out of stock / suppressed', sub:'19 dormant Girlactik long-tail SKUs · plus Lilibeth Pink GB 2-Pack (B0FFDPBJP2, selling 3/mo, OOS since 3 Oct) · all other selling SKUs in stock'}
      ] }
      // Account Health (strategy/performance alerts) card removed from the NKV Overview per client request.
    },
    pnl: {
      // Sep 2026 UK channel P&L, accrual basis (MerchantSpring channelProfitAndLoss). The report's own lines do
      // not sum to its total revenue (gross £11,983 + tax −£2,020 + other lines = £9,473 vs £9,608), so
      // 'Product sales' is derived (net revenue minus the other income lines) so the rows foot — review.
      statement: {
        fixedLabel: 'September 2026 (1–30) · financial basis (MerchantSpring)',
        summary: [ {val:'£9,608',lbl:'Net Revenue',color:'brand'}, {val:'£8,689',lbl:'Total Costs',color:'red'}, {val:'£919',lbl:'Net Profit',color:'amber'} ],
        margin: { pct:'9.6%', pctColor:'amber', note:'September 2026 (30-day) · financial basis (MerchantSpring) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£9,608'},
          {lbl:'Advertising', val:'-£2,796', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-£2,629', color:'red'},
          {lbl:'COGS', val:'-£3,248', color:'red'},
          {lbl:'Net Profit', val:'£919', color:'amber', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£9,608',adspend:'£2,796',net:'£919',netColor:'amber',margin:'9.6%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'£10,099', pct:'105.1%', unit:'£22.80'},
            {lbl:'Refunds', amount:'-£453', pct:'-4.7%', unit:'-£1.02'},
            {lbl:'Reimbursements', amount:'£142', pct:'1.5%', unit:'£0.32'},
            {lbl:'Promotions', amount:'-£426', pct:'-4.4%', unit:'-£0.96'},
            {lbl:'Other income', amount:'£247', pct:'2.6%', unit:'£0.56'},
            {lbl:'Net revenue', amount:'£9,608', pct:'100.0%', unit:'£21.69', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£2,796', pct:'29.1%', unit:'£6.31'},
            {lbl:'Selling fees', amount:'£1,706', pct:'17.8%', unit:'£3.85'},
            {lbl:'Shipping & fulfilment fees', amount:'£923', pct:'9.6%', unit:'£2.08'},
            {lbl:'Cost of goods', amount:'£3,248', pct:'33.8%', unit:'£7.33'},
            {lbl:'Refunds & returns overheads', amount:'£16', pct:'0.2%', unit:'£0.04'},
            {lbl:'Other', amount:'£0', pct:'0.0%', unit:'£0.00'},
            {lbl:'Total expenses', amount:'£8,689', pct:'90.4%', unit:'£19.61', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£919', pct:'9.6%', unit:'£2.07', total:true, profit:true},
            {lbl:'Profit %', amount:'9.6%', accent:'amber'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'23.3%'},
            {lbl:'Ad spend', amount:'£2,796'}
          ] }
        ]
      }
    },
    advertising: {
      // Real September 2026 ad totals (MerchantSpring generated 'campaigns' report, UK channel, GBP) —
      // £2796.27 spend / £4788.05 ad sales.
      metrics: [
        {lbl:'Total Spend',  val:'£2,796', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£4,788', color:'brand'},
        {lbl:'ACOS',         val:'58.4%',  color:'amber'},
        {lbl:'Avg. CPC',     val:'£0.70'},
        {lbl:'Impressions',  val:'1.26M'},
        {lbl:'New-to-Brand', val:'8.7%',   color:'green'}
      ],
      // Ad budget = £3,000/mo (NKV tracker · Marketing Activity sheet) vs real actual spend (MerchantSpring,
      // UK Sep 2026 = £2796.27). The tracker's budget rows could not be re-read this run (the Drive read only
      // returned sample rows), so the £3,000 monthly budget and the flat £3,500/mo forward forecast are the
      // figures documented in earlier bakes — re-confirm against the sheet next time.
      budgets: {
        subLabel: 'September 2026 · budget vs actual',
        headers: ['Monthly Budget','September Actual','Variance','Utilisation'],
        rows: [
          {name:'United Kingdom', flag:'gb', cells:['£3,000','£2,796','▼ £204 under','93%']},
          {name:'Total', total:true,         cells:['£3,000','£2,796','▼ £204 under','93%']}
        ]
      },
      forecast: [
        {month:'Oct', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.7},
        {month:'Nov', budget:'£3,500', pct:100, tacos:'<20%', tacosColor:'amber', roas:'—', opacity:0.6}
      ],
      // Real per-campaign actuals (MerchantSpring generated campaigns report, UK channel, September 2026 ·
      // 28 campaigns, top 13 by spend). This is the 'may' default; 3m/6m/12m each override it via their
      // own sec.advertising.campaigns, so Active Campaigns follows the date selector (and market chip).
      campaigns: [
        {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£643',sales:'£480',acos:'133.9%',acosCls:'br',roas:'0.75×',cpc:'£1.08',status:'Paused',statusCls:'ba'},
        {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£416',sales:'£955',acos:'43.6%',acosCls:'ba',roas:'2.29×',cpc:'£0.99',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Manual',type:'Sponsored Products',spend:'£252',sales:'£130',acos:'194.2%',acosCls:'br',roas:'0.51×',cpc:'£0.84',status:'Paused',statusCls:'ba'},
        {name:'UK · HYDRTE Travel Bottles — SP Auto',type:'Sponsored Products',spend:'£155',sales:'£90',acos:'172.3%',acosCls:'br',roas:'0.58×',cpc:'£0.31',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£136',sales:'£125',acos:'109.0%',acosCls:'br',roas:'0.92×',cpc:'£0.58',status:'Paused',statusCls:'ba'},
        {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£130',sales:'£483',acos:'26.9%',acosCls:'bg',roas:'3.72×',cpc:'£0.51',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£121',sales:'£301',acos:'40.1%',acosCls:'ba',roas:'2.50×',cpc:'£0.71',status:'Active',statusCls:'bg'},
        {name:'UK · Mixed Re-targeting — SD Remarketing',type:'Sponsored Display',spend:'£110',sales:'£34',acos:'326.5%',acosCls:'br',roas:'0.31×',cpc:'£0.38',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£104',sales:'£1,134',acos:'9.2%',acosCls:'bg',roas:'10.87×',cpc:'£0.77',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Organic Hair Oil — SP PAT',type:'Sponsored Products',spend:'£102',sales:'£44',acos:'230.9%',acosCls:'br',roas:'0.43×',cpc:'£0.81',status:'Active',statusCls:'bg'},
        {name:'UK · Newnique Brand Defense — SP Default Manual',type:'Sponsored Products',spend:'£92',sales:'£256',acos:'36.0%',acosCls:'ba',roas:'2.78×',cpc:'£0.74',status:'Active',statusCls:'bg'},
        {name:'UK · Research Universal Campaign — SP Auto',type:'Sponsored Products',spend:'£88',sales:'£58',acos:'151.2%',acosCls:'br',roas:'0.66×',cpc:'£0.75',status:'Active',statusCls:'bg'},
        {name:'UK · Newnique Serum Bundle OHAS — SP Auto',type:'Sponsored Products',spend:'£79',sales:'£115',acos:'69.0%',acosCls:'br',roas:'1.45×',cpc:'£0.99',status:'Active',statusCls:'bg'}
      ]
    },
    inventory: {
      // Real FBA/FBM stock snapshot from the MerchantSpring product report (qty + days-cover per listing, 4 Oct 2026).
      // 43 UK listings sold in September; 42 of them are in stock. Stock-up watch = selling listings under 30
      // days cover. No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green', lbl:'In Stock', val:'42', dCls:'du', d:'SKUs · 1 OOS now', s:'of 43 sold listings'},
        {bar:'#404935', lbl:'Units on Hand', val:'1,616', dCls:'df', d:'FBA + FBM total', s:'across 43 selling SKUs'},
        {bar:'amber', lbl:'Stock-up Watch', val:'4', dCls:'df', dColor:'amber', d:'selling · <30d cover', s:'see priority list'},
        {bar:'green', lbl:'Buy Box (Sep)', val:'99.4%', dCls:'du', d:'featured-offer %', s:'vs 99.2% Aug'}
      ],
      stock: [
        {dot:'da', name:'Contours Rx Lids by Design — Assortment 4–7mm', note:'B0FYR8DQ2G · UK · top seller (73/mo)', units:'70 units', unitsColor:'amber', days:'~27 days', daysColor:'amber'},
        {dot:'dg', name:'Contours Rx Lids by Design — 4mm', note:'B08MJ1PSXN · UK · Contours Rx', units:'75 units', days:'~42 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 5mm', note:'B018EHTG5K · UK · Contours Rx', units:'89 units', days:'~62 days'},
        {dot:'dg', name:'White Luxe Teeth Whitening Kit', note:'B08SCS43Q1 · UK · White Luxe', units:'86 units', days:'~70 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 6mm', note:'B018EHOJ2K · UK · Contours Rx', units:'56 units', days:'~50 days'},
        {dot:'dg', name:'Contours Rx Lids by Design — 7mm', note:'B018EDU1DA · UK · Contours Rx', units:'96 units', days:'~105 days'},
        {dot:'da', name:'Girlactik Long-Wear Gel Eyeliner — Pure Black', note:'B099KVFGZP · UK · low cover', units:'1 unit', unitsColor:'red', days:'~5 days', daysColor:'red'}
      ],
      restock: [
        {level:'red', title:'Girlactik Long-Wear Gel Eyeliner — Pure Black — UK', sub:'B099KVFGZP · ~5 days cover · 1 unit · selling 7/mo — stock-up this week'},
        {level:'red', title:'Contours Rx Lids 2-Pack 6mm — UK', sub:'B0C12KT8L6 · ~6 days cover · 1 unit · selling 4/mo — stock-up this week'},
        {level:'amber', title:'Contours Rx Lids Assortment 4–7mm — UK', sub:'B0FYR8DQ2G · ~27 days cover · 70 units · top seller (73/mo) — stock-up soon'},
        {level:'amber', title:'Lilibeth Brow Shaper 2-Pack Pink GB — UK', sub:'B0FFDPBJP2 · out of stock since 3 Oct · selling 3/mo — stock-up this week'}
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
      // Per-market FBA stock (MerchantSpring product report, 4 Oct 2026). 'all'/'uk' use the default
      // kpis/stock/restock above. Ireland ships FBA from the UK pool (early stage); USA is the Newnique-only
      // seller account (4 live ASINs, all in stock). Selected via the market chip (app.js).
      kpisByMarket: {
        irl: [
          {bar:'green', lbl:'In Stock', val:'22', dCls:'du', d:'of 25 listings', s:'3 OOS · Girlactik Black & Brown, Lids 2-Pack 6mm'},
          {bar:'#404935', lbl:'Units on Hand', val:'1,031', dCls:'df', d:'FBA total', s:'ships from UK pool'},
          {bar:'green', lbl:'Stock-up Watch', val:'0', dCls:'du', d:'healthy cover', s:'early stage · low velocity'},
          {bar:'amber', lbl:'Out of Stock', val:'3', dCls:'df', dColor:'amber', d:'none selling in Sep', s:'B099KVFGZP · B09QRJ4Y44 · B0C12KT8L6'}
        ],
        usa: [
          {bar:'green', lbl:'In Stock', val:'4', dCls:'du', d:'of 4 ASINs', s:'Newnique · 0 OOS'},
          {bar:'#404935', lbl:'Units on Hand', val:'244', dCls:'df', d:'FBA total', s:'across 4 SKUs'},
          {bar:'green', lbl:'Stock-up Watch', val:'0', dCls:'du', d:'healthy cover', s:'all 4 selling · 100+ days'},
          {bar:'green', lbl:'Out of Stock', val:'0', dCls:'du', d:'catalogue 4 SKUs', s:'all in stock'}
        ]
      },
      stockByMarket: {
        irl: [
          {dot:'dg', name:'Contours Rx Lids by Design — 7mm', note:'B018EDU1DA · IE · Contours Rx', units:'96 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 5mm', note:'B018EHTG5K · IE · Contours Rx', units:'89 units', days:'ample'},
          {dot:'dg', name:'White Luxe Teeth Whitening Kit', note:'B08SCS43Q1 · IE · White Luxe', units:'86 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 4mm', note:'B08MJ1PSXN · IE · Contours Rx', units:'75 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Lids by Design — 6mm', note:'B018EHOJ2K · IE · Contours Rx', units:'56 units', days:'ample'},
          {dot:'dg', name:'Contours Rx Assortment 4–7mm', note:'B0FYR8DQ2G · IE · top seller · 2 listings', units:'70 units', days:'ample'},
          {dot:'dr', name:'Girlactik Gel Eyeliner — Pure Black', note:'B099KVFGZP · IE · out of stock since 28 Sep', units:'0 units', unitsColor:'red', days:'OOS', daysColor:'red'},
          {dot:'dr', name:'Contours Rx Lids 2-Pack 6mm', note:'B0C12KT8L6 · IE · out of stock since 3 Oct', units:'0 units', unitsColor:'red', days:'OOS', daysColor:'red'}
        ],
        usa: [
          {dot:'dg', name:'Newnique Organic Hair Growth Oil', note:'B0F8QQ4M2G · US · top seller (~14/mo)', units:'49 units', days:'~105 days'},
          {dot:'dg', name:'Newnique Scalp Exfoliant', note:'B0F8QLYNMQ · US · ~4/mo', units:'64 units', days:'ample'},
          {dot:'dg', name:'Newnique Advanced Hair Growth Serum', note:'B0F8QMT775 · US · ~3/mo', units:'67 units', days:'ample'},
          {dot:'dg', name:'Newnique Hair Loss Serum', note:'B0F8QQGM8Y · US · ~1/mo', units:'64 units', days:'ample'}
        ]
      },
      // NB: rows in these per-market lists must NOT mention a *different* market's code (UK/USA/DE…) —
      // applyMarketFilter scans row text and would hide a row tagged with a market other than the chip.
      restockByMarket: {
        irl: [
          {level:'amber', title:'Girlactik Gel Eyeliner — Pure Black (IE)', sub:'B099KVFGZP · out of stock since 28 Sep · not selling in Sep · low priority — stock-up with the next Girlactik shipment'},
          {level:'amber', title:'Contours Rx Lids 2-Pack 6mm (IE)', sub:'B0C12KT8L6 · out of stock since 3 Oct · not selling in Sep · low priority — stock-up soon'}
        ],
        usa: [
          {level:'green', title:'No stock-up needed — all 4 Newnique SKUs have 100+ days cover', sub:'4 live ASINs · 244 units on hand · selling ~22 units/mo in total'}
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
      // buckets (GMT) — Jul/Aug restated by <1.5% vs the earlier daily-sum bakes after late adjustments;
      // ad spend = campaigns reports (Sep) / previously reconciled values (Apr–Aug).
      months: ['Apr','May','Jun','Jul','Aug','Sep'],
      rev: { all:[12839,15290,14079,13122,17869,12430], uk:[12839,15290,14079,13122,17869,12430], irl:[349,481,224,356,233,214], usa:[0,0,644,714,451,197] },
      adSpend: { all:[2394,3241,2932,2593,2779,2796], uk:[2394,3241,2932,2593,2779,2796], irl:[0,0,0,0,0,0], usa:[0,0,29,74,3,193] },
      adTacos: { all:[18.6,21.2,20.8,19.8,15.6,22.5], uk:[18.6,21.2,20.8,19.8,15.6,22.5], irl:[0,0,0,0,0,0], usa:[0,0,4.5,10.4,0.7,98.0] }
    }
  }
};

/* Products page — period + MARKET aware (MerchantSpring, 4 Oct 2026). The KPI row, the
   Performance-by-Market table and the Sales-by-Brand groups all now follow the date selector (and the
   table + groups follow the market chip). UK = channel actuals; brand splits / Top Brand Rev from the
   product report; Ireland is early-stage €-converted; USA placed its first real orders in June 2026.
   'may' is exact per-brand product-level data; 3m/6m/12m brand splits are allocated from June's real
   per-brand mix applied to each window's real UK total (same methodology as Ireland's split below) —
   these per-period structures supersede the static products.kpis/table/groups above (kept as the
   June fallback). */
(function () {
  var P = window.DASHBOARD_DATA.sections.products;
  var LBL = { may: 'Sep', '3m': '3-mo', '6m': '6-mo', '12m': '12-mo' };
  var UK = {
    may:  { rev:'£12,430', units:451, orders:421, aov:'£29.53', cvr:'7.2%', asp:'£27.56', topRev:'£8,908', topPct:'72%', sold:42 },
    '3m': { rev:'£43,421', units:1610, orders:1468, aov:'£29.58', cvr:'8.3%', asp:'£26.97', topRev:'£29,938', topPct:'72%', sold:48 },
    '6m': { rev:'£85,629', units:3207, orders:2952, aov:'£29.01', cvr:'8.7%', asp:'£26.70', topRev:'£53,201', topPct:'69%', sold:48 },
    '12m':{ rev:'£176,879', units:6669, orders:6207, aov:'£28.50', cvr:'8.1%', asp:'£26.52', topRev:'£100,875', topPct:'67%', sold:48 }
  };
  var IRL = {
    may:  { rev:'£214',   units:6, orders:5, aov:'£42.75', cvr:'4.0%' },
    '3m': { rev:'£802',   units:21, orders:20, aov:'£40.11', cvr:'3.3%' },
    '6m': { rev:'£1,856',   units:56, orders:52, aov:'£35.69', cvr:'3.6%' },
    '12m':{ rev:'£3,565',   units:110, orders:103, aov:'£34.61', cvr:'3.9%' }
  };
  var GROUPS = {
    // [name, sales, units, %share, adSpend, TACOS, tacosCls, CVR, cvrCls] — all four periods re-baked
    // 4 Oct 2026 from a fresh MerchantSpring pull (getSalesByProduct rows carry brand + product-level ad spend,
    // grouped by brand; generated trafficAndConversion (view:'skus') reports summed by brand give sessions →
    // CVR = ordered units ÷ sessions). Tiles above use the channel's settled monthly buckets. pct = share of
    // the mapped brands' own sales total; the product report undercounts older windows vs the channel total
    // (−0.2% Sep, −3.9% 3m, −10.1% 6m, −14.7% 12m — delisted/unmapped SKUs) and product-level ad spend excludes
    // unallocated campaign spend, so TACOS here is a floor. A new Hydrte (travel bottles) line now appears.
    // bg <20% · ba 20–40% · br >40% (TACOS); CVR bg ≥8% · ba 3–8% · br <3%.
    may:  [['Contours Rx — Eyelid Strips','£8,908',272,'72%','£671','7.5%','bg','11.5%','bg'],['Newnique — Hair Growth','£1,202',52,'10%','£923','76.8%','br','3.1%','ba'],['White Luxe — Teeth Whitening','£1,155',35,'9%','£721','62.5%','br','4.3%','ba'],['Lilibeth — Brow & Dermaplaning','£636',65,'5%','£100','15.7%','bg','13.0%','bg'],['Hydrte — Travel Bottles','£383',17,'3%','£218','57.0%','br','2.0%','br'],['Girlactik — Eyeliner','£122',7,'1%','£0','0.0%','bg','—','bb']],
    '3m': [['Contours Rx — Eyelid Strips','£29,938',876,'72%','£2,755','9.2%','bg','10.2%','bg'],['White Luxe — Teeth Whitening','£3,594',117,'9%','£1,665','46.3%','br','5.1%','ba'],['Newnique — Hair Growth','£3,429',180,'8%','£1,786','52.1%','br','4.7%','ba'],['Lilibeth — Brow & Dermaplaning','£2,480',263,'6%','£376','15.2%','bg','17.1%','bg'],['Hydrte — Travel Bottles','£1,910',87,'5%','£799','41.9%','br','2.8%','br'],['Girlactik — Eyeliner','£396',23,'1%','£2','0.5%','bg','—','bb']],
    '6m': [['Contours Rx — Eyelid Strips','£53,201',1547,'69%','£5,714','10.7%','bg','8.6%','bg'],['White Luxe — Teeth Whitening','£8,744',282,'11%','£3,862','44.2%','br','5.2%','ba'],['Newnique — Hair Growth','£6,240',314,'8%','£3,287','52.7%','br','4.7%','ba'],['Lilibeth — Brow & Dermaplaning','£5,209',560,'7%','£769','14.8%','bg','17.2%','bg'],['Hydrte — Travel Bottles','£1,910',87,'2%','£799','41.9%','br','2.8%','br'],['Girlactik — Eyeliner','£1,693',105,'2%','£405','23.9%','ba','16.1%','bg']],
    '12m':[['Contours Rx — Eyelid Strips','£100,875',2961,'67%','£12,483','12.4%','bg','7.2%','ba'],['White Luxe — Teeth Whitening','£21,560',636,'14%','£7,205','33.4%','ba','5.2%','ba'],['Newnique — Hair Growth','£12,923',553,'9%','£5,653','43.7%','br','4.8%','ba'],['Lilibeth — Brow & Dermaplaning','£9,575',1033,'6%','£1,792','18.7%','bg','13.7%','bg'],['Girlactik — Eyeliner','£4,060',254,'3%','£1,178','29.0%','ba','4.8%','ba'],['Hydrte — Travel Bottles','£1,910',87,'1%','£799','41.9%','br','2.8%','br']]
  };
  function num(x) { return x.toLocaleString('en-GB'); }
  function gbp(s) { return Number(String(s).replace(/[^0-9.]/g, '')); }
  var USA = {
    may:  { rev:'£197', units:22, orders:21, aov:'£9.37' },
    '3m': { rev:'£1,361', units:102, orders:59, aov:'£23.07' },
    '6m': { rev:'£2,005', units:161, orders:106, aov:'£18.92' },
    '12m':{ rev:'£2,005', units:161, orders:106, aov:'£18.92' }
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
    { bar:'var(--green)', lbl:'Top Brand Rev.', val:'£197',  dCls:'df', d:'Newnique',          s:'Sep actuals' },
    { bar:'var(--blue)',  lbl:'Orders',         val:'21',    dCls:'df', d:'Newnique · live',   s:'AOV £9.37' },
    { bar:'var(--amber)', lbl:'ASP',            val:'£8.95',dCls:'df', d:'Sep avg',           s:'per unit' }
  ];
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
  // USA — placed its first real orders in June 2026 (Newnique only); real ad spend/TACOS from the
  // MerchantSpring product report (still small-sample — a brand-new market).
  var usaGroups = [
    { name:'Newnique — Hair Growth', sales:'£197', adSpend:'£193', tacos:'98.1%', tacosCls:'br', units:'22', pct:'100%', oosRate:'0%', oosCls:'bg' }
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
   'may' (September 2026), '3m' (Jul–Sep), '6m' (Apr–Sep) and '12m' (Oct 2025–Sep 2026) re-baked 4 Oct 2026, native
   GBP, Contours Rx order-side = TOTAL REVENUE INCLUDING VAT (includeTax:true; Sep £1,498.71 reconciles to the
   penny between the monthly bucket and the per-product pull, and all four windows' product sums equal the
   monthly-bucket sums). VAT only started appearing in the data mid-year; earlier months carry none.
   Pairs two sources, mirroring the Amazon side:
   • ORDER-SIDE (revenue, orders, AOV, units, product mix, stock-on-hand) → MerchantSpring's Shopify
     channels — Contours Rx ch 33616599, Newnique ch 110450469.
   • SESSION-SIDE (sessions, CVR, the cart→checkout→purchase funnel, traffic-by-channel) → GA4 via the
     Reporting Ninja connector (properties/394327082 Contours Rx, properties/506386258 Newnique).
   Revenue fell 61.8% MoM in September (£3,919→£1,499) because Google Ads (Performance Max) was paused
   (GA4 sessions 2,462→1,121; paid cross-network 474). Per-product 'orders' show '—' (the product report has
   units, not orders). GA4 purchases (29 Sep) run below the Orders KPI (48) — orders include repeat/manual/
   no-session orders; the funnel + CVR are session-based, Orders is order-based — both valid, kept separate.
   "Returning Cust." stays unavailable (GA4's totalPurchasers/firstTimePurchasers come back identical).
   Newnique: MerchantSpring isn't ingesting its orders yet, so its ORDER-SIDE reads "pending Executive
   integration"; its GA4 session-side IS live (138 sessions Sep). 'all' equals Contours Rx until
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
      // 6-month revenue trend (Apr 2026 → Sep 2026), MerchantSpring Shopify channel 33616599, TOTAL REVENUE
      // INCLUDING VAT (includeTax:true; VAT only started appearing in the data mid-year, earlier months simply
      // carry none). Monthly buckets (GMT); Sep £1,498.71 ties to the penny with the per-product breakdown.
      chart: {
        max: 4000, yTicks: ['£4k', '£3k', '£2k', '£1k', '£0'],
        xLabels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'], xHighlight: '#404935',
        series: [ { values: [2621,2416,2783,2387,3919,1499], color: '#404935', area: true, main: true } ],
        legend: [ { name: 'Revenue (inc. VAT)', color: '#404935' } ]
      },
      // Current on-hand snapshot from MerchantSpring (Shopify channel, 4 Oct 2026). Cover = vs ~Sep run-rate.
      stock: [
        { name: 'Lids by Design Eyelid Lift Strips', note: '7 size variants · 4MMU out of stock since ~6 Sep', level: 'g', units: '739 units',   cover: '~435 days' },
        { name: 'Botanical Lash & Brow Serum',       note: 'SKU CR BLBS · Healthy',            level: 'g', units: '82 units',    cover: 'ample cover' },
        { name: 'Exfoliating B5 Prep Pads 30pk',     note: 'SKU CR B5PREP · Healthy',          level: 'g', units: '46 units',    cover: 'ample cover' },
        { name: 'Dermal Blade (3 pack)',             note: 'SKU CR DERMA · Restock needed',    level: 'r', units: '0 units',     cover: 'OOS' }
      ],
      // Traffic by GA4 default channel group (September 2026) via Reporting Ninja. Cross-network = Google
      // Ads (Performance Max) — paused during the month, hence sessions roughly halved vs Aug (1,121 vs
      // 2,462). Sum shown = 988 of 1,121 sessions (smaller channels omitted).
      traffic: [
        { lbl: 'Paid (Cross-network)', pct: 42, val: '474', color: 'brand' },
        { lbl: 'Organic Search',       pct: 23, val: '259', color: 'blue' },
        { lbl: 'Direct',               pct: 23, val: '255', color: 'amber' }
      ],
      byPeriod: {
        may: {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£1,499',  dCls: 'dd', d: '▼ 61.8% MoM',  s: 'vs £3,919 Aug (inc. VAT)' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '48',     dCls: 'dd', d: '▼ 63.1% MoM',  s: '130 orders Aug' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£31.22',  dCls: 'du', d: '▲ £1.08 MoM',  s: '£30.15 Aug' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£28.82',  dCls: 'df', d: 'revenue ÷ units',  s: '52 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.59%',  dCls: 'df', d: 'GA4 · sessions', s: '29 of 1,121 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '1,121',  dCls: 'dd', d: '▼ 54.5% MoM', s: 'GA4 · vs 2,462 Aug' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '52',    dCls: 'df', d: 'Lids 51 · Other 1', s: '2 active SKUs' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '1,121', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '46',   pct: '4.1%', w: 4.1, sub: 'GA4 · 4.1% of sessions' },
            { lbl: 'Reached Checkout', val: '35',   pct: '3.1%', w: 3.1, sub: '76% of carts retained' },
            { lbl: 'Purchased',        val: '29',   pct: '2.6%', w: 2.6, sub: '83% of checkouts · 2.59% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£1,476', units: '51', asp: '£28.94', orders: '—', share: '98.5%', shareCls: 'bg' },
            { name: 'Botanical Lash & Brow Serum', net: '£0', units: '0', asp: '—', orders: '—', share: '—', shareCls: 'br' },
            { name: 'Exfoliating B5 Prep Pads 30pk', net: '£23', units: '1', asp: '£22.97', orders: '—', share: '1.5%', shareCls: 'bb' },
            { name: 'Dermal Blade (3 pack)', net: '£0', units: '0', asp: '—', orders: '—', share: '—', shareCls: 'br' }
          ]
        },
        '3m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£7,805',  dCls: 'df', d: '3-mo actuals',  s: 'Jul–Sep 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '261',     dCls: 'df', d: '3-mo actuals',  s: 'AOV £29.90' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£29.90',  dCls: 'df', d: '3-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£27.87',  dCls: 'df', d: 'revenue ÷ units',  s: '280 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.68%',  dCls: 'df', d: 'GA4 · sessions', s: '166 of 6,190 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '6,190',  dCls: 'df', d: 'GA4 · Jul–Sep 2026', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '280',    dCls: 'df', d: 'Lids 272 · Other 8', s: 'Jul–Sep' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '6,190', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '269',   pct: '4.3%', w: 4.3, sub: 'GA4 · 4.3% of sessions' },
            { lbl: 'Reached Checkout', val: '188',   pct: '3.0%', w: 3.0, sub: '70% of carts retained' },
            { lbl: 'Purchased',        val: '166',   pct: '2.7%', w: 2.7, sub: '88% of checkouts · 2.68% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£7,606', units: '272', asp: '£27.96', orders: '—', share: '97.4%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal · Tweezers)', net: '£199', units: '8', asp: '£24.90', orders: '—', share: '2.6%', shareCls: 'bb' }
          ]
        },
        '6m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£15,624',  dCls: 'df', d: '6-mo actuals',  s: 'Apr–Sep 2026' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '539',     dCls: 'df', d: '6-mo actuals',  s: 'AOV £28.99' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.99',  dCls: 'df', d: '6-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£27.03',  dCls: 'df', d: 'revenue ÷ units',  s: '578 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.40%',  dCls: 'df', d: 'GA4 · sessions', s: '322 of 13,441 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '13,441',  dCls: 'df', d: 'GA4 · Apr–Sep 2026', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '578',    dCls: 'df', d: 'Lids 564 · Other 14', s: 'Apr–Sep' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '13,441', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '573',   pct: '4.3%', w: 4.3, sub: 'GA4 · 4.3% of sessions' },
            { lbl: 'Reached Checkout', val: '349',   pct: '2.6%', w: 2.6, sub: '61% of carts retained' },
            { lbl: 'Purchased',        val: '322',   pct: '2.4%', w: 2.4, sub: '92% of checkouts · 2.40% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£15,315', units: '564', asp: '£27.15', orders: '—', share: '98.0%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal · Tweezers)', net: '£309', units: '14', asp: '£22.08', orders: '—', share: '2.0%', shareCls: 'bb' }
          ]
        },
        '12m': {
          kpis1: [
            { bar: '#404935',      lbl: 'Revenue (inc. VAT)', val: '£29,120',  dCls: 'df', d: '12-mo actuals',  s: 'Oct 25–Sep 26' },
            { bar: 'var(--blue)',  lbl: 'Orders',    val: '1023',     dCls: 'df', d: '12-mo actuals',  s: 'AOV £28.46' },
            { bar: 'var(--green)', lbl: 'AOV',       val: '£28.46',  dCls: 'df', d: '12-mo blended',  s: '' },
            { bar: 'var(--amber)', lbl: 'ASP',       val: '£26.52',  dCls: 'df', d: 'revenue ÷ units',  s: '1098 units sold' }
          ],
          kpis2: [
            { bar: '#404935',      lbl: 'Conversion Rate', val: '2.15%',  dCls: 'df', d: 'GA4 · sessions', s: '630 of 29,269 sessions' },
            { bar: 'var(--blue)',  lbl: 'Sessions',        val: '29,269',  dCls: 'df', d: 'GA4 · Oct 25–Sep 26', s: 'GA4 actuals' },
            { bar: 'var(--green)', lbl: 'Units Sold',      val: '1098',    dCls: 'df', d: 'Lids 1069 · Other 29', s: 'Oct 25–Sep 26' },
            { bar: 'var(--amber)', lbl: 'Returning Cust.', val: '—',      dCls: 'df', d: 'Data unavailable', s: 'not recomputed this run' }
          ],
          funnel: [
            { lbl: 'Sessions',         val: '29,269', pct: '100%', w: 100 },
            { lbl: 'Added to Cart',    val: '1120',   pct: '3.8%', w: 3.8, sub: 'GA4 · 3.8% of sessions' },
            { lbl: 'Reached Checkout', val: '704',   pct: '2.4%', w: 2.4, sub: '63% of carts retained' },
            { lbl: 'Purchased',        val: '630',   pct: '2.2%', w: 2.2, sub: '89% of checkouts · 2.15% CVR' }
          ],
          products: [
            { name: 'Lids by Design Eyelid Lift Strips', net: '£28,551', units: '1069', asp: '£26.71', orders: '—', share: '98.0%', shareCls: 'bg' },
            { name: 'Other SKUs (B5 · Serum · Dermal · Tweezers)', net: '£569', units: '29', asp: '£19.62', orders: '—', share: '2.0%', shareCls: 'bb' }
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
      // Traffic by GA4 default channel group (September 2026) via Reporting Ninja. Sum = 130 of 138 sessions.
      traffic: [
        { lbl: 'Direct',         pct: 64, val: '88', color: 'brand' },
        { lbl: 'Organic Search', pct: 22, val: '30', color: 'blue' },
        { lbl: 'AI Assistant',   pct: 4,  val: '6',  color: 'amber' },
        { lbl: 'Referral',       pct: 4,  val: '6',  color: 'green' }
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
          may:  period(138,  44,  7,  0, '0.00%', 'Sep'),
          '3m': period(638,  79,  13, 3, '0.47%', 'Jul–Sep'),
          '6m': period(1347, 202, 32, 7, '0.52%', 'Apr–Sep'),
          '12m':period(2263, 276, 57, 8, '0.35%', 'Oct 25–Sep 26')
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
