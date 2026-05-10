import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkAutolink from './src/lib/remarkAutolink.mjs';

export default defineConfig({
  site: 'https://qart-hadasht.org',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
    remarkPlugins: [remarkAutolink],
  },
});
