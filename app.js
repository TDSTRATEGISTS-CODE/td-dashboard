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
  document.querySelectorAll('.dr-chart-sub').forEach(function (el) { el.textContent = d.shortLabel; });
  [1, 2, 3, 4, 5, 6, 7].forEach(function (n) { var el = document.getElementById('sec-period-' + n); if (el) el.textContent = d.shortLabel; });

  set('k-rev', d.rev);     set('k-rev-d', d.revD);     cls('k-rev-d', d.revC);     set('k-rev-s', d.revS);
  set('k-ad', d.adSales);  set('k-ad-d', d.adSalesD);  cls('k-ad-d', d.adSalesC);  set('k-ad-s', d.adSalesS);
  set('k-tacos', d.tacos); set('k-tacos-d', d.tacosD); cls('k-tacos-d', d.tacosC); set('k-tacos-s', d.tacosS);
  // 4th overview KPI = AOV (the headline focus); ROAS remains on the Advertising page.
  set('k-margin', d.aov); set('k-margin-d', d.aovD); cls('k-margin-d', d.aovC); set('k-margin-s', d.aovS);

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

  // Period-aware charts + section content (clients with sections + per-period data).
  if (DATA.sections) renderPeriodSections(d);

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

  if (C.client.scopeLabel) {
    var sc = document.querySelectorAll('.cfg-scope');
    for (var i = 0; i < sc.length; i++) sc[i].textContent = C.client.scopeLabel;
  }
  if (C.client.currencyIcon) set('cfg-pnl-icon', C.client.currencyIcon);

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
// Uses JSONP (script-tag), not fetch: works cross-origin in the Wix iframe AND from a
// double-clicked file:// page, with no CORS dependency. The proxy returns cb({...}) when
// called with ?callback=cb.
function loadLiveData() {
  var ds = CONFIG.dataSource || {};
  if (ds.type !== 'appsScript' || !ds.url) return;   // 'static' = data.js only
  var cb = '__dashCb' + Date.now();
  var s = document.createElement('script');
  window[cb] = function (j) {
    try { applyLive(j); }
    finally { delete window[cb]; if (s.parentNode) s.parentNode.removeChild(s); }
  };
  s.onerror = function () { delete window[cb]; if (s.parentNode) s.parentNode.removeChild(s); };
  s.src = ds.url + (ds.url.indexOf('?') === -1 ? '?' : '&') + 'callback=' + cb + '&cachebust=' + Date.now();
  document.head.appendChild(s);
}

function applyLive(j) {
  if (!j || j.status !== 'ok' || !j.dateRanges) return;   // keep static values from data.js
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

// Shared renderer for the coloured alert lists (Flags & Warnings, Stock Warnings).
function renderAlertList(id, badgeId, spec) {
  if (!spec) return;
  if (badgeId && spec.badge != null) set(badgeId, spec.badge);
  var w = el(id); if (!w || !spec.items) return;
  var lv = {
    red:   { bg: '#fdf0f0', dot: 'var(--red)',   col: 'var(--red)',   pulse: 'animation:pulse2 1.5s infinite;', wt: 600, sub: 'var(--muted)' },
    amber: { bg: '#fdf6e7', dot: 'var(--amber)', col: 'var(--amber)', pulse: '', wt: 600, sub: 'var(--muted)' },
    muted: { bg: '',        dot: 'var(--muted2)',col: 'var(--muted)', pulse: '', wt: 500, sub: 'var(--muted2)' }
  };
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

function renderProdTable(arr) {
  if (!arr) return;
  renderRowsTable('sec-prod-table', arr.map(function (r) {
    return '<tr><td>' + flagTag(r.flag, r.name) + r.name + '</td><td>' + r.revenue + '</td><td>' + r.units +
      '</td><td>' + r.orders + '</td><td><span class="badge ' + (r.cvrCls || 'bg') + '">' + r.cvr + '</span></td><td>' + r.aov + '</td></tr>';
  }));
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
// spec = { max, yTicks:[top→bottom], xLabels:[...], xHighlight?, series:[{values,color,dash,area,main}], legend:[{name,color}] }
function renderChart(id, legId, spec) {
  var svg = el(id); if (!svg || !spec) return;
  var W = 440, H = 160, PADL = 46, PADR = 14, PADT = 18, PADB = 22;
  var plotW = W - PADL - PADR, plotH = H - PADT - PADB, baseY = PADT + plotH;
  var n = spec.xLabels.length;
  function X(i) { return PADL + (n <= 1 ? 0 : plotW * i / (n - 1)); }
  function Y(v) { return PADT + plotH * (1 - v / spec.max); }
  var p = [], T = spec.yTicks.length, k, gy;
  for (k = 0; k < T; k++) {
    gy = PADT + plotH * k / (T - 1);
    p.push('<line x1="' + PADL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - PADR) + '" y2="' + gy.toFixed(1) + '" stroke="#e4e2dc" stroke-width="1"/>');
    p.push('<text x="' + (PADL - 6) + '" y="' + (gy + 3).toFixed(1) + '" font-size="9" fill="#9ca3af" font-family="Poppins" text-anchor="end">' + spec.yTicks[k] + '</text>');
  }
  spec.series.forEach(function (s) {
    var pts = s.values.map(function (v, i) { return X(i).toFixed(1) + ',' + Y(v).toFixed(1); });
    if (s.area) {
      p.push('<polygon points="' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + baseY + ' ' + X(0).toFixed(1) + ',' + baseY + '" fill="' + s.color + '" opacity="0.08"/>');
    }
    p.push('<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s.color + '" stroke-width="' + (s.main ? 1.8 : 1.4) + '" stroke-linecap="round" stroke-linejoin="round"' + (s.dash ? ' stroke-dasharray="5 3"' : '') + '/>');
    s.values.forEach(function (v, i) {
      p.push('<circle cx="' + X(i).toFixed(1) + '" cy="' + Y(v).toFixed(1) + '" r="' + (s.main ? 2.5 : 1.8) + '" fill="' + s.color + '" stroke="#fff" stroke-width="1.3"/>');
    });
  });
  spec.xLabels.forEach(function (lb, i) {
    var lastM = i === n - 1;
    p.push('<text x="' + X(i).toFixed(1) + '" y="' + (H - 6) + '" font-size="9" fill="' + (lastM ? (spec.xHighlight || '#1e293b') : '#9ca3af') + '" font-family="Poppins" text-anchor="middle"' + (lastM ? ' font-weight="600"' : '') + '>' + lb + '</text>');
  });
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
  svg.innerHTML = p.join('');
  if (legId && spec.legend) {
    var lg = el(legId);
    if (lg) lg.innerHTML = spec.legend.map(function (L) { return '<div class="leg-i"><div class="leg-dot" style="background:' + L.color + '"></div>' + L.name + '</div>'; }).join('');
  }
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

// Full P&L statement (INCOME / EXPENSES / METRICS), grouped rows with bold totals.
function renderStatement(spec) {
  var t = el('sec-pnl-statement'); if (!t || !spec || !spec.groups) return;
  var head = '<thead><tr><th>' + (spec.title || '') + '</th><th>Amount</th><th>%</th><th>Per unit</th></tr></thead>';
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
  t.innerHTML = head + '<tbody>' + body + '</tbody>';
}

function renderMarketSelects() {
  var sels = document.querySelectorAll('.js-mkt-select');
  if (!sels.length) return;
  var opts = '<option>All Markets</option>' + CONFIG.markets.filter(function (m) { return m.key !== 'all'; })
    .map(function (m) { return '<option>' + m.chip + '</option>'; }).join('');
  for (var i = 0; i < sels.length; i++) sels[i].innerHTML = opts;
}

// Boot: render the STATIC (non-period) sections once. Period-dependent sections are
// rendered by renderPeriodSections (called from switchDateRange).
function renderSections() {
  var S = DATA.sections; if (!S) return;
  renderMarketSelects();
  var o = S.overview || {};
  renderTasks(o.tasksSpec);
  renderFlags(o.flagsSpec);
  renderAlertList('sec-stockwarn', 'sec-stockwarn-badge', o.stockWarn);   // inventory state → MCP live later
  renderEarlyLaunch(o.earlyLaunch);

  var pl = S.pnl || {};
  if (pl.revBreak) renderBars('sec-pnl-revbreak', pl.revBreak);           // static fallback only
  if (pl.statement || (pl.summary)) {                                     // reveal full P&L, hide cost-breakdown
    var sw = el('sec-statement-wrap'); if (sw) sw.style.display = '';
    var cw = el('sec-costs-wrap'); if (cw) cw.style.display = 'none';
  } else if (pl.costs) renderBars('sec-pnl-costs', pl.costs);

  var ad = S.advertising || {};
  if (ad.budgets) renderAdBudgets(ad.budgets);                            // forward-looking, not period-bound
  if (ad.forecast) renderForecast(ad.forecast);

  var iv = S.inventory || {};                                            // whole page → MCP live later
  if (iv.kpis) renderKpis('sec-inv-kpis', iv.kpis);
  if (iv.stock) renderStock(iv.stock);
  if (iv.dispatch) renderProgress('sec-inv-dispatch', iv.dispatch.bars, iv.dispatch.note);
  if (iv.restock) renderRestock(iv.restock);

  // Sections-level chart fallbacks (used only if a client supplies them statically, not per-period).
  if (o.revChart) renderChart('chart-rev', 'chart-rev-leg', o.revChart);
  if (ad.adChart) renderChart('chart-adtrend', 'chart-adtrend-leg', ad.adChart);
}

// Period-dependent sections. Reads the current period's d.sec.* overrides, falling back to the
// top-level sections (the May/default values) when a period doesn't override a given piece.
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
  if (d.campaignMix) {
    renderPie('chart-campaign-pie', 'chart-campaign-pie-leg', d.campaignMix);
    var pw = el('sec-campaign-pie-wrap'); if (pw) pw.style.display = '';
  }

  var bb = pick(so.buyBox, o.buyBox); if (bb) renderProgress('sec-buybox', bb);
  var cv = pick(so.cvr, o.cvr); if (cv) renderCvr(cv);

  var psum = pick(spl.summary, pl.summary); if (psum) renderPnlSummary(psum);
  var pmar = pick(spl.margin, pl.margin); if (pmar) renderMargin(pmar);
  var pmkt = pick(spl.mkt, pl.mkt); if (pmkt) renderPnlMkt(pmkt);
  var pst = pick(spl.statement, pl.statement); if (pst) renderStatement(pst);

  var prk = pick(spr.kpis, pr.kpis); if (prk) renderKpis('sec-prod-kpis', prk);
  var prt = pick(spr.table, pr.table); if (prt) renderProdTable(prt);

  var kwk = pick(skw.kpis, kw.kpis); if (kwk) renderKpis('sec-kw-kpis', kwk);
  var kwt = pick(skw.table, kw.table); if (kwt) renderKwTable(kwt);

  var am = pick(sad.metrics, ad.metrics); if (am) renderMetrics(am);
  var ac = pick(sad.campaigns, ad.campaigns); if (ac) renderCampaigns(ac);
}

// ---------- boot ----------
function boot() {
  applyConfig();
  renderSections();                               // deep-page content (clients with data.sections only)
  switchDateRange(currentPeriod);                 // paints KPIs, market table, sidebar chips, topbar subtitle
  if (MKT[currentMarket]) set('tb-title', MKT[currentMarket].t);
  loadLiveData();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

})();
