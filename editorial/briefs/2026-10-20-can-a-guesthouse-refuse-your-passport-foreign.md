---
brief_id: 013
slot: 13
publish_date: 2026-10-20
pillar: P1
pillar_name: "Access and practicals"
title: "Can a guesthouse refuse your passport? Foreign guest registration in rural Zhejiang"
url: /plan/can-a-guesthouse-refuse-your-passport-foreign/
output_file: output/can-a-guesthouse-refuse-your-passport-foreign.md
guide_file: src/content/guide/plan-can-a-guesthouse-refuse-your-passport-foreign.md
primary_keyword: "china homestay foreigners passport"
secondary_keywords: ["minsu foreign guests"]
word_target: 2200
affiliate: "go/stays-all"
author: cyril-drouin
freshness_tier: volatile
template: article
desk_written: true
no_calls: true
status: not_started
---

# BRIEF 013: Can a guesthouse refuse your passport? Foreign guest registration in rural Zhejiang

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
| Slot | 13 of 122, publishes 20 Oct 2026 (Tue) |
| Pillar | P1, Access and practicals |
| Working H1 | Can a guesthouse refuse your passport? Foreign guest registration in rural Zhejiang |
| URL | `/plan/can-a-guesthouse-refuse-your-passport-foreign/` (default, move it by editing `url` in the draft) |
| Output file | `output/can-a-guesthouse-refuse-your-passport-foreign.md` |
| Published file | `src/content/guide/plan-can-a-guesthouse-refuse-your-passport-foreign.md` |
| Primary keyword | `china homestay foreigners passport` |
| Secondary keywords | `minsu foreign guests` |
| Body length | 2,200 words, body only, within 10 percent |
| Affiliate | `go/stays-all`, resolved against the /go/ table per `../CLAUDE.md` |
| Pillar affiliate rule | Ticket and train modules only where the piece is transactional. Never on payments or eSIM pieces. |
| Author | `cyril-drouin` |
| Freshness tier | volatile |
| Template | article |
| Weight | Flagship. Extra research time, and the run log says what was done with it. |

## The angle

> HIGHEST LINK-VALUE PIECE ON THE PLAN. Nothing like this exists for any Chinese destination. Needs calls to properties.

## Chinese sources named in the calendar

2024-05-24 directive (already in /journal/news); 公安 registration rules

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

## No calls are made

Part 8 of the master plan wanted this slot confirmed by phone (20 to 30 properties on passport registration).
Nobody calls. Use the written tier 1 and tier 2 record instead: the county
portal, the scenic area's channel, dated local news, and for slot 13 the
published guest reviews and property listings that state a passport policy.
Where only a call would settle it, publish the disagreement between the
written sources, date each, and tell the reader the number to ring
themselves. Never fill the gap with a guess and never imply we rang.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-10-20`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/can-a-guesthouse-refuse-your-passport-foreign.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
