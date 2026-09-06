/**
 * The people who write this site.
 *
 * Three names, and every article carries one of them in its frontmatter
 * `author` field. The byline under the standfirst, the Person block in the
 * structured data and the "who writes it" section on the About page all read
 * from here, so a change to a role or a profile link is made once.
 *
 * The LinkedIn profiles are the same ones the group's other sites publish, and
 * they are the credibility signal: a byline that resolves to a real person
 * with a public work history is worth more than a company name, and a byline
 * that resolves to nothing is worth less. Do not add a name here without a
 * profile that can be checked.
 */
export type AuthorId = 'cyril-drouin' | 'liyan-ye' | 'echo-peng';

export type Author = {
  id: AuthorId;
  name: string;
  /** The role as printed on the About page and in jobTitle. */
  role: string;
  /** One or two sentences, for the About page. Sourced, never inflated. */
  bio: string;
  linkedin: string;
  /** Other public profiles, for sameAs. */
  sameAs?: string[];
};

export const AUTHORS: Record<AuthorId, Author> = {
  'cyril-drouin': {
    id: 'cyril-drouin',
    name: 'Cyril Drouin',
    role: 'Founder and editor',
    bio: 'Twenty-five years in digital, advertising and commerce, most of them in mainland China. Former CEO of Publicis Commerce and Performance Marketing for China and North Asia. Writes the planning, transport and history pages and edits everything else.',
    linkedin: 'https://www.linkedin.com/in/cyril-d-68835729/',
    sameAs: ['https://cyrildrouin.substack.com/'],
  },
  'liyan-ye': {
    id: 'liyan-ye',
    name: 'Liyan Ye',
    role: 'Senior director, writer',
    bio: 'Senior director in brand and campaign work for Fortune 500 companies in China, based in Shanghai. Writes the pages on the mountain itself: the villages, the seasons, the tea, the bamboo and what there is to do.',
    linkedin: 'https://www.linkedin.com/in/liyanye/',
  },
  'echo-peng': {
    id: 'echo-peng',
    name: 'Echo Peng',
    role: 'Senior director, writer',
    bio: 'Eighteen years running e-commerce and digital operations for global brands in China, including a stretch as operations director at Publicis China. Writes the accommodation, itinerary and group pages, where the booking mechanics matter.',
    linkedin: 'https://www.linkedin.com/in/echo-peng-aa241751/',
  },
};

export const AUTHOR_IDS = Object.keys(AUTHORS) as AuthorId[];

/** Used when a page has no `author` in its frontmatter. */
export const DEFAULT_AUTHOR: AuthorId = 'cyril-drouin';

export function authorById(id: AuthorId | undefined): Author {
  return AUTHORS[id ?? DEFAULT_AUTHOR];
}

/** The About page anchor for one author, which is also the Person url. */
export const authorPath = (author: Author): string => `/about#${author.id}`;

const SITE = 'https://www.visitmoganshan.com';

/** A Person block for the structured data, complete enough to stand alone. */
export function personLd(author: Author): Record<string, unknown> {
  return {
    '@type': 'Person',
    '@id': `${SITE}${authorPath(author)}`,
    name: author.name,
    jobTitle: author.role,
    url: `${SITE}${authorPath(author)}`,
    sameAs: [author.linkedin, ...(author.sameAs ?? [])],
    worksFor: { '@type': 'Organization', name: 'BeyondBorder Group Ltd' },
  };
}
