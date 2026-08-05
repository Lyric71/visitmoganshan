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

export const collections = { guide };
