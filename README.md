# Cross Straceńców: strona wydarzenia

Statyczna strona biegu w Głogowie: strona główna (lejek do zapisów), galeria z 9 edycji i wyniki
(pełne tabele 2022–2025). Wszystko powstaje przy budowaniu; na serwerze leżą gotowe pliki HTML.

## Stos

| Co | Czym | Po co |
| --- | --- | --- |
| Framework | Astro 7, wyjście statyczne | HTML bez zbędnego JS; hosting na dowolnym CDN |
| Style | Tailwind CSS 4 (`src/styles/global.css`) | tokeny marki jako zmienne CSS, ciemne sekcje przez `data-theme="dark"` |
| Baza | Astro DB (libSQL / SQLite) | edycje i wyniki, czytane przy budowaniu |
| Animacje | CSS + Web Animations API | bez bibliotek: skrypty są małe i wklejane w HTML |
| Ikony | Lucide (`@lucide/astro`) | obrys 2 px, zakończenia kwadratowe |
| Galeria | PhotoSwipe 5 | powiększanie zdjęć, gesty na telefonie (ładowany tylko w galerii) |
| Fonty | Anton, Barlow, Barlow Condensed w `public/fonts/` | własny hosting, jeden przycięty plik na grubość |
| Obrazy | `astro:assets` + sharp | AVIF i WebP w kilku szerokościach |

## Komendy

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # wynik w dist/
npm run preview    # podgląd zbudowanej strony
npm run check      # sprawdzenie typów (TypeScript i pliki .astro)
```

## Struktura

```
src/
  data/event.ts        treść wydarzenia: termin, zapisy, kontakt, dystanse, trasa, program, FAQ
  layouts/Base.astro   <head>, nagłówek, stopka; skrypt skali strony na komputerze
  pages/
    index.astro        strona główna (kolejność sekcji = lejek do zapisów)
    galeria/           galeria zdjęć z lat
    wyniki/            archiwum, strona roku i JSON roku
    llms.txt.ts        opis strony dla agentów AI
  components/          sekcje strony; każdy plik ma na górze komentarz, co robi
  lib/                 zdjęcia (photos.ts) i odczyt wyników z bazy (results.ts)
  styles/global.css    tokeny, fonty, narzędzia (wrap, btn, trail…), wejście nagłówków, skala strony
db/                    schemat, seed, edycje i wyniki w JSON
scripts/               import wyników z systemów pomiaru czasu
public/                logo, favicon, obraz OG, fonty, robots.txt
```

## Gdzie co edytować

- **Treść wydarzenia** (termin, link do zapisów, kontakt, dystanse, ceny, program, FAQ): `src/data/event.ts`.
  Pola `assumed: true` czekają na potwierdzenie organizatora:
  - `registration.url` i `registration.provider`: link do zapisów na 2027 (teraz zastępczy `zapisy.example`),
  - `dates`: termin XVII edycji,
  - `organizer.address`: crossstracencow.pl i sport-gorski.pl podają różne adresy (opis w komentarzu w pliku).
- **Edycje i źródła wyników**: `db/data/editions.ts`.
- **Wyniki**: `db/data/results/<rok>.json`. Import z systemów pomiaru czasu:
  - `npm run import:results -- 2025:5483 2024:4696` (rok:id wyników Datasport),
  - `npm run import:results:sts -- 2023:cross2023 2022:cross2022` (rok:adres na live.sts-timing.pl).
  Baza powstaje z `db/seed.ts` przy każdym `dev` i `build`. Strony wyników, pasek lat i zapowiedź
  na stronie głównej biorą najnowszy rok z bazy same.
- **Zdjęcia**: `src/assets/photos/<rok>/`. Rok pojawia się w galerii, gdy jego folder ma zdjęcia.
- **Formularz pytań** (sekcja FAQ) nie ma serwera: otwiera pocztę z gotową wiadomością na adres biura.
  Po wyborze usługi formularzy podmień w `src/components/Faq.astro` przekierowanie na `fetch()`.
- **Partnerzy**: lista `partners` w `src/data/event.ts`; obecnie nie jest wyświetlana.
- **Logo**: `public/logo.webp` i `public/logo-inverse.webp` (zrastrowane z SVG w `src/assets/brand/`).

## Zachowania, o których warto wiedzieć

- **Skala strony na komputerze** (`Base.astro`, `global.css`): od 1024 px strona jest skalowana jak zoom
  przeglądarki, od 85% (laptopy 1366 × 768) do 130% (monitory 4K). Wzorzec 100%: okno ok. 1440 × 810.
  Wysokości „na cały ekran” w skalowanych elementach dzielimy przez `--page-zoom`.
- **Dolny pasek „Zapisz się”** (telefon, `Signup.astro`): widoczny tylko na pasku liczb pod hero
  i na trasie w trakcie przesuwania odcinków (do mety; `data-bar` ustawia `Route.astro`). Od Ściany Płaczu
  w dół się nie pokazuje.
- **Stos kart dystansów** (telefon, `Distances.astro`): włącza się tylko, gdy każda karta mieści się cała
  na ekranie. Między kartami są odstępy (`.stack-gap`), żeby każdą dało się przeczytać i kliknąć.
  Na dole ekranu pasek postępu „2 z 4” przeskakuje z karty na kartę (gdy jest na niego miejsce).
- **Trasa** (telefon i tablet, `Route.astro`): przy przewijaniu w dół odcinki jadą w bok. Przypięty blok
  (liczby o pętli, numery odcinków, zdjęcia, opisy, postęp) wypełnia ekran od nagłówka do paska zapisów:
  wysokość zdjęć liczy skrypt.
- **Ograniczony ruch**: przy `prefers-reduced-motion` animacje są wyłączone, a treść widoczna od razu.

## Wydajność

Wyniki Lighthouse 13 (podgląd lokalny, listopad 2026):

| Strona | Telefon (wydajność) | Komputer (wydajność) | Dostępność, praktyki, SEO |
| --- | --- | --- | --- |
| `/` | 99 | 100 | 100 / 100 / 100 |
| `/galeria/` | 97 | 100 | 100 / 100 / 100 |
| `/wyniki/` | 98 | 100 | 100 / 100 / 100 |
| `/wyniki/2025/` | 99 | 100 | 100 / 100 / 100 |

Co na to pracuje (nie psuć przy zmianach):

- **CSS w HTML** (`build.inlineStylesheets: 'always'`): brak plików blokujących pierwsze malowanie.
- **Wejście nagłówków w CSS** (`[data-line]`, `[data-enter]`, `.collage-tile` w `global.css`):
  tytuł nie czeka na JS. Kolejność ustawia `style="--i:N"`.
- **Skrypty bez importów**: Astro wkleja je w HTML, więc strona główna pobiera jeden mały plik JS
  (prefetch). Nie dodawaj bibliotek animacji; `element.animate()` i `IntersectionObserver` wystarczą.
- **Fonty**: pięć plików woff2 (ok. 106 KB), dwa z pierwszego ekranu mają `preload`.
- **`defer-render`** na sekcjach poniżej pierwszego ekranu (`content-visibility: auto`). Nie dawać go
  sekcjom, których skrypty mierzą wysokość przy starcie (dystanse, trasa).
- **Obrazy**: zdjęcie LCP z `fetchpriority="high"`; kafle ukryte na telefonie z `loading="lazy"`.
- **Prefetch po najechaniu** (`astro.config.mjs`), żeby podstrony nie konkurowały z pierwszym ekranem.

Sprawdzenie u siebie (z działającym `npm run preview`):

```bash
npx lighthouse@13.0.1 http://localhost:4321/ --view
```

## Fonty

Pliki w `public/fonts/` pochodzą z Google Fonts (licencja SIL OFL 1.1), przycięte do znaków łacińskich
z polskimi literami, cudzysłowami „”, półpauzą, wielokropkiem, strzałkami i €. Żeby je odtworzyć albo
dodać znaki, pobierz CSS z parametrem `text=` (lista znaków) i zapisz pliki z adresów `src:`:

```
https://fonts.googleapis.com/css2?family=Anton&family=Barlow:wght@400;600&family=Barlow+Condensed:wght@600;700&display=swap&text=<znaki>
```

## Dla agentów AI i wyszukiwarek

- `/llms.txt`: wydarzenie, dystanse, program, pytania, kontakt i wyniki w Markdown.
- `/wyniki/<rok>.json`: wyniki edycji jako JSON.
- JSON-LD: `SportsEvent` (każdy bieg) i `FAQPage` na stronie głównej, `ImageGallery` w galerii,
  `CollectionPage` w archiwum, `Dataset` na stronach lat; `BreadcrumbList` na podstronach.
- `sitemap-index.xml`, `robots.txt` (z odnośnikiem do `llms.txt`).

## Produkcja z bazą zdalną (opcjonalnie)

Lokalnie baza jest plikiem SQLite tworzonym z seeda. Gdy wyniki mają być edytowane poza kodem,
podłącz Turso (libSQL): ustaw `ASTRO_DB_REMOTE_URL` i `ASTRO_DB_APP_TOKEN`, potem `astro db push`
i `astro build --remote`.
