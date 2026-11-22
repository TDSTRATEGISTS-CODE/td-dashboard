// Pure part of the warehouse generator: turns daily facts from the TDS Data Warehouse into the number fields of a
// client's data.js (dateRanges.may / 3m / 12m / mtd). No I/O, so it is unit-tested with made-up data.
// Definitions match the hand-baked files: TACoS = ad spend ÷ revenue, ROAS = ad sales ÷ ad spend, "AOV" = revenue ÷ units.
// Ad figures: the Ads API tables for every day from the profile's Ads API start date, MerchantSpring's ad columns before it.
'use strict';
const { buildSections } = require('./sections');

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const C_MAIN = '#404935', C_SUB = '#a7ab90';

const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const monthOf = (iso) => iso.slice(0, 7);
const addMonths = (ym, n) => { const d = new Date(ym + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 7); };
const lastDay = (ym) => addDays(addMonths(ym, 1) + '-01', -1);
const mShort = (ym) => MON[+ym.slice(5) - 1];
const mLabel = (ym) => MONTH_LONG[+ym.slice(5) - 1] + ' ' + ym.slice(0, 4);
const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v));

function fmt(symbol) {
  const money = (n) => symbol + Math.round(n).toLocaleString('en-GB');
  const money2 = (n) => symbol + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = (n) => (Number.isFinite(n) ? (n * 100).toFixed(1) + '%' : '—');
  const x = (n) => (Number.isFinite(n) ? n.toFixed(2) + '×' : '—');
  return { money, money2, pct, x };
}

// One row per day: revenue and orders from account_sales_daily; ad spend/sales from the Ads API rows when the day is
// covered, otherwise from account_sales_daily's MerchantSpring ad columns.
function mergeDays(days, ads, adsStart) {
  const byDate = new Map();
  for (const a of ads) {
    const cur = byDate.get(a.date) || { spend: 0, sales: 0, types: {} };
    cur.spend += num(a.spend); cur.sales += num(a.sales);
    const t = cur.types[a.ad_type] || (cur.types[a.ad_type] = { spend: 0, sales: 0 });
    t.spend += num(a.spend); t.sales += num(a.sales);
    byDate.set(a.date, cur);
  }
  return days.map((d) => {
    const api = adsStart && d.date >= adsStart;
    const a = byDate.get(d.date);
    return {
      date: d.date, rev: num(d.sales), orders: num(d.orders), units: num(d.units),
      adSpend: api ? (a ? a.spend : 0) : num(d.ms_ad_spend), adSales: api ? (a ? a.sales : 0) : num(d.ms_ad_sales),
      types: api && a ? a.types : null, apiAds: !!api,
    };
  }).sort((p, q) => p.date.localeCompare(q.date));
}

function sum(rows, from, to) {
  const s = { rev: 0, orders: 0, units: 0, adSpend: 0, adSales: 0, days: 0, apiDays: 0, types: {} };
  for (const r of rows) {
    if (r.date < from || r.date > to) continue;
    s.rev += r.rev; s.orders += r.orders; s.units += r.units; s.adSpend += r.adSpend; s.adSales += r.adSales; s.days++;
    if (r.apiAds) s.apiDays++;
    if (r.types) for (const [k, v] of Object.entries(r.types)) { const t = s.types[k] || (s.types[k] = { spend: 0, sales: 0 }); t.spend += v.spend; t.sales += v.sales; }
  }
  return s;
}

const months = (fromYm, toYm) => { const out = []; for (let m = fromYm; m <= toYm; m = addMonths(m, 1)) out.push(m); return out; };

function niceMax(v) {
  const steps = [500, 1000, 2000, 4000, 5000, 8000, 10000, 15000, 20000, 40000, 50000, 80000, 100000, 200000, 500000];
  return steps.find((s) => s >= v) || Math.ceil(v / 100000) * 100000;
}
function ticks(max, symbol) {
  return [1, 0.75, 0.5, 0.25, 0].map((f) => { const v = max * f; return v === 0 ? symbol + '0' : v >= 1000 ? symbol + (v / 1000).toString().replace(/\.0+$/, '') + 'k' : symbol + Math.round(v); });
}

function trendChart(rows, ymList, symbol, highlightLast) {
  const rev = ymList.map((m) => Math.round(sum(rows, m + '-01', lastDay(m)).rev));
  const spend = ymList.map((m) => Math.round(sum(rows, m + '-01', lastDay(m)).adSpend));
  const max = niceMax(Math.max(1, ...rev, ...spend));
  return {
    max, yTicks: ticks(max, symbol), xLabels: ymList.map(mShort), ...(highlightLast ? { xHighlight: C_MAIN } : {}),
    series: [{ color: C_MAIN, values: rev, main: true, area: true }, { color: C_SUB, values: spend, dash: true }],
    legend: [{ name: 'Revenue', color: C_MAIN }, { name: 'Ad Spend', color: C_SUB }],
  };
}
function breakChart(rows, ymList, symbol) {
  const ad = ymList.map((m) => Math.round(sum(rows, m + '-01', lastDay(m)).adSales));
  const org = ymList.map((m, i) => Math.max(0, Math.round(sum(rows, m + '-01', lastDay(m)).rev) - ad[i]));
  const max = niceMax(Math.max(1, ...ad.map((a, i) => Math.max(a, org[i]))));
  return {
    max, yTicks: ticks(max, symbol), xLabels: ymList.map(mShort),
    series: [{ color: C_MAIN, values: ad }, { color: C_SUB, values: org }],
    legend: [{ name: 'Ad sales', color: C_MAIN }, { name: 'Organic', color: C_SUB }],
  };
}
function campaignMix(s, F, coveredFully) {
  if (!coveredFully) return null; // MerchantSpring days have no ad-type split: keep the baked pie
  const names = { SP: 'Sponsored Products', SB: 'Sponsored Brands', SD: 'Sponsored Display' };
  const colors = { SP: C_MAIN, SB: '#9caf78', SD: '#e8a87c' };
  const totalSales = Object.values(s.types).reduce((t, v) => t + v.sales, 0);
  const totalSpend = Object.values(s.types).reduce((t, v) => t + v.spend, 0);
  const base = totalSales > 0 ? totalSales : totalSpend;
  if (!base) return null;
  return {
    slices: ['SP', 'SB', 'SD'].filter((k) => s.types[k] && (s.types[k].spend || s.types[k].sales)).map((k) => ({
      name: names[k], color: colors[k], pct: Math.round(((totalSales > 0 ? s.types[k].sales : s.types[k].spend) / base) * 1000) / 10,
      sales: F.money(s.types[k].sales), acos: s.types[k].sales > 0 ? F.pct(s.types[k].spend / s.types[k].sales) : 'n/a',
    })),
  };
}

const chg = (cur, prev) => (prev > 0 ? (cur - prev) / prev : null);
const arrow = (d) => (d >= 0 ? '▲' : '▼');

// The overlay for one period: the same field names as the hand-baked dateRanges entry.
function periodFields(key, rows, cfg, existing, win, prevWin, adsStart) {
  const F = fmt(cfg.symbol);
  const s = sum(rows, win.from, win.to);
  const p = prevWin ? sum(rows, prevWin.from, prevWin.to) : null;
  const tacos = s.rev > 0 ? s.adSpend / s.rev : NaN;
  const roas = s.adSpend > 0 ? s.adSales / s.adSpend : NaN;
  const acos = s.adSales > 0 ? s.adSpend / s.adSales : NaN;
  const asp = s.units > 0 ? s.rev / s.units : NaN;
  const ex = existing || {};
  const target = ex.tacosS || 'Target —';
  const o = { label: win.label, shortLabel: win.short, dataTo: win.to };
  const isTotal = key === '3m' || key === '12m' || key === '6m';
  const span = key === '3m' ? '3-month' : key === '12m' ? '12-month' : 'since-launch';
  const ymList = months(monthOf(win.from), monthOf(win.to));

  o.rev = F.money(s.rev);
  if (isTotal) {
    Object.assign(o, { revD: span + ' total', revC: 'df' });
    const per = ymList.map((m) => ({ m, v: sum(rows, m + '-01', lastDay(m)).rev }));
    o.revS = key === '3m' ? per.map((x) => mShort(x.m) + ' ' + F.money(x.v)).join(' · ')
      : (() => { const pk = per.reduce((a, b) => (b.v > a.v ? b : a), per[0]); return 'peak ' + mShort(pk.m) + ' ' + pk.m.slice(2, 4) + ' ' + F.money(pk.v); })();
  } else {
    const d = chg(s.rev, p.rev);
    o.revD = d === null ? 'no comparison' : arrow(d) + ' ' + Math.abs(d * 100).toFixed(1) + '% vs ' + prevWin.short;
    o.revC = d === null ? 'df' : d >= 0 ? 'du' : 'dd';
    o.revS = 'vs ' + F.money(p.rev) + ' ' + prevWin.short;
  }

  o.adSales = F.money(s.adSales);
  o.adSalesD = isTotal ? span + ' total' : (s.rev > 0 ? F.pct(s.adSales / s.rev) + ' of revenue' : '—');
  o.adSalesC = 'df';
  o.adSalesS = isTotal ? (s.rev > 0 ? F.pct(s.adSales / s.rev) + ' of revenue' : '—') : F.money(s.adSpend) + ' spend → ' + F.money(s.adSales) + ' ad sales';

  o.spend = F.money(s.adSpend);
  if (isTotal) {
    const spendS = key === '3m' ? ymList.map((m) => mShort(m) + ' ' + F.money(sum(rows, m + '-01', lastDay(m)).adSpend)).join(' · ') : 'over ' + ymList.length + ' months';
    Object.assign(o, { spendD: span + ' total', spendC: 'df', spendS });
  } else {
    const d = chg(s.adSpend, p.adSpend);
    Object.assign(o, { spendD: d === null ? 'no comparison' : arrow(d) + ' ' + Math.abs(d * 100).toFixed(1) + '% vs ' + prevWin.short + ' (' + F.money(p.adSpend) + ')', spendC: d === null ? 'df' : d > 0 ? 'dd' : 'du', spendS: 'vs ' + F.money(p.adSpend) + ' ' + prevWin.short });
  }

  o.tacos = F.pct(tacos);
  if (isTotal) Object.assign(o, { tacosD: span + ' blended', tacosC: 'dd' });
  else {
    const pt = p.rev > 0 ? p.adSpend / p.rev : NaN;
    const dpp = Number.isFinite(tacos) && Number.isFinite(pt) ? (tacos - pt) * 100 : null;
    Object.assign(o, { tacosD: dpp === null ? 'no comparison' : arrow(dpp) + ' ' + Math.abs(dpp).toFixed(1) + 'pp vs ' + prevWin.short + ' (' + F.pct(pt) + ')', tacosC: dpp === null ? 'df' : dpp > 0 ? 'dd' : 'du' });
  }
  o.tacosS = target;

  o.roas = F.x(roas);
  if (isTotal) Object.assign(o, { roasD: span + ' avg', roasC: 'df' });
  else {
    const pr = p.adSpend > 0 ? p.adSales / p.adSpend : NaN;
    Object.assign(o, { roasD: Number.isFinite(pr) ? arrow(roas - pr) + ' from ' + F.x(pr) + ' ' + prevWin.short : 'no comparison', roasC: Number.isFinite(pr) && Number.isFinite(roas) ? (roas >= pr ? 'du' : 'dd') : 'df' });
  }
  o.roasS = s.units + ' units' + (Number.isFinite(asp) ? ' · ASP ' + F.money2(asp) : '');

  Object.assign(o, { tacosAd: o.tacos, tacosAdD: o.tacosD, tacosAdC: o.tacosC, tacosAdS: o.tacosS });
  Object.assign(o, { roasAd: o.roas, roasAdD: 'ACOS ' + F.pct(acos), roasAdC: o.roasC, roasAdS: F.money(s.rev) + ' revenue' });
  if (key === 'mtd') {
    // Amazon credits ad sales up to 14 days after the click, so recent days read low until they settle.
    const note = 'ad sales still settling (up to 14 days)';
    o.adSalesS += ' · ' + note; o.roasS = note; o.roasAdS = note;
  }
  Object.assign(o, { aov: Number.isFinite(asp) ? F.money2(asp) : '—', aovD: isTotal ? span + ' ASP' : 'ASP (per unit)', aovC: 'df', aovS: s.units + ' units' + (isTotal ? ' total' : '') });

  // Market rows: keep the label, flag, budget and class cells; replace spend, revenue and TACoS.
  if (Array.isArray(ex.mktRows)) o.mktRows = ex.mktRows.map((r) => { const n = r.slice(); n[3] = F.money(s.adSpend); n[6] = F.money(s.rev); n[8] = F.pct(tacos); return n; });

  // Charts: trailing 6 months (12 for the 12-month view), ending with the period's last month.
  const trendMonths = key === '12m' || key === '6m' ? ymList : months(addMonths(monthOf(win.to), -5), monthOf(win.to));
  o.revChart = trendChart(rows, trendMonths, cfg.symbol, true);
  o.adChart = o.revChart;
  o.revBreakChart = breakChart(rows, ymList, cfg.symbol);
  const mix = campaignMix(s, F, adsStart && win.from >= adsStart);
  if (mix) o.campaignMix = mix;
  return o;
}

// Period windows from the last day the warehouse holds (asOf). "Last Month" = the calendar month before the month
// that follows asOf; Month to date = 1st of the current month to asOf (falls back to Last Month on the 1st).
function windows(asOf, cfg) {
  const today = addDays(asOf, 1);
  const cur = monthOf(today), last = addMonths(cur, -1), prev = addMonths(cur, -2);
  const W = {
    may: { from: last + '-01', to: lastDay(last), label: mLabel(last), short: mShort(last) + ' ' + last.slice(0, 4) },
    '3m': { from: addMonths(last, -2) + '-01', to: lastDay(last), label: mShort(addMonths(last, -2)) + '–' + mShort(last) + ' ' + last.slice(0, 4), short: mShort(addMonths(last, -2)) + '–' + mShort(last) + ' ' + last.slice(0, 4) },
    '12m': { from: addMonths(last, -11) + '-01', to: lastDay(last), label: mShort(addMonths(last, -11)) + ' ' + addMonths(last, -11).slice(0, 4) + ' – ' + mShort(last) + ' ' + last.slice(0, 4), short: 'Last 12 Months' },
  };
  if (cfg && cfg.launch) { // "Since Launch" (6m key): launch month to Last Month
    const L = cfg.launch;
    W['6m'] = { from: L + '-01', to: lastDay(last), label: 'Since Launch · ' + mShort(L) + '–' + mShort(last) + ' ' + last.slice(0, 4), short: 'Since Launch' };
  }
  const P = { may: { from: prev + '-01', to: lastDay(prev), short: mShort(prev) } };
  if (asOf >= cur + '-01') {
    const dayN = +asOf.slice(8);
    W.mtd = { from: cur + '-01', to: asOf, label: 'Month to date (1–' + dayN + ' ' + mShort(cur) + ' ' + cur.slice(0, 4) + ')', short: '1–' + dayN + ' ' + mShort(cur) };
    const pEnd = addDays(last + '-01', Math.min(dayN, +lastDay(last).slice(8)) - 1);
    P.mtd = { from: last + '-01', to: pEnd, short: '1–' + +pEnd.slice(8) + ' ' + mShort(last) };
  } else { W.mtd = { ...W.may, label: 'Month to date (no days yet; showing ' + W.may.label + ')' }; P.mtd = P.may; }
  return { W, P };
}

function buildOverlay({ cfg, existing, days, ads, adsStart, asinDaily, asinMonthly, asinAds, campaigns, names }) {
  if (!days.length) throw new Error('No account_sales_daily rows: nothing to build');
  const rows = mergeDays(days, ads, adsStart);
  const asOf = rows[rows.length - 1].date;
  const { W, P } = windows(asOf, cfg);
  const out = { asOf, adsStart: adsStart || null, dateRanges: {} };
  for (const key of cfg.periods) {
    if (!W[key]) continue;
    const ex = (existing && existing.dateRanges && (existing.dateRanges[key] || existing.dateRanges.may)) || {};
    out.dateRanges[key] = periodFields(key, rows, cfg, ex, W[key], P[key] || null, adsStart);
  }
  if (asinDaily) { // period-keyed Products and campaigns sections (sections.js)
    const productsTo = asinDaily.reduce((m, r) => (r.date > m ? r.date : m), '');
    const ctx = { symbol: cfg.symbol, days, adsStart, asinDaily, asinMonthly: asinMonthly || [], asinAds: asinAds || [], campaigns: campaigns || [], names: names || {}, productsTo: productsTo || null };
    const wins = Object.fromEntries(cfg.periods.filter((k) => W[k]).map((k) => [k, W[k]]));
    out.sections = buildSections({ ctx, windows: wins, prevMay: P.may, existing });
    out.productsTo = productsTo || null;
  }
  return out;
}

module.exports = { buildOverlay, mergeDays, sum, windows, niceMax, ticks };
