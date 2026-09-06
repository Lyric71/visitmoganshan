---
brief_id: 016
slot: 16
publish_date: 2026-10-29
pillar: P1
pillar_name: "Access and practicals"
title: "Getting a car back down: Didi, taxis and the Moganshan pickup problem"
url: /plan/getting-a-car-back-down/
output_file: output/getting-a-car-back-down.md
guide_file: src/content/guide/plan-getting-a-car-back-down.md
primary_keyword: "didi moganshan"
secondary_keywords: ["taxi from moganshan"]
word_target: 1200
affiliate: "no affiliate"
author: cyril-drouin
freshness_tier: volatile
template: article
status: not_started
---

# BRIEF 016: Getting a car back down: Didi, taxis and the Moganshan pickup problem

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
| Slot | 16 of 122, publishes 29 Oct 2026 (Thu) |
| Pillar | P1, Access and practicals |
| Working H1 | Getting a car back down: Didi, taxis and the Moganshan pickup problem |
| URL | `/plan/getting-a-car-back-down/` (default, move it by editing `url` in the draft) |
| Output file | `output/getting-a-car-back-down.md` |
| Published file | `src/content/guide/plan-getting-a-car-back-down.md` |
| Primary keyword | `didi moganshan` |
| Secondary keywords | `taxi from moganshan` |
| Body length | 1,200 words, body only, within 10 percent |
| Affiliate | none |
| Pillar affiliate rule | Ticket and train modules only where the piece is transactional. Never on payments or eSIM pieces. |
| Author | `cyril-drouin` |
| Freshness tier | volatile |
| Template | article |

## The angle

> Recurring reviewer complaint nobody has answered.

## Chinese sources named in the calendar

TripAdvisor complaints; 当旅网 黑车 warnings

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-10-29`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/getting-a-car-back-down.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
