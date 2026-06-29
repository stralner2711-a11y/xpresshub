param(
  [switch]$NoPause,
  [switch]$AllowNoAdmin
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

function Invoke-AllQa {
  Write-Log ''
  Write-Log '[3/10] Korer hele kvalitetstjekket...'
  $qaFiles = Get-ChildItem -LiteralPath (Join-Path $project 'qa') -Filter '*.cjs' | Sort-Object Name
  foreach ($qaFile in $qaFiles) {
    Write-Log "QA: $($qaFile.Name)"
    Invoke-NativeToLog 'node.exe' @($qaFile.FullName) $project @(0)
  }
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

if (!(Test-Admin) -and !$AllowNoAdmin) {
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

if ($AllowNoAdmin) {
  Write-Log 'Springer global Git safe.directory over i no-admin Codex-korsel.'
} else {
  Invoke-NativeToLog $git @('config', '--global', '--add', 'safe.directory', ($repo -replace '\\', '/')) $project @(0)
}

Invoke-LoggedCommand '[1/10] Tjekker Supabase og faelles login-config...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'tools\supabase-release-check.ps1'))
Invoke-LoggedCommand '[2/10] Tjekker login- og privatlivssikkerhed...' $project 'node.exe' @('qa/credential-privacy-smoke-test.cjs')
Invoke-AllQa
Invoke-LoggedCommand '[4/10] Tjekker GitHub login...' $project $gh @('auth', 'status')

Write-Log ''
Write-Log 'Rydder gamle byggede web-assets, saa gamle loginfiler ikke kommer med i pakken...'
foreach ($cleanPath in @(
  (Join-Path $project 'dist'),
  (Join-Path $project 'android\app\src\main\assets\public'),
  (Join-Path $project 'ios\App\App\public')
)) {
  $resolvedClean = $null
  if (Test-Path -LiteralPath $cleanPath) {
    $resolvedClean = (Resolve-Path -LiteralPath $cleanPath).Path
    if (!$resolvedClean.StartsWith($project, [StringComparison]::OrdinalIgnoreCase)) {
      Stop-Release "Sikkerhedsstop: vil ikke rydde udenfor projektmappen: $resolvedClean"
    }
    Remove-Item -LiteralPath $resolvedClean -Recurse -Force
    Write-Log "Ryddet: $resolvedClean"
  }
}

Invoke-LoggedCommand '[5/10] Bygger og synkroniserer Android- og iOS-filer...' $project 'npm.cmd' @('run', 'native:sync')

Write-Log ''
Write-Log 'Synkroniserer version.json til alle steder appen og GitHub Pages kan laese den...'
$canonicalVersionFile = Join-Path $project 'public\version.json'
foreach ($versionTarget in @(
  (Join-Path $project 'version.json'),
  (Join-Path $project 'docs\version.json'),
  (Join-Path $project 'dist\version.json')
)) {
  $versionTargetDir = Split-Path -Parent $versionTarget
  if (!(Test-Path -LiteralPath $versionTargetDir)) {
    New-Item -ItemType Directory -Path $versionTargetDir -Force | Out-Null
  }
  Copy-Item -LiteralPath $canonicalVersionFile -Destination $versionTarget -Force
  Write-Log "Version synkroniseret: $versionTarget"
}

Invoke-LoggedCommand '[6/11] Bygger APK og opretter/overskriver release...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'Udgiv APK til GitHub.ps1'))
Invoke-LoggedCommand '[7/11] Verificerer lokal APK matcher ny version...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'tools\github-release-check.ps1'), '-LocalOnly')

Write-Log ''
Write-Log '[8/11] Klargor GitHub-pakke...'
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

Write-Log 'Kopierer iOS til pakken...'
Invoke-Robocopy (Join-Path $project 'ios') (Join-Path $ready 'ios') @(
  '/XD',
  (Join-Path $project 'ios\App\Pods'),
  (Join-Path $project 'ios\App\build'),
  (Join-Path $project 'ios\App\DerivedData')
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
  'KLIK HER - TJEK GITHUB OG RELEASE.cmd',
  'KLIK HER - OPDATER ALT.cmd',
  'START HER - OVERBLIK.txt',
  'vercel.json'
)) {
  Copy-RootFile $file
}
Copy-RootFile 'version.json'

Write-Log ''
Write-Log '[9/11] Kopierer pakken til GitHub-repo...'
& attrib -R (Join-Path $repo '*') /S /D *>> $log
& icacls $repo /grant "$env:USERNAME`:(OI)(CI)F" /T /C *>> $log
Invoke-Robocopy $ready $repo

Write-Log ''
Write-Log '[10/11] Committer og pusher til GitHub...'
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

Invoke-LoggedCommand '[11/11] Verificerer GitHub release, version.json og APK-link...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'tools\github-release-check.ps1'))

Write-Log ''
Write-Log '============================================================'
Write-Log 'FAERDIG - Alt er opdateret og sendt ud'
Write-Log '============================================================'
Write-Log 'Release: https://github.com/stralner2711-a11y/xpresshub/releases/latest'
Write-Log 'Download: https://stralner2711-a11y.github.io/xpresshub/download.html'
Write-Log "Log: $log"

if (!$NoPause) { Read-Host 'Tryk Enter for at lukke' | Out-Null }
