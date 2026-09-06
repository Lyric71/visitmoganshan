# Output spec

The contract every finished piece meets. `CLAUDE.md` covers voice, rules and
the pipeline. This file covers structure, format and the checks.

## Core article: file shape

Filename equals the last URL segment. `output/<slug>.md`. Hard wrap body
lines at about 80 characters. The file is a guide collection file, so the
publish step moves it to `src/content/guide/<flat-name>.md` where the flat
name is the URL path with slashes turned into hyphens
(`/getting-here/from-shanghai/by-train/` is
`getting-here-from-shanghai-by-train.md`).

```markdown
---
url: /section/slug/
title: The H1, sentence case, human
seo_title: "Keyword led, 60 characters or fewer"
meta_description: "155 characters or fewer, no date"
excerpt: The standfirst. One or two sentences, 40 words or fewer, stating the answer.
primary_keyword: from the brief
secondary_keywords: [from the brief]
schema: Article
image: /images/guide/slug.webp
image_alt: Hand written, descriptive, never a named place
word_count: 1612
author: cyril-drouin
published: 2026-09-14
last_updated: 2026-09-14
pillar: P1
slot: 1
freshness_tier: volatile
affiliate_slug: trains-shanghai-deqing
sources:
  - name: 德清县人民政府
    name_en: Deqing County People's Government
    url: https://...
    date: 2026-03-03
    tier: "1"
---

# The H1, repeated

<orientation paragraph within the first three paragraphs>

## First section

...

![Alt text](/images/guide/slug-2.webp 'Caption that adds information.')

## Second section

...

<!-- IMAGES block -->
<!-- SCHEMA block -->
<!-- ASSET BRIEF block -->
```

`schema` values: `Article` by default; `Article + Place` for a village piece;
`Article + HowTo + Place` for a trail piece; `Article + FAQPage` only where
the brief asks for a FAQ, which it rarely does because the section FAQ hubs
already carry the questions.

The last five frontmatter keys are not in the collection schema yet. Zod
strips unknown keys, so they are harmless today and become data when Phase 0b
of the master plan lands. Keep them in every draft.

## Length

Word targets in briefs are body only. Exclude frontmatter, the `# Title`
line and all HTML comments. Report both prose only and body with tables
counts, then land within 10 percent of target. Write the body figure into
`word_count`.

Being 10 percent under is fine. Being 25 percent under means a section was
skipped.

## Tables

At least one per article, two where the brief is numerate (tickets, prices,
timings, comparisons, crowd calendars).

1. The answer table in the first screen for cost, timing and comparison
   pieces.
2. A topical table inside the densest section.

Markdown tables only. Five columns at most. No nested tables, no merged
cells. The `scrollableTables` plugin wraps them at build time; do not add a
wrapper.

The price table (first use slot 3, Part 5.4 of the master plan) has five
columns: item, figure, source, tier, checked date. Where sources disagree,
each source is its own row. The crowd calendar (first use slot 4) has date,
what happens, expected crowding, source.

## Citations

Blockquote format, consistently, every time, directly after the paragraph
that uses the figure.

> Figure and claim in one sentence, Publisher in English (中文), day month
> year, tier n. https://url

Rules:

* A source with no date is not a source. Find the date or cut the claim.
* Research in Chinese first. Give the publisher in English with the Chinese
  name in parentheses on first use.
* The tier is the source's verification tier from `sources/source-tiers.md`.
  Tier 4 sources (marketing accounts, brand newsrooms) can be cited only as
  what they announced, never as what is true.
* Every source is validated twice. Both dates go in the ledger.
* Never cite an OTA aggregator for a price, a closure or a policy.
* Never cite our own earlier article for an external figure. Cite what that
  article cited.
* Where a figure comes from our own work, say so: "BeyondBorder Group Ltd
  primary research, 1 to 5 August 2026", which is the form the existing pages
  use. Nobody in this pipeline walks a route or rings a number; never write
  as if we did.

## Figures

Three body figures, numbered 2 to 4, each on its own line at a section break,
never two in a row and never inside a list or a table:

```markdown
![Descriptive alt text](/images/guide/slug-2.webp 'Caption shown under the image.')
```

The `figures` plugin turns each into a `<figure>` with a `<figcaption>` at
build time. Alt is hand written and descriptive. The caption carries
information the prose does not: a timing, a price, a direction, a season, a
warning. Neither asserts the frame is a named place.

The lead image is the frontmatter `image` and `image_alt`; the layout renders
it under the standfirst at 16:9 from a 3:2 file.

## Internal links

Real markdown links, drafted with a trailing slash, only to URLs that exist
in `src/content/guide` (the `url` field of each file) or in the site profile.
Three to six per piece: the section landing page, the nearest sibling, the
FAQ hub for the section where a question is raised, and whatever the brief
names. List every one in the ASSET BRIEF block so the publish step can verify
them.

## Affiliate

Only where the brief's pillar rule allows, only with a `/go/` slug that
exists (see `CLAUDE.md`, "Affiliate slugs"), and the placement the rule
names: a soft link at the foot, a module on a transactional piece, inline
deep links in booking order on a comparison. The ASSET BRIEF names the slug
and where it sits, or says "none" and quotes the rule.

## The three appended blocks

All three are HTML comments. None render. None count toward the word target.
The exact shape is in the house `createarticle` skill.

1. **IMAGES.** Four entries: LEAD, FIGURE 2, FIGURE 3, FIGURE 4. Each has the
   file path, the alt, the caption (figures only), the heading it follows
   (figures only) and one prose prompt.
2. **SCHEMA.** Type, breadcrumb, author id, datePublished.
3. **ASSET BRIEF.** Tables, map and GPX, internal links, affiliate, open
   TODOs, pages this piece affects.

## SEO

| Field | Ceiling | How |
|---|---|---|
| `seo_title` | 60 characters | Count it. Do not estimate. |
| `meta_description` | 155 characters, no date | Count it. |
| `excerpt` | 40 words | Count it. |

Primary keyword in the H1 or `seo_title`, in the first 100 words, and in one
H2. Secondary keywords where they fit or not at all. British spelling in all
three fields.

## The iteration workflow

Run the house createarticle's 13 iterations in order. Print the tracker.
State what changed at each step. No approval pauses.

**Iteration 6** removes every em dash, en dash and punctuation hyphen and
formats every citation. **Iteration 7 is a cadence pass.** No planted errors.
Say in your log that you ran the cadence variant. **Iteration 8** fetches
every cited URL again (check 2). **Iteration 12** places the three figure lines.
**Iteration 13** writes the four image prompts.

Then run `content-quality-us` (18 passes) on the same file, in place, with the
British English override, before the image step. Recount the three SEO
fields afterwards; the skill's own ceilings and its US spelling pass must not
leak through.

## Images: the acceptance bar

Before a row can be `image_ready`:

* Four PNGs generated with `gpt-image-2` at high quality, 1536x1024, from the
  prompts in the IMAGES block.
* Each one opened and looked at. Rejected and regenerated if it has a
  recognisable face, text, a logo, a wrong season, a Western street, or a
  subject that does not match its caption.
* Rejected and regenerated if it looks AI perfect: studio polish,
  symmetrical composition, flawless surfaces, a cinematic grade, a render
  look. The bar is a candid photograph somebody took on the day, with the
  defects a real photograph has (handheld feel, uneven light, weather, a
  cropped edge, blur, clutter). Say in the log what defects each kept image
  carries.
* Each one encoded with `scripts/optimize-image.mjs` into
  `public/images/guide/` under the right name, and `npm run img:audit`
  passing (webp, 2000 px or narrower, 260 KB or under).
* The frontmatter `image` and the three figure lines in the body reference
  files that now exist.

## Dispatch: file shape

`output/dispatch-YYYY-WW.md`, per `briefs/templates/dispatch.md`: structured
frontmatter (week, kind, author, published, standfirst, affects_pages,
items with headline, event date, consequence, tiered source, topics), then
the markdown body in the dispatch shape. 600 to 900 words, three to six items.
No images required for a dispatch. The `/content-quality-us` pass is
required, as for every piece. No `/go/` link anywhere in the file.

## Status values in schedule.csv

| Status | Set when |
|---|---|
| `not_started` | Default |
| `drafted` | createarticle finished, `output/<slug>.md` saved |
| `quality_passed` | content-quality-us finished on the file |
| `image_ready` | quality pass done and four images checked, encoded, audited, in `public/images/guide/` (dispatch: quality pass done, no images) |
| `published` | moved into the collection, checks and build passed, pushed, email sent |
| `blocked` | stopped on one of the flag conditions below, see `notes` |

## Definition of done (steps 0 to 3)

Verify each by counting or checking, not by assuming.

* [ ] Research note written before drafting, Chinese sources first, tier recorded per figure.
* [ ] Every cited source passed check 1 and check 2, both dates in the ledger.
* [ ] Zero em dashes, en dashes or punctuation hyphens. Search the file for each character.
* [ ] Zero exclamation marks.
* [ ] Zero deliberate typos or planted errors.
* [ ] British spelling, day month year dates, 24 hour clock, Celsius, metric, RMB only. Search for `$`.
* [ ] Chinese characters inline on first use, English first. No bare pinyin.
* [ ] Orientation paragraph present; M50 disambiguation where the subject invites confusion.
* [ ] No rankings, no ratings, no "we loved it", no unsourced superlative.
* [ ] No summary or conclusion section. No typed "Checked" line.
* [ ] Every statistic in a blockquote with publisher, characters, date, tier and URL.
* [ ] New figures appended to `sources/verified-sources.md`.
* [ ] Frontmatter complete in the guide schema shape; `published` and `last_updated` equal the row's `publish_date`; `word_count` counted.
* [ ] `seo_title`, `meta_description`, `excerpt` counted and inside ceilings, after the quality pass too.
* [ ] At least one table; the answer table first where the brief is numerate.
* [ ] Internal links verified against the inventory; affiliate slug verified or none.
* [ ] Three figure lines in the body at section breaks; IMAGES, SCHEMA and ASSET BRIEF blocks present.
* [ ] Body word count reported.
* [ ] Saved as `output/<slug>.md`.
* [ ] content-quality-us run, all 18 passes shown, British override noted.
* [ ] Four images generated, looked at, encoded, `npm run img:audit` passing.
* [ ] `schedule.csv` row updated with status and the three dates.
* [ ] `logs/YYYY-MM-DD.md` written.

## When to stop and ask

Draft without pausing, with five exceptions. In each case, write the draft up
to that point, leave a clear marker, flag it in the log, and set the row's
status as stated.

1. **A required figure cannot be sourced at its tier.** Cut the claim, mark
   `TODO: unsourced claim removed`, say which section is thinner. Continue.
2. **The piece's central figure cannot be sourced** (the tariff for the
   tickets piece, the fare for the shuttle piece). Set the row to `blocked`
   with the reason. Nothing publishes around a hole in its own subject.
3. **A diary item's source document has not appeared** (the January race
   presser, the February openings meeting, the July summer programme). Set
   the row to `blocked`; the runbook says how to reslot it.
4. **A fact exists only on the ground or on the phone.** Nobody walks and
   nobody calls. Say what the most recent dated written source says and
   when, print the disagreement where sources differ, and give the reader
   the number or the place to check. Never fill the gap with a guess.
5. **The brief conflicts with what the site actually says.** The site wins.
   Note the conflict so the brief can be corrected.
