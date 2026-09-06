---
brief_id: 030
slot: 30
publish_date: 2026-12-10
pillar: P6
pillar_name: "Seasons and timing"
title: "Winter on Moganshan: the honest case for going in January"
url: /seasons/winter-on-moganshan/
output_file: output/winter-on-moganshan.md
guide_file: src/content/guide/seasons-winter-on-moganshan.md
primary_keyword: "moganshan january"
secondary_keywords: ["moganshan low season"]
word_target: 1500
affiliate: "go/stays-all"
author: liyan-ye
freshness_tier: semi-stable
template: article
status: not_started
---

# BRIEF 030: Winter on Moganshan: the honest case for going in January

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
| Slot | 30 of 122, publishes 10 Dec 2026 (Thu) |
| Pillar | P6, Seasons and timing |
| Working H1 | Winter on Moganshan: the honest case for going in January |
| URL | `/seasons/winter-on-moganshan/` (default, move it by editing `url` in the draft) |
| Output file | `output/winter-on-moganshan.md` |
| Published file | `src/content/guide/seasons-winter-on-moganshan.md` |
| Primary keyword | `moganshan january` |
| Secondary keywords | `moganshan low season` |
| Body length | 1,500 words, body only, within 10 percent |
| Affiliate | `go/stays-all`, resolved against the /go/ table per `../CLAUDE.md` |
| Pillar affiliate rule | Stay storefront at the foot; ticket module on gate and night programme pieces. |
| Author | `liyan-ye` |
| Freshness tier | semi-stable |
| Template | article |

## The angle

> Consolidates the winter cluster. Low season pricing, cloud seas, dongsun, empty trails.

## Chinese sources named in the calendar

seasonal pricing data

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-12-10`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/winter-on-moganshan.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
