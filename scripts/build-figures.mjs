#!/usr/bin/env node
// Generate, optimize and wire the body figures for guide articles.
//
//   node scripts/build-figures.mjs <spec.json> [--only slug,slug] [--generate] [--wire] [--dry]
//
// Every guide page ships with a lead image plus at least three inline captioned
// figures (see CLAUDE.md). Doing that by hand across ~58 articles is 200 API
// calls, 200 re-encodes and 200 markdown edits, so the whole loop is driven off
// one declarative spec instead.
//
// Spec shape, one entry per article:
//
//   {
//     "slug": "moganshan-bamboo-forest",          // filename in src/content/guide
//     "hero": { "prompt": "...", "alt": "..." },  // optional; only for pages with no frontmatter image
//     "figures": [
//       {
//         "after": "## What moso bamboo is",      // exact heading line in the markdown
//         "prompt": "...",
//         "alt": "...",
//         "caption": "..."
//       }
//     ]
//   }
//
// Image files are named <slug>-lead.png / <slug>-2.png, <slug>-3.png,
// <slug>-4.png. Raw PNG lands in assets/raw/guide, the committed webp in
// public/images/guide. Anything already present on disk is skipped, so a rerun
// after a failure costs nothing and the script is safe to interrupt.
//
// Placement: the figure goes after the first paragraph of its section, not
// directly under the heading. A heading followed immediately by an image reads
// as a caption for the heading; a heading, its opening paragraph, then the
// image reads as an illustration of what was just said.

// .env.local first: that is where the OpenAI key lives on this project, and
// dotenv does not overwrite a variable it has already set.
import { config } from 'dotenv';
config({ path: '.env.local' });
config();

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';
const MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2';

const RAW_DIR = 'assets/raw/guide';
const OUT_DIR = 'public/images/guide';
const CONTENT_DIR = 'src/content/guide';

// Concurrency against the images endpoint. A single high-quality generation
// takes two to three minutes, so this is what decides whether a 174-image run
// takes one hour or four. Six is comfortable; the retry below absorbs the
// occasional 429 rather than the pool being tuned down to avoid one.
const CONCURRENCY = Number(process.env.FIGURE_CONCURRENCY) || 6;

// One house style, appended to every prompt. Consistency across 174 images is
// the whole difference between an illustrated guide and a stock-photo dump: the
// same lens, the same light, the same restraint on every page.
//
// Deliberately technique only. An earlier version named the palette by its
// subjects ("bamboo green, wet grey stone, tea green") and the model read that
// as the brief: a prompt for a writer's desk came back as a temple in a bamboo
// grove. Style instructions describe how the picture is taken, never what is
// in it, and the closing line pins the subject back to the prompt above.
const HOUSE_STYLE =
  'Editorial travel photography, shot on a full frame camera with a fast prime lens, ' +
  'shallow depth of field. Natural available light only, no flash, no HDR, no heavy ' +
  'saturation. Desaturated, restrained colour. Documentary realism, unstaged, quiet. ' +
  // Faces: an identifiable person who is clearly an invented likeness is a
  // different problem from a wrong building, and it recurs whenever a prompt
  // puts a person in an interior. People appear from behind, in profile, or at
  // a distance, or not at all.
  'Any people are seen from behind, in profile or far from the camera; never a ' +
  'recognisable face, never anyone looking at or posing for the camera. ' +
  'No text of any kind, no lettering, no signage, no watermark, no logo, no borders, ' +
  'no collage, no split frames. ' +
  // The single most common failure across the first 174: a logistics or
  // interior prompt with no landscape cue drifts to rural France, an Italian
  // hillside or a Himalayan hill town. Naming the region every time fixes it.
  'The setting is Zhejiang province, eastern China: Chinese vernacular architecture, ' +
  'Chinese vehicles and signage shapes, moso bamboo, whitewashed walls and grey tiled ' +
  'roofs. Never European, Mediterranean, Alpine, Himalayan or North American. ' +
  'Photograph exactly the scene described above and nothing else; do not substitute ' +
  'a more picturesque subject.';

const args = process.argv.slice(2);
const specPath = args.find((a) => !a.startsWith('--'));
const flag = (name) => args.includes(`--${name}`);
const flagValue = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? null : args[i + 1];
};

if (!specPath) {
  console.error('Usage: node scripts/build-figures.mjs <spec.json> [--only slug,slug] [--generate] [--wire] [--dry]');
  process.exit(1);
}

// Neither flag given means do both: generating without wiring leaves orphan
// files, wiring without generating leaves broken images.
const doGenerate = flag('generate') || !flag('wire');
const doWire = flag('wire') || !flag('generate');
const dry = flag('dry');

const exists = (p) =>
  access(p).then(
    () => true,
    () => false,
  );

/** Slot descriptors for one article: what to generate and where it goes. */
function slotsFor(entry) {
  const slots = [];
  if (entry.hero) {
    slots.push({
      name: `${entry.slug}-lead`,
      // 16:9 for the lead, which sits full width above the contents rail, and
      // 3:2 for body figures, which sit in the text column.
      size: '1536x1024',
      crop: { width: 1600, height: 900 },
      prompt: entry.hero.prompt,
    });
  }
  entry.figures.forEach((figure, index) => {
    slots.push({
      name: `${entry.slug}-${index + 2}`,
      size: '1536x1024',
      crop: { width: 1200, height: 800 },
      prompt: figure.prompt,
    });
  });
  return slots;
}

async function generateOne(slot) {
  const rawPath = path.join(RAW_DIR, `${slot.name}.png`);
  const webpPath = path.join(OUT_DIR, `${slot.name}.webp`);

  if (await exists(webpPath)) return { name: slot.name, skipped: true, cost: 0 };

  const prompt = `${slot.prompt}\n\n${HOUSE_STYLE}`;
  if (dry) {
    console.log(`[dry] would generate ${slot.name}`);
    return { name: slot.name, skipped: true, cost: 0 };
  }

  let body;
  // Four attempts with a widening wait: the endpoint occasionally 500s or times
  // out on a long prompt, and at this concurrency a 429 is expected rather than
  // exceptional. Losing an otherwise good run to either is not worth it.
  const ATTEMPTS = 4;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: MODEL, prompt, size: slot.size, quality: 'high', n: 1 }),
    });
    body = await res.json();
    if (res.ok && !body.error) break;
    if (attempt === ATTEMPTS - 1) throw new Error(`${slot.name}: ${body.error?.message ?? `HTTP ${res.status}`}`);
    await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
  }

  const b64 = body.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${slot.name}: no image in response`);
  const buffer = Buffer.from(b64, 'base64');

  await mkdir(RAW_DIR, { recursive: true });
  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(rawPath, buffer);

  // Re-encoded here rather than at request time: Vercel image optimization is
  // off on this site, so what is committed is exactly what a reader downloads.
  await sharp(buffer)
    .resize(slot.crop.width, slot.crop.height, { fit: 'cover', position: 'centre' })
    .webp({ quality: 74 })
    .toFile(webpPath);

  const usage = body.usage ?? {};
  // gpt-image-2 output tokens are billed at $30/M; input text is negligible.
  const cost = ((usage.output_tokens ?? 0) / 1e6) * 30;
  return { name: slot.name, skipped: false, cost };
}

/**
 * Insert one figure into the markdown after the first paragraph of its section.
 *
 * Anchors are matched on the exact heading line so a spec that drifts from the
 * article fails loudly here instead of silently dropping the image into the
 * wrong section.
 */
function insertFigure(lines, figure, src) {
  const markdown = `![${figure.alt}](${src} '${figure.caption.replace(/'/g, '’')}')`;
  if (lines.some((line) => line.includes(src))) return { lines, inserted: false, reason: 'already present' };

  const anchor = lines.findIndex((line) => line.trim() === figure.after.trim());
  if (anchor === -1) return { lines, inserted: false, reason: `anchor not found: ${figure.after}` };

  let i = anchor + 1;
  while (i < lines.length && lines[i].trim() === '') i++; // to the opening paragraph
  while (i < lines.length && lines[i].trim() !== '') i++; // past it

  const next = [...lines.slice(0, i), '', markdown, ...lines.slice(i)];
  return { lines: next, inserted: true };
}

async function wireOne(entry) {
  const file = path.join(CONTENT_DIR, `${entry.slug}.md`);
  const source = await readFile(file, 'utf8');
  let lines = source.split(/\r?\n/);
  const notes = [];

  if (entry.hero) {
    // The lead is frontmatter, not body markdown: the layout renders it above
    // the contents rail, and the same fields feed every listing card.
    const src = `/images/guide/${entry.slug}-lead.webp`;
    const end = lines.indexOf('---', 1);
    const hasImage = lines.slice(0, end).some((line) => line.startsWith('image:'));
    if (!hasImage) {
      const wordCount = lines.findIndex((line) => line.startsWith('word_count:'));
      const at = wordCount !== -1 ? wordCount : end;
      lines = [
        ...lines.slice(0, at),
        `image: ${src}`,
        `image_alt: ${entry.hero.alt}`,
        ...lines.slice(at),
      ];
      notes.push('lead added');
    }
  }

  // Bottom up, so an earlier insertion never shifts a later anchor.
  for (let i = entry.figures.length - 1; i >= 0; i--) {
    const src = `/images/guide/${entry.slug}-${i + 2}.webp`;
    const result = insertFigure(lines, entry.figures[i], src);
    lines = result.lines;
    if (!result.inserted && result.reason !== 'already present') notes.push(`SKIPPED ${result.reason}`);
  }

  const next = lines.join('\n');
  if (next !== source && !dry) await writeFile(file, next, 'utf8');
  return notes;
}

async function runPool(items, worker) {
  const results = [];
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (cursor < items.length) {
        const item = items[cursor++];
        try {
          const result = await worker(item);
          results.push(result);
          if (!result.skipped) console.log(`  ✓ ${result.name}`);
        } catch (error) {
          console.error(`  ✗ ${error.message}`);
          results.push({ name: item.name, failed: true, cost: 0 });
        }
      }
    }),
  );
  return results;
}

const spec = JSON.parse(await readFile(specPath, 'utf8'));
const only = flagValue('only')?.split(',').map((s) => s.trim());
const entries = only ? spec.filter((entry) => only.includes(entry.slug)) : spec;

if (doGenerate) {
  const slots = entries.flatMap(slotsFor);
  console.log(`Generating up to ${slots.length} images (existing files are skipped)…`);
  const results = await runPool(slots, generateOne);
  const made = results.filter((r) => !r.skipped && !r.failed).length;
  const failed = results.filter((r) => r.failed).length;
  const cost = results.reduce((sum, r) => sum + (r.cost ?? 0), 0);
  console.log(`\n${made} generated, ${results.length - made - failed} skipped, ${failed} failed. Est. $${cost.toFixed(2)}`);
  // Wiring markdown to files that were never written would ship broken images,
  // so a failed generation stops the run here rather than half completing it.
  if (failed) {
    console.error('Generation failed; not wiring. Fix and rerun, existing images are kept.');
    process.exit(1);
  }
}

if (doWire) {
  console.log(`\nWiring ${entries.length} articles…`);
  for (const entry of entries) {
    const notes = await wireOne(entry);
    if (notes.length) console.log(`  ${entry.slug}: ${notes.join('; ')}`);
  }
  console.log('Done.');
}
