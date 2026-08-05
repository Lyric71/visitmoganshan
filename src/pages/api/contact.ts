import type { APIRoute } from 'astro';
import { Resend } from 'resend';

import { CONTACT_TOPICS } from '../../data/contact';
import { createChallenge, verifyChallenge } from '../../lib/captcha';

/**
 * POST /api/contact
 *
 * The only on demand route on the site. Everything else is prerendered, so this
 * is the one function Vercel actually runs, and it does one thing: take four
 * fields from the contact form and hand them to Resend.
 *
 * Validation is repeated here rather than trusted from the browser, because the
 * form is a public endpoint and required attributes stop nobody who is posting
 * with curl. The honeypot is checked here for the same reason.
 *
 * Configuration lives in .env.local and in the Vercel project settings:
 *   RESEND_API_KEY     the sending key
 *   CONTACT_TO_EMAIL   where enquiries land
 *   CONTACT_FROM_EMAIL optional, once a domain is verified in Resend
 */
export const prerender = false;

const FROM_FALLBACK = 'Visit Moganshan <onboarding@resend.dev>';

const LIMITS = {
  name: 120,
  email: 200,
  topic: 80,
  message: 4000,
};

/**
 * process.env first, so a key rotated in the Vercel dashboard takes effect on
 * the next request rather than on the next build. import.meta.env is the local
 * path: that is where .env.local lands in dev.
 */
function env(name: string): string {
  return (process.env[name] || import.meta.env[name] || '').trim();
}

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = env('RESEND_API_KEY');
  const to = env('CONTACT_TO_EMAIL');

  // A missing key is a deployment problem, not a reader problem. Say something
  // true and generic on the page, and put the real cause in the function log.
  if (!apiKey || !to) {
    console.error('contact: RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return json(
      {
        error: 'The form is not available right now. Please email us instead.',
      },
      500,
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

  // Bots fill every field they are given. Readers never see this one, so a value
  // here means the submission is not a reader. Answer 200 so the sender learns
  // nothing about why nothing arrived.
  if (str(body.company)) return json({ success: true }, 200);

  const name = str(body.name);
  const email = str(body.email);
  const topic = str(body.topic);
  const message = str(body.message);

  if (!name || !email || !message) {
    return json({ error: 'Please fill in your name, your email and a message.' }, 400);
  }

  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    topic.length > LIMITS.topic ||
    message.length > LIMITS.message
  ) {
    return json({ error: 'That message is too long. Please shorten it and try again.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: 'That email address does not look right.' }, 400);
  }

  // The math question. Checked last, so a reader who got the sum right and the
  // email wrong is told about the email rather than being sent round again, and
  // checked here rather than trusted from the browser, where it proves nothing.
  const check = verifyChallenge(str(body.token), str(body.answer));

  if (check !== 'ok') {
    // A fresh question comes back with the refusal, so the page can swap it in
    // without a second round trip and the reader can simply answer again.
    return json(
      {
        error:
          check === 'expired'
            ? 'That question timed out. Here is a new one, then send again.'
            : 'That sum is not right. Please try again.',
        challenge: createChallenge(),
      },
      400,
    );
  }

  // An unknown topic is not worth rejecting a genuine enquiry over. Fall back to
  // the neutral label rather than echoing whatever arrived into the subject.
  const safeTopic = (CONTACT_TOPICS as readonly string[]).includes(topic)
    ? topic
    : CONTACT_TOPICS[0];

  const labelTd =
    'padding: 10px 0; border-bottom: 1px solid #dcd9d2; color: #6c6f6b; font-size: 13px; width: 140px; vertical-align: top;';
  const valueTd =
    'padding: 10px 0; border-bottom: 1px solid #dcd9d2; color: #1a1d1b; line-height: 1.6;';
  const row = (label: string, value: string): string =>
    `<tr><td style="${labelTd}">${label}</td><td style="${valueTd}">${value}</td></tr>`;

  const rows = [
    row('Name', `<strong>${escapeHtml(name)}</strong>`),
    row(
      'Email',
      `<a href="mailto:${escapeHtml(email)}" style="color: #1f4a3c;">${escapeHtml(email)}</a>`,
    ),
    row('Topic', escapeHtml(safeTopic)),
    row('Message', escapeHtml(message).replace(/\n/g, '<br/>')),
  ].join('');

  const html = `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 600px; margin: 0 auto; background: #f4f6f4; padding: 32px;">
      <div style="background: #1f4a3c; border-radius: 10px; padding: 28px 32px; margin-bottom: 20px;">
        <h1 style="color: #ffffff; font-size: 20px; font-weight: 500; margin: 0;">New contact form message</h1>
        <p style="color: #b9c6bd; font-size: 13px; margin: 8px 0 0;">visitmoganshan.com</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #dcd9d2; border-radius: 10px; padding: 28px 32px;">
        <table style="width: 100%; border-collapse: collapse; font-family: Arial, sans-serif; font-size: 14px;">
          ${rows}
        </table>
      </div>
    </div>
  `;

  const text = [`Name: ${name}`, `Email: ${email}`, `Topic: ${safeTopic}`, '', message].join('\n');

  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: env('CONTACT_FROM_EMAIL') || FROM_FALLBACK,
    to,
    replyTo: email,
    subject: `${safeTopic}: ${name}`,
    html,
    text,
  });

  if (error) {
    console.error('contact: resend error', error);
    return json({ error: 'The message could not be sent. Please try again in a moment.' }, 502);
  }

  return json({ success: true }, 200);
};
