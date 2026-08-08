# QA log — /things-to-do/sword-pond/

Article: `/home/claude/muuke/articles/things-to-do-sword-pond.md`
Brief: BRIEF.md plus BRIEF-BATCH4.md (overrides frontmatter, excerpt, seo_title, images, length).
Facts: FACTS.md only. Section 11 governs the legend and is the reason the whole page is written as legend, never as history.
Target: 1,400 body words. Schema TouristAttraction. No FAQ. American English. Zero em dashes.
Inbound pages read before writing: things-to-do.md, things-to-do-hiking.md, moganshan-scenic-area.md, plan-tickets-and-entry.md, moganshan.md. Corpus grepped for existing Sword Pond treatments (18 mentions across 20 files) and for the opening line of all 63 pages before the standfirst was written.

## Iteration 1 — journalist-style draft

Changed: wrote the full draft to the six-section outline (what it is, the legend, getting to it, standing there, with children, when to go and combining), lead figure plus three inline figures at the specified breaks, five outbound links with trailing slashes, six explicit TODO lines. Measured 1,966 body words, 0 em dashes.

## Iteration 2 — 10 weaknesses

1. **Overlength by 40 percent.** 1,966 body words against a 1,400 target. Every section runs long, so the outline's proportions are lost and the page reads padded on a subject that does not have 2,000 words of verified material behind it.
2. **The opening restates itself.** Paragraph one says the mountain is named after two swordsmiths, then says the mountain's name and the pond's name come from the same story. Same fact, twice, in the first sixty words, on a page a reader lands on with one question.
3. **The confirm/open table duplicates the TODO lines.** The four right-hand cells reappear almost verbatim as TODO blocks in sections 3, 4 and 5. The same information is printed twice, which wastes the one structured block near the top.
4. **Section 2 buries its most useful sentence.** "This is legend, not documented history" governs how a reader should take everything else in that section, and it arrives fourth, after three paragraphs of setup.
5. **Two unflagged time claims.** "A fine way to spend twenty minutes" in section 2 and "Budget the stop short" in section 4 are both estimates of time on site. The page's own rule is that anything unmeasured gets a TODO, and neither has one.
6. **Section 3's table cells read as prose.** The Deqing station row runs to 33 words across two sentences. A cell that long is a paragraph in a box and defeats the reason for using a table.
7. **The family section is the thinnest on the page.** The site card promises family and this section is the shortest of the six. It also opens by explaining why the section exists instead of answering the question.
8. **Mechanical signposting.** Three paragraphs open on the same construction: "Now the part that decides...", "Now say what this is.", "One more thing before the story." That is the writer narrating the structure rather than writing it.
9. **The entity trap is missing.** Every other page in this corpus rules out Moganshan Road, the M50 art district in Shanghai, which owns most of the English search results for this name.
10. **The closing section does three jobs and ends on a link list.** Crowds, timing and what to combine are all in section 6, and the last sentence before the date line is a run of page names. The page stops rather than closes.

## Iteration 3 — rewrite addressing the weaknesses

One line per weakness:

1. Cut toward the target and re-measured after every edit block (1,966 to 1,857 to 1,709 to 1,635 to 1,564 across the compression rounds).
2. Rebuilt the opening. First sentence states what Sword Pond is; the swordsmith fact appears once; the Chinese gloss (jian, sword; chi, pool) now does the expectation-setting immediately.
3. Replaced the confirm/open table with an at-a-glance table carrying different information: getting in, ticket, best conditions, time on site. No cell repeats a TODO line.
4. Reordered section 2 so the label comes first: "Start with the label, because it decides how to read the rest. This is legend, not documented history."
5. Cut the "twenty minutes" claim outright and attached `TODO: verify how long visitors actually spend at Sword Pond` to the short-stop guidance.
6. Shortened every cell in the getting-to table to a clause. The Deqing row went from 33 words to 17.
7. Rewrote the family section to open on the answer, "Yes, if the child can manage a flight of stone steps."
8. Broke all three "Now..." openers.
9. Added the entity trap as a parenthetical in the geography paragraph.
10. Split the close: crowd table under timing, combining advice in its own run, and a final direction (go up on the first transfers) instead of a link list.

## Iteration 4 — production-ready check

Verdict: **not production-ready at the end of iteration 3**, on one ground only: length. 1,857 body words against a 1,400 target, with the outline's per-section allocations all overshooting between 25 and 40 percent.

Fixed: three compression rounds, measured per section each time.

| Section | Outline target | After iteration 3 | After iteration 4 |
|---|---|---|---|
| Standfirst and what it is | 200 | 323 | 211 |
| The legend | 300 | 335 | 318 (incl. figure caption) |
| Getting to it | 250 | 349 | 277 (incl. figure caption) |
| What it is like to stand there | 250 | 264 | 244 |
| With children | 150 | 236 | 209 (incl. figure caption) |
| When to go and combining | 250 | 345 | 300 |

Also fixed at this pass: `word_count` in the frontmatter now tracks the measured number after every edit rather than the target.

## Iteration 5 — AI tells found and removed

Found and named:

- **Negative parallelism, six instances.** "not a lake or a gorge", "A stop on a longer walk, not a destination", "The approach is built, not scrambled", "laid stone rather than trail", "cut and sold as a crop rather than planted for the view", "advice rather than fact". Removed four, kept one (the bamboo crop line, which carries a fact and matches corpus usage) and rewrote one into a concrete sentence about what visitors get wrong.
- **Rule of three, three instances.** "no excavation, no artifact, nothing out of the ground" (cut to a pair); "signs, gates and shop fronts" (cut to two, later cut again); "The light is better, the paths are emptier, and you are not counting backwards" (rebuilt as two beats).
- **Writerly clock metaphor.** "Two hands on the clock decide this day, and neither belongs to the sun" replaced at iteration 13 with the plain statement of the hours.

## Iteration 6 — em dashes and citation format

Em dash count **before: 0. After: 0.** En dashes: 0. No em dash was ever typed, so none had to be converted.

Citations checked against the house format `> Source, body, date.` All three blockquotes conform and all three attribute to BeyondBorder Group Ltd primary research, 1 to 5 August 2026. The legend citation carries a second clause, "Recorded as legend, not as documented history," which is the same pattern the hiking page uses for its pending field check.

American English check run at this pass: found **"grey weather"** and changed it to **"gray weather"**. No other British forms present (centre, metre, colour, traveller, realise, programme, neighbour all absent).

## Iteration 7 — human-touch changes

- Restored the house line about the vehicle rule being one almost no English-language source prints, which is the single most useful sentence on any Moganshan access page and reads as a person who has been caught by it.
- "Sword Pond is past that barrier" became "Sword Pond sits on the far side of that barrier," which is how somebody describes a place they have stood below.
- Added the concrete instruction "Ask your guesthouse before you set out" (later sharpened to "the night before you go up") to the family section.
- **Accuracy fix taken at this pass:** "sword motifs on signs, gates and shop fronts around the mountain" was a specific FACTS.md does not hold. Reduced to "the swords in the local branding," which is what the corpus already publishes on things-to-do.md.

## Iteration 8 — SEO title, meta and excerpt

| Field | Value | Count |
|---|---|---|
| seo_title | Sword Pond Moganshan: The Legend and What You See | **49 characters** (cap 60) |
| meta_description | Sword Pond, or Jianchi, is where legend says Moganshan's swords were quenched. What is actually there, how you walk in, and what nobody has measured. | **149 characters** (cap 152) |
| excerpt | The most famous named sight on this mountain is a pool of water with a legend on it. What is honestly there, how you get to it, whether it works with children, and the four things nobody has measured. | **39 words** (range 25 to 40) |

Changed at this pass: the comma in "The Legend, and What You See" was removed. The excerpt was rewritten entirely, because the previous version repeated the body's second paragraph almost word for word and the excerpt prints as the standfirst directly above it.

## Iteration 9 — second AI-tell pass

Found the second time, after the first pass had cleaned the obvious ones:

- **"What follows is..."** as a filler opener. Changed to "This page is...".
- **Two "One X..." openers in consecutive sections.** "One rule shapes every visit here" and "One thing moves this more than the season does." Rewrote the second as "Season matters less here than last week's weather."
- **Chiasmus.** "The setting holds up even when the water does not" is the kind of mirrored line that reads as generated. Replaced with "The surroundings do not depend on the rain."
- **Repeated construction.** "The last stretch is where this page runs out" and "That is where the certainty stops" are the same sentence shape two sections apart. Rewrote the first as "Our knowledge runs out at the last stretch."

## Iteration 10 — second human-touch pass

- Split the quenching explanation into three short sentences so the paragraph has a change of pace in the middle of the legend.
- "Anyone expecting a lake, or a gorge with a river in it, has read the name wrong" gained the specific wrong picture a reader actually arrives with, then was trimmed back at iteration 18.
- "Ask your guesthouse before you set out" became "Ask your guesthouse the night before you go up," which is when the question is actually useful.
- Broke "the photogenic points queue, and a pool with a legend on it is one" into two sentences and, at the final tidy, fixed the sense: points do not queue, people queue at them.

## Iteration 11 — 10 hostile-reader issues

Written out with the fix for each.

1. **"'The sight most visitors here can name.' On what evidence?"** No source supports a claim about what visitors can name. Changed to "the sight this mountain is named for," which is a fact.
2. **"You put the pond inside the core scenic area in paragraph two, then say in section 3 you cannot verify it is inside the ticketed boundary. Which is it?"** The two statements contradicted each other. Paragraph two now reads "above the transfer centers, on the ticketed side of the mountain as far as anyone publishes," which matches the TODO exactly.
3. **"'Best conditions: a few days after rain' is a recommendation built on nothing you measured."** Correct. The table cell now reads "A few days after rain. Inferred, not measured."
4. **"You tell me to walk up but never say how long the outing takes. That is the one number I need."** The TODO admits it but does not help. Added the actionable alternative: ask at the transfer center counter when you buy the ticket.
5. **"'The height does nothing to anybody' at 719 meters, but the pond is reached by a flight of steps you have not counted. Those two sentences fight."** Resequenced so the steps come first and the reassurance is explicitly what is left over: "Steps are the limiting factor... Past that the ground is kind."
6. **"Where is the toilet, and is there anywhere to buy water?"** A real family question and not held anywhere. Folded into the family TODO rather than opening a new block.
7. **"'Do not plan around a stroller' but you also say you have not checked. That is a hedge, not an answer."** The advice now carries its basis: built stone steps are the normal surface on this mountain and the pond is reached by a flight of them.
8. **"You say no waterfall. Fine. Does the pond have moving water at all?"** Genuinely unknown. Said so: no source we hold says whether water visibly enters or leaves the pond.
9. **"You cite your own page as the source for the ticketed boundary. That is circular."** Rewritten to state the actual source position: every list we have found puts it inside the core, our scenic area page follows them, and no official source settles it.
10. **"The page never says whether it is worth the walk, which is what I searched for."** The one thing the brief asks the page to answer. Added a verdict immediately under the at-a-glance table: worth the walk if you are already inside the scenic area and the story interests you; on its own it does not justify the ticket and the transfer.

## Iteration 12 — structured to prose ratio

Measured **before: 33 percent structured, 67 percent prose.** Measured **after: 39 percent structured, 61 percent prose.**

Converted:

- The family advice paragraph became a four-item bulleted list with bold lead-ins, matching the list style already used on things-to-do.md. That moved 72 words out of prose and made four separate pieces of advice separately scannable.
- Merged the two water TODOs in section 4 into one block, which removed a duplicated hedge and shortened the section.
- Fourteen prose trims across all six sections in the same pass, since cutting prose is the other half of moving the ratio.

Left as prose deliberately: the two paragraphs on what the water looks like wet and dry. A table would have killed the only descriptive writing the page is entitled to make, and "Both are the real Sword Pond. Only one of them matches the pictures" does not survive being put in a cell.

Final structure: 3 tables, 3 blockquote citations, 1 bulleted list, 5 TODO blocks, 3 inline figures.

## Iteration 13 — triads, buzzwords, filler openers, balanced pairs

Found:

- Balanced pair: "Worth the walk if... Not worth the trip on its own."
- Triad: "paths are laid stone the whole way, with no scrambling and no exposure, and at 719 to 720 meters the height does nothing to anybody."
- Filler opener: "What comes next is our judgment."
- Negative-abstraction opener: "Daylight is not what bounds this day."
- Buzzword sweep: no instances of nestled, hidden gem, must-see, boasts, seamlessly, unlock, delve, vibrant, breathtaking, iconic, stunning. Clean on the first check.

**Three broken and named:**

1. **The "Worth / Not worth" balanced pair.** Now: "Worth the walk if you are already inside the scenic area and the story interests you. On its own it does not justify the ticket and the transfer." The second half names two concrete costs instead of mirroring the first half.
2. **The three-part terrain reassurance.** Dropped the middle member and split the sentence: "Past that the ground is kind. Paths are laid stone the whole way, and at 719 to 720 meters the height does nothing to anybody."
3. **The "What comes next is our judgment" filler opener.** Now: "The four lines below are judgment. We would defend them, and none of them has been checked on the ground."

Fourth, also broken: the daylight opener became "The transfer centers run 08:00 to 18:00, and that window is the day you get, whatever the light is doing."

## Iteration 14 — sentences that read mechanically

| Read mechanically | Rewrite |
|---|---|
| "Jianchi is the Chinese name: jian is sword, chi is pool. Pool is the right word for it. Anyone expecting a lake or a gorge has read the name wrong." | Cut the middle sentence, which repeated the gloss it had just given. |
| "Legend says two swordsmiths cooled finished blades in this water... [40-word sentence stacking the geography onto the legend]" | Split into a short legend sentence and a separate geography sentence, and the legend half was later cut as duplication of section 2. |
| "Our knowledge stops at the last stretch. You walk the final part... from wherever your transport stops." | "stops" twice in two sentences. Now: "Our knowledge runs out at the last stretch. You cover it on foot, on built stone, from wherever your transport leaves you, and we have no figure for how far that is." |
| "Yes, if the child can manage a flight of stone steps. Here is what sits behind it." | Cut the second sentence. The paragraph that follows already is what sits behind it. |
| "Say the story is enough. Getting there starts a long way below the pond, and with one rule English-language sources almost never print." | Ungrammatical after an earlier trim. Now: "Say the story is enough for you. Then getting there starts a long way below the pond, with one rule English-language sources almost never print." |

## Iteration 15 — blockquote, em dash and list separator check

- **Blockquotes:** 3, all opening `> `, all closing on "BeyondBorder Group Ltd primary research, 1 to 5 August 2026." Consistent with the rest of the corpus.
- **Em dashes:** 0. En dashes: 0. No stray double hyphens outside table rules.
- **List separators:** one bulleted list, four items, all `- **Bold lead-in.** Sentence.` with a period inside the bold and a full sentence after. Matches the pattern on things-to-do.md and getting-here-getting-around.md. No mixed bullet characters, no semicolon-separated inline lists.
- **TODO blocks:** 5, all in inline code fences, all beginning `TODO: verify`, matching the batch 4 convention set by moganshan-villages.md.

## Iteration 16 — transitions added

Three, quoted:

1. Into section 3, carrying the reader out of the legend and into logistics: **"Say the story is enough for you. Then getting there starts a long way below the pond, with one rule English-language sources almost never print."**
2. Inside section 4, closing the water question before the section turns to the setting: **"So much for the water. The surroundings do not depend on it."**
3. Into the combining advice at the end: **"Which leaves the question of what to put around it."**

## Iteration 17 — verification

| Check | Result |
|---|---|
| seo_title | 49 characters, under the 60 cap, keyword-led |
| meta_description | 149 characters, under 152 |
| excerpt | 39 words, inside the 25 to 40 range |
| Body word count at verification | 1,630 (1,568 after iteration 18) |
| Heading hierarchy | one H1, five H2, no H3, no skipped levels |
| Internal links | 5, all present, all with trailing slashes: /moganshan/scenic-area/, /plan/tickets-and-entry/, /things-to-do/hiking/, /things-to-do/, /moganshan/ |
| Citations | 3 blockquotes, house format, consistently attributed |
| Em dashes | 0 |
| FAQ block | none, and no question-shaped headings |
| Schema | TouristAttraction, as assigned |
| Figures | lead at /images/guide/things-to-do-sword-pond.webp plus sword-pond-2, -3 and -4 at the assigned section breaks, all with hand-written alt and informative captions |
| TODO lines | 5, covering distance and steps and gradient, the ticketed boundary, water level and flow and the waterfall question, time on site, and railings and stroller and toilets |
| Facts | every figure traces to FACTS.md. The legend is labeled as legend in the heading section, in the body and in its citation, with no date beyond the Spring and Autumn period and no archaeological claim |

## Iteration 18 — humanizers used more than once

| Humanizer | Count found | What changed |
|---|---|---|
| "we cannot tell you" | 3 | Kept none of the three in that exact form. Now "we have no figure for how far that is", "no source we hold says whether...", and "is not on record". |
| "nobody has [verb]" | 3 | Cut to 2. The family list item became "How deep it is, and what stands between path and edge, is not on record." |
| "a flight of stone steps" | 3 | Cut to 2 by rewriting the stroller bullet as "Nothing on this mountain is built for wheels." |
| "built stone / laid stone / built path / stone paths" | 5 | Left at 4 and varied the phrasing. This is a physical fact about the mountain that the page has to keep referring to, so it was varied rather than suppressed. |
| The short declarative beat ("That is where the certainty stops.") | 2 shapes | Kept one. The other, "The last stretch is where this page runs out," was rewritten at iteration 9. |

Final measured state: **1,568 body words, 0 em dashes, ratio 39 structured to 61 prose, 5 TODO lines, 5 internal links, 3 citations, 4 figures.**

## Standing notes for the editor

- Length landed at 1,568 against a 1,400 target, inside the 1,300 to 2,100 house range. The overshoot is scaffolding rather than prose: five TODO blocks, three tables, three citations and three captions account for roughly 390 words, and the six sections of running prose come to about 960.
- The assignment asked for inline figure 2 to show the legend rendered on site as a carving, plaque or shrine. FACTS.md holds nothing about any such object at Sword Pond and no source we have confirms one exists, so per the assignment's own fallback the figure was re-briefed as the approach steps, with the reason written into the image brief row.
- The page contradicts nothing already published in the corpus. Where moganshan-scenic-area.md and plan-tickets-and-entry.md place Sword Pond inside the ticketed core, this page follows them but says out loud that no official source settles the boundary, which is consistent with the existing TODO on plan-tickets-and-entry.md about whether the named sights are covered separately.
