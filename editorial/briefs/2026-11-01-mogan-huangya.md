---
brief_id: 017
slot: 17
publish_date: 2026-11-01
pillar: P4
pillar_name: "Food, tea and coffee"
title: "Mogan Huangya: the yellow tea almost nobody outside China drinks"
url: /things-to-do/mogan-huangya/
output_file: output/mogan-huangya.md
guide_file: src/content/guide/things-to-do-mogan-huangya.md
primary_keyword: "mogan huangya"
secondary_keywords: ["moganshan tea"]
word_target: 1700
affiliate: "no affiliate"
author: liyan-ye
freshness_tier: semi-stable
template: article
status: not_started
---

# BRIEF 017: Mogan Huangya: the yellow tea almost nobody outside China drinks

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
| Slot | 17 of 122, publishes 1 Nov 2026 (Sun) |
| Pillar | P4, Food, tea and coffee |
| Working H1 | Mogan Huangya: the yellow tea almost nobody outside China drinks |
| URL | `/things-to-do/mogan-huangya/` (default, move it by editing `url` in the draft) |
| Output file | `output/mogan-huangya.md` |
| Published file | `src/content/guide/things-to-do-mogan-huangya.md` |
| Primary keyword | `mogan huangya` |
| Secondary keywords | `moganshan tea` |
| Body length | 1,700 words, body only, within 10 percent |
| Affiliate | none |
| Pillar affiliate rule | None. Nothing to sell and a button would cheapen the section. |
| Author | `liyan-ye` |
| Freshness tier | semi-stable |
| Template | article |

## The angle

> Tea retailers own this SERP with zero travel content. Links from Seven Cups, Leaves of Cha etc.

## Chinese sources named in the calendar

新华网 问茶莫干山; 德清新闻网 茶王赛

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2026-11-01`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/mogan-huangya.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
