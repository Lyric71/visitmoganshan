# Template: weekly dispatch

Source: Part 4 and Part 7 of `content-drafts/moganshan-build-spec_1.md`. Read
`../../CLAUDE.md` and `../../SPEC.md` first. Every Thursday, 52 a year, first
on 17 September 2026, last on 9 September 2027. 600 to 900 words, three to six
items, each with a mandatory visitor consequence line.

## The Wednesday sweep, in priority order

Work through `../../sources/source-tiers.md`, section "The weekly sweep".
Deqing News carries roughly 70 percent of any given week. Then Meadin for
hotel openings and signings, the county government portal for prices and
closures, Zhejiang Online Huzhou, Tide News, the town level weather page, and
Thepaper Zhejiang.

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

```yaml
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
```

## Where it publishes

Until the `dispatches` collection exists (Phase 1b of the master plan), the
publish step adds the dispatch as a new dated section at the top of
`src/content/guide/journal-news.md`, in that page's existing entry format,
adds a row to its summary table, and moves its `last_updated`. Once the
collection exists, the output file moves to
`src/content/dispatches/YYYY-WW.md` unchanged and `journal-news.md` is left
alone. `../../CLAUDE.md` says which applies today.
