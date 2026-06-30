/* Shared dashboard logic — identical for every client. No client-specific values live here.
   Reads window.DASHBOARD_CONFIG (config.js) and window.DASHBOARD_DATA (data.js), both loaded first. */
(function () {
'use strict';

var CONFIG = window.DASHBOARD_CONFIG;
var DATA   = window.DASHBOARD_DATA;
if (!CONFIG || !DATA) {
  console.error('Dashboard: missing config.js or data.js — check the ?client= param and file paths.');
  return;
}

var CLIENT = new URLSearchParams(location.search).get('client') || 'amacx';
var dateRanges = DATA.dateRanges || {};

// ---------- page registry + client templates ----------
// Every navigable page is registered here (label + sidebar/tab icon). A `page-<key>` block must
// exist in index.html. `currency:true` swaps the icon for the client's currencyIcon (€ / £ / $).
// Templates pick + order pages; `maintenance` keys route to the shared #page-maintenance stub
// (used by Founder clients to expose not-yet-built Amazon pages). New pages added here become
// available to ANY client/template — that's how founder pages can later be offered to others.
var PAGE_REGISTRY = {
  'overview':         { label: 'Overview',              icon: '&#9635;' },
  'pnl':              { label: 'P&amp;L &amp; Expenses', icon: '&#8364;', currency: true },
  'advertising':      { label: 'Advertising',           icon: '&#9670;' },
  'inventory':        { label: 'Inventory',             icon: '&#9723;' },
  'products':         { label: 'Products',              icon: '&#9737;' },
  'keywords':         { label: 'Keywords',              icon: '&#9650;' },
  'amazonpnl':        { label: 'Amazon P&amp;L',        icon: '&#128274;' },
  'shopify':          { label: 'Shopify',               icon: '&#128722;' },
  'shopifypnl':       { label: 'Shopify P&amp;L',       icon: '&#163;' },
  'founder-overview': { label: 'Overview',              icon: '&#9635;' },
  'founder-pnl':      { label: 'P&amp;L Detail',        icon: '&#8364;', currency: true },
  'founder-stock':    { label: 'Stock &amp; COGS',      icon: '&#128230;' },
  'founder-loan':     { label: "Director's Loan",       icon: '&#127974;' }
};
var TEMPLATES = {
  // Amazon analytics clients (amacx, demo) — the original page set. Default when no template set.
  amazon: { pages: ['overview', 'pnl', 'advertising', 'inventory', 'products', 'keywords', 'amazonpnl'] },
  // Founder clients (harvaza) — founder-native pages first, then every Amazon page as a
  // maintenance stub until a founder version is built (drop a key from `maintenance` to go live).
  founder: {
    // 'pnl' (the real P&L renderer) sits at position 2, relabelled "Amazon P&L" via CONFIG.pageLabels.
    pages: ['founder-overview', 'pnl', 'founder-pnl', 'founder-stock', 'founder-loan',
            'advertising', 'inventory', 'products', 'keywords'],
    maintenance: []
  }
};
var PAGES = [];   // resolved [{key,label,icon,maintenance}] for the active client (set by buildNav)

// Resolve the ordered page list for this client from its template (default 'amazon'), honouring
// an explicit CONFIG.pages override and CONFIG.hiddenPages. maintenance comes from the template or
// a CONFIG.maintenancePages override.
function resolvePages() {
  var tmpl = TEMPLATES[CONFIG.template] || TEMPLATES.amazon;
  var keys = CONFIG.pages || tmpl.pages;
  var maint = {}; (CONFIG.maintenancePages || tmpl.maintenance || []).forEach(function (k) { maint[k] = 1; });
  var hidden = {}; (CONFIG.hiddenPages || []).forEach(function (k) { hidden[k] = 1; });
  return keys.filter(function (k) { return !hidden[k]; }).map(function (k) {
    var m = PAGE_REGISTRY[k] || { label: k, icon: '&#9635;' };
    var icon = m.currency ? ((CONFIG.client && CONFIG.client.currencyIcon) || '&#8364;') : m.icon;
    var label = (CONFIG.pageLabels && CONFIG.pageLabels[k]) || m.label;   // per-client nav label override
    return { key: k, label: label, icon: icon, maintenance: !!maint[k] };
  });
}

// Generate the sidebar nav + top tab bar from PAGES (same order, so switchPage's index alignment
// holds). Replaces the formerly-hardcoded markup so any template renders correctly.
function buildNav() {
  PAGES = resolvePages();
  var nav = document.getElementById('sb-nav');
  if (nav) nav.innerHTML = PAGES.map(function (p) {
    return '<div class="nav-item" onclick="switchPage(\'' + p.key + '\')"><span class="nav-ic">' + p.icon + '</span> ' + p.label + '</div>';
  }).join('');
  var tabs = document.getElementById('page-tabs');
  if (tabs) tabs.innerHTML = PAGES.map(function (p) {
    return '<div class="ptab" onclick="switchPage(\'' + p.key + '\')">' + p.label + '</div>';
  }).join('');
}

// MKT lookup (topbar title/subtitle per market) is derived from config.markets.
var MKT = {};
CONFIG.markets.forEach(function (m) { MKT[m.key] = { t: m.t, m: m.m }; });

var currentMarket = CONFIG.defaultMarket || 'all';
var currentPeriod = CONFIG.defaultPeriod || 'may';

// ---------- small DOM helpers ----------
function set(id, v) { var el = document.getElementById(id); if (el && v != null) el.textContent = v; }
function cls(id, c) { var el = document.getElementById(id); if (el) el.className = 'kpi-d ' + c; }

// ---------- navigation (markup uses these via onclick) ----------
window.switchPage = function (key, sideNavEl, tabEl) {
  document.querySelectorAll('.page-content').forEach(function (p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function (n) { n.classList.remove('active'); });
  document.querySelectorAll('.ptab').forEach(function (t) { t.classList.remove('active'); });
  var idx = -1, pg = null;
  for (var i = 0; i < PAGES.length; i++) { if (PAGES[i].key === key) { idx = i; pg = PAGES[i]; break; } }
  // Maintenance pages route to the shared stub (with the page's title); others to their own block.
  var pageEl = document.getElementById((pg && pg.maintenance) ? 'page-maintenance' : 'page-' + key);
  if (pageEl) pageEl.classList.add('active');
  if (pg && pg.maintenance) { var mt = document.getElementById('maint-title'); if (mt) mt.innerHTML = pg.label; }  // innerHTML: render entities (e.g. P&amp;L)
  var navs = document.querySelectorAll('.nav-item'); if (idx >= 0 && navs[idx]) navs[idx].classList.add('active');
  var tabs = document.querySelectorAll('.ptab'); if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active');
  if (sideNavEl) sideNavEl.classList.add('active');
  if (tabEl) tabEl.classList.add('active');
  closeSidebar();
};

window.switchMarket = function (k, el) {
  currentMarket = k;
  document.querySelectorAll('.mkt-btn').forEach(function (b) { b.classList.remove('active'); });
  if (el) el.classList.add('active');
  if (MKT[k]) set('tb-title', MKT[k].t);
  // Repaint the whole period for this market: EU KPIs + per-market overlay + row filter + topbar.
  switchDateRange(currentPeriod);
  closeSidebar();
};

// Overlay the headline KPI cards (Overview + Advertising) with the selected market's numbers.
// Runs at the end of switchDateRange after the EU cards are painted; a no-op for 'All EU' or for
// markets without a marketKpis entry, so those keep the EU totals. Data: dateRanges[p].marketKpis.
function applyMarketKpis(d) {
  if (!d || !d.marketKpis) return;
  var mk = (currentMarket && currentMarket !== 'all') ? d.marketKpis[currentMarket] : null;
  var _adm = el('sec-ad-metrics');   // Ad Metrics detail card: scope label follows the market chip
  if (_adm && _adm.closest) { var _asc = _adm.closest('.card').querySelector('.cfg-scope'); if (_asc) _asc.textContent = (currentMarket && currentMarket !== 'all' && MKT[currentMarket]) ? MKT[currentMarket].t : ((CONFIG.client && CONFIG.client.scopeLabel) || 'All EU'); }
  if (!mk) return;
  set('k-rev', mk.rev);    set('k-rev-d', mk.revD);    cls('k-rev-d', mk.revC);    set('k-rev-s', mk.revS);
  set('k-ad', mk.adSales); set('k-ad-d', mk.adSalesD); cls('k-ad-d', mk.adSalesC); set('k-ad-s', mk.adSalesS);
  if (mk.spend != null) { set('k-spend', mk.spend); set('k-spend-d', mk.spendD); cls('k-spend-d', mk.spendC); set('k-spend-s', mk.spendS); }
  set('k-tacos', mk.tacos); set('k-tacos-d', mk.tacosD); cls('k-tacos-d', mk.tacosC); set('k-tacos-s', mk.tacosS);
  set('k-margin', mk.aov); set('k-margin-d', mk.aovD); cls('k-margin-d', mk.aovC); set('k-margin-s', mk.aovS);
  if (mk.cvr != null) { set('k-cvr', mk.cvr); set('k-cvr-s', mk.cvrS || ''); }
  set('a-spend', mk.spend); set('a-tacos', mk.tacosAd); set('a-roas', mk.roasAd);
  if (mk.adBudget != null) set('a-budget', mk.adBudget);
  if (mk.util != null) set('a-util', mk.util);
  if (mk.impr != null) { set('ak-impr', mk.impr); set('ak-impr-d', mk.imprD); cls('ak-impr-d', mk.imprC); set('ak-impr-s', mk.imprS); }
  if (mk.cpc != null) { set('ak-cpc', mk.cpc); set('ak-cpc-d', mk.cpcD); cls('ak-cpc-d', mk.cpcC); set('ak-cpc-s', mk.cpcS); }
  if (mk.ctr != null) { set('ak-ctr', mk.ctr); set('ak-ctr-d', mk.ctrD); cls('ak-ctr-d', mk.ctrC); set('ak-ctr-s', mk.ctrS); }
  var adKpis = document.querySelectorAll('#page-advertising .kpi');
  if (adKpis.length >= 4) {
    var kd = [
      [mk.spend, mk.spendD, mk.spendC, mk.spendS],
      [mk.tacosAd, mk.tacosAdD, mk.tacosAdC, mk.tacosAdS],
      [mk.roasAd, mk.roasAdD, mk.roasAdC, mk.roasAdS],
      [mk.aov, mk.aovD, mk.aovC, mk.aovS]
    ];
    adKpis.forEach(function (kpi, i) {
      if (!kd[i]) return;
      var ve = kpi.querySelector('.kpi-val'), de = kpi.querySelector('.kpi-d'), se = kpi.querySelector('.kpi-s');
      if (ve) ve.textContent = kd[i][0];
      if (de) { de.textContent = kd[i][1]; de.className = 'kpi-d ' + kd[i][2]; }
      if (se) se.textContent = kd[i][3];
    });
  }
  // NOTE: the "Ad Metrics" detail card (a-spend/a-tacos/a-roas + Budget/Utilisation/CPC) is left on
  // the EU total on purpose — it is explicitly labelled "All EU" and its budget/utilisation/CPC have
  // no clean per-market source, so overlaying only spend/tacos/roas would make it a mixed card.
}

// ---------- market filter (sidebar chips filter every per-market table/list across all tabs) ----------
// "Filter rows only": picking a market hides the rows in the per-market tables/lists that don't
// pertain to it, on every tab. Aggregate KPI cards and trend charts are deliberately LEFT on the
// EU total (they have no per-market breakdown in the data) — they stay labelled "All EU".
// Re-applied after every render (switchDateRange / live overlay) so the filter survives repaints.
var MKT_FILTER_IDS = [
  'sec-bb-losses',    // Overview · Buy Box Losses (per-product, market-tagged by flag)
  'mkt-spend-tbody',  // Advertising · Ad Spend Actuals by Market
  'sec-pnl-mkt',      // P&L · P&L by Marketplace
  'sec-campaigns',    // Advertising · Active Campaigns (rows tagged "DE ·", "IT ·", …)
  'sec-inv-stock',    // Inventory · Stock by ASIN (note line tagged "ASIN · DE FR ES IT")
  'sec-inv-restock',  // Inventory · Restock Priority
  'sec-prod-table',   // Products · Performance by Market
  'sec-kw-table'      // Keywords · Top Performing Keywords (geo tagged "DE · SP")
];

// Join a row's text nodes with a separator so codes at element boundaries stay intact
// (plain textContent glues "…ES/IT" to the next cell's "B086…", corrupting the "IT" token).
function rowText(row) {
  var parts = [], w = document.createTreeWalker(row, NodeFilter.SHOW_TEXT, null, false), n;
  while ((n = w.nextNode())) { var t = n.nodeValue; if (t && t.trim()) parts.push(t.trim()); }
  return parts.join('\n');
}

// Match tokens are DERIVED FROM CONFIG.markets so this stays client-agnostic (no hard-coded
// country list): each market contributes its flag code, its table code (e.g. 'DE') and its
// sidebar chip label (e.g. 'Germany'). A row pertains to a market if any of those appear in it.
// A flag shared by several markets (e.g. UK channels all flagged 'gb') is NOT discriminating, so
// it's dropped and matching falls back to the code/chip text (which stays distinct per channel).
var MARKET_MATCHERS = (function () {
  var ms = (CONFIG.markets || []).filter(function (m) { return m.key !== 'all'; });
  var flagCount = {};
  ms.forEach(function (m) { var f = (m.flag || '').toLowerCase(); if (f) flagCount[f] = (flagCount[f] || 0) + 1; });
  return ms.map(function (m) {
    var f = (m.flag || '').toLowerCase();
    return {
      key: m.key,
      flag: (f && flagCount[f] === 1) ? f : '',                    // unique flagcdn code only, e.g. 'de'
      code: (m.code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), // table code, e.g. 'DE' / 'NLD'
      chip: (m.chip || '').toLowerCase()                           // sidebar/channel label, e.g. 'germany'
    };
  });
})();

// Infer which market(s) a rendered row refers to, from its flag images + visible text.
function rowMarketInfo(row) {
  var html = (row.innerHTML || '').toLowerCase(), text = rowText(row);
  var low = text.toLowerCase();
  var tokens = text.toUpperCase().split(/[^A-Z0-9]+/);   // catches "DE", "FR/ES/IT" style codes
  var set = {};
  MARKET_MATCHERS.forEach(function (m) {
    if (m.flag && html.indexOf('flagcdn.com/16x12/' + m.flag + '.png') >= 0) set[m.key] = 1;
    else if (m.code && tokens.indexOf(m.code) >= 0) set[m.key] = 1;
    else if (m.chip && low.indexOf(m.chip) >= 0) set[m.key] = 1;
  });
  return {
    set: set,
    any: Object.keys(set).length > 0,
    universal: /all markets|all \d+ markets|all four markets|all eu|all uk|across all/i.test(text),
    total: /\btotal\b/i.test(low)
  };
}

function mktEmptyRow(container) {
  var kids = container.children;
  for (var i = 0; i < kids.length; i++) {
    if (kids[i].className && String(kids[i].className).indexOf('mkt-empty') >= 0) return kids[i];
  }
  return null;
}

// Show a tidy placeholder when a market has no rows in a given card (e.g. NLD early-launch),
// rather than leaving a blank card. Removed again as soon as that card has visible rows.
function setMktEmptyState(container, label, hasRows) {
  var ph = mktEmptyRow(container);
  if (hasRows) { if (ph && ph.parentNode) ph.parentNode.removeChild(ph); return; }
  if (ph) return;
  if (container.tagName === 'TBODY') {
    ph = document.createElement('tr');
    ph.className = 'mkt-empty';
    ph.innerHTML = '<td colspan="12" style="text-align:center;color:var(--muted);font-size:12px;padding:14px;">No data for ' + label + ' in this view</td>';
  } else {
    ph = document.createElement('div');
    ph.className = 'mkt-empty';
    ph.style.cssText = 'text-align:center;color:var(--muted);font-size:12px;padding:14px;';
    ph.textContent = 'No data for ' + label + ' in this view';
  }
  container.appendChild(ph);
}

// Keep the per-card "All Markets" dropdowns reflecting the sidebar choice (display only).
function syncMarketSelects(showAll) {
  var hit = showAll ? null : CONFIG.markets.filter(function (m) { return m.key === currentMarket; })[0];
  var chip = (showAll || !hit) ? 'All Markets' : hit.chip;
  var sels = document.querySelectorAll('.js-mkt-select');
  for (var i = 0; i < sels.length; i++) {
    var opts = sels[i].options;
    for (var j = 0; j < opts.length; j++) { if (opts[j].text === chip) { sels[i].selectedIndex = j; break; } }
  }
}

window.applyMarketFilter = function () {
  var M = currentMarket, showAll = (!M || M === 'all');
  var label = (MKT[M] && MKT[M].t) || M;
  MKT_FILTER_IDS.forEach(function (id) {
    var c = document.getElementById(id);
    if (!c) return;
    var anyVisible = false;
    Array.prototype.slice.call(c.children).forEach(function (row) {
      if (row.className && String(row.className).indexOf('mkt-empty') >= 0) return;
      var show = true;
      if (!showAll) {
        var info = rowMarketInfo(row);
        // total/EU rows drop out on a single market; "all markets" rows always pertain; rows with
        // an explicit market set show only if they include the chosen one; untagged rows stay.
        show = info.total ? false : info.universal ? true : info.any ? !!info.set[M] : true;
      }
      row.style.display = show ? '' : 'none';
      if (show) anyVisible = true;
    });
    setMktEmptyState(c, label, showAll || anyVisible);
  });
  syncMarketSelects(showAll);
};

window.toggleSidebar = function () {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('open');
};
window.closeSidebar = closeSidebar;
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// ---------- date-range repaint (the only dynamic table + all KPIs) ----------
window.switchDateRange = function (val) {
  var d = dateRanges[val];
  if (!d) return;
  currentPeriod = val;
  var mktSub = (MKT[currentMarket] ? MKT[currentMarket].m : '') + ' · ' + d.label;
  var tbMkt = document.getElementById('tb-mkt'); if (tbMkt) tbMkt.textContent = mktSub;
  document.querySelectorAll('.dr-period').forEach(function (el) { el.textContent = d.shortLabel; });
  document.querySelectorAll('.dr-chart-sub').forEach(function (el) { el.textContent = d.shortLabel; });
  [1, 2, 3, 4, 5, 6, 7].forEach(function (n) { var el = document.getElementById('sec-period-' + n); if (el) el.textContent = d.shortLabel; });

  set('k-rev', d.rev);     set('k-rev-d', d.revD);     cls('k-rev-d', d.revC);     set('k-rev-s', d.revS);
  set('k-ad', d.adSales);  set('k-ad-d', d.adSalesD);  cls('k-ad-d', d.adSalesC);  set('k-ad-s', d.adSalesS);
  set('k-tacos', d.tacos); set('k-tacos-d', d.tacosD); cls('k-tacos-d', d.tacosC); set('k-tacos-s', d.tacosS);
  // 4th overview KPI = AOV (the headline focus); ROAS remains on the Advertising page.
  set('k-margin', d.aov); set('k-margin-d', d.aovD); cls('k-margin-d', d.aovC); set('k-margin-s', d.aovS);
  // Conversion Rate KPI (now in the Top-Level row) — period values; applyMarketKpis overlays per market.
  set('k-cvr', d.cvr); set('k-cvr-s', d.cvrS);
  set('k-spend', d.spend); set('k-spend-d', d.spendD); cls('k-spend-d', d.spendC); set('k-spend-s', d.spendS);
  // Ad Spend (3rd) + Conversion Rate are OPTIONAL Top-Level cards — shown only when the client supplies them.
  // Size the row to the visible count (g4 → g6) so clients without them aren't left with empty tracks.
  var _cvrCard = el('k-cvr') ? el('k-cvr').closest('.kpi') : null;
  if (_cvrCard) _cvrCard.style.display = (d.cvr != null) ? '' : 'none';
  var _spendCard = el('k-spend') ? el('k-spend').closest('.kpi') : null;
  if (_spendCard) _spendCard.style.display = (d.spend != null) ? '' : 'none';
  var _tlRow = (_cvrCard && _cvrCard.parentNode) || (_spendCard && _spendCard.parentNode);
  if (_tlRow) {
    var _nVis = [].slice.call(_tlRow.children).filter(function (c) { return getComputedStyle(c).display !== 'none'; }).length;
    _tlRow.classList.remove('g4', 'g5', 'g6');
    _tlRow.classList.add('g' + Math.max(4, Math.min(6, _nVis)));
  }

  var adKpis = document.querySelectorAll('#page-advertising .kpi');
  if (adKpis.length >= 4) {
    var kpiData = [
      [d.spend, d.spendD, d.spendC, d.spendS],
      [d.tacosAd, d.tacosAdD, d.tacosAdC, d.tacosAdS],
      [d.roasAd, d.roasAdD, d.roasAdC, d.roasAdS],
      [d.aov, d.aovD, d.aovC, d.aovS]
    ];
    adKpis.forEach(function (kpi, i) {
      if (!kpiData[i]) return;
      var v = kpiData[i][0], delta = kpiData[i][1], c = kpiData[i][2], sub = kpiData[i][3];
      var valEl = kpi.querySelector('.kpi-val');
      var dEl = kpi.querySelector('.kpi-d');
      var sEl = kpi.querySelector('.kpi-s');
      if (valEl) valEl.textContent = v;
      if (dEl) { dEl.textContent = delta; dEl.className = 'kpi-d ' + c; }
      if (sEl) sEl.textContent = sub;
    });
  }
  set('a-spend', d.spend); set('a-tacos', d.tacosAd); set('a-roas', d.roasAd);
  if (d.adBudget != null) set('a-budget', d.adBudget);
  if (d.util != null) set('a-util', d.util);
  // Impressions / Avg CPC / CTR — their own 3 KPI cards (vs prior period). Hidden for clients w/o the data.
  var _akCol = el('ak-col'), _advGrid = el('adv-grid');
  if (d.impr != null) { if (_akCol) _akCol.style.display = ''; if (_advGrid) _advGrid.classList.remove('no-mid'); }
  else { if (_akCol) _akCol.style.display = 'none'; if (_advGrid) _advGrid.classList.add('no-mid'); }
  if (d.impr != null) { set('ak-impr', d.impr); set('ak-impr-d', d.imprD); cls('ak-impr-d', d.imprC); set('ak-impr-s', d.imprS); }
  if (d.cpc != null) { set('ak-cpc', d.cpc); set('ak-cpc-d', d.cpcD); cls('ak-cpc-d', d.cpcC); set('ak-cpc-s', d.cpcS); }
  if (d.ctr != null) { set('ak-ctr', d.ctr); set('ak-ctr-d', d.ctrD); cls('ak-ctr-d', d.ctrC); set('ak-ctr-s', d.ctrS); }

  var tbody = document.getElementById('mkt-spend-tbody');
  if (tbody && d.mktRows) {
    tbody.innerHTML = d.mktRows.map(function (r, i) {
      var name = r[0], flag = r[1], budget = r[2], spend = r[3], vs_cls = r[4], vs_txt = r[5], sales = r[6], tacos_cls = r[7], tacos_txt = r[8];
      var flagImg = flag ? '<img src="https://flagcdn.com/16x12/' + flag + '.png" width="16" height="12" style="vertical-align:middle;margin-right:6px;border-radius:2px;" alt="' + flag.toUpperCase() + '">' : '';
      var isTotal = i === d.mktRows.length - 1;
      var rs = isTotal ? ' style="background:var(--surface2);"' : '';
      var ns = isTotal ? ' style="font-weight:700;"' : '';
      return '<tr' + rs + '><td' + ns + '>' + flagImg + name + '</td><td style="font-weight:600;">' + spend + '</td><td' + ns + '>' + budget + '</td><td><span class="badge ' + vs_cls + '">' + vs_txt + '</span></td><td><span class="badge ' + tacos_cls + '">' + tacos_txt + '</span></td></tr>';
    }).join('');
  }

  // Period-aware charts + section content (clients with sections + per-period data).
  if (DATA.sections) renderPeriodSections(d);

  applyMarketKpis(d);    // overlay headline KPI cards with the selected market (no-op for All EU)
  renderMarketCharts();  // repaint the two trend charts for the selected market (EU for All EU)
  updateMarketChips(d);
  applyMarketFilter();   // re-filter the freshly-rendered per-market rows to the current market
  applyNldPages();       // NLD pre-launch: swap Overview/Advertising/Inventory content for the banner
};

// Netherlands pre-launch: mark Overview/Advertising/Inventory .nld-active when NLD is the selected
// market, so CSS hides their normal content and shows only the pending-launch banner (.nld-ph), while
// the Overview's .nld-keep scope cards stay. P&L is untouched; Products keeps its own #sec-prod-main /
// #sec-prod-nld toggle. Client-agnostic: a no-op for clients with no 'nld' market.
function applyNldPages() {
  var isNld = currentMarket === 'nld';
  ['page-overview', 'page-advertising', 'page-inventory'].forEach(function (id) {
    var p = el(id); if (p) p.classList.toggle('nld-active', isNld);
  });
}

// ---------- config-driven identity / brand / chips ----------
function applyConfig() {
  var C = CONFIG;
  if (C.client.title) document.title = C.client.title;

  var root = document.documentElement;
  if (C.brand) Object.keys(C.brand).forEach(function (k) { root.style.setProperty('--' + k, C.brand[k]); });

  var logo = document.getElementById('cfg-logo');
  if (logo) {
    // logoSrc = shared logo relative to index.html (e.g. 'td-logo.svg'); else per-client folder.
    logo.src = C.client.logoSrc ? C.client.logoSrc : ('clients/' + CLIENT + '/' + C.client.logo);
    logo.alt = C.client.logoAlt || C.client.name || '';
    logo.style.mixBlendMode = C.client.logoBlend || 'normal';
    if (C.client.logoWidth) logo.style.width = C.client.logoWidth;
  }
  set('cfg-portal', C.client.portalLabel);
  set('cfg-client-name', C.client.name);
  set('cfg-client-period', C.client.reportPeriodLabel);
  if (C.client.statusBadge) set('upd-badge-text', C.client.statusBadge);   // topbar badge text (default 'Live')

  if (C.client.scopeLabel) {
    var sc = document.querySelectorAll('.cfg-scope');
    for (var i = 0; i < sc.length; i++) sc[i].textContent = C.client.scopeLabel;
  }
  if (C.client.currencyIcon) set('cfg-pnl-icon', C.client.currencyIcon);

  var f = document.getElementById('cfg-footer');
  if (f && C.client.footer) {
    var ft = C.client.footer;
    var nextLine = ft.next;
    if (ft.autoNext) {   // always "the Nth of next month" (default 5th), computed at load
      var nd = ft.autoNextDay || 5;
      var nx = new Date();
      nx = new Date(nx.getFullYear(), nx.getMonth() + 1, nd);
      var MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      nextLine = 'Next: ' + nd + ' ' + MON[nx.getMonth()] + ' ' + nx.getFullYear();
    }
    f.innerHTML = [ft.cadence, nextLine].filter(Boolean).join('<br>') + (ft.managedBy ? '<br><br>' + ft.managedBy : '');
  }

  var sel = document.getElementById('date-range-select');
  if (sel && C.dateRangeOptions) {
    sel.innerHTML = C.dateRangeOptions.map(function (o) { return '<option value="' + o.value + '">' + o.label + '</option>'; }).join('');
    sel.value = currentPeriod;
  }

  // Hide any pages this client doesn't use (e.g. AMACX keywords — no MerchantSpring source yet).
  (C.hiddenPages || []).forEach(function (key) {
    var pg = document.getElementById('page-' + key);
    if (pg) pg.style.display = 'none';
    document.querySelectorAll('.nav-item, .ptab').forEach(function (el) {
      var oc = el.getAttribute('onclick') || '';
      if (oc.indexOf("'" + key + "'") !== -1) el.style.display = 'none';
    });
  });

  buildNav();          // generate sidebar nav + tabs from the client's template/page list
  buildMarketChips();
}

function buildMarketChips() {
  var wrap = document.getElementById('cfg-markets');
  if (!wrap) return;
  wrap.innerHTML = '';
  CONFIG.markets.forEach(function (mt) {
    var btn = document.createElement('div');
    btn.className = 'mkt-btn' + (mt.key === currentMarket ? ' active' : '');
    btn.dataset.key = mt.key;
    var flagImg = mt.flag ? '<img src="https://flagcdn.com/16x12/' + mt.flag + '.png" width="16" height="12" style="vertical-align:middle;margin-right:6px;border-radius:2px;" alt="' + (mt.code || '').toUpperCase() + '">' : '';
    var pill = mt.launchPill ? ' <span class="nld-pill">' + mt.launchPill + '</span>' : '';
    btn.innerHTML = '<span>' + flagImg + mt.chip + pill + '</span><span class="mkt-rev"></span>';
    btn.addEventListener('click', function () { switchMarket(mt.key, btn); });
    wrap.appendChild(btn);
  });
}

function updateMarketChips(d) {
  var wrap = document.getElementById('cfg-markets');
  if (!wrap || !d) return;
  var salesByCode = {};
  (d.mktRows || []).forEach(function (r) { salesByCode[r[0]] = r[6]; });
  wrap.querySelectorAll('.mkt-btn').forEach(function (btn) {
    var mt = CONFIG.markets.filter(function (m) { return m.key === btn.dataset.key; })[0];
    var rev = btn.querySelector('.mkt-rev');
    if (!mt || !rev) return;
    if (mt.key === 'all') { rev.textContent = d.rev || ''; return; }
    var sales = salesByCode[mt.code];
    if (mt.launchPill && (sales == null || sales === '€0')) rev.textContent = mt.launchPill;
    else rev.textContent = (sales != null ? sales : '');
  });
}

// ---------- live-fetch loading overlay ----------
// For appsScript clients ONLY: cover the page with a subtle cream screen + spinner while the proxy
// fetch is in flight, so the static fallback never flashes. Hidden once live data has rendered, or
// on fetch error / timeout (which reveals the static fallback). Self-contained — injects its own
// markup + CSS, so no index.html changes and no per-client wiring. Uses the client's brand vars.
function showLoadingOverlay() {
  if (document.getElementById('live-loading')) return;   // idempotent
  if (!document.getElementById('live-loading-style')) {
    var st = document.createElement('style');
    st.id = 'live-loading-style';
    st.textContent =
      '#live-loading{position:fixed;inset:0;background:var(--bg,#f1ece6);display:flex;flex-direction:column;' +
        'align-items:center;justify-content:center;gap:30px;z-index:99999;transition:opacity .35s ease;}' +
      '#live-loading.is-hiding{opacity:0;pointer-events:none;}' +
      // — a 6-digit code (OTP style, "###-###") that re-scrambles matrix-style, each digit dropping in from the top —
      '#live-loading .notp{display:flex;align-items:center;gap:6px;}' +
      // no box: the cell is just an invisible fixed slot whose overflow clips the drop-in
      '#live-loading .notp-cell{width:30px;height:56px;display:flex;align-items:center;justify-content:center;overflow:hidden;}' +
      '#live-loading .notp-d{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-weight:800;' +
        'font-size:42px;line-height:1;color:var(--brand,#404935);}' +
      '#live-loading .notp-dash{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-weight:800;' +
        'font-size:34px;line-height:1;color:var(--muted,#6b7160);margin:0 6px;}' +
      '#live-loading .notp-d.drop{animation:nDrop .24s ease;}' +
      '@keyframes nDrop{0%{transform:translateY(-118%);opacity:0;}55%{opacity:1;}100%{transform:translateY(0);opacity:1;}}' +
      // — the cycling status line —
      // fixed-height, no-wrap, vertically-centred row so every phrase sits at the exact same height
      '#live-loading .nload-txt{display:flex;align-items:center;justify-content:center;height:22px;white-space:nowrap;' +
        'font-family:var(--display,sans-serif);font-size:15px;font-weight:600;' +
        'color:var(--muted,#6b7160);letter-spacing:.3px;}' +
      '#live-loading .nload-line{display:inline-block;animation:nTxt .45s ease;}' +
      '@keyframes nTxt{from{opacity:0;transform:translateY(5px);}to{opacity:1;transform:translateY(0);}}' +
      // dots sit in a fixed-width slot so the centred phrase never shuffles sideways as they cycle;
      // an equal-width spacer on the left keeps the phrase truly centred (so it lines up with the OTP row)
      '#live-loading .nload-pad{display:inline-block;width:1.4em;}' +
      '#live-loading .nload-dots{display:inline-block;width:1.4em;text-align:left;}' +
      '#live-loading .nload-dots::after{content:"";animation:nDots 1.3s steps(4,end) infinite;}' +
      '@keyframes nDots{0%{content:"";}25%{content:".";}50%{content:"..";}75%{content:"...";}}' +
      '@media(prefers-reduced-motion:reduce){#live-loading .notp-d{animation:none !important;}}';
    document.head.appendChild(st);
  }
  var ov = document.createElement('div');
  ov.id = 'live-loading';
  ov.setAttribute('role', 'status'); ov.setAttribute('aria-label', 'Loading');
  var cells = '';
  for (var ci = 0; ci < 6; ci++) {
    cells += '<div class="notp-cell"><span class="notp-d" id="notp-d' + ci + '">' + Math.floor(Math.random() * 10) + '</span></div>';
    if (ci === 2) cells += '<span class="notp-dash">-</span>';   // OTP-style "###-###" separator
  }
  ov.innerHTML =
    '<div class="notp">' + cells + '</div>' +
    '<div class="nload-txt"><span class="nload-pad"></span><span class="nload-line" id="nload-line">Digital Dash loading</span><span class="nload-dots"></span></div>';
  (document.body || document.documentElement).appendChild(ov);
  document.documentElement.style.overflow = 'hidden';   // no scrollbar gutter behind the overlay

  // Matrix-style scramble: on each tick only 1–2 random digits re-roll (the rest hold their value).
  // The digits always change (that's the content); only the drop-in *slide* is gated by reduced-motion.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  (window.__notpTimers || []).forEach(function (t) { clearInterval(t); });
  window.__notpTimers = [];
  window.__notpTimers.push(setInterval(function () {
    var howMany = 1 + Math.floor(Math.random() * 2);   // 1 or 2 digits this tick
    var done = {};
    for (var k = 0; k < howMany; k++) {
      var idx = Math.floor(Math.random() * 6);
      if (done[idx]) continue;                          // don't pick the same cell twice
      done[idx] = 1;
      var el = document.getElementById('notp-d' + idx);
      if (!el) continue;
      el.textContent = Math.floor(Math.random() * 10);
      if (!reduce) { el.classList.remove('drop'); void el.offsetWidth; el.classList.add('drop'); }  // slide-in
    }
  }, 420));

  // Cycle the status line through a few playful phrases while the live data loads.
  var phrases = ['Digital Dash loading', 'Numbers dividing by other numbers', 'Deep data downloading', 'Crunching the latest actuals'];
  var pi = 0;
  clearInterval(window.__nloadTimer);
  window.__nloadTimer = setInterval(function () {
    var el = document.getElementById('nload-line'); if (!el) return;
    pi = (pi + 1) % phrases.length;
    el.textContent = phrases[pi];
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';   // replay the fade-in
  }, 2520);
}

function hideLoadingOverlay() {
  clearInterval(window.__nloadTimer);
  (window.__notpTimers || []).forEach(function (t) { clearInterval(t); });
  window.__notpTimers = [];
  var ov = document.getElementById('live-loading');
  document.documentElement.style.overflow = '';         // restore scrolling
  if (!ov) return;
  ov.classList.add('is-hiding');
  setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 400);
}

// ---------- site-wide "update in progress" notice ----------
// If a new build lands while someone is mid-session, their loaded app.js/data.js may now mismatch the
// freshly-deployed shell. Poll the deployed page for a changed APP_VER and, when it differs from the
// version we booted with, cover the dashboard with a refresh prompt rather than leave them on a
// half-stale view. APP_VER is the single source of truth (bumped every deploy). Runs for all clients.
function showUpdateOverlay() {
  if (document.getElementById('update-overlay')) return;
  var st = document.createElement('style');
  st.textContent =
    '#update-overlay{position:fixed;inset:0;background:rgba(241,236,230,.97);display:flex;align-items:center;' +
      'justify-content:center;z-index:100000;padding:24px;font-family:var(--display,sans-serif);}' +
    '#update-overlay .uo-card{max-width:440px;text-align:center;background:var(--surface,#fff);' +
      'border:1px solid var(--border,#e0d9d0);border-radius:18px;padding:34px 30px;box-shadow:0 16px 50px rgba(0,0,0,.16);}' +
    '#update-overlay .uo-ic{width:60px;height:60px;border-radius:16px;background:var(--brand,#404935);color:#fff;' +
      'display:flex;align-items:center;justify-content:center;font-size:30px;margin:0 auto 18px;animation:uoSpinBox 2.2s linear infinite;}' +
    // the box turns one way and the arrow glyph inside it the other; nested, with the arrow at half the
    // period, its net motion is an equal-and-opposite spin to the box
    '#update-overlay .uo-arrow{display:inline-block;animation:uoSpinArrow 1.1s linear infinite;}' +
    '@keyframes uoSpinBox{to{transform:rotate(-360deg);}}' +
    '@keyframes uoSpinArrow{to{transform:rotate(360deg);}}' +
    '#update-overlay .uo-t{font-size:21px;font-weight:700;color:var(--brand,#404935);letter-spacing:-.3px;margin-bottom:9px;}' +
    '#update-overlay .uo-m{font-size:14px;color:var(--muted,#6b7160);line-height:1.6;margin-bottom:22px;}' +
    '#update-overlay .uo-b{font-size:15px;font-weight:700;color:#fff;background:var(--green,#2d6a4f);border:none;' +
      'border-radius:11px;padding:13px 30px;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.12);}' +
    '#update-overlay .uo-b:hover{filter:brightness(1.06);}';
  document.head.appendChild(st);
  var ov = document.createElement('div');
  ov.id = 'update-overlay';
  ov.innerHTML = '<div class="uo-card"><div class="uo-ic"><span class="uo-arrow">&#10227;</span></div>' +
    '<div class="uo-t">You caught us during an update</div>' +
    '<div class="uo-m">Your dashboard will be available shortly<br>&mdash; please refresh.</div>' +
    '<button class="uo-b" type="button" onclick="location.reload()">Refresh</button></div>';
  (document.body || document.documentElement).appendChild(ov);
  document.documentElement.style.overflow = 'hidden';
}

function watchForUpdates() {
  var boot = window.APP_VER;
  if (!boot || !window.fetch) return;
  var shown = false;
  function check() {
    if (shown || document.hidden) return;
    fetch(location.pathname + '?_v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.text() : null; })
      .then(function (t) {
        if (!t) return;
        var m = t.match(/APP_VER\s*=\s*'([^']+)'/);
        if (m && m[1] && m[1] !== boot) { shown = true; showUpdateOverlay(); }
      })['catch'](function () { /* offline / transient — ignore, try again next tick */ });
  }
  setInterval(check, 90000);   // every 90s while the tab is open + visible
  document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
}

// ---------- live data (Apps Script proxy → MerchantSpring in Phase 2) ----------
// Uses JSONP (script-tag), not fetch: works cross-origin in the Wix iframe AND from a
// double-clicked file:// page, with no CORS dependency. The proxy returns cb({...}) when
// called with ?callback=cb.
function loadLiveData() {
  var ds = CONFIG.dataSource || {};
  if (ds.type !== 'appsScript' || !ds.url) return;   // 'static' = data.js only, no overlay
  showLoadingOverlay();                              // hide the static fallback until live renders
  var cb = '__dashCb' + Date.now(), s = document.createElement('script'), done = false, t;
  function finish() { if (done) return; done = true; clearTimeout(t); hideLoadingOverlay(); }
  window[cb] = function (j) {
    try { applyLive(j); }
    finally { delete window[cb]; if (s.parentNode) s.parentNode.removeChild(s); finish(); }
  };
  s.onerror = function () { delete window[cb]; if (s.parentNode) s.parentNode.removeChild(s); finish(); };  // reveal static fallback
  t = setTimeout(finish, 15000);                     // safety net: never spin forever (slow/dead proxy)
  s.src = ds.url + (ds.url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + cb + '&cachebust=' + Date.now();
  document.head.appendChild(s);
}

function applyLive(j) {
  if (!j) return;
  var ds = CONFIG.dataSource || {};

  // Founder-overlay mode (Harvaza): the Apps Script proxy supplies the sheet-derived financial
  // sections (overview KPIs + revenue chart, P&L KPIs/chart/table). Deep-merge them onto the baked
  // sections.founder so the STATIC parts (tasks, milestones, loan, stock phases) survive, then repaint.
  if (ds.overlay === 'founder') {
    if (j.founder && DATA.sections) {
      var jf = j.founder;
      // Guard: if the proxy's financials read as £0 (e.g. the sheet structure changed and the read
      // missed), don't blank the baked numbers — drop the sheet-derived financial keys, keep Notion.
      var k0 = jf.overview && jf.overview.kpis && jf.overview.kpis[0];
      if (k0 && /^[-−]?£?0$/.test(String(k0.val).replace(/[, ]/g, ''))) {
        if (jf.overview) { delete jf.overview.kpis; delete jf.overview.revChart; }
        delete jf.pnl;
      }
      DATA.sections.founder = DATA.sections.founder || {};
      deepMerge(DATA.sections.founder, jf);
      // Chips/topbar are driven by dateRanges (ACTUALS) — the founder forecast must NOT overwrite them.
      if (typeof renderFounderSections === 'function') renderFounderSections();
      switchDateRange(currentPeriod);   // repaint deep pages; chips come from the dateRanges actuals
    }
    if (j.actuals) DATA.sections.founderActuals = j.actuals;   // stashed for a forecast-vs-actual view later
    return;
  }

  // Sections-overlay mode (AMACX): MerchantSpring data is baked in data.js; the proxy supplies
  // ONLY the live sheet-controlled sections (ad budgets/forecast, overview tasks/flags). Merge
  // those into DATA.sections without disturbing the baked MerchantSpring sections, then re-render.
  if (ds.overlay === 'sections') {
    var changed = false;
    if (j.sections && !j.sections.error && DATA.sections) {
      mergeSections(DATA.sections, j.sections);
      if (typeof renderSections === 'function') renderSections();
      changed = true;
    }
    if (j.dateRanges) { overlayBudgets(j.dateRanges); changed = true; }   // live per-market budgets from the sheet
    if (changed) switchDateRange(currentPeriod);
    return;
  }

  // Legacy dateRanges overlay (sheet-based KPIs).
  if (j.status !== 'ok' || !j.dateRanges) return;   // keep static values from data.js
  Object.keys(j.dateRanges).forEach(function (k) {
    if (!dateRanges[k]) { dateRanges[k] = j.dateRanges[k]; return; }
    var live = j.dateRanges[k];
    Object.keys(live).forEach(function (fld) {
      var v = live[fld];
      if (fld === 'mktRows') { if (Array.isArray(v) && v.length) dateRanges[k][fld] = v; }
      else if (v !== '' && v != null) dateRanges[k][fld] = v;   // keep static value when live is blank
    });
  });
  switchDateRange(currentPeriod);
}

// Overlay add's keys onto base, one level deep (so e.g. advertising.budgets merges in without
// dropping the baked advertising.campaigns). Used for the live sheet-controlled sections.
// Recursive merge for the founder overlay: recurse into plain objects, REPLACE arrays + primitives.
// So the proxy's founder.pnl.table (array) swaps in wholesale, while founder.overview keeps its
// static tasks/milestones because only overview.kpis / overview.revChart are present in the payload.
function deepMerge(base, add) {
  if (!base || !add) return base;
  Object.keys(add).forEach(function (k) {
    var v = add[k];
    if (v && typeof v === 'object' && !Array.isArray(v) &&
        base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])) {
      deepMerge(base[k], v);
    } else {
      base[k] = v;
    }
  });
  return base;
}

function mergeSections(base, add) {
  if (!base || !add) return;
  Object.keys(add).forEach(function (k) {
    if (base[k] && typeof base[k] === 'object' && typeof add[k] === 'object' && !Array.isArray(add[k])) {
      Object.keys(add[k]).forEach(function (kk) { base[k][kk] = add[k][kk]; });
    } else {
      base[k] = add[k];
    }
  });
}

// Overlay the live per-market BUDGET (from the sheet, via the proxy's dateRanges) onto the baked
// market-spend table, keeping the MerchantSpring spend/sales. Recomputes the under/over variance
// and Total-EU utilisation. Skips '12m' (our trailing-12 ≠ the proxy's 2025+2026 YTD) and NLD.
function overlayBudgets(pdr) {
  function eur(s) { return Number(String(s).replace(/[^0-9.\-]/g, '')) || 0; }
  function money(n) { return '€' + Math.round(n).toLocaleString('en-US'); }
  Object.keys(pdr).forEach(function (pk) {
    if (pk === '12m') return;
    var bd = dateRanges[pk], pd = pdr[pk];
    if (!bd || !pd || !bd.mktRows || !pd.mktRows) return;
    var budByCode = {};
    pd.mktRows.forEach(function (r) { budByCode[r[0]] = r[2]; });
    var totBud = 0, totSpend = 0;
    bd.mktRows.forEach(function (r) {
      if (r[0] === 'Total EU' || r[0] === 'NLD') return;
      var nb = budByCode[r[0]]; if (nb == null) return;
      r[2] = nb;
      var b = eur(nb), sp = eur(r[3]);
      totBud += b; totSpend += sp;
      var diff = Math.round(b - sp);
      r[4] = diff >= 0 ? 'bg' : 'br';
      r[5] = (diff >= 0 ? '▼ ' : '▲ ') + money(Math.abs(diff)) + (diff >= 0 ? ' under' : ' over');
    });
    var tot = bd.mktRows[bd.mktRows.length - 1];
    if (tot && tot[0] === 'Total EU') {
      tot[2] = money(totBud);
      tot[5] = (totBud ? Math.round(totSpend / totBud * 100) : 0) + '% utilised';
    }
    // Feed the Ad Metrics card (Ad Budget + Utilisation) from the SAME live sheet budgets so it
    // matches the market-spend table. EU on dateRanges; per-market on marketKpis (key = flag = r[1]).
    bd.adBudget = money(totBud);
    bd.util = (totBud ? Math.round(totSpend / totBud * 100) : 0) + '%';
    if (bd.marketKpis) {
      bd.mktRows.forEach(function (r) {
        if (r[0] === 'Total EU' || r[0] === 'NLD') return;
        var mkk = bd.marketKpis[r[1]]; if (!mkk) return;
        var b = eur(r[2]), sp = eur(r[3]);
        mkk.adBudget = r[2];
        mkk.util = (b ? Math.round(sp / b * 100) : 0) + '%';
      });
    }
  });
}

// ---------- Phase 2: opt-in section rendering ----------
// Fires ONLY when data.js provides a `sections` object. Clients without it (e.g. AMACX)
// keep the static markup baked into index.html untouched — zero regression. Clients with
// `sections` (e.g. the UK demo) get every deep page rebuilt from their own data.
function el(id) { return document.getElementById(id); }
function cvar(c) {
  if (!c) return 'var(--text)';
  var m = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)', blue: 'var(--blue)',
            brand: 'var(--brand)', muted: 'var(--muted)', muted2: 'var(--muted2)' };
  return m[c] || c;   // pass through raw hex/var
}
function flagTag(code, alt) {
  if (!code) return '';
  return '<img src="https://flagcdn.com/16x12/' + code + '.png" width="16" height="12" style="vertical-align:middle;margin-right:6px;border-radius:2px;" alt="' + (alt || code).toUpperCase() + '">';
}

function renderKpis(id, arr) {
  var w = el(id); if (!w || !arr) return;
  w.innerHTML = arr.map(function (k) {
    return '<div class="kpi fade"><div class="kpi-bar" style="background:' + cvar(k.bar || 'brand') + '"></div>' +
      '<div class="kpi-lbl">' + k.lbl + '</div><div class="kpi-val">' + k.val + '</div>' +
      '<div class="kpi-d ' + (k.dCls || 'df') + '"' + (k.dColor ? ' style="color:' + cvar(k.dColor) + '"' : '') + '>' + (k.d || '') + '</div>' +
      '<div class="kpi-s">' + (k.s || '') + '</div></div>';
  }).join('');
}

function renderBars(id, arr) {
  var w = el(id); if (!w || !arr) return;
  w.innerHTML = arr.map(function (b) {
    return '<div class="bar-row"><div class="bar-lbl">' + b.lbl + '</div>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + b.pct + '%;background:' + cvar(b.color || 'brand') + '"></div></div>' +
      '<div class="bar-val">' + b.val + '</div></div>';
  }).join('');
}

// Buy-box / dispatch style progress rows (label + % + bar), with optional trailing note.
function renderProgress(id, arr, note) {
  var w = el(id); if (!w || !arr) return;
  var rows = arr.map(function (b) {
    var c = cvar(b.color || 'green');
    return '<div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">' +
      '<span>' + flagTag(b.flag, b.label) + b.label + '</span>' +
      '<span style="font-weight:600;color:' + c + '">' + (b.valText || (b.pct + '%')) + '</span></div>' +
      '<div class="prog-wrap"><div class="prog-fill" style="width:' + Math.min(b.pct, 100) + '%;background:' + c + '"></div></div></div>';
  }).join('');
  var n = note ? '<div style="margin-top:4px;padding-top:10px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);">' + note + '</div>' : '';
  w.innerHTML = rows + n;
}

// Buy Box: official featured-offer % (period + market) headline + delta + per-market bars. AMACX uses
// sections.overview.buyBoxByPeriod[period][market]; other clients fall back to the static buyBox bars.
function renderBuyBox(o) {
  var bbp = o.buyBoxByPeriod && o.buyBoxByPeriod[currentPeriod];
  if (bbp) {
    var scope = (currentMarket && currentMarket !== 'all') ? currentMarket : 'all';
    var cell = bbp[scope] || bbp.all;
    if (cell) {
      set('bb-pct', cell.pctTxt || 'n/a');
      var dl = el('bb-delta'); if (dl) { dl.textContent = cell.delta || ''; dl.className = cell.deltaCls || 'df'; }
    }
    var bars = ['de', 'fr', 'es', 'it'].map(function (m) {
      var c = bbp[m]; if (!c || c.pct == null) return null;
      return { flag: m, label: (MKT[m] && MKT[m].t) || m.toUpperCase(), pct: c.pct, valText: c.pctTxt,
               color: c.pct >= 90 ? 'green' : (c.pct >= 70 ? 'amber' : 'red') };
    }).filter(Boolean);
    renderProgress('sec-buybox', bars);
    var sc = el('bb-scope'); if (sc) sc.textContent = (scope === 'all') ? 'All EU' : ((MKT[scope] && MKT[scope].t) || scope);
  } else if (o.buyBox) {
    renderProgress('sec-buybox', o.buyBox);
  }
}

// Buy Box loss list — product / market / reason / your price vs buy-box winner / gap. The Market cell
// carries a flag so applyMarketFilter scopes it to the selected chip. Hides the card when empty.
function renderBuyBoxLosses(arr) {
  var card = el('sec-bb-losses-card'), w = el('sec-bb-losses');
  if (!w) return;
  if (!arr || !arr.length) { if (card) card.style.display = 'none'; return; }
  if (card) card.style.display = '';
  w.innerHTML = arr.map(function (x) {
    return '<tr><td><div class="pname">' + x.name + '</div><div class="pasin">' + x.asin + ' &middot; ' + x.ean + '</div></td>' +
      '<td>' + flagTag(x.market, x.market) + x.market.toUpperCase() + '</td>' +
      '<td><span class="badge ' + (x.rc || 'ba') + '">' + x.reason + '</span></td>' +
      '<td>' + x.your + '</td><td>' + x.winner + '</td>' +
      '<td style="font-weight:600;">' + (x.gap || '&mdash;') + '</td></tr>';
  }).join('');
  var sc = el('bbl-scope'); if (sc) sc.textContent = (currentMarket && currentMarket !== 'all') ? ((MKT[currentMarket] && MKT[currentMarket].t) || currentMarket) : 'All EU';
}

// Actual-vs-Target card (revenue + units) for the period. EU-only — the sheet has no per-market target,
// so the card hides when a specific market chip is selected (same rule as the revenue-target chart line).
function renderTargetAttainment(o) {
  var card = el('sec-targets-card');
  var ta = o.targetAttainment && o.targetAttainment[currentPeriod];
  if (!ta || (currentMarket && currentMarket !== 'all')) { if (card) card.style.display = 'none'; return; }
  if (card) card.style.display = '';
  [['rev', ta.rev], ['units', ta.units]].forEach(function (p) {
    var k = p[0], v = p[1]; if (!v) return;
    set('ta-' + k + '-actual', v.actual); set('ta-' + k + '-target', v.target);
    var pc = el('ta-' + k + '-pct'); if (pc) { pc.textContent = v.pctTxt; pc.className = v.cls; }
    var bar = el('ta-' + k + '-bar');
    if (bar) { bar.style.width = Math.min(v.pct, 100) + '%'; bar.style.background = v.pct >= 100 ? 'var(--green)' : 'var(--amber)'; }
  });
}

function renderTasks(spec) {
  if (!spec) return;
  if (spec.badge != null) set('sec-tasks-badge', spec.badge);
  var w = el('sec-tasks'); if (!w || !spec.items) return;
  w.innerHTML = spec.items.map(function (t, i) {
    var last = i === spec.items.length - 1;
    var dot = t.active === false ? 'var(--muted2)' : 'var(--accent)';
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;' + (last ? '' : 'border-bottom:1px solid var(--border);') + '">' +
      '<div style="width:7px;height:7px;border-radius:50%;background:' + dot + ';flex-shrink:0;margin-top:4px;"></div>' +
      '<div><div style="font-size:12px;font-weight:500;">' + t.text + '</div><div style="font-size:11px;color:var(--muted);margin-top:1px;">' + t.sub + '</div></div></div>';
  }).join('');
}

// Completed tasks list (green dot) — same shape as Upcoming Tasks, sourced from Project Scope column G.
// Data-driven: clients that don't supply a completedSpec (no Completed column) hide the card and the
// Overview grid reflows from 4 → 3 columns, so the AMACX placeholder rows never leak to other clients.
function renderCompleted(spec) {
  var w = el('sec-completed');
  var card = w && w.closest ? w.closest('.card') : null;
  var grid = el('tasks-flags');
  if (!spec) {
    if (card) card.style.display = 'none';
    if (grid) grid.classList.add('tf-3');   // 3-col on desktop; CSS still stacks to 1-col on mobile
    return;
  }
  if (card) card.style.display = '';
  if (grid) grid.classList.remove('tf-3');   // 4-col on desktop (CSS default)
  if (spec.badge != null) set('sec-completed-badge', spec.badge);
  if (!w || !spec.items) return;
  w.innerHTML = spec.items.map(function (t, i) {
    var last = i === spec.items.length - 1;
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;' + (last ? '' : 'border-bottom:1px solid var(--border);') + '">' +
      '<div style="width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:4px;"></div>' +
      '<div><div style="font-size:12px;font-weight:500;">' + t.text + '</div><div style="font-size:11px;color:var(--muted);margin-top:1px;">' + t.sub + '</div></div></div>';
  }).join('');
}

// Shared renderer for the coloured alert lists (Flags & Warnings, Stock Warnings).
function renderAlertList(id, badgeId, spec) {
  if (!spec) return;
  if (badgeId && spec.badge != null) set(badgeId, spec.badge);
  var w = el(id); if (!w || !spec.items) return;
  var lv = {
    red:    { bg: '#fdf0f0', dot: 'var(--red)',   col: 'var(--red)',   pulse: 'animation:pulse2 1.5s infinite;', wt: 600, sub: 'var(--muted)' },
    amber:  { bg: '#fdf6e7', dot: 'var(--amber)', col: 'var(--amber)', pulse: '', wt: 600, sub: 'var(--muted)' },
    green:  { bg: '#eaf4ef', dot: 'var(--green)', col: 'var(--green)', pulse: '', wt: 600, sub: 'var(--muted)' },
    muted:  { bg: '',        dot: 'var(--muted2)',col: 'var(--muted)', pulse: '', wt: 500, sub: 'var(--muted2)' }
  };
  lv.orange = lv.amber;   // sheet cell-colour urgency: red / orange / green
  w.innerHTML = spec.items.map(function (f, i) {
    var last = i === spec.items.length - 1;
    var s = lv[f.level] || lv.muted;
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;' + (last ? '' : 'border-bottom:1px solid var(--border);') + (s.bg ? 'background:' + s.bg + ';' : '') + '">' +
      '<div style="width:7px;height:7px;border-radius:50%;background:' + s.dot + ';flex-shrink:0;margin-top:4px;' + s.pulse + '"></div>' +
      '<div><div style="font-size:12px;font-weight:' + s.wt + ';color:' + s.col + ';">' + f.title + '</div>' +
      '<div style="font-size:11px;color:' + s.sub + ';margin-top:1px;">' + f.sub + '</div></div></div>';
  }).join('');
}
function renderFlags(spec) { renderAlertList('sec-flags', 'sec-flags-badge', spec); }

function renderCvr(spec) {
  if (!spec) return;
  set('cvr-val', spec.val); set('cvr-note', spec.note); set('cvr-sub', spec.sub);
}

function renderEarlyLaunch(spec) {
  var w = el('sec-earlylaunch'); if (!w) return;
  if (!spec) { w.style.display = 'none'; return; }   // UK demo: no early-launch market → hide
  w.style.display = '';
  w.innerHTML = '<div class="sec-lbl">' + (spec.label || 'Early Launch') + '</div>' +
    '<div class="nld-card"><div class="nld-icon">' + (spec.flag ? flagTag(spec.flag, spec.title) : '✨') + '</div>' +
    '<div><div class="nld-ttl">' + spec.title + '</div><div class="nld-body">' + spec.body + '</div></div></div>';
}

function renderPnlSummary(arr) {
  var w = el('sec-pnl-summary'); if (!w || !arr) return;
  w.innerHTML = arr.map(function (c) {
    return '<div class="pl-cell"><div class="pl-val" style="color:' + cvar(c.color) + '">' + c.val + '</div><div class="pl-lbl">' + c.lbl + '</div></div>';
  }).join('');
}

function renderMargin(spec) {
  var w = el('sec-pnl-margin'); if (!w || !spec) return;
  var rows = (spec.rows || []).map(function (r, i) {
    var last = i === spec.rows.length - 1;
    var box = last ? 'padding:6px 0 0;' : 'padding:4px 0;border-bottom:1px solid var(--border);';
    var lbl = r.strong ? 'font-weight:600;' : 'color:var(--muted)';
    var val = (r.strong ? 'font-weight:700;' : 'font-weight:600;') + (r.color ? 'color:' + cvar(r.color) + ';' : '');
    return '<div style="display:flex;justify-content:space-between;font-size:12px;' + box + '"><span style="' + lbl + '">' + r.lbl + '</span><span style="' + val + '">' + r.val + '</span></div>';
  }).join('');
  w.innerHTML = '<div style="font-family:var(--display);font-size:32px;font-weight:700;letter-spacing:-.4px;color:' + cvar(spec.pctColor || 'green') + '">' + spec.pct + '</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-top:4px;">' + (spec.note || '') + '</div>' +
    '<div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);">' + rows + '</div>';
}

function renderRowsTable(id, rows) {
  var w = el(id); if (!w || !rows) return;
  w.innerHTML = rows.join('');
}

function renderPnlMkt(arr) {
  if (!arr) return;
  renderRowsTable('sec-pnl-mkt', arr.map(function (r) {
    return '<tr><td>' + flagTag(r.flag, r.name) + r.name + '</td><td>' + r.revenue + '</td><td>' + r.adspend +
      '</td><td style="color:' + cvar(r.netColor || 'green') + ';font-weight:600">' + r.net +
      '</td><td><span class="badge ' + (r.marginCls || 'bg') + '">' + r.margin + '</span></td></tr>';
  }));
}

function renderAdBudgets(spec) {
  if (!spec || !spec.rows) return;
  if (spec.headers) { for (var h = 0; h < spec.headers.length; h++) { var th = el('ad-bud-h' + h); if (th) th.textContent = spec.headers[h]; } }
  if (spec.subLabel) { var sb = el('ad-bud-sub'); if (sb) sb.textContent = spec.subLabel; }
  renderRowsTable('sec-ad-budgets', spec.rows.map(function (r) {
    var rs = r.total ? ' style="background:var(--surface2);"' : '';
    var name = '<td' + (r.total ? ' style="font-weight:700;"' : '') + '>' + (r.total ? '' : flagTag(r.flag, r.name)) + r.name + '</td>';
    var cells = r.cells.map(function (c, ci) {
      var bold = r.total ? 'font-weight:700;' : (ci === 0 ? 'font-weight:600;' : '');
      return '<td' + (bold ? ' style="' + bold + '"' : '') + '>' + c + '</td>';
    }).join('');
    return '<tr' + rs + '>' + name + cells + '</tr>';
  }));
}

function renderForecast(arr) {
  var w = el('sec-ad-forecast'); if (!w || !arr) return;
  var head = '<div style="display:grid;grid-template-columns:60px 1fr 70px 60px;gap:8px;padding:6px 0 8px;border-bottom:2px solid var(--border);font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.6px;"><span>Month</span><span>Budget</span><span style="text-align:right;">TACOS</span><span style="text-align:right;">ROAS</span></div>';
  var rows = arr.map(function (r, i) {
    var last = i === arr.length - 1;
    var peak = r.peak ? ' <span style="font-size:10px;color:var(--green);font-weight:600;">▲ peak</span>' : '';
    return '<div style="display:grid;grid-template-columns:60px 1fr 70px 60px;gap:8px;padding:10px 0;' + (last ? '' : 'border-bottom:1px solid var(--border);') + 'align-items:center;">' +
      '<span style="font-size:12px;font-weight:600;">' + r.month + '</span>' +
      '<div><div style="background:var(--surface2);border-radius:3px;height:6px;overflow:hidden;"><div style="width:' + r.pct + '%;height:100%;background:var(--brand);border-radius:3px;opacity:' + (r.opacity || 0.7) + ';"></div></div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:3px;">' + r.budget + peak + '</div></div>' +
      '<span style="font-size:12px;font-weight:600;color:' + cvar(r.tacosColor || 'amber') + ';text-align:right;">' + r.tacos + '</span>' +
      '<span style="font-size:12px;font-weight:600;text-align:right;">' + r.roas + '</span></div>';
  }).join('');
  w.innerHTML = head + rows;
}

function renderMetrics(arr) {
  var w = el('sec-ad-metrics'); if (!w || !arr) return;
  w.innerHTML = arr.map(function (m, i) {
    var last = i === arr.length - 1;
    return '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;' + (last ? '' : 'border-bottom:1px solid var(--border);') + '">' +
      '<span style="font-size:11px;color:var(--muted);font-weight:500;">' + m.lbl + '</span>' +
      '<span' + (m.id ? ' id="' + m.id + '"' : '') + ' style="font-family:var(--display);font-size:17px;font-weight:700;' + (m.color ? 'color:' + cvar(m.color) + ';' : '') + '">' + m.val + '</span></div>';
  }).join('');
}

function renderCampaigns(arr) {
  if (!arr) return;
  renderRowsTable('sec-campaigns', arr.map(function (c) {
    return '<tr><td><div class="pname">' + c.name + '</div><div class="pasin">' + c.type + '</div></td>' +
      '<td>' + c.spend + '</td><td>' + c.sales + '</td><td><span class="badge ' + (c.acosCls || 'bg') + '">' + c.acos + '</span></td>' +
      '<td>' + c.roas + '</td><td>' + c.cpc + '</td><td><span class="badge ' + (c.statusCls || 'bg') + '">' + c.status + '</span></td></tr>';
  }));
}

function renderStock(arr) {
  var w = el('sec-inv-stock'); if (!w || !arr) return;
  w.innerHTML = arr.map(function (s) {
    return '<div class="inv-row"><div class="sdot ' + s.dot + '"></div>' +
      '<div class="inv-info"><div class="inv-name">' + s.name + '</div><div class="inv-note">' + s.note + '</div></div>' +
      '<div class="inv-r"><div class="inv-u"' + (s.unitsColor ? ' style="color:' + cvar(s.unitsColor) + '"' : '') + '>' + s.units + '</div>' +
      '<div class="inv-d"' + (s.daysColor ? ' style="color:' + cvar(s.daysColor) + '"' : '') + '>' + s.days + '</div></div></div>';
  }).join('');
}

function renderRestock(arr) {
  var w = el('sec-inv-restock'); if (!w || !arr) return;
  var lv = { red: { bg: '#fdf0f0', bd: '#f5b8b9', col: 'var(--red)' }, amber: { bg: '#fdf6e7', bd: '#f0d070', col: 'var(--amber)' } };
  w.innerHTML = arr.map(function (r) {
    var s = lv[r.level] || lv.amber;
    return '<div style="background:' + s.bg + ';border:1px solid ' + s.bd + ';border-radius:8px;padding:10px 12px;">' +
      '<div style="font-size:12px;font-weight:600;color:' + s.col + '">' + r.title + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:2px;">' + r.sub + '</div></div>';
  }).join('');
}

// Supplier Purchase Orders (manufacturer reorder forecast). Hidden unless a client supplies the data.
// item: { product, lastsUntil, checkAgain, orderBy, level:'red'|'amber'|'green'|'', note }
function renderSupplierPOs(arr) {
  var card = el('sec-inv-po-card');
  if (!arr || !arr.length) { if (card) card.style.display = 'none'; return; }
  var cls = { red: 'br', amber: 'ba', green: 'bg' };
  renderRowsTable('sec-inv-po', arr.map(function (p) {
    var ob = p.level ? '<span class="badge ' + (cls[p.level] || 'bb') + '">' + (p.orderBy || '—') + '</span>' : (p.orderBy || '—');
    return '<tr><td style="font-weight:600">' + p.product + '</td><td>' + (p.lastsUntil || '—') + '</td><td>' +
      (p.checkAgain || '—') + '</td><td>' + ob + '</td><td style="color:var(--muted)">' + (p.note || '') + '</td></tr>';
  }));
  if (card) card.style.display = '';
}

function renderProdTable(arr) {
  if (!arr) return;
  renderRowsTable('sec-prod-table', arr.map(function (r) {
    return '<tr><td>' + flagTag(r.flag, r.name) + r.name + '</td><td>' + r.revenue + '</td><td>' + r.units +
      '</td><td>' + r.orders + '</td><td><span class="badge ' + (r.cvrCls || 'bg') + '">' + r.cvr + '</span></td><td>' + r.aov + '</td></tr>';
  }));
}

function renderProdGroups(arr) {
  var card = el('sec-prod-groups-card');
  if (!arr || !arr.length) { if (card) card.style.display = 'none'; return; }
  renderRowsTable('sec-prod-groups', arr.map(function (g) {
    return '<tr><td>' + g.name + '</td><td>' + g.sales +
      '</td><td>' + (g.adSpend != null ? g.adSpend : '—') +
      '</td><td>' + (g.tacos != null ? '<span class="badge ' + (g.tacosCls || 'bb') + '">' + g.tacos + '</span>' : '—') +
      '</td><td>' + g.units + '</td><td>' + g.pct +
      '</td><td><span class="badge ' + (g.oosCls || 'bg') + '">' + g.oosRate + '</span></td></tr>';
  }));
  if (card) card.style.display = '';
}

function renderKwTable(arr) {
  if (!arr) return;
  renderRowsTable('sec-kw-table', arr.map(function (k) {
    return '<tr><td><div class="kw-chip pname">' + k.kw + '</div><div class="pasin">' + k.geo + '</div></td>' +
      '<td><span class="badge ' + (k.matchCls || 'bg') + '">' + k.match + '</span></td><td>' + k.spend + '</td><td>' + k.sales +
      '</td><td><span class="badge ' + (k.acosCls || 'bg') + '">' + k.acos + '</span></td><td>' + k.roas + '</td><td>' + k.cpc + '</td></tr>';
  }));
}

// Generic auto-scaling multi-line chart. Replaces hand-computed SVG coordinates.
// spec = { max, yTicks:[top→bottom], xLabels:[...], xHighlight?, series:[{values,color,dash,area,main,axis}], legend:[{name,color}] }
// Optional secondary (right) axis: set spec.maxRight + spec.yTicksRight and mark a series with axis:'right'.
function renderChart(id, legId, spec) {
  var svg = el(id); if (!svg || !spec) return;
  var hasRight = spec.maxRight != null;
  var endLabels = spec.endLabels !== false;       // direct line-end labels (design B); replaces the separate key
  var W = 440, H = 160, PADL = 56, PADT = 18, PADB = 22;
  var ELF = 9.5, ELCW = 0.6, ELOFF = 7, ELRM = 8;  // end-label: font, ~char-width factor, x-offset, right margin
  var elList = [];                                  // {si, text} per labelled series, built before sizing PADR
  if (endLabels) {
    spec.series.forEach(function (s, si) {
      if (s.endLabel === false) return;
      var nm = s.name || (spec.legend && spec.legend[si] && spec.legend[si].name);
      if (!nm) return;
      elList.push({ si: si, text: nm + (s.endVal != null ? ' ' + s.endVal : '') });
    });
  }
  // Size the right margin to the longest end-label so it can't spill past the card (capped); else default.
  var PADR;
  if (endLabels && elList.length) {
    var maxW = 0; elList.forEach(function (L) { maxW = Math.max(maxW, L.text.length * ELF * ELCW); });
    PADR = Math.max(60, Math.min(190, Math.ceil(ELOFF + maxW + ELRM)));
  } else { PADR = hasRight ? 42 : 14; }
  var plotW = W - PADL - PADR, plotH = H - PADT - PADB, baseY = PADT + plotH;
  var n = spec.xLabels.length;
  function X(i) { return PADL + (n <= 1 ? 0 : plotW * i / (n - 1)); }
  function Y(v) { return PADT + plotH * (1 - v / spec.max); }
  function Yr(v) { return PADT + plotH * (1 - v / spec.maxRight); }
  var p = [], T = spec.yTicks.length, k, gy;
  for (k = 0; k < T; k++) {
    gy = PADT + plotH * k / (T - 1);
    p.push('<line x1="' + PADL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - PADR) + '" y2="' + gy.toFixed(1) + '" stroke="#e4e2dc" stroke-width="1"/>');
    p.push('<text x="' + (PADL - 13) + '" y="' + (gy + 3).toFixed(1) + '" font-size="9" fill="#9ca3af" font-family="Poppins" text-anchor="end">' + spec.yTicks[k] + '</text>');
    if (hasRight && !endLabels && spec.yTicksRight && spec.yTicksRight[k] != null) {
      p.push('<text x="' + (W - PADR + 6) + '" y="' + (gy + 3).toFixed(1) + '" font-size="9" fill="#9ca3af" font-family="Poppins" text-anchor="start">' + spec.yTicksRight[k] + '</text>');
    }
  }
  spec.series.forEach(function (s) {
    var yf = (s.axis === 'right') ? Yr : Y;
    var pts = s.values.map(function (v, i) { return X(i).toFixed(1) + ',' + yf(v).toFixed(1); });
    if (s.area) {
      p.push('<polygon points="' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + baseY + ' ' + X(0).toFixed(1) + ',' + baseY + '" fill="' + s.color + '" opacity="0.08"/>');
    }
    p.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s.color + '" stroke-width="' + (s.main ? 1.8 : 1.4) + '" stroke-linecap="round" stroke-linejoin="round"' + (s.dash ? ' stroke-dasharray="' + (typeof s.dash === 'string' ? s.dash : '5 3') + '"' : '') + '/>');
    if (s.dots !== false) s.values.forEach(function (v, i) {
      p.push('<circle cx="' + X(i).toFixed(1) + '" cy="' + yf(v).toFixed(1) + '" r="' + (s.main ? 2.5 : 1.8) + '" fill="' + s.color + '" stroke="#fff" stroke-width="1.3"/>');
    });
  });
  spec.xLabels.forEach(function (lb, i) {
    var lastM = i === n - 1;
    p.push('<text x="' + X(i).toFixed(1) + '" y="' + (H - 6) + '" font-size="9" fill="' + (lastM ? (spec.xHighlight || '#1e293b') : '#9ca3af') + '" font-family="Poppins" text-anchor="middle"' + (lastM ? ' font-weight="600"' : '') + '>' + lb + '</text>');
  });
  // Direct end-of-line labels (design B): each series names itself (+ latest value) at its line end,
  // colour-matched — replaces the separate legend key. De-collided vertically, clamped to the plot.
  if (endLabels && elList.length) {
    var maxChars = Math.max(4, Math.floor((PADR - ELOFF - ELRM) / (ELF * ELCW)));   // chars that fit the sized margin
    var lab = elList.map(function (L) {
      var s = spec.series[L.si], yf = (s.axis === 'right') ? Yr : Y;
      var txt = L.text.length > maxChars ? L.text.slice(0, maxChars - 1) + '…' : L.text;
      return { y: yf(s.values[s.values.length - 1]), color: s.color, text: txt };
    });
    lab.sort(function (a, b) { return a.y - b.y; });
    var MG = 12, prev = -1e9;
    lab.forEach(function (L) { if (L.y < prev + MG) { L.y = prev + MG; } prev = L.y; });
    var over = prev - baseY; if (over > 0) lab.forEach(function (L) { L.y -= over; });
    var lx = X(n - 1) + ELOFF;
    lab.forEach(function (L) {
      var yy = Math.max(PADT + 4, L.y);
      p.push('<text x="' + lx.toFixed(1) + '" y="' + (yy + 3).toFixed(1) + '" font-size="' + ELF + '" font-weight="500" fill="' + L.color + '" font-family="Poppins">' + L.text + '</text>');
    });
  }
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.innerHTML = p.join('');
  if (legId) {
    var lg = el(legId);
    if (lg) {
      if (endLabels) { lg.innerHTML = ''; lg.style.display = 'none'; }
      else if (spec.legend) { lg.style.display = ''; lg.innerHTML = spec.legend.map(function (L) { return '<div class="leg-i"><div class="leg-dot" style="background:' + L.color + '"></div>' + L.name + '</div>'; }).join(''); }
    }
  }
}

// --- trend-chart axis helpers ---
function niceMax(v) {
  if (!(v > 0)) return 1;
  var mag = Math.pow(10, Math.floor(Math.log10(v))), f = v / mag, steps = [1, 1.5, 2, 3, 4, 5, 6, 8, 10];
  for (var i = 0; i < steps.length; i++) { if (f <= steps[i]) return steps[i] * mag; }
  return 10 * mag;
}
function axisTicks(max, fmt) { var T = 5, a = []; for (var k = 0; k < T; k++) a.push(fmt(max * (1 - k / (T - 1)))); return a; }
function moneyK(v) { v = Math.round(v); if (v >= 1000) { var t = v / 1000; return '€' + (t === Math.floor(t) ? t : t.toFixed(1)) + 'k'; } return '€' + v; }
function arrMax(a) { return Math.max.apply(null, (a && a.length ? a : [1])); }

// Render the two trend cards (Revenue Trend, Spend vs TACOS) for the current market, or EU for
// 'All EU'. Data: DATA.sections.charts (trailing-6-month series, EU + per market, from the generator).
function renderMarketCharts() {
  var C = DATA.sections && DATA.sections.charts;
  if (!C || !C.rev) return;                                  // only AMACX ships sections.charts
  var m = (currentMarket && currentMarket !== 'all' && C.rev[currentMarket]) ? currentMarket : 'all';
  var months = C.months;

  var rev = C.rev[m] || [];
  // Revenue target = dotted reference line, EU only (no per-market target) → shown only for 'All EU'.
  var tgt = (m === 'all' && C.revTarget && C.revTarget.length) ? C.revTarget : null;
  var rMax = niceMax(Math.max(arrMax(rev), tgt ? arrMax(tgt) : 0));
  var revSeries = [{ values: rev, color: '#404935', area: true, main: true, name: 'Revenue', endVal: moneyK(rev[rev.length - 1] || 0) }];
  var revLegend = [{ name: 'Revenue', color: '#404935' }];
  if (tgt) {
    revSeries.push({ values: tgt, color: '#b08900', dash: '2 3', dots: false, name: 'Target', endVal: moneyK(tgt[tgt.length - 1] || 0) });
    revLegend.push({ name: 'Target', color: '#b08900' });
  }
  renderChart('chart-rev', 'chart-rev-leg', {
    max: rMax, yTicks: axisTicks(rMax, moneyK), xLabels: months, xHighlight: '#404935',
    series: revSeries, legend: revLegend
  });

  var sp = C.adSpend[m] || [], sl = (C.adSales && C.adSales[m]) || [], ta = C.adTacos[m] || [];
  var mnMax = niceMax(Math.max(arrMax(sp), arrMax(sl)));   // left € axis spans both Ad Spend + Ad Sales
  var taMax = Math.max(40, Math.ceil(arrMax(ta) / 20) * 20);
  var TACOS_TARGET = 20;                                   // ad-efficiency goal: keep TACOS under 20%
  // Draw order (last on top): Ad Spend area, Ad Sales line, TACOS line, dotted TACOS target.
  var adSeries = [{ values: sp, color: '#404935', area: true, main: true, name: 'Ad Spend', endVal: moneyK(sp[sp.length - 1] || 0) }];
  var adLegend = [{ name: 'Ad Spend', color: '#404935' }];
  if (sl.length) {
    adSeries.push({ values: sl, color: '#1e4fa0', main: true, name: 'Ad Sales', endVal: moneyK(sl[sl.length - 1] || 0) });
    adLegend.push({ name: 'Ad Sales', color: '#1e4fa0' });
  }
  adSeries.push({ values: ta, color: '#b5373a', axis: 'right', name: 'TACOS', endVal: Math.round(ta[ta.length - 1] || 0) + '%' });   // red — matches the TACOS KPI card
  adLegend.push({ name: 'TACOS', color: '#b5373a' });
  adSeries.push({ values: months.map(function () { return TACOS_TARGET; }), color: '#b08900', dash: '2 3', dots: false, axis: 'right', name: 'Target', endVal: '<20%' });
  adLegend.push({ name: 'Target <20%', color: '#b08900' });
  renderChart('chart-adtrend', 'chart-adtrend-leg', {
    max: mnMax, yTicks: axisTicks(mnMax, moneyK), xHighlight: '#404935',
    maxRight: taMax, yTicksRight: axisTicks(taMax, function (v) { return Math.round(v) + '%'; }),
    xLabels: months,
    series: adSeries,
    legend: adLegend
  });
}

// Vertical stacked bar chart. series[0] sits at the bottom of each bar.
function renderStackedBars(id, legId, spec) {
  var svg = el(id); if (!svg || !spec) return;
  var W = 440, H = 170, PADL = 46, PADR = 14, PADT = 16, PADB = 26;
  var plotW = W - PADL - PADR, plotH = H - PADT - PADB, baseY = PADT + plotH;
  var n = spec.xLabels.length;
  var bw = Math.min(40, plotW / n * 0.55);
  function cx(i) { return PADL + plotW * (i + 0.5) / n; }
  function hh(v) { return plotH * v / spec.max; }
  var p = [], T = spec.yTicks.length, k, gy;
  for (k = 0; k < T; k++) {
    gy = PADT + plotH * k / (T - 1);
    p.push('<line x1="' + PADL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - PADR) + '" y2="' + gy.toFixed(1) + '" stroke="#e4e2dc" stroke-width="1"/>');
    p.push('<text x="' + (PADL - 6) + '" y="' + (gy + 3).toFixed(1) + '" font-size="9" fill="#9ca3af" font-family="Poppins" text-anchor="end">' + spec.yTicks[k] + '</text>');
  }
  for (var i = 0; i < n; i++) {
    var x = cx(i) - bw / 2, yb = baseY;
    spec.series.forEach(function (s) {
      var seg = hh(s.values[i]);
      yb -= seg;
      p.push('<rect x="' + x.toFixed(1) + '" y="' + yb.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(seg, 0).toFixed(1) + '" fill="' + s.color + '"/>');
    });
    p.push('<text x="' + cx(i).toFixed(1) + '" y="' + (H - 8) + '" font-size="9" fill="#9ca3af" font-family="Poppins" text-anchor="middle">' + spec.xLabels[i] + '</text>');
  }
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.innerHTML = p.join('');
  if (legId && spec.legend) {
    var lg = el(legId);
    if (lg) lg.innerHTML = spec.legend.map(function (L) { return '<div class="leg-i"><div class="leg-dot" style="background:' + L.color + '"></div>' + L.name + '</div>'; }).join('');
  }
}

// Revenue Breakdown card: swap the static two-bar markup for a stacked monthly bar chart.
function renderRevBreak(spec) {
  var w = el('sec-pnl-revbreak'); if (!w || !spec) return;
  w.innerHTML = '<svg id="chart-revbreak" class="lc" viewBox="0 0 440 170" style="width:100%;"></svg>' +
                '<div class="leg" id="chart-revbreak-leg" style="margin-top:6px;"></div>';
  renderStackedBars('chart-revbreak', 'chart-revbreak-leg', spec);
}

// Pie chart by category, with a rich legend (sales share + ACOS).
function renderPie(id, legId, spec) {
  var svg = el(id); if (!svg || !spec || !spec.slices) return;
  var cx = 90, cy = 90, r = 78;
  var total = spec.slices.reduce(function (a, s) { return a + s.pct; }, 0) || 100;
  var ang = -Math.PI / 2, p = [];
  spec.slices.forEach(function (s) {
    var frac = s.pct / total, a2 = ang + frac * 2 * Math.PI;
    if (frac >= 0.999) { p.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + s.color + '"/>'); }
    else if (frac > 0) {
      var x1 = cx + r * Math.cos(ang), y1 = cy + r * Math.sin(ang);
      var x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
      var large = frac > 0.5 ? 1 : 0;
      p.push('<path d="M' + cx + ',' + cy + ' L' + x1.toFixed(2) + ',' + y1.toFixed(2) + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + x2.toFixed(2) + ',' + y2.toFixed(2) + ' Z" fill="' + s.color + '"/>');
    }
    ang = a2;
  });
  svg.innerHTML = p.join('');
  var lg = legId ? el(legId) : null;
  if (lg) lg.innerHTML = spec.slices.map(function (s) {
    return '<div style="display:flex;gap:10px;align-items:flex-start;">' +
      '<div style="width:11px;height:11px;border-radius:3px;background:' + s.color + ';flex-shrink:0;margin-top:2px;"></div>' +
      '<div><div style="font-size:12px;font-weight:600;">' + s.name + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:1px;">Sales: ' + s.sales + ' (' + s.pct + '%) &middot; ACOS: ' + s.acos + '</div></div></div>';
  }).join('');
}

// Full P&L statement (INCOME / EXPENSES / METRICS) with all three value columns
// (Amount / % / Per unit), laid out as two side-by-side period blocks: current period on
// the left, one period up (longer window) on the right. cmp may be null (longest period).
function statementTable(spec, label) {
  var body = spec.groups.map(function (g) {
    var hdr = '<tr><td colspan="4" style="background:var(--surface2);font-size:10px;letter-spacing:.7px;text-transform:uppercase;color:var(--muted);font-weight:700;padding:8px 14px;">' + g.header + '</td></tr>';
    var rows = g.rows.map(function (r) {
      var wt = r.total ? 'font-weight:700;' : '';
      var amtCol = r.profit ? 'color:var(--green);' : (r.accent ? 'color:' + cvar(r.accent) + ';' : '');
      return '<tr><td style="' + wt + '">' + r.lbl + '</td>' +
        '<td style="' + wt + amtCol + '">' + (r.amount != null && r.amount !== '' ? r.amount : '&mdash;') + '</td>' +
        '<td style="color:var(--muted);">' + (r.pct != null && r.pct !== '' ? r.pct : '&mdash;') + '</td>' +
        '<td style="color:var(--muted);">' + (r.unit != null && r.unit !== '' ? r.unit : '&mdash;') + '</td></tr>';
    }).join('');
    return hdr + rows;
  }).join('');
  var head = '<thead><tr><th style="font-size:14px;text-transform:none;color:var(--text);font-weight:700;font-family:var(--display);">' + (label || '') + '</th><th>Amount</th><th>%</th><th>Unit</th></tr></thead>';
  return '<div class="tscroll" style="flex:1 1 320px;min-width:300px;"><table class="dtable">' + head + '<tbody>' + body + '</tbody></table></div>';
}

function renderStatement(cur, cmp, curLabel, cmpLabel) {
  var w = el('sec-pnl-statement'); if (!w || !cur || !cur.groups) return;
  var html = statementTable(cur, curLabel);
  if (cmp && cmp.groups) html += statementTable(cmp, cmpLabel);
  w.innerHTML = html;
}

// Product portfolio profitability: a conic-gradient pie + stats (total, profitable/breakeven/
// unprofitable, most/least profitable product). spec counts are product counts.
function renderPortfolio(spec) {
  if (!spec) return;
  var total = spec.total != null ? spec.total : ((spec.profitable || 0) + (spec.breakeven || 0) + (spec.unprofitable || 0));
  function pct(n) { return total ? Math.round(n / total * 100) : 0; }
  var pp = pct(spec.profitable), bp = pct(spec.breakeven), up = Math.max(0, 100 - pp - bp);
  var pie = el('chart-portfolio-pie');
  if (pie) pie.style.background = 'conic-gradient(var(--green) 0 ' + pp + '%, var(--amber) ' + pp + '% ' + (pp + bp) + '%, var(--red) ' + (pp + bp) + '% 100%)';
  var w = el('sec-portfolio');
  if (w) {
    function leg(color, label, n, p) {
      return '<div style="display:flex;align-items:center;gap:8px;font-size:12px;"><span style="width:11px;height:11px;border-radius:3px;background:' + color + ';flex-shrink:0;"></span>' + label + '<span style="margin-left:auto;font-weight:600;">' + n + ' (' + p + '%)</span></div>';
    }
    w.innerHTML =
      '<div style="font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--muted);font-weight:600;">Total Products</div>' +
      '<div style="font-family:var(--display);font-size:28px;font-weight:700;letter-spacing:-.5px;margin:2px 0 10px;">' + total + '</div>' +
      '<div style="display:flex;flex-direction:column;gap:6px;">' +
        leg('var(--green)', 'Profitable', spec.profitable, pp) +
        leg('var(--amber)', 'Breakeven', spec.breakeven, bp) +
        leg('var(--red)', 'Unprofitable', spec.unprofitable, up) +
      '</div>';
  }
  // Most / least profitable: each its own card listing 3 products (profit + margin badge).
  renderProfitList('sec-most-profitable', spec.most, true);
  renderProfitList('sec-least-profitable', spec.least, false);
}

function renderProfitList(id, items, positive) {
  var w = el(id); if (!w || !items) return;
  w.innerHTML = items.map(function (p, i) {
    var last = i === items.length - 1;
    var col = p.color || (positive ? 'var(--green)' : 'var(--red)');
    var badge = p.marginCls || (positive ? 'bg' : 'br');
    return '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;padding:9px 0;' + (last ? '' : 'border-bottom:1px solid var(--border);') + '">' +
      '<div style="font-size:12px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.name + '</div>' +
      '<div style="text-align:right;flex-shrink:0;white-space:nowrap;"><span style="font-family:var(--display);font-weight:700;color:' + col + ';">' + p.profit + '</span> <span class="badge ' + badge + '">' + p.margin + '</span></div></div>';
  }).join('');
}

function renderMarketSelects() {
  var sels = document.querySelectorAll('.js-mkt-select');
  if (!sels.length) return;
  var opts = '<option>All Markets</option>' + CONFIG.markets.filter(function (m) { return m.key !== 'all'; })
    .map(function (m) { return '<option>' + m.chip + '</option>'; }).join('');
  for (var i = 0; i < sels.length; i++) sels[i].innerHTML = opts;
}

// ---------- Founder Dashboard renderers (opt-in: DATA.sections.founder) ----------
// Fire ONLY when a client supplies sections.founder. Amazon clients are untouched. Each renderer
// fills the container IDs in the founder page blocks; missing data simply leaves a section empty.

// Coloured dot list shared by the founder overview cards (tasks / stock warnings / milestones).
// item: { dot:'amber'|'red'|'green'|'muted', title, sub, tint?:bool, titleColor? }
function fDotList(id, badgeId, spec) {
  if (!spec) return;
  if (badgeId && spec.badge != null) set(badgeId, spec.badge);
  var w = el(id); if (!w || !spec.items) return;
  var dotc = { amber: 'var(--accent)', accent: 'var(--accent)', red: 'var(--red)', green: 'var(--green)', muted: 'var(--muted2)' };
  var tintc = { red: '#fdf0f0', amber: '#fdf6e7', green: '#eaf4ef' };
  w.innerHTML = spec.items.map(function (it, i) {
    var last = i === spec.items.length - 1;
    var dc = dotc[it.dot] || 'var(--muted2)';
    var bg = it.tint ? (tintc[it.dot] || '') : '';
    var pulse = (it.dot === 'red' && it.tint) ? 'animation:pulse2 1.5s infinite;' : '';
    var col = it.titleColor ? cvar(it.titleColor)
      : (bg ? (it.dot === 'red' ? 'var(--red)' : it.dot === 'amber' ? 'var(--amber)' : 'var(--text)') : 'var(--text)');
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 16px;' + (last ? '' : 'border-bottom:1px solid var(--border);') + (bg ? 'background:' + bg + ';' : '') + '">' +
      '<div style="width:7px;height:7px;border-radius:50%;background:' + dc + ';flex-shrink:0;margin-top:4px;' + pulse + '"></div>' +
      '<div><div style="font-size:12px;font-weight:' + (bg ? 600 : 500) + ';color:' + col + ';">' + it.title + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:1px;">' + (it.sub || '') + '</div></div></div>';
  }).join('');
}

function fInfoBar(id, text, kind) {
  var w = el(id); if (!w) return;
  if (!text) { w.style.display = 'none'; return; }
  w.style.display = '';
  var icon = kind === 'alert' ? '&#9888;' : '&#9432;';   // ⚠ / ℹ
  w.innerHTML = '<span style="font-size:14px;flex-shrink:0;">' + icon + '</span><span>' + text + '</span>';
}

function renderFounderOverview(o) {
  if (!o) return;
  // Overview page: alert + Notion cards (tasks/stockWarn/milestones).
  fInfoBar('f-ov-alert', o.alert, 'alert');
  fDotList('f-ov-tasks', 'f-ov-tasks-badge', o.tasks);
  fDotList('f-ov-stockwarn', 'f-ov-stockwarn-badge', o.stockWarn);
  fDotList('f-ov-milestones', 'f-ov-milestones-badge', o.milestones);
  // Forecast cards below now live on the P&L DETAIL page (markup moved; ids unchanged). o.revChart
  // is no longer rendered — the Revenue Trend chart was consolidated into the P&L Breakdown chart.
  renderKpis('f-ov-kpis', o.kpis);
  if (o.loanCard) {
    var lc = o.loanCard, w = el('f-ov-loan');
    if (lc.sub != null) set('f-ov-loan-sub', lc.sub);
    if (w) w.innerHTML =
      '<div style="font-family:var(--display);font-size:20px;font-weight:700;color:var(--text);">' + lc.big + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-bottom:10px;">' + (lc.bigSub || '') + '</div>' +
      '<div class="prog-wrap" style="height:8px;"><div class="prog-fill" style="width:' + (lc.fillPct || 0) + '%;background:var(--brand);"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted2);margin-top:6px;">' + (lc.meta || []).map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>';
  }
  if (o.waterfall) renderBars('f-ov-waterfall', o.waterfall);
}

// Generic founder data table (P&L detail + stock phases): cols + rows of pre-formatted cell HTML.
// row: { cells:[...] , total?:bool } or { section:'Header' } spanning all columns.
function founderTable(cols, rows, extraStyle) {
  var head = '<thead><tr>' + cols.map(function (c, i) { return '<th' + (i === 0 ? '' : ' style="text-align:right"') + '>' + c + '</th>'; }).join('') + '</tr></thead>';
  var body = rows.map(function (r) {
    if (r.section) return '<tr><td colspan="' + cols.length + '" style="background:var(--surface2);font-size:10px;letter-spacing:.7px;text-transform:uppercase;color:var(--muted);font-weight:700;padding:8px 14px;">' + r.section + '</td></tr>';
    var ts = r.total ? ' style="background:var(--surface2);font-weight:700;"' : '';
    // r.cls (e.g. 'red'/'green'/'amber') colours the value cells (all but the first label cell).
    return '<tr' + ts + '>' + r.cells.map(function (c, i) {
      var st = (i > 0 && r.cls) ? ' style="color:' + cvar(r.cls) + '"' : '';
      return '<td' + st + '>' + c + '</td>';
    }).join('') + '</tr>';
  }).join('');
  return '<div class="tscroll"><table class="dtable"' + (extraStyle ? ' style="' + extraStyle + '"' : '') + '>' + head + '<tbody>' + body + '</tbody></table></div>';
}

function renderFounderPnl(p) {
  if (!p) return;
  renderKpis('f-pnl-kpis', p.kpis);
  if (p.chart) renderChart('f-chart-fpnl', 'f-chart-fpnl-leg', p.chart);
  if (p.table) { var w = el('f-pnl-table'); if (w) w.innerHTML = founderTable(p.table.cols, p.table.rows, 'white-space:nowrap;'); }
}

function renderFounderStock(s) {
  if (!s) return;
  fInfoBar('f-stock-info', s.info, 'info');
  renderKpis('f-stock-kpis', s.kpis);
  var w = el('f-stock-phases'); if (!w || !s.phases) return;
  w.innerHTML = s.phases.map(function (ph) {
    var tag = ph.tag ? '<span class="badge ' + (ph.tag.cls || 'bb') + '">' + ph.tag.text + '</span>' : '';
    return '<div class="card" style="margin-bottom:14px;"><div class="card-hdr"><div><div class="card-ttl">' + ph.title + '</div></div>' + tag + '</div>' +
      founderTable(ph.cols, ph.rows) + '</div>';
  }).join('');
}

function renderFounderLoan(l) {
  if (!l) return;
  var sg = el('f-loan-stats');
  if (sg && l.stats) sg.innerHTML = l.stats.map(function (s) {
    return '<div class="f-stat"><div class="f-stat-lbl">' + s.lbl + '</div><div class="f-stat-val">' + s.val + '</div></div>';
  }).join('');
  if (l.progress) {
    var pr = l.progress, w = el('f-loan-progress');
    if (w) w.innerHTML =
      '<div style="font-size:11px;color:var(--muted);margin-bottom:6px;">' + (pr.note || '') + '</div>' +
      '<div class="prog-wrap" style="height:10px;"><div class="prog-fill" style="width:' + (pr.fillPct || 0) + '%;background:var(--brand);"></div></div>' +
      '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted2);margin-top:6px;">' + (pr.meta || []).map(function (m) { return '<span>' + m + '</span>'; }).join('') + '</div>';
  }
  renderKpis('f-loan-kpis', l.kpis);
  if (l.chart) renderChart('f-chart-floan', 'f-chart-floan-leg', l.chart);
  fInfoBar('f-loan-info', l.info, 'info');
}

function renderFounderSections() {
  var F = DATA.sections && DATA.sections.founder; if (!F) return;
  renderFounderOverview(F.overview);
  renderFounderPnl(F.pnl);
  renderFounderStock(F.stock);
  renderFounderLoan(F.loan);
}

// Boot: render the STATIC (non-period) sections once. Period-dependent sections are
// rendered by renderPeriodSections (called from switchDateRange).
function renderSections() {
  var S = DATA.sections; if (!S) return;
  renderMarketSelects();
  var o = S.overview || {};
  renderTasks(o.tasksSpec);
  renderFlags(o.flagsSpec);
  renderCompleted(o.completedSpec);   // Project Scope column G (Completed)
  renderAlertList('sec-stockwarn', 'sec-stockwarn-badge', o.stockWarn);   // inventory state → MCP live later
  renderAlertList('sec-health', 'sec-health-badge', o.healthSpec);        // Account Health (strategy alerts)
  var healthWrap = el('sec-health-wrap'); if (healthWrap) healthWrap.style.display = o.healthSpec ? '' : 'none';
  renderEarlyLaunch(o.earlyLaunch);

  var pl = S.pnl || {};
  if (pl.revBreak) renderBars('sec-pnl-revbreak', pl.revBreak);           // static fallback only
  if (pl.statement || (pl.summary)) {                                     // reveal full P&L, hide cost-breakdown
    var sw = el('sec-statement-wrap'); if (sw) sw.style.display = '';
    var cw = el('sec-costs-wrap'); if (cw) cw.style.display = 'none';
  } else if (pl.costs) renderBars('sec-pnl-costs', pl.costs);
  // Client took over the P&L page but supplied no portfolio data → hide the Product Profitability
  // row rather than show the static placeholder products. (AMACX: no 12-mo product-P&L source.)
  if ((pl.statement || pl.summary || pl.margin || pl.mkt) && !pl.portfolio) {
    var pfr = el('sec-portfolio-row'); if (pfr) pfr.style.display = 'none';
  }

  var ad = S.advertising || {};
  if (ad.budgets) renderAdBudgets(ad.budgets);                            // forward-looking, not period-bound
  if (ad.forecast) renderForecast(ad.forecast);

  var iv = S.inventory || {};                                            // whole page → MCP live later
  // Stock-status KPIs follow the market chip: per-marketplace counts (kpisByMarket) when one is
  // selected, else the EU unique-SKU totals. The stock + restock lists are market-filtered by row.
  var ivMkt = (currentMarket && currentMarket !== 'all') ? currentMarket : null;
  var ivKpis = (ivMkt && iv.kpisByMarket && iv.kpisByMarket[ivMkt]) || iv.kpis;
  if (ivKpis) renderKpis('sec-inv-kpis', ivKpis);
  if (iv.stock) renderStock(iv.stock);
  if (iv.dispatch) renderProgress('sec-inv-dispatch', iv.dispatch.bars, iv.dispatch.note);
  // No FBM dispatch-rate source → hide the card when a client supplies inventory but no dispatch data.
  else if (iv.kpis) { var dc = el('sec-inv-dispatch-card'); if (dc) dc.style.display = 'none'; }
  if (iv.restock) renderRestock(iv.restock);
  renderSupplierPOs(iv.supplierPOs);                                      // hidden unless supplied

  // Sections-level chart fallbacks (used only if a client supplies them statically, not per-period).
  if (o.revChart) renderChart('chart-rev', 'chart-rev-leg', o.revChart);
  if (ad.adChart) renderChart('chart-adtrend', 'chart-adtrend-leg', ad.adChart);

  renderShopBrands();        // Shopify brand-filter chips (no-op unless sections.shopify exists)
  renderFounderSections();   // Founder-template pages (no-op unless sections.founder exists)
}

// Period-dependent sections. Reads the current period's d.sec.* overrides, falling back to the
// top-level sections (the May/default values) when a period doesn't override a given piece.
// Founder Overview "Amazon actuals" widgets (KPIs + revenue trend + buy-box + CVR). Period-aware via
// sec.overviewActuals (kpis/cvr); the trend + buy-box come from the top-level (they don't vary by period).
function renderFounderOvActuals(spec) {
  if (!spec) return;
  if (spec.kpis) renderKpis('f-ov-akpis', spec.kpis);
  if (spec.revTrend) renderChart('f-ov-revtrend', 'f-ov-revtrend-leg', spec.revTrend);
  if (spec.buyBox) renderProgress('f-ov-buybox', spec.buyBox);
  if (spec.cvr) renderProgress('f-ov-cvr', spec.cvr);
}

function renderPeriodSections(d) {
  var S = DATA.sections; if (!S) return;
  function pick(a, b) { return a != null ? a : b; }
  var sec = d.sec || {};
  var o = S.overview || {}, pl = S.pnl || {}, pr = S.products || {}, kw = S.keywords || {}, ad = S.advertising || {};
  var so = sec.overview || {}, spl = sec.pnl || {}, spr = sec.products || {}, skw = sec.keywords || {}, sad = sec.advertising || {};

  // Period charts (carried on the period object itself).
  if (d.revChart) renderChart('chart-rev', 'chart-rev-leg', d.revChart);
  if (d.adChart) renderChart('chart-adtrend', 'chart-adtrend-leg', d.adChart);
  if (d.revBreakChart) renderRevBreak(d.revBreakChart);
  // Ad widgets (campaign-type pie + Ad Metrics) are region-aware: a market with no ad spend in the
  // selected period (e.g. NKV's Ireland / USA, AMACX's pre-launch NLD) blanks them rather than showing
  // the account total under that market's label. Driven by the market's own spend KPI (no extra data).
  var adMkt = (currentMarket && currentMarket !== 'all') ? currentMarket : null;
  var adMktKpi = adMkt && d.marketKpis && d.marketKpis[adMkt];
  var adSpendNum = parseFloat(String((adMktKpi && adMktKpi.spend) || '').replace(/[^0-9.]/g, ''));
  var adHasSpend = !adMktKpi || isNaN(adSpendNum) || adSpendNum > 0;   // blank only on a real £0/$0/€0

  // Performance by Campaign Type pie — follows the date range AND the market chip:
  // campaignMixByPeriod[period][market] (EU 'all' for All-EU / NLD). Falls back to d.campaignMix.
  var cmByP = ad.campaignMixByPeriod;
  var cmix = cmByP && cmByP[currentPeriod];
  var cmMkt = adMkt || 'all';
  var cmSel = cmix ? (cmix[cmMkt] || cmix.all) : d.campaignMix;
  var pw = el('sec-campaign-pie-wrap');
  if (cmSel && adHasSpend) {
    renderPie('chart-campaign-pie', 'chart-campaign-pie-leg', cmSel);
    if (pw) pw.style.display = '';
    var cscope = document.querySelector('#sec-campaign-pie-wrap .cfg-scope');
    if (cscope) cscope.textContent = (cmMkt !== 'all') ? ((MKT[cmMkt] && MKT[cmMkt].t) || cmMkt) : ((CONFIG.client && CONFIG.client.scopeLabel) || 'All EU');
  } else if (pw) { pw.style.display = 'none'; }

  renderTargetAttainment(o);                // Revenue + Units actual vs target (EU-only, period aware)
  renderBuyBox(o);                          // official Buy Box % + per-market bars (period + market aware)
  renderBuyBoxLosses(o.buyBoxLosses);       // loss list (market-filtered by applyMarketFilter)
  var cv = pick(so.cvr, o.cvr); if (cv) renderCvr(cv);

  var psum = pick(spl.summary, pl.summary); if (psum) renderPnlSummary(psum);   // legacy (element removed)
  var pf = pick(spl.portfolio, pl.portfolio); if (pf) renderPortfolio(pf);
  var pmar = pick(spl.margin, pl.margin); if (pmar) renderMargin(pmar);
  var pmkt = pick(spl.mkt, pl.mkt); if (pmkt) renderPnlMkt(pmkt);
  var pst = pick(spl.statement, pl.statement);
  if (pst) {
    if (pst.fixedLabel) {
      // Fixed view (e.g. AMACX trailing-12 P&L) — same regardless of the period selector, no comparison column.
      renderStatement(pst, null, pst.fixedLabel, null);
    } else {
      // comparison = the next-longer period in the date-range selector (1m→3m→6m→12m).
      var opts = CONFIG.dateRangeOptions || [], idx = -1, i;
      for (i = 0; i < opts.length; i++) { if (opts[i].value === currentPeriod) { idx = i; break; } }
      var cmpD = (idx >= 0 && idx + 1 < opts.length) ? dateRanges[opts[idx + 1].value] : null;
      var cmpSt = cmpD ? ((cmpD.sec && cmpD.sec.pnl && cmpD.sec.pnl.statement) || (S.pnl && S.pnl.statement)) : null;
      renderStatement(pst, cmpSt, d.shortLabel, cmpD ? cmpD.shortLabel : null);
    }
  }

  // Products page is market-aware: KPIs, the per-market table, and product groups all follow the
  // sidebar market selector. NLD has no MerchantSpring data yet → show the integration placeholder.
  var pmKey = (currentMarket && currentMarket !== 'all') ? currentMarket : null;
  var prodMain = el('sec-prod-main'), prodNld = el('sec-prod-nld');
  if (pmKey === 'nld') {
    if (prodMain) prodMain.style.display = 'none';
    if (prodNld) prodNld.style.display = '';
  } else {
    if (prodMain) prodMain.style.display = '';
    if (prodNld) prodNld.style.display = 'none';
    // KPIs + Performance-by-Market table follow the date-range selector too (period → market).
    var kp = pr.kpisByPeriod && pr.kpisByPeriod[currentPeriod];
    var prk = (kp && (pmKey ? kp[pmKey] : kp.all)) || pick(spr.kpis, pr.kpis);
    if (prk) renderKpis('sec-prod-kpis', prk);
    var tp = pr.tableByPeriod && pr.tableByPeriod[currentPeriod];
    var prtAll = tp || pick(spr.table, pr.table);
    // Render all market rows; applyMarketFilter (sec-prod-table is in MKT_FILTER_IDS) row-filters to the
    // selected chip by matcher (flag/code/chip), which is correct even when the market key (e.g. 'uk')
    // differs from the flag ('gb') — the old r.flag===pmKey compare silently blanked the table for those.
    if (prtAll) renderProdTable(prtAll);
    // Product groups: AMACX uses groupsByPeriod[period][market]; clients with only a static `groups`
    // array (demo/nkv) fall back to it (renderProdGroups tolerates the missing adSpend/tacos fields).
    var gp = pr.groupsByPeriod && pr.groupsByPeriod[currentPeriod];
    renderProdGroups((gp && (pmKey ? gp[pmKey] : gp.all)) || pick(spr.groups, pr.groups));
    var gscope = document.querySelector('#sec-prod-groups-card .cfg-scope');
    if (gscope) gscope.textContent = pmKey ? ((MKT[pmKey] && MKT[pmKey].t) || pmKey) : ((CONFIG.client && CONFIG.client.scopeLabel) || 'All EU');
    var gper = document.querySelector('#sec-prod-groups-card .dr-period');
    if (gper) gper.textContent = d.shortLabel || d.label || '';
  }

  var kwk = pick(skw.kpis, kw.kpis); if (kwk) renderKpis('sec-kw-kpis', kwk);
  var kwt = pick(skw.table, kw.table); if (kwt) renderKwTable(kwt);

  var am = pick(sad.metrics, ad.metrics);
  if (am && adHasSpend) renderMetrics(am);
  else if (am) { var amw = el('sec-ad-metrics'); if (amw) amw.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:16px;text-align:center;">No ad activity in ' + ((MKT[adMkt] && MKT[adMkt].t) || adMkt || 'this market') + ' this period.</div>'; }
  var ac = pick(sad.campaigns, ad.campaigns); if (ac) renderCampaigns(ac);

  // Inventory stock-status KPIs follow the market chip (per-marketplace counts; EU unique-SKU totals
  // for All-EU). Lists below row-filter by market separately. Runs here so it reacts to chip changes.
  var ivp = S.inventory || {};
  var ivpMkt = (currentMarket && currentMarket !== 'all') ? currentMarket : null;
  var ivpKpis = (ivpMkt && ivp.kpisByMarket && ivp.kpisByMarket[ivpMkt]) || ivp.kpis;
  if (ivpKpis) renderKpis('sec-inv-kpis', ivpKpis);

  // Founder Overview actuals (no-op unless sections.overviewActuals exists). kpis/cvr are period-aware
  // (sec override); revTrend + buyBox come from the top-level (don't vary by period).
  var oaT = S.overviewActuals;
  if (oaT) {
    var oaP = pick(sec.overviewActuals, oaT);
    renderFounderOvActuals({ kpis: oaP.kpis, cvr: oaP.cvr, buyBox: oaT.buyBox, revTrend: oaT.revTrend });
  }

  renderShopify();     // Shopify performance page — repaints for the selected brand at the current period
  renderShopifyPnl();  // Shopify P&L page (no-op without sections.shopifypnl)
}

// ---------- Shopify page (brand filter: ALL / Newnique / Contours Rx) ----------
// Independent of the sidebar market chips (those are the Amazon marketplaces). The brand filter
// re-scopes ONLY this page, reading DATA.sections.shopify.data[currentBrand][...]. It follows the
// shared date-range selector (currentPeriod) too. All values are baked in data.js (Shopify Admin/
// ShopifyQL pulled in-session); a live proxy can overlay sections.shopify later, like AMACX.
var currentBrand = 'all';

// Brand chips are client-specific values (Newnique / Contours Rx), so they're DATA-driven — never
// hardcoded in index.html. Rendered once from sections.shopify.brands.
function renderShopBrands() {
  var S = DATA.sections && DATA.sections.shopify;
  if (!S || !S.brands) return;
  var html = S.brands.map(function (b) {
    return '<div class="shop-brand' + (b.key === currentBrand ? ' active' : '') + '" data-brand="' + b.key +
      '" onclick="switchBrand(\'' + b.key + '\')">' + b.label + '</div>';
  }).join('');
  // Same chips live on both Shopify pages (performance + P&L), kept in sync from one brand state.
  ['shop-brands', 'shop-brands-pnl'].forEach(function (id) { var w = el(id); if (w) w.innerHTML = html; });
}

window.switchBrand = function (b) {
  currentBrand = b;
  renderShopify();
  renderShopifyPnl();
};

// Conversion funnel: stacked bars whose width = share of sessions (shows the real drop-off), with a
// step-conversion sub-line. f = [{ lbl, val, pct, w, sub }].
function shopFunnel(f) {
  if (!f || !f.length) return '<div style="font-size:12px;color:var(--muted);padding:8px;">No data in this view.</div>';
  var cols = ['var(--brand)', 'var(--blue)', 'var(--amber)', 'var(--green)'];
  return f.map(function (s, i) {
    return '<div style="margin-bottom:13px;">' +
      '<div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">' +
        '<span style="font-weight:500;">' + s.lbl + '</span>' +
        '<span style="font-weight:600;">' + s.val + ' <span style="color:var(--muted);font-weight:400;">&middot; ' + s.pct + '</span></span>' +
      '</div>' +
      '<div class="prog-wrap"><div class="prog-fill" style="width:' + Math.max(s.w, 2) + '%;background:' + (cols[i] || 'var(--brand)') + '"></div></div>' +
      (s.sub ? '<div style="font-size:10px;color:var(--muted);margin-top:3px;">' + s.sub + '</div>' : '') +
    '</div>';
  }).join('');
}

function renderShopify() {
  var S = DATA.sections && DATA.sections.shopify; if (!S) return;
  var brand = (S.data && S.data[currentBrand]) || {};
  var per = (brand.byPeriod && (brand.byPeriod[currentPeriod] || brand.byPeriod.may)) || {};

  // keep chip active state in sync on BOTH Shopify pages (period changes also call this)
  document.querySelectorAll('.shop-brand').forEach(function (n) {
    n.classList.toggle('active', n.getAttribute('data-brand') === currentBrand);
  });

  set('sec-shop-store', brand.label ? (brand.label + (brand.store ? ' · ' + brand.store : '')) : '');

  renderKpis('sec-shop-kpis1', per.kpis1);
  renderKpis('sec-shop-kpis2', per.kpis2);

  if (brand.chart) renderChart('chart-shop-rev', 'chart-shop-rev-leg', brand.chart);
  else { var cv = el('chart-shop-rev'), cl = el('chart-shop-rev-leg');   // no trend (e.g. Newnique stub) → clear, don't leave the prior brand's chart
         if (cv) cv.innerHTML = ''; if (cl) cl.innerHTML = ''; }

  var fw = el('sec-shop-funnel'); if (fw) fw.innerHTML = shopFunnel(per.funnel);

  var pw = el('sec-shop-products');
  if (pw) pw.innerHTML = (per.products && per.products.length) ? per.products.map(function (r) {
    return '<tr><td style="font-weight:500;">' + r.name + '</td><td>' + r.net + '</td><td>' + r.units +
      '</td><td>' + r.asp + '</td><td>' + r.orders + '</td><td><span class="badge ' + (r.shareCls || 'bb') + '">' + r.share + '</span></td></tr>';
  }).join('') : '<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:22px;">' +
      (brand.placeholder || 'No product data in this view.') + '</td></tr>';

  var sw = el('sec-shop-stock');
  if (sw) sw.innerHTML = (brand.stock && brand.stock.length) ? brand.stock.map(function (s) {
    var dot = s.level === 'r' ? 'dr' : (s.level === 'a' ? 'da' : 'dg');
    var uc = s.level === 'r' ? 'color:var(--red)' : (s.level === 'a' ? 'color:var(--amber)' : '');
    return '<div class="inv-row"><div class="sdot ' + dot + '"></div><div class="inv-info">' +
      '<div class="inv-name">' + s.name + '</div><div class="inv-note">' + s.note + '</div></div>' +
      '<div class="inv-r"><div class="inv-u" style="' + uc + '">' + s.units + '</div><div class="inv-d" style="' + uc + '">' + s.cover + '</div></div></div>';
  }).join('') : '<div style="font-size:12px;color:var(--muted);padding:16px;">' +
      (brand.placeholder || 'No stock data in this view.') + '</div>';

  var tw = el('sec-shop-traffic');
  if (tw) { if (brand.traffic && brand.traffic.length) renderBars('sec-shop-traffic', brand.traffic);
            else tw.innerHTML = '<div style="font-size:12px;color:var(--muted);padding:8px;">' + (brand.placeholder || 'No traffic data in this view.') + '</div>'; }
}

// ---------- Shopify P&L page (same brand filter + date range) ----------
// Revenue lines are live from Shopify (baked); COGS + fees are flagged estimates; the rest of the
// operating expenses are client-provided inputs (and the NKV Google Ads spend) that drop in later.
// Reads sections.shopifypnl.data[currentBrand].byPeriod[currentPeriod].
var SPNL_DOT = { live: 'var(--green)', est: 'var(--amber)', pending: 'var(--blue)', input: 'var(--muted2)' };

function renderShopifyPnl() {
  var S = DATA.sections && DATA.sections.shopifypnl; if (!S) return;
  var brand = (S.data && S.data[currentBrand]) || {};
  var per = (brand.byPeriod && (brand.byPeriod[currentPeriod] || brand.byPeriod.may)) || {};

  set('sec-spnl-store', brand.label ? (brand.label + (brand.store ? ' · ' + brand.store : '')) : '');
  renderKpis('sec-spnl-kpis', per.kpis);

  var info = el('sec-spnl-info');
  if (info) { var txt = per.info || brand.info || '';
    info.innerHTML = txt ? '<div style="background:var(--blue-bg);border:1px solid var(--blue-b);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--blue);">' + txt + '</div>' : ''; }

  var tb = el('sec-spnl-rows');
  if (tb) tb.innerHTML = (per.rows && per.rows.length) ? per.rows.map(function (r) {
    if (r.kind === 'header') return '<tr><td colspan="3" style="font-weight:600;color:var(--brand);padding:14px 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:.05em;">' + r.label + '</td></tr>';
    var strong = (r.kind === 'sub' || r.kind === 'total');
    var rowStyle = strong ? 'border-top:1px solid var(--border);background:var(--surface2);' : '';
    var w = strong ? 'font-weight:700;' : '';
    var note = r.note ? '<div style="font-size:10px;color:var(--muted);font-weight:400;">' + r.note + '</div>' : '';
    var valStyle = r.muted ? 'color:var(--muted);font-style:italic;font-weight:400;' : '';
    return '<tr style="' + rowStyle + '"><td style="' + w + '">' + r.label + note + '</td>' +
      '<td style="text-align:right;' + w + valStyle + '">' + (r.val || '') + '</td>' +
      '<td style="text-align:right;color:var(--muted);' + w + '">' + (r.pct || '') + '</td></tr>';
  }).join('') : '<tr><td colspan="3" style="text-align:center;color:var(--muted);padding:22px;">' +
      (brand.placeholder || 'No P&L data in this view.') + '</td></tr>';

  var sl = el('sec-spnl-status');
  if (sl) sl.innerHTML = (brand.statusList && brand.statusList.length) ? brand.statusList.map(function (s, i) {
    var last = i === brand.statusList.length - 1;
    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;' + (last ? '' : 'border-bottom:1px solid var(--border);') + '">' +
      '<div style="width:8px;height:8px;border-radius:50%;background:' + (SPNL_DOT[s.status] || 'var(--muted2)') + ';flex-shrink:0;margin-top:4px;"></div>' +
      '<div style="flex:1;"><div style="font-size:12px;font-weight:500;">' + s.label + '</div>' +
      '<div style="font-size:11px;color:var(--muted);margin-top:1px;">' + (s.note || '') + '</div></div></div>';
  }).join('') : '<div style="font-size:12px;color:var(--muted);padding:14px;">' + (brand.placeholder || 'No inputs configured.') + '</div>';
}

// ---------- boot ----------
function boot() {
  applyConfig();
  // For live (appsScript) clients, raise the loading overlay BEFORE any static content paints,
  // so the static fallback never flashes before the live fetch resolves. loadLiveData() hides it.
  var _ds = CONFIG.dataSource || {};
  if (_ds.type === 'appsScript' && _ds.url) showLoadingOverlay();
  renderSections();                               // deep-page content (clients with data.sections only)
  switchDateRange(currentPeriod);                 // paints KPIs, market table, sidebar chips, topbar subtitle
  if (MKT[currentMarket]) set('tb-title', MKT[currentMarket].t);
  if (PAGES.length) switchPage(PAGES[0].key);     // activate the first page (nav/tabs are generated)
  loadLiveData();
  watchForUpdates();                              // site-wide refresh prompt if a new build deploys mid-session
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
