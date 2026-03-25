import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://studioweare.fr',
  integrations: [sitemap()],
  output: 'static',
});
