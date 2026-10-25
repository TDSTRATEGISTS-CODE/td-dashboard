import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertAllowedProfile } from '../src/allowlist.js';
import { assertReadOnly, parseAdsJson } from '../src/ads.js';
import { buildReportRequest, mapRow, tableSchema, REPORTS, validateRange } from '../src/reports.js';
import { chunkRange, addDays, todayIn } from '../src/dates.js';
import { signToken, verifyToken, isAllowedGoogleIdentity } from '../src/auth.js';
import { PROFILE_ALLOWLIST } from '../src/config.js';

test('allowlist has exactly the 8 brief profiles and refuses others', () => {
  assert.equal(Object.keys(PROFILE_ALLOWLIST).length, 8);
  assert.equal(assertAllowedProfile(2067592198905075), '2067592198905075');
  assert.throws(() => assertAllowedProfile('1234'), /not on the TDS allowlist/);
  assert.throws(() => assertAllowedProfile(undefined), /allowlist/);
  assert.throws(() => assertAllowedProfile('__proto__'), /allowlist/);
  assert.throws(() => { PROFILE_ALLOWLIST['1'] = {}; }, TypeError);
});

test('read-only guard blocks every write route', () => {
  assert.doesNotThrow(() => assertReadOnly('POST', '/sp/keywords/list'));
  assert.doesNotThrow(() => assertReadOnly('GET', '/v2/profiles'));
  assert.doesNotThrow(() => assertReadOnly('GET', '/reporting/reports/abc-123'));
  for (const [m, p] of [['PUT', '/sp/keywords'], ['POST', '/sp/keywords'], ['DELETE', '/sp/campaigns/1'],
    ['POST', '/sp/keywords/delete'], ['POST', '/sp/campaigns'], ['PUT', '/sp/campaigns'], ['POST', '/sp/negativeKeywords']]) {
    assert.throws(() => assertReadOnly(m, p), /not a read route/, `${m} ${p}`);
  }
});

test('large Amazon IDs keep full precision', () => {
  const r = parseAdsJson('[{"campaignId": 123456789012345678, "cost": 1.5, "keywordId":987654321098765432}]');
  assert.equal(r[0].campaignId, '123456789012345678');
  assert.equal(r[0].keywordId, '987654321098765432');
  assert.equal(r[0].cost, 1.5);
});

test('report request is SP v3 shaped and range-limited', () => {
  const b = buildReportRequest('sp_campaigns', '2026-10-01', '2026-10-23');
  assert.equal(b.configuration.reportTypeId, 'spCampaigns');
  assert.deepEqual(b.configuration.groupBy, ['campaign']);
  assert.ok(b.configuration.columns.includes('date') && b.configuration.columns.includes('cost'));
  const s = buildReportRequest('sp_search_term', '2026-10-01', '2026-10-01', 'SUMMARY');
  assert.ok(s.configuration.columns.includes('startDate') && !s.configuration.columns.includes('date'));
  assert.throws(() => validateRange('2026-09-01', '2026-10-15'), /at most 31/);
  assert.throws(() => validateRange('2026-10-02', '2026-10-01'), /before/);
});

test('rows map onto the table schema', () => {
  for (const type of Object.keys(REPORTS)) {
    const names = tableSchema(type).map((f) => f.name);
    const row = mapRow(type, { date: '2026-10-01', campaignId: '1', cost: 12.345, clicks: 3 },
      { profileId: '2067592198905075', client: 'Harvaza', market: 'UK', currency: 'GBP', pulledAt: 'x' });
    assert.deepEqual(Object.keys(row).sort(), names.sort(), type);
    assert.equal(row.cost, '12.345');
    assert.equal(row.clicks, 3);
  }
});

test('date chunking', () => {
  assert.deepEqual(chunkRange('2026-07-22', '2026-10-24', 31).map((c) => c.join('..')),
    ['2026-07-22..2026-08-21', '2026-08-22..2026-09-21', '2026-09-22..2026-10-22', '2026-10-23..2026-10-24']);
  assert.equal(addDays('2026-03-01', -1), '2026-02-28');
  assert.equal(todayIn('Europe/London', new Date('2026-10-25T23:30:00Z')), '2026-10-25');
  assert.equal(todayIn('Europe/Berlin', new Date('2026-10-25T23:30:00Z')), '2026-10-26');
});

test('tokens: signature, type and expiry enforced', () => {
  const t = signToken('k', { typ: 'access', exp: Math.floor(Date.now() / 1000) + 60 });
  assert.equal(verifyToken('k', t, 'access').typ, 'access');
  assert.throws(() => verifyToken('other', t, 'access'), /signature/);
  assert.throws(() => verifyToken('k', t, 'refresh'), /type/);
  assert.throws(() => verifyToken('k', signToken('k', { typ: 'access', exp: 1 }), 'access'), /expired/);
  const [v, body, sig] = t.split('.');
  const forged = Buffer.from(JSON.stringify({ typ: 'access', exp: 9e9, sub: 'x' })).toString('base64url');
  assert.throws(() => verifyToken('k', `${v}.${forged}.${sig}`, 'access'), /signature/);
  assert.ok(body);
});

test('only verified tdstrategists.co.uk Google accounts are allowed', () => {
  assert.equal(isAllowedGoogleIdentity({ email: 'ryan@tdstrategists.co.uk', email_verified: true, hd: 'tdstrategists.co.uk' }), true);
  assert.equal(isAllowedGoogleIdentity({ email: 'ryan@tdstrategists.co.uk', email_verified: false, hd: 'tdstrategists.co.uk' }), false);
  assert.equal(isAllowedGoogleIdentity({ email: 'someone@gmail.com', email_verified: true }), false);
  assert.equal(isAllowedGoogleIdentity({ email: 'x@tdstrategists.co.uk.evil.com', email_verified: true, hd: 'evil.com' }), false);
  assert.equal(isAllowedGoogleIdentity({ email: 'x@tdstrategists.co.uk', email_verified: true }), false); // no hd = personal account
});
