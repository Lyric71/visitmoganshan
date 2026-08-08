#!/usr/bin/env node
// Fill in the nightly rate for properties whose capture came back without one.
//
//   npm run stays:prices              only the rows with no parseable price
//   npm run stays:prices -- --all     every row, refreshing what is there
//   npm run stays:prices -- --concurrency=3
//
// The full capture reads priceRange out of the Hotel JSON-LD block. When
// Trip.com has no availability for its default dates it puts a marketing line
// in that field instead of a number ("Unbeatable daily deals..."), so 233 of
// the 809 rows carry prose where a rate should be. This pass goes back for
// those with two changes: it asks for a specific stay a month out rather than
// taking whatever default the page picks, and it falls back to the cheapest
// rate rendered in the room list when the structured block still has nothing.
//
// It writes `price` onto the existing raw record and leaves every other field
// alone. Nothing here re-downloads an image.
//
// A rate is a snapshot of one search on one day, which is why the record keeps
// `checkIn` and `pricedAt` next to the number: a filter band built on it is
// honest, a claim that a room costs this much tonight is not.

import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const OPTS = {
  all: process.argv.includes('--all'),
  headful: process.argv.includes('--headful'),
  concurrency: Number(
    (process.argv.find((a) => a.startsWith('--concurrency=')) ?? '').split('=')[1] || 3,
  ),
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const jitter = () => sleep(600 + Math.floor(Math.random() * 900));

/**
 * Pull a number out of whatever the page put in the price slot.
 *
 * Returns null for the marketing line, which is the whole point: a row with no
 * number has to stay without one rather than acquire a zero that would sort to
 * the top of a cheapest-first filter.
 */
export function parsePrice(text) {
  if (!text) return null;
  const match = String(text).match(
    /(US\$|USD|RMB|CNY|¥|￥|€|£|\$)\s*([\d.,]+)|([\d.,]+)\s*(US\$|USD|RMB|CNY|¥|￥|€|£)/i,
  );
  if (!match) return null;
  const symbol = (match[1] ?? match[4] ?? '').toUpperCase();
  const raw = (match[2] ?? match[3] ?? '').replace(/,/g, '');
  const amount = Number(raw);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const currency = /RMB|CNY|¥|￥/.test(symbol)
    ? 'CNY'
    : symbol === '€'
      ? 'EUR'
      : symbol === '£'
        ? 'GBP'
        : 'USD';
  return { amount, currency };
}

/** A stay a month out, two nights, midweek-ish. Same window for every row so
 *  the bands compare like with like. */
function stayDates() {
  const start = new Date();
  start.setDate(start.getDate() + 30);
  const end = new Date(start);
  end.setDate(end.getDate() + 2);
  const iso = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return { checkIn: iso(start), checkOut: iso(end) };
}

const { checkIn, checkOut } = stayDates();

function datedUrl(affiliateUrl) {
  const url = new URL(affiliateUrl);
  url.searchParams.set('checkin', checkIn.replace(/-/g, ''));
  url.searchParams.set('checkout', checkOut.replace(/-/g, ''));
  url.searchParams.set('adult', '2');
  url.searchParams.set('children', '0');
  return url.href;
}

async function priceOne(browser, record) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: 'en-US',
    viewport: { width: 1440, height: 1200 },
    timezoneId: 'Asia/Shanghai',
  });
  await context.addInitScript(() =>
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined }),
  );
  const page = await context.newPage();

  try {
    await page.goto(datedUrl(record.affiliateUrl), {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForTimeout(5000);
    // The room list is below the fold and renders its rates on scroll.
    for (const y of [900, 1800, 2700, 3600]) {
      await page.evaluate((offset) => window.scrollTo(0, offset), y);
      await page.waitForTimeout(700);
    }

    return await page.evaluate(() => {
      const clean = (v) => (v ?? '').replace(/\s+/g, ' ').trim();

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

      // Everything on the page that looks like a rate. The cheapest of them is
      // the "from" price, which is what a listing card should carry: the room
      // list is sorted by the site's own logic rather than by price.
      const candidates = [];
      if (hotelLd?.priceRange) candidates.push(clean(hotelLd.priceRange));
      for (const el of document.querySelectorAll(
        '[class*="price" i], [class*="Price" i], [data-testid*="price" i]',
      )) {
        const text = clean(el.innerText);
        if (!text || text.length > 40) continue;
        candidates.push(text);
      }
      return { candidates: candidates.slice(0, 200), title: clean(document.querySelector('h1')?.innerText) };
    });
  } finally {
    await context.close();
  }
}

function cheapest(candidates) {
  const parsed = candidates.map(parsePrice).filter(Boolean);
  if (!parsed.length) return null;
  // Per-night rates only. A total for the stay, a deposit or a points balance
  // all land in the same class names, and anything under 10 or over 5000 in a
  // single night is one of those rather than a room.
  const sane = parsed.filter((p) => p.amount >= 10 && p.amount <= 5000);
  if (!sane.length) return null;
  return sane.reduce((low, p) => (p.amount < low.amount ? p : low));
}

async function main() {
  const files = (await readdir(RAW_DIR)).filter((f) => f.endsWith('.json'));
  const queue = [];

  for (const file of files) {
    const record = JSON.parse(await readFile(path.join(RAW_DIR, file), 'utf8'));
    const existing = record.price?.amount ?? parsePrice(record.priceRange)?.amount ?? null;
    if (existing && !OPTS.all) continue;
    queue.push({ file, record });
  }

  if (!queue.length) {
    console.log('Every property already carries a price. Pass --all to refresh them.');
    return;
  }

  console.log(
    `Pricing ${queue.length} propert${queue.length === 1 ? 'y' : 'ies'} for ${checkIn} to ${checkOut}, concurrency ${OPTS.concurrency}.`,
  );

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({
    headless: !OPTS.headful,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  let found = 0;
  let blank = 0;

  const worker = async () => {
    for (;;) {
      const job = queue.shift();
      if (!job) return;

      let price = null;
      for (let attempt = 1; attempt <= 2 && !price; attempt += 1) {
        try {
          const { candidates } = await priceOne(browser, job.record);
          price = cheapest(candidates);
        } catch (error) {
          await sleep(1500 * 2 ** attempt);
        }
      }

      if (price) {
        found += 1;
        job.record.price = { ...price, checkIn, checkOut, pricedAt: new Date().toISOString().slice(0, 10) };
        await writeFile(
          path.join(RAW_DIR, job.file),
          `${JSON.stringify(job.record, null, 2)}\n`,
        );
        console.log(`ok    ${job.record.id}  ${price.currency} ${price.amount}  ${job.record.name}`);
      } else {
        blank += 1;
        console.log(`none  ${job.record.id}  ${job.record.name}`);
      }

      await jitter();
    }
  };

  await Promise.all(Array.from({ length: OPTS.concurrency }, worker));
  await browser.close();

  console.log(`\n${found} priced, ${blank} still without a rate.`);
}

// Only when run directly. `parsePrice` is imported by the backfill and by the
// site build, and an import that silently opens a browser and starts hitting
// Trip.com is the kind of surprise that costs an afternoon.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
