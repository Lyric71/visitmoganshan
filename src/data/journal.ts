/**
 * Journal teasers.
 *
 * These are the three published long reads, newest first. `date` is an ISO
 * string and is rendered visibly: several of the pages currently ranking first
 * for these queries were published in 2011 and 2014 and say so nowhere, which
 * is exactly the gap a dated journal closes.
 *
 * This module ends in a link. No newsletter, no email capture, no exit modal.
 */
export type JournalPost = {
  slug: string;
  title: string;
  /** ISO date, e.g. "2026-08-05". null until the piece is scheduled. */
  date: string | null;
  href: string;
  image: string;
  alt: string;
};

export const JOURNAL: JournalPost[] = [
  {
    slug: 'the-second-opening',
    title: 'The second opening',
    date: '2026-08-07',
    href: '/journal/the-second-opening',
    image: '/images/guide/journal-second-opening.webp',
    alt: 'Village guesthouses below the bamboo slopes of Moganshan',
  },
  {
    slug: '118-then-78',
    title: '118, then 78',
    date: '2026-08-07',
    href: '/journal/118-then-78',
    image: '/images/guide/journal-118-then-78.webp',
    alt: 'Old stone villas on a Moganshan ridge, houses that changed hands in the 1920s',
  },
  {
    slug: 'the-founding-and-the-committee',
    title: 'The founding, and the committee',
    date: '2026-08-07',
    href: '/journal/the-founding-and-the-committee',
    image: '/images/guide/journal-founding.webp',
    alt: 'Stone villas on a bamboo ridge at Moganshan, the settlement founded in the 1890s',
  },
];
