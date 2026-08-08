# Live site audit — visitmoganshan.com

Date: 2026-08-07
Method: WebFetch on every URL in the brief, plus a curl HTTP-status and body-word-count sweep on every URL discovered on the hub pages and in the XML sitemap. All 404s were retried once and confirmed.

## Calibration

Known-good reference pages measured with the same stripped-body word counter:

| Page | Stripped body words | Classification |
|---|---|---|
| /moganshan/bamboo-forest | 1,740 | FULL |
| /plan/is-moganshan-worth-visiting | 1,646 | FULL |
| /contact | 270 | THIN |
| any 404 | 8 | MISSING |

FULL on this site means roughly 1,300 to 2,300 words of real prose with tables, numbered sections and month-by-month or by-type breakdowns. The house style is dense and data-led. There is no lorem-ipsum anywhere on the site, so nothing classified as STUB.

Authoritative page inventory: `https://www.visitmoganshan.com/sitemap-0.xml` lists **65 URLs**. Every one of those 65 returns 200 and is FULL, with two exceptions noted below. `/sitemap.xml` is a 404; robots.txt points to `/sitemap-index.xml`.

## Summary

| Classification | Count |
|---|---|
| FULL | 60 |
| THIN | 2 |
| EMPTY | 4 |
| STUB | 0 |
| MISSING | 15 |
| ERROR | 0 |
| **Total checked** | **81** |

---

## MISSING (404) — 15

Every one of these was retried once and returned a genuine 404 page, not a network or robots error.

| URL | Linked from | What it should be |
|---|---|---|
| /things-to-do/yellow-bud-tea | **Primary nav, every page on the site** | Article on Moganshan Yellow Bud tea |
| /moganshan/villages | **Primary nav, every page on the site** | Destination page on the mountain's villages |
| /moganshan/tea | Homepage tile, /things-to-do | Tea overview page |
| /things-to-do/villa-walking-route | Homepage tile | Things-to-do activity page |
| /things-to-do/sword-pond | Homepage tile | Things-to-do sight page |
| /things-to-do/bamboo-forest-walks | Homepage tile | Things-to-do activity page (real content exists at /moganshan/bamboo-forest) |
| /things-to-do/hot-springs | Homepage tile | Things-to-do activity page (real content exists at /moganshan/hot-springs) |
| /things-to-do/cycling | Topic covered on /things-to-do, no page | Things-to-do activity page |
| /where-to-stay/private-villas | **Footer, every page on the site** + homepage | Where-to-stay category page |
| /getting-here/from-hongqiao | Homepage getting-here tile | Getting-here route page |
| /accessibility | **Footer, every page on the site** | Accessibility statement |
| /seasons/spring | Nothing (gap) | Season page — autumn, summer and winter all exist; spring is the only missing one |
| /where-to-stay/todo-1 | **Homepage** | Literal placeholder slug shipped to production |
| /where-to-stay/todo-2 | **Homepage** | Literal placeholder slug shipped to production |
| /where-to-stay/todo-3 | **Homepage** | Literal placeholder slug shipped to production |

None of the 15 appear in the XML sitemap, so they are broken internal links rather than deindexed pages.

## EMPTY — 4

| URL | H1 | Body words | What is actually on it |
|---|---|---|---|
| /journal | The Moganshan journal | ~1,150 | **Zero posts.** The page is a well-written explanation of a section that does not exist yet. Opens "No posts. No archive behind a category filter, and nothing put up as a placeholder." Contains a table of planned journal formats, editorial guidelines, a villa-ownership stats table and five researched topics awaiting publication. Real prose, no journal content. |
| /trade/image-library | Image and video library | ~2,100 | **Zero downloadable assets.** Opens "Nothing to download yet." Tables state "Stills for download: None published" and "Video: None." Seven items marked "TODO: verify" are visible on the live page. Honest, but it is an empty listing and the TODO markers are public. |
| /search | Search the guide | ~1,800 | Link directory only. Two sentences of intro ("58 pages on Moganshan... Type a place, a station or a question.") followed by 58 links in nine category groups. EMPTY under the strict rule, but this is a utility page doing its job — **no content needed**. |
| /sitemap | Everything on this site | ~2,160 | Link directory only. Lists 65 pages in nine categories with a one-line description and update date each. EMPTY under the strict rule, but correct by design — **no content needed**. |

## THIN — 2

| URL | H1 | Body words | What is actually on it |
|---|---|---|---|
| / (homepage) | Moganshan | ~180 words of prose, ~620 total | Almost entirely link cards. The only real prose is the tagline "A mountain that Shanghai built a second life on, and then forgot." and one paragraph of hill-station history. Roughly 31 percent prose to 69 percent link labels. Also the single worst source of broken links on the site: it points at 9 of the 15 404s, including all three `todo-` slugs. |
| /contact | Write to us | ~270 to 320 | Working contact form plus three short guidance blocks ("Before you write", "What happens next", publisher attribution). Functional, but the thinnest real page on the site. Acceptable for a contact page; flagged for completeness rather than as a defect. |

## STUB — 0

No placeholder or lorem-ipsum pages found. `/trade/image-library` is the nearest thing, but it is written prose about absent assets, so it is classified EMPTY.

## ERROR — 0

No network, TLS or robots failures. Every non-200 was a clean 404.

## FULL — 60

All Priority B hubs turned out to be genuine articles, not empty shells. Each carries 1,300 to 2,300 words with numbered sections, data tables and original research, and only reaches its link cards at the end.

**Priority B hubs, all FULL:**

| URL | H1 | Body words |
|---|---|---|
| /where-to-stay | Where to stay in Moganshan | ~2,130 |
| /moganshan | What and where Moganshan is | ~1,860 |
| /things-to-do | Things to do in Moganshan | ~1,845 |
| /plan | Plan your trip to Moganshan | ~1,780 |
| /seasons | Moganshan through the year | ~1,705 |
| /getting-here | How to get to Moganshan | ~1,655 |
| /itineraries | Moganshan itineraries | ~1,550 |
| /groups | Groups, offsites and celebrations | ~1,480 |
| /trade | For the travel trade and media | ~1,330 |
| /about | About this site | ~1,155 |

**Priority A pages that turned out FULL:**

| URL | H1 | Body words |
|---|---|---|
| /where-to-stay/best-hotels | How to choose where to stay in Moganshan | ~1,765 |
| /plan/faq | Planning questions, answered | ~1,710 |
| /moganshan/faq | Moganshan questions and answers | ~1,405 |
| /user-generated-content | User generated content | ~1,375 |
| /privacy | Privacy | ~1,335 |
| /terms | Terms | ~1,205 |
| /cookies | Cookies | ~895 |

**Priority C calibration pages, both FULL:**

| URL | H1 | Body words |
|---|---|---|
| /moganshan/bamboo-forest | The bamboo forest at Moganshan | ~1,740 |
| /plan/is-moganshan-worth-visiting | Is Moganshan worth visiting? | ~1,646 |

**Newly discovered pages, all FULL:**

| URL | Body words | | URL | Body words |
|---|---|---|---|---|
| /moganshan/hill-station/history | 2,333 | | /getting-here/day-trip | 1,628 |
| /plan/china-visa-free-entry | 2,257 | | /itineraries/visa-free-china | 1,636 |
| /moganshan/hill-station/the-villas | 1,975 | | /moganshan/scenic-area | 1,629 |
| /getting-here/from-shanghai | 1,912 | | /where-to-stay/villas | 1,613 |
| /itineraries/shanghai-hangzhou-moganshan | 1,903 | | /itineraries/day-trip-from-shanghai | 1,612 |
| /plan/money-and-payments | 1,897 | | /trade/sample-itineraries | 1,592 |
| /moganshan/hill-station | 1,886 | | /trade/why-moganshan | 1,583 |
| /moganshan/hill-station/walking-tour | 1,856 | | /getting-here/from-shanghai/by-train | 1,576 |
| /itineraries/weekend-from-shanghai | 1,796 | | /where-to-stay/hotels | 1,543 |
| /plan/best-time-to-visit | 1,777 | | /where-to-stay/hotels/four-seasons-moganshan | 1,536 |
| /where-to-stay/minsu-explained | 1,766 | | /seasons/autumn | 1,523 |
| /where-to-stay/luxury | 1,710 | | /things-to-do/hiking | 1,511 |
| /moganshan/weather | 1,642 | | /where-to-stay/hotels/naked-stables | 1,510 |
| /seasons/summer | 1,502 | | /groups/corporate-retreats | 1,475 |
| /where-to-stay/hotels/le-passage-mohkan-shan | 1,453 | | /moganshan/hot-springs | 1,430 |
| /seasons/winter | 1,416 | | /getting-here/getting-around | 1,416 |
| /where-to-stay/hotels/naked-castle | 1,410 | | /plan/tickets-and-entry | 1,395 |
| /getting-here/deqing-station | 1,373 | | /groups/team-building | 1,370 |
| /journal/news | 1,335 (7 real dated entries) | | /trade/fact-sheet | 1,320 |
| /moganshan/where-is-moganshan | 1,314 | | /trade/image-library | see EMPTY |
| /things-to-do/utmb-mogan | 1,118 | | | |

---

## Pages that need content written

Nineteen items. Ordered by how badly the gap hurts.

### Tier 1 — 404s reachable from global nav or footer, on every page of the site

1. **/things-to-do/yellow-bud-tea** — full activity/produce article. In the primary nav on all 65 pages. Highest-impact single 404 on the site.
2. **/moganshan/villages** — full destination article on the mountain's villages. Also in the primary nav on all 65 pages.
3. **/where-to-stay/private-villas** — where-to-stay category page. In the global footer on all 65 pages, plus a homepage tile.
4. **/accessibility** — accessibility statement. In the global footer on all 65 pages. Short policy page, not a 2,000-word article.

### Tier 2 — 404s reachable from the homepage

5. **/moganshan/tea** — tea overview page. Homepage tile plus a link from /things-to-do.
6. **/things-to-do/villa-walking-route** — activity page. Content likely overlaps /moganshan/hill-station/walking-tour, which is FULL at 1,856 words.
7. **/things-to-do/sword-pond** — sight page. No existing coverage anywhere on the site.
8. **/things-to-do/bamboo-forest-walks** — activity page. Could redirect to /moganshan/bamboo-forest (FULL) instead of being written.
9. **/things-to-do/hot-springs** — activity page. Could redirect to /moganshan/hot-springs (FULL) instead of being written.
10. **/getting-here/from-hongqiao** — getting-here route page, Shanghai Hongqiao to Moganshan.
11. **/where-to-stay/todo-1** — placeholder slug live on the homepage. Fix the link or write the page.
12. **/where-to-stay/todo-2** — same.
13. **/where-to-stay/todo-3** — same.

### Tier 3 — gaps and empty shells

14. **/things-to-do/cycling** — activity page. Cycling is discussed as a theme on /things-to-do but has no page of its own and no inbound link.
15. **/seasons/spring** — season page. The only missing season; autumn, summer and winter are all FULL at 1,400 to 1,525 words. Follow that template.
16. **/journal** — needs actual journal posts, or the section should be folded into /journal/news, which already has 7 real dated entries.
17. **/trade/image-library** — needs actual downloadable stills and video, plus a license. Seven "TODO: verify" markers are currently visible to the public.
18. **/** (homepage) — needs editorial prose. Currently ~180 words of real writing carrying 60-plus link cards.
19. **/contact** — thinnest real page at ~270 words. Low priority; a contact page is allowed to be short.

### Not content problems — leave alone

- **/search** and **/sitemap** are link directories by design and are working correctly. They score EMPTY under the strict rule but need no editorial content.

## Other findings

- **/sitemap.xml returns 404.** robots.txt points to `/sitemap-index.xml`, and the real file is `/sitemap-0.xml`. Anything requesting the conventional `/sitemap.xml` gets nothing.
- **None of the 15 broken URLs appear in the XML sitemap.** They are internal linking errors, not deindexed pages. The XML sitemap and the live page inventory agree perfectly at 65 URLs.
- **The homepage is the main offender.** It links to 9 of the 15 404s. Fixing the homepage link block would clear most of the site's broken-link surface even before any pages are written.
- **Two 404s duplicate content that already exists** under a different path (`/things-to-do/hot-springs` vs `/moganshan/hot-springs`, `/things-to-do/bamboo-forest-walks` vs `/moganshan/bamboo-forest`). These are redirect candidates, not writing jobs.
- **Content quality on what exists is consistently high.** Sixty of 81 URLs are full-length, data-led articles. The site's problem is missing pages and broken links, not thin content.
