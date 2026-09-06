import type { APIRoute } from 'astro';

import { checkCredentials, endSession, isConfigured, startSession } from '../../../lib/admin-auth';
import { verifyAdminCaptcha } from '../../../lib/admin-captcha';

/**
 * POST /api/admin/login and /api/admin/logout
 *
 * A form post rather than a fetch, so the admin works with scripting off and
 * the browser handles the cookie without any code of ours running in the page.
 * The answer is always a redirect: to /admin on success, back to the form with
 * a reason on failure.
 *
 * The reason is deliberately vague. "Those details are not right" is all a
 * failed attempt ever gets, whichever half was wrong, because saying which one
 * turns a guess at the password into a guess at the email first.
 *
 * The picture puzzle is checked before the credentials and burned by the
 * check, so every password guess costs a freshly solved picture. A failed
 * picture is reported as such: knowing the picture was wrong says nothing
 * about the password, and the alternative is a person who mistyped one letter
 * being told their password is wrong.
 */
export const prerender = false;

/** Slows a script down without inconveniencing a person typing once. */
const DELAY_MS = 600;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function redirect(to: string): Response {
  return new Response(null, { status: 303, headers: { Location: to } });
}

export const POST: APIRoute = async ({ request, cookies, url }) => {
  if (url.pathname.endsWith('/logout')) {
    endSession(cookies);
    return redirect('/admin/login?signed-out=1');
  }

  if (!isConfigured()) {
    // Refuse rather than fall open. A deploy missing ADMIN_SECRET should lock
    // the owner out, not let the internet in.
    return redirect('/admin/login?error=unconfigured');
  }

  const form = await request.formData().catch(() => null);
  const email = String(form?.get('email') ?? '');
  const password = String(form?.get('password') ?? '');
  const token = String(form?.get('captcha-token') ?? '');
  const answer = String(form?.get('captcha') ?? '');

  // Paid on every attempt, before the answer is known, so a wrong password and
  // a wrong address take the same time to come back.
  await wait(DELAY_MS);

  const picture = verifyAdminCaptcha(token, answer);
  if (picture !== 'ok') {
    return redirect(picture === 'expired' ? '/admin/login?error=expired' : '/admin/login?error=captcha');
  }

  if (!checkCredentials(email, password)) {
    return redirect('/admin/login?error=1');
  }

  startSession(cookies);
  return redirect('/admin');
};
