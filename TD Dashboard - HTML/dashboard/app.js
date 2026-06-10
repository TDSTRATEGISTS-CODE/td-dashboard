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
  document.getElementById('page-' + key).classList.add('active');
  if (sideNavEl) sideNavEl.classList.add('active');
  if (tabEl) tabEl.classList.add('active');
  var pages = ['overview', 'pnl', 'advertising', 'inventory', 'products', 'keywords'];
  var idx = pages.indexOf(key);
  if (!tabEl) { var tabs = document.querySelectorAll('.ptab'); if (idx >= 0 && tabs[idx]) tabs[idx].classList.add('active'); }
  if (!sideNavEl) { var navs = document.querySelectorAll('.nav-item'); if (idx >= 0 && navs[idx]) navs[idx].classList.add('active'); }
  closeSidebar();
};

window.switchMarket = function (k, el) {
  currentMarket = k;
  document.querySelectorAll('.mkt-btn').forEach(function (b) { b.classList.remove('active'); });
  if (el) el.classList.add('active');
  var m = MKT[k];
  var d = dateRanges[currentPeriod];
  if (m) {
    set('tb-title', m.t);
    document.getElementById('tb-mkt').textContent = m.m + (d ? ' · ' + d.label : '');
  }
  closeSidebar();
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
  [1, 2, 3, 4, 5, 6, 7].forEach(function (n) { var el = document.getElementById('sec-period-' + n); if (el) el.textContent = d.shortLabel; });

  set('k-rev', d.rev);     set('k-rev-d', d.revD);     cls('k-rev-d', d.revC);     set('k-rev-s', d.revS);
  set('k-ad', d.adSales);  set('k-ad-d', d.adSalesD);  cls('k-ad-d', d.adSalesC);  set('k-ad-s', d.adSalesS);
  set('k-tacos', d.tacos); set('k-tacos-d', d.tacosD); cls('k-tacos-d', d.tacosC); set('k-tacos-s', d.tacosS);
  set('k-margin', d.roas); set('k-margin-d', d.roasD); cls('k-margin-d', d.roasC); set('k-margin-s', d.roasS);

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

  updateMarketChips(d);
};

// ---------- config-driven identity / brand / chips ----------
function applyConfig() {
  var C = CONFIG;
  if (C.client.title) document.title = C.client.title;

  var root = document.documentElement;
  if (C.brand) Object.keys(C.brand).forEach(function (k) { root.style.setProperty('--' + k, C.brand[k]); });

  var logo = document.getElementById('cfg-logo');
  if (logo) {
    logo.src = 'clients/' + CLIENT + '/' + C.client.logo;
    logo.alt = C.client.logoAlt || C.client.name || '';
    logo.style.mixBlendMode = C.client.logoBlend || 'normal';
  }
  set('cfg-portal', C.client.portalLabel);
  set('cfg-client-name', C.client.name);
  set('cfg-client-period', C.client.reportPeriodLabel);

  var f = document.getElementById('cfg-footer');
  if (f && C.client.footer) {
    var ft = C.client.footer;
    f.innerHTML = [ft.cadence, ft.next].filter(Boolean).join('<br>') + (ft.managedBy ? '<br><br>' + ft.managedBy : '');
  }

  var sel = document.getElementById('date-range-select');
  if (sel && C.dateRangeOptions) {
    sel.innerHTML = C.dateRangeOptions.map(function (o) { return '<option value="' + o.value + '">' + o.label + '</option>'; }).join('');
    sel.value = currentPeriod;
  }

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

// ---------- live data (Apps Script proxy → MerchantSpring in Phase 2) ----------
function loadLiveData() {
  var ds = CONFIG.dataSource || {};
  if (ds.type !== 'appsScript' || !ds.url) return;   // 'static' = data.js only
  fetch(ds.url)
    .then(function (r) { return r.json(); })
    .then(function (j) {
      if (!j || j.status !== 'ok' || !j.dateRanges) return;
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
    })
    .catch(function () { /* keep static values from data.js */ });
}

// ---------- boot ----------
function boot() {
  applyConfig();
  switchDateRange(currentPeriod);                 // paints KPIs, market table, sidebar chips, topbar subtitle
  if (MKT[currentMarket]) set('tb-title', MKT[currentMarket].t);
  loadLiveData();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
