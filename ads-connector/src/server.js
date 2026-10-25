// Remote MCP connector (Cloud Run service). Stateless Streamable HTTP on /mcp, behind OAuth.
import express from 'express';
import { pathToFileURL } from 'node:url';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { mcpAuthRouter, getOAuthProtectedResourceMetadataUrl } from '@modelcontextprotocol/sdk/server/auth/router.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { PUBLIC_URL, MCP_URL, SECRETS, SCOPE } from './config.js';
import { getSecret } from './secrets.js';
import { TdsOAuthProvider, GOOGLE_CALLBACK_PATH } from './auth.js';
import { buildMcpServer } from './tools.js';
import { info, error } from './log.js';

export function createApp(provider) {
  const app = express();
  app.set('trust proxy', 1); // Cloud Run's front end
  app.disable('x-powered-by');

  app.get('/healthz', (_req, res) => res.json({ ok: true }));

  // Accept HTTP Basic client authentication on /token as well as client_secret_post.
  app.post('/token', express.urlencoded({ extended: false }), (req, _res, next) => {
    const m = /^Basic (.+)$/i.exec(req.headers.authorization || '');
    if (m && !req.body.client_id) {
      const [id, secret] = Buffer.from(m[1], 'base64').toString('utf8').split(':');
      req.body.client_id = decodeURIComponent(id || '');
      req.body.client_secret = decodeURIComponent(secret || '');
    }
    next();
  });

  app.use(mcpAuthRouter({
    provider,
    issuerUrl: new URL(PUBLIC_URL),
    resourceServerUrl: new URL(MCP_URL),
    scopesSupported: [SCOPE],
    resourceName: 'TDS Amazon Ads (read-only)',
  }));

  app.get(GOOGLE_CALLBACK_PATH, async (req, res) => {
    try {
      res.redirect(302, await provider.handleGoogleCallback(req.query));
    } catch (e) {
      error('Google callback rejected', { reason: e.message });
      res.status(400).send('Sign-in link expired or invalid. Start again from Claude.');
    }
  });

  const bearer = requireBearerAuth({
    verifier: provider,
    requiredScopes: [SCOPE],
    resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(new URL(MCP_URL)),
    expectedResource: new URL(MCP_URL),
  });

  app.post('/mcp', bearer, express.json({ limit: '1mb' }), async (req, res) => {
    const server = buildMcpServer({ email: req.auth?.extra?.email });
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    res.on('close', () => { transport.close(); server.close(); });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (e) {
      error('MCP request failed', { reason: e.message });
      if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
    }
  });
  app.all('/mcp', bearer, (_req, res) => res.status(405).set('Allow', 'POST').send('Method not allowed'));

  return app;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const signingKey = await getSecret(SECRETS.tokenSigningKey);
  const app = createApp(new TdsOAuthProvider({ signingKey }));
  const port = Number(process.env.PORT || 8080);
  app.listen(port, () => info('TDS Ads connector listening', { port, url: MCP_URL }));
}
