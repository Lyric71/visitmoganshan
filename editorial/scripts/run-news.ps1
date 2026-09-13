<#
.SYNOPSIS
  Runs the Visit Moganshan news layer: the sweep and drafting run, or the
  publish run. Registered as two Windows scheduled tasks by register-tasks.ps1.

.DESCRIPTION
  Modes:
    sweep    Runs editorial/scripts/sweep.mjs (the crawler, no model), then
             starts the local Claude Code CLI with the drafting prompt: read the
             triage file, apply the three tests and the verification chains,
             write at most the budget of drafts into editorial/news/drafts,
             each with its lead image, then send the "drafts to review" email.
             Nothing is published. Runs every morning; settings.json decides
             whether the sweep actually fetches (paused, gate).
    publish  Runs editorial/scripts/news-publish.mjs, a plain script with no
             model: moves every ready draft whose date has arrived into
             src/content/news, runs the four checks and the build, commits,
             pushes, emails. Runs every midday.
    poll     Every fifteen minutes. Pulls main and looks for request files in
             editorial/news/requests, written by the "Run the sweep now"
             button on /admin/news when the site is on Vercel. If any are
             there, removes them, commits and pushes that removal, then runs
             the sweep mode with -Force. Exits in a second when there is
             nothing, so the frequent trigger costs nothing.

  News drafts publish automatically after the sweep. An admin can later
  remove a live item with `node editorial/scripts/news-unpublish.mjs <slug>`.

  Both modes write their console output to editorial/logs/runs/<date>-news-<mode>.txt.

.PARAMETER Mode
  sweep (default) or publish.
#>
param(
  [ValidateSet('sweep', 'publish', 'poll')]
  [string]$Mode = 'sweep',
  # Ignore the paused flag and the gate in settings.json; for publish, ignore the date.
  [switch]$Force,
  # Extra instructions appended to the drafting prompt.
  [string]$Extra = ''
)

$ErrorActionPreference = 'Stop'
$Repo = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $Repo

$Stamp = Get-Date -Format 'yyyy-MM-dd'
$RunLogDir = Join-Path $Repo 'editorial\logs\runs'
New-Item -ItemType Directory -Force $RunLogDir | Out-Null
$RunLog = Join-Path $RunLogDir "$Stamp-news-$Mode$(if ($Force) {'-forced'} else {''}).txt"

if ($Mode -eq 'poll') {
  # Quiet unless there is something to do: a log line every fifteen minutes
  # would bury the runs that matter.
  $ErrorActionPreference = 'Continue'
  & git -C $Repo pull --ff-only --quiet origin main 2>&1 | Out-Null
  $ErrorActionPreference = 'Stop'
  $Requests = Get-ChildItem (Join-Path $Repo 'editorial\news\requests') -Filter '*.json' -ErrorAction SilentlyContinue
  if (-not $Requests) { exit 0 }
  $RunLog = Join-Path $RunLogDir "$Stamp-news-dashboard-requested.txt"
  "$(Get-Date -Format s) $($Requests.Count) dashboard request(s): $($Requests.Name -join ', ')" | Out-File $RunLog -Append -Encoding utf8
  $RunSweep = $false
  $ChangedPaths = @('editorial/news/requests')
  foreach ($Request in $Requests) {
    try {
      $Payload = Get-Content $Request.FullName -Raw | ConvertFrom-Json
      if ($Payload.kind -eq 'sweep') {
        $RunSweep = $true
      } elseif ($Payload.kind -eq 'review') {
        $Slug = [string]$Payload.slug
        $Action = [string]$Payload.action
        $Reason = [string]$Payload.reason
        if ($Slug -notmatch '^[a-z0-9][a-z0-9-]*$' -or $Action -ne 'unpublish') {
          throw "invalid review request"
        }
        "$(Get-Date -Format s) unpublish requested for $Slug" | Out-File $RunLog -Append -Encoding utf8
        & node editorial/scripts/news-unpublish.mjs $Slug 2>&1 | Out-File $RunLog -Append -Encoding utf8
        if ($LASTEXITCODE -ne 0) { throw "news unpublish command exited $LASTEXITCODE" }
      } else {
        throw "unknown request kind $($Payload.kind)"
      }
    } catch {
      "$(Get-Date -Format s) could not apply $($Request.Name): $($_.Exception.Message)" | Out-File $RunLog -Append -Encoding utf8
    }
  }
  $Requests | Remove-Item -Force
  $ErrorActionPreference = 'Continue'
  & git -C $Repo add -- $ChangedPaths 2>&1 | Out-Null
  & git -C $Repo commit -q -m 'chore(news): dashboard request applied' 2>&1 | Out-Null
  & git -C $Repo push -q origin main 2>&1 | Out-Null
  $ErrorActionPreference = 'Stop'
  if (-not $RunSweep) { exit 0 }
  $Mode = 'sweep'
  $Force = $true
}

"$(Get-Date -Format s) start news $Mode" | Out-File $RunLog -Append -Encoding utf8

if ($Mode -eq 'publish') {
  $Args = @('editorial/scripts/news-publish.mjs')
  if ($Force) { $Args += '--force' }
  $ErrorActionPreference = 'Continue'
  & cmd.exe /d /c "node $($Args -join ' ') >> `"$RunLog`" 2>&1"
  $Code = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
  "$(Get-Date -Format s) end news publish exit $Code" | Out-File $RunLog -Append -Encoding utf8
  exit $Code
}

# 1. The sweep, no model. A paused or gated sweep writes no triage file and
#    the run ends here.
$SweepArgs = 'editorial/scripts/sweep.mjs'
if ($Force) { $SweepArgs += ' --force' }
$ErrorActionPreference = 'Continue'
& cmd.exe /d /c "node $SweepArgs >> `"$RunLog`" 2>&1"
$SweepCode = $LASTEXITCODE
$ErrorActionPreference = 'Stop'
if ($SweepCode -ne 0) {
  "$(Get-Date -Format s) sweep failed with exit $SweepCode, no drafting run" | Out-File $RunLog -Append -Encoding utf8
  exit $SweepCode
}
$Triage = Join-Path $Repo "editorial\news\triage\$Stamp.md"
if (-not (Test-Path $Triage)) {
  "$(Get-Date -Format s) no triage file for today (paused or gated), nothing to draft" | Out-File $RunLog -Append -Encoding utf8
  exit 0
}

# 2. The shared runner uses Fable, Opus, GPT-6 Astra, then GPT-5.6 Sol.
$Model = 'fable'
$Prompt = @"
Draft the news items that are due from today's sweep.

Read editorial/news/CLAUDE.md first and follow it exactly; it points at
editorial/CLAUDE.md and editorial/sources/source-tiers.md, which also apply.
The triage file is editorial/news/triage/$Stamp.md (the same data is in
$Stamp.json). Apply the three tests to every candidate marked NEW, then the
verification chain for its fact type. Write at most the budget in
editorial/news/settings.json into editorial/news/drafts, each as a complete
file in the news frontmatter shape with status: ready, each with a lead
image generated through /generate-image-openai at high quality under the
site's candid photograph rules, encoded into public/images/news with npm run
img and audited. Run /content-quality-us on each draft under the British
English override. Mark every candidate you decided against in
editorial/news/seen.json with status skipped and a reason a person can read.
Append what you did to editorial/logs/$Stamp.md. Do not send a draft-review
email: the runner publishes ready drafts next.
Do not publish, do not build, do not commit. This run is unattended: never ask
a question, decide from the rules and write the decision in the run log. A day
with nothing worth drafting is a normal day: say so in the log, mark the
candidates skipped, still send the email.
"@
if ($Extra) { $Prompt += "`n`nADDITIONAL INSTRUCTIONS FROM THE OPERATOR: $Extra" }
if ($Force) { $Prompt += "`n`nMANUAL TEST RUN: the sweep gate was ignored. Say so in the run log." }

$PromptFile = Join-Path $RunLogDir "$Stamp-news-sweep.prompt.txt"
[System.IO.File]::WriteAllText($PromptFile, $Prompt, (New-Object System.Text.UTF8Encoding($false)))
$AgentRunner = 'C:\Users\cyril\Project\automation\scripts\Invoke-ProjectAgent.ps1'
$Code = & $AgentRunner -Repo $Repo -PromptFile $PromptFile -RunLog $RunLog -RunName 'VisitMoganshan news sweep'
if ($Code -eq 0) {
  "$(Get-Date -Format s) publishing ready news drafts" | Out-File $RunLog -Append -Encoding utf8
  $ErrorActionPreference = 'Continue'
  & cmd.exe /d /c "node editorial/scripts/news-publish.mjs --force >> `"$RunLog`" 2>&1"
  $Code = $LASTEXITCODE
  $ErrorActionPreference = 'Stop'
}

"$(Get-Date -Format s) end news sweep exit $Code" | Out-File $RunLog -Append -Encoding utf8
exit $Code
