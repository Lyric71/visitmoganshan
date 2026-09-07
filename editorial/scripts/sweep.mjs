#!/usr/bin/env node
// The news sweep: the collection step of the news layer.
//
//   node editorial/scripts/sweep.mjs [--force] [--source <id>] [--dry] [--quiet]
//
// Reads editorial/news/sources.json, fetches every listing page the registry
// marks as crawlable, keeps the article links that match each source's URL
// pattern, dates them from the URL, filters the headlines by keyword, dedupes
// against editorial/news/seen.json and writes a triage file to
// editorial/news/triage/YYYY-MM-DD.md (and .json) for the drafting run to read.
//
// It fetches listing pages only, never article bodies: the drafting run fetches
// the two or three articles it decides to write about. Nothing is republished
// and nothing fetched is kept beyond the headline and the URL.
//
// Manners: one request at a time, the registry's delay between requests, the
// declared user agent, a hard timeout per request. Sources that only answer
// from inside China are attempted with a short timeout and reported as
// unreachable rather than retried. A source that fails is recorded with its
// error and the sweep carries on; the sweep as a whole fails only when it
// cannot read or write its own files.
//
// --force ignores settings.json's paused flag and the sweep gate. --source
// limits the run to one source id. --dry fetches and prints but writes nothing.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import {
  ageDays,
  canonicalUrl,
  dateFromUrl,
  detectCharset,
  effectiveFilter,
  extractLinks,
  matchTitle,
  scoreCandidate,
  titleHash,
  urlHash,
  validateRegistry,
} from './news-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const NEWS = path.join(ROOT, 'editorial', 'news');
const FILES = {
  sources: path.join(NEWS, 'sources.json'),
  settings: path.join(NEWS, 'settings.json'),
  seen: path.join(NEWS, 'seen.json'),
  runs: path.join(NEWS, 'runs.json'),
  triage: path.join(NEWS, 'triage'),
};

const argv = process.argv.slice(2);
const FORCE = argv.includes('--force');
const DRY = argv.includes('--dry');
const QUIET = argv.includes('--quiet');
const ONLY = argv.includes('--source') ? argv[argv.indexOf('--source') + 1] : null;

const CRAWLABLE_KINDS = new Set([undefined, null]);
const BROWSER_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
};
// Colour coded warnings only. The bare word 预警 appears in every weather
// site's navigation and matched on the first run against menus, not weather.
const WEATHER_WARNINGS = ['蓝色预警', '黄色预警', '橙色预警', '红色预警', '道路结冰', '封山', '台风登陆', '暴雪'];

const log = (line) => {
  if (!QUIET) console.log(line);
};
const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const today = () => new Date().toISOString().slice(0, 10);
const shanghaiNow = () => new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false });

/* ==========================================================================
   Fetching
   ========================================================================== */

async function fetchPage(url, { userAgent, timeoutMs, browserHeaders }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      headers: browserHeaders ? BROWSER_HEADERS : { 'user-agent': userAgent, accept: 'text/html,*/*;q=0.8' },
      redirect: 'follow',
      signal: controller.signal,
    });
    const bytes = new Uint8Array(await response.arrayBuffer());
    const charset = detectCharset(response.headers.get('content-type'), bytes.subarray(0, 4096));
    let html;
    try {
      html = new TextDecoder(charset).decode(bytes);
    } catch {
      html = new TextDecoder('utf-8').decode(bytes);
    }
    return { ok: response.ok, status: response.status, html, charset, bytes: bytes.length, finalUrl: response.url };
  } finally {
    clearTimeout(timer);
  }
}

/** A challenge page rather than the listing: tiny, and all script. */
function looksLikeWall(html) {
  if (html.length > 20_000) return false;
  return /alicfw|onload="check()"|acw_sc__v2|__jsl_clearance|cf-challenge|_dx_captcha/i.test(html) || !/<a/i.test(html);
}

/* ==========================================================================
   One source
   ========================================================================== */

function isCrawlable(source) {
  if (!source.enabled) return { crawl: false, why: 'disabled' };
  if (!CRAWLABLE_KINDS.has(source.kind)) return { crawl: false, why: `kind ${source.kind}` };
  if (source.manualOnly) return { crawl: false, why: 'manual only' };
  if (source.renderedClientSide) return { crawl: false, why: 'rendered client side' };
  if (!source.articlePattern) return { crawl: false, why: 'no article pattern' };
  if (!source.listings.length) return { crawl: false, why: 'no listings' };
  return { crawl: true };
}

async function sweepSource(source, registry, settings, seen, now) {
  const { defaults, keywords } = registry;
  const lookback = settings.lookbackDays ?? defaults.lookbackDays;
  const cnOnly = !source.reachableFrom.includes('global');
  const timeoutMs = cnOnly ? Math.min(defaults.timeoutMs, 12_000) : defaults.timeoutMs;
  const pattern = new RegExp(source.articlePattern);
  const result = { id: source.id, listings: [], candidates: [], errors: [], unreachable: false };

  for (const listing of source.listings) {
    if (listing.renderedClientSide) {
      result.listings.push({ label: listing.label, url: listing.url, skipped: 'rendered client side' });
      continue;
    }
    const filter = effectiveFilter(listing, source, defaults);
    const entry = { label: listing.label, url: listing.url, filter, status: null, links: 0, matched: 0, kept: 0 };
    result.listings.push(entry);
    try {
      const page = await fetchPage(listing.url, {
        userAgent: defaults.userAgent,
        timeoutMs,
        browserHeaders: source.requiresBrowserHeaders,
      });
      entry.status = page.status;
      entry.charset = page.charset;
      if (!page.ok) {
        result.errors.push(`${listing.label}: HTTP ${page.status}`);
        continue;
      }
      if (looksLikeWall(page.html)) {
        // Alibaba's WAF (Meadin), among others, answers a first request with a
        // small page of JavaScript that sets a cookie and reloads. Saying so is
        // more useful than "0 links": the listing is readable in a browser.
        entry.status = 'wall';
        entry.error = `anti bot challenge page (${page.bytes} bytes), open it in a browser instead`;
        result.errors.push(`${listing.label}: ${entry.error}`);
        continue;
      }
      const links = extractLinks(page.html, page.finalUrl || listing.url);
      entry.links = links.length;
      const perListing = new Map();
      for (const link of links) {
        if (!pattern.test(link.href)) continue;
        entry.matched += 1;
        const canonical = canonicalUrl(link.href);
        if (perListing.has(canonical)) {
          // The same article twice on one page (a headline and a thumbnail):
          // keep the longer title, which is the headline.
          const existing = perListing.get(canonical);
          if (link.title.length > existing.title.length) existing.title = link.title;
          continue;
        }
        const date = dateFromUrl(link.href, source.articlePattern, source.dateFromUrl);
        if (date && ageDays(date, now) > lookback) continue;
        const title = link.title;
        if (title.length < 6) continue;
        const match = matchTitle(title, filter, keywords);
        if (!match.keep) continue;
        perListing.set(canonical, {
          url: canonical,
          title,
          date,
          matched: match.matched,
          listing: listing.label,
        });
      }
      entry.kept = perListing.size;
      result.candidates.push(...perListing.values());
    } catch (error) {
      const message = error.name === 'AbortError' ? `timeout after ${timeoutMs} ms` : error.message.split('\n')[0];
      result.errors.push(`${listing.label}: ${message}`);
      entry.status = 'error';
      entry.error = message;
      if (cnOnly) result.unreachable = true;
    }
    await sleep(defaults.requestDelayMs);
  }

  // Dedupe across the source's listings and against the ledger.
  const byUrl = new Map();
  for (const candidate of result.candidates) {
    if (!byUrl.has(candidate.url)) byUrl.set(candidate.url, candidate);
  }
  result.candidates = [...byUrl.values()].map((candidate) => {
    const key = urlHash(candidate.url);
    const known = seen.items[key];
    const tHash = titleHash(candidate.title);
    const twin = Object.values(seen.items).find(
      (item) => item.title_hash === tHash && item.url !== candidate.url,
    );
    return {
      ...candidate,
      key,
      title_hash: tHash,
      source: source.id,
      tier: source.tier,
      isNew: !known,
      status: known?.status ?? 'new',
      duplicateOf: twin ? twin.url : null,
      seenCount: (known?.seenCount ?? 0) + 1,
    };
  });
  return result;
}

/* ==========================================================================
   The weather signal
   ========================================================================== */

async function weatherSignal(source, registry) {
  const out = { id: source.id, checks: [] };
  for (const listing of source.listings) {
    const check = { label: listing.label, url: listing.url, status: null, warnings: [] };
    out.checks.push(check);
    try {
      const page = await fetchPage(listing.url, {
        userAgent: registry.defaults.userAgent,
        timeoutMs: 12_000,
        browserHeaders: true,
      });
      check.status = page.status;
      if (!page.ok) continue;
      const text = page.html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ');
      for (const term of WEATHER_WARNINGS) {
        const index = text.indexOf(term);
        if (index === -1) continue;
        const snippet = text.slice(Math.max(0, index - 30), index + 40).replace(/\s+/g, ' ').trim();
        check.warnings.push({ term, snippet });
      }
    } catch (error) {
      check.status = 'error';
      check.error = error.name === 'AbortError' ? 'timeout' : error.message.split('\n')[0];
    }
    await sleep(registry.defaults.requestDelayMs);
  }
  return out;
}

/* ==========================================================================
   Fixtures and watch items due
   ========================================================================== */

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

function fixturesDue(fixtures, now) {
  const month = now.getMonth();
  const day = now.getDate();
  const thisMonth = MONTHS[month];
  const nextMonth = MONTHS[(month + 1) % 12];
  return fixtures.filter((fixture) => {
    const window = fixture.window.toLowerCase();
    if (window.includes('golden week')) return (month === 8 && day >= 15) || (month === 3 && day >= 18);
    if (window.includes('spring festival')) return (month === 0 && day >= 10) || (month === 1 && day <= 20);
    if (window.includes(thisMonth)) return true;
    return day >= 15 && window.includes(nextMonth);
  });
}

/* ==========================================================================
   Triage file
   ========================================================================== */

function triageMarkdown({ stamp, registry, settings, results, weather, fixtures, skipped, newCount, totalCount }) {
  const lines = [];
  lines.push(`# News sweep, ${stamp}`);
  lines.push('');
  lines.push(`Run at ${shanghaiNow()} Shanghai time. ${totalCount} candidate${totalCount === 1 ? '' : 's'} within ${settings.lookbackDays ?? registry.defaults.lookbackDays} days, ${newCount} not seen before. Draft budget this run: ${settings.maxDraftsPerRun} (daily cap ${settings.dailyDraftLimit}).`);
  lines.push('');
  lines.push('Triage, three tests or the item is dropped: did something change, does it carry a date, would a visitor do anything differently. Then the verification chain for its fact type in `editorial/sources/source-tiers.md` before a word is written.');
  lines.push('');

  const ordered = [...results].sort((a, b) => {
    const pa = registry.sources.find((s) => s.id === a.id)?.priority ?? 99;
    const pb = registry.sources.find((s) => s.id === b.id)?.priority ?? 99;
    return pa - pb;
  });

  lines.push('## Candidates by source');
  lines.push('');
  for (const result of ordered) {
    const source = registry.sources.find((s) => s.id === result.id);
    const tier = source.tier === 'platform' ? 'platform' : `tier ${source.tier}`;
    lines.push(`### ${source.nameZh} (${source.nameEn}), ${tier}`);
    lines.push('');
    for (const listing of result.listings) {
      if (listing.skipped) lines.push(`* ${listing.label}: skipped, ${listing.skipped}`);
      else if (listing.status === 'error') lines.push(`* ${listing.label}: ${listing.error}`);
      else lines.push(`* ${listing.label}: HTTP ${listing.status}, ${listing.links} links, ${listing.matched} article links, ${listing.kept} kept`);
    }
    if (result.unreachable) lines.push(`* Declared reachable from China only. Unreachable from this machine; check by hand or from inside China.`);
    lines.push('');
    const fresh = result.candidates.filter((c) => c.status === 'new');
    const old = result.candidates.filter((c) => c.status !== 'new');
    if (!result.candidates.length) {
      lines.push('Nothing kept.');
      lines.push('');
      continue;
    }
    lines.push('| Date | Headline | Matched | Status | URL |');
    lines.push('|---|---|---|---|---|');
    for (const c of [...fresh, ...old].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))) {
      const status = c.isNew ? 'NEW' : c.status;
      const dup = c.duplicateOf ? ` (same headline as ${c.duplicateOf})` : '';
      lines.push(`| ${c.date ?? 'undated'} | ${c.title.replace(/\|/g, '/')} | ${c.matched ?? 'listing'} | ${status}${dup} | ${c.url} |`);
    }
    lines.push('');
  }

  lines.push('## Weather signal');
  lines.push('');
  if (!weather) lines.push('Weather source disabled.');
  for (const check of weather?.checks ?? []) {
    if (check.status === 'error') lines.push(`* ${check.label}: ${check.error}`);
    else if (!check.warnings.length) lines.push(`* ${check.label}: HTTP ${check.status}, no warning terms on the page`);
    else {
      lines.push(`* ${check.label}: HTTP ${check.status}, warning terms present. Read the page before drafting anything.`);
      for (const w of check.warnings) lines.push(`  * ${w.term}: ${w.snippet}`);
    }
  }
  lines.push('');

  lines.push('## Manual check');
  lines.push('');
  lines.push('Sources the crawler cannot read. Open each by hand when the week calls for it; a closure or a price never comes from these alone.');
  lines.push('');
  for (const { source, why } of skipped) {
    const urls = source.listings.map((l) => `${l.label} ${l.url}`).join('; ');
    lines.push(`* ${source.nameZh} (${source.nameEn}), ${why}${urls ? `: ${urls}` : ''}${source.notes ? `. ${source.notes}` : ''}`);
  }
  lines.push('');

  lines.push('## Fixtures in window');
  lines.push('');
  if (!fixtures.length) lines.push('None this fortnight.');
  for (const f of fixtures) lines.push(`* ${f.window}: ${f.item} (${f.itemEn}), ${f.priority}, source ${f.source}`);
  lines.push('');

  lines.push('## Standing watch');
  lines.push('');
  for (const w of registry.standingWatch) lines.push(`* ${w.item}: ${w.why}. Check ${w.cadence}.`);
  lines.push('');

  lines.push('## Do not publish');
  lines.push('');
  for (const d of registry.doNotPublish) lines.push(`* ${d.claim}: ${d.finding}`);
  lines.push('');
  return lines.join('\n');
}

/* ==========================================================================
   Main
   ========================================================================== */

async function main() {
  const started = Date.now();
  const now = new Date();
  const stamp = today();
  const registry = validateRegistry(readJson(FILES.sources));
  const settings = readJson(FILES.settings);
  const seen = existsSync(FILES.seen) ? readJson(FILES.seen) : { items: {} };
  const runs = existsSync(FILES.runs) ? readJson(FILES.runs) : { runs: [] };
  seen.items ??= {};
  runs.runs ??= [];

  const record = { kind: 'sweep', started: now.toISOString(), outcome: 'running' };
  const finish = (outcome, extra = {}) => {
    Object.assign(record, extra, { outcome, finished: new Date().toISOString(), durationMs: Date.now() - started });
    if (!DRY) {
      runs.runs.push(record);
      runs.runs = runs.runs.slice(-90);
      writeJson(FILES.runs, runs);
    }
  };

  if (!FORCE && settings.paused) {
    log('news sweep paused in editorial/news/settings.json; nothing fetched.');
    finish('skipped', { skipReason: 'paused' });
    return;
  }
  const lastSweep = [...runs.runs].reverse().find((r) => r.kind === 'sweep' && r.outcome === 'success');
  if (!FORCE && lastSweep && settings.minDaysBetweenSweeps > 0) {
    const elapsed = (Date.now() - Date.parse(lastSweep.started)) / 86_400_000;
    if (elapsed < settings.minDaysBetweenSweeps) {
      log(`last sweep ${elapsed.toFixed(1)} days ago, gate is ${settings.minDaysBetweenSweeps}; nothing fetched.`);
      finish('skipped', { skipReason: 'gate' });
      return;
    }
  }

  const results = [];
  const skipped = [];
  let weather = null;

  for (const source of [...registry.sources].sort((a, b) => a.priority - b.priority)) {
    if (ONLY && source.id !== ONLY) continue;
    if (source.kind === 'signal' && source.enabled) {
      log(`signal ${source.id}`);
      weather = await weatherSignal(source, registry);
      continue;
    }
    const gate = isCrawlable(source);
    if (!gate.crawl) {
      if (source.enabled) skipped.push({ source, why: gate.why });
      continue;
    }
    log(`sweep ${source.id} (${source.listings.length} listing${source.listings.length === 1 ? '' : 's'})`);
    const result = await sweepSource(source, registry, settings, seen, now);
    for (const error of result.errors) log(`  ${error}`);
    log(`  ${result.candidates.length} kept, ${result.candidates.filter((c) => c.isNew).length} new`);
    results.push(result);
  }

  // Ledger update: new candidates enter as `new`; known ones get their seen
  // count and score refreshed. Entries past 120 days that never became a
  // draft are pruned so the file stays readable.
  const lookback = settings.lookbackDays ?? registry.defaults.lookbackDays;
  let newCount = 0;
  let totalCount = 0;
  // Titles seen earlier in this same run, so the second URL of a story that a
  // site published twice (a section page and a front page copy) is marked a
  // duplicate now rather than on the next sweep.
  const titlesThisRun = new Map();
  for (const result of results) {
    for (const c of result.candidates) {
      totalCount += 1;
      if (!c.duplicateOf && titlesThisRun.has(c.title_hash) && titlesThisRun.get(c.title_hash) !== c.url) {
        c.duplicateOf = titlesThisRun.get(c.title_hash);
      }
      if (!titlesThisRun.has(c.title_hash)) titlesThisRun.set(c.title_hash, c.url);
      const existing = seen.items[c.key];
      const score = scoreCandidate({ date: c.date, tier: c.tier, seenCount: c.seenCount, lookbackDays: lookback, now });
      if (existing) {
        existing.seenCount = c.seenCount;
        existing.lastSeen = stamp;
        existing.score = score;
        if (!existing.date && c.date) existing.date = c.date;
      } else {
        newCount += 1;
        seen.items[c.key] = {
          url: c.url,
          title: c.title,
          title_hash: c.title_hash,
          source: c.source,
          tier: c.tier,
          date: c.date,
          matched: c.matched,
          firstSeen: stamp,
          lastSeen: stamp,
          seenCount: 1,
          score,
          status: c.duplicateOf ? 'skipped' : 'new',
          reason: c.duplicateOf ? `same headline as ${c.duplicateOf}` : null,
        };
      }
    }
  }
  for (const [key, item] of Object.entries(seen.items)) {
    const age = ageDays(item.firstSeen, now) ?? 0;
    if (age > 120 && !['drafted', 'published'].includes(item.status)) delete seen.items[key];
    else if (item.status === 'new' && item.date && ageDays(item.date, now) > lookback) {
      item.status = 'skipped';
      item.reason = `expired, older than ${lookback} days`;
    }
  }

  const fixtures = fixturesDue(registry.annualFixtures, now);
  const markdown = triageMarkdown({ stamp, registry, settings, results, weather, fixtures, skipped, newCount, totalCount });
  const json = {
    stamp,
    run: shanghaiNow(),
    settings,
    sources: results.map((r) => ({
      id: r.id,
      errors: r.errors,
      unreachable: r.unreachable,
      candidates: r.candidates.map((c) => ({
        key: c.key,
        url: c.url,
        title: c.title,
        date: c.date,
        matched: c.matched,
        tier: c.tier,
        status: seen.items[c.key]?.status ?? c.status,
        score: seen.items[c.key]?.score ?? null,
        duplicateOf: c.duplicateOf,
      })),
    })),
    weather,
    fixtures,
    manualCheck: skipped.map(({ source, why }) => ({ id: source.id, why })),
  };

  if (DRY) {
    console.log(markdown);
    log('[dry run] nothing written.');
    return;
  }
  mkdirSync(FILES.triage, { recursive: true });
  writeFileSync(path.join(FILES.triage, `${stamp}.md`), markdown, 'utf8');
  writeJson(path.join(FILES.triage, `${stamp}.json`), json);
  writeJson(FILES.seen, seen);

  const errors = results.flatMap((r) => r.errors.map((e) => `${r.id}: ${e}`));
  finish('success', {
    sourcesQueried: results.length,
    candidates: totalCount,
    newCandidates: newCount,
    unreachable: results.filter((r) => r.unreachable).map((r) => r.id),
    errors,
    triage: `editorial/news/triage/${stamp}.md`,
  });
  log(`triage written to editorial/news/triage/${stamp}.md (${totalCount} candidates, ${newCount} new, ${errors.length} source errors)`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
