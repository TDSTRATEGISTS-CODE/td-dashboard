// Change tools: update_bids, add_negatives, transfer_targets, update_budgets, update_bid_strategy.
//
// Every call is a DRY RUN unless apply=true. A dry run reads current values from Amazon, works out
// old → new for each item, applies the guards and returns a plan code (plan:<hash>) for that exact batch.
// Apply only goes ahead when ALL of these hold, otherwise nothing is sent to Amazon:
//   - the Notion Ads Approval Queue row is Approved, approved recently, for the same client, market and
//     lever, and has the plan code written on it (so the approval covers exactly this batch);
//   - no item breaks a guard (caps, min/max, duplicates, archived, wrong campaign);
//   - live writes are switched on (WRITES_ENABLED) and the profile is released from Perpetua;
//   - the pending change was logged to BigQuery change_log first.
// After applying, every item is re-read from Amazon and the verified value is logged.
import { createHash, randomUUID } from 'node:crypto';
import { GUARDS, PROFILE_ALLOWLIST } from './config.js';
import { spList, adsWrite, SP_LISTS } from './ads.js';
import { getQueueRow } from './notion.js';
import { logChanges } from './bq.js';

let deps = { spList, adsWrite, getQueueRow, logChanges };
export function setChangeDepsForTests(d) { deps = { ...deps, ...d }; }

export const TOOL_LEVERS = {
  update_bids: ['Fixed bid', 'Target ACoS', 'Other'],
  add_negatives: ['Negative', 'Other'],
  transfer_targets: ['Build', 'Negative', 'Other'],
  update_budgets: ['Budget', 'Other'],
  update_bid_strategy: ['Fixed bid', 'Target ACoS', 'Other'],
};

const ALL_STATES = { stateFilter: { include: ['ENABLED', 'PAUSED', 'ARCHIVED'] } };
const r2 = (x) => (x === null || x === undefined ? null : Math.round(Number(x) * 100) / 100);
const pct = (from, to) => (from ? Math.round(((to - from) / from) * 1000) / 10 : null);
const lc = (s) => String(s || '').trim().toLowerCase();

function canon(v) {
  if (Array.isArray(v)) return `[${v.map(canon).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${canon(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v);
}

export function planHash(tool, profileId, items) {
  return createHash('sha256').update(canon({ tool, profileId, items })).digest('hex').slice(0, 12);
}

async function list(kind, profileId, filter) {
  return (await deps.spList(kind, profileId, { ...ALL_STATES, ...filter }, 5000)).items;
}

// Amazon v3 write responses: { <key>: { success: [{ index, ... }], error: [{ index, errors }] } }
function writeResult(res) {
  const inner = Object.values(res || {}).find((v) => v && (v.success || v.error)) || {};
  return {
    ok: new Set((inner.success || []).map((s) => s.index)),
    created: Object.fromEntries((inner.success || []).map((s) => [s.index, s])),
    errors: Object.fromEntries((inner.error || []).map((e) => [e.index, (e.errors || []).map((x) => x.errorValue ? JSON.stringify(x.errorValue) : x.errorType || 'error').join('; ')])),
  };
}

// ---------- planners: each returns { items, writes, verify } ----------
// items:  [{ entity_type, entity_id, field, old, new, blockers: [] }]
// writes: [{ method, path, mediaType, key, rows, itemIdx: [item indexes] }]
// verify: async () => [verified value per item]

async function planBids(profileId, { changes }) {
  const kwIds = changes.filter((c) => c.entity === 'keyword').map((c) => c.id);
  const tgIds = changes.filter((c) => c.entity === 'target').map((c) => c.id);
  const read = async () => ({
    kw: kwIds.length ? await list('keywords', profileId, { keywordIdFilter: { include: kwIds } }) : [],
    tg: tgIds.length ? await list('targets', profileId, { targetIdFilter: { include: tgIds } }) : [],
  });
  const { kw, tg } = await read();
  const agIds = [...new Set([...kw, ...tg].filter((x) => x.bid === undefined).map((x) => x.adGroupId))];
  const ags = agIds.length ? await list('adGroups', profileId, { adGroupIdFilter: { include: agIds } }) : [];

  const items = changes.map((c) => {
    const found = c.entity === 'keyword' ? kw.find((k) => k.keywordId === c.id) : tg.find((t) => t.targetId === c.id);
    const blockers = [];
    let old = found?.bid ?? ags.find((a) => a.adGroupId === found?.adGroupId)?.defaultBid ?? null;
    old = r2(old);
    const next = r2(c.new_bid);
    if (!found) blockers.push(`${c.entity} ${c.id} not found in this profile`);
    if (found?.state === 'ARCHIVED') blockers.push('archived');
    if (next < GUARDS.minBid) blockers.push(`below minimum bid ${GUARDS.minBid}`);
    if (next > GUARDS.maxBid) blockers.push(`above maximum bid ${GUARDS.maxBid}`);
    if (found && old === null) blockers.push('no current bid to compare against');
    const change = pct(old, next);
    if (change !== null && Math.abs(change) > GUARDS.maxBidChangePct) blockers.push(`change ${change}% exceeds ±${GUARDS.maxBidChangePct}% cap`);
    if (old === next) blockers.push('no change');
    const label = c.entity === 'keyword' ? `"${found?.keywordText ?? '?'}" (${found?.matchType ?? '?'})` : JSON.stringify(found?.expression ?? '?');
    return { entity_type: c.entity, entity_id: c.id, field: 'bid', old, new: next, change_pct: change, label, campaign_id: found?.campaignId, blockers };
  });

  const idx = (e) => changes.map((c, i) => (c.entity === e ? i : -1)).filter((i) => i >= 0);
  const writes = [
    { method: 'PUT', path: '/sp/keywords', mediaType: SP_LISTS.keywords.mediaType, key: 'keywords', itemIdx: idx('keyword'),
      rows: idx('keyword').map((i) => ({ keywordId: changes[i].id, bid: r2(changes[i].new_bid) })) },
    { method: 'PUT', path: '/sp/targets', mediaType: SP_LISTS.targets.mediaType, key: 'targetingClauses', itemIdx: idx('target'),
      rows: idx('target').map((i) => ({ targetId: changes[i].id, bid: r2(changes[i].new_bid) })) },
  ].filter((w) => w.rows.length);

  const verify = async () => {
    const now = await read();
    return changes.map((c) => r2((c.entity === 'keyword' ? now.kw.find((k) => k.keywordId === c.id) : now.tg.find((t) => t.targetId === c.id))?.bid));
  };
  return { items, writes, verify };
}

const NEG_MATCH = ['NEGATIVE_EXACT', 'NEGATIVE_PHRASE'];
const ASIN = /^B0[A-Z0-9]{8}$/;

async function readStructure(profileId, campaignIds, adGroupIds) {
  const camps = campaignIds.length ? await list('campaigns', profileId, { campaignIdFilter: { include: campaignIds } }) : [];
  const ags = adGroupIds.length ? await list('adGroups', profileId, { adGroupIdFilter: { include: adGroupIds } }) : [];
  return { camps, ags };
}

function checkPlacement(blockers, { camps, ags }, campaignId, adGroupId) {
  const c = camps.find((x) => x.campaignId === campaignId);
  if (!c) { blockers.push(`campaign ${campaignId} not found in this profile`); return null; }
  if (c.state === 'ARCHIVED') blockers.push(`campaign ${c.name} is archived`);
  if (adGroupId) {
    const g = ags.find((x) => x.adGroupId === adGroupId);
    if (!g) blockers.push(`ad group ${adGroupId} not found`);
    else if (g.campaignId !== campaignId) blockers.push(`ad group ${adGroupId} is not in campaign ${campaignId}`);
    else if (g.state === 'ARCHIVED') blockers.push(`ad group ${g.name} is archived`);
  }
  return c;
}

// Negative definitions, reused by add_negatives and the "negate in source" half of transfer_targets.
function negativeSpec(n) {
  if (n.type === 'keyword') {
    const level = n.level === 'campaign' ? 'campaignNegativeKeywords' : 'negativeKeywords';
    const row = { campaignId: n.campaign_id, keywordText: n.keyword_text, matchType: n.match_type, state: 'ENABLED' };
    if (n.level !== 'campaign') row.adGroupId = n.ad_group_id;
    return { kind: level, key: level, path: `/sp/${level}`, row, label: `${n.match_type} "${n.keyword_text}"` };
  }
  return {
    kind: 'negativeTargets', key: 'negativeTargetingClauses', path: '/sp/negativeTargets',
    row: { campaignId: n.campaign_id, adGroupId: n.ad_group_id, expression: [{ type: 'ASIN_SAME_AS', value: n.asin }], state: 'ENABLED' },
    label: `negative ASIN ${n.asin}`,
  };
}

function negMatches(spec, existing) {
  return existing.some((e) => e.state !== 'ARCHIVED' && e.campaignId === spec.row.campaignId
    && (spec.row.adGroupId === undefined || e.adGroupId === spec.row.adGroupId)
    && (spec.kind === 'negativeTargets'
      ? (e.expression || []).some((x) => x.type === 'ASIN_SAME_AS' && lc(x.value) === lc(spec.row.expression[0].value))
      : lc(e.keywordText) === lc(spec.row.keywordText) && e.matchType === spec.row.matchType));
}

function validateNegative(n, blockers) {
  if (n.type === 'keyword') {
    if (!n.keyword_text?.trim()) blockers.push('keyword_text is required');
    if (!NEG_MATCH.includes(n.match_type)) blockers.push(`match_type must be ${NEG_MATCH.join(' or ')}`);
  } else {
    if (!ASIN.test(String(n.asin || '').toUpperCase())) blockers.push('asin must be a valid ASIN (B0…)');
    if (n.level === 'campaign') blockers.push('campaign-level negative products are not supported yet; use ad group level');
  }
  if (n.level !== 'campaign' && !n.ad_group_id) blockers.push('ad_group_id is required for ad group level');
}

async function readNegatives(profileId, campaignIds) {
  const f = { campaignIdFilter: { include: campaignIds } };
  if (!campaignIds.length) return { negativeKeywords: [], campaignNegativeKeywords: [], negativeTargets: [] };
  const [a, b, c] = await Promise.all(['negativeKeywords', 'campaignNegativeKeywords', 'negativeTargets'].map((k) => list(k, profileId, f)));
  return { negativeKeywords: a, campaignNegativeKeywords: b, negativeTargets: c };
}

function groupWrites(specs, method = 'POST') {
  const byPath = new Map();
  specs.forEach((s, i) => {
    if (!s) return;
    const w = byPath.get(s.path) || { method, path: s.path, mediaType: SP_LISTS[s.kind].mediaType, key: s.key, rows: [], itemIdx: [] };
    w.rows.push(s.row); w.itemIdx.push(i); byPath.set(s.path, w);
  });
  return [...byPath.values()];
}

async function planNegatives(profileId, { negatives }) {
  negatives = negatives.map((n) => ({ ...n, asin: n.asin?.toUpperCase(), level: n.level || 'ad_group' }));
  const campaignIds = [...new Set(negatives.map((n) => n.campaign_id))];
  const struct = await readStructure(profileId, campaignIds, [...new Set(negatives.map((n) => n.ad_group_id).filter(Boolean))]);
  const existing = await readNegatives(profileId, campaignIds);
  const specs = negatives.map(negativeSpec);
  const items = negatives.map((n, i) => {
    const blockers = [];
    validateNegative(n, blockers);
    const camp = checkPlacement(blockers, struct, n.campaign_id, n.level === 'campaign' ? null : n.ad_group_id);
    if (!blockers.length && negMatches(specs[i], existing[specs[i].kind])) blockers.push('already exists');
    if (specs.findIndex((s) => canon(s.row) === canon(specs[i].row)) !== i) blockers.push('duplicate in this batch');
    return { entity_type: specs[i].kind, entity_id: n.level === 'campaign' ? n.campaign_id : n.ad_group_id, field: 'create', old: null, new: specs[i].label, label: camp?.name, blockers };
  });
  const verify = async () => {
    const now = await readNegatives(profileId, campaignIds);
    return specs.map((s) => (negMatches(s, now[s.kind]) ? 'present' : 'missing'));
  };
  return { items, writes: groupWrites(specs), verify };
}

const KW_MATCH = ['EXACT', 'PHRASE', 'BROAD'];

async function planTransfers(profileId, { transfers }) {
  transfers = transfers.map((t) => ({ ...t, asin: t.asin?.toUpperCase(), negate_in_source: t.negate_in_source || 'ad_group' }));
  const campaignIds = [...new Set(transfers.flatMap((t) => [t.destination_campaign_id, t.source_campaign_id]))];
  const agIds = [...new Set(transfers.flatMap((t) => [t.destination_ad_group_id, t.source_ad_group_id]))];
  const struct = await readStructure(profileId, campaignIds, agIds);
  const destAgs = [...new Set(transfers.map((t) => t.destination_ad_group_id))];
  const readDest = async () => ({
    kw: await list('keywords', profileId, { adGroupIdFilter: { include: destAgs } }),
    tg: await list('targets', profileId, { adGroupIdFilter: { include: destAgs } }),
  });
  const dest = await readDest();
  const existingNeg = await readNegatives(profileId, [...new Set(transfers.map((t) => t.source_campaign_id))]);

  const createSpec = (t) => (t.type === 'keyword'
    ? { kind: 'keywords', key: 'keywords', path: '/sp/keywords', label: `${t.match_type} "${t.keyword_text}" @ ${r2(t.bid)}`,
      row: { campaignId: t.destination_campaign_id, adGroupId: t.destination_ad_group_id, keywordText: t.keyword_text, matchType: t.match_type, bid: r2(t.bid), state: 'ENABLED' } }
    : { kind: 'targets', key: 'targetingClauses', path: '/sp/targets', label: `ASIN ${t.asin} @ ${r2(t.bid)}`,
      row: { campaignId: t.destination_campaign_id, adGroupId: t.destination_ad_group_id, expression: [{ type: 'ASIN_SAME_AS', value: t.asin }], expressionType: 'MANUAL', bid: r2(t.bid), state: 'ENABLED' } });
  const inDest = (t, now) => (t.type === 'keyword'
    ? now.kw.some((k) => k.adGroupId === t.destination_ad_group_id && lc(k.keywordText) === lc(t.keyword_text) && k.matchType === t.match_type && k.state !== 'ARCHIVED')
    : now.tg.some((g) => g.adGroupId === t.destination_ad_group_id && g.state !== 'ARCHIVED' && (g.expression || []).some((x) => x.type === 'ASIN_SAME_AS' && lc(x.value) === lc(t.asin))));
  const negOf = (t) => ({
    type: t.type, level: t.negate_in_source, campaign_id: t.source_campaign_id,
    ad_group_id: t.negate_in_source === 'campaign' ? undefined : t.source_ad_group_id,
    keyword_text: t.keyword_text, match_type: 'NEGATIVE_EXACT', asin: t.asin,
  });

  const items = []; const specs = [];
  transfers.forEach((t) => {
    const b1 = [];
    if (t.type === 'keyword') {
      if (!t.keyword_text?.trim()) b1.push('keyword_text is required');
      if (!KW_MATCH.includes(t.match_type)) b1.push(`match_type must be ${KW_MATCH.join('/')}`);
    } else if (!ASIN.test(t.asin || '')) b1.push('asin must be a valid ASIN (B0…)');
    if (r2(t.bid) < GUARDS.minBid || r2(t.bid) > GUARDS.maxBid) b1.push(`bid must be between ${GUARDS.minBid} and ${GUARDS.maxBid}`);
    const dc = checkPlacement(b1, struct, t.destination_campaign_id, t.destination_ad_group_id);
    if (dc && dc.targetingType !== 'MANUAL') b1.push(`destination ${dc.name} is not a manual campaign`);
    if (t.destination_ad_group_id === t.source_ad_group_id) b1.push('source and destination are the same ad group');
    if (!b1.length && inDest(t, dest)) b1.push('already a target in the destination');
    const cs = createSpec(t);
    items.push({ entity_type: cs.kind, entity_id: t.destination_ad_group_id, field: 'create', old: null, new: cs.label, label: dc?.name, blockers: b1 });
    specs.push(cs);

    const n = negOf(t); const ns = negativeSpec(n); const b2 = [];
    validateNegative(n, b2);
    const sc = checkPlacement(b2, struct, t.source_campaign_id, n.level === 'campaign' ? null : t.source_ad_group_id);
    const already = !b2.length && negMatches(ns, existingNeg[ns.kind]);
    items.push({ entity_type: ns.kind, entity_id: n.ad_group_id || n.campaign_id, field: 'create', old: null, new: `${ns.label} (source)`, label: sc?.name, blockers: b2,
      ...(already ? { note: 'already negated in source; will be skipped', skip: true } : {}) });
    specs.push(already ? null : ns);
  });
  const verify = async () => {
    const now = await readDest();
    const neg = await readNegatives(profileId, [...new Set(transfers.map((t) => t.source_campaign_id))]);
    return transfers.flatMap((t) => [inDest(t, now) ? 'present' : 'missing', negMatches(negativeSpec(negOf(t)), neg[negativeSpec(negOf(t)).kind]) ? 'present' : 'missing']);
  };
  return { items, writes: groupWrites(specs), verify };
}

async function planBudgets(profileId, { changes }) {
  const ids = changes.map((c) => c.campaign_id);
  const read = () => list('campaigns', profileId, { campaignIdFilter: { include: ids } });
  const camps = await read();
  const items = changes.map((c) => {
    const camp = camps.find((x) => x.campaignId === c.campaign_id);
    const blockers = [];
    const old = r2(camp?.budget?.budget);
    const next = r2(c.new_daily_budget);
    if (!camp) blockers.push(`campaign ${c.campaign_id} not found in this profile`);
    if (camp?.state === 'ARCHIVED') blockers.push('archived');
    if (camp && camp.budget?.budgetType !== 'DAILY') blockers.push(`budget type is ${camp.budget?.budgetType}, only DAILY is supported`);
    if (next <= 0 || next > GUARDS.maxDailyBudget) blockers.push(`daily budget must be above 0 and at most ${GUARDS.maxDailyBudget}`);
    const change = pct(old, next);
    if (change !== null && Math.abs(change) > GUARDS.maxBudgetChangePct) blockers.push(`change ${change}% exceeds ±${GUARDS.maxBudgetChangePct}% cap`);
    if (old === next) blockers.push('no change');
    return { entity_type: 'campaign', entity_id: c.campaign_id, field: 'daily_budget', old, new: next, change_pct: change, label: camp?.name, blockers };
  });
  const writes = [{ method: 'PUT', path: '/sp/campaigns', mediaType: SP_LISTS.campaigns.mediaType, key: 'campaigns',
    itemIdx: changes.map((_, i) => i), rows: changes.map((c) => ({ campaignId: c.campaign_id, budget: { budget: r2(c.new_daily_budget), budgetType: 'DAILY' } })) }];
  const verify = async () => { const now = await read(); return changes.map((c) => r2(now.find((x) => x.campaignId === c.campaign_id)?.budget?.budget)); };
  return { items, writes, verify };
}

const STRATEGIES = ['LEGACY_FOR_SALES', 'AUTO_FOR_SALES', 'MANUAL'];
const PLACEMENTS = { top_of_search_pct: 'PLACEMENT_TOP', rest_of_search_pct: 'PLACEMENT_REST_OF_SEARCH', product_page_pct: 'PLACEMENT_PRODUCT_PAGE' };

async function planBidStrategy(profileId, { changes }) {
  const ids = changes.map((c) => c.campaign_id);
  const read = () => list('campaigns', profileId, { campaignIdFilter: { include: ids } });
  const camps = await read();
  const items = []; const rows = []; const itemIdx = []; const expect = [];
  changes.forEach((c) => {
    const camp = camps.find((x) => x.campaignId === c.campaign_id);
    const base = [];
    if (!camp) base.push(`campaign ${c.campaign_id} not found in this profile`);
    if (camp?.state === 'ARCHIVED') base.push('archived');
    const db = camp?.dynamicBidding || { strategy: null, placementBidding: [] };
    const placement = Object.fromEntries((db.placementBidding || []).map((p) => [p.placement, p.percentage]));
    const nextStrategy = c.strategy ?? db.strategy;
    const nextPlacement = { ...placement };
    const myItems = [];
    if (c.strategy !== undefined) {
      const b = [...base];
      if (!STRATEGIES.includes(c.strategy)) b.push(`strategy must be ${STRATEGIES.join('/')}`);
      if (c.strategy === db.strategy) b.push('no change');
      myItems.push({ entity_type: 'campaign', entity_id: c.campaign_id, field: 'bid_strategy', old: db.strategy, new: c.strategy, label: camp?.name, blockers: b });
      expect.push((cmp) => cmp?.dynamicBidding?.strategy);
    }
    for (const [arg, name] of Object.entries(PLACEMENTS)) {
      if (c[arg] === undefined) continue;
      const b = [...base];
      if (c[arg] < 0 || c[arg] > GUARDS.maxPlacementPct) b.push(`placement % must be 0–${GUARDS.maxPlacementPct}`);
      if ((placement[name] ?? 0) === c[arg]) b.push('no change');
      nextPlacement[name] = c[arg];
      myItems.push({ entity_type: 'campaign', entity_id: c.campaign_id, field: name, old: placement[name] ?? 0, new: c[arg], label: camp?.name, blockers: b });
      expect.push((cmp) => (cmp?.dynamicBidding?.placementBidding || []).find((p) => p.placement === name)?.percentage ?? 0);
    }
    if (!myItems.length) {
      myItems.push({ entity_type: 'campaign', entity_id: c.campaign_id, field: 'bid_strategy', old: null, new: null, label: camp?.name, blockers: [...base, 'nothing to change'] });
      expect.push(() => null);
    }
    const start = items.length;
    items.push(...myItems);
    rows.push({ campaignId: c.campaign_id, dynamicBidding: {
      strategy: nextStrategy,
      placementBidding: Object.entries(nextPlacement).map(([placement, percentage]) => ({ placement, percentage })),
    } });
    itemIdx.push(myItems.map((_, k) => start + k));
  });
  // One campaign row covers several items; expand so results map back to every item.
  const writes = [{ method: 'PUT', path: '/sp/campaigns', mediaType: SP_LISTS.campaigns.mediaType, key: 'campaigns', rows, itemIdx, grouped: true }];
  const verify = async () => {
    const now = await read();
    let k = 0;
    return changes.flatMap((c) => {
      const cmp = now.find((x) => x.campaignId === c.campaign_id);
      const n = items.filter((it) => it.entity_id === c.campaign_id).length;
      const out = [];
      for (let j = 0; j < n; j++) out.push(expect[k + j]?.(cmp) ?? null);
      k += n;
      return out;
    });
  };
  return { items, writes, verify };
}

const PLANNERS = {
  update_bids: { plan: planBids, count: (a) => a.changes.length },
  add_negatives: { plan: planNegatives, count: (a) => a.negatives.length },
  transfer_targets: { plan: planTransfers, count: (a) => a.transfers.length },
  update_budgets: { plan: planBudgets, count: (a) => a.changes.length },
  update_bid_strategy: { plan: planBidStrategy, count: (a) => a.changes.length },
};

// ---------- approval ----------

export async function checkApproval(tool, profileId, rowId, hash, today = new Date()) {
  const blockers = []; const approvalGaps = [];
  let row = null;
  try {
    row = await deps.getQueueRow(rowId);
  } catch (e) {
    blockers.push(`Could not read the Ads Approval Queue: ${e.message}`);
    return { row, blockers, approvalGaps };
  }
  const meta = PROFILE_ALLOWLIST[profileId];
  if (row.client !== meta.client) blockers.push(`Queue row ${row.id} is for ${row.client || 'no client'}, not ${meta.client}`);
  if (row.market !== meta.market) blockers.push(`Queue row ${row.id} is for market ${row.market || 'none'}, not ${meta.market}`);
  if (row.lever && !TOOL_LEVERS[tool].includes(row.lever)) blockers.push(`Queue row lever "${row.lever}" does not match ${tool} (expects ${TOOL_LEVERS[tool].join(' / ')})`);
  if (['Done', 'Rejected', 'Expired'].includes(row.status)) blockers.push(`Queue row ${row.id} is already ${row.status}`);
  if (row.status !== 'Approved') approvalGaps.push(`Queue row status is "${row.status}"; needs "Approved" (by Ryan)`);
  if (!row.approvedOn) approvalGaps.push('Queue row "Approved on" date is empty');
  else {
    const age = Math.floor((today - new Date(`${row.approvedOn.slice(0, 10)}T00:00:00Z`)) / 86_400_000);
    if (age > GUARDS.approvalMaxAgeDays) approvalGaps.push(`Approval is ${age} days old (max ${GUARDS.approvalMaxAgeDays}); re-approve`);
  }
  if (!row.text.includes(`plan:${hash}`)) {
    const found = [...new Set(row.text.match(/plan:[0-9a-f]{12}/g) || [])];
    approvalGaps.push(`Plan code plan:${hash} is not written on queue row ${row.id}`
      + (found.length ? ` (row has ${found.join(', ')}: the batch differs from the one written on the row)` : ` (no plan code found in ${row.text.length} characters read from the row)`));
  }
  return { row, blockers, approvalGaps };
}

// ---------- run ----------

export async function runChange(tool, args, { email } = {}) {
  const { profile_id: profileId, queue_row_id: rowId, apply = false } = args;
  const def = PLANNERS[tool];
  const payload = Object.fromEntries(Object.entries(args).filter(([k]) => !['profile_id', 'queue_row_id', 'apply'].includes(k)));
  const hash = planHash(tool, profileId, payload);
  const runId = randomUUID();
  const calledAt = new Date().toISOString();

  const globalBlockers = [];
  if (def.count(payload) > GUARDS.maxItemsPerRun) globalBlockers.push(`Batch has ${def.count(payload)} items; max ${GUARDS.maxItemsPerRun} per run`);
  const plan = await def.plan(profileId, payload);
  const approval = await checkApproval(tool, profileId, rowId, hash);
  globalBlockers.push(...approval.blockers);

  const switchGaps = [];
  if (!GUARDS.writesEnabled) switchGaps.push('Live writes are switched off (WRITES_ENABLED); dry run only');
  if (!GUARDS.releasedProfiles.includes(profileId)) switchGaps.push('Profile is not released from Perpetua (PERPETUA_RELEASED_PROFILES); hand over first');

  const itemBlocked = plan.items.filter((it) => it.blockers.length).length;
  const ready = !globalBlockers.length && !itemBlocked && !approval.approvalGaps.length && !switchGaps.length;
  const logRows = (status, verified = [], dryRun = true, notes = '') => plan.items.map((it, i) => ({
    change_id: `${runId}:${i}`, queue_row_id: approval.row?.id || String(rowId), tool, called_by: email || null, called_at: calledAt,
    profile_id: profileId, entity_type: it.entity_type, entity_id: it.entity_id, field: it.field,
    old_value: it.old === null || it.old === undefined ? null : String(it.old), new_value: it.new === null || it.new === undefined ? null : String(it.new),
    dry_run: dryRun, status: typeof status === 'function' ? status(i) : status,
    verified_value: verified[i] === undefined || verified[i] === null ? null : String(verified[i]),
    notes: [`plan:${hash}`, it.blockers.join('; '), typeof notes === 'function' ? notes(i) : notes].filter(Boolean).join(' | '),
  }));

  const summary = {
    mode: apply ? 'APPLY' : 'DRY RUN',
    tool, profile_id: profileId, ...PROFILE_ALLOWLIST[profileId],
    plan_code: `plan:${hash}`,
    queue_row: approval.row && { id: approval.row.id, status: approval.row.status, approved_on: approval.row.approvedOn, lever: approval.row.lever, change: approval.row.change, url: approval.row.url },
    items: plan.items,
    blockers: globalBlockers,
    approval_needed: approval.approvalGaps,
    switches: switchGaps,
    items_blocked: itemBlocked,
    ready_to_apply: ready,
  };

  if (!apply) {
    let logNote = 'logged to change_log';
    try { await deps.logChanges(logRows('DRY_RUN')); } catch (e) { logNote = `change_log write failed: ${e.message}`; }
    return { ...summary, change_log: logNote, next: ready
      ? 'Everything checks out. Call again with apply=true.'
      : `Nothing changed. To proceed: fix blockers, write ${`plan:${hash}`} on queue row ${approval.row?.id || rowId} (e.g. in Result / notes) with this item list, and get Status = Approved.` };
  }

  if (!ready) {
    try { await deps.logChanges(logRows('REFUSED', [], false)); } catch { /* refusal stands either way */ }
    return { ...summary, applied: false, refused: 'Apply refused; nothing was sent to Amazon. See blockers / approval_needed / switches.' };
  }

  // Log before writing: if the audit trail can't be written, nothing is changed.
  try { await deps.logChanges(logRows('PENDING', [], false)); } catch (e) {
    return { ...summary, applied: false, refused: `Could not write change_log first (${e.message}); nothing was sent to Amazon.` };
  }

  const outcome = plan.items.map((it) => ({ sent: Boolean(it.skip), error: null }));
  for (const w of plan.writes) {
    try {
      const res = writeResult(await deps.adsWrite(w.method, w.path, { profileId, body: { [w.key]: w.rows }, mediaType: w.mediaType }));
      w.itemIdx.forEach((idx, rowIndex) => {
        for (const i of [].concat(idx)) outcome[i] = { sent: res.ok.has(rowIndex), error: res.errors[rowIndex] || (res.ok.has(rowIndex) ? null : 'no confirmation from Amazon') };
      });
    } catch (e) {
      w.itemIdx.forEach((idx) => { for (const i of [].concat(idx)) outcome[i] = { sent: false, error: e.message }; });
    }
  }

  let verified = [];
  try { verified = await plan.verify(); } catch (e) { verified = plan.items.map(() => `re-read failed: ${e.message}`); }
  const matches = (i) => {
    const it = plan.items[i];
    return it.field === 'create' ? verified[i] === 'present' : String(verified[i]) === String(it.new);
  };
  const status = (i) => (!outcome[i].sent ? 'FAILED' : matches(i) ? 'APPLIED_VERIFIED' : 'APPLIED_MISMATCH');
  try { await deps.logChanges(logRows(status, verified, false, (i) => outcome[i].error || '')); } catch { /* reported below */ }

  return {
    ...summary,
    applied: true,
    results: plan.items.map((it, i) => ({ entity_id: it.entity_id, field: it.field, old: it.old, new: it.new, status: status(i), verified: verified[i] ?? null, error: outcome[i].error })),
    next: `Update queue row ${approval.row.id} in Notion: Status = Done, Done on = today, Result / notes = the results above.`,
  };
}
