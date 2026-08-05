import type { APIRoute } from 'astro';

import { createChallenge } from '../../lib/captcha';

/**
 * GET /api/contact-challenge
 *
 * Hands the contact form one math question and the signed token that proves
 * what its answer should be. Called on page load and again after every send, so
 * a reader never has to solve the same sum twice.
 *
 * Never cached. A cached question is one question for everybody, which is the
 * thing this exists to avoid.
 */
export const prerender = false;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(createChallenge()), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
