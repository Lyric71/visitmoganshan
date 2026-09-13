import type { APIRoute } from 'astro';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { isSignedIn } from '../../../lib/admin-auth';

/**
 * POST /api/admin/news-review
 *
 * Removes one live item at an admin's request. On the machine with the
 * editorial checkout it runs immediately. On Vercel it commits a small
 * request file for the machine's poll task to apply.
 */
export const prerender = false;

const REQUEST_DIR = 'editorial/news/requests';

type Decision = 'unpublish';

function back(outcome: string, detail?: string): Response {
  const query = new URLSearchParams({ review: outcome, ...(detail ? { detail } : {}) });
  return new Response(null, { status: 303, headers: { Location: `/admin/news?${query}` } });
}

function repoRoot(): string | null {
  const cwd = process.cwd();
  return existsSync(path.join(cwd, 'editorial', 'scripts', 'news-unpublish.mjs')) ? cwd : null;
}

function validSlug(value: string): boolean {
  return /^[a-z0-9][a-z0-9-]*$/.test(value);
}

async function queueOnGitHub(slug: string, action: Decision, reason?: string): Promise<{ ok: boolean; detail: string }> {
  const token = (process.env.GITHUB_TOKEN || '').trim();
  const repo = (process.env.GITHUB_REPO || '').trim();
  if (!token || !repo) return { ok: false, detail: 'GITHUB_TOKEN and GITHUB_REPO are not set on this deploy' };

  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const file = `${REQUEST_DIR}/review-${stamp}-${slug}.json`;
  const body = `${JSON.stringify({ kind: 'review', slug, action, reason, requestedAt: now.toISOString(), from: 'dashboard' }, null, 2)}\n`;
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'visitmoganshan-admin',
    },
    body: JSON.stringify({
      message: `chore(news): ${action} requested for ${slug}`,
      content: Buffer.from(body, 'utf8').toString('base64'),
      branch: 'main',
    }),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    return { ok: false, detail: `GitHub answered ${response.status}: ${text.slice(0, 200)}` };
  }
  return { ok: true, detail: file };
}

export const POST: APIRoute = async ({ cookies, request }) => {
  if (!isSignedIn(cookies)) return new Response(null, { status: 303, headers: { Location: '/admin/login' } });

  const origin = request.headers.get('origin');
  const expected = new URL(request.url).origin;
  if (origin && origin !== expected) return new Response('Forbidden', { status: 403 });

  const form = await request.formData();
  const slug = String(form.get('slug') ?? '').trim();
  const action = String(form.get('action') ?? '') as Decision;
  if (!validSlug(slug) || action !== 'unpublish') return back('failed', 'This news item could not be identified.');

  const root = repoRoot();
  if (root && !process.env.VERCEL) {
    const script = path.join(root, 'editorial', 'scripts', 'news-unpublish.mjs');
    const unpublished = spawnSync(process.execPath, [script, slug], {
      cwd: root,
      encoding: 'utf8',
      windowsHide: true,
      maxBuffer: 64 * 1024 * 1024,
    });
    if (unpublished.status === 0) return back('unpublished');
    return back('failed', (unpublished.stderr || unpublished.stdout || 'The unpublish command failed.').trim().slice(-500));
  }

  const queued = await queueOnGitHub(slug, action);
  return queued.ok ? back('queued', queued.detail) : back('failed', queued.detail);
};
