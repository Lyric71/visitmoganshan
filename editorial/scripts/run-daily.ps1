<#
.SYNOPSIS
  Runs the Visit Moganshan editorial pipeline through the local Claude Code CLI.

.DESCRIPTION
  Local by design, like the TheRedScroll and TheChinaPath pipelines on this
  machine: the user level skills (content-quality-us, generate-image-openai),
  the house createarticle skill, the .env keys and the full model are all
  here. A cloud routine has none of them.

  Modes:
    draft    "Draft the next row in the queue." Steps 0 to 3 of the pipeline
             on one core row: a row an interrupted run left at drafted or
             quality_passed, else the next not_started core row in
             publish_date order, whatever its date. Plus the week's dispatch
             once its week has come (the evening before its Thursday, or
             later if missed). Stops at image_ready. Runs every evening.
             Then check-queue.mjs mails Cyril when drafting stalls, a
             finished row sits unpublished or the queue runs low.
    publish  Publishes every row whose status is image_ready, whatever its
             publish_date, then sends the Resend email. Runs every morning.
             The night between the two is the review window.

  publish_date orders the queue. It never gates a run, in either mode:
  until 10 October 2026 a core row was drafted only on the evening before its
  publish_date, so ready briefs sat idle two evenings in three and finished
  work waited on the calendar. The one exception is content tied to a real
  date: a weekly dispatch (content_type Dispatch) reports its own week, and a
  row whose notes say "Hold until YYYY-MM-DD" waits for an event, an
  announcement or the end of a year. Those are drafted no earlier than the
  evening before that date and published no earlier than that date.

  A run with nothing to do exits without starting Claude, and says why:
  the queue is empty, or every remaining row is held or blocked.

  Output of each run is written to editorial/logs/runs/<date>-<mode>.txt.
  Register with editorial/scripts/register-tasks.ps1.

.PARAMETER Mode
  draft (default) or publish.
#>
param(
  [ValidateSet('draft', 'publish')]
  [string]$Mode = 'draft',
  # Manual test run: ignore the plan start date.
  [switch]$Force,
  # Optional extra instructions appended to the prompt (for example a resume
  # note after an interrupted run).
  [string]$Extra = '',
  # Run one row only, by brief_id, ignoring its hold date and the plan
  # start. The way to test the pipeline on a single piece.
  [string]$Only = ''
)

$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $Repo

$Stamp = Get-Date -Format 'yyyy-MM-dd'
$RunLogDir = Join-Path $Repo 'editorial\logs\runs'
New-Item -ItemType Directory -Force $RunLogDir | Out-Null
$RunLog = Join-Path $RunLogDir "$Stamp-$Mode.txt"

# The plan starts 14 September 2026. The first draft run is the evening of
# 13 September. Nothing runs before that.
$PlanStart = Get-Date '2026-09-13'
if (-not $Force -and -not $Only -and (Get-Date).Date -lt $PlanStart) {
  "$(Get-Date -Format s) before plan start, nothing to do" | Out-File $RunLog -Encoding utf8
  exit 0
}

# The queue watchdog: after every draft run, including one with nothing to
# do. It mails at most once a day and never fails the run.
function Invoke-QueueCheck {
  if ($Mode -ne 'draft') { return }
  $Queue = & cmd.exe /d /c "node editorial\scripts\check-queue.mjs 2>&1"
  "$(Get-Date -Format s) queue: $($Queue -join ' ')" | Out-File $RunLog -Append -Encoding utf8
}

# The date a time bound row is held until, or $null. A weekly dispatch reports
# its own week, so it waits for its publish_date; any other row waits only
# when its notes carry "Hold until YYYY-MM-DD". check-queue.mjs applies the
# same rule.
function Get-HoldDate($Row) {
  if ($Row.content_type -eq 'Dispatch') { return ([datetime]$Row.publish_date).Date }
  if ($Row.notes -match 'Hold until (\d{4}-\d{2}-\d{2})') { return ([datetime]$Matches[1]).Date }
  return $null
}
function Test-Released($Row, [datetime]$Limit) {
  $Hold = Get-HoldDate $Row
  return (-not $Hold -or $Hold -le $Limit)
}

# Read the schedule and pick the rows. publish_date orders the queue; it is
# never a reason to skip a row or end a run.
#   draft:   a core row an interrupted run left at drafted or quality_passed;
#            else the next not_started core row, whatever its date. Plus every
#            dispatch whose week has come (hold date tomorrow or earlier),
#            not_started or left half done. Blocked and held rows are skipped.
#   publish: every image_ready row that is not held, whatever its date.
$Schedule = @(Import-Csv (Join-Path $Repo 'editorial\schedule.csv') | Sort-Object publish_date, brief_id)
$Today = (Get-Date).Date
$Tomorrow = $Today.AddDays(1)
if ($Only) {
  $Due = @($Schedule | Where-Object { $_.brief_id -eq $Only })
} elseif ($Mode -eq 'draft') {
  $Core = @($Schedule | Where-Object { $_.content_type -ne 'Dispatch' })
  $Next = @($Core | Where-Object { $_.status -in 'drafted', 'quality_passed' })
  if (-not $Next) {
    $Next = @($Core | Where-Object {
      $_.status -eq 'not_started' -and (Test-Released $_ $Tomorrow)
    } | Select-Object -First 1)
  }
  $Dispatches = @($Schedule | Where-Object {
    $_.content_type -eq 'Dispatch' -and
    $_.status -in 'not_started', 'drafted', 'quality_passed' -and
    (Test-Released $_ $Tomorrow)
  })
  $Due = @(@($Next) + @($Dispatches) | Where-Object { $_ } | Sort-Object publish_date, brief_id)
} else {
  $Due = @($Schedule | Where-Object {
    $_.status -eq 'image_ready' -and (Test-Released $_ $Today)
  })
}
if (-not $Due) {
  $Left = @($Schedule | Where-Object { $_.status -notin 'published', 'image_ready', 'blocked' })
  if ($Mode -eq 'publish') {
    $Why = 'no image_ready row to publish'
  } elseif (-not $Left) {
    $Why = 'the queue is empty: every row is published, finished or blocked'
  } else {
    $Why = "no row is draftable: the $($Left.Count) rows left are held until their date"
  }
  "$(Get-Date -Format s) nothing to do for ${Mode}: $Why" | Out-File $RunLog -Encoding utf8
  Invoke-QueueCheck
  exit 0
}
$DueIds = ($Due | ForEach-Object { $_.brief_id }) -join ', '

# The shared runner uses: Opus 5.5, then Fable, GPT-6 Astra and GPT-5.6 Sol as fallbacks.
$Model = 'claude-opus-5-5'

if ($Mode -eq 'draft') {
  $Prompt = @"
Draft the next row in the queue.

Read editorial/CLAUDE.md, editorial/SPEC.md and editorial/RUNBOOK.md first and
follow them exactly. The rows for tonight, by brief_id in
editorial/schedule.csv, are: $DueIds. The runner picked them: the next core
row in publish_date order WHATEVER ITS PUBLISH_DATE (that column orders the
queue, it is not a release date, and a future date is never a reason to skip
a row or end the run), or the row an interrupted run left half done, plus the
dispatch whose week has come. Draft exactly these. Take them in publish_date
order, one at a time, the full pipeline on each before starting the next. A
row that resumes at drafted or quality_passed continues from the step it
reached. For a core slot,
run steps 0 to 3: Chinese deep research with the source tiers applied and
every source validated twice, the house /createarticle from the brief file,
/content-quality-us on the finished draft with the British English override,
then /generate-image-openai for the lead image and the three body figures,
each looked at and encoded again under the audit caps. For a dispatch row, run
the Wednesday sweep from editorial/sources/source-tiers.md and draft from
briefs/templates/dispatch.md, then /content-quality-us on it like any other
piece; a week with nothing material is still a dispatch. No row reaches
image_ready without the quality pass. Apply the blocking conditions: a diary item whose source document
has not appeared, or a piece whose central figure cannot be sourced from the
written record (nobody walks or phones) is set to blocked with the
reason in notes, and nothing more is drafted for it. Update
editorial/schedule.csv and write the run log. Stop at image_ready. Do not
publish. Do not build. Do not commit. This run is unattended: never ask a
question, decide from the specs and note the decision in the run log.
"@
} else {
  $Prompt = @"
Publish every reviewed draft that is due.

Read editorial/CLAUDE.md, editorial/SPEC.md and editorial/RUNBOOK.md first.
The rows due, by brief_id in editorial/schedule.csv, are: $DueIds. For each
one, in publish_date order, run the publish step from RUNBOOK.md: first
confirm the row has a quality_passed_on date (a row without one has not been
through /content-quality-us; set it back to drafted with the reason in notes
and do not publish it), then move the
output file into src/content/guide under its flat file name with the guide
frontmatter (or, for a dispatch, into the place CLAUDE.md names for
dispatches today), confirm the four images are in public/images/guide and
referenced from the file, set published and last_updated to today's date in Shanghai, the day this run
publishes it, never the row's publish_date (a row can publish before its
publish_date, which only orders the queue, and dates:check refuses a future
date), then run npm run img:audit, npm run dates:check, npm run check
and npm run build. This scheduled publish run is the explicit request for a
build that the root CLAUDE.md requires. When all four pass: set the row to
published with published_on, git add everything the piece touched (the guide
file, the four images, any evergreen page a dispatch updated, editorial/output,
editorial/logs, editorial/schedule.csv, editorial/sources) and commit on main
with a conventional commit message (feat(guide): publish <slug>, or
feat(news): publish dispatch <week>), then git push origin main. Only after
the push succeeds, run node editorial/scripts/notify-publish.mjs with the
slug, title, build result, log path and the commit hash in --note. Do not
pass --url: the script reads the URL from the guide file by slug, and Git
Bash rewrites a leading slash into a Windows path.
This run is unattended: never ask a question. If any check, the build or the
push fails, do not commit (or do not push), leave the row at image_ready, put
the error in the run log and send the email with --build failed and the error
in --note.
"@
}

if ($Extra) {
  $Prompt += "`n`nADDITIONAL INSTRUCTIONS FROM THE OPERATOR: $Extra"
}

if ($Force -or $Only) {
  $Prompt += "`n`nMANUAL TEST RUN: started by hand with -Force or -Only. Say in the run log that this was a forced test run."
  $RunLog = Join-Path $RunLogDir "$Stamp-$Mode-forced.txt"
}

"$(Get-Date -Format s) start $Mode (model $Model) rows: $DueIds" | Out-File $RunLog -Encoding utf8

# The prompt goes in through stdin from a file, and both output streams go
# straight to the log through cmd.exe. PowerShell 5.1 turns native stderr into
# terminating errors under Stop, which killed earlier runs before they logged.
$PromptFile = Join-Path $RunLogDir "$Stamp-$Mode.prompt.txt"
[System.IO.File]::WriteAllText($PromptFile, $Prompt, (New-Object System.Text.UTF8Encoding($false)))
$AgentRunner = 'C:\Users\cyril\Project\automation\scripts\Invoke-ProjectAgent.ps1'
$Code = & $AgentRunner -Repo $Repo -PromptFile $PromptFile -RunLog $RunLog -RunName "VisitMoganshan $Mode"

"$(Get-Date -Format s) end $Mode exit $Code" | Out-File $RunLog -Append -Encoding utf8
Invoke-QueueCheck
exit $Code
