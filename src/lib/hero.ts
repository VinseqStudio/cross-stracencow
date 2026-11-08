// Zdjęcie hero strony głównej w jednym miejscu: Hero.astro rysuje je przez <Picture>,
// a index.astro robi z tych samych ustawień preload w <head> (lib/lcp.ts).
import { photo } from './photos';

export const heroImage = {
  src: photo('2025/2025-03.jpg'),
  widths: [480, 768, 1080, 1350],
  sizes: '100vw',
};
