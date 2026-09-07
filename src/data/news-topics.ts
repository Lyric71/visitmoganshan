/**
 * The news topics, one list shared by the collection schema, the topic pages
 * and the item layout, so a topic added here exists everywhere at once.
 *
 * Nine, and deliberately few. A topic is a reader's question ("has anything
 * changed about tickets?"), not a filing system, and a page per topic is only
 * worth indexing when the topic will fill.
 */
export const NEWS_TOPICS = [
  'tickets',
  'transport',
  'openings',
  'entry-rules',
  'events',
  'weather',
  'stays',
  'policy',
  'business',
] as const;

export type NewsTopic = (typeof NEWS_TOPICS)[number];

export const TOPIC_LABEL: Record<NewsTopic, string> = {
  tickets: 'Tickets and entry',
  transport: 'Transport',
  openings: 'Openings and closures',
  'entry-rules': 'Visas and entry rules',
  events: 'Events',
  weather: 'Weather and roads',
  stays: 'Places to stay',
  policy: 'Policy',
  business: 'Business',
};

/** What each topic page says about itself, above the list. */
export const TOPIC_INTRO: Record<NewsTopic, string> = {
  tickets: 'Ticket prices, the shuttle fare, opening hours and the rules at the gate. The county portal is the source of record for all of it, and every entry here says whether it was reachable.',
  transport: 'Trains to Deqing, the transfer centres, the private car rule and the last bus down. The changes that decide how a day on the mountain is shaped.',
  openings: 'Hotels, restaurants and attractions that have started trading, and the ones that have stopped. An opening is reported once a booking platform shows it taking guests, never on the announcement.',
  'entry-rules': 'Who can enter China without a visa, for how long, and under which scheme. The rules moved four times in two years and the current scheme has an end date.',
  events: 'Races, festivals, the tea harvest and the conferences that fill the county. Dates are confirmed two to three weeks out and say so.',
  weather: 'Typhoon, snow and ice warnings, and the road closures that follow them. The town weather page is the leading indicator and the county portal the record.',
  stays: 'What is changing in where people sleep: ownership, new inventory, the rules a guesthouse applies to a foreign passport.',
  policy: 'County, provincial and national decisions that reach a visitor: designations, subsidies, planning, the rail line.',
  business: 'Deals, brands and money on the mountain. Reported for what it changes for a visitor, not for the deal itself.',
};
