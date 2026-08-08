/**
 * The capture cache, as the listings read it.
 *
 * scripts/collect-stays.mjs writes one JSON file per property into data/raw.
 * This loads them at build time and hands them to the listing cards. Nothing
 * here runs on a visitor request, and no card ever fetches Trip.com: the
 * photographs are files we host and the text was captured once, offline, with
 * the date it was captured attached.
 *
 * Everything in a capture is Trip.com's, and every card that shows it says so.
 * The site's own words live in the stays collection and in the articles, which
 * are a separate thing with a separate standard.
 */

export type CaptureImage = { src: string; sourceUrl: string };

export type CaptureComment = {
  quote: string;
  author: string;
  date: string;
  rating?: number;
  translated: boolean;
  sourceUrl: string;
};

export type SummaryBlock = { topic: string; text: string; count: number };

export type Capture = {
  id: number;
  name: string;
  city: string;
  goSlug: string;
  affiliateUrl: string;
  address: string;
  priceRange: string;
  facilities: string[];
  images: CaptureImage[];
  comments: CaptureComment[];
  rating: { score: number; count: number; scale: number } | null;
  summary?: { topics: SummaryBlock[]; suggestion: SummaryBlock | null };
  sourcedAt: string;
};

// Eager, because a static build needs every capture at once and there is no
// runtime to defer to. Vite inlines the JSON it finds; a property with no
// capture yet simply has no file and falls through to the plain row.
const files = import.meta.glob<Capture>('../../data/raw/*.json', {
  eager: true,
  import: 'default',
});

export const CAPTURES = new Map<number, Capture>(
  Object.values(files)
    .filter((capture) => capture && typeof capture.id === 'number')
    .map((capture) => [capture.id, capture]),
);

/**
 * The description a card shows: Trip.com's summary of what guests keep saying,
 * with the topic labels kept because they are what makes it scannable.
 *
 * Capped at two blocks. A card carrying four paragraphs of machine summary is
 * a wall, and the two with the most reviews behind them are the two worth
 * reading.
 */
export function cardDescription(capture: Capture): SummaryBlock[] {
  return [...(capture.summary?.topics ?? [])].sort((a, b) => b.count - a.count).slice(0, 2);
}

/** The caveat a card shows: what the guests who complained complained about. */
export function cardNote(capture: Capture): SummaryBlock | null {
  return capture.summary?.suggestion ?? null;
}
