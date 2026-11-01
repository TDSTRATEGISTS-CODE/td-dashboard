/* ===== sections.shopify.data — October 2026 re-bake (ready to paste; replaces `contoursrx` and `newnique` blocks) =====
   Sources: MerchantSpring Shopify ch 33616599 (getSalesByPeriod interval M, tz GMT, includeTax:true; getSalesByProduct
   includeNoInventory:true) + GA4 via Reporting Ninja (properties/394327082, 506386258). Pulled 2026-11-01.
   Also update the sections.shopify header comment: Oct £1,499→£1,341 (-10.5% MoM); GA4 sessions 1,121→1,251;
   purchases 31 vs Orders KPI 44; Newnique 90 sessions Oct. */
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
        { name: 'Lids by Design Eyelid Lift Strips', note: '7 size variants · all in stock', level: 'g', units: '2,809 units', cover: '~1,793 days' },
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
        // ...unchanged helper functions (pend, n, rate, period) from the existing block...
        return {
          may:  period(90,   11,  3,  1, '1.11%', 'Oct'),
          '3m': period(450,  60,  14, 3, '0.67%', 'Aug–Oct'),
          '6m': period(1301, 201, 34, 8, '0.61%', 'May–Oct'),
          '12m':period(2084, 285, 59, 9, '0.43%', 'Nov 25–Oct 26')
        };
      })()
    }

/* ===== sections.pnl.statement — Amazon UK P&L, October 2026 (replaces the existing `statement: {...}` block) ===== */
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
