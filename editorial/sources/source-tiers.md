# Source tiers, the weekly sweep, the fixtures and the watch items

The master plan's companion `chinese-source-map.md` was never delivered to
this repo. This file restates what the plan itself says about sources (Parts
5.6 and 7) and is the working reference until a fuller map replaces it. Open
it every Wednesday for the sweep and every time a figure enters a draft.

## Tiers

| Tier | What it is | How it may be cited |
|---|---|---|
| 1 | County government portal (德清县人民政府), the scenic area's official channel, the ticket line on 0572-8412345, the Huzhou and Zhejiang statistics bureaus, a platform's own documentation | As fact, with date and URL |
| 2 | Dated local and regional news: 德清新闻网 (Deqing News), 浙江在线 (Zhejiang Online), 潮新闻 (Tide News), 澎湃新闻 (The Paper), 新华网, 中国日报, 界面新闻; dated trade press such as 迈点网 (Meadin) | As fact, with date and URL, and a tier 1 source preferred where one exists for prices and policy |
| 3 | Dated travel guides and forums with named authors: 游侠客, 当旅网, 绿色旅行网, 腾讯 travel pieces, a Substack with a named writer | As reported experience, dated; never as the sole source for a price, a closure or a policy |
| 4 | Marketing and promotional accounts: 爱德清, 德清发布, 文旅浙江, brand newsrooms, OTA listings and OTA editorial | As a tip that something may have happened; never as fact. An OTA is never a source for a price, a closure or a policy |

## Chains by fact type (Part 5.6)

| Fact type | Chain |
|---|---|
| Prices, closures, policy, opening hours, entry rules | County government portal, then the scenic area's official channel, then 0572-8412345. **Never an OTA aggregator.** |
| Hotel openings | Trade press announces, then Dianping or Ctrip confirms trading, then local news covers the ribbon. **Publish on step two.** Announced dates slip. |
| Event dates | The mid January sports presser and the early February openings meeting give the skeleton. Confirm each event two to three weeks out. |
| Visitor numbers | Huzhou or Zhejiang bureau only. County and marketing sources inflate. |
| Anything from 爱德清, 德清发布, 文旅浙江 or a brand newsroom | A tip, not a fact. |
| Weather and road closures | 中国天气网 town level page 101210204004 is the leading indicator. |

## Failed verification: do not publish (Part 5.6)

* There is no Deqing marathon or half marathon.
* The bamboo culture festival is Anji's, not Deqing's.
* No Moganshan hot spring festival, camping festival or branded annual music
  festival could be verified.
* No official Moganshan ticketing WeChat account name was confirmed.
* The 2026 ticket tariff could not be confirmed from an authoritative source.
  Slot 3 publishes the disagreement between sources, dated and tiered, not a
  single number.

## The weekly sweep (Part 7), Wednesday, 90 minutes, in priority order

1. **德清新闻网 tourism** `dqnews.zjol.com.cn/dqnews/ssdq/stly/` and politics
   `/dqnews/xwzx/sznews/`. No robots restrictions, date in the URL, four to
   six tourism items a week. Carries roughly 70 percent of any given week.
2. **迈点网 search** `meadin.com/search?keyword=莫干山`, plus
   `meadin.com/sitemap_index.xml`. Fully crawlable. Catches every hotel
   opening and signing.
3. **德清县人民政府** notices `deqing.gov.cn/col/col1229212609/`, news
   `col1229212604` and `col1229212607`. Authoritative for prices, closures,
   ratings. May need China routing.
4. **浙江在线 湖州频道** `zjnews.zjol.com.cn/zjnews/huzhounews/` for the
   regional frame.
5. **潮新闻** `tidenews.com.cn` for provincial features on Deqing.
6. **Moganshan town weather**
   `forecast.weather.com.cn/town/weather1dn/101210204004.shtml`. The road
   closure leading indicator.
7. **澎湃新闻 澎湃浙江**. Low frequency, the only source likely to publish
   something critical worth translating.
8. **Google News and Bing News search feeds**, Chinese and English (added
   7 September 2026). RSS, 100 items a feed, the publisher named in each. An
   aggregator has no tier: the publisher named in the triage table decides.
   Most 莫干山 items in the Chinese feed are 新浪 content farm guides and are
   dropped by the noise list in `news/sources.json`.
9. **The provincial and Hangzhou tier** in one pass: 浙江在线 home and
   90早新闻, 杭州网 浙江新闻 and 原创, 杭州政协网 城事 (every rail line
   milestone), 人民网 浙江频道, 新华网 地方 and 长三角. All server side, dated.
10. **Race platforms**: 最酷 `zuicool.com/events/newreg?type=trail-run`,
    朗途体育 `moganshan.saihuitong.com`, and by hand `mogan.utmb.world`.
    Authoritative for a race date and whether registration is open.
11. **English**: Xinhua English, eZhejiang, China Daily Huzhou, SmartShanghai,
    TTG Asia. Corroboration only; an English item never leads.
12. **By hand, when the week calls for it**: 搜狗微信搜索 for 德清发布 and
    莫干山旅游 posts, the 德清108 forum for traffic notices, the English hotel
    trade press when Meadin reports a signing.

The crawler runs the whole list every morning at 08:00 and writes
`news/triage/YYYY-MM-DD.md`; the Wednesday dispatch reads the week's seven
files instead of repeating the fetches.

**Triage.** Three tests or the item is dropped: did something change, does it
carry a date, would a visitor do anything differently.

## Breaking dispatch triggers

| Trigger | Response time |
|---|---|
| Ticket price or policy change | Same day |
| Closure or road restriction | Same day |
| Entry rules change for foreigners | Same day |
| Transport change | Within 48 hours |
| Major property opening or closing | Within a week, after confirming it is trading |
| Event announcement or cancellation | Within a week |

A breaking dispatch is a new row in `schedule.csv` with `slot` `B<YYYY-MM-DD>`,
`brief_file` `briefs/templates/dispatch.md`, `kind: breaking` in its
frontmatter, added by a person and drafted with `Draft brief B<date>.`

## Annual fixtures

| Date | Fixture | Source | Priority |
|---|---|---|---|
| 28 Sep 2026 | Golden Week programme drops, 7 to 10 days before each Golden Week | 德清发布 / 爱德清 / 潮新闻 | HIGH |
| 21 Oct 2026 | Kailas Moganshan Skyrace, 23 to 25 October 2026 at Yucun: look for the 德清县公安局交通警察大队 traffic notice for the race weekend (none by 14 October 2026) and carry it in dispatch 2026-43 if it appears | moganshan.saihuitong.com/events?mid=72300, then 德清新闻网 | HIGH |
| 24 Oct 2026 | Spartan Race Moganshan (斯巴达勇士赛莫干山站), 7 and 8 November 2026, registration closing 31 October: reconfirm the days two weeks out and look for the 德清县公安局交通警察大队 traffic notice for the race weekend. Yearly since 2024; the days for each edition come from the registration page | reg.zuicool.com/11858 (zuicool.com/event/51279), then 德清新闻网 | MEDIUM |
| 25 Oct 2026 | Red maple season (红枫季) opening date; the three so far opened 1 November 2023, 12 November 2024 and 18 November 2025. A news item carries the date, and the same run adds it to `/seasons/moganshan-red-leaves/` | 莫干山管理局 via 德清新闻网 / 潮新闻 | HIGH |
| 20 Jan 2027 | The 2027 race calendar: the annual sports presser publishes the full year in one article | 德清新闻网 `dqnews.zjol.com.cn/dqnews/xwzx/sznews/` | HIGH |
| 27 Jan 2027 | Spring Festival programme drops, 7 to 10 days before the holiday | 德清发布 / 爱德清 | MEDIUM |
| 10 Feb 2027 | The ten openings for 2027, the resort's 新春第一会 | deqing.gov.cn col1229212604 | HIGH |
| 18 Mar 2027 | First Mogan Huangya picked, usually mid March | 德清新闻网 tourism channel | MEDIUM |
| 24 Mar 2027 | Climbing festival opens the walking season, lineage claimed to 1934 | 德清新闻网 and deqing.gov.cn | MEDIUM |
| 25 Mar 2027 | Homestay Conference, mid to late March; verify the 2027 edition exists | 中国日报 zj and 腾讯 | MEDIUM |
| 14 Apr 2027 | Ultra Trail Mogan by UTMB, roughly 10 to 12 April | mogan.utmb.world | HIGH |
| 21 Apr 2027 | Tea King contest, 茶王赛, mid April | 德清新闻网 | LOW |
| 12 May 2027 | World Brand Moganshan Conference, early to mid May; rooms tighten county wide | 新华网 and 潮新闻 | HIGH |
| 23 Jun 2027 | Zhejiang Triathlon, Xiazhu Lake leg, late June | ihuipao.com | LOW |
| 16 Jul 2027 | Summer season launch, 100 plus events, the mid July umbrella programme | 潮新闻 tidenews.com.cn | HIGH |
| 22 Sep 2027 | The Moganshan Conference, descendant of the 1984 meeting | 中国日报 zj | MEDIUM |
| 25 Oct 2027 | Kailas Moganshan Skyrace, 100k, 70k, 35k, 10k | moganshan.saihuitong.com | HIGH |

The two that matter most: the mid January sports presser and the early
February 新春第一会. Between them they pre announce most of the year.

## Standing watch items

Facts with a known expiry, checked without waiting for news.

| Item | Why | Check |
|---|---|---|
| Unilateral visa free scheme | Expires 31 December 2026, no extension announced | Monthly, weekly from November 2026 |
| 杭德市域铁路, the Hangzhou to Deqing line | Due around end 2026. Biggest structural change to access. Last reading: Deqing News, 12 October 2026 (dqnews 2026/10/12/035309814): on 10 October the county party secretary rode a trial train between 春晖公园 and 东山漾 stations and restated the end of year opening; by 13 October 212 of the line's staff held first aid certificates (dqnews 2026/10/13/035310366); still no date, timetable or fare | Monthly |
| Four Seasons Moganshan | Announced for 2030 | Quarterly |
| Ticket tariff | Sources disagree, tiering may change seasonally | Quarterly, plus before each Golden Week |
| Shuttle hours and last bus down | Varies seasonally, extended to 21:30 in summer 2025 | Seasonally |
| Moganshan Lodge operating status | Still listed by Lonely Planet and TripAdvisor, likely defunct | Once, then close out |
| Spartan base at Jun An Li | Announced for Q4 2026 | Quarterly until confirmed trading |
| Scenic area daily visitor ceiling | The National Forestry and Grassland Administration approved the scenic area master plan for 2024 to 2035 on 22 September 2026 (林保发〔2026〕46号): 12,000 visits a day reasonable, 24,000 absolute, 4,200 beds, no admission beyond capacity, boundary marked within two years. No quota, reservation or real name booking system announced as of 14 October 2026 (dispatch 2026-42) | Quarterly with the volatile revision, and before each Golden Week: search 德清新闻网 and the ticket channel for 预约, 限流 or 限量 at the Moganshan scenic area; when a quota or booking rule is published, it is a same day breaking item and `/plan/tickets-and-entry/` and `/moganshan/scenic-area/` move with it |
| Moganshan ancient path (莫干山古道) on the provincial first grade list | Baidu Baike says the Zhejiang forestry bureau and two other departments listed it as a first grade ancient path on 27 December 2023, 27,103 m, from 庾村老街 to 石门卡. No dated tier 1 or tier 2 page could be read: lyj.zj.gov.cn (the bureau page of 26 May 2020, art_1229051674_43481889) timed out twice on 11 October 2026, and the Xinhua and Zhejiang Online reports of the 115 and 127 path lists carry the names only in images. `/things-to-do/chiang-kai-shek-path/` carries no listing until then | At the twice yearly semi-stable revision: fetch the bureau page twice; when a dated list naming 莫干山古道 is read, add the listing and its length to the Chiang path piece with the citation, and delete this row |
| Tier 1 notices behind a block | The car ban's 2018 launch notice and the transfer notice 《关于景区交通换乘的公告》 are cited from tier 2 and tier 4 copies because deqing.gov.cn timed out and zj-mgs.com returns 403 to every client; `/plan/private-car-ban-on-moganshan/` and `/plan/moganshan-shuttle-system/` carry the lower tier citations. Added 4 October 2026: the county's art museum notice 莫干山镇又添文化地标 (deqing.gov.cn/art/2023/4/19/art_1229212604_59058390.html) timed out, so `/moganshan/villages/xiantan/` cites the museum's size from Xinmin Evening News, 8 October 2024. Added 14 October 2026: the county's 碧坞龙潭改造提升进行时 (deqing.gov.cn/art/2024/3/18/art_1229212604_59071366.html) timed out twice, so `/things-to-do/biwu-dragon-pool/` prints the pool's ticket from Deqing News of 3 November 2023 and no later price; when the county page or a later tier 1 or 2 notice gives one, add it to that page and to the Xiantan page. Added 16 October 2026: the scenic area's May Day transport guide (zj-mgs.com/wap/content/?2489.html=) returned 403 "Forbidden By WAF" to curl and to Chrome, and the county's taxi figures (163 metered taxis, 260 drivers, a red and black list with 37 cars blacklisted) sit only on huzcredit.huzhou.gov.cn (art/2024/10/12/art_1229635291_23187.html) and jtyst.zj.gov.cn (art/2023/8/4/art_1229304975_59033572.html), which timed out at 300 seconds each; `/plan/getting-a-car-back-down/` carries none of them. When a fetch succeeds twice, add the fleet size and whatever the guide says about taxis and ride hailing at the transfer centre to that page. Added 17 October 2026: the county's 2018 notice 莫干黄芽黄绿之争有定论 (deqing.gov.cn/art/2018/3/8/art_1229212604_55216000.html) and the Huzhou government's 德清高标准育壮“莫干黄芽” (huzhou.gov.cn/art/2024/5/13/art_1229213487_59068321.html) timed out to curl and WebFetch, so `/things-to-do/mogan-huangya/` rests the yellow or green history on the county agriculture bureau's own 2019 text (tier 2) and the tier 2 press; when either fetch succeeds twice, add it to that page's yellow or green section as the tier 1 citation. Added 18 October 2026: the Anji county portal's Shanghai rail notice 安吉⇆上海，说走就走 (anji.gov.cn/art/2024/12/27/art_1229211475_58932669.html), the Huzhou government's 安吉9条旅游专线串起全域好风景 (huzhou.gov.cn/col/col1229213489/art/2026/art_65c3fb3a58f34d31a4969946f3fee614.html), the county's Moganshan town profile with its 5.8万亩 of bamboo (deqing.gov.cn/art/2015/8/4/art_1229213469_54860824.html) and the Huzhou culture bureau's Moganshan profile (whgdlyj.huzhou.gov.cn/art/2017/9/2/art_1229209634_54597902.html) failed to curl and timed out at 300 seconds in WebFetch, so `/itineraries/moganshan-vs-anji/` gives no daily Shanghai to Anji train count, no Anji free bus lines and no Moganshan bamboo acreage; when a fetch succeeds twice, add the train count, the nine lines (their days and fares) and the acreage to that page's tables with the tier 1 citation. Added 20 October 2026: the county statistics bulletin for 2023 (deqing.gov.cn/art/2024/3/27/art_1229212614_59071825.html), which search snippets quote for Deqing's 5G base station count, and the Huzhou government's 德清莫干溪谷完成全市首个5G-A通感一体商用部署 (huzhou.gov.cn/art/2024/5/20/art_1229213487_59068428.html) timed out to curl and WebFetch, so `/plan/esim-vpn-and-data-on-the-mountain/` prints no base station count; when the bulletin is read twice, add the count with its year to that page's signal section. | At each quarterly volatile revision: fetch twice, and when both succeed swap the citation in the same run |
| Houwu announcements of May 2025 | Huzhou Daily, 28 May 2025: the 木可町 art hotel (RMB 100 million, due October 2025), a 30 mu transfer and distribution centre (集散中心, "about to start") and the 追光计划 summit café on Tianquanshan. None confirmed trading or open as of 13 October 2026, so `/moganshan/villages/houwu/` prints the art hotel as announced and keeps it off the shortlist | Quarterly: search Ctrip and Dianping for 木可町; when a listing shows it trading (step two of the openings chain), add it to the Houwu shortlist and move that page's last_updated |
| Houwu rainforest attraction and the Geling cliff café | Tide News (潮新闻, reporter 陈明月, via Tencent news.qq.com/rain/a/20261015A03YOH00), 15 October 2026: a 雨林秘境 at Houwu (后坞村) with an aerial ropeway and a light show "about to open", and more than ten attractions at 葛岭缦咖 (a cliff café and a mist suspension bridge among them) "nearly finished". No date, hours or price for either | Monthly with the sweep: search 德清新闻网 and Dianping for 雨林秘境 and 葛岭缦咖; when either is dated or shown trading, it is a news item and `/moganshan/villages/houwu/` takes the first |
| The Houwu ginkgos' age at its source | `/moganshan/villages/houwu/` prints "more than 1,400 years" from 今日德清 (28 January 2015) through a 2018 Sohu reprint at tier 4, because the county paper's own page is not online and no tree register was found | At the twice yearly semi-stable revision: search the 今日德清 archive and the Zhejiang ancient tree register (古树名木) for 天泉禅寺 银杏; when a tier 1 or 2 copy is found, swap the citation |
| The Villa 62 maple's age at a tier 1 register | `/journal/villa-62-and-its-maple/` prints four accounts (a hundred years, Tide News 2025; more than 500, the 2021 Tencent writer and the guesthouse; the bureau's unnamed oldest over 500) and says no published catalogue entry was found, because the Zhejiang forestry bureau's scenic area page (lyj.zj.gov.cn/art/2020/5/22/art_1229051677_43300815.html) timed out and then returned HTTP 429 on 19 October 2026, and no Deqing or Huzhou ancient tree catalogue naming a Moganshan maple was found. The 1934 date and the owner 黄桂珊 rest only on Chinese Wikipedia citing 李南, 莫干山：一个近代避暑地的兴起 (2011), p. 95, and are not printed | At the twice yearly semi-stable revision: fetch the bureau page twice and search the Zhejiang ancient tree register (古树名木) and 德清新闻网 for 62号 红枫 or 枫鹃谷 古树; when a grade, number or measured age is read twice, add it to that piece and to `/seasons/moganshan-red-leaves/`, and delete this row |
| Online foreign guest registration outside hotels | National Immigration Administration announcement 2026 No. 1: a pilot in seven provinces, Zhejiang among them, from 20 March 2026, "gradually" to go national. `/plan/can-a-guesthouse-refuse-your-passport-foreign/` prints the pilot as dated | Quarterly: nia.gov.cn 移民管理要闻 for the nationwide notice; when it lands, the page drops "pilot" and moves its `last_updated` |
| Zhejiang's minsu security rules at tier 1 | 浙江省民宿（农家乐）治安消防管理暂行规定 (浙公通字〔2016〕60号, 25 August 2016, gat.zj.gov.cn art_1229098253_600331) timed out on 13 October 2026, so the guesthouse registration piece rests on the 2022 national measures and a 2019 China Rural Net report instead | Next run that reaches gat.zj.gov.cn: fetch, run both checks, and add it to the ledger and the piece's citations if it still stands |
| Deqing metered taxi tariff | `/plan/getting-a-car-back-down/` prints taxi fares only as dated reports (RMB 60 and RMB 50 to 100 in 2019, about RMB 100 in our desk research of August 2026), because no county tariff (起步价, 每公里运价) for Deqing's metered taxis could be found at any tier on 16 October 2026 | At each quarterly volatile revision: search deqing.gov.cn, the county development and reform bureau (发改局) and 德清新闻网 for 出租车 运价 or 起步价; when a dated tier 1 or 2 tariff is read twice, add it to that page's fare table and to `/getting-here/deqing-station/`, and delete this row |
| Domestic eSIM for foreign visitors | China Mobile's eSIM booking (Jingchu Net, 21 September 2025) excluded overseas users (境外用户) for now; nothing later found as of 20 October 2026. `/plan/esim-vpn-and-data-on-the-mountain/` says a China eSIM for a visitor means a travel eSIM bought abroad | Quarterly with the volatile revision: search 10086.cn, 德清新闻网 and Xinhua for eSIM 境外用户 or 护照 开通; when any operator opens eSIM to passport holders, update that page's eSIM section and table and move its `last_updated` |

## Revision cadence by freshness tier (Part 2.5)

| Tier | Pages | Cadence |
|---|---|---|
| volatile | Tickets, shuttle, transport, entry rules, opening hours, car ban, station | Quarterly, plus before each Golden Week |
| semi-stable | Villages, stays, seasons, itineraries, food, trails | Twice a year |
| evergreen | History, the sword legend, the 1984 conference, essays | Annually or never |

The `npm run revisions` queue of Part 2.5 does not exist yet. Until it does,
the quarterly revision is a manual pass over every `volatile` row in
`schedule.csv` and every existing volatile page, logged like any other run.
