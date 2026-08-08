# QA log — /journal/118-then-78/

Loop: ContentQuality 18 passes, run one at a time, in order. Where the skill's
SEO limits and `BRIEF-BATCH4.md` disagree, BATCH4 wins (seo_title under 60 not
52, excerpt 25 to 40 words not exactly 25). Noted at iterations 8 and 17.

```
[x] Iteration 1  — journalist-style draft
[x] Iteration 2  — 10 weaknesses identified
[x] Iteration 3  — rewrite addressing weaknesses
[x] Iteration 4  — production-ready review
[x] Iteration 5  — AI-undetectable pass
[x] Iteration 6  — clean em dashes, blockquote citations
[x] Iteration 7  — human-touch pass
[x] Iteration 8  — SEO title, meta, excerpt
[x] Iteration 9  — second AI-undetectable pass
[x] Iteration 10 — second human-touch pass
[x] Iteration 11 — hostile-reader re-read (10 issues)
[x] Iteration 12 — structural ratio audit
[x] Iteration 13 — AI-tell pattern hunt
[x] Iteration 14 — read-aloud and reader empathy
[x] Iteration 15 — structural smell test
[x] Iteration 16 — pacing and flow
[x] Iteration 17 — SEO and structural integrity verify
[x] Iteration 18 — self-created pattern check
[x] Final        — SEO content written into the markdown frontmatter
```

## Iteration 1 — journalist-style draft
Changed: v1 written, 1,501 body words, seven sections built off FACTS.md
section 5 only (154, 118, 78, 1928, 300+, about 250, 1929) with the lead and
three inline figures placed at section breaks.

## Iteration 2 — 10 weaknesses

1. **Factual error in the comparison.** "The foreign community, over roughly
   fifty years, put up 154." The first Western villas date to 1896 to 1898 and
   the count is dated to the 1920s. That is about thirty years, not fifty. The
   error inflates the contrast with the Chinese wave, which is the one thing on
   this page that must not be overstated.
2. **The title and the lede do not shake hands.** The h1 is "118, then 78" and
   the first sentence says "Forty houses". A reader arriving from the journal
   listing has to do the subtraction before the page has shown them the numbers.
3. **The lede's date phrasing contradicts the page's own argument.** "between
   the 1920s and 1929" reads as a span, and three paragraphs later the page
   argues that no span can be established because 1929 sits inside the 1920s.
4. **A clever clause doing the work of a fact.** "the harder you press the two
   numbers, the less they carry" is a balanced construction and vague at the
   exact point the reader needs to know what the piece is for.
5. **An obvious analytic step is skipped.** 118 of 154 is about three quarters.
   The reader will reach for the same proportion in 1929 and cannot have it,
   because no 1929 total is published. The page should do that arithmetic and
   then show where it stops, rather than leave the reader to hit the wall alone.
6. **An unsupported attribution to unnamed writers.** "English-language writing
   about this mountain says the houses were sold. Our own pages have said it."
   No link, so the reader cannot check the claim against the pages named.
7. **"Today" is undated.** "about 250 old villas are still standing today" on a
   page whose subject is the dating of counts.
8. **Only two citation blockquotes** on a page about sourcing. The 1928 Bureau
   and the surviving-villa figure both carry researched claims and neither
   section closes with the house citation line.
9. **"Management Bureau" is never explained in plain words.** House rule is to
   explain a term the first time it appears. FACTS.md gives no Chinese
   characters for it, so the gloss has to be functional, not linguistic.
10. **The closing links read as a nav block.** Two links in their own orphan
    paragraph after the argument has finished, doing no work.

## Iteration 3 — rewrite addressing the ten
Changed:
1. "roughly fifty years" corrected to "about thirty years", and the comparison
   line rebuilt so the multiple is stated as the sources support it.
2. Lede now leads on 118 and 78 before the subtraction.
3. Span phrasing dropped from the lede; the interval problem is now raised only
   where it is argued.
4. Clever clause cut, replaced by what the page actually delivers.
5. Added the proportion (118 of 154, about three in four) and the point at which
   it stops: no 1929 total, so no comparable share.
6. Linked the villa page and the longer history at the "our own pages" line.
7. Dated the survival figure to the August 2026 research.
8. Third citation blockquote added under the 1928 and survival section.
9. Bureau glossed in plain words as the body that ran the mountain.
10. Closing links folded into the last section as sentences doing work.

## Iteration 4 — production-ready review
Verdict: not yet, on three counts, all fixed in this pass.
- The "What we are not going to say" section refused the three post-1929 dates
  but softened on 1928. It now refuses 1928 as a cause in the same explicit
  terms as the rest.
- The four-explanation table had no "what we would need" row for a reader who
  might actually hold one of those documents. The contact route was missing.
- `word_count` in the frontmatter still carried the target rather than the
  measured number. Corrected after the final count.

## Iteration 5 — AI tells found and removed
- "changes the shape of the whole thing" (inflated significance) cut.
- "genuinely tempting" (evaluative adverb doing no work) cut.
- "There is no mystery in principle" (a hedge-and-reassure move) rewritten to
  the concrete list of what removes houses.
- Symmetry in "The small story is the one that gets quoted" softened; the
  paragraph no longer resolves on a perfect inversion.
- "which is the state of the evidence rather than a hedge" kept, because it is
  a claim about method rather than a rhetorical softener, but the twin
  construction "not X, it is Y" was reduced from three uses to one.

## Iteration 6 — em dashes and citations
Em dash count before: 0. After: 0. (The draft was written under the zero rule,
so this pass was a verification rather than a cleanup.) Hyphens in
"foreign-owned" and "Western-style" left alone. All three citations reformatted
to the single house pattern: subject clause, comma, "BeyondBorder Group Ltd
primary research, 1 to 5 August 2026." One had run as a bare label; it now
names what it is sourcing.

## Iteration 7 — human-touch changes
- Two sentence lengths deliberately broken up in the "subtracted at all"
  section so the paragraph no longer runs at an even 16 to 18 words a sentence.
- "Move the definition and the count moves with it, without one deed changing
  hands." kept, because it is the sharpest thing on the page and it is doing
  argumentative work rather than performing.
- Added a plain aside in the four-explanations section: the reason sale feels
  right is that it is the easiest to picture, which is not evidence.
- Replaced "the record lets us date" with "we can date", which is how a person
  writing to a deadline puts it.

## Iteration 8 — SEO title, meta, excerpt
BATCH4 overrides the skill's caps here, and the overriding values are used.

| Field | Value | Count | Limit |
|---|---|---|---|
| seo_title | Moganshan Villa Ownership: 118 Foreign-Owned, Then 78 | 53 chars | under 60 (BATCH4) |
| meta_description | In the 1920s, 118 of Moganshan's villas were foreign-owned. By 1929, 78 were. What the two counts prove, what they cannot, and what is missing. | 143 chars | under 152 |
| excerpt | Two counts, taken years apart, are the whole basis... | 36 words | 25 to 40 (BATCH4) |

The seo_title is keyword-led on "moganshan villa ownership" and carries both
figures, which are the page's actual search hook.

## Iteration 9 — second AI-tell pass
Found on the second read, all removed:
- "Now the figure that" as a section opener, a staged reveal. Cut.
- Three consecutive paragraphs opening with a definite article plus abstract
  noun ("The arithmetic", "The surviving figure", "The two counts"). Two
  reworked.
- "for the purposes of the count", a legalistic tic that appeared twice on one
  screen. One instance cut.
- A heading and its first sentence restating each other under "What would close
  this". First sentence rewritten to advance instead.

## Iteration 10 — second human-touch pass
Changed:
- The "half of the mountain nobody counts" section now starts on the number
  rather than on a signpost sentence.
- Added the concrete reader-side consequence: what this does to how the mountain
  gets described in English, in one sentence rather than a paragraph.
- Cut a "which is" subordinate clause that had appeared four times, down to two.
- Let one paragraph run to a single short sentence, to break the two-to-four
  sentence rhythm that had held for eight paragraphs straight.

## Iteration 11 — hostile-reader re-read, 10 issues

1. **"The two counts, side by side" is a weak subhead.** It labels furniture.
   Fixed: renamed to carry the finding, not the format.
2. **The reader is never told what the counts were for.** A census? A tax roll?
   Fixed by stating plainly that we do not know, which is the answer, rather
   than leaving the question unraised.
3. **No maintenance signal until the last line.** Fixed: the survival figure and
   the ticket-free claims now carry the research date in the body.
4. **Repetitive section pattern.** Four of seven sections ran prose, table,
   prose. Fixed at iteration 12, and the "four ways" section resequenced here.
5. **The 300+ figure has no upper bound and the page uses it in arithmetic.**
   Fixed: the implied-total line now says "more than 450" and the paragraph
   states that the open end makes the shortfall a floor, not a figure.
6. **A hostile reader will ask why we trust 154 but not the interval.** Fixed
   by conceding it: all of these numbers come from the same thin base, and the
   page says so rather than applying skepticism selectively.
7. **The 1929 total is missing and the page mentions it once, in a table cell.**
   Promoted into the prose, because it is the reason the share cannot be
   computed.
8. **No route for a reader who holds one of the four documents.** Added a line
   inviting it in the closing section. No link: the assignment fixes the
   outbound set at five URLs and /contact/ is not among them.
9. **"Colonial hill station" appears in quotes with no attribution.** Reworded
   to attribute it to English-language usage generally, which is what we can
   support, rather than implying a named source.
10. **The closing risked landing on a single clever line.** Flagged here and
    fixed properly at iteration 14.

## Iteration 12 — structural ratio audit
Measured two ways, because the two disagree and the disagreement matters. Line
count is what the page looks like when a reader scrolls it. Word count is what
they actually read. Both taken on the body, image brief excluded.

| Measure | Before | After |
|---|---|---|
| Lines in tables, lists, blockquotes, figures | 49 | 40 |
| Lines of prose | 30 | 33 |
| Ratio structured : prose, by line | 62 : 38 | 55 : 45 |
| Ratio structured : prose, by word | 27 : 73 | 22 : 78 |

Converted or cut:
- The five-row "what the record gives" question table cut to four rows, with the
  fifth question argued in prose because it is the load-bearing one.
- The "Wave / Period / Villas built" table deleted outright. Its two data rows
  restated the sentence directly above it, and the section now runs prose,
  citation, prose, which also breaks the prose-table-prose pattern that four of
  seven sections had been sharing (hostile-reader issue 4).
- The "What would confirm it" column dropped from the four-explanation table.
  It duplicated the closing document list.

Left alone: the two count tables and the four-explanation table are genuinely
comparative, and prose would bury them. On the word measure the page is already
prose-led, so no further conversion was made.

## Iteration 13 — AI-tell pattern hunt
Found:
- Triads: "weather, war, demolition, rebuilding and reclassification" (five, so
  safe), but "Deeds, a transfer register, or contemporary reporting" and "the
  method, the cutoff date, or what makes a villa historic" both ran as clean
  threes.
- Balanced pairs: "Foreign owners letting go of forty houses is the small story.
  Chinese owners putting up twice the entire foreign stock is the large one."
- Filler opener: "There is no mystery in principle."
- Buzzwords: none found. No instance of seamlessly, leverage, robust,
  comprehensive, delve or streamline anywhere in the draft.

Broken, three named:
1. The balanced pair above. Rewritten so the two halves no longer mirror each
   other in shape, and the second half runs longer than the first.
2. The triad "the method, the cutoff date, or what makes a villa historic"
   broken to two items plus a separate sentence.
3. "There is no mystery in principle" cut outright and replaced with the list of
   what actually removes houses over seventy years.

## Iteration 14 — read-aloud and reader empathy
Mechanical sentences found, and the rewrites:
- "No rate can be honestly calculated from a decade and a year." Passive-ish and
  stiff. Now: "You cannot get a rate out of a decade and a year."
- "Sale is the easiest of the four to picture, which is not the same as being
  the best supported." Two abstractions in one breath. Split.
- The closing had been "What is on the record is that the building went on
  afterward, and that most of it was still to come." That is the single sharp
  closing line tic. Rewritten so the piece stops on the state of the evidence
  instead of on a cadence, and the surviving-count point carries the last beat.
- One sentence in the 1928 section performed its own even-handedness. Cut to the
  claim.

## Iteration 15 — structural smell test
- Blockquote citations: three, all in the same pattern, all naming what they
  source. Checked character by character against the corpus format used on
  `moganshan-hill-station-the-villas.md` and `journal.md`.
- First-person moments ("we hold", "nobody we can find", "our own pages"): six,
  spread across five sections. Two had been adjacent in the survival section;
  one reworded to third person so the pair is broken up.
- List separators: bullets take no terminal punctuation, consistent with the
  rest of the corpus. Table cells likewise.
- Em dash recheck: 0.
- TODO markers: two, both in the BATCH4 format, both naming what is missing and
  what would close it.

## Iteration 16 — transitions added
Three, at the joints where a reader on a long page drops out. Quoted:
1. "Start with the dates, because the gap between them is not what it looks
   like." (into the interval argument)
2. "Hold that against the 118 and the 78 for a moment." (into the comparison
   between the two building waves)
3. "One thing the figures do rule out." (into the demolition point, which would
   otherwise arrive without warning after the four-explanation table)

## Iteration 17 — verification

| Check | Result |
|---|---|
| seo_title | 53 chars, under the BATCH4 limit of 60 |
| meta_description | 143 chars, under 152 |
| excerpt | 36 words, inside the BATCH4 range of 25 to 40 |
| Heading hierarchy | One h1, seven h2, no h3, no level skipped |
| Internal links | 5, one per assignment target: /journal/, /moganshan/hill-station/the-villas/, /moganshan/hill-station/history/, /moganshan/hill-station/, /moganshan/hill-station/walking-tour/. All with trailing slashes. No outbound URL used that the assignment did not list |
| Citations | 3 blockquotes, identical house format |
| Em dashes | 0 |
| Figures | 1 lead at 16:9 plus 3 inline at 3:2, each at a section break, each caption carrying information the prose does not |
| Facts outside FACTS.md section 5 | None. The geography line comes from section 1, used only to satisfy the placement rule |
| FAQ block | None. No question heading anywhere on the page |
| TODO markers | 2 |
| Body word count | 1,566, measured excluding the image brief, written into frontmatter. Assignment target was 1,500; house range is 1,300 to 2,100 |

## Iteration 18 — self-created pattern check
Humanizers that had multiplied, and what was done:
- "we hold" had reached five uses. Cut to three, with "the record gives" and
  "nobody has published" carrying the other two.
- "which is" as a subordinating tail appeared four times. Down to one.
- "That is" as a sentence opener appeared four times. Down to none: two were
  rewritten into the preceding clause, two were cut with the sentences that
  carried them.
- Short one-sentence paragraphs, added at iteration 10 for rhythm, had crept to
  four. Two folded back into their neighbors so the device stays a device.
- Checked that no deliberate error, informality or fake hedge was introduced at
  any point. None was.

## Final
SEO fields written into the frontmatter. `word_count` set to the measured body
count excluding the image brief section.
