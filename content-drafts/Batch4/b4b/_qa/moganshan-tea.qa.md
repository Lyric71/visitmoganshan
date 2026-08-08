# QA log — /moganshan/tea/

Article: `/home/claude/muuke/articles/moganshan-tea.md`
Brief: BRIEF.md, overridden by BRIEF-BATCH4.md. Fact base: FACTS.md.
Corpus read before writing: moganshan.md, moganshan-bamboo-forest.md, seasons.md,
moganshan-villages.md, things-to-do.md, home.md (tea card + editor note 4).
`seasons-spring.md` does not exist; seasons.md carries the spring section instead.

**Standing condition on this page.** FACTS.md contains no tea entry of any kind.
Not the characters, not a geographical indication, not an elevation band, not a
picking window, not a price, not a named place to drink it. home.md line 395
already flags that the home page tea card makes a claim the fact base does not
carry. Every Moganshan-specific tea claim on this page is therefore either
derived from a held fact (forest cover, peak height, temperature means, guesthouse
counts) or carries an open `TODO: verify`. General yellow-tea knowledge is used
and is labeled as standard reference in two places, the intro and the footer line.

---

## Iteration 1 — journalist-style draft

Changed: drafted v1 at `/tmp/tea-v1.md` to the six-section outline, opening on the
yellow-tea class correction rather than on geography, with the honesty statement
placed in the third paragraph and the "where to drink it" section written as a
refusal plus a question set.

## Iteration 2 — 10 weaknesses

1. Opening claim "almost nobody outside China has drunk" is unverifiable hyperbole,
   and the mountain's placement paragraph omitted the Shanghai distance and the
   Moganshan Road entity trap that the rest of the corpus carries.
2. Section 5, the load-bearing one, stops at "ask your guesthouse" and never says
   what to do when the answer is no. It asks questions and abandons the reader.
3. No brewing or serving guidance anywhere. A page about a drink that never tells
   you how it arrives in front of you is not finished.
4. No lead image, no inline figures, no image brief. Batch 4 requires one 16:9 lead
   plus three 3:2 inline figures at named filenames.
5. The home-page-card reference sat mid-section 2, where it reads as an internal
   memo interrupting the reader.
6. Section "What yellow tea is" opens cold on a table with no lead-in sentence.
7. Only one blockquote citation on the whole page. The season and the where-to-drink
   sections carry researched figures with nothing attached to them.
8. No taste description. "Rounder" and "less vegetal" is thin for the subject.
9. The season section buries its own actionable conclusion (come in April) under the
   Qingming explanation.
10. TODO lines formatted inconsistently: some bare paragraphs, none in the backticked
    style moganshan-villages.md established.

## Iteration 3 — rewrite addressing the weaknesses

Changed, one line per weakness:

1. Cut "almost nobody", added the 200 to 240 km Shanghai figure and a parenthetical
   Moganshan Road line placing the art district 200 km off.
2. Added the "if the answer to the first two is no" paragraph, which tells the reader
   what a negative answer actually means.
3. Added serving detail (tall glass, leaf left in, thermos refills) to the prose and
   water temperature to the tea-4 caption.
4. Added frontmatter `image` and `image_alt`, three inline figures at tea-2, tea-3
   and tea-4, and the image brief table with one row per image.
5. Moved the home-page-card reference to a closing section, "What this page still
   owes you", where it belongs.
6. Added "The six are not six flavors. They are six processing routes" ahead of the table.
7. Added a second citation to the where-to-drink section.
8. Added the roundness, sweetness and pale-gold liquor description.
9. Rewrote the season conclusion as "All of which points at April".
10. Converted all four TODOs to the backticked house form.

## Iteration 4 — production-ready check

Verdict: **not production-ready.** One structural failure and four local ones.

The failure: length. The draft measured 1,998 body words against a 1,500 target on
the page the assignment explicitly identified as the thinnest in the batch. A page
that admits it holds no facts should not be the longest article in its own set.

Fixed: trimmed the intro, the huangya section's summarizing flourish, the climate
hedge, the season's month-by-month duplication of seasons.md, the tourist-box
paragraph and the closing section. Also cut "Anything you read that names one
confidently is worth checking twice" down to something a reader can act on.

## Iteration 5 — AI tells found and removed

Named and removed:

- "Here is the plain version:" — filler framing opener. Cut; the section now opens
  on the refusal itself.
- "tea house, tea garden or tea shop" — rhetorical triad. Broken into "Not a garden
  either, and not a shop."
- "The realistic answer is your guesthouse." — stock AI construction. Now "Your
  guesthouse is the answer that works."
- "in rough order of usefulness" — tidy AI qualifier. Now "most useful first."
- "Start with what the mountain actually is." — instructional AI opener plus an
  "actually" intensifier. Now "Start with what the mountain is covered in."
- "That is the cup you will actually be handed, and the owner who hands it to you is
  the best source" — mirrored X/who-Xs cadence. Split into two sentences, then cut
  further at iteration 18.

## Iteration 6 — em dashes and citation format

Em dash count before: 0. After: 0. The draft never carried one; checked again at
iterations 15 and 17 and confirmed by `grep -c` each time.

Citations: two blockquotes existed, both already in house format. Added a third to
the season section, which was carrying the RMB 300 to 500 room band and the 94
percent May Day occupancy figure with no attribution. All three now read:

> <what the figures are>, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.

General tea knowledge deliberately carries no house citation, because it is not our
research. It is labeled instead, in the intro and in the footer line.

## Iteration 7 — human-touch changes

- Rewrote the opening correction so it names the misconception before correcting it:
  "Most people who hear 'yellow' assume it means green tea gone a bit pale."
- Added "Type huangya into a search box on its own and Anhui usually answers first",
  a one-line observation the reader can test immediately.
- Broke the uniform medium-length paragraph rhythm in the intro with a short beat.

## Iteration 8 — SEO title, meta and excerpt

Batch 4 overrides apply: title under 60 rather than 52, excerpt 25 to 40 words rather
than exactly 25.

| Field | Value | Count |
|---|---|---|
| seo_title | Moganshan Yellow Bud Tea: Huangya, and Where to Drink It | 56 chars |
| meta_description | Moganshan huangya is a yellow tea, a class of its own. What yellow tea is, what this mountain can grow, when it is picked, and where to drink it. | 145 chars |
| excerpt | Moganshan's tea is huangya, a yellow bud tea. Yellow is a class of its own, with a step in it green tea never gets. What that means, what this mountain can actually grow, and how to find a cup. | 39 words |

Changed at this pass: meta was 146 chars and led with "not a green one", which is a
negative construction. Rewritten to lead with what it is. Excerpt rewritten from a
summary-of-a-summary into a real standfirst that opens the page.

## Iteration 9 — second AI-tell pass

Found the second time, by counting rather than reading:

- "actually" appeared three times across excerpt and body. Cut to one.
- "That is" opened four sentences. Logged and varied at iteration 18.
- "wrong end of the stick" is a British idiom on an American English page. Replaced
  with "That gets it backward."
- "Realistically, that is the cup you will be handed" still carried the hedge-adverb
  tic. Removed entirely at iteration 18.

## Iteration 10 — second human-touch pass

The house voice negates a lot, and five near-identical negations had accumulated:
"We hold none of that", "We have confirmed no address there", "We have verified none
at Moganshan", "We hold no local dates", "We hold no figure at all". Read together
they are a tic rather than a stance. Varied three:

- "no address there is confirmed" (impersonal)
- "Nobody we trust has checked a Moganshan listing of that kind" (agent named)
- "Not one figure, at any grade" (fragment)

## Iteration 11 — 10 hostile-reader issues

1. **"dearest" is British.** American English is a hard rule. → "most expensive".
2. **"Printed in grams, and you have done the math per 50 g"** is not parseable in a
   shop. → "Printed in grams on the pack, so you can divide the price by it".
3. **The price TODO and the paragraph under it said the same thing twice.** Cut the
   duplication out of the TODO.
4. **Brewing lived only in a figure caption**, which a skimmer misses, and captions
   are required to carry what the prose does not. → moved glass/leaf/thermos into
   prose, moved water temperature into the caption so neither repeats the other.
5. **"and it is the one on our home page" inside the question table** is internal
   business in a table a reader scans while standing in a guesthouse. Cut; the
   home-page promise is settled in the closing section instead.
6. **No freshness signal above the fold.** For a page this provisional the date has
   to be near the top, not only in the footer. → "As of 7 August 2026" in paragraph 3.
7. **"Grades run downward from the bud itself"** opens the highest-intent section on
   an abstraction. → added the concrete anchor about two counters and two prices.
8. **"A page that names one confidently is worth a second look"** is a swipe with no
   instruction in it. → "check whether it gives a street and an opening time too.
   Most do not."
9. **Day visitors had no route.** The whole section assumed an overnight guest with a
   guesthouse. → added the day-visitor sentence pointing at Yucun.
10. **"Timing is the other constraint"** ran three clauses into one comma chain. Split.

## Iteration 12 — structured to prose ratio

Measured before: **21:79**. Well under the roughly half-and-half the brief asks for,
and under the 30 to 40 percent the rest of the corpus runs at.

Converted to structured blocks:

- The "where it grows" climate paragraph → a four-row table (figure, value, what it
  means for tea), which also removed a duplicate statement of the forest-cover figure.
- The Qingming prose → a four-row table (mingqian, yuqian, later), which made the
  pricing consequence of each pick legible instead of buried in a sentence.

Measured after: **27:73**, then **28:72**, settling at **27:73** after the final
length trims. Not the full 50:50, and deliberately so: two of the six sections are
honest refusals, and a refusal does not table well.

Length was also brought down under this pass, from 1,998 to 1,895 body words, by
compressing the sections that duplicated seasons.md and bamboo-forest.md.

## Iteration 13 — triads, buzzwords, filler openers, balanced pairs

Scanned by regex for the detector-flagged set. Buzzword scan (comprehensive, robust,
seamless, leverage, delve, vibrant, nestled, boasts, must-see, hidden gem, unlock,
tapestry, breathtaking, "it is important to note", "in conclusion", "not only but
also", "serves as", "plays a key role") returned **zero hits**.

Found and broken, three named:

1. Triad "cool nights, diffuse light and drained slope soil" → "cool nights and
   diffuse light, on soil that drains. This mountain has the first two."
2. Triad "rewritten with dates, growers and prices" → "rewritten with dates and
   prices in it."
3. Filler opener "One thing before you read on." → "Now the part most tea pages skip."

Also broken: the footer triad "General tea processing, grading and the Qingming
calendar" → "Tea processing and grading, and the Qingming calendar".

Left standing: "green, black and oolong". It is a factual enumeration of three named
tea classes and breaking it would be artificial.

## Iteration 14 — sentences that read mechanically

| Read mechanically | Rewritten as |
|---|---|
| "The rest of what we hold is height and climate, and both bound what a seller can honestly claim." | "What else we hold is height and climate. Both of them put a ceiling on what a seller can claim." |
| "That is a hard limit on how much of it there can be." | "which caps how much of it this mountain can carry" |
| "Bud is the other half, and it describes the pick rather than the taste: unopened buds, or a bud with one small leaf attached, instead of mature leaf." | Split at the colon into two sentences. |
| "Which means we cannot tell you what being fleeced looks like in RMB." | "So we cannot tell you what being fleeced looks like in RMB." |

Cut one performed closing line: "Ask it that way and the conversation changes shape."
→ "Ask it that way and you get a different answer." The page does not end on a
punchline; it ends on the dated footer, matching the rest of the corpus.

## Iteration 15 — blockquote, em dash and list separator check

| Check | Result |
|---|---|
| Em dashes | 0 |
| Blockquotes | 3, all identical in form and all attributed to the same body and date |
| Heading hierarchy | 1 H1, 7 H2, 0 H3. No skipped level |
| List separators | One bullet list, 4 items, no terminal periods, matching things-to-do.md |
| TODO format | 4 open TODOs, all backticked, matching moganshan-villages.md |
| British spellings | centre, colour, favour, litre, metre, organis, realis, programme, whilst, amongst, kilometre, dearest all scanned. Zero hits |
| Figure placement | tea-2 closes "Where it grows", tea-3 closes "The season", tea-4 closes "Where to drink it", as assigned |
| Forbidden reuse | `/images/part-tea.webp` does not appear. Confirmed by grep |

First-person credibility moments ("we cannot name", "we hold", "nobody we trust")
are spread across four sections rather than clustered in one.

## Iteration 16 — transitions added

Two, quoted:

1. Between the general class and the local tea: *"That is the class. Now this
   mountain's version of it."*
2. Between drinking and buying: *"Say you liked it enough to take some home."*

A third was considered ahead of "Where to drink it" and rejected. That section opens
on a refusal, and a soft transition in front of it would blunt the one thing the
section exists to say.

## Iteration 17 — verification

| Item | Required | Measured | Pass |
|---|---|---|---|
| seo_title | under 60 (batch 4) | 56 chars | yes |
| meta_description | under 152 | 145 chars | yes |
| excerpt | 25 to 40 words | 39 words | yes |
| Heading hierarchy | clean | H1 x1, H2 x7, H3 x0 | yes |
| Internal links | 5 assigned | /moganshan/, /seasons/, /things-to-do/, /moganshan/villages/, /moganshan/bamboo-forest/ | yes |
| Trailing slashes | all | all 5 | yes |
| Citations | house format | 3, consistent | yes |
| Em dashes | 0 | 0 | yes |
| Figures | 1 lead 16:9 + 3 inline 3:2 | 1 + 3, plus image brief | yes |
| FAQ section | none | none | yes |
| Body words | 1,500 target, 1,300 to 2,100 house range | 1,807 | in range, over target |
| word_count field | real measured number | 1807 | yes |
| Destination in first 100 words | required | paragraph 2, folded into the Longjing sentence | yes |
| Opening duplication | none across 64 pages | checked against every first body line in the corpus | yes |

Length is the one item that did not hit its number. Recorded rather than hidden: see
the note at the end of this file.

## Iteration 18 — humanizers used more than once

- **Sentence-initial "That"** had reached six instances. Cut to four by rewriting two
  ("which caps how much of it this mountain can carry", "We are reasoning from climate
  figures there").
- **"Realistically"** was a hedge introduced at iteration 9 to fix a different tic.
  Removed; the sentence it propped up was cut outright.
- **Short verbless fragments** ("Not a garden either, and not a shop", "Bamboo,
  overwhelmingly", "Unopened buds, or a bud with one small leaf attached") had reached
  three. Kept two, folded the third back into its sentence.
- **"plausible"** appeared twice in one paragraph.

**Defect caught at this pass.** An earlier length trim had deleted "It is the most
plausible place here to buy tea and sit with it", leaving the next sentence,
"Plausible is as far as we can take that", with no antecedent. Rewritten to
"It is the likeliest spot on this mountain to find tea sold and poured, and likeliest
is as far as we can take it, because no address there is confirmed." This is the kind
of break a trimming pass causes and only a read-through catches.

---

## Sourcing ledger

What is stated as general tea reference, not our research, and labeled as such twice:

- The six-class division of Chinese tea and the processing route of each.
- Menhuang (闷黄) as the smothering step, and that it follows the kill-green step.
- Yellow being the smallest class by volume.
- Huangya (黄芽) meaning yellow bud, and the style existing at Huoshan, Mengding
  and Junshan.
- The Qingming and Guyu calendar markers, mingqian and yuqian, and the grade ladder
  from all-bud downward.
- Serving in a glass, and water below boiling.

What is derived from FACTS.md and carries a house citation:

- Over 92 percent forest cover, nearly all moso, a commercial crop.
- Tashan at 719 to 720 m, used to bound the high-mountain claim.
- 13.3 °C annual mean, 24.1 °C July to August, 6 to 7 °C under the cities.
- About 1,000 guesthouses, about 80 percent individually owned.
- RMB 300 to 500 mid-range off-season, 94 percent May Day 2024 high-end occupancy.
- Transfer centers 08:00 to 18:00, no private vehicles inside the scenic area.
- No evening economy in the villages.
- Yucun's square, market, restaurants and gateway role.

What is left open, 4 TODOs:

1. The registered name, its characters, geographical indication status, named producers.
2. The elevation band, the aspect, the area under tea, whether any garden takes visitors.
3. The picking window.
4. Price bands at each grade.

Nothing on this page states a Moganshan tea fact that is neither derived from the
above nor marked open. Section 5 names no tea house because we cannot, and says so
in its first sentence.

## Note on length

Target was 1,500 body words. Delivered 1,807, inside the 1,300 to 2,100 house range
but 19 percent over the assignment figure. The draft peaked at 1,998 and was cut in
three separate passes (4, 12 and 17). The overage sits in section 5, which the
assignment named load-bearing and asked to carry both the honest refusal and a usable
alternative, and in the four TODO blocks, which cost words without adding claims.
Cutting to 1,500 from here would mean removing either the question set or the
day-visitor route, both of which are the useful half of the page.
