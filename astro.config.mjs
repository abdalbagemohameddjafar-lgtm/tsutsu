// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Adresse du site une fois en ligne (Cloudflare Pages) : à adapter si le nom du projet change.
export default defineConfig({
  site: 'https://tsutsu.pages.dev',
  integrations: [sitemap()],
});
