import { getCollection, type CollectionEntry } from 'astro:content';

export type GuideEntry = CollectionEntry<'guide'>;

const SITE = 'https://www.visitmoganshan.com';

/** Drafts are written with trailing slashes; routes here never carry one. */
export function toPath(url: string): string {
  const trimmed = url.trim();
  return trimmed === '/' ? '/' : trimmed.replace(/\/+$/, '');
}

/** The `[...slug]` param: the path without its leading slash. */
export function toSlug(url: string): string {
  return toPath(url).replace(/^\//, '');
}

/**
 * Top-level section labels, matched to the primary nav so a reader arriving on
 * a deep page from search sees the same word in the breadcrumb that they will
 * see in the header.
 */
const SECTIONS: Record<string, string> = {
  moganshan: 'Discover',
  'things-to-do': 'Things to do',
  'where-to-stay': 'Where to stay',
  'getting-here': 'Getting here',
  itineraries: 'Itineraries',
  plan: 'Plan your trip',
  seasons: 'Seasons',
  groups: 'Groups',
};

export function sectionLabel(url: string): string | undefined {
  return SECTIONS[toPath(url).split('/')[1] ?? ''];
}

export type Crumb = { label: string; href: string };

/**
 * Breadcrumbs built from the path, with each level's label taken from the page
 * that actually sits there when one exists. Intermediate levels that have no
 * page yet still get a link: the pages are commissioned, and a breadcrumb that
 * silently drops a level teaches Google a flatter site than we are building.
 */
export function breadcrumbsFor(url: string, all: GuideEntry[]): Crumb[] {
  const byPath = new Map(all.map((e) => [toPath(e.data.url), e.data.title]));
  const segments = toPath(url).split('/').filter(Boolean);

  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];
  let href = '';

  segments.forEach((segment, i) => {
    href += `/${segment}`;
    const isSection = i === 0;
    const label =
      (isSection ? SECTIONS[segment] : undefined) ?? byPath.get(href) ?? titleCase(segment);
    crumbs.push({ label, href });
  });

  return crumbs;
}

function titleCase(segment: string): string {
  const words = segment.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * Other pages in the same top-level section, for the "more in this section"
 * block at the foot of an article. Deep pages arriving from search are the
 * whole traffic model here, so every one of them needs a way sideways.
 */
export function siblingsOf(entry: GuideEntry, all: GuideEntry[]): GuideEntry[] {
  const section = toPath(entry.data.url).split('/')[1];
  return all
    .filter((e) => e.id !== entry.id && toPath(e.data.url).split('/')[1] === section)
    .sort((a, b) => toPath(a.data.url).length - toPath(b.data.url).length);
}

export async function getGuideEntries(): Promise<GuideEntry[]> {
  return getCollection('guide');
}

/** Rounded to the nearest minute at 220 wpm, the usual reading-speed average. */
export function readingMinutes(words: number | undefined): number | undefined {
  return words ? Math.max(1, Math.round(words / 220)) : undefined;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ==========================================================================
   Structured data
   ========================================================================== */

export type Faq = { question: string; answer: string };

/**
 * Pull the question-and-answer pairs out of the raw markdown.
 *
 * The house pattern for an FAQ block is a bolded question on its own line
 * followed by an answer paragraph, so that is what this matches. Inline bold
 * inside a sentence cannot match, because the marker has to open the line and
 * the line has to end in a question mark.
 */
export function extractFaqs(body: string): Faq[] {
  const lines = body.split(/\r?\n/);
  const faqs: Faq[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const match = /^\*\*(.+\?)\*\*\s*$/.exec(lines[i]!);
    if (!match) continue;

    const answer: string[] = [];
    for (let j = i + 1; j < lines.length; j += 1) {
      const line = lines[j]!.trim();
      if (!line) break;
      answer.push(line);
    }

    if (answer.length) {
      faqs.push({ question: match[1]!, answer: stripMarkdown(answer.join(' ')) });
    }
  }

  return faqs;
}

/** Answers go into JSON-LD as text, so links and emphasis come back out. */
function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

const PUBLISHER = {
  '@type': 'Organization',
  name: 'BeyondBorder Group Ltd',
  url: SITE,
  address: { '@type': 'PostalAddress', addressCountry: 'HK' },
};

const MOGANSHAN_ADDRESS = {
  '@type': 'PostalAddress',
  addressLocality: 'Deqing County',
  addressRegion: 'Zhejiang',
  addressCountry: 'CN',
};

/**
 * Build the JSON-LD blocks for one page.
 *
 * The frontmatter `schema` field is the draft's intent, e.g.
 * "Article + Place + FAQPage", and it decides which blocks are emitted.
 *
 * HowTo is deliberately not emitted even where a draft asks for it: Google
 * retired HowTo rich results in 2023, and marking a prose route guide as a
 * numbered procedure buys nothing while committing us to keeping the steps and
 * the copy in sync.
 */
export function guideJsonLd(entry: GuideEntry, crumbs: Crumb[]): object[] {
  const { data } = entry;
  const canonical = `${SITE}${toPath(data.url)}`;
  const wanted = data.schema.split('+').map((s) => s.trim().toLowerCase());
  const iso = data.last_updated.toISOString().slice(0, 10);

  const blocks: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.meta_description,
      inLanguage: 'en',
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
      url: canonical,
      datePublished: iso,
      dateModified: iso,
      author: PUBLISHER,
      publisher: PUBLISHER,
      about: { '@type': 'Place', name: 'Moganshan', address: MOGANSHAN_ADDRESS },
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

  if (wanted.includes('place') || wanted.includes('touristattraction')) {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': wanted.includes('touristattraction') ? 'TouristAttraction' : 'Place',
      name: data.title.startsWith('The ') ? data.title : 'Moganshan',
      alternateName: ['Mount Mogan', '莫干山'],
      description: data.excerpt,
      url: canonical,
      address: MOGANSHAN_ADDRESS,
      geo: { '@type': 'GeoCoordinates', latitude: 30.594, longitude: 119.891 },
    });
  }

  if (wanted.includes('faqpage')) {
    const faqs = extractFaqs(entry.body ?? '');
    if (faqs.length) {
      blocks.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      });
    }
  }

  return blocks;
}
