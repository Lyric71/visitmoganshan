<#
.SYNOPSIS
  Registers (or registers again) the Windows scheduled tasks that run the
  Visit Moganshan editorial pipeline on this machine.

  VisitMoganshan Editorial Draft    every day at 22:00 local (Shanghai, night)
  VisitMoganshan Editorial Publish  every day at 03:30 local
  VisitMoganshan News Sweep         every third day at 08:00 local (sweep, draft, publish)
  VisitMoganshan News Publish       every day at 12:00 local (safety script, no model)
  VisitMoganshan News Poll          disabled: picked up "Run the sweep now"
                                    requests from the dashboard

  The draft and publish pair run daily. publish_date orders the queue and
  never gates a run: each evening the draft takes the next core row whatever
  its date (plus the dispatch whose week has come), and the next morning the
  publish takes every image_ready row, so the night is the review window.
  Only a dispatch and a row whose notes say "Hold until YYYY-MM-DD" wait for
  their date. A run exits in a second, without starting Claude, only when it
  has truly nothing to do.

  Every task runs through the shared retry wrapper
  C:\Users\cyril\Project\automation\scripts\Invoke-ScheduledProjectScript.ps1,
  exactly as the live tasks do, so running this script again keeps the action.

  The hours sit outside the other four pipelines on this machine
  (ChinaWebFoundry 01:30 and 05:30, BBChien 00:00 and 05:00, TheRedScroll
  00:30 and 04:00, TheChinaPath 01:00 and 04:30); all pipelines now run at night, so
  the Claude CLI sessions can overlap between 00:00 and 05:30.

  Run from any PowerShell prompt:
    powershell -ExecutionPolicy Bypass -File editorial\scripts\register-tasks.ps1

  To pause unattended publishing:
    Disable-ScheduledTask -TaskName 'VisitMoganshan Editorial Publish'

  Change the hour by editing $DraftTime / $PublishTime and rerunning; change
  the news cadence with $NewsSweepIntervalDays.
#>
param(
  [string]$DraftTime = '22:00',
  [string]$PublishTime = '03:30',
  # The news layer (editorial/news). The sweep starts Claude and needs its own
  # hour clear of the other pipelines; the news publish is a script with no
  # model and only needs the build and the push to itself.
  #
  # The sweep runs once every three days rather than daily. Moganshan county
  # produces a few items of visitor consequence a week, not a few a day, and a
  # daily crawl mostly re-reads listing pages it has already seen. A rolling
  # three day interval, rather than fixed weekdays, is what Cyril asked for:
  # the gap between one dispatch and the next is the same every time.
  [string]$NewsSweepTime = '08:00',
  [int]$NewsSweepIntervalDays = 3,
  [string]$NewsPublishTime = '12:00'
)

$ErrorActionPreference = 'Stop'
$Runner = Join-Path $PSScriptRoot 'run-daily.ps1'
$NewsRunner = Join-Path $PSScriptRoot 'run-news.ps1'
$Pwsh = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
$Wrapper = 'C:\Users\cyril\Project\automation\scripts\Invoke-ScheduledProjectScript.ps1'

function Register([string]$Name, [string]$Mode, $Trigger, [bool]$Enabled, [string]$Script = $Runner) {
  $Action = New-ScheduledTaskAction -Execute $Pwsh `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Wrapper`" -Runner `"$Script`" -Mode $Mode"
  $Settings = New-ScheduledTaskSettingsSet `
    -ExecutionTimeLimit (New-TimeSpan -Hours 6) `
    -StartWhenAvailable `
    -WakeToRun `
    -MultipleInstances IgnoreNew
  Register-ScheduledTask -TaskName $Name -Action $Action -Trigger $Trigger `
    -Settings $Settings -Description "Visit Moganshan editorial pipeline ($Mode)" -Force | Out-Null
  if (-not $Enabled) { Disable-ScheduledTask -TaskName $Name | Out-Null }
  Write-Host "$Name registered ($(if ($Enabled) {'enabled'} else {'disabled'}))"
}

$DraftTrigger = New-ScheduledTaskTrigger -Daily -At $DraftTime
Register 'VisitMoganshan Editorial Draft' 'draft' $DraftTrigger $true

$PublishTrigger = New-ScheduledTaskTrigger -Daily -At $PublishTime
Register 'VisitMoganshan Editorial Publish' 'publish' $PublishTrigger $true

$NewsSweepTrigger = New-ScheduledTaskTrigger -Daily -DaysInterval $NewsSweepIntervalDays -At $NewsSweepTime
Register 'VisitMoganshan News Sweep' 'sweep' $NewsSweepTrigger $true $NewsRunner

$NewsPublishTrigger = New-ScheduledTaskTrigger -Daily -At $NewsPublishTime
Register 'VisitMoganshan News Publish' 'publish' $NewsPublishTrigger $true $NewsRunner

# The poll: the handler for the /admin/news buttons, not a news schedule. It
# ran every 30 minutes so a button press on the live site would be picked up
# within the half hour, and it is off from 13 September 2026 on Cyril's
# instruction: with the sweep down to once every three days, a task waking up
# 28 times a day to find nothing is the one repeating trigger on this machine,
# and every other task here runs once and is retried only when it fails.
#
# It keeps a plain daily trigger so the definition stays honest if it is ever
# enabled again, and no repetition. Registered disabled: re-running this
# script will not quietly turn it back on.
#
# What this costs: pressed on this machine, the button still starts the sweep
# directly through the API route, so nothing changes there. Pressed on the
# live site, it commits a request file to editorial/news/requests on main and
# nothing now picks that file up. Run the sweep by hand instead:
#   npm run news:sweep -- --force
$PollTrigger = New-ScheduledTaskTrigger -Daily -At '08:00'
Register 'VisitMoganshan News Poll' 'poll' $PollTrigger $false $NewsRunner

Get-ScheduledTask -TaskName 'VisitMoganshan *' | Format-Table TaskName, State -AutoSize
