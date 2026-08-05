/**
 * Primary navigation, restructured as four mega menus.
 *
 * The eight flat links became four groups because eight top-level words is a
 * scanning tax, not a wayfinding aid: nobody reads them, they read the first
 * two and the last one. Four groups with real sub-links means the header now
 * exposes about thirty destinations instead of eight, which is the whole point
 * of a mega menu.
 *
 * Every group keeps its own landing page as `href`. The trigger is a button
 * (the panel needs a toggle for keyboard and touch), and the landing page is
 * offered as the first link inside the panel, so the section index is never
 * orphaned.
 *
 * astro.config.mjs sets `trailingSlash: 'never'`, so every href here is written
 * without one. Vercel would 301 every single nav click if we shipped those,
 * which is a crawl budget tax on the exact links we most want followed.
 *
 * `image` paths are files that exist in public/images. If you add a link here
 * pointing at a page that does not exist yet, you have shipped a 404 into the
 * header of every page on the site. Check before you add.
 */

export type NavLink = {
  label: string;
  href: string;
  /** Optional one-line gloss shown under the link on desktop. */
  sub?: string;
};

export type NavColumn = {
  /** Column heading. Not a link: it labels, it does not navigate. */
  title: string;
  links: NavLink[];
};

export type NavFeature = {
  href: string;
  image: string;
  alt: string;
  /** Small caps line above the title. */
  kicker: string;
  title: string;
  sub: string;
};

export type NavGroup = {
  label: string;
  /** Section landing page. Also rendered as the first link in the panel. */
  href: string;
  /** Text of the link to the landing page. "All of plan your trip" is not English. */
  allLabel: string;
  /** Path prefixes that mark this group current. */
  match: string[];
  columns: NavColumn[];
  feature: NavFeature;
};

export const NAV: NavGroup[] = [
  {
    label: 'Destinations',
    href: '/moganshan',
    allLabel: 'Explore the whole mountain',
    match: ['/moganshan'],
    columns: [
      {
        title: 'The mountain',
        links: [
          { label: 'What and where Moganshan is', href: '/moganshan' },
          { label: "The hill station", href: '/moganshan/hill-station' },
          { label: 'The bamboo forest', href: '/moganshan/bamboo-forest' },
          { label: 'Sword Pond', href: '/things-to-do/sword-pond' },
        ],
      },
      {
        title: 'Around the mountain',
        links: [
          { label: 'Yucun, Xiantan and Sanjiuwu', href: '/moganshan/villages' },
          { label: 'Deqing and the station', href: '/getting-here/deqing-station' },
          { label: 'A short history, 1890 to today', href: '/moganshan/hill-station/history' },
          { label: 'Weather, month by month', href: '/moganshan/weather' },
        ],
      },
    ],
    feature: {
      href: '/moganshan/hill-station',
      image: '/images/hill-station.webp',
      alt: 'Stone villas of the Moganshan hill station under bamboo',
      kicker: 'Start here',
      title: "Moganshan's hill station",
      sub: 'Two hundred stone villas, and why they are here',
    },
  },

  {
    label: 'Things to do',
    href: '/things-to-do',
    allLabel: 'See everything to do',
    match: ['/things-to-do'],
    columns: [
      {
        title: 'Most people do',
        links: [
          { label: 'The villa walking route', href: '/things-to-do/villa-walking-route' },
          { label: 'Walking the bamboo forest', href: '/things-to-do/bamboo-forest-walks' },
          { label: 'Sword Pond', href: '/things-to-do/sword-pond' },
          { label: 'The hot springs', href: '/things-to-do/hot-springs' },
        ],
      },
      {
        title: 'By interest',
        links: [
          { label: 'Heritage and the villas', href: '/things-to-do?filter=heritage' },
          { label: 'Nature and walks', href: '/things-to-do?filter=nature' },
          { label: 'Food and tea', href: '/things-to-do?filter=food-and-tea' },
          { label: 'With children', href: '/things-to-do?filter=family' },
        ],
      },
    ],
    feature: {
      href: '/things-to-do/yellow-bud-tea',
      image: '/images/part-tea.webp',
      alt: 'Terraced tea rows on a Moganshan slope',
      kicker: 'Local',
      title: 'Moganshan yellow bud tea',
      sub: 'Where it grows, and where to drink it',
    },
  },

  {
    label: 'Itineraries',
    href: '/itineraries',
    allLabel: 'Browse all itineraries',
    match: ['/itineraries'],
    columns: [
      {
        title: 'Ready-made',
        links: [
          { label: 'One day from Shanghai', href: '/getting-here/day-trip', sub: 'and why we would not' },
          { label: 'A weekend, two nights', href: '/itineraries/weekend-from-shanghai', sub: 'the one most people want' },
          {
            label: 'Shanghai, Hangzhou, Moganshan',
            href: '/itineraries/shanghai-hangzhou-moganshan',
            sub: 'five days',
          },
        ],
      },
      {
        title: 'By who you are',
        links: [
          { label: 'Couples', href: '/itineraries?for=couples' },
          { label: 'Families', href: '/itineraries?for=families' },
          { label: 'Groups and offsites', href: '/groups' },
        ],
      },
    ],
    feature: {
      href: '/itineraries/weekend-from-shanghai',
      image: '/images/part-villas.webp',
      alt: 'A villa terrace above the valley at dusk',
      kicker: 'Most asked for',
      title: 'A weekend, two nights',
      sub: 'Friday train, Sunday afternoon back',
    },
  },

  {
    label: 'Plan your trip',
    href: '/plan',
    allLabel: 'Open the planning guide',
    match: ['/plan', '/getting-here', '/where-to-stay', '/seasons', '/groups'],
    columns: [
      {
        title: 'Getting here',
        links: [
          { label: 'How to get to Moganshan', href: '/getting-here' },
          { label: 'From Shanghai', href: '/getting-here/from-shanghai' },
          { label: 'From Hangzhou', href: '/getting-here/from-hangzhou' },
          { label: 'Getting around once here', href: '/getting-here/getting-around' },
        ],
      },
      {
        title: 'Where to stay',
        links: [
          { label: 'All places to stay', href: '/where-to-stay' },
          { label: 'What a minsu is', href: '/where-to-stay/minsu-explained' },
          { label: 'Seasons, month by month', href: '/seasons' },
          { label: 'Is Moganshan worth visiting?', href: '/plan/is-moganshan-worth-visiting' },
        ],
      },
    ],
    feature: {
      href: '/getting-here/from-shanghai/by-train',
      image: '/images/todo-trail.webp',
      alt: 'A bamboo trail climbing out of the valley',
      kicker: 'Practical',
      title: 'Shanghai to Moganshan by train',
      sub: 'The route, the station, the last leg',
    },
  },
];

/** True when `path` sits inside this group. */
export function isCurrentGroup(group: NavGroup, path: string): boolean {
  return group.match.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
