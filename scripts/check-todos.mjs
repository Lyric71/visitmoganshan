#!/usr/bin/env node
// Refuse to ship published content that still carries a TODO.
//
//   node scripts/check-todos.mjs
//
// A publishing job closes every item it finds inside the run: it researches
// the fact or cuts the claim, fixes the page it contradicts, amends the brief,
// creates the slug or applies the settled fallback, and files a future watch
// item under editorial/sources/source-tiers.md. Nothing is left for a person
// and nothing reaches a reader as a marker. This is the gate behind that rule:
// the pre-push hook, the guide publish step and news-publish.mjs all run it.
//
// It reads the content collections only. Code comments in src/ are not
// published content and are not checked here.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const DIRS = ['src/content/guide', 'src/content/news', 'src/content/stays'];
const MARKER = /\b(TODO|FIXME|TBD|XXX)\b/;

function* walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (/\.(md|mdx|json|ya?ml)$/.test(name)) yield full;
  }
}

const hits = [];
for (const dir of DIRS) {
  for (const file of walk(dir)) {
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .forEach((line, i) => {
        if (MARKER.test(line)) hits.push(`${file.replace(/\\/g, '/')}:${i + 1}: ${line.trim().slice(0, 140)}`);
      });
  }
}

if (hits.length) {
  console.error(`check-todos: ${hits.length} open marker(s) in published content.\n`);
  for (const h of hits) console.error(`  ${h}`);
  console.error(
    '\nClose each one in this run: source the fact or cut the claim. A publishing job never ships a TODO.',
  );
  process.exit(1);
}
console.log('check-todos: no TODO, FIXME, TBD or XXX in published content.');
