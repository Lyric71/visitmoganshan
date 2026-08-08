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

/**
 * The cheapest nightly rate Trip.com showed when the capture ran.
 *
 * `checkIn` is null on the rows whose rate came out of the Hotel JSON-LD block
 * at capture time, and a date on the rows scripts/collect-prices.mjs went back
 * for with a specific stay in hand. Either way it is one search on one day: the
 * card says "from" and the filter sorts into bands rather than quoting it as
 * the price of a room tonight.
 */
export type CapturePrice = {
  amount: number;
  currency: string;
  checkIn: string | null;
  checkOut: string | null;
  pricedAt: string;
};

export type Capture = {
  id: number;
  name: string;
  city: string;
  goSlug: string;
  affiliateUrl: string;
  address: string;
  priceRange: string;
  price?: CapturePrice;
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
  return [...(capture.summary?.topics ?? [])]
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((block) => ({ ...block, text: tidy(block.text) }));
}

/**
 * Close up the machine summary's punctuation, and nothing else.
 *
 * Trip.com's generator leaves a space in front of the full stop on about one
 * block in seven and drops it altogether on others, which reads as broken next
 * to the "Based on N reviews." that follows. Whitespace and a terminal stop are
 * the only edits made anywhere in this pipeline to text that is not ours; the
 * words are left exactly as captured.
 */
function tidy(text: string): string {
  const trimmed = text.replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1').trim();
  if (!trimmed) return trimmed;
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

/** The caveat a card shows: what the guests who complained complained about. */
export function cardNote(capture: Capture): SummaryBlock | null {
  const suggestion = capture.summary?.suggestion;
  return suggestion ? { ...suggestion, text: tidy(suggestion.text) } : null;
}

/**
 * The price bands the listing filter offers, in US dollars.
 *
 * Cut from the distribution across all 809 rather than from round numbers a
 * reader might expect: the median is about $79 and the ninetieth percentile
 * about $148, so four even-looking bands would have put two thirds of the
 * mountain in one of them and made the control useless.
 */
export const PRICE_BANDS = [
  { id: 'under-75', label: 'Under $75', min: 0, max: 75 },
  { id: '75-150', label: '$75 to $150', min: 75, max: 150 },
  { id: '150-300', label: '$150 to $300', min: 150, max: 300 },
  { id: 'over-300', label: '$300 and up', min: 300, max: Infinity },
] as const;

export type PriceBandId = (typeof PRICE_BANDS)[number]['id'] | 'unknown';

export function priceBand(capture: Capture | undefined): PriceBandId {
  const amount = usdAmount(capture);
  if (amount === null) return 'unknown';
  return PRICE_BANDS.find((band) => amount >= band.min && amount < band.max)?.id ?? 'over-300';
}

/**
 * A few hundred rows priced in yuan rather than dollars, because Trip.com
 * serves the currency it thinks the visitor wants and the capture ran from a
 * Shanghai timezone. Converted at a fixed rate so the bands hold: this is
 * banding, not a quote, and a rate that drifts a few percent moves nothing.
 */
const CNY_PER_USD = 7.2;

export function usdAmount(capture: Capture | undefined): number | null {
  const price = capture?.price;
  if (!price || !Number.isFinite(price.amount)) return null;
  if (price.currency === 'USD') return price.amount;
  if (price.currency === 'CNY') return price.amount / CNY_PER_USD;
  return null;
}

/** "From $109" for a card, or null when Trip.com showed no rate. */
export function cardPrice(capture: Capture | undefined): string | null {
  const amount = usdAmount(capture);
  if (amount === null) return null;
  return `From $${Math.round(amount).toLocaleString('en-GB')}`;
}
