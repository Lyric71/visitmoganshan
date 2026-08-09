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
 * before they arrive, and the two searches almost every visitor runs are
 * Shanghai to Deqing and Hangzhou to Deqing, so each gets a slug of its own
 * here rather than a raw tracked URL pasted into several markdown files. Same
 * alliance and SID as the hotel links; trip_sub1 matches the rail banner
 * running on the corresponding pages, so prose clicks and banner clicks stay
 * separable in the partner reports.
 */
const PARTNER_LINKS = {
  'trains-shanghai-deqing':
    'https://www.trip.com/trains/tt-common/ttlist?departurecitycode=CN001AOH&arrivalcitycode=CN001DRH&Allianceid=9859697&SID=327673690&trip_sub1=train-sh-dq&trip_sub3=D19143728',
  'trains-hangzhou-deqing':
    'https://www.trip.com/trains/tt-common/ttlist?departurecitycode=CN001HGH&arrivalcitycode=CN001DRH&Allianceid=9859697&SID=327673690&trip_sub1=trains-hz-dq&trip_sub3=D19144281',
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

/**
 * Retired routes.
 *
 * The trade and media section (/trade and its four children) was withdrawn and
 * replaced by /advertise, which is what a hotel, an attraction or an operator
 * arriving on any of those URLs is now looking for. 301 rather than 302,
 * unlike the affiliate table above: these pages are not coming back, and a
 * permanent redirect is the only thing that moves a search result across.
 */
const RETIRED_ROUTES = Object.fromEntries(
  [
    '/trade',
    '/trade/why-moganshan',
    '/trade/fact-sheet',
    '/trade/sample-itineraries',
    '/trade/image-library',
  ].map((path) => [path, { status: /** @type {301} */ (301), destination: '/advertise' }]),
);

/**
 * URLs the first build published links to, for pages that were never written.
 *
 * The footer, src/data/nav.ts and src/data/things-to-do.ts each carried an
 * href to a page that did not exist in cf49562. The links are gone from the
 * source now, but Googlebot followed all four before they were, so they sit in
 * Search Console as crawled 404s with the reader on the wrong side of them.
 * Deleting a bad link stops the bleeding; it does not move the crawler, and
 * only a redirect does that.
 *
 * Each target is the page the label promised, not the section index: somebody
 * who clicked "The hot springs" wants the hot springs article, and dropping
 * them on /moganshan to find it again is a second dead end wearing a 301.
 */
const ORPHANED_ROUTES = Object.fromEntries(
  /** @type {[string, string][]} */ ([
    ['/things-to-do/villa-walking-route', '/moganshan/hill-station/walking-tour'],
    ['/things-to-do/hot-springs', '/moganshan/hot-springs'],
    ['/where-to-stay/private-villas', '/where-to-stay/villas'],
    ['/accessibility', '/plan/accessibility'],
  ]).map(([path, destination]) => [
    path,
    { status: /** @type {301} */ (301), destination },
  ]),
);

// https://astro.build/config
export default defineConfig({
  site: SITE,

  // 'never' makes Vercel strip trailing slashes from incoming requests before
  // applying redirect rules, so path-level 301s always match.
  trailingSlash: 'never',

  redirects: { ...affiliateRedirects, ...RETIRED_ROUTES, ...ORPHANED_ROUTES },

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
