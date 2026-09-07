import type { APIRoute } from 'astro';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { isSignedIn } from '../../../lib/admin-auth';

/**
 * POST /api/admin/news-sweep
 *
 * The "Run the sweep now" button on /admin/news. The sweep itself runs on the
 * machine that holds the keys and the Claude CLI, never inside a serverless
 * request, so this route does one of two things depending on where it is
 * running:
 *
 *   On that machine (astro dev or astro preview, the repo on disk): it starts
 *   editorial/scripts/run-news.ps1 -Mode sweep -Force, detached, and answers
 *   at once. The run writes to editorial/logs/runs like a scheduled one.
 *
 *   On Vercel: it commits a request file to editorial/news/requests/ on main
 *   through the GitHub contents API, using GITHUB_TOKEN and GITHUB_REPO from
 *   the environment. The machine polls main every fifteen minutes (the
 *   VisitMoganshan News Poll task), finds the request, removes it, and runs
 *   the sweep. Git is already the transport between the site and the machine,
 *   so the request travels the same way the content does; the push also
 *   redeploys the site, which is how the dashboard comes to show the request.
 *
 * A form post behind the admin cookie, with the origin checked, and a 303 back
 * to the dashboard carrying the outcome in the query string.
 */
export const prerender = false;

const REQUEST_DIR = 'editorial/news/requests';

function back(outcome: string, detail?: string): Response {
  const query = new URLSearchParams({ sweep: outcome, ...(detail ? { detail } : {}) });
  return new Response(null, { status: 303, headers: { Location: `/admin/news?${query}` } });
}

function repoRoot(): string | null {
  const cwd = process.cwd();
  return existsSync(path.join(cwd, 'editorial', 'scripts', 'run-news.ps1')) ? cwd : null;
}

function startLocally(root: string): void {
  const runner = path.join(root, 'editorial', 'scripts', 'run-news.ps1');
  const child = spawn(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', runner, '-Mode', 'sweep', '-Force'],
    { cwd: root, detached: true, stdio: 'ignore', windowsHide: true },
  );
  child.unref();
}

async function queueOnGitHub(): Promise<{ ok: boolean; detail: string }> {
  const token = (process.env.GITHUB_TOKEN || '').trim();
  const repo = (process.env.GITHUB_REPO || '').trim();
  if (!token || !repo) return { ok: false, detail: 'GITHUB_TOKEN and GITHUB_REPO are not set on this deploy' };

  const now = new Date();
  const stamp = now.toISOString().replace(/[:.]/g, '-');
  const file = `${REQUEST_DIR}/sweep-${stamp}.json`;
  const body = JSON.stringify({ kind: 'sweep', requestedAt: now.toISOString(), from: 'dashboard' }, null, 2) + '\n';

  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${file}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'visitmoganshan-admin',
    },
    body: JSON.stringify({
      message: 'chore(news): sweep requested from the dashboard',
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
  if (!isSignedIn(cookies)) {
    return new Response(null, { status: 303, headers: { Location: '/admin/login' } });
  }
  // A cross site form cannot carry the cookie under SameSite=Lax on a POST,
  // but the origin check is one line and makes the intent explicit.
  const origin = request.headers.get('origin');
  const expected = new URL(request.url).origin;
  if (origin && origin !== expected) return new Response('Forbidden', { status: 403 });

  const root = repoRoot();
  if (root && !process.env.VERCEL) {
    try {
      startLocally(root);
      return back('started');
    } catch (error) {
      return back('failed', (error as Error).message);
    }
  }

  const queued = await queueOnGitHub();
  return queued.ok ? back('queued', queued.detail) : back('failed', queued.detail);
};
