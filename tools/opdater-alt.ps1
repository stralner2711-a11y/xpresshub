param(
  [switch]$NoPause,
  [switch]$AllowNoAdmin
)

$ErrorActionPreference = 'Stop'
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$project = (Resolve-Path -LiteralPath $PSScriptRoot).Path
$ready = Join-Path $project 'github-upload-ready'
$repo = 'C:\Users\Tommy\Documents\GitHub\xpresshub'
$git = 'C:\Program Files\Git\cmd\git.exe'
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
  Write-Log '[4/12] Korer hele kvalitetstjekket...'
  $qaFiles = Get-ChildItem -LiteralPath (Join-Path $project 'qa') -Filter '*.cjs' | Sort-Object Name
  $previousNodeOptions = $env:NODE_OPTIONS
  $redirect = (Join-Path $project 'qa-app-source-redirect.cjs').Replace('\', '/')
  $env:NODE_OPTIONS = (@($previousNodeOptions, "--require=`"$redirect`"") | Where-Object { $_ }) -join ' '
  try {
    foreach ($qaFile in $qaFiles) {
      Write-Log "QA: $($qaFile.Name)"
      Invoke-NativeToLog 'node.exe' @($qaFile.FullName) $project @(0)
    }
  } finally {
    $env:NODE_OPTIONS = $previousNodeOptions
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

if ($AllowNoAdmin) {
  Write-Log 'Springer global Git safe.directory over i no-admin Codex-korsel.'
} else {
  Invoke-NativeToLog $git @('config', '--global', '--add', 'safe.directory', ($repo -replace '\\', '/')) $project @(0)
}

Invoke-LoggedCommand '[1/12] Tjekker Supabase og faelles login-config...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'supabase-release-check.ps1'))
Invoke-LoggedCommand '[2/12] Tjekker login- og privatlivssikkerhed...' $project 'node.exe' @('qa/credential-privacy-smoke-test.cjs')
Invoke-LoggedCommand '[3/12] Synkroniserer versionsdata til Android, iPhone og web...' $project 'npm.cmd' @('run', 'native:sync')
Invoke-AllQa
Invoke-LoggedCommand '[5/12] Henter seneste GitHub-version...' $repo $git @('fetch', 'origin', 'main')
Invoke-LoggedCommand 'Synkroniserer lokal main uden at overskrive historik...' $repo $git @('pull', '--ff-only', 'origin', 'main')
Invoke-LoggedCommand 'Tjekker at GitHub push-adgangen virker...' $repo $git @('push', '--dry-run', 'origin', 'main')

Write-Log ''
Write-Log 'Rydder gamle byggede web-assets, saa gamle loginfiler ikke kommer med i pakken...'
foreach ($cleanPath in @(
  (Join-Path $project 'web-build'),
  (Join-Path $project 'android-active\app\src\main\assets\public'),
  (Join-Path $project 'ios-active\App\App\public')
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

Invoke-LoggedCommand '[6/12] Genopbygger og synkroniserer rene native-filer...' $project 'npm.cmd' @('run', 'native:sync')

Write-Log ''
Write-Log 'Synkroniserer version.json til alle steder appen og GitHub Pages kan laese den...'
$canonicalVersionFile = Join-Path $project 'public\version.json'
foreach ($versionTarget in @(
  (Join-Path $project 'version.json'),
  (Join-Path $project 'docs\version.json'),
  (Join-Path $project 'web-build\version.json')
)) {
  $versionTargetDir = Split-Path -Parent $versionTarget
  if (!(Test-Path -LiteralPath $versionTargetDir)) {
    New-Item -ItemType Directory -Path $versionTargetDir -Force | Out-Null
  }
  Copy-Item -LiteralPath $canonicalVersionFile -Destination $versionTarget -Force
  Write-Log "Version synkroniseret: $versionTarget"
}

Invoke-LoggedCommand '[7/12] Bygger lokal kontrol-APK...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'Build Android APK.ps1'))
$localApkSource = Join-Path $project "$((Get-Content -LiteralPath (Join-Path $project 'capacitor.config.json') -Raw | ConvertFrom-Json).android.path)\app\build\outputs\apk\debug\app-debug.apk"
$localApkTarget = Join-Path $project 'release-klargjort\xpressintra.apk'
if (!(Test-Path -LiteralPath $localApkSource)) { Stop-Release "Den byggede APK mangler: $localApkSource" }
New-Item -ItemType Directory -Path (Split-Path -Parent $localApkTarget) -Force | Out-Null
Copy-Item -LiteralPath $localApkSource -Destination $localApkTarget -Force
Invoke-LoggedCommand '[8/12] Verificerer lokal APK matcher ny version...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'tools\github-release-check.ps1'), '-LocalOnly')

Write-Log ''
Write-Log '[9/12] Klargor GitHub-pakke...'
if (!(Test-Path -LiteralPath $ready)) { New-Item -ItemType Directory -Path $ready -Force | Out-Null }
foreach ($folder in @('.github', 'assets', 'docs', 'public', 'qa', 'src', 'supabase', 'tools')) {
  Copy-Folder $folder
}
$legacyReadyApp = Join-Path $ready 'src\app.js'
if (Test-Path -LiteralPath $legacyReadyApp) {
  Remove-Item -LiteralPath $legacyReadyApp -Force
  Write-Log 'Fjernet laast legacy-kopi: src/app.js'
}

Write-Log 'Kopierer Android til pakken...'
Invoke-Robocopy (Join-Path $project 'android-active') (Join-Path $ready 'android-active') @(
  '/XD',
  (Join-Path $project 'android-active\.gradle'),
  (Join-Path $project 'android-active\build'),
  (Join-Path $project 'android-active\app\build'),
  (Join-Path $project 'android-active\offline-maven'),
  (Join-Path $project 'android-active\capacitor-cordova-android-plugins\build')
)

Write-Log 'Kopierer iOS til pakken...'
Invoke-Robocopy (Join-Path $project 'ios-active') (Join-Path $ready 'ios-active') @(
  '/XD',
  (Join-Path $project 'ios-active\App\Pods'),
  (Join-Path $project 'ios-active\App\build'),
  (Join-Path $project 'ios-active\App\DerivedData')
)

foreach ($file in @(
  '.gitignore',
  'Build Android APK.cmd',
  'Build Android APK.ps1',
  'Build Android Release AAB.cmd',
  'Build Android Release AAB.ps1',
  'capacitor.config.json',
  'app.js',
  'diagnostics.js',
  'index.html',
  'ios-readiness-check.cjs',
  'manifest.webmanifest',
  'offline-queue.js',
  'opdater-alt.ps1',
  'package-lock.json',
  'package.json',
  'qa-app-source-redirect.cjs',
  'README.md',
  'run-qa.cjs',
  'service-worker.js',
  'Start Ren Web Preview.bat',
  'Udgiv APK til GitHub.cmd',
  'Udgiv APK til GitHub.ps1',
  'KLIK HER - TJEK GITHUB OG RELEASE.cmd',
  'KLIK HER - OPDATER ALT.cmd',
  'START HER - OVERBLIK.txt',
  'supabase-release-check.ps1',
  'vercel.json',
  'vite.active.config.js'
)) {
  Copy-RootFile $file
}
Copy-RootFile 'version.json'

Write-Log ''
Write-Log '[10/12] Kopierer pakken til GitHub-repo...'
& attrib -R (Join-Path $repo '*') /S /D *>> $log
& icacls $repo /grant "$env:USERNAME`:(OI)(CI)F" /T /C *>> $log
Invoke-Robocopy $ready $repo

Write-Log ''
Write-Log '[11/12] Committer og pusher til GitHub...'
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

Invoke-LoggedCommand '[12/12] Venter paa GitHub Actions og verificerer release...' $project 'powershell.exe' @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', (Join-Path $project 'tools\github-release-check.ps1'), '-WaitForReleaseSeconds', '1800')

Write-Log ''
Write-Log '============================================================'
Write-Log 'FAERDIG - Alt er opdateret og sendt ud'
Write-Log '============================================================'
Write-Log 'Release: https://github.com/stralner2711-a11y/xpresshub/releases/latest'
Write-Log 'Download: https://stralner2711-a11y.github.io/xpresshub/download.html'
Write-Log "Log: $log"

if (!$NoPause) { Read-Host 'Tryk Enter for at lukke' | Out-Null }
