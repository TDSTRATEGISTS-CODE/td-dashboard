// Period-keyed dashboard sections from the TDS Data Warehouse, so the Products page and the campaigns list follow the
// date-range selector (Month to date included): sections.products.kpisByPeriod / tableByPeriod / groupsByPeriod /
// prevMonth and sections.advertising.campaignsByPeriod. Pure: unit-tested with made-up data.
'use strict';

const num = (v) => (v === null || v === undefined || v === '' ? 0 : Number(v));
const addDays = (iso, n) => { const d = new Date(iso + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const monthOf = (iso) => iso.slice(0, 7);
const addMonths = (ym, n) => { const d = new Date(ym + '-01T00:00:00Z'); d.setUTCMonth(d.getUTCMonth() + n); return d.toISOString().slice(0, 7); };
const lastDay = (ym) => addDays(addMonths(ym, 1) + '-01', -1);

function F(symbol) {
  const money = (n) => symbol + Math.round(n).toLocaleString('en-GB');
  const money2 = (n) => symbol + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = (n) => (Number.isFinite(n) ? (n * 100).toFixed(1) + '%' : '—');
  return { money, money2, pct };
}

// Product sales for a window: closed calendar months fully inside it come from the month-close table (corrected for
// late orders and refunds); everything else (open month, part months) from the daily product table.
function asinSales(win, daily, monthly) {
  const byMonth = new Map();
  for (const r of monthly) { if (!byMonth.has(r.ym)) byMonth.set(r.ym, []); byMonth.get(r.ym).push(r); }
  const out = new Map();
  const add = (asin, s, u) => { const c = out.get(asin) || { asin, sales: 0, units: 0 }; c.sales += num(s); c.units += num(u); out.set(asin, c); };
  for (let m = monthOf(win.from); m <= monthOf(win.to); m = addMonths(m, 1)) {
    const full = win.from <= m + '-01' && win.to >= lastDay(m);
    if (full && byMonth.has(m)) { for (const r of byMonth.get(m)) add(r.asin, r.sales, r.units); continue; }
    for (const r of daily) if (r.date >= win.from && r.date <= win.to && monthOf(r.date) === m) add(r.asin, r.sales, r.units);
  }
  return [...out.values()].filter((x) => x.sales > 0 || x.units > 0).sort((a, b) => b.sales - a.sales);
}

const tacosCls = (t) => (!Number.isFinite(t) ? 'bb' : t <= 0.15 ? 'bg' : t <= 0.3 ? 'ba' : 'br');

function groupRows(win, ctx, covered, bakedRows) {
  const { money, pct } = F(ctx.symbol);
  const rows = asinSales(win, ctx.asinDaily, ctx.asinMonthly);
  const total = rows.reduce((t, r) => t + r.sales, 0);
  const spendBy = new Map();
  if (covered) for (const r of ctx.asinAds) if (r.date >= win.from && r.date <= win.to) spendBy.set(r.asin, (spendBy.get(r.asin) || 0) + num(r.spend));
  // Per-product conversion and stock-out rate are not in the warehouse: keep the monthly rebake's values (same product name).
  const baked = Object.fromEntries((bakedRows || []).map((b) => [String(b.name).toLowerCase(), b]));
  return rows.map((r) => {
    const sp = covered ? spendBy.get(r.asin) || 0 : null;
    const b = baked[String(ctx.names[r.asin] || r.asin).toLowerCase()] || {};
    const t = sp !== null && r.sales > 0 ? sp / r.sales : NaN;
    return {
      name: ctx.names[r.asin] || r.asin, sales: money(r.sales), units: r.units,
      pct: total > 0 ? Math.round((r.sales / total) * 100) + '%' : '—',
      adSpend: sp === null ? '—' : money(sp), tacos: sp === null ? '—' : pct(t), tacosCls: sp === null ? 'bb' : tacosCls(t),
      cvr: b.cvr || '—', cvrCls: b.cvr ? b.cvrCls : 'bb', oosRate: b.oosRate || '—', oosCls: b.oosRate ? b.oosCls : 'bb',
    };
  });
}

function marketRow(win, ctx, existingRow) {
  const { money, money2, pct } = F(ctx.symbol);
  let rev = 0, units = 0, orders = 0, sessions = 0, haveSessions = false;
  for (const d of ctx.days) {
    if (d.date < win.from || d.date > win.to) continue;
    rev += num(d.sales); units += num(d.units); orders += num(d.orders);
    if (d.sessions !== null && d.sessions !== undefined) { sessions += num(d.sessions); haveSessions = true; }
  }
  const cvr = haveSessions && sessions > 0 ? units / sessions : NaN; // unit session conversion, as the hand-baked files
  return {
    ...(existingRow || {}), revenue: money(rev), units: String(units), orders: String(orders),
    cvr: pct(cvr), cvrCls: !Number.isFinite(cvr) ? 'bb' : cvr >= 0.1 ? 'bg' : cvr >= 0.05 ? 'ba' : 'br',
    aov: units > 0 ? money2(rev / units) : '—',
  };
}

function productKpis(win, ctx, groups, row) {
  const top = groups[0];
  const listed = Object.keys(ctx.names).length;
  return [
    { bar: '#404935', lbl: 'Active SKUs', val: String(groups.length), dCls: 'df', d: 'sold in ' + win.short, s: listed ? groups.length + ' of ' + listed + ' listed products sold' : '' },
    { bar: 'var(--green)', lbl: 'Top Product Rev.', val: top ? top.sales : '—', dCls: 'df', d: top ? top.name : 'no sales', s: top ? top.pct + ' of ' + win.short + ' sales' : '' },
    { bar: 'var(--blue)', lbl: 'Units', val: row.units, dCls: 'df', d: win.short, s: row.orders + ' orders' },
    { bar: 'var(--amber)', lbl: 'ASP', val: row.aov, dCls: 'df', d: 'per unit', s: 'revenue ÷ units' },
  ];
}

function campaignRows(win, ctx) {
  const { money, money2, pct } = F(ctx.symbol);
  const by = new Map();
  for (const r of ctx.campaigns) {
    if (r.date < win.from || r.date > win.to) continue;
    const c = by.get(r.campaign_id) || { name: r.name, type: r.ad_type, status: r.status, lastDate: '', spend: 0, sales: 0, clicks: 0 };
    c.spend += num(r.spend); c.sales += num(r.sales); c.clicks += num(r.clicks);
    if (r.date >= c.lastDate) { c.lastDate = r.date; c.status = r.status || c.status; c.name = r.name || c.name; }
    by.set(r.campaign_id, c);
  }
  const types = { SP: 'Sponsored Products', SB: 'Sponsored Brands', SD: 'Sponsored Display' };
  return [...by.values()].filter((c) => c.spend > 0).sort((a, b) => b.spend - a.spend).map((c) => {
    const acos = c.sales > 0 ? c.spend / c.sales : NaN;
    const st = String(c.status || '').toUpperCase();
    return {
      name: String(c.name || '').replace(/\s*-\s*XCTD\s*$/i, ''), type: types[c.type] || c.type,
      spend: money(c.spend), sales: money(c.sales), acos: pct(acos), acosCls: !Number.isFinite(acos) ? 'bb' : acos <= 0.3 ? 'bg' : acos <= 0.6 ? 'ba' : 'br',
      roas: c.spend > 0 ? (c.sales / c.spend).toFixed(2) + '×' : '—', cpc: c.clicks > 0 ? money2(c.spend / c.clicks) : '—',
      status: st === 'ENABLED' ? 'Active' : st === 'PAUSED' ? 'Paused' : st ? st.charAt(0) + st.slice(1).toLowerCase() : '—',
      statusCls: st === 'ENABLED' ? 'bg' : st === 'PAUSED' ? 'ba' : 'bb',
    };
  });
}

// windows: { key: {from, to, short} } from build.windows(); prevMay: the month before "Last Month" (for ▲/▼ arrows).
function buildSections({ ctx, windows, prevMay, existing }) {
  const S = (existing && existing.sections) || {};
  const exRow = ((S.products && S.products.tableByPeriod && S.products.tableByPeriod.may) || (S.products && S.products.table) || [])[0];
  const products = { kpisByPeriod: {}, tableByPeriod: {}, groupsByPeriod: {} };
  const advertising = { campaignsByPeriod: {} };
  for (const [key, win0] of Object.entries(windows)) {
    // Product rows lag a day behind account totals (read for D-2): never ask for days not loaded yet.
    const win = { ...win0, to: ctx.productsTo && win0.to > ctx.productsTo ? ctx.productsTo : win0.to };
    const covered = !!ctx.adsStart && win0.from >= ctx.adsStart;
    const bakedG = S.products && S.products.groupsByPeriod && S.products.groupsByPeriod[key];
    const groups = groupRows(win, ctx, covered, bakedG && bakedG.all);
    const row = marketRow(win0, ctx, exRow);
    products.groupsByPeriod[key] = { all: groups };
    products.tableByPeriod[key] = [row];
    products.kpisByPeriod[key] = { all: productKpis(win, ctx, groups, row) };
    if (covered) advertising.campaignsByPeriod[key] = campaignRows(win0, ctx); // earlier windows keep the baked list
  }
  if (prevMay) {
    const covered = !!ctx.adsStart && prevMay.from >= ctx.adsStart;
    const slim = (r) => Object.fromEntries(Object.entries(r).filter(([, v]) => typeof v !== 'object'));
    products.prevMonth = { table: [slim(marketRow(prevMay, ctx, exRow))], groups: { all: groupRows(prevMay, ctx, covered).map(slim) } };
  }
  return { products, advertising };
}

module.exports = { buildSections, asinSales, campaignRows, marketRow };
