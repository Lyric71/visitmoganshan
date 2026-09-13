#!/usr/bin/env node
// Remove one live news item, preserve an archival copy, and deploy the change.
//
//   node editorial/scripts/news-unpublish.mjs <slug>

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { splitFrontmatter } from './news-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const CONTENT = path.join(ROOT, 'src', 'content', 'news');
const ARCHIVE = path.join(ROOT, 'editorial', 'news', 'unpublished');
const SEEN = path.join(ROOT, 'editorial', 'news', 'seen.json');
const RUNS = path.join(ROOT, 'editorial', 'news', 'runs.json');
const slug = process.argv[2];

if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
  console.error('Usage: node editorial/scripts/news-unpublish.mjs <slug>');
  process.exit(2);
}

const matches = existsSync(CONTENT)
  ? readdirSync(CONTENT).filter((file) => {
      if (!file.endsWith('.md')) return false;
      const base = file.replace(/\.md$/, '');
      return base === slug || base.replace(/^\d{4}-\d{2}-\d{2}-/, '') === slug;
    })
  : [];
if (matches.length !== 1) {
  console.error(matches.length ? `More than one live news item matches "${slug}".` : `No live news item matches "${slug}".`);
  process.exit(1);
}

const file = matches[0];
const source = path.join(CONTENT, file);
const { data } = splitFrontmatter(readFileSync(source, 'utf8'), parseYaml);
mkdirSync(ARCHIVE, { recursive: true });
copyFileSync(source, path.join(ARCHIVE, file));
unlinkSync(source);

if (existsSync(SEEN)) {
  const seen = JSON.parse(readFileSync(SEEN, 'utf8'));
  const key = data.origin?.url_hash;
  if (key && seen.items?.[key]) {
    seen.items[key].status = 'unpublished';
    seen.items[key].reason = 'unpublished by admin';
    writeFileSync(SEEN, `${JSON.stringify(seen, null, 2)}\n`, 'utf8');
  }
}

const runs = existsSync(RUNS) ? JSON.parse(readFileSync(RUNS, 'utf8')) : { runs: [] };
runs.runs.push({ kind: 'unpublish', started: new Date().toISOString(), finished: new Date().toISOString(), outcome: 'success', slugs: [file.replace(/\.md$/, '')] });
runs.runs = runs.runs.slice(-90);
writeFileSync(RUNS, `${JSON.stringify(runs, null, 2)}\n`, 'utf8');

const git = (...args) => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
const staged = [
  path.join('src', 'content', 'news', file),
  path.join('editorial', 'news', 'unpublished', file),
  path.join('editorial', 'news', 'seen.json'),
  path.join('editorial', 'news', 'runs.json'),
];
const added = git('add', '--', ...staged);
if (added.status !== 0) {
  console.error(added.stderr || 'Could not stage the unpublish change.');
  process.exit(1);
}
const commit = git('commit', '-m', `revert(news): unpublish ${file.replace(/\.md$/, '')}`);
if (commit.status !== 0) {
  console.error(commit.stderr || commit.stdout || 'Could not commit the unpublish change.');
  process.exit(1);
}
const branch = git('branch', '--show-current').stdout.trim() || 'main';
const pushed = git('push', 'origin', branch);
if (pushed.status !== 0) {
  console.error(pushed.stderr || pushed.stdout || 'Unpublish committed locally, but push failed.');
  process.exit(1);
}
console.log(`Unpublished ${file}. The archival copy is in editorial/news/unpublished.`);
