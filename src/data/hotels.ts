/**
 * Hotel directory seed.
 *
 * READ THIS BEFORE EDITING. Every string marked TODO stays TODO until somebody
 * has stayed at the property, or has it in writing from the property. A wrong
 * rating or a wrong price band on a real, named hotel is a legal problem, not a
 * content problem, and this site's whole position is that it is the one source
 * that did not make it up.
 *
 * `ourLine` is one honest first-hand sentence. Not a strapline, not a rewrite of
 * the hotel's own copy. If we have not been, it stays TODO and the card ships
 * visibly unfinished rather than quietly fictional.
 *
 * There is deliberately no `featured`, `sponsored` or `pick` field. Every
 * property is presented on the same terms.
 */
export type PriceBand =
  | 'RMB 300 to 800'
  | 'RMB 800 to 1,500'
  | 'RMB 1,500 to 3,000'
  | 'RMB 3,000+';

export type HotelCategory = 'luxury' | 'boutique' | 'villas' | 'hot-springs' | 'family';

export type Hotel = {
  slug: string;
  name: string;
  village: string;
  keys?: number;
  priceBand: PriceBand;
  categories: HotelCategory[];
  /** One honest sentence, first-hand. TODO until it is first-hand. */
  ourLine: string;
  image: string;
  alt: string;
};

export const HOTELS: Hotel[] = [
  {
    slug: 'todo-1',
    name: 'TODO',
    village: 'TODO',
    priceBand: 'RMB 1,500 to 3,000',
    categories: ['luxury', 'villas'],
    ourLine: 'TODO',
    image: '',
    alt: '',
  },
  {
    slug: 'todo-2',
    name: 'TODO',
    village: 'TODO',
    priceBand: 'RMB 800 to 1,500',
    categories: ['boutique', 'family'],
    ourLine: 'TODO',
    image: '',
    alt: '',
  },
  {
    slug: 'todo-3',
    name: 'TODO',
    village: 'TODO',
    priceBand: 'RMB 3,000+',
    categories: ['luxury', 'hot-springs'],
    ourLine: 'TODO',
    image: '',
    alt: '',
  },
];

/** Tab order for the WhereToStay module. "All" is synthetic, not a category. */
export const HOTEL_TABS = [
  { id: 'all', label: 'All' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'boutique', label: 'Boutique' },
  { id: 'villas', label: 'Private villas' },
  { id: 'hot-springs', label: 'Hot springs' },
  { id: 'family', label: 'Family' },
] as const;
