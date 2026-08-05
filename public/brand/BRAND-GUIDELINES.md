# Visit Moganshan Identity Assets

Direction 01 "Grove" in Palette A "Bamboo & Mist". Wordmark in Playfair Display.
Built 4 August 2026 for visitmoganshan.com.

## The mark

Seven bamboo culms of uneven width and height, their tops tracing a mountain
ridge. The node markings sit at **different heights on every culm**, spaced the
way bamboo actually grows, short internodes near the crown and longer ones toward
the base. That irregularity is deliberate and load bearing: evenly spaced culms
with aligned nodes read as a bar chart, and this is what prevents it.

The nodes are **knockouts, not painted bars** (`fill-rule: evenodd`), so the mark
stays correct over photographs and colour fields. It carries no hidden
background.

Two variants, and they are not interchangeable:

| File | Use |
|------|-----|
| `mark-primary.svg` | Everywhere from about 28px up. Full seven culm detail. |
| `mark-favicon.svg` | **Below 28px only.** Four heavier culms, one node each. |

Below roughly 24px the seven culm version fills in and turns to mush. That is why
the reduced variant exists. Use it for the browser tab and anywhere the mark
appears smaller than a thumbnail.

The favicon served from `public/` is the reduced mark **reversed on a solid
bamboo plate**, not the transparent primary variant. This is not a style choice:
dark ink on transparency disappears against Chrome's dark tab strip, and Google
Search composites favicons on backgrounds it chooses. Every browser icon in the
set is therefore fully opaque.

## Files

**Vector (the real assets, scale these, do not scale the PNGs)**

* `mark-primary.svg` : deep bamboo on transparent
* `mark-reversed.svg` : mist, for dark backgrounds
* `mark-currentcolor.svg` : inherits CSS `color`, for inline SVG in components
* `mark-duotone.svg` : optional two green variant, adds depth at large sizes
* `mark-favicon.svg` : reduced variant for small sizes
* `app-icon.svg` : mark in mist on a bamboo rounded square
* `lockup-horizontal.svg` and the reversed twin : site header
* `lockup-stacked.svg` : social profiles, print, footer
* `og-image.svg` : social share card source

**Raster**, in `png/`. Favicons at 16/32/48, `apple-touch-icon.png` (180),
`icon-192` and `icon-512` for the manifest, mark at 512/1024, lockups at
1600px wide, `og-image.png` at 1200x630.

`favicon.ico` bundles 16/32/48 for older browsers. `icon-48.png` and
`icon-96.png` exist for Google Search, which only reads favicons whose sides are
a multiple of 48. `icon-maskable-512.png` insets the mark into the centre 80% so
Android can crop it to any shape without shaving the outer culms.

Everything the site serves is rebuilt from `public/mark-favicon.svg` by
`npm run icons`. Edit the SVG, run the script, never hand edit the rasters.

**Code**

* `tokens.css` : CSS custom properties for the full palette, with the verified
  contrast ratio noted against each colour and the pairings that fail called out
* `fonts.css` : `@font-face` rules for the bundled fonts, plus the type scale
* `fonts/` : Playfair Display and Inter, latin woff2, weights 400 to 700, plus licences
* `head-snippet.html` : favicon, icon, font preload, Open Graph and canonical tags
* `site.webmanifest` : PWA manifest

## Typography

The wordmark is set in **Playfair Display** and has been outlined to paths, so the
lockup files carry no font dependency and render identically anywhere.

For the site: **Playfair Display** for headings and display, **Inter** for body.

Playfair Display is a *display* face. Do not set body copy in it. Its stroke
contrast is high and the hairlines thin out at 16 to 17px, which makes long guide
pages tiring to read. Headings, the wordmark and pull quotes only.

Both faces are bundled in `fonts/` as latin subset woff2, with `fonts.css`
containing the `@font-face` rules and a sensible type scale. Self hosting removes
a third party round trip, which matters for a site built to earn search traffic.
Both are OFL licensed; the licences are included.

Chinese, where needed: **Noto Serif SC**.

## Clear space and minimum size

* Clear space around the mark or lockup: the width of one culm on all sides.
* Minimum lockup width: 140px. Below that, use the mark alone.
* Minimum mark size: 28px for `mark-primary`, 16px for `mark-favicon`.

## Don't

* Don't recolour the mark outside the palette, or apply gradients.
* Don't place the primary mark on a busy photograph without a scrim. Use the
  reversed mark over a darkened area instead.
* Don't stretch the lockup; scale proportionally.
* Don't rebuild the wordmark in a different typeface. Use the supplied files.
* Don't use the five culm mark as the favicon.

## Known fix applied to the horizontal lockups

`lockup-horizontal.svg` and `lockup-horizontal-reversed.svg` shipped with
`viewBox="0 0 296.9 62.0"`, but the outlined wordmark inks down to **64.88**.
The viewBox was therefore cutting the descender of the "g" in *Moganshan* on
every render. Both files now carry `height`/`viewBox` of **65.5**. No path
coordinate was touched; only the canvas grew.

`lockup-stacked.svg` and `og-image.svg` were checked and are not affected. The
1600px lockup PNGs in `png/` were rasterised from the old canvas and still carry
the clip; re-run `render.py` to refresh them.

Re-extracting `setup/visit-moganshan-brand-assets.zip` over this folder will
reintroduce the clip. Re-apply the canvas height if you do.

## Regenerating

`build_assets.py` draws every vector from parameters and outlines the wordmark;
`render.py` rasterises the set. Adjust geometry in `build_assets.py` and re-run
both to rebuild everything consistently. Browser and platform icons are the one
exception: those come from `npm run icons`.
