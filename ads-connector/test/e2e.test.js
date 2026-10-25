// End to end against mocked Google and Amazon: OAuth sign-in → token → MCP tools.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { setSecretSourceForTests } from '../src/secrets.js';
import { setFetchForTests } from '../src/ads.js';
import { TdsOAuthProvider } from '../src/auth.js';
import { createApp } from '../src/server.js';
import { CLAUDE_CLIENT_ID } from '../src/config.js';

const SECRETS = {
  'mcp-oauth-client-secret': 'client-secret-xyz', 'mcp-token-signing-key': 'signing-key',
  'google-oauth-client-id': 'gid', 'google-oauth-client-secret': 'gsecret',
  'ads-client-id': 'amzn-client', 'ads-client-secret': 'amzn-secret', 'ads-refresh-token-eu': 'amzn-refresh',
};
const amazonCalls = [];
let server; let base; let googleUser;

before(async () => {
  setSecretSourceForTests(async (n) => SECRETS[n]);
  setFetchForTests(async (url, opts) => {
    amazonCalls.push({ url: String(url), method: opts.method, scope: opts.headers?.['Amazon-Advertising-API-Scope'] });
    const json = (o) => new Response(JSON.stringify(o), { status: 200, headers: { 'content-type': 'application/json' } });
    if (String(url).includes('/auth/o2/token')) return json({ access_token: 'amzn-access', expires_in: 3600 });
    if (String(url).endsWith('/v2/profiles')) return json([{ profileId: 2067592198905075, countryCode: 'UK', currencyCode: 'GBP', timezone: 'Europe/London' }, { profileId: 111, countryCode: 'US' }]);
    if (String(url).endsWith('/sp/campaigns/list')) return new Response('{"campaigns":[{"campaignId":123456789012345678,"name":"Harvaza SP","state":"ENABLED"}]}', { status: 200 });
    return new Response('{}', { status: 404 });
  });
  const provider = new TdsOAuthProvider({ signingKey: 'signing-key', verifyGoogleCode: async () => googleUser });
  const app = createApp(provider);
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => server.close());

async function signIn(user) {
  googleUser = user;
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const auth = new URL(`${base}/authorize`);
  auth.search = new URLSearchParams({ response_type: 'code', client_id: CLAUDE_CLIENT_ID, redirect_uri: 'https://claude.ai/api/mcp/auth_callback', code_challenge: challenge, code_challenge_method: 'S256', state: 'abc' }).toString();
  const r1 = await fetch(auth, { redirect: 'manual' });
  assert.equal(r1.status, 302);
  const google = new URL(r1.headers.get('location'));
  assert.equal(google.host, 'accounts.google.com');
  assert.equal(google.searchParams.get('hd'), 'tdstrategists.co.uk');
  const r2 = await fetch(`${base}/oauth/google/callback?code=g&state=${encodeURIComponent(google.searchParams.get('state'))}`, { redirect: 'manual' });
  const back = new URL(r2.headers.get('location'));
  assert.equal(back.origin + back.pathname, 'https://claude.ai/api/mcp/auth_callback');
  assert.equal(back.searchParams.get('state'), 'abc');
  return { code: back.searchParams.get('code'), error: back.searchParams.get('error'), verifier };
}

const tokenReq = (params) => fetch(`${base}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params) });

async function mcp(token, method, params = {}) {
  const r = await fetch(`${base}/mcp`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream', ...(token ? { authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  return { status: r.status, body: r.status === 200 ? await r.json() : await r.text(), headers: r.headers };
}

test('unauthenticated /mcp is refused with OAuth discovery hint', async () => {
  const r = await mcp(null, 'tools/list');
  assert.equal(r.status, 401);
  assert.match(r.headers.get('www-authenticate'), /resource_metadata=/);
  const meta = await (await fetch(`${base}/.well-known/oauth-authorization-server`)).json();
  assert.equal(meta.registration_endpoint, undefined, 'no dynamic client registration');
});

test('non-TDS Google account is refused', async () => {
  const { code, error } = await signIn({ email: 'x@gmail.com', email_verified: true });
  assert.equal(code, null);
  assert.equal(error, 'access_denied');
});

test('unknown client and foreign redirect are refused', async () => {
  const r = await fetch(`${base}/authorize?response_type=code&client_id=evil&redirect_uri=https://evil.com/cb&code_challenge=x&code_challenge_method=S256`, { redirect: 'manual' });
  assert.notEqual(r.status, 302);
  const r2 = await fetch(`${base}/authorize?response_type=code&client_id=${CLAUDE_CLIENT_ID}&redirect_uri=https://evil.com/cb&code_challenge=x&code_challenge_method=S256`, { redirect: 'manual' });
  assert.notEqual(r2.status, 302);
});

test('TDS sign-in → tokens → tools, with allowlist and single-use codes', async () => {
  const { code, verifier } = await signIn({ email: 'Ryan@tdstrategists.co.uk', email_verified: true, hd: 'tdstrategists.co.uk' });
  assert.ok(code);

  const bad = await tokenReq({ grant_type: 'authorization_code', code, code_verifier: verifier, client_id: CLAUDE_CLIENT_ID, client_secret: 'wrong', redirect_uri: 'https://claude.ai/api/mcp/auth_callback' });
  assert.equal(bad.status, 400);
  const badPkce = await tokenReq({ grant_type: 'authorization_code', code, code_verifier: 'nope', client_id: CLAUDE_CLIENT_ID, client_secret: 'client-secret-xyz', redirect_uri: 'https://claude.ai/api/mcp/auth_callback' });
  assert.equal(badPkce.status, 400);

  const basic = Buffer.from(`${CLAUDE_CLIENT_ID}:client-secret-xyz`).toString('base64');
  const good = await fetch(`${base}/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: `Basic ${basic}` }, body: new URLSearchParams({ grant_type: 'authorization_code', code, code_verifier: verifier, redirect_uri: 'https://claude.ai/api/mcp/auth_callback' }) });
  assert.equal(good.status, 200);
  const tokens = await good.json();
  assert.ok(tokens.access_token && tokens.refresh_token);

  const replay = await tokenReq({ grant_type: 'authorization_code', code, code_verifier: verifier, client_id: CLAUDE_CLIENT_ID, client_secret: 'client-secret-xyz', redirect_uri: 'https://claude.ai/api/mcp/auth_callback' });
  assert.equal(replay.status, 400, 'code is single-use');

  assert.equal((await mcp(tokens.refresh_token, 'tools/list')).status, 401, 'refresh token is not an access token');

  const list = await mcp(tokens.access_token, 'tools/list');
  assert.equal(list.status, 200);
  const names = list.body.result.tools.map((t) => t.name).sort();
  assert.deepEqual(names, ['add_negatives', 'get_ad_groups', 'get_campaigns', 'get_goals', 'get_keywords', 'get_negatives', 'get_report', 'get_targets',
    'goal_performance', 'list_profiles', 'run_report', 'transfer_targets', 'update_bid_strategy', 'update_bids', 'update_budgets']);
  const readTools = list.body.result.tools.filter((t) => t.name.startsWith('get_') || ['list_profiles', 'run_report', 'goal_performance'].includes(t.name));
  assert.ok(readTools.every((t) => t.annotations.readOnlyHint === true));

  const profiles = await mcp(tokens.access_token, 'tools/call', { name: 'list_profiles', arguments: {} });
  const p = JSON.parse(profiles.body.result.content[0].text);
  assert.deepEqual(p.map((x) => x.profile_id), ['2067592198905075'], 'non-allowlisted profile filtered out');

  const camps = await mcp(tokens.access_token, 'tools/call', { name: 'get_campaigns', arguments: { profile_id: '2067592198905075' } });
  const c = JSON.parse(camps.body.result.content[0].text);
  assert.equal(c.client, 'Harvaza');
  assert.equal(c.items[0].campaignId, '123456789012345678');

  const before = amazonCalls.length;
  const refused = await mcp(tokens.access_token, 'tools/call', { name: 'get_campaigns', arguments: { profile_id: '111' } });
  assert.equal(refused.body.result.isError, true);
  assert.match(refused.body.result.content[0].text, /allowlist/);
  assert.equal(amazonCalls.length, before, 'refused before any Amazon call');

  const refreshed = await tokenReq({ grant_type: 'refresh_token', refresh_token: tokens.refresh_token, client_id: CLAUDE_CLIENT_ID, client_secret: 'client-secret-xyz' });
  assert.equal(refreshed.status, 200);
});
