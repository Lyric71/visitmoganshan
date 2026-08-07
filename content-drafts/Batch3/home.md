---
url: /
title: Moganshan
seo_title: "Moganshan, China: The Independent Travel Guide"
meta_description: Moganshan is a mountain in Deqing County, Zhejiang, 60 km north of Hangzhou. Where to stay, how to get there from Shanghai, and when to go.
excerpt: "An independent guide to Mount Mogan in Deqing County, Zhejiang: the 1890s hill station, where to stay, how to arrive from Shanghai, when to go."
primary_keyword: moganshan
secondary_keywords: [moganshan china, mogan mountain, visit moganshan]
schema: WebSite + TouristDestination
word_count: 5563
last_updated: 2026-08-06
---

# Moganshan

This is the content file for the home page of visitmoganshan.com. Moganshan (莫干山) is a mountain in Deqing County, Huzhou prefecture, Zhejiang Province, China, 60 km north of Hangzhou and, from Shanghai, 200 to 240 km. The home page has to make that mountain worth a weekend to somebody who has never heard of it, then answer every practical question before they leave.

The copy below is approved and final. It comes from the build spec at `/home/claude/muuke/IMPLEMENT_HOMEPAGE.md`, dated 5 August 2026, and it is reproduced here word for word. Nobody rewrites it in this file. What this file adds is the frame around it. What each section is for, where every link goes, and, at the end, the five things an editor has to hold that no build spec carries.

How to read it. Anything inside a fenced block or a card table is quoted from the spec and is not to be touched. Everything else is mine, including the five numbered notes at the end, and can be argued with.

Sections run in page order. The site header is covered in section 6.1 of the build spec and is not repeated here.

The build spec numbers these same sections 6.2 to 6.15. This file numbers them 1 to 14, in the order a visitor meets them, so here is the mapping once: 1 Hero is 6.2, 2 Hill station 6.3, 3 Four parts 6.4, 4 Things to do 6.5, 5 Journal 6.6, 6 Divider 6.7, 7 Orientation strip 6.8, 8 Where to stay 6.9, 9 Getting here 6.10, 10 Itineraries 6.11, 11 When to go 6.12, 12 Before you come 6.13, 13 Trade strip 6.14, 14 Footer 6.15. The header is 6.1 and sits outside this file; its eight nav destinations live in `nav.ts` in section 5 of the spec, and all eight have articles.

Where this file says a page is "written", it means a drafted article exists in the Phase 1 set. It does not mean the URL is live.

Two things that are not sections. The page ships two JSON-LD blocks in the layout, `WebSite` and `TouristDestination`, and the second is where "Mount Mogan" and 莫干山 are declared as alternate names. And the title and description that ship are the ones in section 7 of the build spec, not the ones in this file's frontmatter. The frontmatter here is the content record and the shorter alternative. If anyone wants to swap them, editor note 4 explains why they might.

## 1. Hero

The first screen. It names the place, gives one line of positioning, and offers two exits. Explanation starts in the band below it.

**Approved copy, verbatim**

```
H1:       Moganshan
Tagline:  A mountain that Shanghai built a second life on, and then forgot.
Button 1: Read the story        → /moganshan/hill-station/
Button 2: Where to stay         → /where-to-stay/     (ghost style)
```

The H1 is the single word. No "Visit", no "China", no second line folded into it. Both buttons are real anchors: `/moganshan/hill-station/` and `/where-to-stay/`, and both of those pages are written.

**Slot to fill.** One 16:9 image, or an 8-second silent loop with a still poster. Subject is mist through bamboo, or a stone villa at dawn. Alt text is set by the spec: `Morning mist in the bamboo forest at Moganshan`. The file must come in under 180 KB as AVIF with a WebP fallback, and it is the only image on the page that gets `priority`.

## 2. The hill station

The thing no rival can copy, and it sits second on purpose. Every rival page opens on bamboo. This one opens on the fact that Americans and Britons built a summer town here in the 1890s and much of it is still standing.

**Approved copy, verbatim**

```
Kicker: The hill station
H2:     An Anglo-American summer colony, 200 km from Shanghai
Body:   American missionaries found the mountain in the 1890s. By 1910 around 300
        foreigners had summer houses here, and by the 1920s there were 154 stone
        villas. Roughly 250 are still standing.
Link 1: Read the history      → /moganshan/hill-station/history/
Link 2: Walk the villa route  → /moganshan/hill-station/walking-tour/
```

Both links are written pages: [the history](/moganshan/hill-station/history/) and [the villa walk](/moganshan/hill-station/walking-tour/).

This band is the first body prose a reader meets, which makes it the block that decides what a search engine thinks the page is about. As approved it names no province, no county and not Hangzhou. That is editor note 2, "The name traps", and it is the most expensive of the several things on this page that need a sign-off before they can change.

**Slot to fill.** One archive photograph at 4:5, a 1920s villa or a tennis party, alt text `A Western-style stone villa at Moganshan, photographed in the 1920s`. It needs a visible caption carrying the credit and the year. That caption does two jobs. It shows a reader the photograph is genuine, and it is the only place on the page where rights information appears at all.

## 3. The mountain in four parts

Four cards that break the destination into its four parts and hand each to a hub page. Two of those hub pages are written, [the bamboo forest](/moganshan/bamboo-forest/) and [the villas](/moganshan/hill-station/the-villas/). Two are not.

**Approved copy, verbatim**

```
H2:        What this mountain is
Link:      Discover Moganshan → /moganshan/
```

| Title | Sub | Href |
|---|---|---|
| The bamboo forest | 92 percent forest cover, and a working crop | `/moganshan/bamboo-forest/` |
| The villas | British, American, French, all in local stone | `/moganshan/hill-station/the-villas/` |
| The villages | Yucun, Xiantan, Sanjiuwu | `/moganshan/villages/` |
| The tea | yellow bud, grown on the slopes | `/moganshan/tea/` |

The villages card and the tea card point at URLs with nothing behind them, and the tea sub makes a claim the fact base does not carry. Editor notes 4 and 5.

**Slot to fill.** Four 3:2 images: bamboo, a villa, a village lane, a tea terrace. One descriptive alt each, written to the picture rather than to the card title.

## 4. Things to do

Six tabs over one card set. The tab order was argued over. Heritage sits ahead of Nature because the villas are the one asset no competing site can copy.

**Approved copy, verbatim**

```
H2:   Things to do
Link: All 20 ideas → /things-to-do/
Tabs: Popular · Heritage · Nature · Food and tea · Active · Family
```

**Slot to fill.** `thingsToDo.ts`, seeded with three or four entries and a `TODO` on any copy the research does not support. Six tabs against four entries is the largest data gap on the page, because a tab that opens empty is worse than a tab that does not exist.

| Per entry | What it needs |
|---|---|
| Title | Short, and specific to the thing rather than the category |
| Category | One or more of the six tab names, so nothing lands nowhere |
| Href | A written page, or leave the entry out |
| Image | 3:2, real, with its own alt written to the picture |

Candidate subjects, from the image list in section 10 of the spec: the villa route, Sword Pond, a named trail, a hot spring. Every panel stays in the DOM and is hidden with `hidden`, so all the cards are crawlable whether or not their tab is open.

## 5. From the journal

Three story cards and a link out. Nothing else: no signup field, no modal, no sticky bar. The module has nothing to put in the cards, which makes it the one section on the page that may have to wait for launch day two.

**Approved copy, verbatim**

```
H2:   From the journal
Link: All stories → /journal/
```

**Slot to fill.** There is no journal. Not a thin one, an empty one: [the journal index](/journal/) opens by saying it has published nothing, and it carries a `TODO: verify` on when the first pieces land. The module needs three cards, each with an image, a title and a visible date, and none of the three can be filled today. So it waits on a publishing schedule that nobody has set. Filling the three cards with placeholders would be the first dishonest thing on the page, which argues for holding the whole module until there is something to show. Editor note 5.

## 6. The divider

The hinge of the page. Everything above it exists to make a reader want the trip. Below it, the page assumes they already do and starts answering questions. It is a full-width band on ink with `id="plan"`, so `visitmoganshan.com/#plan` lands here.

**Approved copy, verbatim**

```
Kicker (amber): Plan the trip
Line (mist):    Everything below this line answers a question, not a mood.
```

No links in the band itself. Once it scrolls past on mobile, a slim sticky bar appears carrying exactly two links.

| Sticky bar link | Destination |
|---|---|
| Where to stay | `/where-to-stay/` |
| Getting here | `/getting-here/` |

## 7. Orientation strip

Four figures, four links, no pictures. This is the fastest crawlable answer to "where is Moganshan" anywhere on the site, and it sits low on the page, so it has to be real text. Each tile links to the page that proves the number.

**Approved copy, verbatim, from `stats.ts`**

| Value | Label | Href |
|---|---|---|
| 63 to 80 min | direct train from Shanghai Hongqiao | `/getting-here/from-shanghai/by-train/` |
| 13 min | train from Hangzhou East | `/getting-here/from-hangzhou/` |
| 6 to 7 °C | cooler than the cities in summer | `/moganshan/weather/` |
| c.250 | surviving 1890s stone villas | `/moganshan/hill-station/the-villas/` |

All four figures move, the two train times fastest. Editor note 1 gives the review schedule. The villa tile is wrong as written and the Hangzhou tile is optimistic; both are in editor note 4.

## 8. Where to stay

Three property cards under six tabs, every property on the same terms. No featured slot, no sponsored placement, no badge. One thing to know before the cards get filled: search Moganshan hotels and most of what comes back is not a hotel. It is minsu (民宿), small guesthouses, roughly a thousand of them. Twelve properties in the destination carry a hotel name, and the site's own [hotel directory](/where-to-stay/hotels/) is where that count comes from. Two of the twelve are not on the mountain at all, so treat twelve as a directory count rather than a geographic one.

**Approved copy, verbatim**

```
H2:   Where to stay
Link: The 12 best hotels, ranked → /where-to-stay/best-hotels/
Tabs: All · Luxury · Boutique · Private villas · Hot springs · Family
```

The section link goes to [the best hotels page](/where-to-stay/best-hotels/). That page exists, and it does not rank anything, which is a problem the label creates. See editor note 4.

**Slot to fill.** `hotels.ts`, three or four entries against the type in section 5 of the build spec. Each card shows an image, the property name, a line reading `village · keys · price band`, and one line in italic. Only the name, the village and the key count can be filled from the fact base. Price band has to be picked from the four fixed bands in the type, not written free. The italic line is the problem: the spec calls it "one honest sentence, first-hand", and nobody on this site has stayed anywhere on this mountain. Ratings, star counts and prices are not to be invented under any circumstance. Get a rating wrong on a named hotel and it stops being an editorial problem.

Images are 3:2, one per property, alt text `<Property name>, Moganshan`.

## 9. Getting here

Four route cards. The fourth carries the thing almost nothing in English explains: you cannot drive into the scenic area. Private vehicles stop at one of three transfer centers, Yucun, Fatou or Houwu, and those run 08:00 to 18:00. People find this out in the car park.

**Approved copy, verbatim**

```
H2:   Getting here
Link: All routes → /getting-here/
```

| Card | Sub | Href |
|---|---|---|
| From Shanghai | train, car, transfers | `/getting-here/from-shanghai/` |
| From Hangzhou | 13 minutes, then what | `/getting-here/from-hangzhou/` |
| From the airports | Hongqiao, Pudong, Xiaoshan | `/getting-here/from-hongqiao/` |
| Getting around | the no-cars rule | `/getting-here/getting-around/` |

Three of those four destinations are written. The airports card is not, and it is the one an arriving traveler is most likely to click first.

## 10. Ready-made itineraries

Three cards. Length of stay is decided here, which is why the first card argues against itself.

**Approved copy, verbatim**

```
H2:   Ready-made itineraries
Link: All itineraries → /itineraries/
```

| Card | Sub | Href |
|---|---|---|
| One day from Shanghai | and why we would not | `/getting-here/day-trip/` |
| A weekend, two nights | the one most people want | `/itineraries/weekend-from-shanghai/` |
| Shanghai, Hangzhou, Moganshan | five days | `/itineraries/shanghai-hangzhou-moganshan/` |

Keep "and why we would not". It is the sentence that tells a reader this site is not selling them something, and it appears above the fold of the practical half.

## 11. When to go

Twelve month chips on one row, from `months.ts`, on every viewport down to 320px. One row is a legibility rule. Break it into two rows of six and the strip stops reading as a year, and reading as a year is the only reason it earns the space.

**Approved copy, verbatim, from `months.ts`**

| Month | Status | Month | Status |
|---|---|---|---|
| Jan | quiet | Jul | busy |
| Feb | quiet | Aug | busy |
| Mar | good | Sep | good |
| Apr | good | Oct | busy |
| May | busy | Nov | good |
| Jun | quiet | Dec | quiet |

```
H2:   When to go
Link: Month by month → /seasons/
Legend: quiet and good · busy or booked out · cold and cheap
```

Month by month goes to [the seasons page](/seasons/), and that page exists.

Color never carries the meaning on its own. The legend does, in text, in that order: `good`, then `busy`, then `quiet`. One month in the data does not fit its legend wording, and that is editor note 4.

## 12. Before you come

Four flat cards, no images. The admin half of the trip, and the last thing a traveler sees before the band aimed at the trade. Three of the four cards answer questions about China rather than about the mountain. That was a choice: most people who stall on this trip stall on the country.

**Approved copy, verbatim**

```
H2:   Before you come
Link: Plan your trip → /plan/
```

| Title | Sub | Href |
|---|---|---|
| Visa-free entry to China | 50 countries, plus the 240-hour transit rule | `/plan/china-visa-free-entry/` |
| Paying for things | Alipay and WeChat with a foreign card | `/plan/money-and-payments/` |
| Tickets and entry | what the scenic area actually costs | `/plan/tickets-and-entry/` |
| Is it worth visiting? | an honest answer | `/plan/is-moganshan-worth-visiting/` |

The first card carries the shortest shelf life of any string on the page. The third promises a cost the linked page has to give as a conflict between sources, because that is what the research found.

## 13. Trade strip

A quiet band for the business audience: operators, destination management companies and press. It is the only part of the page not written for a traveler.

**Approved copy, verbatim**

```
H3:     Tour operators, DMCs and media
Body:   Fact sheet, operator-ready itinerary modules and a free image library.
Button: Trade resources → /trade/   (ghost style)
```

All three things the body promises exist: the [fact sheet](/trade/fact-sheet/), the [itinerary modules](/trade/sample-itineraries/) and the [image library](/trade/image-library/). The ghost button goes to the hub at `/trade/`, and the hub has to link all three or the promise is empty.

## 14. Footer

Four columns, the Visit Moganshan wordmark, 莫干山 in Noto Serif SC at small size, and the disclosure. The Chinese characters appear here and on the About page only, never in the header. Nowhere else on the page does the name appear in a script a Chinese reader would recognize, which matters to anyone checking that Mount Mogan and 莫干山 are the same mountain.

**Approved copy, verbatim**

| Discover | Practical | Stay | About |
|---|---|---|---|
| The mountain | Getting here | Best hotels | About this site |
| Villages | Tickets | Hotel directory | Trade and media |
| The hill station | Weather | Private villas | Contact |
| Bamboo forest | Accessibility | Groups | Privacy |

Disclosure line, verbatim:

> Published by BeyondBorder Group Ltd, Hong Kong. Independent. We say plainly on the About page how this site is funded and whether we hold any commercial interest in a property listed here.

The build spec gives the footer as sixteen labels and no destinations. The table below resolves them against the site's own structure. Read it differently from the tables above: the labels are approved, the URLs are my reading of them, and where the two disagree the label wins and somebody has to make a call. Resolving a URL is safe in a way that writing a hotel sentence is not, because a URL can be checked against the sitemap in ten seconds and a sentence about a room cannot be checked at all.

| Column | Label | Destination | Content status |
|---|---|---|---|
| Discover | The mountain | `/moganshan/` | written |
| Discover | Villages | `/moganshan/villages/` | not written |
| Discover | The hill station | `/moganshan/hill-station/` | written |
| Discover | Bamboo forest | `/moganshan/bamboo-forest/` | written |
| Practical | Getting here | `/getting-here/` | written |
| Practical | Tickets | `/plan/tickets-and-entry/` | written |
| Practical | Weather | `/moganshan/weather/` | written |
| Practical | Accessibility | `/plan/accessibility/` | not written |
| Stay | Best hotels | `/where-to-stay/best-hotels/` | written |
| Stay | Hotel directory | `/where-to-stay/hotels/` | written |
| Stay | Private villas | `/where-to-stay/villas/` | written |
| Stay | Groups | `/groups/` | written |
| About | About this site | `/about/` | written |
| About | Trade and media | `/trade/` | written |
| About | Contact | `/contact/` | written |
| About | Privacy | `/privacy/` | written |
| Footer foot | Sitemap | `/sitemap/` | not written |

The footer also carries the visible last-updated date, and that date earns its place. Pages currently ranking first for these queries were published in 2011, 2014 and 2016, and none of them shows a date at all. Being the only result a reader can date is worth more here than it would be in most markets.

> Competitor publication dates and the case for a visible last-updated stamp, visitmoganshan.com home page build brief, BeyondBorder Group Ltd, 5 August 2026.

## Notes for the editor

Everything above this line is settled. Everything below is what the build spec does not carry and a content editor has to hold.

### 1. What goes out of date, and when

Nine things on this page have a shelf life. Four are figures in the orientation strip, which is the part of the page most likely to be quoted back at us. The rest are card labels and one data file.

| String | Where | Source date | What makes it stale | Check by |
|---|---|---|---|---|
| 50 countries visa-free | Before you come | February 2026 | Any new country added. Thirteen were added across 2025 and 2026, the last two on 17 February 2026 | Quarterly, and within a week of any announcement |
| 240-hour transit rule | Before you come | 17 December 2024 | Change to the eligible nationality list, currently 55, or to the 65 ports | Every six months |
| 63 to 80 min from Hongqiao | Orientation strip | August 2026 | Timetable change. Thirteen direct services a day now. The Shanghai to Suzhou to Huzhou line opened 26 December 2024 and reshaped the northern approach | Each timetable change, roughly twice a year |
| 13 min from Hangzhou East | Orientation strip | August 2026 | Same timetable risk, plus the figure itself is the fastest of a range. See note 4 | Twice a year |
| 6 to 7 °C cooler in summer | Orientation strip | August 2026 | Slow. It is a climate normal, not a reading. Sources disagree, one saying about 5 °C | Every two years |
| c.250 surviving villas | Orientation strip | August 2026 | Slow, but restoration and demolition both happen. Sources already range from "200+" to about 250 | Annually |
| 12 best hotels | Where to stay | August 2026 | Twelve properties currently carry a hotel name. The Four Seasons announced for Yu Village opens in 2030 and makes thirteen | Annually |
| All 20 ideas | Things to do | August 2026 | The count has to match whatever `/things-to-do/` actually lists | Whenever that page changes |
| Month statuses | When to go | August 2026 | Golden Week dates move. May Day and National Day are what make May and October busy | Every December, for the year ahead |

> Rail times and frequencies, temperature normals, villa counts, visitor numbers and the visa-free country list, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.

Two more things that are not figures but decay anyway. The footer's last-updated date has to be maintained by hand or it becomes evidence against the site. And the hero tagline says the mountain was forgotten, which is true of the international market and false of the domestic one: Moganshan Town recorded 2.60 million visitors in 2018. The line works as positioning aimed at a reader in Shanghai who has never heard of the place. It must not be repeated as a fact anywhere else on the site.

### 2. The name traps, and where the fix has to live

Dates are the easy half of the maintenance. The hard half is that this page has to keep proving which Moganshan it means, on every visit, to a reader who has no idea there is more than one.

Three different things carry this name in English search results, and two of them already rank for the queries this page wants.

| Trap | What it actually is | Why it hurts |
|---|---|---|
| Moganshan Road (莫干山路) | The M50 art district in Putuo District, Shanghai, about 200 km away | It has already broken into the top ten for "what to do in moganshan" |
| Moganshan Veneer | An industrial plywood and veneer brand | It appears in head-term autocomplete |
| Moganshan railway station | A station on the Shangqiu to Hefei to Hangzhou line that serves Deqing and Wukang town, not the mountain | A reader who books it arrives in the wrong place. Deqing station is the correct one |

> The three entity traps, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.

There is a fourth, and the four-parts section walks into it. The village named Yucun (庾村) at the foot of this mountain is not Anji's Yucun (余村), which won a UN Tourism Best Tourism Village award in 2021. Different characters, different county. Moganshan has never won that award, and the two are already conflated in English-language writing. Anywhere Yucun is named, it is worth the extra word "Moganshan's Yucun".

Where the disambiguation has to appear, in priority order:

1. **The first 100 words of visible copy.** As approved, the page does not do this, so the acceptance checklist item in section 11 of the build spec cannot be signed off. An editor cannot fix it, because the copy is approved. It goes back to whoever approved it, with two options. The cheap one touches no approved string: the hill station image caption is an unwritten slot, and it can carry "Deqing County, Zhejiang, 60 km north of Hangzhou". The better one is a clause inside the hill station body.

   The evidence, for that conversation. The visible strings above the divider are the H1, the tagline and the hill station band. None contains Deqing, Huzhou, Zhejiang or Hangzhou. The nearest geography is "200 km from Shanghai". Say that out loud next to the trap: the art district is in Shanghai, so the only distance the page gives is the distance from the thing we are trying not to be. "Hangzhou" first appears in the orientation strip, below the divider. The county first appears in the JSON-LD, which no reader sees.
2. **The title tag and the meta description.** The description in section 7 of the build spec says "the hill station above Shanghai" and names no province, county or nearest city. It is the string most likely to be read by a person deciding whether this is the art district. The frontmatter of this file carries an alternative that names Deqing County, Zhejiang and Hangzhou inside 139 characters.
3. **`alternateName` in the JSON-LD**, which already carries both "Mount Mogan" and 莫干山. Leave it. Those two spellings matter because the queries split: people search Moganshan, Moganshan China, Mogan mountain and Mount Mogan, and the last two are the ones a crawler will not connect to this page on its own.
4. **The orientation strip**, which does the job well for a crawler and badly for a human, because it sits two thirds of the way down.

The station trap does not need to appear on the home page. It belongs on `/getting-here/` and it is handled there. Nothing in the approved home page copy names a station other than Hongqiao and Hangzhou East, which is correct.

### 3. The visa-free regime expires on 31 December 2026

The "Visa-free entry to China" card reads "50 countries, plus the 240-hour transit rule". Both halves are true in August 2026. The first half has a legislated end date.

The unilateral visa-free regime is currently written into law only to 31 December 2026. As of August 2026 no extension has been announced. If the page is still live on 1 January 2027 and nothing has changed in Beijing, that card is telling fifty nationalities they can fly to China without a visa when they cannot.

> Unilateral visa-free regime, country count and the 31 December 2026 expiry, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.

Four things follow from that:

- The card carries no date, and one string of four words cannot carry one. The date has to live on the linked page at `/plan/china-visa-free-entry/`, and that page has to be dated at the top, not the bottom.
- Put a hard editorial check in the calendar for 1 November 2026. If no extension has been announced by then, the linked page needs a standing warning above the country list.
- Put a second check on 1 January 2027. If the regime lapsed, the home page card is wrong and the copy freeze does not protect it. Somebody has to be able to change an approved string on a day's notice.
- The 240-hour transit rule is separate and has no expiry attached to it. If the unilateral regime lapses, transit becomes the main route in for most of the fifty, so the linked page should already be structured that way.

### 4. Errors in the approved copy, flagged rather than fixed

The first three notes cover things an editor maintains. This one covers things an editor cannot touch.

The instruction was not to rewrite approved copy, and nothing here has been rewritten. What follows is every place the approved strings do not match the fact base or the rest of the site. Each needs the sign-off of whoever approved them.

**Wrong on the facts**

- *"c.250 surviving 1890s stone villas"* in the orientation strip. The roughly 250 villas standing today are not 1890s buildings. The first Western villas date to 1896 to 1898, there were 154 by the 1920s, and Chinese owners built more than 300 further villas between 1928 and 1949. The surviving stock is mostly interwar and later. "surviving stone villas" would be true. The linked page at `/moganshan/hill-station/the-villas/` gives the correct account, so the tile currently contradicts its own proof page.
- *"13 min"* from Hangzhou East. The measured range is 13 to 17 minutes, and 13 is the fastest of 16 daily services. Every other figure in the strip is given as a range. This one is not, and it is the one a reader will time.
- *"The tea: yellow bud, grown on the slopes"* in the four-parts section. Nothing about tea is in the verified fact base. The claim may well be right, but under the site's own rule it cannot be published until it is sourced, and `/moganshan/tea/` has not been written. Verify before launch or hold the card.
- *"An Anglo-American summer colony, 200 km from Shanghai"*. The measured distance is 200 to 240 km. The low end is defensible in a headline. Just note that every other page on the site gives the range, so a reader moving between them will see two numbers.

> Villa dates and counts, Hangzhou to Deqing rail times and the absence of any tea record, BeyondBorder Group Ltd primary research, 1 to 5 August 2026.

**Contradicts another part of the site**

- *"The 12 best hotels, ranked"*. The page it links to, `/where-to-stay/best-hotels/`, exists and its entire argument is that this site does not rank hotels, because nobody here has stayed in one. A reader who clicks a link promising a ranking and lands on a refusal to rank will read that as a bait line, which is the opposite of what the page is for. The count of twelve is right. "ranked" is the word to lose.
- *`ourLine: string; // one honest sentence, first-hand`* in the `Hotel` type. First-hand is not available. No one on this site has stayed at any Moganshan property, which is the stated reason the best-hotels page refuses to rank. Either the field gets filled with checkable description rather than experience, or it goes unfilled with a `TODO`. It must not be filled with adjectives dressed as experience.
- *The June chip.* `months.ts` marks June "quiet", and the legend translates quiet as "cold and cheap". June on this mountain is neither. The status is probably right, since June sits between the May holiday and the July peak, but the legend word does not fit it. Either June moves, or the legend needs a word that covers both January and June.

**Internally inconsistent**

- *"Fourteen sections".* The build spec says fourteen in section 0 and in the acceptance checklist, lists fifteen numbered subsections in section 6, and names thirteen home section components in section 4. The reconciliation is thirteen body sections plus the footer, which is the fourteen this file covers, with the site header counted separately. Worth fixing in the spec so the checklist item can actually be checked.
- *"All 20 ideas"* points at `/things-to-do/`, which is written by theme and does not present twenty numbered ideas. Either the destination page gets a countable list or the label loses its number.
- *The title tag.* "Moganshan, China: the complete guide | Visit Moganshan" runs to 54 characters, over the 52-character ceiling the writer brief sets and long enough to truncate in a desktop result. The frontmatter of this file carries a 46-character alternative.

### 5. Slots that block launch

None of this is an error. It is work nobody has done yet.

| Slot | What it needs | Blocker |
|---|---|---|
| `journal.ts`, three cards | Image, title, visible date | No journal post exists. `/journal/` says so in its first line and holds a `TODO: verify` on the schedule |
| `thingsToDo.ts` | Enough entries that none of six tabs opens empty | Six tabs, three or four seeded entries |
| `hotels.ts` | Name, village, keys, price band, one line, image | The one line, per note 4 |
| `/moganshan/villages/` | An article | Linked from the four-parts card and the footer |
| `/moganshan/tea/` | An article, and a verified tea fact | Linked from the four-parts card |
| `/getting-here/from-hongqiao/` | An article | Linked from the airports card |
| `/plan/accessibility/` | An article | Linked from the footer |
| `/search/` and `/sitemap/` | Pages | Header search button and footer |
| Twelve images | Real photography, real alt text, credits on the archive shot | Nothing sourced yet. The 1920s archive shot is the hard one, because it needs a rights holder who can be named in a caption |

The fact base behind every figure here was compiled 1 to 5 August 2026, and this file was written against it on 6 August 2026. Train times, the visa-free country count, the 31 December 2026 expiry and the hotel count are the four things most likely to have moved since.
