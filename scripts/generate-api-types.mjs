#!/usr/bin/env node
/**
 * Fetches the OpenAPI schema from the running BE and generates TypeScript types.
 * Ensure the backend is running (e.g. http://localhost:8000) or set VITE_API_URL.
 *
 * Usage: node scripts/generate-api-types.mjs
 *   VITE_API_URL=http://localhost:8000/api/v1 (default) is used as the API base.
 */
import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v1';
const base = baseUrl.replace(/\/$/, '');
const openapiUrl = base.endsWith('/v1') ? `${base}/openapi.json` : `${base}/v1/openapi.json`;
const outDir = join(root, 'src', 'generated');
const outFile = join(outDir, 'api.d.ts');

console.log('Fetching OpenAPI schema from', openapiUrl);
let res;
try {
  res = await fetch(openapiUrl);
} catch (e) {
  console.error('Failed to fetch schema. Is the backend running?', e.message);
  process.exit(1);
}
if (!res.ok) {
  console.error('Schema request failed:', res.status, res.statusText);
  process.exit(1);
}
const schema = await res.json();
mkdirSync(outDir, { recursive: true });
const schemaPath = join(outDir, 'openapi.json');
writeFileSync(schemaPath, JSON.stringify(schema, null, 2), 'utf8');
console.log('Schema written to', schemaPath);

console.log('Generating TypeScript types...');
execSync(`npx openapi-typescript "${schemaPath}" -o "${outFile}"`, {
  stdio: 'inherit',
  cwd: root,
});
console.log('Types written to', outFile);
