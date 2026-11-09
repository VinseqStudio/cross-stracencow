import type { APIRoute } from 'astro';
import { db, Edition, asc } from 'astro:db';
import { event, distances, schedule, faq } from '../data/event';
import { yearsWithResults, winnersOf } from '../lib/results';
import { STUDIO } from '../lib/seo';

// Opis strony w Markdown dla agentów AI i asystentów (standard llms.txt: https://llmstxt.org).
// Układ: tytuł, streszczenie w cytacie, najważniejsze fakty, potem sekcje z linkami „[nazwa](adres): opis”.
// Wszystko z tych samych danych co strona (src/data/event.ts, Astro DB), więc nie rozjeżdża się z treścią.
export const GET: APIRoute = async ({ site }) => {
  const base = site!.href.replace(/\/$/, '');
  const editions = await db.select().from(Edition).orderBy(asc(Edition.year));
  const years = await yearsWithResults();
  const latest = years[0];
  const winners = latest ? await winnersOf(latest.year) : [];
  const o = event.organizer;
  const reg = event.registration;
  const first = editions[0]?.year;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${event.venue.name}, ${event.venue.city}`)}`;

  const md = `# ${event.name} Głogów

> ${event.name} to coroczny bieg przełajowy z naturalnymi przeszkodami (rowy z wodą, błoto, piaszczyste podbiegi i zbiegi, Ściana Płaczu) na torze motocrossowym w Górkowie, w Głogowie (województwo dolnośląskie). Dystanse: 10 km, 5 km, sztafeta 6 × 1 km i biegi dzieci Cross Junior. Każdy, kto dobiegnie, dostaje medal Finisher. Organizator: ${o.name}. Bieg odbywa się od ${first} r.

## Najważniejsze fakty

- Najbliższa edycja: ${event.edition} (bieg odbywa się co roku od ${first} r.)
- Termin: ${event.dates.label}${event.dates.assumed ? ' (do potwierdzenia w regulaminie)' : ''}
- Miejsce: ${event.venue.name}, ${event.venue.city}. Start i meta przy torze. Dojazd: ${maps}
- Zapisy: ${reg.open ? `otwarte, przez zewnętrznego operatora: ${reg.url}` : 'jeszcze nieotwarte'}
- Opłata startowa: od ${event.feeFrom} (Cross Junior) do ${distances.map((d) => d.price).sort((a, b) => parseInt(b) - parseInt(a))[0]} (sztafeta, za całą drużynę)
- Pakiet startowy: numer z chipem i pomiar czasu, medal Finisher, posiłek po biegu, woda i izotonik na trasie, opieka medyczna, depozyt
- Trasa: pętla 5 km po torze motocrossowym; na 10 km dwie pętle
- Znak rozpoznawczy: Ściana Płaczu, stromy podbieg polewany wodą, który zamienia się w ścianę błota
- Buty: z protektorem (najlepiej trailowe); kolce i korki są zabronione
- Biuro zawodów: ${o.email}, tel. ${o.phone} (${o.phoneHours})
- Organizator: ${o.name}, ${o.address}, NIP ${o.nip}; ${o.person}, tel. ${o.personPhone}
- Facebook: ${event.facebook}

## Dystanse

${distances.map((d) => `- **${d.name}, ${d.distance}**: ${d.description} ${d.facts.map((f) => `${f.label}: ${f.value}`).join('; ')}. Opłata ${d.price}, limit ${d.limit}.`).join('\n')}

## Program

Sobota (${event.dates.days.saturday}):
${schedule.saturday.map((r) => `- ${r.time} ${r.what}${r.sub ? `: ${r.sub}` : ''}`).join('\n')}

Niedziela (${event.dates.days.sunday}):
${schedule.sunday.map((r) => `- ${r.time} ${r.what}${r.sub ? `: ${r.sub}` : ''}`).join('\n')}

## Pytania i odpowiedzi

${faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Wyniki

Pełne tabele (miejsce, numer, imię i nazwisko, klub, kategoria, czas) jako strona HTML i jako JSON.
${latest ? `Zwycięzcy ${latest.year}: ${winners.map((w) => `${w.race}: ${[w.man, w.woman].filter(Boolean).map((r) => `${r!.name} (${r!.time})`).join(', ')}`).join('; ')}.\n` : ''}
${years.map((y) => `- [Wyniki ${y.year}](${base}/wyniki/${y.year}/): ${y.n} osób na mecie. JSON: ${base}/wyniki/${y.year}.json`).join('\n')}

## Strony

- [Strona główna](${base}/): termin, dystanse z cenami, trasa, program, pytania, zapisy
- [Dystanse](${base}/#dystanse): cztery biegi z ceną, limitem, godziną startu i trudnością
- [Trasa](${base}/#trasa): pętla 5 km krok po kroku
- [Program](${base}/#program): godziny w sobotę i niedzielę
- [Pytania](${base}/#faq): najczęstsze pytania uczestników
- [Galeria](${base}/galeria/): zdjęcia z kolejnych edycji
- [Wyniki](${base}/wyniki/): archiwum wyników z lat ${years.at(-1)?.year}–${latest?.year}

## Optional

- [Mapa strony](${base}/sitemap-index.xml)
- Strona przygotowana przez ${STUDIO.name}: ${STUDIO.url}
`;
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
