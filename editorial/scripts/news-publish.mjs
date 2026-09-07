#!/usr/bin/env node
// Publish every approved news draft whose date has arrived.
//
//   node editorial/scripts/news-publish.mjs [--dry] [--no-push] [--force] [--only <slug>]
//
// Deterministic on purpose. The guide pipeline publishes through a Claude run
// because a guide publish edits pages a person has to read; a news publish is
// a move, a set of checks, a build and a commit, and a script does that the
// same way every morning. In order, and it stops at the first failure:
//
//   1. read editorial/news/drafts, keep status: approved, published <= today
//      (--force ignores the date, --only takes one slug)
//   2. validate each draft: the frontmatter schema, the body rules, the image
//      on disk when one is named, no duplicate permalink
//   3. set published and last_updated (today unless the draft names a date
//      that has passed), strip status and origin, write into src/content/news
//   4. npm run img:audit, npm run dates:check, npm run check, npm run build.
//      This scheduled run is the explicit build request the root CLAUDE.md
//      requires; nothing else in the news layer builds.
//   5. git add the news files, the drafts folder, the ledger and the runs
//      file; commit feat(news): publish <slugs>; push origin main
//   6. mark the ledger entries published, record the run, send the email
//
// --dry does steps 1 to 2 and prints what would happen. --no-push commits and
// stops. A failure at 4 removes the copied files again so the working tree is
// clean, leaves the drafts as approved, records the run and emails the error.

import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { bodyProblems, draftFrontmatterSchema, newsFilename, newsPath, splitFrontmatter } from './news-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const NEWS = path.join(ROOT, 'editorial', 'news');
const DRAFTS = path.join(NEWS, 'drafts');
const PUBLISHED = path.join(NEWS, 'published');
const CONTENT = path.join(ROOT, 'src', 'content', 'news');
const SEEN = path.join(NEWS, 'seen.json');
const RUNS = path.join(NEWS, 'runs.json');
const IMAGES = path.join(ROOT, 'public');

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const NO_PUSH = argv.includes('--no-push');
const FORCE = argv.includes('--force');
const ONLY = argv.includes('--only') ? argv[argv.indexOf('--only') + 1] : null;
const today = new Date().toISOString().slice(0, 10);

const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
const writeJson = (file, value) => writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const log = (line) => console.log(`[${new Date().toISOString().slice(11, 19)}] ${line}`);

function run(label, command, args) {
  log(`== ${label}: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: process.platform === 'win32',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  const out = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  if (out.trim()) process.stdout.write(out.endsWith('\n') ? out : `${out}\n`);
  const code = result.status ?? 1;
  log(`== ${label}: exit ${code}`);
  return { code, out };
}

const git = (...args) => {
  const r = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  return { code: r.status ?? 1, out: (r.stdout ?? '').trim(), err: (r.stderr ?? '').trim() };
};

function recordRun(record) {
  const runs = existsSync(RUNS) ? readJson(RUNS) : { runs: [] };
  runs.runs.push(record);
  runs.runs = runs.runs.slice(-90);
  writeJson(RUNS, runs);
}

function notify(args) {
  const r = spawnSync(process.execPath, [path.join(ROOT, 'editorial', 'scripts', 'news-notify.mjs'), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
  });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
  if (out) console.log(out);
  if (r.status !== 0) log('email failed (see above); the publish itself is unaffected');
}

/* ==========================================================================
   1. Collect and validate
   ========================================================================== */

function collect() {
  if (!existsSync(DRAFTS)) return [];
  const existingPaths = new Set(
    existsSync(CONTENT)
      ? readdirSync(CONTENT)
          .filter((f) => f.endsWith('.md'))
          .map((f) => {
            const { data } = splitFrontmatter(readFileSync(path.join(CONTENT, f), 'utf8'), parseYaml);
            return newsPath(data, f.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, ''));
          })
      : [],
  );

  const picked = [];
  for (const file of readdirSync(DRAFTS).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(path.join(DRAFTS, file), 'utf8');
    const { data, body } = splitFrontmatter(text, parseYaml);
    const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    if (ONLY && slug !== ONLY && file.replace(/\.md$/, '') !== ONLY) continue;
    if (data.status !== 'approved') {
      log(`skip ${file}: status is ${data.status ?? 'pending'}`);
      continue;
    }
    const wanted = data.published ?? today;
    if (!FORCE && wanted > today) {
      log(`skip ${file}: published ${wanted} is in the future`);
      continue;
    }
    const problems = [];
    const parsed = draftFrontmatterSchema.safeParse({ ...data, published: wanted, last_updated: data.last_updated ?? wanted });
    if (!parsed.success) problems.push(...parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`));
    problems.push(...bodyProblems(body, { kind: data.kind }));
    if (data.image && !existsSync(path.join(IMAGES, data.image))) problems.push(`image ${data.image} is not on disk under public/`);
    const permalink = parsed.success ? newsPath(parsed.data, slug) : null;
    if (permalink && existingPaths.has(permalink)) problems.push(`permalink ${permalink} already exists in src/content/news`);
    if (problems.length) {
      log(`refuse ${file}:`);
      for (const p of problems) log(`  ${p}`);
      continue;
    }
    picked.push({ file, slug, data: parsed.data, body, permalink });
  }
  return picked;
}

/* ==========================================================================
   3. Write into the collection
   ========================================================================== */

function publishedFrontmatter(data) {
  const out = { ...data };
  delete out.status;
  delete out.rejection_reason;
  // Provenance stays: the ledger key lets a later run know this item is done,
  // and the original URL is what the page cites. Nothing else from the draft
  // workflow reaches the site.
  if (out.origin) out.origin = { source_id: out.origin.source_id, url: out.origin.url, url_hash: out.origin.url_hash };
  return out;
}

function writeContent(item) {
  mkdirSync(CONTENT, { recursive: true });
  const filename = newsFilename(item.data, item.slug);
  const target = path.join(CONTENT, filename);
  const fm = stringifyYaml(publishedFrontmatter(item.data), { lineWidth: 0 }).trimEnd();
  writeFileSync(target, `---\n${fm}\n---\n\n${item.body.trim()}\n`, 'utf8');
  return { filename, target };
}

/* ==========================================================================
   Main
   ========================================================================== */

function main() {
  const started = Date.now();
  const picked = collect();
  if (!picked.length) {
    log('nothing to publish: no approved draft whose date has arrived.');
    recordRun({ kind: 'publish', started: new Date(started).toISOString(), finished: new Date().toISOString(), outcome: 'skipped', skipReason: 'nothing approved' });
    return;
  }
  for (const item of picked) log(`ready: ${item.file} -> ${item.permalink}`);
  if (DRY) {
    log('[dry] stopping before any file is written.');
    return;
  }

  const written = picked.map((item) => ({ item, ...writeContent(item) }));
  const slugs = picked.map((i) => i.slug);
  const fail = (step, out) => {
    for (const w of written) if (existsSync(w.target)) unlinkSync(w.target);
    log(`stopped at "${step}". The copied files were removed; the drafts stay approved.`);
    recordRun({ kind: 'publish', started: new Date(started).toISOString(), finished: new Date().toISOString(), outcome: 'error', step, slugs, error: out.slice(-2000) });
    notify(['--mode', 'failed', '--note', `Stopped at ${step} for ${slugs.join(', ')}.\n\n${out.slice(-3000)}`]);
    process.exit(1);
  };

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  for (const [label, script] of [['image audit', 'img:audit'], ['date check', 'dates:check'], ['astro check', 'check'], ['build', 'build']]) {
    const { code, out } = run(label, npm, ['run', script]);
    if (code !== 0) fail(label, out);
  }

  // Bookkeeping before the commit so it travels in the same commit.
  mkdirSync(PUBLISHED, { recursive: true });
  for (const w of written) {
    copyFileSync(path.join(DRAFTS, w.item.file), path.join(PUBLISHED, w.item.file));
    unlinkSync(path.join(DRAFTS, w.item.file));
  }
  if (existsSync(SEEN)) {
    const seen = readJson(SEEN);
    for (const w of written) {
      const key = w.item.data.origin?.url_hash;
      if (key && seen.items?.[key]) {
        seen.items[key].status = 'published';
        seen.items[key].reason = newsPath(w.item.data, w.item.slug);
      }
    }
    writeJson(SEEN, seen);
  }
  recordRun({ kind: 'publish', started: new Date(started).toISOString(), finished: new Date().toISOString(), outcome: 'success', slugs, paths: written.map((w) => newsPath(w.item.data, w.item.slug)), durationMs: Date.now() - started });

  const branch = git('branch', '--show-current').out || 'main';
  git('add', '--', 'src/content/news', 'editorial/news', 'public/images/news');
  const message = `feat(news): publish ${slugs.join(', ')}`;
  const commit = git('commit', '-m', message);
  if (commit.code !== 0) {
    log(`commit failed: ${commit.err || commit.out}`);
    notify(['--mode', 'failed', '--note', `Checks passed but the commit failed:\n${commit.err || commit.out}`]);
    process.exit(commit.code);
  }
  const hash = git('rev-parse', '--short', 'HEAD').out;
  log(`committed ${hash}: ${message}`);
  if (NO_PUSH) {
    log('--no-push: stopping after the commit.');
    return;
  }
  const push = git('push', 'origin', branch);
  if (push.code !== 0) {
    log(`push to ${branch} failed, the commit is local: ${push.err || push.out}`);
    notify(['--mode', 'failed', '--note', `Committed ${hash} but the push failed:\n${push.err || push.out}`]);
    process.exit(push.code);
  }
  log(`pushed to ${branch}.`);
  notify(['--mode', 'published', ...slugs.flatMap((s) => ['--slug', s]), '--build', 'passed', '--note', `Commit ${hash} on ${branch}.`]);
}

main();
