# Site profile cache: visitmoganshan.com

Replaces the createarticle Step 0 fetch. Read this instead of fetching the
site on every run.

**Refresh on the first working day of each month.** Ask Claude:
`Refresh editorial/sources/site-profile.md from the repo and the live site.`

Last refreshed: 2026-09-06 (from the repo; the live site was not fetched)
Next refresh due: 2026-10-01

## What the site is

An English language guide to Moganshan (莫干山), a mountain and former hill
station in Deqing County (德清县), Huzhou (湖州), Zhejiang Province, about
60 km north of Hangzhou and 200 to 240 km from Shanghai. Published by
BeyondBorder Group Ltd (Hong Kong). Astro 7, static, on Vercel, English only.

Positioning as the pages state it: nothing ranked, nothing promoted, no
invented star ratings; every figure dated and sourced; where sources disagree
the disagreement is printed; honest negatives; the visitor consequence of
every change stated in one line. Funded by Trip.com affiliate links,
disclosed at `/plan/disclosure`.

The one disambiguation every page makes where it matters: Moganshan Road in
Shanghai (the M50 art district in Putuo) is a different place 200 km away
and owns the search results.

## Voice, as the existing pages have it

British spelling. Day month year dates. The 24 hour clock. RMB. Chinese
characters inline on first use. Corrective openings ("That gets it
backward"). Numbers with a date and a source. Short paragraphs. A blockquote
source line after each figure, in the form
`> <what the figure is>, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.`
or with a named publisher and date. An early orientation paragraph placing
the mountain in Deqing, Huzhou, Zhejiang. Internal links as markdown links
with a trailing slash. Three captioned figures per page plus a lead.

## Sections (src/data/nav.ts and src/lib/guide.ts)

| Section | Path prefix | Label |
|---|---|---|
| Destinations | `/moganshan` | Destinations |
| Things to do | `/things-to-do` | Things to do |
| Where to stay | `/where-to-stay` | Where to stay |
| Getting here | `/getting-here` | Getting here |
| Itineraries | `/itineraries` | Itineraries |
| Plan your trip | `/plan` | Plan your trip |
| Seasons | `/seasons` | Seasons |
| Groups | `/groups` | Groups |
| Journal | `/journal` | (no nav entry yet; Phase 1d) |

Two FAQ hubs carry the questions for their groups: `/moganshan/faq/` and
`/plan/faq/`. Articles do not carry their own FAQ block.

## Live page inventory, 66 guide pages as of 2026-09-06

`/about/` `/advertise/`
`/getting-here/` `/getting-here/day-trip/` `/getting-here/deqing-station/`
`/getting-here/from-hangzhou/` `/getting-here/from-shanghai/`
`/getting-here/from-shanghai/by-train/` `/getting-here/from-the-airports/`
`/getting-here/getting-around/`
`/groups/` `/groups/corporate-retreats/` `/groups/team-building/`
`/itineraries/` `/itineraries/day-trip-from-shanghai/`
`/itineraries/shanghai-hangzhou-moganshan/` `/itineraries/visa-free-china/`
`/itineraries/weekend-from-shanghai/`
`/journal/` `/journal/118-then-78/` `/journal/news/`
`/journal/the-founding-and-the-committee/` `/journal/the-second-opening/`
`/moganshan/` `/moganshan/bamboo-forest/` `/moganshan/faq/`
`/moganshan/hill-station/` `/moganshan/hill-station/history/`
`/moganshan/hill-station/the-villas/` `/moganshan/hill-station/walking-tour/`
`/moganshan/hot-springs/` `/moganshan/scenic-area/` `/moganshan/tea/`
`/moganshan/villages/` `/moganshan/weather/` `/moganshan/where-is-moganshan/`
`/plan/` `/plan/accessibility/` `/plan/best-time-to-visit/`
`/plan/china-visa-free-entry/` `/plan/faq/` `/plan/is-moganshan-worth-visiting/`
`/plan/money-and-payments/` `/plan/tickets-and-entry/`
`/seasons/` `/seasons/autumn/` `/seasons/spring/` `/seasons/summer/`
`/seasons/winter/`
`/things-to-do/` `/things-to-do/hiking/` `/things-to-do/sword-pond/`
`/things-to-do/utmb-mogan/`
`/where-to-stay/` `/where-to-stay/best-hotels/` `/where-to-stay/hotels-explained/`
`/where-to-stay/hotels/four-seasons-moganshan/`
`/where-to-stay/hotels/le-passage-mohkan-shan/`
`/where-to-stay/hotels/naked-castle/` `/where-to-stay/hotels/naked-stables/`
`/where-to-stay/luxury/` `/where-to-stay/minsu-explained/`
`/where-to-stay/villas-explained/`

Plus the non guide pages: `/` (home), `/contact/`, `/search/`, `/sitemap/`,
`/plan/disclosure/`, the legal pages, and the seven type listings under
`/where-to-stay/{homestays,villas,lodges,hotels,hostels,resorts,apartments}`
(paginated, first page indexed only). The ground truth is the `url` field of
every file in `src/content/guide/`; grep it before linking.

## Existing pages the plan will deepen or rewrite

The calendar names several existing pages as rewrite targets or as pages a
new piece must link and not duplicate:

* `/plan/tickets-and-entry/` (slot 3 supersedes its figures; link it, then
  update it in the same commit per the freshness rule)
* `/getting-here/deqing-station/` (slot 25)
* `/getting-here/day-trip/` and `/itineraries/day-trip-from-shanghai/` (slot 36)
* `/seasons/spring/` (slot 57 rewrite target), `/seasons/autumn/` (slot 118)
* `/moganshan/villages/` (the ten village pages sit under it)
* `/things-to-do/hiking/` (slot 40 is the hub that supersedes it)
* `/moganshan/tea/` (slots 17, 54, 62, 113)
* `/journal/news/` (the dispatch's home until Phase 1b)
* `/where-to-stay/hotels/naked-stables/`, `/naked-castle/`,
  `/le-passage-mohkan-shan/` (slots 82, 104, 75 are the editorial deepening)
* `/plan/money-and-payments/` (slot 9), `/plan/china-visa-free-entry/` (the
  visa watch item)

## Technical setup already in place

Article, BreadcrumbList and Person structured data on every guide page;
WebSite and TouristDestination on the root. Sitemap via `@astrojs/sitemap`
with the search, admin, `/go/` and paginated listings filtered out (no
`lastmod` yet). `trailingSlash: 'never'`, drafts may carry the slash. The
`# Title` line is stripped at build. Tables are wrapped scrollable at build.
Images: webp only, 2000 px, 260 KB, audited in the pre push hook. Dates:
`published` and `last_updated`, checked in the pre push hook.

## Authors (src/data/authors.ts)

| id | Name | Writes |
|---|---|---|
| `cyril-drouin` | Cyril Drouin, founder and editor | planning, transport, history; edits everything |
| `liyan-ye` | Liyan Ye, senior director, writer | the mountain: villages, seasons, tea, bamboo, things to do |
| `echo-peng` | Echo Peng, senior director, writer | accommodation, itineraries, groups |

## Affiliate

Trip.com only, through `/go/<slug>` 302 redirects built in `astro.config.mjs`.
Property slugs are `moganshan-<hotelId>` from `data/seed/properties.seed.json`.
Rail: `/go/trains-shanghai-deqing`, `/go/trains-hangzhou-deqing`. No
storefront, ticket or village slug exists yet. See `../CLAUDE.md`,
"Affiliate slugs".

## Sister sites in the group

TheChinaPath, TheRedScroll, ChinaWebFoundry, BearingBridge. Not linked from
article body copy.
