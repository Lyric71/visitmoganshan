# The news layer

You are drafting short news items for the news index of **visitmoganshan.com**
from the day's sweep. Everything in `../CLAUDE.md` (voice, absolute rules,
authors) and `../sources/source-tiers.md` (tiers, chains, do not publish)
applies here unchanged. This file adds what is specific to news. Paths are
relative to the repo root.

The design is BBChien's actualités agent, moved onto a static site: a crawler
finds candidates, the model writes an original treatment of the ones that
matter, every draft waits in a queue, a person approves, a script publishes.
**Nothing reaches the site without a person changing `status: pending` to
`status: approved`.** There is no path around that and you must not build one.

## The files

| What | Where |
|---|---|
| Source registry | `editorial/news/sources.json` |
| Cadence, budgets, pause switch | `editorial/news/settings.json` |
| Ledger of every candidate seen | `editorial/news/seen.json` |
| Today's triage (the sweep's output) | `editorial/news/triage/YYYY-MM-DD.md` and `.json` |
| Drafts waiting for review | `editorial/news/drafts/<YYYY-MM-DD>-<slug>.md` |
| Rejected, with the reason | `editorial/news/rejected/` |
| Published copies of drafts | `editorial/news/published/` |
| Run records | `editorial/news/runs.json` |
| Lead images | raw PNG in `assets/raw/news/`, encoded webp in `public/images/news/` |
| Live items | `src/content/news/`, at `/journal/news/YYYY/MM/<slug>` or `/journal/news/dispatch/YYYY-WW` |
| Run log | `editorial/logs/YYYY-MM-DD.md` (append a "News" section) |

## The run, in order

1. Read the triage file. Candidates marked `NEW` are the queue; anything else
   was already decided. Read the weather signal, the fixtures in window and
   the standing watch list too: a fixture whose document has appeared is news
   even when no headline matched.
2. **Triage.** Three tests or the candidate is dropped: did something change,
   does it carry a date, would a visitor do anything differently. A ribbon
   cutting for a factory, a volunteer nursing team, a county meeting: dropped.
   A shuttle timetable, a closure, a price, a race date, a hotel that is now
   taking bookings, an entry rule: kept.
3. **Rank** what survives by consequence for a visitor, then by tier. Take at
   most `maxDraftsPerRun` from `settings.json`, and never more than
   `dailyDraftLimit` in one calendar day counting drafts already in
   `editorial/news/drafts` dated today.
4. **Fetch the article** for each one you will draft (WebFetch, the same
   user agent as the sweep). Read it whole. If the page is a paywall, a
   cookie wall, an error page or under 600 characters of body text, do not
   draft from the headline: mark the candidate `skipped` with the reason
   "source page unreadable" and move on. Zero items beats an invented one.
5. **Verify** through the chain for the fact type in `source-tiers.md`. A
   price or a closure needs the county portal or the scenic area's channel; a
   hotel opening needs Dianping or Ctrip to show it trading; a visitor number
   needs the Huzhou or Zhejiang bureau. When the chain cannot be completed
   from here (the county portal times out from outside China most days), the
   item can still run if it says so: "reported by Deqing News, not yet on the
   county portal". Log both checks in `../sources/verified-sources.md` as for
   any figure.
6. **Write** the draft (rules below) into `editorial/news/drafts/`.
7. **Illustrate**: one lead image, 16:9, through `/generate-image-openai` at
   `--quality high`, under the root `CLAUDE.md` rules (a candid photograph
   with real defects, no face, no text, never a reconstruction of an incident,
   never a recognisable named place). Raw PNG to `assets/raw/news/<slug>.png`,
   then `npm run img assets/raw/news/<slug>.png --out=public/images/news`,
   then `npm run img:audit`. Open the PNG and look at it. An item can publish
   without an image if generation fails twice; say so in the log and leave
   `image` out of the frontmatter.
8. **Quality**: `/content-quality-us` on the draft, British English override.
9. **Ledger**: every `NEW` candidate ends the run as `drafted` (with the draft
   filename in `reason`) or `skipped` (with a reason a person can read: "no
   visitor consequence", "duplicate of ...", "source page unreadable",
   "fails the do not publish list", "over budget today, still new" for the
   ones you ran out of budget for, which stay `new`).
10. **Log** a "News" section in today's run log: what was in the triage, what
    you drafted, what you skipped and why, what could not be verified.
11. **Email**: `node editorial/scripts/news-notify.mjs --mode drafts --triage editorial/news/triage/YYYY-MM-DD.md`.

Then stop. Do not publish, build or commit.

## What a news item is

A news item is narrow: something changed, the change carries a date, and a
visitor would do something differently because of it. A restated press
release does not qualify. Nor does a superlative, a "first in China", a
visitor count from a marketing account, or a plan with no date.

150 to 450 words. One idea. The change in the first sentence, the date in the
first paragraph, the source named in the flow of the text ("Deqing News
reported on 5 September that ..."), the consequence for a visitor at the end.
Two `##` subheadings at most, and only when the item needs them; most do not.
No lists unless the information is a list. No summary. No question as an
opener. No exclamation mark. No em dash, no en dash, no hyphen between two
spaces. RMB only. British spelling, day month year, 24 hour clock, Celsius.

**You do not translate and you do not paraphrase sentence by sentence.** You
take the facts and write them for a reader outside China who does not read
Chinese, knows nothing of the county's administrative layers, and is deciding
whether the change affects a trip. That framing is the whole value: what a
换乘中心 is, why a 景区 closure matters, what 民宿 means. Never quote a passage
of the source, even a short one, unless it is a statement attributed to a
named person.

Never invent a figure, a date, a name, a quotation or a place that is not in
the source. When the source is vague, say the source is vague. When two
sources disagree, print both. When the county portal could not be reached,
say the item rests on the local paper and the portal has not been checked.

Chinese characters inline on first use: the shuttle transfer centre (换乘中心),
Deqing News (德清新闻网). The source line in the frontmatter carries the
Chinese name and the English one.

## Aggregator feeds, English sources and the noise they bring

Since 7 September 2026 the registry carries two kinds of source it did not
have before, and each needs a rule.

**Search feeds.** Google News (Chinese and English) and Bing News are read as
RSS. They are aggregators, tier 4 in the registry only because the schema
wants a number: **the publisher named in the triage table, in brackets after
the headline, decides the tier.** A 潮新闻 item found through Google is tier
2; a 新浪 or 搜狐 republication of a 德清发布 post is tier 4; a press release
wire (GlobeNewswire, PR Newswire) is a brand claim. The link in the table is
Google's redirect; WebFetch follows it, and the frontmatter `sources` entry
carries the publisher's own URL and name, never Google's. Bing's links are
already unwrapped to the publisher. The ledger keys on the URL it was found
under, so the same story on a direct listing and in a feed is caught by the
headline hash, not the URL: read the whole table before drafting, and treat
"same headline as" as a duplicate even across sources.

**Content farms.** The Chinese Google feed is two thirds machine written
guide pieces from 新浪旅游 and 新浪财经 (莫干山...攻略, 怎么选, 怎么玩, +FAQ).
The registry's `excludeNoise` list drops them before triage; one that gets
through is a guide, not an item, and is skipped with the reason "guide, not
news". The same list drops 莫干山板材 (a plywood brand), 莫干山康溪 (a
badminton club) and Moganshan Road in Shanghai. Add a term to that list when
a new kind of noise appears three sweeps running; never draft around it.

**English sources.** Xinhua English, eZhejiang, the China Daily Huzhou
channel, SmartShanghai, TTG Asia and the English Google feed are in the
registry so that the site knows what the English speaking press is saying,
which matters most for corrections. An English item never leads: it is drafted
only when a Chinese source of tier 2 or better carries the same fact, and the
English item goes in `sources` as corroboration. The one exception is a fact
that exists only in English, such as a brand's own press release wording, and
then the item says so.

**Race platforms.** Zuicool, the Kailas organiser site and the UTMB site are
authoritative for a race date and for whether registration is open, because
they sell the places. They are tier 3 for everything else. An event page is
one URL for the life of the race, so the ledger sees it once; when a fixture
window opens, read the page again by hand.

## Kinds

* `item`: the ordinary case, one change.
* `breaking`: a same day item for a ticket, closure, entry rule or transport
  change (the response table in `source-tiers.md`). Same shape, `kind:
  breaking`, drafted the day the sweep finds it, and the email says so.
* `dispatch`: the Thursday round up drafted by the editorial pipeline from
  `briefs/templates/dispatch.md`, 600 to 900 words, three to six `##` items
  each with its consequence line. Now lands in this collection too, with
  `kind: dispatch` and `week: YYYY-WW`, at `/journal/news/dispatch/YYYY-WW`.
  The sweep's triage files for the week are the dispatch's sweep.

## The file shape

```markdown
---
title: "Moganshan shuttle runs to 21:30 through the summer season"
seo_title: "Moganshan Shuttle Now Runs to 21:30 in Summer"
meta_description: "The Moganshan scenic area shuttle now runs until 21:30 on summer evenings, an hour later than the printed timetable."
standfirst: "The last bus down from the hill station now leaves at 21:30 on summer evenings, later than any timetable a visitor will find in English."
kind: item
topics: [transport]
author: cyril-drouin
published: 2026-09-07
event_date: 2026-09-05
consequence: "A visitor staying in the villages can eat on the mountain and still get down without a taxi."
sources:
  - name: 德清新闻网
    name_en: Deqing News
    url: https://dqnews.zjol.com.cn/dqnews/system/2026/09/05/035285000.shtml
    date: 2026-09-05
    tier: "2"
affects_pages: [/getting-here/getting-around/]
image: /images/news/moganshan-shuttle-2130.webp
image_alt: A small green shuttle bus waiting under a shelter at dusk, one passenger climbing in from behind
origin:
  source_id: dqnews
  url: https://dqnews.zjol.com.cn/dqnews/system/2026/09/05/035285000.shtml
  title_zh: 莫干山景交末班车延至21:30
  url_hash: 9b563706be992c4970b9a0507599c395841696c41ea2eba857b1155df1c9c5c0
status: pending
---

The body. 150 to 450 words. No H1.
```

Field rules, enforced by `editorial/scripts/news-lib.mjs` at publish time and
by the collection schema at build time:

* `title` 10 to 120 characters, no full stop. `seo_title` at most 60.
  `meta_description` 40 to 160, no date in it. `standfirst` 40 to 320.
* `topics`: one to four of `tickets`, `transport`, `openings`, `entry-rules`,
  `events`, `weather`, `stays`, `policy`, `business`.
* `author`: `cyril-drouin` for transport, tickets, policy, entry rules and
  business; `liyan-ye` for events, weather and the mountain; `echo-peng` for
  openings and stays.
* `published`: the date you want it live, normally today. The publish run
  sets `last_updated` to the same day. `published` never moves afterwards.
* `event_date`: when the thing changed or was announced. Required for an item.
* `consequence`: one sentence, 20 to 400 characters, written to the visitor.
* `sources`: at least one, each with the Chinese name, the English name, the
  URL, the date and the tier as a string. `own` is BeyondBorder's own desk
  research, used only when a figure is compiled here.
* `affects_pages`: every evergreen page whose fact this item changes. The
  publish run does not edit those pages; the email lists them and the
  editorial pipeline's next run takes them (they must move `last_updated`
  in the same commit that changes the fact).
* `origin`: the ledger key, so the publish run can close the entry.
* `status`: `pending` when you write it. Only a person sets `approved`.
* Never a `/go/` link. Never a dollar figure. Never a "Checked" line.

## After you

The reviewer reads the email, opens the file, edits it in place, and runs
`npm run news:approve -- <slug>` or `npm run news:approve -- <slug> --reject
"reason"`. The publish task at midday moves every approved draft whose date
has arrived, runs the four checks and the build, commits, pushes and emails
the live URLs. A rejected draft is kept in `editorial/news/rejected/` with the
reason, and its ledger entry says `rejected` so the same story is not drafted
twice.

To pause the whole layer: set `"paused": true` in `settings.json`, or
`Disable-ScheduledTask -TaskName 'VisitMoganshan News Sweep'`.

To run a sweep outside the schedule: the "Run the sweep now" button on
`/admin/news`. On the machine it starts `run-news.ps1 -Mode sweep -Force`
at once. From the live site it commits a request file to
`editorial/news/requests/` through the GitHub API (`GITHUB_TOKEN` and
`GITHUB_REPO` on Vercel), and the `VisitMoganshan News Poll` task, every
fifteen minutes, pulls main, removes the file, pushes, and runs the sweep.
A request file you find in that folder is one the machine has not reached
yet; leave it.
