import { getGuideEntries, sectionLabel, toPath } from './guide';

/**
 * The search index.
 *
 * Built at build time from the guide collection and served as one static JSON
 * file, because a static site has no query layer and a fifteen page guide does
 * not need one. The browser fetches the file once on the search page and does
 * the matching locally, so there is nothing to keep running and nothing to pay
 * for. Revisit when the guide passes roughly two hundred pages: past there the
 * file stops being cheap and the index wants splitting by section, or moving
 * behind a real endpoint.
 *
 * Field names are single letters. On a file this size that is worth about a
 * fifth of the payload, and the shape is written down in the type below.
 */
export type SearchDoc = {
  /** Title. */
  t: string;
  /** URL, already normalised to a no-trailing-slash route. */
  u: string;
  /** Excerpt, used as the result summary when nothing better matches. */
  e: string;
  /** Section label, matching the word used in the header and the breadcrumb. */
  s: string;
  /** Primary and secondary keywords, space joined. */
  k: string;
  /** Body copy as plain text, trimmed. See BODY_CHARS. */
  b: string;
};

/**
 * How much body copy each entry carries.
 *
 * Enough to match on a detail buried three quarters of the way down a page,
 * and to cut a snippet around it. These articles run 1,300 to 2,100 words, so
 * this is most of a page rather than the opening. It is the one number that
 * decides how the index grows: fifteen pages at this cap is about 90 KB before
 * compression, which is fine to fetch once and cache.
 */
const BODY_CHARS = 6000;

export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const entries = await getGuideEntries();

  return entries
    .map((entry) => {
      const { data } = entry;
      return {
        t: data.title,
        u: toPath(data.url),
        e: data.excerpt,
        s: sectionLabel(data.url) ?? 'Guide',
        k: [data.primary_keyword, ...data.secondary_keywords].join(' '),
        b: toPlainText(entry.body ?? '').slice(0, BODY_CHARS),
      };
    })
    .sort((a, b) => a.u.localeCompare(b.u));
}

/**
 * Markdown to plain text.
 *
 * Deliberately blunt: the output is only ever matched against and cut into
 * snippets, never rendered, so the goal is readable prose with no syntax left
 * in it rather than a faithful parse. Code fences and tables go entirely, since
 * a fare table matches on numbers that mean nothing out of their column and
 * would make a nonsense snippet.
 */
export function toPlainText(markdown: string): string {
  return markdown
    // The drafts open with a `# Title` that the build strips before rendering
    // (see src/lib/markdown.mjs). Left in, it would repeat the title at the top
    // of every snippet.
    .replace(/^\s*#\s+.*$/m, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*\|.*$/gm, ' ')
    .replace(/^\s{0,3}(#{1,6})\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}([-*_])\s*\1\s*\1[\s\S]*?$/gm, ' ')
    .replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s{0,3}\d+\.\s+/gm, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
