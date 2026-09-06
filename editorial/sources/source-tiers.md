# Source tiers, the weekly sweep, the fixtures and the watch items

The master plan's companion `chinese-source-map.md` was never delivered to
this repo. This file restates what the plan itself says about sources (Parts
5.6 and 7) and is the working reference until a fuller map replaces it. Open
it every Wednesday for the sweep and every time a figure enters a draft.

## Tiers

| Tier | What it is | How it may be cited |
|---|---|---|
| 1 | County government portal (德清县人民政府), the scenic area's official channel, the ticket line on 0572-8412345, the Huzhou and Zhejiang statistics bureaus, a platform's own documentation | As fact, with date and URL |
| 2 | Dated local and regional news: 德清新闻网 (Deqing News), 浙江在线 (Zhejiang Online), 潮新闻 (Tide News), 澎湃新闻 (The Paper), 新华网, 中国日报, 界面新闻; dated trade press such as 迈点网 (Meadin) | As fact, with date and URL, and a tier 1 source preferred where one exists for prices and policy |
| 3 | Dated travel guides and forums with named authors: 游侠客, 当旅网, 绿色旅行网, 腾讯 travel pieces, a Substack with a named writer | As reported experience, dated; never as the sole source for a price, a closure or a policy |
| 4 | Marketing and promotional accounts: 爱德清, 德清发布, 文旅浙江, brand newsrooms, OTA listings and OTA editorial | As a tip that something may have happened; never as fact. An OTA is never a source for a price, a closure or a policy |

## Chains by fact type (Part 5.6)

| Fact type | Chain |
|---|---|
| Prices, closures, policy, opening hours, entry rules | County government portal, then the scenic area's official channel, then 0572-8412345. **Never an OTA aggregator.** |
| Hotel openings | Trade press announces, then Dianping or Ctrip confirms trading, then local news covers the ribbon. **Publish on step two.** Announced dates slip. |
| Event dates | The mid January sports presser and the early February openings meeting give the skeleton. Confirm each event two to three weeks out. |
| Visitor numbers | Huzhou or Zhejiang bureau only. County and marketing sources inflate. |
| Anything from 爱德清, 德清发布, 文旅浙江 or a brand newsroom | A tip, not a fact. |
| Weather and road closures | 中国天气网 town level page 101210204004 is the leading indicator. |

## Failed verification: do not publish (Part 5.6)

* There is no Deqing marathon or half marathon.
* The bamboo culture festival is Anji's, not Deqing's.
* No Moganshan hot spring festival, camping festival or branded annual music
  festival could be verified.
* No official Moganshan ticketing WeChat account name was confirmed.
* The 2026 ticket tariff could not be confirmed from an authoritative source.
  Slot 3 publishes the disagreement between sources, dated and tiered, not a
  single number.

## The weekly sweep (Part 7), Wednesday, 90 minutes, in priority order

1. **德清新闻网 tourism** `dqnews.zjol.com.cn/dqnews/ssdq/stly/` and politics
   `/dqnews/xwzx/sznews/`. No robots restrictions, date in the URL, four to
   six tourism items a week. Carries roughly 70 percent of any given week.
2. **迈点网 search** `meadin.com/search?keyword=莫干山`, plus
   `meadin.com/sitemap_index.xml`. Fully crawlable. Catches every hotel
   opening and signing.
3. **德清县人民政府** notices `deqing.gov.cn/col/col1229212609/`, news
   `col1229212604` and `col1229212607`. Authoritative for prices, closures,
   ratings. May need China routing.
4. **浙江在线 湖州频道** `zjnews.zjol.com.cn/zjnews/huzhounews/` for the
   regional frame.
5. **潮新闻** `tidenews.com.cn` for provincial features on Deqing.
6. **Moganshan town weather**
   `forecast.weather.com.cn/town/weather1dn/101210204004.shtml`. The road
   closure leading indicator.
7. **澎湃新闻 澎湃浙江**. Low frequency, the only source likely to publish
   something critical worth translating.

**Triage.** Three tests or the item is dropped: did something change, does it
carry a date, would a visitor do anything differently.

## Breaking dispatch triggers

| Trigger | Response time |
|---|---|
| Ticket price or policy change | Same day |
| Closure or road restriction | Same day |
| Entry rules change for foreigners | Same day |
| Transport change | Within 48 hours |
| Major property opening or closing | Within a week, after confirming it is trading |
| Event announcement or cancellation | Within a week |

A breaking dispatch is a new row in `schedule.csv` with `slot` `B<YYYY-MM-DD>`,
`brief_file` `briefs/templates/dispatch.md`, `kind: breaking` in its
frontmatter, added by a person and drafted with `Draft brief B<date>.`

## Annual fixtures

| Date | Fixture | Source | Priority |
|---|---|---|---|
| 28 Sep 2026 | Golden Week programme drops, 7 to 10 days before each Golden Week | 德清发布 / 爱德清 / 潮新闻 | HIGH |
| 20 Jan 2027 | The 2027 race calendar: the annual sports presser publishes the full year in one article | 德清新闻网 `dqnews.zjol.com.cn/dqnews/xwzx/sznews/` | HIGH |
| 27 Jan 2027 | Spring Festival programme drops, 7 to 10 days before the holiday | 德清发布 / 爱德清 | MEDIUM |
| 10 Feb 2027 | The ten openings for 2027, the resort's 新春第一会 | deqing.gov.cn col1229212604 | HIGH |
| 18 Mar 2027 | First Mogan Huangya picked, usually mid March | 德清新闻网 tourism channel | MEDIUM |
| 24 Mar 2027 | Climbing festival opens the walking season, lineage claimed to 1934 | 德清新闻网 and deqing.gov.cn | MEDIUM |
| 25 Mar 2027 | Homestay Conference, mid to late March; verify the 2027 edition exists | 中国日报 zj and 腾讯 | MEDIUM |
| 14 Apr 2027 | Ultra Trail Mogan by UTMB, roughly 10 to 12 April | mogan.utmb.world | HIGH |
| 21 Apr 2027 | Tea King contest, 茶王赛, mid April | 德清新闻网 | LOW |
| 12 May 2027 | World Brand Moganshan Conference, early to mid May; rooms tighten county wide | 新华网 and 潮新闻 | HIGH |
| 23 Jun 2027 | Zhejiang Triathlon, Xiazhu Lake leg, late June | ihuipao.com | LOW |
| 16 Jul 2027 | Summer season launch, 100 plus events, the mid July umbrella programme | 潮新闻 tidenews.com.cn | HIGH |
| 22 Sep 2027 | The Moganshan Conference, descendant of the 1984 meeting | 中国日报 zj | MEDIUM |
| 25 Oct 2027 | Kailas Moganshan Skyrace, 100k, 70k, 35k, 10k | moganshan.saihuitong.com | HIGH |

The two that matter most: the mid January sports presser and the early
February 新春第一会. Between them they pre announce most of the year.

## Standing watch items

Facts with a known expiry, checked without waiting for news.

| Item | Why | Check |
|---|---|---|
| Unilateral visa free scheme | Expires 31 December 2026, no extension announced | Monthly, weekly from November 2026 |
| 杭德市域铁路, the Hangzhou to Deqing line | Due around end 2026. Biggest structural change to access. | Monthly |
| Four Seasons Moganshan | Announced for 2030 | Quarterly |
| Ticket tariff | Sources disagree, tiering may change seasonally | Quarterly, plus before each Golden Week |
| Shuttle hours and last bus down | Varies seasonally, extended to 21:30 in summer 2025 | Seasonally |
| Moganshan Lodge operating status | Still listed by Lonely Planet and TripAdvisor, likely defunct | Once, then close out |
| Spartan base at Jun An Li | Announced for Q4 2026 | Quarterly until confirmed trading |

## Revision cadence by freshness tier (Part 2.5)

| Tier | Pages | Cadence |
|---|---|---|
| volatile | Tickets, shuttle, transport, entry rules, opening hours, car ban, station | Quarterly, plus before each Golden Week |
| semi-stable | Villages, stays, seasons, itineraries, food, trails | Twice a year |
| evergreen | History, the sword legend, the 1984 conference, essays | Annually or never |

The `npm run revisions` queue of Part 2.5 does not exist yet. Until it does,
the quarterly revision is a manual pass over every `volatile` row in
`schedule.csv` and every existing volatile page, logged like any other run.
