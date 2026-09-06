---
brief_id: 010
slot: 10
publish_date: 2026-10-11
pillar: P3
pillar_name: "Trails and outdoors"
title: "The Chiang Kai-shek path: the free route to Sword Pond"
url: /things-to-do/chiang-kai-shek-path/
output_file: output/chiang-kai-shek-path.md
guide_file: src/content/guide/things-to-do-chiang-kai-shek-path.md
primary_keyword: "moganshan hiking trail"
secondary_keywords: ["jianggong ancient path"]
word_target: 2000
affiliate: "no affiliate"
author: liyan-ye
freshness_tier: semi-stable
template: trail
desk_written: true
status: not_started
---

# BRIEF 010: The Chiang Kai-shek path: the free route to Sword Pond

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
| Slot | 10 of 122, publishes 11 Oct 2026 (Sun) |
| Pillar | P3, Trails and outdoors |
| Working H1 | The Chiang Kai-shek path: the free route to Sword Pond |
| URL | `/things-to-do/chiang-kai-shek-path/` (default, move it by editing `url` in the draft) |
| Output file | `output/chiang-kai-shek-path.md` |
| Published file | `src/content/guide/things-to-do-chiang-kai-shek-path.md` |
| Primary keyword | `moganshan hiking trail` |
| Secondary keywords | `jianggong ancient path` |
| Body length | 2,000 words, body only, within 10 percent |
| Affiliate | none |
| Pillar affiliate rule | None, except a soft stay link at the foot where the trail implies an overnight. |
| Author | `liyan-ye` |
| Freshness tier | semi-stable |
| Template | trail |
| Weight | Flagship. Extra research time, and the run log says what was done with it. |

## The angle

> FLAGSHIP TRAIL PIECE. 4km one way, +400m, 10-12km full loop, +560m, bypasses the gate. Needs GPS field data.

## Chinese sources named in the calendar

绿色旅行网 8条徒步路线; 新浪 3条亲测路线

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.

## Desk written, and the piece says so

Part 5.9 of the master plan wanted this piece walked or visited. This
pipeline is fully automated and nobody walks anything, so it is written from
published sources: distances, gains, surfaces and timings from the Chinese
trail guides and official channels, each sourced and dated in the text.
Never claim a route was walked, timed or photographed by us. Never write a
fieldwork line. Where published sources give different timings, print both.
Where a fact exists only on the ground (a kennel still open, a cafe still
trading), say what the most recent dated source says and when.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-10-11`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/chiang-kai-shek-path.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
