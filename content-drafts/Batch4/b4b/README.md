# Batch 4 — complete

Nine articles, 16,567 words, plus two action documents and one edited existing file.

The editorial plan listed eleven dead links. A crawl of the live site on 7 August 2026 found
**fifteen**, plus four empty pages and a broken sitemap reference. Four items were not in the
plan, and three of those are visible to a visitor right now. `LIVE-SITE-FIXES.md` covers them.

## The nine articles

| # | File | URL | Words | TODOs |
|---|---|---|---|---|
| A | `moganshan-villages.md` | `/moganshan/villages/` | 2,012 | 12 |
| B | `things-to-do-sword-pond.md` | `/things-to-do/sword-pond/` | 1,533 | 7 |
| C | `moganshan-tea.md` | `/moganshan/tea/` | 1,977 | 6 |
| D | `getting-here-from-the-airports.md` | `/getting-here/from-the-airports/` | 2,088 | 9 |
| E | `plan-accessibility.md` | `/plan/accessibility/` | 1,980 | 13 |
| F | `seasons-spring.md` | `/seasons/spring/` | 1,742 | 3 |
| G | `journal-the-founding-and-the-committee.md` | `/journal/the-founding-and-the-committee/` | 1,806 | 2 |
| H | `journal-118-then-78.md` | `/journal/118-then-78/` | 1,593 | 3 |
| I | `journal-the-second-opening.md` | `/journal/the-second-opening/` | 1,836 | 4 |

A to F close dead links. **G, H and I fill `/journal/`**, which is live today as a 1,150-word
page explaining a section that does not exist. It names five researched topics; these are
topics 1, 3 and 4. Two remain: "What a tennis court tells you" and "The next turn". All three
published posts deliberately leave the Four Seasons material alone, because it belongs to
topic 5.

Frontmatter follows the repo schema in `src/content/config.ts`: `seo_title` may run past 52,
`excerpt` is a real standfirst rather than exactly 25 words, `image` and `image_alt` required.
Every file ends with an `## Image brief` section. **Delete it once the images are wired.** Body
word counts above exclude it.

## Also in this zip

- **`LIVE-SITE-FIXES.md`** — the four items the plan missed, in order of urgency. Read it first.
- **`PHASE1-RETARGETS.md`** — the six retargets and unlinks with exact file, line, from and to.
- **`getting-here-getting-around.EDITED.md`** — phase 1.6 is done, not just specified. The dead
  cycling link is gone, the claim now stands without it, and the gap is stated in the open.
  `word_count` updated from 1,280 to 1,263. Replace the file in the repo.
- **`_qa/live-site-audit.md`** — every URL on the live site, classified.
- **`_qa/*.qa.md`** — one log per article, one section per ContentQuality pass.

## Do these before anything else

1. **Three placeholder slugs are live on the home page.** `/where-to-stay/todo-1`, `-2` and
   `-3` all 404. They are the seeded `hotels.ts` entries. The real property pages already exist
   and are full. Ten-minute data fix, and it is the only broken thing a visitor can see today.
2. **`/sitemap.xml` returns 404.** `robots.txt` points at `/sitemap-index.xml`, the real file is
   `/sitemap-0.xml`. Five minutes, on a site whose whole strategy is organic search.
3. **`/trade/image-library` renders seven `TODO: verify` markers to the public.** Strip them,
   then suppress `TODO:` lines at build time site-wide. There are 244 markers across the corpus
   and any of them could leak the same way.

## Repo edits required with specific articles

| Article | File | Change |
|---|---|---|
| D | `GettingHere.astro:18` | `/getting-here/from-hongqiao` becomes `/getting-here/from-the-airports/`. Without it, D's only inbound link 404s. |
| E | `SiteFooter.astro:29` | Point `/accessibility` at `/plan/accessibility/`, keeping it in the **Visit** column. Until then E has no inbound link. |
| C | `nav.ts:132`, `things-to-do.ts:67` | Retarget `/things-to-do/yellow-bud-tea` to `/moganshan/tea/`. |
| F | seasons hub, nav | Nothing links to `/seasons/spring/` yet. |
| G, H, I | `journal.md` | The hub opens "No posts." Once these ship that is false. Rewrite the opening in the same commit. |

## Two decisions taken

**Accessibility means the mountain, not the website.** The footer link sits beside Getting here,
Tickets and Weather, which reads as a promise about terrain. E is a guide article, not a static
page. If a web accessibility statement is also wanted, that is separate.

**Spring was added.** Nothing links to it, so it never surfaced in the dead-link audit. A
four-season section missing a season is visible to any reader who opens the seasons hub.

## Two things the journal posts caught in the existing corpus

**H contradicts two live pages, deliberately and in the open.**
`moganshan-hill-station-the-villas.md` and `moganshan-hill-station-history.md` both state the
foreign-owned villas were *sold* to Chinese buyers. That is one of four candidate explanations
and nothing in the fact base picks it. H names both pages, links them, and sets the four
candidates side by side. If you want the corpus internally consistent, soften those two lines.

**The growth figures cannot be subtracted.** Four of the nine guesthouse counts are floors
(700+, 800+, 850+), so any sentence deriving a rate of growth from them is invalid arithmetic.
I flagged it here because it is an easy mistake for the next writer to make.

## The honesty position

59 `TODO: verify` markers across nine pages, visible in the published body rather than hidden.
Two pages are mostly honest frames around gaps and say so in their own text: C, because the
fact base holds nothing on Moganshan tea, and E, because a wrong reassurance about accessibility
strands someone rather than costing them an afternoon.
