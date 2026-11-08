import type { APIRoute } from 'astro';
import { db, Edition, Result, eq, asc } from 'astro:db';
import { yearsWithResults } from '../../lib/results';

// Wyniki edycji jako JSON: dla agentów AI, aplikacji i dziennikarzy.
export async function getStaticPaths() {
  return (await yearsWithResults()).map(({ year }) => ({ params: { year: String(year) } }));
}

export const GET: APIRoute = async ({ params }) => {
  const year = Number(params.year);
  const [edition] = await db.select().from(Edition).where(eq(Edition.year, year));
  const results = await db.select().from(Result).where(eq(Result.year, year)).orderBy(asc(Result.race), asc(Result.place));
  const body = {
    event: 'Cross Straceńców Głogów',
    year,
    date: edition.date,
    races: [...new Set(results.map((r) => r.race))],
    results: results.map(({ id, year: _y, ...r }) => r),
  };
  return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
