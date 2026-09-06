# Visit Moganshan: Build and Editorial Implementation Spec

**Single-file implementation spec for Claude Code.**
Version 1.0 · 6 September 2026 · BeyondBorder Group Ltd
Site: `https://www.visitmoganshan.com/` · Stack: Astro, static, Vercel

---

## How to use this document

This file contains everything needed to implement the trust fixes, the news layer, the listings remediation and 52 weeks of editorial. Work top to bottom. Phases 0 and 1 are engineering and must ship before the first editorial slot on **14 September 2026**. Phase 2 onward is content production against the calendar in Part 6.

Every section ends with **acceptance criteria**. Do not mark a phase done until each line passes.

**This is the single authoritative implementation document.** Where it conflicts with any other document, it wins. It absorbs and replaces the earlier standalone editorial plan and news layer spec, both of which have been removed from the project to avoid ambiguity.

**Companion files in the project, reference only, not implementation:**

- `competitive-research.md` · why each decision was made, English SERP and Chinese-language findings
- `chinese-source-map.md` · every source with its verification tier. Open this every Wednesday for the news sweep.
- `content-briefs-q1.md` · long-form briefs for slots 1 to 30, expanding Part 8
- `editorial-calendar.csv` · machine-readable version of Part 6

**Prior specs this document assumes and does not contradict:** `site-reorganization-spec.html`, `property-pages-build-spec.md`, `affiliate-organization-playbook.html`, `moganshan-trip-affiliate-links.md`, `affiliate-program-comparison.md`. Part 5.7 adds nine new village storefront slugs to the `/go/` namespace those documents define.

---

## Part 0: Assumptions and conventions

**Verify these against the repo before writing code. If any is wrong, adapt and note the deviation.**

| Assumption | Expected |
|---|---|
| Framework | Astro, static output, no client framework |
| Content | Astro content collections under `src/content/` |
| Hosting | Vercel, `vercel.json` present, redirects configured there |
| Sitemap | `@astrojs/sitemap` or hand-rolled, currently emits no `lastmod` |
| Affiliate | `/go/*` redirect namespace, 302, disallowed in `robots.txt` |
| Data | `content/properties.json` as the single source of truth for properties |
| Fonts | Self-hosted Inter and Playfair Display |
| Analytics | Google Analytics, served outside mainland China only |

**Conventions that apply to every file this spec creates:**

- No em dashes anywhere, including code comments. Use commas, periods, parentheses, colons.
- British spelling in prose, Chinese characters inline on first use, RMB for prices, 24-hour clock, day-month-year dates.
- All dates in content frontmatter are ISO 8601 with the `+08:00` offset. All dates rendered to the reader are day-month-year.
- Sentence-case headings.

---

# PHASE 0: TRUST FOUNDATION

Nothing else on this plan works until this ships. The site currently has no author attribution anywhere, and every page carries the same build date. A likely AI content farm ranking against us has a byline and a credential claim, and we do not.

---

## Part 1: Authorship

### 1.1 The identity model

The site keeps `BeyondBorder Group Ltd` as **publisher**. Articles get a **human author**.

**Do not invent a person.** Every author record must correspond to a real human who did real work on the piece. On a site whose entire voice is "here is our source, here is what we do not know," a fabricated author invalidates the "Checked [date]" line and everything else. This is a hard rule, not a preference.

Create `src/content/authors/` as a content collection. Minimum one record, ideally two to three.

```ts
// src/content/config.ts  (add to existing collections)
import { defineCollection, z } from 'astro:content';

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    role: z.string(),                    // "Editor", "Field researcher", "Photographer"
    bio: z.string(),                     // 2 to 4 sentences, first person avoided
    credentials: z.array(z.string()),    // verifiable, specific
    languages: z.array(z.string()),
    basedIn: z.string(),
    sameAs: z.array(z.string().url()).default([]),  // LinkedIn, personal site
    image: z.string().optional(),
    firstVisitedMoganshan: z.string().optional(),   // year, if true
  }),
});
```

Example record. **Confirm the biographical details with the site owner before committing; do not infer them.**

```yaml
# src/content/authors/cyril-drouin.yaml
name: Cyril Drouin
slug: cyril-drouin
role: Editor
bio: >
  Cyril has lived and worked in China for around two decades and is based in
  Shanghai, three hours from Moganshan. He reads the Chinese-language record
  the guide is built on, and teaches at HEC Paris and Shanghai Jiao Tong
  University.
credentials:
  - Around 20 years working in China
  - Based in Shanghai
  - Reads and works in Chinese
  - Teaches at HEC Paris and Shanghai Jiao Tong University
languages: [English, French, Chinese]
basedIn: Shanghai, China
sameAs: []
```

### 1.2 Author pages

Route: `/about/authors/[slug]`

Contains: name, role, portrait, bio, credentials list, languages, based in, and a reverse-chronological list of every piece by that author with its published and last-checked dates.

Also build `/about/team`, a masthead listing every author with role and a one-line description, linked from the footer and from `/about`.

### 1.3 Schema

Every editorial page's JSON-LD changes from organisation-authored to person-authored. Publisher stays as the organisation.

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {
    "@type": "Person",
    "name": "Cyril Drouin",
    "url": "https://www.visitmoganshan.com/about/authors/cyril-drouin",
    "sameAs": []
  },
  "publisher": {
    "@type": "Organization",
    "name": "BeyondBorder Group Ltd",
    "address": {"@type": "PostalAddress", "addressCountry": "HK"}
  },
  "datePublished": "2026-09-14T09:00:00+08:00",
  "dateModified": "2026-09-14T09:00:00+08:00"
}
```

Author pages themselves emit `ProfilePage` wrapping a `Person` with `knowsAbout`, `knowsLanguage` and `worksFor`.

### 1.4 The visible dateline

New component, `src/components/Dateline.astro`, rendered directly under the standfirst on every editorial page.

```
By Cyril Drouin
Published 14 September 2026 · Last checked 14 September 2026
```

Where a piece involved field work, the component takes an optional `fieldwork` prop and renders a third line:

```
Walked and timed on the ground, 14 October 2026
```

That line is the thing no competitor can copy. Use it only when it is true.

Where a second person verified the facts, render `Reviewed by [name]` with a link to their author page and emit a `reviewedBy` property in the JSON-LD.

### 1.5 The methodology page

New page: `/about/how-we-report`. Linked from every dateline (the byline links to the author, the "Last checked" links here) and from the footer.

Content, in the site's existing register:

1. **Where the facts come from.** Named Chinese sources by tier, and the rule that prices, closures and policy come from the county government portal, the scenic area, or the ticket line on 0572-8412345, never an OTA.
2. **What we check and how often.** The freshness tiers from Part 2.5, stated publicly.
3. **Why there are no ratings.** Existing site policy, restated in one place.
4. **How we handle disagreement.** Where sources conflict, we publish the conflict.
5. **Corrections.** How to report one, and the promise that corrections are dated and left visible.
6. **Affiliate disclosure.** Link to `/plan/disclosure`.

**Open decision for the site owner, flag it and do not decide unilaterally:** whether this page discloses AI-assisted drafting. Google does not require it. The site's own voice arguably does. Leave a clearly marked `TODO` in the page source until answered.

### Acceptance criteria, Part 1

- [ ] `src/content/authors/` exists with at least one real, owner-confirmed record
- [ ] `/about/authors/[slug]` renders with `ProfilePage` and `Person` schema
- [ ] `/about/team` renders and is linked from the footer and `/about`
- [ ] Every editorial page's JSON-LD `author` is a `Person` with a `url`, publisher unchanged
- [ ] `Dateline.astro` renders on every editorial page, with optional fieldwork and reviewer lines
- [ ] `/about/how-we-report` is live and linked from every dateline
- [ ] Zero fabricated author records. Verify by asking, not by inferring.
- [ ] Rich Results Test passes on three sample pages

---

## Part 2: Date discipline

### 2.1 Three fields, three meanings

The current failure is that `datePublished`, `dateModified` and the visible "Checked [date]" are all the build date, because they are derived at build time rather than read from content. Split them.

| Field | Moves when | Source of truth | Rendered? |
|---|---|---|---|
| `datePublished` | Never after first publication | Content frontmatter, hand-set | Yes, "Published" |
| `dateModified` | Only when the rendered body actually changes | Computed, hash-guarded | Schema and sitemap only |
| `dateChecked` | When a human re-verified the facts, even if nothing changed | Content frontmatter, hand-set | Yes, "Last checked" |

`dateChecked` is the honest and differentiating one. It says a person looked, which is a stronger claim than "this file was touched."

### 2.2 Content collection schema

```ts
// src/content/config.ts
const editorial = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    standfirst: z.string(),
    author: z.string(),                       // slug into the authors collection
    reviewedBy: z.string().optional(),
    datePublished: z.string().datetime({ offset: true }),
    dateChecked: z.string().datetime({ offset: true }),
    freshnessTier: z.enum(['volatile', 'semi-stable', 'evergreen']),
    pillar: z.enum(['P1','P2','P3','P4','P5','P6','P7','P8','P9']),
    slot: z.number().int().optional(),        // calendar slot, for traceability
    primaryKeyword: z.string(),
    fieldwork: z.object({
      date: z.string().datetime({ offset: true }),
      note: z.string(),
    }).optional(),
    sources: z.array(z.object({
      name: z.string(),                       // Chinese name where applicable
      nameEn: z.string().optional(),
      url: z.string().url().optional(),
      date: z.string().optional(),
      tier: z.enum(['1','2','3','4']),        // per chinese-source-map.md
    })).default([]),
    affiliateSlug: z.string().optional(),     // /go/ slug, omit for none
    changelog: z.array(z.object({
      date: z.string(),
      change: z.string(),
    })).default([]),
    noindex: z.boolean().default(false),
  }),
});
```

`dateModified` is deliberately **not** in the schema. It is computed. See next.

### 2.3 The content-hash guard

The risk is obvious and it is the exact behaviour we criticise Trip.com for: a CSS refactor triggers a rebuild, 78 pages get a new `dateModified`, and the site starts signalling freshness over static content. Make the promise mechanically true instead of relying on discipline.

Build an integration that runs at build time:

1. For each editorial entry, compute `sha256` of the **normalised rendered body text** (strip HTML tags, collapse whitespace, exclude the dateline, nav, footer and any component that renders a date).
2. Compare against a committed manifest, `content/.content-hashes.json`, mapping slug to `{ hash, dateModified }`.
3. If the hash is unchanged, reuse the stored `dateModified`.
4. If the hash changed, set `dateModified` to the current build date and update the manifest.
5. Commit the manifest. It is source, not an artefact.

```js
// scripts/content-hashes.mjs  (sketch, wire into an Astro integration hook)
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const MANIFEST = 'content/.content-hashes.json';

export function resolveDateModified(slug, renderedBody, buildDate) {
  const normalised = renderedBody
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const hash = createHash('sha256').update(normalised).digest('hex');

  const manifest = existsSync(MANIFEST)
    ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
    : {};

  const prior = manifest[slug];
  if (prior && prior.hash === hash) {
    return prior.dateModified;            // unchanged, do not bump
  }

  manifest[slug] = { hash, dateModified: buildDate };
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  return buildDate;
}
```

Add a CI check that fails the build if `.content-hashes.json` is dirty after a build on a branch with no content changes. That catches accidental mass-bumps before they reach production.

### 2.4 Sitemap lastmod

The sitemap currently emits **no `lastmod` at all**, which means Google receives no freshness signal from the site. Every entry gets `lastmod` from the computed `dateModified`, not from the build date.

Drop the uniform `changefreq weekly, priority 0.7` on all 78 URLs. It is noise. Either omit both fields or set `priority` meaningfully by tier.

### 2.5 Freshness tiers and the revision queue

Do not stamp everything. A "Last checked" line on a piece about 1934 is noise and it devalues the stamp on the pages where it matters.

| Tier | Pages | Cadence | Behaviour |
|---|---|---|---|
| **volatile** | Tickets, shuttle, transport, entry rules, opening hours, car ban, station | **Quarterly, plus before each Golden Week** | Renders "Last checked". Appears in the revision queue. |
| **semi-stable** | Villages, stays, seasons, itineraries, food, trails | **Twice a year** | Renders "Last checked". |
| **evergreen** | History, the sword legend, the 1984 conference, essays | **Annually or never** | Renders "Published" only. No checked line. |

Build `/admin/revision-queue` or a `npm run revisions` script that lists every page whose `dateChecked` is older than its tier allows, sorted by overdue days. This is the operational tool that keeps the promise from decaying.

### 2.6 Migrating the 78 existing pages

**Do not backdate anything.** Those pages really were published between 5 and 9 August 2026 and saying so is honest. Backdating to fake a publication history is the same category of error as a fake byline.

Migration steps:

1. Set `datePublished` on all 78 to their true build dates from git history, not a uniform value.
2. Set `dateChecked` equal to `datePublished` initially.
3. Assign `freshnessTier` to each. About 20 are volatile, about 45 semi-stable, about 13 evergreen.
4. Run the first revision pass on the volatile set immediately, updating `dateChecked` only where a human actually verified.
5. The uniformity dissolves on its own within one quarter. Do not force it.

**Separate case: the eight existing news items.** When they move to permalinks in Part 4, their `datePublished` is the **date of the event they describe** (17 Feb 2026, 12 Sep 2025, Mar 2025, 26 Dec 2024, 17 Dec 2024, Nov 2024, 24 May 2024), not the August build date. That is not backdating, it is correcting a field that was wrong.

### Acceptance criteria, Part 2

- [ ] All three date fields exist and are distinct in the content schema
- [ ] `dateModified` is computed and hash-guarded, never hand-set, never derived from build time alone
- [ ] `content/.content-hashes.json` is committed and CI fails on an unexpected dirty manifest
- [ ] Sitemap emits `lastmod` on every URL, sourced from `dateModified`
- [ ] Uniform `changefreq`/`priority` removed
- [ ] All 78 pages carry a `freshnessTier`
- [ ] `npm run revisions` lists overdue pages
- [ ] A CSS-only change produces zero `dateModified` bumps. **Test this explicitly before shipping.**

---

# PHASE 1: STRUCTURE

---

## Part 3: Listings remediation

### 3.1 Why

Seven directory pages carry 809 auto-generated property listings and 2,427 `/go/` links, with the homestays page alone running to roughly 39,400 words across 380 properties, carrying imported OTA ratings and **USD pricing**.

Two problems. The commercial one is that USD prices are useless on the ground, where everything is RMB. The editorial one is that the site's stated policy is "nothing ranked, nothing promoted" and "no invented star ratings," and then seven pages carry imported ratings at scale. We are breaking our own rule in the place a reader is most likely to notice.

The SEO risk is real but unproven. The site is one month old and ranks for nothing, which is what one-month-old sites do. **Treat this as a risk to remove, not a diagnosed penalty. Do not over-correct by deleting.**

### 3.2 Immediate hygiene, do this first

1. **Convert all prices to RMB.** One data transform in `properties.json` and the directory templates. If the source feed is USD, convert at a fixed documented rate and show the rate and its date, or better, take RMB from the source.
2. **Strip or label imported ratings.** Preferred: remove them. If they stay, label explicitly: *Rating imported from Trip.com, [date]. We do not rate properties.* Never render an unattributed star.
3. **Keep `/go/` disallowed in robots.txt.** Already correct. Do not change.

### 3.3 Noindex the seven directories

Add `noindex, follow` to these seven, keeping them live, linked and fully functional:

```
/where-to-stay/homestays      (380 properties)
/where-to-stay/villas         (126)
/where-to-stay/lodges         (102)
/where-to-stay/hotels         (92)
/where-to-stay/hostels        (51)
/where-to-stay/resorts        (45)
/where-to-stay/apartments     (13)
```

`follow` matters: link equity still flows to the individual property pages and the `/go/` redirects still earn. Readers arriving through editorial can still browse the whole inventory. Remove them from the XML sitemap.

**Do not noindex** the editorial layer above them: `/where-to-stay`, `/where-to-stay/best-hotels`, `/hotels-explained`, `/minsu-explained`, `/villas-explained`, `/luxury`, and the individual property pages.

This is one day of work and reversible in an hour. Ship it this week.

### 3.4 Consolidation, Q1 to Q2

As the ten village pages and the property pages ship from the calendar, the directories stop being the primary discovery path. Target end state:

- **Ten village pages** each carrying a short curated shortlist with actual judgment, plus one village storefront link for the long tail
- **Eight to twelve property pages** per the existing property-page template
- **Four typology explainers**, already live
- **The 809** become a filtered, searchable browse tool at a single noindexed URL, which is what they should have been from the start

Nothing is deleted, nothing stops earning, and the indexable surface goes from 809 thin pages to roughly 25 substantial ones.

### 3.5 Turn the data into an asset

809 structured property records are worth far more in aggregate than as a list. Build two flagship data pieces from data already held:

1. **What Moganshan accommodation actually costs.** Price distribution by village, by property type and by month. Dated, sourced, RMB, with the method stated. Revised quarterly. Nothing comparable exists in English.
2. **Which Moganshan properties will register a foreign passport.** Combine the property dataset with the phone and message survey in slot 13. This does not exist for any destination in China and every China-expat resource on the internet would link to it.

Both need a small data-viz treatment and both are linkable in a way a listing page never is.

### Acceptance criteria, Part 3

- [ ] All prices render in RMB with no USD anywhere on the site
- [ ] No unattributed ratings render anywhere
- [ ] Seven directory pages carry `noindex, follow` and are removed from the sitemap
- [ ] All `/go/` redirects still resolve and still carry their SID
- [ ] Editorial stay pages and property pages remain indexable
- [ ] A crawl confirms indexable page count drops from 78 to 71 with no orphaned property pages

---

## Part 4: The news layer

`/journal/news` is already the best thing on the site and the only format no competitor in this niche operates. It is also one page, with eight items, no permalinks, no feed, no archive, no `NewsArticle` schema, already past 1,800 words, last updated 17 February 2026. It cannot carry a weekly cadence.

### 4.1 URL model

```
/journal/news                          index, reverse chronological, paginated at 20
/journal/news/YYYY/MM/slug             one dispatch, one permalink
/journal/news/dispatch/YYYY-WW         the weekly digest, e.g. /journal/news/dispatch/2026-38
/journal/news/archive/YYYY             year archive
/journal/news/topic/{slug}             optional: tickets, transport, openings, entry-rules, events, weather
/journal/news/feed.xml                 RSS 2.0
/journal/news/sitemap-news.xml         Google News sitemap, rolling 48 hours
```

### 4.2 Collection schema

```ts
const dispatches = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    standfirst: z.string(),
    author: z.string(),
    kind: z.enum(['weekly', 'breaking']),
    week: z.string().optional(),            // "2026-38", weekly only
    datePublished: z.string().datetime({ offset: true }),
    items: z.array(z.object({
      headline: z.string(),
      body: z.string(),
      consequence: z.string(),              // mandatory, see 4.4
      eventDate: z.string(),
      source: z.object({
        name: z.string(),                   // Chinese name
        nameEn: z.string(),
        url: z.string().url(),
        date: z.string(),
        tier: z.enum(['1','2','3','4']),
      }),
      topics: z.array(z.string()).default([]),
      affectsPages: z.array(z.string()).default([]),  // evergreen pages to update
    })).min(1),
    corrections: z.array(z.object({
      date: z.string(),
      text: z.string(),
    })).default([]),
  }),
});
```

`consequence` is `.min(1)` by design. If an item has no visitor consequence it is not an item.

### 4.3 Schema markup

```json
{
  "@type": "NewsArticle",
  "headline": "...",
  "datePublished": "2026-09-17T09:00:00+08:00",
  "dateModified": "2026-09-17T09:00:00+08:00",
  "author": {"@type": "Person", "name": "...", "url": "/about/authors/..."},
  "publisher": {"@type": "Organization", "name": "BeyondBorder Group Ltd"},
  "citation": [
    {"@type": "CreativeWork", "name": "德清新闻网", "url": "https://dqnews.zjol.com.cn/..."}
  ],
  "about": {"@type": "TouristDestination", "name": "Moganshan"}
}
```

The `citation` array carrying real Chinese source URLs is the differentiator. Emit it on every dispatch, built from the `items[].source` records.

### 4.4 Dispatch template

```markdown
# Moganshan dispatch, week 38

[Standfirst: one sentence naming the week's most consequential change, or
 plainly saying nothing material changed.]

## [Item headline]
[Two to four sentences. What changed. When. What is now different.]
**What this means for a visitor:** [one sentence, always present]
Source: 德清新闻网 (Deqing News), 17 September 2026 [link]

---
Checked 17 September 2026. Corrections to [contact].
```

A week with nothing material is a legitimate dispatch: *"Nothing changed on the mountain this week that affects a trip. Here is what is still true."* Publishing that is a trust signal. Skipping the week is not.

### 4.5 Feed, news sitemap, autodiscovery

RSS 2.0 at `/journal/news/feed.xml`, full item text, 50 items, with `<link rel="alternate" type="application/rss+xml">` autodiscovery in `<head>` site-wide. The site has no feed of any kind today, which means no China-expat newsletter, aggregator or Wikivoyage editor can follow it.

News sitemap at `/journal/news/sitemap-news.xml`, rolling 48-hour window, referenced from `sitemap-index.xml`. Note that `sitemap-0.xml` already declares the news namespace and emits no news blocks. Fix that.

### 4.6 Freshness propagation

When a dispatch item changes a fact that lives on an evergreen page, three things happen **in the same commit**, driven by `items[].affectsPages`:

1. The evergreen page is edited
2. Its `dateChecked` moves, and its `dateModified` moves via the hash guard
3. Its `changelog` gains an entry linking to the dispatch permalink

Add a build warning when a dispatch names an `affectsPages` target whose `dateChecked` did not move in the same commit.

### 4.7 Retro-fit and navigation

- Move the eight existing news entries to permalinks under their real event dates, per 2.6
- Print the existing editorial rule at the top of the index: *"News here is narrow: something changed, and the change carries a date. A restated press release does not qualify."*
- **Promote `/journal` into the main navigation.** It is currently reachable only from a homepage block and a few cross-links. It is the site's single best asset and it is hidden. Nav becomes: The Mountain, Things to Do, Where to Stay, Itineraries, Plan, Journal.
- Add a dispatch teaser block to the homepage and to the foot of every `volatile`-tier page

### 4.8 Guardrails, enforce in code where possible

- **No affiliate link inside a dispatch.** Disclosure line only. Add a build-time check that fails if a `/go/` link appears in the dispatches collection.
- **No item without a `consequence`.** Enforced by the schema.
- **No item without a dated source.** Enforced by the schema.
- **Corrections stay visible.** Amend the item, date the amendment, keep the original with a strikethrough. Never silently delete.

### Acceptance criteria, Part 4

- [ ] Dispatch permalinks resolve and are indexable
- [ ] `NewsArticle` schema with a populated `citation` array validates
- [ ] `/journal/news/feed.xml` validates as RSS 2.0 with autodiscovery in `<head>`
- [ ] News sitemap present and referenced from the sitemap index
- [ ] Eight existing entries retro-fitted to their real event dates
- [ ] `/journal` in the main navigation
- [ ] Build fails on a `/go/` link inside a dispatch
- [ ] Build warns when `affectsPages` is set and the target's `dateChecked` did not move

---

# PHASE 2: EDITORIAL SYSTEM

---

## Part 5: How every piece is made

### 5.1 Cadence

| Track | Cadence | Volume/year |
|---|---|---|
| **Core editorial** | one piece every 3 days | **122** |
| **Weekly dispatch** | every Thursday | **52** |
| **Breaking dispatch** | as it happens | ~20 |
| **Quarterly revision** | 4 batches | ~40 page updates |

Roughly 194 publications a year. Core track averages 1,490 words, 181,500 words planned.

### 5.2 The nine pillars

| | Pillar | Slots | Why it exists |
|---|---|---|---|
| P1 | Access & Practicals | 16 | Largest gap in English. Zero competition. Most linkable. |
| P2 | Villages & Stays | 15 | Editorial layer over the affiliate inventory. Where revenue is. |
| P3 | Trails & Outdoors | 16 | Nobody publishes distance, gain, surface or honest timing. |
| P4 | Food, Tea & Coffee | 15 | Site has no food page. Competitors name zero restaurants. |
| P5 | History & Culture | 8 | Deepens the journal thread. High affection, low commercial intent. |
| P6 | Seasons & Timing | 18 | Highest-frequency intent, currently owned by weather widgets. |
| P7 | Trip Design & Comparisons | 16 | Least defended high-intent territory available. |
| P8 | Around Deqing | 10 | Extends stay length, captures adjacent volume. |
| P9 | News & Dispatches | 8 | Set pieces the weekly digest cannot carry. |

Seasonal pieces publish **four to six weeks before the season they describe**. Search happens ahead of travel. Slots may be swapped **within a quarter** to follow news or weather. Never move a seasonal slot across quarters.

### 5.3 Page shell, unchanged from the existing site

Breadcrumb and section eyebrow, H1, standfirst, **Dateline component (new)**, read time, numbered "On this page", geographic orientation paragraph with the M50 disambiguation where relevant, body, inline source lines, "Checked [date]", the standing photo disclaimer, three sibling cards under "More in [Section]", footer triptych.

### 5.4 Page templates to build

Five new templates. Build each once, from data, not per page.

**Village template** (first use: slot 5, Yucun). What it is and where, the free things, food, stays with a curated shortlist, the walk, who should base here, the honest downside. Reused by slots 8, 12, 21, 29, 39, 46, 93, 109.

**Trail template** (first use: slot 10, Chiang Kai-shek path). Route stage by stage, a fact strip of distance, elevation gain, surface, honest timing for a fit and an unfit walker, what to carry, when not to go, embedded map, downloadable GPX, elevation profile. Emits `HowTo` and `Place` schema. Reused by slots 14, 28, 40, 52, 56, 96, 102.

**Comparison template** (first use: slot 18, vs Anji). Why the confusion exists, a side-by-side table, getting to each, cost of each, who should choose which, doing both. Reused by slots 32, 43, 55, 76, 97, 107, 116.

**Price table component** (first use: slot 3, tickets). Every row carries its own figure, source, source tier and checked date. Renders the disagreement rather than resolving it silently. This is the site's house move made into a component.

**Crowd calendar component** (first use: slot 4, National Day). Reused by slots 72, 90, 100 and the Spring Festival piece.

### 5.5 Voice rules

**Keep.** Corrective framing, lead by demolishing a wrong assumption where one exists. Numbers as the spine, every claim that can carry a figure carries one with a date and a source. Named uncertainty, where sources disagree publish the disagreement. No rankings, no ratings, no "we loved it." Honest negatives, "who will not enjoy it," "what to skip." British spelling, Chinese characters inline on first use, RMB, 24-hour clock, day-month-year.

**Add.** A Chinese source line naming the source in Chinese with a translation: `德清新闻网 (Deqing News), 17 March 2026`. Field-verified markers where a fact was checked on the ground rather than read.

**Never.** No em dashes. No deliberate typos or planted errors, humanise through cadence, structure and word choice only. No invented review language. No untranslated Chinese without a rendering, no pinyin without characters on first use. No "first in China" claim repeated from Chinese destination marketing without a primary source.

### 5.6 Sourcing rules, condensed

Full detail in `chinese-source-map.md`. The five that matter:

| Fact type | Chain |
|---|---|
| Prices, closures, policy | County government portal → scenic area official channel → 0572-8412345. **Never an OTA aggregator.** |
| Hotel openings | Trade press announces → Dianping or Ctrip confirms trading → local news covers the ribbon. **Publish on step two.** Announced dates slip. |
| Event dates | Mid-January sports presser and early-February openings meeting give the skeleton. Confirm each event two to three weeks out. |
| Visitor numbers | Huzhou or Zhejiang bureau only. County and marketing sources inflate. |
| Anything from 爱德清, 德清发布, 文旅浙江, brand newsrooms | Treat as a tip, not a fact. |

**Do not publish these. They failed verification:** there is no Deqing marathon or half marathon. The bamboo culture festival is Anji's, not Deqing's. No Moganshan hot spring festival, camping festival or branded annual music festival could be verified. No official Moganshan ticketing WeChat account name was confirmed. The 2026 ticket tariff could not be confirmed from an authoritative source.

### 5.7 Affiliate placement by pillar

Trip.com only. Homepage carries no affiliate link. First booking touchpoint is one click away.

| Pillar | Placement |
|---|---|
| P1 Practicals | Ticket and train modules only where the piece is transactional. Never on payments or eSIM pieces. |
| P2 Villages & Stays | Village storefront plus property deep links. Highest density. |
| P3 Trails | None, except a soft stay link at the foot where the trail implies an overnight. |
| P4 Food | **None.** Nothing to sell and a button would cheapen the section. |
| P5 History | **None.** |
| P6 Seasons | Stay storefront at the foot; ticket module on gate and night-programme pieces. |
| P7 Comparisons & itineraries | Highest revenue density. Inline deep links in booking order plus an end-of-page recap module. |
| P8 Around Deqing | Train and stay links on the itinerary-extension pieces. |
| P9 Dispatches | **None inline.** Disclosure line only. |

**New `/go/` slugs required.** Add to `vercel.json` before slot 5:

```
stays-village-yucun      stays-village-xiantan    stays-village-houwu
stays-village-laoling    stays-village-wusi       stays-village-hecun
stays-village-beihu      stays-village-biwu       stays-village-liaoyuan
```

### 5.8 Per-piece production loop

1. Pull the Chinese sources named in the calendar row (20 min)
2. Cross-check every number against the verification tier for that fact type (20 min)
3. Draft against the house shell (90 min)
4. Run the `contentquality` skill's 18-pass loop (30 min)
5. Schema, internal links, source records, `dateChecked`, sibling cards (20 min)

Roughly three hours a piece, 10 to 12 hours a week including the dispatch.

### 5.9 Field work

Six pieces cannot be written from a desk and must not be attempted from one: slots 2, 10, 11, 13, 28, 34. Budget two visits, autumn and spring, with GPS, camera and a call list.

**Unique data to build and own:**
- Dated, sourced, RMB price table, revised quarterly. Ticket, shuttle, taxi, e-bike, kayak, guesthouse bands.
- GPX with elevation profile, surface type and honest timing for all eight named routes. Earns links from Outdooractive, Wikiloc, AllTrails.
- Crowd calendar. Golden Week, Labour Day, Qingming, summer weekends, tour bus arrival windows.
- Foreigner-registration status list for accommodation. Exists for no Chinese destination.

### 5.10 Two reserved subjects

`/journal` already claims these. **Do not duplicate them in any calendar slot:** the 1901 tennis court piece, and the Four Seasons construction photo essay.

---
## Part 6: The 52-week calendar

122 slots, one every three days, **14 September 2026 to 12 September 2027**. Machine-readable version in `editorial-calendar.csv`, regenerable from `build_calendar.py`.

Read the note before drafting. It carries the angle, the trap, or the reason the slot exists.

Format: **slot · date · pillar** then title, then `primary keyword` · target words · affiliate slug, then the note.

### Q1 · 14 September to 10 December 2026

Practicals cluster first. Widest gap, no competition, cheapest to source, most linkable. Plus National Day, autumn colour, the first four village pages.

**1 · 14 Sep · P1 Practicals** · The private car ban on Moganshan: what 8am to 5.30pm actually means  
`moganshan private car ban / can you drive up moganshan` · 1,600w · `go/stays-all soft link at foot`  
CN sources: deqing.gov.cn notices; 腾讯 交通管制 pieces; 游侠客 攻略  
> FLAGSHIP GAP PIECE. No English source explains the 2018-11-30 rule or the in-park-booking exception. Lead the quarter with it.

**2 · 17 Sep · P1 Practicals** · The Moganshan shuttle system: both transfer centres, both fares, last bus down  
`moganshan shuttle bus / moganshan transfer centre` · 1,500w · `go/tickets-moganshan`  
CN sources: 游侠客; 当旅网 避坑攻略; 德清新闻网  
> Yucun and Houwu centres, 35 RMB return + 15 RMB internal, free luggage store, free dog kennels. Nothing in English covers this.

**3 · 20 Sep · P1 Practicals** · Moganshan tickets in 2026: what you pay, what you don't, and why every source disagrees  
`moganshan tickets / moganshan entrance fee` · 1,800w · `go/tickets-moganshan`  
CN sources: deqing.gov.cn; 0572-8412345 phone check; Ctrip sight 135799  
> Publish the disagreement, not a single number. Four English sources give four answers. Dated, sourced, RMB. Quarterly revision.

**4 · 23 Sep · P6 Seasons** · National Day on Moganshan: the crowd calendar, the road closures, and whether to go  
`moganshan national day / golden week moganshan` · 1,400w · `go/stays-all`  
CN sources: 湖州文旅局 holiday stats; 德清发布 holiday programme  
> Timed for 1 Oct. Honest answer is often no. Build the reusable crowd calendar here.

**5 · 26 Sep · P2 Villages** · Yucun: the village you can visit without a ticket  
`yucun moganshan / moganshan without ticket` · 1,600w · `go/stays-village-yucun`  
CN sources: 维基百科 莫干山镇; 腾讯 庾村免费玩  
> First of ten village pages. Yucun is the free base: 1932 park, Republic library, White Cloud art museum, transfer centre.

**6 · 29 Sep · P1 Practicals** · Where to leave your bags: luggage storage at Deqing station and the transfer centre  
`moganshan luggage storage` · 900w · no affiliate  
CN sources: 游侠客; 换乘中心 signage  
> Short, high-utility, zero competition. Free storage at the transfer centre is unreported in English.

**7 · 2 Oct · P6 Seasons** · Moganshan red leaves: where the maples are and when they turn  
`moganshan autumn / moganshan red leaves` · 1,500w · `go/stays-all`  
CN sources: 腾讯 秋色红叶攻略; 德清新闻网  
> Publish 6 weeks before peak (mid-Nov). Villa 62's 500-year maple, Queen's Hotel, Xuguang terrace, Wulingcun.

**8 · 5 Oct · P2 Villages** · Xiantan: the village with 135 guesthouses  
`xiantan village moganshan` · 1,600w · `go/stays-village-xiantan`  
CN sources: 新华网 德清; Feeling the Stones Substack  
> The homestay capital. Fishman's reporting says stay here, not Yucun. Test that claim.

**9 · 8 Oct · P1 Practicals** · Paying for things on Moganshan: Alipay, WeChat Pay, and whether cash still works  
`alipay foreign card china / moganshan payments` · 1,400w · no affiliate  
CN sources: 本地宝; platform docs  
> Foreigner-specific cluster. Highly linkable by China-expat resources.

**10 · 11 Oct · P3 Trails** · The Chiang Kai-shek path: the free route to Sword Pond  
`moganshan hiking trail / jianggong ancient path` · 2,000w · no affiliate  
CN sources: 绿色旅行网 8条徒步路线; 新浪 3条亲测路线  
> FLAGSHIP TRAIL PIECE. 4km one way, +400m, 10-12km full loop, +560m, bypasses the gate. Needs GPS field data.

**11 · 14 Oct · P4 Food** · Moganshan noodles: the four shops locals actually queue for  
`where to eat moganshan / moganshan restaurants` · 1,300w · no affiliate  
CN sources: 腾讯 隐藏美食; 德清新闻网  
> Food is the site's largest hole and no English source names a single restaurant. Xingxian, Aqingsao, Huiyi, Meixi.

**12 · 17 Oct · P2 Villages** · Houwu: streams, a thousand-year ginkgo, and the second transfer centre  
`houwu village moganshan` · 1,500w · `go/stays-village-houwu`  
CN sources: 新浪博客 8个村景区化  
> Also the Muke Cooperative digital-nomad house at Jimiaowu.

**13 · 20 Oct · P1 Practicals** · Can a guesthouse refuse your passport? Foreign guest registration in rural Zhejiang  
`china homestay foreigners passport / minsu foreign guests` · 2,200w · `go/stays-all`  
CN sources: 2024-05-24 directive (already in /journal/news); 公安 registration rules  
> HIGHEST LINK-VALUE PIECE ON THE PLAN. Nothing like this exists for any Chinese destination. Needs calls to properties.

**14 · 23 Oct · P3 Trails** · Biwu Dragon Pool: the easiest good walk on the mountain  
`biwu longtan / moganshan easy walk` · 1,400w · `绿色旅行网; 当旅网`  
CN sources: none  
> 3km, stream valley, waterfall, glass platform. Bring a change of clothes.

**15 · 26 Oct · P3 Trails** · The Kailas Moganshan Skyrace: what a 100k trail race does to a small mountain  
`moganshan trail race / kailas skyrace` · 1,500w · `go/stays-all`  
CN sources: 朗途体育 moganshan.saihuitong.com; zuicool  
> Race is late Oct. Publish just ahead. Start of the endurance-sport identity thread.

**16 · 29 Oct · P1 Practicals** · Getting a car back down: Didi, taxis and the Moganshan pickup problem  
`didi moganshan / taxi from moganshan` · 1,200w · no affiliate  
CN sources: TripAdvisor complaints; 当旅网 黑车 warnings  
> Recurring reviewer complaint nobody has answered.

**17 · 1 Nov · P4 Food** · Mogan Huangya: the yellow tea almost nobody outside China drinks  
`mogan huangya / moganshan tea` · 1,700w · no affiliate  
CN sources: 新华网 问茶莫干山; 德清新闻网 茶王赛  
> Tea retailers own this SERP with zero travel content. Links from Seven Cups, Leaves of Cha etc.

**18 · 4 Nov · P7 Compare** · Moganshan vs Anji: two bamboo mountains, one weekend  
`moganshan vs anji` · 1,900w · `go/stays-all`  
CN sources: Chinese guides treating them as a pair  
> TOP COMPARISON TARGET. Frommer's bundles them and nobody actually compares them.

**19 · 7 Nov · P5 History** · Villa 62 and the five-hundred-year maple  
`moganshan villas / villa 62 moganshan` · 1,300w · no affiliate  
CN sources: 腾讯 红叶攻略; 武陵村 sources  
> Ties history to the autumn traffic. The 'little Kyoto' shot.

**20 · 10 Nov · P1 Practicals** · eSIM, VPN and data on the mountain: what works in the bamboo  
`china esim / vpn moganshan` · 1,400w · no affiliate  
CN sources: field test required  
> Zero hits for SIM, eSIM, VPN or WiFi on the current site.

**21 · 13 Nov · P2 Villages** · Laoling and Sanjiuwu: where the foreign farmstay began  
`laoling moganshan / sanjiuwu naked retreats` · 1,700w · `go/stays-village-laoling`  
CN sources: 界面新闻; 新华网  
> The yangjiale origin story. naked Retreats started here in 2007.

**22 · 16 Nov · P6 Seasons** · What actually closes in winter on Moganshan  
`moganshan winter / is moganshan open in winter` · 1,300w · `go/stays-all`  
CN sources: 当旅网; seasonal 攻略  
> Winter SERP is weather widgets and one Instagram post. Free position.

**23 · 19 Nov · P4 Food** · The cave cafe at Tongguanshan and the quarry cafe at Wusi  
`moganshan cafe / rural coffee china` · 1,600w · no affiliate  
CN sources: 中国日报 一杯咖啡香满村; 德清新闻网 洞穴野咖  
> The most publishable visual story on the mountain right now. Zero English coverage. Over 70 percent of founders are post-90s.

**24 · 22 Nov · P6 Seasons** · Moganshan in the snow: ice curtains, empty villas, and the road  
`moganshan snow` · 1,200w · `go/stays-all`  
CN sources: 冰挂 coverage; 中国天气网 101210204004  
> Weather-driven road closures are the leading indicator. Link the town-level forecast.

**25 · 25 Nov · P1 Practicals** · Deqing station: which exit, which taxi, which bus  
`deqing station moganshan / wukang station` · 1,300w · `go/train-shanghai-deqing`  
CN sources: Y1旅游专线; K111 timetables  
> Resolves the Deqing vs Wukang naming confusion that trips up every English source.

**26 · 28 Nov · P5 History** · The 1984 Moganshan Conference: the weekend that helped reprice China  
`1984 moganshan conference` · 2,400w · no affiliate  
CN sources: 中国日报 第八届莫干山会议; academic sources  
> Arguably the most historically significant thing that happened here and near-invisible in English travel writing.

**27 · 1 Dec · P1 Practicals** · Moganshan with a dog: the free kennels nobody mentions  
`moganshan pet friendly / dog friendly moganshan` · 1,200w · `go/stays-all`  
CN sources: 换乘中心 services; 宠物友好民宿 listings  
> Free large-dog kennels and rentable carriers at the transfer centre. Fast-growing Chinese category.

**28 · 4 Dec · P3 Trails** · Dayangli loop: 9.8km through the Crouching Tiger bamboo  
`moganshan bamboo forest walk / dayangli` · 1,800w · no affiliate  
CN sources: 绿色旅行网; 青芷森林咖啡馆  
> Tianquanshan platform, naked Castle panorama, forest cafe at the halfway point.

**29 · 7 Dec · P2 Villages** · Wusi: the digital village and its quarry coffee  
`wusi village deqing` · 1,400w · no affiliate  
CN sources: 中国日报; 德清新闻网  
> China's self-declared number one digital village. Gelien coffee in an abandoned quarry pit.

**30 · 10 Dec · P6 Seasons** · Winter on Moganshan: the honest case for going in January  
`moganshan january / moganshan low season` · 1,500w · `go/stays-all`  
CN sources: seasonal pricing data  
> Consolidates the winter cluster. Low season pricing, cloud seas, dongsun, empty trails.

### Q2 · 13 December 2026 to 10 March 2027

Low visitor season, high planning season. History, comparisons, and everything seasonal that needs publishing months ahead: tea, fireflies, spring.

**31 · 13 Dec · P6 Seasons** · Chinese New Year on Moganshan: what's open, what it costs, what to book  
`moganshan chinese new year` · 1,500w · `go/stays-all`  
CN sources: 民宿 年夜饭 packages; 德清发布  
> The one high-price winter window. Six or seven sold-out nights.

**32 · 16 Dec · P7 Compare** · Moganshan vs Wuzhen: mountain or water town  
`moganshan vs wuzhen` · 1,800w · `go/stays-all`  
CN sources: comparative 攻略  
> The real decision most Shanghai weekenders face. Siphons Wuzhen's volume.

**33 · 19 Dec · P2 Villages** · Heating, in a Republic-era villa: which stays are actually warm  
`moganshan winter accommodation heating` · 1,400w · `go/stays-all + property links`  
CN sources: 民宿 reviews  
> Recurring unanswered question. Honest, unrankable-by-OTA.

**34 · 22 Dec · P4 Food** · Where to eat on Moganshan, village by village  
`where to eat moganshan` · 2,200w · no affiliate  
CN sources: 腾讯 隐藏美食; 大众点评 湖州  
> The food hub. Links every food piece. Should become a top-5 entry page.

**35 · 25 Dec · P5 History** · The sword that named the mountain: Gan Jiang, Mo Ye and the forge  
`moganshan sword legend / gan jiang mo ye` · 1,500w · no affiliate  
CN sources: 干将莫邪 sources; 剑池  
> Sword Pond page exists; the legend behind it does not.

**36 · 28 Dec · P7 Compare** · Moganshan in one day from Shanghai: is it really viable?  
`moganshan day trip from shanghai` · 1,700w · `go/train-shanghai-deqing`  
CN sources: timing data  
> Directly answers an unanswered TripAdvisor forum question. Honest verdict, not a yes.

**37 · 31 Dec · P9 News** · What changed on Moganshan in 2026  
`moganshan 2026 changes` · 1,800w · no affiliate  
CN sources: full year of the news log  
> Year-end set piece. Republishes the news layer as narrative. Strong internal-link hub.

**38 · 3 Jan · P6 Seasons** · Sea of clouds from Xuguang terrace: the 8am gate problem  
`moganshan sunrise / moganshan cloud sea` · 1,400w · `go/stays-all`  
CN sources: 云海 coverage; gate hours  
> The site already flags this problem twice and never solves it. Solve it: sleep inside the gate.

**39 · 6 Jan · P2 Villages** · Hecun: 1,600 mu of tea and a cave  
`hecun moganshan tea` · 1,400w · no affiliate  
CN sources: 德清新闻网 洞穴野咖  
> Tongguanshan cave cafe sits here. Pairs with the coffee feature.

**40 · 9 Jan · P3 Trails** · Moganshan hiking: the eight routes, with distances and honest timings  
`moganshan hiking` · 2,600w · no affiliate  
CN sources: 绿色旅行网 8条徒步路线  
> PILLAR HUB. Outdooractive and Wikiloc own raw tracks with no context. Own the context.

**41 · 12 Jan · P4 Food** · Charcoal tea by the fire: weilu zhucha and the winter guesthouse  
`weilu zhucha / chinese winter tea ritual` · 1,200w · `go/stays-all`  
CN sources: 围炉煮茶 coverage  
> A Chinese winter ritual with no English travel coverage.

**42 · 15 Jan · P9 News** · Moganshan's 2027 race calendar  
`moganshan races 2027` · 1,300w · no affiliate  
CN sources: 德清新闻网 mid-January presser  
> DIARY ITEM: the mid-January outdoor-sports presser publishes the whole year in one article.

**43 · 18 Jan · P7 Compare** · Moganshan the mountain vs Moganshan Road in Shanghai  
`moganshan road shanghai / m50` · 1,200w · no affiliate  
CN sources: none  
> Google has not disambiguated these entities. TripAdvisor and Wikipedia return M50 for 'moganshan things to do'.

**44 · 21 Jan · P5 History** · Missionaries, mosquitoes and a hill station: how foreigners built Moganshan  
`moganshan history / moganshan hill station` · 2,400w · no affiliate  
CN sources: Hayley Keon; 传教士避暑地 sources  
> Extends the existing journal history thread. Seattle Times and Deseret News own this intent with a syndicated wire piece.

**45 · 24 Jan · P7 Compare** · Moganshan for couples  
`moganshan for couples / romantic weekend near shanghai` · 1,600w · `go/stays-all`  
CN sources: none  
> The nav already promises this and returns an unfiltered page. Fix the promise.

**46 · 27 Jan · P2 Villages** · Beihu: tea farms above, fireflies below  
`beihu village moganshan fireflies` · 1,400w · `go/stays-village-beihu`  
CN sources: 云起萤光水森林  
> Sets up the firefly piece in April.

**47 · 30 Jan · P2 Villages** · What a homestay costs now: the 2025-26 Moganshan shake-out  
`moganshan homestay prices` · 2,100w · `go/stays-all`  
CN sources: 界面新闻 莫干山大洗牌; 新华社  
> English coverage still tells the 2015 boom story. Occupancy 95 to 70 percent, transfer fees at zero, chains arriving.

**48 · 2 Feb · P9 News** · Moganshan's ten openings for 2027  
`moganshan new hotels 2027` · 1,400w · `go/stays-all`  
CN sources: 德清 新春第一会 十大开业项目  
> DIARY ITEM: early February. The resort publishes its ten headline openings in one document.

**49 · 5 Feb · P7 Compare** · Moganshan with children: the honest version  
`moganshan with kids` · 1,800w · `go/stays-all`  
CN sources: 亲子民宿 coverage; 开元森泊  
> Nav promises it, site does not deliver it. Trip.com UGC currently owns the SERP.

**50 · 8 Feb · P2 Villages** · Kaiyuan Sembo: the waterpark resort that isn't really Moganshan  
`kaiyuan sembo moganshan` · 1,500w · `go/stay-kaiyuan-senbo`  
CN sources: 携程 43844242  
> Named five times on the site as 'the one exception' with no page. Honest framing: it is a resort near a mountain.

**51 · 11 Feb · P4 Food** · The bamboo shoot season: chunsun, dongsun and what to order  
`bamboo shoots moganshan / chinese spring bamboo shoots` · 1,300w · no affiliate  
CN sources: seasonal 攻略  
> March is the shoot month. Publish ahead.

**52 · 14 Feb · P3 Trails** · Ziling old teahouse and the Laoling reservoir walk  
`ziling moganshan / laoling reservoir` · 1,400w · no affiliate  
CN sources: 绿色旅行网 劳岭紫岭古道  
> 3.5km, stone path, hundred-mu tea slope, an old teahouse at the end.

**53 · 17 Feb · P1 Practicals** · Booking a Chinese guesthouse from abroad: deposits, cancellations, and the photo gap  
`booking chinese homestay from abroad` · 1,600w · `go/stays-all`  
CN sources: 民宿预订避坑 threads  
> Foreigner cluster. Pairs with the passport-registration investigation.

**54 · 20 Feb · P4 Food** · Mogan Huangya picking season: Qingming to Guyu, and where to pick  
`tea picking china / moganshan tea season` · 1,600w · no affiliate  
CN sources: 德清新闻网 first picking; 茶王赛  
> Publish six weeks ahead of the two-week April window.

**55 · 23 Feb · P7 Compare** · Moganshan vs Hangzhou: as a base, as a day trip, as a pairing  
`moganshan from hangzhou` · 1,700w · `go/train-hangzhou-deqing`  
CN sources: none  
> Rides Hangzhou's search volume. Hangzhou is the number one origin market.

**56 · 26 Feb · P3 Trails** · Trail surfaces: steps, dirt, and what 500 steps to Sword Pond feels like  
`moganshan sword pond steps` · 1,100w · no affiliate  
CN sources: 当旅网 避坑  
> Matters for knees and for children. No competitor publishes surface type.

**57 · 1 Mar · P6 Seasons** · Spring on Moganshan: blossom, shoots, and the first tea  
`moganshan spring` · 1,500w · `go/stays-all`  
CN sources: seasonal sources  
> Rewrite target for the existing /seasons/spring page. Give it real dates.

**58 · 4 Mar · P9 News** · The Moganshan Homestay Conference: what 1,400 operators are worried about  
`moganshan homestay conference` · 1,500w · no affiliate  
CN sources: 中国日报; 腾讯  
> DIARY ITEM: mid-to-late March. Verify the 2027 edition exists before committing.

**59 · 7 Mar · P8 Around** · Yiyuan Organic Farm and the Deqing countryside  
`yiyuan organic farm deqing` · 1,300w · no affiliate  
CN sources: 携程 德清不止莫干山  
> Zhejiang's largest organic farm, 2,000 mu, 20 minutes off the mountain.

**60 · 10 Mar · P9 News** · The climbing festival: Moganshan's oldest walking event  
`moganshan climbing festival` · 1,300w · no affiliate  
CN sources: 德清新闻网 2026/03/23; deqing.gov.cn  
> DIARY ITEM: late March. Lineage claimed back to 1934, which is a good English hook.

### Q3 · 13 March to 8 June 2027

Outdoors and the event calendar. Tea picking, UTMB, the World Brand conference, rafting, fireflies, the summer night programme.

**61 · 13 Mar · P7 Compare** · Moganshan for solo travellers  
`moganshan solo travel` · 1,500w · `go/stays-all`  
CN sources: none  
> Hostels exist in the inventory and nowhere in the editorial.

**62 · 16 Mar · P4 Food** · Picking tea on Moganshan: the two weeks that matter  
`tea picking experience china` · 1,600w · `go/stays-all`  
CN sources: 武陵茶园; 何村; 光明茶场  
> Bookable experience. Qingming to Guyu, roughly 5 to 20 April.

**63 · 19 Mar · P3 Trails** · Cycling the foreign-flavour loop  
`cycling moganshan / moganshan bike` · 1,600w · no affiliate  
CN sources: 环莫干山异国风情线  
> One paragraph on the current site. Deserves a route page with gradient and bike hire.

**64 · 22 Mar · P8 Around** · Xiazhu Lake: crested ibis, reeds, and the boat  
`xiazhu lake deqing` · 1,500w · no affiliate  
CN sources: 下渚湖国家湿地公园  
> Zero English hits on the current site. A genuine second destination.

**65 · 25 Mar · P3 Trails** · Ultra-Trail Mogan by UTMB: the race, the routes, the weekend  
`utmb moganshan` · 1,800w · `go/stays-all`  
CN sources: mogan.utmb.world; ITRA  
> Race is 10 to 12 April. Publish two weeks out. Moganshan joined the UTMB World Series in 2026.

**66 · 28 Mar · P5 History** · Republic villa walking route: which ones you can actually enter  
`moganshan villas walking tour` · 1,800w · `go/tickets-moganshan`  
CN sources: 武陵村; 松月庐; 皇后饭店  
> Unanswered question 49 on the gap list. Which are private, which are hotels, which are open.

**67 · 31 Mar · P7 Compare** · Moganshan on a budget: the honest cheap version  
`moganshan budget / cheap moganshan trip` · 1,600w · `go/stays-all`  
CN sources: sub-500 RMB room data  
> The shake-out made this newly true. Free hiking via the Chiang path, hostels, Yucun base.

**68 · 3 Apr · P8 Around** · Xinshi ancient town: the water town nobody queues for  
`xinshi ancient town deqing` · 1,400w · no affiliate  
CN sources: 新市古镇  
> The anti-Wuzhen. Pairs with the vs-Wuzhen comparison.

**69 · 6 Apr · P6 Seasons** · Hydrangea season and the photograph everyone takes  
`moganshan hydrangea / moganshan flowers` · 1,100w · no affiliate  
CN sources: 绣球花 coverage  
> May to June. Short, visual, shareable.

**70 · 9 Apr · P4 Food** · Where to get coffee on Moganshan: the full list  
`moganshan coffee` · 1,800w · no affiliate  
CN sources: 中国日报; 德清新闻网; 大众点评  
> Twelve-plus named venues with addresses. Nothing comparable exists in English.

**71 · 12 Apr · P9 News** · The World Brand Moganshan Conference: why hotel rooms vanish in May  
`world brand moganshan conference` · 1,300w · `go/stays-all`  
CN sources: 新华网; 潮新闻  
> DIARY ITEM: early to mid May. Practical consequence framing: book around it.

**72 · 15 Apr · P6 Seasons** · Labour Day on Moganshan: five days you probably want to avoid  
`moganshan labour day / may holiday china` · 1,300w · `go/stays-all`  
CN sources: 限流 and 交通管制 notices  
> Second of the two hard holidays. Reuse the crowd-calendar component.

**73 · 18 Apr · P6 Seasons** · Fireflies at Beihu: the season, the booking, the etiquette  
`fireflies china / moganshan fireflies` · 1,500w · no affiliate  
CN sources: 云起萤光水森林; 萤光嘉年华  
> A mass-market Chinese draw with essentially no English presence. June to September, evening slots.

**74 · 21 Apr · P1 Practicals** · Toilets, water and what to carry on the Moganshan paths  
`moganshan hiking what to bring` · 900w · no affiliate  
CN sources: field data  
> Short utility page. Gap-list question 41.

**75 · 24 Apr · P2 Villages** · Le Passage Mohkan Shan: a French chateau on a Chinese mountain  
`le passage mohkan shan` · 1,400w · `go/stay-le-passage-mohkan-shan`  
CN sources: 法国山居 coverage  
> Property page already exists; this is the editorial deepening.

**76 · 27 Apr · P7 Compare** · Moganshan vs Nanxun: two versions of quiet  
`moganshan vs nanxun` · 1,500w · `go/stays-all`  
CN sources: none  
> Nanxun is thinly covered in English. Both claim 'the less touristy option'.

**77 · 30 Apr · P3 Trails** · Rafting season: the three runs and which is which  
`moganshan rafting / piaoliu china` · 1,500w · no affiliate  
CN sources: 十八道漂流; 高山森林漂流; 江南瑶坞  
> Zero English coverage. Season opens in June.

**78 · 3 May · P3 Trails** · Camping and glamping on Moganshan  
`moganshan camping / glamping china` · 1,700w · `go/stays-all`  
CN sources: 露营地 listings; 星空营地  
> Zero hits for glamping on the current site.

**79 · 6 May · P5 History** · The Republic library at Yucun: 20,000 issues, free entry  
`moganshan republic library` · 1,100w · no affiliate  
CN sources: 黄郛西路50号; opening hours  
> Free, Tuesday to Sunday, 600-plus Republic-era periodical titles. Nobody in English knows it exists.

**80 · 9 May · P3 Trails** · Canyoning at Fatou gorge: the summer water play locals do  
`moganshan canyoning / susi china` · 1,400w · no affiliate  
CN sources: 筏头峡谷; 龙出没; 小九寨  
> Summer's number one Chinese activity query. Invisible in English.

**81 · 12 May · P7 Compare** · Moganshan for older travellers  
`moganshan for seniors` · 1,400w · `go/stays-all`  
CN sources: 60-69 and 70+ ticket concessions  
> Distinct from the existing accessibility page. Includes the 70-plus free-entry rule.

**82 · 15 May · P2 Villages** · naked Stables, fifteen years on  
`naked stables review / naked stables moganshan` · 1,900w · `go/stay-naked-stables`  
CN sources: 裸心 official; 界面新闻  
> The property that made Moganshan famous, assessed honestly against a 600 RMB guesthouse.

**83 · 18 May · P1 Practicals** · Drone rules in the scenic area  
`drone china scenic area / moganshan drone` · 1,000w · no affiliate  
CN sources: 景区 regulations  
> Zero mentions on the current site. Growing traveller question.

**84 · 21 May · P6 Seasons** · Summer nights: the light shows, the drones, the extended shuttles  
`moganshan at night` · 1,500w · `go/tickets-moganshan`  
CN sources: 腾讯 光影秀 2025-07; 昼观云海夜揽星河  
> Launched July 2025, shuttles extended to 21:30. No English coverage at all.

**85 · 24 May · P6 Seasons** · Escaping the heat: why Moganshan is 6 to 10 degrees cooler  
`moganshan summer / escape shanghai heat` · 1,400w · `go/stays-all`  
CN sources: 中国天气网 101210204004; 避暑 sources  
> The historic reason the place exists. Data-led, with the town-level forecast.

**86 · 27 May · P8 Around** · Tianji Sengu: luge, bungee and the 68-metre tower  
`tianji sengu deqing / luge china` · 1,400w · no affiliate  
CN sources: 天际森谷; 大河票务  
> A 3.5km New Zealand luge run 30 minutes from the mountain. Nobody in English mentions it.

**87 · 30 May · P1 Practicals** · Mosquitoes, leeches and snakes: what's real, month by month  
`moganshan mosquitoes / hiking china insects` · 1,100w · no affiliate  
CN sources: 花露水 advice in every Chinese guide  
> Gap-list question 40. Calm, factual, month by month.

**88 · 2 Jun · P7 Compare** · Moganshan for remote work: the digital nomad experiment, honestly  
`digital nomad china / moganshan remote work` · 1,700w · `go/stays-all`  
CN sources: 木可合作社; 网易 coverage  
> Includes the honest failure modes and corrects the Anji DNA conflation.

**89 · 5 Jun · P8 Around** · Jiangnan Yaowu and the night rafting  
`jiangnan yaowu deqing` · 1,300w · no affiliate  
CN sources: 江南瑶坞  
> Free entry after 17:00, night rafting, over half of visitors stay overnight.

**90 · 8 Jun · P6 Seasons** · Summer weekends: when the tour buses arrive  
`moganshan crowds / best time to visit moganshan` · 1,200w · no affiliate  
CN sources: 限流 data  
> Gap-list question 46. Be an hour ahead of the buses.

### Q4 · 11 June to 12 September 2027

Summer peak, family content, and the adjacent destinations that turn a two-day trip into four. Closes with the annual corrections piece.

**91 · 11 Jun · P4 Food** · Farmhouse food: what nongjiacai actually means here  
`nongjiacai / chinese farmhouse food` · 1,300w · no affiliate  
CN sources: 土鸡汤; 笋干老鸭煲  
> Names dishes, not vibes. Companion to the where-to-eat hub.

**92 · 14 Jun · P7 Compare** · Moganshan with a toddler: stroller routes and the ones to skip  
`moganshan with toddler / stroller friendly` · 1,300w · `go/stays-all`  
CN sources: 杨树林环线  
> Yangshulin loop is the stroller answer. Sword Pond's 500 steps are not.

**93 · 17 Jun · P2 Villages** · Biwu: the hamlet that started the design-homestay wave  
`biwu moganshan / dale zhiye` · 1,400w · `go/stays-village-biwu`  
CN sources: 大乐之野 origin  
> Where Dale Zhiye began. Pairs with the Dragon Pool trail piece.

**94 · 20 Jun · P4 Food** · Shaobing and chagao: breakfast on the mountain  
`chinese breakfast moganshan` · 1,000w · no affiliate  
CN sources: 沈字烧饼; 群芳烧饼; 新市根芳茶糕  
> Named stalls with addresses and hours.

**95 · 23 Jun · P5 History** · The zhaijidi reform: how villagers were allowed to lease their houses  
`china rural land reform homestay` · 2,200w · no affiliate  
CN sources: 宅基地改革 coverage; Feeling the Stones  
> The policy engine behind the entire phenomenon. Genuinely interesting and completely unwritten in English.

**96 · 26 Jun · P3 Trails** · Yangshulin loop: the flat walk that works with a pushchair  
`moganshan easy walk with kids` · 1,100w · no affiliate  
CN sources: 绿色旅行网 杨树林环线  
> 3km flat from the sports park.

**97 · 29 Jun · P7 Compare** · Moganshan vs Xitang  
`moganshan vs xitang` · 1,400w · `go/stays-all`  
CN sources: none  
> Same mountain-versus-water-town frame as Wuzhen, lower volume, lower competition.

**98 · 2 Jul · P8 Around** · Deqing beyond the mountain: a day in Qianyuan  
`qianyuan deqing old town` · 1,300w · no affiliate  
CN sources: 乾元古城; 赵家弄  
> Deqing is named 70 times on the site as a prefecture and never as a place.

**99 · 5 Jul · P6 Seasons** · Star camping and night rides: the summer programme  
`moganshan stargazing / night activities` · 1,200w · `go/stays-all`  
CN sources: 800-plus 民宿 night-activity subsidies  
> Part of the formalised night economy.

**100 · 8 Jul · P6 Seasons** · Where the tour groups go, and how to be an hour ahead  
`avoid crowds moganshan` · 1,300w · no affiliate  
CN sources: 景区 flow data  
> Practical, contrarian, very shareable.

**101 · 11 Jul · P8 Around** · Xiangyue Lake: roses, horses and chestnuts  
`xiangyue lake deqing` · 1,200w · no affiliate  
CN sources: 象月湖国际休闲度假谷  
> 2,800 mu, equestrian club, chestnut picking in October.

**102 · 14 Jul · P3 Trails** · Moganshan sunrise: the terrace, the gate, and the workaround  
`moganshan sunrise` · 1,200w · `go/stays-all`  
CN sources: 旭光台; gate hours  
> Follows up the cloud-sea explainer with the operational answer.

**103 · 17 Jul · P9 News** · The summer season programme: 100 events, decoded  
`moganshan summer events` · 1,500w · `go/stays-all`  
CN sources: 莫干山里好清凉 避暑季; 潮新闻  
> DIARY ITEM: mid-July. One umbrella document covers the whole summer.

**104 · 20 Jul · P2 Villages** · naked Castle vs naked Stables vs naked Retreats  
`naked castle vs naked stables` · 1,600w · `go/stay-naked-castle + go/stay-naked-stables`  
CN sources: 裸心 official  
> Three brands, three price points, constant confusion. High commercial intent.

**105 · 23 Jul · P5 History** · Dressing up: the qipao photo shoot industry  
`moganshan photography / qipao photoshoot china` · 1,300w · no affiliate  
CN sources: 民国旗袍 旅拍  
> A visible on-the-ground industry English writing never mentions.

**106 · 26 Jul · P6 Seasons** · The rainbow road and the fish-scale weir  
`moganshan photo spots` · 1,200w · no affiliate  
CN sources: 彩虹路; 鱼鳞坝  
> The two most-photographed non-historic spots. Where they are and when the light works.

**107 · 29 Jul · P7 Compare** · Moganshan vs Zhujiajiao: near and easy, or far and worth it  
`moganshan vs zhujiajiao` · 1,400w · `go/train-shanghai-deqing`  
CN sources: none  
> Zhujiajiao owns 'easiest day trip from Shanghai'. Take the 'worth the extra hour' position.

**108 · 1 Aug · P4 Food** · Eating without Mandarin: menus, apps and the picture problem  
`ordering food in china no chinese` · 1,400w · no affiliate  
CN sources: field test  
> Foreigner cluster. Pairs with the payments and eSIM pieces.

**109 · 4 Aug · P2 Villages** · Liaoyuan and the 1932 cultural park  
`liaoyuan village moganshan / 1932 yucun` · 1,300w · no affiliate  
CN sources: 1932庾村文创园; 白云美术馆  
> Free, year-round, an ex-silkworm facility turned cultural quarter.

**110 · 7 Aug · P8 Around** · Anji in two days from Moganshan  
`anji from moganshan / anji bamboo` · 1,700w · `go/stays-all`  
CN sources: 安吉 云上草原; 余村  
> Converts the vs-Anji comparison traffic into an itinerary.

**111 · 10 Aug · P4 Food** · Vegetarian, vegan and allergies on Moganshan  
`vegetarian china travel / vegan moganshan` · 1,300w · `go/stays-all`  
CN sources: 一叶山居 vegan hotel  
> There is a genuinely vegan hotel on Mogan Lake. Nobody in English knows.

**112 · 13 Aug · P3 Trails** · Guaishijiao, Dakeng and the sights not worth your afternoon  
`moganshan what to skip` · 1,300w · no affiliate  
CN sources: 当旅网 避坑攻略; unanimous Chinese verdict on 大坑  
> Chinese guides are unanimous that Dakeng is a waste. English guides list it as an attraction. Say so.

**113 · 16 Aug · P4 Food** · Buying tea to take home: what's worth carrying  
`buy chinese tea moganshan` · 1,200w · no affiliate  
CN sources: 云鹤山房; 光明茶场  
> Souvenir intent, zero coverage on the site.

**114 · 19 Aug · P3 Trails** · The Spartan base at Jun An Li  
`spartan race china / jun an li moganshan` · 1,400w · `go/stays-all`  
CN sources: 盛力世家 signing; 郡安里  
> Opened Q4 2026. Verify operating status before publishing.

**115 · 22 Aug · P8 Around** · Hangzhou in two days, after the mountain  
`hangzhou after moganshan` · 1,700w · `go/train-hangzhou-deqing`  
CN sources: none  
> Captures Hangzhou volume and routes it back into stays.

**116 · 25 Aug · P7 Compare** · Moganshan vs Tonglu  
`moganshan vs tonglu` · 1,200w · `go/stays-all`  
CN sources: none  
> Near-zero competition. Small reward, easy win.

**117 · 28 Aug · P1 Practicals** · Health, pharmacies and what happens if you're hurt on a trail  
`medical care rural china / moganshan emergency` · 1,400w · no affiliate  
CN sources: local clinic verification  
> Pharmacy appears nowhere on the current site.

**118 · 31 Aug · P6 Seasons** · Autumn on Moganshan: the connoisseur's month is September  
`moganshan september / best month moganshan` · 1,500w · `go/stays-all`  
CN sources: Chinese guides call September the quiet good-weather window  
> Contrarian and true. Rewrite target for /seasons/autumn.

**119 · 3 Sep · P1 Practicals** · The Hangzhou-Deqing rail line: what an hour without transfers changes  
`hangzhou deqing rail / getting to moganshan 2027` · 1,600w · `go/train-hangzhou-deqing`  
CN sources: 杭德市域铁路 coverage  
> The single biggest structural change to Moganshan access. Track the opening and publish on it.

**120 · 6 Sep · P4 Food** · Souvenirs: bamboo, tea, and what's actually made here  
`moganshan souvenirs` · 1,200w · no affiliate  
CN sources: 乡忘茶礼; 野有集  
> Souvenir returns zero hits on the current site.

**121 · 9 Sep · P8 Around** · Shanghai in three days, before or after  
`shanghai and moganshan itinerary` · 1,800w · `go/train-shanghai-deqing`  
CN sources: none  
> Closes the loop for the inbound visitor. Highest-volume adjacent term on the plan.

**122 · 12 Sep · P9 News** · A year on Moganshan: what we got wrong  
`moganshan travel guide accuracy` · 1,800w · no affiliate  
CN sources: the year's corrections log  
> Year-two set piece. Publishing your own corrections is the strongest trust signal available and no competitor does it.

---

## Part 7: The news layer calendar

### Weekly dispatch

Every **Thursday**, 52 a year, first on **17 September 2026**, last on **9 September 2027**. 600 to 900 words, three to six items, each with a mandatory visitor-consequence line. Full dates in `news-calendar.csv`.

**The Wednesday sweep, 90 minutes.** In priority order:

1. **德清新闻网 tourism** `dqnews.zjol.com.cn/dqnews/ssdq/stly/` and politics `/dqnews/xwzx/sznews/`. No robots restrictions, date-in-URL, four to six tourism items a week. **Carries roughly 70% of any given week.**
2. **迈点网 search** `meadin.com/search?keyword=莫干山`, plus `meadin.com/sitemap_index.xml`. Fully crawlable. Catches every hotel opening and signing.
3. **德清县人民政府** notices `deqing.gov.cn/col/col1229212609/`, news `col1229212604` and `col1229212607`. Authoritative for prices, closures, ratings. Needs China routing.
4. **浙江在线 湖州频道** `zjnews.zjol.com.cn/zjnews/huzhounews/` for the regional frame.
5. **潮新闻** `tidenews.com.cn` for provincial features on Deqing.
6. **Moganshan town weather** `forecast.weather.com.cn/town/weather1dn/101210204004.shtml`. The road-closure leading indicator.
7. **澎湃新闻 澎湃浙江**. Low frequency, the only source likely to publish something critical worth translating.

**Triage.** Three tests or the item is dropped: did something change, does it carry a date, would a visitor do anything differently.

### Breaking dispatch triggers

| Trigger | Response time |
|---|---|
| Ticket price or policy change | Same day |
| Closure or road restriction | Same day |
| Entry-rules change for foreigners | Same day |
| Transport change | Within 48 hours |
| Major property opening or closing | Within a week, **after** confirming it is trading |
| Event announcement or cancellation | Within a week |

### Annual fixtures

Fourteen dated moments where the news writes itself.

| Date | Fixture | Source | Priority |
|---|---|---|---|
| 28 Sep 2026 | **Golden Week programme drops** · Published 7-10 days before each Golden Week | 德清发布 / 爱德清 / 潮新闻 | HIGH |
| 20 Jan 2027 | **Moganshan's 2027 race calendar** · Annual sports presser (mid-Jan) publishes the full year of events in one article | 德清新闻网 dqnews.zjol.com.cn/dqnews/xwzx/sznews/ | HIGH |
| 27 Jan 2027 | **Spring Festival programme drops** · Published 7-10 days before CNY | 德清发布 / 爱德清 | MEDIUM |
| 10 Feb 2027 | **The ten openings for 2027** · Resort's 新春第一会 publishes its ten headline openings | deqing.gov.cn col1229212604 | HIGH |
| 18 Mar 2027 | **First Mogan Huangya picked** · Tea opening, usually mid-March | 德清新闻网 tourism channel | MEDIUM |
| 24 Mar 2027 | **Climbing festival opens the walking season** · Late March, lineage claimed to 1934 | 德清新闻网 + deqing.gov.cn | MEDIUM |
| 25 Mar 2027 | **Homestay Conference** · Mid-to-late March; verify the 2027 edition exists | 中国日报 zj + 腾讯 | MEDIUM |
| 14 Apr 2027 | **Ultra-Trail Mogan by UTMB** · Race weekend, roughly 10-12 April | mogan.utmb.world | HIGH |
| 21 Apr 2027 | **Tea King contest** · Mid-April, 茶王赛 | 德清新闻网 | LOW |
| 12 May 2027 | **World Brand Moganshan Conference** · Early-to-mid May; rooms tighten county-wide | 新华网 + 潮新闻 | HIGH |
| 23 Jun 2027 | **Zhejiang Triathlon, Xiazhu Lake leg** · Late June | ihuipao.com | LOW |
| 16 Jul 2027 | **Summer season launch, 100-plus events** · Mid-July umbrella programme | 潮新闻 tidenews.com.cn | HIGH |
| 22 Sep 2027 | **The Moganshan Conference** · Late September, descendant of the 1984 meeting | 中国日报 zj | MEDIUM |
| 25 Oct 2027 | **Kailas Moganshan Skyrace** · Late October, 100k/70k/35k/10k | moganshan.saihuitong.com | HIGH |

**The two that matter most.** The **mid-January outdoor sports press conference** publishes the entire year's race calendar in one article on 德清新闻网. The **early-February 新春第一会** publishes the resort's ten headline openings in one government document. Between them they pre-announce most of the year. Diary both.

### Standing watch items

Facts with a known expiry, checked without waiting for news.

| Item | Why | Check |
|---|---|---|
| Unilateral visa-free scheme | Expires 31 December 2026, no extension announced | Monthly, weekly from November 2026 |
| 杭德市域铁路 Hangzhou-Deqing line | Due around end-2026. Biggest structural change to access. | Monthly |
| Four Seasons Moganshan | Announced for 2030 | Quarterly |
| Ticket tariff | Sources disagree, tiering may change seasonally | Quarterly, plus before each Golden Week |
| Shuttle hours and last bus down | Varies seasonally, extended to 21:30 in summer 2025 | Seasonally |
| Moganshan Lodge operating status | Still listed by Lonely Planet and TripAdvisor, likely defunct | Once, then close out |
| Spartan base at Jun An Li | Announced for Q4 2026 | Quarterly until confirmed trading |


---

## Part 8: Q1 in detail, slots 1 to 30

Full briefs are in `content-briefs-q1.md`. The operationally critical points:

**Production order differs from publication order.** Do **slot 3 (tickets) first**, even though it publishes third. Its verification chain is the longest, it feeds five other pieces, and it is the page most likely to be linked and quoted.

**One field trip covers eight slots.** Mid-October: slots 10, 14, 28 (GPS, timing, surface), 20 (mobile coverage tested along the same routes), 11, 23 (food and cafés, photographs, confirm trading), 2, 6 (transfer centre services, kennels, luggage).

**Phone work, four slots.** Slot 3 (0572-8412345 for the tariff), slot 13 (20 to 30 properties on passport registration), slot 22 (winter closures), slot 27 (kennel service still running).

**Slot 13 is the highest-value piece on the plan.** "Can a guesthouse refuse your passport?" requires calling or messaging 20 to 30 properties across price bands and villages, then publishing the results as a dated table with the method stated. Nothing like it exists for any destination in China. Refresh annually.

**Slot 10 is the flagship trail piece.** The Chiang Kai-shek path, 4 km one way and about +400 m, full loop 10 to 12 km and about +560 m, running 庾村 → 莫皋坞 → 狡猾坡 → 剑池 → 四叠瀑布, and it is free because it bypasses the ticket gate. No English source has ever described it. Publish the GPX.

**Facts already gathered for Q1, all requiring re-verification before publication:**

- Car ban 08:00 to 17:30 daily, core scenic area, since 30 November 2018. Exception requires both an in-park room booking and a parking reservation. Parking 10 to 25 RMB per day.
- Two transfer centres. 庾村换乘中心 main. 后坞换乘中心 08:30 to 17:00, last up 16:30, last down 17:00. Up-and-down shuttle 35 RMB return, separate internal shuttle 15 RMB unlimited. **Free luggage storage and free large-dog kennels with rentable carriers.**
- Ticket sources disagree: 80 RMB baseline, tiering reported at 100 peak / 80 shoulder / 50 low, online at 85 and 65, bundles at 110 to 135. Gate ticket normally valid two days. Entry 08:00 to 17:00, indoor sites 08:30 to 16:30.
- Free entry: under 1.2 m or under 6, 70 and over with ID, active military, registered disabled, Zhejiang teachers with 30-plus years' service. Half price: 1.2 to 1.4 m, full-time students to undergraduate, ages 60 to 69.
- Deqing station: Hangzhou East about 13 min and 12 to 17.5 RMB, Shanghai Hongqiao about 1.5 to 2 h and 93.5 RMB. Y1 tourist line to Yucun, about 70 min, infrequent. Taxi 50 to 80 RMB, about 30 min. K111 to Wukang.
- Named noodle shops: 杏仙面店 Huangfu East Rd 15, 阿庆嫂面馆 Huangfu East Rd 9, 回忆面馆 Duihekou St 27, 梅溪·小伙子干挑面.
- Yucun free venues: 1932庾村文创园, 莫干山民国图书馆 Huangfu West Rd 50 (Tue to Sun 09:00 to 16:30, 600-plus Republic-era periodical titles, 20,000-plus issues), 白云美术馆 Huangfu West Rd 48, 青芷Space.
- Rural coffee: 洞穴咖啡 (brand 仅莫干) in a cave at 铜官山, Hecun, opened 2024. 格里恩咖啡 in a quarry pit at Wusi, owner 谷雪松, 2,000-plus visitors a day over May Day 2025. 人民日报 feature 30 May 2025. Over 70% of founders are post-90s or post-95s.

**Q1 totals.** 30 pieces, about 43,500 words. P1 Practicals 10, P2 Villages 5, P3 Trails 4, P4 Food 3, P5 History 2, P6 Seasons 5, P7 Comparisons 1.

---

## Part 9: Build order

| Phase | Work | Ship by | Blocks |
|---|---|---|---|
| **0a** | Authors collection, author pages, `/about/team`, Person schema, Dateline component, `/about/how-we-report` | **13 Sep 2026** | Every piece |
| **0b** | Three date fields, content schema, hash guard, sitemap `lastmod`, freshness tiers, migrate 78 pages | **13 Sep 2026** | Every piece |
| **1a** | RMB conversion, ratings stripped or labelled, seven directories noindexed and desitemapped | **13 Sep 2026** | Nothing, but ship it now, it is cheap |
| **1b** | Dispatch permalinks, `NewsArticle` schema, news index with pagination, retro-fit eight entries | **16 Sep 2026** | First dispatch, 17 Sep |
| **1c** | RSS with autodiscovery, news sitemap, year archive | **16 Sep 2026** | Distribution |
| **1d** | Journal into main nav, dispatch teaser on homepage and volatile pages | **16 Sep 2026** | Traffic to the layer |
| **2a** | Village, trail, comparison templates; price table and crowd calendar components; nine new `/go/` slugs | **26 Sep 2026** | Slots 4, 5, 10 |
| **2b** | Core editorial, slot 1 onward | **from 14 Sep 2026** | The plan |
| **3** | GPX pipeline and elevation profiles; revision queue tool; topic pages; corrections log | Q4 2026 | Trail slots and the moat |
| **4** | Directory consolidation into village and property pages; the two data assets | Q1 to Q2 2027 | Long-term index health |

### Final acceptance checklist

- [ ] Every editorial page has a named human author linked to a real author page
- [ ] Zero fabricated author records
- [ ] `datePublished`, `dateModified` and `dateChecked` are three distinct, correctly-behaving fields
- [ ] A CSS-only change bumps zero `dateModified` values
- [ ] Sitemap emits `lastmod` on every URL
- [ ] No USD anywhere on the site
- [ ] No unattributed rating anywhere on the site
- [ ] Seven directory pages noindexed, all `/go/` redirects intact
- [ ] Dispatch permalinks, `NewsArticle` schema with citations, RSS, news sitemap all live
- [ ] `/journal` in the main navigation
- [ ] Nine new village storefront slugs in `vercel.json`
- [ ] Slot 1 published on 14 September 2026, first dispatch on 17 September 2026

---

## Open decisions for the site owner

Do not resolve these unilaterally. Leave marked `TODO` until answered.

1. **Whose name goes on the byline.** Recommendation is Cyril Drouin, using real and verifiable credentials. Alternative is a named contributor who genuinely does the work. Fabricating a persona is not an option.
2. **Whether `/about/how-we-report` discloses AI-assisted drafting.** Google does not require it. The site's voice arguably does.
3. **Whether the 809 listings eventually move behind a single noindexed browse tool** or stay as seven noindexed pages indefinitely. Phase 4 assumes the former.
