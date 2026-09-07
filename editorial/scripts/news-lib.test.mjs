// Unit tests for the pure logic of the news layer. Run with `npm run news:test`
// (node --test, no test runner to install). What is tested is exactly the
// surface that decides whether an item is seen, dated, kept or refused.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import {
  bodyProblems,
  canonicalUrl,
  dateFromUrl,
  detectCharset,
  draftFrontmatterSchema,
  extractLinks,
  matchTitle,
  newsPath,
  scoreCandidate,
  slugify,
  titleHash,
  validateRegistry,
} from './news-lib.mjs';

const registry = JSON.parse(readFileSync(new URL('../news/sources.json', import.meta.url), 'utf8'));

test('the shipped registry validates', () => {
  assert.doesNotThrow(() => validateRegistry(registry));
});

test('canonicalUrl drops tracking, sorts params, strips www and the fragment', () => {
  assert.equal(
    canonicalUrl('https://www.Example.com/a/?utm_source=x&b=2&a=1#top'),
    'https://example.com/a/?a=1&b=2',
  );
  assert.equal(canonicalUrl('https://example.com/path/'), 'https://example.com/path');
  assert.equal(canonicalUrl('not a url'), 'not a url');
});

test('titleHash converges for the same event and diverges for another', () => {
  assert.equal(titleHash('莫干山门票明年涨价'), titleHash('明年莫干山门票将涨价'));
  assert.notEqual(titleHash('莫干山门票明年涨价'), titleHash('莫干山民宿大会开幕'));
});

test('dateFromUrl reads the registry patterns', () => {
  const dq = registry.sources.find((s) => s.id === 'dqnews');
  assert.equal(
    dateFromUrl('https://dqnews.zjol.com.cn/dqnews/system/2026/09/05/034567890.shtml', dq.articlePattern, dq.dateFromUrl),
    '2026-09-05',
  );
  const zj = registry.sources.find((s) => s.id === 'zjol-huzhou');
  assert.equal(
    dateFromUrl('https://zjnews.zjol.com.cn/zjnews/huzhounews/202609/t20260903_12345.shtml', zj.articlePattern, zj.dateFromUrl),
    '2026-09-03',
  );
  const hz = registry.sources.find((s) => s.id === 'hangzhou-daily');
  assert.equal(
    dateFromUrl('https://hznews.hangzhou.com.cn/chengshi/content/2026-09/04/content_1.htm', hz.articlePattern, hz.dateFromUrl),
    '2026-09-04',
  );
  assert.equal(
    dateFromUrl('https://hzdaily.hangzhou.com.cn/hzrb/2026/09/02/article_detail_1_2A03.html', hz.articlePattern, hz.dateFromUrl),
    '2026-09-02',
  );
  assert.equal(dateFromUrl('https://example.com/2026/13/40/x.html', '(\\d{4})/(\\d{2})/(\\d{2})', { yearGroup: 1, monthGroup: 2, dayGroup: 3 }), null);
});

test('matchTitle refuses the Shanghai road before it accepts the mountain', () => {
  const k = registry.keywords;
  assert.equal(matchTitle('上海莫干山路M50园区开放', 'core', k).keep, false);
  assert.equal(matchTitle('莫干山路新画廊开幕', 'all', k).keep, false);
  assert.deepEqual(matchTitle('莫干山民宿大会举行', 'core', k), { keep: true, matched: '莫干山', noise: null });
  assert.equal(matchTitle('庾村咖啡节', 'core', k).keep, false);
  assert.equal(matchTitle('庾村咖啡节', 'all', k).matched, '庾村');
  assert.equal(matchTitle('无关新闻', 'none', k).keep, true);
});

test('extractLinks resolves relative hrefs and reads the text or the title', () => {
  const html = `
    <a href="/dqnews/system/2026/09/05/034567890.shtml"><img src=x.jpg></a>
    <a href='/dqnews/system/2026/09/05/034567890.shtml' title="标题">  莫干山 <b>开茶</b> </a>
    <a href="javascript:void(0)">x</a>
    <a href="#top">top</a>`;
  const links = extractLinks(html, 'https://dqnews.zjol.com.cn/dqnews/ssdq/stly/');
  assert.equal(links.length, 2);
  assert.equal(links[0].href, 'https://dqnews.zjol.com.cn/dqnews/system/2026/09/05/034567890.shtml');
  assert.equal(links[0].title, '');
  assert.equal(links[1].title, '莫干山 开茶');
});

test('detectCharset prefers the header, then the meta, then utf-8', () => {
  assert.equal(detectCharset('text/html; charset=gb2312', Buffer.from('')), 'gb18030');
  assert.equal(detectCharset('text/html', Buffer.from('<meta charset="GBK">')), 'gb18030');
  assert.equal(detectCharset(null, Buffer.from('<html>')), 'utf-8');
});

test('scoreCandidate: fresh tier 1 beats old tier 3, reprises cap at five', () => {
  const now = new Date('2026-09-07T00:00:00Z');
  const fresh = scoreCandidate({ date: '2026-09-06', tier: 1, now });
  const old = scoreCandidate({ date: '2026-08-30', tier: 3, now });
  assert.ok(fresh > old);
  assert.equal(
    scoreCandidate({ date: '2026-09-06', tier: 1, seenCount: 9, now }),
    scoreCandidate({ date: '2026-09-06', tier: 1, seenCount: 6, now }),
  );
});

test('slugify caps at eight ASCII words', () => {
  assert.equal(slugify('Moganshan tickets: what you pay, what you do not, and why'), 'moganshan-tickets-what-you-pay-what-you-do');
  assert.equal(slugify('莫干山'), 'news');
});

const good = {
  title: 'Moganshan shuttle runs to 21:30 through the summer season',
  meta_description: 'The Moganshan scenic area shuttle now runs until 21:30 on summer evenings, an hour later than the printed timetable.',
  standfirst: 'The last bus down from the hill station now leaves at 21:30 on summer evenings, later than any timetable a visitor will find in English.',
  kind: 'item',
  topics: ['transport'],
  author: 'cyril-drouin',
  published: '2026-09-07',
  event_date: '2026-09-05',
  consequence: 'A visitor staying in the villages can eat on the mountain and still get down without a taxi.',
  sources: [{ name: '德清新闻网', name_en: 'Deqing News', url: 'https://dqnews.zjol.com.cn/x.shtml', date: '2026-09-05', tier: '2' }],
};

test('draft frontmatter: the shape the collection accepts', () => {
  assert.ok(draftFrontmatterSchema.safeParse(good).success);
  assert.equal(draftFrontmatterSchema.safeParse({ ...good, event_date: undefined }).success, false);
  assert.equal(draftFrontmatterSchema.safeParse({ ...good, sources: [] }).success, false);
  assert.equal(draftFrontmatterSchema.safeParse({ ...good, consequence: 'The shuttle runs later now, which is nice.' }).success, false);
  assert.equal(draftFrontmatterSchema.safeParse({ ...good, kind: 'dispatch' }).success, false);
  assert.ok(draftFrontmatterSchema.safeParse({ ...good, kind: 'dispatch', week: '2026-38' }).success);
});

test('bodyProblems catches the house rules', () => {
  const filler = 'The shuttle timetable changed on the mountain this week and the change matters. '.repeat(12);
  assert.deepEqual(bodyProblems(filler), []);
  assert.ok(bodyProblems(`${filler} A dash — here.`).some((p) => p.includes('em dash')));
  assert.ok(bodyProblems(`${filler} [book](/go/moganshan-1)`).some((p) => p.includes('/go/')));
  assert.ok(bodyProblems(`${filler} It costs $40.`).some((p) => p.includes('dollar')));
  assert.ok(bodyProblems('Too short.').some((p) => p.includes('floor')));
});

test('newsPath: items by year and month, dispatches by week', () => {
  assert.equal(newsPath(good, 'shuttle-runs-later'), '/journal/news/2026/09/shuttle-runs-later');
  assert.equal(newsPath({ ...good, kind: 'dispatch', week: '2026-38' }, 'x'), '/journal/news/dispatch/2026-38');
});
