/**
 * AMACX Dashboard — Data Proxy (Google Apps Script Web App)
 * ----------------------------------------------------------
 * Reads the (private) "AMACX Project Tracker" sheet, computes every value the
 * dashboard needs, and serves it as JSON shaped EXACTLY like the dashboard's
 * `dateRanges` object. The sheet stays private; only this derived JSON is exposed.
 *
 * Deploy:  Extensions ▸ Apps Script (from the sheet) — or a standalone project.
 *   1. Paste this file in.
 *   2. Deploy ▸ New deployment ▸ Web app.
 *        Execute as:  Me
 *        Who has access:  Anyone
 *   3. Copy the /exec URL → paste into the dashboard HTML (DATA_URL constant).
 *
 * Test in a browser: open the /exec URL — you should see the JSON.
 * The dashboard fetches this and falls back to its built-in static values on error.
 *
 * Robustness: data is located by LABEL/HEADER matching (e.g. the row whose first
 * cell is "Revenue Actuals", the two "JANUARY" header columns), NOT by fixed cell
 * coordinates — so inserting rows/columns in the tracker won't break it.
 */

// ============================ CONFIG ============================

var CONFIG = {
  // The Project Tracker spreadsheet. Leave blank to bind to the container sheet.
  SPREADSHEET_ID: '1yJvCPOnxhQO4oa1cUzrnyiORRO6kWKtf1Fw544C-K9Q',

  // Row labels (column A) for the master 2025|2026 month grid. Matched case-insensitively,
  // trimmed, "contains". Adjust here if you rename rows in the sheet.
  ROWS: {
    revenueActuals: 'Revenue Actuals',
    adSpendActuals: 'Ad Spend Actuals',
    adBudget:       'Ad Budget / Spend',        // "Ad Budget / Spend (past vs future)"
    aov:            'Average Order Value',       // "Average Order Value (AOV)"
    units:          'Unit Sold Actuals',
    orders:         'Number of Orders Actuals'
  },

  // Per-market grid TITLE cells (first cell of each grid's header row).
  MARKET_GRIDS: {
    revenue: 'Revenue per Market',
    spend:   'Ad Spend per Market',
    budget:  'Advertising Budgets per Market'
  },

  // Markets in dashboard display order. `key` = flag/css key used by the HTML.
  MARKETS: [
    { name: 'Germany',     code: 'DE',  key: 'de' },
    { name: 'Spain',       code: 'ES',  key: 'es' },
    { name: 'Italy',       code: 'IT',  key: 'it' },
    { name: 'France',      code: 'FR',  key: 'fr' },
    { name: 'Netherlands', code: 'NLD', key: 'nl' }
  ],

  // Per-market TACOS badge thresholds (%). <good = green, <ok = amber, else red.
  TACOS_BADGE: { good: 19, ok: 27 },

  // Editorial copy that is NOT derivable from the sheet. Seeded to today's text so
  // output matches the current dashboard exactly; edit freely. {} means "leave blank".
  COPY: {
    may: {
      revC: 'du', adSales: '€3,318', adSalesD: '▲ 14.7% MoM', adSalesC: 'du', adSalesS: '37.5% of revenue',
      tacosS: 'Target: reduce to <20%', tacosAdS: 'Target <20%'
    },
    '3m':   { label: 'Mar–May 2026', adSales: '—', adSalesD: '3-month total', adSalesC: 'df', adSalesS: '25.3% blended TACOS' },
    '6m':   { label: 'Jan–May 2026 (YTD)', adSales: '—', adSalesD: '5-month total', adSalesC: 'df', adSalesS: '20.4% blended TACOS' },
    '2025': { label: 'Full Year 2025', adSales: '—', adSalesD: 'Full year', adSalesC: 'df', adSalesS: '25.96% blended TACOS',
              revS: 'Jan–Dec 2025 confirmed', spendS: 'Budget €18,880' },
    '12m':  { label: '2025 + 2026 YTD', adSales: '—', adSalesD: 'Combined total', adSalesC: 'df', adSalesS: '2025+2026 blended',
              revS: '2025: €44,833 · 2026 YTD: €28,355', spendS: '2025: €11,638 · 2026: €5,777' }
  }
};

var MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

// ============================ ENTRY POINT ============================

function doGet(e) {
  var payload, status = 'ok';
  try {
    payload = buildDateRanges();
  } catch (err) {
    status = 'error';
    payload = { error: String(err && err.message || err) };
  }
  var body = JSON.stringify({ status: status, generated: new Date().toISOString(), dateRanges: payload });

  // Optional JSONP for environments that block CORS: ?callback=fn
  var cb = e && e.parameter && e.parameter.callback;
  if (cb) {
    return ContentService.createTextOutput(cb + '(' + body + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}

// ============================ DATA EXTRACTION ============================

function openBook_() {
  return CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
}

/** Pull every grid we need, scanning all tabs. Returns raw numeric series. */
function extract_() {
  var sheets = openBook_().getSheets();
  var grids = {};   // all sheet value-matrices, cached
  var found = { master: {}, market: {} };

  sheets.forEach(function (sh) {
    var values = sh.getDataRange().getValues();
    scanMasterRows_(values, found.master);
    scanMarketGrids_(values, found.market);
  });

  return found;
}

/** Find a header row's two "JANUARY" column indices → [jan2025col, jan2026col]. */
function findJanCols_(row) {
  var cols = [];
  for (var c = 0; c < row.length; c++) {
    if (String(row[c]).toUpperCase().indexOf('JANUARY') !== -1) cols.push(c);
  }
  return cols.length >= 2 ? [cols[0], cols[1]] : null;
}

/** Read 12 month cells starting at `start` from a row. */
function readMonths_(row, start) {
  var out = [];
  for (var i = 0; i < 12; i++) out.push(toNum_(row[start + i]));
  return out;
}

/** Master grid: rows keyed by label, each → { y2025:[12], y2026:[12] }. */
function scanMasterRows_(values, into) {
  // Locate the master header row: blank-ish first cell + two JANUARYs + a "2025 TOTALS"-style cell.
  var janCols = null;
  for (var r = 0; r < values.length; r++) {
    var jc = findJanCols_(values[r]);
    if (jc && rowHasTotalsMarker_(values[r])) { janCols = jc; break; }
  }
  if (!janCols) return;

  var wanted = CONFIG.ROWS;
  for (var rr = 0; rr < values.length; rr++) {
    var label = String(values[rr][0]).trim();
    if (!label) continue;
    Object.keys(wanted).forEach(function (key) {
      if (into[key]) return;
      if (label.toUpperCase().indexOf(wanted[key].toUpperCase()) !== -1) {
        into[key] = {
          y2025: readMonths_(values[rr], janCols[0]),
          y2026: readMonths_(values[rr], janCols[1])
        };
      }
    });
  }
}

function rowHasTotalsMarker_(row) {
  for (var c = 0; c < row.length; c++) {
    if (String(row[c]).toUpperCase().indexOf('TOTALS') !== -1) return true;
  }
  return false;
}

/** Per-market grids: into[gridKey][marketName] = { y2025:[12], y2026:[12] }. */
function scanMarketGrids_(values, into) {
  var titles = CONFIG.MARKET_GRIDS; // gridKey -> title text
  for (var r = 0; r < values.length; r++) {
    var first = String(values[r][0]).trim();
    var gridKey = null;
    Object.keys(titles).forEach(function (k) {
      if (first.toUpperCase() === titles[k].toUpperCase()) gridKey = k;
    });
    if (!gridKey) continue;

    var janCols = findJanCols_(values[r]);
    if (!janCols) continue;
    into[gridKey] = into[gridKey] || {};

    // Following rows until a gap: market name in col A (or repeated at jan2026col-? ).
    for (var rr = r + 1; rr < values.length; rr++) {
      var nm = String(values[rr][0]).trim();
      if (!nm) break;                                  // blank row ends the grid
      if (!isKnownMarket_(nm)) break;                  // non-market row ends the grid
      into[gridKey][nm] = {
        y2025: readMonths_(values[rr], janCols[0]),
        y2026: readMonths_(values[rr], janCols[1])
      };
    }
  }
}

function isKnownMarket_(name) {
  return CONFIG.MARKETS.some(function (m) { return m.name.toUpperCase() === name.toUpperCase(); });
}

// ============================ BUILD dateRanges ============================

function buildDateRanges() {
  var d = extract_();
  var m = d.master, mk = d.market;
  if (!m.revenueActuals) throw new Error('Could not locate "Revenue Actuals" row — check CONFIG.ROWS labels.');

  // 2026 month index for the latest reported month = last non-null Revenue Actuals.
  var latest = lastReportedIndex_(m.revenueActuals.y2026);   // e.g. 4 = May

  // Period definitions: which 2026 month indices, plus whether to fold in full 2025.
  var periods = {
    may:  { idx: [latest],                       prev: latest - 1, includes2025: false },
    '3m': { idx: range_(latest - 2, latest),     prev: null,        includes2025: false },
    '6m': { idx: range_(0, latest),              prev: null,        includes2025: false },
    '2025': { idx: [],                           prev: null,        includes2025: true, only2025: true },
    '12m': { idx: range_(0, latest),             prev: null,        includes2025: true }
  };

  var out = {};
  Object.keys(periods).forEach(function (key) {
    out[key] = buildPeriod_(key, periods[key], m, mk, latest);
  });
  return out;
}

function buildPeriod_(key, def, m, mk, latest) {
  var copy = CONFIG.COPY[key] || {};

  var rev   = sumPeriod_(m.revenueActuals, def);
  var spend = sumPeriod_(m.adSpendActuals, def);
  var tacos = rev ? (spend / rev) * 100 : 0;
  var roas  = spend ? (rev / spend) : 0;
  var aov   = pickAov_(m, def, key);

  var o = {
    label: copy.label || defaultLabel_(key, latest),
    shortLabel: copy.label || defaultLabel_(key, latest),

    rev: money0_(rev),   revD: '', revC: copy.revC || 'du', revS: '',
    adSales: copy.adSales || '—', adSalesD: copy.adSalesD || '', adSalesC: copy.adSalesC || 'df', adSalesS: copy.adSalesS || '',
    tacos: pct1_(tacos), tacosD: '', tacosC: sentiment_(tacos, 'tacos'), tacosS: copy.tacosS || '',
    roas: roasFmt_(roas), roasD: '', roasC: sentiment_(roas, 'roas'), roasS: '',

    spend: money0_(spend), spendD: '', spendC: 'df', spendS: '',
    tacosAd: pct1_(tacos), tacosAdD: '', tacosAdC: sentiment_(tacos, 'tacos'), tacosAdS: copy.tacosAdS || '',
    roasAd: roasFmt_(roas), roasAdD: '', roasAdC: sentiment_(roas, 'roas'), roasAdS: '',
    aov: aovFmt_(aov), aovD: '', aovC: 'df', aovS: '',

    mktRows: buildMarketRows_(mk, def)
  };

  // Live deltas only for the latest single month (key === 'may'); aggregates use descriptors.
  if (key === 'may' && def.prev >= 0) {
    var prevRev = m.revenueActuals.y2026[def.prev];
    var prevSpend = m.adSpendActuals.y2026[def.prev];
    var pm = monthShort_(def.prev);
    o.revD = mom_(rev, prevRev) + ' MoM';
    o.revC = (rev >= prevRev) ? 'du' : 'dd';
    o.revS = 'vs ' + money0_(prevRev) + ' ' + pm;
    o.spendD = mom_(spend, prevSpend) + ' MoM';
    o.spendS = 'vs ' + money0_(prevSpend) + ' ' + pm;

    // TACOS: lower is better → a drop is good (du).
    var prevTacos = prevRev ? (prevSpend / prevRev) * 100 : 0;
    var ppd = tacos - prevTacos;
    o.tacosD = (ppd <= 0 ? '▼ ' : '▲ ') + Math.abs(ppd).toFixed(1) + 'pp vs ' + pm;
    o.tacosC = (ppd <= 0 ? 'du' : 'dd');
    o.tacosAdD = o.tacosD; o.tacosAdC = o.tacosC;

    // ROAS: higher is better → a rise is good (du).
    var prevRoas = prevSpend ? (prevRev / prevSpend) : 0;
    var rd = roas - prevRoas;
    o.roasD = (rd >= 0 ? '▲ ' : '▼ ') + Math.abs(rd).toFixed(2) + '× vs ' + pm;
    o.roasC = (rd >= 0 ? 'du' : 'dd');
    o.roasAdD = o.roasD; o.roasAdC = o.roasC;

    o.roasS = (m.units.y2026[latest] || '?') + ' units · AOV ' + aovFmt_(aov);
    o.roasAdS = money0_(rev) + ' revenue';
    o.aovS = (m.orders.y2026[latest] || '?') + ' orders ' + monthShort_(latest);
  } else {
    // Aggregate descriptor text (data-driven where easy).
    o.revD = aggDescriptor_(key);
    o.spendD = aggDescriptor_(key);
    if (key === '3m') {
      o.revS = monthlyBreakdown_(m.revenueActuals.y2026, def.idx);
      o.spendS = monthlyBreakdown_(m.adSpendActuals.y2026, def.idx);
    } else if (key === '6m') {
      var f = def.idx[0], l = def.idx[def.idx.length - 1];
      o.revS = monthShort_(f) + ' ' + money0_(m.revenueActuals.y2026[f]) + ' → ' + monthShort_(l) + ' ' + money0_(m.revenueActuals.y2026[l]);
    }
    var ordersTot = sumPeriod_(m.orders, def);
    if (ordersTot) o.aovS = Math.round(ordersTot).toLocaleString('en-US') + ' orders';
    if (copy.revS) o.revS = copy.revS;
    if (copy.spendS) o.spendS = copy.spendS;
  }
  return o;
}

/** One market table = rows for each market + a Total EU row. */
function buildMarketRows_(mk, def) {
  var rows = [];
  var totBudget = 0, totSpend = 0, totSales = 0;

  CONFIG.MARKETS.forEach(function (mt) {
    var budget = marketSum_(mk.budget, mt.name, def);
    var spend  = marketSum_(mk.spend, mt.name, def);
    var sales  = marketSum_(mk.revenue, mt.name, def);
    totBudget += budget; totSpend += spend; totSales += sales;

    var tac = sales ? (spend / sales) * 100 : null;
    var hasData = (budget || spend || sales);

    rows.push([
      mt.code, mt.key,
      money0_(budget),
      money0_(spend),
      varianceCls_(budget, spend, hasData),
      varianceTxt_(budget, spend, hasData),
      money0_(sales),
      tacosBadgeCls_(tac),
      tac == null ? '—' : pct1_(tac)
    ]);
  });

  var totTac = totSales ? (totSpend / totSales) * 100 : 0;
  var util = totBudget ? Math.round((totSpend / totBudget) * 100) : 0;
  rows.push([
    'Total EU', null,
    money0_(totBudget),
    money0_(totSpend),
    'bg', util + '% utilised',
    money0_(totSales),
    tacosBadgeCls_(totTac), pct1_(totTac)
  ]);
  return rows;
}

// ============================ AGGREGATION HELPERS ============================

function sumPeriod_(series, def) {
  if (!series) return 0;
  var total = 0;
  if (def.includes2025) total += sumArr_(series.y2025);
  if (!def.only2025) def.idx.forEach(function (i) { total += toNum_(series.y2026[i]) || 0; });
  return total;
}

function marketSum_(grid, marketName, def) {
  if (!grid || !grid[marketName]) return 0;
  var s = grid[marketName], total = 0;
  if (def.includes2025) total += sumArr_(s.y2025);
  if (!def.only2025) def.idx.forEach(function (i) { total += toNum_(s.y2026[i]) || 0; });
  return total;
}

function pickAov_(m, def, key) {
  if (!m.aov) return 0;
  if (key === 'may') return toNum_(m.aov.y2026[def.idx[0]]);
  if (key === '2025') return avgArr_(m.aov.y2025);
  if (key === '6m')   return avgArr_(sliceIdx_(m.aov.y2026, def.idx));
  if (key === '3m')   return avgArr_(sliceIdx_(m.aov.y2026, def.idx));
  if (key === '12m')  return avgArr_(m.aov.y2025.concat(sliceIdx_(m.aov.y2026, def.idx)));
  return 0;
}

function lastReportedIndex_(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    var v = toNum_(arr[i]);
    if (v !== null && v !== 0) return i;
  }
  return 0;
}

function monthlyBreakdown_(arr, idx) {
  return idx.map(function (i) { return monthShort_(i) + ' ' + money0_(arr[i]); }).join(' · ');
}
function range_(a, b) { var r = []; for (var i = Math.max(0, a); i <= b; i++) r.push(i); return r; }
function sumArr_(a) { return (a || []).reduce(function (s, v) { return s + (toNum_(v) || 0); }, 0); }
function sliceIdx_(a, idx) { return idx.map(function (i) { return a[i]; }); }
function avgArr_(a) {
  var vals = (a || []).map(toNum_).filter(function (v) { return v !== null && v !== 0; });
  return vals.length ? vals.reduce(function (s, v) { return s + v; }, 0) / vals.length : 0;
}

// ============================ FORMATTING & SENTIMENT ============================

function toNum_(v) {
  if (v === '' || v === null || v === undefined) return null;
  if (typeof v === 'number') return v;
  var s = String(v).replace(/[€$,\s]/g, '').replace(/%/g, '').trim();
  if (s === '' || s === '-' || s === '—') return null;
  var n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function money0_(n) {
  var v = Math.round(Number(n) || 0);
  return '€' + v.toLocaleString('en-US');
}
function pct1_(n) { return (Number(n) || 0).toFixed(1) + '%'; }
function roasFmt_(n) { return (Number(n) || 0).toFixed(2) + '×'; }
function aovFmt_(n) {
  var v = Number(n) || 0;
  return Number.isInteger(v) ? '€' + v : '€' + v.toFixed(2);
}

function mom_(curr, prev) {
  if (!prev) return '—';
  var pct = ((curr - prev) / prev) * 100;
  var arrow = pct >= 0 ? '▲' : '▼';
  return arrow + ' ' + Math.abs(pct).toFixed(1) + '%';
}

function sentiment_(value, kind) {
  // Direction of "good" differs by metric; aggregates default neutral elsewhere.
  return 'df'; // KPI sentiment for non-'may' periods is neutral; 'may' overrides explicitly.
}

function varianceCls_(budget, spend, hasData) {
  if (!hasData) return 'bb';
  return (spend <= budget) ? 'bg' : 'br';
}
function varianceTxt_(budget, spend, hasData) {
  if (!hasData) return 'Early launch';
  var diff = Math.round(budget - spend);
  if (diff === 0) return 'On budget';
  return (diff > 0 ? '▼ ' : '▲ ') + '€' + Math.abs(diff).toLocaleString('en-US') + (diff > 0 ? ' under' : ' over');
}
function tacosBadgeCls_(tac) {
  if (tac == null) return 'bb';
  if (tac < CONFIG.TACOS_BADGE.good) return 'bg';
  if (tac <= CONFIG.TACOS_BADGE.ok) return 'ba';
  return 'br';
}

function defaultLabel_(key, latest) {
  var mname = MONTHS[latest].charAt(0) + MONTHS[latest].slice(1).toLowerCase();
  if (key === 'may') return mName_(latest) + ' 2026';
  if (key === '3m')  return mName_(latest - 2) + '–' + mName_(latest) + ' 2026';
  if (key === '6m')  return 'Jan–' + mName_(latest) + ' 2026 (YTD)';
  if (key === '2025') return 'Full Year 2025';
  if (key === '12m') return '2025 + 2026 YTD';
  return key;
}
function mName_(i) { return MONTHS[((i % 12) + 12) % 12].charAt(0) + MONTHS[((i % 12) + 12) % 12].slice(1, 3).toLowerCase(); }
function monthShort_(i) { return mName_(i); }
function aggDescriptor_(key) {
  return ({ '3m': '3-month actuals', '6m': '5-month actuals', '2025': 'Full year actuals', '12m': 'Actuals only' })[key] || '';
}
