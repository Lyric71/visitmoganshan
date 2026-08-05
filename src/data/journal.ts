/**
 * Journal teasers.
 *
 * The brief supplies no story copy, so titles and dates stay TODO rather than
 * being invented. `date` is an ISO string and is rendered visibly: several of
 * the pages currently ranking first for these queries were published in 2011
 * and 2014 and say so nowhere, which is exactly the gap a dated journal closes.
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
    slug: 'todo-1',
    title: 'TODO',
    date: null,
    href: '/journal',
    image: '/images/journal-1.webp',
    alt: 'Afternoon light through the shutters of an old stone villa at Moganshan',
  },
  {
    slug: 'todo-2',
    title: 'TODO',
    date: null,
    href: '/journal',
    image: '/images/journal-2.webp',
    alt: 'A farmer carrying cut bamboo poles along a mountain track at Moganshan',
  },
  {
    slug: 'todo-3',
    title: 'TODO',
    date: null,
    href: '/journal',
    image: '/images/journal-3.webp',
    alt: 'A pot of Moganshan yellow bud tea on a wooden table beside an open window',
  },
];
