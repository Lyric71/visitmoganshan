# Serie 2 cross-set audit — 15 finished articles

Auditor pass over the finished set, applying ContentQuality passes 11, 12, 13, 15 and 18 plus a
cross-file fact-consistency check. Mechanical checks (em dashes, FAQ, schema, SEO ceilings, excerpt
word count, H1 count, British spellings, banned vocabulary, heading hierarchy, 97 internal links)
were confirmed by script beforehand and re-confirmed after editing. All 15 files were edited.

Scope note: this is a **set-level** audit. The dominant finding is Pass 18. Fifteen writers working
from one brief converged on the same sentence shapes, the same disambiguation paragraph, the same
paragraph openers and the same closing formula. None of that is visible inside a single file.

---

## Pass 11 — hostile reader

Read as a time-pressured sceptic. Issues found and fixed.

### Weak subheads (bare nouns that promise nothing)

| File | Before | After |
|---|---|---|
| things-to-do.md | `## Walking` | `## Walking, which is most of the day` |
| things-to-do.md | `## Tea` | `## Tea, and what we cannot yet tell you` |
| things-to-do.md | `## Evenings` | `## Evenings are quiet by default` |
| itineraries.md | `## One day` | `## One day: what the day trip really buys` |
| itineraries-shanghai-hangzhou-moganshan.md | `## Day by day` | `## The five days in detail` |
| itineraries-shanghai-hangzhou-moganshan.md | `## When to go` | `## When to go, and the two weeks to skip` |

### Missing credibility anchors

- **things-to-do.md** cited the NYT listing without its position. Added "at position 18 on a
  numbered list", which is in the fact base and is the detail that makes the claim checkable.
- **itineraries-shanghai-hangzhou-moganshan.md** had the same problem in the body; now "at number 18".
- **plan-china-visa-free-entry.md** buried its date stamp under a soft line ("This is the part worth
  bookmarking"). The date stamp is now attached to the table itself: "It was accurate on 5 August 2026."
- **things-to-do-hiking.md** had a "Company" row in the terrain table with no anchor; now names
  Mondays explicitly, matching the occupancy data cited later on the same page.

### Thin high-intent content

- **plan-tickets-and-entry.md** "What we still do not know" was three loose prose paragraphs on the
  single highest-intent question on the page (what a ticket actually covers). Converted to a table
  with a status column. All three TODO markers preserved verbatim.
- **things-to-do.md** "Cycling and the water" was a prose blur across two villages and one rule.
  Converted to a where/what table.
- **things-to-do-hiking.md** footwear advice, the most-searched practical detail on a hiking page,
  was buried in a four-sentence paragraph. Converted to four bold-label lines.
- **moganshan-where-is-moganshan.md** the three name traps, which is the entire reason the page
  exists, ran as flowing prose. Converted to a bold-label list so the trap names are scannable.

### Freshness cues

All 15 already carried a last-checked line. The problem was the opposite (see Pass 18): the line was
the same shape in 14 of 15. **itineraries-shanghai-hangzhou-moganshan.md** was the one file whose
closing line was not italicised, breaking the set's own convention. Fixed.

---

## Pass 12 — structural ratio

Measured as **body words inside structured blocks** (markdown table rows, bullet items, bold-label
lines) against **body words in flowing prose**. Headings and blockquote citations excluded from both.

Every file in the set was prose-heavy before the pass, from 21:79 to 37:63. None was over-structured.
The working band applied was 30 to 40 percent structured; going further would have breached the
5 percent growth cap, since converting prose to a table costs words in cell labels.

| File | Ratio before | Ratio after | Body words before / after | Growth |
|---|---|---|---|---|
| moganshan-where-is-moganshan.md | 24:76 | **37:63** | 812 / 804 | -1.0% |
| moganshan-scenic-area.md | 26:74 | **31:69** | 1105 / 1108 | +0.3% |
| moganshan-hill-station-the-villas.md | 36:64 | 36:64 | 1422 / 1447 | +1.8% |
| things-to-do.md | 27:73 | **33:67** | 1527 / 1539 | +0.8% |
| things-to-do-hiking.md | 23:77 | **30:70** | 1202 / 1238 | +3.0% |
| where-to-stay.md | 37:63 | 37:63 | 1643 / 1641 | -0.1% |
| itineraries.md | 27:73 | **32:68** | 1209 / 1210 | +0.1% |
| itineraries-weekend-from-shanghai.md | 33:67 | 33:67 | 1484 / 1484 | 0.0% |
| itineraries-shanghai-hangzhou-moganshan.md | 22:78 | **31:69** | 1501 / 1511 | +0.7% |
| plan.md | 33:67 | 34:66 | 1398 / 1403 | +0.4% |
| plan-best-time-to-visit.md | 34:66 | 34:66 | 1375 / 1373 | -0.1% |
| plan-tickets-and-entry.md | 27:73 | **36:64** | 1001 / 1011 | +1.0% |
| plan-china-visa-free-entry.md | 34:66 | 34:66 | 1840 / 1835 | -0.3% |
| plan-money-and-payments.md | 30:70 | 30:70 | 1485 / 1489 | +0.3% |
| seasons.md | 21:79 | **30:70** | 1444 / 1446 | +0.1% |

Bolded rows were converted. Largest movers: where-is-moganshan (+13 points), shanghai-hangzhou (+9),
seasons (+9), tickets-and-entry (+9), hiking (+7).

### Blocks converted

| File | Prose converted to | What |
|---|---|---|
| moganshan-where-is-moganshan.md | bold-label list | The three name traps |
| moganshan-where-is-moganshan.md | 4-row table | The base villages |
| moganshan-scenic-area.md | 3-row table | The three official designations (also killed a triad) |
| things-to-do.md | 3-row table | Cycling and the water |
| things-to-do.md | bold-label list | Evenings |
| things-to-do-hiking.md | bold-label list | What the stone paths connect |
| things-to-do-hiking.md | bold-label list | Footwear and wet weather |
| itineraries.md | 4-row table | The rail legs and the last mile |
| itineraries-shanghai-hangzhou-moganshan.md | 2-row table | Where to sleep on the mountain |
| itineraries-shanghai-hangzhou-moganshan.md | bold-label list | Who this trip is wrong for |
| plan-tickets-and-entry.md | 3-row table | The three open ticket questions |
| seasons.md | 3-row table | Spring month by month |
| seasons.md | bold-label list | Summer, June against July and August |

No file grew by more than 3.0 percent. Cap was 5 percent.

---

## Pass 13 — AI patterns

Hunted across all 15 for rhetorical triads, perfectly balanced sentence pairs, filler openers and
surviving buzzwords. **57 patterns broken, minimum 3 per file.**

### Rhetorical triads found

| File | The triad | Fix |
|---|---|---|
| moganshan-scenic-area.md | "It is a national scenic area... It is graded AAAA... And on 15 December 2020..." | Converted to a 3-row table |
| where-to-stay.md | "which village you sleep in, which price band you are in, and what kind of property you are booking" | Re-cast as a sequence, not a balanced set: "the village you sleep in, then the price band, then the kind of property" |
| moganshan-where-is-moganshan.md | "Those two cities are where almost everyone starts. Two numbers people ask for. They are not close." (three-beat fragment run) | One sentence |
| seasons.md | March / April / May as three parallel prose sentences | Converted to a table |

### Balanced sentence pairs found

| File | The pair | Fix |
|---|---|---|
| things-to-do-hiking.md | "Some link the named sights... Others connect villages or run between villas." | Three bold-label lines |
| itineraries-shanghai-hangzhou-moganshan.md | "Five days is not much, and three bases in that time is fast." / "The villages also have no evening economy" | Bold-label list |
| plan-china-visa-free-entry.md | "A table on a travel site is not an immigration ruling, and this one was accurate on 5 August 2026 and no later." | Split; the date claim moved up to sit with the table |
| where-to-stay.md | "No night market, very little late food." after a two-beat lead | Merged into one clause |

### Filler openers found (paragraph-initial)

Counted across the set before the pass, then eliminated or varied:

| Opener | Files before | Files after |
|---|---|---|
| "Now the ..." | 7 | 0 |
| "Here is ..." | 6 | 0 |
| "One more ..." | 5 | 0 |
| "Treat ..." | 5 | 0 |
| "One thing ..." | 3 | 0 |
| "Most guides ..." | 4 | 0 |

### Vague-quantifier tells

- **itineraries-weekend-from-shanghai.md** "reach Deqing in a little over an hour" against a measured
  63 to 80 minute range. Replaced with "inside 80 minutes".
- **plan.md** "about an hour more from Pudong" against a measured 1h15 delta. Replaced with
  "about an hour and a quarter more from Pudong, at 4 hours to 4 hours 45".

### Buzzword sweep

No survivors from the banned list. One softener flagged and cut: "An honest page has to admit
something here" in plan-tickets-and-entry.md, which claims a virtue instead of showing one.

---

## Pass 15 — structural smell test

### Blockquote citations

**57 citations across the set. Five different formats were in use.** House standard, per the brief, is:

```
> Subject or source name, publication or body, date.
```

resolving for this fact base to `> <subject>, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.`

| Deviation | Files | Count | Fixed to |
|---|---|---|---|
| `. BeyondBorder Group Ltd research file, August 2026.` (period separator, wrong body name, wrong date form) | itineraries-shanghai-hangzhou-moganshan.md | 6 | comma separator, "primary research", "1 to 5 August 2026" |
| `..., BeyondBorder Group Ltd primary research, Hong Kong, 1 to 5 August 2026.` (place inserted mid-citation) | itineraries-weekend-from-shanghai.md | 3 | place removed |
| `Subject: BeyondBorder Group Ltd primary research...` (colon separator) | things-to-do-hiking.md | 3 | comma separator |
| `> BeyondBorder Group Ltd, primary research, Hong Kong, compiled 1 to 5 August 2026.` (no subject, "compiled", place) | moganshan-hill-station-the-villas.md | 1 | subject added, place and "compiled" removed |
| Keon citation missing "published online"; NYT citation source-last in one file, source-first in another | things-to-do.md | 2 | both normalised to the villas-page form and to source-first |

**15 citations standardized. All 57 now share one shape.** Third-party citations (Tripadvisor, Four
Seasons, The New York Times, Hayley Keon) keep source-first order per the brief and are now identical
where the same source appears twice.

### List separators

All bullet lists across the set use `-`. Zero `*` or `+` markers. Two internally consistent list
styles are in use and both are retained deliberately: bare lowercase fragments (things-to-do.md, the
"what there is" list) and bold-label sentences (hiking, shanghai-hangzhou, things-to-do evenings).

### Other structural smells

- **things-to-do.md** had a double blank line before the "When / What to expect" table. Fixed.
- **itineraries-shanghai-hangzhou-moganshan.md** closing line was plain text where all 14 others were
  italic. Fixed.

---

## Pass 18 — cross-file tics

**The main finding of this audit.** Counted by number of files containing the pattern. Threshold for
"tic" is more than four files.

| # | Tic | Files before | Files after | What was done |
|---|---|---|---|---|
| 1 | Opening sentence shape "Moganshan is a mountain in Deqing County, part of Huzhou prefecture, in Zhejiang Province... It sits/stands/lies about 60 km north of Hangzhou and 200 to 240 km from Shanghai" | **13** | **1** | Nine openings rewritten into distinct shapes. Every placement fact (Deqing County, Huzhou, Zhejiang, 60 km north of Hangzhou) still lands inside the first 100 words, as the brief requires |
| 2 | Disambiguation paragraph: "Moganshan Road ... art district ... about 200 km away ... search results" repeated as a near-template | **15** | 15 mention it, 0 share a shape | Rewritten per page. Some now one clause, some a parenthetical, some folded into the opening sentence |
| 3 | "Private vehicles cannot drive inside the scenic area." verbatim | **6** | **4** | Varied to "No private vehicle goes past the boundary", "You cannot drive your own vehicle into", "No private car goes inside", "Your own car stops at the scenic-area boundary", "Cars stop at the scenic-area boundary" |
| 4 | Closing formula "*X, Y and Z last checked 5 August 2026...*" | **14** | max 5 share a shape | Four shapes now in rotation: "Checked 5 August 2026: ..." (5 files), "... stand as at 5 August 2026" (4), "... were current on 5 August 2026" (2), "... were verified on 5 August 2026" (2), plus two one-offs |
| 5 | "Now the ..." as a paragraph opener | **7** | **0** | Each rewritten to its own page's logic |
| 6 | "Here is ..." / "Here is the thing" family | **6** | **0** | Removed |
| 7 | "One more ..." / "One thing ..." openers | **6** | **0** | Removed |
| 8 | "Treat X as ..." opener | **5** | **0** | Removed |
| 9 | "Read / Look at X twice" as a post-table nudge | **5** | **0** | Every instance rewritten |
| 10 | "blunt" (as in "Chinese reporting is blunt") | **5** | **1** | Replaced with what the reporting actually says |
| 11 | "Most guides ..." | **4** | **0** | Removed |
| 12 | "catches you / people / visitors out" | **5** | **1** | Varied |
| 13 | "Mondays are notably quiet" verbatim | **7** | **4** | Varied to "Mondays stay quiet all year", "Mondays run the quietest of the week", "Mondays are the quiet exception", "the quietest day of the week at the gate" |
| 14 | "trust no published number, ours included" | **3** | **2** | One varied |
| 15 | Table header `Season \| On the mountain \| ...` | **3** | **1** | Varied to "Time of year / Up on the ridge" and "Season / What you get" |
| 16 | "honest / honestly" as a self-description in body copy | **4** | **3** | One cut. Frontmatter instances left untouched per the editing rules |

Total: **16 cross-file tics identified, 16 varied.**

### Table headers

Checked all 97 header rows. No full header row repeats across more than three files, and the three
that did (`When / What you are doing` appears three times inside a single file as a day-by-day
device, which is correct) are intentional. Repeated single header cells ("Season" 6 files, "Figure"
5, "When" 5, "Village" 4, "Step" 4) are generic column labels rather than tics; the two that formed
an identical multi-column signature were varied. No further action.

### What was deliberately NOT varied

Repeated **facts** are not tics. The transfer hours (08:00 to 18:00), the three transfer center names,
the 94 percent May 2024 occupancy figure, the 30 to 40 percent National Day footfall and the two
ticket ranges recur across the set because they are the same facts. Consistency there is the point,
and Pass 18 was applied to the sentence shapes carrying them, not to the numbers.

---

## Fact consistency across files

| Figure | Fact base | Files stating it | Consistent? | Action |
|---|---|---|---|---|
| Hongqiao to Deqing | 63 to 80 min, 13 direct a day | 6 | Yes on the number | One file glossed it as "a little over an hour", which reads as ~65 min against an 80 min ceiling. Changed to "inside 80 minutes" (itineraries-weekend-from-shanghai.md) |
| Hangzhou East to Deqing | 13 to 17 min, 16 a day | 5 | Yes | No change |
| Hangzhou to Moganshan by road | about 1.5 hours | 4 | **No** | plan-best-time-to-visit.md said "about 90 minutes from Hangzhou" where every other file says "about 1.5 hours". Same value, different unit, and it read as a separate measurement. Normalised to "about 1.5 hours" |
| Shanghai Pudong door to door | 4h00 to 4h45 vs 2h45 to 3h30 from central Shanghai | 5 | **No** | plan.md said Pudong is "about an hour more". The measured delta is 1h15. Changed to "about an hour and a quarter more from Pudong, at 4 hours to 4 hours 45" |
| Transfer center hours | 08:00 to 18:00, all three | 13 | Yes | No change to the figure. where-to-stay.md's row now states "all three", matching the rest |
| Two ticket price sets | RMB 120 online / 130 gate / half price winter, versus RMB 50 off-season / RMB 80 peak | 11 | **No** | moganshan-hill-station-the-villas.md and things-to-do-hiking.md both printed "Both [sources] agree on winter at half price". The fact base attributes the winter half price to the higher set only, and plan-tickets-and-entry.md correctly maps the lower set's RMB 50 to off-season. Both rows rewritten to match the tickets page |
| Summer gap | 6 to 7 °C cooler than Shanghai **and Hangzhou** | 11 | **No** | itineraries-weekend-from-shanghai.md said "6 to 7 degrees cooler than Shanghai" (Hangzhou dropped, and "degrees" instead of °C). plan-tickets-and-entry.md said "6 to 7 °C cooler than Shanghai". things-to-do-hiking.md said "cooler than the cities". seasons.md used "degrees" in one place. All four normalised to "6 to 7 °C cooler than Shanghai and Hangzhou" |
| Villa count | about 250 surviving, some sources say 200+ | 7 | Yes | No change. The villas page correctly carries the 200+ caveat; no other page contradicts it |
| Visa-free country count and date | 50 countries as of February 2026; Canada and UK added 17 February 2026; 55 transit nationalities; legislated to 31 December 2026 | 3 | Yes | No change. All three files agree on all four figures, and the visa page correctly explains why other sites publish 52 |

**Five inconsistencies found, five fixed.** No fact was introduced that is not in FACTS.md. No TODO
marker was removed; the set carries 50 TODO markers across 11 files, the same count as before.

---

## Verification after editing

| Check | Result |
|---|---|
| Em dashes across all 15 | 0 |
| FAQ sections / FAQPage schema | 0 |
| H1 per file | exactly 1 |
| Heading hierarchy skips | 0 |
| SEO title < 52 chars | 15/15 pass |
| Meta description < 152 chars | 15/15 pass |
| Excerpt exactly 25 words | 15/15 pass |
| British spellings in body | 0 |
| Internal links | 97, unchanged, 30 distinct targets |
| Bullet markers | 26, all `-` |
| Blockquote citations conforming to house format | 57/57 |
| TODO markers | 50, unchanged |
| Largest single-file growth | +3.0% (things-to-do-hiking.md), cap 5% |
| Frontmatter touched | `word_count` only, all 15 recomputed |
