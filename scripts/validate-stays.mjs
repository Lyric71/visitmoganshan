#!/usr/bin/env node
// Check the affiliate layer and every property entry against section 9 of the
// spec. Exits non-zero on a failure, so it can gate a deploy.
//
//   node scripts/validate-stays.mjs
//   node scripts/validate-stays.mjs --check-links   # also resolves outbound URLs
//
// Three things get checked, in this order, because a failure in the first makes
// the others meaningless:
//
//   1. the seed: unique slugs and goSlugs, and an affiliate URL whose hotelId
//      matches the row it sits on. A mismatch here sends a reader who read
//      about one hotel to a different one.
//   2. the redirect table: every seed row has a /go/ entry, every /go/ entry
//      points where the seed says, and there are no orphans in either direction.
//   3. the entries: images on disk, alt and credit present, description length
//      and originality, exactly three attributed comments, the affiliate block
//      agreeing with the seed.
//
// It closes with the report the spec asks for: counts by tier and status, and
// every entry still draft with the reason it is still draft.

import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parse as parseYaml } from 'yaml';

const SEED = 'data/seed/properties.seed.json';
const REDIRECTS = 'data/seed/go-redirects.json';
const COLLECTION_DIR = 'src/content/stays';
const RAW_DIR = 'data/raw';

const CHECK_LINKS = process.argv.includes('--check-links');

const problems = [];
const warnings = [];
const fail = (where, message) => problems.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

/* --------------------------------------------------------------------------
   1. The seed
   -------------------------------------------------------------------------- */

const seed = JSON.parse(await readFile(SEED, 'utf8'));
const seedById = new Map();
const slugs = new Set();
const goSlugs = new Set();

for (const row of seed) {
  const where = `seed ${row.id}`;
  if (seedById.has(row.id)) fail(where, 'duplicate hotelId');
  seedById.set(row.id, row);

  if (slugs.has(row.slug)) fail(where, `duplicate slug ${row.slug}`);
  slugs.add(row.slug);

  if (goSlugs.has(row.goSlug)) fail(where, `duplicate goSlug ${row.goSlug}`);
  goSlugs.add(row.goSlug);

  if (!row.slug.endsWith(`-${row.id}`)) fail(where, `slug does not end in -${row.id}`);
  if (row.goSlug !== `moganshan-${row.id}`) fail(where, `goSlug is not moganshan-${row.id}`);

  let url;
  try {
    url = new URL(row.affiliateUrl);
  } catch {
    fail(where, 'affiliateUrl is not a URL');
    continue;
  }
  if (url.hostname !== 'www.trip.com') fail(where, `affiliateUrl host is ${url.hostname}`);
  if (url.searchParams.get('hotelId') !== String(row.id))
    fail(where, 'affiliateUrl hotelId does not match the row');
  if (url.searchParams.get('trip_sub1') !== row.goSlug)
    fail(where, 'affiliateUrl trip_sub1 does not match goSlug');
  if (url.searchParams.get('Allianceid') !== '9859697') fail(where, 'wrong Allianceid');
  if (url.searchParams.get('SID') !== '327673690') fail(where, 'wrong SID');
}

/* --------------------------------------------------------------------------
   2. The redirect table
   -------------------------------------------------------------------------- */

const redirectFile = JSON.parse(await readFile(REDIRECTS, 'utf8'));
const bySource = new Map(redirectFile.redirects.map((r) => [r.source, r]));

for (const row of seed) {
  const source = `/go/${row.goSlug}`;
  const redirect = bySource.get(source);
  if (!redirect) {
    fail('redirects', `${source} has no entry`);
    continue;
  }
  if (redirect.destination !== row.affiliateUrl)
    fail('redirects', `${source} points somewhere other than the seed affiliateUrl`);
  if (redirect.permanent !== false)
    fail('redirects', `${source} is permanent; affiliate redirects must stay re-pointable`);
  bySource.delete(source);
}

for (const source of bySource.keys()) fail('redirects', `${source} has no seed row`);

// astro.config.mjs builds the live table from the seed, not from this file, so
// the file is a cross-check rather than the source of truth. Say so once here
// rather than leaving somebody to discover it.
if (!problems.some((p) => p.startsWith('redirects'))) {
  console.log(`Redirect table agrees with the seed on all ${seed.length} rows.`);
}

/* --------------------------------------------------------------------------
   3. The entries
   -------------------------------------------------------------------------- */

/** Split a markdown file into frontmatter and body. */
function splitFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!match) return null;
  return { data: parseYaml(match[1]), body: match[2] };
}

/** Sentences of eight words or more, which is the unit copying is detectable in. */
function sentences(text) {
  return (text ?? '')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/\s+/g, ' ').trim().toLowerCase())
    .filter((s) => s.split(' ').length >= 8);
}

/**
 * Properties whose researched article absorbed them. Those entries render no
 * page of their own, so they are not asked for a description or a note; the
 * article is both. Read straight from the guide frontmatter rather than a
 * second list, so the two cannot drift.
 */
const GUIDE_DIR = 'src/content/guide';
const absorbed = new Set();
for (const file of (await readdir(GUIDE_DIR).catch(() => [])).filter((f) => f.endsWith('.md'))) {
  const parsed = splitFrontmatter(await readFile(path.join(GUIDE_DIR, file), 'utf8'));
  if (parsed?.data?.stay_id) absorbed.add(parsed.data.stay_id);
}

const files = (await readdir(COLLECTION_DIR).catch(() => [])).filter((f) => f.endsWith('.md'));
const byStatus = { draft: 0, published: 0 };
const byTier = { A: 0, B: 0, C: 0 };
const draftReasons = [];

for (const file of files) {
  const where = `stays/${file}`;
  const text = await readFile(path.join(COLLECTION_DIR, file), 'utf8');
  const parsed = splitFrontmatter(text);
  if (!parsed) {
    fail(where, 'no frontmatter block');
    continue;
  }
  const { data } = parsed;
  const entryProblems = [];
  const note = (message) => {
    entryProblems.push(message);
    fail(where, message);
  };

  const row = seedById.get(data.id);
  if (!row) note(`hotelId ${data.id} is not in the seed`);

  if (row && data.slug !== row.slug) note('slug does not match the seed');
  if (`${data.slug}.md` !== file) note('filename does not match the slug');

  if (!data.name) note('no name');

  // Images
  if (!Array.isArray(data.images) || data.images.length < 3) {
    note('fewer than three images');
  } else {
    for (const [index, image] of data.images.entries()) {
      if (!image.alt || image.alt.length < 8) note(`image ${index + 1} has no usable alt`);
      if (!image.credit) note(`image ${index + 1} has no credit`);
      if (/^https?:/.test(image.src ?? '')) note(`image ${index + 1} is hotlinked`);
      else if (!(await exists(path.join('public', image.src.replace(/^\//, ''))))) {
        note(`image ${index + 1} is not on disk: ${image.src}`);
      }
    }
  }

  // Description. Not required of a property an article already covers.
  const isAbsorbed = absorbed.has(data.id);
  const length = (data.description ?? '').length;
  if (!isAbsorbed && (length < 200 || length > 900)) {
    note(`description is ${length} characters, not 200 to 900`);
  }

  const rawFile = path.join(RAW_DIR, `${data.id}.json`);
  if (await exists(rawFile)) {
    const raw = JSON.parse(await readFile(rawFile, 'utf8'));
    const sourceSentences = new Set(sentences(raw.sourceDescription));
    const copied = sentences(data.description).filter((s) => sourceSentences.has(s));
    if (copied.length) note(`description copies ${copied.length} sentence(s) from the source`);
  } else {
    warn(where, 'no capture cached, so the description could not be checked for copying');
  }

  // Note
  if (!isAbsorbed && (!data.note || data.note.length < 20)) note('no honest note');

  // Comments
  if (!Array.isArray(data.comments) || data.comments.length !== 3) {
    note(`comments length is ${data.comments?.length ?? 0}, not exactly 3`);
  } else {
    for (const [index, comment] of data.comments.entries()) {
      const label = `comment ${index + 1}`;
      if (!comment.quote) note(`${label} has no quote`);
      if ((comment.quote ?? '').split(/\s+/).length > 45)
        note(`${label} is longer than an excerpt`);
      if (!comment.author) note(`${label} has no author`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(comment.date ?? '')) note(`${label} has no ISO date`);
      if (!comment.sourceUrl) note(`${label} has no sourceUrl`);
    }
  }

  // Affiliate
  if (row) {
    if (data.affiliate?.goSlug !== row.goSlug) note('affiliate goSlug does not match the seed');
    if (data.affiliate?.url !== row.affiliateUrl) note('affiliate url does not match the seed');
    if (!String(data.affiliate?.url ?? '').includes(`hotelId=${data.id}`))
      note('affiliate url does not carry this hotelId');
  }

  // SEO
  if (!data.seo?.title || data.seo.title.length > 60) note('seo.title missing or over 60 chars');
  if (!data.seo?.metaDescription || data.seo.metaDescription.length > 160)
    note('seo.metaDescription missing or over 160 chars');

  if (/TODO/i.test(text)) note('still carries a TODO');

  if (CHECK_LINKS) {
    const urls = new Set([data.affiliate?.url, ...(data.comments ?? []).map((c) => c.sourceUrl)]);
    for (const url of urls) {
      if (!url) continue;
      try {
        const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
        if (!response.ok) note(`${url} returned ${response.status}`);
      } catch (error) {
        note(`${url} did not resolve: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  if (isAbsorbed && data.status !== 'published') {
    note('absorbed by an article but not published, so the article shows no gallery');
  }

  const status = data.status ?? 'draft';
  byStatus[status] = (byStatus[status] ?? 0) + 1;
  byTier[data.tier ?? 'B'] = (byTier[data.tier ?? 'B'] ?? 0) + 1;

  if (status !== 'published') {
    draftReasons.push({
      slug: data.slug,
      reasons: entryProblems.length ? entryProblems : ['complete, awaiting a human to publish it'],
    });
  }
}

/* --------------------------------------------------------------------------
   Report
   -------------------------------------------------------------------------- */

console.log('\nStays report');
console.log('------------');
console.log(`seed rows            ${seed.length}`);
console.log(`collection entries   ${files.length}`);
console.log(`  published          ${byStatus.published ?? 0}`);
console.log(`  draft              ${byStatus.draft ?? 0}`);
console.log(`  tier A / B / C     ${byTier.A ?? 0} / ${byTier.B ?? 0} / ${byTier.C ?? 0}`);
console.log(
  `long tail            ${seed.length - files.length} properties represented by storefront search only`,
);

if (draftReasons.length) {
  console.log('\nStill draft');
  for (const entry of draftReasons) {
    console.log(`  ${entry.slug}`);
    for (const reason of entry.reasons) console.log(`    - ${reason}`);
  }
}

if (warnings.length) {
  console.log('\nWarnings');
  for (const warning of warnings) console.log(`  ${warning}`);
}

if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.log(`  ${problem}`);
  process.exit(1);
}

console.log('\nAll checks passed.');
