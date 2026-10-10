#!/usr/bin/env node
/**
 * Queue watchdog for the editorial pipeline. run-daily.ps1 calls it after
 * every draft run, including a run that found nothing to draft. It reads
 * editorial/schedule.csv and mails Cyril, through Resend, at most once a day,
 * when the pipeline stops producing:
 *
 *   - stalled: core briefs are draftable but no core piece has been drafted
 *              for --stall-days days. Until 10 October 2026 the runner only
 *              drafted a row on the evening before its publish_date, so ready
 *              briefs sat idle two evenings in three while every run exited 0
 *              with "nothing due". This catches a gate coming back, a dead
 *              task or an expired login alike.
 *   - stuck:   a finished row has sat at image_ready for --stall-days days
 *              although nothing holds it.
 *   - low:     a week or less of draftable core briefs is left (or none).
 *
 * A row is held, and neither counted as draftable nor as stuck, only when it
 * is tied to a real date: a weekly dispatch (content_type Dispatch) until its
 * publish_date, and any row whose notes say "Hold until YYYY-MM-DD" until that
 * date. Everything else is draftable whatever its publish_date, which only
 * orders the queue (editorial/CLAUDE.md, "publish_date orders the queue").
 *
 * The mail reports facts, never an open items list (editorial/CLAUDE.md,
 * "Nothing is left open").
 *
 *   node editorial/scripts/check-queue.mjs [--per-day 1] [--low-days 7]
 *        [--stall-days 2] [--to <email>] [--dry-run]
 *
 * One mail a day: the marker editorial/logs/runs/<date>-queue.txt records it.
 * Always exits 0, so it never fails the run that calls it.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

// Same sender and recipient as notify-publish.mjs (Resend testing mode
// delivers only to the account owner's address).
const DEFAULT_TO = 'cyril.drouin@outlook.com';
const FROM = 'Visit Moganshan <onboarding@resend.dev>';
const DAY = 86_400_000;

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--')
    ? process.argv[i + 1]
    : fallback;
}

/** RFC 4180 CSV: quoted fields, doubled quotes, commas and newlines inside quotes. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); rows.push(row); row = []; field = '';
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((f) => f !== ''));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.replace(/^﻿/, ''), r[i] ?? ''])));
}

const shanghaiToday = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Shanghai' });
const daysBetween = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / DAY);
const addDays = (iso, n) => new Date(Date.parse(iso) + n * DAY).toISOString().slice(0, 10);

/** The date a time bound row is held until, or null. Same rule as run-daily.ps1. */
function holdDate(r) {
  if (r.content_type === 'Dispatch') return r.publish_date;
  const m = /Hold until (\d{4}-\d{2}-\d{2})/.exec(r.notes || '');
  return m ? m[1] : null;
}

async function main() {
  loadEnv();
  const perDay = Number(arg('per-day', 1));
  const lowDays = Number(arg('low-days', 7));
  const stallDays = Number(arg('stall-days', 2));
  const dryRun = process.argv.includes('--dry-run');

  const rows = parseCsv(readFileSync(path.join('editorial', 'schedule.csv'), 'utf8'))
    .sort((a, b) => a.publish_date.localeCompare(b.publish_date) || a.brief_id.localeCompare(b.brief_id));
  const today = shanghaiToday();
  const tomorrow = addDays(today, 1);
  const core = rows.filter((r) => r.content_type !== 'Dispatch');
  const open = (r) => !['published', 'blocked', 'image_ready'].includes(r.status);
  const released = (r, limit) => { const h = holdDate(r); return !h || h <= limit; };

  const draftable = core.filter((r) => open(r) && released(r, tomorrow));
  const held = core.filter((r) => open(r) && !released(r, tomorrow));
  const blocked = rows.filter((r) => r.status === 'blocked');
  const lastDrafted = core.map((r) => r.drafted_on).filter(Boolean).sort().pop() || '';
  const idle = lastDrafted ? daysBetween(lastDrafted, today) : Infinity;
  const stuck = rows.filter((r) => r.status === 'image_ready' && released(r, today)
    && daysBetween(r.image_generated_on || r.quality_passed_on || r.drafted_on || today, today) >= stallDays);
  const runway = Math.ceil(draftable.length / perDay);
  const lastDraftDay = addDays(today, runway);
  const nextHold = held.map(holdDate).sort()[0];

  const status = `${draftable.length} core briefs draftable now, ${held.length} held until their date, ${blocked.length} blocked, last core draft ${lastDrafted || 'never'}`;
  const alerts = [];
  if (draftable.length && idle >= stallDays) {
    alerts.push(`Drafting has stalled: ${draftable.length} core briefs can be drafted now and the last core piece was drafted on ${lastDrafted}, ${idle} days ago. Each draft run takes the next one whatever its publish_date, so no run since then has drafted one; their console output is in editorial/logs/runs/.`);
  }
  if (stuck.length) {
    alerts.push(`Publishing has stalled: ${stuck.map((r) => r.brief_id).join(', ')} ${stuck.length === 1 ? 'has' : 'have'} been at image_ready for ${stallDays} days or more with nothing holding ${stuck.length === 1 ? 'it' : 'them'}. The publish run takes every image_ready row whatever its publish_date; see editorial/logs/runs/ for its output.`);
  }
  if (draftable.length === 0) {
    alerts.push(`No core brief can be drafted now: every core row in editorial/schedule.csv is published, finished, blocked or held${held.length ? ` (${held.length} held, the next released on ${nextHold})` : ''}. No new core piece is drafted until rows are added from the master plan (content-drafts/moganshan-build-spec_1.md, then node editorial/scripts/build-briefs.mjs)${held.length ? ' or a hold date arrives' : ''}.`);
  } else if (runway <= lowDays) {
    alerts.push(`The drafting queue is running low: ${draftable.length} core briefs left that can be drafted now. At ${perDay} a day the last one is drafted around ${lastDraftDay}; after that no new core piece is drafted until rows are added from the master plan (content-drafts/moganshan-build-spec_1.md, then node editorial/scripts/build-briefs.mjs)${held.length ? ` or a hold date arrives (the next is ${nextHold})` : ''}.`);
  }
  if (blocked.length) {
    alerts.push(`Blocked rows (the reason is in each row's notes): ${blocked.map((r) => r.brief_id).join(', ')}.`);
  }

  // A blocked row alone is not an alert: the run that blocked it already said why.
  if (!alerts.some((a) => !a.startsWith('Blocked rows'))) {
    console.log(`ok: ${status}`);
    return;
  }

  const marker = path.join('editorial', 'logs', 'runs', `${today}-queue.txt`);
  if (existsSync(marker) && !dryRun) {
    console.log(`alert already sent today: ${status}`);
    return;
  }

  const subject = alerts[0].startsWith('Drafting has stalled') ? `Visit Moganshan drafting stalled (${draftable.length} briefs waiting)`
    : alerts[0].startsWith('Publishing has stalled') ? 'Visit Moganshan publishing stalled'
    : draftable.length === 0 ? 'Visit Moganshan drafting queue empty'
    : `Visit Moganshan drafting queue low: ${draftable.length} briefs left`;
  const text = [subject, '', ...alerts, '', `Schedule: ${status}.`].join('\n');

  if (dryRun) {
    console.log(text);
    return;
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log(`alert not sent, RESEND_API_KEY missing: ${subject}`);
    return;
  }
  const to = arg('to', DEFAULT_TO);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject, text }),
  });
  if (!res.ok) {
    console.log(`alert not sent, Resend ${res.status}: ${subject}`);
    return;
  }
  writeFileSync(marker, `${new Date().toISOString()} ${text}\n`);
  console.log(`alert sent to ${to}: ${subject}`);
}

main().catch((err) => {
  console.log(`queue check failed: ${err.message}`);
});
