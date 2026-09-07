<#
.SYNOPSIS
  Registers (or registers again) the two Windows scheduled tasks that run the
  Visit Moganshan editorial pipeline on this machine.

  VisitMoganshan Editorial Draft    every day at 19:30 local (Shanghai)
  VisitMoganshan Editorial Publish  every day at 06:00 local
  VisitMoganshan News Sweep         every day at 08:00 local (sweep, then Claude drafts)
  VisitMoganshan News Publish       every day at 12:00 local (script, no model)
  VisitMoganshan News Poll          every 15 minutes: picks up "Run the sweep now" requests from the dashboard

  Both run daily and both read schedule.csv before starting Claude, so an
  evening with no slot due exits in a second. The draft runs the evening
  before a piece's publish date; the publish runs the next morning, so the
  night is the review window and the piece is live on its calendar date.

  The hours sit outside the other four pipelines on this machine
  (ChinaWebFoundry 07:00 and 10:00, BBChien 09:00 and 13:00, TheRedScroll
  11:00 and 13:00, TheChinaPath 15:00 and 17:30) so no two pipelines run the
  Claude CLI at the same time.

  Run from any PowerShell prompt:
    powershell -ExecutionPolicy Bypass -File editorial\scripts\register-tasks.ps1

  To pause unattended publishing:
    Disable-ScheduledTask -TaskName 'VisitMoganshan Editorial Publish'

  Change the hour by editing $DraftTime / $PublishTime and rerunning.
#>
param(
  [string]$DraftTime = '19:30',
  [string]$PublishTime = '06:00',
  # The news layer (editorial/news). The sweep starts Claude and needs its own
  # hour clear of the other pipelines; the news publish is a script with no
  # model and only needs the build and the push to itself.
  [string]$NewsSweepTime = '08:00',
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

$NewsSweepTrigger = New-ScheduledTaskTrigger -Daily -At $NewsSweepTime
Register 'VisitMoganshan News Sweep' 'sweep' $NewsSweepTrigger $true $NewsRunner

$NewsPublishTrigger = New-ScheduledTaskTrigger -Daily -At $NewsPublishTime
Register 'VisitMoganshan News Publish' 'publish' $NewsPublishTrigger $true $NewsRunner

# The poll: a repetition trigger, every fifteen minutes, indefinitely. It runs
# git pull and exits when nothing was requested, so it is cheap; when the
# dashboard has asked for a sweep it turns into the sweep run.
$PollTrigger = New-ScheduledTaskTrigger -Once -At (Get-Date).Date -RepetitionInterval (New-TimeSpan -Minutes 15)
Register 'VisitMoganshan News Poll' 'poll' $PollTrigger $true $NewsRunner

Get-ScheduledTask -TaskName 'VisitMoganshan *' | Format-Table TaskName, State -AutoSize
