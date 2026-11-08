// @ts-check
import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://crossstracencow.pl',
  trailingSlash: 'ignore',
  integrations: [db(), sitemap()],
  // Podstrony pobierają się po najechaniu albo dotknięciu linku, nie od razu: nie konkurują z pierwszym ekranem.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  image: { responsiveStyles: true },
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
