param(
  [switch]$NoPause
)

$ErrorActionPreference = 'Stop'
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$project = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$ready = Join-Path $project 'github-upload-ready'
$repo = 'C:\Users\Tommy\Documents\GitHub\xpresshub'
$git = 'C:\Program Files\Git\cmd\git.exe'
$gh = 'C:\Program Files\GitHub CLI\gh.exe'
$log = Join-Path $project 'opdater-alt-log.txt'
$message = 'Release XpressIntra update'

function Write-Log($text = '') {
  $text | Tee-Object -FilePath $log -Append
}

function Stop-Release($text) {
  Write-Log ''
  Write-Log '============================================================'
  Write-Log 'FEJL - Opdater alt blev ikke faerdig'
  Write-Log '============================================================'
  Write-Log $text
  Write-Log "Log: $log"
  if (!$NoPause) { Read-Host 'Tryk Enter for at lukke' | Out-Null }
  exit 1
}

trap {
  Stop-Release "Uventet fejl: $($_.Exception.Message)"
}

function Test-Admin {
  $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
  $principal = [Security.Principal.WindowsPrincipal]::new($identity)
  return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function ConvertTo-CmdArgument($value) {
  $text = [string]$value
  if ($text -notmatch '[\s"&<>|^]') { return $text }
  return '"' + ($text -replace '"', '\"') + '"'
}

function ConvertTo-CmdLine($filePath, [string[]]$arguments = @()) {
  @((ConvertTo-CmdArgument $filePath)) + ($arguments | ForEach-Object { ConvertTo-CmdArgument $_ }) -join ' '
}

function Invoke-NativeToLog($filePath, [string[]]$arguments = @(), $workingDirectory = $project, $allowedExitCodes = @(0)) {
  Push-Location -LiteralPath $workingDirectory
  try {
    $command = ConvertTo-CmdLine $filePath $arguments
    & cmd.exe /D /C "$command >> `"$log`" 2>&1"
    $code = $LASTEXITCODE
    if ($allowedExitCodes -notcontains $code) {
      Stop-Release "$filePath fejlede med kode $code"
    }
  } finally {
    Pop-Location
  }
}

function Invoke-LoggedCommand($label, $workingDirectory, $filePath, [string[]]$arguments = @(), $allowedExitCodes = @(0)) {
  Write-Log ''
  Write-Log $label
  Invoke-NativeToLog $filePath $arguments $workingDirectory $allowedExitCodes
}

function Invoke-Git($arguments, $failureMessage) {
  Invoke-NativeToLog $git (@('-C', $repo) + $arguments) $project @(0)
}

function Invoke-Robocopy($source, $destination, [string[]]$extraArgs = @()) {
  if (!(Test-Path -LiteralPath $source)) {
    Write-Log "Springer over: $source"
    return
  }
  if (!(Test-Path -LiteralPath $destination)) {
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
  }
  & robocopy $source $destination /E /R:1 /W:1 /XJ /NP @extraArgs *>> $log
  $code = $LASTEXITCODE
  if ($code -ge 8) {
    Stop-Release "Kopiering fejlede fra $source til $destination med kode $code"
  }
}

function Copy-Folder($name) {
  Write-Log "Klargor mappe: $name"
  $source = Join-Path $project $name
  $destination = Join-Path $ready $name
  Invoke-Robocopy $source $destination @('/XD', (Join-Path $project 'qa\.edge-qa-profile'), (Join-Path $project 'qa\screenshots'))
}

function Copy-RootFile($name) {
  $source = Join-Path $project $name
  if (Test-Path -LiteralPath $source) {
    Copy-Item -LiteralPath $source -Destination (Join-Path $ready $name) -Force
    Write-Log "Kopieret fil: $name"
  }
}

if (!(Test-Admin)) {
  Write-Host 'Starter igen med administrator-rettigheder...'
  Start-Process powershell.exe -Verb RunAs -ArgumentList @(
    '-NoExit',
    '-NoProfile',
    '-ExecutionPolicy', 'Bypass',
    '-File', "`"$PSCommandPath`""
  )
  exit
}

"XpressIntra OPDATER ALT" | Set-Content -Path $log -Encoding UTF8
Write-Log "Start: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Log "Project: $project"
Write-Log "Ready: $ready"
Write-Log "Repo: $repo"
Write-Log ''

if (!(Test-Path -LiteralPath (Join-Path $project 'package.json'))) { Stop-Release 'Projektmappen ser forkert ud.' }
if (!(Test-Path -LiteralPath (Join-Path $repo '.git'))) { Stop-Release "GitHub-repoet blev ikke fundet: $repo" }
if (!(Test-Path -LiteralPath $git)) { Stop-Release "Git blev ikke fundet: $git" }
if (!(Test-Path -LiteralPath $gh)) { Stop-Release "GitHub CLI blev ikke fundet: $gh" }

Invoke-NativeToLog $git @('config', '--global', '--add', 'safe.directory', ($repo -replace '\\', '/')) $project @(0)

Invoke-LoggedCommand '[1/7] Tjekker Supabase og faelles login-config...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'tools\supabase-release-check.ps1'))
Invoke-LoggedCommand '[2/7] Tjekker GitHub login...' $project $gh @('auth', 'status')
Invoke-LoggedCommand '[3/7] Bygger og synkroniserer Android-filer...' $project 'npm.cmd' @('run', 'android:sync')

Write-Log ''
Write-Log '[4/7] Klargor GitHub-pakke...'
if (!(Test-Path -LiteralPath $ready)) { New-Item -ItemType Directory -Path $ready -Force | Out-Null }
foreach ($folder in @('assets', 'docs', 'public', 'qa', 'src', 'supabase', 'tools')) {
  Copy-Folder $folder
}

Write-Log 'Kopierer Android til pakken...'
Invoke-Robocopy (Join-Path $project 'android') (Join-Path $ready 'android') @(
  '/XD',
  (Join-Path $project 'android\.gradle'),
  (Join-Path $project 'android\build'),
  (Join-Path $project 'android\app\build'),
  (Join-Path $project 'android\capacitor-cordova-android-plugins\build')
)

foreach ($file in @(
  '.gitignore',
  'Build Android APK.cmd',
  'Build Android APK.ps1',
  'Build Android Release AAB.cmd',
  'Build Android Release AAB.ps1',
  'capacitor.config.json',
  'index.html',
  'manifest.webmanifest',
  'netlify.toml',
  'package-lock.json',
  'package.json',
  'README.md',
  'service-worker.js',
  'Start Ren Web Preview.bat',
  'Udgiv APK til GitHub.cmd',
  'Udgiv APK til GitHub.ps1',
  'KLIK HER - OPDATER ALT.cmd',
  'START HER - OVERBLIK.txt',
  'vercel.json'
)) {
  Copy-RootFile $file
}

Write-Log ''
Write-Log '[5/7] Kopierer pakken til GitHub-repo...'
& attrib -R (Join-Path $repo '*') /S /D *>> $log
& icacls $repo /grant "$env:USERNAME`:(OI)(CI)F" /T /C *>> $log
Invoke-Robocopy $ready $repo

Write-Log ''
Write-Log '[6/7] Committer og pusher til GitHub...'
$statusFile = Join-Path $env:TEMP 'xpressintra-status.txt'
$statusCommand = ConvertTo-CmdLine $git @('-C', $repo, 'status', '--short')
& cmd.exe /D /C "$statusCommand > `"$statusFile`" 2>&1"
$statusCode = $LASTEXITCODE
Get-Content -LiteralPath $statusFile -ErrorAction SilentlyContinue | Out-File -FilePath $log -Append
if ($statusCode -ne 0) { Stop-Release 'Kunne ikke laese Git status. Se Git-fejlen lige ovenfor i loggen.' }
$status = Get-Content -LiteralPath $statusFile -ErrorAction SilentlyContinue
if ([string]::IsNullOrWhiteSpace(($status -join "`n"))) {
  Write-Log 'Ingen nye GitHub-aendringer at committe.'
} else {
  Invoke-Git -arguments @('add', '-A') -failureMessage 'Git add fejlede'
  Invoke-Git -arguments @('commit', '-m', $message) -failureMessage 'Git commit fejlede'
  Invoke-Git -arguments @('push', 'origin', 'main') -failureMessage 'Git push fejlede'
}

Invoke-LoggedCommand '[7/7] Bygger APK og opretter/overskriver release...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'Udgiv APK til GitHub.ps1'))

Write-Log ''
Write-Log '============================================================'
Write-Log 'FAERDIG - Alt er opdateret og sendt ud'
Write-Log '============================================================'
Write-Log 'Release: https://github.com/stralner2711-a11y/xpresshub/releases/latest'
Write-Log 'Download: https://stralner2711-a11y.github.io/xpresshub/download.html'
Write-Log "Log: $log"

if (!$NoPause) { Read-Host 'Tryk Enter for at lukke' | Out-Null }
