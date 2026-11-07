# Cross Straceńców: strona wydarzenia

Statyczna strona biegu w Głogowie: strona główna, galeria z 9 edycji i wyniki (pełne tabele 2022–2025).

## Stos

| Co | Czym | Po co |
| --- | --- | --- |
| Framework | Astro 7, wyjście statyczne | HTML bez JS tam, gdzie go nie trzeba; hosting na dowolnym CDN |
| Style | Tailwind CSS 4 (`src/styles/global.css`) | tokeny z systemu marki jako zmienne CSS, motyw ciemny przez `data-theme="dark"` |
| Baza | Astro DB (libSQL / SQLite) | edycje i wyniki, czytane przy budowaniu |
| Animacje | Motion (`motion`) | wejście hero, moment „photo-chapters” (Trasa), zapalanie cytatu |
| Ikony | Lucide (`@lucide/astro`) | obrys 2px, zakończenia kwadratowe |
| Galeria | PhotoSwipe 5 | powiększanie zdjęć, gesty na telefonie |
| Fonty | Fontsource: Anton, Barlow Condensed, Barlow | hostowane lokalnie, z polskimi znakami |
| Obrazy | `astro:assets` + sharp | AVIF i WebP w kilku szerokościach |

## Komendy

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # wynik w dist/
npm run preview
```

## Gdzie co edytować

- **Treść wydarzenia** (termin, dystanse, ceny, program, FAQ, partnerzy): `src/data/event.ts`.
  Pola oznaczone `assumed` czekają na regulamin XVII edycji.
- **Edycje i źródła wyników**: `db/data/editions.ts`.
- **Wyniki**: `db/data/results/<rok>.json`. Import z systemów pomiaru czasu:
  - `node scripts/import-datasport.mjs 2025:5483 2024:4696` (rok:id wyników Datasport)
  - `node scripts/import-sts.mjs 2023:cross2023 2022:cross2022` (rok:adres na live.sts-timing.pl)
  Baza powstaje z `db/seed.ts` przy każdym `dev` i `build`.
- **Zdjęcia**: `src/assets/photos/<rok>/`. Galeria czyta wszystkie pliki `.jpg` z folderu roku;
  lata w galerii: `galleryYears` w `src/lib/photos.ts`. Źródła obecnych zdjęć: `src/assets/photos/sources.csv`.
- **Logo**: `public/logo.webp` i `public/logo-inverse.webp` (zrastrowane z SVG w `src/assets/brand/`).

## Dla agentów AI i wyszukiwarek

- `/llms.txt`: opis wydarzenia, dystansów, programu i wyników w Markdown.
- `/wyniki/<rok>.json`: wyniki edycji jako JSON.
- JSON-LD: `SportsEvent` i `FAQPage` na stronie głównej, `Dataset` na stronach wyników.
- `sitemap-index.xml`, `robots.txt`.

## Produkcja z bazą zdalną (opcjonalnie)

Lokalnie baza jest plikiem SQLite tworzonym z seeda. Gdy wyniki mają być edytowane poza kodem,
podłącz Turso (libSQL): ustaw `ASTRO_DB_REMOTE_URL` i `ASTRO_DB_APP_TOKEN`, potem `astro db push`
i `astro build --remote`.
