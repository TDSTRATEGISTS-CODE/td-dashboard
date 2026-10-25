// Fixed settings for the TDS Amazon Ads connector (Build brief v1, Notion:
// "Ads API Migration — Perpetua Replacement — Project Plan"). Nothing here is a secret.

export const GCP_PROJECT = process.env.GCP_PROJECT || 'tds-amazon-ads';
export const DATASET = process.env.BQ_DATASET || 'amazon_ads';
export const BQ_LOCATION = 'europe-west2';

// Public base URL of the Cloud Run service, e.g. https://ads-connector-123456789.europe-west2.run.app
export const PUBLIC_URL = (process.env.PUBLIC_URL || 'http://localhost:8080').replace(/\/$/, '');
export const MCP_URL = `${PUBLIC_URL}/mcp`;

// Amazon Ads API, EU region.
export const ADS_API_BASE = 'https://advertising-api-eu.amazon.com';
export const ADS_TOKEN_URL = 'https://api.amazon.co.uk/auth/o2/token';

// Secret Manager secret names. Values are only ever read at runtime, never logged.
export const SECRETS = {
  adsClientId: 'ads-client-id',
  adsClientSecret: 'ads-client-secret',
  adsRefreshTokenEu: 'ads-refresh-token-eu',
  mcpClientSecret: 'mcp-oauth-client-secret',
  tokenSigningKey: 'mcp-token-signing-key',
  googleClientId: 'google-oauth-client-id',
  googleClientSecret: 'google-oauth-client-secret',
  notionQueueToken: 'notion-ads-queue-token',
};

// Profile allowlist: the connector may only call these profile IDs. Anything else is refused in code.
export const PROFILE_ALLOWLIST = Object.freeze({
  '2067592198905075': { client: 'Harvaza', market: 'UK' },
  '783989167267519': { client: 'Balance 8', market: 'UK' },
  '2512597432650618': { client: 'NKV', market: 'UK' },
  '3482210927956978': { client: 'AMACX', market: 'DE' },
  '3517192262662766': { client: 'AMACX', market: 'FR' },
  '1996279639090983': { client: 'AMACX', market: 'IT' },
  '455713066943443': { client: 'AMACX', market: 'ES' },
  '4023537660515053': { client: 'HSB', market: 'DE' }, // advertises under the Mokum Dusk profile
});

// Who may use the connector: Google accounts in the TDS Workspace domain only.
// ALLOWED_EMAILS (comma-separated) narrows it further to named people if set.
export const ALLOWED_DOMAIN = 'tdstrategists.co.uk';
export const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS || '')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);

// The one OAuth client allowed to connect: the TDS Claude Team custom connector.
export const CLAUDE_CLIENT_ID = 'tds-claude-connector';
export const CLAUDE_REDIRECT_URIS = [
  'https://claude.ai/api/mcp/auth_callback',
  'https://claude.com/api/mcp/auth_callback',
];

export const SCOPE = 'ads.read';

// Notion "Ads Approval Queue" database (Client Account Tasks › Amazon Advertising Actions).
export const ADS_QUEUE_DATABASE_ID = '5794bf8e26b2470ea3216d45273227f6';

// Change-tool guards. Defaults are deliberately tight; bid rules are Open decision 3 in the Notion plan.
const num = (name, dflt) => (process.env[name] === undefined ? dflt : Number(process.env[name]));
export const GUARDS = {
  writesEnabled: process.env.WRITES_ENABLED === 'true', // master switch; off = dry run only
  // Profiles handed over from Perpetua (comma-separated IDs). Writes refused for any other profile.
  releasedProfiles: (process.env.PERPETUA_RELEASED_PROFILES || '').split(',').map((s) => s.trim()).filter(Boolean),
  maxItemsPerRun: num('MAX_ITEMS_PER_RUN', 100),
  maxBidChangePct: num('MAX_BID_CHANGE_PCT', 25),
  minBid: num('MIN_BID', 0.02),
  maxBid: num('MAX_BID', 3),
  maxBudgetChangePct: num('MAX_BUDGET_CHANGE_PCT', 50),
  maxDailyBudget: num('MAX_DAILY_BUDGET', 100),
  maxPlacementPct: num('MAX_PLACEMENT_PCT', 100),
  approvalMaxAgeDays: num('APPROVAL_MAX_AGE_DAYS', 14),
};
