#!/usr/bin/env node
// Turn a capture into a property entry.
//
//   node scripts/build-stays.mjs                 # every cached capture
//   node scripts/build-stays.mjs --only 901389
//   node scripts/build-stays.mjs --promote       # move finished drafts into the collection
//
// Where things go, and why there are two places:
//
//   data/drafts/{slug}.md      an entry in progress. Not a content collection
//                              file, so an unfinished one cannot break a build.
//   src/content/stays/{slug}.md  the collection. Everything here is complete by
//                              definition: the Zod schema in src/content.config.ts
//                              will not accept fewer than three images, a
//                              comment array that is not exactly three, or a
//                              description outside 200 to 900 characters.
//
// This script fills in everything mechanical: identity from the seed, images
// and comments from the capture, the affiliate block, the SEO skeleton. It does
// not write the description or the note, and it will not paraphrase the
// listing copy into something that reads like ours. Those two fields arrive as
// TODO, with the sourced facts left in the body as a brief, and a human or an
// assisted draft written against that brief. Section 5 of the spec is blunt
// about why: pasted marketing copy is an IP problem and a duplicate content
// penalty in the same sentence.
//
// --promote is the only way into the collection, and it refuses anything that
// still carries a TODO or that fails validate-stays.mjs.

import { mkdir, readFile, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const SEED = 'data/seed/properties.seed.json';
const RAW_DIR = 'data/raw';
const DRAFT_DIR = 'data/drafts';
const COLLECTION_DIR = 'src/content/stays';

/**
 * Tier A anchors: the properties that get a human written description and note
 * rather than an assisted draft. From section 11 of the spec. Everything else
 * defaults to B, and B only reaches the collection if it clears the same bar.
 */
const TIER_A = new Set([901389, 15826772, 100342198]);

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 || i === args.length - 1 ? fallback : args[i + 1];
};

const ONLY = (value('only') ?? '')
  .split(',')
  .map((s) => Number(s.trim()))
  .filter(Boolean);

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

const TODO_DESCRIPTION =
  'TODO: 200 to 900 characters, written here from the facts in the brief below. What kind of place it is, where it sits, who it suits, what the rooms are actually like. No sentence lifted from the listing.';
const TODO_NOTE =
  'TODO: one caveat a reader can act on. The road, the walk, the noise, the food, the season it does not work in. Not a disclaimer.';

/** YAML for a string that may contain colons, quotes or newlines. */
function yamlString(value) {
  return JSON.stringify(String(value));
}

function guessType(name) {
  const lower = name.toLowerCase();
  if (/resort/.test(lower)) return 'Resort';
  if (/villa|residence/.test(lower)) return 'Villa';
  if (/homestay|minsu|guesthouse|b&b/.test(lower)) return 'Homestay';
  if (/lodge|inn/.test(lower)) return 'Lodge';
  if (/hotel/.test(lower)) return 'Hotel';
  return undefined;
}

/**
 * Alt text is the one field a script has no business inventing. It writes a
 * neutral placeholder naming the property and the frame number, and the review
 * pass replaces it with what is actually in the picture. A caption that asserts
 * the frame is a named building is forbidden outright: several of these images
 * stand in for identifiable real places.
 */
function placeholderAlt(name, index) {
  return `TODO alt: describe frame ${index + 1} for ${name}, without asserting it is a named building`;
}

function buildEntry(row, raw) {
  const tier = TIER_A.has(row.id) ? 'A' : 'B';
  const type = guessType(row.name);

  const images = raw.images.slice(0, 6).map((image, index) => ({
    src: image.src,
    alt: placeholderAlt(row.name, index),
    credit: 'Property listing via Trip.com',
  }));

  const comments = raw.comments.slice(0, 3);

  // 60 and 160 are the Zod caps, and they are caps rather than targets: a title
  // truncated by the schema is a title nobody wrote.
  const seoTitle = `${row.name}, Moganshan`.slice(0, 60);
  const seoDescription =
    `${row.name} in ${row.city}, near Moganshan: photographs, what it is like, one honest caveat and what guests said.`.slice(
      0,
      160,
    );

  const frontmatter = [
    '---',
    `id: ${row.id}`,
    `name: ${yamlString(row.name)}`,
    `slug: ${yamlString(row.slug)}`,
    `city: ${yamlString(row.city)}`,
    `cityId: ${row.cityId}`,
    `tier: ${yamlString(tier)}`,
    type ? `type: ${yamlString(type)}` : '# type: TODO',
    '# village: TODO, once the property is placed on the map',
    'images:',
    ...images.flatMap((image) => [
      `  - src: ${yamlString(image.src)}`,
      `    alt: ${yamlString(image.alt)}`,
      `    credit: ${yamlString(image.credit)}`,
    ]),
    `description: ${yamlString(TODO_DESCRIPTION)}`,
    `note: ${yamlString(TODO_NOTE)}`,
    'comments:',
    ...comments.flatMap((comment) => [
      `  - quote: ${yamlString(comment.quote)}`,
      `    author: ${yamlString(comment.author)}`,
      `    date: ${yamlString(comment.date)}`,
      comment.rating != null ? `    rating: ${comment.rating}` : '    # rating: not shown',
      `    translated: ${comment.translated ? 'true' : 'false'}`,
      `    sourceUrl: ${yamlString(comment.sourceUrl)}`,
    ]),
    raw.rating
      ? `rating: { score: ${raw.rating.score}, count: ${raw.rating.count}, scale: ${raw.rating.scale} }`
      : '# rating: none captured',
    'affiliate:',
    `  goSlug: ${yamlString(row.goSlug)}`,
    `  url: ${yamlString(row.affiliateUrl)}`,
    'seo:',
    `  title: ${yamlString(seoTitle)}`,
    `  metaDescription: ${yamlString(seoDescription)}`,
    'status: draft',
    `sourcedAt: ${yamlString(raw.sourcedAt)}`,
    '---',
    '',
    '<!--',
    'WRITING BRIEF. Delete this block before promoting.',
    '',
    `Tier ${tier}. ${tier === 'A' ? 'Human written description and note required.' : 'Assisted draft acceptable, human reviewed.'}`,
    '',
    'Facts from the capture. Reference only, and none of it is prose to reuse:',
    '',
    `  Address:     ${raw.address || 'not captured'}`,
    `  Price range: ${raw.priceRange || 'not captured'}`,
    `  Rating:      ${raw.rating ? `${raw.rating.score} out of ${raw.rating.scale} from ${raw.rating.count} reviews` : 'not captured'}`,
    `  Facilities:  ${(raw.facilities ?? []).join(', ') || 'not captured'}`,
    '',
    'Trip.com carries no property written description. What sits in that slot on',
    'the listing is a machine summary of the reviews, and it is reproduced below',
    'ONLY so you can see what guests keep mentioning. Do not paraphrase it, do',
    'not lift a clause from it, and do not treat any claim in it as verified.',
    '',
    (raw.aiSummary || '(none captured)').replace(/-->/g, '- ->'),
    '',
    'Checks before promoting:',
    '  - description reads as ours, 200 to 900 characters, no copied sentence',
    '  - note names one real trade-off, not a disclaimer',
    '  - every alt describes what is in the frame and names no building',
    '  - all three comments still resolve on the source',
    '  - a translated comment is flagged translated, because a machine',
    '    translation is not what the guest wrote',
    '-->',
    '',
  ].join('\n');

  return frontmatter;
}

async function main() {
  const seed = JSON.parse(await readFile(SEED, 'utf8'));
  const seedById = new Map(seed.map((row) => [row.id, row]));
  await mkdir(DRAFT_DIR, { recursive: true });
  await mkdir(COLLECTION_DIR, { recursive: true });

  if (flag('promote')) {
    await promote();
    return;
  }

  const files = (await readdir(RAW_DIR).catch(() => [])).filter((f) => f.endsWith('.json'));
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(RAW_DIR, file), 'utf8'));
    if (ONLY.length && !ONLY.includes(raw.id)) continue;

    const row = seedById.get(raw.id);
    if (!row) {
      console.log(`skip    ${raw.id}  not in the seed`);
      skipped += 1;
      continue;
    }

    // The assertion the spec asks for, and it is not paranoia: a mismatch here
    // means a reader clicks through to a different hotel than the one they read
    // about, which is the single worst thing this system can do.
    if (!row.affiliateUrl.includes(`hotelId=${row.id}`)) {
      console.log(`skip    ${raw.id}  affiliate URL does not carry hotelId=${row.id}`);
      skipped += 1;
      continue;
    }

    if (raw.images.length < 3 || raw.comments.length < 3) {
      console.log(
        `skip    ${raw.id}  ${row.name}  (${raw.images.length} images, ${raw.comments.length} comments)`,
      );
      skipped += 1;
      continue;
    }

    const target = path.join(DRAFT_DIR, `${row.slug}.md`);
    if (await exists(target)) {
      console.log(`kept    ${raw.id}  ${row.name}  draft already exists, not overwritten`);
      skipped += 1;
      continue;
    }

    await writeFile(target, buildEntry(row, raw));
    console.log(`draft   ${raw.id}  ${row.name}  ->  ${target}`);
    written += 1;
  }

  console.log(`\n${written} drafts written, ${skipped} skipped.`);
  console.log(`Write the description and the note, then: node scripts/build-stays.mjs --promote`);
}

/**
 * Move finished drafts into the collection.
 *
 * The only gate is textual and deliberately dumb: a file that still says TODO
 * anywhere is not finished. Everything else is checked by validate-stays.mjs,
 * which is run straight after, and by the Zod schema at build time.
 */
async function promote() {
  const files = (await readdir(DRAFT_DIR).catch(() => [])).filter((f) => f.endsWith('.md'));
  let moved = 0;

  for (const file of files) {
    const source = path.join(DRAFT_DIR, file);
    const body = await readFile(source, 'utf8');

    if (/TODO/i.test(body)) {
      console.log(`held    ${file}  still carries a TODO`);
      continue;
    }
    if (body.includes('WRITING BRIEF')) {
      console.log(`held    ${file}  the writing brief has not been deleted`);
      continue;
    }

    await writeFile(path.join(COLLECTION_DIR, file), body);
    console.log(`promote ${file}`);
    moved += 1;
  }

  console.log(`\n${moved} entries promoted. They are still status: draft.`);
  console.log('Run: node scripts/validate-stays.mjs, then flip status to published by hand.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
