// Authentication: only the TDS Claude Team connector, used by a signed-in TDS Google account, can call /mcp.
//
// The connector is its own OAuth 2.1 authorisation server (endpoints from the MCP SDK's mcpAuthRouter):
//   1. One pre-registered client (CLAUDE_CLIENT_ID + a secret in Secret Manager), redirecting only to claude.ai.
//      No dynamic registration.
//   2. /authorize hands off to Google sign-in. Only verified accounts in the tdstrategists.co.uk
//      Workspace (optionally narrowed by ALLOWED_EMAILS) get an authorisation code.
//   3. PKCE (S256) is enforced by the SDK; codes are single-use and expire in 5 minutes.
//   4. Tokens are HMAC-signed with mcp-token-signing-key. Rotating that secret logs everyone out.
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { OAuth2Client } from 'google-auth-library';
import { InvalidGrantError, InvalidTokenError } from '@modelcontextprotocol/sdk/server/auth/errors.js';
import {
  PUBLIC_URL, MCP_URL, SECRETS, CLAUDE_CLIENT_ID, CLAUDE_REDIRECT_URIS, ALLOWED_DOMAIN, ALLOWED_EMAILS, SCOPE,
} from './config.js';
import { getSecret } from './secrets.js';
import { info, warn } from './log.js';

const ACCESS_TTL = 3600;
const REFRESH_TTL = 30 * 86400;
const CODE_TTL = 300;
const STATE_TTL = 600;
export const GOOGLE_CALLBACK_PATH = '/oauth/google/callback';

const b64 = (s) => Buffer.from(s).toString('base64url');
const now = () => Math.floor(Date.now() / 1000);

export function signToken(key, payload) {
  const body = b64(JSON.stringify(payload));
  const sig = createHmac('sha256', key).update(body).digest('base64url');
  return `tds1.${body}.${sig}`;
}

export function verifyToken(key, token, typ) {
  const [v, body, sig] = String(token || '').split('.');
  if (v !== 'tds1' || !body || !sig) throw new Error('Malformed token');
  const expected = Buffer.from(createHmac('sha256', key).update(body).digest('base64url'));
  const given = Buffer.from(sig);
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) throw new Error('Bad token signature');
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  if (payload.typ !== typ) throw new Error('Wrong token type');
  if (!payload.exp || payload.exp < now()) throw new Error('Token expired');
  return payload;
}

export function isAllowedGoogleIdentity(claims) {
  const email = String(claims?.email || '').toLowerCase();
  if (!claims?.email_verified) return false;
  if (claims.hd !== ALLOWED_DOMAIN || !email.endsWith(`@${ALLOWED_DOMAIN}`)) return false;
  return ALLOWED_EMAILS.length === 0 || ALLOWED_EMAILS.includes(email);
}

export class TdsOAuthProvider {
  constructor({ signingKey, verifyGoogleCode } = {}) {
    this.signingKey = signingKey;
    this.usedCodes = new Map(); // jti -> exp; single-use codes (service runs as one instance)
    // Exchanges a Google auth code for verified ID-token claims. Overridable in tests.
    this.verifyGoogleCode = verifyGoogleCode || defaultVerifyGoogleCode;
  }

  get clientsStore() {
    return {
      getClient: async (clientId) => {
        if (clientId !== CLAUDE_CLIENT_ID) return undefined;
        return {
          client_id: CLAUDE_CLIENT_ID,
          client_secret: await getSecret(SECRETS.mcpClientSecret),
          client_name: 'TDS Claude Team connector',
          redirect_uris: CLAUDE_REDIRECT_URIS,
          grant_types: ['authorization_code', 'refresh_token'],
          response_types: ['code'],
          token_endpoint_auth_method: 'client_secret_post',
          scope: SCOPE,
        };
      },
    };
  }

  // Step 1: Claude → /authorize → here. Carry the request in a signed state and send the user to Google.
  async authorize(client, params, res) {
    const state = signToken(this.signingKey, {
      typ: 'gstate', cid: client.client_id, ru: params.redirectUri, cc: params.codeChallenge,
      st: params.state, exp: now() + STATE_TTL, n: randomUUID(),
    });
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.search = new URLSearchParams({
      client_id: await getSecret(SECRETS.googleClientId),
      redirect_uri: PUBLIC_URL + GOOGLE_CALLBACK_PATH,
      response_type: 'code',
      scope: 'openid email',
      hd: ALLOWED_DOMAIN,
      prompt: 'select_account',
      state,
    }).toString();
    res.redirect(302, url.href);
  }

  // Step 2: Google → /oauth/google/callback. Returns the redirect back to Claude.
  async handleGoogleCallback(query) {
    const s = verifyToken(this.signingKey, query.state, 'gstate');
    const back = new URL(s.ru);
    if (s.st) back.searchParams.set('state', s.st);
    let claims = null;
    if (query.code && !query.error) {
      try { claims = await this.verifyGoogleCode(String(query.code)); } catch (e) { warn('Google sign-in check failed', { reason: e.message }); }
    }
    if (!claims || !isAllowedGoogleIdentity(claims)) {
      warn('Connector sign-in refused', { email: claims?.email || null, hd: claims?.hd || null });
      back.searchParams.set('error', 'access_denied');
      back.searchParams.set('error_description', `Only ${ALLOWED_DOMAIN} accounts may use this connector`);
      return back.href;
    }
    const code = signToken(this.signingKey, {
      typ: 'code', cid: s.cid, ru: s.ru, cc: s.cc, sub: claims.email.toLowerCase(), exp: now() + CODE_TTL, jti: randomUUID(),
    });
    info('Connector sign-in allowed', { email: claims.email.toLowerCase() });
    back.searchParams.set('code', code);
    return back.href;
  }

  _readCode(client, code) {
    let c;
    try { c = verifyToken(this.signingKey, code, 'code'); } catch (e) { throw new InvalidGrantError(e.message); }
    if (c.cid !== client.client_id) throw new InvalidGrantError('Code was issued to another client');
    return c;
  }

  async challengeForAuthorizationCode(client, code) {
    return this._readCode(client, code).cc;
  }

  _issue(cid, sub) {
    return {
      access_token: signToken(this.signingKey, { typ: 'access', cid, sub, aud: MCP_URL, scope: SCOPE, exp: now() + ACCESS_TTL }),
      token_type: 'bearer',
      expires_in: ACCESS_TTL,
      refresh_token: signToken(this.signingKey, { typ: 'refresh', cid, sub, exp: now() + REFRESH_TTL, n: randomUUID() }),
      scope: SCOPE,
    };
  }

  async exchangeAuthorizationCode(client, code, _verifier, redirectUri) {
    const c = this._readCode(client, code);
    if (redirectUri && redirectUri !== c.ru) throw new InvalidGrantError('redirect_uri mismatch');
    for (const [jti, exp] of this.usedCodes) if (exp < now()) this.usedCodes.delete(jti);
    if (this.usedCodes.has(c.jti)) throw new InvalidGrantError('Authorisation code already used');
    this.usedCodes.set(c.jti, c.exp);
    return this._issue(c.cid, c.sub);
  }

  async exchangeRefreshToken(client, refreshToken) {
    let r;
    try { r = verifyToken(this.signingKey, refreshToken, 'refresh'); } catch (e) { throw new InvalidGrantError(e.message); }
    if (r.cid !== client.client_id) throw new InvalidGrantError('Refresh token was issued to another client');
    if (ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(r.sub)) throw new InvalidGrantError('User no longer allowed');
    return this._issue(r.cid, r.sub);
  }

  async verifyAccessToken(token) {
    let a;
    try { a = verifyToken(this.signingKey, token, 'access'); } catch (e) { throw new InvalidTokenError(e.message); }
    if (ALLOWED_EMAILS.length && !ALLOWED_EMAILS.includes(a.sub)) throw new InvalidTokenError('User no longer allowed');
    return { token, clientId: a.cid, scopes: [a.scope], expiresAt: a.exp, resource: new URL(a.aud), extra: { email: a.sub } };
  }
}

async function defaultVerifyGoogleCode(code) {
  const clientId = await getSecret(SECRETS.googleClientId);
  const google = new OAuth2Client({
    clientId,
    clientSecret: await getSecret(SECRETS.googleClientSecret),
    redirectUri: PUBLIC_URL + GOOGLE_CALLBACK_PATH,
  });
  const { tokens } = await google.getToken(code);
  const ticket = await google.verifyIdToken({ idToken: tokens.id_token, audience: clientId });
  return ticket.getPayload();
}
