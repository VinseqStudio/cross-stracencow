// Pobiera wyniki z live.sts-timing.pl (edycje 2022 i 2023) do db/data/results/<rok>.json.
// Użycie: node scripts/import-sts.mjs 2023:cross2023 2022:cross2022
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('db/data/results');
const jobs = process.argv.slice(2).length ? process.argv.slice(2) : ['2023:cross2023', '2022:cross2022'];
const title = (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'cross-stracencow-site-import' } });
  const buf = Buffer.from(await r.arrayBuffer());
  return new TextDecoder('utf-8').decode(buf);
}

for (const job of jobs) {
  const [year, slug] = job.split(':');
  const base = `https://live.sts-timing.pl/${slug}/`;
  const home = await get(base);
  const names = [...home.matchAll(/<a[^>]*data-toggle="collapse"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => strip(m[1]));
  const results = [];
  for (let d = 1; d <= names.length; d++) {
    const race = title(names[d - 1]);
    const html = await get(`${base}index.php?dystans=${d}`);
    for (const tr of html.match(/<tr[\s\S]*?<\/tr>/g) ?? []) {
      const cells = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => strip(m[1]));
      if (cells.length < 8 || !/^\d+$/.test(cells[0])) continue;
      // Kolumny: miejsce, numer, "Nazwisko Imię", kraj, miejscowość, drużyna, płeć, brutto, netto, strata
      const [place, bib, fullName, , city, club, sex, , chip] = cells;
      const parts = fullName.split(' ');
      results.push({
        race, place: Number(place), placeSex: null, bib,
        name: title([...parts.slice(1), parts[0]].join(' ')).replace(/\s*-\s*/g, '-'),
        city: city ? title(city) : null,
        club: club || null,
        sex: sex === 'K' ? 'K' : 'M',
        category: null,
        time: chip.replace(/^00:/, ''),
      });
    }
  }
  const out = { year: Number(year), date: null, source: base, races: [...new Set(results.map((r) => r.race))], results };
  fs.writeFileSync(path.join(OUT, `${year}.json`), JSON.stringify(out, null, 1));
  console.log(year, out.races, results.length, results[0]);
}
