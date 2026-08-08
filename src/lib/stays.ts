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
 * What kind of place this is, worked out from the name.
 *
 * The seed carries no type field. The names are a mess of transliteration,
 * marketing suffix and theme claim, written across three scripts, and matching
 * them is the only signal there is. It is good enough to group a directory by,
 * and the page says it is inferred rather than verified.
 *
 * Three things make it work at all:
 *
 * A bracket usually holds a location, not a description, so it is dropped
 * before matching. "Moganshan International Tourism Resort" is an
 * administrative zone half the minsu on this mountain sit inside, and reading
 * it as a resort miscounts dozens of guesthouses. The exception is a bracket
 * that does declare a type, which is kept.
 *
 * The patterns carry the romanisations and the characters, not just the
 * English. Meishu, meizhu, meisu, minsu, 民宿, 客栈, shanzhuang, 山庄, 美墅 and
 * 青年旅社 are how most of these places describe themselves, and the listing
 * spellings are inconsistent enough that the obvious typos are matched too:
 * Homesaty, Gresthouse, Viila, and Inn set in a lowercase L.
 *
 * And there is no unclassified bucket. Roughly one name in eight declares
 * nothing at all, and those default to Homestay because the minsu is what this
 * mountain overwhelmingly is: a small owner-run guesthouse with a made-up
 * English name. Guessing wrong there puts a place in the largest and vaguest
 * category, which is a smaller error than presenting a reader with a hundred
 * properties filed under nothing.
 */
const TYPE_PATTERNS: [StayType, RegExp][] = [
  ['Hostel', /hostel|youth hostel|青年旅社|旅舍/i],
  ['Apartment', /apartment|apart-?hotel|serviced|公寓/i],
  [
    'Lodge',
    /lodge|\b[il]nn\b|cabin|\bcamp\b|camping|tent|glamping|retreat|hideaway|\brv\b|caravan|club|营地/i,
  ],
  [
    'Homestay',
    /homestay|homesaty|home\s?stay|民宿|客栈|mei\s?su|mei\s?shu|mei\s?zhu|min\s?su|ming\s?su|guesthouse|guest\s?house|gresthouse|b\s*&\s*b|b\s+and\s+b|bed\s*&\s*breakfast|farmstay|farm\s?house|\bfarm\b|boutique stay|onestay|\bstay\b|house\b|\bhome\b|\byard\b|courtyard|family hotel|accommodation|\bsu\b|宿/i,
  ],
  ['Resort', /resort|度假村/i],
  [
    'Villa',
    /villa|viila|residence|mansion|manor|chateau|castle|maison|cottage|shan\s?zhuang|山庄|美墅|别墅|草堂/i,
  ],
  ['Hotel', /hotel|hostal|plaza|酒店/i],
];

export type StayType = 'Resort' | 'Villa' | 'Homestay' | 'Hotel' | 'Lodge' | 'Apartment' | 'Hostel';

const BRACKETED = /[（(][^)）]*[)）]/g;

export function guessType(name: string): StayType {
  const inner = (name.match(BRACKETED) ?? []).join(' ');
  const declaresType = /homestay|民宿|hostel|villa|resort|hotel|inn|apartment/i.test(inner);
  const target = declaresType ? name : name.replace(BRACKETED, ' ');

  for (const [type, pattern] of TYPE_PATTERNS) {
    if (pattern.test(target)) return type;
  }
  return 'Homestay';
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
];

/** Plural label for one type, used by the nav and by each listing page. */
export const TYPE_LABEL: Record<StayType, string> = {
  Resort: 'Resorts',
  Villa: 'Villas',
  Homestay: 'Homestays',
  Hotel: 'Hotels',
  Lodge: 'Lodges',
  Apartment: 'Apartments',
  Hostel: 'Hostels',
};

/**
 * One page per kind of place, at /where-to-stay/{plural}.
 *
 * Seven listings rather than one long index with anchors. "Moganshan villas"
 * and "Moganshan homestays" are different searches by different people, and a
 * jump link inside a page of eight hundred rows ranks for neither of them.
 *
 * All seven are listings and nothing else: a heading, a count and the cards. The
 * hotels and villas URLs used to be articles with the list appended below 1,300
 * words of prose, which made two of the seven behave unlike the other five and
 * buried the thing the page is for. Those articles now live at
 * /where-to-stay/hotels-explained and /where-to-stay/villas-explained.
 */
export const TYPE_SLUG: Record<StayType, string> = {
  Resort: 'resorts',
  Villa: 'villas',
  Homestay: 'homestays',
  Hotel: 'hotels',
  Lodge: 'lodges',
  Apartment: 'apartments',
  Hostel: 'hostels',
};

export const typePath = (type: StayType): string => `/where-to-stay/${TYPE_SLUG[type]}`;

/** Every seed row for one kind of place, name-sorted. */
export function staysOfType(type: StayType): SeedRecord[] {
  return STAYS_SEED.filter((row) => guessType(row.name) === type).sort((a, b) =>
    a.name.localeCompare(b.name, 'en'),
  );
}

export function countOfType(type: StayType): number {
  return STAYS_SEED.reduce((count, row) => count + (guessType(row.name) === type ? 1 : 0), 0);
}

/**
 * The types that need a generated page, which today is all seven.
 *
 * The filter stays as a collision guard rather than a feature: an article whose
 * frontmatter `url` claims a type slug would otherwise have this route and the
 * catch-all guide route both building the same path, and Astro fails that build
 * with a duplicate-route error rather than telling anyone which article did it.
 */
export async function typePagesToGenerate(): Promise<StayType[]> {
  const guide = await getCollection('guide');
  const taken = new Set(guide.map((entry) => entry.data.url.replace(/\/+$/, '')));
  return TYPE_ORDER.filter((type) => !taken.has(typePath(type)));
}

/** Published stays, name-sorted. The only thing that ever renders a page. */
export async function getPublishedStays(): Promise<StayEntry[]> {
  const all = await getCollection('stays');
  return all
    .filter((entry) => entry.data.status === 'published')
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
}

/**
 * Properties that already have a written article, keyed by hotelId.
 *
 * A guide page carrying `stay_id` is the one page for that property. It is a
 * thousand words of research with a position, and the property template is a
 * gallery and a button; where both exist the article wins and takes the booking
 * block with it. The map is hotelId to the article's path.
 */
export async function getEditorialStayPages(): Promise<Map<number, string>> {
  const guide = await getCollection('guide');
  const pages = new Map<number, string>();
  for (const entry of guide) {
    const id = entry.data.stay_id;
    if (id) pages.set(id, entry.data.url.replace(/\/+$/, ''));
  }
  return pages;
}

/**
 * What the route builds paths from.
 *
 * Published entries, minus any property whose article already covers it, so a
 * hotel never ends up with two pages competing for its own name.
 *
 * Preview is the one exception: with STAYS_PREVIEW set, drafts route too, so
 * the template can be worked on without publishing anything. Those pages carry
 * noindex and stay out of the sitemap, and the flag is never set on a
 * production build.
 */
export async function getRoutableStays(): Promise<StayEntry[]> {
  const editorial = await getEditorialStayPages();
  const source = process.env.STAYS_PREVIEW
    ? (await getCollection('stays')).sort((a, b) => a.data.name.localeCompare(b.data.name))
    : await getPublishedStays();
  return source.filter((entry) => !editorial.has(entry.data.id));
}

/**
 * Where a reader should be sent for one property: its article if it has one,
 * its own page if it has one, and nowhere if it has neither.
 */
export async function resolveStayHrefs(): Promise<Map<number, string>> {
  const hrefs = new Map<number, string>();
  for (const entry of await getPublishedStays()) hrefs.set(entry.data.id, stayPath(entry.data.slug));
  // Second, so an article overwrites the property page rather than the reverse.
  for (const [id, url] of await getEditorialStayPages()) hrefs.set(id, url);
  return hrefs;
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
