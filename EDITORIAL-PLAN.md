# Editorial plan: closing the eleven dead links

Eleven URLs are linked from the site and have no page behind them. This plan
resolves all eleven. It is written to be executed top to bottom.

The headline: **only four articles need writing.** Five of the eleven are stale
slugs pointing at pages that already exist and already ship full content. Fix
those first, in about twenty minutes of editing, and the commissioning list
drops from eleven to four.

| # | URL | Resolution | Effort |
|---|---|---|---|
| 1 | `/moganshan/villages` | Write | 1,800 words |
| 2 | `/things-to-do/sword-pond` | Write | 1,400 words |
| 3 | `/moganshan/tea` | Write | 1,500 words |
| 4 | `/getting-here/from-hongqiao` | Write, at a new slug | 1,700 words |
| 5 | `/things-to-do/yellow-bud-tea` | Retarget to #3 | 2 edits |
| 6 | `/things-to-do/villa-walking-route` | Retarget to existing page | 2 edits |
| 7 | `/things-to-do/hot-springs` | Retarget to existing page | 2 edits |
| 8 | `/things-to-do/bamboo-forest-walks` | Retarget to existing page | 2 edits |
| 9 | `/where-to-stay/private-villas` | Retarget to existing page | 1 edit |
| 10 | `/things-to-do/cycling` | Unlink now, commission later | 1 edit |
| 11 | `/accessibility` | Static page, not a guide article | separate |

---

## Phase 0: the rule that governs all of this

From [nav.ts:19-21](src/data/nav.ts#L19):

> If you add a link here pointing at a page that does not exist yet, you have
> shipped a 404 into the header of every page on the site. Check before you add.

Six of the eleven violate that rule today. Phase 1 exists to stop the bleeding
before any writing starts, because a retarget takes one minute and an article
takes a day.

---

## Phase 1: retargets and unlinks. Do this first, ship it on its own.

No new content. Every target below already exists and already ships between
1,155 and 1,586 words.

### 1.1 Hot springs

`/things-to-do/hot-springs` becomes `/moganshan/hot-springs`, which exists at
[moganshan-hot-springs.md](src/content/guide/moganshan-hot-springs.md) with
1,155 words.

- [nav.ts:118](src/data/nav.ts#L118): change `href`
- [things-to-do.ts:58](src/data/things-to-do.ts#L58): change `href`, keep the
  slug `hot-springs` as the card key

### 1.2 Bamboo forest walks

`/things-to-do/bamboo-forest-walks` becomes `/moganshan/bamboo-forest`, which
exists at [moganshan-bamboo-forest.md](src/content/guide/moganshan-bamboo-forest.md)
with 1,479 words and already covers where to walk.

- [nav.ts:116](src/data/nav.ts#L116)
- [things-to-do.ts:49](src/data/things-to-do.ts#L49)

Keep the card label "Walking the bamboo forest". The label is better than the
destination page's own title for that slot and there is no reason to lose it.

### 1.3 The villa walking route

`/things-to-do/villa-walking-route` becomes `/moganshan/hill-station/walking-tour`,
which exists at [moganshan-hill-station-walking-tour.md](src/content/guide/moganshan-hill-station-walking-tour.md)
with 1,586 words.

- [nav.ts:115](src/data/nav.ts#L115)
- [things-to-do.ts:31](src/data/things-to-do.ts#L31)

**Check before editing.** If the existing walking tour is a different route from
the one the card image `/images/todo-villa-route.webp` depicts, this is a write,
not a retarget. Read the existing page first. The default assumption is one
route, one page: two pages describing the same walk is the thing this site is
trying not to become.

### 1.4 Private villas

`/where-to-stay/private-villas` becomes `/where-to-stay/villas`, which exists at
[where-to-stay-villas.md](src/content/guide/where-to-stay-villas.md) with 1,415
words.

- [SiteFooter.astro:37](src/components/SiteFooter.astro#L37)

### 1.5 Yellow bud tea

`/things-to-do/yellow-bud-tea` becomes `/moganshan/tea`, which is commissioned
as article C below.

One subject cannot hold two URLs. `/moganshan/tea` wins because it carries three
references including the homepage card, and because the tea is a property of the
mountain rather than an activity. The nav feature panel keeps its kicker, title
and sub exactly as written; only the `href` moves.

- [nav.ts:132](src/data/nav.ts#L132), the feature panel
- [things-to-do.ts:67](src/data/things-to-do.ts#L67)

This one is a forward reference. Either ship it with article C, or ship it now
pointing at a page that does not exist yet for a few days. Prefer shipping it
with article C.

### 1.6 Cycling

[getting-here-getting-around.md:104](src/content/guide/getting-here-getting-around.md#L104)
links "cycling guide" at `/things-to-do/cycling`. One reference, prose only, not
in nav, not in the grid, not in the footer.

Rewrite the sentence so the claim stands without the link. Do not leave a link
to nothing in a page that is otherwise sourced. Cycling is a real subject and
worth commissioning later, but it is nobody's landing page and it does not
belong in this batch.

### 1.7 After phase 1

Six links resolved, zero words written. Re-run the audit and confirm only five
remain: villages, sword pond, tea, the airports, accessibility.

---

## Phase 2: the four articles

### House contract, applies to all four

Frontmatter, per [src/content/config.ts](src/content/config.ts). Every field is
required except `word_count`:

```yaml
---
url: /path/with/trailing/slash/
title: Human h1, not keyword led
seo_title: "Keyword led, longer, this is the <title>"
meta_description: One or two sentences, concrete, no adjectives doing the work.
excerpt: The standfirst under the h1. Also the listing summary.
primary_keyword: lowercase phrase
secondary_keywords: [three, to, five]
schema: TouristAttraction
image: /images/guide/<slug>.webp
image_alt: Hand written, descriptive
word_count: 1800
last_updated: 2026-08-07
---
```

Then a `# Title` heading, which the build strips because the layout owns the h1.

**Imagery.** One lead at 16:9 plus at least three inline captioned figures at
3:2, placed at section breaks. Figures are written as a lone image paragraph
with the caption in the title slot:

```markdown
![Descriptive alt](/images/guide/villages-2.webp 'Caption carrying information the prose does not.')
```

Generate with the `generate-image-openai` skill, raw PNG to
`assets/raw/guide/<slug>-<n>.png`, then
`npm run img assets/raw/guide/<file>.png --out=public/images/guide`. Look at
every PNG before wiring it in.

**Voice and sourcing.** Match [moganshan-bamboo-forest.md](src/content/guide/moganshan-bamboo-forest.md).
Short declaratives. Correct the reader's likely wrong assumption early. Where a
figure is not held, write the gap in the open rather than inventing it:

```markdown
TODO: verify the 2026 shuttle fare from Deqing station. We have not found a
figure we trust.
```

And close a sourced section with the house citation line:

```markdown
> Forest cover, species and commercial land use, BeyondBorder Group Ltd primary
> research, 1 to 5 August 2026.
```

This site does not ship claims it cannot stand behind. Four articles with honest
gaps beat four articles of confident invention.

**Links.** Draft internal links with trailing slashes; the `internalLinkSlashes`
plugin strips them at build. Each new article must earn its inbound links: if
nine pages link to the villages guide as "villages guide", the villages guide has
to answer what those nine pages set up.

---

### Article A: `/moganshan/villages`

**Priority 1 of 4.** Thirteen inbound references, more than any other missing
page, including the header and footer of every page on the site.

| Field | Value |
|-------|-------|
| File | `src/content/guide/moganshan-villages.md` |
| url | `/moganshan/villages/` |
| title | Yucun, Xiantan and Sanjiuwu: the villages below Moganshan |
| primary_keyword | moganshan villages |
| secondary_keywords | yucun moganshan, xiantan moganshan, sanjiuwu, where to stay near moganshan |
| schema | Place |
| Length | 1,800 words |
| Section | Destinations |

**The job.** Nine of the thirteen inbound links come from accommodation and
practical pages: [where-to-stay.md:50](src/content/guide/where-to-stay.md#L50),
[where-to-stay-hotels.md:109](src/content/guide/where-to-stay-hotels.md#L109),
[where-to-stay-villas.md:85](src/content/guide/where-to-stay-villas.md#L85),
[where-to-stay-minsu-explained.md:84](src/content/guide/where-to-stay-minsu-explained.md#L84),
[where-to-stay-hotels-four-seasons-moganshan.md:69](src/content/guide/where-to-stay-hotels-four-seasons-moganshan.md#L69),
[plan-money-and-payments.md:158](src/content/guide/plan-money-and-payments.md#L158),
[getting-here-getting-around.md:62](src/content/guide/getting-here-getting-around.md#L62),
[moganshan.md:76](src/content/guide/moganshan.md#L76),
[moganshan-where-is-moganshan.md:98](src/content/guide/moganshan-where-is-moganshan.md#L98).

Read all nine before writing a word. They collectively define the brief: this is
not a charming villages listicle, it is **the page that answers "which base do I
pick, and what is down there".** The reader arrives mid decision.

**Outline**

1. Standfirst and opening, 200 words. The mountain is not one place. Three
   village clusters sit below the hill station and most visitors sleep in one of
   them without ever learning its name.
2. Where the villages sit relative to the summit, 250 words. Elevation, distance,
   which side of the mountain, and the drive or shuttle time to the scenic area
   gate. This is the section the getting around page is pointing at.
3. Yucun, 350 words. The one most readers will actually stay in or near.
4. Xiantan, 300 words.
5. Sanjiuwu, 300 words.
6. Which one to pick, 250 words. A short decision table keyed to trip type:
   first visit, families, couples, groups, car versus no car.
7. Eating and paying down there, 200 words. Directly serves the money and
   payments inbound link. Cash, mobile payment, whether a foreign card works.
8. Getting between them, 150 words.

**Figures**

- Lead, 16:9: a village lane below the mountain, tiled roofs, stone drainage
  channel, bamboo slope rising behind.
- `villages-2.webp`, 3:2, after section 3: Yucun frontage, guesthouse conversions
  next to working houses. Caption carries what the prose does not, for example
  what a converted minsu looks like from the street versus a hotel.
- `villages-3.webp`, 3:2, after section 5: the approach road or valley floor,
  establishing distance from the summit.
- `villages-4.webp`, 3:2, after section 7: a village kitchen or market frontage,
  supporting the eating and paying section.

Note `/images/part-villages.webp` already exists and is used by the homepage
card and the things to do grid. Do not reuse it as the lead. Guide leads live in
`/images/guide/`.

**Outbound links.** `/moganshan/`, `/where-to-stay/minsu-explained/`,
`/getting-here/getting-around/`, `/plan/money-and-payments/`,
`/getting-here/deqing-station/`, `/moganshan/hill-station/`.

**Facts to verify first.** Village names in Chinese characters and pinyin,
elevation of each, road distance and time to the scenic area gate, which
villages the Deqing station shuttle actually serves. Mark anything unverified
with an explicit `TODO:` line rather than rounding a guess into a number.

---

### Article B: `/things-to-do/sword-pond`

**Priority 2 of 4.** Three references, and it appears **twice in the header**,
once under Destinations and once under Things to do. The most prominent named
attraction on the mountain with no page.

| Field | Value |
|-------|-------|
| File | `src/content/guide/things-to-do-sword-pond.md` |
| url | `/things-to-do/sword-pond/` |
| title | Sword Pond |
| primary_keyword | sword pond moganshan |
| secondary_keywords | jianchi moganshan, moganshan waterfall, moganshan sword pond legend |
| schema | TouristAttraction |
| Length | 1,400 words |
| Section | Things to do |

**The job.** A single attraction page that a reader lands on from search with
one question: is it worth the walk, and what is actually there. The card is
tagged popular, nature and family at
[things-to-do.ts:41](src/data/things-to-do.ts#L41), so the family angle has to be
answered rather than implied.

**Outline**

1. Standfirst and what it is, 200 words. Waterfall into a dark pool in a rock
   gorge. Set the expectation honestly, including in low water.
2. The legend, 300 words. Gan Jiang and Mo Ye, the swordsmiths the mountain is
   named after. This is the reason the site is called Moganshan and it belongs
   here, told as legend and labelled as legend.
3. Getting to it, 250 words. From the gate, from the hill station, on foot and
   otherwise. Steps, gradient, how long.
4. What it is like to stand there, 250 words. Season matters more than anything:
   after rain against late summer.
5. With children, 150 words. Steps, railings, whether a pushchair is possible.
   The card promises family, so answer it.
6. When to go and combining it, 250 words. Time of day, crowd pattern, what
   pairs with it in the same morning.

**Figures**

- Lead, 16:9: the fall into the pool, gorge walls, scale visible.
- `sword-pond-2.webp`, 3:2, after section 2: the swordsmith legend rendered as
  carving, plaque or shrine on site. Do not fabricate a monument that is not
  there. If nothing exists, use the approach steps instead.
- `sword-pond-3.webp`, 3:2, after section 3: the stepped approach, showing the
  climb honestly.
- `sword-pond-4.webp`, 3:2, after section 5: the pool from the viewing point at
  a different season or water level.

`/images/todo-sword-pond.webp` exists for the card. The article still needs its
own lead in `/images/guide/`.

**Outbound links.** `/moganshan/`, `/things-to-do/`, `/things-to-do/hiking/`,
`/plan/tickets-and-entry/`, `/moganshan/scenic-area/`.

**Facts to verify.** Chinese name and characters, whether it sits inside the
ticketed scenic area, step count or vertical, seasonal flow. The legend is told
as legend, which means it does not need a source, but it does need labelling.

---

### Article C: `/moganshan/tea`

**Priority 3 of 4.** Three references including a homepage card, and it absorbs
the nav feature panel from `/things-to-do/yellow-bud-tea` under phase 1.5. That
feature is the visually largest element in the Things to do menu.

| Field | Value |
|-------|-------|
| File | `src/content/guide/moganshan-tea.md` |
| url | `/moganshan/tea/` |
| title | Moganshan yellow bud tea |
| primary_keyword | moganshan yellow bud tea |
| secondary_keywords | moganshan huangya, zhejiang yellow tea, moganshan tea |
| schema | Article |
| Length | 1,500 words |
| Section | Destinations |

**The job.** Two promises to keep. The homepage card at
[FourParts.astro:37](src/components/home/FourParts.astro#L37) says "yellow bud,
grown on the slopes". The nav feature at [nav.ts:132](src/data/nav.ts#L132) says
"Where it grows, and where to drink it". So the page owes both the agriculture
and the practical where to drink it, and the second half is what makes it useful
rather than encyclopaedic.

**Outline**

1. Standfirst and what yellow tea is, 250 words. Correct the assumption early:
   most readers know green, black and oolong, and do not know yellow is a
   separate class with its own processing step.
2. Moganshan huangya specifically, 300 words. What makes this one this one.
   Characters, pinyin, the slopes it comes from.
3. Where it grows, 250 words. Elevation, aspect, which slopes, why bamboo and
   tea share the mountain.
4. The season, 200 words. Picking window, what changes through the year. Link to
   the seasons hub, which is a live section.
5. Where to drink it, 300 words. **The load bearing section.** Named places
   where a visitor can actually sit down with it, or an honest statement that
   most hotels serve it and here is what to ask for.
6. Buying it without being fleeced, 200 words. Grades, price bands, what a
   tourist grade box is.

**Figures**

- Lead, 16:9: terraced tea rows on a slope with bamboo above.
- `tea-2.webp`, 3:2, after section 3: the rows close up, showing bud and leaf.
- `tea-3.webp`, 3:2, after section 4: picking or processing.
- `tea-4.webp`, 3:2, after section 5: a served cup, yellow tea brewed, in a
  setting a visitor would recognise.

`/images/part-tea.webp` is spoken for by the homepage card and the nav feature.
The article needs its own set.

**Outbound links.** `/moganshan/`, `/seasons/`, `/things-to-do/`,
`/moganshan/villages/`, `/moganshan/bamboo-forest/`.

**Facts to verify.** Chinese name and characters, whether it holds a
geographical indication, growing elevation band, picking window dates, realistic
price bands. Prices date fast, so cite the observation date inline.

**Also do.** After this ships, update
[things-to-do.md:33](src/content/guide/things-to-do.md#L33) and
[things-to-do.md:125](src/content/guide/things-to-do.md#L125), which already
link here and will start resolving.

---

### Article D: `/getting-here/from-the-airports`

**Priority 4 of 4.** One reference, but it is a homepage card, and it is the only
one of the four with no equivalent coverage anywhere on the site today.

**Slug decision.** The link in
[GettingHere.astro:18](src/components/home/GettingHere.astro#L18) is
`/getting-here/from-hongqiao` but the card is titled "From the airports" with the
sub "Hongqiao, Pudong, Xiaoshan". The slug promises one airport and the card
promises three. Write the page the card promises, at
`/getting-here/from-the-airports/`, and update the component href. A slug naming
one of three airports will be wrong on the day someone lands at Pudong.

| Field | Value |
|-------|-------|
| File | `src/content/guide/getting-here-from-the-airports.md` |
| url | `/getting-here/from-the-airports/` |
| title | Getting to Moganshan from Shanghai and Hangzhou airports |
| primary_keyword | moganshan from shanghai airport |
| secondary_keywords | hongqiao to moganshan, pudong to moganshan, xiaoshan to moganshan, hangzhou airport to moganshan |
| schema | Article |
| Length | 1,700 words |
| Section | Getting here |

**The job.** The arriving international visitor, jet lagged, deciding at the
airport. Three airports, three different answers. This page is a decision tool,
not a narrative, so it can carry more structure than the others: a comparison
table near the top is correct here.

**Outline**

1. Standfirst and the short answer, 200 words. Which airport is best, and the
   one line answer for each of the three.
2. Comparison table, 150 words plus table. Airport, distance, realistic door to
   door time, cost band, whether a same day arrival is sensible.
3. Hongqiao, 350 words. The easy one, because the rail connection is at the
   airport. Terminal, which station, which line.
4. Pudong, 350 words. The hard one. Cross city transfer to Hongqiao, or direct
   car, and honest advice about arriving late.
5. Xiaoshan, Hangzhou, 300 words. Closest in distance and often overlooked.
6. Arriving late, 200 words. What time the last useful train goes, and what to do
   when you miss it. Highest value section on the page.
7. Cars and private transfers, 150 words.

**Figures**

- Lead, 16:9: the arrivals to rail transition, or the road approach to the
  mountain from the plain.
- `from-the-airports-2.webp`, 3:2, after section 3: the airport rail interchange.
- `from-the-airports-3.webp`, 3:2, after section 5: the last leg, the road
  climbing into bamboo.
- `from-the-airports-4.webp`, 3:2, after section 6: arriving after dark.

**Outbound links.** `/getting-here/`, `/getting-here/from-shanghai/`,
`/getting-here/from-shanghai/by-train/`, `/getting-here/from-hangzhou/`,
`/getting-here/deqing-station/`, `/plan/china-visa-free-entry/`. That last one is
the site's longest page at 2,307 words and the same arriving reader wants it.

**Facts to verify.** Every time and every fare. This page is entirely composed of
perishable claims, which makes it the highest risk of the four. Any leg not
verified gets an explicit `TODO:` line. Set `last_updated` honestly and expect to
revisit it.

**Also do.** Update the href at
[GettingHere.astro:18](src/components/home/GettingHere.astro#L18) in the same
commit.

---

## Phase 3: `/accessibility`

Not a guide article. It is a utility page and belongs in
[src/pages/](src/pages/) beside `privacy.astro`, `terms.astro` and
`cookies.astro`, matching their layout and structure. Referenced once, from
[SiteFooter.astro:29](src/components/SiteFooter.astro#L29), in the Visit column
next to Getting here, Tickets and Weather.

Note the placement is doing something specific. Sitting in Visit rather than in
the legal row, it reads as a promise about **accessibility of the mountain**,
steps, gradients, wheelchair viability, not a web accessibility statement. Decide
which one is meant.

- If it means the mountain: this is a guide article, not a static page, and it is
  a substantial commission covering terrain, the shuttle, the villa route steps
  and Sword Pond. Roughly 1,500 words. Move it into phase 2 as article E.
- If it means the website: a short static page in `src/pages/`, done in an hour.

**Recommendation: it means the mountain**, given where it sits in the footer. But
this is a call to make deliberately, not by default. If the mountain page is
wanted, move the footer link into the Visit column pointing at
`/plan/accessibility/` and write it as a guide article under Plan your trip.

---

## Order of work

1. **Phase 1 retargets**, one commit. Six dead links gone, no writing. Ship it.
2. **Article A, villages.** Thirteen inbound links and nine articles currently
   promising a page that does not exist. Nothing else comes close.
3. **Article B, sword pond.** Two header slots.
4. **Article C, tea.** Ships together with the phase 1.5 nav retarget.
5. **Article D, the airports.** Ships together with the component href change.
6. **Phase 3 accessibility**, once the scope question above is answered.

Do not batch the four articles into one pass. Each needs its facts verified
before it is written, and the verification is the slow part, not the prose.

---

## Per article checklist

- [ ] Read every inbound link's surrounding paragraph before writing
- [ ] Facts verified, or an explicit `TODO:` line where they are not
- [ ] Frontmatter complete, every required field per the schema
- [ ] `last_updated` set to the real date
- [ ] `# Title` present, knowing the build strips it
- [ ] Lead image at 16:9, hand written `image_alt`
- [ ] At least three inline figures at 3:2, each with a caption carrying
      information the prose does not
- [ ] Raw PNGs in `assets/raw/guide/`, every one looked at before wiring
- [ ] Re-encoded with `npm run img`, output committed, no Vercel optimization
- [ ] Internal links drafted with trailing slashes
- [ ] Source citation line where the section carries researched claims
- [ ] Word count inside the 1,300 to 2,100 house range, `word_count` set
- [ ] Any component or nav href that pointed at the old slug updated in the
      same commit

---

## Appendix: one gap nothing links to

The seasons section ships summer, autumn and winter, and has no spring page.
Nothing links to `/seasons/spring`, so it did not surface in the dead link audit,
but a four season section missing a season is visible to any reader who looks at
the [seasons hub](src/content/guide/seasons.md). Spring is also when the tea is
picked, which article C will point at. Worth commissioning after this batch.
