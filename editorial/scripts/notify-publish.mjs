#!/usr/bin/env node
/**
 * Publish notification for the editorial pipeline. Sends one email through
 * Resend (the same provider the contact form uses) when a piece has been
 * published. No npm dependencies: native fetch, Node 18+.
 *
 * Run from the repo root:
 *
 *   node editorial/scripts/notify-publish.mjs --slug <slug> --title "<title>"
 *        --url </path/> [--to <email>] [--build passed|failed]
 *        [--log editorial/logs/YYYY-MM-DD.md] [--todo "<text>"]... [--note "<text>"]
 *
 * The site is English only, so there is one live URL. --url is the frontmatter
 * `url` of the published guide file (or the news page for a dispatch).
 *
 * RESEND_API_KEY is read from .env.local / .env in the current directory or
 * from the environment. Pass --dry-run to print the email without sending.
 */

import { existsSync, readFileSync } from 'node:fs';

const SITE = 'https://www.visitmoganshan.com';
// Resend testing mode delivers only to the account owner's own address. Once
// a sending domain is verified at resend.com/domains, change FROM to that
// domain and DEFAULT_TO to the address that should receive the summary.
const DEFAULT_TO = 'cyril.drouin@outlook.com';
const FROM = 'Visit Moganshan <onboarding@resend.dev>';

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

function parseArgs(argv) {
  const out = { todo: [] };
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
    if (key === 'todo') out.todo.push(val);
    else out[key] = val;
    i++;
  }
  return out;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

async function main() {
  loadEnv();
  const args = parseArgs(process.argv.slice(2));
  if (!args.slug || !args.title) {
    console.error(
      'Usage: node editorial/scripts/notify-publish.mjs --slug <slug> --title "<title>" --url </path/> [options]',
    );
    process.exit(2);
  }
  const to = args.to || DEFAULT_TO;
  const live = args.url ? `${SITE}${args.url.replace(/\/$/, '')}` : 'not reported';
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Shanghai', hour12: false });

  const lines = [
    `Published: ${args.title}`,
    '',
    `Slug: ${args.slug}`,
    `Time (Shanghai): ${when}`,
    `Live URL: ${live}`,
    `Build: ${args.build || 'not reported'}`,
    `Run log: ${args.log || 'not reported'}`,
  ];
  if (args.todo.length) lines.push('', 'Open TODOs:', ...args.todo.map((t) => `  * ${t}`));
  if (args.note) lines.push('', `Note: ${args.note}`);
  const text = lines.join('\n');

  const row = (label, value) =>
    `<tr><td style="padding:8px 0;color:#5C5C5C;width:130px;border-bottom:0.5px solid #E5E0D6;vertical-align:top;">${esc(label)}</td><td style="padding:8px 0;border-bottom:0.5px solid #E5E0D6;">${value}</td></tr>`;
  const html = `
<div style="font-family:Inter,-apple-system,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FFFFFF;color:#1A1A1A;">
  <p style="font-size:11px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;color:#3E6B48;margin:0 0 8px;">Visit Moganshan editorial</p>
  <h1 style="font-size:22px;font-weight:600;line-height:1.25;margin:0 0 24px;">Published: ${esc(args.title)}</h1>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    ${row('Slug', esc(args.slug))}
    ${row('Time (Shanghai)', esc(when))}
    ${row('Live URL', args.url ? `<a href="${live}" style="color:#3E6B48;">${esc(live)}</a>` : 'not reported')}
    ${row('Build', esc(args.build || 'not reported'))}
    ${row('Run log', esc(args.log || 'not reported'))}
  </table>
  ${args.todo.length ? `<p style="font-size:14px;margin:24px 0 8px;color:#5C5C5C;">Open TODOs</p><ul style="font-size:14px;line-height:1.6;margin:0;padding-left:20px;">${args.todo.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
  ${args.note ? `<p style="font-size:14px;line-height:1.6;margin:24px 0 0;">${esc(args.note)}</p>` : ''}
</div>`;

  const payload = { from: FROM, to: [to], subject: `Published: ${args.title}`, text, html };

  if (args.dryRun) {
    console.log(text);
    console.log(`\n[dry run] would send to ${to}`);
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
  console.log(`Sent to ${to} (id ${data.id || 'n/a'})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
