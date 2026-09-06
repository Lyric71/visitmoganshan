# Run log: YYYY-MM-DD

One log per run day. Where two rows were due, one section per row.

| Field | Value |
|---|---|
| Brief | 000 (or DYYYY-WW) |
| Output | output/slug.md |
| URL | /section/slug/ |
| Body word count | |
| Status reached | drafted / quality_passed / image_ready / published / blocked |
| Model | (must be the most capable available; say so per step) |

## Research note (written before iteration 1)

| Claim | Chinese source (publisher, 中文) | Tier | Date on page | URL | Check 1 | Check 2 |
|---|---|---|---|---|---|---|
| | | | | | pass / fail, date | pass / fail, date |

* Figures reused from the ledger:
* Leads from q1-facts-unverified.md that were verified, and which were not:
* Claims cut because they could not be sourced at their tier:
* Disagreements published rather than resolved:

## Iterations (createarticle)

Tracker as printed, with one line per iteration saying what changed. Note
explicitly that iteration 7 ran as the cadence variant. Note the check 2
results in iteration 8. Note where the three figure lines were placed in
iteration 12.

## Quality pass (content-quality-us)

Tracker as printed, 18 passes plus final. Note that the spelling pass ran as
a British consistency pass. Note any SEO field trimmed back to the house
ceiling afterward.

## Images

| Image | File | Attempts | What was wrong with rejected ones | Real life defects the kept one carries | Encoded size |
|---|---|---|---|---|---|
| Lead | public/images/guide/slug.webp | | | |
| Figure 2 | public/images/guide/slug-2.webp | | | |
| Figure 3 | | | | |
| Figure 4 | | | | |

* `npm run img:audit` result:

## Sources

* New figures added to the ledger:

## Flags

* TODO: affiliate slug items:
* TODO: GPX or map items:
* Conflicts between the brief and the live site:
* Pages this piece affects (evergreen pages that now need an edit):

## SEO counts (after the quality pass)

| Field | Chars or words | Ceiling | Pass |
|---|---|---|---|
| seo_title | | 60 | |
| meta_description | | 155 | |
| excerpt | | 40 words | |

## Dispatch (when the row is a dispatch)

* Sweep sources checked, in order, with what each yielded:
* Items kept and the triage test each passed:
* Items dropped and why:
* Pages named in affects_pages:

## Publish (fill in when step 4 runs)

* Guide file written:
* Images confirmed:
* img:audit, dates:check, astro check, build:
* Commit and push:
* Resend email: yes / no (reason)
* Runbook substitutions (what the repo could not do, what was used instead):
