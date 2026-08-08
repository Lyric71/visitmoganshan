# Batch 4 — closing the dead links

Six pages, 11,332 words. Drafted 7 August 2026 by BeyondBorder Group Ltd, Hong Kong.
Every page ran the ContentQuality 18-pass loop, logged pass by pass in `_qa/`.

Frontmatter follows the repo schema in `src/content/config.ts`, not the schema used in
batches 1 to 3: `seo_title` runs longer than 52, `excerpt` is a real standfirst rather than
exactly 25 words, and `image` plus `image_alt` are present and required.

## The six

| # | File | URL | Words | TODOs |
|---|---|---|---|---|
| A | `moganshan-villages.md` | `/moganshan/villages/` | 2,012 | 12 |
| B | `things-to-do-sword-pond.md` | `/things-to-do/sword-pond/` | 1,533 | 7 |
| C | `moganshan-tea.md` | `/moganshan/tea/` | 1,977 | 6 |
| D | `getting-here-from-the-airports.md` | `/getting-here/from-the-airports/` | 2,088 | 9 |
| E | `plan-accessibility.md` | `/plan/accessibility/` | 1,980 | 13 |
| F | `seasons-spring.md` | `/seasons/spring/` | 1,742 | 3 |

Each file ends with an `## Image brief` section: one row per figure with subject, alt and
caption, specific enough to shoot or generate from. **Delete that section once the images are
wired.** Body word counts above exclude it.

## Repo changes required in the same commits

- **D.** `GettingHere.astro` line 18: `/getting-here/from-hongqiao` becomes
  `/getting-here/from-the-airports/`. Without it, D's only inbound link 404s. Five other files
  still carry the old slug; the list is in D's QA log.
- **E.** `SiteFooter.astro` line 29: move the accessibility link into the **Visit** column,
  pointing at `/plan/accessibility/`. Until then E has no inbound link at all.
- **C.** Ship with the phase 1.5 nav retarget. `nav.ts` line 132 and `things-to-do.ts` line 67
  move from `/things-to-do/yellow-bud-tea` to `/moganshan/tea/`.
- **F.** Nothing links to `/seasons/spring/` yet. Add it to the seasons hub and the nav.

## Two decisions taken, both following the plan's own recommendation

**Accessibility means the mountain, not the website.** The footer link sits in the Visit column
beside Getting here, Tickets and Weather, which reads as a promise about terrain. So E is a
guide article under Plan your trip, not a static page beside Privacy and Terms. If a web
accessibility statement is also wanted, that is a separate short page in `src/pages/`.

**Spring was added.** It was not among the eleven dead links, because nothing links to it. A
four-season section missing a season is visible to any reader who opens the seasons hub, and
spring is the tea picking window that C points at.

## The honesty position, which is the point

50 `TODO: verify` markers across six pages. They are deliberate and they are visible in the
published body, not hidden in comments.

Two pages are mostly honest frames around gaps, and say so in their own text:

- **C, tea.** The fact base holds nothing on Moganshan tea. General yellow-tea knowledge is
  labeled as standard reference and kept separate from every Moganshan-specific claim. Section 5
  opens "We cannot name you a tea house at Moganshan", then earns its place with the questions to
  ask instead, including the Chinese to show on a phone.
- **E, accessibility.** Highest TODO count on the site, and the body says why. A wrong
  reassurance here strands someone. The word "accessible" never modifies a place, a vehicle or a
  property anywhere on the page; it appears only where it names something still unchecked.

## Known items

1. **B, Sword Pond.** Two existing pages place it inside the ticketed core. B follows them but
   states that no official source settles the boundary, consistent with the open TODO on the
   tickets page.
2. **B, figure 2.** The plan asked for the legend rendered on site as a carving or plaque.
   Nothing held confirms such an object exists, so the image brief specifies the approach steps
   instead and says why in the row.
3. **E** extends two existing open items rather than contradicting them: the accessible-transport
   TODO on `trade-sample-itineraries.md` and the accessibility TODO on
   `where-to-stay-hotels-naked-stables.md`. Both should now point at `/plan/accessibility/`.
4. **F** flags that the "clear autumn air" row in its head-to-head rests on a marketing claim,
   because no fog or visibility record is held for any month.
