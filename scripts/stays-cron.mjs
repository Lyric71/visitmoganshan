#!/usr/bin/env node
// The unattended stays pass. One run does, in order, what the stays-updater
// agent does by hand: discover, collect, re encode, validate, audit. It stops
// at the first step that fails (one exception, noted in main), and every line of output goes to a dated
// log so a run nobody watched can still be read afterwards.
//
//   npm run stays:cron                 the full pass
//   npm run stays:cron -- --push       also commit and push the stays paths
//   npm run stays:cron -- --dry        discover in dry mode, then stop
//
// This is what the Windows scheduled task calls (see install-stays-task.mjs).
// It never commits unless asked: the default leaves the changes in the working
// tree for a person to review, and the log ends with what is there.
//
// Manners are inherited from the scripts it calls. Concurrency stays at two,
// the jitter stays in, and a failure is logged rather than retried.

import { spawnSync } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOG_DIR = path.join(ROOT, 'data', 'logs');
const PUSH = process.argv.includes('--push');
const DRY = process.argv.includes('--dry');

mkdirSync(LOG_DIR, { recursive: true });
const stamp = new Date().toISOString();
const LOG = path.join(LOG_DIR, `stays-cron-${stamp.slice(0, 10)}.log`);

function log(line) {
  const text = `[${new Date().toISOString()}] ${line}`;
  console.log(text);
  appendFileSync(LOG, text + '\n');
}

/** Run one script with node, copy its output into the log, return the code. */
function run(label, args) {
  log(`== ${label}: node ${args.join(' ')}`);
  const result = spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, FORCE_COLOR: '0' },
  });
  for (const stream of ['stdout', 'stderr']) {
    const text = result[stream];
    if (text && text.trim()) appendFileSync(LOG, text.endsWith('\n') ? text : text + '\n');
  }
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const code = result.status ?? 1;
  log(`== ${label}: exit ${code}`);
  return { code, output: `${result.stdout ?? ''}${result.stderr ?? ''}` };
}

function git(args) {
  const result = spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });
  return {
    code: result.status ?? 1,
    out: (result.stdout ?? '').trim(),
    err: (result.stderr ?? '').trim(),
  };
}

const STAYS_PATHS = ['data/seed', 'data/raw', 'data/failed.json', 'public/images/stays'];

function main() {
  log(`stays pass started (${DRY ? 'dry' : 'full'}${PUSH ? ', push' : ''})`);

  // Discovery refusing to run because robots.txt disallows the listing path
  // is a policy stop, not a fault, and it says nothing about the rows already
  // in the list that still lack a capture. So that one refusal is logged and
  // the pass carries on; any other failure, in any step, ends the run.
  const ROBOTS_STOP = /robots\.txt disallows/;
  const steps = DRY
    ? [['discover (dry)', ['scripts/discover-stays.mjs', '--dry'], ROBOTS_STOP]]
    : [
        ['discover', ['scripts/discover-stays.mjs'], ROBOTS_STOP],
        ['collect', ['scripts/collect-stays.mjs']],
        ['re encode', ['scripts/optimize-stay-images.mjs']],
        ['validate', ['scripts/validate-stays.mjs']],
        ['image audit', ['scripts/audit-images.mjs']],
      ];

  for (const [label, args, skipOn] of steps) {
    const { code, output } = run(label, args);
    if (code === 0) continue;
    if (skipOn && skipOn.test(output)) {
      log(`"${label}" declined to run (robots.txt). Skipped; the pass continues.`);
      continue;
    }
    log(`stopped at "${label}". Nothing after it ran. Log: ${LOG}`);
    process.exit(code);
  }

  if (DRY) {
    log('dry run finished.');
    return;
  }

  const status = git(['status', '--porcelain', '--', ...STAYS_PATHS]);
  const changed = status.out ? status.out.split('\n').length : 0;
  if (changed === 0) {
    log('nothing new. The working tree is unchanged.');
    return;
  }
  log(`${changed} changed path(s) under the stays data.`);

  if (!PUSH) {
    log('left in the working tree for review. Run with --push to commit and push automatically.');
    return;
  }

  const branch = git(['branch', '--show-current']).out;
  git(['add', '--', ...STAYS_PATHS]);
  const commit = git([
    'commit',
    '-m',
    `Update stays data from the scheduled pass of ${stamp.slice(0, 10)}`,
  ]);
  if (commit.code !== 0) {
    log(`commit failed: ${commit.err || commit.out}`);
    process.exit(commit.code);
  }
  const push = git(['push', 'origin', branch]);
  if (push.code !== 0) {
    log(`push to ${branch} failed, the commit is local: ${push.err || push.out}`);
    process.exit(push.code);
  }
  log(`committed and pushed to ${branch}.`);
}

main();
