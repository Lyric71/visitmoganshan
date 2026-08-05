import { createHmac, randomInt, timingSafeEqual } from 'node:crypto';

/**
 * The contact form's math question.
 *
 * Server side only. The page is prerendered, so the question cannot be baked
 * into the HTML: every reader would get the same sum, and one scrape would be
 * enough. It is issued by /api/contact-challenge instead, and travels with a
 * signed token the posting route can check without storing anything.
 *
 * The token carries the expected answer as an HMAC, never in clear, so reading
 * it tells a bot nothing. Solving the question means reading the words rendered
 * on the page and doing the addition, which is the entire point: it stops the
 * scripts that post at every form they find, and it asks a reader for one small
 * thing instead of handing their traffic to a captcha vendor.
 *
 * It is not a defence against somebody targeting this site specifically. Nothing
 * of this shape is. It is a filter, and the rate of nonsense arriving in the
 * inbox is what says whether it needs to become something heavier.
 */

/** How long a question stays good. Long enough to write a real message. */
const TTL_MS = 45 * 60 * 1000;

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

export interface Challenge {
  /** The question as rendered to the reader, in words. */
  question: string;
  /** Signed proof of the expected answer, posted back with the form. */
  token: string;
}

function secret(): string {
  // CONTACT_SECRET is the right knob. The Resend key is the fallback so the
  // form is never accidentally left signing with an empty string; rotating it
  // simply invalidates any question already in flight.
  return (
    process.env.CONTACT_SECRET ||
    import.meta.env.CONTACT_SECRET ||
    process.env.RESEND_API_KEY ||
    import.meta.env.RESEND_API_KEY ||
    ''
  );
}

function sign(answer: number, expires: number): string {
  return createHmac('sha256', secret()).update(`${answer}|${expires}`).digest('base64url');
}

/** Issues one question. Operands stay small so the sum is never a chore. */
export function createChallenge(): Challenge {
  const a = randomInt(2, 10);
  const b = randomInt(2, 10);
  const expires = Date.now() + TTL_MS;

  return {
    question: `${WORDS[a]} plus ${WORDS[b]}`,
    token: `${expires}.${sign(a + b, expires)}`,
  };
}

/**
 * Reads what the reader typed. Digits are what most people will use; the words
 * are accepted because the question is asked in words, and being told your
 * correct answer is wrong is a bad way to lose an enquiry.
 */
function parseAnswer(input: string): number | null {
  const cleaned = input.trim().toLowerCase();
  if (/^\d{1,3}$/.test(cleaned)) return Number(cleaned);

  const teens: Record<string, number> = {
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
  };

  const word = WORDS.indexOf(cleaned);
  if (word !== -1) return word;
  return teens[cleaned] ?? null;
}

export type ChallengeResult = 'ok' | 'wrong' | 'expired' | 'malformed';

export function verifyChallenge(token: string, answer: string): ChallengeResult {
  const [stamp, signature] = token.split('.');
  const expires = Number(stamp);

  if (!signature || !Number.isFinite(expires)) return 'malformed';
  if (Date.now() > expires) return 'expired';

  const value = parseAnswer(answer);
  if (value === null) return 'wrong';

  const expected = Buffer.from(sign(value, expires));
  const received = Buffer.from(signature);

  if (expected.length !== received.length) return 'wrong';
  return timingSafeEqual(expected, received) ? 'ok' : 'wrong';
}
