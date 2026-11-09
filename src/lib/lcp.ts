// Preload obrazu LCP (największego elementu pierwszego ekranu). Base.astro wstawia go na początku <head>,
// przed wklejonym CSS, więc przeglądarka zaczyna pobierać zdjęcie z pierwszym pakietem HTML.
// Ustawienia (src, widths, sizes) muszą być te same co w <Picture> na stronie: wtedy adresy plików się zgadzają
// i zdjęcie pobiera się raz. AVIF, bo to pierwszy <source> w <Picture> (formats={['avif', 'webp']}).
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

export type LcpImage = { srcset: string; sizes: string; type: string };

export async function lcpPreload(src: ImageMetadata, widths: number[], sizes: string): Promise<LcpImage> {
  const img = await getImage({ src, widths, format: 'avif' });
  return { srcset: img.srcSet.attribute, sizes, type: 'image/avif' };
}
