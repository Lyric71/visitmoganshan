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

Two rules follow from that. Never write a caption or alt that asserts the image
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
