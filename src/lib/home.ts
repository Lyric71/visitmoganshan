import {
  formatDate,
  getGuideEntries,
  sectionLabel,
  toPath,
  type GuideEntry,
} from "./guide";
import { KIND_LABEL, getNewsEntries, newsPath } from "./news";

/**
 * What the home page shows of the guide collection.
 *
 * Every block here is derived from the collection at build time rather than
 * retyped in a data file, so the publish step of the editorial pipeline, which
 * drops one new article into src/content/guide every three days, changes the
 * home page without a second edit. A hand kept list of "latest articles" is a
 * list that is wrong within a week.
 */

/**
 * Pages that are on the site but are not guide reading: the masthead pages,
 * and the journal. The journal is not promoted from the home page (Cyril,
 * 7 September 2026: a long read section with no cadence cannot be kept up),
 * so its landing page and its pieces stay out of every block here. The news
 * items are their own collection and are read by newsItems.
 */
const UTILITY = new Set(["/about", "/advertise"]);

function isArticle(entry: GuideEntry): boolean {
  const path = toPath(entry.data.url);
  return (
    !UTILITY.has(path) && !(path === "/journal" || path.startsWith("/journal/"))
  );
}

function newestFirst(a: GuideEntry, b: GuideEntry): number {
  return (
    b.data.published.getTime() - a.data.published.getTime() ||
    a.data.title.localeCompare(b.data.title)
  );
}

/** Every readable page, newest first. */
export async function getArticles(): Promise<GuideEntry[]> {
  const all = await getGuideEntries();
  return all.filter(isArticle).sort(newestFirst);
}

/** The most recently published guide pages. */
export async function latestArticles(count: number): Promise<GuideEntry[]> {
  const articles = await getArticles();
  return articles.slice(0, count);
}

/**
 * One page per named property. These are the articles under
 * /where-to-stay/hotels/, each researched and sourced, and the only pages on
 * the site that are about a single bookable place.
 */
export async function propertyArticles(): Promise<GuideEntry[]> {
  const articles = await getArticles();
  return articles
    .filter((entry) =>
      toPath(entry.data.url).startsWith("/where-to-stay/hotels/"),
    )
    .sort((a, b) =>
      a.data.title.localeCompare(b.data.title, "en-GB", {
        sensitivity: "base",
      }),
    );
}

export type Section = {
  label: string;
  /** The section landing page, when one exists. */
  href: string;
  entries: GuideEntry[];
};

/**
 * Every guide page grouped by its top level section, in nav order, with the
 * landing page first and the rest alphabetical.
 */
export async function articlesBySection(): Promise<Section[]> {
  const articles = await getArticles();
  const groups = new Map<string, Section>();

  for (const entry of articles) {
    const path = toPath(entry.data.url);
    const label = sectionLabel(path);
    if (!label) continue;
    const root = `/${path.split("/")[1]}`;
    const group = groups.get(label) ?? { label, href: root, entries: [] };
    group.entries.push(entry);
    groups.set(label, group);
  }

  const bySection = [...groups.values()];
  for (const section of bySection) {
    section.entries.sort((a, b) => {
      const aRoot = toPath(a.data.url) === section.href;
      const bRoot = toPath(b.data.url) === section.href;
      if (aRoot !== bRoot) return aRoot ? -1 : 1;
      return a.data.title.localeCompare(b.data.title, "en-GB", {
        sensitivity: "base",
      });
    });
  }

  return bySection;
}

export type NewsItem = {
  /** The publish date, printed. */
  when: string;
  /** The same date as ISO, for the <time> element. */
  iso: string;
  headline: string;
  standfirst: string;
  /** "News", "Breaking" or "Weekly dispatch". */
  kind: string;
  /** The item's permalink. */
  href: string;
};

/**
 * The latest news items, newest first, from the news collection.
 *
 * This used to parse the dated headings of one long news page. The news
 * layer replaced that page with one file per item and a permalink each, so
 * the home page reads the collection like everything else it lists, and an
 * item published by the news pipeline appears here the same build.
 */
export async function newsItems(count: number): Promise<NewsItem[]> {
  const entries = await getNewsEntries();
  return entries.slice(0, count).map((entry) => ({
    when: formatDate(entry.data.published),
    iso: entry.data.published.toISOString().slice(0, 10),
    headline: entry.data.title,
    standfirst: entry.data.standfirst,
    kind: KIND_LABEL[entry.data.kind],
    href: newsPath(entry),
  }));
}
