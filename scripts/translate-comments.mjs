#!/usr/bin/env node
// Move Chinese guest reviews in and out of the raw captures for translation.
//
//   npm run stays:translate -- --extract   writes the untranslated quotes out
//   npm run stays:translate -- --apply     reads the translations back in
//   npm run stays:translate -- --report    what is done and what is left
//
// Most reviews on this mountain were written in Chinese. A card that quotes one
// untranslated shows an English speaking reader a block they cannot read, so
// every quote a card can reach has to exist in English.
//
// The work file is data/translations/pending.json, a flat map of
// "<propertyId>:<commentIndex>" to the original text. Fill in the English and
// run --apply; it writes `quoteEn` onto the comment and leaves `quote` exactly
// as captured. Nothing here deletes an original: the Chinese stays in the
// record next to the English, which is what makes the translation checkable.
//
// Only properties with no English review at all are extracted. Where a guest
// wrote in English the card quotes them directly and no translation is
// involved, which is the better outcome and covers 434 of the 809.

import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const RAW_DIR = path.join(process.cwd(), 'data', 'raw');
const WORK_DIR = path.join(process.cwd(), 'data', 'translations');
const PENDING = path.join(WORK_DIR, 'pending.json');
const DONE = path.join(WORK_DIR, 'translated.json');

// Han, plus kana, because a handful of reviews come through with Japanese
// characters in them and they are no more readable here than Chinese.
const CJK = /[㐀-鿿豈-﫿぀-ヿ]/;

async function loadRecords() {
  const files = (await readdir(RAW_DIR)).filter((f) => f.endsWith('.json'));
  const records = [];
  for (const file of files) {
    records.push({ file, data: JSON.parse(await readFile(path.join(RAW_DIR, file), 'utf8')) });
  }
  return records;
}

/** The comment a card would reach, and whether it needs a translation. */
function cardCandidates(record) {
  const comments = record.comments ?? [];
  if (comments.some((c) => !CJK.test(c.quote))) return [];
  // No English review anywhere on this property. The first Chinese one is what
  // the card will fall back to, so that is the one that has to be translated.
  const index = comments.findIndex((c) => CJK.test(c.quote));
  if (index === -1) return [];
  if (comments[index].quoteEn && !CJK.test(comments[index].quoteEn)) return [];
  return [{ index, quote: comments[index].quote }];
}

async function extract() {
  const records = await loadRecords();
  const pending = {};
  for (const { data } of records) {
    for (const candidate of cardCandidates(data)) {
      pending[`${data.id}:${candidate.index}`] = candidate.quote;
    }
  }
  if (!existsSync(WORK_DIR)) await mkdir(WORK_DIR, { recursive: true });
  await writeFile(PENDING, `${JSON.stringify(pending, null, 2)}\n`);
  const chars = Object.values(pending).reduce((sum, q) => sum + q.length, 0);
  console.log(
    `${Object.keys(pending).length} quotes need English, ${chars.toLocaleString('en-GB')} characters. Written to ${path.relative(process.cwd(), PENDING)}.`,
  );
}

async function apply() {
  if (!existsSync(DONE)) {
    console.error(`No ${path.relative(process.cwd(), DONE)}. Put the English in there first.`);
    process.exit(2);
  }
  const translations = JSON.parse(await readFile(DONE, 'utf8'));
  const records = await loadRecords();
  let written = 0;
  let skipped = 0;

  for (const { file, data } of records) {
    let touched = false;
    (data.comments ?? []).forEach((comment, index) => {
      const english = translations[`${data.id}:${index}`];
      if (!english) return;
      if (CJK.test(english)) {
        skipped += 1;
        return;
      }
      if (comment.quoteEn === english) return;
      comment.quoteEn = english;
      comment.translated = true;
      touched = true;
      written += 1;
    });
    if (touched) {
      await writeFile(path.join(RAW_DIR, file), `${JSON.stringify(data, null, 2)}\n`);
    }
  }

  console.log(`${written} translations applied.${skipped ? ` ${skipped} still had Chinese in them and were left out.` : ''}`);
}

async function report() {
  const records = await loadRecords();
  let english = 0;
  let translated = 0;
  let stillChinese = 0;
  let none = 0;

  for (const { data } of records) {
    const comments = data.comments ?? [];
    if (!comments.length) {
      none += 1;
    } else if (comments.some((c) => !CJK.test(c.quote))) {
      english += 1;
    } else if (comments.some((c) => c.quoteEn && !CJK.test(c.quoteEn))) {
      translated += 1;
    } else {
      stillChinese += 1;
    }
  }

  console.log('Card quotes');
  console.log('-----------');
  console.log(`  written in English   ${english}`);
  console.log(`  translated           ${translated}`);
  console.log(`  still Chinese only   ${stillChinese}`);
  console.log(`  no review at all     ${none}`);
}

const mode = process.argv.find((a) => ['--extract', '--apply', '--report'].includes(a));
if (mode === '--extract') await extract();
else if (mode === '--apply') await apply();
else if (mode === '--report') await report();
else {
  console.error('Usage: npm run stays:translate -- --extract | --apply | --report');
  process.exit(2);
}
