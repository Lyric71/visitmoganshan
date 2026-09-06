<#
.SYNOPSIS
  Registers (or registers again) the two Windows scheduled tasks that run the
  Visit Moganshan editorial pipeline on this machine.

  VisitMoganshan Editorial Draft    every day at 19:30 local (Shanghai)
  VisitMoganshan Editorial Publish  every day at 06:00 local

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
  [string]$PublishTime = '06:00'
)

$ErrorActionPreference = 'Stop'
$Runner = Join-Path $PSScriptRoot 'run-daily.ps1'
$Pwsh = "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"

function Register([string]$Name, [string]$Mode, $Trigger, [bool]$Enabled) {
  $Action = New-ScheduledTaskAction -Execute $Pwsh `
    -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$Runner`" -Mode $Mode"
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

Get-ScheduledTask -TaskName 'VisitMoganshan Editorial *' | Format-Table TaskName, State -AutoSize
