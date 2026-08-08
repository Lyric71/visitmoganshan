import { getCollection, type CollectionEntry } from 'astro:content';
import seed from '../../data/seed/properties.seed.json';

/**
 * The Trip.com affiliate layer.
 *
 * Two things live here and they are deliberately separate.
 *
 * The **seed** is the 809 row affiliate list. It is identity and links only:
 * hotel id, name, city, slug, and the tracked deep link. It carries no
 * photographs, no description and no reviews, so it can never on its own
 * produce a page. Its job is to power the /go/ redirect table and the
 * storefront links that stand in for the long tail.
 *
 * The **stays collection** is the editorial layer. An entry only exists once a
 * property has real sourced content behind it, and only renders a page once it
 * is marked published. There is no stub file per seed row: a stub would be 809
 * files that duplicate the seed, fail their own schema for want of images, and
 * render nothing. The seed is the draft register.
 *
 * Nothing here reads a third party at request time. The affiliate URL is baked
 * into the seed, the redirect table is generated at build time, and the only
 * runtime artefact is an internal /go/ link.
 */

export type StayEntry = CollectionEntry<'stays'>;

export type SeedRecord = {
  id: number;
  slug: string;
  name: string;
  city: string;
  cityId: number;
  goSlug: string;
  affiliateUrl: string;
  status: string;
};

export const STAYS_SEED: SeedRecord[] = seed as SeedRecord[];

/** Seed rows by hotel id, for the scripts and for the affiliate assertion. */
export const SEED_BY_ID = new Map(STAYS_SEED.map((row) => [row.id, row]));

/**
 * The internal link a reader actually clicks. Never the affiliate URL itself:
 * one indirection means a link can be re-pointed, counted or killed in one
 * place, and it keeps the tracking parameters out of the page source.
 */
export function goPath(goSlug: string): string {
  return `/go/${goSlug}`;
}

/** The canonical route for one property page. */
export function stayPath(slug: string): string {
  return `/where-to-stay/${slug}`;
}

/**
 * The Trip.com search storefront for a city, tracked with the same alliance
 * and SID as the deep links.
 *
 * This is what the long tail gets instead of a page of its own. Several hundred
 * near identical property pages built from scraped fragments is a doorway page
 * problem whatever the intent, and a search link is both honest and more useful:
 * it shows live availability rather than a snapshot of one afternoon.
 */
export function storefrontUrl(city: 'Deqing' | 'Huzhou' = 'Deqing'): string {
  const cityId = city === 'Huzhou' ? 86 : 1367;
  const params = new URLSearchParams({
    cityEnName: city,
    cityId: String(cityId),
    Allianceid: '9859697',
    SID: '327673690',
    trip_sub1: `moganshan-storefront-${city.toLowerCase()}`,
    trip_sub3: 'D19127628',
  });
  return `https://www.trip.com/hotels/list?${params.toString()}`;
}

/**
 * What kind of place this is, guessed from the name.
 *
 * The seed carries no type field, and the names are a mess: Chinese-influenced
 * transliterations, marketing suffixes, pool and theme claims stacked behind
 * middle dots. Matching on the name is the only signal available, and it is
 * good enough for grouping a directory as long as nobody mistakes it for a
 * verified fact. Roughly one in eight declares nothing at all, and those are
 * grouped as unclassified rather than guessed at.
 *
 * Two rules earn their place. Anything in brackets is dropped before matching,
 * because the bracket almost always holds a location rather than a
 * description, and "Moganshan International Tourism Resort" is the name of an
 * administrative zone that half the minsu on the mountain sit inside. And
 * "meisu" beats "resort": a place calling itself both is a guesthouse with an
 * address, not a resort.
 */
const TYPE_PATTERNS: [StayType, RegExp][] = [
  ['Hostel', /hostel|youth hostel/i],
  [
    'Homestay',
    /homestay|mei\s?su|min\s?su|ming\s?su|guesthouse|guest house|b&b|farmstay|farmhouse|boutique stay|\bstay\b|\bhouse\b|\bhome\b|\byard\b|courtyard|family hotel/i,
  ],
  ['Resort', /resort/i],
  ['Apartment', /apartment|apart-?hotel|serviced/i],
  ['Villa', /villa|residence|mansion|manor|chateau|castle/i],
  ['Lodge', /lodge|\binn\b|cabin|camp|tent|glamping|retreat|club/i],
  ['Hotel', /hotel|hostal/i],
];

export type StayType =
  | 'Resort'
  | 'Hostel'
  | 'Apartment'
  | 'Homestay'
  | 'Villa'
  | 'Lodge'
  | 'Hotel'
  | 'Unclassified';

export function guessType(name: string): StayType {
  const withoutBrackets = name.replace(/[（(][^)）]*[)）]/g, ' ');
  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(withoutBrackets)) return type;
  }
  return 'Unclassified';
}

/** Directory order: the kinds of place people search for, most distinct first. */
export const TYPE_ORDER: StayType[] = [
  'Resort',
  'Villa',
  'Homestay',
  'Hotel',
  'Lodge',
  'Apartment',
  'Hostel',
  'Unclassified',
];

export const TYPE_BLURB: Record<StayType, string> = {
  Resort: 'Large grounds, restaurants on site, and usually the highest rates on the mountain.',
  Villa: 'Whole houses and standalone units, often booked by one group at a time.',
  Homestay:
    'Minsu, the Chinese guesthouse form. Small, owner run, and the reason most people come.',
  Hotel: 'Conventional hotels, in Deqing town and along the approach roads.',
  Lodge: 'Cabins, camps, retreats and clubs, generally further up and further out.',
  Apartment: 'Self-catering units, useful for a longer stay or a family that wants a kitchen.',
  Hostel: 'Beds rather than rooms, at the bottom of the price range.',
  Unclassified: 'The name gives nothing away. We have not been, so we are not guessing.',
};

/** Published stays, name-sorted. The only thing that ever renders a page. */
export async function getPublishedStays(): Promise<StayEntry[]> {
  const all = await getCollection('stays');
  return all
    .filter((entry) => entry.data.status === 'published')
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/**
 * What the route builds paths from.
 *
 * Published only, except when STAYS_PREVIEW is set. Preview exists so the
 * template can be worked on against draft entries without ever publishing them;
 * the pages it produces carry noindex and are kept out of the sitemap, and the
 * flag is never set on a production build.
 */
export async function getRoutableStays(): Promise<StayEntry[]> {
  if (process.env.STAYS_PREVIEW) {
    const all = await getCollection('stays');
    return all.sort((a, b) => a.data.name.localeCompare(b.data.name));
  }
  return getPublishedStays();
}

/**
 * Two or three siblings for the foot of a property page. Same village first,
 * then anything else published, because a reader who has just decided against
 * one place wants the next one in the same valley, not the next one alphabetically.
 */
export function siblingStays(entry: StayEntry, all: StayEntry[], count = 3): StayEntry[] {
  const others = all.filter((candidate) => candidate.id !== entry.id);
  const sameVillage = others.filter(
    (candidate) => entry.data.village && candidate.data.village === entry.data.village,
  );
  const rest = others.filter((candidate) => !sameVillage.includes(candidate));
  return [...sameVillage, ...rest].slice(0, count);
}

/** The one line of fact chips under the h1. Empty values drop out entirely. */
export function factChips(data: StayEntry['data']): string[] {
  return [
    data.type,
    data.village,
    data.rating
      ? `${data.rating.score.toFixed(1)} out of ${data.rating.scale}, ${data.rating.count.toLocaleString('en-GB')} reviews`
      : null,
  ].filter((chip): chip is string => Boolean(chip));
}

const SITE = 'https://www.visitmoganshan.com';

/**
 * Hotel JSON-LD for one property.
 *
 * aggregateRating is deliberately not emitted. The rating shown on the page is
 * Trip.com's, attributed and linked, and redistributing another platform's
 * aggregate as our own structured data is a claim we have no licence to make.
 * The spec says omit when unsure. We are unsure, so it is omitted, and it stays
 * omitted until a licence says otherwise.
 */
export function stayJsonLd(data: StayEntry['data']): object {
  const url = `${SITE}${stayPath(data.slug)}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: data.name,
    description: data.description,
    url,
    image: data.images.map((image) => `${SITE}${image.src}`),
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.city,
      addressRegion: 'Zhejiang',
      addressCountry: 'CN',
    },
    containedInPlace: { '@type': 'Place', name: 'Moganshan' },
  };
}
