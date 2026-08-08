#!/usr/bin/env node
// Re-encode every captured property image from the originals on disk.
//
//   npm run stays:img
//   npm run stays:img -- --dry
//
// Nothing is re-downloaded. scripts/collect-stays.mjs keeps the original bytes
// in assets/raw/stays/{hotelId}/, which is gitignored, and this rebuilds
// public/images/stays/{hotelId}/ from them. Run it after changing the size or
// quality budget, or on any capture taken before that budget existed.
//
// Why it exists at all: the CDN hands over frames up to 1600 pixels wide, and
// shipping those cost about 125 KB an image. A listing card renders the lead at
// roughly 320 CSS pixels and the two thumbnails at about 107, so across 809
// properties that was very nearly 300 MB committed to the repository for detail
// no reader can see. At the budgets in collect-stays.mjs the same set is about
// a fifth of that.

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { IMAGE_SPECS, encodeToBudget } from './collect-stays.mjs';

const SRC_DIR = 'assets/raw/stays';
const OUT_DIR = 'public/images/stays';
const DRY = process.argv.includes('--dry');

const fmt = (bytes) =>
  bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const dirs = (await readdir(SRC_DIR).catch(() => [])).sort();
if (!dirs.length) {
  console.log(`Nothing in ${SRC_DIR}. Originals are only kept by a capture run on this machine.`);
  process.exit(0);
}

let before = 0;
let after = 0;
let written = 0;
let dropped = 0;

for (const id of dirs) {
  const files = (await readdir(path.join(SRC_DIR, id)))
    .filter((file) => file.endsWith('.bin'))
    // 1.bin, 2.bin, 3.bin: numeric order, so the lead stays the lead.
    .sort((a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10));

  if (!files.length) continue;
  await mkdir(path.join(OUT_DIR, id), { recursive: true });

  let index = 0;
  for (const file of files) {
    const buffer = await readFile(path.join(SRC_DIR, id, file));
    const spec = index === 0 ? IMAGE_SPECS.LEAD : IMAGE_SPECS.THUMB;
    const encoded = await encodeToBudget(buffer, spec);

    if (!encoded) {
      console.log(`drop  ${id}/${file}  will not fit ${spec.maxKb} KB`);
      dropped += 1;
      continue;
    }

    const out = path.join(OUT_DIR, id, `${index + 1}.webp`);
    const existing = await stat(out).then(
      (s) => s.size,
      () => 0,
    );
    before += existing;
    after += encoded.length;

    if (!DRY) await writeFile(out, encoded);
    written += 1;
    index += 1;
  }
}

console.log(
  `\n${written} images${DRY ? ' (dry run, nothing written)' : ''}` +
    `${dropped ? `, ${dropped} dropped` : ''}`,
);
console.log(`  was  ${fmt(before)}`);
console.log(`  now  ${fmt(after)}`);
if (before > after) {
  console.log(`  saved ${fmt(before - after)}, ${Math.round((1 - after / before) * 100)} percent`);
}
