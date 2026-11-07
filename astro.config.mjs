// @ts-check
import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://crossstracencow.pl',
  trailingSlash: 'ignore',
  integrations: [db(), sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  image: { responsiveStyles: true },
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
