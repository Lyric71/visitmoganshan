// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

import { satteri } from '@astrojs/markdown-satteri';

import { stripLeadingTitle, internalLinkSlashes, scrollableTables } from './src/lib/markdown.mjs';

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

  // Guide pages are drafted as portable markdown. The layout owns the h1 and
  // the site drops trailing slashes, so both are reconciled at build time
  // rather than by asking writers to hand-edit every draft. See
  // src/lib/markdown.mjs.
  markdown: {
    processor: satteri({
      mdastPlugins: [stripLeadingTitle, internalLinkSlashes],
      hastPlugins: [scrollableTables],
    }),
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // /search is noindex, and the JSON index behind it is not a page. A
      // sitemap that lists either is telling Google two different things.
      filter: (page) => !/\/search(-index\.json)?$/.test(page.replace(/\/$/, '')),
    }),
  ],
});
