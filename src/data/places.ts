/**
 * The ten places the slider on the home page carries.
 *
 * Locations, not topics. Every row is somewhere a reader can stand, it has a
 * page of its own on this site, and the one line under the title is a fact
 * taken from that page rather than a mood. Ordered the way most people take
 * them: the hill station and its villas first, then the named sights, then the
 * things that need a second day.
 *
 * Images are reused from the card set at 760px, which is twice the width a
 * slide renders at. Nothing here is a new file except the two encoded from
 * raws that had no card sized copy yet.
 *
 * Alt text describes the frame. It never claims the photograph is the named
 * place: all of it is generated, and GuideArticle prints that standing note.
 */
export type Place = {
  title: string;
  /** One line of fact. No adjectives that cannot be checked. */
  sub: string;
  href: string;
  image: string;
  alt: string;
};

export const PLACES: Place[] = [
  {
    title: 'The hill station',
    sub: 'About 250 stone villas still standing, the first of them built in 1896.',
    href: '/moganshan/hill-station',
    image: '/images/hill-station.webp',
    alt: 'A stone villa with a shuttered veranda standing above a wooded slope',
  },
  {
    title: 'The villa walking route',
    sub: 'Half a day at a slow pace, past the largest of the surviving houses.',
    href: '/moganshan/hill-station/walking-tour',
    image: '/images/todo-villa-route.webp',
    alt: 'A stepped stone path climbing past old stone houses under bamboo',
  },
  {
    title: 'The stone villas',
    sub: 'Local stone, European and Chinese styles mixed, most of them lived in.',
    href: '/moganshan/hill-station/the-villas',
    image: '/images/place-villas.webp',
    alt: 'A rough stone wall with a green painted window frame and ivy along one edge',
  },
  {
    title: 'Sword Pond',
    sub: 'A waterfall into a dark pool, and the legend the mountain takes its name from.',
    href: '/things-to-do/sword-pond',
    image: '/images/todo-sword-pond.webp',
    alt: 'A waterfall dropping into a dark pool between wet rock walls',
  },
  {
    title: 'The bamboo forest',
    sub: 'Moso bamboo over more than 92 percent of the mountain, and a working crop.',
    href: '/moganshan/bamboo-forest',
    image: '/images/part-bamboo.webp',
    alt: 'Dense bamboo stems filling the frame on a steep slope',
  },
  {
    title: 'The core scenic area',
    sub: 'About 20 square kilometres behind a ticket barrier, with fixed gate hours.',
    href: '/moganshan/scenic-area',
    image: '/images/place-scenic-area.webp',
    alt: 'Visitors walking towards ticket gates under a tiled canopy in the rain',
  },
  {
    title: 'The ridge trails',
    sub: 'Paths linking the sights to the villages below, walkable in either direction.',
    href: '/things-to-do/hiking',
    image: '/images/todo-trail.webp',
    alt: 'A trail running along a ridge through bamboo above layered valleys',
  },
  {
    title: 'The tea slopes',
    sub: 'Huangya, a yellow bud tea, grown on the slopes under the bamboo.',
    href: '/moganshan/tea',
    image: '/images/part-tea.webp',
    alt: 'Terraced tea bushes on a misty hillside below the treeline',
  },
  {
    title: 'Yucun, Xiantan and Sanjiuwu',
    sub: 'The villages at the foot, where the guesthouses and the dinners are.',
    href: '/moganshan/villages',
    image: '/images/part-villages.webp',
    alt: 'A quiet village lane with tiled roofs and a stone water channel',
  },
  {
    // The sunrise platform rather than the hot springs, which this site cannot
    // confirm is open to anyone today. A slide is a recommendation, and the
    // hot springs page exists to say the opposite.
    title: 'The Xuguang sunrise platform',
    sub: 'The sunrise viewpoint, and out of reach unless you are sleeping up there.',
    href: '/moganshan/scenic-area',
    image: '/images/place-xuguang.webp',
    alt: 'Layered forested ridges at first light with a village in the valley below',
  },
];
