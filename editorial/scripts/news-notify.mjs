#!/usr/bin/env node
/**
 * Email for the news layer. One message per run, through Resend, the provider
 * the contact form and the editorial publish already use.
 *
 *   node editorial/scripts/news-notify.mjs --mode drafts   [--triage <path>] [--dry-run]
 *   node editorial/scripts/news-notify.mjs --mode published --slug <slug>... [--build passed|failed] [--note "<text>"] [--dry-run]
 *   node editorial/scripts/news-notify.mjs --mode failed --note "<error>" [--dry-run]
 *
 * `drafts` reads editorial/news/drafts and lists what is waiting, with the
 * command that approves or rejects each one. It carries no signed publish link
 * on purpose, the same decision BBChien made: a news item is read and usually
 * corrected before it goes out, and that is not a decision to take from an
 * email. `published` lists the live URLs after a publish run. `failed` reports
 * a publish run that stopped.
 *
 * The email is a convenience. A Resend failure exits non zero so the run log
 * records it, but the caller must never let it undo a publish that succeeded.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { newsPath, splitFrontmatter } from './news-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const SITE = 'https://www.visitmoganshan.com';
const DRAFTS = path.join(ROOT, 'editorial', 'news', 'drafts');
const CONTENT = path.join(ROOT, 'src', 'content', 'news');
// Resend testing mode delivers only to the account owner's own address. Same
// constants as notify-publish.mjs; change both when a sending domain is verified.
const DEFAULT_TO = 'cyril.drouin@outlook.com';
const FROM = 'Visit Moganshan <onboarding@resend.dev>';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    const full = path.join(ROOT, file);
    if (!existsSync(full)) continue;
    for (const line of readFileSync(full, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (!m || process.env[m[1]]) continue;
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}

function parseArgs(argv) {
  const out = { slug: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) continue;
    const key = a.slice(2);
    if (key === 'dry-run') {
      out.dryRun = true;
      continue;
    }
    const val = argv[i + 1];
    if (val === undefined || val.startsWith('--')) {
      out[key] = true;
      continue;
    }
    if (key === 'slug') out.slug.push(val);
    else out[key] = val;
    i++;
  }
  return out;
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function readDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const { data } = splitFrontmatter(readFileSync(path.join(dir, file), 'utf8'), parseYaml);
      return { file, slug: file.replace(/\.md$/, ''), data };
    });
}

function draftsEmail(args) {
  const drafts = readDir(DRAFTS);
  const pending = drafts.filter((d) => (d.data.status ?? 'pending') === 'pending');
  const approved = drafts.filter((d) => d.data.status === 'approved');
  const subject = pending.length
    ? `[Visit Moganshan] ${pending.length} news draft${pending.length === 1 ? '' : 's'} to review`
    : approved.length
      ? `[Visit Moganshan] ${approved.length} news draft${approved.length === 1 ? '' : 's'} approved, waiting for the publish run`
      : '[Visit Moganshan] news sweep ran, nothing drafted';
  const lines = [];
  const html = [];

  lines.push(pending.length ? `The sweep ran and ${pending.length} draft${pending.length === 1 ? ' is' : 's are'} waiting. Nothing is published: each one waits for your approval.` : 'The sweep ran. No draft was written this time.');
  html.push(`<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${esc(lines[0])}</p>`);
  for (const d of pending) {
    const sources = (d.data.sources ?? []).map((s) => `${s.name} (${s.name_en}), ${s.date}, tier ${s.tier}`).join('; ');
    lines.push('', `${d.data.title}`, `  kind ${d.data.kind}, topics ${(d.data.topics ?? []).join(', ')}, ${d.data.author}`, `  ${d.data.standfirst}`, `  Consequence: ${d.data.consequence}`, `  Sources: ${sources}`, `  File: editorial/news/drafts/${d.file}`, `  Approve: npm run news:approve -- ${d.slug}`, `  Reject:  npm run news:approve -- ${d.slug} --reject "reason"`);
    html.push(`<div style="margin:0 0 20px;padding:14px 16px;border-left:3px solid #3E6B48;background:#F4F6F4;">
      <p style="font-size:16px;font-weight:600;margin:0 0 6px;">${esc(d.data.title)}</p>
      <p style="font-size:13px;color:#5C5C5C;margin:0 0 8px;">${esc(d.data.kind)} · ${esc((d.data.topics ?? []).join(', '))} · ${esc(d.data.author)}</p>
      <p style="font-size:14px;line-height:1.55;margin:0 0 8px;">${esc(d.data.standfirst)}</p>
      <p style="font-size:14px;line-height:1.55;margin:0 0 8px;"><strong>What this means for a visitor:</strong> ${esc(d.data.consequence)}</p>
      <p style="font-size:13px;color:#5C5C5C;margin:0 0 8px;">Sources: ${esc(sources)}</p>
      <p style="font-size:13px;margin:0;"><code>editorial/news/drafts/${esc(d.file)}</code></p>
      <p style="font-size:13px;margin:6px 0 0;">Approve: <code>npm run news:approve -- ${esc(d.slug)}</code><br>Reject: <code>npm run news:approve -- ${esc(d.slug)} --reject "reason"</code></p>
    </div>`);
  }
  if (approved.length) {
    lines.push('', `Already approved, waiting for the publish run: ${approved.map((d) => d.slug).join(', ')}`);
    html.push(`<p style="font-size:14px;color:#5C5C5C;">Already approved, waiting for the publish run: ${esc(approved.map((d) => d.slug).join(', '))}</p>`);
  }
  if (args.triage) {
    lines.push('', `Triage file: ${args.triage}`);
    html.push(`<p style="font-size:13px;color:#5C5C5C;">Triage file: <code>${esc(args.triage)}</code></p>`);
  }
  if (args.note) {
    lines.push('', `Note: ${args.note}`);
    html.push(`<p style="font-size:14px;line-height:1.6;">${esc(args.note)}</p>`);
  }
  return { subject, text: lines.join('\n'), html: html.join('\n') };
}

function publishedEmail(args) {
  const published = readDir(CONTENT).filter((d) => args.slug.some((s) => d.slug === s || d.slug.endsWith(`-${s}`)));
  const subject = `[Visit Moganshan] news published: ${published.map((d) => d.data.title).join('; ') || args.slug.join(', ')}`;
  const lines = [`Published ${published.length} news item${published.length === 1 ? '' : 's'}.`, `Build: ${args.build ?? 'not reported'}`];
  const html = [`<p style="font-size:15px;line-height:1.6;margin:0 0 16px;">Published ${published.length} news item${published.length === 1 ? '' : 's'}. Build: ${esc(args.build ?? 'not reported')}.</p>`];
  for (const d of published) {
    const slug = d.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const url = `${SITE}${newsPath(d.data, slug)}`;
    lines.push('', d.data.title, `  ${url}`);
    html.push(`<p style="font-size:15px;margin:0 0 12px;"><strong>${esc(d.data.title)}</strong><br><a href="${url}" style="color:#3E6B48;">${esc(url)}</a></p>`);
  }
  if (args.note) {
    lines.push('', `Note: ${args.note}`);
    html.push(`<p style="font-size:14px;line-height:1.6;">${esc(args.note)}</p>`);
  }
  return { subject, text: lines.join('\n'), html: html.join('\n') };
}

function failedEmail(args) {
  const subject = '[Visit Moganshan] news publish failed';
  const text = `The news publish run stopped. Nothing was committed or pushed.\n\n${args.note ?? 'No error text was passed.'}`;
  const html = `<p style="font-size:15px;line-height:1.6;">The news publish run stopped. Nothing was committed or pushed.</p><pre style="font-size:13px;white-space:pre-wrap;background:#F4F6F4;padding:12px;">${esc(args.note ?? 'No error text was passed.')}</pre>`;
  return { subject, text, html };
}

async function main() {
  loadEnv();
  const args = parseArgs(process.argv.slice(2));
  const mode = args.mode ?? 'drafts';
  const built = mode === 'published' ? publishedEmail(args) : mode === 'failed' ? failedEmail(args) : draftsEmail(args);
  const to = args.to || DEFAULT_TO;
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false });
  const html = `
<div style="font-family:Inter,-apple-system,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;padding:32px;background:#FFFFFF;color:#1A1A1A;">
  <p style="font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#3E6B48;margin:0 0 8px;">Visit Moganshan news layer</p>
  <h1 style="font-size:20px;font-weight:600;line-height:1.3;margin:0 0 20px;">${esc(built.subject.replace(/^\[Visit Moganshan\]\s*/, ''))}</h1>
  ${built.html}
  <p style="font-size:12px;color:#8A8A8A;margin:24px 0 0;">${esc(when)} Shanghai time</p>
</div>`;
  const payload = { from: FROM, to: [to], subject: built.subject, text: built.text, html };

  if (args.dryRun) {
    console.log(built.text);
    console.log(`\n[dry run] would send "${built.subject}" to ${to}`);
    return;
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('RESEND_API_KEY missing. Add it to .env.local at the repo root.');
    process.exit(1);
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`Resend error ${res.status}: ${JSON.stringify(data)}`);
    process.exit(1);
  }
  console.log(`Sent "${built.subject}" to ${to} (id ${data.id || 'n/a'})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
