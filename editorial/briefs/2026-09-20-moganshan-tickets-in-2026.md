---
brief_id: 003
slot: 3
publish_date: 2026-09-20
pillar: P1
pillar_name: "Access and practicals"
title: "Moganshan tickets in 2026: what you pay, what you don't, and why every source disagrees"
url: /plan/moganshan-tickets-in-2026/
output_file: output/moganshan-tickets-in-2026.md
guide_file: src/content/guide/plan-moganshan-tickets-in-2026.md
primary_keyword: "moganshan tickets"
secondary_keywords: ["moganshan entrance fee"]
word_target: 1800
affiliate: "go/tickets-moganshan"
author: cyril-drouin
freshness_tier: volatile
template: article
components: ["price table"]
no_calls: true
status: not_started
---

# BRIEF 003: Moganshan tickets in 2026: what you pay, what you don't, and why every source disagrees

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
| Slot | 3 of 122, publishes 20 Sep 2026 (Sun) |
| Pillar | P1, Access and practicals |
| Working H1 | Moganshan tickets in 2026: what you pay, what you don't, and why every source disagrees |
| URL | `/plan/moganshan-tickets-in-2026/` (default, move it by editing `url` in the draft) |
| Output file | `output/moganshan-tickets-in-2026.md` |
| Published file | `src/content/guide/plan-moganshan-tickets-in-2026.md` |
| Primary keyword | `moganshan tickets` |
| Secondary keywords | `moganshan entrance fee` |
| Body length | 1,800 words, body only, within 10 percent |
| Affiliate | `go/tickets-moganshan`, resolved against the /go/ table per `../CLAUDE.md` |
| Pillar affiliate rule | Ticket and train modules only where the piece is transactional. Never on payments or eSIM pieces. |
| Author | `cyril-drouin` |
| Freshness tier | volatile |
| Template | article, with price table |

## The angle

> Publish the disagreement, not a single number. Four English sources give four answers. Dated, sourced, RMB. Quarterly revision.

## Chinese sources named in the calendar

deqing.gov.cn; 0572-8412345 phone check; Ctrip sight 135799

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.

## No calls are made

Part 8 of the master plan wanted this slot confirmed by phone (0572-8412345 for the tariff).
Nobody calls. Use the written tier 1 and tier 2 record instead: the county
portal, the scenic area's channel, dated local news, and for slot 13 the
published guest reviews and property listings that state a passport policy.
Where only a call would settle it, publish the disagreement between the
written sources, date each, and tell the reader the number to ring
themselves. Never fill the gap with a guess and never imply we rang.

## Components

Price table (Part 5.4). Every row carries its own figure, its source, the source tier and the checked date. Where sources disagree the table shows the disagreement rather than resolving it silently. Until the component exists in the repo, a markdown table with those five columns is the fallback.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-09-20`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/moganshan-tickets-in-2026.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
