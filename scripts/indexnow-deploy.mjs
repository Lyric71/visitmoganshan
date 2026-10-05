#!/usr/bin/env node
/**
 * IndexNow on deploy: submit the new and changed pages of the live site to
 * IndexNow (Bing, Yandex, Naver, Seznam). Google does not read IndexNow.
 *
 * Run by .github/workflows/indexnow.yml after every successful Vercel
 * production deploy. The same two files are installed in every website repo
 * in C:\Users\cyril\Project; keep them identical across repos.
 *
 * How it decides what changed: it reads the live sitemap and compares it with
 * the snapshot the previous run left behind (kept as a workflow artifact).
 *   INDEXNOW_DETECT=content (default)  fetch every page, hash its visible text,
 *     title, meta description and canonical. Works whatever the sitemap says,
 *     including sitemaps with no lastmod or a build-time lastmod on every URL.
 *   INDEXNOW_DETECT=lastmod            compare sitemap <lastmod> only. For
 *     large database-driven sites whose lastmod is real (bbchien).
 * A URL that is new to the sitemap is always submitted. With no snapshot (the
 * first run, or more than 90 days without a deploy) the run records one and
 * submits only URLs whose lastmod falls in the last 48 hours, when the sitemap
 * carries a trustworthy lastmod.
 *
 * Env:  SITE_URL       https://www.example.com (required)
 *       INDEXNOW_KEY   optional; otherwise the public/<key>.txt file is used
 *
 *   node scripts/indexnow-deploy.mjs --snapshot .indexnow/snapshot.json
 *   node scripts/indexnow-deploy.mjs <url> [<url> ...]     # explicit URLs
 *   add --dry-run to print the list without submitting or saving
 *   add --record to save the snapshot without submitting anything
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const SITE = (process.env.SITE_URL ?? '').replace(/\/+$/, '');
const DETECT = process.env.INDEXNOW_DETECT ?? 'content';
const SEED_WINDOW_MS = 48 * 60 * 60 * 1000;
const CONCURRENCY = 8;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const record = args.includes('--record');
const snapIdx = args.indexOf('--snapshot');
const snapshotPath = snapIdx >= 0 ? args[snapIdx + 1] : undefined;
const explicit = args.filter((a, i) => /^https?:\/\//.test(a) && (snapIdx < 0 || i !== snapIdx + 1));

if (!/^https?:\/\/[^/]+$/.test(SITE)) fail('Set SITE_URL, e.g. https://www.example.com');
if (!['content', 'lastmod'].includes(DETECT)) fail(`INDEXNOW_DETECT must be content or lastmod, not ${DETECT}`);
const HOST = new URL(SITE).host;
const KEY = process.env.INDEXNOW_KEY || findKey();

/** @param {string} msg */
function fail(msg) {
  console.error(`[indexnow] ${msg}`);
  process.exit(1);
}

function findKey() {
  const dir = 'public';
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).sort()) {
      const m = f.match(/^([a-zA-Z0-9-]{8,128})\.txt$/);
      if (m && readFileSync(`${dir}/${f}`, 'utf8').trim() === m[1]) return m[1];
    }
  }
  fail('No IndexNow key: add public/<key>.txt containing the key, or set INDEXNOW_KEY.');
}

/** @param {string} url @param {number} [tries] */
async function get(url, tries = 3) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'cache-control': 'no-cache', 'user-agent': 'indexnow-deploy (+https://www.indexnow.org)' },
        redirect: 'manual',
        signal: AbortSignal.timeout(20000),
      });
      if (res.status === 200) return await res.text();
      if (res.status < 500 || attempt >= tries) return null;
    } catch (e) {
      if (attempt >= tries) return null;
    }
    await new Promise((r) => setTimeout(r, 3000 * attempt));
  }
}

/** Live sitemap as { url: lastmod-or-empty }, following sitemap indexes. */
async function readSitemap() {
  /** @type {Record<string, string>} */
  const entries = {};
  const seen = new Set();
  const queue = [];
  for (const p of ['/sitemap-index.xml', '/sitemap_index.xml', '/sitemap.xml']) {
    const xml = await get(SITE + p);
    if (xml && /<(urlset|sitemapindex)/.test(xml)) {
      queue.push([SITE + p, xml]);
      break;
    }
  }
  if (!queue.length) fail(`No sitemap found at ${SITE}`);
  while (queue.length) {
    const [loc, xml] = /** @type {[string, string]} */ (queue.shift());
    seen.add(loc);
    if (/<sitemapindex/.test(xml)) {
      for (const [, child] of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
        if (seen.has(child)) continue;
        const body = await get(child);
        if (!body) fail(`Child sitemap unreadable: ${child}`);
        queue.push([child, body]);
      }
      continue;
    }
    for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const url = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1];
      if (url) entries[url.replace(/&amp;/g, '&')] = block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1] ?? '';
    }
  }
  return entries;
}

// v2 hashes the page's text lines as a sorted set, so a grid shuffled at build
// time (the /work/ pages) is not a change; any added, removed or edited line
// still is. v1 hashed the text in page order. A v1 snapshot is compared with
// v1 once, then replaced by v2 hashes.
const HASH_VERSION = 2;

/**
 * Hash of what a search engine indexes, not of build artefacts.
 * @param {string} html @param {number} [version]
 */
function contentHash(html, version = HASH_VERSION) {
  const pick = (/** @type {RegExp} */ re) => html.match(re)?.[1]?.trim() ?? '';
  const head = [
    pick(/<title[^>]*>([\s\S]*?)<\/title>/i),
    pick(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)/i),
    pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']*)/i),
    pick(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)/i),
  ].join('\n');
  const text = html
    .replace(/<(script|style|svg|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ')
    // Forms carry per-request content (maths CAPTCHAs, tokens) that is not indexed.
    .replace(/<form\b[\s\S]*?<\/form>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const body =
    version === 1
      ? text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
      : text
          .replace(/<[^>]+>/g, '\n')
          .split('\n')
          .map((line) => line.replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .sort()
          .join('\n');
  return createHash('sha1').update(head + '\n' + body).digest('hex');
}

/** @param {string[]} urls @param {number} compareVersion */
async function hashPages(urls, compareVersion) {
  /** @type {Record<string, {hash: string, compare: string} | null>} */
  const out = {};
  let i = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (i < urls.length) {
        const url = urls[i++];
        const html = await get(url, 2);
        out[url] =
          html === null
            ? null
            : {
                hash: contentHash(html),
                compare: compareVersion === HASH_VERSION ? '' : contentHash(html, compareVersion),
              };
      }
    }),
  );
  return out;
}

/** @param {string} s */
const time = (s) => (s ? Date.parse(s) : NaN);

/** True when lastmod looks real: present and not one stamp on most URLs. @param {Record<string,string>} map */
function lastmodTrustworthy(map) {
  const values = Object.values(map).filter(Boolean);
  if (values.length < Object.keys(map).length / 2) return false;
  const counts = new Map();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return Math.max(...counts.values()) <= values.length / 2;
}

/** @type {string[]} */
let urlList;
/** @type {Record<string, {lastmod: string, hash?: string}> | undefined} */
let next;

if (explicit.length) {
  urlList = explicit;
} else {
  if (!snapshotPath) fail('Pass --snapshot <file>, or explicit URLs.');
  const sitemap = await readSitemap();
  const urls = Object.keys(sitemap).filter((u) => new URL(u).host === HOST);
  const previous = existsSync(snapshotPath) ? JSON.parse(readFileSync(snapshotPath, 'utf8')) : null;
  const prev = previous && previous.detect === DETECT ? previous.entries : null;
  console.log(`[indexnow] ${urls.length} URLs in the live sitemap, detect=${DETECT}, snapshot=${prev ? 'yes' : 'none'}`);

  const compareVersion = previous?.hashVersion ?? 1;
  const hashes = DETECT === 'content' ? await hashPages(urls, compareVersion) : {};
  next = {};
  urlList = [];
  for (const url of urls) {
    const lastmod = sitemap[url];
    if (DETECT === 'content') {
      const h = hashes[url];
      if (h === null) {
        // Unreachable this run: keep what we knew, submit nothing.
        if (prev?.[url]) next[url] = prev[url];
        console.log(`  skipped, not 200: ${url}`);
        continue;
      }
      next[url] = { lastmod, hash: h.hash };
      const now = compareVersion === HASH_VERSION ? h.hash : h.compare;
      if (prev && (!prev[url] || prev[url].hash !== now)) urlList.push(url);
    } else {
      next[url] = { lastmod };
      if (prev && (!prev[url] || time(lastmod) > time(prev[url].lastmod))) urlList.push(url);
    }
  }
  if (!prev) {
    if (lastmodTrustworthy(sitemap)) {
      const since = Date.now() - SEED_WINDOW_MS;
      urlList = urls.filter((u) => time(sitemap[u]) >= since);
      console.log('[indexnow] First run: snapshot recorded; submitting URLs with a lastmod in the last 48 hours.');
    } else {
      console.log('[indexnow] First run: snapshot recorded; the next deploy submits what changes.');
    }
  }
}

urlList = urlList.filter((u) => new URL(u).host === HOST);
console.log(`[indexnow] ${urlList.length} URL(s) to submit${dryRun ? ' (dry run)' : record ? ' (record only, not submitted)' : ''}`);
for (const u of urlList) console.log(`  ${u}`);

if (urlList.length && !dryRun && !record) {
  for (let start = 0; start < urlList.length; start += 10000) {
    const batch = urlList.slice(start, start + 10000);
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: batch }),
    });
    console.log(`[indexnow] Submitted ${batch.length} URL(s) -> HTTP ${res.status} ${res.statusText}`);
    // 200/202 accepted. 403 key not found at keyLocation. 422 URL/host mismatch. 429 too many.
    if (![200, 202].includes(res.status)) fail('Submission not accepted; snapshot left unchanged so the next run retries.');
  }
}

if (snapshotPath && next && !dryRun) {
  mkdirSync(dirname(snapshotPath), { recursive: true });
  writeFileSync(snapshotPath, JSON.stringify({ version: 1, hashVersion: HASH_VERSION, detect: DETECT, site: SITE, entries: next }));
}
