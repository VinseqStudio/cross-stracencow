// Odczyt wyników z Astro DB: lata z wynikami, zwycięzcy edycji i zdjęcia przypisane do lat.
import { db, Result, eq, asc } from 'astro:db';

/** Dystans z nazwy biegu ("Bieg Złoty 21 km" → 21); biegi bez km na końcu. */
export const km = (race: string) => Number(race.match(/(\d+)\s*km/)?.[1] ?? 0);

export async function resultsOf(year: number) {
  const rows = await db.select().from(Result).where(eq(Result.year, year)).orderBy(asc(Result.race), asc(Result.place));
  const races = [...new Set(rows.map((r) => r.race))].sort((a, b) => km(b) - km(a) || a.localeCompare(b, 'pl'));
  return { rows, races };
}

/** Zwycięzca i zwyciężczyni każdego biegu, od najdłuższego. */
export async function winnersOf(year: number) {
  const { rows, races } = await resultsOf(year);
  return races
    .filter((race) => !/sztafet/i.test(race))
    .map((race) => ({
      race,
      man: rows.find((r) => r.race === race && r.sex === 'M'),
      woman: rows.find((r) => r.race === race && r.sex === 'K'),
    }));
}

/** Lata, dla których są tabele wyników, od najnowszego, z liczbą osób na mecie. */
export async function yearsWithResults() {
  const rows = await db.select({ year: Result.year }).from(Result);
  const counts = new Map<number, number>();
  for (const r of rows) counts.set(r.year, (counts.get(r.year) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[0] - a[0]).map(([year, n]) => ({ year, n }));
}

// Zdjęcie roku na kafel i nagłówek strony wyników.
export const yearPhoto: Record<number, { rel: string; alt: string }> = {
  2025: { rel: '2025/2025-08.jpg', alt: 'Zawodnik wbiega na ostatnią prostą między banerami do mety' },
  2024: { rel: '2024/2024-10.jpg', alt: 'Biegacze ruszają spod bramy startu na trawiastym torze' },
  2023: { rel: '2023/2023-08.jpg', alt: 'Trzy zawodniczki biegną obok siebie po trawie' },
  2022: { rel: '2022/2022-13.jpg', alt: 'Zawodnik z numerem 33 wbiega pod zegar na mecie' },
};
