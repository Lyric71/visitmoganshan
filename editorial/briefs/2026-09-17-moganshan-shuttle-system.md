---
brief_id: 002
slot: 2
publish_date: 2026-09-17
pillar: P1
pillar_name: "Access and practicals"
title: "The Moganshan shuttle system: both transfer centres, both fares, last bus down"
url: /plan/moganshan-shuttle-system/
output_file: output/moganshan-shuttle-system.md
guide_file: src/content/guide/plan-moganshan-shuttle-system.md
primary_keyword: "moganshan shuttle bus"
secondary_keywords: ["moganshan transfer centre"]
word_target: 1500
affiliate: "go/tickets-moganshan"
author: cyril-drouin
freshness_tier: volatile
template: article
desk_written: true
status: not_started
---

# BRIEF 002: The Moganshan shuttle system: both transfer centres, both fares, last bus down

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
| Slot | 2 of 122, publishes 17 Sep 2026 (Thu) |
| Pillar | P1, Access and practicals |
| Working H1 | The Moganshan shuttle system: both transfer centres, both fares, last bus down |
| URL | `/plan/moganshan-shuttle-system/` (default, move it by editing `url` in the draft) |
| Output file | `output/moganshan-shuttle-system.md` |
| Published file | `src/content/guide/plan-moganshan-shuttle-system.md` |
| Primary keyword | `moganshan shuttle bus` |
| Secondary keywords | `moganshan transfer centre` |
| Body length | 1,500 words, body only, within 10 percent |
| Affiliate | `go/tickets-moganshan`, resolved against the /go/ table per `../CLAUDE.md` |
| Pillar affiliate rule | Ticket and train modules only where the piece is transactional. Never on payments or eSIM pieces. |
| Author | `cyril-drouin` |
| Freshness tier | volatile |
| Template | article |

## The angle

> Yucun and Houwu centres, 35 RMB return + 15 RMB internal, free luggage store, free dog kennels. Nothing in English covers this.

## Chinese sources named in the calendar

游侠客; 当旅网 避坑攻略; 德清新闻网

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-09-17`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/moganshan-shuttle-system.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
