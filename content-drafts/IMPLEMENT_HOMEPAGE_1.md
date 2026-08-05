# Build brief: visitmoganshan.com home page

**For:** Claude Code
**Publisher:** BeyondBorder Group Ltd, Hong Kong
**Domain:** `visitmoganshan.com` (primary, registered). `moganshanguide.com` is registered and 301-redirects here.
**Date:** 5 August 2026

---

## 0. What you are building

The home page of an independent English-language destination guide to Moganshan, Zhejiang, China. It is modelled on VisitBritain, Australia.com and Destination Canada: a brand-neutral guide that covers the whole destination honestly, not a hotel's marketing site.

The page runs **culture first, practical second**, separated by a visible divider band. Fourteen sections. Every string in this brief is final copy, not placeholder. Do not rewrite it, do not "improve" it, do not add marketing language. If a string is missing, leave a `TODO` comment rather than inventing one.

**Definition of done:** the page builds, passes the acceptance checklist in section 11, scores 95+ on Lighthouse SEO and Accessibility, and ships zero client-side JavaScript on first load except the tab and carousel interactivity described in section 6.

---

## 1. Assumed setup

The project is already initialized. This brief covers the home page only. Work inside the existing conventions: whatever router, styling layer and content approach the repo already uses, follow it rather than the naming below, which is illustrative.

Two things this page needs regardless of setup:

- **Static rendering.** The home page has no dynamic data.
- **Self-hosted fonts.** No third-party origin in the critical path.

No analytics, no cookie banner, no chat widget, no newsletter in this build.

## 2. Design tokens

Palette A, "Bamboo and Mist", from the approved brand board. Contrast ratios are pre-verified to WCAG 2.1 — use these exact values.

```css
/* src/app/globals.css */
@theme {
  --color-bamboo:  #1F4A3C;  /* primary. 8.43:1 on mist, AAA */
  --color-leaf:    #3C6B4A;  /* secondary. 5.22:1 on mist, AA */
  --color-mist:    #E8EDE9;  /* page background. NOT white */
  --color-stone:   #D8CFC0;  /* card and surface fills */
  --color-amber:   #E0A458;  /* accent and CTA only */
  --color-ink:     #1A1D1B;  /* body text */
  --color-paper:   #FBFAF7;  /* raised card surface */
  --color-line:    #DCD9D2;  /* hairline rules */
  --color-muted:   #6C6F6B;  /* secondary text */
}
```

**Rules that are not negotiable:**

- Amber is a background and accent colour. **Never set body text in amber.** Amber on ink is 7.79:1 and is the only amber text pairing allowed.
- The page background is mist `#E8EDE9`, not white. Cards sit on paper `#FBFAF7` or stone `#D8CFC0`.
- One accent colour on the page. If everything is amber, nothing is.

### Typography

| Role | Face | Notes |
|---|---|---|
| Display, H1, H2 | **Fraunces** | Variable, self-hosted, weights 400 and 600 only |
| Body, UI | **Inter** | Variable, self-hosted, weights 400 and 600 only |
| 莫干山 | **Noto Serif SC** | Footer and About only. Never in the header. |

Never set body copy in Fraunces. Wordmark gets `letter-spacing: 0.02em`.

Scale, mobile first, `clamp()` for the display sizes:

```
h1   clamp(2.5rem, 6vw, 4.25rem)   Fraunces 400, line-height 1.05
h2   clamp(1.5rem, 3vw, 2.125rem)  Fraunces 400, line-height 1.2
h3   1.125rem                       Inter 600
body 1.0625rem / 1.65               Inter 400
small 0.8125rem                     Inter 400, colour muted
kicker 0.6875rem, tracking 0.16em, uppercase, Inter 600, colour leaf
```

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128. Section vertical rhythm is 96px desktop, 64px mobile.

Max content width 1180px. Editorial text blocks cap at 68ch.

---

## 3. Logo

Direction 01, "Blade Ridge": a mountain with a sword cut into it in negative space. Ship it as an inline SVG component so it inherits `currentColor`.

```tsx
// src/components/Logo.tsx
export function BladeRidge({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" className={className} fill="currentColor" role="img"
         aria-label="Visit Moganshan">
      <path d="M4 84 L48 12 L92 84 Z" />
      <g fill="var(--color-mist)">
        <path d="M48 22 L55 50 L48 62 L41 50 Z" />
        <rect x="34" y="63" width="28" height="5.5" rx="2.75" />
        <rect x="44.5" y="70" width="7" height="12" rx="3.5" />
      </g>
    </svg>
  );
}
```

Horizontal lockup in the header: mark, then "VISIT" in kicker style over "Moganshan" in Fraunces 28px. On dark backgrounds the mark fills mist and the negative space fills bamboo.

Favicon: same mark, simplified, at 32px. Also ship 512, 192 and 180 (Apple touch). OG image uses the dark lockup at 1200x630.

---

## 4. Components to add

Fifteen components, plus three content files. Place them wherever the repo already puts components and content.

**Home sections, in page order:** `Hero`, `HillStation`, `FourParts`, `ThingsToDo`, `Journal`, `Divider`, `OrientationStrip`, `WhereToStay`, `GettingHere`, `Itineraries`, `WhenToGo`, `BeforeYouCome`, `TradeStrip`.

**Shared:** `Logo` (section 3), `SectionHead` (h2 plus a right-aligned link), `Card`, `TabGroup` (the only client component on the page).

**Content:** `nav`, `stats`, `months`, plus `hotels`, `thingsToDo`, `itineraries`, `journal`.

If the repo already has a header and footer, extend them per sections 6.1 and 6.15 rather than replacing them.

## 5. Content files

Create these with the exact values below. All figures are researched and verified; do not round them, do not embellish them.

```ts
// src/content/nav.ts
export const NAV = [
  { label: "Discover",      href: "/moganshan/" },
  { label: "Things to do",  href: "/things-to-do/" },
  { label: "Where to stay", href: "/where-to-stay/" },
  { label: "Getting here",  href: "/getting-here/" },
  { label: "Itineraries",   href: "/itineraries/" },
  { label: "Plan your trip",href: "/plan/" },
  { label: "Seasons",       href: "/seasons/" },
  { label: "Groups",        href: "/groups/" },
] as const;
```

```ts
// src/content/stats.ts
export const STATS = [
  { value: "63 to 80 min", label: "direct train from Shanghai Hongqiao",
    href: "/getting-here/from-shanghai/by-train/" },
  { value: "13 min",       label: "train from Hangzhou East",
    href: "/getting-here/from-hangzhou/" },
  { value: "6 to 7 °C",    label: "cooler than the cities in summer",
    href: "/moganshan/weather/" },
  { value: "c.250",        label: "surviving 1890s stone villas",
    href: "/moganshan/hill-station/the-villas/" },
] as const;
```

```ts
// src/content/months.ts
// status: "good" = quiet and worth coming, "busy" = booked out or crowded, "quiet" = cold and cheap
export const MONTHS = [
  { m: "Jan", status: "quiet" }, { m: "Feb", status: "quiet" },
  { m: "Mar", status: "good"  }, { m: "Apr", status: "good"  },
  { m: "May", status: "busy"  }, { m: "Jun", status: "quiet" },
  { m: "Jul", status: "busy"  }, { m: "Aug", status: "busy"  },
  { m: "Sep", status: "good"  }, { m: "Oct", status: "busy"  },
  { m: "Nov", status: "good"  }, { m: "Dec", status: "quiet" },
] as const;
```

`hotels.ts`, `thingsToDo.ts`, `itineraries.ts` and `journal.ts`: define the types below and seed each with three or four entries using `TODO` for copy you do not have. Do not invent hotel descriptions, ratings or prices. A wrong rating on a real hotel is a legal problem, not a content problem.

```ts
export type Hotel = {
  slug: string; name: string; village: string; keys?: number;
  priceBand: "RMB 300 to 800" | "RMB 800 to 1,500" | "RMB 1,500 to 3,000" | "RMB 3,000+";
  categories: ("luxury"|"boutique"|"villas"|"hot-springs"|"family")[];
  ourLine: string;      // one honest sentence, first-hand
  image: string; alt: string;
};
```

---

## 6. Sections, in page order

Each heading below gives the component, the exact copy, and the behaviour. Semantic HTML: one `<h1>`, every section heading is an `<h2>`, wrap each in `<section aria-labelledby>`.

### 6.1 `SiteHeader`

Sticky on scroll, mist background with a hairline bottom rule at `--color-line`. Contains the lockup (links to `/`), the eight nav items from `nav.ts`, and a search button that opens a page at `/search/` (no client-side search in this phase).

Mobile: lockup plus a hamburger opening a full-screen panel. The panel lists all eight items and closes on Escape.

### 6.2 `Hero`

Full-bleed image or an 8-second silent, muted, `playsInline`, looping video with a still poster. Bamboo in mist, or a stone villa at dawn. Dark gradient scrim from the bottom so the text clears 4.5:1.

```
H1:       Moganshan
Tagline:  A mountain that Shanghai built a second life on, and then forgot.
Button 1: Read the story        → /moganshan/hill-station/
Button 2: Where to stay         → /where-to-stay/     (ghost style)
```

The H1 is the single word. Do not add "Visit", do not add "China", do not add a subtitle line into the H1.

Desktop height 78vh, mobile 60vh. Sixty is deliberate: the top of the next section has to be visible without scrolling, or leading with culture buys nothing.

**No search box in the hero.** Nobody arrives at a small destination site knowing what to search for.

### 6.3 `HillStation`

Full-width band on bamboo `#1F4A3C` with mist text. Two columns, image left at 4:5, text right.

```
Kicker: The hill station
H2:     An Anglo-American summer colony, 200 km from Shanghai
Body:   American missionaries found the mountain in the 1890s. By 1910 around 300
        foreigners had summer houses here, and by the 1920s there were 154 stone
        villas. Roughly 250 are still standing.
Link 1: Read the history      → /moganshan/hill-station/history/
Link 2: Walk the villa route  → /moganshan/hill-station/walking-tour/
```

Image is an archive photograph. Caption it: the credit matters and it signals the material is real.

Mobile: image first, then text.

### 6.4 `FourParts`

```
H2:        What this mountain is
Link:      Discover Moganshan → /moganshan/
```

Four cards, 4-up desktop, horizontal swipe on mobile:

| Title | Sub | Href |
|---|---|---|
| The bamboo forest | 92 percent forest cover, and a working crop | `/moganshan/bamboo-forest/` |
| The villas | British, American, French, all in local stone | `/moganshan/hill-station/the-villas/` |
| The villages | Yucun, Xiantan, Sanjiuwu | `/moganshan/villages/` |
| The tea | yellow bud, grown on the slopes | `/moganshan/tea/` |

### 6.5 `ThingsToDo`

```
H2:   Things to do
Link: All 20 ideas → /things-to-do/
Tabs: Popular · Heritage · Nature · Food and tea · Active · Family
```

Heritage sits second, ahead of Nature. That order is deliberate: every competing site leads on bamboo, and the villas are the differentiation.

`TabGroup` is the only client component on the page. Implement as real `role="tablist"` with `role="tab"` and `role="tabpanel"`, arrow-key navigation, and `aria-selected`. All panels are rendered in the DOM and hidden with `hidden`, so every card is crawlable.

### 6.6 `Journal`

```
H2:   From the journal
Link: All stories → /journal/
```

Three cards: image, title, visible date. **No newsletter signup, no email capture, no exit modal, no sticky bar.** This module ends in a link.

### 6.7 `Divider`

Full-width band on ink `#1A1D1B`, centred, `id="plan"` so it is anchor-linkable.

```
Kicker (amber): Plan the trip
Line (mist):    Everything below this line answers a question, not a mood.
```

Once this scrolls past on mobile, reveal a slim sticky bar with exactly two links: **Where to stay** and **Getting here**.

### 6.8 `OrientationStrip`

Four tiles from `stats.ts`, 4-up desktop, 2x2 mobile, hairline dividers, no card shadows.

**These must be real text, not an image.** They are the fastest crawlable answer to "where is Moganshan" anywhere on the site, and they sit low on the page, so they need the crawl equity. Each tile links to the page that proves the figure.

### 6.9 `WhereToStay`

```
H2:   Where to stay
Link: The 12 best hotels, ranked → /where-to-stay/best-hotels/
Tabs: All · Luxury · Boutique · Private villas · Hot springs · Family
```

Three cards visible: image, name, `village · keys · price band`, and one honest line in italic. Every property is presented on the same terms. There is no featured property, no sponsored slot, no "our pick" badge in this build.

### 6.10 `GettingHere`

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

### 6.11 `Itineraries`

```
H2:   Ready-made itineraries
Link: All itineraries → /itineraries/
```

| Card | Sub | Href |
|---|---|---|
| One day from Shanghai | and why we would not | `/getting-here/day-trip/` |
| A weekend, two nights | the one most people want | `/itineraries/weekend-from-shanghai/` |
| Shanghai, Hangzhou, Moganshan | five days | `/itineraries/shanghai-hangzhou-moganshan/` |

Keep the honesty in card one. It is the page where length of stay gets won.

### 6.12 `WhenToGo`

```
H2:   When to go
Link: Month by month → /seasons/
```

Twelve month chips on **one row**, from `months.ts`. Do not wrap into two rows of six; it stops reading as a year. Colour plus a text legend, never colour alone:

- `good` → leaf background at 18 percent, leaf text
- `busy` → amber background at 22 percent, ink text
- `quiet` → stone background, muted text

Legend: `quiet and good · busy or booked out · cold and cheap`

### 6.13 `BeforeYouCome`

```
H2:   Before you come
Link: Plan your trip → /plan/
```

Four flat cards, no images:

| Title | Sub | Href |
|---|---|---|
| Visa-free entry to China | 50 countries, plus the 240-hour transit rule | `/plan/china-visa-free-entry/` |
| Paying for things | Alipay and WeChat with a foreign card | `/plan/money-and-payments/` |
| Tickets and entry | what the scenic area actually costs | `/plan/tickets-and-entry/` |
| Is it worth visiting? | an honest answer | `/plan/is-moganshan-worth-visiting/` |

### 6.14 `TradeStrip`

Quiet band on stone `#D8CFC0`.

```
H3:     Tour operators, DMCs and media
Body:   Fact sheet, operator-ready itinerary modules and a free image library.
Button: Trade resources → /trade/   (ghost style)
```

### 6.15 `SiteFooter`

Four columns on bamboo `#1F4A3C` with mist text.

| Discover | Practical | Stay | About |
|---|---|---|---|
| The mountain | Getting here | Best hotels | About this site |
| Villages | Tickets | Hotel directory | Trade and media |
| The hill station | Weather | Private villas | Contact |
| Bamboo forest | Accessibility | Groups | Privacy |

Plus a link to `/sitemap/`, the wordmark, and 莫干山 in Noto Serif SC at small size.

Disclosure line, verbatim:

> Published by BeyondBorder Group Ltd, Hong Kong. Independent. We say plainly on the About page how this site is funded and whether we hold any commercial interest in a property listed here.

---

## 7. SEO

### Metadata

```tsx
// src/app/page.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://visitmoganshan.com"),
  title: "Moganshan, China: the complete guide | Visit Moganshan",
  description:
    "An independent guide to Moganshan: the hill station above Shanghai, where to stay, how to get there from Shanghai and Hangzhou, and when to go.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", url: "/", siteName: "Visit Moganshan",
    title: "Moganshan, China: the complete guide",
    description: "The hill station above Shanghai. Where to stay, how to get there, when to go.",
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};
```

### Structured data

Almost no competitor on any Moganshan search result ships structured data at all, so rich results are unusually cheap here. Inject both blocks in `layout.tsx` via `<script type="application/ld+json">`.

```ts
// src/lib/jsonld.ts
export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Visit Moganshan",
  url: "https://visitmoganshan.com",
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "BeyondBorder Group Ltd",
    address: { "@type": "PostalAddress", addressCountry: "HK" },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://visitmoganshan.com/search/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const placeLd = {
  "@context": "https://schema.org",
  "@type": "TouristDestination",
  name: "Moganshan",
  alternateName: ["Mount Mogan", "莫干山"],
  description:
    "A mountain and former hill station in Deqing County, Huzhou, Zhejiang Province, China.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Deqing County",
    addressRegion: "Zhejiang",
    addressCountry: "CN",
  },
  geo: { "@type": "GeoCoordinates", latitude: 30.594, longitude: 119.891 },
};
```

### Entity disambiguation, which is not optional here

Three different things share this name in search results, and two of them already contaminate the results for the destination:

- **Moganshan Road** is the M50 art district in Putuo, Shanghai. It has already broken into the top ten for "what to do in moganshan".
- **Moganshan Veneer** is an industrial plywood brand ranking in the head-term autocomplete.
- **Moganshan Station** is a high-speed rail station that does **not** serve the mountain. Deqing station is the correct one.

So: the first 100 words of visible copy must place the destination unambiguously (Deqing County, Huzhou, Zhejiang, north of Hangzhou), and `alternateName` must carry both "Mount Mogan" and 莫干山.

### Other

- Visible last-updated date in the footer. Several pages currently ranking number one for these queries were published in 2011, 2014 and 2016. Freshness is a competitive weapon here.
- `sitemap.ts` and `robots.ts` in `src/app/`.
- Every internal link is a real `<a href>`. No router-push buttons for navigation.

---

## 8. Accessibility

- WCAG 2.2 AA. The palette is pre-verified; do not introduce new colours without checking.
- Colour is never the only signal. The month strip carries a text legend.
- Visible focus ring on every interactive element: 2px amber outline with a 2px offset.
- The tab groups are real ARIA tablists with arrow-key support.
- Hero video is muted, `playsInline`, and respects `prefers-reduced-motion` by falling back to the poster still.
- Skip-to-content link as the first focusable element.
- Every image has a real alt. Decorative images get `alt=""`.
- Minimum touch target 44x44px.

---

## 9. Performance budget

| Metric | Budget |
|---|---|
| LCP | under 2.0s on a throttled 4G Moto G |
| CLS | under 0.05 |
| First-load JS | under 40 KB gzipped |
| Hero image | under 180 KB, AVIF with a WebP fallback |
| Total page weight | under 900 KB |

- `next/image` everywhere, explicit `width` and `height`, `priority` on the hero only.
- Fonts self-hosted woff2, `font-display: swap`, preload the two faces actually used above the fold.
- No third-party scripts of any kind in this build.

---

## 10. Images to source

Twelve slots. Real photography only. The bamboo forest result is currently held by an AI-aggregated page built on seven reviews, so genuine pictures beat the incumbent on the first draft.

| Slot | Ratio | Subject | Alt text |
|---|---|---|---|
| Hero | 16:9 | Mist through bamboo, or a stone villa at dawn | `Morning mist in the bamboo forest at Moganshan` |
| Hill station | 4:5 | Archive photograph, 1920s villa or tennis party | `A Western-style stone villa at Moganshan, photographed in the 1920s` |
| Four parts x4 | 3:2 | Bamboo, villa, village lane, tea terrace | descriptive, one per image |
| Things to do x4 | 3:2 | Villa route, Sword Pond, a trail, hot spring | descriptive, one per image |
| Hotels x3 | 3:2 | Exterior or room, one per property | `<Property name>, Moganshan` |
| Journal x3 | 3:2 | Editorial | matches the story |

Credit every archive image. Clean rights are the only reason the trade image library later works.

---

## 11. Acceptance checklist

- [ ] Exactly one `<h1>` and it is the word `Moganshan`
- [ ] Fourteen sections render in the order in section 6
- [ ] Divider band has `id="plan"` and is reachable via `visitmoganshan.com/#plan`
- [ ] Mobile hero is 60vh and the hill station band is visible at the fold
- [ ] Month strip is one row of twelve on every viewport down to 320px
- [ ] Orientation strip is text, not an image, and every tile links out
- [ ] No newsletter capture anywhere, including no modal and no sticky bar
- [ ] No sponsored, featured or "our pick" treatment on any hotel card
- [ ] Footer disclosure line present, verbatim
- [ ] Both JSON-LD blocks validate in Google's Rich Results Test
- [ ] Destination is disambiguated from Moganshan Road within the first 100 words
- [ ] Lighthouse: Performance 90+, Accessibility 100, Best Practices 100, SEO 100
- [ ] Keyboard-only pass: every link and tab reachable, focus always visible
- [ ] Renders correctly at 320px, 768px, 1280px and 1920px
- [ ] `npm run build` produces no warnings

---

## 12. Do not

- Do not add a newsletter, a chat widget, a cookie banner, a countdown, a popup or a "plan your trip" quiz.
- Do not rewrite the copy in this brief. It is final.
- Do not invent hotel names, ratings, prices or review counts. Use `TODO`.
- Do not use stock photography of generic Asian bamboo. The whole point is that the pictures are real.
- Do not put 莫干山 in the header. English is the audience and the Chinese characters push the primary keyword out of the visual hierarchy. Footer and About only.
- Do not set body text in amber, and do not set body copy in Fraunces.
- Do not add a second accent colour.
- Do not make the hero a carousel.
- Do not put a search box in the hero.
- Do not add motion that ignores `prefers-reduced-motion`.

---

## 13. Context, if you need to make a judgement call

The strategic case behind this page, for when the brief does not cover something:

The destination has almost no international search demand of its own. What demand exists is logistical, and it comes from people already in Shanghai or Hangzhou. The commercial opportunity is not that people are looking for Moganshan; it is that roughly seven million foreign visitors reach Shanghai each year and nobody has ever told them the mountain is here.

The competition is unusually weak. The number-one result for "visit moganshan" is a tour-operator page published in October 2014 that names no hotel. The most substantial guide on the destination carries no structured data and no date. Six exact-match domains were unregistered as of 1 August 2026.

So the page has two jobs. Make somebody want to come, which is why culture leads. Then answer every practical question without making them leave, which is why the second half exists. When in doubt between something that looks impressive and something that is useful and true, ship the useful and true one.
