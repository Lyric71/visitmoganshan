# Template: weekly dispatch

Source: Part 4 and Part 7 of `content-drafts/moganshan-build-spec_1.md`. Read
`../../CLAUDE.md` and `../../SPEC.md` first. Every Thursday, 52 a year, first
on 17 September 2026, last on 9 September 2027. 600 to 900 words, three to six
items, each with a mandatory visitor consequence line.

## The Wednesday sweep, in priority order

Read the week's triage files in `../../news/triage/` (one per day from the
news crawler, each with the candidates, the weather signal and the manual
check list), then `../../sources/source-tiers.md`, section "The weekly
sweep", for anything the crawler cannot read. Deqing News carries roughly 70
percent of any given week. Then Meadin for hotel openings and signings, the
county government portal for prices and closures, Zhejiang Online Huzhou,
Tide News, the town level weather page, and Thepaper Zhejiang. An item the
news layer already published this week is linked, not repeated.

## Triage

Three tests or the item is dropped: did something change, does it carry a
date, would a visitor do anything differently.

## Output shape

```markdown
# Moganshan dispatch, week NN

[Standfirst: one sentence naming the week's most consequential change, or
plainly saying nothing material changed.]

## [Item headline]

[Two to four sentences. What changed. When. What is now different.]

**What this means for a visitor:** [one sentence, always present]

> Source: 德清新闻网 (Deqing News), 17 September 2026, tier 1. https://...
```

A week with nothing material is a legitimate dispatch: "Nothing changed on the
mountain this week that affects a trip. Here is what is still true." Publishing
that is a trust signal. Skipping the week is not.

## Quality

Every dispatch runs through `/content-quality-us` (18 passes, British
English override) before it can be `image_ready`, exactly like a core
piece. The publish step refuses a row with no `quality_passed_on`.

## Guardrails

* No affiliate link inside a dispatch. No `/go/` slug, anywhere in the file.
* No item without a consequence line.
* No item without a dated source with a tier.
* Corrections stay visible: amend the item, date the amendment, keep the
  original with a strikethrough. Never silently delete.
* When an item changes a fact on an evergreen page, list that page under
  `affects_pages` in the frontmatter, and the publish step edits the page,
  moves its `last_updated`, and notes the dispatch in the run log, in the
  same commit.

## Frontmatter for the output file

The news collection shape (`src/content.config.ts`, mirrored in
`editorial/scripts/news-lib.mjs`). The items are the `##` sections of the
body; the frontmatter carries the week's headline consequence and every
source the body cites.

```yaml
---
title: "Moganshan dispatch, week NN"
seo_title: "Moganshan News, Week NN: <the headline change>"
meta_description: "<40 to 160 characters, no date>"
standfirst: "<one sentence naming the week's most consequential change, or saying nothing material changed>"
kind: dispatch
week: "YYYY-WW"
topics: [transport, tickets]
author: cyril-drouin
published: YYYY-MM-DD
last_updated: YYYY-MM-DD
consequence: "<the week's headline consequence for a visitor, or: Nothing changed this week that alters a trip; what was true last week is still true.>"
sources:
  - name: 德清新闻网
    name_en: Deqing News
    url: https://...
    date: YYYY-MM-DD
    tier: "1"
affects_pages: []
corrections: []
---
```

## Where it publishes

`src/content/news/YYYY-MM-DD-dispatch-YYYY-WW.md`, live at
`/journal/news/dispatch/YYYY-WW`, in the news index, the feed and the news
sitemap. The publish step moves the output file in unchanged apart from the
two dates. Never a `/go/` link: the build fails on one.
