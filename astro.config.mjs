import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import remarkAutolink from './src/lib/remarkAutolink.mjs';
import remarkCitations from './src/lib/remarkCitations.mjs';

export default defineConfig({
  site: 'https://qart-hadasht.org',
  integrations: [tailwind()],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
    // Order matters: citations first (they need to find their patterns
    // before the autolink plugin wraps source-author names), then autolink.
    remarkPlugins: [remarkCitations, remarkAutolink],
  },
});
