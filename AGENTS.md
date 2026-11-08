# Reguły projektu: Cross Straceńców

Obowiązują przy każdej zmianie strony, przez człowieka i przez agenta AI. Cel: każda aktualizacja
utrzymuje Lighthouse (telefon) na poziomie **wydajność ≥ 98, dostępność / dobre praktyki / SEO = 100**,
a Core Web Vitals w zielonym (LCP < 2,5 s, CLS < 0,1, INP < 200 ms). Treść, kod i komentarze po polsku.

## 1. Zdjęcia i grafiki (obowiązkowo)

- **Wyłącznie nowoczesne formaty: AVIF z zapasowym WebP.** Każde zdjęcie na stronie idzie przez
  `astro:assets`: `<Picture formats={['avif', 'webp']} …>` (albo `getImage({ format: 'avif' | 'webp' })`,
  gdy potrzebny sam adres, np. w PhotoSwipe). Nigdy `<img src="…jpg|png">` ani CSS `background-image` ze zdjęciem.
- Oryginały (JPG/PNG/WebP w pełnej jakości) trzymamy w `src/assets/` (zdjęcia: `src/assets/photos/<rok>/`).
  Astro przy budowaniu robi z nich AVIF/WebP w kilku szerokościach. Do repozytorium nie wrzucamy gotowych miniatur.
- `public/` tylko dla plików, które muszą mieć stały adres: favicon, `apple-touch-icon.png`, `og.jpg`
  (podgląd linku w social media: musi być JPG/PNG 1200 × 630), `logo.webp` (logo w danych strukturalnych).
  Nowa grafika w `public/` = WebP lub AVIF, chyba że format wymusza standard (jak wyżej).
- Zawsze `widths` + `sizes` dopasowane do faktycznej szerokości w układzie (np. `calc(50vw - 20px)`),
  a nie `100vw` „na zapas”. Logo i ikony: `width`/`height` + `densities={[1, 2, 3]}`.
- Wymiary zawsze znane (Astro wstawia `width`/`height`): zero przesunięć układu (CLS).
- **Obraz LCP** (największy na pierwszym ekranie): `loading="eager"`, `fetchpriority="high"` i preload
  przez `lcpPreload()` z `src/lib/lcp.ts` przekazany do `<Base lcpImage={…}>` z **tymi samymi** `widths` i `sizes`.
  Nie animować go przez `opacity: 0` (LCP czeka wtedy na animację); wolno `transform`.
- Wszystkie inne obrazy: domyślne `loading="lazy"`. Ukryte na telefonie kafle też `lazy`.
- Każde zdjęcie z treścią ma opisowy `alt` po polsku; dekoracyjne `alt=""`.

## 2. Wydajność

- **Fonty**: tylko własne pliki WOFF2 w `public/fonts/`, przycięte do łaciny z polskimi znakami
  (+ litery Latin-1 na nazwiska w wynikach), bez hintingu, `font-display: swap`. Preload tylko dla fontów
  z pierwszego ekranu (Anton 400, Barlow 400). Przycinanie nowego fontu:
  ```bash
  pyftsubset font.ttf --flavor=woff2 --no-hinting --desubroutinize \
    --layout-features='kern,liga,tnum,lnum,case' \
    --unicodes='U+0020-007E,U+00A0,U+00A9,U+00AE,U+00B0,U+00B7,U+00C0-00FF,U+0104-0107,U+0118-0119,U+0141-0144,U+015A-015B,U+0179-017C,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20AC,U+2190-2193'
  ```
  Fonty mają cache „na zawsze” (`vercel.json`), więc **zmieniony plik fontu dostaje nową nazwę**.
- **CSS**: Tailwind + tokeny z `src/styles/global.css`, wklejany w HTML (`inlineStylesheets: 'always'`).
  Bez bibliotek UI i zewnętrznych arkuszy.
- **JS**: bez frameworków. Krótkie skrypty w komponentach (`<script>`), animacje przez CSS lub Web Animations API.
  - W pętlach najpierw **wszystkie odczyty** układu (`getBoundingClientRect`, `offset*`), potem zapisy stylów.
  - Obsługę przewijania licz w `requestAnimationFrame`, nasłuch `{ passive: true }`, a sekcje daleko od ekranu
    wyłączaj przez `IntersectionObserver` (wzór: `Route.astro`, `Story.astro`).
  - Nie mierz układu od razu przy wczytaniu strony; pierwszy pomiar w callbacku `IntersectionObserver` albo w rAF.
  - Zawsze uwzględniaj `prefers-reduced-motion: reduce`.
- Sekcje poniżej pierwszego ekranu mogą mieć `defer-render` (content-visibility), ale nie te, do których prowadzą kotwice z menu.
- Nic z zewnętrznych domen na pierwszym ekranie (bez Google Fonts, bez skryptów analityki blokujących render).
  Analitykę, jeśli kiedyś będzie, ładujemy po `load` i bez wpływu na INP.
- Cache: `/_astro/*` i `/fonts/*` mają `immutable` na rok (nazwy z hashem lub wersją), reszta wg `vercel.json`.

## 3. SEO i agenci AI

- Każda strona korzysta z `src/layouts/Base.astro` i podaje **unikalne** `title` (do ~60 znaków; Base dopisze
  „| Cross Straceńców Głogów”) i `description` (120–160 znaków, z frazami: bieg przełajowy, Głogów, rok, dystanse).
- Jeden `<h1>` na stronę, nagłówki w kolejności (h2 → h3), polski `lang`.
- **Dane strukturalne (JSON-LD)**: Base buduje jeden `@graph` (organizator, serwis, bieżąca strona).
  Strona dokłada swoje węzły przez prop `jsonLd`, korzystając z `src/lib/seo.ts` (`ids`, `breadcrumbs`,
  `venueNode`). Odwołania przez `@id`, bez `@context` w węzłach. Podstrony zawsze z `breadcrumbs()`.
  Typy w użyciu: `SportsEvent` + `subEvent` (strona główna), `FAQPage`, `ImageGallery`, `ItemList`, `Dataset` (wyniki).
- Zmiana treści wydarzenia = zmiana w `src/data/event.ts`; strona, JSON-LD i `llms.txt` aktualizują się same.
  Nowa sekcja lub podstrona → dopisz ją w `src/pages/llms.txt.ts` (sekcja „Strony”).
- `public/robots.txt` wpuszcza wszystkie wyszukiwarki i boty AI. Nie blokuj ich bez decyzji właściciela.
- Mapa strony powstaje sama (`@astrojs/sitemap`). Strony techniczne (np. 404) mają `noindex` (prop `noindex` w Base).
- **Zmiana adresu strony = przekierowanie 301** w `vercel.json` (`redirects`). Stare adresy Joomli
  (`/index.php/...`) są już przekierowane.
- Linki do innych serwisów z `target="_blank"` zawsze z `rel="noopener"`.

## 4. Dostępność

- Kontrast tekstu wg tokenów z `global.css` (WCAG AA), cele dotyku min. 44 px (`min-h-11`), widoczny fokus.
- Ikony dekoracyjne `aria-hidden="true"`, przyciski z samą ikoną mają `aria-label`.

## 5. Zanim wypchniesz zmiany

```bash
npm run check   # 0 błędów TypeScript / Astro
npm run build   # musi przejść bez ostrzeżeń o brakujących zdjęciach
```
Przy zmianach w wyglądzie lub skryptach: Lighthouse w trybie mobilnym na `/`, `/galeria/`, `/wyniki/` i jednej
stronie roku (np. `npx lighthouse http://localhost:4321/ --view` po `npm run preview`) i sprawdzenie, że wyniki
nie spadły poniżej progów z początku tego pliku.
