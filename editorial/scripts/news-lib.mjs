// Shared, side effect free logic for the news layer.
//
// Everything here is pure: URL canonicalisation, hashing, date extraction,
// keyword filtering, link extraction, registry validation, slugs, the checks a
// draft has to pass. The sweep, the approve step and the publish step import
// from here so that the three cannot drift apart (a filter added in one place
// and forgotten in another is how BBChien's first version lost a week of
// items). Tested by news-lib.test.mjs with `npm run news:test`.

import { createHash } from 'node:crypto';
import { z } from 'zod';

/* ==========================================================================
   Registry validation
   ========================================================================== */

const listingSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  filter: z.enum(['none', 'core', 'all']).optional(),
  isSearch: z.boolean().optional(),
  renderedClientSide: z.boolean().optional(),
  format: z.enum(['html', 'rss']).optional(),
  note: z.string().optional(),
});

const sourceSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    nameZh: z.string().min(1),
    nameEn: z.string().min(1),
    tier: z.union([z.number().int().min(1).max(4), z.literal('platform')]),
    priority: z.number().int(),
    kind: z
      .enum(['signal', 'manual', 'wechat', 'blocklist', 'confirmation', 'trend', 'price-crosscheck'])
      .optional(),
    home: z.string().url().nullable().optional(),
    listings: z.array(listingSchema).default([]),
    articlePattern: z.string().nullable(),
    dateFromUrl: z
      .object({
        yearGroup: z.number().int().optional(),
        monthGroup: z.number().int().optional(),
        dayGroup: z.number().int().optional(),
        compactGroup: z.number().int().optional(),
        monthDayGroup: z.number().int().optional(),
        altYearGroup: z.number().int().optional(),
        altMonthGroup: z.number().int().optional(),
        altDayGroup: z.number().int().optional(),
      })
      .nullable()
      .optional(),
    reachableFrom: z.array(z.string()).default([]),
    enabled: z.boolean(),
    defaultFilter: z.enum(['none', 'core', 'all']).optional(),
    renderedClientSide: z.boolean().optional(),
    manualOnly: z.boolean().optional(),
    requiresBrowserHeaders: z.boolean().optional(),
    verificationRole: z.string().optional(),
    notes: z.string().optional(),
  })
  .passthrough()
  .superRefine((source, ctx) => {
    if (source.articlePattern) {
      try {
        new RegExp(source.articlePattern);
      } catch (error) {
        ctx.addIssue({ code: 'custom', message: `articlePattern is not a valid regex: ${error.message}` });
      }
    }
    const htmlListings = source.listings.some((listing) => listing.format !== 'rss');
    if (source.enabled && !source.kind && htmlListings && !source.articlePattern) {
      ctx.addIssue({ code: 'custom', message: 'a crawlable source with an HTML listing needs an articlePattern' });
    }
  });

export const registrySchema = z
  .object({
    version: z.string(),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    defaults: z.object({
      userAgent: z.string().min(10),
      requestDelayMs: z.number().int().min(0),
      timeoutMs: z.number().int().min(1000),
      lookbackDays: z.number().int().min(1),
      defaultFilter: z.enum(['none', 'core', 'all']),
    }),
    sources: z.array(sourceSchema).min(1),
    keywords: z.object({
      core: z.array(z.string().min(1)).min(1),
      villages: z.array(z.string().min(1)),
      topics: z.array(z.string().min(1)),
      excludeNoise: z.array(z.string().min(1)),
    }),
    verificationChains: z.record(z.string(), z.array(z.string())),
    annualFixtures: z.array(
      z.object({
        window: z.string(),
        item: z.string(),
        itemEn: z.string(),
        source: z.string(),
        priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
      }),
    ),
    standingWatch: z.array(z.object({ item: z.string(), why: z.string(), cadence: z.string() })),
    doNotPublish: z.array(z.object({ claim: z.string(), finding: z.string() })),
  })
  .passthrough()
  .superRefine((registry, ctx) => {
    const ids = new Set();
    for (const source of registry.sources) {
      if (ids.has(source.id)) ctx.addIssue({ code: 'custom', message: `duplicate source id ${source.id}` });
      ids.add(source.id);
    }
    for (const [chain, steps] of Object.entries(registry.verificationChains)) {
      for (const step of steps) {
        if (step.startsWith('phone:') || step.startsWith('note:')) continue;
        for (const id of step.split('|')) {
          if (!ids.has(id)) {
            ctx.addIssue({ code: 'custom', message: `verificationChains.${chain} names unknown source ${id}` });
          }
        }
      }
    }
  });

/** Throws with every issue listed when the registry is malformed. */
export function validateRegistry(registry) {
  const result = registrySchema.safeParse(registry);
  if (result.success) return result.data;
  const lines = result.error.issues.map((issue) => `  ${issue.path.join('.') || '(root)'}: ${issue.message}`);
  throw new Error(`news/sources.json is invalid:\n${lines.join('\n')}`);
}

/* ==========================================================================
   URLs and hashes
   ========================================================================== */

const TRACKING_PARAMS = new Set([
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  'fbclid', 'gclid', 'spm', 'from', 'share_token', 'share_from', 'isappinstalled', 'wxshare',
]);

/**
 * One URL per article. Lower cased host without www, https where the site
 * answers it, tracking parameters dropped, the rest sorted, no fragment, no
 * trailing slash. Returns the input untouched when it does not parse: a
 * duplicate is a smaller failure than a crash mid sweep.
 */
export function canonicalUrl(input) {
  let url;
  try {
    url = new URL(input);
  } catch {
    return input;
  }
  url.hash = '';
  url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
  const kept = [...url.searchParams.entries()].filter(([key]) => !TRACKING_PARAMS.has(key.toLowerCase()));
  kept.sort(([a], [b]) => a.localeCompare(b));
  url.search = '';
  for (const [key, value] of kept) url.searchParams.append(key, value);
  let out = url.toString();
  if (url.pathname !== '/' && url.pathname.endsWith('/') && !url.search) out = out.replace(/\/$/, '');
  return out;
}

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

export const urlHash = (input) => sha256(canonicalUrl(input));

/**
 * A hash that converges for two headlines about the same event.
 *
 * Chinese headlines have no word boundaries, so the tokens are the characters
 * themselves: punctuation, ASCII noise and a short stop list are dropped, the
 * remaining CJK characters and digits are sorted and hashed. 莫干山门票明年涨价
 * and 明年莫干山门票将涨价 hash the same; two different stories do not.
 */
export function titleHash(title) {
  const chars = normaliseTitle(title).split('').sort().join('');
  return sha256(chars);
}

const TITLE_STOP = new Set(['的', '了', '在', '与', '和', '及', '将', '是', '为', '这', '那', '把', '被', '让', '也', '都', '就', '又']);

export function normaliseTitle(title) {
  return [...String(title)]
    .filter((char) => /[\p{Script=Han}\p{N}\p{Script=Latin}]/u.test(char))
    .map((char) => char.toLowerCase())
    .filter((char) => !TITLE_STOP.has(char))
    .join('');
}

/* ==========================================================================
   Dates from URLs
   ========================================================================== */

/** ISO date (YYYY-MM-DD) from the regex groups the registry names, or null. */
export function dateFromUrl(url, pattern, spec) {
  if (!pattern || !spec) return null;
  const match = new RegExp(pattern).exec(url);
  if (!match) return null;
  const pick = (index) => (index ? match[index] : undefined);

  if (spec.compactGroup) {
    const compact = pick(spec.compactGroup);
    if (compact && /^\d{8}$/.test(compact)) return validIso(compact.slice(0, 4), compact.slice(4, 6), compact.slice(6, 8));
    return null;
  }
  let year = pick(spec.yearGroup);
  let month = pick(spec.monthGroup);
  let day = pick(spec.dayGroup);
  if (spec.monthDayGroup) {
    // People's Daily writes /n2/2026/0907/: the year on its own, month and day run together.
    const monthDay = pick(spec.monthDayGroup);
    if (!monthDay || !/^\d{4}$/.test(monthDay)) return null;
    month = monthDay.slice(0, 2);
    day = monthDay.slice(2, 4);
  }
  if (!year && spec.altYearGroup) {
    year = pick(spec.altYearGroup);
    month = pick(spec.altMonthGroup);
    day = pick(spec.altDayGroup);
  }
  if (!year || !month || !day) return null;
  return validIso(year, month, day);
}

function validIso(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  if (y < 2000 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) return null;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCMonth() !== m - 1) return null;
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/** Whole days between an ISO date and now (or a given now). */
export function ageDays(iso, now = new Date()) {
  const then = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(then)) return null;
  return Math.floor((now.getTime() - then) / 86_400_000);
}

/* ==========================================================================
   Keyword filter
   ========================================================================== */

/**
 * Decide whether a headline passes a listing's filter.
 *
 * Returns { keep, matched, noise }. Noise is checked first because 莫干山路
 * contains 莫干山: the Shanghai gallery street would otherwise pass the core
 * filter on every sweep, which is exactly the confusion the whole site exists
 * to correct.
 */
export function matchTitle(title, filter, keywords) {
  // Case insensitive so that "Moganshan", "MOGANSHAN" and "moganshan" in an
  // English headline all count. Chinese terms are unaffected by lowercasing.
  const text = String(title).toLowerCase();
  const has = (term) => text.includes(term.toLowerCase());
  const noise = keywords.excludeNoise.find(has);
  if (noise) return { keep: false, matched: null, noise };
  if (filter === 'none') return { keep: true, matched: null, noise: null };

  const core = keywords.core.find(has);
  if (core) return { keep: true, matched: core, noise: null };
  if (filter === 'core') return { keep: false, matched: null, noise: null };

  const other = [...keywords.villages, ...keywords.topics].find(has);
  return other ? { keep: true, matched: other, noise: null } : { keep: false, matched: null, noise: null };
}

/** The effective filter for a listing: listing, then source, then registry. */
export function effectiveFilter(listing, source, defaults) {
  if (listing.isSearch) return 'none';
  return listing.filter ?? source.defaultFilter ?? defaults.defaultFilter;
}

/* ==========================================================================
   HTML
   ========================================================================== */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };

export function decodeEntities(text) {
  return String(text).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code) => {
    if (code[0] === '#') {
      const num = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(num) ? whole : String.fromCodePoint(num);
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

/**
 * The items of an RSS 2.0 feed, without an XML parser: title, link, date as
 * ISO, and the publisher when the feed names one. Written for the two search
 * feeds the registry uses (Google News and Bing News) and for plain site
 * feeds; Atom is not handled, none of the registered sources use it.
 *
 * Google News puts the publisher at the end of the title after " - " and in a
 * <source> element; Bing puts it in <News:Source> and hides the real article
 * URL inside a click tracker. Both are undone here so that the candidate
 * carries the publisher's name and, for Bing, the publisher's URL.
 */
export function parseRssItems(xml) {
  const text = String(xml);
  if (!/<rss[\s>]|<channel[\s>]/i.test(text.slice(0, 4000))) return [];
  const field = (block, tag) => {
    const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i').exec(block);
    if (!m) return '';
    return decodeEntities(m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, '$1')).trim();
  };
  const items = [];
  for (const [, block] of text.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    let title = field(block, 'title');
    let link = unwrapRedirect(field(block, 'link') || field(block, 'guid'));
    let source = field(block, 'source') || field(block, 'News:Source') || '';
    if (!source) {
      const split = title.lastIndexOf(' - ');
      if (split > 0 && title.length - split <= 40) source = title.slice(split + 3).trim();
    }
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3)).trim();
    const when = field(block, 'pubDate') || field(block, 'dc:date');
    const parsed = when ? new Date(when) : null;
    const date = parsed && !Number.isNaN(parsed.getTime()) ? parsed.toISOString().slice(0, 10) : null;
    if (!title || !link) continue;
    items.push({ title, link, date, source });
  }
  return items;
}

/** Bing's click tracker carries the real URL in its query string. Google's does not. */
export function unwrapRedirect(url) {
  try {
    const u = new URL(url);
    if (/bing\.com$/i.test(u.hostname) && u.searchParams.get('url')) return u.searchParams.get('url');
  } catch {
    /* not a URL, return as given */
  }
  return url;
}

export function stripTags(html) {
  return decodeEntities(String(html).replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Every anchor on a listing page as { href, title }, hrefs made absolute
 * against the page URL. The title is the anchor text, or its title attribute
 * when the text is empty or is an image. Nothing DOM shaped: a regex over the
 * markup is enough for link lists, and the registry's article patterns do the
 * real selection on the href.
 */
export function extractLinks(html, baseUrl) {
  const out = [];
  const anchor = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = anchor.exec(html))) {
    const attrs = match[1];
    const hrefMatch = /href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(attrs);
    if (!hrefMatch) continue;
    const raw = decodeEntities(hrefMatch[1] ?? hrefMatch[2] ?? hrefMatch[3] ?? '').trim();
    if (!raw || raw.startsWith('javascript:') || raw.startsWith('#')) continue;
    let href;
    try {
      href = new URL(raw, baseUrl).toString();
    } catch {
      continue;
    }
    let title = stripTags(match[2]);
    if (!title) {
      const titleAttr = /title\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(attrs);
      title = titleAttr ? decodeEntities(titleAttr[1] ?? titleAttr[2] ?? '').trim() : '';
    }
    out.push({ href, title });
  }
  return out;
}

/** The charset a page declares, from the header first, then the markup. */
export function detectCharset(contentType, headBytes) {
  const fromHeader = /charset=["']?([\w-]+)/i.exec(contentType ?? '');
  if (fromHeader) return normaliseCharset(fromHeader[1]);
  const head = Buffer.from(headBytes).toString('latin1');
  const fromMeta = /<meta[^>]+charset=["']?([\w-]+)/i.exec(head);
  return fromMeta ? normaliseCharset(fromMeta[1]) : 'utf-8';
}

function normaliseCharset(label) {
  const lower = label.toLowerCase();
  if (lower === 'gb2312' || lower === 'gbk' || lower === 'gb18030') return 'gb18030';
  if (lower === 'utf8') return 'utf-8';
  return lower;
}

/* ==========================================================================
   Scoring and slugs
   ========================================================================== */

const TIER_WEIGHT = { 1: 300, 2: 200, 3: 100, 4: 40, platform: 0 };

/**
 * freshness (up to 300, fading over the lookback) + tier weight + a bonus for
 * being seen more than once. Frozen at collection like BBChien's, so the sweep
 * also expires anything past the lookback rather than letting a stale high
 * score sit at the head of the queue.
 */
export function scoreCandidate({ date, tier, seenCount = 1, lookbackDays = 8, now = new Date() }) {
  const age = date ? ageDays(date, now) : null;
  const freshness = age === null ? 60 : Math.max(0, Math.round(300 * (1 - age / (lookbackDays * 1.5))));
  const reprise = Math.min(seenCount - 1, 5) * 40;
  return freshness + (TIER_WEIGHT[tier] ?? 0) + reprise;
}

/** Kebab case, ASCII only, at most eight words. */
export function slugify(text) {
  const words = String(text)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 8);
  return words.join('-') || 'news';
}

/* ==========================================================================
   Draft checks
   ========================================================================== */

export const NEWS_TOPICS = [
  'tickets', 'transport', 'openings', 'entry-rules', 'events', 'weather', 'stays', 'policy', 'business',
];

export const AUTHOR_IDS = ['cyril-drouin', 'liyan-ye', 'echo-peng'];

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD');

export const sourceRefSchema = z.object({
  name: z.string().min(1),
  name_en: z.string().min(1),
  url: z.string().url(),
  date: isoDate,
  tier: z.enum(['1', '2', '3', '4', 'own']),
});

/**
 * The frontmatter a news file has to carry. Mirrors the `news` collection in
 * src/content.config.ts field for field; the site build is the second check,
 * this is the one that runs before anything is moved.
 */
export const draftFrontmatterSchema = z
  .object({
    title: z.string().min(10).max(120),
    seo_title: z.string().max(60).optional(),
    meta_description: z.string().min(40).max(160),
    standfirst: z.string().min(40).max(320),
    kind: z.enum(['item', 'breaking', 'dispatch']),
    week: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    topics: z.array(z.enum(NEWS_TOPICS)).min(1).max(4),
    author: z.enum(AUTHOR_IDS),
    published: isoDate.optional(),
    last_updated: isoDate.optional(),
    event_date: isoDate.optional(),
    consequence: z.string().min(20).max(400),
    sources: z.array(sourceRefSchema).min(1),
    affects_pages: z.array(z.string().startsWith('/')).default([]),
    corrections: z.array(z.object({ date: isoDate, text: z.string().min(5) })).default([]),
    image: z.string().startsWith('/images/').optional(),
    image_alt: z.string().min(8).optional(),
    origin: z
      .object({ source_id: z.string(), url: z.string().url(), title_zh: z.string().optional(), url_hash: z.string().optional() })
      .optional(),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    rejection_reason: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === 'dispatch' && !data.week) ctx.addIssue({ code: 'custom', path: ['week'], message: 'a dispatch needs its week, e.g. 2026-38' });
    if (data.kind !== 'dispatch' && !data.event_date) ctx.addIssue({ code: 'custom', path: ['event_date'], message: 'an item needs the date of the thing that changed' });
    if ((data.image && !data.image_alt) || (!data.image && data.image_alt)) {
      ctx.addIssue({ code: 'custom', path: ['image'], message: 'image and image_alt travel together' });
    }
    if (!data.consequence.toLowerCase().includes('visitor') && !data.consequence.toLowerCase().includes('you')) {
      ctx.addIssue({ code: 'custom', path: ['consequence'], message: 'the consequence line has to be written to the visitor' });
    }
  });

/**
 * Split a markdown file into its YAML frontmatter (parsed) and body.
 * `parseYaml` is injected so this module stays dependency free for the tests.
 */
export function splitFrontmatter(text, parseYaml) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) throw new Error('no frontmatter block');
  return { data: parseYaml(match[1]), body: text.slice(match[0].length), raw: match[1] };
}

/**
 * The body rules that the schema cannot see. Each failure is a sentence a
 * person can act on. An empty array is a pass.
 */
export function bodyProblems(body, { kind = 'item' } = {}) {
  const problems = [];
  const text = String(body);
  const words = text.split(/\s+/).filter(Boolean).length;

  if (/—|–/.test(text)) problems.push('contains an em dash or an en dash; the house rule is none, anywhere');
  if (/\s-\s/.test(text)) problems.push('contains a hyphen used as punctuation between spaces');
  if (/!/.test(text.replace(/!\[[^\]]*\]\([^)]*\)/g, ''))) problems.push('contains an exclamation mark');
  if (/\]\(\/go\//.test(text) || /\/go\//.test(text)) problems.push('contains a /go/ affiliate link; news never carries one');
  if (/^#\s/m.test(text)) problems.push('contains a level one heading; the layout owns the h1');
  if (/\$\s?\d/.test(text) || /\bUSD\b/.test(text)) problems.push('contains a dollar figure; RMB only');
  if (/^\s*Checked \d/m.test(text)) problems.push('contains a typed "Checked" line; the layout generates it');

  const bounds = kind === 'dispatch' ? [350, 1100] : [120, 700];
  if (words < bounds[0]) problems.push(`body is ${words} words, under the ${bounds[0]} word floor for a ${kind}`);
  if (words > bounds[1]) problems.push(`body is ${words} words, over the ${bounds[1]} word ceiling for a ${kind}`);

  if (kind === 'dispatch') {
    const consequences = (text.match(/\*\*What this means for a visitor:\*\*/g) ?? []).length;
    const headings = (text.match(/^##\s/gm) ?? []).length;
    if (headings && consequences < headings) {
      problems.push(`dispatch has ${headings} items but ${consequences} consequence lines; every item needs one`);
    }
  }
  return problems;
}

/** The permalink a published news file gets, from its frontmatter. */
export function newsPath(data, slug) {
  if (data.kind === 'dispatch') return `/journal/news/dispatch/${data.week}`;
  const [year, month] = String(data.published).split('-');
  return `/journal/news/${year}/${month}/${slug}`;
}

/** Filename in src/content/news for a draft: date prefixed, kebab slug. */
export function newsFilename(data, slug) {
  return `${data.published}-${slug}.md`;
}
