// ===== dateRanges.may — replace lines `label:` … through end of `marketKpis:{…},` (campaignMix line unchanged here; keep `yoy:` below, replaced separately) =====
  'may': {
    label: 'October 2026', shortLabel: 'October 2026',
    rev: '£11,602', revD: '▼ 8.8% MoM', revC: 'df', revS: 'vs £12,726 Sep',
    adSales: '£4,289', adSalesD: '▼ 12.9% MoM', adSalesC: 'df', adSalesS: '37.0% of revenue',
    tacos: '17.7%', tacosD: '▼ 5.8pp vs Sep', tacosC: 'du', tacosS: 'Target <20%',
    roas: '2.08×', roasD: '▲ 0.44× vs Sep', roasC: 'du', roasS: '454 orders · AOV £25.55',
    spend: '£2,059', spendD: '▼ 31.2% MoM', spendC: 'du', spendS: 'vs £2,992 Sep',
    tacosAd: '17.7%', tacosAdD: '▼ 5.8pp vs Sep', tacosAdC: 'du', tacosAdS: 'Target <20%',
    roasAd: '2.08×', roasAdD: '▲ 0.44× vs Sep', roasAdC: 'du', roasAdS: '£11,602 revenue',
    aov: '£25.55', aovD: '▼ £3.04 MoM', aovC: 'df', aovS: '454 orders Oct',
    mktRows: [
      ['UK','gb','—','£2,048','bb','UK ad-managed','£11,398','ba','18.0%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£105','bb','—'],
      ['USA','us','—','£11','bb','Ads near-paused Oct','£99','ba','10.8%'],
      ['Total',null,'—','£2,059','bb','All 3 markets live','£11,602','ba','17.7%']
    ],
    marketKpis: {
      uk: { rev:'£11,398', adSales:'£4,289', tacos:'18.0%', roas:'2.09×', spend:'£2,048', aov:'£25.84', tacosAd:'18.0%', roasAd:'2.09×', revC:'df', adSalesC:'df', tacosC:'du', roasC:'du', spendC:'du', aovC:'df', tacosAdC:'du', roasAdC:'du', tacosS:'Target <20%', roasS:'441 orders · AOV £25.84', roasAdS:'£11,398 revenue', aovD:'▼ £3.55 MoM', aovS:'441 orders Oct', adSalesS:'37.6% of revenue', revD:'▼ 7.5% MoM', revS:'vs £12,315 Sep', spendD:'▼ 26.8% MoM', spendS:'vs £2,800 Sep', tacosD:'▼ 4.8pp vs Sep', tacosAdD:'▼ 4.8pp vs Sep', roasD:'▲ 0.37× vs Sep', roasAdD:'▲ 0.37× vs Sep', adSalesD:'▼ 11.1% MoM' },
      irl: { rev:'£105', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£35.04', tacosAd:'—', roasAd:'—', revC:'df', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'3 orders', roasAdS:'£105 revenue', aovD:'', aovS:'3 orders Oct', adSalesS:'No ad spend', revD:'▼ 50.8% MoM', revS:'vs £214 Sep', spendD:'', spendS:'No ad spend', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£99', adSales:'£0', tacos:'10.8%', roas:'0.00×', spend:'£11', aov:'£9.90', tacosAd:'10.8%', roasAd:'0.00×', revC:'df', adSalesC:'df', tacosC:'du', roasC:'df', spendC:'du', aovC:'du', tacosAdC:'du', roasAdC:'df', tacosS:'Target <20%', roasS:'10 orders · AOV £9.90', roasAdS:'£99 revenue', aovD:'', aovS:'10 orders Oct', adSalesS:'No ad-attributed sales Oct', revD:'▼ 49.7% MoM', revS:'vs £197 Sep', spendD:'▼ 94.4% MoM', spendS:'vs £192 Sep', tacosD:'▼ 86.7pp vs Sep — small sample', tacosAdD:'▼ 86.7pp vs Sep — small sample', roasD:'▼ 0.53× vs Sep', roasAdD:'▼ 0.53× vs Sep', adSalesD:'▼ 100.0% MoM' }
    },
    // Same-Period-Last-Year comparison (Oct 2026 vs Oct 2025), MerchantSpring actuals (getSalesByPeriod,
    // interval:'w' summed — see the AMACX yoy{} note for why not interval:'M'). UK + Total (UK converted
    // £ + IRL €→£ + USA $→£ at the same static rates as the rest of this file) only: unlike AMACX, NKV's
    // ROAS is adSales÷adSpend (not revenue÷adSpend). Oct-2025 UK base £14080.68 sales / £2716.58 ad
    // spend / £6140.49 ad sales (weekly sum == monthly bucket to the penny). IRL's Oct-2025 base is negligible
    // (€75.18 total) and USA had zero Amazon sales a year prior — neither gets a per-market yoy entry; Total
    // folds their small prior-year contribution in.
    yoy: {
      revD:'▼ 18.0% YoY', revC:'df', revS:'vs £14,145 Oct 2025',
      spendD:'▼ 24.2% YoY', spendC:'du', spendS:'vs £2,717 Oct 2025',
      adSalesD:'▼ 30.2% YoY', adSalesC:'df', adSalesS:'vs £6,140 Oct 2025',
      tacosD:'▼ 1.5pp vs Oct 2025', tacosC:'du',
      tacosAdD:'▼ 1.5pp vs Oct 2025', tacosAdC:'du',
      roasD:'▼ 0.18× vs Oct 2025', roasC:'df',
      roasAdD:'▼ 0.18× vs Oct 2025', roasAdC:'df',
      marketKpis: {
        uk: { revD:'▼ 19.1% YoY', revC:'df', revS:'vs £14,081 Oct 2025', spendD:'▼ 24.6% YoY', spendC:'du', spendS:'vs £2,717 Oct 2025', adSalesD:'▼ 30.2% YoY', adSalesC:'df', adSalesS:'vs £6,140 Oct 2025', tacosD:'▼ 1.3pp vs Oct 2025', tacosC:'du', tacosAdD:'▼ 1.3pp vs Oct 2025', tacosAdC:'du', roasD:'▼ 0.17× vs Oct 2025', roasC:'df', roasAdD:'▼ 0.17× vs Oct 2025', roasAdC:'df' }
      }
    },
  },
// ===== dateRanges['3m'] — replace lines `label:` … through end of `marketKpis:{…},`; leave campaignMix / sec{} lines as-is (other workstream) =====
  '3m': {
    label: 'Aug–Oct 2026', shortLabel: 'Aug–Oct 2026',
    rev: '£42,880', revD: '3-month actuals', revC: 'du', revS: '',
    adSales: '£16,075', adSalesD: '3-month actuals', adSalesC: 'df', adSalesS: '37.5% of revenue',
    tacos: '18.3%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.05×', roasD: '', roasC: 'df', roasS: '',
    spend: '£7,833', spendD: '3-month actuals', spendC: 'df', spendS: '',
    tacosAd: '18.3%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.05×', roasAdD: '', roasAdC: 'df', roasAdS: '£42,880 revenue',
    aov: '£29.11', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£7,627','bb','UK ad-managed','£41,582','ba','18.3%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£551','bb','—'],
      ['USA','us','—','£205','bb','Real ad spend now','£746','br','27.5%'],
      ['Total',null,'—','£7,833','bb','3-month actuals','£42,880','ba','18.3%']
    ],
    marketKpis: {
      uk: { rev:'£41,582', adSales:'£15,973', tacos:'18.3%', roas:'2.09×', spend:'£7,627', aov:'£29.28', tacosAd:'18.3%', roasAd:'2.09×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£41,582 revenue', aovD:'', aovS:'', adSalesS:'38.4% of revenue', revD:'3-month actuals', revS:'', spendD:'3-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'3-month actuals' },
      irl: { rev:'£551', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£39.39', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£551 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£746', adSales:'£101', tacos:'27.5%', roas:'0.49×', spend:'£205', aov:'£19.14', tacosAd:'27.5%', roasAd:'0.49×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£746 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'3-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
// ===== dateRanges['6m'] — replace lines `label:` … through end of `marketKpis:{…},`; leave campaignMix / sec{} lines as-is (other workstream) =====
  '6m': {
    label: 'May–Oct 2026 (6 months)', shortLabel: 'May–Oct 2026',
    rev: '£87,789', revD: '6-month actuals', revC: 'du', revS: '',
    adSales: '£35,569', adSalesD: '6-month actuals', adSalesC: 'df', adSalesS: '40.5% of revenue',
    tacos: '19.0%', tacosD: '', tacosC: 'df', tacosS: 'Target <20%',
    roas: '2.13×', roasD: '', roasC: 'df', roasS: '',
    spend: '£16,702', spendD: '6-month actuals', spendC: 'df', spendS: '',
    tacosAd: '19.0%', tacosAdD: '', tacosAdC: 'df', tacosAdS: 'Target <20%',
    roasAd: '2.13×', roasAdD: '', roasAdC: 'df', roasAdS: '£87,789 revenue',
    aov: '£28.07', aovD: '', aovC: 'df', aovS: '',
    mktRows: [
      ['UK','gb','—','£16,393','bb','UK ad-managed','£84,073','ba','19.5%'],
      ['IRL','ie','—','£0','bb','Early stage · no ads','£1,612','bb','—'],
      ['USA','us','—','£309','bb','Real ad spend now','£2,104','ba','14.7%'],
      ['Total',null,'—','£16,702','bb','6-month actuals','£87,789','ba','19.0%']
    ],
    marketKpis: {
      uk: { rev:'£84,073', adSales:'£35,414', tacos:'19.5%', roas:'2.16×', spend:'£16,393', aov:'£28.35', tacosAd:'19.5%', roasAd:'2.16×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£84,073 revenue', aovD:'', aovS:'', adSalesS:'42.1% of revenue', revD:'6-month actuals', revS:'', spendD:'6-month actuals', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'6-month actuals' },
      irl: { rev:'£1,612', adSales:'£0', tacos:'—', roas:'—', spend:'£0', aov:'£35.04', tacosAd:'—', roasAd:'—', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'No ads yet', roasS:'', roasAdS:'£1,612 revenue', aovD:'', aovS:'', adSalesS:'No ad spend', revD:'Early stage', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' },
      usa: { rev:'£2,104', adSales:'£156', tacos:'14.7%', roas:'0.50×', spend:'£309', aov:'£18.14', tacosAd:'14.7%', roasAd:'0.50×', revC:'du', adSalesC:'df', tacosC:'df', roasC:'df', spendC:'df', aovC:'df', tacosAdC:'df', roasAdC:'df', tacosS:'Target <20%', roasS:'', roasAdS:'£2,104 revenue', aovD:'', aovS:'', adSalesS:'Real ad sales now', revD:'6-month actuals', revS:'', spendD:'', spendS:'', tacosD:'', tacosAdD:'', roasD:'', roasAdD:'', adSalesD:'' }
    },
// ===== dateRanges['12m'] — replace lines `label:` … through end of `marketKpis:{…},`; leave campaignMix / sec{} lines as-is (other workstream) =====
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
// ===== sections.charts — replace the `months:` … `adTacos:` lines inside charts:{} (keep the comment block above; update it: Sep restated to settled bucket values) =====
    charts: {
      months: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      rev: { all:[15290, 14079, 13122, 17869, 12315, 11398], uk:[15290, 14079, 13122, 17869, 12315, 11398], irl:[481, 224, 356, 233, 214, 105], usa:[0, 644, 714, 451, 197, 99] },
      adSpend: { all:[3241, 2932, 2593, 2779, 2800, 2048], uk:[3241, 2932, 2593, 2779, 2800, 2048], irl:[0,0,0,0,0,0], usa:[0, 29, 74, 3, 192, 11] },
      adTacos: { all:[21.2, 20.8, 19.8, 15.6, 22.7, 18.0], uk:[21.2, 20.8, 19.8, 15.6, 22.7, 18.0], irl:[0,0,0,0,0,0], usa:[0, 4.5, 10.4, 0.7, 97.5, 10.8] }
    }
// ===== sections.overview.cvr (line ~240) =====
      cvr: { val:'8.8%', note:'October 2026 · 5,282 sessions', sub:'UK · session conversion' },
