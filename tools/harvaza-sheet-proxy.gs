/**
 * Harvaza "Founder Dashboard" — Google Apps Script proxy.
 * ------------------------------------------------------------------
 * Reads the Forecast (+ Actuals) tabs of the bound sheet and returns the founder financials
 * as JSON, transformed into the shape the dashboard's `sections.founder` expects. The dashboard
 * fetches this via JSONP (script tag) — works inside the Wix iframe and from file://.
 *
 * DEPLOY (once):
 *   1. In the sheet: Extensions → Apps Script. Paste this file, Save.
 *   2. Set the two TAB names below to match your sheet.
 *   3. Deploy → New deployment → type "Web app" → Execute as: Me · Who has access: Anyone → Deploy.
 *   4. Copy the /exec URL into dashboard/clients/harvaza/config.js → dataSource.url.
 *   Re-deploy (Manage deployments → edit → new version) after any edit to this script.
 *
 * VERIFY:  open  <your /exec URL>?debug=1   in a browser to see the parsed numbers.
 */

// ---- CONFIG ----
// SHEET_ID: the "Founder Dashboard" spreadsheet, opened by ID so this works as a STANDALONE script
// (getActiveSpreadsheet() only works for a sheet-bound script). Leave '' only if bound to the sheet.
var SHEET_ID = '16vumWzCBp02_KrJHQgXw4MBqShOEr0PBrUf52uWUq9A';
// Tab names (case-insensitive; falls back to 1st/2nd sheet if not found).
var FORECAST_TAB = 'Forecast';
var ACTUALS_TAB  = 'Actuals';

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
  var fc = readTab(getSheet(ss, FORECAST_TAB, 0));

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

  // ---- Actuals tab (read same labels; surfaced later — included now for plumbing) ----
  var actuals = null;
  try {
    var ac = readTab(getSheet(ss, ACTUALS_TAB, 1));
    actuals = { months: MONTH_LABELS, revenue: ac.row('Revenue Estimate') || ac.row('Revenue Actual'),
                cogs: ac.row('Cost of Goods Estimate') || ac.row('Cost of Goods Actual') };
  } catch (e2) { actuals = { error: String(e2) }; }

  var payload = { status: 'ok', founder: founder, actuals: actuals };
  if (debug) payload.debug = { monthCol0: fc.col0, revenue: rev, cogs: cogs, opex: opex, grossTotal: sum(gross), pbdTotal: sum(pbd) };
  return payload;
}

// ---------- sheet reading ----------
function getSheet(ss, name, fallbackIdx) {
  var sh = ss.getSheetByName(name);
  if (!sh) { var all = ss.getSheets(); sh = all[fallbackIdx] || all[0]; }
  return sh;
}
function readTab(sh) {
  var values = sh.getDataRange().getValues();
  // Find the header row with the month names; record the column index of 'June'.
  var col0 = 1;
  for (var r = 0; r < Math.min(values.length, 12); r++) {
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

// ---------- helpers ----------
function num(v) { if (v === '' || v == null) return 0; if (typeof v === 'number') return v; var s = String(v).replace(/[^0-9.\-]/g, ''); return s === '' || s === '-' ? 0 : parseFloat(s); }
function zeros() { return [0,0,0,0,0,0,0,0,0,0,0,0]; }
function sum(a) { var t = 0; for (var i = 0; i < a.length; i++) t += a[i]; return t; }
function sub(a, b) { return a.map(function (v, i) { return v - (b[i] || 0); }); }
function sumRows(arrs) { var out = zeros(); arrs.forEach(function (a) { for (var i = 0; i < 12; i++) out[i] += (a[i] || 0); }); return out; }
function money(n) { var neg = n < 0; n = Math.round(Math.abs(n)); var s = String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); return (neg ? '−£' : '£') + s; }   // − £
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
