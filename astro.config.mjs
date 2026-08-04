// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the production domain before the first deploy.
const SITE = 'https://www.visitmoganshan.com';

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // 'never' makes Vercel strip trailing slashes from incoming requests before
  // applying redirect rules, so path-level 301s always match.
  trailingSlash: 'never',

  build: {
    // Stylesheets shipped as <link> tags sit on the critical path and delay
    // LCP. Inlining costs a few KB of duplicated HTML per page and removes
    // the render-blocking round trips. Revisit past ~40 KB of CSS.
    inlineStylesheets: 'always',
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
    }),
  ],
});
