import { existsSync } from 'node:fs';
import { CAPTURES, type Capture } from './captures';
import { STAYS_SEED, guessType, type SeedRecord, type StayType } from './stays';

/**
 * A few properties per kind of place, for the home page strip.
 *
 * The home page cannot show 809 properties and should not show the same five
 * every time somebody looks at it, so the strip takes a sample. Three rules
 * shape which five.
 *
 * The sample is drawn at build time, not on a request. This is a static site;
 * a picker that ran per visitor would need a server, and the point of the
 * randomness is variety between builds, not between page loads.
 *
 * It is seeded rather than truly random, so a build is reproducible. The same
 * commit produces the same five, which means a diff of the built HTML is
 * readable and a screenshot taken yesterday still matches the page today. Bump
 * PICK_SEED to reshuffle every category at once.
 *
 * And properties we have captured come first. A card with a photograph, a score
 * and a price is worth showing; a card with a name and a link is a row in a
 * directory. Captured rows are shuffled among themselves, uncaptured rows are
 * shuffled among themselves, and the second group is only reached when the
 * first runs out, which today happens in the smaller categories.
 */

/** Change this to redraw every sample on the next build. */
const PICK_SEED = 'moganshan-2026-08';

export type StayPick = {
  row: SeedRecord;
  capture: Capture | null;
  /** Lead photograph, only when the file is actually on disk. */
  image: string | null;
};

/**
 * FNV-1a. Small, stable across runs, and good enough to order a list by: the
 * only requirement is that the ordering looks arbitrary and never changes for
 * the same input.
 */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * The lead photograph for a capture, or null.
 *
 * Checked against the filesystem rather than trusted from the JSON. A capture
 * lists what Trip.com held at the time it was taken, and the re-encoded files
 * are committed separately; where the encode has not run yet the JSON points at
 * a file that is not there, and a card with a broken frame is worse than a card
 * with no frame.
 */
function leadImage(capture: Capture | undefined): string | null {
  const src = capture?.images?.[0]?.src;
  if (!src) return null;
  return existsSync(`public${src}`) ? src : null;
}

/** Five (or however many are asked for) properties of one kind. */
export function pickStays(type: StayType, count = 5): StayPick[] {
  const seedFor = (row: SeedRecord) => hash(`${PICK_SEED}:${type}:${row.id}`);

  const rows = STAYS_SEED.filter((row) => guessType(row.name) === type);
  const picks: StayPick[] = rows.map((row) => {
    const capture = CAPTURES.get(row.id) ?? null;
    return { row, capture, image: leadImage(capture ?? undefined) };
  });

  // Tier first, shuffle inside the tier. Sorting by the same hash the tier
  // ignores keeps the order stable for a given seed.
  const tier = (pick: StayPick) => (pick.image ? 0 : pick.capture ? 1 : 2);

  return picks
    .sort((a, b) => tier(a) - tier(b) || seedFor(a.row) - seedFor(b.row))
    .slice(0, count);
}
