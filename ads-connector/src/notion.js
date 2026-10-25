// Reads one row of the Notion "Ads Approval Queue" (read-only integration token in Secret Manager).
// The connector never writes to Notion; Claude updates the row through the Notion connector.
import { SECRETS, ADS_QUEUE_DATABASE_ID } from './config.js';
import { getSecret } from './secrets.js';

const NOTION_API = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

let fetchImpl = (...a) => fetch(...a);
export function setNotionFetchForTests(fn) { fetchImpl = fn; }

async function notion(method, path, body) {
  const res = await fetchImpl(NOTION_API + path, {
    method,
    headers: {
      Authorization: `Bearer ${await getSecret(SECRETS.notionQueueToken)}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Notion ${path.split('/')[1]} failed: HTTP ${res.status} ${json.code || ''}`.trim());
  return json;
}

const plain = (rich) => (rich || []).map((r) => r.plain_text || '').join('');
const prop = (p) => {
  if (!p) return null;
  switch (p.type) {
    case 'title': return plain(p.title);
    case 'rich_text': return plain(p.rich_text);
    case 'select': return p.select?.name ?? null;
    case 'status': return p.status?.name ?? null;
    case 'date': return p.date?.start ?? null;
    case 'unique_id': return p.unique_id ? `${p.unique_id.prefix ? `${p.unique_id.prefix}-` : ''}${p.unique_id.number}` : null;
    default: return null;
  }
};

export function parseRowId(rowId) {
  const m = /^(?:ADS-)?(\d+)$/i.exec(String(rowId || '').trim());
  if (!m) throw new Error(`Queue row ID must look like ADS-92 (got "${rowId}")`);
  return Number(m[1]);
}

// Returns the queue row with its status and all text on it (properties + page body),
// so the caller can check the approved plan code is written on the row.
export async function getQueueRow(rowId) {
  const number = parseRowId(rowId);
  const q = await notion('POST', `/databases/${ADS_QUEUE_DATABASE_ID}/query`, {
    filter: { property: 'ID', unique_id: { equals: number } },
    page_size: 2,
  });
  if (q.results?.length !== 1) throw new Error(`Queue row ADS-${number} not found in the Ads Approval Queue`);
  const page = q.results[0];
  if (page.parent?.database_id?.replace(/-/g, '') !== ADS_QUEUE_DATABASE_ID) throw new Error('Row is not in the Ads Approval Queue');
  const p = page.properties || {};
  const blocks = await notion('GET', `/blocks/${page.id}/children?page_size=100`);
  const body = (blocks.results || []).map((b) => plain(b[b.type]?.rich_text)).join('\n');
  const text = [prop(p.Change), prop(p.Evidence), prop(p['Result / notes']), prop(p['Goal / campaign']), body].join('\n');
  return {
    id: prop(p.ID) || `ADS-${number}`,
    url: page.url,
    change: prop(p.Change),
    status: prop(p.Status),
    client: prop(p.Client),
    market: prop(p.Market),
    lever: prop(p.Lever),
    approvedOn: prop(p['Approved on']),
    text,
  };
}
