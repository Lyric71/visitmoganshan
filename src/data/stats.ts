/**
 * The orientation strip. Four researched figures, each linking to the page that
 * proves it. Do not round these and do not embellish them: the tiles are the
 * fastest crawlable answer to "where is Moganshan" anywhere on the site, and a
 * figure that cannot be defended on the destination page is worse than none.
 */
export const STATS = [
  {
    value: '63 to 80 min',
    label: 'direct train from Shanghai Hongqiao',
    href: '/getting-here/from-shanghai/by-train',
  },
  {
    value: '13 min',
    label: 'train from Hangzhou East',
    href: '/getting-here/from-hangzhou',
  },
  {
    value: '6 to 7 °C',
    label: 'cooler than the cities in summer',
    href: '/moganshan/weather',
  },
  {
    value: 'c.250',
    label: 'surviving 1890s stone villas',
    href: '/moganshan/hill-station/the-villas',
  },
] as const;

export type Stat = (typeof STATS)[number];
