#!/usr/bin/env node
// Refuse to ship a changed article whose `last_updated` did not move.
//
//   node scripts/check-dates.mjs [--base <ref>]
//
// Every guide page prints "Updated <date>" in its byline and writes the same
// date into dateModified. That is only worth anything if the date is honest,
// and a date typed by hand drifts the first time somebody edits a paragraph
// and forgets it. So this compares each guide file against a base commit and
// fails when the body changed and the date did not.
//
// The base is, in order: --base if given, the branch's upstream, origin/main.
// The pre-push hook runs it with no argument, which for a normal push means
// "everything since what the remote already has". Run it by hand before a
// commit and it compares the working tree against the same base.
//
// Three more rules ride along because they are cheap and the same failure
// class: `published` must exist, `last_updated` must not precede it, and
// neither may be in the future.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const DIR = 'src/content/guide';
const args = process.argv.slice(2);
const baseIndex = args.indexOf('--base');

const git = (...cmd) => {
  try {
    return execFileSync('git', cmd, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
};

function resolveBase() {
  if (baseIndex !== -1 && args[baseIndex + 1]) return args[baseIndex + 1];
  const upstream = git('rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{upstream}');
  if (upstream) return upstream;
  if (git('rev-parse', '--verify', 'origin/main')) return 'origin/main';
  return null;
}

function split(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!m) return { fm: '', body: text };
  return { fm: m[1], body: text.slice(m[0].length) };
}

const field = (fm, key) => {
  const m = new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm').exec(fm);
  return m ? m[1].replace(/^["']|["']$/g, '') : null;
};

// Whitespace and line endings are not edits.
const normalise = (body) =>
  body
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trim();

const base = resolveBase();
const today = new Date().toISOString().slice(0, 10);
const problems = [];

const changed = base
  ? (git('diff', '--name-only', base, '--', DIR) ?? '').split('\n').filter(Boolean)
  : [];

// Content rules run on every file; the "did the date move" rule only on the
// ones that differ from the base.
const all = (git('ls-files', '--', DIR) ?? '').split('\n').filter((f) => f.endsWith('.md'));

for (const file of all) {
  if (!existsSync(file)) continue;
  const { fm } = split(readFileSync(file, 'utf8'));
  const published = field(fm, 'published');
  const updated = field(fm, 'last_updated');
  if (!published) problems.push(`${file}: no published date`);
  if (!updated) problems.push(`${file}: no last_updated date`);
  if (published && updated && updated < published)
    problems.push(`${file}: last_updated ${updated} is before published ${published}`);
  if (published && published > today)
    problems.push(`${file}: published ${published} is in the future`);
  if (updated && updated > today)
    problems.push(`${file}: last_updated ${updated} is in the future`);
}

for (const file of changed) {
  if (!file.endsWith('.md') || !existsSync(file)) continue;
  const before = git('show', `${base}:${file}`);
  if (before === null) continue; // new file: published is its own date check
  const old = split(before);
  const now = split(readFileSync(file, 'utf8'));

  const oldPublished = field(old.fm, 'published');
  const newPublished = field(now.fm, 'published');
  if (oldPublished && newPublished && oldPublished !== newPublished)
    problems.push(
      `${file}: published moved from ${oldPublished} to ${newPublished}; it is set once`,
    );

  if (normalise(old.body) !== normalise(now.body)) {
    const oldUpdated = field(old.fm, 'last_updated');
    const newUpdated = field(now.fm, 'last_updated');
    if (oldUpdated === newUpdated)
      problems.push(`${file}: body changed but last_updated is still ${newUpdated}`);
  }
}

if (problems.length) {
  console.error('Date check failed:\n');
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    '\nSet last_updated to today on every article whose text changed. published never moves.',
  );
  process.exit(1);
}

console.log(
  base
    ? `Dates OK: ${all.length} articles checked, ${changed.length} changed since ${base}.`
    : `Dates OK: ${all.length} articles checked (no base ref found, change detection skipped).`,
);
