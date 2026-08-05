/**
 * Things to do seed.
 *
 * Titles here are named features of the mountain that are documented and
 * checkable. The one-line `sub` for each is TODO until it has been written from
 * a visit, because a description is a claim and this site does not ship claims
 * it cannot stand behind.
 *
 * Tab order is Popular, Heritage, Nature, Food and tea, Active, Family.
 * Heritage sits ahead of Nature on purpose: every competing site leads on
 * bamboo, and the villas are the differentiation.
 */
export type ThingCategory = 'popular' | 'heritage' | 'nature' | 'food-and-tea' | 'active' | 'family';

export type Thing = {
  slug: string;
  title: string;
  /** One line. TODO until written first-hand. */
  sub: string;
  href: string;
  categories: ThingCategory[];
  image: string;
  alt: string;
};

export const THINGS: Thing[] = [
  {
    slug: 'villa-walking-route',
    title: 'The villa walking route',
    sub: 'TODO',
    href: '/things-to-do/villa-walking-route',
    categories: ['popular', 'heritage', 'active'],
    image: '/images/todo-villa-route.webp',
    alt: 'A stepped stone path climbing past old stone villas in the Moganshan forest',
  },
  {
    slug: 'sword-pond',
    title: 'Sword Pond',
    sub: 'TODO',
    href: '/things-to-do/sword-pond',
    categories: ['popular', 'nature', 'family'],
    image: '/images/todo-sword-pond.webp',
    alt: 'A waterfall falling into a dark pool in a rock gorge at Moganshan',
  },
  {
    slug: 'bamboo-forest-walks',
    title: 'Walking the bamboo forest',
    sub: 'TODO',
    href: '/things-to-do/bamboo-forest-walks',
    categories: ['popular', 'nature', 'active'],
    image: '/images/todo-trail.webp',
    alt: 'A ridge trail through bamboo above layered valleys at Moganshan',
  },
  {
    slug: 'hot-springs',
    title: 'The hot springs',
    sub: 'TODO',
    href: '/things-to-do/hot-springs',
    categories: ['popular', 'family'],
    image: '/images/todo-hot-spring.webp',
    alt: 'A steaming outdoor stone hot spring pool on a wooded hillside at dusk',
  },
  {
    slug: 'yellow-bud-tea',
    title: 'Moganshan yellow bud tea',
    sub: 'TODO',
    href: '/things-to-do/yellow-bud-tea',
    categories: ['food-and-tea'],
    image: '/images/part-tea.webp',
    alt: 'Terraced tea bushes on a misty hillside below the bamboo forest',
  },
  {
    slug: 'the-villages',
    title: 'Yucun, Xiantan and Sanjiuwu',
    sub: 'TODO',
    href: '/moganshan/villages',
    categories: ['heritage', 'food-and-tea', 'family'],
    image: '/images/part-villages.webp',
    alt: 'A quiet village lane below Moganshan, tiled roofs and a stone channel',
  },
];

export const THING_TABS = [
  { id: 'popular', label: 'Popular' },
  { id: 'heritage', label: 'Heritage' },
  { id: 'nature', label: 'Nature' },
  { id: 'food-and-tea', label: 'Food and tea' },
  { id: 'active', label: 'Active' },
  { id: 'family', label: 'Family' },
] as const;
