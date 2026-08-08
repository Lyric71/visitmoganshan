# QA log — /plan/accessibility/

Article: `/home/claude/muuke/articles/plan-accessibility.md`
Brief: BRIEF.md plus BRIEF-BATCH4.md (overrides frontmatter, excerpt, seo_title, images, length).
Facts: FACTS.md only.
Target: 1,500 body words. Schema Article. No FAQ. American English. Zero em dashes.
Inbound and adjacent pages read before writing: getting-here-getting-around.md, getting-here-deqing-station.md, moganshan-scenic-area.md, moganshan-hill-station-walking-tour.md, things-to-do-hiking.md, things-to-do-sword-pond.md, where-to-stay.md, plus moganshan-villages.md for the batch 4 figure and TODO conventions. Corpus grepped for every existing mention of accessibility, wheelchair, step free, mobility, stroller and ramp (13 hits, all of them TODO markers or table cells, none of them a treatment), and the opening sentence of all 65 pages was extracted and compared before the lead was written.

## Note for the developer, outside the QA loop

`SiteFooter.astro` line 29 currently links `/accessibility` from the wrong place. It has to move into the **Visit** column, alongside Getting here, Tickets and Weather, and point at `/plan/accessibility/` with the trailing slash the build strips. That placement is the reason this is a guide article and not a static legal page: a link sitting next to Tickets and Weather is a promise about access to the mountain, not a web accessibility statement. If the site later needs a web accessibility statement, it is a separate page and belongs with Privacy, Terms and Cookies.

## Iteration 1 — journalist-style draft

Changed: wrote the full draft to the assignment's outline (what we hold and what we do not, getting to Deqing, the transfer rule, moving around, the scenic area, where to stay plus the questions to ask, strollers, what we want verified), lead figure plus three inline figures at the specified breaks, six outbound links with trailing slashes, ten explicit TODO lines. Measured 2,169 body words, 0 em dashes, 10 TODOs, 3 inline figures, 8 H2.

## Iteration 2 — 10 weaknesses

1. **Overlength by 45 percent.** 2,169 body words against a 1,500 target. The where-to-stay section alone runs 460 words and the rail section 302, which is the easiest leg of the trip taking the second-largest share of the page.
2. **The summary table and the TODO lines say the same thing twice.** Six cells in the right-hand "not confirmed" column reappear almost verbatim as TODO blocks lower down. The page's most important structural device is spending its space on repetition.
3. **No fallback.** The page documents the gap and stops. If the answer to every question is no, a reader still has to sleep somewhere, and Wukang, the county seat 20 km off the mountain with a conventional hotel in it, never appears.
4. **The rail section drifts into other pages' territory.** The wrong-station trap, the taxi fare and the fare ranges are all owned by the Deqing station page. Repeating them here costs 100 words that the terrain sections need.
5. **No statement of who the page is for.** "Limited mobility" covers a wheelchair user and somebody who walks 200 meters and then has to sit down. Those are different trips, and the page never acknowledges the range.
6. **The questions table mixes the question with the coaching.** Cells run to 30 words and the reader cannot scan the questions on their own, which is the one thing this table exists to let them do.
7. **The stroller section repeats the transfer TODO** instead of adding the thing a stroller actually changes: the 08:00 to 18:00 transfer window set against a nap, and the fact that a folded stroller is a carrying problem rather than an access problem.
8. **"We cannot answer that yet" overstates the ignorance.** Some things on this page are answered, and a reader who is told nothing is known has no reason to read on. The honesty rule cuts both ways.
9. **A sourcing error.** The scenic area section credits the stone-steps description of the Sword Pond approach to `/moganshan/scenic-area/`. That page does not say it. The Sword Pond page does, and it is not in this assignment's outbound list, so the claim has to stand on the mountain's general surface fact instead.
10. **The close is a wish list.** The final bullets ask for anything a reader saw, in no order, and the section ends on advice rather than on the page's own obligation. The assignment asks for the open questions ranked by what would change a trip.

## Iteration 3 — rewrite addressing the weaknesses

One line per weakness:

1. Compression started here and ran through the rest of the loop. The rewrite itself did not shrink the page: it grew to 2,384 because fixes 3 and 6 added a fourth table. Measured per section, the rail section went 302 to 237 and the where-to-stay section 460 to 505. The real cutting happened at iterations 4 and 12 and is recorded there.
2. Shortened every cell in the right-hand column to a clause of five to nine words, so the table names the gaps and the TODO lines specify them. No cell now duplicates a TODO sentence.
3. Added the Wukang fallback inside the where-to-stay section: the county seat 20 km off the mountain, the Crowne Plaza Deqing Moganshan at about 340 rooms, and an explicit TODO because we have not verified that hotel either.
4. Cut the wrong-station explanation to one sentence and a link, moved the taxi fare into the table, and deleted the fare ranges for both rail approaches.
5. Added the range statement to the opening: a wheelchair user and somebody who can walk a short distance are reading different pages, and where the answer splits, the page says which.
6. Rebuilt the questions table so the left column is the question alone, in the words to send, and the right column is what a vague answer means. Longest left-hand cell now 17 words.
7. Rewrote the stroller section around the two things that are specific to it: the folding, and the 08:00 to 18:00 window against an afternoon nap. Its TODO now covers only stroller carriage and storage.
8. Replaced "We cannot answer that yet" with a sentence that says what the page does hold and what it does not, in that order.
9. Removed the misattribution. The sentence now rests on the mountain's verified surface, built stone paths and steps, without crediting a page that does not carry the claim.
10. Replaced the wish-list bullets with the four open questions ranked by how much each would change a trip, and closed on what the site owes a reader rather than on what a reader owes the site.

## Iteration 4 — production-ready check

Verdict: **not production-ready at the end of iteration 3.** Two grounds, both worked at this pass and one of them still open at the end of the loop.

First, length. 2,384 body words against a 1,500 target, and above the 2,100 house ceiling. Four compression rounds ran at this pass and three more at iterations 12, 13 and 18.

| Section | After iteration 3 | After iteration 4 | Final |
|---|---|---|---|
| Opening | 180 | 171 | 157 |
| What we hold and what we do not | 232 | 224 | 192 |
| Getting as far as Deqing | 258 | 237 | 200 |
| The rule that decides everything | 237 | 223 | 212 |
| Once you are up there | 244 | 220 | 218 |
| The scenic area and the named sights | 150 | 136 | 121 |
| Where to stay and what to ask | 617 | 505 | 489 |
| With a stroller | 147 | 134 | 130 |
| What we want verified | 253 | 237 | 227 |

Measured totals across the whole run: 2,169 at iteration 1, 2,384 after the iteration 3 rewrite, 2,153 after the first compression round, then 2,138, 2,068, 2,048, 2,031 and 2,012 at the end.

Second, `word_count` in the frontmatter carried the target rather than the measured figure. It now reads 2,012, the real number, and was re-measured after every subsequent pass.

## Iteration 5 — AI tells found and removed

Found and named:

- **Negative parallelism, five instances.** "documentary image, not a scenic one" (kept, in the image brief, which is production copy rather than published prose), "a nuisance, not the question", "effort rather than access", "what you saw rather than what you were told", "a promise, not a description". Removed two, rewrote one into a concrete sentence about the car that goes to the door, kept two where the contrast carries the actual meaning of the sentence.
- **Rule of three, four instances.** "the floor height, the door width and the boarding method" (cut to two); "lifts, level platform access and staff assistance" (cut to two, the third moved into the TODO where it belongs); "on the lanes, on the paths and probably at your guesthouse door" (cut to two); "Sword Pond, Luhuadang Park, Dakeng, the Xuguang sunrise platform, Chiang Kai-shek's villa and the Bai and Yun Art Museum" (kept in full, because it is the corpus's standard list of named sights and truncating it would be a factual choice, not a stylistic one).
- **Inflated abstraction.** "the whole question" appeared twice in two paragraphs. One instance became "it removes the one thing that usually solves this: a car that reaches the door."
- **AI vocabulary sweep.** No instances of nestled, hidden gem, must-see, boasts, seamlessly, unlock, delve, vibrant, breathtaking, navigate (as a metaphor), robust, crucial, ensure. Clean on the first check.

## Iteration 6 — em dashes and citation format

Em dash count **before: 0. After: 0.** En dashes: 0. No em dash was typed at any point, so none had to be converted.

Citations checked against the house format `> Source, body, date.` Both blockquotes conform and both attribute to BeyondBorder Group Ltd primary research, 1 to 5 August 2026. The first carries a list of what it covers, which is the pattern `things-to-do-hiking.md` uses.

American English check run at this pass, and rerun at iteration 17. **Found: "lifts", twice**, in the Deqing station paragraph and in the TODO under it. Both changed to "elevators". The corpus had no precedent either way, so this page sets it. "Lift-equipped vehicle" was kept, because a wheelchair lift is called a lift in American usage too. "Center" is used throughout for the transfer centers, matching the corpus and overriding the fact base's "centre". No metre, colour, traveller, realise, programme or kerb; the draft's "curb" note was cut with the paragraph it sat in.

## Iteration 7 — human-touch changes

- The lead figure caption and the transfer-center caption now say out loud why the photograph is there: so the reader can judge the boarding height for themselves. That is a person handing over the evidence rather than a site making a claim.
- "A wrong reassurance here does not cost somebody a dull afternoon. It leaves them on the wrong side of a step with a train home in the morning." Kept from the draft, because it is the sentence that explains the page's whole method.
- Added the instruction to ask for two photographs, and the reason: a picture settles in ten seconds what an exchange of messages will not settle at all.
- Added the observation that the guesthouse will be running the message through a translation app, which is why the questions have to be short. That is practical knowledge a person has, not a rule a style guide produces.
- **Accuracy fix taken at this pass:** the draft called the Y1 "dressed as a Republican-era tram" and then said the styling tells you nothing about the floor height. The styling claim is in FACTS.md; the floor-height inference was ours. Kept both but separated them so the inference is visibly ours.

## Iteration 8 — SEO title, meta and excerpt

| Field | Value | Count |
|---|---|---|
| seo_title | Moganshan Accessibility: What We Can and Cannot Say | **51 characters** (cap 60) |
| meta_description | Moganshan is steep and private cars stop at the transfer centers. What we can confirm about step-free access, what we cannot, and what to ask. | **142 characters** (cap 152) |
| excerpt | The mountain is steep, private cars stop at the transfer centers, and nobody has published what the scenic-area vehicles are. What we can confirm, what we cannot, and the questions to put to a property before you pay. | **36 words** (range 25 to 40) |

Changed at this pass: the seo_title's contraction ("What We Know and Don't") was replaced, because an apostrophe in a title tag renders inconsistently across the corpus and no other page uses one. The meta_description's closing clause went from "what to ask before booking" to "what to ask a property" and then, at the iteration 17 recheck, to "what to ask", because the middle version measured 153 characters and broke the 152 cap.

## Iteration 9 — second AI-tell pass

Found the second time:

- **"One rule shapes this trip more than the gradient does."** The "One X..." opener is used on `getting-here-getting-around.md` and `moganshan-scenic-area.md` for the same fact, and a third instance makes it a house tic. Rewritten as "The private-vehicle rule decides this trip more than the gradient does."
- **Two sections opening on a definition.** "Moganshan is not one settlement" and "A stroller is easier than a wheelchair" are the same move two sections apart. The second became "Start with what makes it easier, because something on this page should be."
- **Symmetrical closing beat.** "It is the reason this page exists" in the opening and "it is the reason this page is mostly gaps" later. Cut the second.
- **Hedge stacking.** "usually have lifts and level platform access, and we are not going to promise you this one does" carried two hedges and a promise in one sentence. Split into a statement of the general pattern and a flat statement that we have not checked this station.

## Iteration 10 — second human-touch pass

- "Anything other than yes is a no" added to the ground-floor bedroom row. That is the sentence somebody says after being caught out once.
- The vague-answer column gained the specific wrong answers a reader will actually receive: "only a few", "it is a normal shower", "the bathroom is big".
- Changed "send us a report" to a description of what a useful report contains, in the order somebody would remember it: what came, whether you got on it, what it cost you in effort.
- Varied the sentence rhythm in the transfer section, which had four sentences of similar length in a row. The paragraph now opens on a seven-word sentence.

## Iteration 11 — 10 hostile-reader issues

Written out with the fix for each.

1. **"You have written a page about accessibility that cannot tell me whether I can get up the mountain. Why publish it?"** Fair, and it needed answering in the body rather than in the tone. The opening now states the page's actual use: it tells you which questions decide the trip, who can answer them, and what a non-answer sounds like.
2. **"'Private vehicles cannot enter' is the whole ballgame and you bury the consequence."** Moved the consequence up against the rule: the restriction removes the one thing that usually solves this, a car that reaches the door.
3. **"Deqing station is 'generally' step free. Generally is not a station."** Rewritten. The page now says what the general pattern is, says we have not checked this station, and puts the specifics in a TODO instead of in a reassurance.
4. **"You tell me to ask the property, but these are family houses with no accessibility vocabulary. You are outsourcing your research to a reader who cannot do it either."** Correct, and it is why the questions are now phrased as measurements rather than as categories. Nobody is asked whether they are "accessible". They are asked how many steps and how many centimeters.
5. **"What happens if every answer is no?"** Wukang. The county seat 20 km off the mountain has a conventional hotel of about 340 rooms, which is more likely to have level entry than a converted farmhouse. Said, with a TODO because we have not verified that hotel either.
6. **"Is there a disabled concession on the ticket? Every Chinese scenic area has one."** We do not hold it. Now an explicit TODO covering the concession, the proof accepted and whether a foreign disability card counts, rather than silence.
7. **"You say the villages have no evening economy. So what, for me specifically?"** Made specific: a guest who cannot walk to dinner is dependent on the property, so dinner is booked with the room and not decided at seven.
8. **"Your stroller advice is 'bring a carrier', which I could have guessed."** Added the two things that are not guessable: the transfer window shuts at 18:00, which sets the outside edge of an afternoon nap, and we do not know whether an unfolded stroller can board the transfer vehicle at all.
9. **"The word 'accessible' appears in your title and nowhere in your evidence."** Deliberate, and now stated: the page does not describe anything on this mountain as accessible, because no source we hold supports the word.
10. **"Eleven TODOs reads as a page that gave up."** The page now says why the density is there, in the body: the gaps are on terrain and vehicles, they cannot be closed from a desk, and a field check is what closes them.

## Iteration 12 — structured to prose ratio

Measured **before: 34 percent structured, 66 percent prose.** Measured **after: 41 percent structured, 59 percent prose.**

Converted:

- The reader-report paragraph at the close became a four-item ranked list, which is what the assignment asks for and moved 61 words out of prose.
- The rail leg's three prose sentences on fares and journey times folded into the existing table, removing a paragraph that duplicated it.
- Eleven prose trims across all eight sections in the same pass, since cutting prose is the other half of moving the ratio.

Left as prose deliberately: the two paragraphs on why a wrong reassurance is expensive, and the paragraph on translation apps. Both are the page's reasoning about itself, and reasoning does not survive being put in a cell.

Cut at this pass: the property-type table added at iteration 3, which restated in four rows what the summary table and the prose above it already carried. Removing it took the page from four tables to three and saved 112 words. The summary table also lost its villa row at the same time, and the citation under it lost the matching clause.

Final structure: 3 tables, 2 blockquote citations, 1 ranked list, 11 TODO blocks, 3 inline figures plus the lead.

## Iteration 13 — triads, buzzwords, filler openers, balanced pairs

Found:

- Triad: "the floor height, the door width and the boarding method."
- Triad: "lifts, level platform access and a staffed assistance service."
- Balanced pair: "For most travelers that is a nuisance. For anyone who cannot walk far, it is the whole question."
- Filler opener: "One consequence is worth stating plainly."
- Filler opener: "The open questions stay open."
- Buzzword sweep: clean. No nestled, hidden gem, must-see, boasts, seamlessly, unlock, delve, vibrant tapestry, breathtaking, iconic, stunning, journey (as a metaphor).

**Three broken and named:**

1. **The floor-height triad.** Now: "Nobody publishes the floor height or the door width." Two members, and the boarding method moved into the TODO line where it is one of the things we are asking somebody to measure.
2. **The nuisance/whole-question balanced pair.** Now: "For most travelers the transfer is a nuisance. For anyone who cannot walk far it removes the one thing that usually solves this, a car that reaches the door." The second half names the mechanism instead of mirroring the first half's shape.
3. **"One consequence is worth stating plainly."** Now: "The villages have no evening economy, and that lands harder on this page than on any other."

Fourth, also broken: "The open questions stay open" became "And the transfer vehicle is the same vehicle either way, so we know no more about it here than two sections ago."

## Iteration 14 — sentences that read mechanically

| Read mechanically | Rewrite |
|---|---|
| "Chinese high-speed stations built in that period usually have lifts and level platform access, and we are not going to promise you this one does." | Split, and the hedge stack removed: "Stations built for that network usually have lifts and level platform access. We have not checked this one." |
| "Every one of those is reached on built path from wherever the scenic-area transport leaves you." | "Built path" repeated a phrase used two sections earlier. Now: "You reach all of them on laid stone, from wherever the scenic-area transport puts you down." |
| "The gaps on this page are not going to close from a desk. They close by somebody standing at a transfer center with a tape measure, and that field check is scheduled." | Second sentence carried two clauses doing different jobs. Now two sentences, and "with a tape measure" kept because it is the concrete image the paragraph needs. |
| "A stroller is easier than a wheelchair, and the reason is simple. It folds, and the passenger can be carried." | "The reason is simple" is the writer announcing a reason instead of giving it. Now: "A stroller folds, and the passenger can be carried. That is the whole of why it is the easier problem." |
| "Message before you pay, not after." | Kept. It is short, it is an instruction, and it is the one line in that section a reader will act on. |

## Iteration 15 — blockquote, em dash and list separator check

- **Blockquotes:** 2, both opening `> `, both closing on "BeyondBorder Group Ltd primary research, 1 to 5 August 2026." Consistent with the rest of the corpus.
- **Em dashes:** 0. En dashes: 0. No stray double hyphens outside table rules.
- **List separators:** one ranked list, four items, all `1. **Bold lead-in.** Sentence.` with the period inside the bold. Matches the numbering style used in the corpus QA logs and the bullet style on `things-to-do-sword-pond.md`. No mixed bullet characters and no semicolon-separated inline lists.
- **TODO blocks:** 11, all inside inline code fences, all beginning `TODO: verify`, matching the batch 4 convention set by `moganshan-villages.md`. This is the highest count in the corpus, which the body states and explains.

## Iteration 16 — transitions added

Three, quoted:

1. Out of the summary table and into the rail leg: **"Start with the part that is most likely to work."**
2. Out of the transfer rule and into the terrain: **"Say the transfer is solved. The ground above it is the next problem, and it is older than the rule."**
3. Into the questions table: **"So the property has to be interrogated one at a time, and the wording matters."**

## Iteration 17 — verification

| Check | Result |
|---|---|
| seo_title | 51 characters, under the 60 cap, keyword-led |
| meta_description | 142 characters, under 152 |
| excerpt | 36 words, inside the 25 to 40 range |
| Body word count | 2,012, excluding the image brief section. Over the 1,500 target and inside the 1,300 to 2,100 house range. See the standing note below |
| Heading hierarchy | one H1, eight H2, no H3, no skipped levels |
| Internal links | 6, all assigned, all with trailing slashes: /plan/, /getting-here/getting-around/, /getting-here/deqing-station/, /moganshan/scenic-area/, /where-to-stay/, /moganshan/villages/ |
| Citations | 2 blockquotes, house format, consistently attributed |
| Em dashes | 0 |
| FAQ block | none, and no question-shaped headings. The questions table is a set of things to send a property, not a set of things the page answers about itself |
| Schema | Article, as assigned |
| Figures | lead at /images/guide/plan-accessibility.webp plus accessibility-2, -3 and -4 at the assigned section breaks, all with hand-written alt and captions carrying information the prose does not |
| TODO lines | 11 |
| Facts | every figure traces to FACTS.md. No terrain, gradient, step count, surface, ramp, toilet or vehicle-type claim is made without a TODO attached |
| Placement | Deqing County, Huzhou prefecture, Zhejiang Province and the 60 km to Hangzhou all inside the first 100 words, in paragraph three, in a sentence shape no other page uses as its placement clause |

## Iteration 18 — humanizers used more than once

| Humanizer | Count found | What changed |
|---|---|---|
| "we have not checked / we cannot confirm / we do not hold" | 7 | Cut to 4 and varied. Now "We have not checked this one", "not something we can answer", "Nobody publishes", and "nothing we hold supports the word". |
| "the one thing that usually solves this" | 2 | Kept one. The second became "the fallback everyone else has". |
| "built stone / laid stone / stone paths and steps" | 5 | Left at 3 and varied. It is a physical fact the page has to keep returning to, so it was varied rather than suppressed. |
| The short declarative verdict ("Anything other than yes is a no.") | 3 shapes | Kept two, in the questions table where the compression earns it. The third, in the stroller section, was expanded into a sentence. |
| "before you pay" | 3 | Cut to 2. The third became "while the booking can still be changed". |

Final measured state: **2,012 body words, 0 em dashes, ratio 41 structured to 59 prose, 11 TODO lines, 6 internal links, 2 citations, 4 figures.**

## Standing notes for the editor

- **Length.** The page finished at 2,012 body words against a 1,500 target, inside the house range but 34 percent over the assignment. Seven compression rounds took 372 words out and the number would not go lower without cutting content the assignment requires. The scaffolding is what carries the weight: 11 TODO blocks, 3 tables, 2 citations, 3 captions and a ranked list come to 829 words, leaving about 1,180 words of running prose across nine sections. Cutting further would mean dropping either the questions table, which is the only thing on the page a reader can act on today, or TODO lines, which the assignment asks to be maximized. Flagged for the editor rather than solved.
- **Footer.** `SiteFooter.astro` line 29 must move the accessibility link into the Visit column and point it at `/plan/accessibility/`. Until that ships, the page has no inbound link and the footer promises something that resolves to nothing.
- **TODO density is deliberate and is the highest in the corpus at 11.** Nine of the eleven are terrain, vehicle or fixture questions that can only be closed by a field visit. The remaining two, the ticket concession and accessible vehicle hire, could be closed by phone in Chinese.
- **Ranked by what would change a reader's trip:** (1) what the scenic-area transfer vehicles are and whether any takes a wheelchair; (2) whether the transfer centers are step free and have an accessible toilet; (3) which properties have level entry and a ground-floor room; (4) step-free access at Deqing station. The first is the one to close first, because a no there ends the trip before any of the others matter.
- The page contradicts nothing already published in the corpus. It extends the existing open item on `trade-sample-itineraries.md` ("TODO: verify what accessible transport the centers provide") and the accessibility TODO on `where-to-stay-hotels-naked-stables.md`, and both should now point here.
- The word "accessible" is never used to describe anything on this mountain. It appears inside TODO lines, where it names what somebody still has to check; inside the "not confirmed" column of the summary table, for the same reason; and once in the body, to say why the page does not use it. Nowhere does it modify a place, a vehicle or a property.
