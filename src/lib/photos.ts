// Zdjęcia z src/assets/photos/<rok>/: pojedyncze po ścieżce i wszystkie z danego roku, gotowe dla astro:assets.
import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/**/*.jpg', { eager: true });

/** Zdjęcie po ścieżce względnej, np. "2025/2025-03.jpg". */
export function photo(rel: string): ImageMetadata {
  const hit = files[`/src/assets/photos/${rel}`];
  if (!hit) throw new Error(`Brak zdjęcia: ${rel}`);
  return hit.default;
}

/** Wszystkie zdjęcia z roku, posortowane po nazwie. */
export function photosOf(year: number): { rel: string; img: ImageMetadata }[] {
  return Object.entries(files)
    .filter(([p]) => p.startsWith(`/src/assets/photos/${year}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([p, m]) => ({ rel: p.replace('/src/assets/photos/', ''), img: m.default }));
}

