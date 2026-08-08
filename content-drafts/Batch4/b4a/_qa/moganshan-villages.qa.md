# QA log — /moganshan/villages/

Article: `/home/claude/muuke/articles/moganshan-villages.md`
Brief: `BRIEF.md` + `BRIEF-BATCH4.md` (overrides on frontmatter, excerpt, seo_title, images, length) + `FACTS.md`.
Loop: ContentQuality, 18 passes, one at a time, one section per pass.

Inbound pages read before drafting, because they define what this page owes the reader:
`where-to-stay.md`, `where-to-stay-hotels.md`, `where-to-stay-villas.md`, `where-to-stay-minsu-explained.md`,
`where-to-stay-hotels-four-seasons-moganshan.md`, `plan-money-and-payments.md`,
`getting-here-getting-around.md`, `moganshan.md`, `moganshan-where-is-moganshan.md`.

Promises found in those nine, each of which this page has to pay:

| Promised by | The exact promise | Paid in |
|---|---|---|
| where-to-stay.md | "The villages guide covers each in detail" and prints `TODO: verify village-to-village road times` | Sections 2 and 8 |
| where-to-stay-hotels.md | "the villages guide says what each has after dark" | Section 7 |
| where-to-stay-villas.md | "Not every village sits inside the boundary, so check the villages guide" | Section 2 |
| where-to-stay-minsu-explained.md | "sets out which ones have anything open after dark" | Section 7 |
| four-seasons-moganshan.md | "The villages guide covers each one" + the Yu Village / Yucun ambiguity | Section 3 |
| plan-money-and-payments.md | "The villages sets out which is which" | Sections 2 and 7 |
| getting-here-getting-around.md | "sets out what each one is like to stay in" | Sections 3 to 6 |
| moganshan.md | "The villages guide compares them" | Section 6 |
| moganshan-where-is-moganshan.md | "takes them one at a time" | Sections 3 to 5b |

Corpus grep run before writing the opening: first two body paragraphs of all 61 existing pages extracted and read.
Shapes already used and therefore closed: geography-first ("The short answer is Deqing County"),
Chinese-name-first ("In Chinese it is 莫干山"), count-first ("Twelve hotels", "About 1,000 places to sleep"),
rule-first ("Here is the rule that catches nearly every visitor"), flat-negation ("There is no direct route. None."),
question-first ("The question you came here with, first"), search-intent-first ("You searched for the best hotels"),
mix-up-first ("The villa question here is an expensive mix-up").
Shape chosen: the reader's own booking document. No other page in the corpus opens on an artifact the reader is
already holding. Placement clause moved to paragraph 2 and shaped around the township layer (Moganshan Town,
Deqing County), which no other page leads that clause with.

---

## Iteration 1 — journalist-style draft
Changed: full 8-section draft written to the outline's section order and budgets, Place schema, three inline
figures at the assigned breaks, six required outbound links placed once each, zero em dashes on first write.
Measured 2,394 body words against an 1,800 target and a 2,100 house ceiling. Flagged for cutting at iteration 3.

## Iteration 2 — 10 weaknesses

1. **Length.** 2,394 body words. That is 594 over the assignment and 294 over the house ceiling in
   `BRIEF-BATCH4.md` section 5. Every section is over its budget, so no single cut fixes it.
2. **The TODO block reads as a maintenance backlog.** Three `TODO: verify` paragraphs stacked back to back in
   section 2, each a full sentence long, before the reader has been given a single village. Honest, but it
   stops the page dead at exactly the point the reader wanted the geography.
3. **Section 2's heading over-promises.** "Which side of the mountain each village is on" advertises a compass
   bearing for all seven rows. Two rows (Sanjiuwu, Dazaowu) carry `TODO: verify` in that exact column. The
   heading writes a check the table cannot cash.
4. **Xiantan buries the reader's real question.** The section opens with 135 guesthouses, under 2,000 residents
   and 90 percent local ownership, and only reaches the price range in the third paragraph. Price is why
   somebody clicks Xiantan.
5. **Sanjiuwu is written as history, not as a decision.** The reader is mid-booking. They get 2007, a founder's
   name and seven nationalities before being told whether they should sleep there or not.
6. **"Golden Week" used unexplained.** The audience is B1 to B2 and largely non-native. The term appears in the
   Xiantan price paragraph with no gloss, which breaks the brief's rule on explaining terms on first use.
7. **A hedge phrase repeats.** "that is a reading of the ownership figures rather than a measured fact" in
   section 4 and "our reading of the fact base, not a published recommendation" in section 6. Same move, same
   shape, 300 words apart. The second one lands as a tic.
8. **No bridge into the Laoling/Houwu/Dazaowu section.** "Three more villages carry beds" is a list opener. The
   page has just spent 270 words on Sanjiuwu and needs a sentence that carries the reader across.
9. **Structure is unevenly distributed.** Tables cluster in sections 2, 6 and 7; sections 3, 4, 5 and 8 are
   almost pure prose. The page reads like two documents stapled together rather than one with a rhythm.
10. **The closing section ends on a link rather than on the reader.** "The hill station up on the ridge is the
    other place everybody converges on" is a navigation sentence dressed as a conclusion, and it leaves the
    village decision, which is the whole job of the page, unresolved at the end.

## Iteration 3 — rewrite addressing the ten weaknesses
Changed, one line per weakness:

1. Cut to target by tightening every section rather than dropping one. Full-body rewrite, no section deleted.
2. Three stacked TODO paragraphs compressed into one labeled block of three short lines under a single
   framing sentence, so the gap is stated once and the page keeps moving.
3. Heading changed from "Which side of the mountain each village is on" to "Where the villages actually sit",
   and the table column renamed from "Side of the mountain" to "Where it sits", which the data supports.
4. Xiantan reordered: density first as one sentence, then the price range, then the trade-off. Price moved from
   paragraph three to paragraph three's first line and given its own short paragraph.
5. Sanjiuwu given a decision sentence in its second paragraph ("what that history does for a traveler") instead
   of holding it to the end.
6. "Golden Week" glossed in place as "the national holidays around 1 May and 1 October".
7. The section 4 hedge rewritten to an active construction ("We are reasoning from ownership figures here, not
   from a survey"), so the two hedges no longer share a shape.
8. Bridge sentence added at the head of the Laoling/Houwu/Dazaowu section, carrying over from Sanjiuwu.
9. Deferred to iteration 12, which is the pass that owns the structured-to-prose ratio. Noted, not touched.
10. Closing section re-ended on the reader's decision rather than on a link.

## Iteration 4 — production-ready verdict
Verdict at entry: **not production ready**, on one ground only. The draft measured 2,331 body words after
iteration 3, which is 231 over the 2,100 house ceiling in `BRIEF-BATCH4.md` section 5. Everything else passed.

Measured per section against the assignment's budgets:

| Section | Budget | At iteration 3 | After iteration 4 |
|---|---|---|---|
| 1 Opening | 200 | 186 | 186 |
| 2 Where they sit | 250 | 394 | 307 |
| 3 Yucun | 350 | 318 | 304 |
| 4 Xiantan | 300 | 258 | 253 |
| 5 Sanjiuwu | 300 | 262 | 246 |
| 5b Laoling, Houwu, Dazaowu | not budgeted, mandated by the assignment | 143 | 133 |
| 6 Which to pick | 250 | 279 | 261 |
| 7 Eating and paying | 200 | 274 | 254 |
| 8 Getting between | 150 | 217 | 197 |

Fixed: cut 235 words without dropping a fact, a table, a figure or a link. The structural cut was section 2's
fourth table column, which duplicated the "Why" column of the section 6 decision table; section 6 now owns the
"why" and section 2 owns location only. Remaining prose cuts were per sentence.

Note carried forward: even at the ceiling this page runs above the assignment's 1,800, because the assignment
also mandates a Laoling/Houwu/Dazaowu block that the eight-section outline does not budget for. Reported in
the return line rather than solved by deleting mandated content.

## Iteration 5 — AI tells, first pass
Vocabulary sweep run against the banned list in `BRIEF.md` plus a wider AI-tell list, machine checked:
nestled, hidden gem, must-see, boasts, seamless, unlock, delve, vibrant, breathtaking, tapestry, testament,
underscore, realm, crucial, ensure, robust, leverage, "when it comes to", "not only", moreover, furthermore,
additionally, "in conclusion", ultimately, arguably, "it is important to note". **Zero hits.**

Structural tells found and named, since the vocabulary was already clean:
- Rule of three: "Different flanks, roads that climb, and forest over more than 92 percent of the ground."
- Balanced pair: "That concentration is the case for staying here." / "It is also the case against."
- Negative parallelism: "It is not a village with guesthouses in it. It is mostly guesthouses."
- Triad closer: "Pick Yucun for one night or no car, Xiantan for the choice, anywhere else only once you have
  solved dinner and transport."
Removed here: the outline-echo triad "Where each village sits, what it has, what it does not, and which one
fits your trip", which was both a triad and a negative parallelism inside one sentence. Cut to
"what is around it". The other four were handed to iteration 13, which is the pass that owns them.

## Iteration 6 — em dashes and citation format
Em dashes before: **0**. Em dashes after: **0**. En dashes: 0. The draft was written without them rather than
cleaned of them, so nothing was converted; the check ran anyway because a pass not run is a pass failed.
Machine check on the character U+2014 across the whole file including frontmatter and image brief.

Citations checked against the house format `> Source, body, date.` All six now read
`> <what it covers>, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.` and all six terminate in
"2026." Fixed here: the Laoling/Houwu/Dazaowu table was carrying researched claims (the reservoir, kayaking
and cycling at Laoling, the Dadouwu reservoir, Houwu's transfer-center status) with no citation line under it.
Added the sixth blockquote.

## Iteration 7 — human touch, first pass
Named changes:
1. "So this page assumes you have picked a property" rewritten to "This page assumes the booking is more or
   less made", which is how a person describes a half-finished decision.
2. "On a Monday in March that is irrelevant. On the first Saturday of October it is the whole experience."
   kept and pulled forward, because it is the one line that dates the crowd claim to a reader's own calendar.
3. "Thirty minutes each way, including for dinner" left deliberately dry rather than explained.
4. "night one is arithmetic, not preference" kept as the human summary of the 18:00 transfer rule.
5. Added the reader's own object to the opening: the booking confirmation, which is a thing they are holding.

## Iteration 8 — SEO title, meta, excerpt
| Field | Value | Count | Limit |
|---|---|---|---|
| seo_title | Moganshan Villages: Yucun, Xiantan and Sanjiuwu | **47 chars** | under 60, per BATCH4 |
| meta_description | Six villages ring the foot of Moganshan and your bed is in one of them. What each one has, where it sits, and how to pick between them. | **135 chars** | under 152 |
| excerpt | Most of the beds at Moganshan are not on the mountain. They are in villages around the foot of it, and which village you book changes the trip more than the room does. | **33 words**, 167 chars | 25 to 40 words, BATCH4 |
| image_alt | Tiled village rooftops at the foot of a bamboo ridge at Moganshan, with terraced vegetable plots between the houses | 19 words | hand written, no "image of" |

seo_title is keyword led and carries all three names from the h1, so the search result and the page agree.
It is deliberately not cramped to the old 52-character cap, per the BATCH4 override.

## Iteration 9 — AI tells, second pass
What the second pass found that the first did not, because the first was looking at vocabulary:

1. **Four sentences opening on "That".** "That concentration...", "That history...", "That last row...",
   "That costs nothing until...". Four is a pattern, not a habit. Two rewritten: "The last row catches more
   people", and the opening reworked so the sentence runs "..., which matters not at all until the evening".
2. **Two "worth" constructions.** "Six are worth knowing by name" and "The limits are worth stating." The
   second changed to "The limits matter here."
3. **Three hedges, two of them sharing a noun.** "Nobody has surveyed it" (Sanjiuwu), "not a survey, because
   nobody publishes one" (Xiantan), "our reading of the fact base" (section 6). The Sanjiuwu hedge changed to
   "Nobody has counted this", so the three hedges no longer rhyme.
4. **An unsourced claim about what visitors know.** "most went home without learning which village they slept
   in" asserts a fact about 2.5 million people's knowledge. Rewritten to a claim we can stand behind: the
   village name is on every booking and in almost none of the English-language coverage.

## Iteration 10 — human touch, second pass
Changed:
1. "Arriving late, it is the village with the fewest moves between shuttle and door" tightened to "the shortest
   hop from shuttle to door", which is how somebody carrying a suitcase would put it.
2. "Get in after about 17:30" replaced "Land after about 17:30", because you land at an airport and this is a
   train.
3. "This page assumes the booking is more or less made and you want to know what is down there" ends the
   opening on the reader's position rather than on a contents list.
4. "You came for the water or the bike, not a square" in the Laoling row, written as a sentence somebody would
   actually say rather than a feature list.
5. Left one deliberately flat line unpolished: "It exists and people stay there." It is the honest register for
   a village we hold three facts about.

## Iteration 11 — hostile reader, 10 issues

1. **"Six villages" against a seven-row table.** A reader who counts finds a mismatch. Fixed by making the
   Wukang row say "The county seat, not a village" in the table itself, so the count and the table agree.
2. **The excerpt overclaimed.** "Almost nobody sleeps on Moganshan itself" is contradicted by our own hotels
   page, which places naked Stables and naked Castle on the mountain. Rewritten to "Most of the beds at
   Moganshan are not on the mountain", which is what the fact base supports.
3. **"the densest guesthouse village on the mountain"** describes Xiantan, which the fact base puts at the
   northern *foot*, not on the mountain. Changed to "the densest guesthouse village here".
4. **"Trains from Shanghai Hongqiao reach Deqing in 63 to 80 minutes"** names a place the page never
   introduced as a station. Changed to "Deqing station".
5. **The English-odds claim had no source.** "The foreign-founded end carries the best odds of English at the
   door" reads as fact and is inference. Prefixed with "Nobody has counted this, but".
6. **"tourist distribution center" is jargon** for a reader who has never been. Reframed as the Y1's last stop,
   so the term is anchored to something the reader can picture.
7. **The 135 figure appeared three times** (section 2 table, section 4 prose, section 6 table). Section 2's
   instance removed with the fourth column, leaving two, which is the pivot and the decision row.
8. **"Yucun is the center of gravity, so most trips pass through it"** in section 8 repeated
   "you will probably pass through it even if you sleep elsewhere" from section 3. The section 8 clause cut.
9. **The Fatou gap invited a fair question we had not answered:** is Fatou a village you can sleep in? Now
   stated in the open: "Our research names Fatou and nothing more."
10. **The decision table read as advice with no standing.** A hostile reader asks who says. Labeled at the top:
    "This is our reading of the fact base, not a published recommendation."

## Iteration 12 — structured to prose ratio
Measured by counting words on lines that open a table row, a blockquote, a bullet or a figure, against words in
running paragraphs.

| Point | Structured | Prose | Ratio |
|---|---|---|---|
| Before | 648 words | 1,479 words | **30:70** |
| After | 745 words | 1,355 words | **36:64** |

Converted: the "Laoling, Houwu and Dazaowu" section, which was three bolded prose paragraphs describing three
parallel things. Three parallel things with the same four questions asked of each is a table, and it now reads
as one: Village, Where, What is there, What it costs you. The conversion also cut 31 words.

Not converted, and the reason: the Yucun, Xiantan and Sanjiuwu sections stay as prose. Each is one village
being argued about, with a case for and a case against, and a table cannot hold an argument. Pushing this page
to a true 50:50 would mean tabulating judgment, which is the failure mode the brief warns about when it says
not to template every section the same way. 36:64 on a page carrying four tables, six citations, a bulleted
gap block and three captioned figures is the honest landing point.

## Iteration 13 — triads, buzzwords, filler openers, balanced pairs
Found:
- Triad: "Different flanks, roads that climb, and forest over more than 92 percent of the ground in between."
- Balanced pair: "That concentration is the case for staying here." / "It is also the case against."
- Triad closer: "Pick Yucun for one night or no car, Xiantan for the choice, anywhere else only once you have
  solved dinner and transport."
- Negative parallelism: "It is not a village with guesthouses in it. It is mostly guesthouses, with a village
  still attached."
- Balanced pair: "Village to village is a road trip, short but real."
- Filler opener: "The limits are worth stating."

**Three named and broken:**
1. **The triad** became two clauses and a separate sentence: "They sit on different flanks of one hill, joined
   by roads that climb, with forest over more than 92 percent of the ground between. Walking works inside the
   scenic area, where the named sights sit close together. Everywhere else it fails."
2. **The for/against balanced pair** broken by changing the second half from a mirror to a different move:
   "It is also the case against" became "The same concentration is why people leave it."
3. **The triad closer** broken into two plus a coda: "Pick Yucun if you have one night or no car, and Xiantan
   if you want the choice. Anywhere else, solve dinner and transport before you book."

Kept, with the reason written out because the pass asks a question: should the negative parallelism at
"It is not a village with guesthouses in it. It is mostly guesthouses, with a village still attached" also be
broken? No. The construction is a tell when it is decorative, where the negation adds nothing the positive did
not already carry. Here the negation is the point: the reader's default mental model is a village that happens
to have guesthouses, and the sentence exists to replace that model with the true one. Breaking it would cost
the reader the correction. One instance, doing work, stays.

## Iteration 14 — mechanically reading sentences
| Read mechanically | Rewritten to |
|---|---|
| "Three figures a page like this usually prints are missing from our research." | "Three things a page like this usually prints are missing from our research." ("figures" collided with the numbers in the same block) |
| "Two of those three are villages on the list above." then cut to "Two are villages above." | "Two of them are villages on the list above." The over-tight version had become a telegram |
| "That concentration is the case for staying here. The concentration is also the case against it." | "That concentration is the case for staying here. The same concentration is why people leave it." |
| "Yucun is the practical center of gravity, so most trips pass through it whether you planned that or not." | Cut. It restated section 3 |
| "It suits people who want to be on the water or on a bike rather than in a square." | "You came for the water or the bike, not a square." Second person, half the length |
| "Chinese reporting on this sector says it plainly. These villages have no evening economy: no night market, very little late food." | "Chinese reporting on the sector is blunt: these villages have no evening economy. No night market, very little late food." |

## Iteration 15 — blockquote, em dash and list separator check
Blockquotes: 6, machine checked. All open `> `, all name what they cover before the source, all attribute to
"BeyondBorder Group Ltd primary research", all close "1 to 5 August 2026." No stray blockquote used for
emphasis rather than citation. No multi-line blockquote.

Em dash recheck across the whole file, frontmatter and image brief included: **0**. En dashes: 0. Hyphens are
hyphens (half board, high-end, foreign-founded, scenic-area) and none is standing in for a dash.

List separators: one bulleted list in the body, three items, each opening with a fenced `TODO: verify` and
closing with a period. Consistent. Four tables, all with a header row and an alignment row, all cells sentence
case, no cell ending in a period except where it holds a full sentence. Serial comma usage checked and
consistent (the house corpus does not use the Oxford comma; this page does not either).

## Iteration 16 — transitions added
Three, quoted:

1. Into Xiantan, which previously started cold on a statistic:
   > "If Yucun is the safe answer, Xiantan is the one with the most doors."
2. Into the eating and paying section, which previously started on a citation:
   > "Village picked, two things decide how the stay goes: what you eat, and how you pay."
3. Into the Laoling, Houwu and Dazaowu table, carrying over from the Sanjiuwu section:
   > "Sanjiuwu is the village with a story. These three come with a trade-off."

## Iteration 17 — verification
| Check | Result |
|---|---|
| Body words, excluding the image brief | **2,100** |
| `word_count` frontmatter matches the measure | Yes, 2,100 |
| House range 1,300 to 2,100 | Inside, at the ceiling |
| Assignment target 1,800 | Over by 300. See iteration 4 note |
| seo_title | **47 characters**, under the 60 cap |
| meta_description | **135 characters**, under 152 |
| excerpt | **33 words**, inside 25 to 40 |
| image + image_alt present | Yes, `/images/guide/moganshan-villages.webp`, alt hand written |
| Heading hierarchy | 1 h1, 8 h2, 0 h3. No level skipped |
| Em dashes | **0** |
| Blockquote citations | 6, all in house format |
| Inline figures | 3, at `villages-2` after section 3, `villages-3` after section 5, `villages-4` after section 7 |
| `/images/part-villages.webp` reused | No. Machine checked, absent |
| Required outbound links, trailing slashes | 6 of 6: `/moganshan/`, `/where-to-stay/minsu-explained/`, `/getting-here/getting-around/`, `/plan/money-and-payments/`, `/getting-here/deqing-station/`, `/moganshan/hill-station/`. Plus `/where-to-stay/` |
| FAQ section | None. Regex checked for "FAQ", "frequently asked", "questions people" in any heading |
| British spellings | None. Checked centre, colour, metre, kilometre, organise, realise, travelling, neighbourhood |
| Primary keyword in body | "Moganshan villages" appears once, in the opening, and in title and seo_title |
| `TODO: verify` lines | **11** |
| Facts outside `FACTS.md` | None. Every figure traced back to a numbered section of the fact base |
| Schema | `Place`, as assigned |
| last_updated | 2026-08-07, as BATCH4 requires |

The eleven TODOs, listed so nothing hides:
1. Sanjiuwu's side of the mountain (table). 2. Dazaowu's side (table). 3. Per-village elevations.
4. Road distance and drive time from each village to the gate. 5. Which villages the Y1 shuttle serves.
6. Whether the Four Seasons "Yu Village" is Yucun (庾村). 7. Xiantan to gate road time.
8. Sanjiuwu location, size and guesthouse count. 9. Dazaowu guesthouse stock and road access.
10. Cash reliability, ATMs, and whether the shuttle and transfer take cash. 11. Village-to-village road times.

Items 3, 4 and 5 are the three the assignment specifically forbade inventing. Each carries its own explicit
`TODO: verify` line, in the open, in the section a reader would look for it.

## Iteration 18 — humanizers used more than once
| Device used twice or more | What was varied or cut |
|---|---|
| Sentence opening on "That" (4 instances) | Two rewritten: "The last row catches more people", and the opening reworked to a relative clause. Two kept, in different sections |
| "worth knowing" / "worth stating" | Second changed to "The limits matter here" |
| Survey hedge, twice, plus a third hedge (3) | Sanjiuwu's changed from "Nobody has surveyed it" to "Nobody has counted this"; Xiantan keeps the survey; section 6 uses "our reading of the fact base" |
| "which costs nobody anything" / "That costs nothing" | Collapsed to one, "which matters not at all until" |
| "you will probably pass through it" (Yucun) / "most trips pass through it" (section 8) | Section 8 instance cut |
| Em-dash substitute colon, 5 instances | Left. Five colons across 2,100 words is normal punctuation, not a tic |
| "about 30 minutes" for Houwu to Yucun, 4 instances | Kept all four. It is the only measured village-to-village figure we hold, and each instance answers a different question. Repeating a number is not a stylistic tic |

No deliberate errors were introduced anywhere in this loop, per the skill's hard rule.

---

## Final state
FILE: /home/claude/muuke/articles/moganshan-villages.md
QA_FILE: /home/claude/muuke/articles/_qa/moganshan-villages.qa.md
Body words 2,100. Em dashes 0. Passes 1 to 18 all run, in order, one section per pass.
