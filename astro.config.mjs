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
  sponsoredAffiliateLinks,
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

/**
 * Affiliate links that are not a property.
 *
 * The seed only knows about hotels. Rail is the other thing a reader books
 * before they arrive, and the Shanghai to Deqing search is the one query almost
 * every visitor from Shanghai runs, so it gets a slug of its own here rather
 * than a raw tracked URL pasted into three markdown files. Same alliance and
 * SID as the hotel links; trip_sub1 matches the Shanghai to Deqing rail banners
 * already running on those pages, so prose clicks and banner clicks stay
 * separable in the partner reports.
 */
const PARTNER_LINKS = {
  'trains-shanghai-deqing':
    'https://www.trip.com/trains/tt-common/ttlist?departurecitycode=CN001AOH&arrivalcitycode=CN001DRH&Allianceid=9859697&SID=327673690&trip_sub1=train-sh-dq&trip_sub3=D19143728',
};

const affiliateRedirects = Object.fromEntries(
  [
    ...affiliateSeed.map((row) => [`/go/${row.goSlug}`, row.affiliateUrl]),
    ...Object.entries(PARTNER_LINKS).map(([slug, url]) => [`/go/${slug}`, url]),
  ].map(([path, destination]) => [
    path,
    { status: /** @type {302} */ (302), destination },
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
      hastPlugins: [scrollableTables, figures, sponsoredAffiliateLinks],
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
      //
      // /admin is the same rule and the worst case of breaking it. robots.txt
      // disallows it, so a crawler that finds it in the sitemap is invited to a
      // URL it is then forbidden to fetch, which is exactly how a page gets
      // indexed as a bare URL: the noindex is inside a response nobody is
      // allowed to read.
      filter: (page) =>
        !/\/(search(-index\.json)?|contact\/thank-you)$/.test(page.replace(/\/$/, '')) &&
        !/\/go\//.test(page) &&
        !/\/admin(\/|$)/.test(page.replace(/\/$/, '')),
    }),
  ],
});
