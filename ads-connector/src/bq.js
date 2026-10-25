// BigQuery storage in amazon_ads. Report tables are partitioned by date and clustered by profile.
// A pull replaces one profile's date range atomically: load to a staging table, then
// DELETE + INSERT in a single transaction, so re-pulling a day never double-counts.
import { writeFileSync, rmSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { BigQuery } from '@google-cloud/bigquery';
import { GCP_PROJECT, DATASET, BQ_LOCATION } from './config.js';
import { REPORTS, tableSchema } from './reports.js';
import { info } from './log.js';

let bq;
const client = () => (bq ||= new BigQuery({ projectId: GCP_PROJECT, location: BQ_LOCATION }));

export const OTHER_TABLES = {
  // Every write made through the connector (write tools come in the next build stage).
  change_log: [
    { name: 'change_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'queue_row_id', type: 'STRING' },
    { name: 'tool', type: 'STRING' },
    { name: 'called_by', type: 'STRING' },
    { name: 'called_at', type: 'TIMESTAMP' },
    { name: 'profile_id', type: 'STRING' },
    { name: 'entity_type', type: 'STRING' },
    { name: 'entity_id', type: 'STRING' },
    { name: 'field', type: 'STRING' },
    { name: 'old_value', type: 'STRING' },
    { name: 'new_value', type: 'STRING' },
    { name: 'dry_run', type: 'BOOL' },
    { name: 'status', type: 'STRING' },
    { name: 'verified_value', type: 'STRING' },
    { name: 'notes', type: 'STRING' },
  ],
  // Target ACoS per profile · campaign/ad group, loaded from each client's PPC Strategy task.
  target_acos_config: [
    { name: 'profile_id', type: 'STRING', mode: 'REQUIRED' },
    { name: 'client', type: 'STRING' },
    { name: 'market', type: 'STRING' },
    { name: 'campaign_id', type: 'STRING' },
    { name: 'ad_group_id', type: 'STRING' },
    { name: 'target_acos', type: 'NUMERIC' },
    { name: 'source', type: 'STRING' },
    { name: 'effective_from', type: 'DATE' },
    { name: 'updated_by', type: 'STRING' },
    { name: 'updated_at', type: 'TIMESTAMP' },
  ],
};

export async function ensureTables() {
  const ds = client().dataset(DATASET);
  const wanted = [
    ...Object.keys(REPORTS).map((type) => ({
      name: REPORTS[type].table,
      options: {
        schema: tableSchema(type),
        timePartitioning: { type: 'DAY', field: 'date' },
        clustering: { fields: ['profile_id', 'campaign_id'] },
      },
    })),
    ...Object.entries(OTHER_TABLES).map(([name, schema]) => ({ name, options: { schema } })),
  ];
  for (const { name, options } of wanted) {
    const [exists] = await ds.table(name).exists();
    if (!exists) {
      await ds.createTable(name, options);
      info('Created table', { table: name });
    }
  }
}

export async function replaceRange(type, profileId, startDate, endDate, rows) {
  const table = REPORTS[type].table;
  const full = `\`${GCP_PROJECT}.${DATASET}.${table}\``;
  const params = { profileId: String(profileId), startDate, endDate };
  const del = `DELETE FROM ${full} WHERE profile_id = @profileId AND date BETWEEN @startDate AND @endDate;`;

  if (!rows.length) {
    await client().query({ query: del, params, location: BQ_LOCATION });
    return 0;
  }

  const ds = client().dataset(DATASET);
  const stageName = `_stage_${table}_${randomUUID().replace(/-/g, '')}`;
  const schema = tableSchema(type);
  const file = join(tmpdir(), `${stageName}.ndjson`);
  writeFileSync(file, rows.map((r) => JSON.stringify(r)).join('\n'));
  try {
    await ds.createTable(stageName, { schema, expirationTime: String(Date.now() + 3_600_000) });
    await ds.table(stageName).load(file, { sourceFormat: 'NEWLINE_DELIMITED_JSON', schema: { fields: schema } });
    const cols = schema.map((f) => `\`${f.name}\``).join(', ');
    await client().query({
      query: `BEGIN TRANSACTION;
${del}
INSERT INTO ${full} (${cols}) SELECT ${cols} FROM \`${GCP_PROJECT}.${DATASET}.${stageName}\`;
COMMIT TRANSACTION;`,
      params,
      location: BQ_LOCATION,
    });
  } finally {
    rmSync(file, { force: true });
    await ds.table(stageName).delete({ ignoreNotFound: true }).catch(() => {});
  }
  return rows.length;
}

export async function query(sql, params = {}) {
  const [rows] = await client().query({ query: sql, params, location: BQ_LOCATION });
  return rows;
}
