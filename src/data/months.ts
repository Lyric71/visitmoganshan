/**
 * The twelve month strip.
 *
 * status: "good"  quiet and worth coming
 *         "busy"  booked out or crowded
 *         "quiet" cold and cheap
 *
 * Colour never carries this alone; WhenToGo renders a text legend beside it
 * and each chip states its own status to assistive tech.
 *
 * Each month also names its season page, which is where the strip sends a
 * reader who taps it. The season boundaries follow the four season guides:
 * spring is March to May, summer June to August, autumn September to
 * November, winter December to February.
 */
export type MonthStatus = "good" | "busy" | "quiet";

export type Season = "spring" | "summer" | "autumn" | "winter";

export const MONTHS: readonly {
  m: string;
  name: string;
  status: MonthStatus;
  season: Season;
}[] = [
  { m: "Jan", name: "January", status: "quiet", season: "winter" },
  { m: "Feb", name: "February", status: "quiet", season: "winter" },
  { m: "Mar", name: "March", status: "good", season: "spring" },
  { m: "Apr", name: "April", status: "good", season: "spring" },
  { m: "May", name: "May", status: "busy", season: "spring" },
  { m: "Jun", name: "June", status: "quiet", season: "summer" },
  { m: "Jul", name: "July", status: "busy", season: "summer" },
  { m: "Aug", name: "August", status: "busy", season: "summer" },
  { m: "Sep", name: "September", status: "good", season: "autumn" },
  { m: "Oct", name: "October", status: "busy", season: "autumn" },
  { m: "Nov", name: "November", status: "good", season: "autumn" },
  { m: "Dec", name: "December", status: "quiet", season: "winter" },
] as const;

/** Legend copy, verbatim from the brief. Never drop this: it is the non-colour signal. */
export const MONTH_LEGEND: Record<MonthStatus, string> = {
  good: "quiet and good",
  busy: "busy or booked out",
  quiet: "cold and cheap",
};

/** Where each season is written up. */
export const SEASON_PAGE: Record<Season, { label: string; href: string }> = {
  spring: { label: "Spring in Moganshan", href: "/seasons/spring" },
  summer: { label: "Summer in Moganshan", href: "/seasons/summer" },
  autumn: { label: "Autumn in Moganshan", href: "/seasons/autumn" },
  winter: { label: "Winter in Moganshan", href: "/seasons/winter" },
};
