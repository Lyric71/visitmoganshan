---
brief_id: 090
slot: 90
publish_date: 2027-06-08
pillar: P6
pillar_name: "Seasons and timing"
title: "Summer weekends: when the tour buses arrive"
url: /seasons/summer-weekends/
output_file: output/summer-weekends.md
guide_file: src/content/guide/seasons-summer-weekends.md
primary_keyword: "moganshan crowds"
secondary_keywords: ["best time to visit moganshan"]
word_target: 1200
affiliate: "no affiliate"
author: liyan-ye
freshness_tier: volatile
template: article
components: ["crowd calendar"]
status: not_started
---

# BRIEF 090: Summer weekends: when the tour buses arrive

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
| Slot | 90 of 122, publishes 8 Jun 2027 (Tue) |
| Pillar | P6, Seasons and timing |
| Working H1 | Summer weekends: when the tour buses arrive |
| URL | `/seasons/summer-weekends/` (default, move it by editing `url` in the draft) |
| Output file | `output/summer-weekends.md` |
| Published file | `src/content/guide/seasons-summer-weekends.md` |
| Primary keyword | `moganshan crowds` |
| Secondary keywords | `best time to visit moganshan` |
| Body length | 1,200 words, body only, within 10 percent |
| Affiliate | none |
| Pillar affiliate rule | Stay storefront at the foot; ticket module on gate and night programme pieces. |
| Author | `liyan-ye` |
| Freshness tier | volatile |
| Template | article, with crowd calendar |

## The angle

> Gap-list question 46. Be an hour ahead of the buses.

## Chinese sources named in the calendar

限流 data

Pull these first. Every figure still goes through the tier check for its fact
type and both validation checks before it enters the draft.

## Components

Crowd calendar (Part 5.4). Golden Week, Labour Day, Qingming, summer weekends, tour bus arrival windows. Reused across the holiday pieces. Until the component exists in the repo, a markdown table by date with an expected crowding level and a source is the fallback.

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
* [ ] Frontmatter matches the guide schema, `published` and `last_updated` both `2027-06-08`
* [ ] `word_count` in the frontmatter is the counted body figure
* [ ] Internal links only to URLs that exist in `src/content/guide` or in the site profile
* [ ] Affiliate placement follows the pillar rule; every /go/ slug verified to exist
* [ ] Four image prompts appended (lead plus three figures), each with alt, caption and the heading it follows
* [ ] `seo_title` under 60 characters, `meta_description` under 155, `excerpt` under 40 words, all counted
* [ ] Saved as `output/summer-weekends.md`
* [ ] content-quality-us run with the British English override, all 18 passes shown
* [ ] Four images generated, looked at, each a real life candid photograph with real life defects and none AI perfect, encoded under the audit caps, saved to `public/images/guide/`
* [ ] `schedule.csv` row updated, `logs/YYYY-MM-DD.md` written
