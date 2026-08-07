#!/usr/bin/env node
// Audit every shipped image under public/ and fail on anything unoptimized.
//
//   node scripts/audit-images.mjs [--max-kb 260] [--max-width 2000]
//
// This site turns off Vercel image optimization, so whatever is committed is
// byte for byte what a reader downloads. That makes "is it optimized" a
// question with an answer, and this is where the answer is checked. Run it
// before a push.
//
// Flags:
//   - a raster that is not webp and has no webp sibling (a jpg or png shipping
//     on its own is a missing format, not a fallback)
//   - anything wider than --max-width, which no slot on this site can use
//   - anything over --max-kb, which on a 1200px webp means the quality setting
//     was never applied
//
// A jpg or png that sits next to a webp of the same name is a <picture>
// fallback and is allowed, but still has to pass the size and width checks.

import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};

const MAX_KB = value('max-kb', 260);
const MAX_WIDTH = value('max-width', 2000);
const ROOT = 'public';
const RASTER = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

// PNG on purpose, and converting any of them would break something. Favicons
// and PWA icons are referenced by manifests that name the format; the OG image
// is fetched by social platforms that do not all decode webp; the brand lockups
// are downloads for the trade, where a PNG with alpha is the useful file. They
// still have to pass the width and weight checks below.
const PNG_BY_DESIGN = [/^public[\\/]brand[\\/]/, /^public[\\/](icon|apple-touch-icon|og-image)/];
const isPngByDesign = (file) => PNG_BY_DESIGN.some((pattern) => pattern.test(file));

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (RASTER.has(path.extname(entry.name).toLowerCase())) out.push(full);
  }
  return out;
}

const files = (await walk(ROOT)).sort();
const webpStems = new Set(
  files.filter((f) => f.endsWith('.webp')).map((f) => f.slice(0, -'.webp'.length)),
);

const problems = [];
let totalBytes = 0;

for (const file of files) {
  const { size } = await stat(file);
  totalBytes += size;
  const kb = size / 1024;
  const ext = path.extname(file).toLowerCase();
  const stem = file.slice(0, -ext.length);

  let width = 0;
  let height = 0;
  try {
    ({ width = 0, height = 0 } = await sharp(file).metadata());
  } catch {
    problems.push(`${file}: unreadable, not a valid image`);
    continue;
  }

  if (ext !== '.webp' && ext !== '.avif' && !webpStems.has(stem) && !isPngByDesign(file)) {
    problems.push(`${file}: ${ext} with no .webp sibling`);
  }
  if (width > MAX_WIDTH) {
    problems.push(`${file}: ${width}px wide, over the ${MAX_WIDTH}px cap`);
  }
  if (kb > MAX_KB) {
    problems.push(`${file}: ${kb.toFixed(0)} KB, over the ${MAX_KB} KB cap (${width}x${height})`);
  }
}

console.log(`${files.length} images under ${ROOT}/, ${(totalBytes / 1024 / 1024).toFixed(1)} MB total`);

if (problems.length === 0) {
  console.log('All optimized: webp everywhere, within the width and weight caps.');
} else {
  console.log(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const problem of problems) console.log(`  ${problem}`);
  process.exitCode = 1;
}
