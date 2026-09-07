import { getCollection, type CollectionEntry } from 'astro:content';
import { authorById, personLd, type AuthorId } from '../data/authors';
import { NEWS_TOPICS, TOPIC_LABEL, type NewsTopic } from '../data/news-topics';
import { formatDate, type Crumb } from './guide';

export type NewsEntry = CollectionEntry<'news'>;

const SITE = 'https://www.visitmoganshan.com';

export const NEWS_INDEX = '/journal/news';
export const NEWS_FEED = '/journal/news/feed.xml';
export const NEWS_SITEMAP = '/journal/news/sitemap-news.xml';
/** Items per index page. The master plan's number; twenty short items is a screen and a half. */
export const NEWS_PAGE_SIZE = 20;

/** The id is the filename without extension, YYYY-MM-DD-{slug}; the URL takes the slug alone. */
export function newsSlug(entry: NewsEntry): string {
  return entry.id.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

/**
 * The permalink. Items live under their publish year and month, dispatches
 * under their ISO week, so a URL says what kind of thing it is before it is
 * opened and two items published the same day cannot collide with a digest.
 */
export function newsPath(entry: NewsEntry): string {
  const { data } = entry;
  if (data.kind === 'dispatch') return `${NEWS_INDEX}/dispatch/${data.week}`;
  const iso = data.published.toISOString();
  return `${NEWS_INDEX}/${iso.slice(0, 4)}/${iso.slice(5, 7)}/${newsSlug(entry)}`;
}

export const topicPath = (topic: NewsTopic): string => `${NEWS_INDEX}/topic/${topic}`;
export const archivePath = (year: number | string): string => `${NEWS_INDEX}/archive/${year}`;
export const indexPageUrl = (page: number): string => (page <= 1 ? NEWS_INDEX : `${NEWS_INDEX}/${page}`);

export const KIND_LABEL = { item: 'News', breaking: 'Breaking', dispatch: 'Weekly dispatch' } as const;

/** "Week 38, 2026" from "2026-38". */
export function weekLabel(week: string | undefined): string {
  if (!week) return '';
  const [year, number] = week.split('-');
  return `Week ${Number(number)}, ${year}`;
}

function newestFirst(a: NewsEntry, b: NewsEntry): number {
  return (
    b.data.published.getTime() - a.data.published.getTime() ||
    (b.data.event_date?.getTime() ?? 0) - (a.data.event_date?.getTime() ?? 0) ||
    a.data.title.localeCompare(b.data.title)
  );
}

/**
 * Every news entry, newest first.
 *
 * Two guards the schema cannot express run here, so a file that breaks either
 * fails the build rather than the rule: no affiliate link in a news item (the
 * master plan's Part 4.8, "disclosure line only"), and no em dash, since the
 * house rule is none anywhere and a news body is the one place on the site
 * written under time pressure.
 */
export async function getNewsEntries(): Promise<NewsEntry[]> {
  const entries = await getCollection('news');
  for (const entry of entries) {
    const body = entry.body ?? '';
    if (/\/go\//.test(body)) {
      throw new Error(`News item ${entry.id} contains a /go/ affiliate link. News never carries one.`);
    }
    if (/—|–/.test(body)) {
      throw new Error(`News item ${entry.id} contains an em or en dash. Rewrite with a comma, a full stop or a colon.`);
    }
  }
  return entries.sort(newestFirst);
}

export async function latestNews(count: number): Promise<NewsEntry[]> {
  return (await getNewsEntries()).slice(0, count);
}

/** Topics that have at least one entry, in the canonical order, with counts. */
export function topicsInUse(entries: NewsEntry[]): { topic: NewsTopic; label: string; count: number }[] {
  return NEWS_TOPICS.map((topic) => ({
    topic,
    label: TOPIC_LABEL[topic],
    count: entries.filter((entry) => entry.data.topics.includes(topic)).length,
  })).filter((row) => row.count > 0);
}

/** Years with at least one entry, newest first, with counts. */
export function yearsInUse(entries: NewsEntry[]): { year: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const entry of entries) {
    const year = entry.data.published.getUTCFullYear();
    counts.set(year, (counts.get(year) ?? 0) + 1);
  }
  return [...counts.entries()].map(([year, count]) => ({ year, count })).sort((a, b) => b.year - a.year);
}

export function newsCrumbs(entry: NewsEntry): Crumb[] {
  const crumbs: Crumb[] = [
    { label: 'Home', href: '/' },
    { label: 'Journal', href: '/journal' },
    { label: 'News', href: NEWS_INDEX },
  ];
  if (entry.data.kind === 'dispatch') crumbs.push({ label: weekLabel(entry.data.week), href: newsPath(entry) });
  else crumbs.push({ label: entry.data.title, href: newsPath(entry) });
  return crumbs;
}

/** The date line for an item: the event date when it differs from publication. */
export function eventLine(entry: NewsEntry): string | null {
  const { event_date, published } = entry.data;
  if (!event_date) return null;
  const sameDay = event_date.toISOString().slice(0, 10) === published.toISOString().slice(0, 10);
  return sameDay ? null : `What changed on ${formatDate(event_date)}`;
}

/* ==========================================================================
   Structured data
   ========================================================================== */

const PUBLISHER = {
  '@type': 'Organization',
  name: 'BeyondBorder Group Ltd',
  url: SITE,
  address: { '@type': 'PostalAddress', addressCountry: 'HK' },
};

/**
 * NewsArticle, not Article, with a populated citation array built from the
 * sources block. The citation list carrying real Chinese source URLs is what
 * no competing English page on this destination does, and it is emitted on
 * every item rather than on the ones somebody remembered.
 */
export function newsJsonLd(entry: NewsEntry, crumbs: Crumb[]): object[] {
  const { data } = entry;
  const canonical = `${SITE}${newsPath(entry)}`;
  const author = personLd(authorById(data.author as AuthorId));
  const blocks: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: data.title.slice(0, 110),
      description: data.meta_description,
      inLanguage: 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical,
      datePublished: data.published.toISOString().slice(0, 10),
      dateModified: data.last_updated.toISOString().slice(0, 10),
      author,
      publisher: PUBLISHER,
      ...(data.image ? { image: [`${SITE}${data.image}`] } : {}),
      keywords: data.topics.map((topic) => TOPIC_LABEL[topic]),
      citation: data.sources.map((source) => ({
        '@type': 'CreativeWork',
        name: source.name,
        alternateName: source.name_en,
        url: source.url,
        datePublished: source.date.toISOString().slice(0, 10),
      })),
      about: {
        '@type': 'TouristDestination',
        name: 'Moganshan',
        alternateName: ['Mount Mogan', '莫干山'],
        address: { '@type': 'PostalAddress', addressLocality: 'Deqing County', addressRegion: 'Zhejiang', addressCountry: 'CN' },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.label,
        item: `${SITE}${crumb.href === '/' ? '' : crumb.href}`,
      })),
    },
  ];
  return blocks;
}

/* ==========================================================================
   Feed
   ========================================================================== */

export const escapeXml = (text: string): string =>
  text.replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!);

/**
 * A small markdown to HTML pass for the feed body.
 *
 * The feed carries full text (Part 4.5 of the master plan), and the container
 * API that would render the real component is still experimental in this
 * Astro. News bodies use a narrow subset: paragraphs, h2 and h3, bold, italic,
 * links, blockquotes, bullet and numbered lists, and the occasional table,
 * which is dropped since a feed reader renders one badly. Anything else falls
 * through as text.
 */
export function markdownToFeedHtml(markdown: string): string {
  const inline = (text: string): string =>
    escapeXml(text)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
        const target = href.startsWith('/') ? `${SITE}${href.replace(/\/+$/, '')}` : href;
        return `<a href="${target}">${label}</a>`;
      });

  const blocks = markdown
    .replace(/\r\n/g, '\n')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      if (/^\|/.test(block)) return '';
      const heading = /^(#{2,3})\s+(.+)$/.exec(block);
      if (heading) return `<h${heading[1]!.length}>${inline(heading[2]!)}</h${heading[1]!.length}>`;
      if (/^>/.test(block)) return `<blockquote><p>${inline(block.replace(/^>\s?/gm, '').replace(/\n/g, ' '))}</p></blockquote>`;
      if (/^[-*]\s/.test(block)) {
        const items = block.split('\n').map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`);
        return `<ul>${items.join('')}</ul>`;
      }
      if (/^\d+\.\s/.test(block)) {
        const items = block.split('\n').map((line) => `<li>${inline(line.replace(/^\d+\.\s+/, ''))}</li>`);
        return `<ol>${items.join('')}</ol>`;
      }
      return `<p>${inline(block.replace(/\n/g, ' '))}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}
