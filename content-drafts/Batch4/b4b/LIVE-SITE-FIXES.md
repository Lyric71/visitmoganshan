# Live site remediation, beyond the eleven dead links

The editorial plan listed eleven dead links. A crawl of the live site on 7 August 2026 found **fifteen**, plus four empty pages and one broken sitemap reference. Four items were not in the plan at all, and three of those are visible to a visitor today.

The authoritative inventory is `https://www.visitmoganshan.com/sitemap-0.xml`, which lists 65 URLs. All 65 return 200 and all but two carry real content. The problem is not thin pages. It is broken internal links and two empty listings.

Full audit at `_qa/live-site-audit.md`.

---

## 1. Three placeholder slugs are live on the home page

**This is the worst thing on the site and it takes ten minutes to fix.**

| URL | Status | Linked from |
|---|---|---|
| `/where-to-stay/todo-1` | 404 | Home page |
| `/where-to-stay/todo-2` | 404 | Home page |
| `/where-to-stay/todo-3` | 404 | Home page |

These are the seeded placeholder entries from `hotels.ts`. The build brief said to seed the file with `TODO` for copy that was not held, and the slugs shipped as literal `todo-1`, `todo-2`, `todo-3`. Anyone clicking a hotel card on the home page gets a 404, and the word "todo" is in the URL bar when they do.

**The fix is a data edit, not writing.** The property pages already exist and are full:

- `/where-to-stay/hotels/naked-stables`
- `/where-to-stay/hotels/naked-castle`
- `/where-to-stay/hotels/le-passage-mohkan-shan`
- `/where-to-stay/hotels/four-seasons-moganshan`

Point the three home page cards at three of those, or at `/where-to-stay/` until the cards carry real property data. Do not ship a fourth placeholder.

Then grep the whole repo for `todo-` in any `href` or `slug` field. If three got through, check for more.

## 2. `/sitemap.xml` returns 404

`robots.txt` points at `/sitemap-index.xml`. The real file is `/sitemap-0.xml`. Anything requesting the conventional `/sitemap.xml`, which is what most crawlers and most webmaster tools try first, gets nothing.

Add `/sitemap.xml`, either as the index itself or as a redirect to it. This is a five-minute fix on a site whose entire strategy is organic search.

## 3. `/trade/image-library` publishes its own TODO markers

The page is honest, which is right: it opens "Nothing to download yet" and states "Stills for download: None published". But **seven `TODO: verify` markers are rendering to the public**.

Those markers are an internal editorial convention. They belong in the source and in the QA log, not in front of a picture editor at a magazine who has just been told this is the destination's image library.

Two options, in order of preference:

1. Strip the seven markers, keep the honest prose. The page can say what is missing in plain English without the internal notation.
2. Suppress `TODO:` lines at build time across the whole site, and audit what else is currently leaking. **Do this second option regardless**, because 244 markers exist across the corpus and any of them could reach a reader the same way.

## 4. `/journal` is an empty shell, and now has three posts

The journal hub is 1,150 words explaining a section that does not exist. It opens "No posts. No archive behind a category filter, and nothing put up as a placeholder", then names five researched topics awaiting publication.

Three of the five are written and ship with this batch:

| Topic | File | Words |
|---|---|---|
| 1. The founding, and the committee | `journal-the-founding-and-the-committee.md` | 1,691 |
| 3. 118, then 78 | `journal-118-then-78.md` | 1,566 |
| 4. The second opening | `journal-the-second-opening.md` | 1,709 |

Two remain: "What a tennis court tells you" and "The next turn". The second of those is the Four Seasons 2030 piece, and all three published posts deliberately leave that material alone.

Once these ship, the hub's own opening line stops being true and has to be rewritten. That is a small edit to `journal.md` and it is required in the same commit.

Note also that `/journal/news` already carries seven real dated entries and is full. The hub and the news page currently look like two attempts at the same section. Decide whether the journal is one section with a news filter, or two.

## 5. `/contact` is thin at about 270 words

A working form plus three short guidance blocks. It is the thinnest real page on the site.

This is acceptable. A contact page is allowed to be short, and padding it would be worse. Flagged for completeness, not as a defect. Leave it.

## 6. `/search` and `/sitemap` are link directories

Both score as empty against a word-count test and both are working correctly. `/search` lists 58 pages in nine groups; `/sitemap` lists 65 with a one-line description and an update date each. No content needed.

---

## The corrected dead link ledger

| # | URL | Resolution | Status after this batch |
|---|---|---|---|
| 1 | `/moganshan/villages` | Write | Shipped, article A |
| 2 | `/things-to-do/sword-pond` | Write | Shipped, article B |
| 3 | `/moganshan/tea` | Write | Shipped, article C |
| 4 | `/getting-here/from-hongqiao` | Write at a new slug | Shipped as `/getting-here/from-the-airports/`, article D |
| 5 | `/accessibility` | Decide, then write | Shipped as `/plan/accessibility/`, article E |
| 6 | `/seasons/spring` | Write | Shipped, article F |
| 7 | `/things-to-do/yellow-bud-tea` | Retarget to #3 | Phase 1.5 |
| 8 | `/things-to-do/villa-walking-route` | Retarget | Phase 1.3, checked, confirmed a retarget |
| 9 | `/things-to-do/hot-springs` | Retarget | Phase 1.1 |
| 10 | `/things-to-do/bamboo-forest-walks` | Retarget | Phase 1.2 |
| 11 | `/where-to-stay/private-villas` | Retarget | Phase 1.4 |
| 12 | `/things-to-do/cycling` | Unlink | Done in the content file |
| 13 | `/where-to-stay/todo-1` | Data fix | **Open. Section 1 above.** |
| 14 | `/where-to-stay/todo-2` | Data fix | **Open. Section 1 above.** |
| 15 | `/where-to-stay/todo-3` | Data fix | **Open. Section 1 above.** |

Two of the fifteen sit in the primary navigation on all 65 pages: `/things-to-do/yellow-bud-tea` and `/moganshan/villages`. Two more sit in the global footer: `/where-to-stay/private-villas` and `/accessibility`. Those four are on every page of the site, which means the site currently ships four 404s into every page it serves.

## Order of work

1. **Section 1**, the three `todo-N` links. Ten minutes, and it is the only one a visitor can see right now.
2. **Section 2**, `/sitemap.xml`. Five minutes.
3. **Phase 1 retargets**, per `PHASE1-RETARGETS.md`. Four dead links, no writing.
4. **Section 3**, strip the public TODO markers and add the build-time suppression.
5. **Articles A to F**, each with its repo edit in the same commit.
6. **The three journal posts**, plus the rewrite of the journal hub's opening line.
