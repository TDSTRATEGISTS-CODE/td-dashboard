/* NKV Beauty — client data (window.DASHBOARD_DATA).
   ACTUALS: MerchantSpring MCP, pulled 14 Jun 2026 (channel 71662311, seller A1SNRD9T28Z9ZM), native GBP.
   UK is the live market (real data). Ireland is early-stage (small real May/Apr actuals; longer-period
   figures are approximate). USA is a not-yet-launched placeholder (zeros).
   NOTE: the shared app.js trend-chart axis formatter (moneyK) hardcodes '€' — KPI cards/tables/P&L here
   are all in £, but the two trend-chart Y-axes will display '€' until the template adds a currency option.
   dataSource.type is 'static' (no Sheet/Apps Script proxy for NKV yet). */
window.DASHBOARD_DATA = {
  dateRanges: {
  'may': {
    label: 'May 2026', shortLabel: 'May 2026',
    rev: '£15,693', revD: '▲ 19.1% MoM', revC: 'du', revS: 'vs £13,127 Apr',
    adSales: '£7,637', adSalesD: '▲ 9.2% MoM', adSalesC: 'du', adSalesS: '48.7% of revenue',
    tacos: '20.4%', tacosD: '▲ 1.7pp vs Apr', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.39×', roasD: '▼ 0.53× vs Apr', roasC: 'df', roasS: '573 orders · AOV £27.39',
    spend: '£3,201', spendD: '▲ 33.7% MoM', spendC: 'df', spendS: 'vs £2,394 Apr',
    tacosAd: '20.4%', tacosAdD: '▲ 1.7pp vs Apr', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.39×', roasAdD: '▼ 0.53× vs Apr', roasAdC: 'df', roasAdS: '£15,693 revenue',
    aov: '£27.39', aovD: '', aovC: 'df', aovS: '573 orders May',
    mktRows: [
      ['UK','gb','—','£3,201','bb','UK ad-managed','£15,213','ba','21.0%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£480','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£3,201','bb','85% of catalogue live','£15,693','ba','20.4%']
    ],
    marketKpis: {
      uk: { rev:'£15,213', adSales:'£7,637', tacos:'21.0%', roas:'2.39×', spend:'£3,201', aov:'£27.26', tacosAd:'21.0%', roasAd:'2.39×', revC:'du', adSalesC:'du', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'558 orders · AOV £27.26', roasAdS:'£15,213 revenue', aovD:'', aovS:'558 orders May', adSalesS:'50.2% of revenue', revD:'▲ 19.1% MoM', revS:'vs £12,775 Apr', spendD:'▲ 33.7% MoM', spendS:'vs £2,394 Apr', tacosD:'▲ 2.3pp vs Apr', tacosAdD:'▲ 2.3pp vs Apr', roasD:'▼ 0.53× vs Apr', roasAdD:'▼ 0.53× vs Apr', adSalesD:'▲ 9.2% MoM' },
      irl: { rev:'£480', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£32.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'15 orders', roasAdS:'£480 revenue', aovD:'', aovS:'15 orders May', adSalesS:'No ad spend', revD:'Early stage', revS:'vs £352 Apr', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'—', roasAdS:'Not launched', aovD:'', aovS:'—', adSalesS:'Not launched', revD:'Not launched', revS:'channel pending', spendD:'', spendS:'—', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
  },
  '3m': {
    label: 'Mar–May 2026', shortLabel: 'Mar–May 2026',
    rev: '£46,598', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£24,444', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '52.5% of revenue',
    tacos: '19.0%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.76×', roasD: '', roasC: 'df', roasS: '',
    spend: '£8,845', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.0%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.76×', roasAdD: '', roasAdC: 'df', roasAdS: '£46,598 revenue',
    aov: '£29.30', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£8,845','bb','UK ad-managed','£45,366','ba','19.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£1,232','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£8,845','bb','3-month actuals','£46,598','ba','19.0%']
    ],
    marketKpis: {
      uk: { rev:'£45,366', adSales:'£24,444', tacos:'19.5%', roas:'2.76×', spend:'£8,845', aov:'£29.20', tacosAd:'19.5%', roasAd:'2.76×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£45,366 revenue', aovD:'', aovS:'', adSalesS:'53.9% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£1,232', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£1,232 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage (approx)', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'', roasAdS:'Not launched', aovD:'', aovS:'', adSalesS:'Not launched', revD:'Not launched', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
  },
  '6m': {
    label: 'Jan–May 2026 (YTD)', shortLabel: 'Jan–May 2026',
    rev: '£77,282', revD: '5-month actuals', revC: 'du', revS: '',
    adSales: '£42,847', adSalesD: '5-month actuals', adSalesC: 'df', adSalesS: '55.4% of revenue',
    tacos: '19.5%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.85×', roasD: '', roasC: 'df', roasS: '',
    spend: '£15,046', spendD: '5-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.5%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.85×', roasAdD: '', roasAdC: 'df', roasAdS: '£77,282 revenue',
    aov: '£28.10', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£15,046','bb','UK ad-managed','£75,182','ba','20.0%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£2,100','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£15,046','bb','5-month actuals','£77,282','ba','19.5%']
    ],
    marketKpis: {
      uk: { rev:'£75,182', adSales:'£42,847', tacos:'20.0%', roas:'2.85×', spend:'£15,046', aov:'£27.98', tacosAd:'20.0%', roasAd:'2.85×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£75,182 revenue', aovD:'', aovS:'', adSalesS:'57.0% of revenue', revD:'5-month actuals', revS:'', spendD:'5-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'5-month actuals' },
      irl: { rev:'£2,100', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£2,100 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage (approx)', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'', roasAdS:'Not launched', aovD:'', aovS:'', adSalesS:'Not launched', revD:'Not launched', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
  },
  '12m': {
    label: 'Last 12 Months', shortLabel: 'Last 12 Months',
    rev: '£173,200', revD: 'Trailing 12 months', revC: 'du', revS: 'incl. 1 estimated month (Oct)',
    adSales: '£93,973', adSalesD: 'Trailing 12 months', adSalesC: 'df', adSalesS: '54.3% of revenue',
    tacos: '19.1%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.84×', roasD: '', roasC: 'df', roasS: '',
    spend: '£33,105', spendD: 'Trailing 12 months', spendC: 'df', spendS: '',
    tacosAd: '19.1%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.84×', roasAdD: '', roasAdC: 'df', roasAdS: '£173,200 revenue',
    aov: '£27.60', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£33,105','bb','UK ad-managed','£168,700','ba','19.6%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£4,500','bb','—'],
      ['USA','us','—','£0','bb','Not launched','£0','bb','—'],
      ['Total',null,'—','£33,105','bb','Trailing 12 months','£173,200','ba','19.1%']
    ],
    marketKpis: {
      uk: { rev:'£168,700', adSales:'£93,973', tacos:'19.6%', roas:'2.84×', spend:'£33,105', aov:'£27.42', tacosAd:'19.6%', roasAd:'2.84×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£168,700 revenue', aovD:'', aovS:'', adSalesS:'55.7% of revenue', revD:'Trailing 12 months', revS:'incl. 1 estimated month', spendD:'Trailing 12 months', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'Trailing 12 months' },
      irl: { rev:'£4,500', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£30.00', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£4,500 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage (approx)', revS:'', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£0', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£0', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Not launched', roasS:'', roasAdS:'Not launched', aovD:'', aovS:'', adSalesS:'Not launched', revD:'Not launched', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
    campaignMix: { slices:[ {name:'Sponsored Products',color:'#404935',pct:86.4,sales:'£6.6k',acos:'42.0%'}, {name:'Sponsored Brands',color:'#6b7160',pct:13.6,sales:'£1.0k',acos:'24.7%'}, {name:'Sponsored Display',color:'#a7ab90',pct:0.0,sales:'£0.0k',acos:'n/a'} ] },
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
      buyBox: [
        {flag:'gb',label:'United Kingdom',pct:99,valText:'99.3%',color:'green'},
        {flag:'ie',label:'Ireland',pct:0,valText:'n/a',color:'amber'}
      ],
      cvr: { val:'9.6%', note:'May 2026 · 6,168 sessions', sub:'UK · session conversion' },
      // Stock Warnings = Amazon FBA low-stock / availability only (real, MerchantSpring May 2026).
      // (Account-health/strategy alerts moved to their own section — see ACCOUNT-HEALTH note below.)
      stockWarn: { badge:'2 low stock', items:[
        {level:'amber',title:'Contours Rx 2-Pack (6mm) — low stock',sub:'B0C12KT8L6 · ~11 days cover · 3 units — reorder'},
        {level:'amber',title:'Newnique Advanced Hair Growth Serum — low stock',sub:'B0F8QMT775 · ~15 days cover · 12 units — reorder'},
        {level:'green',title:'No suppressed listings',sub:'0 content/policy blocks · catalogue clean'}
      ] },
      // Account Health = strategy / performance alerts (real, MerchantSpring May 2026). Renders in the
      // bottom-of-Overview "Account Health" card (separate from the stock-only Stock Warnings card).
      healthSpec: { badge:'3 alerts', items:[
        {level:'red',title:'High-ACOS campaigns wasting spend',sub:'Whitening Kits 52.7% · Advanced Hair Growth 159% — review bids & keywords'},
        {level:'amber',title:'Buy Box lost on Contours Rx Assortment',sub:'B0FYR8DQ2G (top SKU) — competing sellers winning the box'},
        {level:'amber',title:'Refund rate 3.3%, up from 2.5%',sub:'16 units refunded in May · watch Contours Rx returns'}
      ] }
    },
    pnl: {
      statement: {
        fixedLabel: 'May 2026 (1–30) · financial basis (MerchantSpring)',
        summary: [ {val:'£13,923',lbl:'Net Revenue',color:'brand'}, {val:'£9,757',lbl:'Total Costs',color:'red'}, {val:'£4,166',lbl:'Net Profit',color:'green'} ],
        margin: { pct:'29.9%', pctColor:'green', note:'May 2026 (30-day) · financial basis (MerchantSpring) · UK channel', rows:[
          {lbl:'Net Revenue', val:'£13,923'},
          {lbl:'Advertising', val:'-£3,255', color:'red'},
          {lbl:'Selling & Shipping Fees', val:'-£3,202', color:'red'},
          {lbl:'COGS', val:'-£3,277', color:'red'},
          {lbl:'Net Profit', val:'£4,166', color:'green', strong:true}
        ] },
        mkt: [
          {name:'United Kingdom',flag:'gb',revenue:'£13,923',adspend:'£3,255',net:'£4,166',netColor:'green',margin:'29.9%',marginCls:'ba'}
        ],
        groups:[
          { header:'Income', rows:[
            {lbl:'Product sales', amount:'£14,400', pct:'103.4%', unit:'£24.66'},
            {lbl:'Refunds', amount:'-£500', pct:'-3.6%', unit:'-£0.86'},
            {lbl:'Reimbursements', amount:'£125', pct:'0.9%', unit:'£0.21'},
            {lbl:'Promotions', amount:'-£451', pct:'-3.2%', unit:'-£0.77'},
            {lbl:'Other income', amount:'£350', pct:'2.5%', unit:'£0.60'},
            {lbl:'Net revenue', amount:'£13,923', pct:'100.0%', unit:'£23.84', total:true}
          ] },
          { header:'Expenses', rows:[
            {lbl:'Advertising', amount:'£3,255', pct:'23.4%', unit:'£5.57'},
            {lbl:'Selling fees', amount:'£2,059', pct:'14.8%', unit:'£3.53'},
            {lbl:'Shipping & fulfilment fees', amount:'£1,143', pct:'8.2%', unit:'£1.96'},
            {lbl:'Cost of goods', amount:'£3,277', pct:'23.5%', unit:'£5.61'},
            {lbl:'Refunds & returns overheads', amount:'£18', pct:'0.1%', unit:'£0.03'},
            {lbl:'Other', amount:'£6', pct:'0.0%', unit:'£0.01'},
            {lbl:'Total expenses', amount:'£9,757', pct:'70.1%', unit:'£16.71', total:true}
          ] },
          { header:'Profit', rows:[
            {lbl:'PROFIT', amount:'£4,166', pct:'29.9%', unit:'£7.13', total:true, profit:true},
            {lbl:'Profit %', amount:'29.9%', accent:'green'}
          ] },
          { header:'Metrics', rows:[
            {lbl:'TACOS %', amount:'21.3%'},
            {lbl:'Ad spend', amount:'£3,255'}
          ] }
        ]
      }
    },
    advertising: {
      // Real May 2026 ad totals (MerchantSpring advertising report, UK channel, GBP).
      metrics: [
        {lbl:'Total Spend',  val:'£3,201', id:'a-spend'},
        {lbl:'Ad Sales',     val:'£7,637', color:'brand'},
        {lbl:'ACOS',         val:'41.9%',  color:'amber'},
        {lbl:'TACOS',        val:'21.0%',  color:'amber', id:'a-tacos'},
        {lbl:'ROAS',         val:'2.39×',  id:'a-roas'},
        {lbl:'Avg. CPC',     val:'£0.87'},
        {lbl:'Impressions',  val:'1.58M'},
        {lbl:'New-to-Brand', val:'10.5%',  color:'green'}
      ],
      // Ad budget = £3,000/mo (NKV tracker · Marketing Activity sheet) vs real May actual spend.
      // Overwrites the template's AMACX placeholder budget table. Goes live via nkv-sheet-proxy.
      budgets: {
        subLabel: 'May 2026 · budget vs actual',
        headers: ['Monthly Budget','May Actual','Variance','Utilisation'],
        rows: [
          {name:'United Kingdom', flag:'gb', cells:['£3,000','£3,201','▲ £201 over','107%']},
          {name:'Total', total:true,         cells:['£3,000','£3,201','▲ £201 over','107%']}
        ]
      },
      // No clean forward ad forecast in the tracker yet (the "Forecast Document" is being rebuilt).
      forecast: [
        {month:'—', budget:'Forecast being rebuilt — see tracker', pct:0, tacos:'—', roas:'—'}
      ],
      campaigns: [
        {name:'UK · Whitening Kits — SP Manual',type:'Sponsored Products',spend:'£880',sales:'£1,668',acos:'52.7%',acosCls:'br',roas:'1.90×',cpc:'£0.98',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Manual',type:'Sponsored Products',spend:'£678',sales:'£1,731',acos:'39.2%',acosCls:'ba',roas:'2.55×',cpc:'£1.05',status:'Active',statusCls:'bg'},
        {name:'UK · Contours Rx Brand Banner',type:'Sponsored Brands',spend:'£256',sales:'£1,040',acos:'24.7%',acosCls:'bg',roas:'4.06×',cpc:'£0.56',status:'Active',statusCls:'bg'},
        {name:'UK · NWN Grow Bundle — SP Auto',type:'Sponsored Products',spend:'£250',sales:'£323',acos:'77.6%',acosCls:'br',roas:'1.29×',cpc:'£0.87',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP PAT',type:'Sponsored Products',spend:'£242',sales:'£653',acos:'37.0%',acosCls:'ba',roas:'2.70×',cpc:'£0.85',status:'Active',statusCls:'bg'},
        {name:'UK · Lids by Design — SP Branded Manual',type:'Sponsored Products',spend:'£92',sales:'£855',acos:'10.8%',acosCls:'bg',roas:'9.28×',cpc:'£0.75',status:'Active',statusCls:'bg'},
        {name:'UK · Eye-Liners — SP Manual',type:'Sponsored Products',spend:'£110',sales:'£221',acos:'49.6%',acosCls:'br',roas:'2.02×',cpc:'£0.96',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP PAT',type:'Sponsored Products',spend:'£87',sales:'£207',acos:'41.9%',acosCls:'ba',roas:'2.39×',cpc:'£0.62',status:'Active',statusCls:'bg'},
        {name:'UK · Newnique Brand Defense — SP Manual',type:'Sponsored Products',spend:'£71',sales:'£225',acos:'31.6%',acosCls:'ba',roas:'3.16×',cpc:'£0.94',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Brow Shapers — SP Branded Manual',type:'Sponsored Products',spend:'£48',sales:'£191',acos:'24.9%',acosCls:'bg',roas:'4.01×',cpc:'£0.88',status:'Active',statusCls:'bg'},
        {name:'UK · Advanced Hair Growth — SP Auto',type:'Sponsored Products',spend:'£64',sales:'£40',acos:'159.4%',acosCls:'br',roas:'0.63×',cpc:'£0.81',status:'Active',statusCls:'bg'},
        {name:'UK · Botanical Lash — SP Auto',type:'Sponsored Products',spend:'£41',sales:'£0',acos:'n/a',acosCls:'br',roas:'0.00×',cpc:'£1.86',status:'Active',statusCls:'bg'},
        {name:'UK · Lilibeth Tweezers — SP Manual',type:'Sponsored Products',spend:'£33',sales:'£50',acos:'66.9%',acosCls:'br',roas:'1.50×',cpc:'£0.78',status:'Paused',statusCls:'ba'}
      ]
    },
    inventory: {
      // Real FBA stock snapshot from MerchantSpring product report (qty + days-cover per SKU). All
      // sold SKUs are currently in stock; the 36.4% is OOS *time during May* (buy-box lost), now restocked.
      // No dispatch-rate source → the Dispatch card auto-hides (app.js).
      kpis: [
        {bar:'green',lbl:'In Stock',val:'44',dCls:'du',d:'SKUs · 0 OOS now',s:'all sold listings live'},
        {bar:'#404935',lbl:'Units on Hand',val:'1,407',dCls:'df',d:'FBA total',s:'across 44 SKUs'},
        {bar:'amber',lbl:'Reorder Watch',val:'2',dCls:'df',dColor:'amber',d:'selling · <15d cover',s:'see priority list'},
        {bar:'red',lbl:'OOS Time (May)',val:'36.4%',dCls:'dd',d:'buy-box lost in May',s:'now restocked'}
      ],
      stock: [
        {dot:'dg',name:'Contours Rx Lids by Design — Assortment 4–7mm',note:'B0FYR8DQ2G · UK · Contours Rx',units:'84 units',days:'~41 days'},
        {dot:'dg',name:'White Luxe Teeth Whitening Kit',note:'B08SCS43Q1 · UK · White Luxe',units:'74 units',days:'~57 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 4mm',note:'B08MJ1PSXN · UK · Contours Rx',units:'101 units',days:'~74 days'},
        {dot:'dg',name:'Contours Rx Lids by Design — 7mm',note:'B018EDU1DA · UK · Contours Rx',units:'63 units',days:'~51 days'},
        {dot:'da',name:'Contours Rx Lids by Design — 2-Pack 6mm',note:'B0C12KT8L6 · UK · low cover',units:'3 units',unitsColor:'amber',days:'~11 days',daysColor:'amber'},
        {dot:'da',name:'Newnique Advanced Hair Growth Serum',note:'B0F8QMT775 · UK · low cover',units:'12 units',unitsColor:'amber',days:'~15 days',daysColor:'amber'},
        {dot:'dg',name:'Newnique Hair Growth Kit — GrowPod',note:'B0FCFVGD6Y · UK · Newnique',units:'30 units',days:'~129 days'}
      ],
      restock: [
        {level:'amber',title:'Contours Rx Lids 2-Pack (6mm) — UK',sub:'B0C12KT8L6 · ~11 days cover · 3 units · selling — order this week'},
        {level:'amber',title:'Newnique Advanced Hair Growth Serum — UK',sub:'B0F8QMT775 · ~15 days cover · 12 units · order soon'}
      ],
      // Supplier Purchase Orders (manufacturer reorder forecast). STATIC fallback transcribed from the
      // tracker; the nkv-sheet-proxy overlays this live once deployed. level = Order-By-Latest urgency.
      supplierPOs: [
        {product:'Contours Rx', lastsUntil:'June', checkAgain:'July', orderBy:'18th August', level:'amber', note:'Nailah is aware'},
        {product:'Newnique', lastsUntil:'March', checkAgain:'October', orderBy:'November', level:'green', note:'Check ZQ Portal'},
        {product:'White Luxe (Kits)', lastsUntil:'August', checkAgain:'July', orderBy:'August', level:'amber', note:'Make sure enough stock for Dec/Jan'},
        {product:'Girlactik', lastsUntil:'July', checkAgain:'May', orderBy:'June/July', level:'red', note:'?'},
        {product:'White Luxe (Strips)', lastsUntil:'Good for now', checkAgain:'January', orderBy:'—', level:'', note:''}
      ]
    },
    products: {
      // KPIs + by-market table = May 2026 (page period). Groups card = trailing 12 months (its label).
      kpis: [
        {bar:'#404935',lbl:'Active SKUs',val:'46',dCls:'df',d:'UK listings',s:'44 sold in May'},
        {bar:'var(--green)',lbl:'Top Brand Rev.',val:'£10,472',dCls:'du',d:'Contours Rx',s:'69% of May sales'},
        {bar:'var(--blue)',lbl:'Orders (May)',val:'558',dCls:'du',d:'▲ 31.9% MoM',s:'423 orders Apr'},
        {bar:'var(--amber)',lbl:'ASP',val:'£26.17',dCls:'df',d:'May avg',s:'per unit'}
      ],
      table: [
        {name:'United Kingdom',flag:'gb',revenue:'£15,213',units:'584',orders:'558',cvr:'9.6%',cvrCls:'bg',aov:'£27.26'},
        {name:'Ireland',flag:'ie',revenue:'£480',units:'18',orders:'15',cvr:'4.4%',cvrCls:'ba',aov:'£32.00'},
        {name:'United States',flag:'us',revenue:'£0',units:'0',orders:'0',cvr:'—',cvrCls:'bb',aov:'£0.00'}
      ],
      // Trailing 12 months (Jun 2025–May 2026) by brand · UK · real MerchantSpring product report.
      // OOS Rate = share of the brand's SKUs currently out of stock (all 0% — catalogue fully in stock now,
      // 40–80 days cover; contrast the period OOS-time metric on the Overview).
      groups: [
        {name:'Contours Rx — Eyelid Strips',sales:'£102,401',units:'3,103',pct:'70%',oosRate:'0%',oosCls:'bg'},
        {name:'White Luxe — Teeth Whitening',sales:'£20,120',units:'572',pct:'14%',oosRate:'0%',oosCls:'bg'},
        {name:'Lilibeth — Brow & Dermaplaning',sales:'£11,352',units:'1,148',pct:'8%',oosRate:'0%',oosCls:'bg'},
        {name:'Newnique — Hair Growth',sales:'£8,861',units:'336',pct:'6%',oosRate:'0%',oosCls:'bg'},
        {name:'Girlactik — Eyeliner',sales:'£4,534',units:'289',pct:'3%',oosRate:'0%',oosCls:'bg'}
      ]
    },
    charts: {
      months: ['Dec','Jan','Feb','Mar','Apr','May'],
      rev: { all:[14646,15743,14073,17378,12775,15213], uk:[14646,15743,14073,17378,12775,15213], irl:[0,0,0,0,352,480], usa:[0,0,0,0,0,0] },
      adSpend: { all:[2069,3241,2960,3250,2394,3201], uk:[2069,3241,2960,3250,2394,3201], irl:[0,0,0,0,0,0], usa:[0,0,0,0,0,0] },
      adTacos: { all:[14.1,20.6,21.0,18.7,18.7,21.0], uk:[14.1,20.6,21.0,18.7,18.7,21.0], irl:[0,0,0,0,0,0], usa:[0,0,0,0,0,0] }
    }
  }
};
