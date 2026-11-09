// Zdjęcia hero strony głównej w jednym miejscu. Hero.astro rysuje je przez <Picture>,
// a index.astro robi z pierwszego preload w <head> (lib/lcp.ts): to obraz LCP.
// Kolejne zdjęcia zmieniają się płynnie co kilka sekund; doczytują się dopiero po wczytaniu strony.
// `pos`: kadr (object-position) na telefonie i na komputerze. `move`: kierunek powolnego ruchu kamery.
// `shift`: o ile zsunąć zdjęcie w dół na telefonie i tablecie (górne ~30–40% tła jest tam nad ekranem),
// żeby było widać twarze, a nie same nogi. Maks. 25%.
import { photo } from './photos';

export const heroSlides = [
  { src: photo('2025/2025-03.jpg'), pos: ['46% 50%', '50% 40%'], move: 'in', shift: '0%' },
  { src: photo('2022/2022-05.jpg'), pos: ['55% 50%', '50% 45%'], move: 'left', shift: '25%' },
  { src: photo('2016/2016-01.jpg'), pos: ['35% 50%', '50% 50%'], move: 'out', shift: '12%' },
  { src: photo('2020/2020-10.jpg'), pos: ['42% 50%', '50% 55%'], move: 'right', shift: '22%' },
  { src: photo('2022/2022-04.jpg'), pos: ['45% 50%', '50% 40%'], move: 'in', shift: '25%' },
] as const;

export const heroImage = {
  src: heroSlides[0].src,
  widths: [480, 768, 1080, 1350],
  sizes: '100vw',
};
