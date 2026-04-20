import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://we-are.fr',
  output: 'server',
  trailingSlash: 'always',
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
