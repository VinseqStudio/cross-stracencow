import fs from 'node:fs';
import path from 'node:path';
import { db, Edition, Result } from 'astro:db';
import { editions } from './data/editions';

// Wyniki leżą w db/data/results/<rok>.json (skrypty: npm run import:results, node scripts/import-sts.mjs).
export default async function seed() {
  await db.insert(Edition).values(editions);

  const dir = path.resolve('db/data/results');
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const { year, results } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    const rows = results.map((r: Record<string, unknown>) => ({ ...r, year }));
    for (let i = 0; i < rows.length; i += 200) await db.insert(Result).values(rows.slice(i, i + 200));
  }
}
