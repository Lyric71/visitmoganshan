#!/usr/bin/env node
// Find properties on Trip.com that are not in the affiliate list yet, and add
// them.
//
//   npm run stays:discover
//   npm run stays:discover -- --dry
//   npm run stays:discover -- --city Deqing --pages 20
//
// Flags:
//   --dry            report what would be added, write nothing
//   --city <name>    Deqing or Huzhou. Default: both.
//   --pages <n>      how many result pages to walk per city. Default 25.
//   --headful        watch the browser, for when the listing markup has moved
//
// What it does, and just as importantly what it does not:
//
//   Adds. A hotelId already in data/seed/properties.seed.json is left exactly
//   as it is, including its name. Renaming a row would change its slug, which
//   would break a URL somebody has already linked to, and the hotelId suffix on
//   every slug exists precisely so a name can drift without anything moving.
//
//   Never removes. A property missing from today's search results has not
//   necessarily closed; it may be sold out, filtered out, or on page 26. Taking
//   a row out of the list deletes a /go/ redirect and a page, and that is a
//   decision for a person looking at the property, not for a crawler.
//
// Classification is not done here. It is derived from the name by guessType in
// src/lib/stays.ts every time a page renders, so a property lands in the right
// listing the moment it is added, and improving the classifier reclassifies
// everything at once rather than leaving old rows on an old guess.
//
// Same manners as the capture: robots.txt honored, two at a time, jittered.

import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const SEED = 'data/seed/properties.seed.json';
const REDIRECTS = 'data/seed/go-redirects.json';

/** Baked into every affiliate URL. Not secrets, but not to be retyped either. */
const ALLIANCE_ID = '9859697';
const SID = '327673690';
const TRIP_SUB3 = 'D19127628';

const CITIES = {
  Deqing: 1367,
  Huzhou: 86,
};

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 || i === args.length - 1 ? fallback : args[i + 1];
};

const OPTS = {
  dry: flag('dry'),
  headful: flag('headful'),
  pages: Number(value('pages', '25')) || 25,
  cities: value('city') ? [value('city')] : Object.keys(CITIES),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jitter = () => sleep(3000 + Math.random() * 3000);

/* --------------------------------------------------------------------------
   Identity
   -------------------------------------------------------------------------- */

/**
 * {ascii-kebab-of-name, truncated 60}-{hotelId}.
 *
 * Must match what produced the existing 809 slugs, or a re-seed would rename
 * rows that have not changed. CJK and anything else outside ASCII drops out,
 * which is why a handful of the existing slugs are almost entirely their
 * hotelId: that is correct, and the id is what makes them unique anyway.
 */
export function toSlug(name, id) {
  const ascii = name
    .normalize('NFKD')
    // Dropped, not replaced. The existing slugs join the words either side of a
    // middot (moganshansuishan, not moganshan-suishan) because the character
    // was deleted before the kebab pass, and reproducing that exactly is the
    // difference between adding rows and silently renaming 38 of them.
    .replace(/[^\x20-\x7E]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
  // A name written entirely in Chinese leaves nothing behind, and those rows
  // are slugged stay-{id} in the existing list. The id is what makes a slug
  // unique anyway; the words in front of it are a courtesy to whoever reads
  // the URL.
  return ascii ? `${ascii}-${id}` : `stay-${id}`;
}

export function affiliateUrl(id, city, cityId) {
  const params = new URLSearchParams({
    cityEnName: city,
    cityId: String(cityId),
    hotelId: String(id),
    Allianceid: ALLIANCE_ID,
    SID: SID,
    trip_sub1: `moganshan-${id}`,
    trip_sub3: TRIP_SUB3,
  });
  return `https://www.trip.com/hotels/detail/?${params.toString()}`;
}

/* --------------------------------------------------------------------------
   robots.txt
   -------------------------------------------------------------------------- */

async function assertAllowed() {
  const response = await fetch('https://www.trip.com/robots.txt', {
    headers: { 'user-agent': USER_AGENT },
  });
  if (!response.ok) throw new Error(`robots.txt returned ${response.status}. Not proceeding.`);

  let inWildcard = false;
  for (const line of (await response.text()).split(/\r?\n/)) {
    const clean = line.split('#')[0].trim();
    if (!clean) continue;
    const [rawKey, ...rest] = clean.split(':');
    const key = rawKey.trim().toLowerCase();
    const val = rest.join(':').trim();
    if (key === 'user-agent') inWildcard = val === '*';
    else if (inWildcard && key === 'disallow' && val) {
      if ('/hotels/list'.startsWith(val) || val === '/') {
        throw new Error(`robots.txt disallows ${val}. Discovery stops here.`);
      }
    }
  }
}

/* --------------------------------------------------------------------------
   Walking the listings
   -------------------------------------------------------------------------- */

/**
 * Read one page of results and return the hotelIds and names on it.
 *
 * hotelIds are taken from the hrefs rather than from any markup class, because
 * a link to /hotels/detail/?...hotelId=N is the one thing on that page that
 * cannot change shape without the site breaking its own deep links. The name is
 * read from the card the link sits in, and a card whose name cannot be read is
 * skipped rather than guessed at.
 */
async function readPage(page, city, cityId, pageIndex) {
  const params = new URLSearchParams({
    cityEnName: city,
    cityId: String(cityId),
    pageIndex: String(pageIndex),
  });
  await page.goto(`https://www.trip.com/hotels/list?${params.toString()}`, {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(5000);

  // Results load as you scroll. Walk down rather than jumping to the bottom,
  // which skips the observers entirely.
  for (let y = 1000; y <= 8000; y += 1200) {
    await page.evaluate((offset) => window.scrollTo(0, offset), y);
    await page.waitForTimeout(900);
  }

  return page.evaluate(() => {
    const found = new Map();
    for (const link of document.querySelectorAll('a[href*="hotelId="]')) {
      const match = /hotelId=(\d+)/.exec(link.getAttribute('href') ?? '');
      if (!match) continue;
      const id = Number(match[1]);
      if (!id || found.has(id)) continue;

      const card = link.closest('[class*="hotel" i], li, article') ?? link;
      const name = (
        card.querySelector('[class*="name" i], h2, h3')?.textContent ??
        link.getAttribute('title') ??
        link.textContent ??
        ''
      )
        .replace(/\s+/g, ' ')
        .trim();

      if (name.length > 1) found.set(id, name);
    }
    return [...found].map(([id, name]) => ({ id, name }));
  });
}

/* --------------------------------------------------------------------------
   Run
   -------------------------------------------------------------------------- */

async function main() {
  const seed = JSON.parse(await readFile(SEED, 'utf8'));
  const known = new Set(seed.map((row) => row.id));

  console.log(`${seed.length} properties in the list. Looking for ones that are not.`);
  await assertAllowed();

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    headless: !OPTS.headful,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const discovered = new Map();

  try {
    for (const city of OPTS.cities) {
      const cityId = CITIES[city];
      if (!cityId) {
        console.warn(`Unknown city ${city}, skipped. Known: ${Object.keys(CITIES).join(', ')}`);
        continue;
      }

      const context = await browser.newContext({
        userAgent: USER_AGENT,
        locale: 'en-US',
        viewport: { width: 1440, height: 1200 },
        timezoneId: 'Asia/Shanghai',
      });
      // Without this the listing answers with a sign-in wall.
      await context.addInitScript(() =>
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined }),
      );
      const page = await context.newPage();

      let emptyRuns = 0;
      for (let index = 1; index <= OPTS.pages; index += 1) {
        let results = [];
        try {
          results = await readPage(page, city, cityId, index);
        } catch (error) {
          console.log(`  ${city} page ${index}: ${String(error.message ?? error).slice(0, 70)}`);
        }

        const fresh = results.filter((row) => !known.has(row.id) && !discovered.has(row.id));
        for (const row of fresh) discovered.set(row.id, { ...row, city, cityId });

        console.log(
          `  ${city} page ${index}: ${results.length} listed, ${fresh.length} new`,
        );

        // Two consecutive pages with nothing on them is the end of the results,
        // not a blip. One might be a failed load.
        if (results.length === 0) {
          emptyRuns += 1;
          if (emptyRuns >= 2) break;
        } else {
          emptyRuns = 0;
        }

        await jitter();
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (discovered.size === 0) {
    console.log('\nNothing new. The list is current.');
    return;
  }

  const additions = [...discovered.values()]
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .map((row) => ({
      id: row.id,
      slug: toSlug(row.name, row.id),
      name: row.name,
      city: row.city,
      cityId: row.cityId,
      goSlug: `moganshan-${row.id}`,
      affiliateUrl: affiliateUrl(row.id, row.city, row.cityId),
      status: 'draft',
    }));

  console.log(`\n${additions.length} new propert${additions.length === 1 ? 'y' : 'ies'}:`);
  for (const row of additions) console.log(`  ${row.id}  ${row.name}`);

  if (OPTS.dry) {
    console.log('\nDry run. Nothing written.');
    return;
  }

  // Appended, never merged over the top of an existing row. A slug that already
  // exists is a URL somebody may already have.
  const nextSeed = [...seed, ...additions];
  await writeFile(SEED, `${JSON.stringify(nextSeed, null, 2)}\n`);

  const redirects = JSON.parse(await readFile(REDIRECTS, 'utf8'));
  redirects.redirects.push(
    ...additions.map((row) => ({
      source: `/go/${row.goSlug}`,
      destination: row.affiliateUrl,
      permanent: false,
    })),
  );
  await writeFile(REDIRECTS, `${JSON.stringify(redirects, null, 2)}\n`);

  console.log(`\nWritten. The list is now ${nextSeed.length}.`);
  console.log('Next: npm run stays:collect, then npm run stays:img, then npm run stays:validate.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
