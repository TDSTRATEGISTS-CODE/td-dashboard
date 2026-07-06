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
    revenueTarget:  'Revenue Target',           // "Revenue Target (past vs future)" — dotted line on the Revenue Trend chart
    adSpendActuals: 'Ad Spend Actuals',
    adBudget:       'Ad Budget / Spend',        // "Ad Budget / Spend (past vs future)"
    aov:            'Average Order Value',       // "Average Order Value (AOV)"
    units:          'Unit Sold Actuals',
    orders:         'Number of Orders Actuals',
    forecastTacos:  'Forecast % invested',       // "Forecast % invested (TACOS)" — for the forecast card
    expectedRoas:   'Expected Total ROAS'        // for the forecast card
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

  // Project Scope board — FIXED 0-based columns (no background-colour scanning).
  //   In Progress card  = column E (4) → amber  +  column I (8) Flags & Warnings → red
  //   Completed card    = column G (6) → green
  //   Upcoming Tasks    = column F (5)
  // Each card pulls ONLY from its column(s); nothing else on the sheet feeds them.
  SCOPE: { inProgressCol: 4, upcomingCol: 5, completedCol: 6, flagsCol: 8 },

  // Editorial copy for the proxy's dateRanges KPIs. Under the AMACX 'sections' overlay the dashboard
  // renders the BAKED dateRanges from data.js and consumes ONLY the per-market BUDGET column from this
  // proxy (via overlayBudgets) — so these KPI strings are never shown. Left empty (buildPeriod_ defaults
  // apply). Populate only if this proxy is ever switched to drive dateRanges directly.
  COPY: {}
};

var MONTHS = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];

// ============================ ENTRY POINT ============================

function doGet(e) {
  var payload, sections = null, status = 'ok';
  try {
    payload = buildDateRanges();
  } catch (err) {
    status = 'error';
    payload = { error: String(err && err.message || err) };
  }
  try {
    sections = buildSections();
  } catch (e2) {
    sections = { error: String(e2 && e2.message || e2) };
  }
  var body = JSON.stringify({ status: status, generated: new Date().toISOString(), dateRanges: payload, sections: sections });

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
  var found = { master: {}, market: {}, scope: null };

  sheets.forEach(function (sh) {
    var values = sh.getDataRange().getValues();
    scanMasterRows_(values, found.master);
    scanMarketGrids_(values, found.market);
    if (!found.scope) found.scope = scanProjectScope_(sh);        // first tab that looks like the scope board
  });

  return found;
}

/**
 * Project Scope board → { tasks:[{text,sub,active}], flags:[{level,title,sub}] }.
 * STRICT COLUMN MAPPING (no background-colour scanning) — pulls ONLY from these columns:
 *  - In Progress card  = COLUMN I (flagsCol, 8) "Flags & Warnings" → level RED
 *                        + COLUMN E (inProgressCol, 4) "In Progress" → level AMBER   (red listed first)
 *  - Completed card    = COLUMN G (completedCol, 6), non-empty cells.
 *  - Upcoming Tasks    = COLUMN F (upcomingCol, 5), non-empty cells.
 *  - The same text never appears twice (deduped across all columns; claimed flags→completed→upcoming).
 * Returns null if the sheet doesn't look like the scope board.
 */
function scanProjectScope_(sh) {
  var values = sh.getDataRange().getValues();

  // Only treat a tab as the scope board if it carries a recognisable marker.
  var isBoard = false;
  for (var r0 = 0; r0 < Math.min(values.length, 30) && !isBoard; r0++) {
    for (var c0 = 0; c0 < values[r0].length; c0++) {
      var mk = String(values[r0][c0]).trim().toLowerCase();
      if (mk === 'flags & warnings' || mk === 'flags and warnings' || mk === 'requested activity' || mk === 'onboarding tasks') { isBoard = true; break; }
    }
  }
  if (!isBoard) return null;

  var COL_E = CONFIG.SCOPE.inProgressCol;  // E = 4 → In Progress (amber)
  var COL_F = CONFIG.SCOPE.upcomingCol;    // F = 5 → Upcoming Tasks
  var COL_G = CONFIG.SCOPE.completedCol;   // G = 6 → Completed (green)
  var COL_I = CONFIG.SCOPE.flagsCol;       // I = 8 → Flags & Warnings (red)
  var SKIP = { 'flags & warnings': 1, 'flags and warnings': 1, 'in progress': 1, 'upcoming': 1, 'upcoming tasks': 1,
    'status': 1, 'ongoing': 1, 'completed': 1, 'complete': 1, 'done': 1, 'requested activity': 1, 'onboarding tasks': 1,
    'project scope': 1, 'project tracker': 1, 'advertising & campaigns': 1, 'amazon advertising monthly project ticket': 1 };
  function skip(s) { return !s || s.length < 3 || SKIP[s.toLowerCase()]; }

  var seen = {};
  // Read every non-empty cell in one column → array of trimmed strings (deduped against `seen`).
  function readCol(col) {
    var out = [];
    for (var r = 0; r < values.length; r++) {
      var t = String(values[r][col] != null ? values[r][col] : '').trim();
      if (skip(t) || seen[t.toLowerCase()]) continue;
      seen[t.toLowerCase()] = 1;
      out.push(t);
    }
    return out;
  }

  // In Progress card = Flags & Warnings (col I → red) FIRST, then In Progress (col E → amber).
  var inprog = readCol(COL_I).map(function (t) { return { level: 'red', title: t, sub: '' }; })
    .concat(readCol(COL_E).map(function (t) { return { level: 'amber', title: t, sub: '' }; }));

  // Completed = column G (claimed before Upcoming so a done item never doubles as upcoming).
  var completed = readCol(COL_G).map(function (t) { return { text: t, sub: 'Completed', active: false }; });

  // Upcoming Tasks = column F only.
  var tasks = readCol(COL_F).map(function (t) { return { text: t, sub: 'Upcoming', active: false }; });

  return { tasks: tasks.slice(0, 8), flags: inprog.slice(0, 8), completed: completed.slice(0, 8) };
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

// ============================ BUILD sections (sheet-controlled, LIVE) ============================
// Only the SHEET-controlled deep-page bits: advertising budgets + forecast, overview tasks + flags.
// The MerchantSpring-baked sections (pnl, products, campaigns, inventory, buyBox, cvr) live in the
// dashboard's data.js; app.js overlays ONLY the keys returned here, never the MerchantSpring ones.
function buildSections() {
  var d = extract_();
  var m = d.master, mk = d.market, scope = d.scope || { tasks: [], flags: [], completed: [] };
  if (!m.revenueActuals) return {};
  var latest = lastReportedIndex_(m.revenueActuals.y2026);

  var fwd = [];
  for (var i = latest + 1; i <= Math.min(latest + 5, 11); i++) fwd.push(i);   // forecast = next up-to-5 months
  // budget table = CURRENT reported month + next 3, so the "<Mon> Budget" column matches the live month.
  var budMonths = [];
  for (var b = latest; b <= Math.min(latest + 3, 11); b++) budMonths.push(b);

  // advertising.budgets — next 4 months per market (+ Total EU)
  var budMkts = CONFIG.MARKETS.filter(function (mt) { return mt.code !== 'NLD'; });
  var budRows = budMkts.map(function (mt) {
    var s = mk.budget[mt.name];
    return { name: mt.name, flag: mt.key, cells: budMonths.map(function (i) { return money0_(s ? (toNum_(s.y2026[i]) || 0) : 0); }) };
  });
  budRows.push({ name: 'Total EU', total: true, cells: budMonths.map(function (i) {
    var t = 0; budMkts.forEach(function (mt) { var s = mk.budget[mt.name]; if (s) t += (toNum_(s.y2026[i]) || 0); });
    return money0_(t);
  }) });

  // advertising.forecast — next 5 months (budget / TACOS / ROAS from the sheet)
  var fb = fwd.map(function (i) { return m.adBudget ? (toNum_(m.adBudget.y2026[i]) || 0) : 0; });
  var maxB = Math.max.apply(null, fb.concat([1]));
  var forecast = fwd.map(function (i, k) {
    var b = fb[k];
    var tr = m.forecastTacos ? toNum_(m.forecastTacos.y2026[i]) : null;
    var t = (tr == null) ? null : (Math.abs(tr) <= 1 ? tr * 100 : tr);
    var r = m.expectedRoas ? toNum_(m.expectedRoas.y2026[i]) : null;
    return {
      month: monthShort_(i), budget: money0_(b), pct: Math.round(b / maxB * 100), opacity: 0.7,
      tacos: (t == null ? '—' : Math.round(t) + '%'),
      tacosColor: (t == null ? 'muted' : (t < 22 ? 'green' : (t <= 27 ? 'amber' : 'red'))),
      roas: (r == null || r <= 1 ? '—' : roasFmt_(r)),
      peak: (b === maxB && maxB > 1)
    };
  });

  // overview tasks/flags from the Project Scope board
  // Dynamic headers/subtitle so the table self-labels as months advance (col 0 = current month).
  var budHeaders = budMonths.map(function (i, k) { return monthShort_(i) + (k === 0 ? ' Budget' : ' Forecast'); });
  var budSub = monthShort_(latest) + ' 2026';

  var sections = { advertising: { budgets: { rows: budRows, headers: budHeaders, subLabel: budSub }, forecast: forecast }, overview: {} };

  // sections.charts — the Revenue Trend chart's TARGET line (gold dotted), served LIVE from the sheet's
  // "Revenue Target" row so it self-advances every month and never sticks. Only revTarget is overlaid;
  // rev/adSpend/adSales/TACOS bars stay baked in data.js (adSales is a MerchantSpring metric, not in the
  // sheet). The window = trailing 6 months ending at the latest reported month, matching the baked
  // charts.months window — computed across the 2025→2026 boundary so it's always exactly 6 values.
  if (m.revenueTarget) {
    var tgt24 = (m.revenueTarget.y2025 || []).concat(m.revenueTarget.y2026 || []);   // idx 0=Jan2025 … 12=Jan2026
    var endIdx = 12 + latest, startIdx = endIdx - 5, revTarget = [];
    for (var ti = startIdx; ti <= endIdx; ti++) revTarget.push(Math.round(toNum_(tgt24[ti]) || 0));
    sections.charts = { revTarget: revTarget };
  }

  if (scope.tasks && scope.tasks.length) sections.overview.tasksSpec = { badge: 'From project scope', items: scope.tasks };
  if (scope.flags && scope.flags.length) sections.overview.flagsSpec = { badge: scope.flags.length + ' in progress', items: scope.flags };
  if (scope.completed && scope.completed.length) sections.overview.completedSpec = { badge: scope.completed.length + ' done', items: scope.completed };
  return sections;
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
