#!/usr/bin/env node
// Register the stays pass as a Windows scheduled task on this machine.
//
//   npm run stays:cron:install                weekly, Sunday 03:00, review only
//   npm run stays:cron:install -- --push      same, and commit and push the result
//   npm run stays:cron:install -- --remove    delete the task
//   npm run stays:cron:install -- --status    show the task as Windows sees it
//
// The task runs scripts/stays-cron.mjs from this checkout with the node that
// is on the PATH now, as the user who installs it, and only while that user is
// logged on: the capture needs a browser and Playwright will not start one in
// a session with no desktop. If the machine is asleep or logged out at 03:00
// the task runs at the next opportunity Windows finds.
//
// Idempotent. Running it again replaces the task in place.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const TASK = 'visitmoganshan stays update';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RUNNER = path.join(ROOT, 'scripts', 'stays-cron.mjs');
const DAY = 'SUN';
const TIME = '03:00';

const argv = process.argv.slice(2);
const REMOVE = argv.includes('--remove');
const STATUS = argv.includes('--status');
const PUSH = argv.includes('--push');

if (process.platform !== 'win32') {
  console.error('This installer writes a Windows scheduled task. On another OS, add a crontab line for:');
  console.error(`  cd ${ROOT} && node scripts/stays-cron.mjs${PUSH ? ' --push' : ''}`);
  process.exit(1);
}

function schtasks(args) {
  const result = spawnSync('schtasks', args, { encoding: 'utf8' });
  const out = (result.stdout ?? '') + (result.stderr ?? '');
  return { code: result.status ?? 1, out: out.trim() };
}

if (STATUS) {
  const { code, out } = schtasks(['/query', '/tn', TASK, '/fo', 'list', '/v']);
  console.log(code === 0 ? out : `not installed (${out})`);
  process.exit(0);
}

if (REMOVE) {
  const { code, out } = schtasks(['/delete', '/tn', TASK, '/f']);
  console.log(code === 0 ? `removed: ${TASK}` : out);
  process.exit(code);
}

// cmd wraps the command so the working directory is the checkout and the
// output lands in the dated log even when the task runs with no window.
const command = `cmd /c cd /d "${ROOT}" && "${process.execPath}" "${RUNNER}"${PUSH ? ' --push' : ''}`;

const { code, out } = schtasks([
  '/create',
  '/tn', TASK,
  '/tr', command,
  '/sc', 'weekly',
  '/d', DAY,
  '/st', TIME,
  '/rl', 'LIMITED',
  '/f',
]);

if (code !== 0) {
  console.error(out);
  process.exit(code);
}
console.log(`installed: "${TASK}" every ${DAY} at ${TIME}${PUSH ? ', with push' : ', review only'}`);
console.log(`runs: ${command}`);
console.log(`logs: ${path.join(ROOT, 'data', 'logs')}`);
