// Amazon Ads API client (EU). Reads go through READ_ROUTES. Writes go only through adsWrite(),
// only to WRITE_ROUTES, and only when GUARDS.writesEnabled is on. There is no delete/archive route at all.
import { ADS_API_BASE, ADS_TOKEN_URL, SECRETS, GUARDS } from './config.js';
import { getSecret } from './secrets.js';
import { assertAllowedProfile } from './allowlist.js';
import { warn } from './log.js';

const READ_ROUTES = [
  ['GET', /^\/v2\/profiles$/],
  ['POST', /^\/sp\/[A-Za-z]+\/list$/], // v3 list endpoints (campaigns, adGroups, keywords, targets, negatives)
  ['POST', /^\/reporting\/reports$/], // creates an async report (reads data, changes nothing)
  ['GET', /^\/reporting\/reports\/[A-Za-z0-9-]+$/],
];

// The only writes the change tools make: bid/budget/strategy updates and creating keywords, targets
// and negatives. Nothing here can delete or archive.
const WRITE_ROUTES = [
  ['PUT', /^\/sp\/(keywords|targets|campaigns)$/],
  ['POST', /^\/sp\/(keywords|targets|negativeKeywords|campaignNegativeKeywords|negativeTargets)$/],
];

export function assertReadOnly(method, path) {
  if (!READ_ROUTES.some(([m, re]) => m === method && re.test(path))) {
    throw new Error(`Blocked: ${method} ${path} is not a read route.`);
  }
}

export function assertAllowedWrite(method, path, body) {
  if (!WRITE_ROUTES.some(([m, re]) => m === method && re.test(path))) {
    throw new Error(`Blocked: ${method} ${path} is not an allowed change route.`);
  }
  if (/"state"\s*:\s*"ARCHIVED"/i.test(JSON.stringify(body ?? {}))) throw new Error('Blocked: archiving is not allowed.');
}

// Amazon IDs (campaignId, keywordId, ...) can exceed JavaScript's safe integer range. Quote any
// numeric value whose key ends in "Id" before parsing so no ID is silently rounded.
export function parseAdsJson(text) {
  return JSON.parse(text.replace(/("[A-Za-z]*Id"\s*:\s*)(-?\d+)(?=\s*[,}\]])/g, '$1"$2"'));
}

let accessToken = null;
let accessTokenExpiry = 0;
let fetchImpl = (...a) => fetch(...a);
export function setFetchForTests(fn) { fetchImpl = fn; accessToken = null; accessTokenExpiry = 0; }

async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiry - 60_000) return accessToken;
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: await getSecret(SECRETS.adsRefreshTokenEu),
    client_id: await getSecret(SECRETS.adsClientId),
    client_secret: await getSecret(SECRETS.adsClientSecret),
  });
  const res = await fetchImpl(ADS_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.access_token) {
    // Only the error code is surfaced; the response body is never logged.
    throw new Error(`Amazon token refresh failed (HTTP ${res.status}${json.error ? `, ${json.error}` : ''})`);
  }
  accessToken = json.access_token;
  accessTokenExpiry = Date.now() + (json.expires_in || 3600) * 1000;
  return accessToken;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function adsWrite(method, path, opts = {}) {
  if (!GUARDS.writesEnabled) throw new Error('Blocked: live writes are switched off (WRITES_ENABLED is not true). Dry run only.');
  assertAllowedWrite(method, path, opts.body);
  return send(method, path, opts);
}

export async function adsRequest(method, path, opts = {}) {
  assertReadOnly(method, path);
  return send(method, path, opts);
}

async function send(method, path, { profileId, body, mediaType } = {}) {
  const headers = {
    Authorization: `Bearer ${await getAccessToken()}`,
    'Amazon-Advertising-API-ClientId': await getSecret(SECRETS.adsClientId),
  };
  if (path !== '/v2/profiles') headers['Amazon-Advertising-API-Scope'] = assertAllowedProfile(profileId);
  if (body !== undefined) headers['Content-Type'] = mediaType || 'application/json';
  if (mediaType) headers.Accept = mediaType;

  for (let attempt = 1; ; attempt++) {
    const res = await fetchImpl(ADS_API_BASE + path, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await res.text();
    if ((res.status === 429 || res.status >= 500) && attempt < 6) {
      const wait = Number(res.headers.get('retry-after')) * 1000 || Math.min(2 ** attempt * 1000, 30_000);
      warn('Ads API retry', { path, status: res.status, attempt, waitMs: wait });
      await sleep(wait);
      continue;
    }
    if (res.status === 401 && attempt === 1) { accessToken = null; continue; }
    const data = text ? (() => { try { return parseAdsJson(text); } catch { return { raw: text.slice(0, 500) }; } })() : null;
    if (!res.ok) {
      const err = new Error(`Ads API ${method} ${path} failed: HTTP ${res.status} ${data?.code || ''} ${data?.message || data?.details || data?.detail || ''}`.trim());
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }
}

export async function listProfiles() {
  return adsRequest('GET', '/v2/profiles');
}

// SP v3 list endpoints. Paginates with nextToken up to maxItems.
export const SP_LISTS = {
  campaigns: { path: '/sp/campaigns/list', mediaType: 'application/vnd.spCampaign.v3+json', key: 'campaigns' },
  adGroups: { path: '/sp/adGroups/list', mediaType: 'application/vnd.spAdGroup.v3+json', key: 'adGroups' },
  keywords: { path: '/sp/keywords/list', mediaType: 'application/vnd.spKeyword.v3+json', key: 'keywords' },
  targets: { path: '/sp/targets/list', mediaType: 'application/vnd.spTargetingClause.v3+json', key: 'targetingClauses' },
  negativeKeywords: { path: '/sp/negativeKeywords/list', mediaType: 'application/vnd.spNegativeKeyword.v3+json', key: 'negativeKeywords' },
  campaignNegativeKeywords: { path: '/sp/campaignNegativeKeywords/list', mediaType: 'application/vnd.spCampaignNegativeKeyword.v3+json', key: 'campaignNegativeKeywords' },
  negativeTargets: { path: '/sp/negativeTargets/list', mediaType: 'application/vnd.spNegativeTargetingClause.v3+json', key: 'negativeTargetingClauses' },
  campaignNegativeTargets: { path: '/sp/campaignNegativeTargets/list', mediaType: 'application/vnd.spCampaignNegativeTargetingClause.v3+json', key: 'campaignNegativeTargetingClauses' },
};

export async function spList(kind, profileId, filters = {}, maxItems = 500) {
  const def = SP_LISTS[kind];
  if (!def) throw new Error(`Unknown list type ${kind}`);
  const items = [];
  let nextToken;
  do {
    const body = { ...filters, ...(nextToken ? { nextToken } : {}) };
    const page = await adsRequest('POST', def.path, { profileId, body, mediaType: def.mediaType });
    items.push(...(page?.[def.key] || []));
    nextToken = page?.nextToken;
  } while (nextToken && items.length < maxItems);
  return { items: items.slice(0, maxItems), truncated: Boolean(nextToken) || items.length > maxItems };
}
