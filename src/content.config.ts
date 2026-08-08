import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported straight from zod: the `z` re-export from astro:content is deprecated.
import { z } from 'zod';

/**
 * The guide collection: every editorial page on the site apart from the home
 * page. Source files are drafted as plain markdown with the frontmatter block
 * below, dropped into src/content/guide, and routed by their own `url` field
 * rather than by filename. Filenames are flat and path-shaped
 * (getting-here-from-shanghai-by-train.md) so the directory stays greppable
 * while the URL tree stays deep.
 *
 * Every field here is required except word_count, because a page missing its
 * meta description or its last-updated date is a page that should not ship.
 * Several of the competing pages ranking number one for these queries were
 * published in 2011 and carry no date at all; ours carry one on the page and
 * in the structured data.
 */
const guide = defineCollection({
  loader: glob({ base: './src/content/guide', pattern: '**/*.md' }),
  schema: z.object({
    /** Canonical path, as drafted. Normalised to a no-trailing-slash route. */
    url: z.string().startsWith('/'),
    /** On-page h1. */
    title: z.string(),
    /** <title>. Longer and keyword-led; the h1 stays human. */
    seo_title: z.string(),
    meta_description: z.string(),
    /** Standfirst under the h1, and the summary used in listings. */
    excerpt: z.string(),
    primary_keyword: z.string(),
    secondary_keywords: z.array(z.string()).default([]),
    /** Draft note, e.g. "Article + HowTo + FAQPage". Drives the JSON-LD. */
    schema: z.string().default('Article'),
    /**
     * Card thumbnail, used wherever the page is listed rather than read. Both
     * fields travel together: an image with no hand written alt is a decorative
     * image, and none of these are decorative.
     */
    image: z.string().optional(),
    image_alt: z.string().optional(),
    word_count: z.number().optional(),
    last_updated: z.coerce.date(),
  }),
});

/**
 * The stays collection: one entry per Trip.com property that has real sourced
 * content behind it.
 *
 * The schema is the content bar, expressed structurally rather than as a
 * checklist somebody has to remember. Fewer than three images, a comment array
 * that is not exactly three, a description outside 200 to 900 characters or a
 * missing honest note fails the build. That is the point: the failure mode this
 * collection has to be protected against is 809 thin pages built from scraped
 * fragments, and the cheapest guard against it is a schema that will not accept
 * one.
 *
 * There is no stub entry per seed row. The 809 row affiliate list lives in
 * data/seed/properties.seed.json and drives the /go/ table and the storefront
 * links; a property with nothing sourced yet simply has no file here.
 */
const stayImage = z.object({
  /** Site-relative path under /images/stays. Never a third party CDN URL. */
  src: z.string().startsWith('/'),
  /** Hand written and descriptive. Never asserts the frame is a named place. */
  alt: z.string().min(8),
  /** Where the file came from, e.g. "Property listing via Trip.com". */
  credit: z.string().min(3),
});

const stayComment = z.object({
  /** A short excerpt, not a reproduced review. See the sourcing note below. */
  quote: z.string().max(300),
  /** The reviewer handle exactly as the source shows it. */
  author: z.string().min(1),
  /** ISO date of the review. */
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** On the source's own scale, which for Trip.com is out of 10. */
  rating: z.number().min(0).max(10).optional(),
  /**
   * True when the quote is the platform's machine translation of a review
   * written in another language, which on this mountain is most of them. The
   * page has to say so: a translated sentence is not the words the guest wrote.
   */
  translated: z.boolean().default(false),
  /** Deep link back to the property's reviews on the source platform. */
  sourceUrl: z.url(),
});

const stays = defineCollection({
  loader: glob({ base: './src/content/stays', pattern: '**/*.md' }),
  schema: z.object({
    /** Trip.com hotelId. Must match the seed row and the affiliate URL. */
    id: z.number(),
    name: z.string().min(2),
    /** {ascii-kebab-of-name, truncated 60}-{hotelId}, as generated in the seed. */
    slug: z.string(),
    city: z.string(),
    cityId: z.number(),
    tier: z.enum(['A', 'B', 'C']).default('B'),
    village: z.string().optional(),
    /** Resort, Homestay, Villa, Hotel. */
    type: z.string().optional(),
    images: z.array(stayImage).min(3),
    /** Rewritten in the site's voice from sourced facts. Never pasted. */
    description: z.string().min(200).max(900),
    /** One honest caveat. Not a disclaimer, a trade-off a reader can act on. */
    note: z.string().min(20).max(400),
    comments: z.array(stayComment).length(3),
    /**
     * The source platform's aggregate, shown attributed and linked. It is not
     * emitted as structured data: see stayJsonLd in src/lib/stays.ts.
     */
    rating: z
      .object({
        score: z.number().min(0),
        count: z.number().int(),
        /** Trip.com scores out of 10. Stored, not normalised, so the page can
            print what the source actually said. */
        scale: z.number().default(10),
      })
      .optional(),
    affiliate: z.object({ goSlug: z.string(), url: z.url() }),
    seo: z.object({ title: z.string().max(60), metaDescription: z.string().max(160) }),
    status: z.enum(['draft', 'published']).default('draft'),
    /** ISO timestamp of the capture the entry was built from. */
    sourcedAt: z.string(),
  }),
});

export const collections = { guide, stays };
