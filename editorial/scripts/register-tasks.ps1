<#
.SYNOPSIS
  Registers (or registers again) the two Windows scheduled tasks that run the
  Visit Moganshan editorial pipeline on this machine.

  VisitMoganshan Editorial Draft    every day at 22:00 local (Shanghai, night)
  VisitMoganshan Editorial Publish  every day at 03:30 local
  VisitMoganshan News Sweep         Tuesday and Friday at 08:00 local (sweep, draft, publish)
  VisitMoganshan News Publish       every day at 12:00 local (safety script, no model)
  VisitMoganshan News Poll          every 30 minutes between 08:00 and 22:00: picks up
                                    "Run the sweep now" requests from the dashboard

  The draft and publish pair run daily and both read schedule.csv before
  starting Claude, so an evening with no slot due exits in a second. The draft runs the evening
  before a piece's publish date; the publish runs the next morning, so the
  night is the review window and the piece is live on its calendar date.

  The hours sit outside the other four pipelines on this machine
  (ChinaWebFoundry 01:30 and 05:30, BBChien 00:00 and 05:00, TheRedScroll
  00:30 and 04:00, TheChinaPath 01:00 and 04:30); all pipelines now run at night, so
  the Claude CLI sessions can overlap between 00:00 and 05:30.

  Run from any PowerShell prompt:
    powershell -ExecutionPolicy Bypass -File editorial\scripts\register-tasks.ps1

  To pause unattended publishing:
    Disable-ScheduledTask -TaskName 'VisitMoganshan Editorial Publish'

  Change the hour by editing $DraftTime / $PublishTime and rerunning; change
  the news cadence with $NewsSweepDays.
#>
param(
  [string]$DraftTime = '22:00',
  [string]$PublishTime = '03:30',
  # The news layer (editorial/news). The sweep starts Claude and needs its own
  # hour clear of the other pipelines; the news publish is a script with no
  # model and only needs the build and the push to itself.
  #
  # The sweep runs twice a week rather than daily. Moganshan county produces a
  # few items of visitor consequence a week, not a few a day, and a daily
  # crawl mostly re-reads listing pages it has already seen. Tuesday and
  # Friday put a dispatch in front of the reader early in the week and again
  # before the weekend, which is when the trips are decided.
  [string]$NewsSweepTime = '08:00',
  [string[]]$NewsSweepDays = @('Tuesday', 'Friday'),
  [string]$NewsPublishTime = '12:00'
)

$ErrorActionPreference = 'Stop'
$Runner = Join-Path $PSScriptRoot 'run-daily.ps1'
$NewsRunner = Join-Path $PSScriptRoot 'run-news.ps1'
$Pwsh = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"

function Register([string]$Name, [string]$Mode, $Trigger, [bool]$Enabled, [string]$Script = $Runner) {
  $Action = New-ScheduledTaskAction -Execute $Pwsh `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Script`" -Mode $Mode"
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

$NewsSweepTrigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $NewsSweepDays -At $NewsSweepTime
Register 'VisitMoganshan News Sweep' 'sweep' $NewsSweepTrigger $true $NewsRunner

$NewsPublishTrigger = New-ScheduledTaskTrigger -Daily -At $NewsPublishTime
Register 'VisitMoganshan News Publish' 'publish' $NewsPublishTrigger $true $NewsRunner

# The poll: the handler for the /admin/news buttons, not a news schedule. It
# runs git pull, finds no request file and exits, so the cost is a fetch; the
# interval is simply how long a button press waits before anything happens.
# Every half hour between 08:00 and 22:00 is the compromise: nobody presses a
# button on the dashboard at four in the morning, and ninety-six git pulls a
# day to catch the two or three that are actually made is not a trade worth
# making. A daily trigger carrying a repetition window is the only way Task
# Scheduler expresses "every N minutes, but only during these hours".
$PollTrigger = New-ScheduledTaskTrigger -Daily -At '08:00'
$PollTrigger.Repetition = (New-ScheduledTaskTrigger -Once -At (Get-Date) `
  -RepetitionInterval (New-TimeSpan -Minutes 30) `
  -RepetitionDuration (New-TimeSpan -Hours 14)).Repetition
Register 'VisitMoganshan News Poll' 'poll' $PollTrigger $true $NewsRunner

Get-ScheduledTask -TaskName 'VisitMoganshan *' | Format-Table TaskName, State -AutoSize
