# visitmoganshan

Astro 7 static site. Guide pages live in `src/content/guide/*.md`, are routed by
their frontmatter `url` field rather than by filename, and render through
`src/layouts/GuideArticle.astro`.

## Imagery rule (standing, applies to every new page)

Every page and every guide article ships with:

1. a lead image (frontmatter `image` + `image_alt`), rendered under the
   standfirst, and
2. **at least three inline captioned figures** placed at natural section breaks
   inside the body.

These pages run 1,300 to 2,100 words. Unbroken prose at that length does not get
read. A page that ships with fewer than three body images is not finished.

Scope: every guide article, plus the home page. Deliberately excluded are the
legal and utility pages (privacy, terms, cookies, user-generated content,
search, sitemap, the contact form and its confirmation). Photographs on a
privacy policy are decoration pretending to be content, and the contact page is
a form rather than a read.

### Authoring a figure

Write an image on its own line in the markdown, with a caption in the title
slot:

```markdown
![Descriptive alt text](/images/guide/slug-2.webp 'Caption shown under the image.')
```

The `vm-figures` hast plugin in `src/lib/markdown.mjs` turns any paragraph whose
only child is an image into a `<figure class="vm-figure">` with a `<figcaption>`,
and adds `loading="lazy"` plus intrinsic dimensions. Alt text is always hand
written and descriptive. The caption carries information the prose does not, not
a restatement of the alt.

### Images are generated, and the page says so

All photography on this site is AI generated. `GuideArticle.astro` prints a
standing note at the end of every article body saying the images are
representative illustrations rather than documentary images of the specific
building, property or service. Do not remove it and do not make it conditional:
several figures stand in for identifiable real places (the villas on the walking
tour, the named hotels, Deqing station), and a note that appears only sometimes
is a note nobody learns to look for.

Three rules follow from that. Every generated image is a real life candid
photograph, never AI perfect: a handheld feel, uneven light, weather, a
cropped edge, blur, clutter, the defects a real photograph has, written into
the prompt; a polished render is rejected and regenerated. Never write a
caption or alt that asserts the image
*is* a named place ("Songyue Lodge, seen from the lane"); describe what is in the
frame instead. And never generate a recognisable human face: people appear from
behind, in profile, or at a distance.

### Producing the asset

1. Generate with the `generate-image-openai` skill (OpenAI Images, `gpt-image-2`),
   3:2 landscape for body figures, 16:9 for leads.
2. Raw PNG goes in `assets/raw/guide/<slug>-<n>.png`.
3. Re-encode locally and commit the result: `npm run img assets/raw/guide/<file>.png --out=public/images/guide`.
   Never rely on Vercel image optimization.
4. Look at the generated PNG before wiring it in. Never ship an unverified image.

## Images are optimized to the size they render at, always

This is a standing rule, not a step in one task. Nothing enters `public/` at a
size larger than the slot that displays it, and the budget is decided by the
layout rather than by whatever the source happened to hand over.

`npm run img:audit` enforces it. Alongside the site-wide caps below, it carries
per-directory budgets for images that are only ever rendered small:

| Where | Cap | Renders at |
|-------|-----|-----------|
| `public/images/stays/{id}/1.webp` | 800px, 80 KB | ~320 CSS px, the card lead |
| `public/images/stays/{id}/{2,3}.webp` | 400px, 30 KB | ~107 CSS px, card thumbnails |

Add a row when a new directory of small images appears. The reasoning behind
the stays budget is worth keeping in mind for the next one: the CDN served
frames up to 1600px at about 125 KB each, and across 809 properties shipping
those unchanged would have committed close to 300 MB to this repository for
detail no reader can see. Right-sized it is about a fifth of that.

Two details that turned out to matter. Captured frames are cropped to 3:2
rather than scaled by width, because roughly one listing photo in six is
portrait and scaling those by width alone doubles their area; the card crops to
3:2 anyway. And the encoder steps quality down, then size down, before it gives
up: a grainy photograph over budget at low quality is better shipped slightly
smaller than dropped, and a card with no photograph is the worst outcome of the
three.

Originals stay in `assets/raw/stays/`, which is gitignored, so the whole set can
be re-encoded with `npm run stays:img` after a budget change without touching
the network again.

## Images must be optimized before they are pushed

Vercel image optimization is off, so what is committed is byte for byte what a
reader downloads. `npm run img:audit` checks every raster under `public/`:
webp everywhere except the icons, brand downloads and OG image, nothing wider
than 2000px, nothing over 260 KB. The `pre-push` hook runs it and blocks the
push on a failure. Install the hooks once per clone with `npm run hooks:install`.

Known broken: `scripts/pre-commit-optimize-images.mjs` imports
`scripts/to-webp.mjs`, which has never existed in this repository. The
`scripts/hooks/pre-commit` wrapper therefore crashes on every commit if it is
ever installed, and `npm run hooks:install` will copy it in. Either restore the
missing module or delete the hook and its script; the pre-push audit covers the
same ground in the meantime.

## Other conventions

- `trailingSlash: 'never'`. Internal links may be drafted with a trailing slash;
  the `internalLinkSlashes` plugin strips it at build time.
- The markdown `# Title` is stripped at build time; the layout owns the h1.
- Do not run `npm run build` as an automatic verification step. Build only when
  asked.

## Bylines and dates (standing)

Every guide article carries `author`, `published` and `last_updated` in its
frontmatter. The three authors and their LinkedIn profiles live in
`src/data/authors.ts`; the byline, the Person block in the structured data and
the "Who writes it" section of the About page all read from there. Do not add
a name without a public profile that can be checked.

`published` is set once and never moves. `last_updated` moves whenever the body
changes, and only then. `npm run dates:check` compares every changed article
against the upstream branch and fails when the text moved and the date did not;
the `pre-push` hook runs it. Do not bulk bump dates: a site where every page
changed on the same day has told the reader nothing.

The closing "Last checked ... by ..." line under every article is generated by
`GuideArticle.astro` from `last_updated`. Do not type a dated "Checked" line at
the end of a body, and do not put a date in a meta description: a stale date in
a search snippet is the worst place for one. A figure checked on a different
day may still say so inline, next to the figure.

## Property listings (standing)

The 809 row affiliate seed never produces a page. A property gets its own URL
only once it has three images, a description written here, an honest note and
three attributed excerpts, and the stays collection schema refuses anything
less. That gate is the site's defence against becoming eight hundred thin
pages, and it stays.

The seven type listings under `/where-to-stay/{type}` are paginated at sixty
cards. The first page carries a few hundred words of our own prose from
`src/data/stay-types.ts` and is the only page indexed; later pages and the
single-page `/all` view are `noindex, follow` and excluded from the sitemap.
Rates show the dollar figure with the yuan beside it, since yuan is what the
booking is settled in. Nothing on a card is written here and nothing is ranked
by us: the order is review count.

## Editorial system (one piece every three days, 14 September 2026 to 12 September 2027)

The pipeline lives in `editorial/`. When the user says "Draft every row that
is due", "Draft brief 003" or "Publish <slug>", read `editorial/CLAUDE.md` and
`editorial/SPEC.md` first and follow `editorial/RUNBOOK.md`. The master plan
is `content-drafts/moganshan-build-spec_1.md`; `editorial/scripts/build-briefs.mjs`
generates the 122 briefs and the 174 row schedule from its Part 6 and Part 7.

Pipeline, in order, none optional: Chinese deep research with the source
tiers applied and every source validated twice, the house `/createarticle`
(`.claude/skills/createarticle/`, iteration 7 is a cadence pass, never
planted errors, iteration 13 writes four image prompts), `/content-quality-us`
under the British English override, `/generate-image-openai` for the lead and
the three body figures, then the publish step (move into `src/content/guide/`,
`img:audit`, `dates:check`, `astro check`, build, commit, push) from the
scheduled morning task, then one email through `editorial/scripts/notify-publish.mjs`.

The scheduled publish run is the one place this repo builds automatically; it
is the explicit request the "build only when asked" rule needs. Two standing
rules from Cyril carry over from the sibling pipelines: when the runbook asks
for something the repo cannot do, use what the repo has and log the
substitution; every pipeline step runs on the most capable model available,
never a faster or smaller mode, and images use gpt-image-2 at high quality.

## The news layer (standing)

`/journal/news` is a content collection (`src/content/news`), one file per
item, breaking item or weekly dispatch, with permalinks under
`/journal/news/YYYY/MM/{slug}` and `/journal/news/dispatch/YYYY-WW`, topic
and year pages, an RSS feed at `/journal/news/feed.xml` and a Google News
sitemap. The schema refuses an item without a dated, tiered Chinese source or
without a visitor consequence, and the build fails on a `/go/` link or an em
dash in a news body.

The pipeline is BBChien's actualités agent on a static site, in
`editorial/news/`: `sources.json` is the source registry, `sweep.mjs` the
crawler (listing pages only, never article bodies), `triage/` its daily
output, `drafts/` the queue, `seen.json` the ledger, `settings.json` the
cadence and the pause switch. A Claude run drafts under
`editorial/news/CLAUDE.md`; a person approves with `npm run news:approve`;
`news-publish.mjs` moves, checks, builds, commits, pushes and emails. Nothing
publishes without the approval step, and no code path may add one. The two
scheduled tasks are in `editorial/scripts/register-tasks.ps1`; the news
publish is the second place this repo builds automatically.
