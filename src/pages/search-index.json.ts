import type { APIRoute } from 'astro';
import { buildSearchIndex } from '../lib/search';

/**
 * /search-index.json
 *
 * Prerendered with the rest of the site, so this is a flat file on the CDN, not
 * a function invocation. /search fetches it once and searches in the browser.
 *
 * It is not linked from anywhere and carries no page of its own, so nothing
 * points a crawler at it; robots.txt is the place to keep it that way if it
 * ever starts showing up in the index.
 */
export const prerender = true;

export const GET: APIRoute = async () => {
  const docs = await buildSearchIndex();

  return new Response(JSON.stringify(docs), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Rebuilt on every deploy and served under an unchanging name, so it is
      // cached at the edge and revalidated by the browser rather than pinned.
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
};
