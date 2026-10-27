// Change tools against mocked Amazon, Notion and BigQuery. Default = dry run; apply only when every gate passes.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { runChange, setChangeDepsForTests, planHash } from '../src/changes.js';
import { assertAllowedWrite, adsWrite } from '../src/ads.js';
import { GUARDS } from '../src/config.js';
import { getQueueRow, setNotionFetchForTests } from '../src/notion.js';
import { setSecretSourceForTests } from '../src/secrets.js';

const P = '2067592198905075'; // Harvaza UK
let store; let writes; let logs; let row; let goals;

beforeEach(() => {
  GUARDS.writesEnabled = false;
  GUARDS.releasedProfiles = [];
  store = {
    campaigns: [
      { campaignId: 'C1', name: 'Manual', state: 'ENABLED', targetingType: 'MANUAL', budget: { budget: 20, budgetType: 'DAILY' }, dynamicBidding: { strategy: 'LEGACY_FOR_SALES', placementBidding: [{ placement: 'PLACEMENT_TOP', percentage: 10 }] } },
      { campaignId: 'C2', name: 'Auto', state: 'ENABLED', targetingType: 'AUTO', budget: { budget: 5, budgetType: 'DAILY' } },
    ],
    adGroups: [{ adGroupId: 'G1', campaignId: 'C1', state: 'ENABLED', defaultBid: 0.5 }, { adGroupId: 'G2', campaignId: 'C2', state: 'ENABLED', defaultBid: 0.4 }],
    keywords: [{ keywordId: 'K1', adGroupId: 'G1', campaignId: 'C1', keywordText: 'coconut water', matchType: 'EXACT', bid: 0.5, state: 'ENABLED' }],
    targets: [],
    negativeKeywords: [{ campaignId: 'C2', adGroupId: 'G2', keywordText: 'free', matchType: 'NEGATIVE_EXACT', state: 'ENABLED' }],
    campaignNegativeKeywords: [], negativeTargets: [],
  };
  writes = []; logs = [];
  goals = [{ id: 'GOAL-1', name: 'UK · Coconut Water · universal', status: 'Active', campaignIds: ['C1', 'C2'] }];
  row = { id: 'ADS-200', status: 'Proposed', client: 'Harvaza', market: 'UK', lever: 'Fixed bid', approvedOn: null, text: '' };
  const pick = (kind, f) => store[kind].filter((x) => {
    const inc = (k, v) => !f[k] || f[k].include.includes(v);
    return inc('keywordIdFilter', x.keywordId) && inc('targetIdFilter', x.targetId) && inc('campaignIdFilter', x.campaignId) && inc('adGroupIdFilter', x.adGroupId);
  });
  setChangeDepsForTests({
    spList: async (kind, _p, f) => ({ items: pick(kind, f), truncated: false }),
    getQueueRow: async () => row,
    getGoals: async () => goals,
    getDryRunRows: async (q, codes) => logs.filter((l) => l.dry_run && l.queue_row_id === q && codes.some((c) => l.notes.includes(c))),
    logChanges: async (rows) => { logs.push(...rows); },
    adsWrite: async (method, path, { body }) => {
      writes.push({ method, path, body });
      const [key, rows] = Object.entries(body)[0];
      if (path === '/sp/keywords' && method === 'PUT') rows.forEach((r) => { store.keywords.find((k) => k.keywordId === r.keywordId).bid = r.bid; });
      if (path === '/sp/keywords' && method === 'POST') rows.forEach((r) => store.keywords.push({ ...r, keywordId: `new${store.keywords.length}` }));
      if (path === '/sp/negativeKeywords') rows.forEach((r) => store.negativeKeywords.push(r));
      if (path === '/sp/campaigns') rows.forEach((r) => Object.assign(store.campaigns.find((c) => c.campaignId === r.campaignId), r));
      return { [key]: { success: rows.map((_, index) => ({ index })), error: [] } };
    },
  });
});

const bid = (new_bid, extra = {}) => ({ profile_id: P, queue_row_id: 'ADS-200', changes: [{ entity: 'keyword', id: 'K1', new_bid }], ...extra });
// Approve the way the live flow does: dry run, write its plan code on the row, set Approved.
const approve = async (args, tool = 'update_bids') => {
  const { apply, ...rest } = args;
  const r = await runChange(tool, rest);
  Object.assign(row, { status: 'Approved', approvedOn: new Date().toISOString().slice(0, 10), text: `ok ${r.plan_code}` });
  return r;
};

test('dry run by default: shows old → new, plan code, changes nothing', async () => {
  const r = await runChange('update_bids', bid(0.55), { email: 'ryan@tdstrategists.co.uk' });
  assert.equal(r.mode, 'DRY RUN');
  assert.equal(r.items[0].old, 0.5);
  assert.equal(r.items[0].new, 0.55);
  assert.equal(r.items[0].change_pct, 10);
  assert.deepEqual(r.items[0].blockers, []);
  assert.match(r.plan_code, /^plan:[0-9a-f]{12}$/);
  assert.equal(r.ready_to_apply, false);
  assert.ok(r.approval_needed.some((g) => /Approved/.test(g)));
  assert.ok(r.approval_needed.some((g) => /Plan code/.test(g)));
  assert.equal(writes.length, 0);
  assert.equal(logs[0].status, 'DRY_RUN');
  assert.equal(logs[0].old_value, '0.5');
  assert.equal(logs[0].called_by, 'ryan@tdstrategists.co.uk');
});

test('plan code is stable regardless of key order', () => {
  assert.equal(planHash('update_bids', P, { changes: [{ entity: 'keyword', id: 'K1', new_bid: 0.6 }] }),
    planHash('update_bids', P, { changes: [{ new_bid: 0.6, id: 'K1', entity: 'keyword' }] }));
  assert.notEqual(planHash('update_bids', P, { changes: [{ entity: 'keyword', id: 'K1', new_bid: 0.6 }] }),
    planHash('update_bids', P, { changes: [{ entity: 'keyword', id: 'K1', new_bid: 0.61 }] }));
});

test('bid guards (approved rules): +10% raise cap, -25% cut cap, £0.15 floor, max, unknown keyword', async () => {
  assert.match((await runChange('update_bids', bid(0.56))).items[0].blockers.join(), /raise \+12% exceeds the \+10% weekly cap/);
  assert.deepEqual((await runChange('update_bids', bid(0.38))).items[0].blockers, []); // -24%
  assert.match((await runChange('update_bids', bid(0.37))).items[0].blockers.join(), /cut -26% exceeds the -25% weekly cap/);
  assert.match((await runChange('update_bids', bid(5))).items[0].blockers.join(), /above maximum/);
  assert.match((await runChange('update_bids', bid(0.14))).items[0].blockers.join(), /below minimum bid 0.15/);
  const r = await runChange('update_bids', { profile_id: P, queue_row_id: 'ADS-200', changes: [{ entity: 'keyword', id: 'NOPE', new_bid: 0.5 }] });
  assert.match(r.items[0].blockers.join(), /not found/);
});

test('apply refused while live writes are off, even when approved', async () => {
  const args = bid(0.55, { apply: true });
  await approve(args);
  const r = await runChange('update_bids', args);
  assert.equal(r.applied, false);
  assert.equal(r.items_blocked, 0);
  assert.ok(r.switches.some((s) => /WRITES_ENABLED/.test(s)));
  assert.equal(writes.length, 0);
  assert.equal(logs.at(-1).status, 'REFUSED');
});

test('apply refused when the approved plan code does not match the batch', async () => {
  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  await approve(bid(0.55));
  const r = await runChange('update_bids', bid(0.54, { apply: true })); // different from what was approved
  assert.equal(r.applied, false);
  assert.ok(r.approval_needed.some((g) => /row has plan:[0-9a-f]{12}: the batch differs/.test(g)));
  assert.equal(writes.length, 0);
});

test('apply refused for a profile not released from Perpetua', async () => {
  GUARDS.writesEnabled = true;
  const args = bid(0.55, { apply: true });
  await approve(args);
  const r = await runChange('update_bids', args);
  assert.equal(r.applied, false);
  assert.ok(r.switches.some((s) => /Perpetua/.test(s)));
  assert.equal(writes.length, 0);
});

test('apply refused for wrong client/market/lever, stale or finished rows', async () => {
  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  for (const patch of [{ client: 'NKV' }, { market: 'DE' }, { lever: 'Budget' }, { approvedOn: '2026-01-01' }, { status: 'Done' }]) {
    const args = bid(0.55, { apply: true });
    await approve(args);
    Object.assign(row, patch);
    const r = await runChange('update_bids', args);
    assert.equal(r.applied, false, JSON.stringify(patch));
  }
  assert.equal(writes.length, 0);
});

test('apply refused if change_log cannot be written first', async () => {
  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  const args = bid(0.55, { apply: true });
  await approve(args);
  setChangeDepsForTests({ logChanges: async () => { throw new Error('bq down'); } });
  const r = await runChange('update_bids', args);
  assert.equal(r.applied, false);
  assert.match(r.refused, /change_log/);
  assert.equal(writes.length, 0);
});

test('full apply when every gate passes: write, re-read, log verified', async () => {
  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  const args = bid(0.51, { apply: true });
  await approve(args);
  const r = await runChange('update_bids', args);
  assert.equal(r.applied, true);
  assert.deepEqual(writes, [{ method: 'PUT', path: '/sp/keywords', body: { keywords: [{ keywordId: 'K1', bid: 0.51 }] } }]);
  assert.equal(r.results[0].status, 'APPLIED_VERIFIED');
  assert.deepEqual(logs.filter((l) => !l.dry_run).map((l) => l.status), ['PENDING', 'APPLIED_VERIFIED']);
});

test('negatives: duplicates and bad input blocked', async () => {
  row.lever = 'Negative';
  const r = await runChange('add_negatives', { profile_id: P, queue_row_id: 'ADS-200', negatives: [
    { type: 'keyword', campaign_id: 'C2', ad_group_id: 'G2', keyword_text: 'FREE', match_type: 'NEGATIVE_EXACT' },
    { type: 'keyword', campaign_id: 'C2', ad_group_id: 'G1', keyword_text: 'cheap', match_type: 'NEGATIVE_EXACT' },
    { type: 'product', campaign_id: 'C2', ad_group_id: 'G2', asin: 'notanasin' },
    { type: 'keyword', campaign_id: 'C2', ad_group_id: 'G2', keyword_text: 'cheap', match_type: 'NEGATIVE_PHRASE' },
  ] });
  assert.match(r.items[0].blockers.join(), /already exists/);
  assert.match(r.items[1].blockers.join(), /not in campaign/);
  assert.match(r.items[2].blockers.join(), /valid ASIN/);
  assert.deepEqual(r.items[3].blockers, []);
});

test('transfer: creates in destination + negative exact in source; checks manual destination', async () => {
  row.lever = 'Build';
  const t = { type: 'keyword', keyword_text: 'organic coconut water', match_type: 'EXACT', bid: 0.6,
    destination_campaign_id: 'C1', destination_ad_group_id: 'G1', source_campaign_id: 'C2', source_ad_group_id: 'G2' };
  const r = await runChange('transfer_targets', { profile_id: P, queue_row_id: 'ADS-200', transfers: [t] });
  assert.equal(r.items.length, 2);
  assert.deepEqual(r.items.map((i) => i.blockers), [[], []]);
  assert.match(r.items[1].new, /NEGATIVE_EXACT "organic coconut water"/);
  const bad = await runChange('transfer_targets', { profile_id: P, queue_row_id: 'ADS-200', transfers: [{ ...t, destination_campaign_id: 'C2', destination_ad_group_id: 'G2', source_campaign_id: 'C1', source_ad_group_id: 'G1' }] });
  assert.match(bad.items[0].blockers.join(), /not a manual campaign/);

  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  const args = { profile_id: P, queue_row_id: 'ADS-200', transfers: [t], apply: true };
  await approve(args, 'transfer_targets');
  const done = await runChange('transfer_targets', args);
  assert.deepEqual(done.results.map((x) => x.status), ['APPLIED_VERIFIED', 'APPLIED_VERIFIED']);
  assert.deepEqual(writes.map((w) => `${w.method} ${w.path}`), ['POST /sp/keywords', 'POST /sp/negativeKeywords']);
});

test('budgets and bid strategy plans', async () => {
  row.lever = 'Budget';
  const b = await runChange('update_budgets', { profile_id: P, queue_row_id: 'ADS-200', changes: [{ campaign_id: 'C1', new_daily_budget: 25 }, { campaign_id: 'C2', new_daily_budget: 50 }] });
  assert.deepEqual([b.items[0].old, b.items[0].new, b.items[0].blockers.length], [20, 25, 0]);
  assert.match(b.items[1].blockers.join(), /exceeds/);
  row.lever = 'Other';
  const s = await runChange('update_bid_strategy', { profile_id: P, queue_row_id: 'ADS-200', changes: [{ campaign_id: 'C1', strategy: 'AUTO_FOR_SALES', top_of_search_pct: 20 }] });
  assert.deepEqual(s.items.map((i) => [i.field, i.old, i.new]), [['bid_strategy', 'LEGACY_FOR_SALES', 'AUTO_FOR_SALES'], ['PLACEMENT_TOP', 10, 20]]);

  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  const args = { profile_id: P, queue_row_id: 'ADS-200', changes: [{ campaign_id: 'C1', strategy: 'AUTO_FOR_SALES', top_of_search_pct: 20 }], apply: true };
  await approve(args, 'update_bid_strategy');
  row.lever = 'Other';
  const done = await runChange('update_bid_strategy', args);
  assert.deepEqual(done.results.map((x) => x.status), ['APPLIED_VERIFIED', 'APPLIED_VERIFIED']);
});

test('Ads client: no delete, no archive, nothing when writes are off', async () => {
  assert.throws(() => assertAllowedWrite('DELETE', '/sp/keywords/1'), /not an allowed/);
  assert.throws(() => assertAllowedWrite('POST', '/sp/keywords/delete'), /not an allowed/);
  assert.throws(() => assertAllowedWrite('PUT', '/sp/campaigns', { campaigns: [{ campaignId: '1', state: 'ARCHIVED' }] }), /archiving/);
  assert.doesNotThrow(() => assertAllowedWrite('PUT', '/sp/keywords', { keywords: [] }));
  GUARDS.writesEnabled = false;
  await assert.rejects(adsWrite('PUT', '/sp/keywords', { profileId: P, body: { keywords: [] } }), /switched off/);
});

test('Notion queue row is read by ID and must be in the Ads Approval Queue', async () => {
  setSecretSourceForTests(async () => 'notion-token');
  const page = (db) => ({ id: 'pg', url: 'https://notion.so/pg', parent: { database_id: db }, properties: {
    ID: { type: 'unique_id', unique_id: { prefix: 'ADS', number: 92 } },
    Status: { type: 'status', status: { name: 'Approved' } },
    Client: { type: 'select', select: { name: 'Harvaza' } },
    Market: { type: 'select', select: { name: 'UK' } },
    'Approved on': { type: 'date', date: { start: '2026-10-25' } },
    'Result / notes': { type: 'rich_text', rich_text: [{ plain_text: 'plan:abc123def456' }] },
  } });
  let db = '5794bf8e-26b2-470e-a321-6d45273227f6';
  setNotionFetchForTests(async (url) => new Response(JSON.stringify(String(url).includes('/blocks/') ? { results: [] } : { results: [page(db)] }), { status: 200 }));
  const r = await getQueueRow('ADS-92');
  assert.deepEqual([r.id, r.status, r.client, r.market, r.approvedOn], ['ADS-92', 'Approved', 'Harvaza', 'UK', '2026-10-25']);
  assert.ok(r.text.includes('plan:abc123def456'));
  db = 'someotherdatabase';
  await assert.rejects(getQueueRow('ADS-92'), /not in the Ads Approval Queue/);
  await assert.rejects(getQueueRow('drop table'), /ADS-92/);
});

test('every change must sit in an Active goal (fail closed)', async () => {
  const ok = await runChange('update_bids', bid(0.55));
  assert.equal(ok.items[0].goal_id, 'GOAL-1');
  assert.match(logs.at(-1).notes, /goal:GOAL-1/);

  goals = [{ id: 'GOAL-1', name: 'x', status: 'Active', campaignIds: ['C2'] }];
  assert.match((await runChange('update_bids', bid(0.55))).items[0].blockers.join(), /not in any goal/);

  goals = [{ id: 'GOAL-1', name: 'x', status: 'Paused', campaignIds: ['C1'] }];
  assert.match((await runChange('update_bids', bid(0.55))).items[0].blockers.join(), /is Paused/);

  setChangeDepsForTests({ getGoals: async () => { throw new Error('no access'); } });
  const r = await runChange('update_bids', bid(0.55));
  assert.match(r.blockers.join(), /Could not read Ads Goals/);
  assert.equal(r.ready_to_apply, false);
});

test('goals are parsed from the Notion Ads Goals database', async () => {
  const { getGoals } = await import('../src/notion.js');
  setSecretSourceForTests(async () => 'notion-token');
  let body;
  setNotionFetchForTests(async (url, opts) => {
    body = JSON.parse(opts.body);
    assert.match(String(url), /8c1c5c76a4284eb9857c9ec2f61c6a13/);
    return new Response(JSON.stringify({ has_more: false, results: [{ url: 'u', properties: {
      Goal: { type: 'title', title: [{ plain_text: 'UK · 200ml Coconut Water · universal' }] },
      'Goal ID': { type: 'unique_id', unique_id: { prefix: 'GOAL', number: 1 } },
      'Profile ID': { type: 'rich_text', rich_text: [{ plain_text: '2067592198905075' }] },
      Status: { type: 'select', select: { name: 'Active' } },
      'Campaign IDs': { type: 'rich_text', rich_text: [{ plain_text: '63739564909591, 10575998198869,37089907414884' }] },
      'Target ACoS': { type: 'number', number: 0.25 },
      'Break-even ACoS': { type: 'number', number: 0.32 },
    } }] }), { status: 200 });
  });
  const [g] = await getGoals({ profileId: '2067592198905075' });
  assert.equal(body.filter.rich_text.equals, '2067592198905075');
  assert.deepEqual([g.id, g.status, g.targetAcos, g.breakEvenAcos], ['GOAL-1', 'Active', 0.25, 0.32]);
  assert.deepEqual(g.campaignIds, ['63739564909591', '10575998198869', '37089907414884']);
});

test('stale-value guard: live bid moved after approval blocks with was/now, new plan code', async () => {
  GUARDS.writesEnabled = true; GUARDS.releasedProfiles = [P];
  const approved = await approve(bid(0.55));
  store.keywords[0].bid = 0.61; // someone changed the bid after approval
  const r = await runChange('update_bids', bid(0.55, { apply: true }));
  assert.equal(r.applied, false);
  assert.notEqual(r.plan_code, approved.plan_code, 'a changed old value gives a new plan code');
  assert.ok(r.items[0].blockers.includes('Live value changed since approval (was 0.5, now 0.61). Re-run the dry run and re-approve.'));
  assert.equal(writes.length, 0);

  // Re-run the dry run and re-approve on the new live value: applies.
  await approve(bid(0.62));
  const ok = await runChange('update_bids', bid(0.62, { apply: true }));
  assert.equal(ok.applied, true);
  assert.equal(ok.results[0].status, 'APPLIED_VERIFIED');
});

test('stale-value guard covers budgets too', async () => {
  row.lever = 'Budget';
  const args = { profile_id: P, queue_row_id: 'ADS-200', changes: [{ campaign_id: 'C1', new_daily_budget: 22 }] };
  await approve(args, 'update_budgets');
  row.lever = 'Budget';
  store.campaigns[0].budget.budget = 21;
  const r = await runChange('update_budgets', { ...args, apply: true });
  assert.ok(r.items[0].blockers.some((b) => /Live value changed since approval \(was 20, now 21\)/.test(b)));
});

test('plan code includes the old values', () => {
  const items = { changes: [{ entity: 'keyword', id: 'K1', new_bid: 0.62 }] };
  assert.notEqual(planHash('update_bids', P, items, [['K1', 'bid', 0.5]]), planHash('update_bids', P, items, [['K1', 'bid', 0.61]]));
});
