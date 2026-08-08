// @ts-check
import { readFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

import { satteri } from '@astrojs/markdown-satteri';

import {
  stripLeadingTitle,
  internalLinkSlashes,
  scrollableTables,
  figures,
} from './src/lib/markdown.mjs';

// TODO: replace with the production domain before the first deploy.
const SITE = 'https://www.visitmoganshan.com';

/**
 * The /go/ affiliate redirect table.
 *
 * Built from data/seed/properties.seed.json rather than hand-maintained, so the
 * link a reader follows and the link the affiliate sheet issued cannot drift
 * apart. 809 entries today.
 *
 * These are declared here rather than in vercel.json on purpose. The Vercel
 * adapter emits the Build Output API, and a root vercel.json redirects array is
 * ignored under that output; Astro's own redirects are what the adapter turns
 * into real edge rules. build.redirects is left off because the adapter already
 * disables the HTML redirect pages a static build would otherwise write.
 *
 * 302, never 301: a slug has to stay re-pointable. A property closes, a link
 * expires, an affiliate account changes, and a cached permanent redirect to a
 * dead partner URL is unfixable in the browsers that already took it.
 *
 * One thing to know before anybody reports it as a bug: `astro dev` answers
 * these with a 301. Astro's dev renderer only honors an explicit status when
 * the target is an internal route, and these targets are external. The Vercel
 * adapter reads the status straight off the route and writes 302 into the build
 * output, so the deployed behavior is correct and only the dev server is not.
 */
/** @type {{ goSlug: string, affiliateUrl: string }[]} */
const affiliateSeed = JSON.parse(
  readFileSync(new URL('./data/seed/properties.seed.json', import.meta.url), 'utf8'),
);

const affiliateRedirects = Object.fromEntries(
  affiliateSeed.map((row) => [
    `/go/${row.goSlug}`,
    { status: /** @type {302} */ (302), destination: row.affiliateUrl },
  ]),
);

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // 'never' makes Vercel strip trailing slashes from incoming requests before
  // applying redirect rules, so path-level 301s always match.
  trailingSlash: 'never',

  redirects: affiliateRedirects,

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
      hastPlugins: [scrollableTables, figures],
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
      // /search and the contact confirmation are noindex, and the JSON index
      // behind the search box is not a page. A sitemap that lists any of them is
      // telling Google two different things. /go/ is an affiliate redirect
      // rather than a page and is disallowed in robots.txt; it should never
      // reach the sitemap, and this makes that a rule rather than a happy
      // accident of how the adapter emits redirects.
      filter: (page) =>
        !/\/(search(-index\.json)?|contact\/thank-you)$/.test(page.replace(/\/$/, '')) &&
        !/\/go\//.test(page),
    }),
  ],
});
