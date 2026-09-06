import type { StayType } from '../lib/stays';

/**
 * The editorial intro at the top of each listing page.
 *
 * A listing of several hundred cards captured from a booking platform is not a
 * page anybody wrote, and a search engine is right to treat it that way. These
 * paragraphs are what makes each of the seven pages ours: what the category
 * means on this particular mountain, where it clusters, what it costs, what to
 * ask before paying, and why the list is in the order it is in. They sit on the
 * first page of each listing only; a reader on page four has read them.
 *
 * Every figure here is one the guide articles already carry and source. The
 * intros say nothing about individual properties, because the site has stayed
 * in none of them, and they never rank: the order below is review count, which
 * is the platform's evidence and not our opinion.
 *
 * `{count}` is replaced with the live number of rows at render time so the
 * prose can never disagree with the list under it.
 */
export type StayTypeIntro = {
  /** One line under the h1, the page's own standfirst. */
  standfirst: string;
  /** Plain prose paragraphs. No markdown; links are written as HTML anchors. */
  paragraphs: string[];
};

export const STAY_TYPE_INTROS: Record<StayType, StayTypeIntro> = {
  Homestay: {
    standfirst:
      'The minsu is what this mountain is. A small guesthouse, usually run by the family that owns it, in one of the villages below the ridge.',
    paragraphs: [
      'About a thousand places to sleep sit around the foot of Moganshan, and the great majority of them are minsu (民宿): village houses converted room by room, with the owner or a live-in manager on the property instead of a front desk. Spread roughly 10,000 beds over 1,000 properties and the average comes out near ten beds each. Around 80 percent are individually owned. The {count} listed here are the ones Trip.com files under that description, or under one of its many spellings, and this page carries every one of them without a featured position or a paid placement.',
      'The village matters more than the property. Yucun (庾村) is the hub at the foot of the mountain, with the square, the market, most of the restaurants and one of the three transfer centers, and it is the safe first choice without a car. Xiantan (仙潭村) on the northern foot is the densest guesthouse village, about 135 minsu among fewer than 2,000 residents and roughly 90 percent locally run, which is where the price competition is. Sanjiuwu (三九坞) is where the foreign-founded end of the trade began in 2007. Laoling, Houwu and Dazaowu are quieter and further, and quiet costs something: a village thirty minutes from Yucun is one you will not leave after dark. The <a href="/moganshan/villages">villages guide</a> takes them one at a time.',
      'Rates answer to the calendar more than to the room. A mid-range room runs RMB 300 to 500 a night off season and midweek, and the same room passes RMB 1,000 on a summer Saturday or during a Golden Week. The local trade puts its high-end threshold at RMB 1,500. The dollar figure on each card is the cheapest rate Trip.com showed on the day the listing was captured, converted at a fixed rate and shown with the yuan beside it, because yuan is what you will be charged.',
      'Three things to settle before you pay. Ask whether the property serves dinner and book it for your arrival night, because these villages have almost no evening economy and a late arrival in a small one can mean no meal. Say that you hold a foreign passport and ask them to confirm they can register you: a 2024 national directive bars refusing foreign guests, and enforcement in small family houses is still uneven. And check your arrival time against the transfer centers, which close at 18:00, since private cars cannot drive inside the scenic area. <a href="/where-to-stay/minsu-explained">What a minsu is</a> covers all three at length.',
      'The list is ordered by how many reviews sit behind each score, most first. That is the one ranking on the page that is not our opinion and not the platform’s promotion: a place with two thousand reviews is a known quantity in a way that a place with four is not. Use the filters to narrow by rate and by review count, or search by name if you arrived with a property already in mind.',
    ],
  },
  Villa: {
    standfirst:
      'On this mountain the word means two different things, and only one of them takes bookings.',
    paragraphs: [
      'Search for a Moganshan villa and half the results are the stone houses left from the 1890s hill station. About 250 of them still stand on the ridge, and almost none can be slept in: after 1949 they passed to work units or became housing, and the view from the road is the whole visit. The {count} places on this page are the other meaning, modern guesthouses that describe themselves as a villa, a residence, a manor, a shanzhuang (山庄) or a cottage, filed here by that description rather than by any inspection of ours. The one real exception to the rule is naked Castle, a house of 1910 reopened as a hotel in 2017, which the platform files under resorts.',
      'What most people searching this word actually want is a whole house, and that is a booking the mountain does well. The guesthouse stock grew out of family houses and still behaves like them: about ten beds a property, one kitchen, one terrace. A family of eight to twelve, a reunion, a birthday party or a small offsite fits one building. A couple does not; you would pay for eight empty beds when a thousand properties here will sell you a room. The catch is that whole-house is rarely a listed inventory type, so the cards show rooms priced by the room. Pick the property, then write to the owner and ask what it costs with nobody else in it.',
      'No property on this mountain publishes a whole-house rate, so start from the per-room band. Off season and midweek a mid-range room is RMB 300 to 500 a night, a peak weekend or Golden Week pushes it past RMB 1,000, and the local trade calls RMB 1,500 and above high end. Multiply by the rooms, expect the owner to want a little more for giving up the chance to sell singly, and do not push during a Golden Week, when high-end occupancy has hit 94 percent. The dollar figure on each card is Trip.com’s cheapest rate on the day of capture, with the yuan beside it.',
      'Two practicalities decide whether the evening works. Private cars cannot drive inside the scenic area, so everyone changes at Yucun, Fatou or Houwu between 08:00 and 18:00, and a group arriving at Deqing station after about 17:30 should assume the first night starts off the mountain. And the villages have no evening economy to speak of, so a house full of people needs dinner arranged in writing before anyone pays. <a href="/where-to-stay/villas-explained">Private villas and whole-house stays</a> has the questions to ask, and <a href="/moganshan/hill-station/the-villas">the stone villas</a> covers the houses you can only look at.',
      'The order is by review count, most first, because that is evidence rather than opinion. Nothing here is ranked by us and nothing is promoted.',
    ],
  },
  Resort: {
    standfirst:
      'A few larger builds with hotel service and hotel rates, on a mountain that is otherwise a thousand family guesthouses.',
    paragraphs: [
      'Resort is the smallest category on Moganshan and the one with the most name recognition. The mountain’s modern accommodation trade dates from naked Home Village, opened at Sanjiuwu in 2007 by a South African founder, and the same group built naked Stables in 2011, about 121 keys and the first resort in mainland China to hold LEED Platinum, then naked Castle in 2017, about 95 keys inside a restored villa of 1910. Those two sit in a band of roughly USD 291 to 524 a night. The {count} properties on this page are everything Trip.com describes as a resort or a 度假村, which is a broader set than the handful of names most visitors have heard of.',
      'Read the location before the photographs. The name Moganshan is used loosely by the booking platforms, and a resort filed under it can be down in Wukang, the county seat about 20 km off the mountain, which is a rail and services town rather than a bamboo hillside. The Crowne Plaza Deqing Moganshan, about 340 rooms, is the clearest case. Fine for a late arrival, poor if you came for the trees. The Four Seasons announced for Yu Village is not on this page because it does not exist yet: 90 keys on a 23-hectare site, opening year given as 2030, and an announced date is not a booking.',
      'Resort rates answer less to the calendar than guesthouse rates do, but they still move: high-end occupancy on the mountain ran 68 percent in 2025 and hit 94 percent over the May 2024 holiday, so a Golden Week needs booking well ahead while midweek usually has room. The dollar figure on each card is the cheapest rate Trip.com showed on the day of capture, with the yuan beside it. Rooms above RMB 1,500 have been the fastest-growing segment here, which is where the investment is going.',
      'The practical rules are the same as for any bed on the mountain. Private vehicles cannot drive inside the scenic area, so you change at a transfer center that closes at 18:00, and a resort inside the boundary will tell you how its own shuttle meets that. Ask before you book if your train reaches Deqing in the evening. <a href="/where-to-stay/hotels-explained">Every hotel in Moganshan</a> lists the twelve named hotels and resorts with what the record confirms about each, and <a href="/where-to-stay/luxury">luxury stays</a> covers the top of the market.',
      'The cards below are ordered by review count, most first. This site has stayed in none of these properties and rates none of them.',
    ],
  },
  Hotel: {
    standfirst:
      'Everything the booking system files as a hotel. Most of it is a guesthouse with an ambitious name, and a few are hotels in a town 20 km away.',
    paragraphs: [
      'A search for Moganshan hotels returns hundreds of results and almost none of them are hotels. The mountain has about twelve properties that operate as one, with a front desk and a duty roster, against roughly a thousand minsu, the small owner-run guesthouses that make up most of the beds here. The {count} places on this page are the ones Trip.com calls a hotel or a 酒店, and that description is the owner’s, not ours: a family house with eight rooms can file itself as a hotel, and many do.',
      'The distinction that matters is on or off the mountain. The conventional hotels with hundreds of rooms are mostly in Wukang, the Deqing county seat, about 20 km from the villages. The Crowne Plaza Deqing Moganshan, about 340 rooms, is there. Wukang is where the high-speed rail arrives and where the services are, and it is the right answer for a late train or for anyone who wants a normal hotel night before going up in the morning. It is the wrong answer if the point of the trip was the bamboo, because you will drive to it every day.',
      'Up in the villages, expect the guesthouse economy whatever the name on the sign. Rates move with the calendar: RMB 300 to 500 a night for a mid-range room off season and midweek, past RMB 1,000 on a summer Saturday or a Golden Week, and RMB 1,500 upward at what the local trade calls high end. The dollar on each card is the cheapest rate Trip.com showed on the day of capture, with the yuan beside it. Dinner is not a given in the smaller villages, so ask, and check that your arrival clears the 18:00 close of the transfer centers, since private cars cannot enter the scenic area.',
      'One rule now applies to every property here. A joint directive of 24 May 2024 bars hotels from refusing foreign guests for lack of a licence, and it is national. Refusals are still reported in practice, so a one-line message before paying, saying you hold a foreign passport and asking them to confirm they can register you, is still worth sending. <a href="/where-to-stay/hotels-explained">Every hotel in Moganshan</a> names the twelve real ones with what the record confirms, and <a href="/where-to-stay/minsu-explained">what a minsu is</a> explains the rest.',
      'The list is ordered by review count, most first. Nothing on it is ranked by us or promoted by anyone.',
    ],
  },
  Lodge: {
    standfirst:
      'Inns, cabins, camps, glamping sites and retreats: the places that sell the outdoors more than the room.',
    paragraphs: [
      'This is the loosest category on the mountain and the one whose names promise the most. Trip.com does not classify properties by kind, so the {count} places here are grouped by what they call themselves: an inn, a lodge, a cabin, a camp or a glamping site, a retreat, a hideaway, a club or a 营地. Some are a converted village house that chose the word for its sound. Others are tents on platforms beside a reservoir. The photographs on each card, which are the property’s own listing images, will tell you which faster than the name does.',
      'Where it is real, the outdoor offer is on the south and west sides. Laoling (劳岭村) on the south has the reservoir, the kayaking and the cycling and was one of the earliest farmstay clusters. Dazaowu (大造坞) is the most remote of the villages, out among rice paddies by the Dadouwu reservoir, with the longest drive and the fewest doors. Both are a long way from Yucun’s restaurants, and a camp or a cabin is a place where dinner has to be arranged before you arrive rather than found afterwards. <a href="/things-to-do/hiking">Hiking</a> and <a href="/moganshan/bamboo-forest">the bamboo forest</a> cover what the outdoor days look like.',
      'Rates follow the same curve as everything else here, with weekends and the Golden Weeks costing two or three times a March Tuesday, and canvas is no cheaper than walls on a summer Saturday. The dollar figure on each card is the cheapest rate Trip.com showed on the day of capture, shown with the yuan. A tented site is also the kind of property most exposed to the weather, and Moganshan gets a plum-rain season in June and typhoon rain in late summer, so read <a href="/moganshan/weather">the weather page</a> before booking a canvas roof for July.',
      'The access rule applies with extra force. Private vehicles cannot drive inside the scenic area, the three transfer centers at Yucun, Fatou and Houwu keep an 08:00 to 18:00 day, and a remote site will have its own arrangement for the last leg. Get that in writing along with the dinner question and, if you hold a foreign passport, a confirmation that they can register you.',
      'The cards are ordered by review count, most first. This site has stayed in none of them and rates none of them.',
    ],
  },
  Apartment: {
    standfirst:
      'Serviced flats and apartment hotels, which on this mountain mostly means the county town rather than the villages.',
    paragraphs: [
      'An apartment is an unusual thing to book on Moganshan, and the {count} listed here are the ones Trip.com describes as an apartment, an apart-hotel, a serviced residence or a 公寓. The description is the owner’s. Most of this kind of stock sits down in Wukang, the Deqing county seat about 20 km from the villages, which is the rail and services town and the place where a block of flats makes sense. A few are up in the villages, where the word usually means a converted house let as self-catering units.',
      'The case for one is a longer stay or a group that wants a kitchen. The villages have almost no evening economy, no night market and very little late food, and Yucun’s restaurants are the exception rather than the rule. A unit with a kitchen turns that from a problem into a plan, provided the shopping is done in Wukang or Yucun on the way in. The case against is the same distance: from Wukang you will drive to the mountain every day, changing vehicles at a transfer center because private cars cannot enter the scenic area.',
      'Rates are less seasonal than guesthouse rates but not immune, and the same Golden Weeks fill everything within reach of the mountain. The dollar figure on each card is the cheapest rate Trip.com showed on the day of capture, with the yuan beside it. A self-catering unit is also where the registration question comes up most, because a landlord letting a flat is less used to foreign passports than a hotel desk: a 2024 national directive bars refusing foreign guests, and a one-line message asking them to confirm they can register you settles it before money moves.',
      'For how the town and the mountain connect, <a href="/getting-here/deqing-station">the Deqing station guide</a> covers arrival and <a href="/getting-here/getting-around">getting around</a> covers the shuttles and the transfer centers. <a href="/where-to-stay">Where to stay</a> starts from the village rather than the property type, which for most trips is the better order.',
      'The list is ordered by review count, most first, and nothing on it is ranked by us.',
    ],
  },
  Hostel: {
    standfirst:
      'Youth hostels and dormitory beds, the cheapest way onto the mountain and the smallest category on it.',
    paragraphs: [
      'Moganshan is not a backpacker mountain. Its modern trade was built on the design-led guesthouse and the Shanghai weekend, and the dormitory bed has never been more than a footnote to it. The {count} places here are the ones Trip.com files as a hostel or a 青年旅社, and on a hill where a mid-range private room runs RMB 300 to 500 off season, the saving a dormitory offers is real but not dramatic. What a hostel does offer is other travellers, which in a village with no evening economy is worth something.',
      'Where you are matters as much as at any other price. Yucun (庾村), the hub village at the foot of the mountain, has the square, the market and most of the restaurants, and it is where a traveller without a car should sleep. The smaller villages hold close to nothing after dark, and a cheap bed thirty minutes from dinner is not cheap. Private vehicles cannot drive inside the scenic area, so the last leg is a transfer center shuttle or a lift the property arranges, and the centers close at 18:00. <a href="/getting-here/getting-around">Getting around</a> has the times and <a href="/moganshan/villages">the villages guide</a> says what each one has open.',
      'Paying is easier than it was. Foreign cards have linked to Alipay and WeChat Pay since 2023, and a small hostel may not take a foreign card any other way, so set both up before you land. Bring your passport for check-in, and since a 2024 directive bars refusing foreign guests but enforcement in small places is still uneven, message ahead and ask them to confirm they can register you. <a href="/plan/money-and-payments">Money and payments</a> walks through the setup.',
      'The dollar figure on each card is the cheapest rate Trip.com showed on the day of capture, shown with the yuan, and in a dormitory that figure is usually per bed rather than per room. The cards are ordered by review count, most first, which is the platform’s evidence and not our ranking. This site has stayed in none of them.',
    ],
  },
};

export function renderIntro(intro: StayTypeIntro, count: number): StayTypeIntro {
  const n = count.toLocaleString('en-GB');
  return {
    standfirst: intro.standfirst.replaceAll('{count}', n),
    paragraphs: intro.paragraphs.map((p) => p.replaceAll('{count}', n)),
  };
}
