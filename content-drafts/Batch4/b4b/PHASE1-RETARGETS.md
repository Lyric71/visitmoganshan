# Phase 1 — retargets and unlinks

**Do this before shipping any batch 4 article.** No new content. Every target already exists and already ships full copy. Six dead links resolved, zero words written.

The rule this enforces, from `nav.ts` lines 19 to 21:

> If you add a link here pointing at a page that does not exist yet, you have shipped a 404 into the header of every page on the site. Check before you add.

One commit, shipped on its own, ahead of the articles.

---

## 1.1 Hot springs

`/things-to-do/hot-springs` becomes `/moganshan/hot-springs/`, which exists and ships 1,155 words.

| File | Line | From | To |
|---|---|---|---|
| `src/data/nav.ts` | 118 | `/things-to-do/hot-springs` | `/moganshan/hot-springs/` |
| `src/data/things-to-do.ts` | 58 | `/things-to-do/hot-springs` | `/moganshan/hot-springs/` |

Keep the slug `hot-springs` as the card key. Only the `href` moves.

## 1.2 Bamboo forest walks

`/things-to-do/bamboo-forest-walks` becomes `/moganshan/bamboo-forest/`, which exists, ships 1,479 words and already covers where to walk.

| File | Line | From | To |
|---|---|---|---|
| `src/data/nav.ts` | 116 | `/things-to-do/bamboo-forest-walks` | `/moganshan/bamboo-forest/` |
| `src/data/things-to-do.ts` | 49 | `/things-to-do/bamboo-forest-walks` | `/moganshan/bamboo-forest/` |

Keep the card label "Walking the bamboo forest". It is better than the destination page's own title for that slot and there is no reason to lose it.

## 1.3 The villa walking route

`/things-to-do/villa-walking-route` becomes `/moganshan/hill-station/walking-tour/`, which exists and ships 1,458 words.

| File | Line | From | To |
|---|---|---|---|
| `src/data/nav.ts` | 115 | `/things-to-do/villa-walking-route` | `/moganshan/hill-station/walking-tour/` |
| `src/data/things-to-do.ts` | 31 | `/things-to-do/villa-walking-route` | `/moganshan/hill-station/walking-tour/` |

**The plan asked for a check before editing: is the existing walking tour a different route from the one the card image depicts? Checked. It is not. Retarget, do not write.**

The existing page is a self-guided route through six named villas: Songyue Lodge (Chiang Kai-shek's), Baiyun Shanguan, the former Empress Hotel, the Du Yuesheng and Zhang Xiaolin villa of 1935, Maitland's castle villa now naked Castle, and the assembly hall of the 1984 Moganshan Conference. That is the villa route. One route, one page.

One thing to confirm when you make the edit: the card image is `/images/todo-villa-route.webp`. If it shows a specific trailhead or signpost that does not appear on the six-stop route, swap the image rather than fork the page.

## 1.4 Private villas

`/where-to-stay/private-villas` becomes `/where-to-stay/villas/`, which exists and ships 1,415 words.

| File | Line | From | To |
|---|---|---|---|
| `src/components/SiteFooter.astro` | 37 | `/where-to-stay/private-villas` | `/where-to-stay/villas/` |

## 1.5 Yellow bud tea

`/things-to-do/yellow-bud-tea` becomes `/moganshan/tea/`, which is article C in batch 4.

| File | Line | From | To |
|---|---|---|---|
| `src/data/nav.ts` | 132 | `/things-to-do/yellow-bud-tea` | `/moganshan/tea/` |
| `src/data/things-to-do.ts` | 67 | `/things-to-do/yellow-bud-tea` | `/moganshan/tea/` |

One subject cannot hold two URLs. `/moganshan/tea/` wins because it carries three references including the homepage card, and because the tea is a property of the mountain rather than an activity.

The nav feature panel keeps its kicker, title and sub exactly as written. Only the `href` moves.

**This is a forward reference. Ship it in the same commit as article C, not with the rest of phase 1.**

## 1.6 Cycling — done, no repo edit needed

`getting-here-getting-around.md` line 104 linked "cycling guide" at `/things-to-do/cycling`. One reference, prose only, not in nav, not in the grid, not in the footer.

**Already fixed in the content file shipped with batch 4.** The sentence was rewritten so the claim stands without the link, and the gap is now stated in the open rather than pointed at a page that does not exist:

> Riding here is something people come to do, not a way to move luggage between villages. We have not ridden the routes ourselves, so we are not going to tell you which climbs are worth it or where to hire a bike.
>
> TODO: verify cycling routes, rental points and the road surface between villages. This needs a field visit before we write it up.

`word_count` updated from 1,280 to 1,263. Cycling is a real subject and worth commissioning later, but it is nobody's landing page.

---

## Additional repo edits, required by the batch 4 articles

These are not phase 1. They ship in the same commit as the article they belong to.

| Article | File | Line | From | To |
|---|---|---|---|---|
| D, airports | `src/components/home/GettingHere.astro` | 18 | `/getting-here/from-hongqiao` | `/getting-here/from-the-airports/` |
| E, accessibility | `src/components/SiteFooter.astro` | 29 | `/accessibility` in whichever column it sits | `/plan/accessibility/`, in the **Visit** column |
| F, spring | seasons hub and nav | — | nothing links to `/seasons/spring/` | add it |

**D is not optional.** Without the `GettingHere.astro` change, the page's only inbound link 404s. Five other files in the working copy still carry the old `from-hongqiao` string; the list is in `_qa/getting-here-from-the-airports.qa.md`.

**E has no inbound link at all until the footer moves.** The link currently reads as a promise about the mountain because of where it sits, next to Getting here, Tickets and Weather. Keep it there and point it at the guide article. If a web accessibility statement is also wanted later, that is a separate short page in `src/pages/` beside Privacy, Terms and Cookies.

---

## After phase 1

Re-run the dead link audit. Eleven should have become one: `/things-to-do/cycling`, and only if something still links to it.

| # | URL | Resolution | Status |
|---|---|---|---|
| 1 | `/moganshan/villages` | Write | Shipped, batch 4 article A |
| 2 | `/things-to-do/sword-pond` | Write | Shipped, batch 4 article B |
| 3 | `/moganshan/tea` | Write | Shipped, batch 4 article C |
| 4 | `/getting-here/from-hongqiao` | Write at a new slug | Shipped as `/getting-here/from-the-airports/`, article D |
| 5 | `/things-to-do/yellow-bud-tea` | Retarget to #3 | Phase 1.5, ship with C |
| 6 | `/things-to-do/villa-walking-route` | Retarget | Phase 1.3, checked, confirmed a retarget |
| 7 | `/things-to-do/hot-springs` | Retarget | Phase 1.1 |
| 8 | `/things-to-do/bamboo-forest-walks` | Retarget | Phase 1.2 |
| 9 | `/where-to-stay/private-villas` | Retarget | Phase 1.4 |
| 10 | `/things-to-do/cycling` | Unlink | Done in the content file |
| 11 | `/accessibility` | Decide, then write | Decided as the mountain. Shipped as `/plan/accessibility/`, article E |

---

## Order of work

1. **Phase 1 retargets**, one commit: 1.1, 1.2, 1.3, 1.4. Four dead links gone, no writing.
2. **Article A, villages.** Thirteen inbound links and nine articles currently promising a page that does not exist. Nothing else comes close.
3. **Article B, sword pond.** Two header slots.
4. **Article C, tea**, with the phase 1.5 nav retarget in the same commit.
5. **Article D, the airports**, with the `GettingHere.astro` href change in the same commit.
6. **Article E, accessibility**, with the footer move in the same commit.
7. **Article F, spring**, with the seasons hub and nav additions.
