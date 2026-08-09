import type { APIRoute } from 'astro';

/**
 * GET /ga.js
 *
 * Google Analytics, loaded through a first party endpoint that decides per
 * request whether the visitor gets it at all.
 *
 * The site is a static build sitting on a CDN, so the gtag snippet cannot be
 * conditionally written into the HTML: the first reader to be served a page
 * fixes what every later reader sees. Instead every page requests this script,
 * and this route hands back one of two bodies.
 *
 * Inside mainland China, the stub. googletagmanager.com is not reachable from
 * behind the Great Firewall, and a page that asks for it anyway spends a
 * connection timeout on a script that will never arrive. Readers on the hill
 * itself are a real share of this audience, frequently on a phone and a weak
 * signal, and they are the ones who can least afford it. Nothing is requested
 * from Google, and nothing is stored on their device.
 *
 * Everywhere else, the full GA4 bootstrap.
 *
 * Vercel puts `x-vercel-ip-country` on every request. When it is missing, which
 * covers local dev, and any request Vercel cannot place, this fails closed and
 * serves the stub: analytics loads only when we are sure the reader is outside
 * China, never merely because we could not tell.
 */

export const prerender = false;

const GA_ID = 'G-RRDR1EJK35';

const STUB = '/* analytics not loaded */\n';

const bootstrap = (id: string) => `(function () {
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=${id}';
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', '${id}');
})();
`;

export const GET: APIRoute = ({ request }) => {
  const country = request.headers.get('x-vercel-ip-country') ?? 'CN';
  const enabled = country !== 'CN';

  return new Response(enabled ? bootstrap(GA_ID) : STUB, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // The body depends on who asked, so it must never be held in a shared
      // cache. One cached copy would serve the whole world whichever answer
      // the first reader happened to get.
      'Cache-Control': 'private, no-store',
    },
  });
};
