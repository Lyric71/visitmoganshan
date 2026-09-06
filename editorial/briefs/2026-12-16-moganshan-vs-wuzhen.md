---
brief_id: 032
slot: 32
publish_date: 2026-12-16
pillar: P7
pillar_name: "Trip design and comparisons"
title: "Moganshan vs Wuzhen: mountain or water town"
url: /itineraries/moganshan-vs-wuzhen/
output_file: output/moganshan-vs-wuzhen.md
guide_file: src/content/guide/itineraries-moganshan-vs-wuzhen.md
primary_keyword: "moganshan vs wuzhen"
secondary_keywords: []
word_target: 1800
affiliate: "go/stays-all"
author: echo-peng
freshness_tier: semi-stable
template: comparison
status: not_started
---

# BRIEF 032: Moganshan vs Wuzhen: mountain or water town

Run with the house `createarticle` skill. Read `../CLAUDE.md` and `../SPEC.md`
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
| Slot | 32 of 122, publishes 16 Dec 2026 (Wed) |
| Pillar | P7, Trip design and comparisons |
| Working H1 | Moganshan vs Wuzhen: mountain or water town |
| URL | `/itineraries/moganshan-vs-wuzhen/` (default, move it by editing `url` in the draft) |
| Output file | `output/moganshan-vs-wuzhen.md` |
| Published file | `src/content/guide/itineraries-moganshan-vs-wuzhen.md` |
| Primary keyword | `moganshan vs wuzhen` |
| Secondary keywords | none |
| Body length | 1,800 words, body only, within 10 percent |
| Affiliate | `go/stays-all`, resolved against the /go/ table per `../CLAUDE.md` |
| Pillar affiliate rule | Highest revenue density. Inline deep links in booking order plus an end of page recap module. |
| Author | `echo-peng` |
| Freshness tier | semi-stable |
| Template | comparison |

## The angle

> The real decision most Shanghai weekenders face. Siphons Wuzhen's volume.

## Chinese sources named in the calendar

comparative 攻略

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.

## Template

Comparison template (Part 5.4). Why the confusion exists; a side by side
table; getting to each; cost of each; who should choose which; doing both.
The table is the first screen.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-12-16`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/moganshan-vs-wuzhen.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
