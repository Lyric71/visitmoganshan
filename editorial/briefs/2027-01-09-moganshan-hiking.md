---
brief_id: 040
slot: 40
publish_date: 2027-01-09
pillar: P3
pillar_name: "Trails and outdoors"
title: "Moganshan hiking: the eight routes, with distances and honest timings"
url: /things-to-do/moganshan-hiking/
output_file: output/moganshan-hiking.md
guide_file: src/content/guide/things-to-do-moganshan-hiking.md
primary_keyword: "moganshan hiking"
secondary_keywords: []
word_target: 2600
affiliate: "no affiliate"
author: liyan-ye
freshness_tier: semi-stable
template: trail
status: not_started
---

# BRIEF 040: Moganshan hiking: the eight routes, with distances and honest timings

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
| Slot | 40 of 122, publishes 9 Jan 2027 (Sat) |
| Pillar | P3, Trails and outdoors |
| Working H1 | Moganshan hiking: the eight routes, with distances and honest timings |
| URL | `/things-to-do/moganshan-hiking/` (default, move it by editing `url` in the draft) |
| Output file | `output/moganshan-hiking.md` |
| Published file | `src/content/guide/things-to-do-moganshan-hiking.md` |
| Primary keyword | `moganshan hiking` |
| Secondary keywords | none |
| Body length | 2,600 words, body only, within 10 percent |
| Affiliate | none |
| Pillar affiliate rule | None, except a soft stay link at the foot where the trail implies an overnight. |
| Author | `liyan-ye` |
| Freshness tier | semi-stable |
| Template | trail |
| Weight | Flagship. Extra research time, and the run log says what was done with it. |

## The angle

> PILLAR HUB. Outdooractive and Wikiloc own raw tracks with no context. Own the context.

## Chinese sources named in the calendar

绿色旅行网 8条徒步路线

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.

## Template

Trail template (Part 5.4). Route stage by stage; a fact strip with distance,
elevation gain, surface, and honest timing for a fit and an unfit walker;
what to carry; when not to go; an embedded map and a downloadable GPX; an
elevation profile. Emits HowTo and Place schema. Where the GPX pipeline does
not exist yet, leave a marked TODO for the map and the file and publish the
prose; the fact strip still has to carry real numbers with sources.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2027-01-09`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/moganshan-hiking.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
