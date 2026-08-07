# WRITER BRIEF — visitmoganshan.com, Phase 1 articles

Read `/home/claude/muuke/articles/FACTS.md` first. It is the only permitted source of facts.

## The publication

**visitmoganshan.com**, an independent English-language destination guide to Moganshan, Zhejiang, China. Published by **BeyondBorder Group Ltd, Hong Kong**. Brand-neutral: it covers the whole destination honestly, including every hotel, on the same terms. It is not a hotel's marketing site.

## Who is reading

An international traveller who is already in China, or planning a Shanghai and Hangzhou trip from abroad. Many are not native English speakers. Most have never heard of Moganshan and cannot place it on a map. They are practical, sceptical of tourism copy, and short of time.

## Voice and reading level

- **Easy English.** Target roughly a B1 to B2 reading level, US grade 7 to 9.
- Short sentences. Average under 18 words. Vary the length so it does not read like a textbook.
- Common words. Write "let you see" not "afford views of". Write "about" not "approximately". Write "left" not "departed".
- One idea per sentence. One point per paragraph. Paragraphs of two to four sentences.
- Active voice. Second person where it helps ("you", "your train").
- Explain every Chinese term the first time it appears, in plain words.
- US daily-newspaper journalist style. American English (traveler, center, meter, kilometer). This overrides the fact base, which uses British spellings in places: write "transfer center" and "coach center", never "centre".
- **Zero em dashes.** Use commas, periods, parentheses or colons.
- No marketing language. No "nestled", "hidden gem", "must-see", "boasts", "seamlessly", "unlock", "delve", "vibrant tapestry", "breathtaking".
- No rhetorical triads. No "It's important to note". No single clever closing line.
- Never invent a fact, a price, a review, a rating or a quote.

## Honesty rules, which are the point of this site

- Say what is not good. Crowds, price conflicts, the transfer hassle, the lack of evening food, the long trip from Pudong.
- Where sources disagree, say so and give the range.
- Where something is an estimate, label it.
- Where a figure could go out of date, date it.

## Required output

Write ONE markdown file. Structure exactly like this:

```markdown
---
url: /the/page/url/
title: The H1
seo_title: Under 52 characters
meta_description: Under 152 characters
excerpt: Exactly 25 words
primary_keyword: the target keyword
secondary_keywords: [kw, kw, kw]
schema: Article
word_count: 1234
last_updated: 2026-08-05
---

# The H1

Body in markdown. H2 for sections, H3 where needed.
```

Body rules:

- Length as specified in your assignment. Count only body words.
- Place the destination somewhere in the first 100 words: a mountain in Deqing County, Huzhou, Zhejiang Province, about 60 km north of Hangzhou. This matters because Moganshan Road is an art district in Shanghai and it already pollutes the search results.
- **But do not make it the opening sentence, and do not phrase it the way other pages do.** Across a site, an identical placement clause repeated on every page reads as boilerplate to a search engine and as filler to a reader. Open on whatever this specific page is actually about, then place the mountain inside the first paragraph or the second. Vary the sentence shape: lead with the distance, or with Hangzhou, or with the county, or fold it into a sentence that is doing other work. Grep the corpus before you write your opening.
- Use tables for anything with times, prices or comparisons. Real markdown tables.
- Use `>` blockquotes for citations, consistently attributed, in this format:
  `> Source name, publication or body, date.`
- **No FAQ section. This is a permanent rule.** Do not add a block headed "FAQ", "Frequently asked questions", "Questions people ask", "Questions people actually ask" or any variant. If a question is worth answering, answer it in the body, in the section where a reader would already be looking for it. A page that needs a Q and A appendix to be complete is a page whose body is not doing its job. Do not put `FAQPage` in the `schema` field unless the page's entire structure is genuinely a set of questions, and even then, no separate appendix.
- Include internal links to other pages on the site as inline markdown links, using the URLs in your assignment.
- End with a one-line note giving the last-checked date for anything time-sensitive.
- Aim for roughly half flowing prose and half structured blocks. Do not template every section the same way.

## Process — mandatory, auditable, no skipping

Run the **ContentQuality 18-pass loop**. Execute the passes **one at a time, in order**. Do not merge two passes into one edit. Do not skip a pass because the draft "already looks fine". A pass you did not actually run is a pass that failed.

**You must produce an audit file** alongside the article, at the path given in your assignment. Write it as you go, not afterwards from memory. It is what proves the loop ran.

The audit file has one section per iteration:

```markdown
# QA log — <page url>

## Iteration 1 — journalist-style draft
Changed: <one line>

## Iteration 2 — 10 weaknesses
1. ...
(all ten, written out in full)

## Iteration 3 — rewrite addressing weaknesses
Changed: <one line per weakness fixed>
...
```

Requirements per iteration, all of which must appear in the audit file:

| Pass | What the audit file must show |
|---|---|
| 1 | one line on the draft |
| 2 | **all 10 weaknesses, written out** |
| 3 | what changed for each of the 10 |
| 4 | production-ready verdict, and what you fixed |
| 5 | AI tells found and removed, named |
| 6 | em dash count before and after, citation format fixed |
| 7 | human-touch changes, named |
| 8 | the SEO title, meta and excerpt with character and word counts |
| 9 | second AI-tell pass, what you found the second time |
| 10 | second human-touch pass, what changed |
| 11 | **all 10 hostile-reader issues, written out**, and the fix for each |
| 12 | the measured ratio of structured to prose, before and after, and which blocks you converted |
| 13 | the specific triads, buzzwords, filler openers and balanced pairs found, and **at least three named and broken** |
| 14 | sentences that read mechanically, and the rewrite |
| 15 | blockquote consistency check, em dash recheck, list separator check |
| 16 | the two or three transitions added, quoted |
| 17 | verification results: SEO title chars, meta chars, excerpt word count, heading hierarchy, internal links, citations, em dash count |
| 18 | humanizers you introduced more than once, and what you varied or cut |

Two hard rules from the skill: never add deliberate errors to fake a human touch, and if an iteration asks a question, the full answer must be written out before you act on it.

## Return

Write the file to the given path. Return ONLY this, nothing else:

```
FILE: <path>
QA_FILE: <path>
TITLE: <h1>
SEO_TITLE: <n chars>
META: <n chars>
EXCERPT: <n words>
WORDS: <body word count>
EM_DASHES: 0
PASSES: 1234567890abcdefgh   <- replace each character with Y if that pass ran, N if not (18 characters)
RATIO: <structured:prose percentage after iteration 12>
BROKEN: <the three AI patterns you broke in iteration 13, comma separated>
NOTES: <one line on anything you flagged as TODO or uncertain>
```
