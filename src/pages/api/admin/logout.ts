import type { APIRoute } from 'astro';

import { endSession } from '../../../lib/admin-auth';

/**
 * POST /api/admin/logout
 *
 * A post, not a link. A GET that signs you out can be fired by any image tag on
 * any page, which is a nuisance rather than a breach, but the fix costs one
 * button.
 */
export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  endSession(cookies);
  return new Response(null, { status: 303, headers: { Location: '/admin/login?signed-out=1' } });
};
