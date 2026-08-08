# The stays pipeline

Everything under `data/` is build-time input. None of it is served, and nothing
in it is read at page-request time.

```
data/
  seed/properties.seed.json   809 rows. Identity and tracked links only.
  seed/go-redirects.json      the same table, as issued. Cross-checked, not used.
  raw/{hotelId}.json          one capture per property, with sourcedAt.
  drafts/{slug}.md            an entry being written. Not a collection file.
  failed.json                 rows the collector could not finish, with reasons.
```

## The two registers

The **seed** is the affiliate list. It is names and links, so it can never on
its own produce a page. It drives two things: the `/go/` redirect table, built
from it in `astro.config.mjs`, and the storefront search links that stand in for
the long tail.

The **stays collection**, `src/content/stays/`, is editorial. An entry exists
only once a property has three images we host, a description written here, one
honest caveat and three attributed guest excerpts. The Zod schema in
`src/content.config.ts` enforces all of that, so an unfinished entry fails the
build rather than shipping as a thin page.

There is deliberately no stub file per seed row. 809 stubs would duplicate the
seed, fail their own schema for want of images, and render nothing.

## Running it

```bash
# 1. Capture. Concurrency 2, jittered, resumable, cached.
npm run stays:collect -- --only 901389,15826772,100342198

# 2. Turn captures into drafts under data/drafts.
npm run stays:build

# 3. Write the description and the note in each draft, delete the brief block.

# 4. Move finished drafts into the collection. Refuses anything with a TODO.
npm run stays:build -- --promote

# 5. Check everything, including the seed and the redirect table.
npm run stays:validate

# 6. Look at the pages before publishing. Drafts render only under this flag,
#    always noindex, never in the sitemap.
npm run stays:preview
```

Publishing is the one step with no script: flip `status: published` by hand,
after somebody has read the page. That is on purpose.

## What the collector will and will not do

It honors `robots.txt` and stops if the listing path is disallowed. It runs two
at a time with a 3 to 6 second jitter and exponential backoff. It caches every
capture so a property is never hit twice, and it writes failures to
`failed.json` rather than retrying into a wall.

It downloads images and re-encodes them into `public/images/stays/{hotelId}/`
at 1600px and under 260 KB, which is what `npm run img:audit` will accept.
Nothing is ever hotlinked: partner CDNs are referrer checked, expire URLs, and
are unreliable from inside China.

It trims reviews to roughly forty words and keeps the handle, the date and a
link back. It does not reproduce a review in full.

It does not write the description. Pasted listing copy is an intellectual
property problem and a duplicate-content penalty in the same sentence, so the
description arrives as a TODO with the source facts attached as a brief, and a
person writes it.
