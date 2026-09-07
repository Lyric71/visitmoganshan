import type { APIRoute } from 'astro';
import { escapeXml, getNewsEntries, newsPath } from '../../../lib/news';

/**
 * /journal/news/sitemap-news.xml
 *
 * The Google News sitemap: only items published in the last 48 hours, which is
 * what the format is for, and an empty urlset on a quiet day rather than no
 * file. Referenced from robots.txt, since @astrojs/sitemap writes its own index
 * and offers no way to add a foreign sitemap to it. Every news permalink is
 * also in the ordinary sitemap, so nothing depends on this file for discovery.
 */
export const prerender = true;

const SITE = 'https://www.visitmoganshan.com';
const WINDOW_MS = 48 * 60 * 60 * 1000;

export const GET: APIRoute = async () => {
  const now = Date.now();
  const recent = (await getNewsEntries()).filter((entry) => now - entry.data.published.getTime() <= WINDOW_MS);

  const urls = recent
    .map(
      (entry) => `  <url>
    <loc>${SITE}${newsPath(entry)}</loc>
    <news:news>
      <news:publication>
        <news:name>Visit Moganshan</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${entry.data.published.toISOString().slice(0, 10)}</news:publication_date>
      <news:title>${escapeXml(entry.data.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=1800',
    },
  });
};
