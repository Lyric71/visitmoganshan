#!/usr/bin/env node
/**
 * Generates the per slot brief files and schedule.csv from Part 6 and Part 7
 * of the master plan, content-drafts/moganshan-build-spec_1.md. Idempotent:
 * rerun it after editing the master document. Existing status, dates and
 * notes in schedule.csv are kept per brief_id; everything else is regenerated.
 *
 *   node editorial/scripts/build-briefs.mjs [--master <path>] [--dry]
 *
 * Output:
 *   editorial/briefs/YYYY-MM-DD-<slug>.md   one file per core slot, 122 of them
 *   editorial/briefs/templates/dispatch.md  the Thursday dispatch template
 *   editorial/schedule.csv                  122 core rows plus 52 dispatch rows
 *
 * The calendar is arithmetic: slot n publishes on 14 September 2026 plus
 * 3 x (n - 1) days. The day and month printed in the master are checked
 * against that and any mismatch is reported, not silently accepted.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? def : args[i + 1];
};
const DRY = args.includes('--dry');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const MASTER = path.resolve(ROOT, flag('master', 'content-drafts/moganshan-build-spec_1.md'));
const ED = path.join(ROOT, 'editorial');
const BRIEFS = path.join(ED, 'briefs');
const TEMPLATES = path.join(BRIEFS, 'templates');
const SCHEDULE = path.join(ED, 'schedule.csv');

if (!existsSync(MASTER)) {
  console.error(`master plan not found: ${MASTER}`);
  process.exit(2);
}
const md = readFileSync(MASTER, 'utf8').replace(/\r\n/g, '\n');
const lines = md.split('\n');

/* ---------- helpers ---------- */

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Local date formatter. toISOString() would shift a local midnight to the
// previous UTC day on a UTC+8 machine.
const fmt = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (d, n) => new Date(d.getTime() + n * 86400000);
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ISO week, as "YYYY-WW", which is how the dispatch URLs are keyed.
function isoWeek(d) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-${String(week).padStart(2, '0')}`;
}

const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const write = (file, content) => {
  if (DRY) {
    console.log(`[dry] ${path.relative(ROOT, file)}`);
    return;
  }
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
};

function parseCsv(text) {
  const out = [];
  let row = [];
  let cell = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') {
      row.push(cell);
      cell = '';
    } else if (c === '\n') {
      row.push(cell);
      out.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell.length || row.length) {
    row.push(cell);
    out.push(row);
  }
  return out.filter((r) => r.length > 1);
}

/* ---------- the editorial tables (Part 5 of the master, restated here) ---------- */

const PILLARS = {
  P1: 'Access and practicals',
  P2: 'Villages and stays',
  P3: 'Trails and outdoors',
  P4: 'Food, tea and coffee',
  P5: 'History and culture',
  P6: 'Seasons and timing',
  P7: 'Trip design and comparisons',
  P8: 'Around Deqing',
  P9: 'News and dispatches',
};

// Where each pillar lives in the URL tree. The site routes by frontmatter
// `url`, so an editor can move a page by editing one line; this is only the
// default. Section names match src/lib/guide.ts SECTIONS.
const SECTION = {
  P1: '/plan',
  P2: '/where-to-stay',
  P3: '/things-to-do',
  P4: '/things-to-do',
  P5: '/journal',
  P6: '/seasons',
  P7: '/itineraries',
  P8: '/moganshan',
  P9: '/journal',
};

// Who signs which pillar, from the bios in src/data/authors.ts: Cyril writes
// planning, transport and history; Liyan the mountain itself; Echo the stays,
// itineraries and comparisons. One table, so a reassignment is one edit.
const AUTHOR = {
  P1: 'cyril-drouin',
  P2: 'echo-peng',
  P3: 'liyan-ye',
  P4: 'liyan-ye',
  P5: 'cyril-drouin',
  P6: 'liyan-ye',
  P7: 'echo-peng',
  P8: 'liyan-ye',
  P9: 'cyril-drouin',
};

// Freshness tier defaults by pillar (Part 2.5). Holiday and diary pieces are
// volatile whatever the pillar says.
const TIER = {
  P1: 'volatile',
  P2: 'semi-stable',
  P3: 'semi-stable',
  P4: 'semi-stable',
  P5: 'evergreen',
  P6: 'semi-stable',
  P7: 'semi-stable',
  P8: 'semi-stable',
  P9: 'evergreen',
};
const VOLATILE_SLOTS = new Set([4, 31, 72, 84, 90, 99, 100, 103]);

// The five templates and components of Part 5.4, by slot.
const VILLAGE_SLOTS = new Set([5, 8, 12, 21, 29, 39, 46, 93, 109]);
const TRAIL_SLOTS = new Set([10, 14, 28, 40, 52, 56, 96, 102]);
const COMPARISON_SLOTS = new Set([18, 32, 43, 55, 76, 97, 107, 116]);
const PRICE_TABLE_SLOTS = new Set([3]);
const CROWD_CALENDAR_SLOTS = new Set([4, 31, 72, 90, 100]);

// Part 5.9 wanted six pieces walked and Part 8 wanted four pieces phoned.
// This pipeline is fully automated (Cyril, 6 September 2026): nobody walks,
// nobody calls. These slots are desk written from published sources, say so,
// and never claim otherwise. The sets only switch the brief's wording.
const DESK_ONLY_SLOTS = new Set([2, 10, 11, 13, 28, 34]);
const NO_CALL_SLOTS = new Set([3, 13, 22, 27]);

// Part 5.7, affiliate placement by pillar.
const AFFILIATE_RULE = {
  P1: 'Ticket and train modules only where the piece is transactional. Never on payments or eSIM pieces.',
  P2: 'Village storefront plus property deep links. Highest density.',
  P3: 'None, except a soft stay link at the foot where the trail implies an overnight.',
  P4: 'None. Nothing to sell and a button would cheapen the section.',
  P5: 'None.',
  P6: 'Stay storefront at the foot; ticket module on gate and night programme pieces.',
  P7: 'Highest revenue density. Inline deep links in booking order plus an end of page recap module.',
  P8: 'Train and stay links on the itinerary extension pieces.',
  P9: 'None inline. Disclosure line only.',
};

const TEMPLATE_SPEC = {
  village: `Village template (Part 5.4). Sections in this order: what it is and where;
the free things; food; stays, with a curated shortlist that shows judgment;
the walk; who should base here; the honest downside. The shortlist links
property pages where they exist and the village storefront slug for the long
tail. Emits Place schema.`,
  trail: `Trail template (Part 5.4). Route stage by stage; a fact strip with distance,
elevation gain, surface, and honest timing for a fit and an unfit walker;
what to carry; when not to go; an embedded map and a downloadable GPX; an
elevation profile. Emits HowTo and Place schema. Where the GPX pipeline does
not exist yet, leave a marked TODO for the map and the file and publish the
prose; the fact strip still has to carry real numbers with sources.`,
  comparison: `Comparison template (Part 5.4). Why the confusion exists; a side by side
table; getting to each; cost of each; who should choose which; doing both.
The table is the first screen.`,
};

/* ---------- parse Part 6 ---------- */

const p6 = lines.findIndex((l) => /^## Part 6:/.test(l));
const p7 = lines.findIndex((l) => /^## Part 7:/.test(l));
if (p6 === -1 || p7 === -1) {
  console.error('Part 6 or Part 7 heading not found in the master plan.');
  process.exit(2);
}

const HEAD = /^\*\*(\d+) · (\d+) (\w{3}) · (P\d) ([^*]+)\*\* · (.+?)\s*$/;
const META = /^`([^`]+)`\s*·\s*([\d,]+)w\s*·\s*(.+?)\s*$/;
const START = new Date('2026-09-14T00:00:00');
const slots = [];
const warnings = [];

for (let i = p6; i < p7; i++) {
  const h = lines[i].match(HEAD);
  if (!h) continue;
  const n = Number(h[1]);
  const title = h[6].trim();
  const meta = lines[i + 1].match(META);
  if (!meta) {
    warnings.push(`slot ${n}: keyword line not parsed: ${lines[i + 1]}`);
    continue;
  }
  const keywords = meta[1].split('/').map((s) => s.trim()).filter(Boolean);
  const words = Number(meta[2].replace(/,/g, ''));
  let affiliate = meta[3].trim().replace(/`/g, '');
  let cnSources = (lines[i + 2].match(/^CN sources:\s*(.*)$/) || [, ''])[1].trim();
  // Slot 14 in the master has its Chinese sources in the affiliate cell and
  // "none" in the sources line. Chinese characters cannot be a /go/ slug.
  if (/[㐀-鿿]/.test(affiliate)) {
    warnings.push(`slot ${n}: affiliate cell held Chinese sources, moved to CN sources`);
    cnSources = cnSources && cnSources !== 'none' ? `${affiliate}; ${cnSources}` : affiliate;
    affiliate = 'no affiliate';
  }
  const note = (lines[i + 3].match(/^>\s*(.*)$/) || [, ''])[1].trim();

  const date = addDays(START, 3 * (n - 1));
  const printed = `${Number(h[2])} ${h[3]}`;
  const computed = `${date.getDate()} ${MONTHS[date.getMonth()]}`;
  if (printed !== computed) warnings.push(`slot ${n}: master says ${printed}, calendar says ${computed}`);

  slots.push({ n, date, pillar: h[4], pillarShort: h[5].trim(), title, keywords, words, affiliate, cnSources, note });
}

if (slots.length !== 122) warnings.push(`expected 122 slots, parsed ${slots.length}`);

/* ---------- derive url, slug, file names ---------- */

const usedUrls = new Map();

function urlFor(slot) {
  const { n, title, pillar } = slot;
  let slug;
  if (VILLAGE_SLOTS.has(n)) {
    slug = slugify(title.split(/[:,]/)[0].split(/\s+and\s+/)[0]);
    return `/moganshan/villages/${slug}`;
  }
  const head = title.includes(':') ? title.split(':')[0] : title;
  slug = slugify(head).replace(/^the-/, '');
  slug = slug.split('-').slice(0, 7).join('-');
  let url = `${SECTION[pillar]}/${slug}`;
  if (usedUrls.has(url)) url = `${url}-${n}`;
  return url;
}

const flatName = (url) => url.replace(/^\//, '').replace(/\//g, '-');

/* ---------- previous schedule (preserve state) ---------- */

const previous = {};
if (existsSync(SCHEDULE)) {
  const rows = parseCsv(readFileSync(SCHEDULE, 'utf8').replace(/\r\n/g, '\n'));
  const header = rows.shift();
  for (const r of rows) {
    const o = Object.fromEntries(header.map((h, i) => [h, r[i] ?? '']));
    previous[o.brief_id] = o;
  }
}

const HEADER = [
  'publish_date', 'weekday', 'slot', 'slot_job', 'brief_id', 'pillar', 'brief_file', 'output_file',
  'url', 'working_h1', 'primary_query', 'word_target', 'affiliate', 'author', 'freshness_tier',
  'content_type', 'status', 'drafted_on', 'reviewed_by', 'published_on', 'quality_passed_on',
  'image_generated_on', 'notes',
];
const schedule = [];

function pushRow(o) {
  const prev = previous[o.brief_id] || {};
  const row = {
    ...o,
    status: prev.status || o.status || 'not_started',
    drafted_on: prev.drafted_on || '',
    reviewed_by: prev.reviewed_by || '',
    published_on: prev.published_on || '',
    quality_passed_on: prev.quality_passed_on || '',
    image_generated_on: prev.image_generated_on || '',
    notes: prev.notes || o.notes || '',
  };
  schedule.push(HEADER.map((h) => row[h] ?? ''));
}

/* ---------- brief file ---------- */

function briefFile(slot, url, file, outputFile) {
  const { n, date, pillar, title, keywords, words, affiliate, cnSources, note } = slot;
  const id = String(n).padStart(3, '0');
  const author = AUTHOR[pillar];
  const tier = VOLATILE_SLOTS.has(n) || pillar === 'P1' ? 'volatile' : TIER[pillar];
  const template = VILLAGE_SLOTS.has(n)
    ? 'village'
    : TRAIL_SLOTS.has(n)
      ? 'trail'
      : COMPARISON_SLOTS.has(n)
        ? 'comparison'
        : 'article';
  const components = [];
  if (PRICE_TABLE_SLOTS.has(n)) components.push('price table');
  if (CROWD_CALENDAR_SLOTS.has(n)) components.push('crowd calendar');
  const diary = /DIARY ITEM/.test(note);
  const flagship = /FLAGSHIP|HIGHEST|PILLAR HUB|TOP COMPARISON/.test(note);

  const fm = [
    '---',
    `brief_id: ${id}`,
    `slot: ${n}`,
    `publish_date: ${fmt(date)}`,
    `pillar: ${pillar}`,
    `pillar_name: ${JSON.stringify(PILLARS[pillar])}`,
    `title: ${JSON.stringify(title)}`,
    `url: ${url}/`,
    `output_file: ${outputFile}`,
    `guide_file: src/content/guide/${flatName(url)}.md`,
    `primary_keyword: ${JSON.stringify(keywords[0] || '')}`,
    `secondary_keywords: ${JSON.stringify(keywords.slice(1))}`,
    `word_target: ${words}`,
    `affiliate: ${JSON.stringify(affiliate)}`,
    `author: ${author}`,
    `freshness_tier: ${tier}`,
    `template: ${template}`,
    components.length ? `components: ${JSON.stringify(components)}` : null,
    DESK_ONLY_SLOTS.has(n) ? 'desk_written: true' : null,
    NO_CALL_SLOTS.has(n) ? 'no_calls: true' : null,
    diary ? 'diary_item: true' : null,
    'status: not_started',
    '---',
  ]
    .filter(Boolean)
    .join('\n');

  const fieldworkBlock = DESK_ONLY_SLOTS.has(n)
    ? `
## Desk written, and the piece says so

Part 5.9 of the master plan wanted this piece walked or visited. This
pipeline is fully automated and nobody walks anything, so it is written from
published sources: distances, gains, surfaces and timings from the Chinese
trail guides and official channels, each sourced and dated in the text.
Never claim a route was walked, timed or photographed by us. Never write a
fieldwork line. Where published sources give different timings, print both.
Where a fact exists only on the ground (a kennel still open, a cafe still
trading), say what the most recent dated source says and when.
`
    : '';

  const phoneBlock = NO_CALL_SLOTS.has(n)
    ? `
## No calls are made

Part 8 of the master plan wanted this slot confirmed by phone${n === 3 ? ' (0572-8412345 for the tariff)' : n === 13 ? ' (20 to 30 properties on passport registration)' : n === 22 ? ' (winter closures)' : ' (whether the kennel service still runs)'}.
Nobody calls. Use the written tier 1 and tier 2 record instead: the county
portal, the scenic area's channel, dated local news, and for slot 13 the
published guest reviews and property listings that state a passport policy.
Where only a call would settle it, publish the disagreement between the
written sources, date each, and tell the reader the number to ring
themselves. Never fill the gap with a guess and never imply we rang.
`
    : '';

  const templateBlock =
    template !== 'article'
      ? `
## Template

${TEMPLATE_SPEC[template]}
`
      : '';

  const componentBlock = components.length
    ? `
## Components

${components
  .map((c) =>
    c === 'price table'
      ? `Price table (Part 5.4). Every row carries its own figure, its source, the source tier and the checked date. Where sources disagree the table shows the disagreement rather than resolving it silently. Until the component exists in the repo, a markdown table with those five columns is the fallback.`
      : `Crowd calendar (Part 5.4). Golden Week, Labour Day, Qingming, summer weekends, tour bus arrival windows. Reused across the holiday pieces. Until the component exists in the repo, a markdown table by date with an expected crowding level and a source is the fallback.`,
  )
  .join('\n\n')}
`
    : '';

  return `${fm}

# BRIEF ${id}: ${title}

Run with the house \`createarticle\` skill. Read \`../CLAUDE.md\` and \`../SPEC.md\`
first. They override any conflicting rule inside the skill.

## CreateArticle inputs

| Input | Value |
|---|---|
| website | https://www.visitmoganshan.com |
| audience | people out of China, planning or considering a Moganshan trip |
| brief | this file |

## Target

| Field | Value |
|---|---|
| Slot | ${n} of 122, publishes ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()} (${DOW[date.getDay()]}) |
| Pillar | ${pillar}, ${PILLARS[pillar]} |
| Working H1 | ${title} |
| URL | \`${url}/\` (default, move it by editing \`url\` in the draft) |
| Output file | \`${outputFile}\` |
| Published file | \`src/content/guide/${flatName(url)}.md\` |
| Primary keyword | \`${keywords[0] || ''}\` |
| Secondary keywords | ${keywords.slice(1).map((k) => `\`${k}\``).join(', ') || 'none'} |
| Body length | ${words.toLocaleString('en-GB')} words, body only, within 10 percent |
| Affiliate | ${affiliate === 'no affiliate' ? 'none' : `\`${affiliate}\`, resolved against the /go/ table per \`../CLAUDE.md\``} |
| Pillar affiliate rule | ${AFFILIATE_RULE[pillar]} |
| Author | \`${author}\` |
| Freshness tier | ${tier} |
| Template | ${template}${components.length ? `, with ${components.join(' and ')}` : ''} |
${flagship ? '| Weight | Flagship. Extra research time, and the run log says what was done with it. |\n' : ''}${diary ? '| Diary item | The source document publishes on a known date. Confirm it exists before drafting; if it has not appeared, set the row to `blocked` with the reason. |\n' : ''}
## The angle

> ${note}

## Chinese sources named in the calendar

${cnSources && cnSources !== 'none' ? cnSources : 'None named. Research in Chinese from the tiers in `../sources/source-tiers.md`.'}

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.
${fieldworkBlock}${phoneBlock}${templateBlock}${componentBlock}
## Shell

Breadcrumb and section eyebrow, H1, standfirst, byline, read time, numbered
"On this page", a geographic orientation paragraph with the M50 disambiguation
where a reader could confuse the two, the body, inline source lines, the
generated "Last checked" line, the standing photo note, sibling cards. The
layout renders everything outside the body; the draft supplies the body and
the frontmatter.

## Imagery

One lead image (16:9 slot, generated at 3:2 and cropped by the layout) plus
at least three captioned body figures at natural section breaks. No
recognisable faces. No caption or alt that asserts the frame is a named
place. Captions carry information the prose does not.

Every image is a real life candid photograph, never AI perfect: handheld
feel, uneven or mixed light, weather, a cropped edge, blur, clutter, the
defects a real photograph has, written into every prompt. Studio polish, a
symmetrical composition, flawless surfaces or a cinematic grade fail the
bar and the image is regenerated.

## Definition of done

* [ ] Research note written before drafting, Chinese sources first, tiers applied
* [ ] Every cited source passed check 1 and check 2, both dates in the ledger
* [ ] British spelling, Chinese characters inline on first use, RMB, 24 hour clock, day month year dates
* [ ] Zero em dashes, zero hyphens used as punctuation
* [ ] Corrective framing where a wrong assumption exists; numbers as the spine; disagreement published, not resolved
* [ ] No rankings, no ratings, no "we loved it", no unsourced "first in China"
* [ ] Frontmatter matches the guide schema, \`published\` and \`last_updated\` both \`${fmt(date)}\`
* [ ] \`word_count\` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in \`src/content/guide\` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] \`seo_title\` under 60 characters, \`meta_description\` under 155, \`excerpt\` under 40 words, all counted
* [ ] Saved as \`${outputFile}\`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to \`public/images/guide/\`
* [ ] \`schedule.csv\` row updated, \`logs/YYYY-MM-DD.md\` written
`;
}

/* ---------- build ---------- */

let briefCount = 0;
for (const slot of slots) {
  const url = urlFor(slot);
  usedUrls.set(url, slot.n);
  const slug = url.split('/').pop();
  const date = fmt(slot.date);
  const file = `briefs/${date}-${slug}.md`;
  const outputFile = `output/${slug}.md`;
  write(path.join(ED, file), briefFile(slot, url, file, outputFile));
  briefCount++;

  pushRow({
    publish_date: date,
    weekday: DOW[slot.date.getDay()],
    slot: String(slot.n).padStart(3, '0'),
    slot_job: 'core editorial',
    brief_id: String(slot.n).padStart(3, '0'),
    pillar: slot.pillar,
    brief_file: file,
    output_file: outputFile,
    url: `${url}/`,
    working_h1: slot.title,
    primary_query: slot.keywords[0] || '',
    word_target: slot.words,
    affiliate: slot.affiliate,
    author: AUTHOR[slot.pillar],
    freshness_tier: VOLATILE_SLOTS.has(slot.n) || slot.pillar === 'P1' ? 'volatile' : TIER[slot.pillar],
    content_type: VILLAGE_SLOTS.has(slot.n)
      ? 'Village'
      : TRAIL_SLOTS.has(slot.n)
        ? 'Trail'
        : COMPARISON_SLOTS.has(slot.n)
          ? 'Comparison'
          : 'Article',
    status: 'not_started',
    notes: /DIARY ITEM/.test(slot.note)
      ? 'Diary item: confirm the source document has appeared before drafting.'
      : DESK_ONLY_SLOTS.has(slot.n)
        ? 'Desk written from published sources; never claim it was walked.'
        : '',
  });
}

// Part 7: the weekly dispatch, every Thursday from 17 September 2026 to
// 9 September 2027. Drafted the evening before from the Wednesday sweep.
const firstThursday = new Date('2026-09-17T00:00:00');
for (let w = 0; w < 52; w++) {
  const d = addDays(firstThursday, w * 7);
  const week = isoWeek(d);
  pushRow({
    publish_date: fmt(d),
    weekday: 'Thu',
    slot: `D${week}`,
    slot_job: 'weekly dispatch',
    brief_id: `D${week}`,
    pillar: 'P9',
    brief_file: 'briefs/templates/dispatch.md',
    output_file: `output/dispatch-${week}.md`,
    url: `/journal/news/dispatch/${week}/`,
    working_h1: `Moganshan dispatch, week ${week.slice(5)}`,
    primary_query: 'moganshan news',
    word_target: 750,
    affiliate: 'no affiliate',
    author: 'cyril-drouin',
    freshness_tier: 'volatile',
    content_type: 'Dispatch',
    status: 'not_started',
    notes: 'Wednesday sweep per sources/source-tiers.md. A week with nothing material is still a dispatch.',
  });
}

schedule.sort((a, b) => a[0].localeCompare(b[0]) || a[2].localeCompare(b[2]));

write(
  path.join(TEMPLATES, 'dispatch.md'),
  `# Template: weekly dispatch

Source: Part 4 and Part 7 of \`content-drafts/moganshan-build-spec_1.md\`. Read
\`../../CLAUDE.md\` and \`../../SPEC.md\` first. Every Thursday, 52 a year, first
on 17 September 2026, last on 9 September 2027. 600 to 900 words, three to six
items, each with a mandatory visitor consequence line.

## The Wednesday sweep, in priority order

Work through \`../../sources/source-tiers.md\`, section "The weekly sweep".
Deqing News carries roughly 70 percent of any given week. Then Meadin for
hotel openings and signings, the county government portal for prices and
closures, Zhejiang Online Huzhou, Tide News, the town level weather page, and
Thepaper Zhejiang.

## Triage

Three tests or the item is dropped: did something change, does it carry a
date, would a visitor do anything differently.

## Output shape

\`\`\`markdown
# Moganshan dispatch, week NN

[Standfirst: one sentence naming the week's most consequential change, or
plainly saying nothing material changed.]

## [Item headline]

[Two to four sentences. What changed. When. What is now different.]

**What this means for a visitor:** [one sentence, always present]

> Source: 德清新闻网 (Deqing News), 17 September 2026, tier 1. https://...
\`\`\`

A week with nothing material is a legitimate dispatch: "Nothing changed on the
mountain this week that affects a trip. Here is what is still true." Publishing
that is a trust signal. Skipping the week is not.

## Quality

Every dispatch runs through \`/content-quality-us\` (18 passes, British
English override) before it can be \`image_ready\`, exactly like a core
piece. The publish step refuses a row with no \`quality_passed_on\`.

## Guardrails

* No affiliate link inside a dispatch. No \`/go/\` slug, anywhere in the file.
* No item without a consequence line.
* No item without a dated source with a tier.
* Corrections stay visible: amend the item, date the amendment, keep the
  original with a strikethrough. Never silently delete.
* When an item changes a fact on an evergreen page, list that page under
  \`affects_pages\` in the frontmatter, and the publish step edits the page,
  moves its \`last_updated\`, and notes the dispatch in the run log, in the
  same commit.

## Frontmatter for the output file

\`\`\`yaml
---
title: "Moganshan dispatch, week NN"
week: "YYYY-WW"
kind: weekly
author: cyril-drouin
published: YYYY-MM-DD
standfirst: "..."
affects_pages: []
items:
  - headline: "..."
    event_date: "YYYY-MM-DD"
    consequence: "..."
    source:
      name: "德清新闻网"
      name_en: "Deqing News"
      url: "https://..."
      date: "YYYY-MM-DD"
      tier: "1"
    topics: [tickets]
---
\`\`\`

## Where it publishes

Until the \`dispatches\` collection exists (Phase 1b of the master plan), the
publish step adds the dispatch as a new dated section at the top of
\`src/content/guide/journal-news.md\`, in that page's existing entry format,
adds a row to its summary table, and moves its \`last_updated\`. Once the
collection exists, the output file moves to
\`src/content/dispatches/YYYY-WW.md\` unchanged and \`journal-news.md\` is left
alone. \`../../CLAUDE.md\` says which applies today.
`,
);

const csv = [HEADER, ...schedule].map((r) => r.map(csvCell).join(',')).join('\n') + '\n';
write(SCHEDULE, csv);

console.log(
  `${briefCount} brief files, ${schedule.length} schedule rows (${slots.length} core, ${schedule.length - slots.length} dispatches), slot 1 on ${fmt(START)}, slot 122 on ${fmt(addDays(START, 363))}.`,
);
for (const w of warnings) console.log(`warning: ${w}`);
