import { readFileSync, readdirSync } from 'node:fs';

export const dataDir = new URL('../src/lib/data/', import.meta.url);
export const readJSON = (path) => JSON.parse(readFileSync(new URL(path, dataDir), 'utf8'));
export const rows = readJSON('reports-4471.json');
export const notes = readJSON('desk-notes.json');
export const tenants = new Map(readdirSync(new URL('tenants/', dataDir)).map((file) => {
  const tenant = readJSON(`tenants/${file}`);
  return [tenant.handle, tenant];
}));
export const tenantOf = (r) => tenants.get(r.tenant);
