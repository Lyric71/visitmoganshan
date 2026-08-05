/**
 * Ready-made itineraries. Copy is verbatim from the build brief.
 *
 * Card one keeps its honesty. "and why we would not" is not a typo and not a
 * missed conversion: the day trip is the page where length of stay gets won,
 * and telling somebody the truth about a five hour round trip is what earns the
 * second night.
 */
export type Itinerary = {
  title: string;
  sub: string;
  href: string;
};

export const ITINERARIES: Itinerary[] = [
  {
    title: 'One day from Shanghai',
    sub: 'and why we would not',
    href: '/getting-here/day-trip',
  },
  {
    title: 'A weekend, two nights',
    sub: 'the one most people want',
    href: '/itineraries/weekend-from-shanghai',
  },
  {
    title: 'Shanghai, Hangzhou, Moganshan',
    sub: 'five days',
    href: '/itineraries/shanghai-hangzhou-moganshan',
  },
];
