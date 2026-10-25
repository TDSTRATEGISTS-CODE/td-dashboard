// Reads secrets from Google Secret Manager at runtime. Values are cached in memory only.
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { GCP_PROJECT } from './config.js';

let client;
const cache = new Map();
let override = null; // tests only

export function setSecretSourceForTests(fn) { override = fn; cache.clear(); }

export async function getSecret(name) {
  if (cache.has(name)) return cache.get(name);
  let value;
  if (override) {
    value = await override(name);
  } else {
    client ||= new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
      name: `projects/${GCP_PROJECT}/secrets/${name}/versions/latest`,
    });
    value = version.payload.data.toString('utf8').trim();
  }
  if (!value) throw new Error(`Secret ${name} is empty`);
  cache.set(name, value);
  return value;
}
