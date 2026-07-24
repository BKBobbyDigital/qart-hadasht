import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import remarkAutolink from './src/lib/remarkAutolink.mjs';
import remarkCitations from './src/lib/remarkCitations.mjs';

export default defineConfig({
  site: 'https://qart-hadasht.org',
  integrations: [
    tailwind(),
    // Emits /sitemap-index.xml (+ /sitemap-0.xml) at build for every
    // page. The search-only and thanks pages are excluded — they carry
    // no indexable content.
    sitemap({
      filter: (page) =>
        !page.includes('/search') && !page.includes('/thanks'),
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
    // Order matters: citations first (they need to find their patterns
    // before the autolink plugin wraps source-author names), then autolink.
    remarkPlugins: [remarkCitations, remarkAutolink],
  },
});
