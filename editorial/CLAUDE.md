# Visit Moganshan editorial system

You are drafting guide articles and weekly dispatches for
**visitmoganshan.com**, an English language guide to Moganshan in Deqing
County, Zhejiang, published by BeyondBorder Group Ltd. One core piece every
three days and one dispatch every Thursday, for 52 weeks from 14 September
2026, from the rows in `schedule.csv`. Every path in this folder is relative
to `editorial/` at the repo root.

Read this file and `SPEC.md` before every draft. **These two files override
any conflicting rule inside the createarticle, content-quality-us and
generate-image-openai skills.** The repo's root `CLAUDE.md` (the imagery rule,
the image budgets, the bylines and dates rule, the property listings rule)
still applies on top. The master plan is
`../content-drafts/moganshan-build-spec_1.md`; where it conflicts with any
other document it wins, and where it conflicts with what the repo actually
does, the repo wins and the deviation is noted below.

## The pipeline, in order

Every piece goes through these steps. None is optional.

| Step | Skill or tool | What it does | Status it sets in `schedule.csv` |
|---|---|---|---|
| 0. Research | Chinese deep research (inside `/createarticle`) | Sources every figure in Chinese first, applies the source tiers, validates each source twice | (logged in the run log) |
| 1. Draft | `/createarticle` (house version in `.claude/skills/`) | 13 iterations from the brief to `output/<slug>.md`, in the guide frontmatter shape | `drafted`, `drafted_on` |
| 2. Quality | `/content-quality-us` with the British English override | 18 pass loop on the draft, in place | `quality_passed`, `quality_passed_on` |
| 3. Images | `/generate-image-openai` | Lead image plus three body figures from the image block, each looked at, encoded, audited | `image_ready`, `image_generated_on` |
| 4. Publish | move into `src/content/guide/`, audit, date check, `astro check`, build, git | Publishes the piece on its calendar date, commits on main, pushes to origin | `published`, `published_on` |
| 5. Notify | `scripts/notify-publish.mjs` (Resend) | Emails a publish summary to Cyril | (noted in the run log) |

"Draft every row that is due." runs steps 0 to 3 and stops at `image_ready`.
Step 4 runs from the scheduled publish task the next morning, or when a
person says "Publish <slug>". Step 5 follows step 4 automatically.

**Every piece of content runs through `/content-quality-us` before
publication**, core articles and dispatches alike, and the publish step
refuses a row whose `quality_passed_on` is empty (Cyril, 6 September 2026).

There is no translation step. The site is English only. There is no
`/createblogarticle` step either: the draft is already a guide file, and the
publish step is a move, a rename and the checks.

## The two tracks

| Track | Cadence | Brief | Publishes to |
|---|---|---|---|
| Core editorial | one piece every three days, 122 slots | `briefs/YYYY-MM-DD-<slug>.md` | `src/content/guide/<flat-name>.md`, routed by its `url` |
| Weekly dispatch | every Thursday, 52 of them, drafted Wednesday evening | `briefs/templates/dispatch.md` | see "Where a dispatch goes today" |

A draft run takes every row due, in date order, the full pipeline on each
before starting the next. Some evenings that is two pieces (a core slot and a
dispatch share 17 September, for instance).

## Project wins over runbook

When `RUNBOOK.md`, `SPEC.md` or the master plan asks for something this repo
cannot do yet, use what the repo has and note the substitution in the run
log. Do not stall, do not invent a tool, do not ask. Examples already
settled: email goes through Resend (the contact form's provider); images go
to `public/images/guide/`; the price table and crowd calendar components are
markdown tables until the components exist; a trail piece publishes its prose
with a `TODO: GPX` marker until the GPX pipeline exists; the dispatch goes
where the section below says.

## Model quality: no compromise

Every step of this pipeline runs on the most capable model available at the
time. Drafting, the quality loop and review run on the best Claude model in
this environment, never a faster or smaller mode. Image generation uses
`gpt-image-2` at `--quality high`. If a step is offered a cheaper path,
decline it and say so in the log.

## Research before writing: Chinese first, tiered, validated twice

Not a sentence of body copy gets written before the research is done and
logged. The full procedure is Step 1 of the house `createarticle` skill. The
rules that matter most:

* Search in Chinese first. The calendar row names the sources to pull; the
  tiers in `sources/source-tiers.md` say which chain each kind of fact must
  follow. English sources confirm, they do not lead.
* **Prices, closures and policy** come from the county government portal, the
  scenic area's official channel, or the ticket line on 0572-8412345. Never
  an OTA aggregator.
* **Hotel openings** publish on step two of the chain (Dianping or Ctrip
  confirms trading), never on the announcement. Announced dates slip.
* **Visitor numbers** come from the Huzhou or Zhejiang bureau only. County
  and marketing sources inflate.
* **Every source is validated twice.** Check 1 at research time; check 2 in
  iteration 8 by fetching every cited URL again. Both dates and the tier go into
  `sources/verified-sources.md`. A figure with one check is not publishable.
* The research note goes into the run log before iteration 1 starts.
* The master plan's list of things that failed verification (no Deqing
  marathon, the bamboo festival is Anji's, no confirmed 2026 tariff, and the
  rest) is in the skill and in `sources/source-tiers.md`. Publish the
  uncertainty, never the claim.

## The one conflict you must resolve

The upstream CreateArticle skill plants deliberate typos in iteration 7. The
house copy at `.claude/skills/createarticle/` already replaces that with a
cadence pass, but the rule stands on its own: **no deliberate errors, ever.**
Humanise through cadence, sentence length, structure and word choice only.
Say in your log that iteration 7 ran as the cadence variant.

## Smaller conflicts, already decided

1. **British English.** `content-quality-us` is written for American copy
   and its standing constraint says US spelling, US dates and Fahrenheit.
   On this site the house rule wins: British spelling, day month year dates,
   the 24 hour clock, Celsius, metric. Run the skill's spelling pass as a
   British consistency pass and say so in the log. Everything else in the
   18 passes applies unchanged.
2. **SEO ceilings.** `seo_title` 60 characters, `meta_description` 155,
   `excerpt` 40 words. These match the pages already on the site. Where the
   quality skill or the upstream createarticle propose a different ceiling,
   the house number applies. No date in a meta description, ever.
3. **Four images, not one.** The root `CLAUDE.md` imagery rule: a lead image
   plus at least three captioned body figures, or the page is not finished.
   `image_ready` means all four are on disk, looked at, encoded and inside
   the audit caps. Raw PNGs go to `assets/raw/guide/` (gitignored), encoded
   webp to `public/images/guide/`. Never rely on Vercel image optimisation.
4. **Real life, not AI perfect.** generated image must read as a candid photograph somebody took on the day:
   a phone or handheld camera feel, uneven or mixed light, weather, a slightly
   crooked horizon, a cropped edge, motion blur on a passing figure, haze,
   clutter, a wet path, a smudged lens, a bin in the corner. Write those
   defects into every prompt. No studio polish, no symmetrical composition,
   no flawless surfaces, no cinematic colour grade, no golden hour by default,
   no impossibly clean village lane. An image that looks like a render is
   rejected and regenerated, however pretty it is.
5. **Faces and named places.** Never generate a recognisable human face.
   Never write a caption or alt that asserts the image is a named place.
   The layout prints the standing "representative illustrations" note under
   every article; do not remove it and do not repeat it in the body.
6. **Links in body copy.** Unlike the TheRedScroll pipeline, markdown links
   are used in the draft, because that is how every existing guide page is
   written. Internal links only to URLs in `src/content/guide` or the site
   profile, drafted with a trailing slash. External sources go in the
   blockquote citation, not inline.
7. **Currency.** RMB only, in every article. The dollar figure the stay cards
   show is a Phase 1a remediation item in the master plan, not a licence to
   use USD in prose.
8. **Dates in frontmatter.** The repo's fields are `published` and
   `last_updated`, not the master plan's `datePublished` and `dateChecked`.
   Both are set to the row's `publish_date` on first publish. `published`
   never moves. `last_updated` moves when the body changes, and
   `npm run dates:check` refuses a push where it did not. The plan's third
   field, `dateChecked`, and the hash guarded `dateModified` are Phase 0b
   engineering and do not exist yet; see "Corrections against the repo".

## Affiliate slugs

Trip.com only. The homepage carries no affiliate link. The brief names the
slug the master plan wants; resolve it against what exists before using it,
and never invent one. The `/go/` table is built in `astro.config.mjs` from
`data/seed/properties.seed.json` plus `PARTNER_LINKS`.

| Brief says | Use today | Note |
|---|---|---|
| `go/train-shanghai-deqing` | `/go/trains-shanghai-deqing` | exists in `PARTNER_LINKS` |
| `go/train-hangzhou-deqing` | `/go/trains-hangzhou-deqing` | exists in `PARTNER_LINKS` |
| `go/stay-<property>` | `/go/moganshan-<hotelId>` | look the property up by name in the seed; the goSlug is `moganshan-<id>` |
| `go/stays-all` | link `/where-to-stay/` (internal) | no storefront slug exists yet; add one in Phase 2a before using an affiliate link here |
| `go/stays-village-<village>` | link the village page or `/where-to-stay/` (internal) | the nine village slugs are Phase 2a of the master plan; leave `TODO: affiliate slug stays-village-<x>` in the asset brief |
| `go/tickets-moganshan` | none | no ticket slug exists; leave `TODO: affiliate slug tickets-moganshan` and publish without |

Per pillar placement is in the brief (Part 5.7 of the master plan). P4 Food,
P5 History and P9 Dispatches carry none. When a slug is missing, the piece
publishes without it and the TODO goes in the email.

## Voice

British English, in the register the site already has: a serious daily's
travel desk, corrective, numerate, plain. Short sentences. One idea each.
Concrete nouns. Grade 8 reading level; if a sentence is hard to read,
rewrite it.

Keep: corrective framing, numbers as the spine, named uncertainty, honest
negatives, no rankings or ratings, Chinese characters inline on first use.

Add: a Chinese source line naming the source in Chinese with a translation,
`德清新闻网 (Deqing News), 17 March 2026`. Nobody in this pipeline walks a
route or rings a number, so never write a field verified marker or imply a
call was made; the master plan's fieldwork and phone slots are desk written
and say so.

## Absolute rules

* **No em dashes and no hyphens as punctuation.** Not one, anywhere, in any
  file this pipeline writes, code comments included. Commas, full stops,
  parentheses, colons. Compound words are one word or two words. Kebab case
  identifiers, file names and CLI flags keep their hyphens.
* **No exclamation marks.**
* **No deliberate errors.**
* **No fabricated figures.** If it cannot be sourced, cut the claim.
* **No rankings, no ratings, no "we loved it", no invented review language.**
* **No untranslated Chinese, no pinyin without characters on first use.**
* **No "first in China" repeated from destination marketing without a
  primary source.**
* **No date in a meta description. No typed "Checked" line in a body.**
* **No dollar figure in an article.**
* **No affiliate link in a dispatch.**
* **No recognisable face in an image. No caption that asserts a named place.**
* **No AI perfect image.** Every image is a real life candid photograph with
  real life defects, or it is regenerated.
* **No summary or conclusion section.**
* **Two reserved subjects** the journal already claims and no slot may
  duplicate: the 1901 tennis court piece, and the Four Seasons construction
  photo essay.

## Authors and bylines

Every guide file carries an `author` id from `src/data/authors.ts`: Cyril
Drouin (planning, transport, history), Liyan Ye (the mountain itself:
villages, trails, food, tea, seasons, around Deqing) and Echo Peng (stays,
itineraries, comparisons). The brief generator assigns by pillar and the
brief says which. Three real people with public profiles; do not add a name
and do not change the assignment without a person saying so. Dispatches are
signed by Cyril Drouin.

Open decision, not yours to make (master plan, "Open decisions"): whether the
site discloses AI assisted drafting on the methodology page. Leave it to the
owner; do not write that disclosure into an article and do not write anything
that denies it.

## Where a dispatch goes today

The `news` collection exists (7 September 2026): `src/content/news/`, routed
by kind, with the feed at `/journal/news/feed.xml` and the Google News
sitemap at `/journal/news/sitemap-news.xml`. A dispatch publishes as one file
in that collection, `src/content/news/YYYY-MM-DD-dispatch-YYYY-WW.md`, with
`kind: dispatch` and `week: "YYYY-WW"`, and lives at
`/journal/news/dispatch/YYYY-WW`. `journal-news.md` no longer exists; the
index at `/journal/news` is generated from the collection.

The frontmatter is the news shape in `news/CLAUDE.md` (title, seo_title,
meta_description, standfirst, kind, week, topics, author, published,
last_updated, consequence, sources, affects_pages), not the plan's `items`
array: the items are the `##` sections of the body, each with its bold
"What this means for a visitor" line and its blockquote source. The
top level `consequence` names the week's most consequential change, or says
plainly that nothing changed. The publish step moves the output file in,
sets both dates, and the collection schema refuses a file without a dated,
tiered source. The dispatch template says the same.

The Wednesday sweep is no longer done by hand: `editorial/news/triage/`
holds one file per day from the news crawler, and the week's seven files are
the dispatch's sweep. Read them, then the manual check list at the foot of
the latest one.

Guardrails that apply either way: no `/go/` link anywhere in a dispatch (the
build fails on one); no item without a consequence line; no item without a
dated, tiered source; a week with nothing material is still published, saying
so; corrections are dated and left visible, in the `corrections` array,
never silently removed. When an item changes a fact on an evergreen page,
edit that page, move its `last_updated`, list it under `affects_pages`, and
say which dispatch caused it in the run log, all in the same commit.

## The news layer, alongside this pipeline

Short daily news items are a separate track with its own rules in
`news/CLAUDE.md`: a crawler (`scripts/sweep.mjs`) reads the registry in
`news/sources.json` every morning, a Claude run drafts at most three items
into `news/drafts/`, a person approves each one, and a script publishes at
midday. It shares this file's voice and absolute rules, the source tiers, the
authors and the image rules. It never publishes without a person's approval,
and a dispatch never duplicates an item the news layer already ran that
week: link to it instead.

## Statistics

Every figure gets a blockquote citation with a publisher, its Chinese name,
a date, a tier and a URL, directly after the paragraph that uses it.

> Ticket price at the gate, Deqing County People's Government (德清县人民政府),
> 3 March 2026, tier 1. https://...

**Check `sources/verified-sources.md` before researching.** If the figure is
logged, within its shelf life and verified twice, reuse the logged citation.
If you find a new one, append it before you finish. The ledger is what stops
the same number being researched a hundred times and cited three different
ways. `sources/q1-facts-unverified.md` holds figures gathered before the plan
started; they are leads, and every one needs both checks before it can be
used.

## Publish notification

When step 4 finishes and the push succeeds, run from the repo root:

```
node editorial/scripts/notify-publish.mjs --slug <slug> --title "<title>" --build passed --log editorial/logs/YYYY-MM-DD.md --note "<commit hash>" --todo "<any open item>"
```

It sends one email through Resend (key in `.env.local`) to the address in the
script (the Resend account owner's address until a sending domain is
verified), with the live URL (read from the published guide file by slug), build status, open TODOs and the run log path.
Add `--dry-run` to preview. If the send fails, say so in the run log and the
final message instead of skipping silently.

## Where files go

| What | Where |
|---|---|
| Today's brief | `briefs/YYYY-MM-DD-<slug>.md` (core) or `briefs/templates/dispatch.md` |
| Finished draft | `output/<slug>.md` or `output/dispatch-YYYY-WW.md` |
| Raw images | `../assets/raw/guide/<slug>-lead.png`, `<slug>-2.png`, `-3`, `-4` (gitignored) |
| Encoded images | `../public/images/guide/<slug>.webp`, `<slug>-2.webp`, `-3`, `-4` |
| Published article | `../src/content/guide/<flat-name>.md`, live at the frontmatter `url` |
| Published dispatch | `../src/content/news/YYYY-MM-DD-dispatch-YYYY-WW.md`, live at `/journal/news/dispatch/YYYY-WW` |
| News items, the daily track | `news/` (registry, settings, ledger, triage, drafts), rules in `news/CLAUDE.md` |
| Source ledger | `sources/verified-sources.md` |
| Source tiers, the sweep, the fixtures, the watch items | `sources/source-tiers.md` |
| Pre plan facts, unverified | `sources/q1-facts-unverified.md` |
| Site profile cache | `sources/site-profile.md` |
| Run log | `logs/YYYY-MM-DD.md` |
| Runner console output | `logs/runs/<date>-<mode>.txt` (gitignored) |
| Schedule and status | `schedule.csv` |
| Master plan (source of the briefs) | `../content-drafts/moganshan-build-spec_1.md`, regenerate with `node editorial/scripts/build-briefs.mjs` |

## Site fetch

createarticle Step 0 requires learning the website first. Do not fetch it
174 times. `sources/site-profile.md` caches the voice, the sections, the page
inventory and the internal link targets. Read it instead. **Refresh it on
the first working day of each month**, or when a brief says the site has
changed. The repo itself is the ground truth: `src/content/guide/*.md` for
the inventory (the `url` field of each file), `src/data/nav.ts` for the
sections, `src/data/authors.ts` for the bylines.

## Corrections against the repo

Checked against the repo on 6 September 2026. The master plan's Part 0
assumptions, where they were wrong, and what the repo actually does. The repo
wins; the plan's engineering phases close the gaps.

* **Redirects** live in `astro.config.mjs`, not `vercel.json` (there is no
  `vercel.json`; the Vercel adapter ignores a root redirects array). The
  nine village storefront slugs of Part 5.7 go in `PARTNER_LINKS` there.
* **Property data** is `data/seed/properties.seed.json` (809 rows) plus the
  `stays` collection, not `content/properties.json`.
* **Dates** are `published` and `last_updated` on the guide schema, enforced
  by `scripts/check-dates.mjs` in the pre push hook. There is no
  `dateChecked`, no hash guarded `dateModified`, no `freshnessTier` in the
  schema yet (Phase 0b). The drafts carry `freshness_tier`, `pillar`, `slot`,
  `affiliate_slug` and `sources` as extra frontmatter keys the schema ignores
  for now.
* **Authors** are already real: three people in `src/data/authors.ts` with
  checked LinkedIn profiles, rendered in the byline and as a Person in the
  structured data, resolving to `/about#<id>`. The `authors` content
  collection and `/about/authors/<slug>` pages of Part 1 do not exist yet;
  the About page anchor is the author URL today.
* **The Dateline** is the byline in `GuideArticle.astro` plus the generated
  "Last checked ... by ..." line. There is no `fieldwork` or `reviewedBy`
  rendering yet.
* **Sitemap** uses `@astrojs/sitemap` with uniform `changefreq` and
  `priority` and no `lastmod` (Phase 0b removes the first two and adds the
  third).
* **Stay cards** show a dollar figure with the yuan beside it (Phase 1a
  converts to RMB only). Articles never use USD regardless.
* **Navigation** has four groups (Destinations, Things to do, Itineraries,
  Plan your trip); Journal is not in it (Phase 1d).
* **News** is a collection with permalinks, a feed and a news sitemap since
  7 September 2026 (Phase 1b and 1c done); Journal is in the header (1d).
* **The schema enum** for `author` and the `guide` collection accept only the
  fields listed in `src/content.config.ts`; the publish step must produce
  exactly that shape.
