import type { APIRoute } from 'astro';
import { authorById, type AuthorId } from '../../../data/authors';
import { TOPIC_LABEL } from '../../../data/news-topics';
import { NEWS_FEED, NEWS_INDEX, escapeXml, getNewsEntries, markdownToFeedHtml, newsPath } from '../../../lib/news';

/**
 * /journal/news/feed.xml
 *
 * RSS 2.0, the fifty latest items with full text. The site had no feed of any
 * kind before this, which meant no China expat newsletter, aggregator or
 * Wikivoyage editor could follow it. Autodiscovery is in the head of every
 * page (src/layouts/Layout.astro).
 *
 * Prerendered like everything else: a flat file on the CDN, rebuilt on every
 * publish.
 */
export const prerender = true;

const SITE = 'https://www.visitmoganshan.com';

export const GET: APIRoute = async () => {
  const entries = (await getNewsEntries()).slice(0, 50);
  const updated = entries[0]?.data.last_updated ?? new Date();

  const items = entries
    .map((entry) => {
      const { data } = entry;
      const url = `${SITE}${newsPath(entry)}`;
      const author = authorById(data.author as AuthorId);
      const consequence = `<p><strong>What this means for a visitor:</strong> ${escapeXml(data.consequence)}</p>`;
      const sources = `<p>Sources: ${data.sources
        .map((s) => `<a href="${escapeXml(s.url)}">${escapeXml(s.name)} (${escapeXml(s.name_en)})</a>, ${s.date.toISOString().slice(0, 10)}, tier ${s.tier}`)
        .join('; ')}.</p>`;
      const body = `${markdownToFeedHtml(entry.body ?? '')}\n${consequence}\n${sources}`;
      return `    <item>
      <title>${escapeXml(data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${data.published.toUTCString()}</pubDate>
      <dc:creator>${escapeXml(author.name)}</dc:creator>
      ${data.topics.map((topic) => `<category>${escapeXml(TOPIC_LABEL[topic])}</category>`).join('\n      ')}
      <description>${escapeXml(data.standfirst)}</description>
      <content:encoded><![CDATA[${body.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]></content:encoded>${
        data.image ? `\n      <enclosure url="${SITE}${data.image}" type="image/webp" length="0" />` : ''
      }
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Visit Moganshan: news</title>
    <link>${SITE}${NEWS_INDEX}</link>
    <atom:link href="${SITE}${NEWS_FEED}" rel="self" type="application/rss+xml" />
    <description>What is changing at Moganshan, Deqing County, Zhejiang: tickets, transport, entry rules, openings and events, each item dated, sourced in Chinese and ending with what it means for a visitor.</description>
    <language>en</language>
    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
    <ttl>360</ttl>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
