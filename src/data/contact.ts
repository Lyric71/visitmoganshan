/**
 * The contact form's topic list.
 *
 * Shared by the page that renders the select and the route that validates the
 * submission, so the two can never drift into rejecting a value the form itself
 * offered. Order is the order shown, and the first entry is the fallback for a
 * submission that arrives with something else.
 */
export const CONTACT_TOPICS = [
  'General question',
  'Booking or availability',
  'Hotel or business listing',
  'Advertiser',
  'Trade and media',
  'Correction or update',
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];
