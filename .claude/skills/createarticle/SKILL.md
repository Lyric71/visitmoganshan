---
name: createarticle
version: 2.2.0-visitmoganshan
description: |
  Draft a production ready guide article for visitmoganshan.com from a brief in
  editorial/briefs/. Runs a Chinese language deep research step with source
  tiers and double validation, then the 13 iteration workflow, British
  newspaper prose, blockquote citations, Chinese characters inline on first
  use, SEO within hard ceilings, the guide collection frontmatter, and an
  appended four image prompt block (one lead, three body figures). House
  version for Visit Moganshan: iteration 7 is a cadence pass, never planted
  errors; iteration 13 writes four image prompts, not one. Pairs with
  content-quality-us run under the British English override.
license: MIT
---

# CreateArticle: guide article builder (Visit Moganshan house version)

Produce one on brand, production ready markdown article for visitmoganshan.com.
The output drops into `editorial/output/` in the exact shape of a file in
`src/content/guide/`, so the publish step is a move and a rename. Run the full
pipeline without pausing for approval.

**House changes from the upstream skill.** The upstream CreateArticle plants
deliberate typos in iteration 7 to defeat AI detection. This version does not:
iteration 7 is a cadence pass. Iteration 13 produces four image prompts, one
lead and three body figures, because the site's standing imagery rule says a
page with fewer than three body figures is not finished. Prose is British
English, not American. No project file can reintroduce planted errors.

## Inputs (required)

1. **website**: always https://www.visitmoganshan.com. Voice, section names
   and internal link targets come from the site profile cache, never assumed.
2. **audience**: people out of China, planning or considering a Moganshan
   trip. The reader does not know the China stack and does not read Chinese.
3. **brief**: a file in `editorial/briefs/`. It carries the slot, the URL, the
   keyword, the word target, the affiliate rule, the author, the freshness
   tier, the template, the angle and the Chinese sources named in the calendar.

## Step 0: learn the website first (mandatory)

Before writing a single line:

1. Read `editorial/sources/site-profile.md` if it is less than a month old.
   Otherwise refresh it from the repo (`src/content/guide/*.md` frontmatter
   `url` fields for the inventory, `src/data/nav.ts` for the sections,
   `src/lib/guide.ts` for the section labels) and from the live site.
2. Read the existing article the brief's URL sits nearest to, and one sibling
   in the same section. Match the frontmatter shape, the way the first
   paragraph orients the reader geographically, the blockquote source style,
   and the figure convention.
3. Note the house phrasing. The site says Moganshan, Deqing, Huzhou, Zhejiang,
   RMB, minsu, the hill station, the scenic area, the transfer centre. Do not
   invent place names, prices, hours or services the sources do not give.

## Step 1: deep research in Chinese (mandatory, before any drafting)

Do not write a sentence of body copy until this step is logged.

1. **Read the ledger first.** `editorial/sources/verified-sources.md`. Any
   figure already logged, dated within the tier's shelf life and marked
   verified twice is reused with its exact citation. Do not research it again.
   `editorial/sources/q1-facts-unverified.md` holds figures gathered before
   the plan started; they are leads, not sources, and every one needs both
   checks before use.
2. **Apply the source tiers.** `editorial/sources/source-tiers.md` says which
   chain each fact type must follow. Prices, closures and policy come from the
   county government portal, the scenic area's own channel, or the ticket line
   on 0572-8412345, never from an OTA aggregator. Hotel openings publish on
   confirmation of trading, not on the announcement. Visitor numbers come from
   the Huzhou or Zhejiang bureau only. Marketing accounts (爱德清, 德清发布,
   文旅浙江, brand newsrooms) are tips, not facts.
3. **Research in Chinese.** Search with simplified characters and the names
   the master plan uses: 德清新闻网, 德清县人民政府, 迈点网, 浙江在线, 潮新闻,
   游侠客, 当旅网, 绿色旅行网, 中国天气网. English sources confirm; they do not
   lead. Follow every figure to its original source.
4. **Validate every source twice.** Check 1 at research time: fetch the URL,
   confirm the number, the unit, the period and the date are on the page.
   Check 2 in iteration 8: fetch every cited URL again and confirm it still says
   what the blockquote says. Any mismatch: fix the citation or cut the claim.
5. **Write the research note before drafting.** Each claim with its Chinese
   source, the English gloss, the date, the URL, the tier and the check 1
   result. It goes into the run log. A figure without a passing check 1 does
   not enter the draft.
6. **Append to the ledger** before finishing, with both check dates and the
   tier.

**Do not publish these. They failed verification** (master plan, Part 5.6):
there is no Deqing marathon or half marathon; the bamboo culture festival is
Anji's, not Deqing's; no Moganshan hot spring festival, camping festival or
branded annual music festival could be verified; no official Moganshan
ticketing WeChat account name was confirmed; the 2026 ticket tariff could not
be confirmed from an authoritative source. Where a piece needs one of these,
publish the uncertainty instead.

Never fabricate figures or attributions. A missing number is better than an
unsourced one.

## Standing editorial rules (never break)

* British spelling and usage. Day month year dates ("17 September 2026"),
  the 24 hour clock, Celsius, metric, RMB for every price with the yuan sign
  or "RMB" spelled out, never a dollar figure in an article.
* Chinese characters inline on first use, English first: the transfer centre
  (换乘中心), Deqing News (德清新闻网). No pinyin without characters on first
  use. No untranslated Chinese without a rendering.
* No em dashes and no hyphens used as punctuation. Commas, full stops,
  parentheses, colons. Compound words are one word or two words.
* Corrective framing: where a wrong assumption exists, lead by demolishing it.
* Numbers as the spine: every claim that can carry a figure carries one, with
  a date and a source.
* Named uncertainty: where sources disagree, publish the disagreement. Never
  pick one silently.
* No rankings, no ratings, no "we loved it", no invented review language.
* Honest negatives: who will not enjoy it, what to skip.
* No "first in China" or similar superlative repeated from destination
  marketing without a primary source.
* The geographic orientation paragraph: early in the piece, say where
  Moganshan is (Deqing County, Huzhou, Zhejiang; about 60 km from Hangzhou,
  200 to 240 km from Shanghai) and, where a reader could confuse the two,
  that Moganshan Road in Shanghai (the M50 art district) is a different place.
* Internal links are real markdown links, only to URLs that exist in
  `src/content/guide` or the site profile, written with a trailing slash as
  the drafts do (the build strips it).
* Affiliate links follow the brief's pillar rule and only ever use a `/go/`
  slug that exists (see `editorial/CLAUDE.md`, "Affiliate slugs"). Never
  invent one.
* Two reserved subjects the journal already claims and no slot may
  duplicate: the 1901 tennis court, and the Four Seasons construction essay.

## SEO metadata (hard ceilings, verify with a counter before delivery)

* `seo_title` 60 characters or fewer
* `meta_description` 155 characters or fewer, and no date in it
* `excerpt` (the standfirst) 40 words or fewer, one or two sentences that
  state the answer, not the promise
* The primary keyword appears in the H1 or the seo_title, in the first 100
  words, and in one H2. Do not force it anywhere else.

If any is exceeded, fix it without being asked.

## Word count rule

The brief's word target counts the rendered body only: exclude the
frontmatter, the `# Title` line and every HTML comment. Report the prose only
count and the count with tables, then land within 10 percent of the target.
Write the counted body figure into `word_count` in the frontmatter.

## File format

The output file is a guide collection file. Filename equals the last URL
segment: `editorial/output/<slug>.md`.

```markdown
---
url: /section/slug/
title: <H1, human, sentence case>
seo_title: "<keyword led, 60 characters or fewer>"
meta_description: "<155 or fewer>"
excerpt: <the standfirst, 40 words or fewer>
primary_keyword: <from the brief>
secondary_keywords: [<from the brief>]
schema: Article            # or "Article + HowTo + Place" for a trail, "Article + Place" for a village
image: /images/guide/<slug>.webp
image_alt: <hand written, descriptive, never asserts a named place>
word_count: <counted>
author: <from the brief>
published: <the brief's publish_date>
last_updated: <the brief's publish_date>
pillar: <P1 to P9>
slot: <n>
freshness_tier: <volatile | semi-stable | evergreen>
affiliate_slug: <the /go/ slug used, or omit>
sources:
  - name: 德清新闻网
    name_en: Deqing News
    url: https://...
    date: 2026-09-17
    tier: "1"
---

# <the same H1>

<body>
```

The last five frontmatter fields (`pillar`, `slot`, `freshness_tier`,
`affiliate_slug`, `sources`) are not yet in the collection schema. The schema
ignores unknown keys, so they are harmless now and become data once Phase 0b
of the master plan lands. Keep them.

Body rules:

* H2s and below only; the layout owns the H1 and strips the `# Title` line.
* Every statistic in a blockquote, on its own line, after the paragraph that
  uses it: `> <what the figure is>, <publisher in English> (<中文>), <day month year>, tier <n>. <URL>`
* Figures as markdown images on their own line, caption in the title slot:
  `![alt](/images/guide/<slug>-2.webp 'Caption that adds information.')`
  Three of them, numbered 2 to 4, placed at natural section breaks, never two
  in a row.
* Markdown tables only, five columns at most, no nested tables.
* No HTML in the body. HTML comments are the exception, and only for the
  appended blocks.
* No "Checked <date>" line at the end: the layout generates it.
* No summary or conclusion section. End on the last substantive section, or
  on the pillar's affiliate module where the rule allows one.

## Templates

When the brief names a template, the section order in the brief's Template
block is the outline. Village and trail pieces add `Place` to `schema`; trail
pieces add `HowTo`. The price table and crowd calendar components fall back to
markdown tables until the components exist in the repo, with the columns the
brief specifies.

## The 13 iteration workflow

Print the tracker, run all iterations in order, brief reflection between each.
No approval pauses. Do not skip, merge or reorder. For each iteration, state
what was checked or changed and the specific findings before moving on, not
just a silently updated checklist.

```
[ ] Iteration 1  : British newspaper draft against the brief's outline
[ ] Iteration 2  : weakness identification (write the ten out)
[ ] Iteration 3  : rewrite addressing weaknesses
[ ] Iteration 4  : production readiness review
[ ] Iteration 5  : AI detection removal pass
[ ] Iteration 6  : dash cleanup + blockquote citation formatting
[ ] Iteration 7  : cadence pass (house variant, no planted errors)
[ ] Iteration 8  : paragraph and citation structure check + source check 2
[ ] Iteration 9  : SEO metadata and frontmatter (within hard limits)
[ ] Iteration 10 : second AI detection pass
[ ] Iteration 11 : final human touch pass
[ ] Iteration 12 : visual formatting: tables, figure placement, orientation paragraph
[ ] Iteration 13 : four image prompts (lead + three figures) with alt and caption
```

Iteration 6 removes every em dash, en dash and punctuation hyphen. Iteration 8
runs the second source validation (fetch every cited URL again). Iteration 9
verifies the counts and writes `word_count`. Iteration 12 places the three
figure lines at section breaks and checks the orientation paragraph is
present. Iteration 13 writes the four prompts.

## Cadence pass (iteration 7, and the humanising rule everywhere)

Copy should read human because a person with deadlines wrote it, not because
it contains mistakes. Humanise through cadence, structure and word choice
only:

* Vary sentence length on purpose. Follow a long sentence with a four word one.
* Break at least three parallel structures.
* Let one paragraph run long and the next run to a single line.
* Allow a mid thought aside in parentheses, once or twice, not everywhere.
* Use contractions where a reporter would.
* Cut the tidy closing line at the end of a section when it performs rather
  than informs.

Never: missing apostrophes, then/than or your/you're swaps, misspellings,
comma splices for effect, or register shifts into slang. State in the run log
that iteration 7 ran as the cadence variant.

## Image prompt rules

The site's standing imagery rule (root `CLAUDE.md`) governs. Four prompts per
article:

* **Lead**: establishes the place. Rendered 16:9 by the layout from a 3:2
  file. Generated at 1536x1024.
* **Figures 2, 3, 4**: illustrate a paragraph each, placed after a named
  heading. 3:2, 1536x1024.

Every prompt:

* Moganshan and Deqing as they are: moso bamboo, stone villas of the hill
  station, tea slopes, village lanes, the transfer centre and its shuttles,
  Deqing station, the county roads, the reservoirs, the season the piece is
  about. Name the season and the light.
* **No recognisable human face.** People appear from behind, in profile at a
  distance, or as small figures in a landscape. Write that into the prompt.
* **Real life, not AI perfect (Cyril, 6 September 2026, permanent).** Every
  generated image must read as a candid photograph somebody took on the day:
  a phone or handheld camera feel, uneven or mixed light, weather, a slightly
  crooked horizon, a cropped edge, motion blur on a passing figure, haze,
  clutter, a wet path, a smudged lens, a bin in the corner. Write those
  defects into every prompt. No studio polish, no symmetrical composition,
  no flawless surfaces, no cinematic colour grade, no golden hour by default,
  no impossibly clean village lane. An image that looks like a render is
  rejected and regenerated, however pretty it is.
* No diagrams, no infographics, no text, no logos, no watermark.
* Never a prompt that would produce a documentary likeness of a specific
  named building presented as that building. The images are representative
  illustrations and the page says so.
* Platform agnostic, single unbroken block of prose. No parameters, no
  section headers, no commentary.

Alt text is hand written and descriptive and never asserts the frame is a
named place ("a stone villa under bamboo", not "Songyue Lodge"). The caption
carries information the prose does not: a timing, a price, a direction, a
season, a warning.

## Image block (append, outside the word count)

After the body, append this HTML comment. It never renders and never counts
toward the target.

```
<!-- =====================================================================
IMAGES: INSTRUCTION FOR CLAUDE CODE

Generate the four images below with the generate-image-openai skill
(gpt-image-2, --quality high, --aspect 3:2), look at each PNG, then encode
each one and wire it in. Raw PNGs go to assets/raw/guide/, encoded webp to
public/images/guide/. Every image is a real life candid photograph with
real life defects (handheld feel, uneven light, weather, a cropped edge,
blur, clutter) and never AI perfect; a render look is regenerated.

  node ~/.claude/skills/generate-image-openai/scripts/generate-image.mjs "<prompt>" --aspect 3:2 --quality high --out assets/raw/guide/<slug>-lead.png
  node scripts/optimize-image.mjs assets/raw/guide/<slug>-lead.png --out=public/images/guide --name=<slug>
  node scripts/optimize-image.mjs assets/raw/guide/<slug>-2.png --out=public/images/guide
  (same for -3 and -4)
  npm run img:audit

LEAD
  file:    public/images/guide/<slug>.webp
  alt:     <as in frontmatter image_alt>
  prompt:  <single prose block>

FIGURE 2
  after:   ## <exact H2 text the figure follows>
  file:    public/images/guide/<slug>-2.webp
  alt:     <descriptive>
  caption: <adds information>
  prompt:  <single prose block>

FIGURE 3
  ...

FIGURE 4
  ...
===================================================================== -->
```

Then the schema block and the asset brief:

```
<!-- SCHEMA
Type: Article (+ Place for a village, + HowTo + Place for a trail)
Breadcrumb: Home > <Section> > <title>
Author: <author id>, Person, from src/data/authors.ts
datePublished: YYYY-MM-DD
-->

<!-- ASSET BRIEF
TABLES: <list, with the data each needs>
MAP / GPX: <for trail pieces: what the map must show, the GPX to produce, TODO if the pipeline does not exist yet>
INTERNAL LINKS: <anchor text> -> <url>, one per line, all verified to exist
AFFILIATE: <the /go/ slug used and where, or none, with the pillar rule quoted>
OPEN TODOS: <markers left in the body>
AFFECTS PAGES: <existing evergreen pages this piece contradicts or updates, if any>
-->
```

## Delivery checklist (verify before presenting)

* Site profile read, nearest existing article and one sibling read
* Research note written, every figure passed check 1 and check 2 with a tier
* British spelling, day month year, 24 hour clock, RMB only
* Chinese characters inline on first use, English first
* Zero em dashes, zero punctuation hyphens, no summary section
* Zero deliberate errors
* Orientation paragraph present, M50 disambiguation where relevant
* Stats in blockquotes with publisher, characters, date, tier and URL
* No rankings, no ratings, no unsourced superlatives
* Frontmatter complete and in the guide schema shape, `word_count` counted
* Internal links verified, affiliate slug verified or none
* Three figure lines placed in the body, four prompts appended
* Ledger appended with both check dates
* Present the file path and a one line summary

## Relationship to content-quality-us

Both skills forbid planted errors, so they are compatible on one file.
CreateArticle builds the article. `content-quality-us` is the stricter 18 pass
audit that runs on the finished draft before the image step. That skill's
standing constraint says US spelling; on this site the house override wins:
British spelling, day month year dates, Celsius and metric, and the skill's
spelling pass is run as a British consistency pass. Where the two give
different SEO ceilings, the house ceilings (60 / 155 / 40 words) apply.
