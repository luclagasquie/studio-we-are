import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://studioweare.fr',
  integrations: [sitemap()],
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: false,
    },
  }),
  prefetch: {
    defaultStrategy: 'viewport',
    prefetchAll: false,
  },
});
