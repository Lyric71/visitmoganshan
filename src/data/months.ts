/**
 * The twelve month strip.
 *
 * status: "good"  quiet and worth coming
 *         "busy"  booked out or crowded
 *         "quiet" cold and cheap
 *
 * Colour never carries this alone; WhenToGo renders a text legend beside it and
 * each chip states its own status to assistive tech.
 */
export type MonthStatus = 'good' | 'busy' | 'quiet';

export const MONTHS: readonly { m: string; status: MonthStatus }[] = [
  { m: 'Jan', status: 'quiet' },
  { m: 'Feb', status: 'quiet' },
  { m: 'Mar', status: 'good' },
  { m: 'Apr', status: 'good' },
  { m: 'May', status: 'busy' },
  { m: 'Jun', status: 'quiet' },
  { m: 'Jul', status: 'busy' },
  { m: 'Aug', status: 'busy' },
  { m: 'Sep', status: 'good' },
  { m: 'Oct', status: 'busy' },
  { m: 'Nov', status: 'good' },
  { m: 'Dec', status: 'quiet' },
] as const;

/** Legend copy, verbatim from the brief. Never drop this: it is the non-colour signal. */
export const MONTH_LEGEND: Record<MonthStatus, string> = {
  good: 'quiet and good',
  busy: 'busy or booked out',
  quiet: 'cold and cheap',
};
