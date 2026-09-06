import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';

/**
 * The picture puzzle on the admin sign-in form.
 *
 * Self hosted and server rendered. No captcha vendor, no third party script,
 * nothing that depends on a network the owner may be signing in from. The
 * characters are drawn as SVG paths from a stroke alphabet defined in this
 * file, never as SVG text, so there is nothing in the page source to read: a
 * bot sees a few kilobytes of warped coordinates and a person sees six
 * letters.
 *
 * Every picture is different. Each glyph is scaled, rotated and coloured on
 * its own, every stroke is subdivided and pushed through two sine warps before
 * it is written out, decoy curves in the same ink cross the word, and a
 * turbulence filter shifts the result once more in the browser. The wobble in
 * the numbers is decided here, so scraping the SVG does not undo it.
 *
 * The answer never travels in clear. The form carries a token of the shape
 * `<expiry>.<nonce>.<hmac>` where the hmac covers the code, the expiry and the
 * nonce under ADMIN_SECRET. Checking an attempt means recomputing the hmac from
 * what was typed. Each token is good for one attempt: the nonce is recorded on
 * first use, so a solved picture cannot be replayed against a list of
 * passwords. That record is in memory and therefore per instance; a deploy on
 * several instances would weaken it to one attempt per instance, and the
 * five minute expiry bounds the damage either way.
 *
 * There is no audio alternative. One person signs in here, and the trade for
 * that one person is a picture they can always reload against a form that does
 * not have to trust a captcha vendor.
 */

/** Five minutes. A person signs in well inside it; a bot's stash goes stale. */
const TTL_MS = 5 * 60 * 1000;

/** Characters in the picture. */
const LENGTH = 6;

/**
 * Letters and digits that survive being warped. Nothing that reads as
 * something else at a tilt: no O and 0, no I, 1 and L, no S and 5, no Z and 2,
 * no B and 8, no U and V.
 */
const ALPHABET = 'ACDEFGHJKMNPQRTWXY34679';

/* --------------------------------------------------------------------------
   Stroke alphabet

   Each glyph is drawn on a 4 by 6 grid, y downwards, as a list of polylines.
   Chunky and slightly naive on purpose: a stroke font survives warping in a
   way an outline font does not, and it does not need a font file to exist on
   the server.
   -------------------------------------------------------------------------- */

type Point = [number, number];
type Stroke = Point[];

const GLYPHS: Record<string, Stroke[]> = {
  A: [
    [
      [0, 6],
      [2, 0],
      [4, 6],
    ],
    [
      [0.8, 3.7],
      [3.2, 3.7],
    ],
  ],
  C: [
    [
      [4, 1],
      [3, 0],
      [1, 0],
      [0, 1],
      [0, 5],
      [1, 6],
      [3, 6],
      [4, 5],
    ],
  ],
  D: [
    [
      [0, 0],
      [0, 6],
      [2.5, 6],
      [4, 4.5],
      [4, 1.5],
      [2.5, 0],
      [0, 0],
    ],
  ],
  E: [
    [
      [4, 0],
      [0, 0],
      [0, 6],
      [4, 6],
    ],
    [
      [0, 3],
      [3, 3],
    ],
  ],
  F: [
    [
      [4, 0],
      [0, 0],
      [0, 6],
    ],
    [
      [0, 3],
      [3, 3],
    ],
  ],
  G: [
    [
      [4, 1],
      [3, 0],
      [1, 0],
      [0, 1],
      [0, 5],
      [1, 6],
      [3, 6],
      [4, 5],
      [4, 3.5],
      [2.2, 3.5],
    ],
  ],
  H: [
    [
      [0, 0],
      [0, 6],
    ],
    [
      [4, 0],
      [4, 6],
    ],
    [
      [0, 3],
      [4, 3],
    ],
  ],
  J: [
    [
      [4, 0],
      [4, 5],
      [3, 6],
      [1, 6],
      [0, 5],
    ],
  ],
  K: [
    [
      [0, 0],
      [0, 6],
    ],
    [
      [4, 0],
      [0.2, 3.4],
    ],
    [
      [1.4, 2.4],
      [4, 6],
    ],
  ],
  M: [
    [
      [0, 6],
      [0, 0],
      [2, 3.6],
      [4, 0],
      [4, 6],
    ],
  ],
  N: [
    [
      [0, 6],
      [0, 0],
      [4, 6],
      [4, 0],
    ],
  ],
  P: [
    [
      [0, 6],
      [0, 0],
      [3, 0],
      [4, 1],
      [4, 2.5],
      [3, 3.5],
      [0, 3.5],
    ],
  ],
  Q: [
    [
      [1, 0],
      [3, 0],
      [4, 1],
      [4, 5],
      [3, 6],
      [1, 6],
      [0, 5],
      [0, 1],
      [1, 0],
    ],
    [
      [2.5, 4.4],
      [4.4, 6.5],
    ],
  ],
  R: [
    [
      [0, 6],
      [0, 0],
      [3, 0],
      [4, 1],
      [4, 2.5],
      [3, 3.5],
      [0, 3.5],
    ],
    [
      [1.6, 3.5],
      [4, 6],
    ],
  ],
  T: [
    [
      [0, 0],
      [4, 0],
    ],
    [
      [2, 0],
      [2, 6],
    ],
  ],
  W: [
    [
      [0, 0],
      [0.8, 6],
      [2, 2.4],
      [3.2, 6],
      [4, 0],
    ],
  ],
  X: [
    [
      [0, 0],
      [4, 6],
    ],
    [
      [4, 0],
      [0, 6],
    ],
  ],
  Y: [
    [
      [0, 0],
      [2, 3],
      [4, 0],
    ],
    [
      [2, 3],
      [2, 6],
    ],
  ],
  '3': [
    [
      [0, 0.6],
      [1, 0],
      [3, 0],
      [4, 1],
      [4, 2],
      [3, 3],
      [1.6, 3],
    ],
    [
      [3, 3],
      [4, 4],
      [4, 5],
      [3, 6],
      [1, 6],
      [0, 5.4],
    ],
  ],
  '4': [
    [
      [3, 6],
      [3, 0],
      [0, 4.2],
      [4, 4.2],
    ],
  ],
  '6': [
    [
      [3.6, 0],
      [1.6, 0.6],
      [0, 2.6],
      [0, 5],
      [1, 6],
      [3, 6],
      [4, 5],
      [4, 3.8],
      [3, 3],
      [1, 3],
      [0, 4],
    ],
  ],
  '7': [
    [
      [0, 0],
      [4, 0],
      [1.4, 6],
    ],
  ],
  '9': [
    [
      [0.4, 6],
      [2.4, 5.4],
      [4, 3.4],
      [4, 1],
      [3, 0],
      [1, 0],
      [0, 1],
      [0, 2.2],
      [1, 3],
      [3, 3],
      [4, 2],
    ],
  ],
};

/* --------------------------------------------------------------------------
   Drawing
   -------------------------------------------------------------------------- */

const WIDTH = 320;
const HEIGHT = 104;

/** Uniform float in [min, max) from the CSPRNG; geometry is cheap to draw. */
function rand(min: number, max: number): number {
  return min + (randomInt(0, 1_000_000) / 1_000_000) * (max - min);
}

const fmt = (n: number): string => n.toFixed(1).replace(/\.0$/, '');

/** Inks that read on paper and are close enough to each other to defeat a colour split. */
function ink(): string {
  const hue = rand(0, 1) < 0.7 ? rand(150, 225) : rand(15, 40);
  return `hsl(${fmt(hue)} ${fmt(rand(22, 46))}% ${fmt(rand(20, 34))}%)`;
}

/** Splits a polyline into pieces a few pixels long so a warp bends it rather than shifting it. */
function subdivide(stroke: Point[], step: number): Point[] {
  const out: Point[] = [stroke[0]];
  for (let i = 1; i < stroke.length; i++) {
    const [x0, y0] = stroke[i - 1];
    const [x1, y1] = stroke[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 1; k <= n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  return out;
}

interface Warp {
  ax: number;
  ay: number;
  fx: number;
  fy: number;
  px: number;
  py: number;
}

function warp(w: Warp, [x, y]: Point): Point {
  return [x + w.ax * Math.sin(y * w.fy + w.py), y + w.ay * Math.sin(x * w.fx + w.px)];
}

function path(points: Point[]): string {
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${fmt(x)} ${fmt(y)}`).join('');
}

/** Places one glyph, warps it, and returns its path elements. */
function drawGlyph(char: string, index: number, w: Warp): string {
  const strokes = GLYPHS[char];
  const scale = rand(8.5, 10.5);
  const angle = rand(-0.28, 0.28);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const cx = 32 + index * 51 + rand(-3, 3);
  const cy = HEIGHT / 2 + rand(-6, 6);
  const shear = rand(-0.18, 0.18);
  const colour = ink();
  const width = rand(3.2, 4.4);

  const place = ([u, v]: Point): Point => {
    const lx = (u - 2 + (v - 3) * shear) * scale;
    const ly = (v - 3) * scale;
    return [cx + lx * cos - ly * sin, cy + lx * sin + ly * cos];
  };

  return strokes
    .map((stroke) => {
      const points = subdivide(stroke, 0.35)
        .map(place)
        .map((p) => warp(w, p))
        .map(([x, y]): Point => [x + rand(-0.5, 0.5), y + rand(-0.5, 0.5)]);
      return `<path d="${path(points)}" stroke="${colour}" stroke-width="${fmt(width)}"/>`;
    })
    .join('');
}

/** Curves in the same inks and widths as the letters, so nothing separates them by style. */
function decoys(): string {
  const parts: string[] = [];
  const count = randomInt(3, 6);
  for (let i = 0; i < count; i++) {
    const x0 = rand(-10, 40);
    const x1 = rand(WIDTH - 40, WIDTH + 10);
    const d = `M${fmt(x0)} ${fmt(rand(0, HEIGHT))}C${fmt(rand(40, 140))} ${fmt(rand(-30, HEIGHT + 30))},${fmt(rand(180, 280))} ${fmt(rand(-30, HEIGHT + 30))},${fmt(x1)} ${fmt(rand(0, HEIGHT))}`;
    const heavy = i < 2;
    parts.push(
      `<path d="${d}" stroke="${ink()}" stroke-width="${fmt(heavy ? rand(2.4, 3.6) : rand(1, 1.6))}" opacity="${fmt(heavy ? rand(0.45, 0.65) : rand(0.5, 0.85))}"/>`,
    );
  }
  const dots = randomInt(30, 50);
  for (let i = 0; i < dots; i++) {
    parts.push(
      `<circle cx="${fmt(rand(0, WIDTH))}" cy="${fmt(rand(0, HEIGHT))}" r="${fmt(rand(0.8, 2.4))}" fill="${ink()}" opacity="${fmt(rand(0.4, 0.9))}"/>`,
    );
  }
  return parts.join('');
}

/** Faint paper texture, so a flat background is not a free segmentation step. */
function texture(): string {
  const parts: string[] = [];
  const count = randomInt(8, 14);
  for (let i = 0; i < count; i++) {
    parts.push(
      `<ellipse cx="${fmt(rand(0, WIDTH))}" cy="${fmt(rand(0, HEIGHT))}" rx="${fmt(rand(20, 90))}" ry="${fmt(rand(10, 50))}" fill="hsl(${fmt(rand(40, 200))} 30% ${fmt(rand(80, 92))}%)" opacity="${fmt(rand(0.25, 0.6))}"/>`,
    );
  }
  return parts.join('');
}

function render(code: string): string {
  const w: Warp = {
    ax: rand(1.5, 3),
    ay: rand(1.5, 3),
    fx: rand(0.03, 0.06),
    fy: rand(0.05, 0.1),
    px: rand(0, Math.PI * 2),
    py: rand(0, Math.PI * 2),
  };
  const glyphs = [...code].map((char, i) => drawGlyph(char, i, w)).join('');
  const seed = randomInt(1, 10_000);
  const displace = fmt(rand(2.5, 4.5));

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">` +
    `<defs><filter id="r" x="-5%" y="-10%" width="110%" height="120%">` +
    `<feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="2" seed="${seed}" result="n"/>` +
    `<feDisplacementMap in="SourceGraphic" in2="n" scale="${displace}" xChannelSelector="R" yChannelSelector="G"/>` +
    `</filter></defs>` +
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="#f6f4ee"/>${texture()}` +
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#r)">${glyphs}${decoys()}</g>` +
    `</svg>`
  );
}

/* --------------------------------------------------------------------------
   Tokens
   -------------------------------------------------------------------------- */

function secret(): string {
  return (process.env.ADMIN_SECRET || import.meta.env.ADMIN_SECRET || '').trim();
}

function sign(code: string, expires: number, nonce: string): string {
  return createHmac('sha256', secret()).update(`${code}|${expires}|${nonce}`).digest('base64url');
}

/**
 * Nonces already spent, with their expiry so the set can be pruned. One attempt
 * per picture, whatever the attempt was: a wrong password on a right picture
 * still burns the picture.
 */
const spent = new Map<string, number>();

function prune(now: number): void {
  for (const [nonce, expires] of spent) if (expires < now) spent.delete(nonce);
}

export interface AdminCaptcha {
  /** A data URI for an <img>, rendered fresh for this form. */
  image: string;
  /** Signed proof of the expected code, posted back with the form. */
  token: string;
}

export function createAdminCaptcha(): AdminCaptcha {
  let code = '';
  for (let i = 0; i < LENGTH; i++) code += ALPHABET[randomInt(0, ALPHABET.length)];

  const expires = Date.now() + TTL_MS;
  const nonce = randomBytes(9).toString('base64url');
  const svg = render(code);

  return {
    image: `data:image/svg+xml;base64,${Buffer.from(svg, 'utf8').toString('base64')}`,
    token: `${expires}.${nonce}.${sign(code, expires, nonce)}`,
  };
}

export type AdminCaptchaResult = 'ok' | 'wrong' | 'expired' | 'malformed';

/**
 * Case does not matter and neither do spaces: the picture is uppercase but
 * nobody should lose an attempt to a phone keyboard's opinion.
 */
export function verifyAdminCaptcha(token: string, answer: string): AdminCaptchaResult {
  const [stamp, nonce, signature] = token.split('.');
  const expires = Number(stamp);
  if (!nonce || !signature || !Number.isFinite(expires)) return 'malformed';

  const now = Date.now();
  prune(now);
  if (now > expires) return 'expired';

  // Spent before the answer is looked at, so a token buys one check and no more.
  if (spent.has(nonce)) return 'expired';
  spent.set(nonce, expires);

  const code = answer.replace(/\s+/g, '').toUpperCase();
  if (code.length !== LENGTH) return 'wrong';

  const expected = Buffer.from(sign(code, expires, nonce));
  const received = Buffer.from(signature);
  if (expected.length !== received.length) return 'wrong';
  return timingSafeEqual(expected, received) ? 'ok' : 'wrong';
}
