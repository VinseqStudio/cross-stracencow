// Pobiera wyniki z Datasport i zapisuje je jako JSON w db/data/results/<rok>.json.
// Użycie: node scripts/import-datasport.mjs 2025:5483 2024:4696
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('db/data/results');
const args = process.argv.slice(2);
const jobs = args.length ? args : ['2025:5483', '2024:4696'];

const title = (s) => s.toLowerCase().replace(/(^|[\s-])(\p{L})/gu, (_m, a, b) => a + b.toUpperCase());

function decode(buf) {
  const utf = new TextDecoder('utf-8').decode(buf);
  return utf.includes('\uFFFD') ? new TextDecoder('windows-1250').decode(buf) : utf;
}

function grab(html, name) {
  const start = html.indexOf(`${name} = [{`);
  if (start < 0) return [];
  const from = start + name.length + 3;
  const end = html.indexOf('}];', from);
  return JSON.parse(html.slice(from, end + 2));
}

for (const job of jobs) {
  const [year, id] = job.split(':');
  const url = `https://wyniki.datasport.pl/results${id}/indexnew.php`;
  const res = await fetch(url, { headers: { 'User-Agent': 'cross-stracencow-site-import' } });
  if (!res.ok) { console.error(year, res.status); continue; }
  const html = decode(Buffer.from(await res.arrayBuffer()));
  const kateg = grab(html, 'kateg');
  const rows = grab(html, 'results');

  // Kategorie główne (bez " - K30" itp.), bez klasyfikacji dodatkowych (Monar, KGHM).
  const races = new Map();
  for (const k of kateg) {
    if (k.NAZWA.includes(' - ') || /monar|kghm/i.test(k.NAZWA)) continue;
    races.set(String(Number(k.DYSTANS) - 1), { name: k.NAZWA.trim(), km: Number(k.ODLEGLOSC) / 1000 });
  }

  const results = rows
    .filter((r) => r.czas && Number(r.msc) > 0)
    .map((r) => ({
      race: races.get(r.dystans)?.name ?? `Dystans ${r.dystans}`,
      place: Number(r.msc),
      placeSex: Number(r.mscplec) || null,
      bib: r.numer,
      name: `${title(r.imie.trim())} ${title(r.nazwisko.trim())}`.replace(/\s*-\s*/g, '-'),
      city: r.miasto ? title(r.miasto.trim()) : null,
      club: r.druzyna?.trim() || null,
      sex: r.plec === 'K' ? 'K' : 'M',
      category: r.katw?.trim() || null,
      time: r.czas.replace(/,\d+$/, '').replace(/^00:/, ''),
    }))
    .sort((a, b) => a.race.localeCompare(b.race, 'pl') || a.place - b.place);

  const date = kateg[0]?.DATA ?? null;
  const out = { year: Number(year), date, source: url, races: [...new Set(results.map((r) => r.race))], results };
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, `${year}.json`), JSON.stringify(out, null, 1));
  console.log(year, date, out.races, results.length);
}
