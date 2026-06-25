/**
 * Harvaza "Founder Dashboard" — Google Apps Script proxy.
 * ------------------------------------------------------------------
 * Returns the founder dashboard data as JSON (JSONP) for the dashboard's `overlay:'founder'`:
 *   • FINANCIALS  ← Google Sheet "Founder Dashboard" (Forecast tab): overview KPIs + revenue chart,
 *                   P&L KPIs + chart + 12-month table.
 *   • CONTEXT     ← Notion "Bervera Acquisition — Deal Hub": overview Tasks (open handover to-dos) +
 *                   Milestones (Timeline table). Optional — skipped if NOTION_TOKEN isn't set.
 * The dashboard deep-merges j.founder onto the baked sections, so anything omitted here (stock
 * warnings, the alert, loan, stock phases) stays static in clients/harvaza/data.js.
 *
 * DEPLOY (sheet proxy):
 *   1. Extensions → Apps Script (or a standalone project). Paste this file, Save.
 *   2. Set the tab names below if they differ. SHEET_ID is already the Founder Dashboard sheet.
 *   3. Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone → Deploy.
 *   4. Copy the /exec URL into dashboard/clients/harvaza/config.js → dataSource.url.
 *   Re-deploy a NEW VERSION (Manage deployments → edit → New version) after any edit.
 *
 * NOTION SETUP (optional, for the Tasks + Milestones cards):
 *   a. notion.so/my-integrations → New internal integration → copy the secret.
 *   b. Apps Script → Project Settings → Script properties → add NOTION_TOKEN = <secret>.
 *   c. Open the Deal Hub page in Notion → ••• → Connections → add your integration.
 *   d. Redeploy a new version. Verify with  <exec URL>?debug=1  (shows parsed tasks/milestones).
 *
 * VERIFY:  open  <your /exec URL>?debug=1   to see the parsed numbers + Notion cards.
 */

// ---- CONFIG ----
// SHEET_ID: opened by ID so this works as a STANDALONE script (getActiveSpreadsheet() is null then).
var SHEET_ID = '16vumWzCBp02_KrJHQgXw4MBqShOEr0PBrUf52uWUq9A';
// Tab names (case-insensitive; falls back to 1st/2nd sheet if not found).
var FORECAST_TAB = 'Forecast';
var ACTUALS_TAB  = 'Actuals';

// ---- Notion (Brand-Acquisition "Deal Hub" → overview Tasks + Milestones cards) ----
// The token lives in Script Properties (Project Settings → Script properties → add NOTION_TOKEN) so
// it never sits in this file/repo. Leave the property unset to skip Notion (financials still work).
var NOTION_TOKEN = PropertiesService.getScriptProperties().getProperty('NOTION_TOKEN') || '';
var DEAL_HUB_PAGE_ID = '36ed3da0-5122-8109-b763-e42810bc8e26';   // 🥥 Bervera Acquisition — Deal Hub
var NOTION_VERSION = '2022-06-28';
var TASK_SECTION = 'Handover';      // pull OPEN to-dos from the H1 section whose title contains this
var MAX_TASKS = 5;
var TIMELINE_SECTION = 'Timeline';  // milestones come from the table under the H1 containing this
var MAX_MILESTONES = 6;

// ---- Static figures NOT held in the sheet (loan terms, one-offs). Edit here if they change. ----
var LOAN_REPAY_MONTHLY = 750;                                              // £/month
var LOAN_INTEREST = [188,188,188,188,188,188,188,188,188,188,188,187];     // 12 months (10% p.a.)
var CAPITAL_REQUIRED = '£27,676';                                     // Overview KPI (acq + stock + labels)

// Dashboard month order = fiscal Jun→May. Sheet columns are in the same order.
var MONTH_LABELS = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
var OLIVE = '#2C3420', GOLD = '#C8A84B', GREEN = '#3B6D11';

// Expense line items to read from the sheet, in display order (label must match column A).
var EXPENSE_LABELS = [
  'Warehouse Costs', 'Customs & Imports', 'Software Costs', 'Shopify', 'Google & Domain',
  'Annual Business Costs', 'Amazon General Expenses', 'Accounting Fees', 'Service Fees', 'Marketing & Advertising'
];

function doGet(e) {
  var cb = (e && e.parameter && e.parameter.callback) || '';
  var debug = e && e.parameter && e.parameter.debug;
  var out;
  try { out = buildPayload(!!debug); }
  catch (err) { out = { status: 'error', error: String(err && err.stack || err) }; }
  var json = JSON.stringify(out);
  if (cb) return ContentService.createTextOutput(cb + '(' + json + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function buildPayload(debug) {
  var ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  // Find the forecast sheet by CONTENT (a 'Revenue Estimate' row), not tab name/position — robust to
  // new tabs (e.g. a SKU master) being added or the forecast tab being renamed/moved.
  var fcSheet = findSheet(ss, FORECAST_TAB, 'Revenue Estimate', null);
  var fc = readTab(fcSheet);

  var rev   = fc.row('Revenue Estimate')      || zeros();
  var cogs  = fc.row('Cost of Goods Estimate') || zeros();

  var expenses = [];
  EXPENSE_LABELS.forEach(function (lbl) {
    var arr = fc.row(lbl);
    if (arr) expenses.push({ label: lbl, arr: arr });
  });

  var gross = sub(rev, cogs);
  var opex  = sumRows(expenses.map(function (x) { return x.arr; }));
  var pbd   = sub(gross, opex);                                  // profit before debt
  var repay = MONTH_LABELS.map(function () { return LOAN_REPAY_MONTHLY; });
  var net   = sub(sub(pbd, repay), LOAN_INTEREST);               // net after debt

  // ---- P&L Detail table ----
  var rows = [];
  rows.push({ section: 'Revenue & COGS' });
  rows.push({ cells: cells('Revenue', rev) });
  rows.push({ cls: 'red',   cells: cells('COGS', cogs) });
  rows.push({ total: true, cls: 'green', cells: cells('Gross profit', gross) });
  rows.push({ section: 'Operating expenses' });
  expenses.forEach(function (x) { rows.push({ cls: 'red', cells: cells(x.label, x.arr, true) }); });
  rows.push({ total: true, cls: 'green', cells: cells('Profit before debt', pbd) });
  rows.push({ section: 'Debt service' });
  rows.push({ cls: 'red', cells: cells('Loan repayment', repay) });
  rows.push({ cls: 'red', cells: cells('Loan interest (10%)', LOAN_INTEREST) });
  rows.push({ total: true, cls: 'green', cells: cells('Net profit after debt', net) });

  var debtTotal = sum(repay) + sum(LOAN_INTEREST);

  var founder = {
    overview: {
      kpis: [
        kpi(OLIVE, 'Total revenue',          money(sum(rev)),  'df', '12-month forecast'),
        kpi(GOLD,  'Gross profit',           money(sum(gross)),'df', 'After COGS'),
        kpi(GREEN, 'Profit before debt',     money(sum(pbd)),  'du', 'After all operating costs'),
        kpi('#A32D2D', 'Total capital required', CAPITAL_REQUIRED, 'dd', 'Acq. + stock + labels + reorder')
      ],
      revChart: chart([
        { values: rev, color: OLIVE, area: true, main: true },
        { values: pbd, color: GOLD,  dash: true }
      ], [{ name: 'Revenue', color: OLIVE }, { name: 'Profit before debt', color: GOLD }])
    },
    pnl: {
      kpis: [
        kpi(OLIVE, 'Total revenue', money(sum(rev)),  'df', 'Jun 26 – May 27'),
        kpi(GOLD,  'Total COGS',    money(sum(cogs)), 'dd', 'From cost sheet'),
        kpi(GREEN, 'Total opex',    money(sum(opex)), 'df', 'Excl. debt service'),
        kpi('#A32D2D', 'Debt service', money(debtTotal), 'dd', 'Repayment + interest')
      ],
      chart: chart([
        { values: rev,   color: OLIVE, main: true },
        { values: gross, color: GOLD },
        { values: net,   color: GREEN }
      ], [{ name: 'Revenue', color: OLIVE }, { name: 'Gross profit', color: GOLD }, { name: 'Net after debt', color: GREEN }]),
      table: { cols: ['Line item'].concat(MONTH_LABELS).concat(['Total']), rows: rows }
    }
  };

  // ---- Notion overlay: Tasks + Milestones cards (financials above stay sheet-driven) ----
  var notionError = null;
  try {
    if (NOTION_TOKEN) {
      var nov = buildNotionOverview();
      if (nov.tasks) founder.overview.tasks = nov.tasks;
      if (nov.milestones) founder.overview.milestones = nov.milestones;
    }
  } catch (ne) { notionError = String(ne && ne.message || ne); }

  // ---- Stock & COGS (from the SKU master table + forecast Unit Targets) ----
  var stockError = null;
  try {
    var stock = buildStockSection(ss, fc);
    if (stock) founder.stock = stock;
  } catch (se) { stockError = String(se && se.message || se); }

  // ---- Actuals tab (read same labels; surfaced later — included now for plumbing) ----
  var actuals = null;
  try {
    var acSheet = ss.getSheetByName(ACTUALS_TAB) || findSheet(ss, ACTUALS_TAB, 'Revenue Actual', fcSheet.getName());
    var ac = readTab(acSheet);
    actuals = { months: MONTH_LABELS, revenue: ac.row('Revenue Actual') || ac.row('Revenue Estimate'),
                cogs: ac.row('Cost of Goods Actual') || ac.row('Cost of Goods Estimate') };
  } catch (e2) { actuals = { error: String(e2) }; }

  var payload = { status: 'ok', founder: founder, actuals: actuals };
  if (debug) payload.debug = {
    forecastSheet: fcSheet.getName(), monthCol0: fc.col0, revenue: rev, cogs: cogs,
    grossTotal: sum(gross), pbdTotal: sum(pbd),
    notionError: notionError, tasks: founder.overview.tasks || null, milestones: founder.overview.milestones || null,
    stockError: stockError, stock: founder.stock || null
  };
  return payload;
}

// ---------- sheet reading ----------
function getSheet(ss, name, fallbackIdx) {
  var sh = ss.getSheetByName(name);
  if (!sh) { var all = ss.getSheets(); sh = all[fallbackIdx] || all[0]; }
  return sh;
}
// True if any row's column A equals `label` (case-insensitive).
function sheetHasLabel(sh, label) {
  var vals = sh.getDataRange().getValues(), L = String(label).trim().toLowerCase();
  for (var i = 0; i < vals.length; i++) { if (String(vals[i][0]).trim().toLowerCase() === L) return true; }
  return false;
}
// Find a sheet by content: preferred tab name if it has the label, else the first sheet that does
// (skipping exceptName). Falls back to the named sheet / first sheet. Robust to added/renamed tabs.
function findSheet(ss, preferredName, label, exceptName) {
  var named = preferredName ? ss.getSheetByName(preferredName) : null;
  if (named && sheetHasLabel(named, label)) return named;
  var all = ss.getSheets();
  for (var i = 0; i < all.length; i++) {
    if (exceptName && all[i].getName() === exceptName) continue;
    if (sheetHasLabel(all[i], label)) return all[i];
  }
  return named || all[0];
}
function readTab(sh) {
  var values = sh.getDataRange().getValues();
  // Find the header row with the month names; record the column index of 'June'.
  var col0 = 1;
  for (var r = 0; r < Math.min(values.length, 25); r++) {
    for (var c = 0; c < values[r].length; c++) {
      if (String(values[r][c]).trim().toLowerCase() === 'june') { col0 = c; r = values.length; break; }
    }
  }
  return {
    col0: col0,
    row: function (label) {
      var L = String(label).trim().toLowerCase();
      for (var i = 0; i < values.length; i++) {
        if (String(values[i][0]).trim().toLowerCase() === L) {
          var out = [];
          for (var k = 0; k < 12; k++) out.push(num(values[i][col0 + k]));
          return out;
        }
      }
      return null;
    }
  };
}

// ---------- Notion: parse the Deal Hub page → Tasks (open to-dos) + Milestones (Timeline table) ----------
function notionApi(path) {
  var res = UrlFetchApp.fetch('https://api.notion.com/v1/' + path, {
    method: 'get', muteHttpExceptions: true,
    headers: { 'Authorization': 'Bearer ' + NOTION_TOKEN, 'Notion-Version': NOTION_VERSION }
  });
  var code = res.getResponseCode();
  if (code !== 200) throw new Error('Notion ' + code + ': ' + res.getContentText().slice(0, 180));
  return JSON.parse(res.getContentText());
}
function notionChildren(blockId) {
  var out = [], cursor = '';
  do {
    var j = notionApi('blocks/' + blockId + '/children?page_size=100' + (cursor ? '&start_cursor=' + cursor : ''));
    out = out.concat(j.results || []);
    cursor = j.has_more ? j.next_cursor : '';
  } while (cursor);
  return out;
}
// Concatenate a rich_text array → { text, struck (true if every non-blank run is struck through) }.
function richText(arr) {
  if (!arr || !arr.length) return { text: '', struck: false };
  var text = '', allStruck = true, any = false;
  arr.forEach(function (t) {
    var s = (t.plain_text != null) ? t.plain_text : ((t.text && t.text.content) || '');
    text += s;
    if (s.trim()) { any = true; if (!(t.annotations && t.annotations.strikethrough)) allStruck = false; }
  });
  return { text: text.replace(/\s+/g, ' ').trim(), struck: any && allStruck };
}
function cleanTitle(s) { return s.replace(/\s*[-–—:]\s*$/, '').trim().slice(0, 90); }
function asciiOnly(s) { return s ? s.replace(/[^\x20-\x7E]/g, '').trim() : s; }
// Date string → milestone dot: past/current month = green (done), vague = muted, else amber (upcoming).
function milestoneDot(date) {
  if (!date) return 'muted';
  if (/completion|tbc|complete/i.test(date)) return 'muted';
  var MON = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  var low = date.toLowerCase(), mi = -1;
  for (var k = 0; k < 12; k++) { if (low.indexOf(MON[k]) >= 0) { mi = k; break; } }
  var ym = (date.match(/20\d\d/) || [])[0];
  if (mi < 0 || !ym) return 'muted';
  var now = new Date(), yy = parseInt(ym, 10);
  if (yy < now.getFullYear() || (yy === now.getFullYear() && mi <= now.getMonth())) return 'green';
  if (/~|approx/.test(date)) return 'muted';
  return 'amber';
}
function buildNotionOverview() {
  var blocks = notionChildren(DEAL_HUB_PAGE_ID);
  var section = '', group = '', tasks = [], timelineTableId = null;
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i], t = b.type;
    if (t === 'heading_1') { section = richText(b.heading_1.rich_text).text; group = ''; continue; }
    if (t === 'heading_2') { group = richText(b.heading_2.rich_text).text; continue; }
    if (t === 'heading_3') { group = richText(b.heading_3.rich_text).text; continue; }
    if (t === 'to_do' && section.indexOf(TASK_SECTION) >= 0) {
      var r = richText(b.to_do.rich_text);
      if (!b.to_do.checked && r.text && !r.struck) {
        tasks.push({ dot: 'amber', title: cleanTitle(r.text), sub: asciiOnly(group) || 'Handover' });
      }
    }
    if (t === 'table' && section.indexOf(TIMELINE_SECTION) >= 0 && !timelineTableId) timelineTableId = b.id;
  }
  var overview = {};
  if (tasks.length) overview.tasks = { badge: tasks.length + ' open', items: tasks.slice(0, MAX_TASKS) };
  if (timelineTableId) {
    var milestones = [];
    notionChildren(timelineTableId).forEach(function (rw, idx) {
      if (rw.type !== 'table_row') return;
      var c = rw.table_row.cells || [];
      var name = richText(c[0]).text, date = richText(c[1]).text;
      if (idx === 0 && /milestone/i.test(name)) return;   // header row
      if (!name) return;
      milestones.push({ dot: milestoneDot(date), title: name, sub: date });
    });
    if (milestones.length) overview.milestones = { badge: 'Timeline', items: milestones.slice(0, MAX_MILESTONES) };
  }
  return overview;
}

// ---------- Stock & COGS: read the SKU master table → Current Breakdown + Phase 2 Re-launch ----------
// Finds the sheet whose column A header is 'SKU', reads rows BY COLUMN HEADER (robust to reordering),
// keeps the Bervera coconut packs (Group Name contains 'Pack' — excludes the Hydrte US bottles).
function findSkuValues(ss) {
  var all = ss.getSheets();
  for (var s = 0; s < all.length; s++) {
    var v = all[s].getDataRange().getValues();
    for (var r = 0; r < Math.min(v.length, 10); r++) {
      if (String(v[r][0]).trim().toLowerCase() === 'sku') return { values: v, hr: r };
    }
  }
  return null;
}
function buildStockSection(ss, fc) {
  var found = findSkuValues(ss);
  if (!found) return null;
  var values = found.values, hr = found.hr;
  var header = values[hr].map(function (h) { return String(h).trim().toLowerCase(); });
  function col(name) { return header.indexOf(name.toLowerCase()); }
  var cGroup = col('group name'), cSize = col('size'), cStorfil = col('storfil'),
      cStatus = col('stock status'), cCost = col('cost price');

  var skus = [];
  for (var r = hr + 1; r < values.length; r++) {
    var sku = String(values[r][0] || '').trim();
    if (!sku) break;                                          // blank SKU = end of table
    var group = String(values[r][cGroup] || '');
    if (group.toLowerCase().indexOf('pack') < 0) continue;    // Bervera coconut packs only
    var size = String(values[r][cSize] || '').trim();
    var pack = parseInt((group.match(/\d+/) || ['6'])[0], 10);
    skus.push({ name: size + ' ' + pack + '-pack', size: size, pack: pack,
                cost: num(values[r][cCost]), storfil: num(values[r][cStorfil]),
                status: String(values[r][cStatus] || '').trim() });
  }
  if (!skus.length) return null;

  var u24 = fc.row('Unit Targets (24 case)') || zeros();
  var u750 = fc.row('Unit Targets (750ml)') || zeros();
  function favg(a) { var nz = a.filter(function (v) { return v > 0; }); return nz.length ? Math.round(sum(a) / nz.length) : 0; }
  function monthlyAvg(s) { if (/750/.test(s.size)) return favg(u750); if (s.pack === 24) return favg(u24); return 0; }   // 6x200 → 0
  function badgeCls(st) { var l = st.toLowerCase();
    if (l.indexOf('healthy') >= 0 || l.indexOf('active') >= 0) return 'bg';
    if (l.indexOf('restock') >= 0 || l.indexOf('oos') >= 0 || l.indexOf('out of') >= 0) return 'br';
    if (l.indexOf('arriv') >= 0 || l.indexOf('soon') >= 0 || l.indexOf('low') >= 0) return 'ba';
    return 'bb';
  }

  // Current Breakdown — Storfil stock value (Total Cost = Storfil × Cost/SKU)
  var cb = [], cbTot = 0;
  skus.forEach(function (s) {
    var tc = s.storfil * s.cost; cbTot += tc;
    cb.push({ cells: [ s.name, String(s.storfil), String(s.pack), money2(s.cost),
                       s.storfil ? money(tc) : '—',
                       '<span class="badge ' + badgeCls(s.status) + '">' + s.status + '</span>' ] });
  });
  cb.push({ total: true, cells: ['Total stock value', '', '', '', money(cbTot), ''] });

  // Phase 2 — Re-launch: Monthly CF = forecast units/mo × Cost/SKU
  var p2 = [], cfTot = 0;
  skus.forEach(function (s) {
    var ma = monthlyAvg(s), cf = ma * s.cost; cfTot += cf;
    p2.push({ cells: [ s.name, String(ma), String(s.pack), money2(s.cost), money(cf), 'Monthly re-order' ] });
  });
  p2.push({ total: true, cells: ['Monthly cashflow', '', '', '', money(cfTot), ''] });

  // KPIs — derived per-unit costs + the year COGS total from the sheet
  var s200 = skus.filter(function (x) { return /200/.test(x.size) && x.pack === 24; })[0];
  var s750 = skus.filter(function (x) { return /750/.test(x.size); })[0];
  var cogsTotal = sum(fc.row('Cost of Goods Estimate') || zeros());
  var kpis = [
    kpi(OLIVE, 'Total COGS (year)', money(cogsTotal), 'df', 'From cost sheet'),
    kpi(GOLD, 'Cost per 200ml unit', s200 ? money2(s200.cost / 24) : '—', 'df', s200 ? (money2(s200.cost) + ' per 24-pack') : ''),
    kpi('#1e4fa0', 'Cost per 750ml unit', s750 ? money2(s750.cost / s750.pack) : '—', 'df', s750 ? (money2(s750.cost) + ' per ' + s750.pack + '-pack') : '')
  ];

  return {
    kpis: kpis,
    phases: [
      { title: 'Current Breakdown — Storfil', tag: { text: 'Live', cls: 'bg' },
        cols: ['SKU', 'Storfil Stock', 'Pack Size', 'Cost/SKU', 'Total Cost', 'Stock Status'], rows: cb },
      { title: 'Phase 2 — Re-launch', tag: { text: 'Forecast', cls: 'ba' },
        cols: ['SKU', 'Monthly Average', 'Pack Size', 'Cost/SKU', 'Monthly CF', 'Note'], rows: p2 }
    ]
  };
}

// ---------- helpers ----------
function num(v) { if (v === '' || v == null) return 0; if (typeof v === 'number') return v; var s = String(v).replace(/[^0-9.\-]/g, ''); return s === '' || s === '-' ? 0 : parseFloat(s); }
function zeros() { return [0,0,0,0,0,0,0,0,0,0,0,0]; }
function sum(a) { var t = 0; for (var i = 0; i < a.length; i++) t += a[i]; return t; }
function sub(a, b) { return a.map(function (v, i) { return v - (b[i] || 0); }); }
function sumRows(arrs) { var out = zeros(); arrs.forEach(function (a) { for (var i = 0; i < 12; i++) out[i] += (a[i] || 0); }); return out; }
function money(n) { var neg = n < 0; n = Math.round(Math.abs(n)); var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '−£' : '£') + s; }   // − £
function money2(n) { var neg = n < 0; var p = Math.abs(n).toFixed(2).split('.'); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '−£' : '£') + p.join('.'); }   // 2dp, for unit costs
function cells(label, arr, dashZero) {
  var c = [label], t = 0;
  for (var i = 0; i < 12; i++) { t += arr[i]; c.push((dashZero && !arr[i]) ? '—' : money(arr[i])); }
  c.push(money(t));
  return c;
}
function kpi(bar, lbl, val, dCls, d) { return { bar: bar, lbl: lbl, val: val, dCls: dCls, d: d }; }
function chart(series, legend) {
  var max = 0;
  series.forEach(function (s) { s.values.forEach(function (v) { if (v > max) max = v; }); });
  max = niceMax(max);
  var yTicks = [];
  for (var k = 0; k < 5; k++) yTicks.push(moneyK(max * (1 - k / 4)));
  return { max: max, yTicks: yTicks, xLabels: MONTH_LABELS, xHighlight: OLIVE, series: series, legend: legend };
}
function niceMax(v) { if (v <= 0) return 1; var mag = Math.pow(10, Math.floor(Math.log(v) / Math.LN10)); var f = v / mag, steps = [1,1.5,2,3,4,5,6,8,10]; for (var i = 0; i < steps.length; i++) { if (f <= steps[i]) return steps[i] * mag; } return 10 * mag; }
function moneyK(v) { v = Math.round(v); if (v >= 1000) { var t = v / 1000; return '£' + (t === Math.floor(t) ? t : t.toFixed(1)) + 'k'; } return '£' + v; }
