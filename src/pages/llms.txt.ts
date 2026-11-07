import type { APIRoute } from 'astro';
import { db, Edition, Result, asc } from 'astro:db';
import { event, distances, schedule, faq } from '../data/event';

// Opis strony w Markdown dla agentów AI (standard llms.txt).
export const GET: APIRoute = async ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const editions = await db.select().from(Edition).orderBy(asc(Edition.year));
  const withData = new Set((await db.select({ year: Result.year }).from(Result).groupBy(Result.year)).map((r) => r.year));

  const md = `# Cross Straceńców Głogów

> Bieg przełajowy z naturalnymi przeszkodami (rowy z wodą, błoto, piaszczyste podbiegi i zbiegi) na torze motocrossowym Górków w Głogowie. Organizator: ${event.organizer.name}. Odbywa się co roku od 2011 r.

## Następna edycja

- Edycja: ${event.edition}
- Termin: ${event.dates.label}${event.dates.assumed ? ' (do potwierdzenia w regulaminie)' : ''}
- Miejsce: ${event.venue.name}, ${event.venue.city}
- Zapisy: ${event.registration.open ? 'otwarte' : 'jeszcze nieotwarte'}
- Kontakt: ${event.organizer.email}

## Dystanse

${distances.map((d) => `- ${d.name}, ${d.distance}: ${d.description} ${d.facts.map((f) => `${f.label}: ${f.value}`).join('; ')}. Opłata ${d.price}, limit ${d.limit}.`).join('\n')}

## Program

Sobota:
${schedule.saturday.map((r) => `- ${r.time} ${r.what}${r.sub ? `: ${r.sub}` : ''}`).join('\n')}

Niedziela:
${schedule.sunday.map((r) => `- ${r.time} ${r.what}${r.sub ? `: ${r.sub}` : ''}`).join('\n')}

## Pytania

${faq.map((f) => `- ${f.q} ${f.a}`).join('\n')}

## Wyniki

${editions
  .map((e) => `- ${e.year} (${e.number} edycja): ${base}/wyniki/${e.year}/${withData.has(e.year) ? ` (JSON: ${base}/wyniki/${e.year}.json)` : ' (tabele w przygotowaniu)'}`)
  .join('\n')}

## Strony

- [Strona główna](${base}/)
- [Galeria](${base}/galeria/)
- [Wyniki](${base}/wyniki/)
`;
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
