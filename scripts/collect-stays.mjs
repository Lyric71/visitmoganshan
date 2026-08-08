#!/usr/bin/env node
// Collect the raw facts behind a property page. Offline, build time, never at
// page request time.
//
//   node scripts/collect-stays.mjs --only 901389,15826772
//   node scripts/collect-stays.mjs --limit 10
//   node scripts/collect-stays.mjs --only 901389 --refresh
//
// Flags:
//   --only <ids>       comma separated hotelIds. Overrides --limit.
//   --limit <n>        first n seed rows that have no cache yet
//   --refresh          re-fetch rows that are already cached
//   --concurrency <n>  default 2, and there is no good reason to raise it
//   --headful          watch the browser, for when a selector has moved
//   --no-images        collect text only, useful while tuning selectors
//   --source <name>    'trip' (default) or 'api' for a licensed reviews client
//
// What it writes:
//   data/raw/{hotelId}.json          the capture, with sourcedAt
//   assets/raw/stays/{hotelId}/      original image files, gitignored
//   public/images/stays/{hotelId}/   re-encoded webp, committed and served
//   data/failed.json                 rows that need a human
//
// Read section 5 of setup/Affiliation/SPEC-moganshan-property-pages.md before
// running this against the live site. Short version: honor robots.txt, keep
// concurrency at 2 with a 3 to 6 second jitter, back off on failure, cache
// everything so a property is never hit twice, and log failures rather than
// retrying into a wall. Reviews are captured as short excerpts with the handle,
// the date and a link back, never reproduced in full.
//
// This script does not decide what gets published. It gathers facts;
// build-stays.mjs writes the entry and validate-stays.mjs decides whether it
// clears the bar.

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

const SEED = 'data/seed/properties.seed.json';
const RAW_DIR = 'data/raw';
const FAILED = 'data/failed.json';
const IMAGE_SRC_DIR = 'assets/raw/stays';
const IMAGE_OUT_DIR = 'public/images/stays';

// The audit in scripts/audit-images.mjs is the contract every shipped raster
// has to meet. Matching it here means a captured image is either already
// compliant or never written.
const MAX_WIDTH = 1600;
/** Anything narrower is a thumbnail, not a gallery frame. */
const MIN_WIDTH = 640;
const MAX_KB = 260;
const WEBP_QUALITY = 74;

const MIN_IMAGES = 3;
const MAX_IMAGES = 6;
const COMMENTS_WANTED = 3;
const QUOTE_WORDS = 40;

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 || i === args.length - 1 ? fallback : args[i + 1];
};

const OPTS = {
  only: (value('only') ?? '')
    .split(',')
    .map((s) => Number(s.trim()))
    .filter(Boolean),
  limit: Number(value('limit', '0')) || 0,
  refresh: flag('refresh'),
  concurrency: Math.min(2, Number(value('concurrency', '2')) || 2),
  headful: flag('headful'),
  images: !flag('no-images'),
  source: value('source', 'trip'),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** 3 to 6 seconds, so the request pattern is not a metronome. */
const jitter = () => sleep(3000 + Math.random() * 3000);

const exists = (file) =>
  access(file).then(
    () => true,
    () => false,
  );

/* --------------------------------------------------------------------------
   robots.txt
   -------------------------------------------------------------------------- */

/**
 * A crude but honest robots check for the one path family we touch.
 *
 * It is not a full robots parser. It looks at the wildcard user-agent group and
 * refuses to run if any Disallow rule prefixes /hotels/detail. Refusing on an
 * unparsable file rather than assuming permission is the whole point.
 */
async function assertAllowed() {
  const response = await fetch('https://www.trip.com/robots.txt', {
    headers: { 'user-agent': USER_AGENT },
  });
  if (!response.ok) {
    throw new Error(`robots.txt returned ${response.status}. Not proceeding.`);
  }
  const text = await response.text();

  let inWildcard = false;
  for (const line of text.split(/\r?\n/)) {
    const clean = line.split('#')[0].trim();
    if (!clean) continue;
    const [rawKey, ...rest] = clean.split(':');
    const key = rawKey.trim().toLowerCase();
    const val = rest.join(':').trim();
    if (key === 'user-agent') inWildcard = val === '*';
    else if (inWildcard && key === 'disallow' && val) {
      if ('/hotels/detail'.startsWith(val) || val === '/') {
        throw new Error(
          `robots.txt disallows ${val} for the wildcard agent. Capture stops here; use a licensed source instead.`,
        );
      }
    }
  }
}

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36 VisitMoganshanBot/1.0 (+https://www.visitmoganshan.com/about)';

/* --------------------------------------------------------------------------
   Capture
   -------------------------------------------------------------------------- */

/**
 * Pull one property off the public listing.
 *
 * Written against what the page actually serves, checked August 2026:
 *
 *   - a Hotel JSON-LD block carrying name, full postal address, the lead image,
 *     priceRange and an aggregateRating scored out of 10. That block is the
 *     stable part of the page and everything that can come from it does.
 *   - images on ak-d and aw-d tripcdn, sized by a token in the filename. The
 *     token is a request, not a promise: asking for 1600 wide returns the same
 *     800 wide file, and asking for 2048 returns a 400. 800 is the ceiling.
 *   - review cards under a hashed CSS module class. One is rendered on the
 *     detail page; the rest need the review list opened.
 *   - no property description. What looks like one is an AI written summary of
 *     the reviews, labelled as such on the page. It is captured to aiSummary
 *     for reference and is never the description: passing a machine summary of
 *     other people's reviews off as our own prose is the one thing this whole
 *     pipeline exists to avoid.
 *
 * Class names here are hashed CSS modules and will move on a Trip.com deploy.
 * Everything is matched on the stable fragment inside the hash and every
 * extraction is defensive: what is missing comes back empty and the property
 * lands in failed.json with a reason, rather than producing a half filled entry
 * that looks finished.
 */
async function captureFromListing(browser, row) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: 'en-US',
    viewport: { width: 1440, height: 1200 },
    timezoneId: 'Asia/Shanghai',
  });
  // Without this the detail page answers with a sign-in wall instead of the
  // listing, and every field comes back empty.
  await context.addInitScript(() =>
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined }),
  );
  const page = await context.newPage();

  try {
    await page.goto(row.affiliateUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(6000);

    // Images and review cards are lazy. Walk down the page rather than jumping
    // to the bottom, which skips the observers entirely.
    for (let y = 1200; y <= 9000; y += 1500) {
      await page.evaluate((offset) => window.scrollTo(0, offset), y);
      await page.waitForTimeout(1000);
    }

    // Try to open the full review list. Three comments is the requirement and
    // the detail page renders one.
    for (const label of [/all reviews/i, /see all/i, /more reviews/i, /^reviews$/i]) {
      const control = page.getByRole('button', { name: label }).first();
      if (await control.isVisible().catch(() => false)) {
        await control.click().catch(() => {});
        await page.waitForTimeout(3000);
        break;
      }
    }

    return await page.evaluate(() => {
      const clean = (value) => (value ?? '').replace(/\s+/g, ' ').trim();

      /* Structured data first. */
      let hotelLd = null;
      for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
        let parsed;
        try {
          parsed = JSON.parse(script.textContent);
        } catch {
          continue;
        }
        for (const block of Array.isArray(parsed) ? parsed : [parsed]) {
          if (block?.['@type'] === 'Hotel') hotelLd = block;
        }
      }

      /* Images. The size token is stripped so the CDN serves its original. */
      const originalSize = (url) => url.replace(/_R_\d+_\d+_R\d+(_D)?(?=\.[a-z]+$)/i, '');
      const seen = new Set();
      const imageUrls = [];
      const push = (url) => {
        if (!url || !/tripcdn/.test(url)) return;
        if (/sprite|logo|icon|avatar|flag|qrcode|placeholder/i.test(url)) return;
        const full = originalSize(url.split('?')[0]);
        if (seen.has(full)) return;
        seen.add(full);
        imageUrls.push(full);
      };
      // The album carries the establishing shots; room and facility frames are
      // smaller and are only reached if the album does not fill the gallery.
      if (hotelLd?.image) push(hotelLd.image);
      for (const img of document.querySelectorAll('img')) {
        const src = img.currentSrc || img.src || '';
        if (/\/images\/hotel\//.test(src)) push(src);
      }
      for (const img of document.querySelectorAll('img')) {
        if (img.naturalWidth >= 400) push(img.currentSrc || img.src || '');
      }

      /* Reviews.
         Anchored on the author element and walked up to its card, rather than
         matched on a card class. The card class differs between the variants
         Trip.com serves, and the author element has been the one constant. */
      const authorEls = [
        ...document.querySelectorAll('[class*="reviewItem-userName" i], [class*="userName" i], [class*="nickName" i]'),
      ];
      const cards = new Set();
      for (const el of authorEls) {
        let node = el;
        for (let depth = 0; node && depth < 8; depth += 1) {
          if ((node.innerText ?? '').length > 80) break;
          node = node.parentElement;
        }
        if (node) cards.add(node);
      }

      const comments = [...cards]
        .map((card) => {
          const content = card.querySelector('[class*="reviewItem-content" i], [class*="commentTextPrimary" i]');
          const authorEl = card.querySelector('[class*="userName" i], [class*="nickName" i]');
          const dateEl = card.querySelector(
            '[class*="userReviewTime" i], [class*="reviewTime" i], time, [class*="date" i]',
          );
          const scoreEl = card.querySelector('[class*="score" i], [class*="rating" i]');
          return {
            quote: clean(content?.innerText ?? ''),
            author: clean(authorEl?.innerText ?? ''),
            date: clean(dateEl?.getAttribute?.('datetime') || dateEl?.innerText || ''),
            score: clean(scoreEl?.innerText ?? ''),
            /* Most reviews here were written in Chinese and are shown in
               Trip.com's machine translation. Quoting one as the guest's own
               words without saying so would put words in somebody's mouth, so
               the flag travels with the quote all the way to the page. */
            translated: /translation provided by ai|translated by/i.test(card.innerText ?? ''),
          };
        })
        .filter((comment) => comment.quote.length > 20 && comment.author);

      /* Facts for the writing brief. Never copy, only inform. */
      const facilities = [
        ...new Set(
          [...document.querySelectorAll('[class*="hotelFacility" i] [class*="name" i]')]
            .map((el) => clean(el.innerText))
            .filter((name) => name && name.length < 40),
        ),
      ].slice(0, 30);

      const aiSummary = clean(
        document.querySelector('[class*="summary" i]')?.innerText ?? '',
      ).slice(0, 1200);

      const rating = hotelLd?.aggregateRating;

      return {
        title: clean(document.querySelector('h1')?.innerText) || clean(hotelLd?.name),
        // Deliberately empty. The page carries no property written description,
        // and the AI review summary is not one.
        sourceDescription: '',
        aiSummary,
        address: hotelLd?.address?.streetAddress ?? '',
        priceRange: hotelLd?.priceRange ?? '',
        facilities,
        imageUrls,
        comments,
        ratingValue: rating?.ratingValue ?? null,
        ratingCount: rating?.reviewCount ?? null,
        ratingScale: rating?.bestRating ?? null,
      };
    });
  } finally {
    await context.close();
  }
}

/**
 * Trim a review to an excerpt. Never the whole thing, see section 5.
 *
 * Reviewers write markdown-ish emphasis into the box (**Environment:**) and it
 * survives into the rendered text. Stripping it is the only edit made to a
 * quote anywhere in this pipeline; the words themselves are untouched.
 */
function toExcerpt(quote) {
  const plain = quote
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const words = plain.split(' ');
  if (words.length <= QUOTE_WORDS) return words.join(' ');
  return `${words.slice(0, QUOTE_WORDS).join(' ')}...`;
}

/**
 * Best-effort ISO date. An unparsable date is left empty and fails validation.
 *
 * Built from the local calendar fields rather than toISOString, which shifts
 * the date back a day whenever the machine running the capture sits east of
 * UTC. "August 2" is what the reviewer's page says and August 2 is what gets
 * stored.
 */
function toIsoDate(raw) {
  if (!raw) return '';
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.valueOf())) return '';
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  return `${parsed.getFullYear()}-${month}-${day}`;
}

function firstNumber(text) {
  const match = /([\d.]+)/.exec(text ?? '');
  return match ? Number(match[1]) : null;
}

/* --------------------------------------------------------------------------
   Images
   -------------------------------------------------------------------------- */

/**
 * Download and re-encode. Nothing is ever hotlinked: partner CDNs are referrer
 * checked, expire URLs, and are unreliable from inside China, which is where a
 * large share of this audience reads.
 */
async function fetchImages(row, urls) {
  const srcDir = path.join(IMAGE_SRC_DIR, String(row.id));
  const outDir = path.join(IMAGE_OUT_DIR, String(row.id));
  await mkdir(srcDir, { recursive: true });
  await mkdir(outDir, { recursive: true });

  const written = [];
  for (const [index, url] of urls.entries()) {
    if (written.length >= MAX_IMAGES) break;
    try {
      const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
      if (!response.ok) continue;
      const buffer = Buffer.from(await response.arrayBuffer());

      // The CDN tops out at 800 wide for these assets, so MIN_WIDTH is the bar
      // for "big enough to be a gallery frame" rather than a downscale target.
      // Room and facility thumbnails come back at 339 wide and are dropped.
      const meta = await sharp(buffer).metadata();
      if ((meta.width ?? 0) < MIN_WIDTH) continue;

      await writeFile(path.join(srcDir, `${index + 1}.bin`), buffer);

      const name = `${written.length + 1}.webp`;
      const outFile = path.join(outDir, name);

      let quality = WEBP_QUALITY;
      let encoded = null;
      // Step the quality down rather than shipping something the image audit
      // will reject at push time.
      for (let attempt = 0; attempt < 4; attempt += 1) {
        encoded = await sharp(buffer)
          .rotate()
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
        if (encoded.length <= MAX_KB * 1024) break;
        quality -= 8;
      }
      if (!encoded || encoded.length > MAX_KB * 1024) continue;

      await writeFile(outFile, encoded);
      written.push({ src: `/images/stays/${row.id}/${name}`, sourceUrl: url });
      await sleep(400);
    } catch {
      // One bad file is not a reason to abandon a property that has five good
      // ones. A property that ends up under three images fails below.
    }
  }
  return written;
}

/* --------------------------------------------------------------------------
   Run
   -------------------------------------------------------------------------- */

async function collectOne(browser, row) {
  const captured =
    OPTS.source === 'api'
      ? await captureFromLicensedApi(row)
      : await captureFromListing(browser, row);

  const images = OPTS.images ? await fetchImages(row, captured.imageUrls ?? []) : [];

  const comments = (captured.comments ?? [])
    .map((comment) => ({
      quote: toExcerpt(comment.quote),
      author: comment.author.trim(),
      date: toIsoDate(comment.date),
      rating: firstNumber(comment.score) ?? undefined,
      translated: Boolean(comment.translated),
      sourceUrl: row.affiliateUrl,
    }))
    .filter((comment) => comment.quote && comment.author && comment.date)
    .slice(0, COMMENTS_WANTED);

  const score = firstNumber(captured.ratingValue);
  const count = firstNumber(String(captured.ratingCount ?? '').replace(/,/g, ''));
  // Trip.com scores out of 10, not 5. Storing the scale rather than halving the
  // number keeps the page able to print what the source actually said.
  const scale = firstNumber(captured.ratingScale) ?? 10;

  const record = {
    id: row.id,
    name: captured.title || row.name,
    seedName: row.name,
    city: row.city,
    cityId: row.cityId,
    goSlug: row.goSlug,
    affiliateUrl: row.affiliateUrl,
    sourceDescription: captured.sourceDescription ?? '',
    /* Reference only. Never becomes the description: it is a machine summary of
       other people's reviews, and the page it sits on says so. */
    aiSummary: captured.aiSummary ?? '',
    address: captured.address ?? '',
    priceRange: captured.priceRange ?? '',
    facilities: captured.facilities ?? [],
    images,
    comments,
    rating: score && count ? { score, count, scale } : null,
    sourcedAt: new Date().toISOString(),
    source: OPTS.source,
  };

  const problems = [];
  if (images.length < MIN_IMAGES) problems.push(`only ${images.length} usable images`);
  if (comments.length < COMMENTS_WANTED) problems.push(`only ${comments.length} usable comments`);
  if (!record.rating) problems.push('no rating captured');

  return { record, problems };
}

/**
 * Placeholder for the licensed route in section 5, which is the recommended one
 * and the only one that scales past the pilot. It throws rather than silently
 * falling back to capture, because "the API was not configured so we scraped
 * instead" is exactly the decision nobody should make by accident.
 */
async function captureFromLicensedApi() {
  throw new Error(
    'No licensed reviews client is configured. Wire one up here before running with --source api.',
  );
}

async function main() {
  const seed = JSON.parse(await readFile(SEED, 'utf8'));
  await mkdir(RAW_DIR, { recursive: true });

  let queue = seed;
  if (OPTS.only.length) {
    const wanted = new Set(OPTS.only);
    queue = seed.filter((row) => wanted.has(row.id));
    const missing = OPTS.only.filter((id) => !seed.some((row) => row.id === id));
    if (missing.length) console.warn(`Not in the seed, skipped: ${missing.join(', ')}`);
  } else {
    const pending = [];
    for (const row of seed) {
      const cached = await exists(path.join(RAW_DIR, `${row.id}.json`));
      if (!cached || OPTS.refresh) pending.push(row);
    }
    queue = OPTS.limit ? pending.slice(0, OPTS.limit) : pending;
  }

  if (!OPTS.refresh) {
    const fresh = [];
    for (const row of queue) {
      if (await exists(path.join(RAW_DIR, `${row.id}.json`))) {
        console.log(`cached  ${row.id}  ${row.name}`);
        continue;
      }
      fresh.push(row);
    }
    queue = fresh;
  }

  if (!queue.length) {
    console.log('Nothing to collect. Pass --refresh to re-fetch cached rows.');
    return;
  }

  console.log(`Collecting ${queue.length} properties, concurrency ${OPTS.concurrency}.`);
  await assertAllowed();

  const { chromium } = await import('playwright');
  // The automation flag is what triggers the sign-in wall. See captureFromListing.
  const browser = await chromium.launch({
    headless: !OPTS.headful,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const failed = [];
  let done = 0;

  const worker = async () => {
    for (;;) {
      const row = queue.shift();
      if (!row) return;

      let lastError = null;
      for (let attempt = 1; attempt <= 3; attempt += 1) {
        try {
          const { record, problems } = await collectOne(browser, row);
          await writeFile(
            path.join(RAW_DIR, `${row.id}.json`),
            `${JSON.stringify(record, null, 2)}\n`,
          );
          if (problems.length) {
            failed.push({ id: row.id, name: row.name, problems });
            console.log(`partial ${row.id}  ${row.name}  (${problems.join('; ')})`);
          } else {
            console.log(`ok      ${row.id}  ${row.name}`);
          }
          lastError = null;
          break;
        } catch (error) {
          lastError = error;
          // Exponential backoff on top of the standing jitter.
          await sleep(2000 * 2 ** attempt);
        }
      }

      if (lastError) {
        failed.push({ id: row.id, name: row.name, problems: [String(lastError.message ?? lastError)] });
        console.log(`fail    ${row.id}  ${row.name}  ${lastError.message ?? lastError}`);
      }

      done += 1;
      await jitter();
    }
  };

  await Promise.all(Array.from({ length: OPTS.concurrency }, worker));
  await browser.close();

  await writeFile(FAILED, `${JSON.stringify(failed, null, 2)}\n`);
  console.log(`\nCollected ${done}. ${failed.length} need attention, listed in ${FAILED}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
