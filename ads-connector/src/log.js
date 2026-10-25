// Structured logging for Cloud Logging. Redacts anything that looks like a credential.

const SENSITIVE = /token|secret|authorization|password|refresh|client_id|code_verifier|^code$/i;

function redact(value, depth = 0) {
  if (depth > 5 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map((v) => redact(v, depth + 1));
  const out = {};
  for (const [k, v] of Object.entries(value)) out[k] = SENSITIVE.test(k) ? '[redacted]' : redact(v, depth + 1);
  return out;
}

export function log(severity, message, fields = {}) {
  process.stdout.write(JSON.stringify({ severity, message, ...redact(fields) }) + '\n');
}

export const info = (m, f) => log('INFO', m, f);
export const warn = (m, f) => log('WARNING', m, f);
export const error = (m, f) => log('ERROR', m, f);
