#!/usr/bin/env node
// Tile generated figures into a contact sheet for review.
//
//   node scripts/contact-sheet.mjs <out.png> <image...>
//
// The imagery rule in CLAUDE.md says never ship an unverified image, and a run
// of 174 generations makes opening them one at a time impractical. Twelve to a
// sheet is enough to catch the two failures that matter: a model that ignored
// the brief and photographed something else, and burned-in lettering.

import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const [out, ...files] = process.argv.slice(2);
if (!out || files.length === 0) {
  console.error('Usage: node scripts/contact-sheet.mjs <out.png> <image...>');
  process.exit(1);
}

const COLS = 3;
const CELL_W = 640;
const CELL_H = 427;
const GAP = 8;

const rows = Math.ceil(files.length / COLS);
const width = COLS * CELL_W + (COLS + 1) * GAP;
const height = rows * CELL_H + (rows + 1) * GAP;

const composites = await Promise.all(
  files.map(async (file, index) => ({
    input: await sharp(file).resize(CELL_W, CELL_H, { fit: 'cover' }).png().toBuffer(),
    left: GAP + (index % COLS) * (CELL_W + GAP),
    top: GAP + Math.floor(index / COLS) * (CELL_H + GAP),
  })),
);

await sharp({
  create: { width, height, channels: 3, background: { r: 20, g: 22, b: 20 } },
})
  .composite(composites)
  .png()
  .toFile(out);

console.log(`${out}  ${files.length} images, ${COLS}x${rows}`);
files.forEach((file, i) => console.log(`  ${i + 1}. ${path.basename(file, '.webp')}`));
