import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

/**
 * The admin area's front door.
 *
 * One account, email and password, no registration, no reset flow, no user
 * table. There is exactly one person who signs in here and adding an account
 * system for them would be more code to get wrong than the thing it protects.
 *
 * Nothing secret is in this file or anywhere else in the repository. The email,
 * the password hash and the signing secret all come from the environment:
 *
 *   ADMIN_EMAIL           cyril.drouin@beyondbordergroup.com
 *   ADMIN_PASSWORD_HASH   scrypt hash, produced by `npm run admin:hash`
 *   ADMIN_SECRET          long random string, signs the session cookie
 *
 * With any of the three unset the admin area refuses every login rather than
 * falling open, which is the failure mode that matters: a misconfigured deploy
 * should lock the owner out, never let everyone in.
 *
 * The password is stored as scrypt with a per-hash salt, not as a plain string
 * and not as a bare SHA. Both comparisons that decide anything run in constant
 * time, so neither the email nor the password can be recovered a character at a
 * time by watching how long the answer takes.
 */

const COOKIE = 'vm_admin';
/** Eight hours. Long enough for a working day, short enough to matter. */
const SESSION_MS = 8 * 60 * 60 * 1000;

/** process.env first so a rotated secret takes effect on the next request. */
function env(name: string): string {
  return (process.env[name] || import.meta.env[name] || '').trim();
}

/** True when the environment is complete enough to allow a login at all. */
export function isConfigured(): boolean {
  return Boolean(env('ADMIN_EMAIL') && env('ADMIN_PASSWORD_HASH') && env('ADMIN_SECRET'));
}

/** Constant time string comparison that tolerates different lengths. */
function sameString(a: string, b: string): boolean {
  const left = Buffer.from(a, 'utf8');
  const right = Buffer.from(b, 'utf8');
  // Hash both to a fixed width first: timingSafeEqual throws on a length
  // mismatch, and throwing is itself a timing signal about the length.
  const wrap = (value: Buffer) => createHmac('sha256', 'compare').update(value).digest();
  return timingSafeEqual(wrap(left), wrap(right));
}

/* --------------------------------------------------------------------------
   Password hashing
   -------------------------------------------------------------------------- */

const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 64 };

/**
 * `scrypt.<salt hex>.<key hex>`. Written by scripts/admin-hash.mjs.
 *
 * Dots, not dollars. The usual format for this is `scrypt$salt$key`, and a
 * dollar in an environment value is a trap: a shell expands it on export, and
 * several .env parsers interpolate it, so the hash silently arrives as the word
 * "scrypt" and every login fails with no clue why. Both halves are hex, so a
 * dot cannot collide with the data.
 */
export function hashPassword(password: string, salt = randomBytes(16)): string {
  const key = scryptSync(password, salt, SCRYPT.keylen, SCRYPT);
  return `scrypt.${salt.toString('hex')}.${key.toString('hex')}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, keyHex] = stored.split('.');
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false;

  let candidate: Buffer;
  try {
    candidate = scryptSync(password, Buffer.from(saltHex, 'hex'), SCRYPT.keylen, SCRYPT);
  } catch {
    return false;
  }
  const expected = Buffer.from(keyHex, 'hex');
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/* --------------------------------------------------------------------------
   Sessions
   -------------------------------------------------------------------------- */

function sign(payload: string): string {
  return createHmac('sha256', env('ADMIN_SECRET')).update(payload).digest('base64url');
}

/**
 * The cookie is `<expiry>.<hmac>` and carries no identity beyond the fact that
 * somebody got the password right before that expiry. There is one account, so
 * there is nothing else it needs to say, and a cookie that carries no data is a
 * cookie nobody can tamper their way into.
 */
function issue(): { value: string; expires: Date } {
  const expires = Date.now() + SESSION_MS;
  return { value: `${expires}.${sign(String(expires))}`, expires: new Date(expires) };
}

export function isSignedIn(cookies: AstroCookies): boolean {
  if (!isConfigured()) return false;

  const raw = cookies.get(COOKIE)?.value;
  if (!raw) return false;

  const [expiresRaw, mac] = raw.split('.');
  const expires = Number(expiresRaw);
  if (!expiresRaw || !mac || !Number.isFinite(expires)) return false;
  if (Date.now() > expires) return false;

  return sameString(mac, sign(expiresRaw));
}

export function startSession(cookies: AstroCookies): void {
  const { value, expires } = issue();
  cookies.set(COOKIE, value, {
    path: '/',
    httpOnly: true,
    // Lax rather than Strict: Strict would drop the cookie when the owner
    // follows a link into the admin from an email, and this is not a route that
    // performs a dangerous action on a GET.
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    expires,
  });
}

export function endSession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: '/' });
}

/**
 * Check one login attempt.
 *
 * Both fields are always checked even when the email is wrong, so a wrong
 * address and a wrong password cost the same time and neither can be probed
 * independently. The caller gets a boolean and nothing else; telling somebody
 * which half they got wrong is a free hint.
 */
export function checkCredentials(email: string, password: string): boolean {
  if (!isConfigured()) return false;

  const emailOk = sameString(email.trim().toLowerCase(), env('ADMIN_EMAIL').toLowerCase());
  const passwordOk = verifyPassword(password, env('ADMIN_PASSWORD_HASH'));
  return emailOk && passwordOk;
}
