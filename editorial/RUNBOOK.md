# Runbook

One core piece every three days and one dispatch every Thursday, from
14 September 2026 to 12 September 2027. 122 core slots, 52 dispatches, 174
rows in `schedule.csv`.

## The daily command

Open Claude Code at the repo root and paste:

```
Draft every row that is due.
```

That is the whole prompt. `CLAUDE.md` tells Claude what "due" means: any row
whose `publish_date` is tomorrow, or earlier and still `not_started`. To draft
a specific slot:

```
Draft brief 003.
```

To publish a reviewed draft:

```
Publish private-car-ban
```

## What Claude does, in order

1. Reads `CLAUDE.md` and `SPEC.md`.
2. Finds the due rows in `schedule.csv`, takes them in date order, one full
   pipeline each. A row that is `blocked` is skipped and said so.
3. Reads the brief file (or `briefs/templates/dispatch.md`).
4. Reads `sources/site-profile.md` instead of fetching the site, unless the
   profile is more than a month old.
5. Reads `sources/verified-sources.md` and reuses any figure logged, in shelf
   life and verified twice. Reads `sources/source-tiers.md` for the chain
   each fact type must follow.
6. Runs deep research in Chinese for every figure still missing. Validates
   each source (check 1). Writes the research note into the run log. No body
   copy before this.
7. Runs the house `/createarticle` (13 iterations, iteration 7 as the cadence
   variant, iteration 8 fetching every cited URL again for check 2), printing
   the tracker. Writes `output/<slug>.md` in the guide file shape.
8. Runs `/content-quality-us` on the file (18 passes, in place) with the
   British English override. Recounts the SEO fields afterwards.
9. Runs `/generate-image-openai` four times from the IMAGES block, opens each
   PNG, regenerates any that fail the bar, encodes each into
   `public/images/guide/`, runs `npm run img:audit`.
10. Appends new figures to `sources/verified-sources.md` with both check
    dates and the tier.
11. Updates the `schedule.csv` row: status `image_ready`, with `drafted_on`,
    `quality_passed_on` and `image_generated_on` filled.
12. Writes `logs/YYYY-MM-DD.md`.

Then it stops. The publish task picks the row up the next morning, or a
person asks for it.

For a dispatch row the same shape applies with the Wednesday sweep in place
of the brief research and no image step. The quality pass is not skipped:
every piece of content, dispatches included, runs through
`/content-quality-us` before it can be `image_ready`.

## Publishing a reviewed draft

`Publish <slug>` (or the scheduled publish run) does this, in order, and only
continues when each step passes:

1. Copies `output/<slug>.md` to `src/content/guide/<flat-name>.md` where the
   flat name is the frontmatter `url` with slashes turned into hyphens. The
   three appended HTML comment blocks are stripped. Everything else is
   verbatim.
2. Confirms `public/images/guide/<slug>.webp` and `-2`, `-3`, `-4` exist and
   are referenced from the file.
3. Checks the row has a `quality_passed_on` date. A row without one has not
   been through `/content-quality-us` and is not published; it goes back to
   `drafted` with the reason in `notes`.
4. Sets `published` and `last_updated` to the row's `publish_date`. The
   pre push hook refuses a date in the future, which is why the publish runs
   on the morning of that date and not the evening before.
5. For a dispatch, does what `CLAUDE.md` "Where a dispatch goes today" says,
   and edits any page named in `affects_pages`, moving its `last_updated`.
6. `npm run img:audit`, `npm run dates:check`, `npm run check`, then
   `npm run build`. The scheduled publish run is the explicit request for a
   build that the root `CLAUDE.md` requires; nothing else in this pipeline
   builds.
7. Sets the row to `published` with `published_on`.
8. `git add` of everything the piece touched (the guide file, the four
   images, any evergreen page a dispatch updated, `editorial/output`,
   `editorial/logs`, `editorial/schedule.csv`, `editorial/sources`), one
   commit on main (`feat(guide): publish <slug>` or
   `feat(news): publish dispatch <week>`), `git push origin main`. Vercel
   deploys from main, so the push is what puts the piece live.
9. `node editorial/scripts/notify-publish.mjs` with the slug, the title, the
   URL, the build result, the log path and the commit hash in `--note`.

A failed audit, date check, `astro check` or build means no commit, no push,
the row stays at `image_ready`, and the email reports the failure with the
error in `--note`.

Nothing publishes itself without a run of this step. Drafts wait in `output/`
until the scheduled task or a person moves them.

## The rhythm

| Track | When | Draft run | Publish run |
|---|---|---|---|
| Core slot n | 14 September 2026 plus 3 x (n minus 1) days | the evening before, 19:30 | that morning, 06:00 |
| Weekly dispatch | every Thursday from 17 September 2026 | Wednesday 19:30, after the sweep | Thursday 06:00 |

Seasonal pieces publish four to six weeks before the season they describe.
Slots may be swapped within a quarter to follow news or weather. Never move
a seasonal slot across quarters. A swap is two edits to `publish_date` in
`schedule.csv` and a rename of the two brief files.

## Production order differs from publication order

Part 8 of the master plan:

* **Nothing is drafted by hand.** The master plan asks for slot 3 (tickets)
  to be produced first because its verification chain feeds five other
  pieces. The runner drafts in calendar order instead, and the ledger carries
  the tickets figures forward from the evening slot 3 is drafted. Slots 1 and
  2 cite the tier 1 tariff sources directly; slot 3 publishes the
  disagreement in full.
* **No field trips and no phone calls.** The master plan wanted six slots
  walked (2, 10, 11, 13, 28, 34) and four confirmed by phone (3, 13, 22, 27).
  Nobody walks and nobody calls (Cyril, 6 September 2026). Those slots are
  desk written from the published Chinese record, say so in the text, never
  claim a route was walked or a number was rung, and print the disagreement
  where only a call would settle it. Their briefs carry the wording.

## Dates that break the rhythm

| When | What | What to do |
|---|---|---|
| 25 to 27 September 2026 | Mid Autumn Festival | Nothing changes; slots 4 and 5 run on schedule. |
| 1 to 7 October 2026 | National Day Golden Week | Slots 7, 8 and 9 fall inside it and run on schedule. Slot 4 (the crowd calendar) must be live by 23 September. The Golden Week programme drops around 28 September; that week's dispatch carries it. |
| 20 January 2027 | The annual sports presser | Slot 42 (race calendar) publishes 15 January, before the presser usually lands. If the article has not appeared, the row blocks; reslot it to the next free date inside Q2 and let the dispatch carry the presser. |
| 10 February 2027 | The ten openings document | Slot 48 publishes 2 February, same rule. |
| 6 February 2027 | Spring Festival 2027 | Slot 31 (Chinese New Year piece) publishes 13 December, well ahead. Slots 49 and 50 fall around the holiday and run on schedule. |
| 10 to 12 April 2027 | UTMB race weekend | Slot 65 publishes 25 March, two weeks out, as planned. |
| 31 December 2026 | Visa free scheme expiry with no extension announced | A standing watch item. Weekly from November. The dispatch carries whatever is announced the day it is announced. |

## Reviewing a draft

The night between the draft and the publish is the review window. Three
checks that catch most problems in under five minutes.

1. **Search the file for the em dash, the en dash and a hyphen between two
   spaces.** Zero results, or it goes back.
2. **Read every blockquote.** Each needs a publisher, a date, a tier and a
   URL. A blockquote citing an OTA for a price is a fail. Spot check two
   against the ledger: both check dates present, URL live.
3. **Read the first 200 words.** If a reader who stops there does not have
   the answer and does not know where Moganshan is, the opening is doing the
   wrong job.

Then check the length. Being 25 percent under target means a section was
skipped. Then open the four images in `public/images/guide/`. No face, no
text, no logo, no wrong season, and each caption true of its frame.

To hold a piece, set its row to `blocked` before 06:00 with the reason in
`notes`. To pause everything:

```
Disable-ScheduledTask -TaskName 'VisitMoganshan Editorial Publish'
```

## If something goes wrong

| Problem | What to do |
|---|---|
| A figure cannot be sourced at its tier | Claude cuts the claim and marks it. Decide whether the section still stands. |
| The central figure of a piece cannot be sourced | The row is `blocked`. Find the tier 1 or tier 2 written source, add it to the ledger, set `not_started`. Nobody phones. |
| A source fails check 2 | Claude fixes the citation or cuts the claim. Never ship a citation that failed the second fetch. |
| A diary item's document has not appeared | The row is `blocked`. Reslot inside the quarter. |
| Claude planted a typo | It ignored `CLAUDE.md` and the house skill. Point at the conflict section and rerun iteration 7. |
| The draft is in American English | The override in `CLAUDE.md` was skipped. Rerun the quality pass with the override named. |
| The draft reads generic | The angle was skipped. Rerun with `Reread the angle in the brief and rewrite.` |
| Two articles cite the same figure differently | The ledger was not updated. Fix the ledger, then both files. |
| An image has a face, text, a logo, the wrong season | Regenerate. Never wire in an unchecked image. |
| Image generation fails | Check `OPENAI_API_KEY` in `.env.local`. Retry once with a lightly reworded prompt. Row stays at `quality_passed`. |
| `npm run img:audit` fails | An image is over 260 KB or 2000 px. Encode again with a lower `--webp-quality`, then `--max-width`. |
| `npm run dates:check` fails | `published` or `last_updated` is in the future or an edited page's date did not move. Fix the date; never move `published`. |
| A brief's affiliate slug does not exist | Expected until Phase 2a. The piece publishes without and the TODO is in the email. Add the slug to `PARTNER_LINKS` in `astro.config.mjs`, then add the link and move `last_updated`. |
| The build fails | No commit, no push, row stays `image_ready`, error in the email. Fix and rerun `Publish <slug>`. |
| No publish email arrived | Run the notify script again with `--dry-run` to see the payload, then without. Check `RESEND_API_KEY` in `.env.local`. |

## Automating it

The pipeline runs on Cyril's machine through Windows Task Scheduler and the
local Claude Code CLI, exactly as the TheRedScroll and TheChinaPath pipelines
do. Local on purpose: the user level skills, the house skill, the `.env.local` keys
and the full model are all here, and a cloud routine has none of them.

| Task | When (Shanghai) | What | Default |
|---|---|---|---|
| VisitMoganshan Editorial Draft | every day 19:30 | `run-daily.ps1 -Mode draft`: steps 0 to 3 for every row due tomorrow, stops at `image_ready` | enabled |
| VisitMoganshan Editorial Publish | every day 06:00 | `run-daily.ps1 -Mode publish`: publishes every `image_ready` row whose date has arrived, builds, commits, pushes, emails | enabled |

Both tasks read `schedule.csv` first and exit in a second when nothing is
due, so the daily trigger costs nothing on the two evenings in three with no
slot. The hours sit outside the other four pipelines on this machine
(ChinaWebFoundry 07:00 and 10:00, BBChien 09:00 and 13:00, TheRedScroll
11:00 and 13:00, TheChinaPath 15:00 and 17:30) so no two pipelines run the
Claude CLI at once.

Scripts live in `editorial/scripts/`. `register-tasks.ps1` creates or updates
both tasks. Each run writes its console output to
`logs/runs/<date>-<mode>.txt` next to the article run log. The machine has to
be on, or asleep with wake allowed, at the run time. A missed run fires as
soon as the machine is back.

**Sleep kills a run in progress.** A draft with four images takes an hour to
two, and an evening with two rows due takes longer. The machine must stay
awake from 19:30 until the draft finishes and be awake again at 06:00. Set
the power plan to never sleep on AC. The runner retries transient API errors
up to three times, five minutes apart, on the same model.

Runs use `--dangerously-skip-permissions` so nothing pauses for approval, and
pin the most capable model. Never lower the model to speed a run up.

Manual test runs:

```
powershell -ExecutionPolicy Bypass -File editorial\scripts\run-daily.ps1 -Mode draft -Force -Extra "Draft brief 003 only."
powershell -ExecutionPolicy Bypass -File editorial\scripts\run-daily.ps1 -Mode publish -Force
```

## Before the first run

1. **`.env.local` at the repo root** (already present, both keys set) with `OPENAI_API_KEY` (gpt-image-2 needs a
   verified OpenAI organisation) and `RESEND_API_KEY`. `.env.example` lists
   both. The scripts read `.env.local` first, then `.env`.
2. **`npm run hooks:install`** once per clone, so the pre push hook runs the
   image audit and the date check before a publish reaches origin. Note the
   known broken pre commit hook in the root `CLAUDE.md`; delete
   `scripts/hooks/pre-commit` before installing, or restore its missing
   module.
3. **Register the tasks**:
   `powershell -ExecutionPolicy Bypass -File editorial\scripts\register-tasks.ps1`.
4. **Seed `sources/verified-sources.md`** with any figure already trusted.
   Each seeded entry still needs its two check dates and a tier.
5. **The engineering the master plan wants before 14 September** (Phase 0a,
   0b, 1a) and before 17 September (1b, 1c, 1d). The pipeline does not
   depend on any of it to run: the schema tolerates the extra frontmatter,
   the dispatch has a home on the news page, and the affiliate slugs fall
   back to internal links. Each phase, when it ships, needs one edit here:
   Phase 0b, drop the note in `CLAUDE.md` about `freshness_tier` being
   ignored; Phase 1b, update "Where a dispatch goes today"; Phase 2a, update
   the affiliate slug table.
6. **Regenerate the briefs** after any edit to Part 6 of the master plan:
   `node editorial/scripts/build-briefs.mjs`. Status, dates and notes in
   `schedule.csv` survive the regeneration; brief files are rewritten.

## Refreshing the site profile

First working day of each month, or when a brief says the site has changed:

```
Refresh editorial/sources/site-profile.md from the repo and the live site.
```
