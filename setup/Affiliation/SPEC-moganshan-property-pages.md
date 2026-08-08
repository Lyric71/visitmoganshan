# Build Spec: Moganshan Property Pages (Trip.com affiliation)

**For:** Claude Code
**Companion to:** the Visit Moganshan Site Reorganization spec (the `/where-to-stay/{slug}` collection defined there)
**Partner:** Trip.com only. No Booking.com anywhere.
**Prepared:** 8 August 2026

---

## 0. What you are building

A page per hotel under `/where-to-stay/{slug}`, generated from a content collection seeded by the 809-row affiliate list. Every published page carries, at minimum:

- the hotel **name**
- **at least 3 photos**
- a **description** (rewritten in the site's own voice, not copied)
- a **note** (one honest editorial caveat)
- exactly **3 guest comments** (short attributed excerpts, with a link back to Trip.com)
- one **"Check dates on Trip.com"** call to action routed through `/go/`

The photos, review excerpts, and rating are sourced per Section 5. The affiliate links already exist and are provided; you do not generate them.

---

## 1. Stack and constraints

- **Framework:** Astro, static output, deployed on Vercel.
- **Zero self-hosting.** No standalone servers or databases. Data lives in the repo as content collections; images are optimized build-time assets.
- **Must work inside and outside China.** Do not hotlink third-party image CDNs (referrer blocks, expiry, and China-reachability make them unreliable). Self-serve optimized images. Test image delivery from inside China before the full run.
- **House rules:** US journalist prose, American English, no em dashes anywhere including code comments. Honest voice: no invented star ratings, no "we loved it." State facts, name trade-offs.

---

## 2. Inputs provided (in this handoff)

| File | What it is |
|------|-----------|
| `properties.seed.json` | 809 records, one per hotel. The source of truth for identity, slug, and affiliate URL. |
| `go-redirects.json` | 809 `/go/{goSlug}` to affiliate-URL mappings, ready for `vercel.json`. |

**Seed record shape:**

```json
{
  "id": 901389,
  "slug": "naked-stables-resort-901389",
  "name": "naked Stables Resort",
  "city": "Deqing",
  "cityId": 1367,
  "goSlug": "moganshan-901389",
  "affiliateUrl": "https://www.trip.com/hotels/detail/?cityEnName=Deqing&cityId=1367&hotelId=901389&Allianceid=9859697&SID=327673690&trip_sub1=moganshan-901389&trip_sub3=D19127628",
  "status": "draft"
}
```

**Constants across all links** (do not hard-code elsewhere; they are already baked into `affiliateUrl`): `Allianceid=9859697`, `SID=327673690`, `trip_sub3=D19127628`. The per-hotel tracking id is `trip_sub1 = moganshan-{hotelId}`, which is also the `goSlug`.

**Slug rule:** `{ascii-kebab-of-name, truncated 60}-{hotelId}`. The `hotelId` suffix guarantees uniqueness and gives you a stable key even if a name changes. All 809 slugs are unique in the seed.

---

## 3. Decisions to confirm before the full run

Two forks change the shape of the build. Defaults are given so you can start the pilot immediately; confirm with Cyril before running all 809.

### 3a. Scope and tiering

809 near-identical scraped pages is a Google thin-content and doorway-page risk, and a large capture load. Do not ship 809 uniform pages. Use three tiers:

- **Tier A, full editorial (about 10 to 40 anchors):** resorts and standout stays. Human-reviewed description and note, 3 curated photos, 3 curated comments. `status: published`, indexable.
- **Tier B, programmatic (the substantive middle):** auto-built from sourced data, but only promoted to `published` when the page clears the content bar in Section 9. Otherwise stays `draft` and `noindex`.
- **Tier C, long tail:** no standalone page. Represented on the hub and on village pages through Trip.com storefront search links only.

**Default if unconfirmed:** build the collection for all 809 as `draft`, publish only entries that clear the content bar, and start with the Section 11 pilot.

### 3b. Content sourcing route

See Section 5. **Default:** licensed sources where available; capture as an explicitly-bounded fallback with attribution and excerpting. Confirm whether Cyril's Trip.com affiliate account exposes creative or media assets, and whether he wants to license a reviews API rather than capture.

---

## 4. Data model: the `stays` content collection

`src/content/config.ts`, collection `stays`, one entry per hotel. Zod schema:

```ts
import { z, defineCollection } from "astro:content";

const image = z.object({
  src: z.string(),          // local optimized asset path or import
  alt: z.string().min(8),   // descriptive, written for a11y and SEO
  credit: z.string()        // e.g. "Property listing via Trip.com"
});

const comment = z.object({
  quote: z.string().max(300),   // short excerpt, see Section 5
  author: z.string(),           // reviewer handle or initial as shown on source
  date: z.string(),             // ISO date of the review
  rating: z.number().min(0).max(5).optional(),
  sourceUrl: z.string().url()   // deep link back to the property reviews on Trip.com
});

const stays = defineCollection({
  type: "content",
  schema: z.object({
    id: z.number(),                       // Trip.com hotelId, matches seed
    name: z.string(),
    slug: z.string(),
    city: z.string(),
    cityId: z.number(),
    tier: z.enum(["A", "B", "C"]).default("B"),
    village: z.string().optional(),       // when known
    type: z.string().optional(),          // Resort, Homestay, Villa, Hotel
    images: z.array(image).min(3),        // hard minimum of 3
    description: z.string().min(200).max(900),   // rewritten, own voice
    note: z.string().min(20).max(400),           // one honest caveat
    comments: z.array(comment).length(3),        // exactly 3
    rating: z.object({ score: z.number(), count: z.number() }).optional(),
    affiliate: z.object({ goSlug: z.string(), url: z.string().url() }),
    seo: z.object({ title: z.string().max(60), metaDescription: z.string().max(160) }),
    status: z.enum(["draft", "published"]).default("draft"),
    sourcedAt: z.string()                 // ISO timestamp of capture
  })
});

export const collections = { stays };
```

The schema enforces the requirements structurally: fewer than 3 images or a comment array not exactly 3 fails the build.

---

## 5. Content sourcing and compliance (read before writing the scraper)

Reproducing another platform's photos and user reviews verbatim on a commercial site is an IP, terms-of-service, and SEO problem at once. Build it defensibly from the start.

**Confirmed reality (Aug 2026):** the Trip.com affiliate program provides deep links and creative assets to partners, but does not publish an official reviews-and-images content API for standard affiliates. Reviews are available either through a licensed third-party API or by capture. Tripadvisor, a different platform, does run an official Content API. Plan around the Trip.com reality below.

**Images.** Prefer, in order: (1) creative or media assets offered inside the Trip.com affiliate portal for the specific property; (2) the hotel's own press or media kit; (3) capture from the public listing as a last resort. Whatever the source, download and optimize the files, serve them from the site, store a `credit` string per image, and keep alt text descriptive. Do not hotlink. If a property has no usable licensed image and you will not capture, leave the entry `draft`.

**Reviews and comments.** Two acceptable routes:

- **Licensed reviews API (recommended, most robust):** a paid third-party API that returns Trip.com reviews as structured JSON. Cleaner, more stable than DIY capture, and easier to defend. If Cyril licenses one, the pipeline reads from it directly.
- **Attributed excerpts (fallback):** short quoted snippets, roughly 40 words or fewer each, with the reviewer handle as shown, the date, the rating, and a link back to the property's reviews on Trip.com. Do not reproduce full reviews verbatim, and do not present them as the site's own words. An honest "what guests mention" synthesis plus the rating and a link back is also acceptable and lower risk.

**Descriptions.** Rewrite in the site's voice from the sourced facts. Never paste Trip.com marketing copy. Verbatim copy is both an IP issue and a duplicate-content penalty. The transform step (Section 6) runs this rewrite.

**Process guardrails for any capture:** honor `robots.txt` and the Trip.com terms; keep concurrency low (2 or fewer) with a randomized 3 to 6 second delay; retry with backoff; cache raw responses so you never re-hit a property you already have; log failures rather than hammering. Capture is a data-collection step run from your machine or CI, never at page-request time.

---

## 6. Data-collection pipeline (offline, build-time)

Two scripts, both resumable and idempotent, both writing to a raw cache that the collection is built from. Nothing here runs on a visitor request.

### `scripts/collect-stays.mjs`

Node plus Playwright (or the licensed API client). Input: `properties.seed.json`. For each record not already cached:

1. Resolve the property by `hotelId` (via licensed API if configured, else the public listing).
2. Collect at least 3 image URLs, a source description, the aggregate rating and count, and 3 review excerpts (quote, author, date, rating, sourceUrl).
3. Download images to `src/assets/stays/{hotelId}/` and record local paths plus credit.
4. Write raw JSON to `data/raw/{hotelId}.json` with `sourcedAt`.

Controls: `--limit N` for pilot runs, `--only <hotelId,...>`, concurrency 2, jittered delay, exponential backoff, checkpoint file so a re-run resumes, and `data/failed.json` for entries needing manual attention. Never overwrite a good cache unless `--refresh` is passed.

### `scripts/build-stays.mjs`

Transforms `data/raw/{hotelId}.json` plus the seed into content entries in `src/content/stays/`:

- Rewrite the description into the house voice (LLM-assisted from the raw facts, then a human-review queue for Tier A). Enforce 200 to 900 characters, no copied sentences.
- Write the `note` (Tier A: human-written; Tier B: a templated honest caveat such as "We have not stayed here. It sits in {village} and suits {who}; {one real trade-off}." filled from sourced facts).
- Trim comments to 3 attributed excerpts within the length cap.
- Set `affiliate` from the seed (`goSlug`, `url`). Assert the URL's `hotelId` equals `id`.
- Set `status: published` only when the entry clears the Section 9 content bar; otherwise `draft`.
- Set `tier` from a curated anchors list (Section 11) or default `B`.

### `scripts/validate-stays.mjs`

Fails the build if any entry violates Section 9. Run in CI before deploy.

---

## 7. The property page

**Route:** `src/pages/where-to-stay/[slug].astro`, generated with `getStaticPaths()` over `getCollection("stays", e => e.data.status === "published")`.

**Component:** `src/components/StayPage.astro`. Section order matches the reorg template:

1. **Hero:** name (`h1`), a kicker line ("Where to stay, {city}"), and fact chips (type, village, rating if present).
2. **Gallery:** the images array, minimum 3. Responsive, lazy-loaded below the fold, no layout shift, descriptive alt, small credit line. Keyboard-navigable if it is a carousel.
3. **What it is:** the `description`.
4. **The honest note:** the `note`, in a visually distinct callout.
5. **What guests say:** the 3 comments, each showing the quote, author, date, rating, and a "via Trip.com" link to `sourceUrl`. Include the aggregate `rating` if present.
6. **Call to action:** one amber "Check dates on Trip.com" button to `/go/{goSlug}`, with `rel="sponsored noopener"` and `target="_blank"`.
7. **Disclosure line** directly under the button: "We may earn a commission if you book through this link, at no cost to you." Link to `/plan/disclosure`.
8. **Related:** the village page, 2 or 3 sibling stays, and the weekend-from-Shanghai itinerary.

**SEO and structured data:** `seo.title` and `seo.metaDescription`; self-referencing canonical; Open Graph with the first image. Emit `Hotel` JSON-LD. Emit `aggregateRating` in JSON-LD only when the rating is licensed for redistribution; if you are unsure, omit it. `draft` pages get `noindex` and stay out of the sitemap.

**Accessibility and performance:** alt on every image, focus states on the gallery and CTA, lazy images, Lighthouse 90 or higher on performance and SEO.

---

## 8. Hub, navigation, and `/go/`

- **Where to Stay hub** (`/where-to-stay`): cards generated from published entries, filterable by village and type, plus one "Browse all Moganshan stays on Trip.com" storefront link. Promote Where to Stay to the top-level nav per the reorg.
- **`/go/` redirects:** load `go-redirects.json` into `vercel.json` (or an edge function that looks up the slug). Use 302 so a slug can be re-pointed. Add `/go/` to `robots.txt` as disallow and mark it `noindex`.
- **Sitemap:** published entries only.

```json
// vercel.json (merge the provided go-redirects.json "redirects" array)
{ "redirects": [
  { "source": "/go/moganshan-901389",
    "destination": "https://www.trip.com/hotels/detail/?...hotelId=901389...",
    "permanent": false }
  /* ...809 total, from go-redirects.json */
]}
```

---

## 9. Acceptance criteria

**Per published page (all must pass, enforced by `validate-stays.mjs`):**

- name present; images length 3 or more, each with non-empty alt and credit
- description 200 to 900 chars and contains no sentence copied verbatim from the raw source
- note present
- comments length is exactly 3, each with quote, author, date, and a resolvable `sourceUrl`
- CTA resolves to `/go/{goSlug}`, and the affiliate URL's `hotelId` equals the entry `id`
- disclosure line present and linked
- valid `Hotel` JSON-LD; canonical and OG present
- axe: no critical a11y violations; Lighthouse performance and SEO 90 or higher

**Global:**

- build type-checks and passes with zero Zod failures
- no broken image references
- `/go/` resolves for all 809 seed slugs
- sitemap excludes `draft`; all `draft` pages emit `noindex`
- a report prints counts by tier and status, and lists every entry still `draft` with the reason

---

## 10. Build order

1. **Load and scaffold.** Read `properties.seed.json`, create 809 collection stubs at `status: draft`, wire `go-redirects.json` into `vercel.json`. Confirm `/go/` resolves.
2. **Build the page against samples.** Implement `[slug].astro`, `StayPage.astro`, the gallery, and the hub, using 3 hand-filled sample entries. Get the template, SEO, a11y, and CTA correct first.
3. **Pilot capture.** Implement `collect-stays.mjs`; run `--only` on the Section 11 pilot (10 hotels). Verify images download, excerpts attribute correctly, and links back resolve.
4. **Transform and QA the pilot.** Run `build-stays.mjs` and `validate-stays.mjs` on the pilot. Human-review the Tier A anchors. Publish the pilot.
5. **Full run, gated.** Only after Cyril confirms scope (3a) and sourcing (3b): run capture in batches, transform, validate, and publish only entries that clear the bar. Everything else stays `draft`.
6. **Finish integration.** Nav promotion, sitemap, `/plan/disclosure`, per-village storefront links for the Tier C long tail, and the tier/status report.

Stop after step 4 and report before the full 809 run.

---

## 11. Pilot set (real hotelIds from the seed)

A representative 10: two resorts, one resort hotel, and a spread of homestays, villas, and a lodge.

| hotelId | Name | Tier |
|--------:|------|:----:|
| 901389 | naked Stables Resort | A |
| 15826772 | naked Castle Resort | A |
| 100342198 | Moganshan Kaiyuan Life Resort Hotel | A |
| 130417838 | Yunsi \| Joyful Lan Homestay | B |
| 15717014 | Xizhu Yunjian Hot Spring Villa | B |
| 107372818 | Moganshan Jiye Homestay | B |
| 12092521 | Moganshan Zan Designer Boutique Homestay | B |
| 7860009 | Mogan Lansu Holiday Hotel | B |
| 68074847 | Moganshan Yiyou Mountain Lodge | B |
| 46092617 | Apricot SENSE Mogan Mountain Residence | B |

Run: `node scripts/collect-stays.mjs --only 901389,15826772,100342198,130417838,15717014,107372818,12092521,7860009,68074847,46092617`

---

## Appendix A: file tree this spec produces

```
src/
  content/
    config.ts                 # stays collection schema
    stays/{slug}.md           # one entry per published hotel
  pages/where-to-stay/
    index.astro               # hub
    [slug].astro              # property page route
  components/
    StayPage.astro
    StayGallery.astro
    StayComments.astro
  assets/stays/{hotelId}/     # downloaded, optimized images
scripts/
  collect-stays.mjs
  build-stays.mjs
  validate-stays.mjs
data/
  raw/{hotelId}.json          # capture cache
  failed.json                 # entries needing manual attention
  seed/properties.seed.json   # provided
  seed/go-redirects.json      # provided
vercel.json                   # /go/ redirects merged in
```

## Appendix B: notes for whoever runs capture

- Le Passage Mohkan Shan, Crowne Plaza Deqing, and Four Seasons are not in the seed. If they belong on the site, add them to the affiliate sheet first so they get a `goSlug` and link, then re-seed.
- The seed spans Deqing (779) and Huzhou (30). Confirm the 30 Huzhou properties are close enough to Moganshan to belong, or exclude them.
- Naming is messy (Chinese-influenced names, separators, marketing suffixes). The `hotelId`-suffixed slug protects you; do not try to make slugs pretty at the cost of uniqueness.
