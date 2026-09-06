# Visit Moganshan editorial system

The 52 week editorial plan for visitmoganshan.com and the specs Claude Code
drafts it from: 122 core pieces, one every three days, and 52 weekly
dispatches, every Thursday, from 14 September 2026 to 12 September 2027.
Lives in `editorial/` inside the repo so the pipeline can publish straight
into `src/content/guide/`.

Wired the same way as the TheRedScroll and TheChinaPath pipelines on this
machine: a schedule, a brief per slot, a house `createarticle` skill, the
18 pass quality loop, generated imagery, a run log, a source ledger, two
Windows scheduled tasks and an email when a piece goes live.

## Start here

1. `RUNBOOK.md` for the daily process, the calendar exceptions and the
   automation.
2. `CLAUDE.md` for voice, the standing rules and the corrections against the
   repo. Claude Code loads it when it works in this folder.
3. `SPEC.md` for the output contract and the definition of done.
4. `../content-drafts/moganshan-build-spec_1.md`, the master plan. The briefs
   are generated from its Part 6 and Part 7.

## Layout

```
CLAUDE.md                 standing rules, pipeline, corrections against the repo
SPEC.md                   output contract
RUNBOOK.md                daily process and automation
schedule.csv              174 rows, date to brief, status tracking
briefs/                   122 per slot briefs, named by publish date
briefs/templates/         the dispatch template
sources/
  site-profile.md         cached site fetch, refresh monthly
  verified-sources.md     the source ledger, read before researching
  source-tiers.md         which chain each fact type follows, the weekly sweep, the fixtures, the watch items
  q1-facts-unverified.md  figures gathered before the plan, leads only
output/                   finished drafts land here
logs/                     one run log per day, TEMPLATE.md to copy
logs/runs/                runner console output, gitignored
scripts/
  build-briefs.mjs        regenerates briefs/ and schedule.csv from the master plan
  run-daily.ps1           the runner, draft or publish mode
  register-tasks.ps1      creates the two scheduled tasks
  notify-publish.mjs      the Resend email
```

## The daily command

```
Draft every row that is due.
```

## The pipeline

Chinese deep research with source tiers (every source validated twice), the
house `/createarticle`, `/content-quality-us` under the British English
override, `/generate-image-openai` for the lead and three body figures, then
the publish step from the scheduled task the next morning, then an email.
`CLAUDE.md` has the table.

## The rules people get wrong

* The upstream CreateArticle skill tells you to plant deliberate typos. This
  project forbids it. The house copy at `.claude/skills/createarticle/` runs
  a cadence pass instead.
* The quality skill is written for American English. This site is British.
  The override in `CLAUDE.md` wins.
* One image is not enough. Four per article, no faces, no caption that
  asserts a named place.
* Prices, closures and policy never come from an OTA.
* A week with no news is still a dispatch.
