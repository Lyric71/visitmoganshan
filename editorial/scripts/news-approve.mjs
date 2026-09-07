#!/usr/bin/env node
// Approve or reject a news draft waiting in editorial/news/drafts.
//
//   node editorial/scripts/news-approve.mjs <slug>                 approve
//   node editorial/scripts/news-approve.mjs <slug> --reject "why"  reject
//   node editorial/scripts/news-approve.mjs --list                 what is waiting
//
// Approval is a file edit, made here so the status line and the ledger move
// together. A draft is never published by this script: the publish run picks
// up every approved draft whose date has arrived (news-publish.mjs). Rejection
// moves the file to editorial/news/rejected with the reason in its frontmatter,
// so the decision is kept and the same item is not drafted again: the ledger
// entry is marked rejected too.

import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { splitFrontmatter } from './news-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const NEWS = path.join(ROOT, 'editorial', 'news');
const DRAFTS = path.join(NEWS, 'drafts');
const REJECTED = path.join(NEWS, 'rejected');
const SEEN = path.join(NEWS, 'seen.json');

const argv = process.argv.slice(2);
const LIST = argv.includes('--list');
const rejectIndex = argv.indexOf('--reject');
const REASON = rejectIndex !== -1 ? argv[rejectIndex + 1] : null;
const slug = argv.find((a) => !a.startsWith('--') && a !== REASON);

function drafts() {
  if (!existsSync(DRAFTS)) return [];
  return readdirSync(DRAFTS)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const text = readFileSync(path.join(DRAFTS, file), 'utf8');
      const { data } = splitFrontmatter(text, parseYaml);
      return { file, slug: file.replace(/\.md$/, ''), data, text };
    });
}

/** Rewrite one top level frontmatter key in place, adding it when absent. */
function setKey(text, key, value) {
  const line = `${key}: ${JSON.stringify(value)}`;
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const fm = block[1];
  const pattern = new RegExp(`^${key}:.*$`, 'm');
  const next = pattern.test(fm) ? fm.replace(pattern, line) : `${fm}\n${line}`;
  return text.replace(block[1], next);
}

function markLedger(urlHash, status, reason) {
  if (!urlHash || !existsSync(SEEN)) return;
  const seen = JSON.parse(readFileSync(SEEN, 'utf8'));
  const item = seen.items?.[urlHash];
  if (!item) return;
  item.status = status;
  item.reason = reason ?? null;
  writeFileSync(SEEN, `${JSON.stringify(seen, null, 2)}\n`, 'utf8');
}

const waiting = drafts();

if (LIST || !slug) {
  if (!waiting.length) {
    console.log('No drafts waiting in editorial/news/drafts.');
  } else {
    for (const d of waiting) {
      console.log(`${d.data.status ?? 'pending'}  ${d.slug}  ${d.data.kind}  ${d.data.title}`);
    }
  }
  if (!slug && !LIST) console.log('\nUsage: node editorial/scripts/news-approve.mjs <slug> [--reject "reason"]');
  process.exit(0);
}

const draft = waiting.find((d) => d.slug === slug || d.slug.endsWith(`-${slug}`));
if (!draft) {
  console.error(`No draft matches "${slug}". Waiting: ${waiting.map((d) => d.slug).join(', ') || 'none'}`);
  process.exit(1);
}

if (REASON !== null) {
  if (!REASON || REASON.startsWith('--')) {
    console.error('--reject needs a reason in quotes.');
    process.exit(2);
  }
  mkdirSync(REJECTED, { recursive: true });
  let text = setKey(draft.text, 'status', 'rejected');
  text = setKey(text, 'rejection_reason', REASON);
  writeFileSync(path.join(REJECTED, draft.file), text, 'utf8');
  unlinkSync(path.join(DRAFTS, draft.file));
  markLedger(draft.data.origin?.url_hash, 'rejected', REASON);
  console.log(`Rejected ${draft.slug}: ${REASON}. Moved to editorial/news/rejected.`);
} else {
  const text = setKey(draft.text, 'status', 'approved');
  writeFileSync(path.join(DRAFTS, draft.file), text, 'utf8');
  console.log(`Approved ${draft.slug}. The next publish run moves it into src/content/news.`);
}
