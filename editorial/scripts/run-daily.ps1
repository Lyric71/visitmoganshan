<#
.SYNOPSIS
  Runs the Visit Moganshan editorial pipeline through the local Claude Code CLI.

.DESCRIPTION
  Local by design, like the TheRedScroll and TheChinaPath pipelines on this
  machine: the user level skills (content-quality-us, generate-image-openai),
  the house createarticle skill, the .env keys and the full model are all
  here. A cloud routine has none of them.

  Modes:
    draft    "Draft every row that is due." Steps 0 to 3 of the pipeline for
             every schedule.csv row whose publish_date is tomorrow (or earlier
             and still not started). Stops at image_ready. Runs every evening;
             the calendar decides whether there is anything to do. A core
             piece falls every third day, a dispatch every Wednesday evening
             for Thursday.
    publish  Publishes every row whose status is image_ready and whose
             publish_date is today or earlier, then sends the Resend email.
             Runs every morning. The night between the two is the review
             window.

  Both modes read schedule.csv first and exit without starting Claude when
  nothing is due, so an idle evening costs nothing.

  Output of each run is written to editorial/logs/runs/<date>-<mode>.txt.
  Register with editorial/scripts/register-tasks.ps1.

.PARAMETER Mode
  draft (default) or publish.
#>
param(
  [ValidateSet('draft', 'publish')]
  [string]$Mode = 'draft',
  # Manual test run: ignore the plan start date and the date filters.
  [switch]$Force,
  # Optional extra instructions appended to the prompt (for example a resume
  # note after an interrupted run).
  [string]$Extra = '',
  # Run one row only, by brief_id, ignoring the date filters and the plan
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

# Read the schedule and decide whether Claude has anything to do today. A
# draft is due when the row publishes tomorrow, or when it publishes today or
# earlier and was never started (a missed evening). A publish is due when the
# row is image_ready and its date has arrived.
$Schedule = Import-Csv (Join-Path $Repo 'editorial\schedule.csv')
$Today = (Get-Date).Date
$Tomorrow = $Today.AddDays(1)
if ($Only) {
  $Due = $Schedule | Where-Object { $_.brief_id -eq $Only }
} elseif ($Mode -eq 'draft') {
  $Due = $Schedule | Where-Object {
    $_.status -eq 'not_started' -and (
      $Force -or ([datetime]$_.publish_date).Date -le $Tomorrow
    )
  }
} else {
  $Due = $Schedule | Where-Object {
    $_.status -eq 'image_ready' -and (
      $Force -or ([datetime]$_.publish_date).Date -le $Today
    )
  }
}
if (-not $Due) {
  "$(Get-Date -Format s) nothing due for $Mode" | Out-File $RunLog -Encoding utf8
  exit 0
}
$DueIds = ($Due | ForEach-Object { $_.brief_id }) -join ', '

# Always the best available model. Never a faster or smaller mode.
$Model = 'claude-fable-5-1'

if ($Mode -eq 'draft') {
  $Prompt = @"
Draft every row that is due.

Read editorial/CLAUDE.md, editorial/SPEC.md and editorial/RUNBOOK.md first and
follow them exactly. The rows due tonight, by brief_id in
editorial/schedule.csv, are: $DueIds. Take them in publish_date order, one at
a time, the full pipeline on each before starting the next. For a core slot,
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
referenced from the file, set published and last_updated to the row's
publish_date, then run npm run img:audit, npm run dates:check, npm run check
and npm run build. This scheduled publish run is the explicit request for a
build that the root CLAUDE.md requires. When all four pass: set the row to
published with published_on, git add everything the piece touched (the guide
file, the four images, any evergreen page a dispatch updated, editorial/output,
editorial/logs, editorial/schedule.csv, editorial/sources) and commit on main
with a conventional commit message (feat(guide): publish <slug>, or
feat(news): publish dispatch <week>), then git push origin main. Only after
the push succeeds, run node editorial/scripts/notify-publish.mjs with the
slug, title, url, build result, log path and the commit hash in --note.
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
  $Prompt += "`n`nMANUAL TEST RUN: the date filters were ignored. Say in the run log that this was a forced test run."
  $RunLog = Join-Path $RunLogDir "$Stamp-$Mode-forced.txt"
}

"$(Get-Date -Format s) start $Mode (model $Model) rows: $DueIds" | Out-File $RunLog -Encoding utf8

# The prompt goes in through stdin from a file, and both output streams go
# straight to the log through cmd.exe. PowerShell 5.1 turns native stderr into
# terminating errors under Stop, which killed earlier runs before they logged.
$PromptFile = Join-Path $RunLogDir "$Stamp-$Mode.prompt.txt"
[System.IO.File]::WriteAllText($PromptFile, $Prompt, (New-Object System.Text.UTF8Encoding($false)))
$Claude = (Get-Command claude).Source
$Cmd = "type `"$PromptFile`" | `"$Claude`" -p --model $Model --dangerously-skip-permissions --output-format text >> `"$RunLog`" 2>&1"
# Retry on transient API failures (overloaded, rate limited, 5xx). Up to
# three attempts, five minutes apart. Never fall back to a smaller model.
$MaxAttempts = 3
$Attempt = 0
do {
  $Attempt++
  if ($Attempt -gt 1) {
    "$(Get-Date -Format s) retry $Attempt of $MaxAttempts after a transient API error, waiting 5 minutes" | Out-File $RunLog -Append -Encoding utf8
    Start-Sleep -Seconds 300
  }
  $ErrorActionPreference = 'Continue'
  & cmd.exe /d /c $Cmd
  $Code = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
  $Tail = (Get-Content $RunLog -Tail 5 -ErrorAction SilentlyContinue) -join "`n"
  $Transient = $Code -ne 0 -and $Tail -match 'API Error: (529|500|502|503|504|429)|Overloaded|overloaded_error|rate limit'
} while ($Transient -and $Attempt -lt $MaxAttempts)

"$(Get-Date -Format s) end $Mode exit $Code" | Out-File $RunLog -Append -Encoding utf8
exit $Code
